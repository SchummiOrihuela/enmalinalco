import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { sendOwnerEmail, nuevoClienteEmail, clienteEnGraciaEmail } from '@/lib/notify';

// Días que un negocio sigue visible tras cancelar/vencer su suscripción.
const GRACE_DAYS = 7;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function updateBusiness(businessId, fields) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?id=eq.${businessId}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(fields),
    }
  );
  if (!res.ok) throw new Error(`Supabase PATCH failed: ${res.status}`);
}

// Lee el nombre del negocio (para los avisos por correo). No crítico:
// si falla, devolvemos un marcador y el flujo continúa.
async function getBusinessName(businessId) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?id=eq.${businessId}&select=name`,
      {
        headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` },
      }
    );
    if (!res.ok) return `negocio ${businessId}`;
    const rows = await res.json();
    return rows?.[0]?.name || `negocio ${businessId}`;
  } catch {
    return `negocio ${businessId}`;
  }
}

// Reclama un lugar Fundador de forma atómica (corte duro en 15 lo hace la DB).
// Devuelve el número asignado o null si ya no había cupo.
async function claimFounderSpot(businessId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/claim_founder_spot`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bid: businessId }),
  });
  if (!res.ok) throw new Error(`claim_founder_spot failed: ${res.status}`);
  return res.json(); // number | null
}

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        const { businessId, tier, founder } = s.metadata || {};
        if (businessId) {
          // Al contratar: activo, con plan y sin periodo de gracia pendiente.
          await updateBusiness(businessId, {
            is_active: true,
            plan: tier,
            grace_until: null,
          });

          if (founder === 'pending') {
            // Reclama el lugar de forma atómica (la DB corta en el cupo máximo).
            // El descuento Fundador (30% x 3 meses) lo maneja el cupón de Stripe.
            await claimFounderSpot(businessId);
          }

          // Aviso al dueño del directorio: tienes un cliente nuevo.
          const nombre = await getBusinessName(businessId);
          const { subject, html } = nuevoClienteEmail({ nombre, tier });
          await sendOwnerEmail(subject, html);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const { businessId } = sub.metadata || {};
        if (businessId) {
          // NO ocultamos de golpe. Marcamos periodo de gracia: la ficha sigue
          // visible (ver src/lib/visibility.js) hasta grace_until, y al vencer
          // se oculta sola, sin cron. is_active=false refleja que ya no paga.
          const graciaHasta = new Date(
            Date.now() + GRACE_DAYS * 24 * 60 * 60 * 1000
          ).toISOString();
          await updateBusiness(businessId, {
            is_active: false,
            grace_until: graciaHasta,
          });

          // Aviso al dueño: suscripción cancelada, cliente en gracia.
          const nombre = await getBusinessName(businessId);
          const { subject, html } = clienteEnGraciaEmail({
            nombre,
            graciaHasta,
          });
          await sendOwnerEmail(subject, html);
        }
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
