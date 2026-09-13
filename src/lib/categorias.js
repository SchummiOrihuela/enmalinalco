// Fuente única de verdad de las CATEGORÍAS del directorio.
// De aquí salen: las tarjetas del inicio, el buscador (con sinónimos),
// el título y la descripción de cada página de categoría.
//
// Reglas:
// - `slug` debe ser igual a toSlug(nombre) (ver src/lib/slug.js).
// - En la base de datos, business.category debe guardarse EXACTO como `nombre`,
//   para que la página /categoria/[slug] filtre correctamente.
// - `sinonimos` son para el buscador: el cliente escribe "hospital" y llega a Salud.
// - `foto` es la imagen de la tarjeta; si el archivo no existe aún, la tarjeta
//   muestra su color de fondo (no se rompe nada).

export const CATEGORIAS = [
  {
    slug: 'restaurantes',
    nombre: 'Restaurantes',
    hint: 'Cocina y antojitos',
    descripcion:
      'Restaurantes, fondas, cafés y antojitos de Malinalco: desde la trucha fresca hasta la cocina de autor.',
    sinonimos: ['comida', 'comer', 'fonda', 'cafe', 'cafetería', 'restaurante', 'tacos', 'trucha', 'mariscos', 'desayuno', 'antojitos', 'cenar'],
    color: '#1C3B28',
    foto: '/img/categorias/01-restaurantes.webp',
    svg: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  },
  {
    slug: 'hospedaje',
    nombre: 'Hospedaje',
    hint: 'Dónde dormir',
    descripcion:
      'Hoteles, cabañas, quintas y hospedaje boutique. También lo que encuentras en Airbnb, Booking y Expedia.',
    sinonimos: ['hotel', 'airbnb', 'booking', 'expedia', 'quinta', 'cabaña', 'cabana', 'hospedaje', 'dormir', 'hostal', 'posada', 'boutique'],
    color: '#1C2E3B',
    foto: '/img/categorias/02-hospedaje.webp',
    svg: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>',
  },
  {
    slug: 'ecoturismo',
    nombre: 'Ecoturismo',
    hint: 'Aventura y naturaleza',
    descripcion:
      'Rutas, cascadas, senderismo, tirolesa, temazcal y aventura entre las montañas de Malinalco.',
    sinonimos: ['ecoturismo', 'ruta', 'rutas', 'cascada', 'senderismo', 'tirolesa', 'aventura', 'montaña', 'temazcal', 'naturaleza', 'caminata', 'campismo'],
    color: '#1C2B24',
    foto: '/img/categorias/04-ecoturismo.webp',
    svg: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  },
  {
    slug: 'balnearios',
    nombre: 'Balnearios',
    hint: 'Agua y albercas',
    descripcion:
      'Balnearios, albercas y parques acuáticos para refrescarte en familia.',
    sinonimos: ['balneario', 'alberca', 'albercas', 'acuatico', 'acuático', 'agua', 'piscina', 'chapoteadero', 'parque acuático', 'nadar', 'aguas termales'],
    color: '#152A33',
    foto: '/img/categorias/balnearios.webp',
    svg: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  },
  {
    slug: 'cultura',
    nombre: 'Cultura',
    hint: 'Arte e historia',
    descripcion:
      'La zona arqueológica, museos, la Casa de la Cultura, galerías y artesanías del pueblo.',
    sinonimos: ['cultura', 'zona arqueologica', 'zona arqueológica', 'museo', 'museos', 'artesanias', 'artesanías', 'galeria', 'galería', 'casa de la cultura', 'historia', 'arte', 'piramide', 'pirámide'],
    color: '#1E1C2E',
    foto: '/img/categorias/06-cultura.webp',
    svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  },
  {
    slug: 'belleza-y-bienestar',
    nombre: 'Belleza y Bienestar',
    hint: 'Spa y estética',
    descripcion:
      'Estéticas, barberías, spa, uñas y masajes para consentirte.',
    sinonimos: ['belleza', 'estetica', 'estética', 'spa', 'barberia', 'barbería', 'uñas', 'unas', 'masaje', 'salon', 'salón', 'bienestar', 'corte', 'peluqueria', 'peluquería', 'depilacion', 'depilación'],
    color: '#2B1C24',
    foto: '/img/categorias/03-spa-bienestar.webp',
    svg: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
  },
  {
    slug: 'salud',
    nombre: 'Salud',
    hint: 'Clínicas y farmacias',
    descripcion:
      'Aquí encuentras el Hospital General de Malinalco, consultorios, clínicas, farmacias y dentistas.',
    sinonimos: ['salud', 'hospital', 'clinica', 'clínica', 'consultorio', 'doctor', 'medico', 'médico', 'farmacia', 'dentista', 'urgencias', 'laboratorio', 'analisis', 'análisis'],
    color: '#2B1C1C',
    foto: '/img/categorias/salud.webp',
    svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  },
  {
    slug: 'tiendas',
    nombre: 'Tiendas',
    hint: 'Abarrotes y más',
    descripcion:
      'Abarrotes, tienditas de la esquina, mini súpers, 3B y depósitos de cerveza.',
    sinonimos: ['tienda', 'tiendas', 'abarrotes', 'super', 'súper', 'minisuper', 'mini super', '3b', 'tres b', 'cerveza', 'deposito', 'depósito', 'changarro', 'miscelanea', 'miscelánea', 'oxxo'],
    color: '#2B241C',
    foto: '/img/categorias/tiendas.webp',
    svg: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  },
  {
    slug: 'ropa-y-accesorios',
    nombre: 'Ropa y Accesorios',
    hint: 'Ropa típica',
    descripcion:
      'Ropa típica, huaraches, chales, bordados y accesorios hechos en la región.',
    sinonimos: ['ropa', 'huaraches', 'chal', 'chales', 'bordado', 'bordados', 'tipica', 'típica', 'zapateria', 'zapatería', 'accesorios', 'boutique', 'vestido', 'artesanal'],
    color: '#332019',
    foto: '/img/categorias/ropa.webp',
    svg: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  },
  {
    slug: 'construccion',
    nombre: 'Construcción',
    hint: 'Ferreterías y materiales',
    descripcion:
      'Ferreterías, tlapalerías, jarcierías, pinturas Comex y materiales para construir o remodelar.',
    sinonimos: ['construccion', 'construcción', 'ferreteria', 'ferretería', 'tlapaleria', 'tlapalería', 'jarciería', 'jarcieria', 'comex', 'pintura', 'pinturas', 'material', 'materiales', 'cemento', 'herramienta'],
    color: '#33291A',
    foto: '/img/categorias/construccion.webp',
    svg: '<path d="m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h.86c.85 0 1.65.33 2.25.93l1.25 1.25"/>',
  },
  {
    slug: 'veterinarias',
    nombre: 'Veterinarias',
    hint: 'Para tus mascotas',
    descripcion:
      'Veterinarias, consultorios y estéticas para el cuidado de tus mascotas.',
    sinonimos: ['veterinaria', 'veterinarias', 'vet', 'mascota', 'mascotas', 'perro', 'gato', 'animal', 'pet', 'consultorio veterinario'],
    color: '#1C2B2B',
    foto: '/img/categorias/veterinarias.webp',
    svg: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="9" r="2"/><circle cx="8" cy="15" r="2"/><path d="M9.7 15.5a3 3 0 0 0 5.2 0c1-1.8 2.1-2 2.6-3.5.6-1.9-.8-4-3-4s-2.9 1-4.5 1-2.3-1-4.5-1-3.6 2.1-3 4c.5 1.5 1.6 1.7 2.6 3.5"/>',
  },
  {
    slug: 'servicios',
    nombre: 'Servicios',
    hint: 'Todo lo demás',
    descripcion:
      'Papelerías, lavanderías, mecánicos, bancos y cajeros, internet y todo lo útil del día a día.',
    sinonimos: ['servicio', 'servicios', 'papeleria', 'papelería', 'lavanderia', 'lavandería', 'mecanico', 'mecánico', 'taller', 'banco', 'cajero', 'internet', 'copias', 'gas', 'gasolinera', 'cerrajero', 'electricista', 'plomero'],
    color: '#1C2B24',
    foto: '/img/categorias/07-servicios.webp',
    svg: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a2 2 0 1 0 2.8 2.8l6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.1-.6-.6-2.1z"/>',
  },
]

// Índice rápido por slug.
export const CATEGORIA_POR_SLUG = Object.fromEntries(
  CATEGORIAS.map((c) => [c.slug, c])
)

// Normaliza texto para comparar (minúsculas, sin acentos, sin espacios extra).
export function normaliza(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Devuelve la categoría que mejor corresponde a lo que escribió el cliente,
// buscando por nombre y por sinónimos. null si no hay match.
export function buscarCategoria(query) {
  const q = normaliza(query)
  if (!q) return null
  // 1) match exacto de nombre
  for (const c of CATEGORIAS) {
    if (normaliza(c.nombre) === q) return c
  }
  // 2) match por nombre o sinónimo (contiene / contenido)
  for (const c of CATEGORIAS) {
    const campos = [c.nombre, ...(c.sinonimos || [])].map(normaliza)
    if (campos.some((h) => h === q || h.includes(q) || q.includes(h))) return c
  }
  return null
}
