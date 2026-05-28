import { NextResponse } from 'next/server'

const TEAM_IDS: Record<string, number> = {
  FRA: 2,    BRA: 6,    ARG: 26,   POR: 27,   ESP: 9,
  ENG: 10,   GER: 25,   NED: 1118, MEX: 16,   BEL: 1,
  JPN: 12,   MAR: 31,   NOR: 1090, IRQ: 1567, EGY: 32,
  COL: 8,    URU: 7,    KSA: 23,   KOR: 17,   RSA: 1531,
  CZE: 770,  SUI: 15,   QAT: 1569, BIH: 1113, TUR: 777,
  PAR: 2380, AUS: 20,   SUE: 5,    TUN: 28,   UZB: 1568,
  CRO: 3,    PAN: 11,   GHA: 1504, ALG: 1532, AUT: 775,
  JOR: 1548, CIV: 1501, CUW: 5530, HAI: 2386, SCO: 1108,
  SEN: 13,   IRN: 22,
  USA: 2384, CAN: 5529, NZL: 4673, ECU: 2382, COD: 1508, CPV: 1533,
}

export type FormResult = 'W' | 'D' | 'L'
export type TeamFormResponse = { form: FormResult[]; found: boolean }

type ApiFixture = {
  fixture: { status: { short: string } }
  teams: {
    home: { id: number; winner: boolean | null }
    away: { id: number; winner: boolean | null }
  }
}

function resultFor(teamId: number, fx: ApiFixture): FormResult | null {
  if (fx.fixture.status.short !== 'FT' && fx.fixture.status.short !== 'AET' && fx.fixture.status.short !== 'PEN') {
    return null
  }
  const isHome = fx.teams.home.id === teamId
  const won = isHome ? fx.teams.home.winner : fx.teams.away.winner
  if (won === true) return 'W'
  if (won === false) return 'L'
  return 'D'
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json<TeamFormResponse>({ form: [], found: false }, { status: 400 })

  const teamId = TEAM_IDS[code]
  const key = process.env.API_FOOTBALL_KEY
  if (!teamId || !key) return NextResponse.json<TeamFormResponse>({ form: [], found: false })

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${teamId}&last=5`,
      { headers: { 'x-apisports-key': key }, next: { revalidate: 3600 } },
    )
    const data = await res.json()
    const fixtures: ApiFixture[] = data.response ?? []
    const form = fixtures
      .map(fx => resultFor(teamId, fx))
      .filter((r): r is FormResult => r !== null)
      .reverse() // API renvoie du plus récent au plus ancien → on inverse pour avoir chrono

    return NextResponse.json<TeamFormResponse>({ form, found: form.length > 0 })
  } catch {
    return NextResponse.json<TeamFormResponse>({ form: [], found: false })
  }
}
