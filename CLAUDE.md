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
- `malinalco_pulse()` (nov 2026): `SECURITY DEFINER` pública a `anon`/`authenticated` PERO
  solo devuelve **agregados del pueblo** (nunca datos de un negocio). Alimenta "El Pulso de Malinalco".
- **GA4** property `553976108`. **Search Console** `sc-domain:enmalinalco.com`.
- Datos frescos se traen vía **Composio** (apps conectadas: google_analytics, google_search_console).

## Ojo de Jaguar — inteligencia (panel)
- Motor BI en `src/lib/insights.js` (funciones puras): salud de ficha, tasa de contacto,
  ranking, ROI, catálogo de ~60 recomendaciones por red con `test(ctx)`, lectura del
  consultor (reglas), alertas, meta del mes, y agregadores Fase 2 (serie, heatmap, atribución, geo).
- UI en `src/app/dashboard/InsightsDrawer.js`; se arma en `dashboard/page.js`.
- **ROI visible (nov 2026):** `roiEstimado` ya se renderiza en el panel (tarjeta "Tu
  mensualidad, en perspectiva", Cuāuhtli+ cuando hay contactos del mes) y en el PDF export.
  Antes se calculaba pero no se mostraba (solo salía en el correo mensual).
- **Oportunidad perdida (nov 2026):** `oportunidadPerdida()` en `insights.js` + tarjeta
  "Lo que se quedó en la mesa" (Cuāuhtli+). Encuadre de pérdida honesto y conservador
  (captura 1 de cada 10, piso de 10 visitas); también en el PDF export. No está en el correo aún.
- **El Pulso de Malinalco (nov 2026):** `src/app/dashboard/MalinalcoPulse.js` + rpc
  `malinalco_pulse()`. Índice de demanda del pueblo (cross-negocio), lo ven TODOS los tiers;
  arregla el "panel vacío" del arranque en frío. Hora en zona `America/Mexico_City`.
- Reparto por tier (nov 2026, **Fase 2 escalonada**): Malinalli (salud, tasa, vistas, Pulso
  **+ Tendencia** de Fase 2 como probada real); Cuāuhtli (+ consultor IA, ranking, ROI,
  oportunidad perdida, recos/red, alertas, meta, comparativa **+ heatmap "¿a qué hora?" y geo
  "¿de dónde vienen?"**); Ocēlōtl (+ **atribución** historias/eventos [la joya], export, correo).
  `fase2` se computa para TODOS los tiers en `page.js`; el drawer filtra las secciones por `tier`.
- **Export premium + Badge viral (nov 2026):** el PDF (`exportarReporte`, Ocēlōtl) ahora es
  COMPLETO (consultor, alertas, acciones, KPIs, ROI, oportunidad, meta, recos por red, Fase 2).
  El **badge compartible** (`compartirBadge`/`dibujarBadge`, TODOS los tiers) es un sello 4:5 @2×
  con **rangos élite** (`rangoBadge`): N.º 1 / Top 3 / Top 5 / Top 10 / "Entre los mejores" /
  "Recomendado" — NUNCA el número crudo (#7). Ranking existe desde Cuāuhtli; Malinalli luce
  "Recomendado/verificado". Botón "Compartir mi distinción" usa `navigator.share` (menú nativo)
  con descarga PNG de respaldo. El nivel de plan NO se imprime en el badge (es privado).
- **Ranking por desempeño del mes (nov 2026):** `rankingCategoria` ordena por vistas ganadas
  este mes (`view_count − views_last_month`), con histórico como desempate. Carrera ganable,
  no premia antigüedad. `page.js` trae `views_last_month` de los pares.
- **Nombres de lugar elegantes (nov 2026):** `lugarBonito()` mapea códigos crudos
  (CMX→Ciudad de México, MEX→Estado de México, MOR→Morelos, MX→México…) en `origenGeografico`.
- **Copy de tiers elevado** en `src/lib/plans.js` (nov 2026) a lenguaje de resultado/premium.
  OJO: el landing (`src/app/page.js`) tiene su copy de planes **hardcodeado aparte** (no importa
  `PLANS`); sincronizarlo es pendiente si se cambian beneficios de nuevo.

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

## Documentos de estrategia (en `docs/`)
- `metricas-y-recomendaciones.md` — hoja de ruta del producto/BI (Fase 0/1/2).
- `estrategia-reels-y-crecimiento.md` — marketing: reels, pauta $250, venta de Ojo de Jaguar, tiers.
- `ojo-de-jaguar-auditoria-bi.md` — auditoría del motor BI + ideas (ROI visible, Pulso, etc.).

## Recomendaciones SEO ya ejecutadas (no repetir)
- Re-título de `balnearios-malinalco` y `como-llegar-malinalco` + enlaces internos a historias
  de diciembre (PR #68, nov 2026). Medir su CTR en diciembre; no re-titular de nuevo.
- Oportunidades SEO aún sin trabajar: `zona-arqueologica`, `chalma-desde-malinalco`
  (problema de posición ~12, necesita enlaces internos, no re-título).
