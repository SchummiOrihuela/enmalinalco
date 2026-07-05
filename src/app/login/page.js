'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)

  const supabase = createClient()

  async function handleLogin() {
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    else setEnviado(true)
  }

  if (enviado) {
    return <p style={{ padding: 40 }}>Revisa tu correo y haz clic en el enlace para entrar.</p>
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Acceso</h1>
      <input
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8, margin: '12px 0' }}
      />
      <button onClick={handleLogin} style={{ padding: '8px 16px' }}>
        Enviar enlace mágico
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
