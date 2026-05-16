import { createClient } from '@/lib/supabase/server'
import { ClassementRow } from '@/lib/types'

export const revalidate = 60

export default async function ClassementPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('classement')
    .select('*')
    .order('rang', { ascending: true })
    .limit(100)

  const medals = ['#C8FF00', '#888', '#a05c00']

  return (
    <div>
      <h1 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>Classement</h1>
      <p style={{ color: '#C8FF00', fontWeight: 700, letterSpacing: 4, fontSize: 13, marginBottom: 40 }}>
        COMMUNAUTÉ WC26 HUB
      </p>

      {(rows ?? []).length === 0 && (
        <p style={{ color: '#666' }}>Aucun joueur inscrit pour l&apos;instant.</p>
      )}

      <div style={{ background: '#111', borderRadius: 12, overflow: 'hidden' }}>
        {(rows ?? []).map((row: ClassementRow, i: number) => (
          <div key={row.id} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
            borderBottom: '1px solid #1a1a1a',
            background: i < 3 ? 'rgba(200,255,0,0.02)' : 'transparent',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: i < 3 ? medals[i] : '#1a1a1a',
              color: i < 3 ? '#0A0A0A' : '#555',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 15,
            }}>
              {row.rang}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{row.pseudo}</div>
              <div style={{ color: '#555', fontSize: 13, marginTop: 2 }}>
                {row.total_pronostics} paris · {row.scores_exacts} exacts · {row.bons_vainqueurs} bons vainqueurs
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: i < 3 ? '#C8FF00' : '#fff' }}>
                {row.total_points}
              </div>
              <div style={{ color: '#666', fontSize: 12 }}>pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
