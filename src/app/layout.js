import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const SITE_URL = "https://enmalinalco.com";
const TITLE = "En Malinalco — Guía del Pueblo Mágico";
const DESCRIPTION =
  "La guía y el directorio de Malinalco, Pueblo Mágico del Estado de México. Restaurantes, hoteles, rutas y secretos locales, hechos por quienes vivimos aquí.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "enmalinalco.com",
    locale: "es_MX",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "enmalinalco.com — Guía del Pueblo Mágico de Malinalco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

const themeScript = `(function(){try{document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      q: "¿Qué es enmalinalco.com?",
      a: "enmalinalco.com es la guía y el directorio de Malinalco, hechos por quienes vivimos aquí. Reúne restaurantes, hospedaje, artesanías, cultura y ecoturismo, junto con rutas, historias y recomendaciones locales, para que encuentres todo lo que vale la pena en un solo lugar.",
    },
    {
      q: "¿Cómo registro mi negocio en el directorio?",
      a: "Muy fácil: entra a la sección Para negocios, elige un plan y crea tu cuenta. Si prefieres, escríbenos y te ayudamos a armar tu ficha con fotos, contacto, ubicación y horarios. En minutos tu negocio queda visible para quienes buscan en Malinalco.",
    },
    {
      q: "¿Cuánto cuesta anunciar mi negocio?",
      a: "Hay tres planes mensuales en pesos: Malinalli $99, Cuāuhtli $249 y Ocēlōtl $449. Además, los primeros 15 negocios entran como Fundadores con 2 meses gratis en Cuāuhtli u Ocēlōtl, sin permanencia y cancelando cuando quieran.",
    },
    {
      q: "¿Qué incluye cada plan?",
      a: "Malinalli te da 3 fotos, contacto, ubicación y horarios visibles toda la semana. Cuāuhtli suma 10 fotos, mejor posición en tu categoría, insignia Recomendado, una mención al mes en redes y reporte de visitas. Ocēlōtl llega hasta 30 fotos, primer lugar en tu categoría, tu historia contada, aparición en portada y línea directa por WhatsApp.",
    },
    {
      q: "¿Qué se puede hacer en Malinalco?",
      a: "En Malinalco puedes subir a la zona arqueológica, con su templo azteca tallado en roca viva; recorrer el mercado artesanal; visitar la Parroquia del Divino Salvador y el Museo Mario Schneider; conocer el criadero de truchas y probar la gastronomía local. Es un Pueblo Mágico para caminar con calma, entre calles empedradas y montañas.",
    },
    {
      q: "¿Cómo llego a Malinalco desde CDMX o Toluca?",
      a: "Desde la Ciudad de México son entre 2 y 2.5 horas en auto, normalmente por la ruta hacia Chalma. Desde Toluca es más rápido, alrededor de 1.5 horas. También hay transporte foráneo que conecta con el pueblo, aunque lo más cómodo es llegar en coche para moverte por la zona.",
    },
    {
      q: "¿Qué hacer en un fin de semana en Malinalco?",
      a: "Un plan ideal de dos días: el sábado por la mañana sube a la zona arqueológica, baja a desayunar al centro y recorre el mercado y la parroquia; por la tarde, un museo y un café tranquilo. El domingo, naturaleza: el criadero de truchas, un paseo entre montañas o una visita a Chalma, y comida local antes de volver. Todo a ritmo de pueblo, sin prisas.",
    },
    {
      q: "¿Dónde comer y hospedarse en Malinalco?",
      a: "Hay desde fondas del mercado y trucha fresca hasta restaurantes con vista, y opciones de hospedaje que van de hoteles boutique a casas y cabañas entre montañas. En nuestro directorio encuentras lugares elegidos por locales, con fotos, contacto y ubicación.",
    },
    {
      q: "¿Cuál es la mejor época para visitar Malinalco?",
      a: "Malinalco es bonito todo el año por su clima templado. La temporada de lluvias (verano) deja el paisaje más verde; el otoño e invierno son ideales para caminar sin calor. Los fines de semana largos y puentes son los más concurridos, así que si buscas tranquilidad, entre semana o temprano por la mañana es perfecto.",
    },
    {
      q: "¿Cómo contacto al equipo de enmalinalco?",
      a: "Escríbenos al correo soporte@enmalinalco.com o usa el formulario de contacto del sitio. Con mucho gusto te ayudamos a registrar tu negocio, corregir información o resolver cualquier duda como visitante.",
    },
  ].map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
