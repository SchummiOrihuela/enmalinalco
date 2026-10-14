// Estado "abierto / cerrado" calculado en la zona horaria de Malinalco
// (America/Mexico_City), independiente de dónde corra el servidor.
//
// Usa los registros de business_hours: { day_of_week (0=domingo), open_time,
// close_time, break_start?, break_end? } con horas tipo 'HH:MM:SS'.

const DIAS_CORTO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

// Momento actual en Malinalco: día de la semana (0=dom) y minutos desde medianoche.
export function ahoraEnMalinalco(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const dow = map[get('weekday')] ?? 0
  const hour = (parseInt(get('hour'), 10) || 0) % 24
  const min = parseInt(get('minute'), 10) || 0
  return { dow, minutes: hour * 60 + min }
}

function toMin(t) {
  if (!t) return null
  const [h, m] = String(t).split(':')
  const v = (parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0)
  return v
}
function fmt12(t) {
  const mins = toMin(t)
  if (mins === null) return ''
  let h = Math.floor(mins / 60), m = mins % 60
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12 || 12
  return m === 0 ? `${h} ${ampm}` : `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

// Devuelve { open, label, soon } para un conjunto de horarios.
// - open: boolean "abierto ahora"
// - label: texto corto ("Abierto ahora", "Cerrado", "Abre a las 9 am", "Cierra a las 6 pm")
// - soon: true si cierra en 30 min o menos (para avisar "cierra pronto")
export function estadoHorario(hours, now = ahoraEnMalinalco()) {
  if (!hours || hours.length === 0) return { open: false, label: '', soon: false }
  const { dow, minutes } = now
  const hoy = hours.find((h) => h.day_of_week === dow)

  const dentro = (a, b) => (b > a ? minutes >= a && minutes < b : minutes >= a || minutes < b)

  if (hoy && !hoy.is_closed && hoy.open_time != null && hoy.close_time != null) {
    const o = toMin(hoy.open_time), c = toMin(hoy.close_time)
    const bs = toMin(hoy.break_start), be = toMin(hoy.break_end)
    let open = dentro(o, c)
    if (open && bs != null && be != null && minutes >= bs && minutes < be) open = false

    if (open) {
      // ¿Cierra pronto? (siguiente cierre: el break si aplica, si no el cierre)
      const siguienteCierre = (bs != null && be != null && minutes < bs) ? bs : c
      const faltan = (siguienteCierre - minutes + 1440) % 1440
      return {
        open: true,
        soon: faltan <= 30,
        label: faltan <= 30 ? `Cierra a las ${fmt12(siguienteCierre === bs ? hoy.break_start : hoy.close_time)}` : 'Abierto ahora',
      }
    }
    // Cerrado pero quizá abre más tarde hoy (antes de la hora de apertura, o en el break).
    // "Abre pronto" = abre en 60 min o menos (para el semáforo naranja del mapa).
    if (minutes < o) return { open: false, soon: false, opensSoon: (o - minutes) <= 60, label: `Abre a las ${fmt12(hoy.open_time)}` }
    if (bs != null && be != null && minutes >= bs && minutes < be) return { open: false, soon: false, opensSoon: (be - minutes) <= 60, label: `Abre a las ${fmt12(hoy.break_end)}` }
  }

  // Cerrado hoy: busca el próximo día con horario.
  for (let i = 1; i <= 7; i++) {
    const d = (dow + i) % 7
    const row = hours.find((h) => h.day_of_week === d && !h.is_closed && h.open_time != null)
    if (row) {
      const cuando = i === 1 ? 'mañana' : DIAS_CORTO[d]
      return { open: false, soon: false, opensSoon: false, label: `Abre ${cuando} a las ${fmt12(row.open_time)}` }
    }
  }
  return { open: false, soon: false, opensSoon: false, label: 'Cerrado' }
}
