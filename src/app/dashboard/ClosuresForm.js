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

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '12px 14px',
  fontSize: '15px',
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: 'var(--surf)',
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

const ghostBtn = {
  padding: '11px 22px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: 'transparent',
  border: '1.5px solid rgba(128,128,128,0.3)',
  borderRadius: '9999px',
  cursor: 'pointer',
}

// Formatea 2026-03-15 → "15 mar 2026" para que se lea bonito.
function fmt(d) {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch { return d }
}

export default function ClosuresForm({ businessId, initialClosures }) {
  const [closures, setClosures] = useState(initialClosures || [])
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [message, setMessage] = useState('')
  const [msg, setMsg] = useState(null)

  const supabase = createClient()

  function resetForm() {
    setStart(''); setEnd(''); setMessage('')
  }

  async function handleAdd() {
    if (!start || !end) {
      setMsg('Indica fecha de inicio y fin.')
      return
    }
    if (end < start) {
      setMsg('La fecha fin no puede ser anterior a la de inicio.')
      return
    }
    setMsg('Guardando...')

    const { data, error } = await supabase
      .from('vacations')
      .insert({ business_id: businessId, start_date: start, end_date: end, message: message || null })
      .select()

    if (error) {
      setMsg('Error: ' + error.message)
    } else {
      setClosures((prev) => [...prev, ...data])
      resetForm(); setOpen(false); setMsg('Cierre agregado.')
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('vacations').delete().eq('id', id)
    if (error) setMsg('Error: ' + error.message)
    else setClosures((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div style={{
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(128,128,128,0.18)',
    }}>
      <h2 style={h2Style}>Cierres por temporada</h2>
      <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.6, margin: '0 0 18px' }}>
        ¿Vas a cerrar unos días o semanas por vacaciones, mantenimiento o una temporada?
        Prográmalo y cuéntale a tus clientes el porqué — lo verán en tu ficha.
      </p>

      {/* Cierres ya programados */}
      {closures.map((c) => (
        <div key={c.id} style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          padding: '14px 16px',
          background: 'var(--parch)',
          borderRadius: '12px',
          borderLeft: '3px solid var(--terra)',
          marginBottom: '10px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
              {fmt(c.start_date)} — {fmt(c.end_date)}
            </div>
            {c.message && (
              <div style={{ fontSize: '13.5px', color: 'var(--ink)', opacity: 0.6, marginTop: '3px', lineHeight: 1.45 }}>
                {c.message}
              </div>
            )}
          </div>
          <button
            onClick={() => handleDelete(c.id)}
            style={{
              fontSize: '13px', fontWeight: 600, color: 'var(--terra)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            Borrar
          </button>
        </div>
      ))}

      {/* Botón que revela el formulario, o el formulario abierto */}
      {!open ? (
        <button onClick={() => { setOpen(true); setMsg(null) }} style={ghostBtn}>
          ＋ Programar un cierre
        </button>
      ) : (
        <div style={{
          marginTop: closures.length ? '8px' : 0,
          padding: '20px',
          background: 'var(--parch)',
          borderRadius: '14px',
          border: '1px solid rgba(128,128,128,0.16)',
        }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 160px' }}>
              <label style={labelStyle}>Desde</label>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label style={labelStyle}>Hasta</label>
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>¿Por qué cierras? <span style={{ fontWeight: 400, opacity: 0.7 }}>(tus clientes lo verán)</span></label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ej. Cerramos por vacaciones de Semana Santa. ¡Regresamos con todo el 15 de marzo!"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '76px' }}
          />

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={handleAdd} style={btnStyle}>Guardar cierre</button>
            <button onClick={() => { setOpen(false); resetForm(); setMsg(null) }} style={ghostBtn}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {msg && (
        <p style={{
          marginTop: '14px',
          fontSize: '14px',
          color: msg.startsWith('Error') || msg.startsWith('Indica') || msg.startsWith('La fecha') ? 'var(--terra)' : 'var(--verde)',
        }}>
          {msg}
        </p>
      )}
    </div>
  )
}
