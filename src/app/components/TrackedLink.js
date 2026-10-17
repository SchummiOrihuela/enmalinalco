'use client'

// Enlace que registra una interacción de alto valor (una "conversión") antes de
// navegar. Hace DOS cosas, ambas a prueba de fallos:
//
//   1) GA4  → dispara un evento con gtag para que la conversión sea VISIBLE en
//             Google Analytics (donde se mide el embudo). Sin esto, GA4 solo veía
//             visitas, no cuántas terminaban en un contacto real.
//   2) BD   → cuando es un contacto de negocio (bid + kind), incrementa el
//             contador del dashboard del dueño vía sendBeacon (fire-and-forget),
//             para que el conteo llegue aunque el navegador salte a WhatsApp.
//
// Props:
//   - bid, kind  → contacto de un negocio del directorio. Dispara el evento GA4
//                  'contacto_negocio' (param `metodo`) y el beacon a /api/track-contact.
//   - event      → nombre de evento GA4 arbitrario (p. ej. 'reserva_directa_click')
//                  para enlaces de alta intención que no son un negocio del directorio
//                  (como el botón de reserva directa a canteraycalma.com).
//   - eventParams→ parámetros extra para ese evento.
//
// El tracking NUNCA rompe el clic: si algo falla, el enlace navega igual.
export default function TrackedLink({ bid, kind, event, eventParams, children, ...props }) {
  const onClick = () => {
    // 1) Evento a GA4 (visible en Analytics). gtag lo inyecta @next/third-parties.
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        if (bid && kind) {
          window.gtag('event', 'contacto_negocio', { metodo: kind, business_id: bid })
        }
        if (event) {
          window.gtag('event', event, eventParams || {})
        }
      }
    } catch {
      /* el tracking nunca rompe el clic */
    }

    // 2) Beacon a la base (contador del dashboard del negocio). Solo para contactos.
    if (bid && kind) {
      try {
        const payload = JSON.stringify({ id: bid, kind })
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          navigator.sendBeacon('/api/track-contact', new Blob([payload], { type: 'application/json' }))
        } else {
          fetch('/api/track-contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {})
        }
      } catch {
        /* el tracking nunca rompe el clic */
      }
    }
  }

  return (
    <a {...props} onClick={onClick}>
      {children}
    </a>
  )
}
