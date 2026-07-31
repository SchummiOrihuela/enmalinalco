import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  malinalli: process.env.STRIPE_PRICE_MALINALLI,
  cuauhtli: process.env.STRIPE_PRICE_CUAUHTLI,
  ocelotl: process.env.STRIPE_PRICE_OCELOTL,
};

export async function POST(request) {
  try {
    const { tier, businessId } = await request.json();

    const price = PRICE_MAP[tier];
    if (!price) {
      return NextResponse.json({ error: 'Tier inválido' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: { businessId: businessId || '', tier },
      subscription_data: {
        metadata: { businessId: businessId || '', tier },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
