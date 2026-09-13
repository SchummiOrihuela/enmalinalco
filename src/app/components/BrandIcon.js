// Logos de marca en tiles elegantes, compartidos por el panel y la ficha pública.
// Componente presentacional puro (sirve en server y client components).

const BRANDS = {
  address: {
    bg: 'linear-gradient(135deg,#3A6B47,#1C3B28)',
    svg: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  phone: {
    bg: 'linear-gradient(135deg,#3A6B47,#1C3B28)',
    svg: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.7 2.73a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  whatsapp: {
    bg: '#25D366',
    svg: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.7 2.73a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  instagram: {
    bg: 'linear-gradient(45deg,#F58529,#DD2A7B 55%,#8134AF)',
    svg: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="#fff" stroke="none" />
      </>
    ),
  },
  facebook: {
    bg: '#1877F2',
    fill: true,
    svg: (
      <path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  maps: {
    bg: '#EA4335',
    svg: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
      </>
    ),
  },
}

export function BrandTile({ brand, size = 40 }) {
  const cfg = BRANDS[brand]
  if (!cfg) return null
  const glyph = Math.round(size * 0.5)
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.28),
      flexShrink: 0,
      background: cfg.bg,
      boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
    }}>
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill={cfg.fill ? '#fff' : 'none'}
        stroke={cfg.fill ? 'none' : '#fff'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {cfg.svg}
      </svg>
    </span>
  )
}
