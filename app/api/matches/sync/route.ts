import { createClient } from '@supabase/supabase-js'
import { fetchMatches } from '@/lib/api-football'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function syncMatches() {
  try {
    const fixtures = await fetchMatches()
    const matches = fixtures.map((f: any) => ({
      api_match_id: f.fixture.id,
      home_team: f.teams.home.name,
      away_team: f.teams.away.name,
      home_flag: f.teams.home.logo,
      away_flag: f.teams.away.logo,
      score_home: f.goals.home,
      score_away: f.goals.away,
      status: f.fixture.status.short,
      kickoff_at: f.fixture.date,
      phase: f.league.round,
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase
      .from('matches')
      .upsert(matches, { onConflict: 'api_match_id' })
    if (error) throw error
    return NextResponse.json({ synced: matches.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

function isAuthorized(request: Request) {
  return request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return syncMatches()
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return syncMatches()
}
