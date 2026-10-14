// Motor de campañas del newsletter. Protegido por secreto (NEWSLETTER_SECRET
// o, en su defecto, CRON_SECRET). Uso manual desde el navegador o curl:
//   ?key=SECRET&preview=1   → devuelve el HTML + conteo, SIN enviar
//   ?key=SECRET&test=a@b.com → envía SOLO a ese correo (prueba)
//   ?key=SECRET&send=1       → envía a TODA la lista
//   ?key=SECRET              → solo el conteo y modo de uso
//
// Arma el contenido solo: qué está abierto, próximos eventos (Fiestas y
// Festivales) y un negocio destacado. Requiere SUPABASE_SERVICE_ROLE_KEY y
// RESEND_API_KEY.
import { getPriority } from '@/lib/plans'
import { estadoHorario } from '@/lib/hours'
import { getArticulosPorGrupo } from '@/lib/articulos'
import { renderCampaña, urlBaja } from '@/lib/newsletter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const SECRET = process.env.NEWSLETTER_SECRET || process.env.CRON_SECRET
const FROM = 'Emmanuel de enMalinalco <hola@enmalinalco.com>'

const sb = (path) =>
  fetch(`${URL}${path}`, { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}` } })

async function enviar(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  return res.ok
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const key = request.headers.get('authorization')?.replace('Bearer ', '') || searchParams.get('key')
  if (!SECRET || key !== SECRET) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  if (!URL || !SERVICE_ROLE) {
    return Response.json({ ok: false, error: 'missing_supabase_config' }, { status: 503 })
  }

  // 1) Datos del contenido.
  const bizRes = await sb('/rest/v1/businesses?is_active=eq.true&select=id,name,slug,category,plan')
  const businesses = bizRes.ok ? await bizRes.json() : []
  const ids = businesses.map((b) => b.id)

  const hoursByBiz = {}
  if (ids.length) {
    const inList = ids.map((i) => `"${i}"`).join(',')
    const hRes = await sb(`/rest/v1/business_hours?business_id=in.(${inList})&select=business_id,day_of_week,open_time,close_time,break_start,break_end,is_closed`)
    const hrs = hRes.ok ? await hRes.json() : []
    for (const h of hrs) (hoursByBiz[h.business_id] ||= []).push(h)
  }

  const conPrioridad = businesses.map((b) => ({ ...b, _p: getPriority(b.plan) }))
  const abiertos = conPrioridad
    .filter((b) => estadoHorario(hoursByBiz[b.id] || []).open)
    .sort((a, b) => b._p - a._p)
    .map((b) => ({ name: b.name, slug: b.slug, category: b.category || '' }))

  const destacado = [...conPrioridad].sort((a, b) => b._p - a._p)[0]
  const destacadoData = destacado ? { name: destacado.name, slug: destacado.slug, category: destacado.category || '' } : null

  const articulos = getArticulosPorGrupo('fiestas').map((a) => ({ titulo: a.titulo, slug: a.slug, excerpt: a.excerpt }))

  const data = { abiertos, destacado: destacadoData, articulos }

  // 2) Suscriptores activos.
  const subRes = await sb('/rest/v1/newsletter_subscribers?unsubscribed=eq.false&select=email')
  const subs = subRes.ok ? await subRes.json() : []

  // --- PREVIEW ---
  if (searchParams.get('preview')) {
    const { html } = renderCampaña(data, urlBaja('ejemplo@correo.com', SECRET))
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }

  // --- TEST (un solo correo) ---
  const test = searchParams.get('test')
  if (test) {
    const { subject, html } = renderCampaña(data, urlBaja(test, SECRET))
    const ok = await enviar(test, subject, html)
    return Response.json({ ok, modo: 'test', to: test, suscriptores: subs.length })
  }

  // --- ENVÍO REAL ---
  if (searchParams.get('send')) {
    if (!process.env.RESEND_API_KEY) return Response.json({ ok: false, error: 'missing_resend' }, { status: 503 })
    let sent = 0, failed = 0
    for (const s of subs.slice(0, 2000)) {
      const { subject, html } = renderCampaña(data, urlBaja(s.email, SECRET))
      const ok = await enviar(s.email, subject, html)
      ok ? sent++ : failed++
    }
    return Response.json({ ok: true, modo: 'send', suscriptores: subs.length, sent, failed })
  }

  // --- POR DEFECTO: conteo + uso ---
  return Response.json({
    ok: true,
    suscriptores: subs.length,
    abiertos: abiertos.length,
    uso: {
      preview: '?key=SECRET&preview=1',
      test: '?key=SECRET&test=tu@correo.com',
      enviar: '?key=SECRET&send=1',
    },
  })
}
