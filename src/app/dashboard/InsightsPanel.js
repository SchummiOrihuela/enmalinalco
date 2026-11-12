// Panel de inteligencia (Fase 1): salud de ficha, tasa de contacto, ranking,
// valor estimado (ROI) y recomendaciones. Todo derivado de los contadores
// actuales (ver src/lib/insights.js). Componente de presentación, sin estado.
import { pesos } from '@/lib/insights'

function Card({ children, accent = 'var(--oro)' }) {
  return (
    <div style={{
      flex: '1 1 220px', minWidth: 0,
      padding: '16px 18px', borderRadius: '14px',
      background: 'linear-gradient(135deg, rgba(220,178,74,0.10), rgba(28,59,40,0.22))',
      border: '1px solid rgba(220,178,74,0.22)',
      borderLeft: `4px solid ${accent}`,
      color: '#F6F0E0',
    }}>
      {children}
    </div>
  )
}

const Title = ({ children }) => (
  <div style={{
    fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
    fontWeight: 700, color: 'rgba(246,240,224,0.68)', marginBottom: '8px',
  }}>{children}</div>
)

export default function InsightsPanel({ salud, tasa, ranking, roi, recs }) {
  return (
    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>

        {/* Salud de la ficha */}
        {salud && (
          <Card accent={salud.score >= 85 ? '#3E9E59' : salud.score >= 60 ? 'var(--oro)' : '#BF5028'}>
            <Title>Salud de tu ficha</Title>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '30px', fontWeight: 600 }}>{salud.score}</strong>
              <span style={{ opacity: 0.7, fontSize: '14px' }}>/100 · {salud.nivel}</span>
            </div>
            <div style={{ height: '7px', borderRadius: '9999px', background: 'rgba(0,0,0,0.25)', overflow: 'hidden', margin: '8px 0' }}>
              <div style={{ width: `${salud.score}%`, height: '100%', background: salud.score >= 85 ? '#3E9E59' : salud.score >= 60 ? '#DCB24A' : '#BF5028' }} />
            </div>
            {salud.faltantes.length > 0
              ? <div style={{ fontSize: '12.5px', opacity: 0.85, lineHeight: 1.45 }}>Te falta: {salud.faltantes.slice(0, 3).join(', ')}.</div>
              : <div style={{ fontSize: '12.5px', opacity: 0.85 }}>¡Ficha completa! Las completas reciben hasta 3× más contactos.</div>}
          </Card>
        )}

        {/* Tasa de contacto */}
        {tasa && tasa.pct !== null && (
          <Card>
            <Title>Tasa de contacto</Title>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '30px', fontWeight: 600 }}>{tasa.pct}%</strong>
            </div>
            <div style={{ fontSize: '12.5px', opacity: 0.85, lineHeight: 1.45, marginTop: '6px' }}>
              De cada 100 que te ven, {tasa.pct} te buscan ({tasa.contactos} contactos de {tasa.vistas} vistas).
            </div>
          </Card>
        )}

        {/* Ranking en la categoría */}
        {ranking && (
          <Card accent={ranking.pos === 1 ? '#3E9E59' : 'var(--oro)'}>
            <Title>Tu lugar en {`la categoría`}</Title>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '30px', fontWeight: 600 }}>#{ranking.pos}</strong>
              <span style={{ opacity: 0.7, fontSize: '14px' }}>de {ranking.n}</span>
            </div>
            <div style={{ fontSize: '12.5px', opacity: 0.85, lineHeight: 1.45, marginTop: '6px' }}>
              {ranking.pos === 1 ? '¡Vas en primer lugar de tu categoría en el pueblo!' : 'Por vistas, entre los negocios de tu categoría en Malinalco.'}
            </div>
          </Card>
        )}

        {/* Valor estimado / ROI */}
        {roi && roi.contactos > 0 && (
          <Card accent="#3E9E59">
            <Title>Valor estimado del mes</Title>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <strong style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '28px', fontWeight: 600 }}>{pesos(roi.ingreso)}</strong>
              {roi.retorno >= 1 && <span style={{ opacity: 0.8, fontSize: '13px', fontWeight: 700, color: '#5FB874' }}>· {roi.retorno}× tu plan</span>}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.82, lineHeight: 1.45, marginTop: '6px' }}>
              {roi.contactos} contactos × {roi.cierreTexto} cerrado × {pesos(roi.ticket)} ticket (estimado). Tu plan: {pesos(roi.precio)}.
            </div>
          </Card>
        )}
      </div>

      {/* Recomendaciones del mes */}
      {recs && recs.length > 0 && (
        <div style={{
          padding: '14px 18px', borderRadius: '14px',
          background: 'rgba(124,182,137,0.10)', border: '1px solid rgba(124,182,137,0.28)',
        }}>
          <Title>Tus recomendaciones de este mes</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recs.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13.5px', color: '#F6F0E0', lineHeight: 1.5 }}>
                <span aria-hidden="true" style={{ fontSize: '16px', lineHeight: 1.4 }}>{r.icon}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
