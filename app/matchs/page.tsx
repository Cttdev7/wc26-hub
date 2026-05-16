import { createClient } from '@/lib/supabase/server'
import MatchCard from '@/components/ui/match-card'
import { Match } from '@/lib/types'

export const revalidate = 60

export default async function MatchsPage() {
  const supabase = await createClient()
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('kickoff_at', { ascending: true })

  const grouped = (matches ?? []).reduce((acc: Record<string, Match[]>, m: Match) => {
    const date = new Date(m.kickoff_at).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(m)
    return acc
  }, {})

  return (
    <div>
      <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Matchs</h1>
      <p style={{ color: '#C8FF00', fontWeight: 700, letterSpacing: 4, fontSize: 13, marginBottom: 40 }}>
        COUPE DU MONDE 2026
      </p>

      {Object.keys(grouped).length === 0 && (
        <p style={{ color: '#666' }}>Aucun match disponible. Lance d&apos;abord la synchronisation.</p>
      )}

      {(Object.entries(grouped) as [string, Match[]][]).map(([date, dayMatches]) => (
        <div key={date} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#666', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            {date}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dayMatches.map((m: Match) => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
