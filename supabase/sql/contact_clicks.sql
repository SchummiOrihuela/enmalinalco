-- Conteo de INTERACCIONES de contacto por ficha: clics a WhatsApp, teléfono y
-- "Cómo llegar" (mapa). Es la "prueba de valor" que ve el dueño en su panel:
-- cuánta gente lo contactó desde En Malinalco.
--
-- Mismo enfoque que las vistas: una función SECURITY DEFINER para que el
-- visitante anónimo pueda sumar el contador SIN poder tocar otros campos.
-- La app la llama (vía /api/track-contact) con:
--   supabase.rpc('increment_business_contact', { bid, kind })
-- donde kind ∈ ('whatsapp','phone','maps').
--
-- Ejecutar UNA vez en el editor SQL de Supabase.

-- 1) Columnas de totales acumulados + su corte mensual (para "▲ +N vs. mes pasado").
alter table public.businesses
  add column if not exists whatsapp_clicks            integer not null default 0,
  add column if not exists phone_clicks               integer not null default 0,
  add column if not exists maps_clicks                integer not null default 0,
  add column if not exists whatsapp_clicks_last_month integer,
  add column if not exists phone_clicks_last_month    integer,
  add column if not exists maps_clicks_last_month      integer;

-- 2) Función que incrementa SOLO el contador correspondiente al tipo de clic.
create or replace function public.increment_business_contact(bid uuid, kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if kind not in ('whatsapp', 'phone', 'maps') then
    return;
  end if;
  update public.businesses
     set whatsapp_clicks = coalesce(whatsapp_clicks, 0) + (case when kind = 'whatsapp' then 1 else 0 end),
         phone_clicks    = coalesce(phone_clicks, 0)    + (case when kind = 'phone'    then 1 else 0 end),
         maps_clicks     = coalesce(maps_clicks, 0)     + (case when kind = 'maps'     then 1 else 0 end)
   where id = bid
     and is_active = true;
end;
$$;

grant execute on function public.increment_business_contact(uuid, text) to anon, authenticated;

-- 3) Corte mensual: extendemos la foto que ya toma pg_cron para que también
--    cubra los clics de contacto. Reemplaza la función existente; el job
--    'monthly-views-snapshot' sigue igual y ahora guarda también estos totales.
create or replace function public.snapshot_monthly_views()
returns void
language sql
security definer
set search_path = public
as $$
  update public.businesses
     set views_last_month           = coalesce(view_count, 0),
         whatsapp_clicks_last_month = coalesce(whatsapp_clicks, 0),
         phone_clicks_last_month    = coalesce(phone_clicks, 0),
         maps_clicks_last_month     = coalesce(maps_clicks, 0);
$$;

-- 4) (Opcional) Siembra el primer corte AHORA para que la insignia "este mes"
--    funcione desde ya, en vez de esperar al próximo día 1.
update public.businesses
   set whatsapp_clicks_last_month = coalesce(whatsapp_clicks, 0),
       phone_clicks_last_month    = coalesce(phone_clicks, 0),
       maps_clicks_last_month     = coalesce(maps_clicks, 0)
 where whatsapp_clicks_last_month is null;
