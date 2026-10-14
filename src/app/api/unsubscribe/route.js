// Baja del newsletter. El enlace del correo trae email + token (HMAC) para
// que nadie pueda dar de baja a otros. Marca unsubscribed=true (service role).
import { tokenBaja } from '@/lib/newsletter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const SECRET = process.env.NEWSLETTER_SECRET || process.env.CRON_SECRET

function pagina(titulo, texto) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title></head>
    <body style="margin:0;background:#213A26;font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center">
      <div style="max-width:420px;padding:32px;text-align:center;color:#F6F0E0">
        <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 10px">${titulo}</h1>
        <p style="color:rgba(242,237,227,.8);font-size:15px;line-height:1.6">${texto}</p>
        <p style="margin-top:22px"><a href="https://enmalinalco.com" style="color:#DCB24A;font-weight:700;text-decoration:none">Volver a En Malinalco →</a></p>
      </div>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = (searchParams.get('email') || '').trim().toLowerCase()
  const t = searchParams.get('t') || ''

  if (!email || !SECRET || t !== tokenBaja(email, SECRET)) {
    return pagina('Enlace no válido', 'Este enlace de baja no es válido o ya expiró. Si quieres dejar de recibir correos, responde a cualquiera de ellos.')
  }
  if (!URL || !SERVICE_ROLE) {
    return pagina('No disponible', 'No pudimos procesar tu baja en este momento. Inténtalo más tarde.')
  }

  try {
    await fetch(`${URL}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ unsubscribed: true }),
    })
  } catch {
    return pagina('No disponible', 'No pudimos procesar tu baja en este momento. Inténtalo más tarde.')
  }

  return pagina('Listo, te diste de baja', 'Ya no recibirás más correos del newsletter. Nos dará gusto verte de nuevo por el pueblo. 🌿')
}
