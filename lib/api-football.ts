const BASE = 'https://v3.football.api-sports.io'

async function apiFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY! },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`API-Football error: ${res.status}`)
  return res.json()
}

export async function fetchMatches(leagueId = 1, season = 2026) {
  const data = await apiFetch(`/fixtures?league=${leagueId}&season=${season}`)
  return data.response ?? []
}

export async function fetchStandings(leagueId = 1, season = 2026) {
  const data = await apiFetch(`/standings?league=${leagueId}&season=${season}`)
  return data.response ?? []
}

export async function fetchTopScorers(leagueId = 1, season = 2026) {
  const data = await apiFetch(`/players/topscorers?league=${leagueId}&season=${season}`)
  return data.response ?? []
}
