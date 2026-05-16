export type Match = {
  id: string
  api_match_id: number
  home_team: string
  away_team: string
  home_flag: string | null
  away_flag: string | null
  score_home: number | null
  score_away: number | null
  status: string
  kickoff_at: string
  phase: string | null
}

export type Pronostic = {
  id: string
  user_id: string
  match_id: string
  score_home: number
  score_away: number
  points_earned: number
  scored: boolean
  created_at: string
  matches?: Match
}

export type Profile = {
  id: string
  pseudo: string
  total_points: number
}

export type ClassementRow = {
  id: string
  pseudo: string
  total_points: number
  total_pronostics: number
  scores_exacts: number
  bons_vainqueurs: number
  rang: number
}
