// Envío de invitaciones al Programa Fundadores (reclutamiento de negocios).
// Protegido por secreto (NEWSLETTER_SECRET o, en su defecto, CRON_SECRET).
//
// La lista de prospectos se toma, en este orden:
//   1) la variable de entorno INVITADOS_JSON (recomendado en Vercel: privado,
//      no vive en el repo público), con el arreglo JSON como texto; o
//   2) el archivo local supabase/invitados.json (solo para pruebas locales;
//      está en .gitignore y NO se despliega).
// Formato de cada contacto: { email, negocio }. Ver supabase/invitados.example.json.
//
// Uso manual desde el navegador o curl:
//   ?key=SECRET                 → conteo de la lista y modo de uso (NO envía)
//   ?key=SECRET&preview=1       → HTML renderizado del 1er contacto, SIN enviar
//   ?key=SECRET&test=a@b.com    → envía SOLO a ese correo (datos del 1er contacto)
//   ?key=SECRET&send=1          → envía a TODA la lista (uno por uno)
//
// Requiere RESEND_API_KEY. Los cupos restantes usan Supabase si
// SUPABASE_SERVICE_ROLE_KEY está disponible; si no, usa un texto genérico.
import { readFileSync } from 'fs'
import path from 'path'
import { enviarInvitacion, renderInvitacion } from '@/lib/email'
import { FOUNDERS } from '@/lib/plans'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SECRET = process.env.NEWSLETTER_SECRET || process.env.CRON_SECRET
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const DESTINO = 'https://enmalinalco.com/#negocios'

// Cupos públicos: 50 reales (el corte interno incluye 2 compras de prueba).
const CUPOS_PUBLICOS = Math.max(0, FOUNDERS.cupos - 2)

// Lee la lista real de prospectos (env var primero, archivo local de respaldo).
// Lanza si no hay ninguna fuente o no es un arreglo válido.
function leerInvitados() {
  let crudo = process.env.INVITADOS_JSON
  if (!crudo) {
    const ruta = path.join(process.cwd(), 'supabase/invitados.json')
    crudo = readFileSync(ruta, 'utf8') // lanza si no existe
  }
  const data = JSON.parse(crudo)
  if (!Array.isArray(data)) throw new Error('la lista debe ser un arreglo JSON')
  return data.filter((c) => c && c.email)
}

// Texto de cupos restantes. Si hay Supabase, descuenta los negocios activos.
async function textoCupos() {
  if (!SUPABASE_URL || !SERVICE_ROLE) return 'Los lugares son limitados'
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&select=id`,
      {
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
          Prefer: 'count=exact',
        },
      }
    )
    // El header Content-Range trae el total, ej. "0-24/25".
    const rango = res.headers.get('content-range') || ''
    const activos = parseInt(rango.split('/')[1], 10)
    if (Number.isFinite(activos)) {
      const quedan = Math.max(0, CUPOS_PUBLICOS - activos)
      return quedan > 0 ? `Quedan ${quedan} lugares` : 'Últimos lugares'
    }
  } catch {
    /* si falla, caemos al texto genérico */
  }
  return 'Los lugares son limitados'
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const key =
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    searchParams.get('key')
  if (!SECRET || key !== SECRET) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let lista
  try {
    lista = leerInvitados()
  } catch (e) {
    return Response.json(
      { ok: false, error: 'no_list', detalle: String(e.message || e) },
      { status: 503 }
    )
  }
  if (!lista.length) {
    return Response.json({ ok: false, error: 'lista_vacia' }, { status: 400 })
  }

  const cupos = await textoCupos()
  const preview = searchParams.get('preview')
  const test = searchParams.get('test')
  const send = searchParams.get('send')

  // Datos de un contacto, listos para render/envío.
  const datos = (c, emailOverride) => ({
    email: emailOverride || c.email,
    negocio: c.negocio,
    contacto: c.contacto,
    personalizado: c.personalizado,
    cupos,
    url: DESTINO,
  })

  // PREVIEW: HTML renderizado del primer contacto, sin enviar.
  if (preview) {
    const { html } = renderInvitacion(datos(lista[0]))
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // TEST: envía solo al correo indicado. Si ese correo está en la lista, usa
  // SUS datos (su negocio); si no, usa los del primer contacto como muestra.
  if (test) {
    const muestra = lista.find((c) => c.email?.toLowerCase() === test.toLowerCase()) || lista[0]
    try {
      const r = await enviarInvitacion(datos(muestra, test))
      return Response.json({ ok: true, modo: 'test', enviadoA: test, id: r?.data?.id || null })
    } catch (e) {
      return Response.json(
        { ok: false, error: 'fallo_envio', detalle: String(e.message || e) },
        { status: 502 }
      )
    }
  }

  // SEND: envía a toda la lista, uno por uno (pausa amable entre envíos).
  if (send) {
    const resultados = []
    for (const c of lista) {
      try {
        const r = await enviarInvitacion(datos(c))
        resultados.push({ email: c.email, ok: true, id: r?.data?.id || null })
      } catch (e) {
        resultados.push({ email: c.email, ok: false, error: String(e.message || e) })
      }
      await new Promise((res) => setTimeout(res, 600))
    }
    const enviados = resultados.filter((x) => x.ok).length
    return Response.json({ ok: true, modo: 'send', enviados, total: lista.length, resultados })
  }

  // Sin modo: solo conteo e instrucciones.
  return Response.json({
    ok: true,
    total: lista.length,
    cupos,
    uso: {
      preview: '?key=SECRET&preview=1',
      test: '?key=SECRET&test=tu-correo@dominio.com',
      enviar_todo: '?key=SECRET&send=1',
    },
  })
}
