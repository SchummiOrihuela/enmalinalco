'use client'
import dynamic from 'next/dynamic'

// Leaflet usa window/document: cargamos el mapa solo en el cliente (ssr:false).
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: 'min(68vh, 620px)', width: '100%', borderRadius: 16,
      border: '1px solid rgba(220,178,74,.22)', background: '#1C3B28',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(242,237,227,.6)', fontSize: 14,
    }}>Cargando mapa…</div>
  ),
})

export default function MapShell(props) {
  return <MapView {...props} />
}
