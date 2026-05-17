import { fetchStandings } from '@/lib/api-football'
import { codeFromName } from '@/lib/team-codes'
import { NextResponse } from 'next/server'

// Cache 5 min — same as /api/scores, to keep API-Football free-tier quota
// usable.
export const revalidate = 300

export type StandingUpdate = {
  code: string
  group: string                // 'A', 'B', etc. — empty if API doesn't expose it
  rank: number | null
  P: number; W: number; D: number; L: number
  GF: number; GA: number; GD: number; Pts: number
}

// API-Football returns:
//   [{ league: { standings: [ [ row, row, row, row ], [ row, ... ] ] } }]
// Each row has: team.name, rank, points, all:{ played, win, draw, lose, goals:{ for, against } },
// goalsDiff, group (sometimes).
export async function GET() {
  if (!process.env.API_FOOTBALL_KEY) {
    return NextResponse.json({ standings: [], warning: 'API_FOOTBALL_KEY not set' })
  }
  try {
    const response = await fetchStandings()
    const standings: StandingUpdate[] = []

    for (const leagueWrap of response ?? []) {
      const groups = leagueWrap?.league?.standings ?? []
      for (const groupArr of groups) {
        for (const row of groupArr ?? []) {
          const code = codeFromName(row?.team?.name)
          if (!code) continue
          standings.push({
            code,
            group: row?.group ?? '',
            rank:  row?.rank ?? null,
            P:    row?.all?.played ?? 0,
            W:    row?.all?.win ?? 0,
            D:    row?.all?.draw ?? 0,
            L:    row?.all?.lose ?? 0,
            GF:   row?.all?.goals?.for ?? 0,
            GA:   row?.all?.goals?.against ?? 0,
            GD:   row?.goalsDiff ?? ((row?.all?.goals?.for ?? 0) - (row?.all?.goals?.against ?? 0)),
            Pts:  row?.points ?? 0,
          })
        }
      }
    }
    return NextResponse.json({ standings })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ standings: [], error: message }, { status: 200 })
  }
}
