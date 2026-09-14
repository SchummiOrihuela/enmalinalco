// Fuente única de verdad para la lógica de planes.
// Toda regla por tier vive aquí. Nada de valores mágicos dispersos.
export const PLANS = {
  malinalli: {
    name: "Malinalli",
    price: 99,
    label: "Básico",
    // Promesa de una línea: qué logra este tier para el dueño.
    tagline: "Existe en el pueblo digital",
    maxPhotos: 3,
    priority: 1,
    badge: null,
    benefits: [
      "3 fotos de tu negocio",
      "Contacto, ubicación y horarios",
      "Ficha visible los 7 días",
    ],
  },
  cuauhtli: {
    name: "Cuāuhtli",
    price: 249,
    label: "⭐ Más popular",
    tagline: "Que te encuentren primero",
    maxPhotos: 10,
    priority: 2,
    badge: null,
    benefits: [
      "10 fotos de tu negocio",
      "Apareces antes en tu categoría",
      'Insignia "Recomendado"',
      "1 mención al mes en nuestras redes",
      "Reporte de cuánta gente te vio",
    ],
  },
  ocelotl: {
    name: "Ocēlōtl",
    price: 449,
    label: "Élite",
    tagline: "El negocio de referencia del pueblo",
    maxPhotos: 30,
    priority: 3,
    badge: "Ocēlōtl",
    benefits: [
      "30 fotos de tu negocio",
      "Primer lugar en tu categoría",
      "Tu historia contada (artículo editorial)",
      "Apareces en la portada",
      "Línea directa por WhatsApp conmigo",
      "En temporada alta, apareces en el Top 3",
    ],
  },
};
// Plan por defecto para negocios sin plan asignado (aún no pagan).
export const DEFAULT_PLAN = "malinalli";

// Gancho de lanzamiento: club "Fundadores".
// Los primeros negocios estrenan el directorio con meses gratis en un tier alto.
// Al terminar la promo se busca que se queden en Cuāuhtli/Ocēlōtl.
export const FOUNDERS = {
  active: true,
  cupos: 50,
  descuento: 30, // % de descuento
  mesesDescuento: 3, // meses que dura el descuento antes del precio completo
  tiers: ["malinalli", "cuauhtli", "ocelotl"],
  titulo: "Programa Fundadores",
  copy:
    "Un lugar reservado para los primeros 50 negocios que creen en el proyecto. " +
    "Accedes a una tarifa preferente —30% menos durante tus primeros 3 meses, en el plan que elijas— " +
    "y aseguras tu presencia en el directorio del pueblo desde el primer día. Sin permanencia.",
};
// Helper: devuelve el límite de fotos según el plan del negocio.
export function getMaxPhotos(plan) {
  const key = plan || DEFAULT_PLAN;
  return PLANS[key]?.maxPhotos ?? PLANS[DEFAULT_PLAN].maxPhotos;
}
// Helper: peso de prioridad para ordenar listados (mayor = primero).
export function getPriority(plan) {
  const key = plan || DEFAULT_PLAN;
  return PLANS[key]?.priority ?? PLANS[DEFAULT_PLAN].priority;
}
// Helper: badge a mostrar, o null si el plan no lleva.
export function getBadge(plan) {
  const key = plan || DEFAULT_PLAN;
  return PLANS[key]?.badge ?? null;
}
