'use client'
import { useEffect } from 'react'

// Resalta el chip del selector de la sección que el lector está viendo.
// Observa cada <section id> y marca su chip (.hx-chip[href="#id"]) con
// la clase .is-active. Sin dependencias, con IntersectionObserver.
export default function ScrollSpy() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section.hx-sec[id]'))
    if (!sections.length) return

    const chipFor = (id) =>
      document.querySelector(`.hx-chip[href="#${CSS.escape(id)}"]`)

    const visible = new Map() // id -> intersectionRatio

    const setActive = (id) => {
      document.querySelectorAll('.hx-chip.is-active').forEach((c) => c.classList.remove('is-active'))
      const chip = id && chipFor(id)
      if (chip) chip.classList.add('is-active')
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio)
          else visible.delete(e.target.id)
        }
        if (visible.size) {
          // La sección con mayor porción visible gana.
          const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0]
          setActive(top)
        }
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: [0.1, 0.25, 0.5, 0.75] }
    )

    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return null
}
