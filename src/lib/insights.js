// Fase 1 de "Métricas y Recomendaciones de Valor" (ver docs/).
// Inteligencia derivada de los CONTADORES ACTUALES del negocio. Sin columnas
// nuevas ni tabla de eventos: todo sale de view_count y los *_clicks (+ su corte
// _last_month) que ya guarda la tabla businesses, más la completitud de la ficha.
//
// Funciones puras, sin dependencias de red ni de React, para poder usarlas tanto
// en el panel (dashboard) como en el reporte mensual por correo.

import { PLANS, DEFAULT_PLAN } from './plans'

// Crecimiento del mes = total acumulado − corte del inicio de mes.
export const delta = (total, last) =>
  last === null || last === undefined ? 0 : (total || 0) - (last || 0)

// ── Ticket y cierre sugeridos por categoría (para estimar el ROI) ───────────
// Valores conservadores y editables. La clave es el `nombre` de la categoría
// (business.category se guarda EXACTO como el nombre). Si no hay match, usa el
// default. No se vende humo: todo se presenta como "estimado / potencial".
export const TICKET_SUGERIDO = {
  Restaurantes: 350,
  Hospedaje: 1400,
  Ecoturismo: 450,
  Salud: 500,
  'Belleza y Bienestar': 400,
  'Tiendas y Artesanías': 300,
  Servicios: 600,
}
export const TICKET_DEFAULT = 350

export const CIERRE_SUGERIDO = {
  Hospedaje: 0.12,
  Salud: 0.3,
  Servicios: 0.18,
}
export const CIERRE_DEFAULT = 0.25

const precioPlan = (plan) => PLANS[plan]?.price ?? PLANS[DEFAULT_PLAN].price

// ── 1) Tasa de contacto (conversión de la ficha) ────────────────────────────
// De cada 100 que te ven, cuántos te buscan (WhatsApp + llamada + ruta).
export function tasaContacto(b) {
  const vistas = b.view_count || 0
  const contactos = (b.whatsapp_clicks || 0) + (b.phone_clicks || 0) + (b.maps_clicks || 0)
  const pct = vistas > 0 ? Math.round((contactos / vistas) * 100) : null
  return { vistas, contactos, pct }
}

// Contactos directos del MES (los que mueven la venta: no cuenta IG/FB).
export function contactosMes(b) {
  return (
    delta(b.whatsapp_clicks, b.whatsapp_clicks_last_month) +
    delta(b.phone_clicks, b.phone_clicks_last_month) +
    delta(b.maps_clicks, b.maps_clicks_last_month)
  )
}

// ── 2) Salud de la ficha (0–100) ────────────────────────────────────────────
// Qué tan completa está. Pondera lo que de verdad convierte. Devuelve el score
// y la lista de pendientes accionables.
export function saludFicha({ business, photos = [], hoursCount = 0, maxPhotos }) {
  const max = maxPhotos || PLANS[business.plan]?.maxPhotos || PLANS[DEFAULT_PLAN].maxPhotos
  const nFotos = photos.length || 0
  const faltantes = []
  let score = 0

  // Fotos (30): proporcional al máximo del plan.
  const fotoRatio = max > 0 ? Math.min(1, nFotos / max) : 0
  score += Math.round(30 * fotoRatio)
  if (nFotos < max) faltantes.push(`${max - nFotos} foto(s) más (vas ${nFotos}/${max})`)

  // Descripción (12).
  if (business.description && business.description.trim().length >= 40) score += 12
  else faltantes.push('una descripción con gancho (mín. 40 caracteres)')

  // WhatsApp (16): el canal de venta.
  if (business.whatsapp) score += 16
  else faltantes.push('tu WhatsApp')

  // Ubicación / mapa (12).
  if (business.maps_url || (business.lat != null && business.lng != null)) score += 12
  else faltantes.push('tu ubicación en el mapa')

  // Dirección legible (6).
  if (business.address && business.address.trim()) score += 6
  else faltantes.push('tu dirección')

  // Horarios (10).
  if (hoursCount > 0) score += 10
  else faltantes.push('tus horarios')

  // Redes sociales (14 = 7 + 7).
  if (business.instagram) score += 7
  else faltantes.push('tu Instagram')
  if (business.facebook) score += 7
  else faltantes.push('tu Facebook')

  score = Math.max(0, Math.min(100, score))
  const nivel = score >= 85 ? 'excelente' : score >= 60 ? 'buena' : 'por mejorar'
  return { score, nivel, faltantes, nFotos, maxFotos: max }
}

// ── 3) Ranking dentro de la categoría ───────────────────────────────────────
// peers: arreglo de { view_count } de los negocios activos de la misma categoría
// (INCLUYENDO al propio). Devuelve posición (1 = primero) y total.
export function rankingCategoria(peers, myViews) {
  if (!Array.isArray(peers) || peers.length < 2) return null
  const mine = myViews || 0
  const porEncima = peers.filter((p) => (p.view_count || 0) > mine).length
  return { pos: porEncima + 1, n: peers.length }
}

// ── 4) Calculadora de valor / ROI ───────────────────────────────────────────
// Convierte los contactos del mes en pesos potenciales y los pone contra el
// precio del plan. Todo "estimado": defaults conservadores y transparentes.
export function roiEstimado(business, { ticket, cierre } = {}) {
  const cat = business.category
  const t = ticket ?? TICKET_SUGERIDO[cat] ?? TICKET_DEFAULT
  const c = cierre ?? CIERRE_SUGERIDO[cat] ?? CIERRE_DEFAULT
  const contactos = contactosMes(business)
  const ventas = contactos * c
  const ingreso = Math.round(ventas * t)
  const precio = precioPlan(business.plan)
  const retorno = precio > 0 ? ingreso / precio : 0
  return {
    contactos,
    ticket: t,
    cierre: c,
    cierreTexto: `1 de cada ${Math.max(1, Math.round(1 / c))}`,
    ingreso,
    precio,
    retorno: Math.round(retorno * 10) / 10,
  }
}

// ── 5) Motor de recomendaciones ─────────────────────────────────────────────
// Reglas si-entonces sobre las métricas. Devuelve las `max` más relevantes para
// ESA ficha este mes (prioridad mayor = más urgente/accionable).
export function recomendaciones({ business, salud, tasa }, max = 3) {
  const b = business
  const recs = []
  const push = (prio, icon, text) => recs.push({ prio, icon, text })

  // Salud de ficha baja: lo primero, porque limita todo lo demás.
  if (salud && salud.score < 70 && salud.faltantes.length) {
    push(100, '🧩', `Completa tu ficha (${salud.score}/100): te falta ${salud.faltantes.slice(0, 2).join(' y ')}. Las fichas completas reciben hasta 3× más contactos.`)
  }

  // Te ven pero no te contactan.
  if (tasa && tasa.vistas >= 20 && tasa.pct !== null && tasa.pct < 5) {
    push(90, '🪝', `Te ven (${tasa.vistas}) pero pocos te contactan (${tasa.pct}%). Cambia tu foto principal y agrega precios: suele ser lo que frena el clic.`)
  }

  // Piden "cómo llegar" pero no escriben: falta empuje a WhatsApp.
  const maps = b.maps_clicks || 0
  const wa = b.whatsapp_clicks || 0
  if (maps >= 10 && wa < maps * 0.5) {
    push(80, '💬', 'Muchos piden cómo llegar pero pocos escriben. Pon un botón de WhatsApp con "¿Hay lugar hoy?" y responde en menos de 1 hora.')
  }

  // Instagram a la baja (Cuāuhtli+).
  const igMes = delta(b.instagram_clicks, b.instagram_clicks_last_month)
  if (b.instagram && igMes < 0) {
    push(70, '📸', 'Tus clics a Instagram bajaron este mes. Sube 1 reel esta semana: hoy es el formato con más alcance orgánico.')
  }

  // Sin Instagram conectado.
  if (!b.instagram) {
    push(60, '📸', 'Conecta tu Instagram a la ficha: es la vitrina que más miran los turistas antes de decidir.')
  }
  // Sin Facebook conectado.
  if (!b.facebook) {
    push(55, '👍', 'Agrega tu Facebook: ahí viven los grupos de escapadas de CDMX y Edomex que buscan Malinalco.')
  }

  // WhatsApp es su canal fuerte: aprovéchalo.
  const total = wa + (b.phone_clicks || 0) + maps
  if (total >= 10 && wa / total >= 0.6) {
    push(50, '⚡', `El ${Math.round((wa / total) * 100)}% te contacta por WhatsApp. Usa WhatsApp Business con catálogo y respuestas rápidas para cerrar más.`)
  }

  // Siempre hay una recomendación de fondo: contenido/temporada.
  push(20, '🗓️', 'Mándanos 3 fotos nuevas para tu próxima mención en nuestras redes y para la temporada que viene en Malinalco.')
  push(15, '⭐', 'Pide la reseña por WhatsApp justo después de la visita: sube tu reputación y tu posición en la categoría.')

  return recs.sort((a, b) => b.prio - a.prio).slice(0, max)
}

// ── Formato de dinero (es-MX) ───────────────────────────────────────────────
export function pesos(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
  }).format(n || 0)
}
