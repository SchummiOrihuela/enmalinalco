'use client'
import { useState } from 'react'

// Formulario de captura del newsletter. Reutilizable (recibe `source` para
// saber de qué página vino el alta). Elegante y a tono con la marca.
export default function SubscribeForm({ source = 'web' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | loading | ok | dup | error

  async function submit(e) {
    e.preventDefault()
    if (state === 'loading') return
    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) setState(data.nuevo ? 'ok' : 'dup')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  const done = state === 'ok' || state === 'dup'

  return (
    <section style={{
      marginTop: 56, padding: '32px 28px', borderRadius: 20,
      background: 'linear-gradient(135deg,#1C3B28,#24402B)',
      border: '1px solid rgba(220,178,74,.3)', textAlign: 'center',
    }}>
      <p style={{ color: '#DCB24A', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
        El finde ideal en Malinalco
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 500, color: '#F6F0E0', margin: '0 0 8px', lineHeight: 1.1 }}>
        Recibe lo mejor del pueblo cada mes
      </h2>
      <p style={{ color: 'rgba(242,237,227,.78)', fontSize: 15, lineHeight: 1.55, margin: '0 auto 20px', maxWidth: '46ch' }}>
        Qué hay abierto, próximos eventos y festivales, lugares nuevos y escapadas listas. Sin spam, solo lo que vale el viaje.
      </p>

      {done ? (
        <p style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: '#A8D6B0', fontSize: 16, fontWeight: 600, margin: 0,
        }}>
          {state === 'ok' ? '🌿 ¡Listo! Revisa tu correo.' : '🌿 Ya estabas en la lista. ¡Gracias!'}
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 440, margin: '0 auto' }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            aria-label="Tu correo"
            style={{
              flex: '1 1 220px', minWidth: 0, boxSizing: 'border-box',
              padding: '13px 16px', borderRadius: 10, fontSize: 15,
              background: 'rgba(246,240,224,.08)', color: '#F6F0E0',
              border: '1px solid rgba(242,237,227,.22)', outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            style={{
              flex: '0 0 auto', padding: '13px 24px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(180deg,#E7C86A,#DCB24A)', color: '#25201A',
              fontSize: 15, fontWeight: 700, cursor: state === 'loading' ? 'default' : 'pointer',
              opacity: state === 'loading' ? 0.7 : 1,
            }}
          >
            {state === 'loading' ? 'Suscribiendo…' : 'Suscribirme'}
          </button>
        </form>
      )}

      {state === 'error' && (
        <p style={{ color: '#E8A08A', fontSize: 13, margin: '12px 0 0' }}>
          No pudimos registrarte. Revisa tu correo e inténtalo de nuevo.
        </p>
      )}
    </section>
  )
}
