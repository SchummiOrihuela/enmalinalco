'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { CATEGORIAS } from '@/lib/categorias'

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

// Ícono de categoría: el mismo SVG de línea del landing, sobre su color.
function CatIcon({ cat, size = 28 }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '8px',
      flexShrink: 0,
      background: cat.color,
      color: '#EFE7D0',
    }}>
      <svg
        viewBox="0 0 24 24"
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: cat.svg }}
      />
    </span>
  )
}

// Selector de categoría a medida (con íconos SVG, no emojis).
function CategorySelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = CATEGORIAS.find((c) => c.nombre === value) || null

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '18px' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputStyle,
          marginBottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {selected
          ? <><CatIcon cat={selected} /><span style={{ fontWeight: 500 }}>{selected.nombre}</span></>
          : <span style={{ opacity: 0.5 }}>Selecciona una categoría…</span>}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--oro)"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          style={{ marginLeft: 'auto', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 20,
          maxHeight: '288px',
          overflowY: 'auto',
          background: 'var(--surf)',
          border: '1px solid rgba(128,128,128,0.2)',
          borderRadius: '12px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
          padding: '6px',
        }}>
          {CATEGORIAS.map((c) => {
            const active = c.nombre === value
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => { onChange(c.nombre); setOpen(false) }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '9px 10px',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  fontFamily: 'inherit',
                  color: 'var(--ink)',
                  background: active ? 'rgba(185,138,22,0.14)' : 'transparent',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(128,128,128,0.10)' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <CatIcon cat={c} />
                <span>{c.nombre}</span>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--ink)', opacity: 0.45 }}>{c.hint}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BusinessForm({ business, userId }) {
  const [name, setName] = useState(business?.name || '')
  const [description, setDescription] = useState(business?.description || '')
  const [category, setCategory] = useState(business?.category || '')
  const [slug, setSlug] = useState(business?.slug || '')
  const [msg, setMsg] = useState(null)
  const supabase = createClient()

  async function handleSave() {
    setMsg('Guardando...')
    const datos = { name, description, category, slug, owner_id: userId }
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

      <label style={labelStyle}>Descripción</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Cuenta en una o dos líneas qué hace especial a tu negocio. Ej. Hospedaje con encanto en el corazón de Malinalco, casa restaurada con vista al cerro."
        style={{ ...inputStyle, marginBottom: '18px', resize: 'vertical', minHeight: '80px', lineHeight: 1.5 }}
      />

      <label style={labelStyle}>Categoría</label>
      <CategorySelect value={category} onChange={setCategory} />

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
