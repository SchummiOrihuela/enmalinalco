'use client'
import { useState, useEffect } from 'react'

const TIPOS = ['Reportar un problema', 'Tengo una sugerencia', 'Pedir una mejora', 'Otro']

export default function FeedbackButton({ userEmail, businessName }) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState(TIPOS[0])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function enviar() {
    const asunto = `[Panel] ${tipo}${businessName ? ' — ' + businessName : ''}`
    const cuerpo =
      `Tipo: ${tipo}\n` +
      `Negocio: ${businessName || '—'}\n` +
      `Cuenta: ${userEmail || '—'}\n\n` +
      `${mensaje}`
    window.location.href =
      `mailto:soporte@enmalinalco.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  }

  return (
    <>
      {/* Botón flotante (abajo-izquierda, para no chocar con "volver arriba") */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          left: '24px',
          bottom: '24px',
          zIndex: 50,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          padding: '12px 20px',
          fontSize: '13.5px',
          fontWeight: 700,
          fontFamily: 'inherit',
          color: '#F2EDE3',
          background: 'linear-gradient(180deg, var(--selva), #17301F)',
          border: '1px solid rgba(220,178,74,0.35)',
          borderRadius: '9999px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--oro)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        ¿Un problema, idea o mejora?
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 120,
            background: 'rgba(20,26,20,0.72)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%', maxWidth: '440px',
            background: 'var(--surf)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '32px', height: '32px', borderRadius: '50%',
                border: 'none', background: 'var(--parch)', color: 'var(--ink)',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>

            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--oro)', margin: '0 0 8px' }}>
              Mejoramos juntos
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '26px', fontWeight: 500, color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.1 }}>
              ¿Algo que podamos <em style={{ color: 'var(--verde)', fontStyle: 'italic' }}>mejorar</em>?
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.6, margin: '0 0 22px' }}>
              ¿Falta una función, algo no jala o tienes una idea? Cuéntanos — leemos cada mensaje y así hacemos crecer tu panel.
            </p>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', opacity: 0.7, marginBottom: '6px' }}>
              ¿De qué se trata?
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', fontSize: '15px', fontFamily: 'inherit', color: 'var(--ink)', background: 'var(--parch)', border: '1.5px solid rgba(128,128,128,0.25)', borderRadius: '10px', outline: 'none', marginBottom: '16px', cursor: 'pointer' }}
            >
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', opacity: 0.7, marginBottom: '6px' }}>
              Cuéntanos
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              placeholder="Escribe aquí tu problema, sugerencia o idea…"
              style={{ width: '100%', padding: '12px 14px', fontSize: '15px', fontFamily: 'inherit', color: 'var(--ink)', background: 'var(--parch)', border: '1.5px solid rgba(128,128,128,0.25)', borderRadius: '10px', outline: 'none', marginBottom: '20px', resize: 'vertical', minHeight: '96px', lineHeight: 1.5 }}
            />

            <button
              onClick={enviar}
              disabled={!mensaje.trim()}
              style={{
                width: '100%', padding: '14px', borderRadius: '9999px', border: 'none',
                background: 'var(--ink)', color: 'var(--parch)',
                fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
                cursor: mensaje.trim() ? 'pointer' : 'not-allowed',
                opacity: mensaje.trim() ? 1 : 0.5,
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
