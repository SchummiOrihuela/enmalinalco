// Fuente única de verdad del BLOG editorial ("Historias del pueblo").
//
// Cada artículo es contenido ESTÁTICO (vive en el repo, versionado en git):
// es lo más rápido para SEO, no consulta la base de datos y se indexa perfecto.
//
// El contenido se ADAPTA (no se copia tal cual) de canteraycalma.com para que
// NO haya duplicados entre ambos dominios: aquí el ángulo es el directorio de
// En Malinalco, con enlaces internos a categorías/negocios y una invitación
// clara a que los negocios aparezcan destacados. Se elimina toda promoción de
// hospedaje de terceros; las necesidades de dormir/comer apuntan al directorio.
//
// Estructura de cada artículo:
// - slug            → URL: /historias/<slug>
// - categoria       → etiqueta visible (ej. "Gastronomía")
// - categoriaDirSlug→ slug de la categoría del DIRECTORIO para las migas
//                     (ej. "restaurantes" → /categoria/restaurantes). Opcional.
// - grupo           → agrupación del hub /historias (una de las 4 secciones)
// - titulo, subtitulo, excerpt
// - fechaISO        → para <time> y Schema (YYYY-MM-DD)
// - fechaDisplay    → cómo se lee ("12 de mayo de 2026")
// - autor, lectura
// - imagen, imagenAlt
// - cuerpo[]        → bloques (ver renderer en historias/[slug]/page.js):
//                     p | h2 | h3 | ul | callout | rest | ctaNegocio
// - faq[]           → preguntas (se muestran y alimentan el Schema FAQPage)
// - relacionados[]  → slugs de otros artículos (enlaces internos "Sigue leyendo")

// Orden de las secciones en el hub /historias.
export const GRUPOS = [
  { id: 'gastronomia', nombre: 'Gastronomía', descripcion: 'Dónde y qué comer en Malinalco, sin filtros.' },
  { id: 'historia', nombre: 'Historia', descripcion: 'El pasado vivo del pueblo: conventos, barrios y por qué es Pueblo Mágico.' },
  { id: 'prehispanico', nombre: 'Mali Prehispánico', descripcion: 'El único templo monolítico de América y los guerreros que se forjaron aquí.' },
  { id: 'finde', nombre: 'Tu Finde en Mali', descripcion: 'Itinerarios listos para aprovechar el pueblo al máximo.' },
]

// CTA reutilizables para dueños de negocio (muestran el beneficio de aparecer).
const CTA_RESTAURANTE = {
  t: 'ctaNegocio',
  titulo: '¿Tienes un restaurante o café en Malinalco?',
  html: 'Guías como esta son lo primero que lee quien va a visitar el pueblo. Los negocios con presencia en En Malinalco aparecen con fotos, ubicación y horarios cuando alguien busca dónde comer —y los planes superiores salen en los primeros lugares de su categoría, con insignia de “Recomendado” y hasta su propia historia contada.',
}
const CTA_EXPERIENCIA = {
  t: 'ctaNegocio',
  titulo: '¿Ofreces una experiencia o servicio en Malinalco?',
  html: 'Quien planea su viaje llega primero a guías como esta. Si tu negocio —hospedaje, ecoturismo, temazcal, mezcal, tienda— está en En Malinalco, apareces justo cuando el turista decide qué hacer. Los planes superiores salen en los primeros lugares, con insignia “Recomendado” y tu historia contada.',
}
const CTA_NEGOCIO = {
  t: 'ctaNegocio',
  titulo: '¿Tienes un negocio en Malinalco?',
  html: 'Cada historia atrae al visitante que busca qué ver, dónde comer y dónde dormir en el pueblo. Estar en En Malinalco significa aparecer con fotos, ubicación y horarios cuando más importa —y los planes superiores salen primero en su categoría, con insignia “Recomendado” y su propia historia contada.',
}

export const ARTICULOS = [
  // ─────────────────────────────── GASTRONOMÍA ───────────────────────────────
  {
    slug: '10-restaurantes-malinalco',
    categoria: 'Gastronomía',
    categoriaDirSlug: 'restaurantes',
    grupo: 'gastronomia',
    titulo: '10 restaurantes en Malinalco que un local te recomendaría (y 3 que no)',
    subtitulo:
      'Después de años recibiendo visitantes, esta es la lista honesta: sin patrocinios, sin filtros, solo el sabor que de verdad vale el viaje.',
    excerpt:
      'Del mercado a los rincones de autor, una guía honesta de dónde comer en Malinalco: qué pedir, cuánto cuesta y para qué ocasión es cada lugar.',
    fechaISO: '2026-05-12',
    fechaDisplay: '12 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '7 min',
    imagen: '/img/articulos/10-restaurantes-malinalco.webp',
    imagenAlt: 'Mesa puesta con vista a las montañas de Malinalco',
    cuerpo: [
      { t: 'p', html: 'Para un Pueblo Mágico de apenas 25 mil habitantes, Malinalco esconde una escena gastronómica que sorprende a cualquiera que llega por primera vez. Hay cocina de autor, trucha recién sacada del agua, cafés de especialidad y fondas donde se come como en casa. El problema es el de siempre: <strong>¿cuáles valen la pena de verdad?</strong>' },
      { t: 'p', html: 'Esta no es una lista pagada. Son los lugares que recomendaríamos a un amigo que nos visita el fin de semana, ordenados sin ranking porque cada uno brilla en lo suyo. Si quieres ver todos los lugares para comer del pueblo, están en la categoría <a href="/categoria/restaurantes">Restaurantes del directorio</a>.' },
      { t: 'h2', id: 'los-10', text: 'Los 10 que sí' },
      { t: 'rest', n: 1, nombre: 'Maíz Criollo', tipo: 'Cocina mexicana de autor', precio: '$250–$300 por persona', html: 'Menú degustación de tres tiempos con ingrediente local y técnica fina. El chef conoce a fondo el producto de la región y cambia la carta por temporada. Para una cena especial, es la apuesta segura.' },
      { t: 'rest', n: 2, nombre: 'Pancho Villa', tipo: 'Cortes y mariscos', precio: 'Accesible', html: 'Donde los locales celebran sin vaciar la cartera. Cortes generosos bien preparados, marisco fresco y trato cálido. Se llena los fines de semana: llega temprano o visítalo entre semana.' },
      { t: 'rest', n: 3, nombre: 'Los Placeres', tipo: 'Fusión gourmet', precio: 'Medio-alto', html: 'Técnica contemporánea sobre ingrediente regional: quelites, hongos, flores comestibles. Ambiente íntimo y servicio atento. Ideal para una comida sin prisa.' },
      { t: 'rest', n: 4, nombre: 'Casa Diablitos', tipo: 'Bar y coctelería', precio: 'Accesible', html: 'Micheladas, alitas y cócteles bien hechos. Hamburguesas generosas y un programa de coctelería serio para un pueblo de este tamaño. Aquí se concentra la noche los viernes y sábados.' },
      { t: 'rest', n: 5, nombre: 'Casa Valentina', tipo: 'Café de especialidad y brunch', precio: 'Bajo', html: 'Parada obligada. Buen café, baguettes frescos y un entorno tranquilo para empezar el día con calma.' },
      { t: 'rest', n: 6, nombre: 'Las Palomas', tipo: 'Cocina tradicional y trucha', precio: 'Accesible', html: 'Trucha fresca preparada de mil formas —al ajillo, envuelta, con hierbas de monte— que marida con mezcal artesanal de la región. Una experiencia 100% malinalquense.' },
      { t: 'rest', n: 7, nombre: 'El Pochote', tipo: 'Pizzas al horno de leña y hamburguesas', precio: 'Justo', html: 'Masa artesanal al horno de leña y hamburguesas de dos manos. Ambiente relajado, apto para ir con niños.' },
      { t: 'rest', n: 8, nombre: 'Terraza Xolo', tipo: 'Tacos y micheladas', precio: 'Muy accesible', html: 'Tacos al pastor con michelada fría y vista al pueblo desde la terraza. Bebidas creativas y un ambiente casual con encanto.' },
      { t: 'rest', n: 9, nombre: 'Casa Colibrí', tipo: 'Desayunos y cocina exótica', precio: 'Medio', html: 'Uno de los secretos mejor guardados, con vistas extraordinarias al pueblo y al Cerro de los Ídolos. Desayunos creativos con hongos silvestres, flores comestibles y proteínas poco convencionales.' },
      { t: 'rest', n: 10, nombre: 'Caudillos', tipo: 'Cocina tradicional de Malinalco', precio: 'Accesible', html: 'El favorito del barrio: menú variado, buenas bebidas y calor de comunidad. Sin pretensiones, con carácter auténtico.' },
      CTA_RESTAURANTE,
      { t: 'h2', id: 'por-ocasion', text: 'Guía rápida por ocasión' },
      { t: 'ul', items: [
        '<strong>Cena especial o celebración:</strong> Maíz Criollo o Los Placeres.',
        '<strong>Desayuno perfecto:</strong> Casa Valentina o Casa Colibrí.',
        '<strong>Experiencia 100% local:</strong> Las Palomas con mezcal de la región.',
        '<strong>Mejor relación precio-valor:</strong> Pancho Villa o Terraza Xolo.',
        '<strong>Cócteles de tarde-noche:</strong> Casa Diablitos o Terraza Xolo.',
        '<strong>En familia con niños:</strong> El Pochote o Caudillos.',
      ] },
      { t: 'callout', titulo: 'Tips de local', items: [
        'Reserva viernes y sábado: son los días de más visitantes desde CDMX y Toluca.',
        'Los domingos suele haber menú especial y platillos del día.',
        'Pide la trucha envuelta en hierbas; es una revelación.',
        'Pide mezcal de la región, no marcas comerciales.',
        'Camina entre un lugar y otro: el paseo es parte de la experiencia. Todos están a distancia caminable del centro.',
      ] },
      { t: 'h2', id: 'los-3-que-no', text: 'Y los 3 que no (por ahora)' },
      { t: 'p', html: 'Prometimos honestidad: hay lugares concurridos que, por consistencia irregular, servicio frío o precios que no corresponden a lo que sirven, hoy no entran en esta lista. No damos nombres para no quemar a nadie que pueda mejorar —el criterio es simple: <strong>si no llevaríamos ahí a un amigo, no te lo recomendamos a ti</strong>. Esta guía se actualiza; quien suba el nivel, entra.' },
    ],
    faq: [
      { q: '¿Cuál es el mejor restaurante de Malinalco?', a: 'Depende de lo que busques. Maíz Criollo lidera en cocina de autor, Pancho Villa gana en relación precio-valor para cortes y mariscos, y Casa Diablitos domina la escena de coctelería de noche.' },
      { q: '¿Dónde desayunar en Malinalco?', a: 'Casa Valentina es el favorito local por su café de especialidad y sus baguettes. Casa Colibrí ofrece desayunos excepcionales con vista al pueblo, y Terraza Xolo es la opción rápida y económica.' },
      { q: '¿Dónde comer comida tradicional de Malinalco?', a: 'Las Palomas se especializa en trucha y mezcal regional, Los Placeres fusiona la cocina local con técnica gourmet, y Caudillos ejecuta los sabores tradicionales con consistencia.' },
      { q: '¿Aceptan tarjeta los restaurantes?', a: 'La mayoría sí. Los lugares más pequeños e informales prefieren efectivo o cobran comisión, así que conviene llevar algo de efectivo, sobre todo para Terraza Xolo y Las Palomas.' },
      { q: '¿Cuáles son las horas de mayor demanda?', a: 'Los sábados de 1:30 a 3:30 pm y el mediodía del domingo son los de mayor afluencia. En temporada alta (Semana Santa, vacaciones y agosto) se llenan todos; conviene llamar con antelación.' },
    ],
    relacionados: ['donde-desayunar-malinalco', 'pesca-trucha-mezcal-malinalco', '48-horas-malinalco'],
  },

  {
    slug: 'donde-desayunar-malinalco',
    categoria: 'Gastronomía',
    categoriaDirSlug: 'restaurantes',
    grupo: 'gastronomia',
    titulo: 'Dónde desayunar en Malinalco: los 6 mejores lugares',
    subtitulo:
      'Del café de especialidad con baguette recién horneado a los chilaquiles con vista al cerro. Así empiezan las mañanas en el pueblo.',
    excerpt:
      'Seis lugares para desayunar en Malinalco, con precios, horarios y para qué es cada uno. Café de especialidad, desayunos con vista y sabor tradicional.',
    fechaISO: '2026-05-15',
    fechaDisplay: '15 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '5 min',
    imagen: '/img/articulos/donde-desayunar-malinalco.webp',
    imagenAlt: 'Desayuno con café y pan en una terraza de Malinalco',
    cuerpo: [
      { t: 'p', html: 'En Malinalco el desayuno no es solo comer: es descubrir que un baguette con mermelada casera puede ser lo más memorable de todo el viaje. Aquí los seis lugares que recomendamos, todos de dueños locales, con recetas de familia y nada de cadenas. ¿Buscas más opciones? Están en <a href="/categoria/restaurantes">Restaurantes del directorio</a>.' },
      { t: 'h2', id: 'los-6', text: 'Los 6 mejores lugares' },
      { t: 'rest', n: 1, nombre: 'Casa Valentina', tipo: 'Café de especialidad · brunch', precio: '$120–$180', html: 'El favorito indiscutible. Espresso de calidad, baguettes recién horneados, mermeladas caseras y un ambiente que invita a quedarse. El origen del café rota cada semana: pregunta por el del día.' },
      { t: 'rest', n: 2, nombre: 'Casa Colibrí', tipo: 'Desayunos creativos · vista panorámica', precio: '$150–$220', html: 'Huevos con flores comestibles, hotcakes con frutos del bosque y smoothie bowls, con una vista extraordinaria al pueblo y al Cerro de los Ídolos. Para quien quiere algo elevado sin pretensiones. Abre viernes a domingo.' },
      { t: 'rest', n: 3, nombre: 'Maíz Criollo', tipo: 'Desayuno de autor', precio: '$200–$280', html: 'Solo fines de semana y con reservación. Técnica fina, pan artesanal e ingrediente local para una experiencia de desayuno distinta a todo lo demás.' },
      { t: 'rest', n: 4, nombre: 'El Pochote', tipo: 'Desayuno tradicional · familiar', precio: '$90–$140', html: 'Porciones generosas y directas: huevos al gusto, chilaquiles, molletes, jugos frescos y buen café. Servicio cálido y sin pretensiones.' },
      { t: 'rest', n: 5, nombre: 'Las Palomas', tipo: 'Desayuno auténtico malinalquense', precio: '$80–$120', html: 'Huevos rancheros con salsa de molcajete, frijoles de la olla, tortillas hechas a mano y café de olla con piloncillo. Ambiente rústico y sabor de verdad.' },
      { t: 'rest', n: 6, nombre: 'Terraza Xolo', tipo: 'Desayuno ligero · vistas', precio: '$70–$110', html: 'Opciones ligeras —café, pan dulce, molletes, fruta— con vista panorámica del pueblo. Ideal para quien prefiere empezar liviano.' },
      CTA_RESTAURANTE,
      { t: 'h2', id: 'consejos', text: 'Consejos de local que nadie te dice' },
      { t: 'ul', items: [
        '<strong>Mejor hora:</strong> entre 8:30 y 10:00 am, antes de que llegue la gente del fin de semana.',
        '<strong>Días más saturados:</strong> sábado y domingo.',
        '<strong>Pago:</strong> casi todos prefieren efectivo; Casa Valentina y Maíz Criollo aceptan tarjeta.',
        'En domingo, el baguette de Casa Valentina se agota después de las 10:30 am. Llega antes.',
        'A Maíz Criollo no llegues sin reservar: es solo fin de semana y con cupo.',
      ] },
    ],
    faq: [
      { q: '¿Cuál es el mejor lugar para desayunar en Malinalco?', a: 'Casa Valentina es el favorito indiscutible por su café de especialidad, sus baguettes recién horneados y su ambiente. Para algo más elaborado y con vista, Casa Colibrí ofrece desayunos creativos en terraza panorámica.' },
      { q: '¿Dónde hay café de especialidad en Malinalco?', a: 'Casa Valentina tiene el mejor café de especialidad, con grano seleccionado de distintas regiones de México que rota cada semana. Terraza Xolo también sirve buen café con un enfoque más casual.' },
      { q: '¿A qué hora abren los lugares de desayuno?', a: 'La mayoría entre 8:30 y 9:00 am. Las Palomas abre desde las 8:00 am. Para desayunar muy temprano (antes de las 8), las fondas del mercado municipal abren desde las 7 am.' },
      { q: '¿Necesito reservar para desayunar?', a: 'En general no, salvo Maíz Criollo, que opera fines de semana solo con reservación. Casa Valentina y Casa Colibrí se llenan sábado y domingo entre 9:30 y 11 am; conviene llegar antes de las 9.' },
      { q: '¿Hay opciones vegetarianas o veganas?', a: 'Sí. Casa Valentina ofrece opciones vegetarianas (baguettes con aguacate, queso, mermeladas) adaptables a vegano, y Casa Colibrí tiene smoothie bowls y hotcakes de avena.' },
    ],
    relacionados: ['10-restaurantes-malinalco', 'pesca-trucha-mezcal-malinalco', 'malinalco-con-familia'],
  },

  {
    slug: 'pesca-trucha-mezcal-malinalco',
    categoria: 'Gastronomía',
    categoriaDirSlug: 'restaurantes',
    grupo: 'gastronomia',
    titulo: 'Pesca tu trucha, tómate un mezcal: la tarde más malinalquense',
    subtitulo:
      'No es un restaurante. Es pescar tu propia trucha en un criadero de montaña y cerrar con mezcal artesanal viendo la destilación. Así se vive Malinalco.',
    excerpt:
      'Pescar tu trucha en un criadero de montaña y cerrar con mezcal artesanal: cómo funciona paso a paso, dónde ir y cuánto cuesta la tarde más auténtica del pueblo.',
    fechaISO: '2026-05-14',
    fechaDisplay: '14 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '6 min',
    imagen: '/img/articulos/pesca-trucha-mezcal-malinalco.webp',
    imagenAlt: 'Trucha a las brasas junto a un mezcal artesanal en Malinalco',
    cuerpo: [
      { t: 'p', html: 'Hay experiencias turísticas, y hay experiencias que te conectan con un lugar. Esto es lo segundo. Pescar tu propia trucha en un criadero de montaña, que te la preparen al momento en las brasas, y cerrar la tarde con un mezcal artesanal viendo el proceso de destilación es lo que los locales hacemos cuando queremos un domingo fuera de lo común.' },
      { t: 'p', html: 'Malinalco está rodeado de agua de montaña: por eso prosperan los criaderos de trucha arcoíris. El mismo clima templado y suelo volcánico hace que el maguey crezca silvestre en las laderas, y de ahí nace el mezcal local. Combinar ambos en una tarde es la forma más honesta de entender al pueblo.' },
      { t: 'h2', id: 'paso-a-paso', text: 'Cómo funciona, paso a paso' },
      { t: 'ul', items: [
        '<strong>1. Llegas al criadero.</strong> Camino a Joquicingo, 10 minutos del centro. Te dan una caña con carnada y te señalan el estanque.',
        '<strong>2. Pescas tu trucha.</strong> No necesitas experiencia: pican rápido. Una de 500–600 g es perfecta para una persona.',
        '<strong>3. Eliges cómo la quieres.</strong> Al mojo de ajo, empapelada con hierbas de monte, a la mantequilla o frita. La empapelada es la que más sorprende.',
        '<strong>4. Esperas 15–20 min.</strong> Caminas por los estanques mientras la asan al carbón.',
        '<strong>5. Comes.</strong> Te la sirven completa con arroz, frijoles y tortillas hechas a mano. El agua limpia de montaña hace la diferencia.',
        '<strong>6. Cierras con mezcal.</strong> A 15 minutos, en el palenque te muestran todo el proceso y te ofrecen una cata. Si manejas, solo prueba.',
      ] },
      { t: 'h2', id: 'donde', text: 'Dónde ir' },
      { t: 'rest', n: 1, nombre: 'Criadero de Truchas "El Fresno"', tipo: 'Pesca y preparación', precio: '~$200 por kilo', html: 'El más tradicional y constante del pueblo: más de 25 años de oficio, estanques limpios, mesas bajo árboles y parrillas al carbón. La trucha empapelada es de las mejores que vas a probar. Conviene llamar antes en fin de semana.' },
      { t: 'rest', n: 2, nombre: 'Mezcal La Cascada', tipo: 'Destilado artesanal · palenque familiar', precio: 'Botella ~$350–$450', html: 'Palenque pequeño y familiar donde ves todo el proceso, de la jima del maguey al embotellado. La cata incluye 3–4 tipos con explicación. Puedes comprar directo del productor.' },
      { t: 'p', html: 'La ruta ideal: criadero al mediodía → comer tu trucha → mezcal por la tarde. Dos paradas en un radio de 20 minutos. Verás más opciones de aventura y naturaleza en <a href="/categoria/ecoturismo">Ecoturismo</a>.' },
      CTA_EXPERIENCIA,
      { t: 'callout', titulo: 'Errores que conviene evitar', items: [
        'Llegar en domingo a las 2 pm sin llamar: se llena. Ve temprano o reserva.',
        'Pedir la trucha frita cuando nunca has probado la empapelada.',
        'Saltarte el mezcal: un caballito con la explicación vale la pena aunque no seas mezcalero.',
        'Ir con prisa: bloquea 3–4 horas. Es una experiencia, no un trámite.',
        'No llevar efectivo: ninguno de los dos lugares acepta tarjeta.',
      ] },
    ],
    faq: [
      { q: '¿Dónde está el criadero de truchas en Malinalco?', a: 'En la carretera Malinalco–Joquicingo, a unos 10 minutos en auto desde el centro. Hay señalización desde la salida norte del pueblo.' },
      { q: '¿Cuánto cuesta pescar una trucha en Malinalco?', a: 'La trucha se cobra por kilo, entre $180 y $220 según tamaño y criadero. Una trucha promedio (400–600 g) deja la experiencia completa en $100–$150 por persona, más $50–$80 si pides bebida.' },
      { q: '¿Dónde probar mezcal artesanal en Malinalco?', a: 'Mezcal La Cascada es el destilado artesanal del pueblo. En su palenque, a 15 minutos del centro, ves el proceso completo y puedes hacer una cata gratis; solo pagas si compras botella.' },
      { q: '¿Necesito experiencia para pescar truchas?', a: 'Ninguna. Te dan la caña lista con carnada y te indican dónde lanzar. Las truchas pican rápido; incluso niños de 6–7 años lo hacen sin problema.' },
      { q: '¿Puedo ir sin auto?', a: 'Es complicado: ambos lugares están fuera del centro y no hay transporte público directo. Un taxi desde el centro cuesta ~$80–$100 por viaje.' },
    ],
    relacionados: ['10-restaurantes-malinalco', 'donde-desayunar-malinalco', 'escapada-romantica-malinalco'],
  },

  // ─────────────────────────────── HISTORIA ───────────────────────────────
  {
    slug: 'convento-agustino-malinalco',
    categoria: 'Historia',
    categoriaDirSlug: 'cultura',
    grupo: 'historia',
    titulo: 'El convento que los frailes pintaron con manos indígenas',
    subtitulo:
      'Los agustinos llegaron a borrar el pasado. Lo que crearon en las paredes del convento es una obra que los siglos no han podido explicar del todo.',
    excerpt:
      'La historia del Convento Agustino de Malinalco: sus murales de grisalla del siglo XVI pintados por artistas indígenas, el sismo de 2017 y cómo visitarlo hoy.',
    fechaISO: '2026-04-26',
    fechaDisplay: '26 de abril de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '7 min',
    imagen: '/img/articulos/convento-agustino-malinalco.webp',
    imagenAlt: 'Fachada del Convento Agustino de Malinalco',
    cuerpo: [
      { t: 'p', html: 'En 1521 Malinalco cayó ante los conquistadores tras siglos como territorio sagrado de los mexicas. Diecinueve años después llegaron los frailes agustinos, y con ellos el convento como instrumento para una transformación espiritual. Llegaron a borrar el pasado; lo que dejaron es único en América.' },
      { t: 'h2', id: '1540', text: '1540: cuando comenzó todo' },
      { t: 'p', html: 'La construcción del Convento de la Transfiguración del Señor comenzó en 1540, en el centro del pueblo cerca del antiguo espacio ceremonial. Primero la iglesia y la planta baja; unos veinte años después, el claustro alto. La fachada es renacentista plateresca: cabezas de ángeles, rosetones y conchas como declaración de poder europeo en tierra americana.' },
      { t: 'callout', titulo: 'La técnica de la grisalla', items: [
        'Pintura al fresco en tonos de gris sobre fondo blanco que simula esculturas en relieve.',
        'Exige dominio del sombreado, la perspectiva y la anatomía.',
        'Que artistas indígenas, sin tradición en esta técnica, la dominaran en décadas habla de un talento sorprendente.',
      ] },
      { t: 'h2', id: 'las-manos', text: 'Las manos que lo pintaron' },
      { t: 'p', html: 'Había muy pocos pintores europeos en la Nueva España, así que los frailes enseñaron la técnica a artistas indígenas en escuelas de artes y oficios. Los pintores de Malinalco aplicaron la grisalla en el claustro bajo, siguiendo programas iconográficos basados en grabados europeos —pero imprimiendo su propio sello.' },
      { t: 'h2', id: 'los-murales', text: 'Los murales que nadie termina de descifrar' },
      { t: 'p', html: 'Oficialmente representan el paraíso cristiano. Pero estudios recientes identifican elementos que no vienen de ningún grabado europeo: flora y fauna reales de Malinalco y motivos que recuerdan códices prehispánicos, sobre todo en las bóvedas, donde los artistas tenían más libertad.' },
      { t: 'ul', items: [
        '<strong>Los 12 escudos:</strong> monumentales, con los nombres de Jesús, María y el emblema agustino.',
        '<strong>Flora y fauna local:</strong> plantas y animales de Malinalco entretejidos con la vegetación del Edén.',
        '<strong>Huellas de los códices:</strong> en las bóvedas aparecen motivos de iconografía prehispánica.',
      ] },
      { t: 'h2', id: 'sismo', text: 'El sismo de 2017 y la restauración' },
      { t: 'p', html: 'El 19 de septiembre de 2017 el terremoto dañó el convento de casi 500 años. El INAH realizó años de restauración minuciosa y, bajo capas de pintura posterior, encontró fragmentos de los murales originales que nadie había visto en siglos.' },
      { t: 'h2', id: 'visitar', text: 'Cómo visitarlo hoy' },
      { t: 'ul', items: [
        '<strong>Horario:</strong> martes a domingo, 10:00–17:00 (verifica en temporadas especiales).',
        '<strong>Entrada:</strong> gratuita o cuota mínima.',
        '<strong>Ubicación:</strong> centro de Malinalco, a pasos del jardín principal. Sin escalones.',
        '<strong>Tiempo de visita:</strong> de 45 minutos a 1.5 horas.',
        'Combínalo con la <a href="/categoria/cultura">zona arqueológica</a> el mismo día: dos grandes herencias a 10 minutos una de otra.',
      ] },
      CTA_NEGOCIO,
    ],
    faq: [
      { q: '¿Cuándo se construyó el convento agustino de Malinalco?', a: 'La construcción comenzó en 1540, 19 años después de la conquista de Tenochtitlan. La iglesia y la planta baja se edificaron primero; el claustro alto hacia 1560.' },
      { q: '¿Quién pintó los murales del convento de Malinalco?', a: 'Artistas indígenas formados en escuelas de artes y oficios de los frailes agustinos. Trabajaban bajo supervisión, pero imprimieron su propio sello cultural, sobre todo en las bóvedas.' },
      { q: '¿Qué representan los murales del convento de Malinalco?', a: 'Oficialmente el paraíso cristiano: 12 escudos con nombres de Jesús y María rodeados de flora y fauna del Edén. Pero contienen elementos de códices prehispánicos y fauna local, lo que los hace únicos en América.' },
      { q: '¿Se puede visitar el convento agustino de Malinalco?', a: 'Sí. Generalmente de martes a domingo de 10:00 a 17:00, en el centro del pueblo. Entrada gratuita o de cuota mínima, al nivel de la calle. Se combina fácil con la zona arqueológica.' },
      { q: '¿Qué daños sufrió en el sismo de 2017?', a: 'El terremoto del 19 de septiembre de 2017 dañó la estructura y los murales del siglo XVI. El INAH hizo una restauración de años que recuperó colores y detalles que parecían perdidos.' },
    ],
    relacionados: ['malinalco-pueblo-magico-historia', 'barrios-de-malinalco', 'casa-de-las-aguilas'],
  },

  {
    slug: 'malinalco-pueblo-magico-historia',
    categoria: 'Historia',
    categoriaDirSlug: 'cultura',
    grupo: 'historia',
    titulo: '¿Por qué Malinalco es Pueblo Mágico? La historia que nadie te cuenta',
    subtitulo:
      'La magia de Malinalco no la creó la Secretaría de Turismo en 2010. Solo reconoció lo que ya existía desde hacía 3,500 años.',
    excerpt:
      'Por qué Malinalco es Pueblo Mágico: 3,500 años de historia, 7 razones que lo hacen único y cómo se compara con Tepoztlán y Valle de Bravo.',
    fechaISO: '2026-04-27',
    fechaDisplay: '27 de abril de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '8 min',
    imagen: '/img/articulos/malinalco-pueblo-magico-historia.webp',
    imagenAlt: 'Vista del valle subtropical de Malinalco',
    cuerpo: [
      { t: 'p', html: 'Malinalco recibió el nombramiento de Pueblo Mágico en 2010 y lo ha mantenido sin interrupción por más de 14 años. Pero el reconocimiento oficial solo formalizó lo que ya era evidente: la magia del pueblo no la creó un programa de turismo.' },
      { t: 'h2', id: 'que-es', text: '¿Qué es un Pueblo Mágico?' },
      { t: 'p', html: 'El programa nació en 2001. Para calificar, un lugar debe demostrar arquitectura preservada, hechos históricos significativos, tradiciones vivas, gastronomía regional auténtica, leyendas locales y ubicación estratégica. México tiene más de 130 Pueblos Mágicos; Malinalco está a 80–90 km de la CDMX, a hora y media.' },
      { t: 'h2', id: 'historia', text: '3,500 años de historia continua' },
      { t: 'ul', items: [
        '<strong>~1500 a.C.:</strong> evidencia de asentamientos humanos en el valle subtropical.',
        '<strong>1476:</strong> Axayácatl conquista Malinalco y comienza el templo Cuauhcalli.',
        '<strong>1521:</strong> conquista española; inicia la evangelización.',
        '<strong>1540:</strong> inicia el Convento de la Transfiguración y sus murales únicos.',
        '<strong>1813:</strong> José María Morelos firma documentos en Malinalco.',
        '<strong>1910s:</strong> cercanía con Morelos y alianza con el zapatismo.',
        '<strong>2010:</strong> nombramiento oficial de Pueblo Mágico.',
      ] },
      { t: 'h2', id: '7-razones', text: '7 razones que lo hacen diferente' },
      { t: 'ul', items: [
        '<strong>El único templo monolítico de América:</strong> el Cuauhcalli no tiene equivalente en el continente.',
        '<strong>Murales coloniales únicos:</strong> pintados por artistas indígenas en el convento agustino.',
        '<strong>Nombrado por una diosa:</strong> de Malinalxóchitl, hechicera y deidad fundadora.',
        '<strong>Clima subtropical todo el año:</strong> a 1,400 m, entre 18 y 28 °C casi siempre.',
        '<strong>Gastronomía prehispánica viva:</strong> trucha, mezcal artesanal con Denominación de Origen.',
        '<strong>Energía espiritual reconocida:</strong> temazcal, sueños vívidos, chamanes activos.',
        '<strong>Aún no masificado:</strong> conserva su escala humana, a diferencia de Tepoztlán o Taxco.',
      ] },
      CTA_NEGOCIO,
      { t: 'h2', id: 'comparacion', text: 'Malinalco vs otros Pueblos Mágicos' },
      { t: 'ul', items: [
        '<strong>vs Tepoztlán:</strong> Tepoztlán tiene más misticismo popular y restaurantes de moda, pero sufre saturación. Malinalco tiene una zona arqueológica más impresionante y más tranquilidad.',
        '<strong>vs Valle de Bravo:</strong> Valle ofrece lago y hotelería de lujo; Malinalco, más historia y autenticidad a menor costo.',
        '<strong>vs Metepec:</strong> Metepec es artesanía urbana; Malinalco preserva historia prehispánica y colonial en estado puro.',
      ] },
      { t: 'h2', id: 'ahora', text: 'Por qué vale la pena visitarlo ahora' },
      { t: 'p', html: 'Existe una ventana temporal. Los Pueblos Mágicos más famosos vivieron un equilibrio entre autenticidad y turismo antes de perderlo. Malinalco sigue dentro de esa ventana: aún puedes desayunar entre locales y llegar casi solo al templo antes de las 10 am. Este equilibrio, a 80 km de la CDMX, es extraordinario y temporal. Empieza a planear en <a href="/categoria/cultura">Cultura</a> y <a href="/categoria/hospedaje">Hospedaje</a>.' },
    ],
    faq: [
      { q: '¿Cuándo fue nombrado Malinalco Pueblo Mágico?', a: 'En 2010, junto con otros cuatro municipios. Ha mantenido su designación de forma continua, con renovación anual.' },
      { q: '¿Qué requisitos cumplió Malinalco?', a: 'Todos los del programa: arquitectura colonial preservada, un sitio arqueológico único en América, tradiciones vivas, gastronomía de raíz prehispánica, historia nacional significativa y ubicación a 90 km de la CDMX.' },
      { q: '¿Cuántos Pueblos Mágicos hay en México?', a: 'Más de 130 comunidades tienen la designación. El programa se creó en 2001 y tuvo una expansión rápida entre 2010 y 2012. Malinalco la conserva sin interrupción.' },
      { q: '¿Qué hace único a Malinalco entre los Pueblos Mágicos?', a: 'La combinación irrepetible del único templo monolítico de América, murales del siglo XVI únicos en el mundo, un nombre de origen prehispánico, clima subtropical, gastronomía viva y un carácter auténtico que pueblos más famosos ya perdieron.' },
      { q: '¿Malinalco o Tepoztlán?', a: 'Tepoztlán tiene más misticismo popular y vida gastronómica, pero sufre saturación. Malinalco ofrece mejor arqueología y más autenticidad. Para cultura, historia y tranquilidad genuina, Malinalco prevalece.' },
    ],
    relacionados: ['convento-agustino-malinalco', 'casa-de-las-aguilas', 'barrios-de-malinalco'],
  },

  {
    slug: 'barrios-de-malinalco',
    categoria: 'Historia',
    categoriaDirSlug: 'cultura',
    grupo: 'historia',
    titulo: 'Los 8 barrios de Malinalco: cada uno con su santo, su capilla y su carácter',
    subtitulo:
      'Ocho barrios, ocho capillas, una sola alma. La guía que ningún turista tiene para entender el pueblo de verdad.',
    excerpt:
      'Los 8 barrios históricos de Malinalco, cada uno con su capilla del siglo XVI o XVII, su santo patrono y su fiesta. El secreto astronómico de sus capillas.',
    fechaISO: '2026-04-28',
    fechaDisplay: '28 de abril de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '8 min',
    imagen: '/img/articulos/barrios-de-malinalco.webp',
    imagenAlt: 'Capilla de barrio en Malinalco',
    cuerpo: [
      { t: 'p', html: 'La mayoría de los visitantes sube al cerro, visita el convento, come en la plaza y se va. Pero se pierden algo esencial: los barrios. Malinalco tiene ocho, cada uno con su capilla del siglo XVI o XVII, su santo patrono, sus fiestas y su carácter. Juntos forman el alma del pueblo.' },
      { t: 'h2', id: 'origen', text: 'El origen: 1579 y la evangelización' },
      { t: 'p', html: 'Los ocho barrios no nacieron de un plan urbano moderno, sino de la evangelización colonial del siglo XVI. Para 1579 cada barrio ya tenía el nombre de su santo y sus primeras capillas (de techo de paja). Las estructuras de piedra que ves hoy se levantaron en los siglos XVII y XVIII.' },
      { t: 'callout', titulo: 'Un secreto astronómico', items: [
        'Las capillas siguen una alineación de ~105–106° hacia el este, correspondiente a fechas del calendario solar.',
        'Las calles también siguen esa orientación, desviadas ~15° al sur del este verdadero.',
        'Como si la memoria cosmológica mexica sobreviviera dentro de la arquitectura cristiana.',
      ] },
      { t: 'h2', id: 'los-8', text: 'Los 8 barrios, uno por uno' },
      { t: 'ul', items: [
        '<strong>San Juan</strong> · San Juan Bautista · 24 de junio. El más central, al pie del Cerro de los Ídolos.',
        '<strong>Santa Mónica</strong> · 27 de agosto. Mira hacia la Parroquia del Divino Salvador: madre e hijo frente a frente.',
        '<strong>San Martín</strong> · 11 de noviembre. El más grande y tradicional; su cúpula muestra siete serpientes que aluden al maíz.',
        '<strong>Santa María</strong> · 15 de marzo. Su fachada tiene a cuatro heroínas bíblicas, iconografía inusual.',
        '<strong>San Andrés</strong> · 30 de noviembre. El más residencial y tranquilo, de orientación clásica este-oeste.',
        '<strong>San Sebastián</strong> · 20 de enero. De los primeros asentamientos; capilla del siglo XVI con techo de dos aguas.',
        '<strong>Jesús María</strong> · 8 de diciembre. Antes Santa María Xoquiac; su capilla del XVIII tiene pelícanos, símbolo del sacrificio.',
        '<strong>San Pedro</strong> · 29 de junio. Junto a San Andrés; sus fiestas con San Juan abren la temporada festiva del pueblo.',
      ] },
      CTA_NEGOCIO,
      { t: 'h2', id: 'ruta', text: 'Cómo recorrer los barrios: la ruta de las capillas' },
      { t: 'ul', items: [
        'Empieza en San Juan y avanza hacia Santa Mónica, luego al centro y el convento.',
        'San Martín y Santa María quedan al sur del convento (10–15 min caminando).',
        'Las capillas suelen abrir por la mañana, sobre todo fines de semana y fiestas patronales.',
        'Platica con los locales: cada barrio tiene vecinos que conocen cada detalle.',
      ] },
      { t: 'p', html: 'El 6 de agosto, la fiesta del Divino Salvador une a los ocho barrios en una procesión por todo el pueblo. Ver a los ocho converger en la plaza es la mejor forma de entender la esencia de Malinalco. Para más patrimonio, visita <a href="/categoria/cultura">Cultura</a>.' },
    ],
    faq: [
      { q: '¿Cuántos barrios tiene Malinalco?', a: 'Ocho barrios históricos: San Juan, Santa Mónica, San Martín, Santa María, San Andrés, San Sebastián, Jesús María y San Pedro. Cada uno con su capilla del siglo XVI o XVII y su fiesta patronal.' },
      { q: '¿Cuándo se construyeron las capillas de los barrios?', a: 'Para 1579 cada barrio ya tenía el nombre de su santo y sus primeras capillas (de techo de paja). La construcción en piedra ocurrió a lo largo de los siglos XVII y XVIII; la de San Sebastián data del XVI.' },
      { q: '¿Cuál es el barrio más tradicional?', a: 'San Martín, el más grande y poblado. Conserva rituales únicos y su cúpula muestra siete serpientes que evocan el nombre prehispánico del maíz.' },
      { q: '¿Se pueden visitar las capillas de los barrios?', a: 'Sí, aunque los horarios varían. Generalmente abren por la mañana, sobre todo en fines de semana y fiestas patronales. Los exteriores y atrios son accesibles en cualquier momento.' },
      { q: '¿Qué fiesta une a todos los barrios?', a: 'La del Divino Salvador, el 6 de agosto, patrona de todo el pueblo. Cada barrio lleva su estandarte, danzantes y banda en una procesión que recorre Malinalco antes de llegar a la parroquia.' },
    ],
    relacionados: ['convento-agustino-malinalco', 'malinalco-pueblo-magico-historia', 'guerreros-aguila-jaguar'],
  },

  // ─────────────────────────── MALI PREHISPÁNICO ───────────────────────────
  {
    slug: 'casa-de-las-aguilas',
    categoria: 'Mali Prehispánico',
    categoriaDirSlug: 'cultura',
    grupo: 'prehispanico',
    titulo: 'La Casa de las Águilas: el templo azteca tallado en la montaña',
    subtitulo:
      'Entras por la boca abierta de una serpiente gigante. Al cruzarla, mueres como hombre común y renaces como guerrero. Así funcionaba el Cuauhcalli.',
    excerpt:
      'El Cuauhcalli de Malinalco, único templo monolítico de América: cómo lo tallaron los aztecas, qué guarda dentro, los 428 escalones y cómo visitarlo (precios y horarios).',
    fechaISO: '2026-04-25',
    fechaDisplay: '25 de abril de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '7 min',
    imagen: '/img/articulos/casa-de-las-aguilas.webp',
    imagenAlt: 'El Cuauhcalli, templo monolítico de la zona arqueológica de Malinalco',
    cuerpo: [
      { t: 'p', html: 'La zona arqueológica de Malinalco no se visita: se vive. Entras por la boca abierta de una serpiente gigante y algo cambia al estar de pie sobre esta tierra sagrada. En el centro está el Cuauhcalli, la Casa de las Águilas.' },
      { t: 'h2', id: 'unico', text: 'Un templo que solo existe aquí' },
      { t: 'p', html: 'El Cuauhcalli es el único templo monolítico de grandes dimensiones en toda América. No se construyó trayendo piedras al cerro: se talló directamente en la roca viva, como escultores gigantes quitando el exceso. En el mundo solo existen cuatro así: Abu Simbel (Egipto), Petra (Jordania), Kailasa (India) y este.' },
      { t: 'h2', id: 'imposible', text: 'Cómo construyeron lo imposible' },
      { t: 'p', html: 'El emperador Ahuízotl ordenó su construcción en 1501 como centro de iniciación de los guerreros de élite —Águilas y Jaguares—. Con herramientas de obsidiana y trabajo manual, seguía inconcluso cuando llegaron los españoles en 1521, tras veinte años de labor.' },
      { t: 'h2', id: 'serpiente', text: 'La puerta que te engulle' },
      { t: 'p', html: 'La entrada es la boca abierta de una serpiente, con colmillos enmarcando el paso y una lengua bífida en el piso. Representa a Tlaltecuhtli, el monstruo de la tierra: al entrar, el guerrero moría simbólicamente para renacer.' },
      { t: 'h2', id: 'dentro', text: 'Dentro del Cuauhcalli' },
      { t: 'p', html: 'El interior circular guarda figuras talladas: dos águilas con alas plegadas (el sol y la guerra diurna), un ocelote/jaguar (la noche y el inframundo) y un águila central con un orificio donde se depositaban los corazones rituales. Dualidad: la cosmología mexica completa.' },
      { t: 'h2', id: 'escalones', text: '428 escalones que valen cada gota de sudor' },
      { t: 'ul', items: [
        '<strong>Subida:</strong> ~428 escalones, 20–30 minutos entre vegetación tropical.',
        '<strong>Calzado:</strong> zapato cerrado o tenis.',
        '<strong>Agua:</strong> mínimo 1 litro por persona.',
        '<strong>Mejor hora:</strong> 10:00–11:30 am.',
        '<strong>Tiempo total:</strong> 2–3 horas.',
      ] },
      { t: 'h2', id: 'visitar', text: 'Horarios, precios y cómo llegar' },
      { t: 'ul', items: [
        '<strong>Abierto:</strong> martes a domingo, 10:00–16:00 (último acceso 15:00). Cerrado lunes.',
        '<strong>Entrada general:</strong> ~$75–$85 MXN. Domingos gratis para nacionales.',
        '<strong>Ubicación:</strong> Calle Amajac s/n, Barrio Santa Mónica.',
        '<strong>Distancia:</strong> 80 km de la CDMX (1.5 h); 70 km de Toluca (1 h).',
      ] },
      CTA_NEGOCIO,
      { t: 'callout', titulo: 'Tips de local', items: [
        'Ve en domingo para entrar gratis, pero llega antes de las 10:30 am.',
        'Contrata un guía certificado por el INAH si hay disponible.',
        'Explora las seis estructuras, no solo el templo principal.',
        'No está permitido comer en el sitio.',
        'Cuidado en la bajada, sobre todo si llovió.',
      ] },
    ],
    faq: [
      { q: '¿Cuánto cuesta la zona arqueológica de Malinalco?', a: 'La entrada general ronda los $75–$85 MXN; los domingos es gratis para nacionales, y siempre gratis para menores de 13, adultos mayores y personas con discapacidad.' },
      { q: '¿Cuántos escalones tiene la subida?', a: 'Aproximadamente 428 escalones, que toman entre 20 y 30 minutos al ritmo normal con descansos.' },
      { q: '¿Cuáles son los horarios?', a: 'Martes a domingo de 10:00 a 16:00 (último acceso 15:00). Cerrado los lunes.' },
      { q: '¿Por qué es único en el mundo?', a: 'El Cuauhcalli es el único templo monolítico de grandes dimensiones en América, tallado directamente en la roca viva del cerro. Solo existen cuatro casos comparables en el mundo.' },
      { q: '¿Pueden subir niños?', a: 'Sí, es apto desde los 6 años; para menores de 5 resulta exigente por los escalones. Con calzado cómodo y sin prisa, la mayoría lo disfruta.' },
    ],
    relacionados: ['guerreros-aguila-jaguar', 'subida-cerro-idolos', 'malinalco-pueblo-magico-historia'],
  },

  {
    slug: 'guerreros-aguila-jaguar',
    categoria: 'Mali Prehispánico',
    categoriaDirSlug: 'cultura',
    grupo: 'prehispanico',
    titulo: 'Guerreros Águila y Jaguar: la élite militar que se forjó en Malinalco',
    subtitulo:
      'Eran la fuerza especial del Imperio Azteca, mitad soldados, mitad orden sagrada. Y solo había un lugar en todo el imperio donde se iniciaban: aquí.',
    excerpt:
      'Quiénes eran los Guerreros Águila y Jaguar, el requisito imposible para pertenecer, el entrenamiento del calmécac y por qué su iniciación ocurría solo en Malinalco.',
    fechaISO: '2026-05-02',
    fechaDisplay: '2 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '8 min',
    imagen: '/img/articulos/guerreros-aguila-jaguar.webp',
    imagenAlt: 'Relieve de guerreros águila y jaguar en Malinalco',
    cuerpo: [
      { t: 'p', html: 'Los Guerreros Águila y los Guerreros Jaguar eran las dos órdenes militares más prestigiosas del Imperio Azteca: el equivalente prehispánico de una fuerza especial combinada con una orden religiosa sagrada. La mayoría de los guerreros nunca lo lograba; los que sí, eran tratados como seres a medio camino entre los hombres y los dioses.' },
      { t: 'p', html: 'Y aquí está el dato que pocos conocen: estas dos órdenes eran las únicas en todo el imperio que celebraban su iniciación en Malinalco. No en Tenochtitlan. No en Teotihuacan. Aquí, en este cerro.' },
      { t: 'h2', id: 'dualidad', text: 'Águila vs Jaguar: la dualidad sagrada' },
      { t: 'ul', items: [
        '<strong>Guerrero Águila:</strong> el sol y la guerra diurna. Yelmo de águila. En batalla: explorador, espía y mensajero. Al morir, se convertía en sol.',
        '<strong>Guerrero Jaguar:</strong> la noche y el inframundo. Piel y máscara de felino. En batalla: primera línea, ferocidad total. Al morir, jaguar celestial.',
      ] },
      { t: 'p', html: 'Para los mexicas, el universo se sostenía en el equilibrio entre luz y oscuridad. Tener ambas órdenes iniciadas en el mismo templo era mantener ese equilibrio cósmico.' },
      { t: 'h2', id: 'requisito', text: 'El requisito imposible' },
      { t: 'p', html: 'Para aspirar a cualquiera de las dos órdenes había que capturar al menos cuatro enemigos vivos en combate. No matarlos: capturarlos. Eso requería control, técnica y valentía extrema. Las Guerras Floridas se organizaban precisamente para capturar prisioneros con fines rituales: cuerpos vivos para sostener al sol en movimiento.' },
      { t: 'h2', id: 'calmecac', text: 'El entrenamiento que pocos resistían' },
      { t: 'ul', items: [
        '<strong>Cuerpo y armas:</strong> macuahuitl, escudo, arco; técnicas de captura y resistencia física extrema.',
        '<strong>Mente y cosmos:</strong> astronomía, matemáticas, lectura de códices. El conocimiento era parte del armamento.',
        '<strong>Espíritu y resistencia:</strong> meditación, rituales de sangre, privaciones voluntarias. No había segunda oportunidad.',
        '<strong>Servicio comunitario:</strong> demostrar carácter y aptitud para liderar antes de ser admitidos.',
      ] },
      { t: 'h2', id: 'iniciacion', text: 'La iniciación en Malinalco' },
      { t: 'p', html: 'La subida al Cerro de los Ídolos no era accidental: cada escalón era parte del ritual. Al cruzar la boca de la serpiente, el guerrero moría como hombre común y renacía dentro de la cámara circular como Águila o Jaguar, custodio del sol. Dentro realizaba ofrendas de sangre en el orificio sagrado y recibía su atuendo.' },
      { t: 'h2', id: 'por-que', text: 'Por qué solo Malinalco' },
      { t: 'p', html: 'Tres razones: geográfica (posición estratégica vigilando rutas y el acueducto hacia Tenochtitlan), espiritual (territorio de Malinalxóchitl, diosa de la hechicería) y arquitectónica (solo aquí existía el Cuauhcalli, tallado en la roca viva). Un espacio que no pertenecía por completo al mundo humano.' },
      CTA_NEGOCIO,
    ],
    faq: [
      { q: '¿Qué eran los Guerreros Águila y Jaguar?', a: 'Las dos órdenes militares de élite del ejército azteca: el equivalente prehispánico de fuerzas especiales combinadas con una orden religiosa. Las Águilas representaban al sol y la guerra diurna; los Jaguares, la noche y el inframundo.' },
      { q: '¿Qué se necesitaba para ser Guerrero Águila o Jaguar?', a: 'Capturar al menos 4 enemigos vivos en combate, considerado una ofrenda a los dioses, y completar años de formación en el calmécac, la escuela de élite donde aprendían guerra, astronomía, matemáticas y filosofía.' },
      { q: '¿Por qué se iniciaban en Malinalco y no en Tenochtitlan?', a: 'Malinalco era el único lugar del imperio donde estas órdenes celebraban su iniciación. El Cuauhcalli, tallado en roca viva, se construyó para esas ceremonias; su energía espiritual y su arquitectura única lo hacían irremplazable.' },
      { q: '¿Cuál era la diferencia entre el Águila y el Jaguar?', a: 'El Águila representaba el sol y era explorador, espía y mensajero. El Jaguar representaba la noche e iba en las primeras filas por su ferocidad. Juntos representaban el equilibrio cósmico.' },
      { q: '¿Se puede visitar el templo donde se iniciaban?', a: 'Sí. El Cuauhcalli, en la zona arqueológica, abre de martes a domingo de 10:00 a 16:00. La entrada general cuesta ~$75–$85 MXN y los domingos es gratis para nacionales. Son unos 428 escalones de subida.' },
    ],
    relacionados: ['casa-de-las-aguilas', 'subida-cerro-idolos', 'convento-agustino-malinalco'],
  },

  {
    slug: 'subida-cerro-idolos',
    categoria: 'Mali Prehispánico',
    categoriaDirSlug: 'cultura',
    grupo: 'prehispanico',
    titulo: 'Guía para subir al Cerro de los Ídolos sin morir en el intento',
    subtitulo:
      'La diferencia no es la condición física. Es la preparación. Aquí la guía honesta para disfrutar los ~400 escalones, no sufrirlos.',
    excerpt:
      'Cómo subir al Cerro de los Ídolos de Malinalco: los ~400 escalones tramo por tramo, las 6 estructuras de arriba, qué llevar, horarios reales y secretos de local.',
    fechaISO: '2026-05-03',
    fechaDisplay: '3 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '7 min',
    imagen: '/img/articulos/subida-cerro-idolos.webp',
    imagenAlt: 'Escalinata de subida al Cerro de los Ídolos en Malinalco',
    cuerpo: [
      { t: 'p', html: 'Después de años recibiendo viajeros, lo tenemos claro: la diferencia entre disfrutar el Cerro de los Ídolos y sufrirlo no es la condición física, es la preparación. Dos datos que casi nadie te dice: la zona cierra los lunes y el último acceso es a las 15:00, no a las 16:00.' },
      { t: 'callout', titulo: 'Datos clave', items: [
        'Escalones: ~400 · Subida: 20–30 min.',
        'Entrada: ~$80–$85 MXN (domingos gratis para nacionales).',
        'Horario: 10:00–16:00, martes a domingo. Último acceso 15:00.',
        'Llega antes de las 11 am para una experiencia relajada.',
      ] },
      { t: 'h2', id: 'subida', text: 'La subida, tramo por tramo' },
      { t: 'ul', items: [
        '<strong>Escalones 1–100 · "El fácil engañoso":</strong> amplios y bien pavimentados. Tentador acelerar, pero guarda energía.',
        '<strong>Escalones 100–280 · "Se pone serio":</strong> peldaños irregulares y más pendiente. Punto ideal para hidratarte a la sombra.',
        '<strong>Escalones 280–400 · "La recompensa":</strong> la vegetación se abre, aparecen vistas del valle y, al final, el Cuauhcalli de frente.',
      ] },
      { t: 'p', html: 'Cada escalón hacia arriba es un paso hacia atrás en el tiempo. Llegas a 400 y estás en 1501.' },
      { t: 'h2', id: 'estructuras', text: 'Las 6 estructuras que ver arriba' },
      { t: 'ul', items: [
        '<strong>I · Cuauhcalli:</strong> la Casa de las Águilas, templo monolítico con la serpiente en la entrada.',
        '<strong>II · Pirámide truncada:</strong> la plataforma escalonada más grande, domina el complejo.',
        '<strong>III · Tzinacalli:</strong> "casa de los murciélagos", donde se honraba a los guerreros caídos.',
        '<strong>IV · Templo del Sol:</strong> circular, dedicado a Quetzalcóatl-Ehécatl.',
        '<strong>V · Temalácatl:</strong> piedra de sacrificio gladiatorio.',
        '<strong>VI · Adoratorio de Tláloc:</strong> pequeño santuario al dios de la lluvia, hacia la bajada.',
      ] },
      CTA_NEGOCIO,
      { t: 'h2', id: 'que-llevar', text: 'Qué llevar y qué no' },
      { t: 'ul', items: [
        '<strong>Lleva:</strong> agua (mín. 1 L), zapato cerrado con agarre, protector solar, gorra, un snack ligero y efectivo.',
        '<strong>Deja en casa:</strong> sandalias o tacones, comida para consumir dentro, mascotas y drones sin autorización.',
      ] },
      { t: 'callout', titulo: 'Secretos que nadie te cuenta', items: [
        'Mejor hora: 10:00–10:30 am; más fresco, sombras largas y menos gente.',
        'Paradoja del domingo: entrada gratis pero el día más lleno. Llega antes de 10:30 o espera a las 3 pm.',
        'Busca rastros de pintura en los muros del Cuauhcalli: restos de murales del siglo XVI visibles en el ángulo correcto.',
        'La bajada es más traicionera que la subida, sobre todo en lluvias.',
      ] },
      { t: 'p', html: 'Al bajar puedes tomar la escalinata al Rincón de San Miguel (adoratorio de Tláloc y un manantial prehispánico) y cerrar con el <a href="/categoria/cultura">convento agustino</a> a 5 minutos, para completar el círculo histórico.' },
    ],
    faq: [
      { q: '¿Cuántos escalones tiene en total?', a: 'Aproximadamente 400, en tres tramos. La subida toma 20–30 minutos a ritmo normal con descansos. No es técnico, pero los peldaños son irregulares; requiere calzado cómodo y condición básica.' },
      { q: '¿Cuánto cuesta la entrada?', a: 'Alrededor de $80–$85 MXN por persona. Domingos gratis para nacionales; adultos mayores con credencial INAPAM tienen 50% de descuento y menores de 13 entran gratis todos los días.' },
      { q: '¿Cuáles son los horarios reales?', a: 'Abre de martes a domingo a las 10:00 am. El último acceso es a las 15:00 (no a las 16:00). Cierra por completo a las 16:00 y todos los lunes. Conviene llegar antes de las 11 am.' },
      { q: '¿Pueden subir adultos mayores o niños pequeños?', a: 'Sí. Personas de 60 a 75 años lo completan a su ritmo con descansos, y los niños desde los 6 lo disfrutan. El secreto es no apresurarse: es una experiencia, no una carrera.' },
      { q: '¿Hay guías disponibles?', a: 'Sí, guías certificados por el INAH en la taquilla (no siempre están). Cuando los hay, la explicación en sitio transforma la visita.' },
    ],
    relacionados: ['casa-de-las-aguilas', 'guerreros-aguila-jaguar', '48-horas-malinalco'],
  },

  // ─────────────────────────── TU FINDE EN MALI ───────────────────────────
  {
    slug: '48-horas-malinalco',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: '48 horas en Malinalco: el itinerario que no desperdicia ni un minuto',
    subtitulo:
      'Malinalco condensa en dos días lo que otros destinos ofrecen en semanas: arqueología, mezcal, gastronomía de autor y naturaleza, sin tener que elegir.',
    excerpt:
      'Itinerario de 48 horas en Malinalco hora por hora: zona arqueológica, mezcal, museos, truchas y cena de autor. Un fin de semana completo sin perder el tiempo.',
    fechaISO: '2026-06-05',
    fechaDisplay: '5 de junio de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '9 min',
    imagen: '/img/articulos/48-horas-malinalco.webp',
    imagenAlt: 'Calle empedrada de Malinalco un fin de semana',
    cuerpo: [
      { t: 'p', html: 'Malinalco es un pueblo compacto: puedes ir de la zona arqueológica a un palenque de mezcal artesanal el mismo día, casi todo caminando o en mototaxi económico. Este itinerario aprovecha cada hora sin sentirse una carrera. ¿Dónde dormir? Revisa <a href="/categoria/hospedaje">Hospedaje</a>.' },
      { t: 'h2', id: 'dia-1', text: 'Día 1 (sábado): llegada, descubrimiento y primer mezcal' },
      { t: 'ul', items: [
        '<strong>8:30 am · Desayuno:</strong> Casa Valentina — baguettes y café de especialidad. Llega antes de las 9.',
        '<strong>10:00 am · Cultura:</strong> <a href="/categoria/cultura">zona arqueológica</a>, templo tallado en roca viva. ~$80 (gratis domingos). 45–60 min.',
        '<strong>12:00 pm · Museo:</strong> Museo Luis Mario Schneider — contexto de la historia local, visitas guiadas al mediodía.',
        '<strong>2:00 pm · Comida:</strong> Los Placeres — fusión regional con hongos silvestres y flores comestibles.',
        '<strong>4:30 pm · Experiencia:</strong> Mezcal La Cascada — recorrido completo del proceso, del agave al alambique.',
        '<strong>6:30 pm · Compras:</strong> Mercado Artesanal — textiles, cerámica y rebozos directo del artesano.',
        '<strong>8:30 pm · Cena:</strong> Caudillos — el consentido del barrio, cocina local y buenas bebidas.',
      ] },
      { t: 'h2', id: 'dia-2', text: 'Día 2 (domingo): naturaleza, espíritu y cierre' },
      { t: 'ul', items: [
        '<strong>9:00 am · Actividad + desayuno:</strong> Criadero de Truchas — pesca la tuya y te la preparan. A 2.4 km del centro, con albercas.',
        '<strong>11:00 am · Opcional:</strong> Museo Vivo Los Bichos — reptiles e insectos, ideal en familia.',
        '<strong>12:30 pm · Opcional:</strong> Santuario del Sr. de Chalma, a 15 minutos.',
        '<strong>3:00 pm · Bienestar:</strong> Centro Holístico Ollinyotl — spa y temazcal (reserva con anticipación). Más opciones en <a href="/categoria/belleza-y-bienestar">Belleza y Bienestar</a>.',
        '<strong>7:30 pm · Cena de cierre:</strong> Maíz Criollo — menú degustación de 3 tiempos (~$250–$300/persona, reservar).',
      ] },
      CTA_EXPERIENCIA,
      { t: 'callout', titulo: 'Logística', items: [
        'Cómo llegar: 80 km desde Santa Fe por la ruta Toluca–Tenancingo–Malinalco. Hay autobús desde Terminal Poniente.',
        'Mejor temporada: octubre–noviembre y febrero–mayo, buen clima sin lluvias ni multitudes.',
        'No necesitas auto para moverte dentro del pueblo: casi todo es caminable.',
      ] },
    ],
    faq: [
      { q: '¿Necesito auto para un fin de semana en Malinalco?', a: 'Para moverte dentro del pueblo no: casi todas las actividades son caminables o a corta distancia en mototaxi. El auto ayuda para llegar y para excursiones como Chalma.' },
      { q: '¿Vale la pena la zona arqueológica?', a: 'Totalmente. Es el único templo monolítico de América, tallado directo en la roca. Llega a las 10 am cuando abre para disfrutarla con menos gente.' },
      { q: '¿Es un buen destino para ir en familia?', a: 'Excelente, sobre todo por el criadero de truchas y el museo de bichos vivos, que encantan a los niños.' },
      { q: '¿Cuánto cuesta un fin de semana en Malinalco?', a: 'Para dos personas, alrededor de $3,000–$5,500 MXN según hospedaje y restaurantes, incluyendo comidas y actividades.' },
      { q: '¿Cuál es la mejor época para visitar?', a: 'De octubre a noviembre y de febrero a mayo: clima ideal sin lluvias frecuentes ni las multitudes del verano.' },
    ],
    relacionados: ['fin-de-semana-malinalco-cdmx', '3-dias-malinalco', 'casa-de-las-aguilas'],
  },

  {
    slug: 'fin-de-semana-malinalco-cdmx',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: 'Fin de semana en Malinalco desde CDMX: el itinerario express',
    subtitulo:
      '70 km desde Santa Fe, sin autopista de cuota. Viernes llegas, domingo ya extrañas el pueblo.',
    excerpt:
      'Fin de semana en Malinalco desde CDMX: la ruta sin cuota, el itinerario hora por hora de viernes a domingo y cuánto cuesta todo el viaje.',
    fechaISO: '2026-05-28',
    fechaDisplay: '28 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '5 min',
    imagen: '/img/articulos/fin-de-semana-malinalco-cdmx.webp',
    imagenAlt: 'Carretera hacia Malinalco entre montañas',
    cuerpo: [
      { t: 'p', html: 'La carretera a Malinalco pasa por Lerma y Tenango del Valle —un recorrido por el Estado de México que ya vale la pena por el paisaje—. No hay peaje en la ruta principal y la señalización es clara desde que sales de la ciudad.' },
      { t: 'h2', id: 'ruta', text: 'La ruta desde CDMX' },
      { t: 'ul', items: [
        '<strong>Santa Fe / Interlomas:</strong> ~70 km · 1 h 20 min · sin cuota.',
        '<strong>Perisur / Coyoacán:</strong> ~80 km · 1 h 35 min · sin cuota.',
        '<strong>Polanco / Lomas:</strong> ~85 km · 1 h 40 min · sin cuota.',
        '<strong>Toluca / Metepec:</strong> ~52 km · 55 min · lo más cercano.',
      ] },
      { t: 'p', html: '<strong>Tip clave:</strong> salir de CDMX entre 7:00 y 7:30 pm el viernes es el punto dulce: el Periférico y la México–Toluca ya están despejados y llegas hacia las 9–9:30 pm con el pueblo iluminado y los restaurantes abiertos.' },
      { t: 'h2', id: 'viernes', text: 'Viernes noche: llegada' },
      { t: 'ul', items: [
        '<strong>7:30 pm:</strong> salida de CDMX, tráfico ya despejado.',
        '<strong>9:00 pm:</strong> llegada y check-in; las calles empedradas iluminadas ya se sienten distintas.',
        '<strong>9:30 pm · Cena:</strong> El Pochote (hamburguesas y pizzas) o Casa Diablitos (mixología y botanas).',
      ] },
      { t: 'h2', id: 'sabado', text: 'Sábado: el día que lo justifica todo' },
      { t: 'ul', items: [
        '<strong>8:30 am · Desayuno:</strong> Casa Colibrí, vista extraordinaria al pueblo.',
        '<strong>10:00 am · <a href="/categoria/cultura">Zona arqueológica</a>:</strong> llega cuando abre; los primeros 45 min son los mejores.',
        '<strong>12:00 pm · Mercado Artesanal</strong> + Parroquia del Divino Salvador.',
        '<strong>1:30 pm · Comida:</strong> Maíz Criollo (autor, ~$270/p) o Pancho Villa (variedad, precio justo).',
        '<strong>4:00 pm:</strong> Criadero de Truchas (familias) u Ollinyotl, temazcal/masaje (parejas).',
        '<strong>7:00 pm · Mezcal La Cascada</strong> — recorrido de destilación con degustación.',
        '<strong>9:00 pm · Cena:</strong> Caudillos, ambiente local auténtico.',
      ] },
      { t: 'h2', id: 'domingo', text: 'Domingo: el regreso sin prisa' },
      { t: 'ul', items: [
        '<strong>9:00 am · Desayuno tardío:</strong> Casa Valentina, café de especialidad en terraza.',
        '<strong>10:30 am:</strong> última vuelta al mercado artesanal.',
        '<strong>11:00 am:</strong> check-out. Salir entre 11 y 12 evita el tráfico de regreso; en 1 h 30 estás en la ciudad.',
      ] },
      CTA_EXPERIENCIA,
      { t: 'h2', id: 'costo', text: '¿Cuánto cuesta el fin de semana?' },
      { t: 'ul', items: [
        '<strong>Hospedaje (2 noches):</strong> $3,600–$6,400 según propiedad y temporada. Compara en <a href="/categoria/hospedaje">Hospedaje</a>.',
        '<strong>Comidas (pareja, 2 días):</strong> ~$2,400–$3,200.',
        '<strong>Zona arqueológica:</strong> ~$170 (2 personas); gratis domingos.',
        '<strong>Criadero de truchas:</strong> ~$300–$500.',
        '<strong>Mezcal La Cascada:</strong> ~$200–$400.',
        '<strong>Gasolina ida y vuelta:</strong> ~$300–$400, sin cuota.',
      ] },
      { t: 'p', html: '<strong>Total estimado para una pareja:</strong> $6,000–$10,000 MXN el fin de semana completo, según el restaurante de la cena y si agregan spa.' },
    ],
    faq: [
      { q: '¿A qué distancia está Malinalco de la CDMX?', a: 'A 70 km desde Santa Fe y ~80 km desde Perisur o Coyoacán. El recorrido toma entre 1 h 20 min y 1 h 40 min en condiciones normales, sin autopista de cuota en la ruta principal.' },
      { q: '¿Se necesita autopista de cuota?', a: 'No. La ruta principal pasa por Lerma y Tenango del Valle sin peaje. El único costo es la gasolina, ~$300–$400 MXN ida y vuelta.' },
      { q: '¿A qué hora conviene salir de CDMX el viernes?', a: 'Después de las 7:00–7:30 pm, para evitar el tráfico del Periférico y la México–Toluca. Llegarás hacia las 9–9:30 pm con los restaurantes aún abiertos.' },
      { q: '¿Cuánto cuesta un fin de semana en Malinalco?', a: 'Para una pareja, entre $6,000 y $10,000 MXN todo incluido: hospedaje (2 noches), comidas, actividades y gasolina.' },
      { q: '¿Hay estacionamiento en Malinalco?', a: 'Sí, estacionamientos en el centro a precio accesible. En fin de semana conviene llegar antes de las 10 am. Las calles son empedradas y estrechas; lo ideal es estacionar y moverse a pie.' },
    ],
    relacionados: ['48-horas-malinalco', 'malinalco-con-familia', '3-dias-malinalco'],
  },

  {
    slug: 'malinalco-con-familia',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: 'Malinalco con familia: la guía que ningún turista tiene',
    subtitulo:
      'Zona arqueológica, museo de bichos vivos, truchas y albercas. Todo a 5 km del centro, todo a 70 km de la CDMX.',
    excerpt:
      'Qué hacer en Malinalco con niños: las 4 actividades estrella, un itinerario de viernes a domingo y dónde comer en familia sin complicaciones.',
    fechaISO: '2026-05-29',
    fechaDisplay: '29 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '5 min',
    imagen: '/img/articulos/malinalco-con-familia.webp',
    imagenAlt: 'Familia paseando por las calles de Malinalco',
    cuerpo: [
      { t: 'p', html: 'Los niños que vienen a Malinalco no piden regresar al hotel a ver televisión: el pueblo los absorbe. La zona arqueológica, el museo de bichos vivos y el criadero de truchas con albercas están en un radio de 5 km, en un pueblo donde las calles son de piedra y los árboles son más altos que los edificios.' },
      { t: 'h2', id: 'actividades', text: 'Las 4 actividades estrella' },
      { t: 'ul', items: [
        '<strong>Museo Vivo Los Bichos:</strong> la favorita de los niños, sin excepción. Serpientes, iguanas, tortugas y arañas; muchos se pueden tocar con guía. A 2.4 km del centro. 1.5–2 horas.',
        '<strong><a href="/categoria/cultura">Zona Arqueológica</a>:</strong> el único templo monolítico de América. Para mayores de 8 años es inolvidable. Domingos gratis para nacionales; llega a las 10 am.',
        '<strong>Criadero de Truchas + albercas:</strong> pescan su trucha, la pagan por kilo y se las preparan ahí mismo. Favorito absoluto de 5 a 12 años.',
        '<strong>Mercado Artesanal:</strong> el souvenir que los niños eligen ellos mismos. Artesanos trabajando en vivo, precios justos.',
      ] },
      { t: 'callout', titulo: 'Datos rápidos', items: [
        'Desde CDMX: ~70–80 km · 1 h 30, sin cuota.',
        'Presupuesto: ~$1,800–$2,800 por persona (hospedaje + comidas + actividades, 2 noches).',
        'Edad ideal: 5 años en adelante (la zona arqueológica tiene escaleras).',
        'No olvides: traje de baño y efectivo (varios sitios solo aceptan efectivo).',
      ] },
      { t: 'h2', id: 'itinerario', text: 'Itinerario: viernes noche a domingo' },
      { t: 'h3', text: 'Viernes noche' },
      { t: 'ul', items: [
        '<strong>8:00 pm:</strong> salida de CDMX después de las 7 para evitar tráfico.',
        '<strong>9:30 pm · Cena ligera:</strong> El Pochote o Terraza Xolo.',
      ] },
      { t: 'h3', text: 'Sábado — el día grande' },
      { t: 'ul', items: [
        '<strong>8:30 am · Desayuno:</strong> Casa Colibrí.',
        '<strong>10:00 am:</strong> Zona Arqueológica (90 min, llega temprano).',
        '<strong>12:30 pm · Comida:</strong> Pancho Villa.',
        '<strong>3:00 pm:</strong> Museo Vivo Los Bichos.',
        '<strong>7:00 pm · Cena:</strong> Caudillos.',
      ] },
      { t: 'h3', text: 'Domingo — el favorito de los niños' },
      { t: 'ul', items: [
        '<strong>9:00 am · Desayuno:</strong> Casa Valentina.',
        '<strong>11:00 am:</strong> Criadero de Truchas + albercas.',
        '<strong>3:00 pm:</strong> Mercado Artesanal, los souvenirs.',
        '<strong>4:30 pm:</strong> regreso a CDMX (salir entre 4 y 5 evita el tráfico).',
      ] },
      CTA_EXPERIENCIA,
    ],
    faq: [
      { q: '¿Qué hacer en Malinalco con niños?', a: 'Las cuatro estrella: Zona Arqueológica (gratis domingos para mexicanos), Museo Vivo Los Bichos, Criadero de Truchas con albercas y el Mercado Artesanal. Todo en un radio de 5 km del centro.' },
      { q: '¿Cuánto cuesta la Zona Arqueológica de Malinalco?', a: 'Alrededor de $85 MXN por adulto; domingos gratis para mexicanos. Abre de martes a domingo de 10 am a 5 pm. Conviene llegar cuando abre para evitar el calor y los grupos.' },
      { q: '¿Hay albercas en Malinalco?', a: 'Sí, el Criadero de Truchas cuenta con albercas, una de las actividades más disfrutadas por familias con niños. Se combina perfecto con la pesca en el mismo lugar.' },
      { q: '¿Malinalco queda lejos de la CDMX?', a: 'No. Está a 70 km desde Santa Fe y ~80 km desde Perisur, alrededor de 1 h 20–40 min. La ruta principal no requiere autopista de cuota.' },
      { q: '¿A qué edad pueden ir los niños a la Zona Arqueológica?', a: 'Pueden entrar desde pequeños, pero la experiencia es más significativa a partir de los 6–8 años. Hay escalones y subidas; el calzado cómodo es esencial.' },
    ],
    relacionados: ['48-horas-malinalco', 'escapada-romantica-malinalco', 'fin-de-semana-malinalco-cdmx'],
  },

  {
    slug: 'escapada-romantica-malinalco',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: 'Escapada romántica a Malinalco: el destino que los dos merecen',
    subtitulo:
      'Cenas de autor, temazcal en pareja, mezcal artesanal y el único templo monolítico de América. Todo a 70 km de la CDMX.',
    excerpt:
      'Guía para una escapada romántica a Malinalco: las 4 experiencias estrella, un itinerario de fin de semana y dónde cenar en pareja en el Pueblo Mágico.',
    fechaISO: '2026-05-30',
    fechaDisplay: '30 de mayo de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '5 min',
    imagen: '/img/articulos/escapada-romantica-malinalco.webp',
    imagenAlt: 'Atardecer romántico sobre Malinalco',
    cuerpo: [
      { t: 'p', html: 'Lo que hace que un fin de semana romántico funcione de verdad en Malinalco no es el lujo: es la autenticidad del destino. Un pueblo con gastronomía de nivel, temazcal en pareja, calles empedradas para caminar sin rumbo y una zona arqueológica única, a 70 km de la ciudad y sin masificación.' },
      { t: 'h2', id: 'experiencias', text: 'Las 4 experiencias estrella' },
      { t: 'ul', items: [
        '<strong>Temazcal en pareja — Ollinyotl:</strong> la experiencia más solicitada. Temazcal, masajes y yoga; sesión al atardecer. Reserva con anticipación. Más en <a href="/categoria/belleza-y-bienestar">Belleza y Bienestar</a>.',
        '<strong>Cena de autor — Maíz Criollo:</strong> el mejor restaurante para una cena romántica, 3 tiempos con ingrediente local (~$250–$300/persona).',
        '<strong><a href="/categoria/cultura">Zona arqueológica</a> al amanecer:</strong> los primeros 30 minutos, antes de los grupos, son los más especiales.',
        '<strong>Mezcal artesanal — La Cascada:</strong> el broche perfecto, con recorrido de producción incluido.',
      ] },
      { t: 'callout', titulo: 'Datos rápidos', items: [
        'Desde CDMX: ~70–80 km · 1 h 30, sin cuota. Salir viernes 7 pm+.',
        'Presupuesto pareja: $4,500–$7,000 total (2 noches, cenas, spa y actividades).',
        'Mejor temporada: todo el año (nov–mar seco; abr–oct verde exuberante).',
        'Reserva temazcal y Maíz Criollo con anticipación: se llenan rápido.',
      ] },
      { t: 'h2', id: 'itinerario', text: 'Itinerario: viernes noche a domingo' },
      { t: 'h3', text: 'Viernes noche' },
      { t: 'ul', items: [
        '<strong>9:30 pm · Aperitivo:</strong> Casa Valentina, coctelería y terraza íntima.',
        '<strong>10:30 pm · Cena:</strong> Caudillos (tranquilo) o Casa Diablitos (animado).',
      ] },
      { t: 'h3', text: 'Sábado' },
      { t: 'ul', items: [
        '<strong>8:30 am · Desayuno:</strong> Casa Colibrí, con vista.',
        '<strong>10:00 am:</strong> Zona Arqueológica (90 min).',
        '<strong>1:00 pm · Comida:</strong> Los Placeres, cocina gourmet sin prisa.',
        '<strong>4:00 pm · Temazcal en pareja:</strong> Ollinyotl, al atardecer.',
        '<strong>8:30 pm · Cena de autor:</strong> Maíz Criollo.',
      ] },
      { t: 'h3', text: 'Domingo sin prisa' },
      { t: 'ul', items: [
        '<strong>9:30 am · Desayuno tardío:</strong> Casa Valentina.',
        '<strong>11:00 am · Mercado Artesanal:</strong> elijan juntos un recuerdo (plata, obsidiana, textiles).',
        '<strong>12:30 pm · Mezcal La Cascada:</strong> una botella firmada como souvenir.',
      ] },
      CTA_EXPERIENCIA,
    ],
    faq: [
      { q: '¿Por qué Malinalco es bueno para una escapada romántica?', a: 'Combina lo que pocos destinos tienen juntos: autenticidad, gastronomía de nivel, spa con temazcal en pareja, zona arqueológica única en América y calles empedradas para caminar. Todo a 70 km de la CDMX sin masificación.' },
      { q: '¿Qué es el Centro Holístico Ollinyotl?', a: 'El spa más especial de Malinalco: temazcal, masajes terapéuticos, yoga y terapias alternativas. El temazcal en pareja al atardecer es lo más solicitado; conviene reservar con anticipación.' },
      { q: '¿Cuál es el mejor restaurante romántico en Malinalco?', a: 'Maíz Criollo es el favorito para cenas románticas. Para aperitivos o postres, Casa Valentina tiene la mejor terraza, y Los Placeres es ideal para comidas largas.' },
      { q: '¿Hay temazcal en Malinalco?', a: 'Sí, el Centro Holístico Ollinyotl ofrece temazcal en pareja. Se agota con frecuencia: reserva al menos una semana antes en puentes y 2–3 días en fines de semana normales.' },
      { q: '¿Cuánto cuesta una escapada romántica a Malinalco?', a: 'El presupuesto promedio para una pareja en un fin de semana es de $4,500–$7,000 MXN todo incluido, según el hospedaje, las cenas y si agregan spa.' },
    ],
    relacionados: ['malinalco-con-familia', '48-horas-malinalco', 'pesca-trucha-mezcal-malinalco'],
  },

  {
    slug: '3-dias-malinalco',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: '3 días en Malinalco: arqueología, mezcal y un día en Chalma',
    subtitulo:
      'Tres días son el tiempo ideal para descubrir Malinalco a fondo: historia prehispánica, destilados artesanales y uno de los santuarios más importantes de México.',
    excerpt:
      'Itinerario de 3 días en Malinalco: zona arqueológica, mezcal y truchas, museo y una excursión al Santuario de Chalma. Qué hacer, ver y comer día por día.',
    fechaISO: '2026-06-10',
    fechaDisplay: '10 de junio de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '5 min',
    imagen: '/img/articulos/3-dias-malinalco.webp',
    imagenAlt: 'Paisaje de Malinalco y su cañón',
    cuerpo: [
      { t: 'p', html: 'Tres días permiten ver Malinalco sin correr y sumar una joya cercana: el Santuario del Señor de Chalma, a 15 minutos. Este es el itinerario para aprovecharlos. ¿Dónde quedarte? Compara en <a href="/categoria/hospedaje">Hospedaje</a>.' },
      { t: 'callout', titulo: 'Datos rápidos', items: [
        'Distancia desde CDMX: ~80 km · 1 h 30.',
        'Presupuesto: $2,500–$3,500 por persona (hospedaje, comidas, actividades).',
        'Ideal para: puentes largos o vacaciones.',
        'Lleva: calzado cómodo y efectivo.',
      ] },
      { t: 'h2', id: 'dia-1', text: 'Día 1 — Llegada y zona arqueológica' },
      { t: 'ul', items: [
        '<strong>8:00 am · Desayuno:</strong> Casa Valentina.',
        '<strong>10:00 am · <a href="/categoria/cultura">Zona Arqueológica</a>:</strong> 90 min, sube temprano antes del calor.',
        '<strong>1:30 pm · Comida:</strong> Maíz Criollo (autor, ~$270/p) o Pancho Villa.',
        '<strong>4:00 pm:</strong> Mercado Artesanal y centro histórico; la Parroquia del Divino Salvador vale la parada.',
        '<strong>7:00 pm · Cena:</strong> Caudillos o Casa Diablitos.',
      ] },
      { t: 'h2', id: 'dia-2', text: 'Día 2 — Mezcal, truchas y museo' },
      { t: 'ul', items: [
        '<strong>8:30 am · Desayuno:</strong> Casa Colibrí, con vista.',
        '<strong>10:30 am · Mezcal La Cascada:</strong> recorrido de producción artesanal y cata.',
        '<strong>12:30 pm · Criadero de Truchas:</strong> pesca y albercas, a 2.4 km del centro.',
        '<strong>4:00 pm · Museo Dr. Luis Mario Schneider:</strong> historia y cultura local.',
        '<strong>7:00 pm · Cena:</strong> Los Placeres, fusión con ingrediente local.',
      ] },
      { t: 'h2', id: 'dia-3', text: 'Día 3 — Chalma y regreso' },
      { t: 'ul', items: [
        '<strong>8:00 am · Santuario del Señor de Chalma:</strong> a 15 minutos; ve antes de las 9 am para una experiencia distinta. Paisaje de cañón y río.',
        '<strong>11:00 am · Ollinyotl (opcional):</strong> masaje o terapias; reserva con anticipación.',
        '<strong>1:30 pm · Comida:</strong> Las Palomas, trucha y mezcal de despedida.',
        '<strong>4:00 pm:</strong> regreso a CDMX o Toluca (salir entre 4 y 5 pm evita tráfico).',
      ] },
      CTA_EXPERIENCIA,
    ],
    faq: [
      { q: '¿Qué ver en Malinalco en 3 días?', a: 'Zona arqueológica, Mezcal La Cascada, criadero de truchas, Museo Dr. Luis Mario Schneider, Mercado Artesanal y el Santuario de Chalma. Tres días permiten verlo todo sin prisa.' },
      { q: '¿Qué tan lejos está Chalma de Malinalco?', a: 'A solo 15 minutos en auto. Es una excursión de medio día; conviene ir entre semana o muy temprano el lunes para evitar multitudes de peregrinos.' },
      { q: '¿Cuál es la mejor época para visitar?', a: 'Es destino de todo el año. De noviembre a marzo hay clima seco y fresco, ideal para la zona arqueológica; de abril a octubre la vegetación es exuberante pero con lluvias por la tarde.' },
      { q: '¿Hay estacionamiento?', a: 'Sí, estacionamiento accesible en el centro. En fin de semana conviene llegar antes de las 10 am. Las calles estrechas hacen preferible estacionar y caminar.' },
      { q: '¿Se puede hacer sin auto?', a: 'Es posible pero incómodo: hay autobuses desde Toluca, pero para una excursión a Chalma y moverse con comodidad, el auto es lo más práctico.' },
    ],
    relacionados: ['48-horas-malinalco', 'ruta-5-dias-malinalco', 'fin-de-semana-malinalco-cdmx'],
  },

  {
    slug: 'ruta-5-dias-malinalco',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: 'Ruta de 5 días: Malinalco → Chalma → Tenancingo → Valle de Bravo',
    subtitulo:
      'Cuatro destinos, cinco días, un solo circuito por el sur del Estado de México. Sin repetir carretera.',
    excerpt:
      'Ruta de 5 días por el sur del Estado de México con base en Malinalco: Chalma, Tenancingo y Valle de Bravo. Itinerario día por día, costos y tips prácticos.',
    fechaISO: '2026-06-17',
    fechaDisplay: '17 de junio de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '4 min',
    imagen: '/img/articulos/ruta-5-dias-malinalco.webp',
    imagenAlt: 'Ruta por los pueblos del sur del Estado de México',
    cuerpo: [
      { t: 'p', html: 'Esta ruta conecta los cuatro destinos más destacados del sur del Estado de México en un circuito lógico desde la CDMX. Base en Malinalco los primeros días, excursión a Chalma y Tenancingo, y cierre en Valle de Bravo —sin regresar dos veces por el mismo camino. Arranca eligiendo <a href="/categoria/hospedaje">dónde hospedarte</a> en Malinalco.' },
      { t: 'callout', titulo: 'La ruta de un vistazo', items: [
        'CDMX → Malinalco (días 1–3) → Chalma → Tenancingo (día 4) → Valle de Bravo (día 5) → CDMX.',
        'Transporte: auto propio muy recomendado.',
        'Costo: ~$4,000–$5,500 por persona, todo incluido.',
        'Ideal para: puente largo (Semana Santa, noviembre), parejas o grupos de 2–6.',
      ] },
      { t: 'h2', id: 'dia-1', text: 'Día 1 — Malinalco + zona arqueológica' },
      { t: 'ul', items: [
        'Salir temprano de CDMX, llegar ~10 am a la <a href="/categoria/cultura">zona arqueológica</a> (reserva 90 min).',
        'Comida: Maíz Criollo o Pancho Villa.',
        'Tarde: Mercado Artesanal y Barrio de San Juan. Noche: Caudillos o Casa Diablitos.',
      ] },
      { t: 'h2', id: 'dia-2', text: 'Día 2 — Mezcal, truchas y museo' },
      { t: 'ul', items: [
        'Desayuno en Casa Colibrí.',
        'Mezcal La Cascada (tour + cata) y Criadero de Truchas (pesca + albercas).',
        'Museo Dr. Luis Mario Schneider. Cena: Los Placeres.',
      ] },
      { t: 'h2', id: 'dia-3', text: 'Día 3 — Chalma + traslado a Tenancingo' },
      { t: 'ul', items: [
        'Santuario del Señor de Chalma antes de las 9 am (15 min desde Malinalco).',
        'Almuerzo de despedida en Las Palomas (trucha y mezcal).',
        'Traslado a Tenancingo (~25 min): rebozos, flores y el Convento del Carmen.',
      ] },
      { t: 'h2', id: 'dia-4', text: 'Día 4 — Tenancingo + camino a Valle de Bravo' },
      { t: 'ul', items: [
        'Mercado de flores y artesanos de rebozos; compra uno directo del artesano.',
        'Traslado a Valle de Bravo (~1 h 15). Tarde: malecón, lago y la hora dorada en el muelle.',
      ] },
      { t: 'h2', id: 'dia-5', text: 'Día 5 — Valle de Bravo + regreso' },
      { t: 'ul', items: [
        'Paseo en lancha o senderismo; Valle es paraíso del parapente, kayak y ciclismo de montaña.',
        'Comida con terraza al lago. Regreso a CDMX (~2 h 30); salir antes de las 4 pm.',
      ] },
      CTA_EXPERIENCIA,
      { t: 'callout', titulo: 'Tips', items: [
        'Lleva efectivo: varios sitios no aceptan tarjeta.',
        'Chalma entre semana es completamente distinto a fin de semana.',
        'En temporada alta, reserva las actividades acuáticas de Valle con anticipación.',
        'El tráfico de regreso desde Valle el domingo puede ser pesado; considera salir el lunes al amanecer.',
      ] },
    ],
    faq: [
      { q: '¿Cuáles son los pueblos mágicos del sur del Estado de México?', a: 'Malinalco y Valle de Bravo son Pueblo Mágico oficial. La ruta se complementa con Chalma (santuario de peregrinación) y Tenancingo (rebozos y mercado de flores). Juntos forman el mejor circuito del sur del EDOMEX.' },
      { q: '¿Se puede hacer la ruta sin auto?', a: 'Es posible pero incómodo. Hay autobuses desde Toluca a Malinalco y a Valle de Bravo, pero los tiempos aumentan mucho. Para 5 días y varios destinos, el auto propio es lo más práctico.' },
      { q: '¿En qué orden conviene hacerla?', a: 'El orden más eficiente es CDMX → Malinalco → Chalma → Tenancingo → Valle de Bravo → CDMX. Así no repites carretera y los traslados son cortos (25–75 min).' },
      { q: '¿Cuánto cuesta la ruta de 5 días?', a: 'Alrededor de $4,000–$5,500 MXN por persona, todo incluido, según hospedaje y actividades.' },
      { q: '¿Cuál es la mejor temporada para hacerla?', a: 'Los puentes largos como Semana Santa y noviembre son ideales. De noviembre a marzo hay clima seco; de abril a octubre, vegetación exuberante con lluvias por la tarde.' },
    ],
    relacionados: ['3-dias-malinalco', '48-horas-malinalco', 'fin-de-semana-malinalco-cdmx'],
  },

  {
    slug: 'festival-cultural-malinalco',
    categoria: 'Tu Finde en Mali',
    grupo: 'finde',
    titulo: 'Festival Cultural de Malinalco 2026: el regreso que el pueblo esperó 8 años',
    subtitulo:
      'Del 16 al 18 de octubre, el pueblo entero se vuelve escenario: +50 actividades gratuitas en 11 sedes. El escenario no es un recinto, es Malinalco.',
    excerpt:
      'Festival Cultural de Malinalco 2026 (16–18 de octubre): programa día por día, lo imperdible, las 11 sedes y consejos para vivirlo. Entrada libre.',
    fechaISO: '2026-09-23',
    fechaDisplay: '23 de septiembre de 2026',
    autor: 'Equipo En Malinalco',
    lectura: '6 min',
    imagen: '/img/articulos/festival-cultural-malinalco.webp',
    imagenAlt: 'Festival Cultural en las calles de Malinalco',
    cuerpo: [
      { t: 'p', html: 'Después de ocho años, el Festival Cultural de Malinalco regresa. Del 16 al 18 de octubre de 2026 el pueblo se transforma en un escenario al aire libre con más de 50 actividades culturales gratuitas en capillas, plazas, el convento y los jardines.' },
      { t: 'callout', titulo: 'Datos clave', items: [
        'Fechas: 16–18 de octubre de 2026.',
        'Más de 50 actividades, en 11 sedes.',
        'Quinta edición, tras 8 años de ausencia.',
        'Entrada libre ($0).',
      ] },
      { t: 'h2', id: 'que-es', text: '¿Qué es el Festival Cultural?' },
      { t: 'p', html: 'Es el encuentro artístico más importante del municipio. Esta quinta edición fue seleccionada por el PROFEST y organizada por la Secretaría de Cultura y Turismo del Estado de México. Su rasgo distintivo: el escenario no es un recinto, es el pueblo entero. Las ediciones previas fueron en 2014, 2015, 2016 y 2018; se esperan entre 25,000 y 40,000 visitantes.' },
      { t: 'h2', id: 'programa', text: 'Qué esperar cada día' },
      { t: 'ul', items: [
        '<strong>Viernes 16 (apertura):</strong> inauguración y primeras exposiciones en la Casa de Cultura y el Museo Luis Mario Schneider; por la noche, conciertos y callejoneadas.',
        '<strong>Sábado 17 (día principal):</strong> talleres y actividades infantiles por la mañana; danza, conferencias y recorridos por la tarde; por la noche, la obra "Malinalxóchitl, la sublimación de un destino" y la Orquesta Filarmónica Mexiquense.',
        '<strong>Domingo 18 (clausura):</strong> recorridos finales, música de cámara y ceremonia de cierre.',
      ] },
      { t: 'h2', id: 'imperdible', text: 'Lo imperdible' },
      { t: 'ul', items: [
        '<strong>"Malinalxóchitl, la sublimación de un destino":</strong> obra teatral sobre la diosa-hechicera que nombra y funda el pueblo.',
        '<strong>Orquesta Filarmónica Mexiquense:</strong> música sinfónica y de cámara en espacios históricos.',
        '<strong>Callejoneadas:</strong> música y procesiones por las calles empedradas.',
        '<strong>Talleres, exposiciones y encuentros con artesanos.</strong>',
      ] },
      { t: 'h2', id: 'sedes', text: 'Las 11 sedes' },
      { t: 'ul', items: [
        'Convento Agustino (de la Transfiguración, siglo XVI).',
        'Parroquia del Divino Salvador.',
        'Capillas de San Juan, Santa Mónica y Santa María.',
        'Museo Luis Mario Schneider.',
        'Casa de Cultura Malinalxóchitl, Teatro Municipal, Explanada Cívica y Jardín.',
      ] },
      CTA_EXPERIENCIA,
      { t: 'callout', titulo: 'Consejos para vivirlo', items: [
        'Hospédate ya: la disponibilidad se agota rápido. Revisa <a href="/categoria/hospedaje">Hospedaje</a>.',
        'Llega temprano: el estacionamiento central se satura; muévete a pie.',
        'Lleva efectivo: muchos puestos no aceptan tarjeta.',
        'Lleva calzado cómodo y una chamarra ligera para la noche de octubre.',
        'Elige 3–4 actividades prioritarias en vez de intentar las 50.',
      ] },
    ],
    faq: [
      { q: '¿Cuándo es el Festival Cultural de Malinalco 2026?', a: 'Del 16 al 18 de octubre de 2026, de viernes a domingo.' },
      { q: '¿Cuánto cuesta la entrada?', a: 'Es completamente gratis: más de 50 actividades en 11 sedes, todas con entrada libre.' },
      { q: '¿Qué actividades hay?', a: 'Música de cámara y sinfónica, teatro, danza, talleres, conferencias, exposiciones, cuentacuentos, recorridos, callejoneadas, programación infantil y encuentros con artesanos.' },
      { q: '¿Dónde se realiza?', a: 'En 11 sedes dentro del centro histórico del Pueblo Mágico, todas a distancia caminable entre sí.' },
      { q: '¿Conviene reservar hospedaje con anticipación?', a: 'Sí, totalmente. Se esperan hasta 40,000 visitantes y la disponibilidad se agota rápido en fines de semana de festival.' },
    ],
    relacionados: ['malinalco-pueblo-magico-historia', '48-horas-malinalco', 'barrios-de-malinalco'],
  },
]

// Índice rápido por slug.
export const ARTICULO_POR_SLUG = Object.fromEntries(
  ARTICULOS.map((a) => [a.slug, a])
)

export function getArticulo(slug) {
  return ARTICULO_POR_SLUG[slug] || null
}

export function getTodosLosSlugs() {
  return ARTICULOS.map((a) => a.slug)
}

// Artículos de un grupo, en el orden en que aparecen en ARTICULOS.
export function getArticulosPorGrupo(grupoId) {
  return ARTICULOS.filter((a) => a.grupo === grupoId)
}
