'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

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
    <div style={{ marginTop: 32, maxWidth: 500 }}>
      <h2>Horarios</h2>
      {hours.map((h, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0' }}>
          <span style={{ width: 90 }}>{DIAS[i]}</span>
          <input type="time" value={h.open_time} disabled={h.is_closed}
            onChange={(e) => update(i, 'open_time', e.target.value)} />
          <input type="time" value={h.close_time} disabled={h.is_closed}
            onChange={(e) => update(i, 'close_time', e.target.value)} />
          <label style={{ fontSize: 14 }}>
            <input type="checkbox" checked={h.is_closed}
              onChange={(e) => update(i, 'is_closed', e.target.checked)} /> Cerrado
          </label>
        </div>
      ))}
      <button onClick={handleSave} style={{ padding: '8px 16px', marginTop: 12 }}>
        Guardar horarios
      </button>
      {msg && <p>{msg}</p>}
    </div>
  )
}
