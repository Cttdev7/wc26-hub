// Détecte l'intention de l'utilisateur à partir d'un message libre :
//   - "match"   : 2 équipes détectées → analyse pré-match avec probabilités
//   - "team"    : 1 seule équipe détectée → analyse d'équipe (effectif, forme, perspectives)
//   - "general" : aucune équipe détectée → réponse libre (joueurs, favoris, comparaisons…)

import { CALENDAR, TEAMS, type Team } from '@/components/wc26/data'

type Alias = { code: string; needles: string[] }

const ALIASES: Alias[] = [
  { code: 'FRA', needles: ['france', 'fra', 'bleus', 'équipe de france'] },
  { code: 'BRA', needles: ['brésil', 'bresil', 'brazil', 'bra', 'seleção', 'selecao', 'auriverde'] },
  { code: 'ARG', needles: ['argentine', 'argentina', 'arg', 'albiceleste'] },
  { code: 'POR', needles: ['portugal', 'por'] },
  { code: 'ESP', needles: ['espagne', 'spain', 'esp', 'roja'] },
  { code: 'ENG', needles: ['angleterre', 'england', 'eng', 'three lions'] },
  { code: 'GER', needles: ['allemagne', 'germany', 'ger', 'mannschaft'] },
  { code: 'NED', needles: ['pays-bas', 'pays bas', 'hollande', 'netherlands', 'ned', 'oranje'] },
  { code: 'MEX', needles: ['mexique', 'mexico', 'mex', 'tri'] },
  { code: 'USA', needles: ['usa', 'états-unis', 'etats-unis', 'united states', 'us soccer'] },
  { code: 'CAN', needles: ['canada', 'can'] },
  { code: 'JPN', needles: ['japon', 'japan', 'jpn'] },
  { code: 'KOR', needles: ['corée du sud', 'coree du sud', 'corée', 'coree', 'korea', 'kor'] },
  { code: 'RSA', needles: ['afrique du sud', 'south africa', 'rsa', 'bafana'] },
  { code: 'CZE', needles: ['tchéquie', 'tchequie', 'république tchèque', 'czech', 'cze'] },
  { code: 'SUI', needles: ['suisse', 'switzerland', 'sui', 'nati'] },
  { code: 'QAT', needles: ['qatar', 'qat'] },
  { code: 'BIH', needles: ['bosnie', 'bosnia', 'bih', 'bosnie-herzégovine'] },
  { code: 'MAR', needles: ['maroc', 'morocco', 'mar', 'lions de l\'atlas'] },
  { code: 'HAI', needles: ['haïti', 'haiti', 'hai'] },
  { code: 'SCO', needles: ['écosse', 'ecosse', 'scotland', 'sco'] },
  { code: 'TUR', needles: ['turquie', 'türkiye', 'turkiye', 'turkey', 'tur'] },
  { code: 'PAR', needles: ['paraguay', 'par'] },
  { code: 'AUS', needles: ['australie', 'australia', 'aus', 'socceroos'] },
  { code: 'CIV', needles: ['côte d\'ivoire', 'cote d\'ivoire', 'ivory coast', 'civ', 'éléphants'] },
  { code: 'ECU', needles: ['équateur', 'equateur', 'ecuador', 'ecu'] },
  { code: 'CUW', needles: ['curaçao', 'curacao', 'cuw'] },
  { code: 'SUE', needles: ['suède', 'suede', 'sweden', 'sue'] },
  { code: 'TUN', needles: ['tunisie', 'tunisia', 'tun', 'aigles de carthage'] },
  { code: 'BEL', needles: ['belgique', 'belgium', 'bel', 'diables rouges'] },
  { code: 'IRN', needles: ['iran', 'irn'] },
  { code: 'EGY', needles: ['égypte', 'egypte', 'egypt', 'egy', 'pharaons'] },
  { code: 'NZL', needles: ['nouvelle-zélande', 'nouvelle zelande', 'new zealand', 'nzl', 'all whites'] },
  { code: 'URU', needles: ['uruguay', 'uru', 'celeste'] },
  { code: 'KSA', needles: ['arabie saoudite', 'saudi arabia', 'ksa'] },
  { code: 'CPV', needles: ['cap-vert', 'cap vert', 'cape verde', 'cpv'] },
  { code: 'SEN', needles: ['sénégal', 'senegal', 'sen', 'lions de la teranga'] },
  { code: 'IRQ', needles: ['irak', 'iraq', 'irq'] },
  { code: 'NOR', needles: ['norvège', 'norvege', 'norway', 'nor'] },
  { code: 'ALG', needles: ['algérie', 'algerie', 'algeria', 'alg', 'fennecs'] },
  { code: 'AUT', needles: ['autriche', 'austria', 'aut'] },
  { code: 'JOR', needles: ['jordanie', 'jordan', 'jor'] },
  { code: 'COL', needles: ['colombie', 'colombia', 'col', 'cafeteros'] },
  { code: 'UZB', needles: ['ouzbékistan', 'ouzbekistan', 'uzbekistan', 'uzb'] },
  { code: 'COD', needles: ['rd congo', 'rdc', 'congo dr', 'cod', 'léopards'] },
  { code: 'CRO', needles: ['croatie', 'croatia', 'cro', 'vatreni'] },
  { code: 'PAN', needles: ['panama', 'pan'] },
  { code: 'GHA', needles: ['ghana', 'gha', 'black stars'] },
]

export type Intent =
  | { mode: 'match'; home: Team; away: Team; matchId: string | null; rawMessage: string }
  | { mode: 'team'; team: Team; rawMessage: string }
  | { mode: 'general'; rawMessage: string }

type Hit = { code: string; pos: number }

function findTeamHits(message: string): Hit[] {
  const lower = ` ${message.toLowerCase()} `
  const hits: Hit[] = []
  for (const { code, needles } of ALIASES) {
    let best = -1
    for (const n of needles) {
      const pattern = new RegExp(`[^a-zà-ÿ]${escapeRegex(n)}[^a-zà-ÿ]`, 'i')
      const m = lower.match(pattern)
      if (m && m.index !== undefined && (best === -1 || m.index < best)) {
        best = m.index
      }
    }
    if (best >= 0) hits.push({ code, pos: best })
  }
  hits.sort((a, b) => a.pos - b.pos)
  // Garde un hit unique par code
  const seen = new Set<string>()
  const unique: Hit[] = []
  for (const h of hits) {
    if (!seen.has(h.code)) {
      seen.add(h.code)
      unique.push(h)
    }
  }
  return unique
}

export function parseIntent(message: string): Intent {
  const hits = findTeamHits(message)

  if (hits.length >= 2) {
    const [first, second] = hits
    const calendarMatch = CALENDAR.find(m =>
      (m.home === first.code && m.away === second.code) ||
      (m.home === second.code && m.away === first.code),
    )
    const home = TEAMS.find(t => t.code === (calendarMatch?.home ?? first.code))
    const away = TEAMS.find(t => t.code === (calendarMatch?.away ?? second.code))
    if (home && away) {
      return {
        mode: 'match',
        home,
        away,
        matchId: calendarMatch?.id ?? null,
        rawMessage: message,
      }
    }
  }

  if (hits.length >= 1) {
    const team = TEAMS.find(t => t.code === hits[0].code)
    if (team) {
      return { mode: 'team', team, rawMessage: message }
    }
  }

  return { mode: 'general', rawMessage: message }
}

// Backward compat — utilisé par agent-view.tsx pour l'affichage de la carte
export type ParsedMatch = {
  homeCode: string
  awayCode: string
  matchId: string | null
}

export function parseMatch(message: string): ParsedMatch | null {
  const intent = parseIntent(message)
  if (intent.mode !== 'match') return null
  return {
    homeCode: intent.home.code,
    awayCode: intent.away.code,
    matchId: intent.matchId,
  }
}

export function getTeamInfo(code: string) {
  return TEAMS.find(t => t.code === code) ?? null
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
