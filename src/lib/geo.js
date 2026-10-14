// Utilidades para sacar coordenadas (lat/lng) de un enlace de Google Maps
// o de cualquier texto que las contenga. Se usa en el navegador (enlaces
// completos) y en el servidor (enlaces cortos que hay que resolver).

export function validCoords(lat, lng) {
  return (
    isFinite(lat) && isFinite(lng) &&
    Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  )
}

// Reconoce los formatos más comunes de URL de Google Maps.
export function coordsFromText(text) {
  if (!text) return null
  const s = String(text)
  const patterns = [
    /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,                       // .../@18.9487,-99.4939,17z
    /!3d(-?\d{1,3}\.\d+)!4d(-?\d{1,3}\.\d+)/,                   // ...!3d18.9487!4d-99.4939
    /[?&#](?:q|query|ll|center|destination|daddr|sll)=(-?\d{1,3}\.\d+)(?:,|%2C)(-?\d{1,3}\.\d+)/i,
    /(-?\d{1,3}\.\d{4,}),\s*(-?\d{1,3}\.\d{4,})/,               // par de números sueltos (último recurso)
  ]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) {
      const lat = Number(m[1]), lng = Number(m[2])
      if (validCoords(lat, lng)) return { lat, lng }
    }
  }
  return null
}

// Enlaces acortados que no traen coordenadas: hay que seguir la redirección.
export function isShortMapsLink(url) {
  return /(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/kgs)/i.test(url || '')
}
