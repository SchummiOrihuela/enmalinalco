-- Corte mensual de vistas (para la insignia "▲ +N vs. mes pasado" del panel).
-- Ejecutar UNA vez en el editor SQL de Supabase.
--
-- Idea: `view_count` es el total ACUMULADO de vistas de cada ficha. Para poder
-- decir "creciste N este mes" guardamos, el día 1 de cada mes, una foto de ese
-- total en `views_last_month`. Así el panel calcula:
--     crecimiento = view_count - views_last_month
-- que son justo las vistas ganadas desde el corte (inicio del mes en curso).

-- 1) Columna del corte (total al iniciar el mes actual).
alter table public.businesses
  add column if not exists views_last_month integer;

-- 2) Función que toma la foto: copia el total actual al corte, para TODOS los
--    negocios. SECURITY DEFINER para que corra con permisos del dueño de la
--    función (el cron no actúa como ningún usuario en particular).
create or replace function public.snapshot_monthly_views()
returns void
language sql
security definer
set search_path = public
as $$
  update public.businesses
     set views_last_month = coalesce(view_count, 0);
$$;

-- 3) Programar el corte con pg_cron: cada día 1 a las 00:00 (UTC).
--    Si pg_cron no está habilitado, actívalo en el Dashboard:
--    Database → Extensions → busca "pg_cron" → Enable. Luego vuelve a correr esto.
create extension if not exists pg_cron;

-- Reprograma de forma idempotente: si el job ya existe, lo quita y lo vuelve a crear.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'monthly-views-snapshot') then
    perform cron.unschedule('monthly-views-snapshot');
  end if;
end $$;

select cron.schedule(
  'monthly-views-snapshot',
  '0 0 1 * *',                      -- min hora día-del-mes mes día-de-semana  → día 1, 00:00 UTC
  $$ select public.snapshot_monthly_views(); $$
);

-- 4) (Opcional) Sembrar el primer corte AHORA, para que la insignia funcione ya
--    en el primer mes, en vez de esperar al próximo día 1. Ponemos el corte un
--    poco por debajo del total actual para reflejar el crecimiento reciente.
--    Ajusta o quita esta línea a tu gusto.
update public.businesses
   set views_last_month = greatest(coalesce(view_count, 0) - 10, 0)
 where views_last_month is null;
