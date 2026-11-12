'use client'

// Ventana flotante "Mi inteligencia": concentra TODOS los insights (Fase 1 + 2)
// en una capa elegante, en vez de amontonarlos al inicio del panel.
//   - Fase 1: salud de ficha, tasa de contacto, ranking, valor estimado (ROI),
//             recomendaciones ESPECÍFICAS por red (Instagram/Facebook/WhatsApp).
//   - Fase 2: tendencia (30 días), mapa de calor día×hora, origen geográfico y
//             atribución a historias/eventos (tabla events).
// Recibe todo ya calculado desde el servidor (props serializables).
import { useState, useEffect, Fragment } from 'react'

const pesos = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0)

const RED_META = {
  instagram: { label: 'Instagram', icon: '📸' },
  facebook: { label: 'Facebook', icon: '👍' },
  whatsapp: { label: 'WhatsApp', icon: '💬' },
  ficha: { label: 'Tu ficha', icon: '🧩' },
  contenido: { label: 'Contenido', icon: '🗓️' },
}

function Kpi({ label, value, sub, accent = '#DCB24A' }) {
  return (
    <div style={{
      flex: '1 1 180px', minWidth: 0, padding: '14px 16px', borderRadius: '14px',
      background: 'linear-gradient(135deg, rgba(220,178,74,0.10), rgba(28,59,40,0.30))',
      border: '1px solid rgba(220,178,74,0.22)', borderLeft: `4px solid ${accent}`, color: '#F6F0E0',
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(246,240,224,0.66)' }}>{label}</div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '26px', fontWeight: 600, marginTop: '4px' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', opacity: 0.82, lineHeight: 1.4, marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

const H2 = ({ children }) => (
  <h3 style={{ margin: '22px 0 10px', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DCB24A', fontWeight: 800 }}>{children}</h3>
)

// Barras de tendencia (30 días). Verde = vistas, oro = contactos.
function Tendencia({ serie }) {
  const max = Math.max(1, ...serie.map((d) => d.vistas))
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '72px' }}>
        {serie.map((d, i) => (
          <div key={i} title={`${d.dia}: ${d.vistas} vistas, ${d.contactos} contactos`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ height: `${(d.vistas / max) * 100}%`, background: 'linear-gradient(180deg,#82C994,#3A6B47)', borderRadius: '3px 3px 0 0', minHeight: d.vistas ? '2px' : 0 }} />
            {d.contactos > 0 && <div style={{ height: '3px', background: '#DCB24A', marginTop: '1px' }} />}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '6px' }}>Últimos 30 días · verde = vistas · línea oro = contactos</div>
    </div>
  )
}

// Mapa de calor día (filas) × hora (columnas 0..23).
function Heatmap({ hm }) {
  const color = (n) => {
    if (!n) return 'rgba(246,240,224,0.06)'
    const t = n / hm.max
    // de verde tenue a oro intenso
    const r = Math.round(90 + t * 130), g = Math.round(120 + t * 60), b = Math.round(60 - t * 20)
    return `rgb(${r},${g},${b})`
  }
  return (
    <div>
      {hm.mejorTexto && (
        <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#F6F0E0' }}>
          🔥 Tu mejor franja: <strong>{hm.mejorTexto}</strong>. Publica tus promos y ten personal de más ahí.
        </p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '34px repeat(24, 1fr)', gap: '2px', minWidth: '520px' }}>
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} style={{ fontSize: '8px', textAlign: 'center', opacity: 0.5, color: '#F6F0E0' }}>{h % 6 === 0 ? h : ''}</div>
          ))}
          {hm.grid.map((fila, d) => (
            <Fragment key={`row-${d}`}>
              <div style={{ fontSize: '10px', color: '#F6F0E0', opacity: 0.7, display: 'flex', alignItems: 'center' }}>{hm.dias[d]}</div>
              {fila.map((n, h) => (
                <div key={`${d}-${h}`} title={`${hm.dias[d]} ${h}:00 — ${n}`} style={{ aspectRatio: '1', borderRadius: '2px', background: color(n) }} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function Vacio({ children }) {
  return <p style={{ margin: 0, fontSize: '13px', color: 'rgba(246,240,224,0.6)', lineHeight: 1.5 }}>{children}</p>
}

export default function InsightsDrawer({ insights }) {
  const [open, setOpen] = useState(false)
  const [red, setRed] = useState(null)
  const { salud, tasa, ranking, roi, recosPorRed, fase2 } = insights

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const redes = recosPorRed ? Object.keys(recosPorRed).filter((k) => recosPorRed[k]?.length) : []
  const redActiva = red && redes.includes(red) ? red : redes[0]

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        marginTop: '14px', width: '100%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        padding: '14px 18px', borderRadius: '14px', border: '1px solid rgba(220,178,74,0.45)',
        background: 'linear-gradient(135deg, rgba(220,178,74,0.18), rgba(28,59,40,0.30))',
        color: '#F6F0E0', fontSize: '15px', fontWeight: 700, fontFamily: 'inherit',
      }}>
        📊 Ver mi inteligencia completa
        <span style={{ fontSize: '12px', fontWeight: 500, opacity: 0.75 }}>salud · ROI · recomendaciones · tendencias</span>
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,18,12,0.66)',
          backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4vh 16px', overflowY: 'auto',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '100%', maxWidth: '920px', borderRadius: '20px',
            background: 'linear-gradient(180deg,#213A26,#1C2E1E)',
            border: '1px solid rgba(220,178,74,0.25)', boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
            color: '#F6F0E0', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            {/* Encabezado */}
            <div style={{
              position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 22px', borderBottom: '1px solid rgba(220,178,74,0.18)',
              background: 'linear-gradient(180deg,#1C3B28,#213A26)', borderRadius: '20px 20px 0 0', zIndex: 2,
            }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#DCB24A', fontWeight: 800 }}>En Malinalco · Inteligencia</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '22px', fontWeight: 600 }}>Mi negocio en números</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" style={{
                cursor: 'pointer', width: '38px', height: '38px', borderRadius: '50%',
                border: '1px solid rgba(246,240,224,0.25)', background: 'rgba(0,0,0,0.2)', color: '#F6F0E0', fontSize: '18px',
              }}>✕</button>
            </div>

            <div style={{ padding: '18px 22px 26px' }}>
              {/* KPIs Fase 1 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {salud && (
                  <Kpi label="Salud de tu ficha" value={`${salud.score}/100`} accent={salud.score >= 85 ? '#3E9E59' : salud.score >= 60 ? '#DCB24A' : '#BF5028'}
                    sub={salud.faltantes.length ? `Te falta: ${salud.faltantes.slice(0, 2).join(', ')}` : '¡Ficha completa!'} />
                )}
                {tasa && tasa.pct !== null && (
                  <Kpi label="Tasa de contacto" value={`${tasa.pct}%`} sub={`${tasa.contactos} contactos de ${tasa.vistas} vistas`} />
                )}
                {ranking && (
                  <Kpi label="Tu lugar en la categoría" value={`#${ranking.pos} de ${ranking.n}`} accent={ranking.pos === 1 ? '#3E9E59' : '#DCB24A'}
                    sub={ranking.pos === 1 ? '¡Primer lugar del pueblo!' : 'Por vistas en tu categoría'} />
                )}
                {roi && roi.contactos > 0 && (
                  <Kpi label="Valor estimado del mes" value={pesos(roi.ingreso)} accent="#3E9E59"
                    sub={`${roi.contactos} contactos × ${roi.cierreTexto} × ${pesos(roi.ticket)}${roi.retorno >= 1 ? ` · ${roi.retorno}× tu plan` : ''}`} />
                )}
              </div>

              {/* Recomendaciones por red */}
              {redes.length > 0 && (
                <>
                  <H2>Recomendaciones para tu caso</H2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {redes.map((k) => (
                      <button key={k} onClick={() => setRed(k)} style={{
                        cursor: 'pointer', padding: '7px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
                        border: `1px solid ${k === redActiva ? '#DCB24A' : 'rgba(246,240,224,0.2)'}`,
                        background: k === redActiva ? 'rgba(220,178,74,0.22)' : 'transparent',
                        color: '#F6F0E0',
                      }}>{RED_META[k]?.icon} {RED_META[k]?.label || k}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(recosPorRed[redActiva] || []).map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '11px 14px', borderRadius: '12px',
                        background: 'rgba(124,182,137,0.10)', border: '1px solid rgba(124,182,137,0.22)', fontSize: '13.5px', lineHeight: 1.5,
                      }}>
                        <span aria-hidden="true" style={{ fontSize: '16px' }}>{r.icon}</span>
                        <span>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Fase 2 */}
              {fase2 && (
                <>
                  <H2>Tendencia</H2>
                  {fase2.total > 0 ? <Tendencia serie={fase2.serie} />
                    : <Vacio>Estamos recopilando datos de tu ficha. En cuanto tengas visitas verás aquí tu tendencia diaria.</Vacio>}

                  <H2>¿A qué hora te buscan?</H2>
                  {fase2.total > 0 ? <Heatmap hm={fase2.heatmap} />
                    : <Vacio>Pronto sabrás los días y horas en que más te buscan, para publicar en el mejor momento.</Vacio>}

                  <H2>¿De dónde vienen?</H2>
                  {fase2.geo.total > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {fase2.geo.filas.map((g, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                          <div style={{ width: '120px', opacity: 0.85 }}>{g.label}</div>
                          <div style={{ flex: 1, height: '10px', borderRadius: '9999px', background: 'rgba(246,240,224,0.08)', overflow: 'hidden' }}>
                            <div style={{ width: `${g.pct}%`, height: '100%', background: 'linear-gradient(90deg,#82C994,#3A6B47)' }} />
                          </div>
                          <div style={{ width: '42px', textAlign: 'right', fontWeight: 700 }}>{g.pct}%</div>
                        </div>
                      ))}
                    </div>
                  ) : <Vacio>Cuando tengas más visitas, aquí verás de qué estados llega tu público (CDMX, Toluca, Edomex…) para enfocar tu promoción.</Vacio>}

                  <H2>Qué historias y eventos te traen clientes</H2>
                  {fase2.atribucion.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {fase2.atribucion.slice(0, 8).map((a, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                          padding: '10px 14px', borderRadius: '12px', background: 'rgba(220,178,74,0.08)', border: '1px solid rgba(220,178,74,0.2)', fontSize: '13px',
                        }}>
                          <span>{a.tipo === 'historia' ? '📖' : a.tipo === 'evento' ? '🎟️' : '🔗'} <strong>{a.slug || a.ref}</strong> <span style={{ opacity: 0.6 }}>({a.tipo})</span></span>
                          <span style={{ whiteSpace: 'nowrap', opacity: 0.9 }}>{a.vistas} vistas · {a.contactos} contactos</span>
                        </div>
                      ))}
                    </div>
                  ) : <Vacio>Cuando una de nuestras historias o eventos te mande visitas, aquí verás exactamente cuántas — la prueba de que lo que hacemos por el pueblo te llega a la caja.</Vacio>}
                </>
              )}

              <p style={{ margin: '22px 0 0', fontSize: '12px', color: 'rgba(246,240,224,0.55)', lineHeight: 1.5 }}>
                Los valores de ingreso son estimados con supuestos conservadores por categoría. La geografía es aproximada y sin datos personales.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
