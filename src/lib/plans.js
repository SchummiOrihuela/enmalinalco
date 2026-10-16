// Fuente única de verdad para la lógica de planes.
// Toda regla por tier vive aquí. Nada de valores mágicos dispersos.
export const PLANS = {
  malinalli: {
    name: "Malinalli",
    price: 99,
    // Precio anual: pagas 10 meses, te llevas 12 (2 meses gratis).
    priceAnual: 990,
    label: "Básico",
    // Promesa de una línea: qué logra este tier para el dueño.
    tagline: "Que te encuentren en el pueblo",
    maxPhotos: 3,
    priority: 1,
    badge: null,
    benefits: [
      "3 fotos de tu negocio",
      "Contacto, ubicación y horarios",
      "Apareces en el directorio y el buscador",
      "Comparte tu ficha por WhatsApp",
      "Tus clientes potenciales del mes: vistas y contactos",
      "Siempre visible, todo el año",
    ],
  },
  cuauhtli: {
    name: "Cuāuhtli",
    price: 249,
    priceAnual: 2490,
    label: "⭐ Más popular",
    tagline: "Que te elijan primero",
    maxPhotos: 10,
    priority: 2,
    badge: null,
    benefits: [
      "10 fotos de tu negocio",
      "Contacto, ubicación y todas tus redes sociales",
      "Apareces en los primeros lugares de tu categoría",
      'Insignia "Recomendado"',
      "1 mención al mes en nuestras redes",
      "Inteligencia de tu ficha: tendencia del mes y cómo vas frente a tu categoría",
    ],
  },
  ocelotl: {
    name: "Ocēlōtl",
    price: 449,
    priceAnual: 4490,
    label: "Élite",
    tagline: "El referente del pueblo, con consultor incluido",
    maxPhotos: 30,
    priority: 3,
    badge: "Ocēlōtl",
    benefits: [
      "30 fotos de tu negocio",
      "Primer lugar en tu categoría y en la portada",
      "Tu historia contada: artículo editorial propio",
      "En temporada alta, apareces en el Top 3",
      "Tu consultor en el negocio: reporte mensual con recomendaciones para crecer",
      "Atención personalizada, directa con nosotros",
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
// ── Facturación: mensual (default) o anual (2 meses gratis) ──────────────
// El precio anual es 10 × mensual, así que el dueño se ahorra 2 meses al año.
// La elección real de ciclo ocurre en el panel; la landing solo informa.
export const BILLING = {
  mensual: { key: "mensual", label: "Mensual", per: "/mes" },
  anual: { key: "anual", label: "Anual", per: "/año", nota: "2 meses gratis" },
};

// Garantía para bajar el miedo al pago recurrente. Es una promesa que el host
// honra: si el negocio no recibe NI UN contacto en su primer mes, el siguiente
// corre por cuenta de la casa. Ajusta el copy a tu gusto; el espíritu es
// quitarle al locatario el riesgo de "¿y si no me sirve?".
export const GUARANTEE = {
  active: true,
  dias: 30,
  short: "Garantía de 30 días",
  copy:
    "Si en tu primer mes no recibes ni un solo contacto desde En Malinalco, " +
    "el siguiente mes corre por nuestra cuenta. Sin letras chiquitas.",
};

// Helper: precio según el ciclo de facturación.
export function getPrice(plan, billing = "mensual") {
  const p = PLANS[plan] || PLANS[DEFAULT_PLAN];
  return billing === "anual" ? p.priceAnual : p.price;
}

// Helper: lo que cuesta al mes un plan anual (para mostrar "equivale a $X/mes").
export function getMonthlyEquivalent(plan) {
  const p = PLANS[plan] || PLANS[DEFAULT_PLAN];
  return Math.round(p.priceAnual / 12);
}

// Helper: cuánto se ahorra al año pagando anual en vez de 12 mensualidades.
export function getAnnualSavings(plan) {
  const p = PLANS[plan] || PLANS[DEFAULT_PLAN];
  return p.price * 12 - p.priceAnual;
}

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
