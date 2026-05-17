import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  // The /profil route no longer exists since the design port — the SPA shows
  // the profile via internal view state once the session cookie is present.
  return NextResponse.redirect(`${origin}/`)
}
