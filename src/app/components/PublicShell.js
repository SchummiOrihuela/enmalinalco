import Link from 'next/link'

// Envoltorio de las páginas públicas (categoría y ficha):
// nav elegante con logo + fondo creativo (verde cálido con formas orgánicas).
// Componente de servidor, sin estado.
export default function PublicShell({ children }) {
  return (
    <div style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', background: '#243020' }}>
      {/* Fondo: degradado + destellos de color (nada de gris plano) */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(1100px 560px at 50% -10%, rgba(220,178,74,0.14), transparent 60%),' +
          'radial-gradient(900px 520px at 110% 8%, rgba(124,182,137,0.12), transparent 58%),' +
          'radial-gradient(760px 560px at -12% 46%, rgba(191,80,40,0.08), transparent 55%),' +
          'linear-gradient(180deg, #24311F 0%, #2B3A2B 55%, #263120 100%)',
      }} />

      {/* Forma-fondo: colinas orgánicas abajo (capas de verde) */}
      <svg aria-hidden viewBox="0 0 1440 320" preserveAspectRatio="none" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '42vh',
        pointerEvents: 'none', opacity: 0.55,
      }}>
        <path fill="#2E3D28" d="M0,220 C240,150 420,270 720,220 C1020,170 1200,260 1440,210 L1440,320 L0,320 Z" />
        <path fill="#33452C" d="M0,260 C260,210 480,300 780,255 C1080,210 1260,290 1440,250 L1440,320 L0,320 Z" />
        <path fill="#1F2A1B" d="M0,295 C300,265 520,315 820,290 C1120,265 1280,310 1440,292 L1440,320 L0,320 Z" />
      </svg>

      {/* Sol/luna: círculo dorado difuso arriba a la derecha */}
      <div aria-hidden style={{
        position: 'absolute', top: '-70px', right: '-40px', width: 260, height: 260,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(220,178,74,0.22), transparent 68%)',
      }} />

      {/* Nav superior con logo */}
      <header style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px clamp(20px, 5vw, 48px)',
        background: 'linear-gradient(180deg, rgba(28,59,40,0.92), rgba(28,59,40,0.72))',
        borderBottom: '1px solid rgba(220,178,74,0.18)',
        backdropFilter: 'blur(6px)',
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2,16 C3,8.5 9,3.5 16,3.5 C23,3.5 29,8.5 30,16 Z" fill="#3F6B4B"/>
            <path d="M8,18.4 L24,18.4 L28,26.6 L4,26.6 Z" fill="#CBBBA0"/>
            <path d="M6.6,24.3 L25.4,24.3 M7.5,22 L24.5,22 M8.4,19.9 L23.6,19.9" stroke="#9A8A6E" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M8,18.4 L4,26.6 M24,18.4 L28,26.6" stroke="#A99A7E" strokeWidth="0.6"/>
            <rect x="7.6" y="12.9" width="16.8" height="5.6" fill="#BBAA8D"/>
            <rect x="9.4" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
            <rect x="20.2" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
            <path d="M14,18.5 L14,14.6 C14,13.6 14.9,13.1 16,13.1 C17.1,13.1 18,13.6 18,14.6 L18,18.5 Z" fill="#2A2016"/>
            <path d="M16,3.2 C18.4,6.8 22,10.6 25,12.9 L7,12.9 C10,10.6 13.6,6.8 16,3.2 Z" fill="#D9A94A"/>
            <path d="M8.8,11.6 Q16,8.8 23.2,11.6 M10.4,9.6 Q16,7.4 21.6,9.6 M12,7.7 Q16,6.2 20,7.7" stroke="#B0863A" strokeWidth="0.55" fill="none"/>
            <circle cx="16" cy="3.4" r="0.7" fill="#B0863A"/>
          </svg>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: '#F2EDE3', letterSpacing: '-0.01em' }}>
            en<em style={{ color: '#A8D6B0', fontStyle: 'italic' }}>malinalco</em>
          </span>
        </Link>
        <Link href="/#categorias" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(242,237,227,0.8)', textDecoration: 'none' }}>
          Directorio
        </Link>
      </header>

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
