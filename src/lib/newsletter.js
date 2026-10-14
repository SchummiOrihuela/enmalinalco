// Arma el HTML del newsletter mensual "El finde ideal en Malinalco".
// Reúne: qué está abierto, próximos eventos/historias y un negocio destacado.
import { createHmac } from 'crypto'

const SITE = 'https://enmalinalco.com'

// Token de baja: evita que alguien dé de baja correos ajenos.
export function tokenBaja(email, secret) {
  return createHmac('sha256', secret || 'x').update(email.toLowerCase()).digest('hex').slice(0, 24)
}

export function urlBaja(email, secret) {
  return `${SITE}/api/unsubscribe?email=${encodeURIComponent(email)}&t=${tokenBaja(email, secret)}`
}

function card(inner) {
  return `<div style="background:#F5ECD7;border-radius:14px;padding:16px 18px;margin:0 0 12px">${inner}</div>`
}

// data: { abiertos:[{name,slug,category}], destacado:{name,slug,category,tagline?}, articulos:[{titulo,slug,excerpt}] }
export function renderCampaña(data, unsubUrl) {
  const mes = new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  const abiertos = (data.abiertos || []).slice(0, 6).map((b) =>
    `<tr>
      <td style="padding:7px 0;border-bottom:1px solid #EADFC6">
        <a href="${SITE}/negocio/${b.slug}" style="color:#1C3B28;font-weight:700;font-size:15px;text-decoration:none">${b.name}</a>
        <span style="color:#8A6D2F;font-size:12px"> · ${b.category}</span>
      </td>
      <td style="padding:7px 0;border-bottom:1px solid #EADFC6;text-align:right;white-space:nowrap">
        <span style="color:#3A8C4E;font-size:12px;font-weight:700">● abierto</span>
      </td>
    </tr>`
  ).join('')

  const articulos = (data.articulos || []).slice(0, 3).map((a) =>
    card(`<a href="${SITE}/historias/${a.slug}" style="color:#1C3B28;font-weight:800;font-size:16px;text-decoration:none">${a.titulo}</a>
      <p style="margin:6px 0 0;color:#4A4034;font-size:13.5px;line-height:1.5">${a.excerpt || ''}</p>`)
  ).join('')

  const destacado = data.destacado
    ? card(`<p style="margin:0 0 4px;color:#B0863A;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Negocio destacado</p>
       <a href="${SITE}/negocio/${data.destacado.slug}" style="color:#1C3B28;font-weight:800;font-size:17px;text-decoration:none">${data.destacado.name}</a>
       <p style="margin:4px 0 0;color:#8A6D2F;font-size:13px">${data.destacado.category || ''}</p>`)
    : ''

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#F6F0E0;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:580px;margin:0 auto;padding:28px 22px">
    <p style="color:#B0863A;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 4px">El finde ideal en Malinalco</p>
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#1C3B28;margin:0 0 2px">Lo mejor del pueblo</h1>
    <p style="color:#6B6052;font-size:14px;margin:0 0 22px;text-transform:capitalize">${mes}</p>

    ${articulos ? `<h2 style="font-family:Georgia,serif;font-size:20px;color:#1C3B28;margin:0 0 12px">🎉 Qué viene en el pueblo</h2>${articulos}` : ''}

    ${destacado}

    ${abiertos ? `<h2 style="font-family:Georgia,serif;font-size:20px;color:#1C3B28;margin:24px 0 10px">🟢 Abierto para tu visita</h2>
      <table style="width:100%;border-collapse:collapse">${abiertos}</table>
      <p style="margin:14px 0 0;text-align:center">
        <a href="${SITE}/mapa" style="display:inline-block;background:linear-gradient(180deg,#E7C86A,#DCB24A);color:#25201A;font-weight:700;font-size:14px;padding:11px 22px;border-radius:9999px;text-decoration:none">Ver todo en el mapa 🗺️</a>
      </p>` : ''}

    <p style="margin:26px 0 0;color:#4A4034;font-size:14px;line-height:1.6">
      ¿Planeas venir? Encuentra <a href="${SITE}/categoria/hospedaje" style="color:#B0863A;font-weight:700">dónde hospedarte</a> y arma tu finde con nuestras <a href="${SITE}/historias" style="color:#B0863A;font-weight:700">historias del pueblo</a>.
    </p>

    <p style="margin:28px 0 0;color:#9A8E7C;font-size:12px;line-height:1.5;border-top:1px solid #EADFC6;padding-top:16px">
      En Malinalco · El directorio del Pueblo Mágico<br/>
      <a href="${unsubUrl}" style="color:#9A8E7C">Darme de baja</a>
    </p>
  </div></body></html>`

  return { subject: `El finde ideal en Malinalco · ${mes} 🌿`, html }
}
