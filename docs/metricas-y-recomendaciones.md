# Métricas y Recomendaciones de Valor — En Malinalco

> Análisis estratégico: qué datos adicionales podemos entregar al cliente para que
> su mensualidad se perciba "regalada" frente al número de clientes que le llegan,
> y por qué eso es imposible de replicar con un simple Google Maps.
>
> _Documento de producto/consultoría. No toca código de la app; es la hoja de ruta._

---

## 0. Punto de partida: qué medimos hoy

Todo vive como **contadores acumulados** en la tabla `businesses`:

| Métrica | Columna | Corte mensual |
|---|---|---|
| Vistas de ficha | `view_count` | `views_last_month` |
| Contactos WhatsApp | `whatsapp_clicks` | `whatsapp_clicks_last_month` |
| Llamadas | `phone_clicks` | `phone_clicks_last_month` |
| "Cómo llegar" / mapa | `maps_clicks` | `maps_clicks_last_month` |
| Clics a Instagram | `instagram_clicks` | `instagram_clicks_last_month` |
| Clics a Facebook | `facebook_clicks` | `facebook_clicks_last_month` |

Más: comparativa de **vistas vs. promedio de la categoría** (Cuāuhtli+) y el
**reporte mensual por correo** (Ocēlōtl, `api/cron/monthly-report`).

**La limitación que define todo lo demás:** son *contadores*, no *eventos*. No
guardamos **cuándo** ocurrió cada clic, **de dónde** vino (referrer/geo) ni la
sesión. Por eso el análisis separa las ideas en tres niveles de esfuerzo:

- **Nivel 0** — se calcula **ya**, con los datos de hoy. Cero infraestructura.
- **Nivel 1** — necesita una tabla de **eventos** (`events`) con timestamp, tipo,
  referrer y geo. Es el desbloqueo más rentable del proyecto (ver §7).
- **Nivel 2** — integra **APIs externas** (Instagram/Facebook Graph, WhatsApp,
  Google Business Profile). Mayor valor percibido, mayor costo de mantenimiento.

---

## 1. La tesis: por qué NO somos Google Maps

Google Maps le da al negocio: vistas, búsquedas, llamadas, solicitudes de ruta,
clics al sitio y vistas de fotos — **pero solo lo que pasa dentro de Google, y
comparado contra una vertical genérica y nacional.**

Nuestra ventaja no es "medir lo mismo más bonito". Son **cuatro cosas que Google
estructuralmente no puede dar**, y que son el guion de venta:

1. **Consolidación de canales.** Google no ve tu Instagram, tu Facebook ni tu
   WhatsApp. Nosotros unimos **vistas + WhatsApp + llamada + ruta + IG + FB** en
   un **solo embudo** y un **solo número**. El dueño deja de tener 5 tableros
   sueltos y tiene **uno**.
2. **Hiperlocal real.** No te comparamos contra "restaurantes de México".
   Te comparamos contra **los otros 8 restaurantes de Malinalco**. Esa es la
   competencia que al dueño sí le quita el sueño.
3. **Tráfico de contenido propio.** El tráfico que mandamos nace de **nuestras
   historias y eventos** (el artículo editorial, el trail nocturno, las posadas).
   Podemos atribuir "esta historia te trajo N clientes". Google **nunca** puede,
   porque ese tráfico no es suyo (§4).
4. **Traducción a dinero.** Convertimos contactos en **pesos potenciales** y
   contra eso ponemos la mensualidad. Google te da números; nosotros te damos el
   **ROI** (§5).

Regla de oro del reporte: **cada número viene con una frase de qué hacer.** Dato
sin recomendación es Google Maps. Dato + recomendación + comparativa local +
pesos somos nosotros.

---

## 2. Métricas Nivel 0 — se entregan YA (sin tocar infraestructura)

Todas se derivan de los contadores actuales. Alto impacto, costo casi nulo.

### 2.1 Tasa de contacto (conversión de ficha)
`tasa = (whatsapp + phone + maps) / view_count`

El número más honesto del negocio: **de cada 100 que te ven, cuántos te buscan.**
Google no lo entrega limpio por ficha. Da pie a recomendación directa:
> "Te ven mucho pero te contactan poco (3%). Suele ser la **primera foto** o que
> **falta el precio**. En tu categoría, el promedio contacta al 7%."

### 2.2 El embudo en una imagen
`Descubrimiento (vistas) → Interés (IG/FB) → Intención (WhatsApp/llamada/ruta)`

Un embudo de 3 escalones por ficha. Señala **dónde se cae la gente**: muchas
vistas y poco WhatsApp = problema de ficha; pocas vistas = problema de alcance
(ahí entran las recomendaciones de redes).

### 2.3 Ranking dentro de la categoría (gamificación)
"Eres **#2 de 8** en Restaurantes de Malinalco este mes." Ya tenemos el promedio
por categoría (`monthly-report` y `dashboard`); calcular la **posición** es trivial.
Es adictivo y es el mejor argumento para subir de plan (prioridad = subir en el ranking).

### 2.4 Índice de salud de ficha (0–100)
Score por completitud: fotos (vs. máximo del plan), horarios, dirección, las 3
redes, descripción, reseñas. Acompañado del hecho:
> "Las fichas 100% completas reciben **~3x más contactos**. Te falta: 2 fotos y tu
> Facebook. **Completarlo te toma 4 minutos.**"

Métrica recurrente, accionable y que empuja al dueño a usar el panel cada mes.

### 2.5 Mezcla de contacto (dónde te buscan)
Reparto % entre WhatsApp / llamada / ruta / IG / FB. Revela el canal preferido de
*sus* clientes:
> "El **68% te contacta por WhatsApp**. Pon tu WhatsApp primero y responde en
> menos de 1 hora: es tu canal de venta."

### 2.6 Valor económico estimado y ROI (el cierre de venta)
Ver §5 — es la métrica que responde literal a "que su mensualidad le salga regalada".

---

## 3. Métricas Nivel 1 — requieren tabla de `events` (§7)

Con un registro de eventos (timestamp + tipo + referrer + geo) se desbloquea la
"carnita" que ni Google da hiperlocal:

### 3.1 Tendencia real (serie de tiempo)
Gráfica de vistas/contactos por día o semana, no solo "total vs. mes pasado".
Deja ver rachas, el efecto de una promo, la caída tras un puente.

### 3.2 Mapa de calor día × hora
"Te buscan sobre todo **jueves a domingo, 6–9 pm**." → recomendación:
> "Publica tu promo **jueves temprano** y ten personal de más el domingo."

Google da "horas populares" de la categoría; nosotros, de **tu ficha**.

### 3.3 Origen geográfico de la demanda (vía IP)
"El **60% de quienes te ven vienen de CDMX**, 22% de Toluca." Oro puro para
decidir dónde pautar y qué historia contar. Encaja con tu realidad: el turista de
Malinalco es, en gran parte, de CDMX/Edomex.

### 3.4 Términos y rutas de descubrimiento
Qué categoría/búsqueda interna los llevó a la ficha y con qué CTR:
> "Apareciste en **40 búsquedas de 'dónde comer'** y te eligieron 12 veces
> (CTR 30%, arriba del 18% de tu categoría)."

### 3.5 Atribución a historias y eventos — **la joya** (§4)
El "match de una historia/evento" que pediste. Requiere referrer en eventos.

### 3.6 Compartidos y viralidad
"Comparte tu ficha por WhatsApp" ya existe; contar el **share** y el tráfico que
regresa de ese link mide el boca-a-boca que hoy es invisible.

---

## 4. La joya: atribución a historias y eventos

Pediste explícitamente "hacer un match de alguna historia que contamos, algún
evento que pasó". **Este es el diferenciador que ningún competidor puede copiar**,
porque el tráfico nace de *nuestro* contenido (`historias/`, `eventos`, SEO de
temporada como "posadas/navidad/trail").

### Cómo funciona
1. Todo enlace desde una historia o evento hacia una ficha lleva una marca de
   origen (p. ej. `?ref=historia:dia-de-muertos` o `?ref=evento:trail-nocturno`).
   Ya existe `TrackedLink` / `track-contact`: se extiende para guardar ese `ref`.
2. Cada vista/contacto con `ref` se registra en `events`.
3. El reporte cruza el pico de tráfico con el contenido publicado.

### Qué ve el cliente (ejemplos)
> "📖 La historia **'Día de Muertos en Malinalco'** que publicamos el 28 de oct te
> trajo **48 vistas y 9 contactos** en 3 días. Las fichas mencionadas en historias
> reciben **+40% de contactos** esa semana."

> "🎟️ El **Trail Nocturno** (nov 8) disparó las vistas de los cafés **+120%** el
> fin de semana. Prepárate para el **próximo evento: Posadas (dic 16–24)** —
> podemos mencionarte."

### Por qué vende
- Prueba, con número, que **lo que hacemos por el pueblo le llega a su caja.**
- Convierte el contenido editorial (que ya producimos) en un **activo medible**
  y en el gancho perfecto para vender Cuāuhtli (mención en redes) y Ocēlōtl
  (artículo propio).
- Crea un **calendario de demanda** de Malinalco (Semana Santa, Día de Muertos,
  puentes, posadas, trail) que se vuelve consejo proactivo:
  > "Viene Semana Santa, tu temporada fuerte. Sube fotos nuevas y una promo antes
  > del **15 de marzo**."

---

## 5. Calculadora de valor: "tu mensualidad sale regalada"

Responde directo a tu objetivo. Convierte contactos en pesos y los pone contra la
mensualidad. Se arma con datos Nivel 0.

**Insumos** (configurables por el dueño, con valores sugeridos por categoría):
- `ticket` = ticket promedio del negocio (lo captura una vez en el panel).
- `cierre` = % de contactos que se vuelven venta (default conservador por giro,
  p. ej. 20–30% en restaurantes, 10–15% en hospedaje).

**Fórmula**
```
contactos_mes      = whatsapp_mes + phone_mes + maps_mes
ventas_estimadas   = contactos_mes * cierre
ingreso_potencial  = ventas_estimadas * ticket
retorno            = ingreso_potencial / precio_del_plan
```

**Cómo se lee en el reporte**
> "Este mes te generamos **32 contactos**. Si cierras **1 de cada 4** con un ticket
> de **$350**, son **~$2,800 potenciales**. Tu plan Cuāuhtli cuesta **$249**:
> **11× de retorno**. Y esto **sin contar** llamadas ni quienes llegaron sin avisar."

**Reglas de credibilidad** (no vender humo):
- Siempre "estimado / potencial", nunca "ganaste".
- Defaults de cierre conservadores; el dueño los puede ajustar.
- Mostrar el cálculo (transparencia = confianza; es tu marca: enseñar y servir).

Esta sola métrica justifica la mensualidad mejor que todas las vistas juntas.

---

## 6. Motor de recomendaciones (la "carnita" accionable)

### 6.1 Cómo funciona
Reglas **si-entonces** sobre las métricas. Cada mes el reporte dispara 2–4
recomendaciones priorizadas según *lo que le está pasando a ESA ficha* (no genéricas):

| Disparador (métrica) | Recomendación |
|---|---|
| `instagram_clicks` cae vs. mes pasado | "Tus clics a IG bajaron 40%. Sube **1 reel esta semana**: mejor formato de alcance hoy." |
| Vistas altas, contactos bajos | "Te ven pero no te buscan. Cambia la **foto principal** y agrega **precios** a la descripción." |
| Ruta/maps alto, WhatsApp bajo | "Muchos piden cómo llegar pero pocos escriben. Pon un **botón de WhatsApp** con '¿Hay lugar hoy?'." |
| Salud de ficha < 70 | "Completa tu ficha (te faltan 2 fotos y FB): las completas reciben **3x** contactos." |
| Pico por una historia/evento | "La historia X te funcionó. **Repliquémosla**: mándanos 3 fotos para el próximo post." |
| Fin de semana fuerte detectado | "Tu demanda es jueves–domingo. Programa tus posts el **jueves 10 am**." |

### 6.2 Librería base — 10 recomendaciones por red

Catálogo que el motor elige según la métrica. (Resumen; el set completo vive como
semilla de datos del motor.)

**Instagram (10)**
1. 1 **reel** por semana (hoy es el formato de mayor alcance orgánico).
2. **Stories diarias** con lo cotidiano del negocio (sube el alcance al perfil).
3. **Ubicación de Malinalco** etiquetada en cada post (te encuentran por lugar).
4. Primeras **2 líneas del pie** con gancho (es lo que decide el clic).
5. **Responde todos los comentarios/DMs** < 1 h (el algoritmo premia conversación).
6. **Colaboración (collab)** con @enmalinalco y otros negocios del pueblo.
7. **Highlights** fijos: Menú/Precios, Cómo llegar, Reseñas.
8. Publica en tu **mejor horario** (jueves–domingo pm según tu dato).
9. **CTA claro** en cada post: "Reserva por WhatsApp".
10. **UGC**: repostea fotos de clientes y pide que te etiqueten.

**Facebook (10)**
1. **Eventos de FB** para cada fecha fuerte de Malinalco (aparece a locales).
2. Publica en **grupos de la región** (Malinalco/Edomex/CDMX escapadas).
3. Mantén **horarios, WhatsApp y dirección** idénticos a tu ficha (coherencia = confianza).
4. Álbumes de fotos por temporada (FB aún da alcance a álbumes).
5. **Reseñas/recomendaciones** activadas y responde cada una.
6. **Botón "Enviar WhatsApp"** o "Reservar" en la página.
7. Comparte las **historias de En Malinalco** que te mencionan (doble alcance).
8. **1–2 posts/semana**, no más (FB penaliza el exceso).
9. **Fotos horizontales** y verticales para feed e historias.
10. **Responde en Messenger** rápido: el badge "muy receptivo" convierte más.

**WhatsApp (10)**
1. **WhatsApp Business** con catálogo, horarios y dirección.
2. **Mensaje de bienvenida** automático (responde aunque no estés).
3. **Respuestas rápidas** guardadas (precios, disponibilidad, menú).
4. **Estados de WhatsApp** con promos del fin (muchos los ven).
5. **Link directo `wa.me`** con texto pre-llenado: "Hola, vi tu ficha en En Malinalco".
6. **Responde < 1 h**: la velocidad es el factor #1 de cierre.
7. **Etiquetas** para separar reservas, dudas y clientes frecuentes.
8. **Confirma y recuerda** reservas por WhatsApp (baja el no-show).
9. Pide la **reseña** por WhatsApp tras la visita (sube reputación).
10. **Catálogo con precios** para que no te escriban solo a preguntar costo.

> El motor **no** vuelca las 30. Muestra las **2–4 más relevantes** al estado de la
> ficha ese mes, para que se sienta un consejo personal, no un folleto.

---

## 7. Infraestructura mínima: la tabla `events`

El desbloqueo de todo el Nivel 1. Hoy `increment_business_contact` **sobrescribe un
contador**; propuesta: **además** insertar una fila por evento.

```sql
create table public.events (
  id          bigint generated always as identity primary key,
  business_id uuid not null references public.businesses(id),
  kind        text not null,          -- view | whatsapp | phone | maps | instagram | facebook | share
  ref         text,                   -- origen: historia:slug / evento:slug / categoria / buscador
  country     text,                   -- geo aproximada por IP (no PII)
  region      text,
  created_at  timestamptz not null default now()
);
create index on public.events (business_id, created_at);
create index on public.events (business_id, kind, created_at);
```

Notas:
- Se **mantienen los contadores** actuales (el panel no se rompe); `events` es la
  capa fina para series, heatmap, geo y atribución.
- **Sin PII**: guardamos país/región aproximada, no IP ni nada personal. Importante
  para confianza y para no cargar dato sensible del visitante.
- Los agregados pesados (heatmap, series) se precalculan en el **corte mensual** que
  ya corre (`snapshot_monthly_views`), no en cada carga de panel.

---

## 8. Comparativo rápido vs. Google Maps

| Capacidad | Google Maps | En Malinalco |
|---|---|---|
| Vistas y acciones básicas | ✅ | ✅ |
| **Un solo tablero** con IG + FB + WhatsApp | ❌ | ✅ |
| Comparativa contra **tu pueblo/categoría** | ❌ (vertical nacional) | ✅ |
| **Ranking local** gamificado | ❌ | ✅ |
| **Atribución** a historias/eventos propios | ❌ (imposible) | ✅ |
| **ROI en pesos** y "mensualidad regalada" | ❌ | ✅ |
| **Recomendaciones** accionables por red | ❌ | ✅ |
| Calendario de **demanda de Malinalco** | ❌ | ✅ |
| Índice de **salud de ficha** | ❌ | ✅ |
| Trato humano / **consultor** (Ocēlōtl) | ❌ | ✅ |

---

## 9. Hoja de ruta priorizada (impacto / esfuerzo)

**Fase 1 — ya, con datos de hoy (máximo impacto, mínimo esfuerzo)**
1. **Calculadora de valor / ROI** en el reporte (§5) — es el cierre de venta.
2. **Tasa de contacto** + **ranking en categoría** (§2.1, §2.3).
3. **Índice de salud de ficha** (§2.4).
4. **Motor de recomendaciones** con la librería por red (§6) — arranca con reglas
   sobre los contadores que ya existen.

**Fase 2 — tabla `events` (el gran desbloqueo)**
5. Crear `events` (§7) e instrumentar `view` + contactos con `ref` y geo.
6. **Atribución a historias/eventos** (§4) — tu diferenciador único.
7. **Tendencia**, **heatmap día×hora** y **origen geográfico** (§3).

**Fase 3 — integraciones externas (Nivel 2)**
8. Instagram/Facebook Graph API: seguidores, alcance, mejores posts (métrica real,
   no solo clics salientes). Mayor "wow", mayor mantenimiento.
9. Importar Google Business Profile para unificar también lo de Google en un tablero.

**Reparto sugerido por plan** (coherente con `plans.js`)
- **Malinalli:** vistas, contactos, tasa de contacto, salud de ficha.
- **Cuāuhtli:** + ranking en categoría, recomendaciones por red, atribución básica
  a historias, calculadora de ROI.
- **Ocēlōtl:** + heatmap, origen geográfico, calendario de demanda, atribución
  completa y lectura del consultor en el reporte mensual.

---

### Cierre

El salto de valor no es "más gráficas". Es pasar de **medir** (lo que hace Google) a
**explicar y recomendar en pesos y en hiperlocal** (lo que solo nosotros podemos,
porque somos dueños del contenido que mueve al pueblo). La Fase 1 ya convierte el
reporte en un argumento de venta; la Fase 2 lo vuelve imposible de copiar.
