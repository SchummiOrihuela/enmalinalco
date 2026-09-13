'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

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

// Tile de marca: cuadro redondeado con el color oficial + glifo blanco.
function Tile({ bg, children }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: '11px',
      flexShrink: 0,
      background: bg,
      boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
    }}>
      {children}
    </span>
  )
}

// Glifos (blancos) de cada marca.
const ICONS = {
  address: (
    <Tile bg="linear-gradient(135deg,#3A6B47,#1C3B28)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    </Tile>
  ),
  whatsapp: (
    <Tile bg="#25D366">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.7 2.73a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </Tile>
  ),
  instagram: (
    <Tile bg="linear-gradient(45deg,#F58529,#DD2A7B 55%,#8134AF)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.1" fill="#fff" stroke="none" />
      </svg>
    </Tile>
  ),
  facebook: (
    <Tile bg="#1877F2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="none">
        <path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    </Tile>
  ),
  maps_url: (
    <Tile bg="#EA4335">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    </Tile>
  ),
}

const FIELDS = [
  { key: 'whatsapp', label: 'WhatsApp', placeholder: '55 1234 5678', hint: 'Solo el número, con lada' },
  { key: 'instagram', label: 'Instagram', placeholder: '@tunegocio o el enlace de tu perfil' },
  { key: 'facebook', label: 'Facebook', placeholder: 'Enlace de tu página de Facebook' },
  { key: 'maps_url', label: 'Google Maps', placeholder: 'Pega el enlace de tu ubicación en Maps', hint: 'En Google Maps → Compartir → Copiar enlace' },
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
