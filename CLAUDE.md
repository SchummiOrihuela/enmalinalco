# enmalinalco — memoria del proyecto

App Next.js 16 (App Router, React 19) de **enmalinalco.com**: directorio de negocios de
Malinalco + historias SEO (`/historias`) + panel de autogestión para negocios (`/dashboard`,
marca de inteligencia "Ojo de Jaguar"). Dueño: Schummi (Emmanuel Ignacio Orihuela).
Meta de negocio: crecer reserva directa (canteraycalma.com) y llenar los 50 cupos Fundadores.

## Pagos — IMPORTANTE
- La pasarela es **Stripe** (modo live). El botón de planes llama a `/api/stripe/checkout`.
- **Lemon Squeezy fue ELIMINADO (nov 2026)** — nunca se usó en producción. No reintroducir
  esa ruta ni sus env (`LS_VARIANT_*`, `LEMONSQUEEZY_*`). Pendiente manual: quitar esas env
  de Vercel (el conector de Vercel aquí no borra env; se hace a mano en Settings).
- Planes / precios (MXN/mes): **Malinalli $99 · Cuāuhtli $249 · Ocēlōtl $449**.
- Cupón Fundadores: **30% × 3 meses** (`STRIPE_FOUNDER_COUPON`). Cuenta Stripe `acct_1TyxbQ3OUuxyN6zA` (EnMalinalco).
- Clientes Stripe se instancian con init perezoso (`getStripe()`), no al cargar el módulo,
  para que `next build` no requiera `STRIPE_SECRET_KEY`.

## Infra y datos
- **Supabase** proyecto `gxazwahgmxqjzulylmnd` (us-west-2). Contadores en tabla `businesses`;
  tabla `events` para Fase 2. Corte mensual vía cron `/api/cron/monthly-report` (día 1, protegido
  con `CRON_SECRET`), que llama a `snapshot_monthly_views`.
- **Seguridad DB**: las funciones `SECURITY DEFINER` privilegiadas `claim_founder_spot`,
  `snapshot_monthly_views` y `rls_auto_enable` tienen `EXECUTE` revocado a `anon`/`authenticated`
  (solo `service_role`). NO volver a exponerlas. Las de tracking público
  (`track_view`, `increment_business_view`, `founders_taken`, etc.) sí son públicas a propósito.
- **GA4** property `553976108`. **Search Console** `sc-domain:enmalinalco.com`.
- Datos frescos se traen vía **Composio** (apps conectadas: google_analytics, google_search_console).

## Dashboard Mensual (artefacto Claude)
- Artefacto "enmalinalco . Dash Mensual", slug `aafdfa81-d09d-48d6-8ccf-f58cb62d76c9`.
- Tablero HTML de métricas: GA4 + Search Console + capa de negocio (Supabase/Stripe).
- Para refrescarlo: traer datos con Composio (GA4 RUN_REPORT/BATCH, Search Console
  SEARCH_ANALYTICS_QUERY) + Supabase, y editar los arrays de datos del artefacto.

## Flujo de desarrollo
- Rama de desarrollo: `claude/beautiful-galileo-raa23b`. PRs en draft contra `main`.
- Verificación: `npm run build` (necesita env; con dummies basta para validar) y `npx eslint`.
- `eslint-config-next` 16.4.x activa `react-hooks/purity`; `Date.now()` en handlers/cargadores
  async son falsos positivos y van con `// eslint-disable-next-line react-hooks/purity`.

## Recomendaciones SEO ya ejecutadas (no repetir)
- Re-título de `balnearios-malinalco` y `como-llegar-malinalco` + enlaces internos a historias
  de diciembre (PR #68, nov 2026). Medir su CTR en diciembre; no re-titular de nuevo.
- Oportunidades SEO aún sin trabajar: `zona-arqueologica`, `chalma-desde-malinalco`
  (problema de posición ~12, necesita enlaces internos, no re-título).
