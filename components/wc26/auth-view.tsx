'use client'

// AuthView — connexion / inscription pour WC26 HUB.
// Branchée sur Supabase (browser client). Visuel aligné avec le design éditorial
// (paper / ink / lime, Archivo Black, pill-btn, card).

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PALETTE } from './ui-primitives'

type Mode = 'signin' | 'signup'

export function AuthView({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const supabase = createClient()

  const handleGoogle = async () => {
    setError(null); setInfo(null); setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
    // succès → redirect Google → /auth/callback → /
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setInfo(null); setLoading(true)
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else setInfo('Connecté ! On charge…')
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
      else setInfo('Compte créé. Vérifie ta boîte mail pour confirmer l’adresse.')
    }
    setLoading(false)
  }

  return (
    <section style={{ maxWidth:560, margin:'0 auto', padding:'56px 24px 80px' }}>
      <button onClick={onBack} style={{
        background:'none', border:'none', color:'var(--muted)', fontSize:12,
        fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase',
        padding:0, marginBottom:22, cursor:'pointer',
      }}>← Retour</button>

      <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>● COMPTE</span>
      <h1 className="display" style={{ fontSize:72, margin:'14px 0 6px', lineHeight:0.92 }}>
        {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
      </h1>
      <p style={{ fontSize:15, color:'var(--muted)', lineHeight:1.5, marginBottom:28 }}>
        {mode === 'signin'
          ? 'Retrouve tes pronostics, ton classement et tes badges.'
          : '1 000 points offerts à l’inscription. Sans argent réel.'}
      </p>

      <div className="card" style={{ padding:28 }}>
        {/* Google */}
        <button
          type="button" disabled={loading} onClick={handleGoogle}
          className="pill-btn" style={{
            width:'100%', justifyContent:'center', padding:'14px 0', fontSize:14,
            background:'var(--paper)', borderColor:'var(--ink)', gap:10,
          }}>
          <GoogleGlyph/>
          Continuer avec Google
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
          <div style={{ flex:1, height:1, background:'var(--line)' }}/>
          <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em' }}>OU</span>
          <div style={{ flex:1, height:1, background:'var(--line)' }}/>
        </div>

        {/* Email + password */}
        <form onSubmit={handleEmail} style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <label style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>EMAIL</span>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com" autoComplete="email"
              style={inputStyle}/>
          </label>
          <label style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>MOT DE PASSE</span>
            <input
              type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              style={inputStyle}/>
          </label>

          {error && (
            <div style={{
              padding:'10px 14px', borderRadius:8, border:`1.5px solid ${PALETTE.red}`,
              background:'rgba(225,6,0,0.08)', color: PALETTE.red,
              fontSize:12, fontWeight:700,
            }}>{error}</div>
          )}
          {info && (
            <div style={{
              padding:'10px 14px', borderRadius:8, border:`1.5px solid ${PALETTE.ink}`,
              background: PALETTE.lime, color:'var(--ink)',
              fontSize:12, fontWeight:700,
            }}>{info}</div>
          )}

          <button type="submit" disabled={loading} className="pill-btn solid" style={{
            width:'100%', justifyContent:'center', padding:'14px 0', fontSize:13,
            letterSpacing:'0.04em', textTransform:'uppercase', marginTop:4,
            opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer',
          }}>
            {loading ? 'Patiente…' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div style={{ marginTop:18, paddingTop:18, borderTop:'1px dashed var(--line)', textAlign:'center', fontSize:12, fontWeight:600, color:'var(--muted)' }}>
          {mode === 'signin' ? 'Pas encore de compte ? ' : 'Déjà inscrit ? '}
          <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setInfo(null) }}
            style={{ background:'none', border:'none', color:'var(--ink)', fontWeight:800, textDecoration:'underline', cursor:'pointer', padding:0, fontSize:12 }}>
            {mode === 'signin' ? 'Créer un compte →' : '← Connexion'}
          </button>
        </div>
      </div>

      <p style={{ fontSize:11, color:'var(--muted)', textAlign:'center', marginTop:18, fontWeight:600, lineHeight:1.5 }}>
        En continuant tu acceptes la politique de confidentialité.<br/>
        WC26 HUB ne propose pas de paris d&apos;argent réel.
      </p>
    </section>
  )
}

const inputStyle: React.CSSProperties = {
  padding:'12px 14px', fontSize:14, fontWeight:600,
  border:'1.5px solid var(--ink)', borderRadius:10,
  background:'var(--paper)', color:'var(--ink)',
  fontFamily:'inherit', outline:'none',
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.86 2.69-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.97v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.97A9 9 0 0 0 0 9c0 1.45.35 2.83.97 4.03l2.98-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .97 4.97l2.98 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  )
}
