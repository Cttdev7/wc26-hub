// Renvoie les matchs WC26 les plus "populaires" à venir / en cours.
// Popularité = combinaison du rang FIFA des 2 équipes + proximité de la date.

import { NextResponse } from 'next/server'
import { CALENDAR, TEAMS, type Match } from '@/components/wc26/data'

export const revalidate = 300 // 5 min — la liste évolue peu

export type FeaturedMatch = {
  id: string
  home: { code: string; name: string; rank: number }
  away: { code: string; name: string; rank: number }
  date: string          // YYYY-MM-DD
  time: string          // HH:MM
  stage: string
  group?: string
  venue: string
  city?: string
  popularity: number    // score interne (debug / tri)
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function popularityScore(home: number, away: number, daysUntil: number): number {
  // Plus le rang est bas (proche de 1), plus c'est un gros match.
  // On utilise 1/rank pour pondérer.
  const ranking = (1 / Math.max(home, 1)) + (1 / Math.max(away, 1))

  // Bonus pour les gros chocs (les 2 dans le top 10)
  const topClash = home <= 10 && away <= 10 ? 0.5 : 0

  // Bonus pour les matchs proches dans le temps (J0 à J7)
  const proximity = daysUntil <= 0 ? 0.4
                  : daysUntil <= 3 ? 0.3
                  : daysUntil <= 7 ? 0.2
                  : daysUntil <= 14 ? 0.1
                  : 0

  return ranking + topClash + proximity
}

function daysBetween(today: string, target: string): number {
  const t = new Date(today + 'T00:00:00')
  const x = new Date(target + 'T00:00:00')
  return Math.round((x.getTime() - t.getTime()) / (1000 * 60 * 60 * 24))
}

export async function GET() {
  const today = todayStr()

  // Filtre : matchs à venir ou aujourd'hui
  const upcoming: Match[] = CALENDAR.filter(m => m.date >= today)

  const scored: FeaturedMatch[] = upcoming
    .map(m => {
      const home = TEAMS.find(t => t.code === m.home)
      const away = TEAMS.find(t => t.code === m.away)
      if (!home || !away) return null
      const days = daysBetween(today, m.date)
      const popularity = popularityScore(home.rank, away.rank, days)
      return {
        id: m.id,
        home: { code: home.code, name: home.name, rank: home.rank },
        away: { code: away.code, name: away.name, rank: away.rank },
        date: m.date,
        time: m.time,
        stage: m.stage,
        group: m.group,
        venue: m.venue,
        city: m.city,
        popularity,
      } as FeaturedMatch
    })
    .filter((x): x is FeaturedMatch => x !== null)
    .sort((a, b) => {
      // 1. Plus populaire d'abord
      if (b.popularity !== a.popularity) return b.popularity - a.popularity
      // 2. Plus proche dans le temps en cas d'égalité
      return a.date.localeCompare(b.date)
    })
    .slice(0, 8)

  return NextResponse.json({ matches: scored, generatedAt: new Date().toISOString() })
}
