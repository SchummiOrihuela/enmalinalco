import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import BusinessForm from './BusinessForm'
import HoursForm from './HoursForm'
import ClosuresForm from './ClosuresForm'
import PhotosForm from './PhotosForm'
import ReviewsList from './ReviewsList'
import PlansSection from './PlansSection'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()
  let hours = []
  let closures = []
  let photos = []
  if (business) {
    const { data: h } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', business.id)
    hours = h || []
    const { data: v } = await supabase
      .from('vacations')
      .select('*')
      .eq('business_id', business.id)
      .order('start_date')
    closures = v || []
    const { data: p } = await supabase
      .from('business_photos')
      .select('*')
      .eq('business_id', business.id)
      .order('sort_order')
    photos = p || []
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--parch)',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      transition: 'background .4s ease',
    }}>

      {/* Barra superior de marca */}
      <header style={{
        background: 'var(--selva)',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '24px',
          color: '#F2EDE3',
          letterSpacing: '-0.01em',
        }}>
          en<em style={{ color: 'var(--verde-lt)', fontStyle: 'italic' }}>malinalco</em>
        </span>
        <a
          href="/"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(242,237,227,0.75)',
            textDecoration: 'none',
          }}
        >
          ← Ver sitio
        </a>
      </header>

      {/* Contenido */}
      <main style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}>
        {/* Encabezado del panel */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--terra)',
            margin: '0 0 8px',
          }}>
            Panel de control
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '38px',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.1,
            margin: '0 0 12px',
          }}>
            {business ? business.name : 'Tu negocio'}
          </h1>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            fontSize: '14px',
            color: 'var(--ink)',
            opacity: 0.6,
          }}>
            <span>Sesión activa: {user.email}</span>
            {business && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                background: 'var(--surf)',
                borderRadius: '9999px',
                fontSize: '13px',
              }}>
                👁️ {business.view_count || 0} vistas
              </span>
            )}
          </div>
        </div>

        {/* Secciones — cada tarjeta envuelve un componente hijo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Section>
            <BusinessForm business={business} userId={user.id} />
          </Section>
          {business && (
            <Section>
              <HoursForm businessId={business.id} initialHours={hours} />
            </Section>
          )}
          {business && (
            <Section>
              <ClosuresForm businessId={business.id} initialClosures={closures} />
            </Section>
          )}
          {business && (
            <Section>
              <PhotosForm businessId={business.id} initialPhotos={photos} plan={business.plan} />
            </Section>
          )}
          {business && (
            <Section>
              <ReviewsList businessId={business.id} />
            </Section>
          )}
          {business && (
            <Section>
              <PlansSection businessId={business.id} currentPlan={business.plan} />
            </Section>
          )}
        </div>
      </main>
    </div>
  )
}

/* Tarjeta contenedora reutilizable */
function Section({ children }) {
  return (
    <div style={{
      background: 'var(--surf)',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 1px 4px rgba(27,20,9,0.05), 0 4px 16px rgba(27,20,9,0.04)',
    }}>
      {children}
    </div>
  )
}
