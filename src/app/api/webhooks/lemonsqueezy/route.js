import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

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
      .update({ is_active: isActive })
      .eq("email", email)
      .select();

    console.log("LS update →", { email, isActive, count: data?.length, error });
  }

  return new Response("OK", { status: 200 });
}
