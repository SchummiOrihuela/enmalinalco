import { createClient } from '@/lib/supabaseServer'
import { toSlug } from '@/lib/slug'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CategoriaPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  // Traer todos los negocios activos y filtrar por slug de categoría en código
  const { data: all } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true)

  const businesses = (all || []).filter((b) => toSlug(b.category) === slug)

  if (businesses.length === 0) notFound()

  // Nombre legible de la categoría (tomado del primer negocio)
  const categoryName = businesses[0].category

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <h1>{categoryName}</h1>
      <p style={{ color: '#666' }}>{businesses.length} negocio(s)</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        {businesses.map((b) => (
          <Link key={b.id} href={`/negocio/${b.slug}`}
            style={{ textDecoration: 'none', color: 'inherit',
                     border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <strong>{b.name}</strong>
            {b.address && <div style={{ color: '#666', fontSize: 14 }}>📍 {b.address}</div>}
          </Link>
        ))}
      </div>
    </div>
  )
}
