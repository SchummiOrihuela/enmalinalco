import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Panel de control</h1>
      <p>Sesión activa: {user.email}</p>
    </div>
  )
}
