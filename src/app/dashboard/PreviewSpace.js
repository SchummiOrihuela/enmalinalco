'use client'
import { useState, useEffect } from 'react'

export default function PreviewSpace({ slug }) {
  const [open, setOpen] = useState(false)
  const url = slug ? `/negocio/${slug}` : null

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 28px' }}>
        <button
          onClick={() => url && setOpen(true)}
          disabled={!url}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '13px 26px',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'inherit',
            color: '#25201A',
            background: 'linear-gradient(180deg, #E7C86A, #DCB24A)',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: '9999px',
            cursor: url ? 'pointer' : 'not-allowed',
            opacity: url ? 1 : 0.5,
            boxShadow: '0 6px 20px rgba(220,178,74,0.28)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
          </svg>
          Mira cómo quedó tu espacio
        </button>
      </div>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(20,26,20,0.78)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Barra superior del preview */}
          <div style={{
            width: '100%',
            maxWidth: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <span style={{ color: '#F6F0E0', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
              Vista previa · así lo ven tus clientes
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12.5px', fontWeight: 600, color: '#25201A',
                  background: '#DCB24A', padding: '7px 13px', borderRadius: '9999px', textDecoration: 'none',
                }}
              >
                Abrir en pestaña ↗
              </a>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  border: 'none', background: 'rgba(255,255,255,0.14)', color: '#F6F0E0',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Marco tipo teléfono con la ficha real dentro */}
          <div style={{
            width: '100%',
            maxWidth: '440px',
            height: 'min(78vh, 860px)',
            background: '#000',
            borderRadius: '28px',
            padding: '10px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          }}>
            <iframe
              src={url}
              title="Vista previa de tu ficha"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '20px', background: '#fff' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
