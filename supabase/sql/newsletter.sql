-- Lista de suscriptores del newsletter "El finde ideal en Malinalco".
-- Audiencia PROPIA: el activo que no depende de ads ni del algoritmo.
--
-- La escritura va por /api/subscribe con la service role (upsert por email),
-- así que NO exponemos la tabla a escritura anónima: RLS activo y sin políticas
-- públicas (solo la service role, que las omite, puede leer/escribir).
--
-- Ejecutar UNA vez en el editor SQL de Supabase.

create table if not exists public.newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  source       text,                         -- de dónde se suscribió (historias, mapa, directorio…)
  unsubscribed boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Búsqueda rápida por email.
create index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers (lower(email));

-- RLS activo, sin políticas: nadie anónimo lee ni escribe; la app usa la
-- service role (que omite RLS) desde /api/subscribe.
alter table public.newsletter_subscribers enable row level security;
