'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { BrandTile } from '@/app/components/BrandIcon'

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
  })
  const [msg, setMsg] = useState(null)
  const supabase = createClient()

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setMsg('Guardando...')
    const { error } = await supabase
      .from('businesses')
      .update(form)
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
        {ICONS.address}
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
            {ICONS[f.key]}
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
