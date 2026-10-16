'use client'
import { useState } from 'react'
import { PLANS, BILLING, GUARANTEE, getMonthlyEquivalent, getAnnualSavings } from '@/lib/plans'

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

export default function PlansSection({ businessId, currentPlan, isActive }) {
  const [loading, setLoading] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [billing, setBilling] = useState('mensual') // 'mensual' | 'anual'

  // Un plan solo cuenta como "actual" si el negocio pagó (is_active).
  // Sin pago, el negocio no tiene plan activo aunque la columna `plan`
  // traiga el valor por defecto (malinalli).
  const activePlan = isActive ? currentPlan : null

  async function handleSubscribe(tier) {
    if (loading) return
    setLoading(tier)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, businessId, billing }),
      })
      const data = await res.json()
      if (data.url) { window.location.assign(data.url) }
      else { alert(data.error || 'Error al iniciar el checkout'); setLoading(null) }
    } catch (err) {
      alert('Error de conexión. Intenta de nuevo.'); setLoading(null)
    }
  }

  const currentName = activePlan ? PLANS[activePlan]?.name : null

  return (
    <div>
      {/* Pulso tenue para el plan activo (se detiene al pasar el cursor). */}
      <style>{`
        @keyframes planPulse {
          0%   { box-shadow: 0 0 0 0 rgba(220,178,74,0.55), 0 10px 30px rgba(220,178,74,0.10); }
          65%  { box-shadow: 0 0 0 16px rgba(220,178,74,0), 0 10px 30px rgba(220,178,74,0.10); }
          100% { box-shadow: 0 0 0 0 rgba(220,178,74,0), 0 10px 30px rgba(220,178,74,0.10); }
        }
        .plan-pulse { animation: planPulse 2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .plan-pulse { animation: none; } }
      `}</style>
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
          : <><strong style={{
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '0.01em',
                color: 'var(--oro)',
              }}>Sin plan activo</strong>. Elige el que mejor le quede a tu negocio.</>}
      </p>

      {/* Toggle de ciclo: mensual vs. anual (2 meses gratis) */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '4px', marginBottom: '20px', borderRadius: '9999px',
        background: 'rgba(37,32,26,0.06)', border: '1px solid rgba(128,128,128,0.18)',
      }}>
        {['mensual', 'anual'].map((b) => {
          const on = billing === b
          return (
            <button key={b} type="button" onClick={() => setBilling(b)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '7px 16px', borderRadius: '9999px', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: 700,
                background: on ? 'var(--ink)' : 'transparent',
                color: on ? 'var(--parch)' : 'var(--ink)',
                transition: 'background .2s ease, color .2s ease',
              }}>
              {BILLING[b].label}
              {b === 'anual' && (
                <span style={{
                  fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.04em', padding: '2px 7px', borderRadius: '9999px',
                  background: on ? 'var(--verde-lt)' : 'rgba(58,107,71,0.16)',
                  color: on ? '#1C3B28' : 'var(--verde)',
                }}>2 meses gratis</span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
        {ORDER.map((tier) => {
          const p = PLANS[tier]
          const isCurrent = activePlan === tier
          const isHover = hovered === tier
          return (
            <div key={tier}
              className={isCurrent && !isHover ? 'plan-pulse' : undefined}
              onMouseEnter={() => setHovered(tier)}
              onMouseLeave={() => setHovered(null)}
              style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: isCurrent ? '1.5px solid var(--oro)' : '1px solid rgba(128,128,128,0.22)',
              borderRadius: '18px',
              padding: '24px 22px',
              background: isCurrent
                ? 'linear-gradient(160deg, rgba(220,178,74,0.16), rgba(220,178,74,0.03))'
                : 'var(--parch)',
              transform: isHover ? 'translateY(-6px) scale(1.025)' : 'translateY(0) scale(1)',
              boxShadow: isHover
                ? '0 18px 44px rgba(0,0,0,0.22), 0 0 0 1px rgba(220,178,74,0.35)'
                : isCurrent
                  ? '0 0 0 4px rgba(220,178,74,0.10), 0 10px 30px rgba(220,178,74,0.10)'
                  : 'none',
              transition: 'transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s ease',
              zIndex: isHover ? 2 : 1,
            }}>
              {/* Cinta de estado (solo el plan activo la lleva; así las 3 alinean) */}
              {isCurrent && (
                <span style={ribbon('var(--oro)', 'var(--ink)')}>Tu plan actual</span>
              )}

              {/* Nombre */}
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '34px',
                fontStyle: 'italic',
                fontWeight: 600,
                color: isCurrent ? 'var(--oro)' : 'var(--ink)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                marginTop: isCurrent ? '22px' : 0,
                paddingRight: '4px',
              }}>
                {p.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.6, margin: '6px 0 16px' }}>
                {p.tagline}
              </div>

              {/* Precio (según ciclo) */}
              <div style={{ marginBottom: '18px', minHeight: '58px' }}>
                <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--ink)' }}>
                  ${(billing === 'anual' ? p.priceAnual : p.price).toLocaleString('es-MX')}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--ink)', opacity: 0.5 }}>
                  {' '}{billing === 'anual' ? '/año' : '/mes'} MXN
                </span>
                {billing === 'anual' && (
                  <div style={{ fontSize: '12px', color: 'var(--verde)', fontWeight: 600, marginTop: '4px' }}>
                    ≈ ${getMonthlyEquivalent(tier).toLocaleString('es-MX')}/mes · ahorras ${getAnnualSavings(tier).toLocaleString('es-MX')} al año
                  </div>
                )}
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

      {/* Garantía + sin permanencia: quita el miedo al pago recurrente. */}
      {GUARANTEE.active && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          marginTop: '20px', padding: '16px 18px', borderRadius: '14px',
          background: 'rgba(58,107,71,0.10)', border: '1px solid rgba(58,107,71,0.28)',
        }}>
          <span aria-hidden="true" style={{ fontSize: '20px', lineHeight: 1.1 }}>🛡️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--verde)', marginBottom: '2px' }}>
              {GUARANTEE.short} · sin permanencia
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.8, lineHeight: 1.5 }}>
              {GUARANTEE.copy} Cancela cuando quieras, desde aquí mismo.
            </div>
          </div>
        </div>
      )}
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
