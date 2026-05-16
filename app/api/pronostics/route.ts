import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

  const { match_id, score_home, score_away } = await request.json()
  if (!match_id || score_home == null || score_away == null) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const { data: match } = await supabase
    .from('matches')
    .select('status')
    .eq('id', match_id)
    .single()

  if (!match || match.status !== 'NS') {
    return NextResponse.json({ error: 'Paris fermés pour ce match' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pronostics')
    .upsert(
      { user_id: user.id, match_id, score_home, score_away },
      { onConflict: 'user_id,match_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
