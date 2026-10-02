import Link from 'next/link'
import PublicShell from '@/app/components/PublicShell'
import { GRUPOS, getArticulosPorGrupo } from '@/lib/articulos'

const SITE_URL = 'https://enmalinalco.com'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Historias del pueblo — Guía de Malinalco | En Malinalco',
  description:
    'Rutas, gastronomía, historia y los secretos que hacen único a Malinalco. Guías honestas escritas por quienes vivimos aquí.',
  alternates: { canonical: '/historias' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/historias`,
    siteName: 'enmalinalco.com',
    locale: 'es_MX',
    title: 'Historias del pueblo — Guía de Malinalco',
    description:
      'Rutas, gastronomía, historia y los secretos que hacen único a Malinalco.',
  },
}

export default function HistoriasIndex() {
  return (
    <PublicShell>
      <style>{`
        .hx-wrap{max-width:1000px;margin:0 auto;padding:40px 24px 96px}
        .hx-eyebrow{color:#DCB24A;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px;text-align:center}
        .hx-h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(36px,7vw,56px);font-weight:500;color:#F6F0E0;line-height:1.04;text-align:center;margin:0}
        .hx-h1 em{color:#A8D6B0;font-style:italic}
        .hx-sub{text-align:center;color:rgba(242,237,227,.72);font-size:17px;max-width:56ch;margin:16px auto 0;line-height:1.55}
        .hx-sec{margin-top:52px}
        .hx-sec-h{font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:500;color:#F6F0E0;margin:0;display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
        .hx-sec-n{font-size:13px;font-weight:600;color:#DCB24A;letter-spacing:.03em}
        .hx-sec-p{color:rgba(242,237,227,.6);font-size:15px;margin:6px 0 0}
        .hx-sec-hr{border:none;border-top:1px solid rgba(220,178,74,.22);margin:16px 0 26px}
        .hx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px}
        .hx-card{background:#F5ECD7;border-radius:18px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,.14);transition:transform .25s ease,box-shadow .25s ease}
        .hx-card:hover{transform:translateY(-5px);box-shadow:0 18px 44px rgba(0,0,0,.22)}
        .hx-img{aspect-ratio:16/9;overflow:hidden;background:#1C3B28}
        .hx-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
        .hx-card:hover .hx-img img{transform:scale(1.06)}
        .hx-body{padding:22px}
        .hx-tag{color:#8A6D2F;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
        .hx-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:23px;font-weight:600;color:#2A2016;line-height:1.2;margin:8px 0 10px}
        .hx-exc{font-size:14.5px;line-height:1.55;color:#4A4034;margin:0 0 16px}
        .hx-foot{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#8A6D2F;font-weight:600}
        .hx-read{display:inline-flex;align-items:center;gap:5px;color:#B0863A}
      `}</style>

      <div className="hx-wrap">
        <p className="hx-eyebrow">Blog editorial</p>
        <h1 className="hx-h1">Historias <em>del pueblo</em></h1>
        <p className="hx-sub">Rutas, gastronomía, festividades y los secretos que hacen único a Malinalco. Guías honestas, escritas por quienes vivimos aquí.</p>

        {GRUPOS.map((g) => {
          const arts = getArticulosPorGrupo(g.id)
          if (arts.length === 0) return null
          return (
            <section key={g.id} className="hx-sec">
              <h2 className="hx-sec-h">{g.nombre} <span className="hx-sec-n">{arts.length} {arts.length === 1 ? 'artículo' : 'artículos'}</span></h2>
              <p className="hx-sec-p">{g.descripcion}</p>
              <hr className="hx-sec-hr" />
              <div className="hx-grid">
                {arts.map((a) => (
                  <Link key={a.slug} href={`/historias/${a.slug}`} className="hx-card">
                    {a.imagen && (
                      <div className="hx-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.imagen} alt={a.imagenAlt || a.titulo} width="600" height="338" loading="lazy" />
                      </div>
                    )}
                    <div className="hx-body">
                      <div className="hx-tag">{a.categoria}</div>
                      <h3 className="hx-title">{a.titulo}</h3>
                      <p className="hx-exc">{a.excerpt}</p>
                      <div className="hx-foot">
                        <span>{a.fechaDisplay} · {a.lectura}</span>
                        <span className="hx-read">Leer
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </PublicShell>
  )
}
