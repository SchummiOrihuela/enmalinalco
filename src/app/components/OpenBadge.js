// Indicador "Abierto ahora / Cerrado" (presentacional, sirve en server y client).
// Recibe el estado ya calculado con lib/hours → estadoHorario().
export default function OpenBadge({ estado, size = 'md' }) {
  if (!estado || !estado.label) return null
  const { open, soon } = estado
  const color = open ? (soon ? '#E0803A' : '#3A8C4E') : '#9A8E7C'
  const bg = open ? (soon ? 'rgba(224,128,58,0.12)' : 'rgba(58,140,78,0.14)') : 'rgba(154,142,124,0.14)'
  const small = size === 'sm'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: small ? 5 : 6,
      padding: small ? '2px 8px' : '4px 11px',
      borderRadius: 9999,
      background: bg,
      border: `1px solid ${color}44`,
      color,
      fontSize: small ? 11.5 : 13,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      lineHeight: 1.2,
    }}>
      <span style={{
        width: small ? 6 : 7, height: small ? 6 : 7, borderRadius: '50%',
        background: color, flexShrink: 0,
        boxShadow: open && !soon ? `0 0 0 3px ${color}22` : 'none',
      }} />
      {estado.label}
    </span>
  )
}
