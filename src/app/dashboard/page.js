import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabaseServer'
import { FOUNDERS, PLANS, getPriority } from '@/lib/plans'
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
import { BrandTile } from '@/app/components/BrandIcon'
import ScrollProgress from '@/app/components/ScrollProgress'

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

  // Comparativa vs. categoría (beneficio de inteligencia: Cuāuhtli en adelante).
  // Promedio de vistas de los negocios activos de la misma categoría.
  let catAvg = null
  if (business && getPriority(business.plan) >= 2 && business.category) {
    const { data: peers } = await supabase
      .from('businesses')
      .select('view_count')
      .eq('is_active', true)
      .eq('category', business.category)
    if (peers && peers.length >= 3) {
      const avg = peers.reduce((a, b) => a + (b.view_count || 0), 0) / peers.length
      catAvg = { n: peers.length, views: avg }
    }
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
        'radial-gradient(1100px 560px at 50% -10%, rgba(220,178,74,0.14), transparent 60%),' +
        'radial-gradient(900px 520px at 108% 6%, rgba(124,182,137,0.12), transparent 58%),' +
        'radial-gradient(760px 560px at -12% 46%, rgba(191,80,40,0.08), transparent 55%),' +
        'linear-gradient(180deg, #213A26 0%, #26331E 55%, #1F2A19 100%)',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      transition: 'background .4s ease',
    }}>
      <ScrollProgress />

      {foundersWelcome && <FoundersWelcome {...foundersWelcome} />}

      {/* Barra superior de marca */}
      <header style={{
        background: 'linear-gradient(180deg, #1C3B28 0%, #213A26 100%)',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(220,178,74,0.18)',
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', textDecoration: 'none' }}>
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
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {business && <TierNav plan={business.plan} isActive={business.is_active} />}
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
          <style>{`
            @keyframes dashTitlePulse {
              0%, 100% { text-shadow: 0 0 0 rgba(231,200,106,0); }
              50%      { text-shadow: 0 0 18px rgba(231,200,106,0.45); }
            }
            @keyframes dashBadgePulse {
              0%   { box-shadow: 0 0 0 0 rgba(220,178,74,0.65); transform: scale(1); }
              60%  { box-shadow: 0 0 0 16px rgba(220,178,74,0); transform: scale(1.05); }
              100% { box-shadow: 0 0 0 0 rgba(220,178,74,0); transform: scale(1); }
            }
            @keyframes statPulse {
              0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.14); }
              50%      { box-shadow: 0 4px 16px rgba(0,0,0,0.14), 0 0 0 3px rgba(220,178,74,0.22); }
            }
            .dash-title-pulse { animation: dashTitlePulse 3s ease-in-out infinite; }
            .dash-badge-pulse { animation: dashBadgePulse 1.9s ease-out infinite; }
            .stat-card { transition: transform .22s cubic-bezier(.2,.7,.3,1); }
            .stat-card:hover { transform: translateY(-4px) scale(1.04); z-index: 2; }
            .stat-pulse { animation: statPulse 2.8s ease-in-out infinite; }
            .ecg { width: 100%; height: 28px; display: block; margin-bottom: 10px; }
            .ecg path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
            .ecg-base { stroke: rgba(95,184,116,0.22); stroke-width: 2; }
            .ecg-run {
              stroke: #5FB874; stroke-width: 2.5;
              stroke-dasharray: 16 84;
              filter: drop-shadow(0 0 4px rgba(95,184,116,0.85));
              animation: ecgRun 2.4s linear infinite;
            }
            @keyframes ecgRun { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
            @media (prefers-reduced-motion: reduce) {
              .dash-title-pulse, .dash-badge-pulse, .stat-pulse { animation: none; }
              .stat-card:hover { transform: none; }
              .ecg-run { animation: none; }
            }
          `}</style>
          <h1 className={business ? 'dash-title-pulse' : undefined} style={{
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
          </div>

          {business && (() => {
            const tier = getPriority(business.plan)
            // Básico (todos los planes): vistas + contactos directos.
            const stats = [
              { brand: 'views', label: 'Vistas de tu ficha', total: business.view_count, last: business.views_last_month },
              { brand: 'whatsapp', label: 'Contactos por Whats', total: business.whatsapp_clicks, last: business.whatsapp_clicks_last_month },
              { brand: 'phone', label: 'Llamadas', total: business.phone_clicks, last: business.phone_clicks_last_month },
              { brand: 'maps', label: 'Vieron tu ubicación', total: business.maps_clicks, last: business.maps_clicks_last_month },
            ]
            // Inteligencia de redes (Cuāuhtli en adelante).
            if (tier >= 2) {
              stats.push(
                { brand: 'instagram', label: 'Clics en Instagram', total: business.instagram_clicks, last: business.instagram_clicks_last_month },
                { brand: 'facebook', label: 'Clics en Facebook', total: business.facebook_clicks, last: business.facebook_clicks_last_month },
              )
            }
            // ── Clientes potenciales: traduce los números a la "moneda" del
            // dueño. Un contacto directo (WhatsApp, llamada o "cómo llegar") es
            // alguien que dio el paso de buscarte: lo más cerca de una venta.
            const leadFields = [
              ['whatsapp_clicks', 'whatsapp_clicks_last_month'],
              ['phone_clicks', 'phone_clicks_last_month'],
              ['maps_clicks', 'maps_clicks_last_month'],
            ]
            const leadsTotal = leadFields.reduce((a, [t]) => a + (business[t] || 0), 0)
            const leadsMonth = leadFields.reduce((a, [t, l]) => {
              const cur = business[t] || 0
              const prev = (business[l] !== null && business[l] !== undefined) ? business[l] : null
              return a + (prev !== null ? Math.max(0, cur - prev) : 0)
            }, 0)

            // Comparativa vs. categoría (Cuāuhtli en adelante).
            let compara = null
            if (tier >= 2 && catAvg && catAvg.views > 0) {
              const pct = Math.round(((business.view_count || 0) - catAvg.views) / catAvg.views * 100)
              const cat = business.category
              if (pct >= 5) compara = { tone: 'up', text: `Tu ficha recibe ${pct}% más vistas que el promedio de ${cat} en el pueblo.` }
              else if (pct <= -5) compara = { tone: 'down', text: `Vas ${Math.abs(pct)}% por debajo del promedio de ${cat}. Sumar fotos o una mención suele ayudar.` }
              else compara = { tone: 'even', text: `Vas en línea con el promedio de ${cat} en el pueblo.` }
            }
            return (
              <div style={{ marginTop: '22px' }}>
                {/* Clientes potenciales: el número que sí se siente en el bolsillo */}
                <div style={{
                  marginBottom: '18px', padding: '20px 22px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(62,158,89,0.22), rgba(28,59,40,0.30))',
                  border: '1px solid rgba(95,184,116,0.42)',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.16)',
                }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.12em', color: '#9FE0B0', marginBottom: '6px',
                  }}>
                    Clientes potenciales este mes
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                    <strong style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: '44px', fontWeight: 600, color: '#F6F0E0', lineHeight: 1,
                      letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums lining-nums',
                    }}>{leadsMonth.toLocaleString('es-MX')}</strong>
                    <span style={{ fontSize: '14px', color: 'rgba(246,240,224,0.82)', lineHeight: 1.4 }}>
                      {leadsMonth === 1 ? 'persona quiso' : 'personas quisieron'} contactarte o llegar a tu negocio
                    </span>
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: '13px', color: 'rgba(246,240,224,0.72)', lineHeight: 1.55 }}>
                    Cada uno es alguien que dio el paso de buscarte: un cliente que no tenías.
                    {leadsTotal > leadsMonth && <> Llevas <strong style={{ color: '#9FE0B0' }}>{leadsTotal.toLocaleString('es-MX')}</strong> en total desde que estás en En Malinalco.</>}
                    {' '}Multiplícalos por lo que gastaría un cliente contigo y tienes lo que te deja tu ficha.
                  </p>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '14px',
                }}>
                  {stats.map((s) => {
                    const total = s.total || 0
                    const d = (s.last !== null && s.last !== undefined) ? total - s.last : null
                    const isViews = s.brand === 'views'
                    return (
                      <div key={s.brand}
                        className="stat-card stat-pulse"
                        style={{
                        display: 'flex', flexDirection: 'column', gap: '12px',
                        padding: '18px 20px',
                        minHeight: '116px',
                        background: isViews
                          ? 'linear-gradient(135deg, rgba(220,178,74,0.18), rgba(28,59,40,0.25))'
                          : 'linear-gradient(135deg, rgba(220,178,74,0.08), rgba(28,59,40,0.25))',
                        border: isViews ? '1px solid rgba(220,178,74,0.5)' : '1px solid rgba(220,178,74,0.22)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
                      }}>
                        {/* Fila: icono + número + crecimiento */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <BrandTile brand={s.brand} size={42} />
                          <strong style={{
                            fontFamily: "'Fraunces', Georgia, serif",
                            fontSize: '32px', fontWeight: 600, color: '#F6F0E0', lineHeight: 1,
                            letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums lining-nums',
                          }}>{Number(total).toLocaleString('es-MX')}</strong>
                          {d !== null && d > 0 && (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '2px',
                              marginLeft: 'auto',
                              fontSize: '12px', fontWeight: 800, color: '#FFFFFF',
                              background: '#3E9E59', padding: '2px 8px', borderRadius: '9999px',
                              boxShadow: '0 1px 6px rgba(62,158,89,0.5)',
                            }}>▲ {d}</span>
                          )}
                        </div>
                        {/* Label estirado, una sola línea */}
                        <div style={{
                          fontSize: '13px', color: 'rgba(246,240,224,0.72)', lineHeight: 1.3,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          letterSpacing: '0.01em',
                        }}>
                          {s.label}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{
                  margin: '16px 0 0', padding: '14px 18px', borderRadius: '12px',
                  background: 'rgba(220,178,74,0.10)', borderLeft: '4px solid var(--oro)',
                }}>
                  {/* Electro: el "pulso" / salud de tu página */}
                  <svg className="ecg" viewBox="0 0 300 28" preserveAspectRatio="none" aria-hidden="true">
                    <path className="ecg-base" pathLength="100" d="M0,16 H120 l5,-2 4,2 H140 l3,5 4,-20 4,24 3,-7 4,0 H300" />
                    <path className="ecg-run"  pathLength="100" d="M0,16 H120 l5,-2 4,2 H140 l3,5 4,-20 4,24 3,-7 4,0 H300" />
                  </svg>
                  <p style={{
                    margin: 0, fontSize: '14px', color: 'rgba(246,240,224,0.92)', lineHeight: 1.6,
                  }}>
                    Esto es lo que tu presencia en En Malinalco te genera: <strong>cuánta gente descubre tu negocio y te contacta cada mes</strong> — la razón de ser de tu plan. El <strong style={{ color: '#5FB874' }}>▲</strong> es tu crecimiento vs. el mes pasado.
                  </p>
                </div>

                {/* Inteligencia comparativa (Cuāuhtli+) */}
                {compara && (
                  <div style={{
                    marginTop: '12px', padding: '12px 16px', borderRadius: '12px',
                    background: compara.tone === 'down' ? 'rgba(220,120,74,0.10)' : 'rgba(124,182,137,0.12)',
                    border: `1px solid ${compara.tone === 'down' ? 'rgba(220,120,74,0.3)' : 'rgba(124,182,137,0.3)'}`,
                    fontSize: '13.5px', color: 'var(--ink)', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span aria-hidden="true">{compara.tone === 'down' ? '📉' : '📈'}</span>
                    <span>{compara.text} <span style={{ fontWeight: 400, opacity: 0.7 }}>({catAvg.n} negocios en tu categoría)</span></span>
                  </div>
                )}

                {/* Teasers de upsell según el plan */}
                {tier === 1 && (
                  <a href="#planes" style={{
                    display: 'block', marginTop: '12px', padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(220,178,74,0.10)', border: '1px dashed rgba(220,178,74,0.4)',
                    textDecoration: 'none', color: '#F6F0E0', fontSize: '13.5px', lineHeight: 1.5,
                  }}>
                    🔒 <strong>Con Cuāuhtli</strong> mides también los clics a tus redes y ves <strong>cómo vas frente a tu categoría</strong>. <span style={{ color: 'var(--oro)', fontWeight: 700 }}>Mejorar mi plan →</span>
                  </a>
                )}
                {tier === 2 && (
                  <a href="#planes" style={{
                    display: 'block', marginTop: '12px', padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(220,178,74,0.10)', border: '1px dashed rgba(220,178,74,0.4)',
                    textDecoration: 'none', color: '#F6F0E0', fontSize: '13.5px', lineHeight: 1.5,
                  }}>
                    🔒 <strong>Con Ocēlōtl</strong> recibes cada mes un <strong>reporte a tu correo</strong> con tus números y recomendaciones para crecer. <span style={{ color: 'var(--oro)', fontWeight: 700 }}>Mejorar mi plan →</span>
                  </a>
                )}
                {tier >= 3 && (
                  <div style={{
                    marginTop: '12px', padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(124,182,137,0.10)', border: '1px solid rgba(124,182,137,0.28)',
                    fontSize: '13.5px', color: '#F6F0E0', lineHeight: 1.5,
                  }}>
                    🐆 Como <strong>Ocēlōtl</strong>, cada mes te enviamos este resumen a tu correo con recomendaciones para crecer.
                  </div>
                )}
              </div>
            )
          })()}

          {business && (business.lat == null || business.lng == null) && (
            <div style={{
              marginTop: '16px', padding: '14px 16px', borderRadius: '12px',
              background: 'rgba(220,178,74,0.12)', border: '1px dashed rgba(220,178,74,0.45)',
              color: '#F6F0E0', fontSize: '13.5px', lineHeight: 1.5,
            }}>
              📍 <strong>Agrega tu ubicación</strong> para aparecer en el <a href="/mapa" style={{ color: 'var(--oro)', fontWeight: 700 }}>mapa del pueblo</a>. Es de lo primero que busca el turista para decidir a dónde ir. Captúrala abajo, en <strong>Contacto y ubicación</strong>.
            </div>
          )}
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
                <PlansSection businessId={business.id} currentPlan={business.plan} isActive={business.is_active} />
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
function TierNav({ plan, isActive }) {
  // Sin pago no hay plan real, aunque la columna traiga 'malinalli' por defecto.
  const cur = isActive ? PLANS[plan] : null
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

  // Sin plan activo: invitación directa a elegir (baja a la sección de planes).
  if (!cur) {
    return <a href="#planes" style={upsellPill}>Sin plan activo · listo para elegir el mejor →</a>
  }

  const nextKey = NEXT[plan]
  // Ocēlōtl (o cualquiera sin siguiente): solo mención del nivel.
  if (!nextKey) {
    return <span className="dash-badge-pulse" style={goldPill}>★ Nivel {cur.name}</span>
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
