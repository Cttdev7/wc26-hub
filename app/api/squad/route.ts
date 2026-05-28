import { NextResponse } from 'next/server'

// API-Football national team IDs for WC2026 participants
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
  // Ajoutés mai 2026 — IDs vérifiés via search teams API (squads pas encore peuplés côté API)
  USA: 2384, CAN: 5529, NZL: 4673, ECU: 2382, COD: 1508, CPV: 1533,
}

const POS_MAP: Record<string, 'GK' | 'DEF' | 'MID' | 'FWD'> = {
  Goalkeeper: 'GK',
  Defender:   'DEF',
  Midfielder: 'MID',
  Attacker:   'FWD',
}

export type SquadPlayer = {
  id: number
  name: string
  number: number | null
  age: number
  pos: 'GK' | 'DEF' | 'MID' | 'FWD'
  photo: string | null
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json({ error: 'missing code' }, { status: 400 })

  const teamId = TEAM_IDS[code]
  if (!teamId) return NextResponse.json({ players: [], found: false })

  const key = process.env.API_FOOTBALL_KEY
  if (!key) return NextResponse.json({ players: [], found: false })

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/players/squads?team=${teamId}`,
      {
        headers: { 'x-apisports-key': key },
        next: { revalidate: 86400 }, // cache 24h — squads rarely change
      }
    )
    const data = await res.json()
    const raw: { id: number; name: string; number: number; age: number; position: string; photo: string }[] =
      data.response?.[0]?.players ?? []

    const players: SquadPlayer[] = raw.map(p => ({
      id:     p.id,
      name:   p.name,
      number: p.number ?? null,
      age:    p.age,
      pos:    POS_MAP[p.position] ?? 'MID',
      photo:  p.photo || null,
    }))

    return NextResponse.json({ players, found: true })
  } catch {
    return NextResponse.json({ players: [], found: false })
  }
}
