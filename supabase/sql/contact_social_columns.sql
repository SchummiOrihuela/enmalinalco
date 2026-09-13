-- Datos de contacto, ubicación y redes sociales del negocio.
-- Ejecutar UNA vez en el editor SQL de Supabase.
--
-- Se editan desde el panel (tarjeta "Ubicación y Redes Sociales") y se muestran
-- en la ficha pública para que los clientes contacten y lleguen con un toque.

alter table public.businesses
  add column if not exists address    text,  -- dirección legible (calle, número, colonia)
  add column if not exists whatsapp   text,  -- número (solo dígitos con lada)
  add column if not exists instagram  text,  -- @usuario o enlace del perfil
  add column if not exists facebook   text,  -- enlace de la página
  add column if not exists maps_url   text;  -- enlace de ubicación en Google Maps
