'use client'
import { useEffect, useRef } from 'react'

// Barra de progreso de scroll (misma del landing): verde → terra → oro.
export default function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const dh = el.scrollHeight - el.clientHeight
      const w = dh > 0 ? (el.scrollTop / dh) * 100 : 0
      if (ref.current) ref.current.style.width = w + '%'
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} aria-hidden style={{
      position: 'fixed', top: 0, left: 0, height: '3px', width: 0, zIndex: 9999,
      background: 'linear-gradient(90deg, #7CB689, #DE6A3E, #DCB24A)',
      borderRadius: '0 9999px 9999px 0',
      transition: 'width .08s linear',
      pointerEvents: 'none',
    }} />
  )
}
