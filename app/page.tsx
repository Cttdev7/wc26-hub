import { createClient } from '@/lib/supabase/server'
import MatchCard from '@/components/ui/match-card'
import { Match, ClassementRow } from '@/lib/types'
import Link from 'next/link'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [{ data: upcomingMatches }, { data: topPlayers }] = await Promise.all([
    supabase
      .from('matches')
      .select('*')
      .in('status', ['1H', 'HT', '2H', 'ET', 'PEN', 'NS'])
      .order('kickoff_at')
      .limit(5),
    supabase
      .from('classement')
      .select('*')
      .order('rang', { ascending: true })
      .limit(3),
  ])

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: 64 }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ background: '#C8FF00', color: '#0A0A0A', fontWeight: 900, fontSize: 13, padding: '4px 14px', borderRadius: 20 }}>
            ★ LIVE
          </span>
        </div>
        <h1 style={{ fontSize: 140, fontWeight: 900, letterSpacing: -6, lineHeight: 0.88, color: '#fff' }}>WC26</h1>
        <h1 style={{ fontSize: 140, fontWeight: 900, letterSpacing: -6, lineHeight: 0.88, color: '#C8FF00' }}>HUB</h1>
        <p style={{ color: '#C8FF00', fontWeight: 700, letterSpacing: 4, marginTop: 24, fontSize: 13 }}>
          STATS · ANALYSES · COMMUNAUTÉ
        </p>
      </div>

      {/* Matchs du moment */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900 }}>Matchs du moment</h2>
          <Link href="/matchs" style={{ color: '#C8FF00', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Voir tout →</Link>
        </div>
        {(upcomingMatches ?? []).length === 0 ? (
          <p style={{ color: '#666' }}>
            Aucun match en cours.{' '}
            <Link href="/matchs" style={{ color: '#C8FF00', textDecoration: 'none' }}>Voir le calendrier →</Link>
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(upcomingMatches ?? []).map((m: Match) => <MatchCard key={m.id} match={m} />)}
          </div>
        )}
      </section>

      {/* Top 3 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900 }}>Top pronostiqueurs</h2>
          <Link href="/classement" style={{ color: '#C8FF00', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Classement complet →</Link>
        </div>
        {(topPlayers ?? []).length === 0 ? (
          <p style={{ color: '#666' }}>
            Sois le premier !{' '}
            <Link href="/profil/signup" style={{ color: '#C8FF00', textDecoration: 'none' }}>Créer un compte →</Link>
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {(topPlayers ?? []).map((p: ClassementRow, i: number) => (
              <div key={p.id} style={{
                background: '#111',
                border: `1px solid ${i === 0 ? '#C8FF00' : '#222'}`,
                borderRadius: 12, padding: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#C8FF00', marginBottom: 8 }}>#{p.rang}</div>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>{p.pseudo}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>{p.total_points}</div>
                <div style={{ color: '#555', fontSize: 12, marginTop: 4 }}>points</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
