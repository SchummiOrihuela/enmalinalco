import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import { after } from 'next/server'
import Link from 'next/link'
import ReviewsList from '@/app/dashboard/ReviewsList'
import { getBadge } from '@/lib/plans'
import ReviewForm from '@/app/dashboard/ReviewForm'
import { toSlug } from '@/lib/slug'
import { CATEGORIA_POR_SLUG } from '@/lib/categorias'
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
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 40px' }}>
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

      <h1>{business.name}</h1>
      {getBadge(business.plan) && (
        <span style={{ display: 'inline-block', marginTop: 8, padding: '4px 12px', background: '#C59B1C', color: '#fff', borderRadius: 9999, fontSize: 13, fontWeight: 600 }}>
          {getBadge(business.plan)}
        </span>
      )}
      <p style={{ color: '#666' }}>{business.category}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
        {(photos || []).map((p) => (
          <img key={p.id} src={p.url} alt=""
            style={{ width: 240, height: 180, objectFit: 'cover', borderRadius: 8 }} />
        ))}
      </div>

      {business.description && (
        <p style={{ marginTop: 24 }}>{business.description}</p>
      )}

      <div style={{ marginTop: 24, lineHeight: 1.8 }}>
        {business.address && <div>📍 {business.address}</div>}
        {business.phone && <div>📞 {business.phone}</div>}
        {business.whatsapp && (
          <div>
            💬 <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                 target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        )}
        {business.lat && business.lng && (
          <div>
            🗺️ <a href={`https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`}
                 target="_blank" rel="noopener noreferrer">
              Cómo llegar
            </a>
          </div>
        )}
      </div>

      <h2 style={{ marginTop: 32 }}>Horarios</h2>
      {(hours || []).length === 0
        ? <p>Sin horarios publicados.</p>
        : <ul>{hours.map((h) => (
            <li key={h.id}>
              {DIAS[h.day_of_week]}: {h.is_closed ? 'Cerrado' : `${h.open_time?.slice(0,5)} – ${h.close_time?.slice(0,5)}`}
            </li>
          ))}</ul>}
      <hr style={{ margin: '32px 0' }} />
      <ReviewsList businessId={business.id} />
      <div style={{ marginTop: 32 }}>
        <ReviewForm businessId={business.id} />
      </div>
    </div>
  )
}
