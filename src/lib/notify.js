// Avisos por correo al dueño del directorio (soporte@enmalinalco.com).
//
// Usa Resend por su API REST (sin SDK). Si RESEND_API_KEY no está
// configurada, no hace nada y no rompe el flujo: los avisos simplemente
// quedan "apagados" hasta que se configure.
//
// Variables de entorno:
//   RESEND_API_KEY   — clave de Resend (obligatoria para enviar)
//   NOTIFY_FROM       — remitente verificado, ej. "En Malinalco <avisos@send.enmalinalco.com>"
//   NOTIFY_TO         — destinatario, por defecto soporte@enmalinalco.com

const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFY_FROM = process.env.NOTIFY_FROM || 'En Malinalco <avisos@enmalinalco.com>'
const NOTIFY_TO = process.env.NOTIFY_TO || 'soporte@enmalinalco.com'

export async function sendOwnerEmail(subject, html) {
  if (!RESEND_API_KEY) {
    console.log('[notify] RESEND_API_KEY ausente, aviso omitido:', subject)
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: NOTIFY_FROM, to: NOTIFY_TO, subject, html }),
    })
    if (!res.ok) {
      console.error('[notify] Resend falló:', res.status, await res.text())
    }
  } catch (err) {
    // Nunca dejamos que un fallo de aviso tumbe el webhook de pago.
    console.error('[notify] Error enviando aviso:', err.message)
  }
}

export function nuevoClienteEmail({ nombre, tier }) {
  return {
    subject: `🎉 Nuevo cliente en el directorio: ${nombre}`,
    html: `<p>¡Felicidades! Un negocio acaba de contratar.</p>
<ul>
  <li><strong>Negocio:</strong> ${nombre}</li>
  <li><strong>Plan:</strong> ${tier || 'sin especificar'}</li>
  <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</li>
</ul>
<p>Ya aparece activo en enmalinalco.com.</p>`,
  }
}

export function clienteEnGraciaEmail({ nombre, graciaHasta }) {
  const fecha = new Date(graciaHasta).toLocaleDateString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: 'numeric',
    month: 'long',
  })
  return {
    subject: `⚠️ Suscripción cancelada: ${nombre} (en periodo de gracia)`,
    html: `<p>Se canceló la suscripción de un negocio. <strong>No desapareció del directorio:</strong> sigue visible durante el periodo de gracia.</p>
<ul>
  <li><strong>Negocio:</strong> ${nombre}</li>
  <li><strong>Visible hasta:</strong> ${fecha}</li>
</ul>
<p>Si no renueva antes de esa fecha, su ficha se ocultará automáticamente. Buen momento para contactarlo.</p>`,
  }
}
