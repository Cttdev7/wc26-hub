// Construit le bloc de contexte factuel injecté dans le prompt utilisateur,
// selon le mode détecté (match / team / general).

import { CALENDAR, TEAMS, type Match, type Team } from '@/components/wc26/data'
import type { Intent } from './match-parser'

type OddsResponse = {
  odds?: Array<{
    home_code: string | null
    away_code: string | null
    home_name: string
    away_name: string
    bookmakers: Array<{ name: string; home: number | null; draw: number | null; away: number | null }>
  }>
}

type StandingsResponse = {
  standings?: Array<{
    code: string
    rank: number | null
    P: number; W: number; D: number; L: number
    GF: number; GA: number; GD: number; Pts: number
  }>
}

type SquadResponse = {
  players?: Array<{
    id: number; name: string; number: number | null;
    age: number; pos: 'GK' | 'DEF' | 'MID' | 'FWD'
  }>
  found?: boolean
}

export async function buildContext(intent: Intent, origin: string): Promise<string> {
  switch (intent.mode) {
    case 'match':   return buildMatchContext(intent, origin)
    case 'team':    return buildTeamContext(intent, origin)
    case 'general': return buildGeneralContext(intent, origin)
  }
}

async function buildMatchContext(
  intent: Extract<Intent, { mode: 'match' }>,
  origin: string,
): Promise<string> {
  const { home, away } = intent
  const match: Match | null = intent.matchId
    ? CALENDAR.find(m => m.id === intent.matchId) ?? null
    : null

  const [oddsData, standingsData] = await Promise.all([
    safeJson<OddsResponse>(`${origin}/api/odds`),
    safeJson<StandingsResponse>(`${origin}/api/standings`),
  ])

  const liveOdds = findOdds(oddsData, home.code, away.code)
  const homeStanding = standingsData?.standings?.find(s => s.code === home.code) ?? null
  const awayStanding = standingsData?.standings?.find(s => s.code === away.code) ?? null

  const lines: string[] = []
  lines.push('## DONNÉES DU MATCH')
  if (match) {
    lines.push(`Match officiel WC26: ${home.name} (${home.code}) vs ${away.name} (${away.code})`)
    lines.push(`Date: ${match.date} à ${match.time} (heure locale stade)`)
    lines.push(`Phase: ${match.stage}${match.group ? ` · Groupe ${match.group}` : ''}`)
    lines.push(`Stade: ${match.venue}${match.city ? ` (${match.city})` : ''}`)
  } else {
    lines.push(`Match: ${home.name} (${home.code}) vs ${away.name} (${away.code})`)
    lines.push('Note: ce match n\'est pas au calendrier officiel WC26 (analyse hypothétique).')
  }

  lines.push('')
  lines.push('## ÉQUIPE À DOMICILE')
  lines.push(...teamSummary(home, homeStanding))

  lines.push('')
  lines.push('## ÉQUIPE À L\'EXTÉRIEUR')
  lines.push(...teamSummary(away, awayStanding))

  lines.push('')
  lines.push('## COTES BOOKMAKERS')
  if (liveOdds && liveOdds.bookmakers.length > 0) {
    lines.push('(Cotes Match Winner — marché français)')
    for (const b of liveOdds.bookmakers.slice(0, 6)) {
      lines.push(`${b.name}: ${home.code} ${b.home ?? '?'} | Nul ${b.draw ?? '?'} | ${away.code} ${b.away ?? '?'}`)
    }
  } else if (match?.odds) {
    lines.push(`Cotes (référence): ${home.code} ${match.odds.home} | Nul ${match.odds.draw} | ${away.code} ${match.odds.away}`)
  } else {
    lines.push('Cotes pas encore publiées par les bookmakers.')
  }

  return lines.join('\n')
}

async function buildTeamContext(
  intent: Extract<Intent, { mode: 'team' }>,
  origin: string,
): Promise<string> {
  const { team } = intent

  const [standingsData, squadData] = await Promise.all([
    safeJson<StandingsResponse>(`${origin}/api/standings`),
    safeJson<SquadResponse>(`${origin}/api/squad?code=${team.code}`),
  ])

  const standing = standingsData?.standings?.find(s => s.code === team.code) ?? null

  // Matchs à venir / récents dans le calendrier officiel
  const teamMatches = CALENDAR.filter(m => m.home === team.code || m.away === team.code)
  const upcoming = teamMatches.slice(0, 4)

  // Adversaires du groupe
  const groupRivals = TEAMS.filter(t => t.group === team.group && t.code !== team.code)

  const lines: string[] = []
  lines.push('## ÉQUIPE ANALYSÉE')
  lines.push(...teamSummary(team, standing))

  lines.push('')
  lines.push('## GROUPE WC26')
  lines.push(`Groupe ${team.group} — adversaires :`)
  for (const r of groupRivals) {
    lines.push(`- ${r.name} (${r.code}) · rang FIFA ${r.rank} · forme ${r.form.join(', ')}`)
  }

  lines.push('')
  lines.push('## MATCHS À VENIR')
  if (upcoming.length > 0) {
    for (const m of upcoming) {
      const opp = m.home === team.code ? m.away : m.home
      const oppTeam = TEAMS.find(t => t.code === opp)
      const side = m.home === team.code ? 'domicile' : 'extérieur'
      lines.push(`- ${m.date} ${m.time} · ${team.code} vs ${opp} (${oppTeam?.name ?? opp}) · ${side} · ${m.stage} · ${m.venue}`)
    }
  } else {
    lines.push('(Pas de matchs WC26 trouvés)')
  }

  lines.push('')
  lines.push('## EFFECTIF (API-Football)')
  if (squadData?.found && squadData.players && squadData.players.length > 0) {
    const grouped: Record<string, typeof squadData.players> = { GK: [], DEF: [], MID: [], FWD: [] }
    for (const p of squadData.players) (grouped[p.pos] ??= []).push(p)
    for (const pos of ['GK', 'DEF', 'MID', 'FWD']) {
      const list = grouped[pos] ?? []
      if (list.length === 0) continue
      const label = pos === 'GK' ? 'Gardiens' : pos === 'DEF' ? 'Défenseurs' : pos === 'MID' ? 'Milieux' : 'Attaquants'
      lines.push(`${label} (${list.length}) : ${list.map(p => `${p.name}${p.number ? ` #${p.number}` : ''} (${p.age}a)`).join(', ')}`)
    }
  } else {
    lines.push('(Effectif non disponible via API-Football pour cette équipe)')
  }

  return lines.join('\n')
}

async function buildGeneralContext(
  intent: Extract<Intent, { mode: 'general' }>,
  _origin: string,
): Promise<string> {
  void _origin
  void intent
  // Brief minimal sur la WC26 — Gemini complétera avec ses connaissances
  const top10 = [...TEAMS].sort((a, b) => a.rank - b.rank).slice(0, 10)
  const lines: string[] = []
  lines.push('## CONTEXTE COUPE DU MONDE 2026')
  lines.push('Tournoi : 11 juin → 19 juillet 2026 · USA + Canada + Mexique · 48 équipes · 12 groupes (A-L) · 104 matchs')
  lines.push('Match d\'ouverture : MEX vs KOR le 11 juin 2026 à Mexico')
  lines.push('Finale : 19 juillet 2026 au MetLife Stadium (New York/New Jersey)')
  lines.push('')
  lines.push('## TOP 10 RANKING FIFA (équipes qualifiées)')
  for (const t of top10) {
    lines.push(`${t.rank}. ${t.name} (${t.code}) · groupe ${t.group} · forme ${t.form.join(', ')}`)
  }
  lines.push('')
  lines.push('## INSTRUCTION')
  lines.push('La question du visiteur ne cible pas un match précis ni une équipe précise.')
  lines.push('Réponds en t\'appuyant sur tes connaissances football récentes, en restant centré sur la WC26.')
  return lines.join('\n')
}

function teamSummary(team: Team, standing: NonNullable<StandingsResponse['standings']>[number] | null) {
  const lines: string[] = []
  lines.push(`Nom: ${team.name}`)
  lines.push(`Code: ${team.code}`)
  lines.push(`Groupe WC26: ${team.group}`)
  lines.push(`Classement FIFA (rang mondial): ${team.rank}`)
  lines.push(`Forme récente (5 derniers matchs, plus récent en dernier): ${team.form.join(', ')}`)
  if (standing) {
    lines.push(`Classement live phase de groupes: J${standing.P} · ${standing.W}V ${standing.D}N ${standing.L}D · ${standing.GF}/${standing.GA} (diff ${standing.GD}) · ${standing.Pts} pts`)
  }
  return lines
}

function findOdds(data: OddsResponse | null, homeCode: string, awayCode: string) {
  if (!data?.odds) return null
  return data.odds.find(o =>
    (o.home_code === homeCode && o.away_code === awayCode) ||
    (o.home_code === awayCode && o.away_code === homeCode),
  ) ?? null
}

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}
