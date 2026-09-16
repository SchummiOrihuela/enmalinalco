'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { getMaxPhotos, PLANS } from '@/lib/plans'

// Sugerencia del siguiente plan cuando el negocio llena sus fotos.
const NEXT_PLAN = { malinalli: 'cuauhtli', cuauhtli: 'ocelotl' }

// Botón-ícono cuadrado (flechas de reordenar).
function IconBtn({ children, label, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '7px',
        border: '1px solid rgba(128,128,128,0.2)',
        background: 'var(--parch)',
        color: 'var(--ink)',
        opacity: disabled ? 0.3 : 0.85,
        cursor: disabled ? 'default' : 'pointer',
        flexShrink: 0,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}

const h2Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--ink)',
  margin: 0,
}

const counterStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 12px',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--ink)',
  background: 'var(--parch)',
  border: '1.5px solid rgba(128,128,128,0.2)',
  borderRadius: '9999px',
}

export default function PhotosForm({ businessId, initialPhotos, plan }) {
  const maxPhotos = getMaxPhotos(plan)
  const [photos, setPhotos] = useState(initialPhotos || [])
  const [msg, setMsg] = useState(null)
  const [alerta, setAlerta] = useState(null) // ventana flotante: { titulo, texto }
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const atLimit = photos.length >= maxPhotos

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (photos.length >= maxPhotos) {
      setMsg(`Ya tienes tus ${maxPhotos} fotos llenas. Borra una para cambiarla, o mejora tu plan para mostrar más.`)
      e.target.value = ''
      return
    }

    const tiposOk = ['image/jpeg', 'image/png', 'image/webp']
    if (!tiposOk.includes(file.type)) {
      setAlerta({
        titulo: 'Formato no admitido',
        texto: 'Esta foto no se subió. Solo aceptamos imágenes JPG, PNG o WEBP. Convierte tu imagen a uno de esos formatos e inténtalo de nuevo.',
      })
      e.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      const mb = (file.size / (1024 * 1024)).toFixed(1)
      setAlerta({
        titulo: 'La foto es muy pesada',
        texto: `Esta foto pesa ${mb} MB y no se subió, porque el máximo permitido es 2 MB. No es un error: es para que tu ficha cargue rápida. Comprime o reduce el tamaño de la foto e inténtalo de nuevo.`,
      })
      e.target.value = ''
      return
    }

    setUploading(true)
    setMsg('Subiendo...')

    const ext = file.name.split('.').pop()
    const path = `${businessId}/${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('business-photos')
      .upload(path, file)

    if (upErr) { setMsg('Error al subir: ' + upErr.message); setUploading(false); e.target.value = ''; return }

    const { data: pub } = supabase.storage
      .from('business-photos')
      .getPublicUrl(path)

    // sort_order = (máximo actual) + 1, para que NUNCA choque aunque se haya
    // borrado una foto de en medio (borrar no reindexa los sort_order).
    const nextSort = photos.length
      ? Math.max(...photos.map((p) => p.sort_order ?? 0)) + 1
      : 0

    const { data, error } = await supabase
      .from('business_photos')
      .insert({
        business_id: businessId,
        url: pub.publicUrl,
        is_primary: photos.length === 0,
        sort_order: nextSort,
      })
      .select()

    if (error) setMsg('Error al guardar: ' + error.message)
    else { setPhotos((prev) => [...prev, ...data]); setMsg('Foto agregada.') }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(id) {
    const target = photos.find((p) => p.id === id)
    const { error } = await supabase.from('business_photos').delete().eq('id', id)
    if (error) { setMsg('Error: ' + error.message); return }

    let rest = photos.filter((p) => p.id !== id)
    // Si se borró la principal, promovemos la primera restante (menor sort_order)
    // para que siempre haya exactamente una foto "Principal".
    if (target?.is_primary && rest.length) {
      const nueva = [...rest].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]
      await supabase.from('business_photos').update({ is_primary: true }).eq('id', nueva.id)
      rest = rest.map((p) => (p.id === nueva.id ? { ...p, is_primary: true } : p))
    }
    setPhotos(rest)
  }

  // Reasigna sort_order 0..n y marca como principal la primera (índice 0).
  function reindex(arr) {
    return arr.map((p, i) => ({ ...p, sort_order: i, is_primary: i === 0 }))
  }

  // Persiste el nuevo orden en la base. Devuelve el primer error, o null.
  async function persistOrder(arr) {
    for (const p of arr) {
      const { error } = await supabase
        .from('business_photos')
        .update({ sort_order: p.sort_order, is_primary: p.is_primary })
        .eq('id', p.id)
      if (error) return error
    }
    return null
  }

  // Mueve una foto una posición a la izquierda (-1) o derecha (+1).
  async function move(id, dir) {
    const idx = photos.findIndex((p) => p.id === id)
    const to = idx + dir
    if (idx < 0 || to < 0 || to >= photos.length) return
    const arr = [...photos]
    const [x] = arr.splice(idx, 1)
    arr.splice(to, 0, x)
    const next = reindex(arr)
    setPhotos(next)
    setMsg(null)
    const error = await persistOrder(next)
    if (error) setMsg('Error al reordenar: ' + error.message)
  }

  // Hace principal una foto: la lleva al frente.
  async function makePrimary(id) {
    const idx = photos.findIndex((p) => p.id === id)
    if (idx <= 0) return
    const arr = [...photos]
    const [x] = arr.splice(idx, 1)
    arr.unshift(x)
    const next = reindex(arr)
    setPhotos(next)
    setMsg(null)
    const error = await persistOrder(next)
    if (error) setMsg('Error al reordenar: ' + error.message)
  }

  return (
    <div>
      {/* Encabezado con contador */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
        <h2 style={h2Style}>Fotos</h2>
        <span style={counterStyle}>{photos.length} / {maxPhotos}</span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.55, margin: '0 0 20px' }}>
        JPG, PNG o WEBP · máx. 2 MB · usa ◀ ▶ para ordenar y ★ para elegir la principal.
      </p>

      {/* Grid de fotos */}
      {photos.length === 0 ? (
        <div style={{
          padding: '28px',
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--ink)',
          opacity: 0.5,
          background: 'var(--parch)',
          border: '1.5px dashed rgba(128,128,128,0.28)',
          borderRadius: '12px',
          marginBottom: '20px',
        }}>
          Aún no has subido fotos.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {photos.map((p, idx) => (
            <div key={p.id} style={{
              position: 'relative',
              width: 148,
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--surf)',
              border: p.is_primary ? '1.5px solid var(--oro)' : '1px solid rgba(128,128,128,0.18)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
            }}>
              <div style={{ position: 'relative', width: '100%', height: 108 }}>
                <img
                  src={p.url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {p.is_primary && (
                  <span style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: 'var(--ink)',
                    background: 'var(--oro, #C59B1C)',
                    borderRadius: '9999px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}>
                    ★ Principal
                  </span>
                )}
              </div>

              {/* Barra de orden: mover ◀ ▶ y hacer principal ★ */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '6px 4px',
                borderTop: '1px solid rgba(128,128,128,0.14)',
              }}>
                <IconBtn label="Mover a la izquierda" disabled={idx === 0} onClick={() => move(p.id, -1)}>
                  <polyline points="15 18 9 12 15 6" />
                </IconBtn>
                <button
                  onClick={() => makePrimary(p.id)}
                  disabled={p.is_primary}
                  title="Hacer principal"
                  style={{
                    flex: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '5px 0',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    color: p.is_primary ? 'var(--oro)' : 'var(--ink)',
                    opacity: p.is_primary ? 0.55 : 0.85,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: p.is_primary ? 'default' : 'pointer',
                  }}
                >
                  {p.is_primary ? '★ Principal' : '☆ Principal'}
                </button>
                <IconBtn label="Mover a la derecha" disabled={idx === photos.length - 1} onClick={() => move(p.id, 1)}>
                  <polyline points="9 18 15 12 9 6" />
                </IconBtn>
              </div>

              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  width: '100%',
                  padding: '7px 0',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  color: 'var(--terra)',
                  background: 'transparent',
                  border: 'none',
                  borderTop: '1px solid rgba(128,128,128,0.14)',
                  cursor: 'pointer',
                }}
              >
                Borrar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploader — o mensaje cálido de límite con sugerencia de plan */}
      {atLimit ? (
        <div style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(220,178,74,0.14), rgba(220,178,74,0.04))',
          border: '1px solid rgba(220,178,74,0.28)',
          borderRadius: '14px',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>
            ¡Llenaste tus {maxPhotos} fotos! 🎉
          </p>
          {NEXT_PLAN[plan || 'malinalli'] ? (
            <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.7, margin: 0 }}>
              Cada plan tiene su galería para que tu ficha cargue rápida y se vea impecable. Con{' '}
              <strong style={{ color: 'var(--oro)' }}>{PLANS[NEXT_PLAN[plan || 'malinalli']].name}</strong>{' '}
              subes hasta <strong>{PLANS[NEXT_PLAN[plan || 'malinalli']].maxPhotos} fotos</strong> y muestras tu negocio en grande.
              {' '}Cámbialo abajo, en <em>Tu suscripción</em>. Si quieres cambiar alguna, borra una y sube otra.
            </p>
          ) : (
            <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.7, margin: 0 }}>
              Estás en el plan más completo — ya muestras tu negocio en grande. Para cambiar una foto, borra una y sube otra.
            </p>
          )}
        </div>
      ) : (
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 26px',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: 'inherit',
          color: 'var(--parch)',
          background: 'var(--ink)',
          border: 'none',
          borderRadius: '9999px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.6 : 1,
          transition: 'opacity .2s ease',
        }}>
          {uploading ? 'Subiendo…' : '＋ Subir foto'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={atLimit || uploading}
            style={{ display: 'none' }}
          />
        </label>
      )}

      {msg && (() => {
        // Verde solo para confirmaciones ("Subiendo…", "Foto agregada.").
        // Todo lo demás (errores y rechazos de tamaño/tipo/límite) va en alerta.
        const ok = msg.startsWith('Subiendo') || msg.startsWith('Foto agregada')
        return (
          <p style={{
            marginTop: '14px',
            fontSize: '14px',
            color: ok ? 'var(--verde)' : 'var(--terra)',
          }}>
            {msg}
          </p>
        )
      })()}

      {/* Ventana flotante: cuando una foto no se puede subir (tamaño o formato). */}
      {alerta && (
        <div
          onClick={() => setAlerta(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            background: 'rgba(20,28,22,0.55)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 400,
              background: 'var(--surf, #F7F1E4)',
              borderRadius: '16px',
              padding: '26px 24px 22px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.32)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 46, height: 46, margin: '0 auto 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', background: 'rgba(193,74,58,0.12)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--terra)"
                strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 style={{
              margin: '0 0 8px',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '22px', fontWeight: 500, color: 'var(--ink)',
            }}>
              {alerta.titulo}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '14px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.78 }}>
              {alerta.texto}
            </p>
            <button
              type="button"
              onClick={() => setAlerta(null)}
              style={{
                padding: '11px 30px',
                fontSize: '15px', fontWeight: 600, fontFamily: 'inherit',
                color: 'var(--parch)', background: 'var(--ink)',
                border: 'none', borderRadius: '9999px', cursor: 'pointer',
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
