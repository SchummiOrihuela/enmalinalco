'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { CATEGORIAS } from '@/lib/categorias'

// Emoji de alta calidad por categoría (el <select> nativo no admite SVG,
// así que aquí mapeamos cada slug a un ícono limpio y reconocible).
const EMOJI = {
  restaurantes: '🍽️',
  hospedaje: '🏨',
  ecoturismo: '🏞️',
  cultura: '🏛️',
  'belleza-y-bienestar': '💆',
  balnearios: '🏊',
  salud: '⚕️',
  tiendas: '🛒',
  'ropa-y-accesorios': '👗',
  veterinarias: '🐾',
  servicios: '🧰',
  construccion: '🧱',
}

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
  marginBottom: '6px',
}

const helpStyle = {
  fontSize: '12.5px',
  lineHeight: 1.5,
  color: 'var(--ink)',
  opacity: 0.55,
  margin: '0 0 18px',
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

// Normaliza a slug amable: minúsculas, sin acentos, guiones.
function toSlug(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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
        style={{ ...inputStyle, marginBottom: '18px' }}
      />

      <label style={labelStyle}>Categoría</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ ...inputStyle, marginBottom: '18px', cursor: 'pointer' }}
      >
        <option value="">Selecciona una categoría…</option>
        {CATEGORIAS.map((c) => (
          <option key={c.slug} value={c.nombre}>
            {EMOJI[c.slug] || '•'}  {c.nombre}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Slug (dirección de tu ficha)</label>
      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        onBlur={() => slug && setSlug(toSlug(slug))}
        placeholder="cantera-y-calma"
        style={inputStyle}
      />
      <p style={helpStyle}>
        Es la parte final de tu enlace, la que compartes con tus clientes. Usa solo
        minúsculas y guiones — sin espacios ni acentos.
        {slug && (
          <>
            <br />
            Tu ficha vivirá en:{' '}
            <span style={{ color: 'var(--verde)', fontWeight: 600 }}>
              enmalinalco.com/negocio/{toSlug(slug)}
            </span>
          </>
        )}
      </p>

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
