import { createClient } from '@/lib/supabaseServer'
import { toSlug } from '@/lib/slug'
import Link from 'next/link'
import { getPriority, getBadge } from '@/lib/plans'
import { CATEGORIA_POR_SLUG } from '@/lib/categorias'
import PublicShell from '@/app/components/PublicShell'
import { BrandTile } from '@/app/components/BrandIcon'

// Siempre renderizar en el servidor con datos frescos (sin caché estática).
// Evita que fotos/negocios recién publicados aparezcan solo en unos dispositivos.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SITE_URL = 'https://enmalinalco.com'

// Título y descripción únicos por categoría (antes heredaban el de la home).
export async function generateMetadata({ params }) {
  const { slug } = await params
  const meta = CATEGORIA_POR_SLUG[slug]
  const nombre = meta?.nombre || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const title = `${nombre} en Malinalco — Guía y Directorio`
  const description =
    meta?.descripcion ||
    `${nombre} en Malinalco, Pueblo Mágico del Estado de México. Encuéntralos en la guía En Malinalco.`
  const url = `${SITE_URL}/categoria/${slug}`

  return {
    title,
    description,
    alternates: { canonical: `/categoria/${slug}` },
    openGraph: {
      type: 'website',
      url,
      siteName: 'enmalinalco.com',
      locale: 'es_MX',
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

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
      .select('business_id,url,sort_order,is_primary')
      .in('business_id', ids)
      .order('is_primary', { ascending: false })
      .order('sort_order')
    // Primera por negocio: la marcada como principal, o la de menor sort_order.
    for (const p of photos || []) {
      if (firstPhoto[p.business_id] === undefined) firstPhoto[p.business_id] = p.url
    }
  }

  // Metadatos de la categoría (fuente única de verdad)
  const meta = CATEGORIA_POR_SLUG[slug]

  // Nombre legible: del config, o del primer negocio, o derivado del slug
  const categoryName =
    meta?.nombre ||
    (businesses.length > 0
      ? businesses[0].category
      : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))

  // Datos estructurados: lista de negocios de la categoría + migas de pan.
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} en Malinalco`,
    itemListElement: businesses.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/negocio/${b.slug}`,
      name: b.name,
    })),
  }
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Directorio', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `${SITE_URL}/categoria/${slug}` },
    ],
  }

  return (
    <PublicShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px 80px' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 0 10px' }}>
        {meta?.svg && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: meta.color, color: '#EFE7D0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: meta.svg }} />
          </span>
        )}
        <h1 style={{
          margin: 0,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 44, fontWeight: 500, color: '#F6F0E0', lineHeight: 1.05,
        }}>
          {categoryName}
        </h1>
      </div>
      {meta?.descripcion && (
        <p style={{ color: 'rgba(242,237,227,.78)', margin: '0 0 6px', maxWidth: '58ch', lineHeight: 1.6 }}>
          {meta.descripcion}
        </p>
      )}
      <p style={{ color: '#DCB24A', margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}>
        {businesses.length} {businesses.length === 1 ? 'negocio' : 'negocios'}
      </p>

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
              {(() => {
                // Íconos de lo que el visitante encontrará adentro (según plan).
                const social = getPriority(b.plan) >= 2
                const brands = []
                if (b.whatsapp) brands.push('whatsapp')
                if (b.instagram && social) brands.push('instagram')
                if (b.facebook && social) brands.push('facebook')
                if (b.maps_url || (b.lat && b.lng)) brands.push('maps')
                if (!brands.length) return null
                return (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {brands.map((br) => <BrandTile key={br} brand={br} size={24} />)}
                  </div>
                )
              })()}
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
    </PublicShell>
  )
}
