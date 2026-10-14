import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'
import PublicShell from '@/app/components/PublicShell'
import { CATEGORIAS } from '@/lib/categorias'
import { getPriority, getBadge } from '@/lib/plans'
import { applyVisible } from '@/lib/visibility'
import { toSlug } from '@/lib/slug'
import { estadoHorario } from '@/lib/hours'
import DirectoryBrowser from './DirectoryBrowser'

const SITE_URL = 'https://enmalinalco.com'

// Datos frescos: refleja negocios y fotos recién publicados.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Directorio de Malinalco — Busca negocios, servicios y lugares',
  description:
    'Busca y filtra todo el directorio de Malinalco: restaurantes, hospedaje, balnearios, ecoturismo, servicios y más. Encuentra lo que necesitas en el Pueblo Mágico.',
  alternates: { canonical: '/directorio' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/directorio`,
    siteName: 'enmalinalco.com',
    locale: 'es_MX',
    title: 'Directorio de Malinalco — Busca negocios, servicios y lugares',
    description: 'Busca y filtra todo el directorio de Malinalco en un solo lugar.',
  },
}

export default async function DirectorioPage() {
  const supabase = await createClient()

  const { data: all } = await applyVisible(
    supabase.from('businesses').select('*')
  )
  const businesses = (all || []).sort((a, b) => getPriority(b.plan) - getPriority(a.plan))

  // Primera foto (principal o de menor sort_order) por negocio, para la miniatura.
  const firstPhoto = {}
  const ids = businesses.map((b) => b.id)
  if (ids.length) {
    const { data: photos } = await supabase
      .from('business_photos')
      .select('business_id,url,sort_order,is_primary')
      .in('business_id', ids)
      .order('is_primary', { ascending: false })
      .order('sort_order')
    for (const p of photos || []) {
      if (firstPhoto[p.business_id] === undefined) firstPhoto[p.business_id] = p.url
    }
  }

  // Horarios por negocio, para calcular "abierto ahora".
  const hoursByBiz = {}
  if (ids.length) {
    const { data: hrs } = await supabase
      .from('business_hours')
      .select('business_id,day_of_week,open_time,close_time,break_start,break_end,is_closed')
      .in('business_id', ids)
    for (const h of hrs || []) (hoursByBiz[h.business_id] ||= []).push(h)
  }

  // Serializa solo lo que el buscador necesita (nada de datos sensibles).
  const items = businesses.map((b) => {
    const social = getPriority(b.plan) >= 2
    const brands = []
    if (b.whatsapp) brands.push('whatsapp')
    if (b.instagram && social) brands.push('instagram')
    if (b.facebook && social) brands.push('facebook')
    if (b.maps_url || (b.lat && b.lng)) brands.push('maps')
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      category: b.category || '',
      categorySlug: toSlug(b.category || ''),
      address: b.address || '',
      badge: getBadge(b.plan) || null,
      brands,
      photo: firstPhoto[b.id] || null,
      estado: (() => {
        const e = estadoHorario(hoursByBiz[b.id] || [])
        return e.label ? { open: e.open, label: e.label, soon: e.soon } : null
      })(),
      // Texto plano para la búsqueda (no se muestra).
      haystack: [b.name, b.category, b.address, b.description].filter(Boolean).join(' '),
    }
  })

  const categorias = CATEGORIAS.map((c) => ({ slug: c.slug, nombre: c.nombre }))

  return (
    <PublicShell>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px 80px' }}>
        <style>{`
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

        <Link href="/#categorias" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
          fontSize: 14, fontWeight: 600, color: '#DCB24A', textDecoration: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Explorar por categoría
        </Link>

        <h1 style={{
          margin: '0 0 8px',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 44, fontWeight: 500, color: '#F6F0E0', lineHeight: 1.05,
        }}>
          Directorio de Malinalco
        </h1>
        <p style={{ color: 'rgba(242,237,227,.78)', margin: '0 0 24px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Busca y filtra todo lo que hay en el pueblo: restaurantes, hospedaje, balnearios, ecoturismo, servicios y más.
        </p>

        <DirectoryBrowser businesses={items} categorias={categorias} />
      </div>
    </PublicShell>
  )
}
