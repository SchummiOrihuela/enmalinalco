// Alta de suscriptor al newsletter. Lo llama el formulario público.
// Inserta con la service role (upsert por email, ignora duplicados) y envía
// un correo de bienvenida best-effort (no bloquea si Resend no está).
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validación de email sencilla y suficiente para un formulario.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const FROM = 'Emmanuel de enMalinalco <hola@enmalinalco.com>'

async function enviarBienvenida(email) {
  if (!process.env.RESEND_API_KEY) return
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#F6F0E0;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:520px;margin:0 auto;padding:30px 22px">
      <p style="color:#B0863A;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6px">En Malinalco</p>
      <h1 style="font-family:Georgia,serif;font-size:26px;color:#1C3B28;margin:0 0 10px">¡Bienvenido al pueblo! 🌿</h1>
      <p style="color:#4A4034;font-size:15px;line-height:1.6;margin:0 0 14px">
        Ya estás en la lista de <strong>El finde ideal en Malinalco</strong>. Cada mes te mandamos lo mejor del pueblo:
        qué hay abierto, próximos eventos y festivales, lugares nuevos y escapadas listas para disfrutar.
      </p>
      <p style="margin:18px 0 0">
        <a href="https://enmalinalco.com/historias" style="display:inline-block;background:linear-gradient(180deg,#E7C86A,#DCB24A);color:#25201A;font-weight:700;font-size:15px;padding:12px 24px;border-radius:9999px;text-decoration:none">Explorar historias del pueblo</a>
      </p>
      <p style="margin:26px 0 0;color:#9A8E7C;font-size:12px;line-height:1.5">En Malinalco · El directorio del Pueblo Mágico</p>
    </div></body></html>`
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: email, subject: 'Bienvenido a En Malinalco 🌿', html }),
    })
  } catch { /* best-effort: nunca bloquea el alta */ }
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch { return Response.json({ ok: false }, { status: 400 }) }

  const email = (typeof body?.email === 'string' ? body.email : '').trim().toLowerCase()
  const source = typeof body?.source === 'string' ? body.source.slice(0, 40) : null
  if (!EMAIL_RE.test(email) || email.length > 160) {
    return Response.json({ ok: false, error: 'email_invalido' }, { status: 400 })
  }
  if (!URL || !SERVICE_ROLE) {
    return Response.json({ ok: false, error: 'config' }, { status: 503 })
  }

  try {
    const res = await fetch(`${URL}/rest/v1/newsletter_subscribers?on_conflict=email`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=representation',
      },
      body: JSON.stringify({ email, source }),
    })
    if (!res.ok) {
      return Response.json({ ok: false, error: 'db' }, { status: 502 })
    }
    const rows = await res.json().catch(() => [])
    const nuevo = Array.isArray(rows) && rows.length > 0
    if (nuevo) enviarBienvenida(email) // best-effort, sin await bloqueante
    return Response.json({ ok: true, nuevo })
  } catch {
    return Response.json({ ok: false, error: 'server' }, { status: 500 })
  }
}
