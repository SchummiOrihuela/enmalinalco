'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: '0 0 20px',
}

const timeStyle = {
  padding: '8px 10px',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: 'var(--parch)',
  border: '1.5px solid rgba(128,128,128,0.25)',
  borderRadius: '8px',
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
  marginTop: '16px',
}

export default function HoursForm({ businessId, initialHours }) {
  const base = DIAS.map((_, i) => {
    const h = initialHours?.find((x) => x.day_of_week === i)
    return {
      day_of_week: i,
      open_time: h?.open_time || '09:00',
      close_time: h?.close_time || '18:00',
      is_closed: h?.is_closed || false,
    }
  })

  const [hours, setHours] = useState(base)
  const [msg, setMsg] = useState(null)

  const supabase = createClient()

  function update(i, campo, valor) {
    setHours((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [campo]: valor } : h))
    )
  }

  async function handleSave() {
    setMsg('Guardando...')

    const filas = hours.map((h) => ({
      business_id: businessId,
      day_of_week: h.day_of_week,
      open_time: h.is_closed ? null : h.open_time,
      close_time: h.is_closed ? null : h.close_time,
      is_closed: h.is_closed,
    }))

    const { error } = await supabase
      .from('business_hours')
      .upsert(filas, { onConflict: 'business_id,day_of_week' })

    if (error) setMsg('Error: ' + error.message)
    else setMsg('Horarios guardados.')
  }

  return (
    <div>
      <h2 style={h2Style}>Horarios</h2>
      {hours.map((h, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 0',
          borderBottom: '1px solid rgba(128,128,128,0.12)',
          opacity: h.is_closed ? 0.55 : 1,
        }}>
          <span style={{ width: 90, fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
            {DIAS[i]}
          </span>
          <input type="time" value={h.open_time} disabled={h.is_closed}
            onChange={(e) => update(i, 'open_time', e.target.value)}
            style={{ ...timeStyle, opacity: h.is_closed ? 0.5 : 1 }} />
          <span style={{ color: 'var(--ink)', opacity: 0.4 }}>–</span>
          <input type="time" value={h.close_time} disabled={h.is_closed}
            onChange={(e) => update(i, 'close_time', e.target.value)}
            style={{ ...timeStyle, opacity: h.is_closed ? 0.5 : 1 }} />
          <label style={{
            fontSize: '13px',
            color: 'var(--ink)',
            opacity: 0.7,
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}>
            <input type="checkbox" checked={h.is_closed}
              onChange={(e) => update(i, 'is_closed', e.target.checked)}
              style={{ accentColor: 'var(--verde)', cursor: 'pointer' }} />
            Cerrado
          </label>
        </div>
      ))}
      <button onClick={handleSave} style={btnStyle}>
        Guardar horarios
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
