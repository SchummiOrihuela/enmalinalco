'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: '0 0 20px',
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

export default function ClosuresForm({ businessId, initialClosures }) {
  const [closures, setClosures] = useState(initialClosures || [])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [message, setMessage] = useState('')
  const [msg, setMsg] = useState(null)

  const supabase = createClient()

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
      setStart(''); setEnd(''); setMessage(''); setMsg('Cierre agregado.')
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('vacations').delete().eq('id', id)
    if (error) setMsg('Error: ' + error.message)
    else setClosures((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <h2 style={h2Style}>Cierre Parcial</h2>

      {closures.length === 0 && (
        <p style={{ fontSize: '14px', color: 'var(--ink)', opacity: 0.5, marginBottom: '18px' }}>
          Sin cierres programados.
        </p>
      )}
      {closures.map((c) => (
        <div key={c.id} style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          padding: '10px 14px',
          background: 'var(--parch)',
          borderRadius: '10px',
          marginBottom: '8px',
          fontSize: '14px',
          color: 'var(--ink)',
        }}>
          <span style={{ fontWeight: 500 }}>{c.start_date} → {c.end_date}</span>
          {c.message && <span style={{ opacity: 0.55 }}>({c.message})</span>}
          <button
            onClick={() => handleDelete(c.id)}
            style={{
              marginLeft: 'auto',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--terra)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Borrar
          </button>
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <label style={labelStyle}>Desde</label>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
          style={inputStyle} />
        <label style={labelStyle}>Hasta</label>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
          style={inputStyle} />
        <label style={labelStyle}>Mensaje (opcional)</label>
        <input value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Cierre parcial por mantenimiento. Regresamos el 15 de marzo"
          style={inputStyle} />
        <button onClick={handleAdd} style={btnStyle}>
          Agregar cierre
        </button>
      </div>

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
