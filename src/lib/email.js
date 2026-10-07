// Envío de correos transaccionales con Resend.
// Requiere la variable de entorno RESEND_API_KEY y el dominio enmalinalco.com
// verificado en Resend (registros SPF/DKIM).
import { Resend } from "resend";
import { readFileSync } from "fs";
import path from "path";
import { PLANS, DEFAULT_PLAN, FOUNDERS } from "./plans";

// Remitente: debe pertenecer a un dominio verificado en Resend.
const FROM = "Emmanuel de enMalinalco <hola@enmalinalco.com>";
const DASHBOARD_URL = "https://enmalinalco.com/dashboard";

// Lee una plantilla de supabase/email-templates/ una sola vez por llamada.
function leerPlantilla(nombreArchivo) {
  return readFileSync(
    path.join(process.cwd(), "supabase/email-templates", nombreArchivo),
    "utf8"
  );
}

// Precio promocional del Programa Fundadores (descuento los primeros meses).
function precioPromo(plan) {
  const factor = (100 - FOUNDERS.descuento) / 100;
  const promo = Math.round(plan.price * factor);
  return `$${promo}/mes los primeros ${FOUNDERS.mesesDescuento} meses`;
}

// Envía el correo de bienvenida cuando un negocio se registra y activa su plan.
// Devuelve el resultado de Resend; lanza si falla el envío.
export async function enviarBienvenida({ email, negocio, tier }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Falta RESEND_API_KEY");
  }
  if (!email) {
    throw new Error("Falta el email del destinatario");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const plan = PLANS[tier] || PLANS[DEFAULT_PLAN];
  const nombre = negocio?.trim() || "¡hola!";

  const html = leerPlantilla("welcome-plan.html")
    .replaceAll("{{NEGOCIO}}", nombre)
    .replaceAll("{{PLAN}}", plan.name)
    .replaceAll("{{PRECIO_PROMO}}", precioPromo(plan))
    .replaceAll("{{DASHBOARD_URL}}", DASHBOARD_URL);

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `${nombre !== "¡hola!" ? nombre + ", " : ""}ya eres parte del pueblo digital 🌿`,
    html,
  });
}
