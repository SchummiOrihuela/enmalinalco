-- Contador de vistas de ficha (beneficio "reporte de vistas" del plan Cuāuhtli).
-- Ejecutar UNA vez en el editor SQL de Supabase.
--
-- Se usa una función SECURITY DEFINER en lugar de dar UPDATE directo sobre
-- businesses: así los visitantes anónimos pueden sumar el contador SIN poder
-- tocar ningún otro campo de la tabla. La app la llama con:
--   supabase.rpc('increment_business_view', { bid })

-- Asegura la columna (por si el proyecto aún no la tuviera).
alter table public.businesses
  add column if not exists view_count integer not null default 0;

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

-- Permite invocarla a visitantes anónimos y a usuarios autenticados.
grant execute on function public.increment_business_view(uuid) to anon, authenticated;
