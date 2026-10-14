'use client'

// Enlace que registra un clic de contacto antes de navegar. Usa sendBeacon
// (fire-and-forget) para que el conteo llegue aunque el navegador cambie de
// app/pestaña al abrir WhatsApp, el marcador o el mapa. Si falla, no estorba:
// el enlace funciona igual.
export default function TrackedLink({ bid, kind, children, ...props }) {
  const onClick = () => {
    if (!bid || !kind) return
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

  return (
    <a {...props} onClick={onClick}>
      {children}
    </a>
  )
}
