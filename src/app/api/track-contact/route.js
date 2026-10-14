// Registra un clic de contacto (WhatsApp / teléfono / "Cómo llegar") en la
// ficha de un negocio. Lo llama el navegador vía navigator.sendBeacon al tocar
// el botón. Incrementa el contador con una RPC SECURITY DEFINER (grant a anon),
// igual que las vistas: el visitante anónimo solo puede sumar, no editar.
import { createServerClient } from '@supabase/ssr'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const KINDS = new Set(['whatsapp', 'phone', 'maps', 'instagram', 'facebook'])
// UUID v4-ish: valida formato antes de tocar la base.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const id = typeof body?.id === 'string' ? body.id : ''
  const kind = typeof body?.kind === 'string' ? body.kind : ''
  if (!UUID_RE.test(id) || !KINDS.has(kind)) {
    return Response.json({ ok: false }, { status: 400 })
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    await supabase.rpc('increment_business_contact', { bid: id, kind })
  } catch {
    // Silencioso: el tracking nunca debe bloquear la navegación del usuario.
    return Response.json({ ok: false }, { status: 200 })
  }

  return Response.json({ ok: true })
}
