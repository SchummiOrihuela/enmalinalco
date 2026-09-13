-- ─────────────────────────────────────────────────────────────
-- Lectura PÚBLICA de fotos y horarios en las fichas de negocio.
--
-- Problema: en la ficha pública, un visitante anónimo (sin sesión)
-- veía nombre/dirección/contacto pero NO las fotos ni los horarios.
-- Causa: las tablas business_photos y business_hours tienen RLS
-- activo pero sin una política que permita SELECT al rol anónimo,
-- así que solo el dueño (autenticado) podía leerlas.
--
-- Solución: permitir SELECT a anon/authenticated SOLO para fotos y
-- horarios que pertenezcan a un negocio activo (is_active = true).
-- Es aditivo: no quita las políticas existentes del dueño.
-- ─────────────────────────────────────────────────────────────

-- Asegura que RLS esté activo (no-op si ya lo estaba).
alter table public.business_photos enable row level security;
alter table public.business_hours  enable row level security;

-- Fotos: lectura pública de negocios activos.
drop policy if exists "public_read_active_business_photos" on public.business_photos;
create policy "public_read_active_business_photos"
on public.business_photos
for select
to anon, authenticated
using (
  exists (
    select 1 from public.businesses b
    where b.id = business_photos.business_id
      and b.is_active
  )
);

-- Horarios: lectura pública de negocios activos.
drop policy if exists "public_read_active_business_hours" on public.business_hours;
create policy "public_read_active_business_hours"
on public.business_hours
for select
to anon, authenticated
using (
  exists (
    select 1 from public.businesses b
    where b.id = business_hours.business_id
      and b.is_active
  )
);
