'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'
import { getMaxPhotos } from '@/lib/plans'

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
      setMsg(`Tu plan permite máximo ${maxPhotos} fotos. Mejora tu plan para subir más.`)
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

    const { data, error } = await supabase
      .from('business_photos')
      .insert({
        business_id: businessId,
        url: pub.publicUrl,
        is_primary: photos.length === 0,
        sort_order: photos.length,
      })
      .select()

    if (error) setMsg('Error al guardar: ' + error.message)
    else { setPhotos((prev) => [...prev, ...data]); setMsg('Foto agregada.') }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('business_photos').delete().eq('id', id)
    if (error) setMsg('Error: ' + error.message)
    else setPhotos((prev) => prev.filter((p) => p.id !== id))
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

      {/* Uploader */}
      <label style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 26px',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: 'inherit',
        color: atLimit ? 'var(--ink)' : 'var(--parch)',
        background: atLimit ? 'var(--parch)' : 'var(--ink)',
        border: atLimit ? '1.5px solid rgba(128,128,128,0.25)' : 'none',
        borderRadius: '9999px',
        cursor: atLimit || uploading ? 'not-allowed' : 'pointer',
        opacity: uploading ? 0.6 : atLimit ? 0.55 : 1,
        transition: 'opacity .2s ease',
      }}>
        {uploading ? 'Subiendo…' : atLimit ? 'Límite del plan alcanzado' : '＋ Subir foto'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={atLimit || uploading}
          style={{ display: 'none' }}
        />
      </label>

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
