'use client'

import { useState, useEffect, useCallback } from 'react'

// Galería de la ficha pública: miniaturas elegantes y, al hacer click,
// un visor a pantalla completa (lightbox) con carrusel para pasar fotos.
export default function PhotoGallery({ photos }) {
  const list = photos || []
  const [abierta, setAbierta] = useState(null) // índice de la foto abierta, o null
  const [dir, setDir] = useState(0)            // dirección del último cambio (para animar)

  const cerrar = useCallback(() => setAbierta(null), [])
  const anterior = useCallback(() => {
    setDir(-1)
    setAbierta((i) => (i === null ? i : (i - 1 + list.length) % list.length))
  }, [list.length])
  const siguiente = useCallback(() => {
    setDir(1)
    setAbierta((i) => (i === null ? i : (i + 1) % list.length))
  }, [list.length])

  // Teclado: Esc cierra, ← → navegan.
  useEffect(() => {
    if (abierta === null) return
    function onKey(e) {
      if (e.key === 'Escape') cerrar()
      else if (e.key === 'ArrowLeft') anterior()
      else if (e.key === 'ArrowRight') siguiente()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [abierta, cerrar, anterior, siguiente])

  if (list.length === 0) return null

  return (
    <>
      <style>{`
        .pg-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
        .pg-thumb{position:relative;padding:0;border:none;background:none;cursor:zoom-in;
          border-radius:12px;overflow:hidden;line-height:0;
          box-shadow:0 2px 10px rgba(0,0,0,0.22);
          transition:transform .35s cubic-bezier(.2,.8,.25,1),box-shadow .35s ease}
        .pg-thumb img{width:240px;height:180px;object-fit:cover;display:block;
          transition:transform .5s cubic-bezier(.2,.8,.25,1),filter .35s ease}
        .pg-thumb::after{content:'';position:absolute;inset:0;border-radius:12px;
          box-shadow:inset 0 0 0 0 rgba(220,178,74,0);transition:box-shadow .35s ease;pointer-events:none}
        .pg-thumb .pg-lupa{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.8);
          width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          background:rgba(20,28,22,0.42);backdrop-filter:blur(3px);color:#F6F0E0;
          opacity:0;transition:opacity .35s ease,transform .35s ease;pointer-events:none}
        @media (hover:hover){
          .pg-thumb:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,0.32)}
          .pg-thumb:hover img{transform:scale(1.08);filter:brightness(.82)}
          .pg-thumb:hover::after{box-shadow:inset 0 0 0 2px rgba(220,178,74,0.9)}
          .pg-thumb:hover .pg-lupa{opacity:1;transform:translate(-50%,-50%) scale(1)}
        }
        @media (max-width:520px){.pg-thumb img{width:44vw;height:33vw}}

        .pg-overlay{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;
          justify-content:center;background:rgba(10,14,11,0.94);
          animation:pgFade .28s ease both}
        .pg-figure{max-width:92vw;max-height:86vh;border-radius:10px;object-fit:contain;
          box-shadow:0 20px 70px rgba(0,0,0,0.55);animation:pgZoom .38s cubic-bezier(.2,.8,.25,1) both}
        .pg-figure.dir-1{animation:pgSlideR .38s cubic-bezier(.2,.8,.25,1) both}
        .pg-figure.dir--1{animation:pgSlideL .38s cubic-bezier(.2,.8,.25,1) both}
        .pg-nav{position:fixed;top:50%;transform:translateY(-50%);display:inline-flex;
          align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;
          border:1px solid rgba(240,232,212,0.22);background:rgba(240,232,212,0.08);
          color:#F0E8D4;cursor:pointer;z-index:2;backdrop-filter:blur(4px);
          transition:background .25s ease,border-color .25s ease,transform .25s ease}
        .pg-nav:hover{background:rgba(220,178,74,0.9);border-color:transparent;color:#25201A}
        .pg-count{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);
          font-size:13px;font-weight:600;letter-spacing:.06em;color:#F0E8D4;
          background:rgba(0,0,0,0.38);padding:6px 15px;border-radius:9999px;
          font-family:'Cormorant Garamond',Georgia,serif}
        @keyframes pgFade{from{opacity:0}to{opacity:1}}
        @keyframes pgZoom{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        @keyframes pgSlideR{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pgSlideL{from{opacity:0;transform:translateX(-34px)}to{opacity:1;transform:translateX(0)}}
      `}</style>

      <div className="pg-grid">
        {list.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="pg-thumb"
            onClick={() => { setDir(0); setAbierta(i) }}
            aria-label={`Ver foto ${i + 1} de ${list.length}`}
          >
            <img src={p.url} alt="" />
            <span className="pg-lupa" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </button>
        ))}
      </div>

      {abierta !== null && (
        <div className="pg-overlay" onClick={cerrar}>
          <button
            type="button" onClick={cerrar} aria-label="Cerrar"
            className="pg-nav" style={{ top: 18, right: 18, transform: 'none' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {list.length > 1 && (
            <button
              type="button" className="pg-nav" style={{ left: 18 }}
              onClick={(e) => { e.stopPropagation(); anterior() }} aria-label="Foto anterior"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}

          <img
            key={abierta}
            src={list[abierta].url}
            alt=""
            className={`pg-figure dir-${dir}`}
            onClick={(e) => e.stopPropagation()}
          />

          {list.length > 1 && (
            <button
              type="button" className="pg-nav" style={{ right: 18 }}
              onClick={(e) => { e.stopPropagation(); siguiente() }} aria-label="Foto siguiente"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

          {list.length > 1 && (
            <span className="pg-count">{abierta + 1} / {list.length}</span>
          )}
        </div>
      )}
    </>
  )
}
