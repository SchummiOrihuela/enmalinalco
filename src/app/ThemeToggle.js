'use client'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = document.documentElement.getAttribute('data-theme') || 'light'
    setTheme(saved)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('em-theme', next)
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 500,
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surf)',
        border: '1px solid rgba(128,128,128,0.2)',
        borderRadius: '9999px',
        boxShadow: '0 4px 16px rgba(27,20,9,0.1)',
        cursor: 'pointer',
        fontSize: '18px',
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
