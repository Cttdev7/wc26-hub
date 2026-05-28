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

const POS_MAP: Record<string, 'GK' | 'DEF' | 'MID' | 'FWD'> = {
  Goalkeeper: 'GK',
  Defender:   'DEF',
  Midfielder: 'MID',
  Attacker:   'FWD',
}

type SquadPlayer = {
  id: number
  name: string
  number: number | null
  age: number
  pos: 'GK' | 'DEF' | 'MID' | 'FWD'
  photo: string | null
}

export type LineupStarter = { num: number; name: string; pos: string; x: number; y: number }
export type Lineup = { formation: string; coach: string; starters: LineupStarter[]; bench: string[] }
export type LineupResponse = { lineup: Lineup | null; source: 'api' | 'auto' | 'none' }

async function fetchSquad(teamId: number, key: string): Promise<SquadPlayer[]> {
  const res = await fetch(
    `https://v3.football.api-sports.io/players/squads?team=${teamId}`,
    { headers: { 'x-apisports-key': key }, next: { revalidate: 86400 } },
  )
  const data = await res.json()
  const raw: { id: number; name: string; number: number; age: number; position: string; photo: string }[] =
    data.response?.[0]?.players ?? []
  return raw.map(p => ({
    id: p.id, name: p.name,
    number: p.number ?? null, age: p.age,
    pos: POS_MAP[p.position] ?? 'MID',
    photo: p.photo || null,
  }))
}

async function fetchCoach(teamId: number, key: string): Promise<string> {
  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/coachs?team=${teamId}`,
      { headers: { 'x-apisports-key': key }, next: { revalidate: 86400 } },
    )
    const data = await res.json()
    const coaches: { name: string; career?: { team?: { id: number }; end: string | null }[] }[] =
      data.response ?? []
    // Coach actuel = entrée career avec end===null pour ce team
    const current = coaches.find(c =>
      c.career?.some(j => j.team?.id === teamId && j.end === null),
    )
    if (current) return current.name
    // Fallback : coach le plus récent ayant entraîné l'équipe
    return coaches[0]?.name ?? '—'
  } catch {
    return '—'
  }
}

// Compo officielle quand l'API la publie (~1h avant le coup d'envoi).
// On filtre par nextfixture du team pour récupérer la fixture la plus proche.
async function fetchOfficialLineup(teamId: number, key: string): Promise<Lineup | null> {
  try {
    // 1. Trouve la prochaine fixture WC26 (league 1, season 2026) de cette équipe
    const fixturesRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${teamId}&league=1&season=2026&next=1`,
      { headers: { 'x-apisports-key': key }, next: { revalidate: 600 } },
    )
    const fixturesData = await fixturesRes.json()
    const fixtureId: number | undefined = fixturesData.response?.[0]?.fixture?.id
    if (!fixtureId) return null

    // 2. Récupère la compo officielle pour cette fixture
    const lineupsRes = await fetch(
      `https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureId}&team=${teamId}`,
      { headers: { 'x-apisports-key': key }, next: { revalidate: 600 } },
    )
    const lineupsData = await lineupsRes.json()
    const block = lineupsData.response?.[0]
    if (!block || !block.startXI || block.startXI.length === 0) return null

    // grid "row:col" — row 1 = GK, plus row monte, plus on est offensif
    // y mapping : row 1→90, row 2→72, row 3→52, row 4→32, row 5→16
    const Y_BY_ROW: Record<number, number> = { 1: 90, 2: 72, 3: 52, 4: 32, 5: 16 }

    // Groupe par row pour répartir x
    const byRow: Record<number, { num: number; name: string; pos: string; col: number }[]> = {}
    for (const it of block.startXI as Array<{ player: { number: number; name: string; pos: string; grid: string } }>) {
      const p = it.player
      const [rowStr, colStr] = (p.grid ?? '1:1').split(':')
      const row = parseInt(rowStr, 10) || 1
      const col = parseInt(colStr, 10) || 1
      if (!byRow[row]) byRow[row] = []
      byRow[row].push({ num: p.number, name: p.name, pos: p.pos, col })
    }

    const starters: LineupStarter[] = []
    for (const rowStr of Object.keys(byRow)) {
      const row = parseInt(rowStr, 10)
      const players = byRow[row].sort((a, b) => a.col - b.col)
      const count = players.length
      const y = Y_BY_ROW[row] ?? 50
      players.forEach((p, i) => {
        const x = count === 1 ? 50 : 14 + (i * (72 / (count - 1)))
        starters.push({ num: p.num, name: p.name, pos: p.pos, x, y })
      })
    }

    const bench: string[] = (block.substitutes ?? []).map((it: { player: { number: number; name: string } }) =>
      `${it.player.number ?? '?'} ${it.player.name}`,
    )

    return {
      formation: block.formation ?? '4-3-3',
      coach: block.coach?.name ?? '—',
      starters,
      bench,
    }
  } catch {
    return null
  }
}

// Génère une compo probable 4-3-3 depuis le squad.
function autoLineup(players: SquadPlayer[], coach: string): Lineup {
  const gks  = players.filter(p => p.pos === 'GK').slice(0, 1)
  const defs = players.filter(p => p.pos === 'DEF').slice(0, 4)
  const mids = players.filter(p => p.pos === 'MID').slice(0, 3)
  const fwds = players.filter(p => p.pos === 'FWD').slice(0, 3)

  const starters: LineupStarter[] = []
  if (gks[0]) starters.push({ num: gks[0].number ?? 1, name: gks[0].name, pos: 'GK', x: 50, y: 90 })
  defs.forEach((p, i) => {
    const xs = [14, 38, 62, 86]
    const labels = ['LB', 'CB', 'CB', 'RB']
    starters.push({ num: p.number ?? 0, name: p.name, pos: labels[i] ?? 'DEF', x: xs[i] ?? 50, y: 72 })
  })
  mids.forEach((p, i) => {
    const xs = [22, 50, 78]
    starters.push({ num: p.number ?? 0, name: p.name, pos: 'CM', x: xs[i] ?? 50, y: 52 })
  })
  fwds.forEach((p, i) => {
    const xs = [22, 50, 78]
    const labels = ['LW', 'ST', 'RW']
    starters.push({ num: p.number ?? 0, name: p.name, pos: labels[i] ?? 'FWD', x: xs[i] ?? 50, y: 22 })
  })

  const used = new Set(starters.map(s => `${s.num}-${s.name}`))
  const bench = players
    .filter(p => !used.has(`${p.number ?? 0}-${p.name}`))
    .slice(0, 12)
    .map(p => `${p.number ?? '?'} ${p.name}`)

  return { formation: '4-3-3', coach, starters, bench }
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json({ lineup: null, source: 'none' }, { status: 400 })

  const teamId = TEAM_IDS[code]
  const key = process.env.API_FOOTBALL_KEY
  if (!teamId || !key) {
    return NextResponse.json<LineupResponse>({ lineup: null, source: 'none' })
  }

  // 1. Tente la compo officielle (publiée par l'API ~1h avant le match)
  const official = await fetchOfficialLineup(teamId, key)
  if (official) {
    return NextResponse.json<LineupResponse>({ lineup: official, source: 'api' })
  }

  // 2. Fallback : génère une compo probable depuis le squad
  try {
    const [players, coach] = await Promise.all([
      fetchSquad(teamId, key),
      fetchCoach(teamId, key),
    ])
    if (!players.length) return NextResponse.json<LineupResponse>({ lineup: null, source: 'none' })
    return NextResponse.json<LineupResponse>({ lineup: autoLineup(players, coach), source: 'auto' })
  } catch {
    return NextResponse.json<LineupResponse>({ lineup: null, source: 'none' })
  }
}
