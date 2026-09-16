'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Convierte "13:30" → "1:30 p.m." para leerlo bonito.
function to12h(hhmm) {
  const [H, M] = hhmm.split(':').map(Number)
  const ap = H < 12 ? 'a.m.' : 'p.m.'
  let h = H % 12
  if (h === 0) h = 12
  return `${h}:${String(M).padStart(2, '0')} ${ap}`
}

// Franjas de media hora, de 00:00 a 23:30, para los menús.
const SLOTS = []
for (let H = 0; H < 24; H++) {
  for (const M of [0, 30]) {
    const v = `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`
    SLOTS.push({ v, label: to12h(v) })
  }
}

// Deja cualquier valor de la BD ("13:00:00") como "HH:MM".
function hhmm(t, fallback) {
  if (!t) return fallback
  return t.slice(0, 5)
}

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: '0 0 20px',
}

const selectStyle = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  padding: '9px 30px 9px 14px',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: 'var(--ink)',
  background: 'var(--parch)',
  border: '1.5px solid rgba(128,128,128,0.22)',
  borderRadius: '10px',
  outline: 'none',
  cursor: 'pointer',
  // flechita propia (el fondo es un SVG en data URI, dorado suave)
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C59B1C' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 11px center',
}

const breakBtnStyle = {
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'inherit',
  color: 'var(--verde)',
  background: 'none',
  border: '1.5px solid rgba(128,128,128,0.22)',
  borderRadius: '9999px',
  cursor: 'pointer',
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

// Interruptor Abierto / Cerrado, más amable que un checkbox.
function Toggle({ closed, onChange }) {
  const open = !closed
  return (
    <button
      type="button"
      onClick={() => onChange(!closed)}
      aria-pressed={open}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: 600, color: open ? 'var(--verde)' : 'var(--ink)', opacity: open ? 1 : 0.5, minWidth: '54px', textAlign: 'right' }}>
        {open ? 'Abierto' : 'Cerrado'}
      </span>
      <span style={{
        position: 'relative',
        width: '40px',
        height: '23px',
        borderRadius: '9999px',
        background: open ? 'var(--verde)' : 'rgba(128,128,128,0.35)',
        transition: 'background .2s ease',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute',
          top: '2.5px',
          left: open ? '19px' : '2.5px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transition: 'left .2s ease',
        }} />
      </span>
    </button>
  )
}

export default function HoursForm({ businessId, initialHours }) {
  const base = DIAS.map((_, i) => {
    const h = initialHours?.find((x) => x.day_of_week === i)
    return {
      day_of_week: i,
      open_time: hhmm(h?.open_time, '09:00'),
      close_time: hhmm(h?.close_time, '18:00'),
      break_start: hhmm(h?.break_start, null),
      break_end: hhmm(h?.break_end, null),
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

    const filas = hours.map((h) => {
      const conComida = !h.is_closed && h.break_start && h.break_end
      return {
        business_id: businessId,
        day_of_week: h.day_of_week,
        open_time: h.is_closed ? null : h.open_time,
        close_time: h.is_closed ? null : h.close_time,
        break_start: conComida ? h.break_start : null,
        break_end: conComida ? h.break_end : null,
        is_closed: h.is_closed,
      }
    })

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
          padding: '11px 0',
          borderBottom: '1px solid rgba(128,128,128,0.12)',
        }}>
          <span style={{ width: 92, fontSize: '14px', fontWeight: 600, color: 'var(--ink)', opacity: h.is_closed ? 0.5 : 1 }}>
            {DIAS[i]}
          </span>

          {h.is_closed ? (
            <span style={{ flex: 1, fontSize: '14px', fontStyle: 'italic', color: 'var(--ink)', opacity: 0.4 }}>
              Cerrado todo el día
            </span>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              <select value={h.open_time} onChange={(e) => update(i, 'open_time', e.target.value)} style={selectStyle}>
                {SLOTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
              <span style={{ color: 'var(--ink)', opacity: 0.35 }}>a</span>
              {h.break_start && h.break_end ? (
                <>
                  <select value={h.break_start} onChange={(e) => update(i, 'break_start', e.target.value)} style={selectStyle}>
                    {SLOTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                  </select>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--verde)' }}>comida</span>
                  <select value={h.break_end} onChange={(e) => update(i, 'break_end', e.target.value)} style={selectStyle}>
                    {SLOTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                  </select>
                  <span style={{ color: 'var(--ink)', opacity: 0.35 }}>a</span>
                </>
              ) : null}
              <select value={h.close_time} onChange={(e) => update(i, 'close_time', e.target.value)} style={selectStyle}>
                {SLOTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
              {h.break_start && h.break_end ? (
                <button type="button" onClick={() => { update(i, 'break_start', null); update(i, 'break_end', null) }}
                  style={breakBtnStyle} title="Quitar hora de comida">
                  Quitar comida
                </button>
              ) : (
                <button type="button" onClick={() => { update(i, 'break_start', '14:00'); update(i, 'break_end', '16:00') }}
                  style={breakBtnStyle}>
                  + Cerrar a mediodía
                </button>
              )}
            </div>
          )}

          <div style={{ marginLeft: 'auto' }}>
            <Toggle closed={h.is_closed} onChange={(v) => update(i, 'is_closed', v)} />
          </div>
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
