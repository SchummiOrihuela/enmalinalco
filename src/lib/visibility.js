// Fuente única de verdad para "qué negocio ve el público".
//
// Un negocio aparece en el directorio si:
//   - está activo (is_active = true), o
//   - está en periodo de gracia (grace_until aún en el futuro).
//
// Así, cuando una suscripción se cancela o vence, la ficha NO desaparece
// de golpe: sigue visible durante la gracia para dar tiempo a renovar.
//
// Uso: applyVisible(supabase.from('businesses').select('*'))
export function applyVisible(query) {
  const nowIso = new Date().toISOString()
  return query.or(`is_active.eq.true,grace_until.gt.${nowIso}`)
}
