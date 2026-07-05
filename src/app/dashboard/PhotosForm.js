'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

export default function PhotosForm({ businessId, initialPhotos }) {
  const [photos, setPhotos] = useState(initialPhotos || [])
  const [msg, setMsg] = useState(null)
  const supabase = createClient()

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return

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

    setMsg('Subiendo...')

    const ext = file.name.split('.').pop()
    const path = `${businessId}/${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('business-photos')
      .upload(path, file)

    if (upErr) { setMsg('Error al subir: ' + upErr.message); return }

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
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('business_photos').delete().eq('id', id)
    if (error) setMsg('Error: ' + error.message)
    else setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div style={{ marginTop: 32, maxWidth: 500 }}>
      <h2>Fotos</h2>

      {photos.length === 0 && <p>Sin fotos aún.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {photos.map((p) => (
          <div key={p.id} style={{ position: 'relative' }}>
            <img src={p.url} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4 }} />
            {p.is_primary && <span style={{ position: 'absolute', top: 2, left: 2, background: '#000a', color: '#fff', fontSize: 11, padding: '1px 4px' }}>Principal</span>}
            <button onClick={() => handleDelete(p.id)} style={{ display: 'block', marginTop: 2, fontSize: 12 }}>Borrar</button>
          </div>
        ))}
      </div>

      <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: 12 }} />
      {msg && <p>{msg}</p>}
    </div>
  )
}
