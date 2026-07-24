// Convierte texto de categoría a slug de URL y viceversa.
// Ej: "Hotel/Airbnb" -> "hotel-airbnb"
export function toSlug(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')                 // separa acentos
    .replace(/[\u0300-\u036f]/g, '')  // elimina acentos
    .replace(/[^a-z0-9]+/g, '-')      // no-alfanumérico -> guion
    .replace(/^-+|-+$/g, '');         // limpia guiones extremos
}
