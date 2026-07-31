import Stripe from 'stripe';
import { NextResponse } from 'next/server';

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
        const { businessId, tier } = s.metadata || {};
        if (businessId) {
          await updateBusiness(businessId, { is_active: true, plan: tier });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const { businessId } = sub.metadata || {};
        if (businessId) {
          await updateBusiness(businessId, { is_active: false });
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
