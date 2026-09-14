-- Programa "Fundadores": primeros 50 negocios (cualquier plan) con 30% de
-- descuento los primeros 3 meses (el descuento lo maneja un cupón de Stripe).
-- Ejecutar en el editor SQL de Supabase. OJO: el corte duro está en la función
-- claim_founder_spot y es 52 = 50 lugares reales + 2 compras de prueba del host;
-- si cambia el cupo, actualízalo aquí Y en FOUNDERS.cupos de src/lib/plans.js.

-- 1) Columnas de estado del programa en cada negocio.
alter table public.businesses
  add column if not exists founder boolean not null default false,
  add column if not exists founder_number integer,
  add column if not exists trial_ends_at timestamptz;

-- 2) Reclamar un lugar Fundador de forma ATÓMICA (corte duro en 15).
--    Un candado a nivel de transacción serializa los intentos, así dos
--    checkouts simultáneos nunca pasan del lugar 15. Devuelve el número
--    de Fundador asignado, o NULL si ya no hay cupo.
--    Idempotente: si el negocio ya es Fundador, regresa su número.
create or replace function public.claim_founder_spot(bid uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  taken integer;
  already boolean;
  existing integer;
begin
  perform pg_advisory_xact_lock(918273645);

  select founder, founder_number into already, existing
    from public.businesses where id = bid;

  if already then
    return existing;
  end if;

  select count(*) into taken from public.businesses where founder = true;
  if taken >= 52 then
    return null;
  end if;

  update public.businesses
     set founder = true, founder_number = taken + 1
   where id = bid;

  return taken + 1;
end;
$$;

-- 3) Cuántos lugares Fundador se han tomado (para calcular los restantes).
create or replace function public.founders_taken()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::int from public.businesses where founder = true;
$$;

-- Permisos: reclamar solo desde el backend (service_role, vía webhook).
-- Consultar el total sí puede el usuario autenticado (para su pantalla de éxito).
grant execute on function public.claim_founder_spot(uuid) to service_role;
grant execute on function public.founders_taken() to service_role, authenticated;
