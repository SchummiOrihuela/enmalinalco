import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Mapeo variant ID → tier
const VARIANT_TO_TIER = {
  [process.env.LS_VARIANT_MALINALLI]: "malinalli",
  [process.env.LS_VARIANT_CUAUHTLI]: "cuauhtli",
  [process.env.LS_VARIANT_OCELOTL]: "ocelotl",
};

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  // Verificar firma
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  if (digest !== signature) {
    return new Response("Firma inválida", { status: 401 });
  }
  const event = JSON.parse(rawBody);
  const eventName = event.meta.event_name;
  const email = event.data.attributes.user_email;
  const variantId = String(event.data.attributes.variant_id);
  const tier = VARIANT_TO_TIER[variantId] || null;
  // Cliente admin (service role) para saltar RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated"
  ) {
    const status = event.data.attributes.status;
    const isActive = status === "active" || status === "on_trial";
    const { data, error } = await supabase
      .from("businesses")
      .update({ is_active: isActive, tier })
      .eq("email", email)
      .select();
    console.log("LS update →", { email, isActive, tier, count: data?.length, error });
  }
  return new Response("OK", { status: 200 });
}
