'use client'
import { useState } from 'react'

const PLANS = [
  { tier: 'malinalli', name: 'Malinalli', price: '$99',  sub: 'Perfil esencial · 3 fotos' },
  { tier: 'cuauhtli',  name: 'Cuāuhtli',  price: '$249', sub: 'Perfil premium · 10 fotos · Prioridad' },
  { tier: 'ocelotl',   name: 'Ocēlōtl',   price: '$449', sub: 'Ficha exclusiva · Artículo editorial' },
]

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
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #ddd' }}>
      <h2>Tu suscripción</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Plan actual: <strong>{currentPlan || 'Sin plan activo'}</strong>
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {PLANS.map(p => (
          <div key={p.tier} style={{
            border: currentPlan === p.tier ? '2px solid #3A6B47' : '1px solid #ccc',
            borderRadius: 12, padding: 16, minWidth: 220, flex: '1 1 220px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: '#666', margin: '4px 0 8px' }}>{p.sub}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              {p.price} <span style={{ fontSize: 12, fontWeight: 400 }}>/mes MXN</span>
            </div>
            <button
              onClick={() => handleSubscribe(p.tier)}
              disabled={loading !== null || currentPlan === p.tier}
              style={{
                width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                background: currentPlan === p.tier ? '#ccc' : '#1B1409',
                color: '#fff', fontWeight: 600, cursor: 'pointer',
                opacity: loading === p.tier ? 0.6 : 1,
              }}
            >
              {currentPlan === p.tier ? 'Plan actual'
                : loading === p.tier ? 'Cargando…'
                : 'Suscribirse'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
