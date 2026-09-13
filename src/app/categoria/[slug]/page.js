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

  // Primera foto de cada negocio (la de menor sort_order) para la miniatura
  const firstPhoto = {}
  const ids = businesses.map((b) => b.id)
  if (ids.length) {
    const { data: photos } = await supabase
      .from('business_photos')
      .select('business_id,url,sort_order')
      .in('business_id', ids)
      .order('sort_order')
    for (const p of photos || []) {
      if (firstPhoto[p.business_id] === undefined) firstPhoto[p.business_id] = p.url
    }
  }

  // Nombre legible: del primer negocio, o derivado del slug si está vacía
  const categoryName =
    businesses.length > 0
      ? businesses[0].category
      : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <style>{`
        .cat-back{display:inline-flex;align-items:center;gap:8px;margin-bottom:28px;
          font-size:14px;font-weight:600;color:#DCB24A;text-decoration:none;
          transition:gap .25s ease,color .25s ease}
        .cat-back:hover{gap:12px;color:#EBC66A}
        .cat-card{display:flex;align-items:center;gap:16px;justify-content:space-between;
          border:1px solid rgba(242,237,227,.14);border-radius:14px;padding:16px;
          text-decoration:none;color:inherit;background:rgba(242,237,227,.02);
          transition:border-color .25s ease,background .25s ease,transform .25s ease,box-shadow .25s ease}
        .cat-card:hover{border-color:rgba(220,178,74,.55);background:rgba(220,178,74,.06);
          transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.25)}
        .cat-card:focus-visible{outline:2px solid #DCB24A;outline-offset:3px}
        .cat-card-info{min-width:0}
        .cat-thumb{flex:none;width:96px;height:96px;border-radius:10px;object-fit:cover;
          background:rgba(242,237,227,.06)}
        .cat-thumb-ph{flex:none;width:96px;height:96px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;font-size:26px;
          background:rgba(242,237,227,.06);color:rgba(242,237,227,.3)}
      `}</style>

      <Link href="/#categorias" className="cat-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        Volver al directorio
      </Link>

      <h1 style={{ margin: '0 0 4px' }}>{categoryName}</h1>
      <p style={{ color: 'rgba(242,237,227,.55)', margin: 0 }}>{businesses.length} negocio(s)</p>

      {businesses.length === 0 && (
        <p style={{ color: 'rgba(242,237,227,.5)', marginTop: 24 }}>
          Aún no hay negocios en esta categoría. Vuelve pronto.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        {businesses.map((b) => (
          <Link key={b.id} href={`/negocio/${b.slug}`} className="cat-card">
            <div className="cat-card-info">
              <strong>{b.name}</strong>
              {getBadge(b.plan) && (
                <span style={{ marginLeft: 8, fontSize: 12, background: '#C59B1C', color: '#fff', padding: '2px 8px', borderRadius: 999 }}>
                  {getBadge(b.plan)}
                </span>
              )}
              {b.address && (
                <div style={{ color: 'rgba(242,237,227,.55)', fontSize: 14, marginTop: 4 }}>📍 {b.address}</div>
              )}
            </div>
            {firstPhoto[b.id] ? (
              <img className="cat-thumb" src={firstPhoto[b.id]} alt={b.name} />
            ) : (
              <div className="cat-thumb-ph" aria-hidden="true">🏛️</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
