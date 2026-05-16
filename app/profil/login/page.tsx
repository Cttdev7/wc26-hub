'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/profil')
      router.refresh()
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#111', border: '1px solid #333', borderRadius: 8,
    padding: '12px 16px', color: '#fff', fontSize: 16, width: '100%',
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h1 style={{ fontSize: 48, fontWeight: 900, color: '#C8FF00', marginBottom: 8 }}>Connexion</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: '#ff6b6b', fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ background: '#C8FF00', color: '#0A0A0A', fontWeight: 900, fontSize: 16, padding: 14, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p style={{ marginTop: 24, color: '#666', textAlign: 'center' }}>
        Pas de compte ? <Link href="/profil/signup" style={{ color: '#C8FF00' }}>S'inscrire</Link>
      </p>
    </div>
  )
}
