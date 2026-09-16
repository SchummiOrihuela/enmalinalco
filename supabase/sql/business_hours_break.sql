-- Hora de comida (cierre a mediodía) en los horarios del negocio.
-- Ejecutar UNA vez en el editor SQL de Supabase.
--
-- Muchos negocios de Malinalco cierran un rato al mediodía para comer.
-- Con estas dos columnas un día puede tener DOS franjas:
--   open_time → break_start   y   break_end → close_time
-- Ambas son opcionales: si están vacías, el día es una sola franja como antes.

alter table public.business_hours
  add column if not exists break_start time,  -- inicio del cierre por comida (ej. 14:00)
  add column if not exists break_end   time;  -- fin del cierre por comida  (ej. 16:00)
