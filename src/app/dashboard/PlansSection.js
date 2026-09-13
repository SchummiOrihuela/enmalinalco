'use client'
import { useState } from 'react'
import { PLANS } from '@/lib/plans'

const ORDER = ['malinalli', 'cuauhtli', 'ocelotl']

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: '0 0 6px',
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--verde)"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: '2px' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function PlansSection({ businessId, currentPlan }) {
  const [loading, setLoading] = useState(null)

  async function handleSubscribe(tier) {
    if (loading) return
    setLoading(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, businessId }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { alert(data.error || 'Error al iniciar el checkout'); setLoading(null) }
    } catch (err) {
      alert('Error de conexión. Intenta de nuevo.'); setLoading(null)
    }
  }

  const currentName = currentPlan ? PLANS[currentPlan]?.name : null

  return (
    <div>
      <h2 style={h2Style}>Tu suscripción</h2>
      <p style={{ fontSize: '15px', color: 'var(--ink)', opacity: 0.75, marginBottom: '22px' }}>
        {currentName
          ? <>Estás en el plan{' '}
              <strong style={{
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '0.01em',
                color: 'var(--oro)',
              }}>{currentName}</strong>.</>
          : <>Aún no tienes un plan activo. Elige el que mejor le quede a tu negocio.</>}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
        {ORDER.map((tier) => {
          const p = PLANS[tier]
          const isCurrent = currentPlan === tier
          const isElite = tier === 'ocelotl'
          return (
            <div key={tier} style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: isCurrent ? '1.5px solid var(--oro)' : '1px solid rgba(128,128,128,0.22)',
              borderRadius: '18px',
              padding: '24px 22px',
              background: isCurrent
                ? 'linear-gradient(160deg, rgba(220,178,74,0.16), rgba(220,178,74,0.03))'
                : 'var(--parch)',
              boxShadow: isCurrent ? '0 0 0 4px rgba(220,178,74,0.10), 0 10px 30px rgba(220,178,74,0.10)' : 'none',
              transition: 'box-shadow .3s ease',
            }}>
              {/* Cinta de estado */}
              {isCurrent ? (
                <span style={ribbon('var(--oro)', 'var(--ink)')}>Tu plan actual</span>
              ) : isElite ? (
                <span style={ribbon('var(--selva)', '#F0E8D4')}>Élite</span>
              ) : null}

              {/* Nombre */}
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '34px',
                fontStyle: 'italic',
                fontWeight: 600,
                color: isCurrent ? 'var(--oro)' : 'var(--ink)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                marginTop: (isCurrent || isElite) ? '22px' : 0,
                paddingRight: '4px',
              }}>
                {p.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.6, margin: '6px 0 16px' }}>
                {p.tagline}
              </div>

              {/* Precio */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--ink)' }}>${p.price}</span>
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--ink)', opacity: 0.5 }}> /mes MXN</span>
              </div>

              {/* Beneficios */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {p.benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', lineHeight: 1.4, color: 'var(--ink)', opacity: 0.82 }}>
                    <Check />{b}
                  </li>
                ))}
              </ul>

              {/* Botón (anclado abajo para alinear alturas) */}
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={loading !== null || isCurrent}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9999px',
                  border: isCurrent ? '1.5px solid var(--oro)' : 'none',
                  background: isCurrent ? 'transparent' : 'var(--ink)',
                  color: isCurrent ? 'var(--oro)' : 'var(--parch)',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: isCurrent ? 'default' : 'pointer',
                  opacity: loading === tier ? 0.6 : 1,
                }}
              >
                {isCurrent ? '✓ Plan activo'
                  : loading === tier ? 'Cargando…'
                  : 'Elegir este plan'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ribbon(bg, color) {
  return {
    position: 'absolute',
    top: '16px',
    right: '16px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    color,
    background: bg,
    padding: '4px 10px',
    borderRadius: '9999px',
  }
}
