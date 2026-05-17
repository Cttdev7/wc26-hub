import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/predictions — place ou met à jour le pronostic du user connecté.
// Body: { match_id: string, pick: 'home'|'draw'|'away', score_home?: number, score_away?: number }
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { match_id, pick, score_home, score_away } = await request.json()
  if (!match_id || !pick) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  if (!['home', 'draw', 'away'].includes(pick)) {
    return NextResponse.json({ error: 'pick invalide' }, { status: 400 })
  }

  // Score exact : soit les deux champs sont définis, soit aucun
  const hasExact = score_home != null && score_away != null
  const sH = hasExact ? Number(score_home) : null
  const sA = hasExact ? Number(score_away) : null
  if (hasExact && (Number.isNaN(sH) || Number.isNaN(sA) || sH! < 0 || sA! < 0)) {
    return NextResponse.json({ error: 'Score exact invalide' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('place_prediction', {
    p_match_id: String(match_id),
    p_pick: pick,
    p_score_home: sH,
    p_score_away: sA,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ prediction_id: data })
}

// GET /api/predictions — liste les pronostics du user (newest first).
// Query: ?match_id=xxx pour filtrer un match.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('match_id')

  let query = supabase
    .from('pronostics')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (matchId) query = query.eq('match_id', matchId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ predictions: data ?? [] })
}
