// Fuente única de verdad para la lógica de planes.
// Toda regla por tier vive aquí. Nada de valores mágicos dispersos.
export const PLANS = {
  malinalli: {
    name: "Malinalli",
    price: 99,
    label: "Esencial",
    // Promesa de una línea: qué logra este tier para el dueño.
    tagline: "Tu lugar donde el visitante decide",
    maxPhotos: 3,
    priority: 1,
    badge: null,
    benefits: [
      "Te encuentran los miles de turistas que cada fin de semana buscan dónde ir en Malinalco",
      "WhatsApp directo para cerrar en el momento, sin intermediarios",
      "Apareces en el buscador y en tu categoría del directorio",
      "Ojo de Jaguar Esencial: salud de tu ficha, tasa de contacto y el Pulso de Malinalco — inteligencia que nadie más en el pueblo tiene",
      "Hasta 3 fotos, contacto, mapa y horarios",
      "Tu distinción del pueblo, lista para presumir en Instagram, Facebook o tu local",
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
      "Ojo de Jaguar con IA: tu consultor que te dice qué hacer esta semana para vender más — tu valor en pesos, a qué hora y de dónde te buscan, tu ranking, alertas y metas. Nadie más en el pueblo lo tiene.",
      "Apareces primero en tu categoría, antes que tu competencia",
      "Te promovemos: 1 mención al mes en las redes de En Malinalco (tráfico que te atribuimos)",
      'Insignia "Recomendado" que genera confianza al visitante',
      "Comparativa contra tu categoría del pueblo",
      "Hasta 10 fotos y todas tus redes conectadas",
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
      "Primer lugar en tu categoría y la portada del pueblo — el primer negocio que ve quien llega a Malinalco",
      "Ojo de Jaguar Total: de dónde viene cada cliente (qué historia o evento lo trajo), a qué hora te buscan, de qué estados, y tu reporte completo exportable",
      "Contamos tu historia: un artículo editorial propio que te trae clientes (SEO del pueblo)",
      "Tu consultor dedicado, en persona: te acompañamos uno a uno, con reporte mensual a tu correo",
      "Atención prioritaria: lo que necesites, resuelto primero y el mismo día",
      "Hasta 30 fotos y galería ampliada",
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
