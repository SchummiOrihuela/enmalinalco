'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BrandTile } from '@/app/components/BrandIcon'

// Quita acentos y pasa a minúsculas para una búsqueda tolerante.
const norm = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function DirectoryBrowser({ businesses, categorias }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  // Conteo por categoría (para las fichas de filtro).
  const counts = useMemo(() => {
    const m = {}
    for (const b of businesses) m[b.categorySlug] = (m[b.categorySlug] || 0) + 1
    return m
  }, [businesses])

  const results = useMemo(() => {
    const needle = norm(q.trim())
    return businesses.filter((b) => {
      if (cat !== 'all' && b.categorySlug !== cat) return false
      if (!needle) return true
      return norm(b.haystack).includes(needle)
    })
  }, [businesses, q, cat])

  // Solo categorías que tienen al menos un negocio.
  const cats = categorias.filter((c) => counts[c.slug])

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#DCB24A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca por nombre, servicio o lugar…"
          aria-label="Buscar en el directorio"
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '14px 16px 14px 44px',
            background: 'rgba(242,237,227,.05)',
            border: '1px solid rgba(242,237,227,.16)',
            borderRadius: 12, color: '#F6F0E0', fontSize: 16, outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 20 }}>
        <Chip active={cat === 'all'} onClick={() => setCat('all')} label="Todos" n={businesses.length} />
        {cats.map((c) => (
          <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)} label={c.nombre} n={counts[c.slug]} />
        ))}
      </div>

      <p style={{ color: '#DCB24A', margin: '0 0 16px', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}>
        {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
      </p>

      {results.length === 0 ? (
        <p style={{ color: 'rgba(242,237,227,.55)', marginTop: 8 }}>
          No encontramos negocios con esa búsqueda. Prueba otra palabra o cambia de categoría.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {results.map((b) => (
            <Link key={b.id} href={`/negocio/${b.slug}`} className="cat-card">
              <div className="cat-card-info">
                <strong>{b.name}</strong>
                {b.badge && (
                  <span style={{ marginLeft: 8, fontSize: 12, background: '#C59B1C', color: '#fff', padding: '2px 8px', borderRadius: 999 }}>
                    {b.badge}
                  </span>
                )}
                <div style={{ color: 'rgba(242,237,227,.55)', fontSize: 13, marginTop: 4 }}>{b.category}</div>
                {b.address && (
                  <div style={{ color: 'rgba(242,237,227,.55)', fontSize: 14, marginTop: 4 }}>📍 {b.address}</div>
                )}
                {b.brands.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {b.brands.map((br) => <BrandTile key={br} brand={br} size={24} />)}
                  </div>
                )}
              </div>
              {b.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cat-thumb" src={b.photo} alt={b.name} />
              ) : (
                <div className="cat-thumb-ph" aria-hidden="true">🏛️</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, label, n }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
        padding: '8px 14px', borderRadius: 9999, cursor: 'pointer',
        fontSize: 14, fontWeight: 600,
        border: active ? '1px solid #F58529' : '1px solid rgba(242,237,227,.18)',
        background: active ? '#F58529' : 'transparent',
        color: active ? '#241A10' : '#F0E8D4',
        transition: 'background .18s ease,color .18s ease,border-color .18s ease',
      }}
    >
      {label}
      <span style={{ fontSize: 12, fontWeight: 800, opacity: active ? 0.7 : 0.5 }}>{n}</span>
    </button>
  )
}
