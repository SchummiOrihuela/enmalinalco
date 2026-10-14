'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Centro del pueblo de Malinalco.
const CENTRO = [18.9487, -99.4939]

const COLOR = { open: '#3A8C4E', soon: '#E0803A', closed: '#9A8E7C' }
const codeOf = (e) => (e?.open ? 'open' : (e?.opensSoon ? 'soon' : 'closed'))

// Pin "semáforo": gota de color con punto blanco.
function pinIcon(code) {
  const c = COLOR[code]
  return L.divIcon({
    className: 'mp-pin',
    html: `<span style="
      display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);background:${c};
      border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)">
      <span style="position:absolute;top:7px;left:7px;width:8px;height:8px;border-radius:50%;background:#fff;transform:rotate(45deg)"></span>
    </span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  })
}

function popupHtml(b) {
  const code = codeOf(b.estado)
  const foto = b.photo
    ? `<img src="${b.photo}" alt="" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:8px"/>`
    : ''
  const badge = b.estado?.label
    ? `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:${COLOR[code]}">
         <span style="width:7px;height:7px;border-radius:50%;background:${COLOR[code]}"></span>${b.estado.label}
       </span>`
    : ''
  return `<div style="width:190px;font-family:system-ui,sans-serif">
    ${foto}
    <div style="font-weight:800;font-size:15px;color:#1C3B28;line-height:1.2">${b.name}</div>
    <div style="font-size:12px;color:#8A6D2F;margin:2px 0 6px">${b.category || ''}</div>
    ${badge}
    <a href="/negocio/${b.slug}" style="display:block;margin-top:10px;text-align:center;background:#1C3B28;color:#F6F0E0;font-weight:700;font-size:13px;padding:8px;border-radius:9999px;text-decoration:none">Ver ficha →</a>
  </div>`
}

export default function MapView({ items, categorias }) {
  const [cat, setCat] = useState('all')
  const [estado, setEstado] = useState('todos')
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  const elRef = useRef(null)

  // Solo categorías con negocios ubicados.
  const cats = useMemo(() => {
    const present = new Set(items.map((b) => b.categorySlug))
    return categorias.filter((c) => present.has(c.slug))
  }, [items, categorias])

  const filtered = useMemo(() => items.filter((b) => {
    if (cat !== 'all' && b.categorySlug !== cat) return false
    if (estado === 'abierto' && !b.estado?.open) return false
    if (estado === 'pronto' && !b.estado?.opensSoon) return false
    if (estado === 'cerrado' && (b.estado?.open || b.estado?.opensSoon)) return false
    return true
  }), [items, cat, estado])

  // Inicializa el mapa una vez.
  useEffect(() => {
    if (mapRef.current || !elRef.current) return
    const map = L.map(elRef.current, { scrollWheelZoom: true }).setView(CENTRO, 15)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  // Redibuja marcadores al cambiar filtros.
  useEffect(() => {
    const map = mapRef.current, layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()
    const pts = []
    for (const b of filtered) {
      const lat = Number(b.lat), lng = Number(b.lng)
      if (!isFinite(lat) || !isFinite(lng)) continue
      const m = L.marker([lat, lng], { icon: pinIcon(codeOf(b.estado)) }).bindPopup(popupHtml(b))
      m.addTo(layer)
      pts.push([lat, lng])
    }
    if (pts.length) {
      try { map.fitBounds(pts, { padding: [50, 50], maxZoom: 16 }) } catch { /* noop */ }
    }
  }, [filtered])

  const selStyle = {
    appearance: 'none', WebkitAppearance: 'none',
    background: 'rgba(23,45,33,.9)', color: '#F6F0E0',
    border: '1px solid rgba(220,178,74,.35)', borderRadius: 10,
    padding: '10px 34px 10px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23DCB24A\' stroke-width=\'3\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoría" style={selStyle}>
          <option value="all">Todas las categorías</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Estado" style={selStyle}>
          <option value="todos">Cualquier horario</option>
          <option value="abierto">🟢 Abierto ahora</option>
          <option value="pronto">🟠 Abre pronto</option>
          <option value="cerrado">⚪ Cerrado</option>
        </select>
        <span style={{ display: 'inline-flex', alignItems: 'center', color: 'rgba(242,237,227,.6)', fontSize: 13, fontWeight: 600 }}>
          {filtered.length} {filtered.length === 1 ? 'lugar' : 'lugares'}
        </span>
      </div>

      <div ref={elRef} style={{
        height: 'min(68vh, 620px)', width: '100%', borderRadius: 16, overflow: 'hidden',
        border: '1px solid rgba(220,178,74,.22)', background: '#1C3B28',
      }} />

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12, fontSize: 12.5, color: 'rgba(242,237,227,.7)' }}>
        {[['open', 'Abierto'], ['soon', 'Abre pronto'], ['closed', 'Cerrado']].map(([k, label]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: COLOR[k], border: '1.5px solid #fff' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
