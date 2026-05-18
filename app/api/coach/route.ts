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
}

export type CoachData = {
  name: string
  photo: string | null
  age: number | null
  nationality: string | null
  since: string | null
  career: { team: string; start: string; end: string | null }[]
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json({ coach: null })

  const teamId = TEAM_IDS[code]
  if (!teamId) return NextResponse.json({ coach: null })

  const key = process.env.API_FOOTBALL_KEY
  if (!key) return NextResponse.json({ coach: null })

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/coachs?team=${teamId}`,
      {
        headers: { 'x-apisports-key': key },
        next: { revalidate: 86400 },
      }
    )
    const data = await res.json()
    const coaches: any[] = data.response ?? []

    // Find coach currently managing this team (career entry with end === null for this teamId)
    let coach = coaches.find(c =>
      c.career?.some((j: any) => j.team?.id === teamId && j.end === null)
    )

    // Fallback: most recent coach for this team
    if (!coach) {
      const withHistory = coaches.filter(c =>
        c.career?.some((j: any) => j.team?.id === teamId)
      )
      if (withHistory.length) {
        coach = withHistory.sort((a, b) => {
          const aDate = a.career?.find((j: any) => j.team?.id === teamId)?.start ?? ''
          const bDate = b.career?.find((j: any) => j.team?.id === teamId)?.start ?? ''
          return bDate.localeCompare(aDate)
        })[0]
      }
    }

    if (!coach) return NextResponse.json({ coach: null })

    const currentJob = coach.career?.find((j: any) => j.team?.id === teamId)

    const result: CoachData = {
      name:        coach.name,
      photo:       coach.photo || null,
      age:         coach.age ?? null,
      nationality: coach.nationality ?? null,
      since:       currentJob?.start ?? null,
      career: (coach.career ?? [])
        .filter((j: any) => j.team?.name)
        .slice(0, 5)
        .map((j: any) => ({
          team:  j.team.name,
          start: j.start ?? '',
          end:   j.end ?? null,
        })),
    }

    return NextResponse.json({ coach: result })
  } catch {
    return NextResponse.json({ coach: null })
  }
}
