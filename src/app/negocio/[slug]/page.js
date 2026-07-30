import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import ReviewsList from '@/app/dashboard/ReviewsList'
import { getBadge } from '@/lib/plans'
import ReviewForm from '@/app/dashboard/ReviewForm'
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

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
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
