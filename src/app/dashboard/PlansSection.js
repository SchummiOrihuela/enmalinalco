'use client'
import { useState } from 'react'

const PLANS = [
  { tier: 'malinalli', name: 'Malinalli', price: '$99',  sub: 'Perfil esencial · 3 fotos', badge: false },
  { tier: 'cuauhtli',  name: 'Cuāuhtli',  price: '$249', sub: 'Perfil premium · 10 fotos · Prioridad', badge: false },
  { tier: 'ocelotl',   name: 'Ocēlōtl',   price: '$449', sub: 'Ficha exclusiva · Artículo editorial', badge: true },
]

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: '0 0 8px',
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

  return (
    <div>
      <h2 style={h2Style}>Tu suscripción</h2>
      <p style={{ fontSize: '14px', color: 'var(--ink)', opacity: 0.6, marginBottom: '20px' }}>
        Plan actual: <strong>{currentPlan || 'Sin plan activo'}</strong>
      </p>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {PLANS.map(p => {
          const isCurrent = currentPlan === p.tier
          return (
            <div key={p.tier} style={{
              position: 'relative',
              border: isCurrent ? '2px solid var(--verde)' : '1px solid rgba(128,128,128,0.22)',
              borderRadius: '16px',
              padding: '22px',
              minWidth: 220,
              flex: '1 1 220px',
              background: 'var(--parch)',
            }}>
              {p.badge && (
                <span style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#fff',
                  background: 'var(--oro)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}>
                  Ocēlōtl
                </span>
              )}
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '22px',
                fontStyle: 'italic',
                color: 'var(--ink)',
              }}>
                {p.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.55, margin: '6px 0 12px', lineHeight: 1.4 }}>
                {p.sub}
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
                {p.price} <span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.5 }}>/mes MXN</span>
              </div>
              <button
                onClick={() => handleSubscribe(p.tier)}
                disabled={loading !== null || isCurrent}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isCurrent ? 'rgba(128,128,128,0.3)' : 'var(--ink)',
                  color: isCurrent ? 'var(--ink)' : 'var(--parch)',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: isCurrent ? 'default' : 'pointer',
                  opacity: loading === p.tier ? 0.6 : 1,
                }}
              >
                {isCurrent ? 'Plan actual'
                  : loading === p.tier ? 'Cargando…'
                  : 'Suscribirse'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
