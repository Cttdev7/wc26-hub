import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/profil/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: pronostics } = await supabase
    .from('pronostics')
    .select('*, matches(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: '#C8FF00' }}>{profile?.pseudo}</h1>
          <p style={{ color: '#666', marginTop: 4 }}>{user.email}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#C8FF00' }}>{profile?.total_points ?? 0}</div>
            <div style={{ color: '#666', fontSize: 13 }}>points</div>
          </div>
          <LogoutButton />
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Mes pronostics</h2>
      {(!pronostics || pronostics.length === 0) && (
        <p style={{ color: '#666' }}>
          Tu n&apos;as pas encore fait de pronostics.{' '}
          <Link href="/paris" style={{ color: '#C8FF00' }}>Jouer maintenant →</Link>
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(pronostics ?? []).map((p: any) => (
          <div key={p.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 10, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: 14 }}>{p.matches?.home_team} vs {p.matches?.away_team}</span>
            <span style={{ fontWeight: 700 }}>{p.score_home} — {p.score_away}</span>
            <span style={{ color: p.points_earned === 3 ? '#C8FF00' : p.points_earned === 1 ? '#88cc00' : '#444', fontWeight: 700, minWidth: 80, textAlign: 'right' }}>
              {p.scored ? `${p.points_earned} pts` : 'En attente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
