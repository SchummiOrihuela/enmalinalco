// Mapa del sitio dinámico. Incluye la home, las páginas estáticas,
// cada categoría del directorio y la ficha de cada negocio activo.
// Es lo que Google usa para descubrir e indexar todo el sitio.
import { createServerClient } from '@supabase/ssr'
import { CATEGORIAS } from '@/lib/categorias'

const SITE = 'https://enmalinalco.com'

// Cliente de solo lectura, sin cookies (lectura pública anónima).
function readClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const now = new Date()

  // Páginas fijas conocidas del sitio.
  const staticPages = [
    { url: `${SITE}/`, changeFrequency: 'daily', priority: 1, lastModified: now },
  ]

  // Una página por categoría.
  const categoryPages = CATEGORIAS.map((c) => ({
    url: `${SITE}/categoria/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Una página por negocio activo.
  let businessPages = []
  try {
    const supabase = readClient()
    const { data } = await supabase
      .from('businesses')
      .select('slug, updated_at')
      .eq('is_active', true)

    businessPages = (data || [])
      .filter((b) => b.slug)
      .map((b) => ({
        url: `${SITE}/negocio/${b.slug}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
  } catch {
    // Si Supabase falla, el sitemap sigue sirviendo lo estático.
  }

  return [...staticPages, ...categoryPages, ...businessPages]
}
