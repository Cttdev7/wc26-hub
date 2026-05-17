import { NextResponse } from 'next/server'
import { codeFromName } from '@/lib/team-codes'

const BASE = 'https://v3.football.api-sports.io'

// 30 min de cache : les cotes bougent mais pas à la seconde, et le plan
// gratuit API-Football a 100 appels/jour à préserver.
export const revalidate = 1800

export type OddRow = {
  fixture_id: number
  home_code: string | null
  away_code: string | null
  home_name: string
  away_name: string
  kickoff: string         // ISO
  bookmakers: Array<{
    name: string
    home: number | null
    draw: number | null
    away: number | null
  }>
}

// Liste blanche des bookmakers qu'on garde dans la réponse pour éviter le
// bruit (l'API renvoie ~30 bookmakers internationaux dont des inutiles ici).
const KEEP_BOOKMAKERS = new Set([
  'Betclic', 'Winamax', 'Unibet', 'PMU', 'Parionssport', 'FDJ',
  'Zebet', 'NetBet', 'Bwin', '888sport', 'Bet365',
])

export async function GET() {
  if (!process.env.API_FOOTBALL_KEY) {
    return NextResponse.json({ odds: [], warning: 'API_FOOTBALL_KEY not set' })
  }
  try {
    const res = await fetch(`${BASE}/odds?league=1&season=2026`, {
      headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY },
      next: { revalidate: 1800 },
    })
    if (!res.ok) {
      return NextResponse.json(
        { odds: [], error: `API-Football odds: ${res.status}` },
        { status: 200 },
      )
    }
    const data = await res.json()

    const odds: OddRow[] = []
    for (const row of (data.response ?? [])) {
      const homeName: string = row?.teams?.home?.name ?? ''
      const awayName: string = row?.teams?.away?.name ?? ''
      const kickoff: string  = row?.fixture?.date ?? ''
      const fixtureId: number = row?.fixture?.id ?? 0

      const bookmakers: OddRow['bookmakers'] = []
      for (const b of (row?.bookmakers ?? [])) {
        if (!KEEP_BOOKMAKERS.has(b?.name)) continue
        const matchWinner = (b?.bets ?? []).find((x: { name?: string }) => x?.name === 'Match Winner')
        if (!matchWinner) continue
        const vals: { value: string; odd: string }[] = matchWinner.values ?? []
        const find = (v: string) => {
          const m = vals.find(x => x.value === v)
          return m ? Number(m.odd) : null
        }
        bookmakers.push({
          name: b.name,
          home: find('Home'),
          draw: find('Draw'),
          away: find('Away'),
        })
      }
      if (bookmakers.length === 0) continue

      odds.push({
        fixture_id: fixtureId,
        home_code: codeFromName(homeName),
        away_code: codeFromName(awayName),
        home_name: homeName,
        away_name: awayName,
        kickoff,
        bookmakers,
      })
    }

    return NextResponse.json({ odds })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ odds: [], error: msg }, { status: 200 })
  }
}
