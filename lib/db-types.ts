// Types des lignes Supabase utilisées par l'UI.
// Source de vérité : supabase/001_initial.sql + 002_betting.sql.

export type Profile = {
  id: string
  pseudo: string
  total_points: number
  created_at: string
}

export type Bet = {
  id: string
  user_id: string
  match_id: string
  pick: 'home' | 'draw' | 'away'
  stake: number
  odds: number
  status: 'pending' | 'won' | 'lost' | 'cancelled'
  payout: number | null
  points_earned: number
  scored: boolean
  created_at: string
}
