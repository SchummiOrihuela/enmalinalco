import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { FOUNDERS } from '@/lib/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  mensual: {
    malinalli: process.env.STRIPE_PRICE_MALINALLI,
    cuauhtli: process.env.STRIPE_PRICE_CUAUHTLI,
    ocelotl: process.env.STRIPE_PRICE_OCELOTL,
  },
  // Precios anuales (2 meses gratis). Crea estos precios en Stripe con
  // intervalo anual y pon sus IDs en estas variables de entorno.
  anual: {
    malinalli: process.env.STRIPE_PRICE_MALINALLI_ANUAL,
    cuauhtli: process.env.STRIPE_PRICE_CUAUHTLI_ANUAL,
    ocelotl: process.env.STRIPE_PRICE_OCELOTL_ANUAL,
  },
};

// ¿Queda cupo Fundador? Consulta el conteo real con el service role.
// (El lugar se RECLAMA de forma atómica en el webhook al confirmarse el pago;
//  aquí solo decidimos si aplicar el descuento Fundador.)
async function founderSpotAvailable() {
  if (!FOUNDERS.active) return false;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/businesses?founder=eq.true&select=id`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: 'count=exact',
        },
      }
    );
    const range = res.headers.get('content-range') || '';
    const taken = parseInt(range.split('/')[1], 10);
    if (Number.isNaN(taken)) return false;
    return taken < FOUNDERS.cupos;
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const { tier, businessId, billing: billingRaw } = await request.json();

    // Ciclo de cobro: mensual (default) o anual (2 meses gratis).
    const billing = billingRaw === 'anual' ? 'anual' : 'mensual';

    const price = PRICE_MAP[billing]?.[tier];
    if (!price) {
      // Si piden anual pero aún no existe el precio en Stripe, dilo claro en
      // vez de cobrar en silencio el ciclo equivocado.
      if (billing === 'anual') {
        return NextResponse.json(
          { error: 'La facturación anual aún no está disponible. Elige el cobro mensual.' },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: 'Tier inválido' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Elegibilidad Fundador: solo tiers elegibles, con cupo y SOLO en mensual.
    // El cupón Fundador es "30% off 3 meses", pensado para el ciclo mensual;
    // en el plan anual el beneficio ya son los 2 meses gratis.
    const isFounder =
      billing === 'mensual' &&
      FOUNDERS.tiers.includes(tier) &&
      (await founderSpotAvailable());

    const meta = {
      businessId: businessId || '',
      tier,
      billing,
      founder: isFounder ? 'pending' : '',
    };

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: meta,
      subscription_data: { metadata: meta },
    };

    // Fundador: 30% de descuento los primeros 3 meses vía cupón de Stripe.
    // El cupón (percent_off:30, duration:repeating, duration_in_months:3) se
    // crea una vez en Stripe y su id va en STRIPE_FOUNDER_COUPON.
    if (isFounder && process.env.STRIPE_FOUNDER_COUPON) {
      sessionParams.discounts = [{ coupon: process.env.STRIPE_FOUNDER_COUPON }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
