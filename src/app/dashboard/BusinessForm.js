'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { CATEGORIES } from '@/lib/categories'

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--ink)',
  opacity: 0.7,
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '15px',
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: 'var(--parch)',
  border: '1.5px solid rgba(128,128,128,0.25)',
  borderRadius: '10px',
  outline: 'none',
  marginBottom: '18px',
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
}

export default function BusinessForm({ business, userId }) {
  const [name, setName] = useState(business?.name || '')
  const [category, setCategory] = useState(business?.category || '')
  const [slug, setSlug] = useState(business?.slug || '')
  const [msg, setMsg] = useState(null)
  const supabase = createClient()

  async function handleSave() {
    setMsg('Guardando...')
    const datos = { name, category, slug, owner_id: userId }
    let error
    if (business) {
      ({ error } = await supabase
        .from('businesses')
        .update(datos)
        .eq('id', business.id))
    } else {
      ({ error } = await supabase
        .from('businesses')
        .insert(datos))
    }
    if (error) setMsg('Error: ' + error.message)
    else setMsg('Guardado correctamente.')
  }

  return (
    <div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '24px',
        fontWeight: 400,
        color: 'var(--ink)',
        margin: '0 0 20px',
      }}>
        {business ? 'Editar negocio' : 'Crear negocio'}
      </h2>

      <label style={labelStyle}>Nombre</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Categoría</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer' }}
      >
        <option value="">Selecciona una categoría…</option>
        {CATEGORIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Slug (URL única)</label>
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleSave} style={btnStyle}>
        Guardar
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
