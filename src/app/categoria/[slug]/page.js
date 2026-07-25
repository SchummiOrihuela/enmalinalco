import { createClient } from '@/lib/supabaseServer'
import { toSlug } from '@/lib/slug'
import Link from 'next/link'
import { getPriority, getBadge } from '@/lib/plans'

export default async function CategoriaPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  // Traer todos los negocios activos y filtrar por slug de categoría en código
  const { data: all } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true)

  const businesses = (all || []).filter((b) => toSlug(b.category) === slug)
    .sort((a, b) => getPriority(b.plan) - getPriority(a.plan))

  // Nombre legible: del primer negocio, o derivado del slug si está vacía
  const categoryName =
    businesses.length > 0
      ? businesses[0].category
      : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <h1>{categoryName}</h1>
      <p style={{ color: '#666' }}>{businesses.length} negocio(s)</p>
      {businesses.length === 0 && (
        <p style={{ color: '#999', marginTop: 24 }}>
          Aún no hay negocios en esta categoría. Vuelve pronto.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        {businesses.map((b) => (
          <Link key={b.id} href={`/negocio/${b.slug}`}
            style={{ textDecoration: 'none', color: 'inherit',
                     border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <strong>{b.name}</strong>
            {getBadge(b.plan) && (
              <span style={{ marginLeft: 8, fontSize: 12, background: '#C59B1C', color: '#fff', padding: '2px 8px', borderRadius: 999 }}>
                {getBadge(b.plan)}
              </span>
            )}
            {b.address && <div style={{ color: '#666', fontSize: 14 }}>📍 {b.address}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
