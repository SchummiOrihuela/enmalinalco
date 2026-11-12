'use client'

// 🐆 Ojo de Jaguar — la inteligencia de negocio de En Malinalco.
// "Lo que Google Maps no te puede decir". Concentra, en una capa premium:
//   - Lectura del Consultor: un párrafo que LEE los datos y te habla como asesor.
//   - 3 acciones de la semana (lo que haría tu consultor).
//   - KPIs (salud, tasa, ranking, ROI) y recomendaciones específicas por red.
//   - Fase 2: tendencia, mapa de calor día×hora, origen geográfico y atribución.
//   - Sello vs. Google y exportar el reporte para presumirlo / usarlo en ventas.
// El jaguar (Ocēlōtl) ve en la oscuridad lo que nadie ve: justo lo que Google no da.
import { useState, useEffect, Fragment } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import OjoJaguar, { ojoJaguarSVG } from '@/app/components/OjoJaguar'

const RED_META = {
  instagram: { label: 'Instagram' },
  facebook: { label: 'Facebook' },
  whatsapp: { label: 'WhatsApp' },
  ficha: { label: 'Tu ficha' },
  contenido: { label: 'Contenido' },
}

const ORO = '#DCB24A'

// — Iconos de marca (SVG oficiales simplificados) para las redes —
function BrandIcon({ red, size = 17 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, style: { display: 'block', flexShrink: 0 } }
  if (red === 'instagram') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#FEDA75" /><stop offset="0.35" stopColor="#FA7E1E" />
            <stop offset="0.6" stopColor="#D62976" /><stop offset="0.85" stopColor="#962FBF" /><stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <path fill="url(#igGrad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    )
  }
  if (red === 'facebook') {
    return (
      <svg {...common}>
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }
  if (red === 'whatsapp') {
    return (
      <svg {...common}>
        <path fill="#25D366" d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.558 5.306l-.999 3.648 3.93-1.033zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.15-.174.199-.298.298-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.84 12.84 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
      </svg>
    )
  }
  if (red === 'ficha') {
    return (
      <svg {...common} fill="none" stroke={ORO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M7 9h6M7 13h10M7 17h7" />
      </svg>
    )
  }
  // contenido (calendario)
  return (
    <svg {...common} fill="none" stroke={ORO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  )
}

// — Iconos premium para exportar (duotono) —
const IconImagen = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" fill={ORO} opacity="0.2" />
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="8" cy="9.5" r="1.9" fill={ORO} />
    <path d="M3.5 18l5-5 3.2 3.2L15.5 12l5 5.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IconDescarga = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 2.5h8.5L19 7v13.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" fill={ORO} opacity="0.2" />
    <path d="M6 2.5h8.5L19 7v13.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 2.5V7h4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 10.5v6M9.5 14l2.5 2.5L14.5 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Kpi({ label, value, sub, accent = ORO }) {
  return (
    <div style={{
      flex: '1 1 180px', minWidth: 0, padding: '16px 18px', borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(220,178,74,0.12), rgba(16,28,18,0.5))',
      border: '1px solid rgba(220,178,74,0.22)', borderLeft: `4px solid ${accent}`, color: '#F6F0E0',
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(246,240,224,0.62)' }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '27px', fontWeight: 600, marginTop: '4px' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', opacity: 0.82, lineHeight: 1.4, marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

const H2 = ({ children }) => (
  <h3 style={{ margin: '26px 0 12px', fontSize: '12.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: ORO, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ width: '20px', height: '1px', background: ORO, opacity: 0.6 }} />{children}
  </h3>
)

function Tendencia({ serie }) {
  const max = Math.max(1, ...serie.map((d) => d.vistas))
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '72px' }}>
        {serie.map((d, i) => (
          <div key={i} title={`${d.dia}: ${d.vistas} vistas, ${d.contactos} contactos`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ height: `${(d.vistas / max) * 100}%`, background: 'linear-gradient(180deg,#E7C86A,#3A6B47)', borderRadius: '3px 3px 0 0', minHeight: d.vistas ? '2px' : 0 }} />
            {d.contactos > 0 && <div style={{ height: '3px', background: ORO, marginTop: '1px' }} />}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '6px' }}>Últimos 30 días · barra = vistas · línea oro = contactos</div>
    </div>
  )
}

function Heatmap({ hm }) {
  const color = (n) => {
    if (!n) return 'rgba(246,240,224,0.06)'
    const t = n / hm.max
    const r = Math.round(90 + t * 130), g = Math.round(120 + t * 60), b = Math.round(60 - t * 20)
    return `rgb(${r},${g},${b})`
  }
  return (
    <div>
      {hm.mejorTexto && (
        <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#F6F0E0' }}>
          🔥 Tu mejor franja: <strong>{hm.mejorTexto}</strong>. Publica tus promos y ten personal de más ahí.
        </p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '34px repeat(24, 1fr)', gap: '2px', minWidth: '520px' }}>
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} style={{ fontSize: '8px', textAlign: 'center', opacity: 0.5, color: '#F6F0E0' }}>{h % 6 === 0 ? h : ''}</div>
          ))}
          {hm.grid.map((fila, d) => (
            <Fragment key={`row-${d}`}>
              <div style={{ fontSize: '10px', color: '#F6F0E0', opacity: 0.7, display: 'flex', alignItems: 'center' }}>{hm.dias[d]}</div>
              {fila.map((n, h) => (
                <div key={`${d}-${h}`} title={`${hm.dias[d]} ${h}:00 — ${n}`} style={{ aspectRatio: '1', borderRadius: '2px', background: color(n) }} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

const Vacio = ({ children }) => (
  <p style={{ margin: 0, fontSize: '13px', color: 'rgba(246,240,224,0.6)', lineHeight: 1.5 }}>{children}</p>
)

// Comparativo: qué das tú que Google Maps no.
const VS_GOOGLE = [
  'Une Instagram, Facebook y WhatsApp en un solo tablero',
  'Te compara contra tu categoría en Malinalco, no contra todo México',
  'Te dice qué historia o evento te trajo cada cliente',
  'Lee tus datos con IA y te dice qué hacer esta semana',
  'Te da recomendaciones accionables, no solo números',
]

// Exporta el reporte a una ventana imprimible (el cliente guarda PDF o screenshot).
function exportarReporte({ negocio, lectura, acciones, salud, tasa, ranking, mom, fase2 }) {
  const fecha = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
  const kpi = (l, v) => `<div style="flex:1 1 150px;border:1px solid #E4D7B4;border-left:4px solid #B98A16;border-radius:12px;padding:12px 14px"><div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A7A4F;font-weight:700">${l}</div><div style="font-family:Georgia,serif;font-size:24px;color:#1C3B28;font-weight:700;margin-top:2px">${v}</div></div>`
  const vp = mom && mom.vistas.pct !== null ? mom.vistas.pct : null
  const kpis = [
    salud ? kpi('Salud de ficha', `${salud.score}/100`) : '',
    tasa && tasa.pct !== null ? kpi('Tasa de contacto', `${tasa.pct}%`) : '',
    ranking ? kpi('Lugar en categoría', `#${ranking.pos} de ${ranking.n}`) : '',
    vp !== null ? kpi('Vistas vs mes pasado', `${vp > 0 ? '▲' : vp < 0 ? '▼' : ''} ${Math.abs(vp)}%`) : '',
  ].join('')
  const accs = (acciones || []).map((a, i) => `<li style="margin:0 0 8px;font-size:14px;color:#2A2016">${a.icon} ${a.text}</li>`).join('')
  const geo = fase2 && fase2.geo && fase2.geo.total > 0
    ? `<h3 style="color:#B98A16;font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin:20px 0 8px">¿De dónde vienen?</h3>` +
      fase2.geo.filas.map((g) => `<div style="font-size:13px;color:#2A2016;margin:3px 0">${g.label} — <strong>${g.pct}%</strong></div>`).join('')
    : ''
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ojo de Jaguar — ${negocio || 'Mi negocio'}</title></head>
  <body style="margin:0;background:#F6F0E0;font-family:Arial,Helvetica,sans-serif;color:#2A2016">
    <div style="max-width:720px;margin:0 auto;padding:36px 28px">
      <div style="display:flex;align-items:center;gap:8px;color:#B98A16;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">${ojoJaguarSVG(20, 'rep')} Ojo de Jaguar · En Malinalco</div>
      <h1 style="font-family:Georgia,serif;font-size:30px;color:#1C3B28;margin:6px 0 2px">${negocio || 'Mi negocio'}</h1>
      <div style="color:#6B6052;font-size:13px;margin-bottom:4px">Reporte de inteligencia · ${fecha}</div>
      <div style="color:#8A7A4F;font-size:12px;font-style:italic;margin-bottom:20px">Lo que Google Maps no te puede decir</div>
      ${lectura ? `<div style="background:#EAF4EC;border:1px solid #CFE3D4;border-left:4px solid #3A6B47;border-radius:12px;padding:16px 18px;font-size:15px;line-height:1.6;color:#223">${lectura}<div style="margin-top:8px;font-size:12px;color:#6B6052;font-style:italic">— Tu consultor En Malinalco</div></div>` : ''}
      <h3 style="color:#B98A16;font-size:13px;text-transform:uppercase;letter-spacing:.08em;margin:22px 0 8px">Tus 3 acciones de la semana</h3>
      <ol style="padding-left:18px;margin:0">${accs}</ol>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0">${kpis}</div>
      ${geo}
      <p style="margin:26px 0 0;color:#9A8E7C;font-size:11px">Valores de ingreso estimados con supuestos conservadores. En Malinalco · El directorio del Pueblo Mágico.</p>
    </div>
    <script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
  </body></html>`
  const w = window.open('', '_blank')
  if (!w) { alert('Permite las ventanas emergentes para descargar tu reporte.'); return }
  w.document.open(); w.document.write(html); w.document.close()
}

// Genera una imagen PNG lista para compartir (WhatsApp/IG) con los números clave.
function descargarImagen({ negocio, salud, tasa, ranking, mom, lectura }) {
  const W = 1080, H = 1080
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const x = cv.getContext('2d')
  // Fondo obsidiana con halo oro.
  const g = x.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#1E3322'); g.addColorStop(1, '#101E14')
  x.fillStyle = g; x.fillRect(0, 0, W, H)
  const halo = x.createRadialGradient(170, -40, 40, 170, -40, 700)
  halo.addColorStop(0, 'rgba(220,178,74,0.30)'); halo.addColorStop(1, 'rgba(220,178,74,0)')
  x.fillStyle = halo; x.fillRect(0, 0, W, H)

  x.textBaseline = 'top'
  dibujarOjo(x, 116, 104, 32)
  x.fillStyle = '#DCB24A'; x.font = '700 26px Georgia, serif'
  x.fillText('OJO DE JAGUAR · EN MALINALCO', 170, 92)
  x.fillStyle = '#F6F0E0'; x.font = '600 58px Georgia, serif'
  x.fillText((negocio || 'Mi negocio').slice(0, 26), 84, 170)
  x.fillStyle = 'rgba(246,240,224,0.7)'; x.font = 'italic 24px sans-serif'
  x.fillText('Lo que Google Maps no te puede decir', 84, 240)

  // Tarjetas KPI (2×2).
  const vp = mom && mom.vistas.pct !== null ? mom.vistas.pct : null
  const cards = [
    salud ? ['Salud de ficha', `${salud.score}/100`] : null,
    tasa && tasa.pct !== null ? ['Tasa de contacto', `${tasa.pct}%`] : null,
    ranking ? ['Lugar en categoría', `#${ranking.pos} de ${ranking.n}`] : null,
    vp !== null ? ['Vistas vs mes pasado', `${vp > 0 ? '▲' : vp < 0 ? '▼' : ''} ${Math.abs(vp)}%`] : null,
  ].filter(Boolean)
  const cw = 440, ch = 180, gx = 84, gy = 320, gap = 32
  cards.slice(0, 4).forEach((c, i) => {
    const cx = gx + (i % 2) * (cw + gap), cy = gy + Math.floor(i / 2) * (ch + gap)
    x.fillStyle = 'rgba(220,178,74,0.12)'; roundRect(x, cx, cy, cw, ch, 20); x.fill()
    x.fillStyle = '#DCB24A'; x.fillRect(cx, cy, 6, ch)
    x.fillStyle = 'rgba(246,240,224,0.7)'; x.font = '600 22px sans-serif'; x.fillText(c[0].toUpperCase(), cx + 34, cy + 30)
    x.fillStyle = '#F6F0E0'; x.font = '700 62px Georgia, serif'; x.fillText(c[1], cx + 34, cy + 72)
  })

  // Lectura del consultor (primera frase).
  if (lectura) {
    const frase = lectura.split('. ')[0] + '.'
    x.fillStyle = 'rgba(143,211,160,0.95)'; x.font = '700 22px sans-serif'
    x.fillText('🔎 LA LECTURA DE TU CONSULTOR', 84, 760)
    x.fillStyle = '#F3EEE2'; x.font = '30px sans-serif'
    wrapText(x, frase, 84, 800, W - 168, 42)
  }
  x.fillStyle = 'rgba(246,240,224,0.5)'; x.font = '22px sans-serif'
  x.fillText('en Malinalco · El directorio del Pueblo Mágico', 84, 1010)

  const a = document.createElement('a')
  a.download = `ojo-de-jaguar-${(negocio || 'negocio').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
  a.href = cv.toDataURL('image/png'); a.click()
}
function roundRect(x, px, py, w, h, r) {
  x.beginPath(); x.moveTo(px + r, py)
  x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r)
  x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath()
}
// Dibuja el Ojo de Jaguar en canvas (para la imagen compartible).
function dibujarOjo(x, cx, cy, r) {
  const aw = r * 2.7, ah = r * 2.05
  x.save()
  // Almendra (párpados)
  x.beginPath()
  x.moveTo(cx - aw / 2, cy)
  x.quadraticCurveTo(cx, cy - ah / 2, cx + aw / 2, cy)
  x.quadraticCurveTo(cx, cy + ah / 2, cx - aw / 2, cy)
  x.closePath()
  x.fillStyle = '#08120B'; x.fill()
  x.lineWidth = Math.max(2, r * 0.13); x.strokeStyle = '#DCB24A'; x.stroke()
  // Iris encendido
  const ig = x.createRadialGradient(cx, cy - r * 0.12, r * 0.2, cx, cy, r)
  ig.addColorStop(0, '#FFF3C0'); ig.addColorStop(0.4, '#F0D77A'); ig.addColorStop(0.85, '#C79A32'); ig.addColorStop(1, '#6E4A0E')
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fillStyle = ig; x.fill()
  // Fibras del iris
  x.save(); x.beginPath(); x.arc(cx, cy, r * 0.94, 0, Math.PI * 2); x.clip()
  x.strokeStyle = 'rgba(110,74,14,0.7)'; x.lineWidth = Math.max(1, r * 0.04)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2
    x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); x.stroke()
  }
  x.restore()
  // Aro brillante
  x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.lineWidth = r * 0.07; x.strokeStyle = 'rgba(255,243,192,0.8)'; x.stroke()
  // Pupila vertical
  x.beginPath(); x.ellipse(cx, cy, r * 0.25, r * 0.9, 0, 0, Math.PI * 2); x.fillStyle = '#06100A'; x.fill()
  // Destello
  x.beginPath(); x.arc(cx - r * 0.26, cy - r * 0.46, r * 0.15, 0, Math.PI * 2); x.fillStyle = '#FFFBEF'; x.fill()
  x.restore()
}
function wrapText(x, text, px, py, maxW, lh) {
  const words = text.split(' '); let line = '', yy = py
  for (const w of words) {
    const test = line + w + ' '
    if (x.measureText(test).width > maxW && line) { x.fillText(line.trim(), px, yy); line = w + ' '; yy += lh }
    else line = test
  }
  x.fillText(line.trim(), px, yy)
}

export default function InsightsDrawer({ insights }) {
  const [open, setOpen] = useState(false)
  const [red, setRed] = useState(null)
  const { tier, salud, tasa, ranking, recosPorRed, fase2, lectura, acciones, avisos, mom, negocio, negocioId } = insights
  const [meta, setMeta] = useState(insights.meta)
  const [metaInput, setMetaInput] = useState('')
  const [editMeta, setEditMeta] = useState(false)
  const [savingMeta, setSavingMeta] = useState(false)

  async function guardarMeta() {
    const n = parseInt(metaInput, 10)
    if (!n || n < 1) return
    setSavingMeta(true)
    const supabase = createClient()
    const { error } = await supabase.from('businesses').update({ meta_contactos: n }).eq('id', negocioId)
    setSavingMeta(false)
    if (!error) {
      const actual = meta?.actual || 0
      setMeta({ meta: n, actual, sugerida: meta?.sugerida, pct: Math.min(100, Math.round((actual / n) * 100)) })
      setEditMeta(false)
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const redes = recosPorRed ? Object.keys(recosPorRed).filter((k) => recosPorRed[k]?.length) : []
  const redActiva = red && redes.includes(red) ? red : redes[0]

  // Salud: enfoca el mensaje en aprovechar el plan que ya pagas.
  const saludSub = salud
    ? (salud.nFotos < salud.maxFotos
        ? `Te falta subir ${salud.maxFotos - salud.nFotos} fotos: usas ${salud.nFotos} de las ${salud.maxFotos} de tu plan. Maximiza lo que ya pagas.`
        : (salud.faltantes.length ? `Te falta: ${salud.faltantes.slice(0, 2).join(', ')}` : '¡Ficha completa!'))
    : null

  // Tasa: dolor + remedio con proyección honesta (al mismo ritmo de conversión).
  const tasaSub = (() => {
    if (!tasa || tasa.pct === null) return null
    const conv = tasa.vistas > 0 ? tasa.contactos / tasa.vistas : 0
    const extra = 150
    const nuevos = Math.max(1, Math.round(extra * conv))
    return `${tasa.contactos} contactos de ${tasa.vistas} vistas. Si sumas ~${extra} visitas más, al mismo ritmo serían ~${nuevos} contactos nuevos: súbele a redes.`
  })()

  // Vistas vs. mes pasado + a qué se debe.
  const vPct = mom && mom.vistas.pct !== null ? mom.vistas.pct : null
  const vistasRazon = vPct === null ? null
    : vPct > 0 ? 'Subió: tus posts y nuestras historias te trajeron gente nueva.'
    : vPct < 0 ? 'Bajó: súbele a redes esta semana (un reel, un post) para recuperar.'
    : 'Estable respecto al mes pasado.'

  return (
    <>
      {/* Animaciones premium: latido del botón y glow de la lectura */}
      <style>{`
        @keyframes ojoLatido {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220,178,74,0.0), 0 6px 22px rgba(0,0,0,0.22); transform: scale(1); }
          50%      { box-shadow: 0 0 26px 3px rgba(220,178,74,0.5), 0 6px 22px rgba(0,0,0,0.22); transform: scale(1.012); }
        }
        @keyframes ojoChip { 0%,100% { opacity: .65 } 50% { opacity: 1 } }
        @keyframes ojoGlow {
          0%, 100% { border-color: rgba(124,182,137,0.28); box-shadow: 0 0 0 0 rgba(143,211,160,0); }
          50%      { border-color: rgba(143,211,160,0.65); box-shadow: 0 0 20px -2px rgba(143,211,160,0.35); }
        }
        .ojo-btn:hover { filter: brightness(1.1); animation-play-state: paused; transform: scale(1.025); }
        @keyframes ventajaShine { 0% { background-position: -140% 0; } 100% { background-position: 240% 0; } }
        @keyframes ventajaGlow {
          0%, 100% { box-shadow: 0 14px 44px rgba(0,0,0,0.35), 0 0 0 0 rgba(220,178,74,0); }
          50%      { box-shadow: 0 14px 44px rgba(0,0,0,0.35), 0 0 34px -4px rgba(220,178,74,0.45); }
        }
        .ventaja-card { animation: ventajaGlow 3.4s ease-in-out infinite; }
        .ventaja-top { background: linear-gradient(90deg, transparent, #E7C86A, #DCB24A, #E7C86A, transparent); background-size: 220% 100%; animation: ventajaShine 3.2s linear infinite; }
        .ventaja-title {
          background: linear-gradient(92deg, #F6EBC7 0%, #E7C86A 45%, #DCB24A 70%, #F6EBC7 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
        }
      `}</style>

      {/* Botón de acceso premium — palpita e invita con el gancho de IA */}
      <button onClick={() => setOpen(true)} className="ojo-btn" style={{
        marginTop: '14px', width: '100%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap',
        padding: '17px 18px', borderRadius: '16px', border: '1px solid rgba(220,178,74,0.6)',
        background: 'linear-gradient(135deg, rgba(220,178,74,0.26), rgba(16,28,18,0.6))',
        color: '#F6F0E0', fontSize: '16px', fontWeight: 800, fontFamily: 'inherit',
        letterSpacing: '0.01em', animation: 'ojoLatido 2.2s ease-in-out infinite',
      }}>
        <OjoJaguar size={30} style={{ filter: 'drop-shadow(0 2px 6px rgba(220,178,74,0.4))' }} />
        <span>Ojo de Jaguar</span>
        <span style={{
          fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#25201A',
          background: 'linear-gradient(180deg,#E7C86A,#DCB24A)', padding: '3px 9px', borderRadius: '9999px',
          animation: 'ojoChip 1.8s ease-in-out infinite',
        }}>✨ IA + DATOS</span>
        <span style={{ width: '100%', textAlign: 'center', fontSize: '12.5px', fontWeight: 500, opacity: 0.82 }}>
          Google cuenta. Nosotros entendemos. Tú vendes.
        </span>
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(6,12,8,0.72)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4vh 16px', overflowY: 'auto',
        }}>
          {/* Cerrar flotante — siempre accesible al hacer scroll en móvil */}
          <button onClick={() => setOpen(false)} aria-label="Cerrar" style={{
            position: 'fixed', top: '14px', right: '14px', zIndex: 1002, width: '42px', height: '42px', borderRadius: '50%',
            cursor: 'pointer', border: '1px solid rgba(246,240,224,0.3)', background: 'rgba(8,16,10,0.72)',
            backdropFilter: 'blur(6px)', color: '#F6F0E0', fontSize: '19px', lineHeight: 1,
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}>✕</button>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '100%', maxWidth: '940px', borderRadius: '22px',
            background: 'linear-gradient(180deg,#1E3322,#121E14)',
            border: '1px solid rgba(220,178,74,0.28)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            color: '#F6F0E0', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            {/* HERO — no sticky: en móvil ocupa menos y se va al hacer scroll */}
            <div style={{
              borderRadius: '22px 22px 0 0',
              padding: 'clamp(16px, 4.5vw, 20px) clamp(16px, 4.5vw, 22px)', borderBottom: '1px solid rgba(220,178,74,0.2)',
              background: 'radial-gradient(600px 180px at 10% -40%, rgba(220,178,74,0.22), transparent 70%), linear-gradient(180deg,#17301E,#1E3322)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(11px, 3vw, 14px)', minWidth: 0 }}>
                <OjoJaguar size={46} style={{ filter: 'drop-shadow(0 3px 8px rgba(220,178,74,0.45))', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(20px, 5.5vw, 23px)', fontWeight: 600, letterSpacing: '-0.01em' }}>Ojo de Jaguar</div>
                  <div style={{ fontSize: '11.5px', color: ORO, fontWeight: 700, letterSpacing: '0.04em' }}>Lo que Google, ni en sueños te daría</div>
                  {negocio && <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>{negocio}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {tier >= 3 && (
                  <>
                    <button onClick={() => descargarImagen(insights)} title="Descargar imagen para compartir" style={{
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                      border: '1px solid rgba(220,178,74,0.5)', background: 'rgba(220,178,74,0.14)', color: '#F6F0E0',
                    }}><IconImagen /> Imagen</button>
                    <button onClick={() => exportarReporte(insights)} title="Descargar / imprimir (PDF)" style={{
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                      border: '1px solid rgba(220,178,74,0.5)', background: 'rgba(220,178,74,0.14)', color: '#F6F0E0',
                    }}><IconDescarga /> PDF</button>
                  </>
                )}
              </div>
            </div>

            <div style={{ padding: 'clamp(16px, 4.5vw, 24px) clamp(16px, 4.5vw, 24px) 28px' }}>
              {/* ALERTAS PROACTIVAS */}
              {avisos && avisos.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {avisos.map((a, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 15px', borderRadius: '13px',
                      background: a.tono === 'alta' ? 'rgba(191,80,40,0.16)' : 'rgba(220,178,74,0.12)',
                      border: `1px solid ${a.tono === 'alta' ? 'rgba(220,120,74,0.45)' : 'rgba(220,178,74,0.3)'}`,
                      fontSize: '13.5px', lineHeight: 1.45, fontWeight: 600,
                    }}>
                      <span style={{ fontSize: '17px' }}>{a.icon}</span><span>{a.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* LECTURA DEL CONSULTOR — palpita para llamar la atención */}
              {lectura && (
                <div style={{
                  padding: '18px 20px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(124,182,137,0.16), rgba(16,28,18,0.4))',
                  border: '1px solid rgba(124,182,137,0.3)', borderLeft: '4px solid #6FB880',
                  animation: 'ojoGlow 2.8s ease-in-out infinite',
                }}>
                  <div style={{ fontSize: '11.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8FD3A0', fontWeight: 800, marginBottom: '8px' }}>
                    🔎 La lectura de tu consultor · IA + datos
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'rgba(243,238,226,0.75)', lineHeight: 1.5 }}>
                    Cruzamos tus números con Inteligencia Artificial para decirte no solo qué pasó, sino <strong>qué hacer esta semana</strong> para vender más.
                  </p>
                  <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.65, color: '#F3EEE2', fontWeight: 500 }}>{lectura}</p>
                  <div style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic', opacity: 0.7 }}>— Tu consultor En Malinalco</div>
                </div>
              )}

              {/* 3 ACCIONES DE LA SEMANA */}
              {acciones && acciones.length > 0 && (
                <>
                  <H2>Tus 3 acciones de la semana</H2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {acciones.map((a, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '14px', alignItems: 'center', padding: '13px 16px', borderRadius: '14px',
                        background: 'rgba(220,178,74,0.08)', border: '1px solid rgba(220,178,74,0.22)',
                      }}>
                        <div style={{
                          flexShrink: 0, width: '30px', height: '30px', borderRadius: '50%', display: 'grid', placeItems: 'center',
                          background: 'linear-gradient(135deg,#E7C86A,#B98A16)', color: '#1C2E1E', fontWeight: 800, fontFamily: "'Fraunces', Georgia, serif",
                        }}>{i + 1}</div>
                        <div style={{ fontSize: '14px', lineHeight: 1.5 }}><span style={{ marginRight: '6px' }}>{a.icon}</span>{a.text}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* KPIs */}
              <H2>Tus números</H2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {salud && (
                  <Kpi label="Salud de tu ficha" value={`${salud.score}/100`} accent={salud.score >= 85 ? '#3E9E59' : salud.score >= 60 ? ORO : '#BF5028'}
                    sub={saludSub} />
                )}
                {tasa && tasa.pct !== null && (
                  <Kpi label="Tasa de contacto" value={`${tasa.pct}%`} sub={tasaSub} />
                )}
                {ranking && (
                  <Kpi label="Tu lugar en la categoría" value={`#${ranking.pos} de ${ranking.n}`} accent={ranking.pos === 1 ? '#3E9E59' : ORO}
                    sub={ranking.pos === 1 ? '¡Primer lugar del pueblo!' : 'Por vistas en tu categoría'} />
                )}
                {vPct !== null && (
                  <Kpi
                    label="Vistas"
                    accent={vPct > 0 ? '#3E9E59' : vPct < 0 ? '#BF5028' : ORO}
                    value={<span style={{ color: vPct > 0 ? '#5FB874' : vPct < 0 ? '#E08A5A' : '#F6F0E0' }}>{vPct > 0 ? '▲' : vPct < 0 ? '▼' : '■'} {Math.abs(vPct)}%</span>}
                    sub={`vs. mes pasado — ${vistasRazon}`}
                  />
                )}
              </div>

              {/* META DEL MES */}
              {meta && (
                <>
                  <H2>Meta del mes</H2>
                  {meta.meta ? (
                    <div style={{
                      padding: '18px 20px', borderRadius: '18px',
                      background: 'radial-gradient(420px 160px at 90% -40%, rgba(124,182,137,0.18), transparent 70%), linear-gradient(160deg, rgba(124,182,137,0.12), rgba(16,28,18,0.35))',
                      border: '1px solid rgba(124,182,137,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '28px', fontWeight: 600, lineHeight: 1, color: '#F6F0E0' }}>
                            {meta.actual}<span style={{ fontSize: '16px', opacity: 0.6, fontWeight: 500 }}> / {meta.meta}</span>
                          </div>
                          <div style={{ fontSize: '11.5px', letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.6, marginTop: '4px', fontWeight: 600 }}>contactos este mes</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontFamily: "'Fraunces', Georgia, serif", fontSize: '22px', fontWeight: 600,
                            color: meta.pct >= 100 ? '#8FD3A0' : ORO,
                          }}>{meta.pct}%</span>
                          <button onClick={() => { setMetaInput(String(meta.meta)); setEditMeta(true) }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'rgba(246,240,224,0.65)', fontSize: '12px', fontWeight: 700 }}>Editar</button>
                        </div>
                      </div>
                      <div style={{
                        position: 'relative', height: '14px', borderRadius: '9999px',
                        background: 'rgba(0,0,0,0.3)', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
                      }}>
                        <div style={{
                          position: 'relative', width: `${Math.max(meta.pct, 3)}%`, height: '100%', borderRadius: '9999px',
                          background: meta.pct >= 100 ? 'linear-gradient(90deg,#6FB880,#3E9E59)' : 'linear-gradient(90deg,#F0D77A,#DCB24A,#B98A16)',
                          boxShadow: meta.pct >= 100 ? '0 0 14px rgba(111,184,128,0.6)' : '0 0 14px rgba(220,178,74,0.55)',
                          transition: 'width 0.6s ease',
                        }}>
                          <div style={{ position: 'absolute', inset: 0, borderRadius: '9999px', background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)' }} />
                        </div>
                      </div>
                      <div style={{ fontSize: '12.5px', opacity: 0.82, marginTop: '10px', fontWeight: 500 }}>
                        {meta.pct >= 100 ? '🎉 ¡Meta cumplida este mes!' : `Te faltan ${Math.max(0, meta.meta - meta.actual)} para tu meta. ¡Tú puedes!`}
                      </div>
                    </div>
                  ) : editMeta ? null : (
                    <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(220,178,74,0.08)', border: '1px dashed rgba(220,178,74,0.4)', fontSize: '13.5px', lineHeight: 1.55 }}>
                      Este mes tuviste <strong>{tasa?.vistas ?? 0} visitas</strong>. ¿Te pones una meta de contactos y ves tu avance cada vez que entras a tu perfil?{' '}
                      <button onClick={() => { setMetaInput(String(meta.sugerida || 10)); setEditMeta(true) }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: ORO, fontWeight: 700, fontSize: '13.5px' }}>Poner mi meta (sugerida: {meta.sugerida}) →</button>
                    </div>
                  )}
                  {editMeta && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                      <input type="number" min="1" value={metaInput} onChange={(e) => setMetaInput(e.target.value)} placeholder="Ej. 20"
                        style={{ width: '110px', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(220,178,74,0.4)', background: 'rgba(0,0,0,0.25)', color: '#F6F0E0', fontSize: '14px' }} />
                      <button onClick={guardarMeta} disabled={savingMeta} style={{ cursor: 'pointer', padding: '9px 16px', borderRadius: '10px', border: 'none', background: 'linear-gradient(180deg,#E7C86A,#DCB24A)', color: '#25201A', fontWeight: 700, fontSize: '14px' }}>{savingMeta ? 'Guardando…' : 'Guardar'}</button>
                      <button onClick={() => setEditMeta(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'rgba(246,240,224,0.6)', fontSize: '13px' }}>Cancelar</button>
                    </div>
                  )}
                </>
              )}

              {/* RECOMENDACIONES POR RED */}
              {redes.length > 0 && (
                <>
                  <H2>Top 3 recomendaciones para tu negocio por red social</H2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {redes.map((k) => (
                      <button key={k} onClick={() => setRed(k)} style={{
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '7px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                        border: `1px solid ${k === redActiva ? ORO : 'rgba(246,240,224,0.2)'}`,
                        background: k === redActiva ? 'rgba(220,178,74,0.22)' : 'transparent', color: '#F6F0E0',
                        opacity: k === redActiva ? 1 : 0.78,
                      }}><BrandIcon red={k} /> {RED_META[k]?.label || k}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(recosPorRed[redActiva] || []).map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '11px 14px', borderRadius: '12px',
                        background: 'rgba(124,182,137,0.10)', border: '1px solid rgba(124,182,137,0.22)', fontSize: '13.5px', lineHeight: 1.5,
                      }}>
                        <span aria-hidden="true" style={{ fontSize: '16px' }}>{r.icon}</span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* FASE 2 */}
              {fase2 && (
                <>
                  <H2>Tendencia</H2>
                  {fase2.total > 0 ? <Tendencia serie={fase2.serie} />
                    : <Vacio>Estamos recopilando datos de tu ficha. En cuanto tengas visitas verás aquí tu tendencia diaria.</Vacio>}

                  <H2>¿A qué hora te buscan?</H2>
                  {fase2.total > 0 ? <Heatmap hm={fase2.heatmap} />
                    : <Vacio>Pronto sabrás los días y horas en que más te buscan, para publicar en el mejor momento.</Vacio>}

                  <H2>¿De dónde vienen?</H2>
                  {fase2.geo.total > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {fase2.geo.filas.map((g, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                          <div style={{ width: '120px', opacity: 0.85 }}>{g.label}</div>
                          <div style={{ flex: 1, height: '10px', borderRadius: '9999px', background: 'rgba(246,240,224,0.08)', overflow: 'hidden' }}>
                            <div style={{ width: `${g.pct}%`, height: '100%', background: 'linear-gradient(90deg,#E7C86A,#3A6B47)' }} />
                          </div>
                          <div style={{ width: '42px', textAlign: 'right', fontWeight: 700 }}>{g.pct}%</div>
                        </div>
                      ))}
                    </div>
                  ) : <Vacio>Cuando tengas más visitas, aquí verás de qué estados llega tu público (CDMX, Toluca, Edomex…) para enfocar tu promoción.</Vacio>}

                  <H2>Qué historias y eventos te traen clientes</H2>
                  {fase2.atribucion.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {fase2.atribucion.slice(0, 8).map((a, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                          padding: '10px 14px', borderRadius: '12px', background: 'rgba(220,178,74,0.08)', border: '1px solid rgba(220,178,74,0.2)', fontSize: '13px',
                        }}>
                          <span>{a.tipo === 'historia' ? '📖' : a.tipo === 'evento' ? '🎟️' : '🔗'} <strong>{a.slug || a.ref}</strong> <span style={{ opacity: 0.6 }}>({a.tipo})</span></span>
                          <span style={{ whiteSpace: 'nowrap', opacity: 0.9 }}>{a.vistas} vistas · {a.contactos} contactos</span>
                        </div>
                      ))}
                    </div>
                  ) : <Vacio>Cuando una de nuestras historias o eventos te mande visitas, aquí verás exactamente cuántas — la prueba de que lo que hacemos por el pueblo te llega a la caja.</Vacio>}
                </>
              )}

              {/* UPSELL por tier — desbloquea la siguiente capa de inteligencia */}
              {tier === 1 && (
                <a href="#planes" onClick={() => setOpen(false)} style={{
                  display: 'block', marginTop: '22px', padding: '16px 18px', borderRadius: '16px', textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(220,178,74,0.16), rgba(16,28,18,0.4))', border: '1px dashed rgba(220,178,74,0.5)', color: '#F6F0E0',
                }}>
                  <div style={{ fontWeight: 800, fontSize: '14.5px', marginBottom: '4px' }}>🔒 Con <span style={{ color: ORO }}>Cuāuhtli</span> desbloqueas tu Consultor con IA</div>
                  <div style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.5 }}>Te dice <strong>qué hacer esta semana</strong>, tus Top 3 recomendaciones por red social, tu ranking en el pueblo, alertas y metas. <span style={{ color: ORO, fontWeight: 700 }}>Mejorar mi plan →</span></div>
                </a>
              )}
              {tier === 2 && (
                <a href="#planes" onClick={() => setOpen(false)} style={{
                  display: 'block', marginTop: '22px', padding: '16px 18px', borderRadius: '16px', textDecoration: 'none',
                  background: 'linear-gradient(135deg, rgba(124,182,137,0.14), rgba(16,28,18,0.4))', border: '1px dashed rgba(124,182,137,0.5)', color: '#F6F0E0',
                }}>
                  <div style={{ fontWeight: 800, fontSize: '14.5px', marginBottom: '4px' }}>🔒 Con <span style={{ color: '#8FD3A0' }}>Ocēlōtl</span> ves de dónde viene cada cliente</div>
                  <div style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.5 }}>Qué <strong>historia o evento</strong> te trajo clientes, <strong>a qué hora</strong> te buscan, de qué estados, y <strong>exportas tu reporte</strong> para presumirlo. <span style={{ color: '#8FD3A0', fontWeight: 700 }}>Mejorar mi plan →</span></div>
                </a>
              )}

              {/* SELLO VS GOOGLE — "La ventaja del Jaguar" */}
              <div className="ventaja-card" style={{
                marginTop: '26px', borderRadius: '20px', overflow: 'hidden', position: 'relative',
                border: '1px solid rgba(220,178,74,0.55)',
                background: 'radial-gradient(560px 220px at 85% -20%, rgba(220,178,74,0.28), transparent 68%), linear-gradient(160deg, #203A26 0%, #10190F 100%)',
              }}>
                {/* Barra superior dorada con brillo que recorre */}
                <div className="ventaja-top" style={{ height: '4px', width: '100%' }} />
                <div style={{ padding: '20px 22px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <OjoJaguar size={34} style={{ filter: 'drop-shadow(0 3px 10px rgba(220,178,74,0.6))', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        display: 'inline-block', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800,
                        color: '#1F1A12', background: 'linear-gradient(180deg,#F0D77A,#DCB24A)', padding: '3px 10px', borderRadius: '9999px',
                        boxShadow: '0 2px 8px rgba(220,178,74,0.4)', marginBottom: '6px',
                      }}>La ventaja del Jaguar</div>
                      <div className="ventaja-title" style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(19px, 5.2vw, 23px)', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.1 }}>Lo que Google jamás te dará</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '8px 14px 18px' }}>
                  {VS_GOOGLE.map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: '12px', alignItems: 'center', padding: '11px 10px',
                      borderTop: i === 0 ? 'none' : '1px solid rgba(220,178,74,0.12)',
                    }}>
                      <span style={{
                        flexShrink: 0, width: '26px', height: '26px', borderRadius: '8px', display: 'grid', placeItems: 'center',
                        background: 'linear-gradient(135deg, rgba(111,184,128,0.25), rgba(62,158,89,0.12))',
                        border: '1px solid rgba(111,184,128,0.4)',
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8FD3A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13.5px', lineHeight: 1.45, color: '#F3EEE2' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ margin: '22px 0 0', fontSize: '12px', color: 'rgba(246,240,224,0.55)', lineHeight: 1.5 }}>
                🌎 La geografía es aproximada y sin datos personales.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
