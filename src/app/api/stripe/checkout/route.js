import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { FOUNDERS } from '@/lib/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  malinalli: process.env.STRIPE_PRICE_MALINALLI,
  cuauhtli: process.env.STRIPE_PRICE_CUAUHTLI,
  ocelotl: process.env.STRIPE_PRICE_OCELOTL,
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
    const { tier, businessId } = await request.json();

    const price = PRICE_MAP[tier];
    if (!price) {
      return NextResponse.json({ error: 'Tier inválido' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Elegibilidad Fundador: solo tiers elegibles y si aún hay cupo.
    const isFounder =
      FOUNDERS.tiers.includes(tier) && (await founderSpotAvailable());

    const meta = { businessId: businessId || '', tier, founder: isFounder ? 'pending' : '' };

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
