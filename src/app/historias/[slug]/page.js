import { notFound } from 'next/navigation'
import Link from 'next/link'
import PublicShell from '@/app/components/PublicShell'
import { getArticulo, getTodosLosSlugs, ARTICULO_POR_SLUG } from '@/lib/articulos'
import { CATEGORIA_POR_SLUG } from '@/lib/categorias'

const SITE_URL = 'https://enmalinalco.com'

// Contenido estático: pre-generamos una página por artículo en el build.
export const dynamic = 'force-static'

export function generateStaticParams() {
  return getTodosLosSlugs().map((slug) => ({ slug }))
}

// Título y descripción ÚNICOS por artículo (clave para que Google y la IA
// distingan cada historia y la citen con su propio contexto).
export async function generateMetadata({ params }) {
  const { slug } = await params
  const a = getArticulo(slug)
  if (!a) return { title: 'Historia no encontrada — En Malinalco' }

  const title = `${a.titulo} — En Malinalco`
  const description = a.excerpt
  const url = `${SITE_URL}/historias/${slug}`

  return {
    title,
    description,
    alternates: { canonical: `/historias/${slug}` },
    openGraph: {
      type: 'article',
      url,
      siteName: 'enmalinalco.com',
      locale: 'es_MX',
      title: a.titulo,
      description,
      publishedTime: a.fechaISO,
      authors: [a.autor],
      images: a.imagen ? [{ url: `${SITE_URL}${a.imagen}` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: a.titulo,
      description,
      images: a.imagen ? [`${SITE_URL}${a.imagen}`] : undefined,
    },
  }
}

// ── Renderer de bloques ──────────────────────────────────────────────
// El cuerpo del artículo es un array de bloques tipados (ver lib/articulos.js).
function Bloque({ b }) {
  switch (b.t) {
    case 'p':
      return <p className="art-p" dangerouslySetInnerHTML={{ __html: b.html }} />
    case 'h2':
      return <h2 id={b.id} className="art-h2">{b.text}</h2>
    case 'h3':
      return <h3 className="art-h3">{b.text}</h3>
    case 'ul':
      return (
        <ul className="art-ul">
          {b.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      )
    case 'callout':
      return (
        <aside className="art-callout">
          {b.titulo && <div className="art-callout-h">{b.titulo}</div>}
          <ul className="art-ul">
            {b.items.map((it, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
            ))}
          </ul>
        </aside>
      )
    case 'rest':
      return (
        <div className="art-rest">
          <span className="art-rest-n">{b.n}</span>
          <div className="art-rest-body">
            <h3 className="art-rest-name">
              {b.nombre}
              {b.tipo && <span className="art-rest-type"> — {b.tipo}</span>}
            </h3>
            <p className="art-rest-txt" dangerouslySetInnerHTML={{ __html: b.html }} />
            {b.precio && <span className="art-rest-price">{b.precio}</span>}
          </div>
        </div>
      )
    case 'ctaNegocio':
      return (
        <aside className="art-cta-neg">
          {b.titulo && <h3 className="art-cta-neg-h">{b.titulo}</h3>}
          {b.html && <p className="art-cta-neg-p" dangerouslySetInnerHTML={{ __html: b.html }} />}
          <Link href="/#negocios" className="art-cta-neg-btn">
            Registra tu negocio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </aside>
      )
    default:
      return null
  }
}

export default async function HistoriaPage({ params }) {
  const { slug } = await params
  const a = getArticulo(slug)
  if (!a) notFound()

  const catDir = a.categoriaDirSlug ? CATEGORIA_POR_SLUG[a.categoriaDirSlug] : null
  const url = `${SITE_URL}/historias/${slug}`

  // Artículos relacionados (enlaces internos "Sigue leyendo"): refuerzan el SEO
  // y mantienen al visitante dentro del sitio.
  const relacionados = (a.relacionados || [])
    .map((s) => ARTICULO_POR_SLUG[s])
    .filter(Boolean)

  // ── Datos estructurados (Schema.org) ──────────────────────────────
  // Article: para rich results y para que la IA entienda y cite la historia.
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.titulo,
    description: a.excerpt,
    ...(a.imagen ? { image: [`${SITE_URL}${a.imagen}`] } : {}),
    datePublished: a.fechaISO,
    dateModified: a.fechaISO,
    author: { '@type': 'Organization', name: a.autor, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'En Malinalco',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: a.categoria,
    inLanguage: 'es-MX',
  }
  // BreadcrumbList: Directorio / Categoría / Historia.
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Historias del pueblo', item: `${SITE_URL}/historias` },
      ...(catDir ? [{ '@type': 'ListItem', position: 2, name: catDir.nombre, item: `${SITE_URL}/categoria/${catDir.slug}` }] : []),
      { '@type': 'ListItem', position: catDir ? 3 : 2, name: a.titulo, item: url },
    ],
  }
  // FAQPage: cada pregunta es citable por Google y por asistentes de IA.
  const faqLd = (a.faq && a.faq.length)
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: a.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <style>{`
        .art-wrap{max-width:720px;margin:0 auto;padding:28px 24px 96px}
        .bc{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:28px;font-size:14px}
        .bc-link{display:inline-flex;align-items:center;gap:6px;color:#DCB24A;text-decoration:none;font-weight:600;transition:color .25s ease}
        .bc-link:hover{color:#EBC66A;text-decoration:underline;text-underline-offset:3px}
        .bc-sep{color:rgba(242,237,227,.3)}
        .bc-current{color:rgba(242,237,227,.55);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:46vw}

        .art-eyebrow{color:#DCB24A;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
        .art-title{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(32px,6vw,48px);font-weight:500;color:#F6F0E0;line-height:1.06}
        .art-sub{margin:16px 0 0;font-size:18px;line-height:1.55;color:rgba(242,237,227,.78)}
        .art-meta{display:flex;flex-wrap:wrap;gap:8px 14px;margin:20px 0 0;font-size:13px;color:rgba(242,237,227,.5)}
        .art-meta span{display:inline-flex;align-items:center;gap:6px}

        .art-hero{margin:28px 0 8px;border-radius:18px;overflow:hidden;aspect-ratio:16/9;background:#1C3B28}
        .art-hero img{width:100%;height:100%;object-fit:cover;display:block}

        .art-body{margin-top:28px}
        .art-p{font-size:17px;line-height:1.72;color:rgba(242,237,227,.9);margin:0 0 20px}
        .art-p a,.art-ul a{color:#EBC66A;text-decoration:underline;text-underline-offset:3px;font-weight:600}
        .art-p a:hover,.art-ul a:hover{color:#F4D98A}
        .art-h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:500;color:#F6F0E0;margin:44px 0 16px;scroll-margin-top:80px}
        .art-h3{font-size:19px;font-weight:700;color:#F6F0E0;margin:28px 0 10px}
        .art-ul{margin:0 0 22px;padding-left:4px;list-style:none}
        .art-ul li{position:relative;padding-left:26px;margin-bottom:11px;font-size:16px;line-height:1.6;color:rgba(242,237,227,.88)}
        .art-ul li::before{content:'';position:absolute;left:6px;top:11px;width:7px;height:7px;border-radius:50%;background:#DCB24A}

        /* Tarjeta de restaurante numerada (crema sobre verde: estilo de la marca) */
        .art-rest{display:flex;gap:16px;background:#F5ECD7;border-radius:16px;padding:20px 22px;margin:0 0 14px;box-shadow:0 10px 30px rgba(0,0,0,.14)}
        .art-rest-n{flex:0 0 auto;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(180deg,#E7C86A,#DCB24A);color:#25201A;font-weight:800;font-size:16px}
        .art-rest-body{min-width:0}
        .art-rest-name{margin:3px 0 0;font-size:19px;font-weight:700;color:#2A2016;line-height:1.25}
        .art-rest-type{font-weight:600;color:#8A6D2F}
        .art-rest-txt{margin:8px 0 0;font-size:15px;line-height:1.6;color:#4A4034}
        .art-rest-price{display:inline-block;margin-top:10px;font-size:12px;font-weight:700;color:#8A6D2F;background:rgba(138,109,47,.1);padding:4px 10px;border-radius:9999px}

        /* Callout de tips */
        .art-callout{background:rgba(220,178,74,.08);border:1px solid rgba(220,178,74,.28);border-radius:16px;padding:22px 24px;margin:26px 0}
        .art-callout-h{font-weight:700;color:#EBC66A;font-size:14px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px}
        .art-callout .art-ul{margin-bottom:0}

        /* CTA para dueños de negocio: muestra el beneficio de aparecer */
        .art-cta-neg{background:linear-gradient(135deg,#1C3B28,#24402B);border:1px solid rgba(220,178,74,.3);border-radius:18px;padding:28px;margin:34px 0;text-align:center}
        .art-cta-neg-h{font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:500;color:#F6F0E0;margin:0 0 10px}
        .art-cta-neg-p{font-size:15.5px;line-height:1.6;color:rgba(242,237,227,.82);margin:0 auto 20px;max-width:52ch}
        .art-cta-neg-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(180deg,#E7C86A,#DCB24A);color:#25201A;font-weight:700;font-size:15px;padding:12px 24px;border-radius:9999px;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}
        .art-cta-neg-btn:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(220,178,74,.3)}

        /* FAQ */
        .art-faq{margin-top:48px}
        .art-faq-h{font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:500;color:#F6F0E0;margin:0 0 18px}
        .art-faq details{background:rgba(240,232,212,.05);border:1px solid rgba(240,232,212,.12);border-radius:14px;padding:4px 20px;margin-bottom:10px}
        .art-faq summary{cursor:pointer;list-style:none;padding:16px 0;font-weight:700;font-size:16px;color:#F6F0E0;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .art-faq summary::-webkit-details-marker{display:none}
        .art-faq summary::after{content:'+';font-size:22px;color:#DCB24A;font-weight:400;line-height:1}
        .art-faq details[open] summary::after{content:'–'}
        .art-faq-a{padding:0 0 18px;font-size:15.5px;line-height:1.65;color:rgba(242,237,227,.82)}

        /* Sigue leyendo (enlaces internos) */
        .art-rel{margin-top:52px}
        .art-rel-h{font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:500;color:#F6F0E0;margin:0 0 18px}
        .art-rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
        .art-rel-card{background:#F5ECD7;border-radius:14px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;box-shadow:0 8px 22px rgba(0,0,0,.12);transition:transform .22s ease,box-shadow .22s ease}
        .art-rel-card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(0,0,0,.2)}
        .art-rel-img{aspect-ratio:16/9;overflow:hidden;background:#1C3B28}
        .art-rel-img img{width:100%;height:100%;object-fit:cover}
        .art-rel-body{padding:14px 16px}
        .art-rel-tag{color:#8A6D2F;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
        .art-rel-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:600;color:#2A2016;line-height:1.2;margin:6px 0 0}

        /* Cierre: directorio sólido para el turista */
        .art-dir{margin-top:44px;padding-top:30px;border-top:1px solid rgba(240,232,212,.14);text-align:center}
        .art-dir-p{font-size:16px;color:rgba(242,237,227,.8);margin:0 0 16px}
        .art-dir-btn{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(220,178,74,.4);color:#EBC66A;font-weight:600;font-size:15px;padding:11px 22px;border-radius:9999px;text-decoration:none;transition:background .2s ease}
        .art-dir-btn:hover{background:rgba(220,178,74,.1)}
      `}</style>

      <article className="art-wrap">
        <nav className="bc" aria-label="Ruta de navegación">
          <Link href="/historias" className="bc-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Historias
          </Link>
          {catDir && (
            <>
              <span className="bc-sep" aria-hidden="true">/</span>
              <Link href={`/categoria/${catDir.slug}`} className="bc-link">{catDir.nombre}</Link>
            </>
          )}
          <span className="bc-sep" aria-hidden="true">/</span>
          <span className="bc-current">{a.titulo}</span>
        </nav>

        <header>
          <p className="art-eyebrow">{a.categoria}</p>
          <h1 className="art-title">{a.titulo}</h1>
          {a.subtitulo && <p className="art-sub">{a.subtitulo}</p>}
          <div className="art-meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <time dateTime={a.fechaISO}>{a.fechaDisplay}</time>
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {a.lectura} de lectura
            </span>
            {a.autor && (
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {a.autor}
              </span>
            )}
          </div>
        </header>

        {a.imagen && (
          <div className="art-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.imagen} alt={a.imagenAlt || a.titulo} width="1280" height="720" />
          </div>
        )}

        <div className="art-body">
          {a.cuerpo.map((b, i) => <Bloque key={i} b={b} />)}
        </div>

        {a.faq && a.faq.length > 0 && (
          <section className="art-faq" aria-label="Preguntas frecuentes">
            <h2 className="art-faq-h">Preguntas frecuentes</h2>
            {a.faq.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="art-faq-a">{f.a}</div>
              </details>
            ))}
          </section>
        )}

        {relacionados.length > 0 && (
          <section className="art-rel" aria-label="Sigue leyendo">
            <h2 className="art-rel-h">Sigue leyendo</h2>
            <div className="art-rel-grid">
              {relacionados.map((r) => (
                <Link key={r.slug} href={`/historias/${r.slug}`} className="art-rel-card">
                  {r.imagen && (
                    <div className="art-rel-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.imagen} alt={r.imagenAlt || r.titulo} width="400" height="225" loading="lazy" />
                    </div>
                  )}
                  <div className="art-rel-body">
                    <span className="art-rel-tag">{r.categoria}</span>
                    <h3 className="art-rel-title">{r.titulo}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="art-dir">
          <p className="art-dir-p">Descubre todo lo que vale la pena en Malinalco, en un solo lugar.</p>
          <Link href="/#categorias" className="art-dir-btn">
            Explorar el directorio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </article>
    </PublicShell>
  )
}
