import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import BusinessForm from './BusinessForm'
import HoursForm from './HoursForm'
import ClosuresForm from './ClosuresForm'

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

  let hours = []
  let closures = []
  if (business) {
    const { data: h } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', business.id)
    hours = h || []

    const { data: v } = await supabase
      .from('vacations')
      .select('*')
      .eq('business_id', business.id)
      .order('start_date')
    closures = v || []
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Panel de control</h1>
      <p>Sesión activa: {user.email}</p>
      <BusinessForm business={business} userId={user.id} />
      {business && <HoursForm businessId={business.id} initialHours={hours} />}
      {business && <ClosuresForm businessId={business.id} initialClosures={closures} />}
    </div>
  )
}
