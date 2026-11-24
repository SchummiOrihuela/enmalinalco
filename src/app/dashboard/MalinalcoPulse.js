// 🐆 El Pulso de Malinalco — índice de demanda del PUEBLO entero.
// Lo que Google jamás podrá dar: la señal de demanda de todo el directorio en
// un solo número. Lo ven TODOS los tiers (incluso un negocio recién llegado con
// 0 datos propios ya ve el movimiento del pueblo). Datos: rpc malinalco_pulse().
import OjoJaguar from '@/app/components/OjoJaguar'

const DOW = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

export default function MalinalcoPulse({ pulse }) {
  if (!pulse) return null
  const tw = pulse.this_week || 0
  const lw = pulse.last_week || 0
  // Sin nada de nada esta semana ni la pasada: no mostramos el bloque.
  if (tw === 0 && lw === 0) return null

  const pct = lw > 0 ? Math.round(((tw - lw) / lw) * 100) : null
  const dia = pulse.peak_dow != null && DOW[pulse.peak_dow] ? DOW[pulse.peak_dow] : null
  const hora = pulse.peak_hour != null ? `${pulse.peak_hour}:00` : null
  const cat = pulse.top_category || null

  return (
    <div style={{
      marginTop: '16px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(220,178,74,0.45)',
      background:
        'radial-gradient(520px 200px at 88% -30%, rgba(220,178,74,0.26), transparent 68%),' +
        'linear-gradient(160deg, #1F3A27 0%, #122017 100%)',
      color: '#F6F0E0',
      boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
    }}>
      <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #E7C86A, #DCB24A, #E7C86A, transparent)' }} />
      <div style={{ padding: 'clamp(16px, 4vw, 20px) clamp(16px, 4vw, 22px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <OjoJaguar size={26} style={{ filter: 'drop-shadow(0 2px 6px rgba(220,178,74,0.45))', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, color: '#E7C86A' }}>
            El Pulso de Malinalco · últimos 7 días
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(30px, 8vw, 40px)', fontWeight: 600, lineHeight: 1 }}>
            {tw.toLocaleString('es-MX')}
          </span>
          <span style={{ fontSize: '14px', opacity: 0.85 }}>visitas al directorio del pueblo</span>
          {pct !== null && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '12.5px', fontWeight: 800,
              color: pct > 0 ? '#101E14' : '#F6F0E0',
              background: pct > 0 ? 'linear-gradient(180deg,#8FD3A0,#5FB874)' : (pct < 0 ? 'rgba(220,120,74,0.22)' : 'rgba(246,240,224,0.14)'),
              border: pct < 0 ? '1px solid rgba(220,120,74,0.5)' : 'none',
              padding: '3px 10px', borderRadius: '9999px',
            }}>
              {pct > 0 ? '▲' : pct < 0 ? '▼' : '■'} {Math.abs(pct)}% vs. semana pasada
            </span>
          )}
        </div>

        {(dia || cat) && (
          <div style={{ fontSize: '13.5px', opacity: 0.9, marginTop: '12px', lineHeight: 1.5 }}>
            {dia && <>🔥 Día más activo: <strong>{dia}</strong>{hora ? <> (~{hora} h)</> : null}</>}
            {dia && cat && <span style={{ opacity: 0.5 }}>{'  ·  '}</span>}
            {cat && <>🔎 Lo más buscado: <strong>{cat}</strong></>}
          </div>
        )}

        <div style={{
          marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(220,178,74,0.18)',
          fontSize: '13px', color: 'rgba(246,240,224,0.82)', lineHeight: 1.55,
        }}>
          Así se mueve <strong>todo</strong> Malinalco en el directorio — algo que Google no puede verte.
          Entre mejor y más completa tu ficha, <strong>más te toca de ese movimiento.</strong>
        </div>
      </div>
    </div>
  )
}
