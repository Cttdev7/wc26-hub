import { createBrowserClient } from '@supabase/ssr'

// Browser-side Supabase client. Used by the auth view to sign in/up and listen
// for session changes. The server-side counterpart lives in ./server.ts.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
