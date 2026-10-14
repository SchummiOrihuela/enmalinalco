import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'
import PublicShell from '@/app/components/PublicShell'
import { CATEGORIAS } from '@/lib/categorias'
import { getPriority } from '@/lib/plans'
import { applyVisible } from '@/lib/visibility'
import { toSlug } from '@/lib/slug'
import { estadoHorario } from '@/lib/hours'
import MapShell from './MapShell'

const SITE_URL = 'https://enmalinalco.com'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Mapa de Malinalco — Negocios y lugares, abiertos ahora',
  description:
    'El mapa interactivo de Malinalco: ubica restaurantes, hospedaje, balnearios y más, y filtra por categoría y por lo que está abierto ahora mismo.',
  alternates: { canonical: '/mapa' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/mapa`,
    siteName: 'enmalinalco.com',
    locale: 'es_MX',
    title: 'Mapa de Malinalco — Negocios y lugares',
    description: 'Ubica negocios en el mapa del pueblo y filtra por categoría y horario.',
  },
}

export default async function MapaPage() {
  const supabase = await createClient()

  const { data: all } = await applyVisible(
    supabase.from('businesses').select('*')
  )
  // Solo los que tienen coordenadas para pintar en el mapa.
  const businesses = (all || [])
    .filter((b) => b.lat != null && b.lng != null && isFinite(Number(b.lat)) && isFinite(Number(b.lng)))
    .sort((a, b) => getPriority(b.plan) - getPriority(a.plan))

  const ids = businesses.map((b) => b.id)

  const firstPhoto = {}
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

  const hoursByBiz = {}
  if (ids.length) {
    const { data: hrs } = await supabase
      .from('business_hours')
      .select('business_id,day_of_week,open_time,close_time,break_start,break_end,is_closed')
      .in('business_id', ids)
    for (const h of hrs || []) (hoursByBiz[h.business_id] ||= []).push(h)
  }

  const items = businesses.map((b) => {
    const e = estadoHorario(hoursByBiz[b.id] || [])
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      category: b.category || '',
      categorySlug: toSlug(b.category || ''),
      lat: Number(b.lat),
      lng: Number(b.lng),
      photo: firstPhoto[b.id] || null,
      estado: { open: !!e.open, opensSoon: !!e.opensSoon, label: e.label || '' },
    }
  })

  const categorias = CATEGORIAS.map((c) => ({ slug: c.slug, nombre: c.nombre }))

  return (
    <PublicShell>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
          <Link href="/directorio" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 600, color: '#DCB24A', textDecoration: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Ver como lista
          </Link>
        </div>

        <h1 style={{
          margin: '0 0 8px',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 44, fontWeight: 500, color: '#F6F0E0', lineHeight: 1.05,
        }}>
          Mapa de Malinalco
        </h1>
        <p style={{ color: 'rgba(242,237,227,.78)', margin: '0 0 24px', maxWidth: '58ch', lineHeight: 1.6 }}>
          Todo el pueblo en un mapa. Filtra por categoría y por lo que está abierto ahora mismo —ideal para decidir a dónde ir según dónde estés.
        </p>

        {items.length === 0 ? (
          <p style={{ color: 'rgba(242,237,227,.6)' }}>
            Aún no hay negocios con ubicación en el mapa. Los negocios pueden agregar su ubicación desde su panel.
          </p>
        ) : (
          <MapShell items={items} categorias={categorias} />
        )}
      </div>
    </PublicShell>
  )
}
