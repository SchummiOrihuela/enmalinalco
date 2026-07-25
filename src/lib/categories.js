// Lista fija y controlada de categorías del directorio.
// El cliente elige de aquí (dropdown), nunca escribe libre.
// El slug se deriva con toSlug(name) — debe coincidir con la ruta /categoria/[slug].
export const CATEGORIES = [
  { name: 'Hospedaje',              icon: '🏨' },
  { name: 'Restaurantes',          icon: '🍽️' },
  { name: 'Spa & Bienestar',       icon: '🧖' },
  { name: 'Ecoturismo & Aventura', icon: '🏔️' },
  { name: 'Artesanías & Tiendas',  icon: '🎨' },
  { name: 'Cultura & Turismo',     icon: '🏛️' },
  { name: 'Servicios',             icon: '🛠️' },
  { name: 'Eventos & Experiencias',icon: '🎉' },
]
