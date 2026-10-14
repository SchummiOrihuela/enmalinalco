// Resuelve un enlace de Google Maps a coordenadas (lat/lng).
// Los enlaces completos se leen directo; los cortos (maps.app.goo.gl) se
// siguen hasta la URL final y, si hace falta, se busca en el HTML.
import { coordsFromText } from '@/lib/geo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(req) {
  let url
  try {
    ({ url } = await req.json())
  } catch {
    return json({ error: 'Petición inválida.' }, 400)
  }
  if (!url || typeof url !== 'string') {
    return json({ error: 'Falta el enlace de Google Maps.' }, 400)
  }

  // 1) ¿Las coordenadas ya vienen en el texto del enlace?
  let coords = coordsFromText(url)
  if (coords) return json(coords)

  // 2) Sigue redirecciones y analiza la URL final y el cuerpo.
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; enmalinalco/1.0)' },
    })
    coords = coordsFromText(res.url || '')
    if (coords) return json(coords)

    const body = await res.text()
    coords = coordsFromText(body)
    if (coords) return json(coords)
  } catch {
    return json({ error: 'No pudimos abrir ese enlace. Captura las coordenadas a mano.' }, 502)
  }

  return json(
    { error: 'No encontramos coordenadas en ese enlace. Captura la latitud y longitud a mano.' },
    422,
  )
}
