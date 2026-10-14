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

// ── Reporte mensual (beneficio Ocēlōtl) ──────────────────────────────
// Construye el HTML del reporte con los números del mes y lo envía.
// stats: { vistas, contactos:[{label,total,mes}], comparativa?:string }
function filaStat(label, total, mes) {
  const crece = mes > 0
    ? ` <span style="color:#3A6B47;font-weight:700">▲ +${mes} este mes</span>`
    : ""
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #EFE7D0;color:#4A4034;font-size:15px">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #EFE7D0;text-align:right;color:#2A2016;font-size:18px;font-weight:700">${total}${crece}</td>
  </tr>`
}

export async function enviarReporteMensual({ email, negocio, stats }) {
  if (!process.env.RESEND_API_KEY) throw new Error("Falta RESEND_API_KEY")
  if (!email) throw new Error("Falta el email del destinatario")

  const resend = new Resend(process.env.RESEND_API_KEY)
  const nombre = negocio?.trim() || "tu negocio"
  const mesNombre = new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })

  const filas = (stats.contactos || []).map((c) => filaStat(c.label, c.total, c.mes)).join("")
  const comparativa = stats.comparativa
    ? `<p style="margin:18px 0 0;padding:14px 16px;background:#F0F5F1;border:1px solid #CFE3D4;border-radius:10px;color:#2A2016;font-size:14px">📈 ${stats.comparativa}</p>`
    : ""

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#F6F0E0;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:28px 22px">
    <p style="color:#B0863A;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6px">Reporte mensual · En Malinalco</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#1C3B28;margin:0 0 4px">${nombre}</h1>
    <p style="color:#6B6052;font-size:14px;margin:0 0 20px">Tus números de ${mesNombre}</p>
    <table style="width:100%;border-collapse:collapse">
      ${filaStat("👁️ Vistas de tu ficha", stats.vistas.total, stats.vistas.mes)}
      ${filas}
    </table>
    ${comparativa}
    <p style="margin:22px 0 0;color:#4A4034;font-size:14px;line-height:1.6">
      Gracias por ser <strong>Ocēlōtl</strong>, el plan de referencia del pueblo. Entra a tu panel para ver el detalle y actualizar tus fotos, horarios y promociones.
    </p>
    <p style="margin:18px 0 0">
      <a href="${DASHBOARD_URL}" style="display:inline-block;background:linear-gradient(180deg,#E7C86A,#DCB24A);color:#25201A;font-weight:700;font-size:15px;padding:12px 24px;border-radius:9999px;text-decoration:none">Ver mi panel</a>
    </p>
    <p style="margin:26px 0 0;color:#9A8E7C;font-size:12px;line-height:1.5">En Malinalco · El directorio del Pueblo Mágico<br/>Recibes este correo por tu plan Ocēlōtl.</p>
  </div>
  </body></html>`

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `${nombre}, tus números de ${mesNombre} en En Malinalco 🐆`,
    html,
  })
}
