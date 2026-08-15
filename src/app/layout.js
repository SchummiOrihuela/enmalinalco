import "./globals.css";
import ThemeToggle from "./ThemeToggle";

export const metadata = {
  title: "En Malinalco — Guía del Pueblo Mágico",
  description:
    "La guía más completa de Malinalco, Pueblo Mágico del Estado de México. Restaurantes, hoteles, rutas y secretos locales.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('em-theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
