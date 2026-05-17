// Types des lignes Supabase utilisées par l'UI.
// Source de vérité : supabase/001_initial.sql + 002_betting.sql.

export type Profile = {
  id: string
  pseudo: string
  total_points: number
  created_at: string
}

export type Prediction = {
  id: string
  user_id: string
  match_id: string
  pick: 'home' | 'draw' | 'away'
  score_home: number | null
  score_away: number | null
  status: 'pending' | 'won' | 'lost' | 'cancelled'
  points_earned: number
  scored: boolean
  created_at: string
}

export type LeaderboardRow = {
  id: string
  pseudo: string
  total_points: number
  total_predictions: number
  exact_scores: number
  correct_outcomes: number
  rang: number
}
