'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout}
      style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
      Déconnexion
    </button>
  )
}
