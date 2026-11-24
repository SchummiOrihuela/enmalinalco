// Fuente única de verdad para la lógica de planes.
// Toda regla por tier vive aquí. Nada de valores mágicos dispersos.
export const PLANS = {
  malinalli: {
    name: "Malinalli",
    price: 99,
    label: "Esencial",
    // Promesa de una línea: qué logra este tier para el dueño.
    tagline: "Tu lugar en el directorio del pueblo",
    maxPhotos: 3,
    priority: 1,
    badge: null,
    benefits: [
      "Tu negocio, presente en el directorio del Pueblo Mágico",
      "Hasta 3 fotos, contacto, mapa y horarios",
      "Apareces en las búsquedas y en tu categoría",
      "Botón directo a WhatsApp para cerrar en el momento",
      "Ojo de Jaguar Esencial: salud de tu ficha, tasa de contacto y el Pulso de Malinalco",
      "Presencia todo el año, sin permanencia",
    ],
  },
  cuauhtli: {
    name: "Cuāuhtli",
    price: 249,
    label: "⭐ Más popular",
    tagline: "Que te elijan primero",
    maxPhotos: 10,
    priority: 2,
    badge: null,
    benefits: [
      "Hasta 10 fotos y todas tus redes conectadas",
      "Prioridad: apareces primero en tu categoría",
      'Insignia "Recomendado" que genera confianza',
      "1 mención al mes en nuestras redes (tráfico que te atribuimos)",
      "Ojo de Jaguar con IA: tu Consultor que te dice qué hacer esta semana, tu valor en pesos, ranking del pueblo, alertas y metas",
      "Comparativa contra tu categoría en Malinalco",
    ],
  },
  ocelotl: {
    name: "Ocēlōtl",
    price: 449,
    label: "Élite",
    tagline: "El referente del pueblo, con consultor incluido",
    maxPhotos: 30,
    priority: 3,
    badge: "Ocēlōtl",
    benefits: [
      "Hasta 30 fotos y galería ampliada",
      "Primer lugar en tu categoría y presencia en portada",
      "Tu historia contada: artículo editorial propio (SEO que te trae clientes)",
      "En temporada alta, en el Top 3 del pueblo",
      "Ojo de Jaguar Total: de dónde viene cada cliente (historias y eventos), mapa de horas que te buscan, origen geográfico y reporte exportable",
      "Tu consultor dedicado: atención directa y reporte mensual a tu correo",
    ],
  },
};
// Plan por defecto para negocios sin plan asignado (aún no pagan).
export const DEFAULT_PLAN = "malinalli";

// Cuentas del dueño del proyecto: siempre en el tier más alto y activas,
// pase lo que pase con webhooks de pago o pruebas de checkout.
export const OWNER_EMAILS = ["schummi1987@gmail.com", "schummi87@hotmail.com"];
export const OWNER_PLAN = "ocelotl";

// Aplica el override del dueño: si el negocio pertenece a una cuenta del
// dueño, fuerza plan Ocēlōtl y estado activo. Si no, devuelve el negocio tal cual.
export function applyOwnerOverride(business, email) {
  if (!business || !email) return business;
  if (!OWNER_EMAILS.includes(email.toLowerCase())) return business;
  return { ...business, plan: OWNER_PLAN, is_active: true };
}

// Gancho de lanzamiento: club "Fundadores".
// Los primeros negocios estrenan el directorio con meses gratis en un tier alto.
// Al terminar la promo se busca que se queden en Cuāuhtli/Ocēlōtl.
export const FOUNDERS = {
  active: true,
  // Corte interno en 52: 2 lugares son las compras de prueba del host, así
  // quedan 50 lugares reales para clientes (el copy público dice "50").
  cupos: 52,
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
