import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function calcPoints(pHome: number, pAway: number, rHome: number, rAway: number): number {
  if (pHome === rHome && pAway === rAway) return 3
  const pW = pHome > pAway ? 'H' : pHome < pAway ? 'A' : 'D'
  const rW = rHome > rAway ? 'H' : rHome < rAway ? 'A' : 'D'
  return pW === rW ? 1 : 0
}

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: finishedMatches } = await supabase
    .from('matches')
    .select('id, score_home, score_away')
    .in('status', ['FT', 'AET', 'PEN'])
    .not('score_home', 'is', null)

  if (!finishedMatches?.length) return NextResponse.json({ scored: 0 })

  let totalScored = 0
  for (const match of finishedMatches) {
    const { data: pronostics } = await supabase
      .from('pronostics')
      .select('id, user_id, score_home, score_away')
      .eq('match_id', match.id)
      .eq('scored', false)

    for (const p of pronostics ?? []) {
      const pts = calcPoints(p.score_home, p.score_away, match.score_home!, match.score_away!)
      await supabase.from('pronostics').update({ points_earned: pts, scored: true }).eq('id', p.id)
      if (pts > 0) await supabase.rpc('increment_points', { uid: p.user_id, pts })
      totalScored++
    }
  }

  return NextResponse.json({ scored: totalScored })
}
