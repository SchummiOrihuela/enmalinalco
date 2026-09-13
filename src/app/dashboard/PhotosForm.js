'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { getMaxPhotos, PLANS } from '@/lib/plans'

// Sugerencia del siguiente plan cuando el negocio llena sus fotos.
const NEXT_PLAN = { malinalli: 'cuauhtli', cuauhtli: 'ocelotl' }

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
      setMsg('Solo se permiten imágenes JPG, PNG o WEBP.')
      e.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMsg('La imagen supera 2 MB. Comprímela e inténtalo de nuevo.')
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

  return (
    <div>
      {/* Encabezado con contador */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
        <h2 style={h2Style}>Fotos</h2>
        <span style={counterStyle}>{photos.length} / {maxPhotos}</span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.55, margin: '0 0 20px' }}>
        JPG, PNG o WEBP · máx. 2 MB · la primera foto será la principal.
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
          {photos.map((p) => (
            <div key={p.id} style={{
              position: 'relative',
              width: 132,
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--parch)',
              border: '1px solid rgba(27,20,9,0.08)',
              boxShadow: '0 1px 4px rgba(27,20,9,0.06)',
            }}>
              <div style={{ position: 'relative', width: '100%', height: 100 }}>
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
                  borderTop: '1px solid rgba(27,20,9,0.08)',
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

      {msg && (
        <p style={{
          marginTop: '14px',
          fontSize: '14px',
          color: msg.startsWith('Error') ? 'var(--terra)' : 'var(--verde)',
        }}>
          {msg}
        </p>
      )}
    </div>
  )
}
