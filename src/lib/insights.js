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
// Catálogo de recomendaciones ESPECÍFICAS por red y por ficha. Cada una lleva:
//   - red:  'instagram' | 'facebook' | 'whatsapp' | 'ficha' | 'contenido'
//   - prio: urgencia (mayor = antes)
//   - test(ctx): decide si APLICA al caso real del negocio (personalización)
//   - icon, text: el consejo accionable
// La idea es que el cliente sienta un comentario de consultor para SU situación,
// no un folleto genérico: solo se muestran las que su test aprueba.

// Construye el contexto con todo lo que los tests necesitan.
export function contextoRecos({ business, salud, tasa }) {
  const b = business
  const wa = b.whatsapp_clicks || 0
  const phone = b.phone_clicks || 0
  const maps = b.maps_clicks || 0
  const ig = b.instagram_clicks || 0
  const fb = b.facebook_clicks || 0
  const totalContacto = wa + phone + maps
  return {
    b,
    salud: salud || null,
    tasa: tasa || null,
    wa, phone, maps, ig, fb, totalContacto,
    igMes: delta(b.instagram_clicks, b.instagram_clicks_last_month),
    fbMes: delta(b.facebook_clicks, b.facebook_clicks_last_month),
    waMes: delta(b.whatsapp_clicks, b.whatsapp_clicks_last_month),
    hasIG: !!b.instagram,
    hasFB: !!b.facebook,
    hasWA: !!b.whatsapp,
    hospedaje: b.category === 'Hospedaje',
    restaurante: b.category === 'Restaurantes',
    // Share WhatsApp entre los canales de contacto (0..1).
    waShare: totalContacto > 0 ? wa / totalContacto : 0,
    igShare: ig + fb > 0 ? ig / (ig + fb) : 0,
  }
}

export const RECOS_CATALOGO = [
  // ───────────── INSTAGRAM (15) ─────────────
  { red: 'instagram', prio: 95, icon: '📸', test: (c) => !c.hasIG, text: 'Conecta tu Instagram a la ficha: es la vitrina #1 que revisa el turista de CDMX antes de decidir a dónde ir en Malinalco.' },
  { red: 'instagram', prio: 90, icon: '📉', test: (c) => c.hasIG && c.igMes < 0, text: 'Tus clics a Instagram bajaron este mes. Sube 1 reel esta semana (recorrido, platillo o atardecer): hoy es el formato con más alcance orgánico.' },
  { red: 'instagram', prio: 70, icon: '🎬', test: (c) => c.hasIG, text: 'Publica 1 reel por semana mostrando la experiencia real: Malinalco entra por los ojos. Los reels superan por mucho a la foto fija en alcance.' },
  { red: 'instagram', prio: 68, icon: '📍', test: (c) => c.hasIG, text: 'Etiqueta la ubicación "Malinalco" en cada post y story: así te encuentran quienes buscan el pueblo por lugar.' },
  { red: 'instagram', prio: 66, icon: '📖', test: (c) => c.hasIG, text: 'Sube stories diarias de lo cotidiano (apertura, cocina, huéspedes): mantienen tu perfil arriba en el feed de quien ya te sigue.' },
  { red: 'instagram', prio: 64, icon: '✍️', test: (c) => c.hasIG, text: 'Cuida las primeras 2 líneas del pie: son las que deciden el clic. Arranca con un gancho, no con "Hola a todos".' },
  { red: 'instagram', prio: 62, icon: '💬', test: (c) => c.hasIG, text: 'Responde todos los comentarios y DMs en menos de 1 hora: el algoritmo premia la conversación y el turista decide rápido.' },
  { red: 'instagram', prio: 60, icon: '🤝', test: (c) => c.hasIG, text: 'Haz una colaboración (collab) con @enmalinalco y con otro negocio del pueblo: el post sale en ambos perfiles y duplica alcance.' },
  { red: 'instagram', prio: 58, icon: '📌', test: (c) => c.hasIG, text: 'Arma Highlights fijos: "Menú/Precios", "Cómo llegar" y "Reseñas". Es lo primero que abre quien llega a tu perfil.' },
  { red: 'instagram', prio: 56, icon: '🕗', test: (c) => c.hasIG, text: 'Publica en tu mejor horario (jueves a domingo, 6–9 pm): es cuando el visitante planea su escapada a Malinalco.' },
  { red: 'instagram', prio: 54, icon: '👉', test: (c) => c.hasIG, text: 'Cierra cada post con un CTA claro: "Reserva por WhatsApp" o "Llámanos hoy". Sin llamada a la acción, el like no se vuelve cliente.' },
  { red: 'instagram', prio: 52, icon: '🔁', test: (c) => c.hasIG, text: 'Repostea las fotos que suben tus clientes (UGC) y pídeles que te etiqueten: prueba social gratis y auténtica.' },
  { red: 'instagram', prio: 50, icon: '💰', test: (c) => c.hasIG && c.restaurante, text: 'Pon tu menú y precios visibles en un reel o Highlight: el 70% abandona un perfil de restaurante si no ve cuánto cuesta.' },
  { red: 'instagram', prio: 50, icon: '🛏️', test: (c) => c.hasIG && c.hospedaje, text: 'Muestra la habitación, el baño y la vista en un solo reel: el huésped quiere ver exactamente dónde va a dormir antes de escribirte.' },
  { red: 'instagram', prio: 40, icon: '🏷️', test: (c) => c.hasIG, text: 'Usa 3–5 hashtags locales (#Malinalco #PuebloMagico #EdoMex) en lugar de 30 genéricos: pesan más para tu audiencia real.' },
  { red: 'instagram', prio: 39, icon: '🎠', test: (c) => c.hasIG, text: 'Sube carruseles de 5–7 fotos: Instagram les da más alcance y el usuario pasa más tiempo en tu post (dos señales que premia el algoritmo).' },
  { red: 'instagram', prio: 38, icon: '🔗', test: (c) => c.hasIG, text: 'Deja un solo enlace útil en tu bio (wa.me o tu ficha de En Malinalco): que escribirte sea de un toque, no una búsqueda.' },
  { red: 'instagram', prio: 37, icon: '📌', test: (c) => c.hasIG, text: 'Fija (pin) tus 3 mejores posts arriba del perfil: son la primera impresión de quien te acaba de descubrir.' },
  { red: 'instagram', prio: 36, icon: '🎵', test: (c) => c.hasIG, text: 'Usa un audio en tendencia en tus reels: Instagram empuja el contenido que monta sobre sonidos populares.' },
  { red: 'instagram', prio: 35, icon: '❓', test: (c) => c.hasIG, text: 'Usa stickers de pregunta y encuestas en stories ("¿Qué platillo pedimos este finde?"): la interacción sube tu alcance con quien ya te sigue.' },
  { red: 'instagram', prio: 34, icon: '📍', test: (c) => c.hasIG, text: 'Geo-etiqueta también puntos famosos (Zona Arqueológica, Convento, Los Bichos): alcanzas a quien explora el pueblo por ubicación.' },
  { red: 'instagram', prio: 33, icon: '🗓️', test: (c) => c.hasIG, text: 'Programa tu contenido con Meta Business Suite: aunque tengas una semana llena, no dejas tu perfil abandonado.' },
  { red: 'instagram', prio: 32, icon: '👨‍🍳', test: (c) => c.hasIG, text: 'Muestra el detrás de cámaras (cocina, equipo, el anfitrión): humanizar la marca genera confianza y cercanía antes de la visita.' },
  { red: 'instagram', prio: 31, icon: '🤳', test: (c) => c.hasIG, text: 'Haz canje con micro-influencers locales (una comida o una noche a cambio de contenido): alcance real y barato con su audiencia de la región.' },
  { red: 'instagram', prio: 30, icon: '📚', test: (c) => c.hasIG, text: 'Arma Guías de Instagram ("Un día en Malinalco", "Dónde comer trucha"): contenido que se guarda y comparte, y te posiciona como experto del pueblo.' },

  // ───────────── FACEBOOK (13) ─────────────
  { red: 'facebook', prio: 93, icon: '👍', test: (c) => !c.hasFB, text: 'Agrega tu Facebook a la ficha: ahí viven los grupos de "escapadas desde CDMX/Edomex" y "qué hacer en Malinalco" donde se decide el fin de semana.' },
  { red: 'facebook', prio: 88, icon: '📉', test: (c) => c.hasFB && c.fbMes < 0, text: 'Tus clics a Facebook bajaron este mes. Publica en 2–3 grupos de la región con una foto fuerte y tu WhatsApp: es tráfico que convierte.' },
  { red: 'facebook', prio: 70, icon: '📅', test: (c) => c.hasFB, text: 'Crea un Evento de Facebook por cada fecha fuerte de Malinalco (puente, Semana Santa, posadas): aparece a los locales y a quien busca planes.' },
  { red: 'facebook', prio: 68, icon: '👥', test: (c) => c.hasFB, text: 'Publica 1–2 veces/semana en grupos de escapadas de CDMX y Edomex. No más: Facebook penaliza el spam.' },
  { red: 'facebook', prio: 66, icon: '🔗', test: (c) => c.hasFB, text: 'Mantén horarios, WhatsApp y dirección idénticos a tu ficha de En Malinalco: la coherencia entre canales genera confianza y cierra ventas.' },
  { red: 'facebook', prio: 64, icon: '🖼️', test: (c) => c.hasFB, text: 'Sube álbumes de fotos por temporada: Facebook todavía da buen alcance orgánico a los álbumes, más que a un post suelto.' },
  { red: 'facebook', prio: 62, icon: '⭐', test: (c) => c.hasFB, text: 'Activa las recomendaciones/reseñas de tu página y responde cada una: son las que lee el visitante antes de escribirte.' },
  { red: 'facebook', prio: 60, icon: '💬', test: (c) => c.hasFB, text: 'Pon el botón "Enviar WhatsApp" o "Reservar" en tu página y responde Messenger rápido: el badge "muy receptivo" sube la conversión.' },
  { red: 'facebook', prio: 58, icon: '📰', test: (c) => c.hasFB, text: 'Comparte en tu página las historias de En Malinalco donde te mencionamos: doble alcance y refuerzas que eres referente del pueblo.' },
  { red: 'facebook', prio: 56, icon: '📐', test: (c) => c.hasFB, text: 'Sube fotos verticales y horizontales: así se ven bien en el feed y en historias sin recortarse.' },
  { red: 'facebook', prio: 54, icon: '🎯', test: (c) => c.hasFB, text: 'Si pruebas pauta, invierte poco ($100–150) segmentando a CDMX y Toluca, 25–55 años: es tu turista real de fin de semana.' },
  { red: 'facebook', prio: 50, icon: '🍽️', test: (c) => c.hasFB && c.restaurante, text: 'Publica tu menú del fin de semana cada jueves: la gente de la ciudad arma su plan de comida en Malinalco con 2–3 días de anticipación.' },
  { red: 'facebook', prio: 50, icon: '🏡', test: (c) => c.hasFB && c.hospedaje, text: 'Publica disponibilidad del próximo puente con fotos y precio: el huésped compara y reserva con semanas de anticipación.' },
  { red: 'facebook', prio: 49, icon: '📋', test: (c) => c.hasFB, text: 'Completa toda la info de tu página (horarios, servicios, precios, zona): Facebook usa esos datos para recomendarte a quien busca en Malinalco.' },
  { red: 'facebook', prio: 48, icon: '📌', test: (c) => c.hasFB, text: 'Fija una publicación destacada con tu promo o plato estrella actual: es lo primero que ve quien entra a tu página.' },
  { red: 'facebook', prio: 47, icon: '🎬', test: (c) => c.hasFB, text: 'Reutiliza tus reels de Instagram como Reels de Facebook: es alcance orgánico extra sin crear nada nuevo.' },
  { red: 'facebook', prio: 46, icon: '🎥', test: (c) => c.hasFB, text: 'Sube el video del recorrido directo a Facebook (no un link de YouTube): el video nativo pesa mucho más en el alcance.' },
  { red: 'facebook', prio: 45, icon: '🫶', test: (c) => c.hasFB, text: 'Responde las reseñas negativas con calma y una solución pública: demuestra servicio a los cientos que las leen, no solo a quien se quejó.' },
  { red: 'facebook', prio: 44, icon: '🎟️', test: (c) => c.hasFB, text: 'Crea una Oferta (Offer) con cupón para el fin de semana: Facebook la distribuye y la gente la guarda para canjearla contigo.' },
  { red: 'facebook', prio: 43, icon: '📣', test: (c) => c.hasFB, text: 'Invita a tus clientes contentos a seguir y dar "me gusta" a tu página: cada seguidor nuevo amplía tu alcance futuro gratis.' },
  { red: 'facebook', prio: 42, icon: '🏷️', test: (c) => c.hasFB, text: 'Etiqueta la ubicación Malinalco y a @EnMalinalco en cada publicación: entras en los feeds de quienes siguen al pueblo.' },
  { red: 'facebook', prio: 41, icon: '📖', test: (c) => c.hasFB, text: 'Sube Historias de Facebook a diario (puedes sincronizarlas con las de Instagram): mantienen tu página activa arriba del feed.' },
  { red: 'facebook', prio: 40, icon: '🛍️', test: (c) => c.hasFB, text: 'Si vendes productos o experiencias, publícalos en Marketplace: es un escaparate extra donde la gente de la región ya está comprando.' },

  // ───────────── WHATSAPP (13) ─────────────
  { red: 'whatsapp', prio: 96, icon: '💬', test: (c) => !c.hasWA, text: 'Agrega tu WhatsApp a la ficha: es tu canal de venta #1. Sin él, el cliente interesado no tiene cómo cerrar contigo en el momento.' },
  { red: 'whatsapp', prio: 85, icon: '📍', test: (c) => c.maps >= 10 && c.waShare < 0.4, text: 'Muchos piden "cómo llegar" pero pocos te escriben. Pon un botón de WhatsApp con "¿Hay lugar hoy?" y empuja el contacto antes de que lleguen.' },
  { red: 'whatsapp', prio: 80, icon: '⚡', test: (c) => c.totalContacto >= 8 && c.waShare >= 0.55, text: `WhatsApp es tu canal fuerte. Usa WhatsApp Business con catálogo y respuestas rápidas: le exprimes el canal que tus clientes ya prefieren.` },
  { red: 'whatsapp', prio: 72, icon: '🏪', test: (c) => c.hasWA, text: 'Cámbiate a WhatsApp Business (gratis): catálogo con precios, horario, dirección y perfil del negocio en un solo lugar.' },
  { red: 'whatsapp', prio: 70, icon: '🤖', test: (c) => c.hasWA, text: 'Configura el mensaje de bienvenida automático: responde al instante aunque estés ocupado y no pierdes al cliente impaciente.' },
  { red: 'whatsapp', prio: 68, icon: '⌨️', test: (c) => c.hasWA, text: 'Guarda respuestas rápidas para "precios", "disponibilidad" y "menú": contestas en segundos lo que preguntan 20 veces al día.' },
  { red: 'whatsapp', prio: 66, icon: '📣', test: (c) => c.hasWA, text: 'Sube Estados de WhatsApp con la promo del fin: muchos clientes los ven y es gratis. Es tu "historia" directa a quien ya te escribió.' },
  { red: 'whatsapp', prio: 64, icon: '🔗', test: (c) => c.hasWA, text: 'Usa un link wa.me con mensaje pre-llenado ("Hola, vi tu ficha en En Malinalco"): sabes de dónde viene cada contacto y arrancas la charla.' },
  { red: 'whatsapp', prio: 62, icon: '⏱️', test: (c) => c.hasWA, text: 'Responde en menos de 1 hora: la velocidad es el factor #1 de cierre. El que tarda, pierde la reserva con el de al lado.' },
  { red: 'whatsapp', prio: 58, icon: '🏷️', test: (c) => c.hasWA, text: 'Usa etiquetas para separar reservas, dudas y clientes frecuentes: das seguimiento ordenado y no se te cae ninguna venta.' },
  { red: 'whatsapp', prio: 56, icon: '✅', test: (c) => c.hasWA && c.hospedaje, text: 'Confirma y recuerda la reserva por WhatsApp un día antes: baja los "no show" y el huésped llega tranquilo.' },
  { red: 'whatsapp', prio: 54, icon: '⭐', test: (c) => c.hasWA, text: 'Pide la reseña por WhatsApp justo después de la visita, con el link directo: es cuando el cliente está más feliz y sí te la deja.' },
  { red: 'whatsapp', prio: 50, icon: '💰', test: (c) => c.hasWA, text: 'Ten el catálogo con precios visible: evitas el "¿cuánto cuesta?" y filtras a quien sí va a comprar.' },
  { red: 'whatsapp', prio: 49, icon: '📢', test: (c) => c.hasWA, text: 'Usa listas de difusión (con permiso) para avisar la promo del fin a quienes ya te escribieron: llega al chat personal, no a un feed saturado.' },
  { red: 'whatsapp', prio: 48, icon: '🔳', test: (c) => c.hasWA, text: 'Imprime tu código QR de WhatsApp en la mesa o la recepción: un escaneo y ya te escriben para pedir, reservar o dejar reseña.' },
  { red: 'whatsapp', prio: 47, icon: '🕑', test: (c) => c.hasWA, text: 'Configura tu horario de atención y un mensaje de ausencia: quien escribe de noche sabe cuándo le respondes y no se va con otro.' },
  { red: 'whatsapp', prio: 46, icon: '🔁', test: (c) => c.hasWA, text: 'Manda un mensaje de seguimiento al día siguiente ("¿Cómo la pasaste? Déjanos tu reseña aquí"): recuperas clientes y subes tu reputación.' },
  { red: 'whatsapp', prio: 45, icon: '💳', test: (c) => c.hasWA, text: 'Ofrece apartar por WhatsApp con un anticipo (link de pago): aseguras la venta y bajas las cancelaciones de última hora.' },
  { red: 'whatsapp', prio: 44, icon: '⭐', test: (c) => c.hasWA, text: 'Etiqueta a tus clientes frecuentes y mándales una promo exclusiva de vez en cuando: el cliente que regresa es el más barato de conseguir.' },
  { red: 'whatsapp', prio: 43, icon: '📲', test: (c) => c.hasWA, text: 'Pon tu link wa.me en tu bio de Instagram, tu página de Facebook y tu Google: un solo toque para escribirte desde donde te encuentren.' },
  { red: 'whatsapp', prio: 42, icon: '📍', test: (c) => c.hasWA && c.hospedaje, text: 'Al confirmar la reserva, comparte tu ubicación en vivo o el mapa: el huésped llega sin perderse por las calles del pueblo.' },
  { red: 'whatsapp', prio: 41, icon: '🖼️', test: (c) => c.hasWA, text: 'Cuida las fotos del catálogo: buena luz y precio por producto o habitación. El catálogo es tu vitrina dentro del chat.' },
  { red: 'whatsapp', prio: 40, icon: '🔔', test: (c) => c.hasWA, text: 'Confirma disponibilidad en tiempo real por WhatsApp antes de cerrar: evitas el no-show y el sobrecupo en temporada alta.' },

  // ───────────── FICHA (conversión) ─────────────
  { red: 'ficha', prio: 100, icon: '🧩', test: (c) => c.salud && c.salud.score < 70 && c.salud.faltantes.length > 0, text: null /* se arma dinámico abajo */ },
  { red: 'ficha', prio: 92, icon: '🪝', test: (c) => c.tasa && c.tasa.vistas >= 20 && c.tasa.pct !== null && c.tasa.pct < 5, text: null },
  { red: 'ficha', prio: 48, icon: '📸', test: (c) => c.salud && c.salud.nFotos < c.salud.maxFotos, text: null },

  // ───────────── CONTENIDO / temporada (siempre hay algo) ─────────────
  { red: 'contenido', prio: 25, icon: '🗓️', test: () => true, text: 'Mándanos 3 fotos nuevas para tu próxima mención en nuestras redes y para la temporada que viene en Malinalco.' },
  { red: 'contenido', prio: 18, icon: '📝', test: () => true, text: 'Agrega precios y una descripción con gancho a tu ficha: lo que mejor convierte vista en contacto.' },
]

// Rellena los textos dinámicos (ficha) según el caso.
function textoReco(item, c) {
  if (item.text) return item.text
  if (item.prio === 100) return `Completa tu ficha (${c.salud.score}/100): te falta ${c.salud.faltantes.slice(0, 2).join(' y ')}. Las fichas completas reciben hasta 3× más contactos.`
  if (item.prio === 92) return `Te ven (${c.tasa.vistas}) pero pocos te contactan (${c.tasa.pct}%). Cambia tu foto principal y agrega precios: suele ser lo que frena el clic.`
  if (item.prio === 48) return `Sube tus fotos faltantes (vas ${c.salud.nFotos}/${c.salud.maxFotos}): cada foto extra sube las vistas y el tiempo en tu ficha.`
  return ''
}

// Devuelve las recomendaciones aplicables AGRUPADAS por red (para la vista de
// detalle / solapa flotante). Cada red trae solo las que aplican a su caso.
export function recomendacionesPorRed(ctx, maxPorRed = 12) {
  const grupos = {}
  for (const item of RECOS_CATALOGO) {
    let aplica = false
    try { aplica = item.test(ctx) } catch { aplica = false }
    if (!aplica) continue
    const g = (grupos[item.red] = grupos[item.red] || [])
    g.push({ prio: item.prio, icon: item.icon, text: textoReco(item, ctx) })
  }
  for (const k of Object.keys(grupos)) {
    grupos[k] = grupos[k].sort((a, b) => b.prio - a.prio).slice(0, maxPorRed)
  }
  return grupos
}

// Resumen plano: las `max` más relevantes, con diversidad (máx. 1 por red salvo
// que falten). Para la tarjeta del panel y el correo.
export function recomendaciones(input, max = 3) {
  const ctx = input.wa !== undefined ? input : contextoRecos(input)
  const grupos = recomendacionesPorRed(ctx)
  const planas = []
  for (const red of Object.keys(grupos)) {
    for (const r of grupos[red]) planas.push({ ...r, red })
  }
  planas.sort((a, b) => b.prio - a.prio)
  // Primero una por red (diversidad), luego rellena por prioridad.
  const vistos = new Set()
  const top = []
  for (const r of planas) {
    if (top.length >= max) break
    if (vistos.has(r.red)) continue
    vistos.add(r.red)
    top.push(r)
  }
  for (const r of planas) {
    if (top.length >= max) break
    if (top.includes(r)) continue
    top.push(r)
  }
  return top.slice(0, max).map(({ icon, text }) => ({ icon, text }))
}

// ── 5b) Lectura del Consultor ───────────────────────────────────────────────
// El diferenciador BI: un párrafo narrativo que LEE los datos y le habla al
// dueño como un consultor. No es un dato suelto (eso lo da Google); es la
// interpretación + el siguiente paso. Rule-based, siempre coherente.
export function lecturaConsultor({ business, salud, tasa, roi, ranking }) {
  const b = business
  const vistasMes = delta(b.view_count, b.views_last_month)
  const frases = []

  // 1) Apertura: el pulso del mes (crecimiento de vistas).
  if (vistasMes > 0 && b.views_last_month) {
    const pct = Math.round((vistasMes / Math.max(1, b.views_last_month)) * 100)
    frases.push(`Este mes tu ficha creció ${pct > 0 ? `un ${pct}%` : ''} en visibilidad: ${vistasMes} personas nuevas te descubrieron en En Malinalco.`)
  } else if ((b.view_count || 0) > 0) {
    frases.push(`Llevas ${b.view_count} personas que han descubierto tu negocio en En Malinalco.`)
  } else {
    frases.push('Tu ficha acaba de arrancar. En cuanto empiece a recibir visitas, aquí te diré exactamente qué está funcionando y qué ajustar.')
  }

  // 2) El cuello de botella: conversión o salud de ficha.
  if (tasa && tasa.pct !== null && tasa.vistas >= 15 && tasa.pct < 5) {
    frases.push(`Pero ojo: de cada 100 que te ven, solo ${tasa.pct} te contactan. El cuello de botella está en tu ficha —casi siempre es la foto principal o que falta el precio—, no en el alcance.`)
  } else if (salud && salud.score < 70 && salud.faltantes.length) {
    frases.push(`Tu mayor oportunidad ahora es completar la ficha (vas ${salud.score}/100): te falta ${salud.faltantes.slice(0, 2).join(' y ')}. Las fichas completas convierten hasta 3× más.`)
  } else if (tasa && tasa.pct !== null && tasa.pct >= 7) {
    frases.push(`Y lo mejor: tu ficha convierte bien (${tasa.pct}% de quienes te ven te contactan). El motor funciona; ahora toca echarle más gente encima con redes.`)
  }

  // 3) Posición competitiva.
  if (ranking) {
    if (ranking.pos === 1) frases.push(`Vas en el #1 de tu categoría en el pueblo: eres el referente. Defiende ese lugar manteniendo fotos y promos frescas.`)
    else if (ranking.pos <= 3) frases.push(`Estás en el Top ${ranking.pos} de ${ranking.n} en tu categoría. Un empujón en redes y peleas el primer lugar.`)
    else frases.push(`Vas #${ranking.pos} de ${ranking.n} en tu categoría: hay techo para subir, y las recomendaciones de abajo son tu camino.`)
  }

  // 4) Cierre accionable (sin estimaciones de dinero).
  frases.push('Ataca lo de arriba esta semana y el próximo mes se nota. Yo te voy marcando el camino.')

  return frases.join(' ')
}

// ── 5c) Alertas proactivas ──────────────────────────────────────────────────
// Detecta lo urgente del mes y lo pone al frente. Tono 'alta' = atender ya.
export function alertas(ctx, max = 3) {
  const c = ctx
  const out = []
  const push = (prio, tono, icon, text) => out.push({ prio, tono, icon, text })

  const caida = (mes, base, nombre, consejo) => {
    if (base >= 8 && mes < 0 && Math.abs(mes) / base >= 0.25) {
      const pct = Math.round((Math.abs(mes) / base) * 100)
      push(90, 'alta', '⚠️', `Tus ${nombre} cayeron ${pct}% vs. el mes pasado. ${consejo}`)
    }
  }
  caida(c.igMes, (c.b.instagram_clicks_last_month || 0), 'clics a Instagram', 'Sube 1 reel esta semana para recuperar alcance.')
  caida(c.fbMes, (c.b.facebook_clicks_last_month || 0), 'clics a Facebook', 'Publica en 2–3 grupos de escapadas de la región.')
  caida(c.waMes, (c.b.whatsapp_clicks_last_month || 0), 'contactos por WhatsApp', 'Revisa que tu botón y tu número estén visibles y responde rápido.')

  if (!c.hasWA) push(95, 'alta', '📵', 'No tienes WhatsApp en tu ficha: es tu canal de venta #1. Agrégalo hoy.')
  if (c.tasa && c.tasa.pct !== null && c.tasa.vistas >= 20 && c.tasa.pct < 4) {
    push(80, 'alta', '🪫', `Te ven mucho pero casi nadie te contacta (${c.tasa.pct}%). Atiende tu foto principal y agrega precios.`)
  }
  if (c.salud && c.salud.score < 50) {
    push(70, 'media', '🧩', `Tu ficha está a medias (${c.salud.score}/100). Completarla es lo que más rápido sube tus contactos.`)
  }

  return out.sort((a, b) => b.prio - a.prio).slice(0, max)
}

// ── 5d) Meta del mes ────────────────────────────────────────────────────────
// Progreso de contactos del mes contra la meta que fija el dueño. Sin meta,
// sugiere una (el mes pasado +20%, mínimo 5).
export function metaProgreso(business) {
  const actual = contactosMes(business)
  const meta = business.meta_contactos || null
  const prevMes =
    (business.whatsapp_clicks_last_month || 0) + (business.phone_clicks_last_month || 0) + (business.maps_clicks_last_month || 0)
  // No podemos reconstruir los contactos del mes pasado (solo el corte), así que
  // la sugerencia se basa en el total del mes actual proyectado.
  const sugerida = Math.max(5, Math.round((actual || prevMes || 5) * 1.2))
  if (!meta) return { meta: null, actual, sugerida, pct: null }
  return { meta, actual, sugerida, pct: Math.min(100, Math.round((actual / meta) * 100)) }
}

// ── 5e) Mes vs. mes ─────────────────────────────────────────────────────────
export function mesVsMes(business) {
  const vMes = delta(business.view_count, business.views_last_month)
  const cMes = contactosMes(business)
  const vBase = business.views_last_month || 0
  const cBase =
    (business.whatsapp_clicks_last_month || 0) + (business.phone_clicks_last_month || 0) + (business.maps_clicks_last_month || 0)
  return {
    vistas: { mes: vMes, pct: vBase > 0 ? Math.round((vMes / vBase) * 100) : null },
    contactos: { mes: cMes, pct: cBase > 0 ? Math.round((cMes / cBase) * 100) : null },
  }
}

// ── 6) Agregadores de Fase 2 (sobre la tabla `events`) ──────────────────────
// Reciben el arreglo crudo de eventos del negocio y devuelven vistas listas.
// Cada evento: { kind, ref, country, region, created_at }. Puras, sin red.

const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Mapa de calor día (0=Dom..6=Sáb) × hora (0..23) de las interacciones.
export function heatmap(events = []) {
  const grid = Array.from({ length: 7 }, () => new Array(24).fill(0))
  let max = 0
  for (const e of events) {
    const d = new Date(e.created_at)
    if (isNaN(d)) continue
    const dow = d.getDay()
    const h = d.getHours()
    grid[dow][h] += 1
    if (grid[dow][h] > max) max = grid[dow][h]
  }
  // Mejor franja (día + bloque de 3h) para la recomendación.
  let mejor = null
  for (let dow = 0; dow < 7; dow++) {
    for (let h = 0; h <= 21; h++) {
      const suma = grid[dow][h] + grid[dow][h + 1] + grid[dow][h + 2]
      if (!mejor || suma > mejor.suma) mejor = { dow, h, suma }
    }
  }
  const mejorTexto = mejor && mejor.suma > 0
    ? `${DOW[mejor.dow]} de ${mejor.h}:00 a ${mejor.h + 3}:00`
    : null
  return { grid, max, dias: DOW, mejorTexto }
}

// Atribución: cuántas interacciones trajo cada origen (historia/evento/etc).
export function atribucion(events = []) {
  const acc = {}
  for (const e of events) {
    const ref = e.ref
    if (!ref) continue
    const [tipo, ...resto] = String(ref).split(':')
    const slug = resto.join(':')
    const key = ref
    acc[key] = acc[key] || { ref, tipo, slug, vistas: 0, contactos: 0 }
    if (e.kind === 'view') acc[key].vistas += 1
    else acc[key].contactos += 1
  }
  return Object.values(acc).sort((a, b) => (b.vistas + b.contactos) - (a.vistas + a.contactos))
}

// Origen geográfico aproximado (por región/estado). Top primero.
export function origenGeografico(events = []) {
  const acc = {}
  let total = 0
  for (const e of events) {
    if (e.kind !== 'view') continue
    const label = e.region || e.country || 'Desconocido'
    acc[label] = (acc[label] || 0) + 1
    total += 1
  }
  const filas = Object.entries(acc)
    .map(([label, n]) => ({ label, n, pct: total > 0 ? Math.round((n / total) * 100) : 0 }))
    .sort((a, b) => b.n - a.n)
  return { total, filas: filas.slice(0, 6) }
}

// Serie de tiempo: interacciones por día (últimos `dias` días).
export function serieTiempo(events = [], dias = 30) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const buckets = []
  const idx = {}
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoy)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    idx[key] = buckets.length
    buckets.push({ dia: key, vistas: 0, contactos: 0 })
  }
  for (const e of events) {
    const key = new Date(e.created_at).toISOString().slice(0, 10)
    if (idx[key] === undefined) continue
    if (e.kind === 'view') buckets[idx[key]].vistas += 1
    else buckets[idx[key]].contactos += 1
  }
  return buckets
}

// ── Formato de dinero (es-MX) ───────────────────────────────────────────────
export function pesos(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
  }).format(n || 0)
}
