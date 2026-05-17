import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/bets — place a bet via the place_bet() Postgres function.
// Body: { match_id: string, pick: 'home'|'draw'|'away', stake: number, odds: number }
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { match_id, pick, stake, odds } = await request.json()
  if (!match_id || !pick || !stake || !odds) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }
  if (!['home','draw','away'].includes(pick)) {
    return NextResponse.json({ error: 'pick invalide' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('place_bet', {
    p_match_id: String(match_id),
    p_pick: pick,
    p_stake: Number(stake),
    p_odds: Number(odds),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ bet_id: data })
}

// GET /api/bets — list the user's bets (newest first).
// Query: ?match_id=mX to filter to one match.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('match_id')

  let query = supabase.from('pronostics').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (matchId) query = query.eq('match_id', matchId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bets: data ?? [] })
}
