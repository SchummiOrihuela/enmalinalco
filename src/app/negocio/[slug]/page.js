import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import { after } from 'next/server'
import Link from 'next/link'
import ReviewsList from '@/app/dashboard/ReviewsList'
import { getBadge, getPriority } from '@/lib/plans'
import ReviewForm from '@/app/dashboard/ReviewForm'
import { toSlug } from '@/lib/slug'
import { CATEGORIA_POR_SLUG } from '@/lib/categorias'
import { BrandTile } from '@/app/components/BrandIcon'
import PublicShell from '@/app/components/PublicShell'
import PhotoGallery from '@/app/components/PhotoGallery'

// Siempre renderizar en el servidor con datos frescos (sin caché estática).
// Evita que fotos/horarios recién publicados aparezcan solo en unos dispositivos.
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Convierte "13:00" → "1:00 p.m." para leer bonito.
function to12h(t) {
  if (!t) return ''
  const [H, M] = t.slice(0, 5).split(':').map(Number)
  const ap = H < 12 ? 'a.m.' : 'p.m.'
  let h = H % 12
  if (h === 0) h = 12
  return `${h}:${String(M).padStart(2, '0')} ${ap}`
}
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default async function NegocioPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  // Traer el negocio por slug (solo activos y visibles al público)
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!business) notFound()

  // Contar la vista de ficha (métrica "vistas" del negocio).
  // Se ejecuta DESPUÉS de responder (no bloquea el render) y no cuenta
  // las visitas del propio dueño a su ficha. El incremento va por una
  // función SECURITY DEFINER para no exponer UPDATE directo sobre businesses.
  after(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id === business.owner_id) return
    await supabase.rpc('increment_business_view', { bid: business.id })
  })

  // Traer fotos y horarios
  const { data: photos } = await supabase
    .from('business_photos')
    .select('*')
    .eq('business_id', business.id)
    .order('sort_order')

  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('business_id', business.id)

  // Migas de pan: Directorio / Categoría / Negocio (para no perder al cliente)
  const catSlug = toSlug(business.category || '')
  const catName = CATEGORIA_POR_SLUG[catSlug]?.nombre || business.category

  return (
    <PublicShell>
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>
      <style>{`
        .bc{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:28px;font-size:14px}
        .bc-link{display:inline-flex;align-items:center;gap:6px;color:#DCB24A;
          text-decoration:none;font-weight:600;transition:color .25s ease}
        .bc-link:hover{color:#EBC66A;text-decoration:underline;text-underline-offset:3px}
        .bc-sep{color:rgba(242,237,227,.3)}
        .bc-current{color:rgba(242,237,227,.55);min-width:0;overflow:hidden;
          text-overflow:ellipsis;white-space:nowrap;max-width:40vw}
      `}</style>

      <nav className="bc" aria-label="Ruta de navegación">
        <Link href="/#categorias" className="bc-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Directorio
        </Link>
        {business.category && (
          <>
            <span className="bc-sep" aria-hidden="true">/</span>
            <Link href={`/categoria/${catSlug}`} className="bc-link">{catName}</Link>
          </>
        )}
        <span className="bc-sep" aria-hidden="true">/</span>
        <span className="bc-current">{business.name}</span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{
          margin: 0,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 46, fontWeight: 500, color: '#F6F0E0', lineHeight: 1.04,
        }}>
          {business.name}
        </h1>
        {getBadge(business.plan) && (
          <span style={{ padding: '5px 13px', background: 'linear-gradient(180deg,#E7C86A,#DCB24A)', color: '#25201A', borderRadius: 9999, fontSize: 12, fontWeight: 700, letterSpacing: '0.03em' }}>
            {getBadge(business.plan)}
          </span>
        )}
      </div>
      <p style={{ color: '#DCB24A', margin: '6px 0 0', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}>{business.category}</p>

      <PhotoGallery photos={photos || []} />

      {business.description && (
        <p style={{ marginTop: 24 }}>{business.description}</p>
      )}

      {(() => {
        // WhatsApp y Ubicación: en todos los planes.
        // Redes sociales (IG/FB): solo Tier 2 y 3 (Cuāuhtli en adelante).
        const social = getPriority(business.plan) >= 2
        const mapsHref = business.maps_url
          ? business.maps_url
          : (business.lat && business.lng
              ? `https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`
              : null)
        const chips = []
        if (business.whatsapp) {
          chips.push({ brand: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${business.whatsapp.replace(/\D/g, '')}` })
        }
        if (business.instagram && social) {
          const ig = business.instagram.startsWith('http')
            ? business.instagram
            : `https://instagram.com/${business.instagram.replace(/^@/, '')}`
          chips.push({ brand: 'instagram', label: 'Instagram', href: ig })
        }
        if (business.facebook && social) {
          chips.push({ brand: 'facebook', label: 'Facebook', href: business.facebook })
        }
        if (mapsHref) {
          chips.push({ brand: 'maps', label: 'Cómo llegar', href: mapsHref })
        }

        return (
          <div style={{ marginTop: 28 }}>
            {business.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <BrandTile brand="address" size={40} />
                <span style={{ fontSize: 15, color: 'rgba(240,232,212,0.9)', lineHeight: 1.4 }}>{business.address}</span>
              </div>
            )}
            {business.phone && business.phone !== '0' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <BrandTile brand="phone" size={40} />
                <a href={`tel:${business.phone}`} style={{ fontSize: 15, color: 'rgba(240,232,212,0.9)', textDecoration: 'none' }}>{business.phone}</a>
              </div>
            )}
            {chips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {chips.map((c) => (
                  <a key={c.brand} href={c.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 9,
                      padding: '8px 16px 8px 8px',
                      background: 'rgba(240,232,212,0.06)',
                      border: '1px solid rgba(240,232,212,0.14)',
                      borderRadius: 9999,
                      textDecoration: 'none',
                      color: '#F0E8D4', fontSize: 14, fontWeight: 600,
                    }}>
                    <BrandTile brand={c.brand} size={30} />
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })()}

      <h2 style={{ marginTop: 36, marginBottom: 12 }}>Horarios</h2>
      {(hours || []).length === 0 ? (
        <p style={{ color: 'rgba(240,232,212,0.55)' }}>Sin horarios publicados.</p>
      ) : (
        <div style={{
          background: 'rgba(240,232,212,0.05)',
          border: '1px solid rgba(240,232,212,0.12)',
          borderRadius: 14,
          overflow: 'hidden',
          maxWidth: 420,
        }}>
          {[...hours].sort((a, b) => a.day_of_week - b.day_of_week).map((h, i) => {
            const isToday = new Date().getDay() === h.day_of_week
            return (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 16px',
                borderTop: i === 0 ? 'none' : '1px solid rgba(240,232,212,0.08)',
                background: isToday ? 'rgba(220,178,74,0.10)' : 'transparent',
              }}>
                <span style={{ fontSize: 14, fontWeight: isToday ? 700 : 500, color: isToday ? '#DCB24A' : 'rgba(240,232,212,0.85)' }}>
                  {DIAS[h.day_of_week]}{isToday ? ' · hoy' : ''}
                </span>
                {h.is_closed ? (
                  <span style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(240,232,212,0.4)' }}>Cerrado</span>
                ) : (
                  <span style={{ fontSize: 14, fontWeight: 500, color: isToday ? '#EBC66A' : 'rgba(240,232,212,0.85)', textAlign: 'right' }}>
                    {h.break_start && h.break_end
                      ? `${to12h(h.open_time)} – ${to12h(h.break_start)} y ${to12h(h.break_end)} – ${to12h(h.close_time)}`
                      : `${to12h(h.open_time)} – ${to12h(h.close_time)}`}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
      <hr style={{ margin: '32px 0' }} />
      <ReviewsList businessId={business.id} />
      <div style={{ marginTop: 32 }}>
        <ReviewForm businessId={business.id} />
      </div>
    </div>
    </PublicShell>
  )
}
