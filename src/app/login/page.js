'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const supabase = createClient()

  async function handleLogin() {
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    else setEnviado(true)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--parch)',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: '24px',
      transition: 'background .4s ease',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--surf)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(27,20,9,0.09), 0 12px 40px rgba(27,20,9,0.07)',
      }}>
        {/* Header */}
        <div style={{ background: 'var(--selva)', padding: '28px 40px', textAlign: 'center' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '26px',
            color: '#F2EDE3',
            letterSpacing: '-0.01em',
          }}>
            en<em style={{ color: 'var(--verde-lt)', fontStyle: 'italic' }}>malinalco</em>
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '40px' }}>
          {enviado ? (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                margin: '0 0 12px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '26px',
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}>
                Revisa tu <em style={{ color: 'var(--verde)', fontStyle: 'italic' }}>correo</em>
              </h1>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.65, color: 'var(--ink)', opacity: 0.6 }}>
                Te enviamos un enlace mágico. Haz clic en él para entrar a tu panel.
              </p>
            </div>
          ) : (
            <>
              <h1 style={{
                margin: '0 0 8px',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '28px',
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}>
                Bienvenido de <em style={{ color: 'var(--verde)', fontStyle: 'italic' }}>vuelta</em>
              </h1>
              <p style={{ margin: '0 0 28px', fontSize: '15px', lineHeight: 1.6, color: 'var(--ink)', opacity: 0.55 }}>
                Ingresa tu correo y te enviamos un enlace seguro para acceder a tu panel.
              </p>

              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  color: 'var(--ink)',
                  background: 'var(--parch)',
                  border: '1.5px solid rgba(128,128,128,0.25)',
                  borderRadius: '9999px',
                  outline: 'none',
                  marginBottom: '14px',
                }}
              />

              <button
                onClick={handleLogin}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  color: 'var(--parch)',
                  background: 'var(--ink)',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                }}
              >
                Enviar enlace mágico
              </button>

              {error && (
                <p style={{ margin: '16px 0 0', fontSize: '13px', color: 'var(--terra)', textAlign: 'center' }}>
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: 'var(--parch)',
          padding: '20px 40px',
          textAlign: 'center',
          borderTop: '1px solid rgba(128,128,128,0.15)',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', opacity: 0.35 }}>
            Hecho con <span style={{ color: 'var(--terra)' }}>&#9829;</span> desde Malinalco, México
          </p>
        </div>
      </div>
    </div>
  )
}
