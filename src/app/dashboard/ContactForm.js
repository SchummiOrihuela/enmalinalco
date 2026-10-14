'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { BrandTile } from '@/app/components/BrandIcon'
import { coordsFromText } from '@/lib/geo'

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: '0 0 6px',
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--ink)',
  opacity: 0.7,
  marginBottom: '6px',
}

const inputBase = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '15px',
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: 'var(--parch)',
  border: '1.5px solid rgba(128,128,128,0.25)',
  borderRadius: '10px',
  outline: 'none',
}

// Campos de coordenadas: solo lectura, en gris (se llenan con el botón).
const coordInputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '15px',
  fontFamily: 'inherit',
  color: 'rgba(60,60,60,0.75)',
  background: 'rgba(128,128,128,0.12)',
  border: '1.5px solid rgba(128,128,128,0.22)',
  borderRadius: '10px',
  outline: 'none',
  cursor: 'not-allowed',
}

const btnStyle = {
  padding: '12px 28px',
  fontSize: '15px',
  fontWeight: 600,
  fontFamily: 'inherit',
  color: 'var(--parch)',
  background: 'var(--ink)',
  border: 'none',
  borderRadius: '9999px',
  cursor: 'pointer',
  marginTop: '20px',
}

const FIELDS = [
  { key: 'whatsapp', brand: 'whatsapp', label: 'WhatsApp', placeholder: '55 1234 5678', hint: 'Solo el número, con lada' },
  { key: 'instagram', brand: 'instagram', label: 'Instagram', placeholder: '@tunegocio o el enlace de tu perfil' },
  { key: 'facebook', brand: 'facebook', label: 'Facebook', placeholder: 'Enlace de tu página de Facebook' },
  { key: 'maps_url', brand: 'maps', label: 'Google Maps', placeholder: 'Pega el enlace de tu ubicación en Maps', hint: 'En Google Maps → Compartir → Copiar enlace' },
]

export default function ContactForm({ business }) {
  const [form, setForm] = useState({
    address: business?.address || '',
    whatsapp: business?.whatsapp || '',
    instagram: business?.instagram || '',
    facebook: business?.facebook || '',
    maps_url: business?.maps_url || '',
    lat: business?.lat ?? '',
    lng: business?.lng ?? '',
  })
  const [msg, setMsg] = useState(null)
  const [geoMsg, setGeoMsg] = useState(null)
  const [geoBusy, setGeoBusy] = useState(false)
  const supabase = createClient()

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  // Saca lat/lng del enlace de Google Maps para evitar que el dueño
  // tenga que copiarlas a mano. Primero intenta en el navegador (enlaces
  // completos); si no, pide al servidor que resuelva el enlace corto.
  async function autolocalizar() {
    const url = (form.maps_url || '').trim()
    if (!url) {
      setGeoMsg('Primero pega tu enlace de Google Maps en el campo de arriba.')
      return
    }
    setGeoBusy(true)
    setGeoMsg('Buscando tu ubicación…')
    let coords = coordsFromText(url)
    if (!coords) {
      try {
        const r = await fetch('/api/geo/from-maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        const data = await r.json()
        if (r.ok && data.lat != null && data.lng != null) coords = data
        else setGeoMsg(data.error || 'No pudimos leer ese enlace. Captura las coordenadas a mano.')
      } catch {
        setGeoMsg('No pudimos leer ese enlace. Captura las coordenadas a mano.')
      }
    }
    if (coords) {
      setForm((f) => ({ ...f, lat: coords.lat, lng: coords.lng }))
      setGeoMsg('¡Listo! Encontramos tu ubicación. Revísala y guarda.')
    }
    setGeoBusy(false)
  }

  async function handleSave() {
    // Coordenadas: texto vacío -> null; de lo contrario número válido.
    const toCoord = (v) => {
      if (v === '' || v == null) return null
      const n = Number(String(v).trim())
      return isFinite(n) ? n : null
    }
    if ((form.lat !== '' && toCoord(form.lat) === null) ||
        (form.lng !== '' && toCoord(form.lng) === null)) {
      setMsg('Error: latitud y longitud deben ser números (ej. 18.9487 y -99.4939).')
      return
    }
    setMsg('Guardando...')
    const payload = { ...form, lat: toCoord(form.lat), lng: toCoord(form.lng) }
    const { error } = await supabase
      .from('businesses')
      .update(payload)
      .eq('id', business.id)
    if (error) setMsg('Error: ' + error.message)
    else setMsg('Datos guardados.')
  }

  return (
    <div>
      <h2 style={h2Style}>Ubicación y Redes Sociales</h2>
      <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.6, margin: '0 0 22px' }}>
        Deja que tus clientes te encuentren y te escriban con un solo toque.
      </p>

      {/* Dirección (ancho completo) */}
      <label style={labelStyle}>Dirección</label>
      <div style={{ display: 'flex', gap: '11px', alignItems: 'center', marginBottom: '18px' }}>
        <BrandTile brand="address" />
        <input
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="Calle, número, colonia, Malinalco"
          style={inputBase}
        />
      </div>

      {/* Redes y Maps */}
      {FIELDS.map((f) => (
        <div key={f.key} style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>{f.label}</label>
          <div style={{ display: 'flex', gap: '11px', alignItems: 'center' }}>
            <BrandTile brand={f.brand} />
            <input
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={inputBase}
            />
          </div>
          {f.hint && (
            <p style={{ fontSize: '12px', color: 'var(--ink)', opacity: 0.5, margin: '5px 0 0 51px' }}>
              {f.hint}
            </p>
          )}
        </div>
      ))}

      {/* Ubicación en el mapa (coordenadas) */}
      <div style={{
        marginTop: '6px',
        marginBottom: '18px',
        padding: '16px 18px',
        background: 'rgba(28,59,40,0.05)',
        border: '1.5px solid rgba(220,178,74,0.35)',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '8px' }}>
          <BrandTile brand="maps" />
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>Tu punto en el Mapa de Malinalco</span>
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px' }}>
          Te sugerimos agregar tu ubicación para que tu negocio aparezca como un pin en el
          <strong> mapa dinámico de Malinalco</strong>, donde los visitantes te encuentran sin salir
          del Directorio.
          <br />
          <span style={{ opacity: 0.85 }}>
            Es muy fácil: pega tu enlace de Google Maps en el campo de arriba y toca
            <strong> «Sacar del enlace de Maps»</strong>. Nosotros ponemos la latitud y longitud por ti.
          </span>
        </p>

        <button
          type="button"
          onClick={autolocalizar}
          disabled={geoBusy}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
            color: 'var(--ink)', background: 'rgba(220,178,74,0.9)',
            border: 'none', borderRadius: '9999px',
            cursor: geoBusy ? 'wait' : 'pointer', opacity: geoBusy ? 0.7 : 1,
            marginBottom: '12px',
          }}
        >
          📍 {geoBusy ? 'Buscando…' : 'Sacar del enlace de Maps'}
        </button>
        {geoMsg && (
          <p style={{
            fontSize: '12.5px', margin: '0 0 12px', lineHeight: 1.5,
            color: geoMsg.startsWith('¡Listo') ? 'var(--verde)' : 'var(--terra)',
          }}>
            {geoMsg}
          </p>
        )}

        <div style={{ display: 'flex', gap: '11px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 140px' }}>
            <label style={labelStyle}>Latitud</label>
            <input
              value={form.lat}
              readOnly
              tabIndex={-1}
              placeholder="Se llena solo"
              style={coordInputStyle}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label style={labelStyle}>Longitud</label>
            <input
              value={form.lng}
              readOnly
              tabIndex={-1}
              placeholder="Se llena solo"
              style={coordInputStyle}
            />
          </div>
        </div>
        <p style={{ fontSize: '11.5px', lineHeight: 1.5, color: 'var(--ink)', opacity: 0.5, margin: '8px 0 0' }}>
          Estos campos se llenan automáticamente con el botón de arriba.
        </p>
      </div>

      <button onClick={handleSave} style={btnStyle}>
        Guardar datos
      </button>

      {msg && (
        <p style={{
          marginTop: '14px',
          fontSize: '14px',
          color: msg.startsWith('Error') ? 'var(--terra)' : 'var(--verde)',
        }}>
          {msg}
        </p>
      )}
    </div>
  )
}
