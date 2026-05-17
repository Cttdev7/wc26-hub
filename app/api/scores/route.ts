import { fetchMatches } from '@/lib/api-football'
import { NextResponse } from 'next/server'

// Cache the API-Football response for 5 min — same kickoff/score won't change
// faster than that, and we don't want to burn the 100/day free-tier quota.
export const revalidate = 300

// API-Football statuses → buckets the UI cares about.
// https://www.api-football.com/documentation-v3#tag/Fixtures
const FINISHED = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO'])
const LIVE     = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'])

// Map fuzzy / alternative API-Football team names → our 3-letter codes.
// (Adjust as you discover mismatches in the API response.)
const NAME_TO_CODE: Record<string, string> = {
  'france': 'FRA', 'brazil': 'BRA', 'argentina': 'ARG', 'portugal': 'POR',
  'spain': 'ESP', 'england': 'ENG', 'germany': 'GER', 'netherlands': 'NED',
  'mexico': 'MEX', 'usa': 'USA', 'united states': 'USA', 'canada': 'CAN',
  'japan': 'JPN', 'saudi arabia': 'KSA', 'new zealand': 'NZL',
  'belgium': 'BEL', 'australia': 'AUS', 'norway': 'NOR', 'tunisia': 'TUN',
  'croatia': 'CRO', 'iran': 'IRN', 'senegal': 'SEN', 'ecuador': 'ECU',
  'panama': 'PAN', 'korea republic': 'KOR', 'south korea': 'KOR',
  'cameroon': 'CMR', 'paraguay': 'PAR', 'switzerland': 'SUI',
  'colombia': 'COL', 'ghana': 'GHA', 'uruguay': 'URU', 'morocco': 'MAR',
  'egypt': 'EGY', 'italy': 'ITA', 'scotland': 'SCO', 'nigeria': 'NGA',
  'jamaica': 'JAM', 'denmark': 'DEN', 'poland': 'POL', 'ivory coast': 'CIV',
  "côte d'ivoire": 'CIV', 'costa rica': 'CRC', 'turkey': 'TUR',
  'türkiye': 'TUR', 'austria': 'AUT', 'chile': 'CHI', 'qatar': 'QAT',
  'sweden': 'SUE', 'peru': 'PER', 'algeria': 'ALG', 'honduras': 'HON',
}

function codeOf(apiName: string | undefined): string | null {
  if (!apiName) return null
  return NAME_TO_CODE[apiName.toLowerCase().trim()] ?? null
}

export type ScoreUpdate = {
  home_code: string
  away_code: string
  kickoff_date: string         // YYYY-MM-DD
  status_short: string         // raw API status
  bucket: 'finished' | 'live' | 'scheduled' | 'other'
  score_home: number | null
  score_away: number | null
  elapsed: number | null
}

export async function GET() {
  if (!process.env.API_FOOTBALL_KEY) {
    return NextResponse.json({ scores: [], warning: 'API_FOOTBALL_KEY not set' })
  }
  try {
    const fixtures = await fetchMatches()
    const scores: ScoreUpdate[] = []
    for (const f of fixtures) {
      const home_code = codeOf(f.teams?.home?.name)
      const away_code = codeOf(f.teams?.away?.name)
      if (!home_code || !away_code) continue
      const status = f.fixture?.status?.short ?? 'NS'
      const bucket: ScoreUpdate['bucket'] =
        FINISHED.has(status) ? 'finished'
        : LIVE.has(status) ? 'live'
        : status === 'NS' || status === 'TBD' ? 'scheduled'
        : 'other'
      scores.push({
        home_code,
        away_code,
        kickoff_date: String(f.fixture?.date ?? '').slice(0, 10),
        status_short: status,
        bucket,
        score_home: f.goals?.home ?? null,
        score_away: f.goals?.away ?? null,
        elapsed: f.fixture?.status?.elapsed ?? null,
      })
    }
    return NextResponse.json({ scores })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ scores: [], error: message }, { status: 200 })
  }
}
