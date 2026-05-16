import { Match } from '@/lib/types'

const statusLabel: Record<string, { text: string; color: string }> = {
  NS:   { text: 'À venir', color: '#666' },
  '1H': { text: '● 1ère mi-temps', color: '#C8FF00' },
  HT:   { text: 'Mi-temps', color: '#ff9900' },
  '2H': { text: '● 2ème mi-temps', color: '#C8FF00' },
  ET:   { text: '● Prolongations', color: '#C8FF00' },
  PEN:  { text: '● Tirs au but', color: '#C8FF00' },
  FT:   { text: 'Terminé', color: '#444' },
  AET:  { text: 'Après prolongations', color: '#444' },
}

export default function MatchCard({ match }: { match: Match }) {
  const isLive = ['1H', 'HT', '2H', 'ET', 'PEN'].includes(match.status)
  const isStarted = isLive || ['FT', 'AET'].includes(match.status)
  const status = statusLabel[match.status] ?? { text: match.status, color: '#666' }

  return (
    <div style={{
      background: '#111',
      border: `1px solid ${isLive ? '#C8FF00' : '#222'}`,
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ flex: 1, textAlign: 'right' }}>
        {match.home_flag && (
          <img src={match.home_flag} alt="" style={{ width: 24, height: 18, objectFit: 'contain', display: 'block', marginLeft: 'auto', marginBottom: 6 }} />
        )}
        <div style={{ fontWeight: 700, fontSize: 15 }}>{match.home_team}</div>
      </div>

      <div style={{ textAlign: 'center', minWidth: 110 }}>
        {isStarted ? (
          <div style={{ fontSize: 28, fontWeight: 900, color: isLive ? '#C8FF00' : '#fff' }}>
            {match.score_home ?? 0} — {match.score_away ?? 0}
          </div>
        ) : (
          <div style={{ fontSize: 15, color: '#888', fontWeight: 700 }}>
            {new Date(match.kickoff_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        <div style={{ fontSize: 11, color: status.color, marginTop: 4, fontWeight: isLive ? 700 : 400 }}>
          {status.text}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {match.away_flag && (
          <img src={match.away_flag} alt="" style={{ width: 24, height: 18, objectFit: 'contain', marginBottom: 6 }} />
        )}
        <div style={{ fontWeight: 700, fontSize: 15 }}>{match.away_team}</div>
      </div>
    </div>
  )
}
