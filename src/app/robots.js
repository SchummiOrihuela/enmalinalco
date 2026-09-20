// robots.txt generado por Next. Le dice a Google (y a los buscadores de IA)
// qué pueden rastrear y dónde está el mapa del sitio.
const SITE = 'https://enmalinalco.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Zonas privadas o sin valor para búsqueda.
        disallow: ['/dashboard', '/login', '/auth', '/api'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
