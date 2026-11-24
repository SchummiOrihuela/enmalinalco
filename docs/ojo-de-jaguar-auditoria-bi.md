# Ojo de Jaguar — Auditoría BI y hoja de ruta

> Auditoría técnica de toda la inteligencia detrás de enmalinalco.com.
> Fecha: 24 nov 2026. Cruza el código real (`src/lib/insights.js`,
> `InsightsDrawer.js`, `events.sql`, `track_*`, `monthly-report`) con los datos
> vivos de Supabase. Complementa `docs/metricas-y-recomendaciones.md` (el plan) y
> `docs/estrategia-reels-y-crecimiento.md` (el marketing). Esto es el *estado real
> del motor* + qué está a medias + qué añadir que es simple y nadie ha visto.

---

## 0. Veredicto en 30 segundos

Tienes un motor BI **sorprendentemente bueno para una etapa tan temprana**: salud
de ficha, tasa de contacto, ranking, ROI, un catálogo de ~60 recomendaciones
personalizadas por red, una "lectura del consultor" narrativa, alertas, metas y
toda la Fase 2 (tendencia, heatmap, geo, atribución) ya **codificada y con datos
reales entrando** (79 eventos de vista con origen y geografía).

Pero hay tres verdades:

1. **La métrica más vendedora de todo el producto está apagada en el panel.** El
   cálculo de ROI ("tu mensualidad sale regalada, 11× de retorno") **se calcula pero
   NUNCA se muestra** en Ojo de Jaguar. Solo aparece en el correo mensual. Es tu
   cierre de venta, ya programado, invisible para el dueño. *(§2.A)*
2. **Tu única clienta de pago externa (Dr. Gallardo, Malinalli) no ve NADA de la
   inteligencia.** Todo el layer de consultor está gateado a Cuāuhtli+ y la Fase 2 a
   Ocēlōtl — mientras los datos ya existen y se desperdician. *(§2.B)*
3. **Te falta la jugada que Google jamás podrá copiar y que ya puedes construir
   hoy con los datos que tienes: el pulso de demanda del pueblo entero.** *(§3.1)*

---

## 1. Mapa del poder BI actual (lo que YA hace)

### 1.1 Capa de datos
| Pieza | Qué es | Estado |
|---|---|---|
| Contadores en `businesses` | `view_count`, `*_clicks` (wa/phone/maps/ig/fb) + corte `_last_month` | ✅ vivo |
| Tabla `events` (append-only) | `kind, ref, country, region, created_at` por interacción | ✅ **79 eventos reales** (todos `view`), 46 con `ref`, 79 con geo |
| `track_view` / `track_contact` (SECURITY DEFINER) | suman contador **y** registran evento con origen + geo (cabeceras edge de Vercel, sin PII) | ✅ vistas entrando; contactos esperan volumen |
| `TrackedLink.js` | dispara el beacon a `/api/track-contact` con `ref` de la página de origen | ✅ cableado |
| `snapshot_monthly_views` | corte mensual de todos los contadores | ⚠️ doble agendado (§2.G) |

### 1.2 Capa de inteligencia (`src/lib/insights.js` — funciones puras)
- **Salud de ficha (0–100):** fotos, descripción, WhatsApp, mapa, dirección, horarios, IG, FB — ponderado por lo que convierte.
- **Tasa de contacto:** (wa+tel+maps)/vistas.
- **Ranking en categoría:** posición por vistas entre pares activos.
- **ROI / "mensualidad regalada":** contactos × cierre × ticket ÷ precio del plan. Tickets y cierres sugeridos por giro.
- **Catálogo de recomendaciones (~60):** IG (25), FB (24), WhatsApp (24), ficha y contenido; cada una con `test(ctx)` que decide si aplica al caso real → se sienten personales.
- **Lectura del Consultor:** párrafo narrativo basado en reglas (pulso del mes → cuello de botella → posición → cierre).
- **Alertas proactivas:** caídas de IG/FB/WA, sin WhatsApp, baja conversión, ficha a medias.
- **Meta del mes:** progreso de contactos vs meta del dueño (editable).
- **Fase 2:** `serieTiempo`, `heatmap` (día×hora + mejor franja), `atribucion` (historia/evento → vistas/contactos), `origenGeografico`.

### 1.3 Capa de presentación (`InsightsDrawer.js`)
Drawer premium con: alertas, lectura del consultor, 3 acciones de la semana, KPIs,
meta con barra, recomendaciones por red (con tabs), Fase 2, upsell por tier, "La
ventaja del Jaguar" (vs Google) y **exportación a PDF + imagen PNG compartible**.

### 1.4 Reparto por tier (hoy)
- **Malinalli (1):** salud, tasa, vistas y **1** acción. *(nada de consultor)*
- **Cuāuhtli (2):** + lectura IA, ranking, Top 3 recos/red, alertas, meta, comparativa de categoría.
- **Ocēlōtl (3):** + Fase 2 completa + exportar + correo mensual.

---

## 2. Lo que está A MEDIAS (subir la barra)

### 2.A 🔴 El ROI ("tu mensualidad sale regalada") está APAGADO en el panel
**El hallazgo más importante.** `roiEstimado()` se calcula en `dashboard/page.js` y
viaja dentro de `insights.roi`, **pero `InsightsDrawer.js` nunca lo lee ni lo
muestra** (no está en el destructure de la línea ~315; ni el PDF ni la imagen PNG lo
incluyen). Solo se usa en el **correo mensual** (`monthly-report`), que únicamente
reciben los Ocēlōtl... de los cuales el único es tu propio negocio.

> Resultado: el argumento que tu propio `docs/metricas-y-recomendaciones.md` llama
> *"el cierre de venta"* y *"la sola métrica que justifica la mensualidad"* **no lo
> ve ningún cliente dentro de la app.**

**Subir la barra (muy simple, ~1 hora):** renderizar en el drawer una tarjeta
"Tu mensualidad, en perspectiva" para Cuāuhtli+:
> "Este mes: **32 contactos**. Si cierras **1 de cada 4** con ticket de **$350**, son
> **~$2,800 potenciales**. Tu plan cuesta **$249** → **11× de retorno.**"
Con nota de transparencia (estimado, supuestos ajustables). Es tu marca: enseñar.

### 2.B 🟠 La inteligencia está gateada donde NO hay clientes y los datos se desperdician
Hoy la Fase 2 solo la ve Ocēlōtl (tier 3), que es solo tu negocio. Dr. Gallardo
(Malinalli) **no ve ni lectura, ni ranking, ni tendencia** — y ya hay 79 eventos
reales con geo y origen esperando ser mostrados.

**Subir la barra:**
- Dale a **Malinalli** una probada real (no bloqueo seco): su tendencia de vistas +
  "de dónde vienen" con **datos reales**, y un teaser honesto del resto. Que pruebe
  el sabor antes de comprar el plato.
- Sube **tendencia + ¿de dónde vienen?** a **Cuāuhtli** (ya pagan inteligencia).
- Deja exclusivo de **Ocēlōtl** lo premium: atribución completa, heatmap, export,
  consultor humano y correo. Sigue habiendo escalera, pero cada peldaño "wow".

### 2.C 🟠 Solo reportas una vez al mes (demasiado lento)
`monthly-report` manda un correo el día 1. Para un negocio chico, un mes es una
eternidad y la retención vive del hábito. Toda la lógica (`insights.js`, plantillas)
ya existe.
**Subir la barra:** un **pulso semanal** ligero por correo o **WhatsApp**: *1 número
+ 1 acción*. "Esta semana 48 te vieron (+12%). Acción: sube 1 reel del atardecer."
4× los puntos de contacto con casi cero costo marginal.

### 2.D 🟡 "¿De dónde vienen?" muestra códigos crudos
`track_*` guarda `x-vercel-ip-country-region` (o la ciudad como respaldo): llegan
como `CMX`, `MEX`, `MOR`… y el panel los pinta tal cual. Es justo el dato que
vendes ("tu turista es de CDMX").
**Subir la barra:** un diccionario de ~32 estados MX → nombre bonito (CDMX, Edomex,
Morelos, Toluca…) aplicado en `origenGeografico`. 20 líneas, gran diferencia percibida.

### 2.E 🟡 El ranking premia antigüedad, no desempeño
`rankingCategoria` ordena por `view_count` **acumulado histórico**: un negocio viejo
siempre va arriba aunque este mes no mueva nada, y uno nuevo nunca alcanza. No es
"ganable" → mata la gamificación.
**Subir la barra:** rankear por **vistas del mes** (`view_count − views_last_month`) o
por contactos del mes. Se vuelve una carrera mensual, reseteable y adictiva.

### 2.F 🟡 "IA + datos" es, hoy, reglas
La "lectura del consultor" es rule-based (confiable y honesta), pero la insignia dice
"✨ IA + DATOS". No es mentira grave, pero puedes **ganártela de verdad**.
**Subir la barra:** para Ocēlōtl, 1 llamada a un LLM al mes que lea los números y
escriba la lectura (con los mismos datos). Profundiza el insight y hace real la marca
que ya estás promoviendo en los reels. Costo: centavos por negocio/mes.

### 2.G 🟢 Doble agendado del corte mensual
`monthly_views_snapshot.sql` programa `pg_cron` el día 1 **y** el route
`monthly-report` (Vercel Cron) también llama `snapshot_monthly_views` el día 1. Si
ambos están activos, el corte corre dos veces.
**Subir la barra:** deja **una** fuente de verdad del corte (recomendado: el route,
que además manda correos) y desactiva el `pg_cron` duplicado. Evita que el "▲ vs mes
pasado" se reinicie raro.

---

## 3. Lo SIMPLE que probablemente no has visto (novel, alto apalancamiento)

Todo lo de abajo se construye con **datos que YA tienes** (eventos con timestamp,
`ref` y geo; contadores; pares de categoría). Ordenado por "wow ÷ esfuerzo".

### 3.1 ⭐⭐⭐ "El Pulso de Malinalco" — índice de demanda del pueblo
**La jugada que Google no puede copiar y que resuelve el arranque en frío.**
Tú eres dueño del dato de **todos** los negocios. Agrega los eventos de todo el
directorio en una señal semanal del pueblo:
> "🐆 Esta semana Malinalco recibió **1,240 visitas** en el directorio (**+18%** vs la
> semana pasada). Pico: **domingo 6–8 pm**. Categoría más buscada: **Restaurantes**."

Cada negocio lo ve en su panel. Beneficios:
- **Único e imposible de copiar:** Google nunca ve la demanda del pueblo unificada.
- **Arregla el dashboard vacío:** un negocio nuevo con 0 datos **igual ve el pulso
  del pueblo** → "así de grande es el pastel; consigue tu parte."
- Conecta con tu calendario de contenido (Trail, Posadas) y con la venta de reserva
  directa. Es, literalmente, un **pronóstico del clima turístico** de Malinalco.

Técnicamente: una consulta agregada sobre `events` (sin filtrar por negocio) +
comparación semana vs semana. Cacheable. **Un solo query.**

### 3.2 ⭐⭐ "Lo que dejaste sobre la mesa" (encuadre de pérdida)
El inverso del ROI. La gente actúa más por evitar pérdidas que por ganar:
> "Este mes **112 personas** vieron tu ficha y **no te escribieron**. Si cerraras 1 de
> cada 4 (ticket $350), son **~$9,800** que se fueron con otro. Arregla tu foto y
> precio y recupéralos."
Trivial con los números actuales. Pega durísimo y empuja a actuar / subir de plan.

### 3.3 ⭐⭐ Badge compartible para TODOS los tiers (bucle viral)
Hoy la imagen PNG ("soy #1 en Malinalco 🐆") es solo Ocēlōtl. Cada vez que un negocio
comparte su tarjeta a SU Instagram, es **publicidad gratis de enmalinalco** + prueba
social. Dale a cada tier una tarjeta compartible ("Nuevo en el directorio del
pueblo", "Top 3 en Restaurantes", "Salud de ficha 100/100"). Tus clientes se vuelven
tu distribución. Ya tienes el generador de canvas; solo hay que liberar variantes.

### 3.4 ⭐⭐ "Gap al #1" en el ranking
Muestras "#2 de 8" pero no la distancia. Añade:
> "Te faltan **14 vistas** para alcanzar el #1 de Restaurantes este mes."
Convierte el ranking en una meta concreta y ganable → motor de upgrades. Trivial.

### 3.5 ⭐⭐ Tasa de conversión vs. tu categoría (no solo vistas)
Hoy comparas **vistas** vs el promedio del pueblo. Lo más útil es comparar
**conversión**:
> "Conviertes al **3%**; el promedio de Restaurantes del pueblo convierte **7%**. No es
> tu alcance, es tu ficha."
Ya tienes los pares de categoría; solo calcula también su tasa de contacto.

### 3.6 ⭐ Pronóstico por evento/temporada (usa tu propio contenido)
Sabes que viene el **Trail (19 dic)** y las **Posadas (16–24 dic)**. Empuja algo
proactivo y específico por negocio:
> "📅 En 25 días es el Trail Nocturno. El año pasado los cafés subieron **+120%** ese
> fin. ¿Te sumamos a la historia? Mándame 3 fotos."
Une BI → tu motor de contenido → upsell. Y la atribución lo comprueba después.

### 3.7 ⭐ "Racha" / momentum
Semanas consecutivas de crecimiento de vistas. "🔥 Llevas 3 semanas creciendo." Barato
(desde `events`) y adictivo; sube la frecuencia de visita al panel.

### 3.8 ⭐ Acción de 1 toque desde cada recomendación
Cada reco es texto. Agrega un botón: **"Pídenos la mención"** / **"Agenda 15 min con
tu consultor"** → abre WhatsApp contigo con mensaje pre-llenado. Convierte el insight
en una acción agendada (y en un punto de venta tuyo).

---

## 4. Priorización (impacto ÷ esfuerzo)

**Haz YA (horas, impacto directo en venta/retención):**
1. **Mostrar el ROI en el panel** (§2.A) — es desbloquear tu cierre de venta ya escrito.
2. **"El Pulso de Malinalco"** (§3.1) — tu moat + arreglo del dashboard vacío.
3. **Dar inteligencia real a Malinalli + bajar Fase 2 a Cuāuhtli** (§2.B) — monetiza los datos que ya entran.
4. **Nombres de estados bonitos** (§2.D) y **gap al #1** (§3.4) — pulido de alto retorno.

**Esta/próxima semana (medio esfuerzo):**
5. **"Lo que dejaste en la mesa"** (§3.2) y **conversión vs categoría** (§3.5).
6. **Pulso semanal por WhatsApp/correo** (§2.C).
7. **Badge compartible para todos** (§3.3) — bucle viral.
8. **Ranking por desempeño del mes** (§2.E).

**Cuando quieras profundizar:**
9. **Lectura con LLM real para Ocēlōtl** (§2.F) — gana la insignia "IA".
10. **Consolidar el corte mensual** (§2.G) — higiene.
11. **Pronóstico por evento** (§3.6), **racha** (§3.7), **acción de 1 toque** (§3.8).

---

## 5. Notas de rigor (tu BI siendo honesto contigo)
- **Contactos aún no generan eventos en la práctica:** hay 79 eventos, todos `view`.
  El cableado (`track_contact` ← `TrackedLink`) está correcto; es que casi no ha
  habido contactos reales (4 WhatsApp en total, previos a la migración de eventos).
  No es bug: es pre-tracción. En cuanto lleguen contactos, la atribución de
  *contactos* (no solo vistas) cobra vida sola.
- **Geo = aproximada y sin PII** (bien, mantenlo así; es confianza).
- **La ética de "no vender humo" está muy bien cuidada** (todo "estimado/potencial",
  defaults conservadores, se muestra el cálculo). No la pierdas al añadir el ROI al panel.

---

### Cierre
No te falta "más BI". Te falta **encender lo que ya tienes** (el ROI invisible),
**repartirlo donde sí hay clientes** (Malinalli/Cuāuhtli) y **jugar la única carta que
Google no tiene: el pulso del pueblo entero**. Con eso, Ojo de Jaguar deja de ser "un
panel bonito" y se vuelve el cerebro de Malinalco — contado por su anfitrión.
