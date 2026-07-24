// Fuente única de verdad para la lógica de planes.
// Toda regla por tier vive aquí. Nada de valores mágicos dispersos.

export const PLANS = {
  malinalli: {
    name: "Malinalli",
    maxPhotos: 3,
  },
  cuauhtli: {
    name: "Cuāuhtli",
    maxPhotos: 10,
  },
  ocelotl: {
    name: "Ocēlōtl",
    maxPhotos: 30,
  },
};

// Plan por defecto para negocios sin plan asignado (aún no pagan).
export const DEFAULT_PLAN = "malinalli";

// Helper: devuelve el límite de fotos según el plan del negocio.
export function getMaxPhotos(plan) {
  const key = plan || DEFAULT_PLAN;
  return PLANS[key]?.maxPhotos ?? PLANS[DEFAULT_PLAN].maxPhotos;
}
