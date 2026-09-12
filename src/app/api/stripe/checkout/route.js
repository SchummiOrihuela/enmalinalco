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
//  aquí solo decidimos si ofrecer el trial de 2 meses.)
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

    const subscriptionData = {
      metadata: { businessId: businessId || '', tier, founder: isFounder ? 'pending' : '' },
    };
    if (isFounder) {
      subscriptionData.trial_period_days = FOUNDERS.mesesGratis * 30;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: { businessId: businessId || '', tier, founder: isFounder ? 'pending' : '' },
      subscription_data: subscriptionData,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
