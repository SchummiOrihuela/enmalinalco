-- Fase 2: registro de EVENTOS con timestamp, origen (ref) y geografía aproximada.
-- Desbloquea: serie de tiempo, mapa de calor día×hora, atribución a historias/
-- eventos y origen geográfico. Los contadores de businesses SIGUEN funcionando
-- (no se tocan): events es la capa fina para los insights de detalle.
--
-- Privacidad: NO guardamos IP ni nada personal. Solo país/región aproximada que
-- ya nos da el edge de Vercel por cabeceras. Ejecutar UNA vez en Supabase.

-- 1) Tabla de eventos (append-only).
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  business_id uuid not null references public.businesses(id) on delete cascade,
  kind        text not null,            -- view | whatsapp | phone | maps | instagram | facebook | share
  ref         text,                     -- origen: historia:<slug> / evento:<slug> / categoria / buscador
  country     text,                     -- geo aproximada (cabecera edge), sin PII
  region      text,
  created_at  timestamptz not null default now()
);

create index if not exists events_business_created_idx on public.events (business_id, created_at desc);
create index if not exists events_business_kind_idx    on public.events (business_id, kind, created_at desc);

-- 2) RLS: el dueño SOLO lee los eventos de SU negocio. Nadie inserta directo:
--    las inserciones pasan por las funciones SECURITY DEFINER de abajo.
alter table public.events enable row level security;

drop policy if exists events_owner_select on public.events;
create policy events_owner_select on public.events
  for select
  using (
    business_id in (select id from public.businesses where owner_id = auth.uid())
  );

-- 3) Registrar una VISTA: suma el contador (como hoy) y además deja el evento.
--    Reemplaza la versión de solo-contador por una que también audita.
create or replace function public.track_view(
  bid uuid, p_ref text default null, p_country text default null, p_region text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.businesses
     set view_count = coalesce(view_count, 0) + 1
   where id = bid and is_active = true;
  if found then
    insert into public.events (business_id, kind, ref, country, region)
    values (bid, 'view', nullif(p_ref, ''), nullif(p_country, ''), nullif(p_region, ''));
  end if;
end;
$$;

grant execute on function public.track_view(uuid, text, text, text) to anon, authenticated;

-- 4) Registrar un CONTACTO: suma el contador del tipo y deja el evento.
create or replace function public.track_contact(
  bid uuid, p_kind text, p_ref text default null, p_country text default null, p_region text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind not in ('whatsapp', 'phone', 'maps', 'instagram', 'facebook', 'share') then
    return;
  end if;
  -- Los contadores existentes solo cubren estos 5 tipos (share es solo evento).
  update public.businesses
     set whatsapp_clicks  = coalesce(whatsapp_clicks, 0)  + (case when p_kind = 'whatsapp'  then 1 else 0 end),
         phone_clicks     = coalesce(phone_clicks, 0)     + (case when p_kind = 'phone'     then 1 else 0 end),
         maps_clicks      = coalesce(maps_clicks, 0)      + (case when p_kind = 'maps'      then 1 else 0 end),
         instagram_clicks = coalesce(instagram_clicks, 0) + (case when p_kind = 'instagram' then 1 else 0 end),
         facebook_clicks  = coalesce(facebook_clicks, 0)  + (case when p_kind = 'facebook'  then 1 else 0 end)
   where id = bid and is_active = true;
  if found then
    insert into public.events (business_id, kind, ref, country, region)
    values (bid, p_kind, nullif(p_ref, ''), nullif(p_country, ''), nullif(p_region, ''));
  end if;
end;
$$;

grant execute on function public.track_contact(uuid, text, text, text, text) to anon, authenticated;

-- Nota: increment_business_view / increment_business_contact siguen existiendo
-- por compatibilidad; la app nueva usa track_view / track_contact.
