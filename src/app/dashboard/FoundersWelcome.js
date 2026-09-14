'use client'
import { useState } from 'react'
import { FOUNDERS } from '@/lib/plans'

export default function FoundersWelcome({ number, remaining, shareUrl }) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  const shareText =
    `¡Me sumé como Fundador de enmalinalco.com, el directorio de negocios de Malinalco! ` +
    `Estrena tu ficha tú también 👉 ${shareUrl}`
  const waHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', background: 'rgba(10,12,8,0.72)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: '440px',
          background: 'var(--surf)', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(10,12,8,0.5)',
        }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px',
            borderRadius: '50%', border: '1px solid rgba(128,128,128,0.3)',
            background: 'transparent', color: 'var(--ink)', cursor: 'pointer', fontSize: '16px',
          }}
        >
          ✕
        </button>

        <div style={{
          background: 'linear-gradient(135deg, rgba(200,150,60,0.16), rgba(58,107,71,0.16))',
          padding: '32px 28px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', lineHeight: 1 }}>🌵</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '30px', fontWeight: 400, color: 'var(--ink)', margin: '12px 0 4px',
          }}>
            ¡Felicidades!
          </h2>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--ink)', opacity: 0.75 }}>
            Eres miembro <strong>Fundador #{number}</strong> de enmalinalco.
          </p>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)', opacity: 0.8 }}>
            Aseguraste tu lugar con una <strong>tarifa preferente de Fundador</strong>: {FOUNDERS.descuento}% menos
            durante tus primeros <strong>{FOUNDERS.mesesDescuento} meses</strong>. Es el momento de sacarle
            provecho a tu ficha — del cuarto mes en adelante, precio normal. Sin permanencia.
          </p>

          <div style={{
            background: 'var(--parch)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px',
            fontSize: '14px', color: 'var(--ink)', textAlign: 'center',
          }}>
            {remaining > 0
              ? <>Solo quedan <strong>{remaining} {remaining === 1 ? 'lugar' : 'lugares'} Fundador</strong>. Corre la voz.</>
              : <>Con esto se completan los <strong>{FOUNDERS.cupos} lugares Fundador</strong>. ¡Gracias por estrenar el directorio!</>}
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', padding: '14px 24px', fontSize: '15px', fontWeight: 700,
              color: '#fff', background: 'var(--verde)', borderRadius: '9999px', textDecoration: 'none',
            }}
          >
            📲 Compartir por WhatsApp
          </a>
          <p style={{ margin: '14px 0 0', fontSize: '13px', color: 'var(--ink)', opacity: 0.55, textAlign: 'center' }}>
            Comparte con otros locatarios del pueblo y ayúdanos a estrenar el directorio.
          </p>
        </div>
      </div>
    </div>
  )
}
