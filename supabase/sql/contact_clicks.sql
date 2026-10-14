-- Conteo de INTERACCIONES de la ficha: VISTAS y contactos (WhatsApp, teléfono
-- y "Cómo llegar"/mapa). Es la "prueba de valor" que ve el dueño en su panel:
-- cuánta gente lo descubre y lo contacta desde En Malinalco.
--
-- Mismo enfoque que las vistas: funciones SECURITY DEFINER para que el
-- visitante anónimo pueda sumar el contador SIN poder tocar otros campos.
-- La app las llama con:
--   supabase.rpc('increment_business_view', { bid })
--   supabase.rpc('increment_business_contact', { bid, kind })   (vía /api/track-contact)
-- donde kind ∈ ('whatsapp','phone','maps').
--
-- Autosuficiente: crea también las columnas/función de vistas por si el script
-- de vistas (increment_business_view.sql / monthly_views_snapshot.sql) no se
-- ejecutó antes. Es idempotente: se puede volver a correr sin romper nada.
--
-- Ejecutar UNA vez en el editor SQL de Supabase.

-- 1) Columnas base de VISTAS (por si nunca se corrió el script de vistas).
alter table public.businesses
  add column if not exists view_count       integer not null default 0,
  add column if not exists views_last_month integer;

-- 2) Columnas de CONTACTOS: totales acumulados + su corte mensual
--    (para la insignia "▲ +N vs. mes pasado"). Incluye redes (IG/FB), que
--    se miden desde el plan Cuāuhtli en adelante.
alter table public.businesses
  add column if not exists whatsapp_clicks             integer not null default 0,
  add column if not exists phone_clicks                integer not null default 0,
  add column if not exists maps_clicks                 integer not null default 0,
  add column if not exists instagram_clicks            integer not null default 0,
  add column if not exists facebook_clicks             integer not null default 0,
  add column if not exists whatsapp_clicks_last_month  integer,
  add column if not exists phone_clicks_last_month     integer,
  add column if not exists maps_clicks_last_month      integer,
  add column if not exists instagram_clicks_last_month integer,
  add column if not exists facebook_clicks_last_month  integer;

-- 3) Función que suma UNA vista (si aún no existía).
create or replace function public.increment_business_view(bid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.businesses
     set view_count = coalesce(view_count, 0) + 1
   where id = bid
     and is_active = true;
$$;

grant execute on function public.increment_business_view(uuid) to anon, authenticated;

-- 4) Función que incrementa SOLO el contador correspondiente al tipo de clic.
create or replace function public.increment_business_contact(bid uuid, kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if kind not in ('whatsapp', 'phone', 'maps', 'instagram', 'facebook') then
    return;
  end if;
  update public.businesses
     set whatsapp_clicks  = coalesce(whatsapp_clicks, 0)  + (case when kind = 'whatsapp'  then 1 else 0 end),
         phone_clicks     = coalesce(phone_clicks, 0)     + (case when kind = 'phone'     then 1 else 0 end),
         maps_clicks      = coalesce(maps_clicks, 0)      + (case when kind = 'maps'      then 1 else 0 end),
         instagram_clicks = coalesce(instagram_clicks, 0) + (case when kind = 'instagram' then 1 else 0 end),
         facebook_clicks  = coalesce(facebook_clicks, 0)  + (case when kind = 'facebook'  then 1 else 0 end)
   where id = bid
     and is_active = true;
end;
$$;

grant execute on function public.increment_business_contact(uuid, text) to anon, authenticated;

-- 5) Corte mensual: una sola función toma la foto de vistas y contactos.
--    Reemplaza la versión existente; el job 'monthly-views-snapshot' de pg_cron
--    (ver monthly_views_snapshot.sql) sigue igual y ahora cubre también los clics.
create or replace function public.snapshot_monthly_views()
returns void
language sql
security definer
set search_path = public
as $$
  update public.businesses
     set views_last_month            = coalesce(view_count, 0),
         whatsapp_clicks_last_month  = coalesce(whatsapp_clicks, 0),
         phone_clicks_last_month     = coalesce(phone_clicks, 0),
         maps_clicks_last_month      = coalesce(maps_clicks, 0),
         instagram_clicks_last_month = coalesce(instagram_clicks, 0),
         facebook_clicks_last_month  = coalesce(facebook_clicks, 0);
$$;

-- 6) Siembra el primer corte AHORA, para que la insignia "este mes" funcione ya,
--    en vez de esperar al próximo día 1.
update public.businesses
   set views_last_month            = coalesce(view_count, 0),
       whatsapp_clicks_last_month  = coalesce(whatsapp_clicks, 0),
       phone_clicks_last_month     = coalesce(phone_clicks, 0),
       maps_clicks_last_month      = coalesce(maps_clicks, 0),
       instagram_clicks_last_month = coalesce(instagram_clicks, 0),
       facebook_clicks_last_month  = coalesce(facebook_clicks, 0);

-- 7) (Opcional) Programar el corte automático cada día 1 a las 00:00 UTC.
--    Descomenta si quieres que pg_cron reinicie el "▲ vs. mes pasado" solo.
--
-- create extension if not exists pg_cron;
-- do $$
-- begin
--   if exists (select 1 from cron.job where jobname = 'monthly-views-snapshot') then
--     perform cron.unschedule('monthly-views-snapshot');
--   end if;
-- end $$;
-- select cron.schedule(
--   'monthly-views-snapshot',
--   '0 0 1 * *',
--   $$ select public.snapshot_monthly_views(); $$
-- );
