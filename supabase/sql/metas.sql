-- Meta mensual de contactos (Ojo de Jaguar → sección "Meta del mes").
-- El dueño fija cuántos contactos quiere lograr al mes y el panel mide el avance.
-- Ejecutar UNA vez en el editor SQL de Supabase. Idempotente.

alter table public.businesses
  add column if not exists meta_contactos integer;

-- El dueño ya puede actualizar su propio negocio (RLS existente), así que no se
-- requiere política nueva: guarda la meta desde el panel como cualquier otro campo.
