// Fuente única de verdad para la lógica de planes.
// Toda regla por tier vive aquí. Nada de valores mágicos dispersos.
export const PLANS = {
  malinalli: {
    name: "Malinalli",
    maxPhotos: 3,
    priority: 1,
    badge: null,
  },
  cuauhtli: {
    name: "Cuāuhtli",
    maxPhotos: 10,
    priority: 2,
    badge: null,
  },
  ocelotl: {
    name: "Ocēlōtl",
    maxPhotos: 30,
    priority: 3,
    badge: "Ocēlōtl",
  },
};
// Plan por defecto para negocios sin plan asignado (aún no pagan).
export const DEFAULT_PLAN = "malinalli";
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
