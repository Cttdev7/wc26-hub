import { createClient } from '@supabase/supabase-js'
import { fetchMatches } from '@/lib/api-football'
import { codeFromName } from '@/lib/team-codes'
import { CALENDAR } from '@/components/wc26/data'
import { NextResponse } from 'next/server'

// Cron de scoring automatique des pronostics.
// Workflow : interroge API-Football → trouve les matchs terminés → mappe vers
// nos match_id mock par (home, away, date) → appelle score_prediction() en
// base, qui crédite les profils selon la règle 5 (score exact) / 3 (bon
// vainqueur) / 0. Idempotent : `scored = TRUE` est posé une fois pour toutes.
//
// Déclenché par Vercel cron (cf. vercel.json) tous les jours à 23:00 UTC,
// ou manuellement :
//   curl -X GET http://localhost:3000/api/cron/score \
//        -H "Authorization: Bearer $CRON_SECRET"

const FINISHED = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO'])

function isAuthorized(request: Request): boolean {
  return request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

async function runScoring() {
  if (!process.env.API_FOOTBALL_KEY) {
    return { scored: 0, error: 'API_FOOTBALL_KEY not set' }
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { scored: 0, error: 'Supabase env vars missing' }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  let fixtures: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    fixtures = await fetchMatches()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown'
    return { scored: 0, error: `API-Football: ${msg}` }
  }

  let total = 0
  const results: Array<{ match_id: string; score: string; scored: number; error?: string }> = []
  const skipped: Array<{ reason: string; count: number }> = []
  let skippedNotFinished = 0, skippedNoCode = 0, skippedNoMock = 0

  for (const f of fixtures) {
    const status = f.fixture?.status?.short ?? 'NS'
    if (!FINISHED.has(status)) { skippedNotFinished++; continue }

    const homeCode = codeFromName(f.teams?.home?.name)
    const awayCode = codeFromName(f.teams?.away?.name)
    if (!homeCode || !awayCode) { skippedNoCode++; continue }

    const realHome: number | null = f.goals?.home ?? null
    const realAway: number | null = f.goals?.away ?? null
    if (realHome == null || realAway == null) continue

    const kickoff: string = String(f.fixture?.date ?? '').slice(0, 10)
    const mockMatch = CALENDAR.find(
      m => m.home === homeCode && m.away === awayCode && m.date === kickoff
    )
    if (!mockMatch) { skippedNoMock++; continue }

    const { data, error } = await supabase.rpc('score_prediction', {
      p_match_id: mockMatch.id,
      p_real_home: realHome,
      p_real_away: realAway,
    })

    if (error) {
      results.push({ match_id: mockMatch.id, score: `${realHome}-${realAway}`, scored: 0, error: error.message })
    } else {
      const n = Number(data ?? 0)
      total += n
      results.push({ match_id: mockMatch.id, score: `${realHome}-${realAway}`, scored: n })
    }
  }

  if (skippedNotFinished) skipped.push({ reason: 'not finished', count: skippedNotFinished })
  if (skippedNoCode)      skipped.push({ reason: 'team name not in NAME_TO_CODE', count: skippedNoCode })
  if (skippedNoMock)      skipped.push({ reason: 'no matching mock fixture', count: skippedNoMock })

  return { scored: total, matches: results, skipped, total_fixtures: fixtures.length }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await runScoring())
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await runScoring())
}
