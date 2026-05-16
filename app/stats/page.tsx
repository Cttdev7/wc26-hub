import { fetchStandings, fetchTopScorers } from '@/lib/api-football'

export const revalidate = 300

export default async function StatsPage() {
  let standings: any[] = []
  let topScorers: any[] = []

  try {
    const [s, t] = await Promise.all([fetchStandings(), fetchTopScorers()])
    standings = s
    topScorers = t.slice(0, 10)
  } catch {
    // API indisponible
  }

  const groups: any[][] = standings[0]?.league?.standings ?? []

  return (
    <div>
      <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Stats</h1>
      <p style={{ color: '#C8FF00', fontWeight: 700, letterSpacing: 4, fontSize: 13, marginBottom: 40 }}>
        COUPE DU MONDE 2026
      </p>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Classements des groupes</h2>
        {groups.length === 0 ? (
          <p style={{ color: '#666' }}>Données disponibles au démarrage du tournoi.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {groups.map((group: any[]) => (
              <div key={group[0]?.group} style={{ background: '#111', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: '#C8FF00', color: '#0A0A0A', fontWeight: 900, padding: '10px 16px', fontSize: 13, letterSpacing: 1 }}>
                  {group[0]?.group}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: '#555', fontSize: 11 }}>
                      <th style={{ padding: '8px 16px', textAlign: 'left' }}>Équipe</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>J</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>G</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>N</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>P</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((team: any) => (
                      <tr key={team.team.id} style={{ borderTop: '1px solid #1a1a1a' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img src={team.team.logo} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{team.team.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', color: '#666', fontSize: 14 }}>{team.all.played}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', color: '#666', fontSize: 14 }}>{team.all.win}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', color: '#666', fontSize: 14 }}>{team.all.draw}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', color: '#666', fontSize: 14 }}>{team.all.lose}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 900, color: '#C8FF00', fontSize: 16 }}>{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Top buteurs</h2>
        {topScorers.length === 0 ? (
          <p style={{ color: '#666' }}>Données disponibles au démarrage du tournoi.</p>
        ) : (
          <div style={{ background: '#111', borderRadius: 12, overflow: 'hidden' }}>
            {topScorers.map((entry: any, i: number) => (
              <div key={entry.player.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: i < 3 ? '#C8FF00' : '#333', fontWeight: 900, fontSize: 20, minWidth: 28 }}>{i + 1}</span>
                <img src={entry.player.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{entry.player.name}</div>
                  <div style={{ color: '#666', fontSize: 13 }}>{entry.statistics[0]?.team?.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#C8FF00' }}>{entry.statistics[0]?.goals?.total ?? 0}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>buts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
