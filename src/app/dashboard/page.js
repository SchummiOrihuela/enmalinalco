import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import BusinessForm from './BusinessForm'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  return (
    <div style={{ padding: 40 }}>
      <h1>Panel de control</h1>
      <p>Sesión activa: {user.email}</p>
      <BusinessForm business={business} userId={user.id} />
    </div>
  )
}
