'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

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
    <div style={{ marginTop: 32, maxWidth: 500 }}>
      <h2>Cierre Parcial</h2>

      {closures.length === 0 && <p>Sin cierres programados.</p>}
      {closures.map((c) => (
        <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0' }}>
          <span>{c.start_date} → {c.end_date}</span>
          {c.message && <span style={{ color: '#666' }}>({c.message})</span>}
          <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 'auto' }}>Borrar</button>
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <label>Desde</label>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
          style={{ display: 'block', padding: 8, margin: '4px 0' }} />
        <label>Hasta</label>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
          style={{ display: 'block', padding: 8, margin: '4px 0' }} />
        <label>Mensaje (opcional)</label>
        <input value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Cierre parcial por mantenimiento. Regresamos el 15 de marzo"
          style={{ display: 'block', width: '100%', padding: 8, margin: '4px 0' }} />
        <button onClick={handleAdd} style={{ padding: '8px 16px', marginTop: 8 }}>
          Agregar cierre
        </button>
      </div>

      {msg && <p>{msg}</p>}
    </div>
  )
}
