import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabaseServer'
import { FOUNDERS, PLANS } from '@/lib/plans'
import BusinessForm from './BusinessForm'
import HoursForm from './HoursForm'
import ClosuresForm from './ClosuresForm'
import PhotosForm from './PhotosForm'
import ReviewsList from './ReviewsList'
import PlansSection from './PlansSection'
import FoundersWelcome from './FoundersWelcome'
import BackToTop from './BackToTop'
import ContactForm from './ContactForm'
import PreviewSpace from './PreviewSpace'
import FeedbackButton from './FeedbackButton'

export default async function DashboardPage({ searchParams }) {
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

  // Pantalla de bienvenida Fundador tras un checkout exitoso.
  const sp = await searchParams
  let foundersWelcome = null
  if (sp?.success && business?.founder) {
    const { data: count } = await supabase.rpc('founders_taken')
    const h = await headers()
    const host = h.get('host')
    const proto = h.get('x-forwarded-proto') || 'https'
    foundersWelcome = {
      number: business.founder_number,
      remaining: Math.max(0, FOUNDERS.cupos - (count || 0)),
      trialEndsAt: business.trial_ends_at,
      shareUrl: host ? `${proto}://${host}/` : 'https://enmalinalco.com/',
    }
  }
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
      // Paleta fija del panel: fondo verde + tarjetas crema (texto oscuro),
      // sin importar el tema global. Al sobrescribir las variables aquí,
      // TODAS las tarjetas hijas heredan el look crema con buen contraste.
      '--ink': '#25201A',
      '--parch': '#EDE4CE',   // insets / inputs (crema un poco más profundo)
      '--surf': '#F6F0E0',    // tarjetas (crema claro)
      '--selva': '#1C3B28',
      '--verde': '#3A6B47',
      '--verde-lt': '#82C994',
      '--terra': '#BF5028',
      '--oro': '#B98A16',
      minHeight: '100dvh',
      background:
        'radial-gradient(1100px 560px at 50% -10%, rgba(220,178,74,0.12), transparent 60%),' +
        'radial-gradient(900px 520px at 108% 6%, rgba(124,182,137,0.10), transparent 58%),' +
        'linear-gradient(168deg, #2C3D2F 0%, #35473800 60%), ' +
        'linear-gradient(180deg, #2E3F31 0%, #384B3B 100%)',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      transition: 'background .4s ease',
    }}>

      {foundersWelcome && <FoundersWelcome {...foundersWelcome} />}

      {/* Barra superior de marca */}
      <header style={{
        background: 'linear-gradient(180deg, var(--selva) 0%, #1F2A20 100%)',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(220,178,74,0.18)',
      }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', textDecoration: 'none' }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2,16 C3,8.5 9,3.5 16,3.5 C23,3.5 29,8.5 30,16 Z" fill="#3F6B4B"/>
            <path d="M8,18.4 L24,18.4 L28,26.6 L4,26.6 Z" fill="#CBBBA0"/>
            <path d="M6.6,24.3 L25.4,24.3 M7.5,22 L24.5,22 M8.4,19.9 L23.6,19.9" stroke="#9A8A6E" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M8,18.4 L4,26.6 M24,18.4 L28,26.6" stroke="#A99A7E" strokeWidth="0.6"/>
            <rect x="7.6" y="12.9" width="16.8" height="5.6" fill="#BBAA8D"/>
            <rect x="9.4" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
            <rect x="20.2" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
            <path d="M14,18.5 L14,14.6 C14,13.6 14.9,13.1 16,13.1 C17.1,13.1 18,13.6 18,14.6 L18,18.5 Z" fill="#2A2016"/>
            <path d="M16,3.2 C18.4,6.8 22,10.6 25,12.9 L7,12.9 C10,10.6 13.6,6.8 16,3.2 Z" fill="#D9A94A"/>
            <path d="M8.8,11.6 Q16,8.8 23.2,11.6 M10.4,9.6 Q16,7.4 21.6,9.6 M12,7.7 Q16,6.2 20,7.7" stroke="#B0863A" strokeWidth="0.55" fill="none"/>
            <circle cx="16" cy="3.4" r="0.7" fill="#B0863A"/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '24px',
            color: '#F2EDE3',
            letterSpacing: '-0.01em',
          }}>
            en<em style={{ color: 'var(--verde-lt)', fontStyle: 'italic' }}>malinalco</em>
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {business && <TierNav plan={business.plan} />}
          {business && <PreviewSpace slug={business.slug} />}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'rgba(242,237,227,0.75)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Ver sitio ↗
          </a>
        </div>
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
            color: '#E7C86A',
            margin: '0 0 8px',
          }}>
            Panel de control
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '40px',
            fontWeight: 500,
            color: '#F6F0E0',
            lineHeight: 1.08,
            margin: '0 0 12px',
          }}>
            {business ? business.name : 'Tu negocio'}
          </h1>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            fontSize: '14px',
          }}>
            <span style={{ color: 'rgba(246,240,224,0.72)' }}>Sesión activa: {user.email}</span>
            {business && (() => {
              const views = business.view_count || 0
              const lastMonth = business.views_last_month
              const delta = (lastMonth !== null && lastMonth !== undefined) ? views - lastMonth : null
              return (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  background: 'var(--surf)',
                  border: '1px solid rgba(220,178,74,0.22)',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  color: 'var(--ink)',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    👁️ <strong>{views}</strong> vistas
                  </span>
                  {delta !== null && delta > 0 && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontWeight: 700,
                      color: 'var(--verde)',
                    }}>
                      ▲ +{delta} vs. mes pasado
                    </span>
                  )}
                </span>
              )
            })()}
          </div>
        </div>

        {/* Secciones — cada tarjeta envuelve un componente hijo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Section>
            <BusinessForm business={business} userId={user.id} />
          </Section>
          {business && (
            <Section>
              <ContactForm business={business} />
            </Section>
          )}
          {business && (
            <Section>
              <HoursForm businessId={business.id} initialHours={hours} />
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
            <div id="planes" style={{ scrollMarginTop: '24px' }}>
              <Section>
                <PlansSection businessId={business.id} currentPlan={business.plan} />
              </Section>
            </div>
          )}
        </div>
      </main>

      <BackToTop />
      <FeedbackButton userEmail={user.email} businessName={business?.name} />
    </div>
  )
}

/* Recordatorio de plan en el nav: mención (Ocēlōtl) o upsell corto (resto). */
function TierNav({ plan }) {
  const cur = PLANS[plan]
  const NEXT = { malinalli: 'cuauhtli', cuauhtli: 'ocelotl' }
  const ARG = {
    cuauhtli: 'y aparece primero en tu categoría',
    ocelotl: 'y sé la portada del pueblo',
  }

  const goldPill = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '9999px',
    background: 'linear-gradient(180deg,#E7C86A,#DCB24A)', color: '#25201A',
    fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
  }
  const upsellPill = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '9999px',
    background: 'rgba(220,178,74,0.12)', border: '1px solid rgba(220,178,74,0.5)',
    color: '#EBC66A', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none',
  }

  // Sin plan: invitación directa a elegir.
  if (!cur) {
    return <a href="#planes" style={upsellPill}>Elige tu plan →</a>
  }

  const nextKey = NEXT[plan]
  // Ocēlōtl (o cualquiera sin siguiente): solo mención del nivel.
  if (!nextKey) {
    return <span style={goldPill}>★ Nivel {cur.name}</span>
  }

  // Malinalli / Cuāuhtli: mención + upsell con argumento corto.
  const next = PLANS[nextKey]
  return (
    <a href="#planes" style={upsellPill} title={`Mejora a ${next.name}`}>
      <span style={{ opacity: 0.85 }}>Plan {cur.name}</span>
      <span>· Sube a <strong>{next.name}</strong> {ARG[nextKey]} →</span>
    </a>
  )
}

/* Tarjeta contenedora reutilizable */
function Section({ children }) {
  return (
    <div style={{
      background: 'var(--surf)',
      borderRadius: '18px',
      padding: '28px',
      border: '1px solid rgba(220,178,74,0.10)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.18), 0 12px 34px rgba(0,0,0,0.14)',
    }}>
      {children}
    </div>
  )
}
