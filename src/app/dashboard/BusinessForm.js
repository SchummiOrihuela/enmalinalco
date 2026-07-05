'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

export default function BusinessForm({ business, userId }) {
  const [name, setName] = useState(business?.name || '')
  const [category, setCategory] = useState(business?.category || '')
  const [slug, setSlug] = useState(business?.slug || '')
  const [msg, setMsg] = useState(null)

  const supabase = createClient()

  async function handleSave() {
    setMsg('Guardando...')

    const datos = { name, category, slug, owner_id: userId }

    let error
    if (business) {
      ({ error } = await supabase
        .from('businesses')
        .update(datos)
        .eq('id', business.id))
    } else {
      ({ error } = await supabase
        .from('businesses')
        .insert(datos))
    }

    if (error) setMsg('Error: ' + error.message)
    else setMsg('Guardado correctamente.')
  }

  return (
    <div style={{ marginTop: 24, maxWidth: 400 }}>
      <h2>{business ? 'Editar negocio' : 'Crear negocio'}</h2>

      <label>Nombre</label>
      <input value={name} onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: 8, margin: '8px 0' }} />

      <label>Categoría</label>
      <input value={category} onChange={(e) => setCategory(e.target.value)}
        style={{ width: '100%', padding: 8, margin: '8px 0' }} />

      <label>Slug (URL única)</label>
      <input value={slug} onChange={(e) => setSlug(e.target.value)}
        style={{ width: '100%', padding: 8, margin: '8px 0' }} />

      <button onClick={handleSave} style={{ padding: '8px 16px', marginTop: 8 }}>
        Guardar
      </button>

      {msg && <p>{msg}</p>}
    </div>
  )
}
