// Reporte mensual por correo para negocios Ocēlōtl (beneficio del plan).
// Lo dispara Vercel Cron (ver vercel.json) el día 1 de cada mes. Al final
// hace el "corte mensual" (snapshot) para reiniciar el "▲ vs. mes pasado"
// de TODOS los negocios, así que es también el rollover mensual del panel.
//
// Seguridad: Vercel agrega el header Authorization: Bearer ${CRON_SECRET}
// cuando CRON_SECRET está configurada. Rechazamos si no coincide.
//
// Requiere: CRON_SECRET, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY.
import { enviarReporteMensual } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

const sb = (path, init = {}) =>
  fetch(`${URL}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })

const mes = (total, last) => (last === null || last === undefined ? 0 : (total || 0) - last)

export async function GET(request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  if (!SERVICE_ROLE || !URL) {
    return Response.json({ ok: false, error: 'missing_supabase_config' }, { status: 503 })
  }

  // 1) Promedio de vistas por categoría (para la comparativa), sobre activos.
  const avgByCat = {}
  try {
    const res = await sb('/rest/v1/businesses?is_active=eq.true&select=category,view_count')
    const all = res.ok ? await res.json() : []
    const acc = {}
    for (const b of all) {
      const k = b.category || ''
      acc[k] = acc[k] || { sum: 0, n: 0 }
      acc[k].sum += b.view_count || 0
      acc[k].n += 1
    }
    for (const k of Object.keys(acc)) avgByCat[k] = { avg: acc[k].sum / acc[k].n, n: acc[k].n }
  } catch { /* sin comparativa si falla */ }

  // 2) Negocios Ocēlōtl activos (destinatarios).
  const cols = [
    'id', 'name', 'owner_id', 'category',
    'view_count', 'views_last_month',
    'whatsapp_clicks', 'whatsapp_clicks_last_month',
    'phone_clicks', 'phone_clicks_last_month',
    'maps_clicks', 'maps_clicks_last_month',
    'instagram_clicks', 'instagram_clicks_last_month',
    'facebook_clicks', 'facebook_clicks_last_month',
  ].join(',')
  const listRes = await sb(`/rest/v1/businesses?plan=eq.ocelotl&is_active=eq.true&select=${cols}`)
  if (!listRes.ok) {
    return Response.json({ ok: false, error: 'query_failed', detail: await listRes.text() }, { status: 502 })
  }
  const negocios = await listRes.json()

  let sent = 0, skipped = 0, failed = 0

  for (const b of negocios) {
    try {
      // Email del dueño (vive en auth.users; se obtiene con service role).
      let email = null
      if (b.owner_id) {
        const uRes = await sb(`/auth/v1/admin/users/${b.owner_id}`)
        if (uRes.ok) email = (await uRes.json())?.email || null
      }
      if (!email) { skipped++; continue }

      const cat = avgByCat[b.category || '']
      let comparativa = null
      if (cat && cat.n >= 3 && cat.avg > 0) {
        const pct = Math.round(((b.view_count || 0) - cat.avg) / cat.avg * 100)
        if (pct >= 5) comparativa = `Tu ficha recibe ${pct}% más vistas que el promedio de ${b.category} en el pueblo.`
        else if (pct <= -5) comparativa = `Vas ${Math.abs(pct)}% por debajo del promedio de ${b.category}. Sumar fotos o una mención suele ayudar.`
        else comparativa = `Vas en línea con el promedio de ${b.category} en el pueblo.`
      }

      await enviarReporteMensual({
        email,
        negocio: b.name,
        stats: {
          vistas: { total: b.view_count || 0, mes: mes(b.view_count, b.views_last_month) },
          contactos: [
            { label: '💬 Contactos por WhatsApp', total: b.whatsapp_clicks || 0, mes: mes(b.whatsapp_clicks, b.whatsapp_clicks_last_month) },
            { label: '📞 Llamadas', total: b.phone_clicks || 0, mes: mes(b.phone_clicks, b.phone_clicks_last_month) },
            { label: '📍 Pidieron cómo llegar', total: b.maps_clicks || 0, mes: mes(b.maps_clicks, b.maps_clicks_last_month) },
            { label: '📸 Clics a tu Instagram', total: b.instagram_clicks || 0, mes: mes(b.instagram_clicks, b.instagram_clicks_last_month) },
            { label: '👍 Clics a tu Facebook', total: b.facebook_clicks || 0, mes: mes(b.facebook_clicks, b.facebook_clicks_last_month) },
          ],
          comparativa,
        },
      })
      sent++
    } catch (err) {
      failed++
      console.error('[monthly-report] fallo con negocio', b.id, err?.message)
    }
  }

  // 3) Corte mensual para TODOS: reinicia el "▲ vs. mes pasado" del panel.
  let snapshot = 'ok'
  try {
    const snapRes = await sb('/rest/v1/rpc/snapshot_monthly_views', { method: 'POST', body: '{}' })
    if (!snapRes.ok) snapshot = `error ${snapRes.status}`
  } catch (err) {
    snapshot = `error ${err?.message}`
  }

  return Response.json({ ok: true, ocelotl: negocios.length, sent, skipped, failed, snapshot })
}
