import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PronosticForm from '@/components/ui/pronostic-form'
import { Match, Pronostic } from '@/lib/types'

export const revalidate = 60

export default async function ParisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/profil/login')

  const [{ data: matches }, { data: pronostics }] = await Promise.all([
    supabase.from('matches').select('*').eq('status', 'NS').order('kickoff_at'),
    supabase.from('pronostics').select('*').eq('user_id', user.id),
  ])

  const pronosticByMatch = (pronostics ?? []).reduce(
    (acc: Record<string, Pronostic>, p: Pronostic) => { acc[p.match_id] = p; return acc },
    {}
  )

  return (
    <div>
      <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Paris</h1>
      <p style={{ color: '#C8FF00', fontWeight: 700, letterSpacing: 4, fontSize: 13, marginBottom: 40 }}>
        PRONOSTICS COMMUNAUTAIRES
      </p>

      {(matches ?? []).length === 0 && (
        <p style={{ color: '#666' }}>Aucun match à venir pour l&apos;instant.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(matches ?? []).map((match: Match) => {
          const existing = pronosticByMatch[match.id]
          return (
            <div key={match.id} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 }}>
                {match.home_flag && <img src={match.home_flag} alt="" style={{ width: 28, height: 20, objectFit: 'contain' }} />}
                <span style={{ fontWeight: 700 }}>{match.home_team}</span>
                <span style={{ color: '#444' }}>vs</span>
                <span style={{ fontWeight: 700 }}>{match.away_team}</span>
                {match.away_flag && <img src={match.away_flag} alt="" style={{ width: 28, height: 20, objectFit: 'contain' }} />}
              </div>
              <span style={{ color: '#555', fontSize: 13, minWidth: 90, textAlign: 'right' }}>
                {new Date(match.kickoff_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                {' '}
                {new Date(match.kickoff_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <PronosticForm match={match} existing={existing} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
