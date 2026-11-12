'use client'

// 🐆→👁 Ojo de Jaguar — la marca.
// El ojo felino que "ve en la oscuridad lo que nadie ve": iris encendido con halo,
// fibras finas del iris (como un ojo real) y pupila vertical. Todo en oro.
// Úsalo en JSX: <OjoJaguar size={46} />. Para HTML/canvas usa ojoJaguarSVG().
import { useId } from 'react'

export default function OjoJaguar({ size = 44, glow = true, style }) {
  const uid = useId().replace(/[:]/g, '')
  const gGold = `ojg-gold-${uid}`
  const gIris = `ojg-iris-${uid}`
  const fGlow = `ojg-glow-${uid}`
  const cIris = `ojg-clip-${uid}`
  const fibras = [
    [36, 22], [36, 50], [48, 28], [24, 28], [48, 44], [24, 44],
    [44, 24], [28, 24], [44, 48], [28, 48], [50, 36], [22, 36],
    [41, 26], [31, 26], [41, 46], [31, 46],
  ]
  return (
    <svg
      width={size} height={size} viewBox="0 0 72 72" fill="none"
      aria-label="Ojo de Jaguar" role="img"
      style={{ display: 'block', ...(style || {}) }}
    >
      <defs>
        <linearGradient id={gGold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E6A6" /><stop offset="0.5" stopColor="#DCB24A" /><stop offset="1" stopColor="#B8862C" />
        </linearGradient>
        <radialGradient id={gIris} cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="#FFF3C0" /><stop offset="0.4" stopColor="#F0D77A" />
          <stop offset="0.85" stopColor="#C79A32" /><stop offset="1" stopColor="#6E4A0E" />
        </radialGradient>
        <filter id={fGlow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id={cIris}><circle cx="36" cy="36" r="12.6" /></clipPath>
      </defs>

      {/* Almendra (párpados) con interior oscuro */}
      <path d="M6 36 A34 34 0 0 1 66 36 A34 34 0 0 1 6 36 Z" fill="#08120B" stroke={`url(#${gGold})`} strokeWidth="3" strokeLinejoin="round" />

      {/* Iris encendido con halo */}
      <circle cx="36" cy="36" r="13.5" fill={`url(#${gIris})`} filter={glow ? `url(#${fGlow})` : undefined} />

      {/* Fibras finas del iris */}
      <g clipPath={`url(#${cIris})`} stroke="#6E4A0E" strokeWidth="0.75" opacity="0.7">
        {fibras.map(([x, y], i) => <path key={i} d={`M36 36 L${x} ${y}`} />)}
      </g>

      {/* Aro brillante del iris */}
      <circle cx="36" cy="36" r="13.5" fill="none" stroke="#FFF3C0" strokeWidth="1.1" opacity="0.8" />

      {/* Pupila vertical + destello */}
      <ellipse cx="36" cy="36" rx="3.4" ry="12.3" fill="#06100A" />
      <circle cx="32.5" cy="29.8" r="2.1" fill="#FFFBEF" />
    </svg>
  )
}

// Versión en string para HTML (reportes, landing) y descripciones.
// idSeed hace únicos los gradientes cuando hay varios en una misma página.
export function ojoJaguarSVG(size = 20, idSeed = Math.random().toString(36).slice(2, 7)) {
  const g = `ojs-g-${idSeed}`, ir = `ojs-i-${idSeed}`, fb = `ojs-f-${idSeed}`, cp = `ojs-c-${idSeed}`
  const fibras = [[36,22],[36,50],[48,28],[24,28],[48,44],[24,44],[44,24],[28,24],[44,48],[28,48],[50,36],[22,36],[41,26],[31,26],[41,46],[31,46]]
    .map(([x, y]) => `<path d="M36 36 L${x} ${y}"/>`).join('')
  return `<svg width="${size}" height="${size}" viewBox="0 0 72 72" fill="none" role="img" aria-label="Ojo de Jaguar" style="display:inline-block;vertical-align:middle">
<defs>
<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E6A6"/><stop offset="0.5" stop-color="#DCB24A"/><stop offset="1" stop-color="#B8862C"/></linearGradient>
<radialGradient id="${ir}" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#FFF3C0"/><stop offset="0.4" stop-color="#F0D77A"/><stop offset="0.85" stop-color="#C79A32"/><stop offset="1" stop-color="#6E4A0E"/></radialGradient>
<filter id="${fb}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<clipPath id="${cp}"><circle cx="36" cy="36" r="12.6"/></clipPath>
</defs>
<path d="M6 36 A34 34 0 0 1 66 36 A34 34 0 0 1 6 36 Z" fill="#08120B" stroke="url(#${g})" stroke-width="3" stroke-linejoin="round"/>
<circle cx="36" cy="36" r="13.5" fill="url(#${ir})" filter="url(#${fb})"/>
<g clip-path="url(#${cp})" stroke="#6E4A0E" stroke-width="0.75" opacity="0.7">${fibras}</g>
<circle cx="36" cy="36" r="13.5" fill="none" stroke="#FFF3C0" stroke-width="1.1" opacity="0.8"/>
<ellipse cx="36" cy="36" rx="3.4" ry="12.3" fill="#06100A"/>
<circle cx="32.5" cy="29.8" r="2.1" fill="#FFFBEF"/>
</svg>`
}
