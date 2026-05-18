import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 60 // refresh every minute

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json({ ok: false }, { status: 503 })
  }

  const sb = createClient(url, key, { auth: { persistSession: false } })

  const [players, predictions, wonPredictions, scoredPredictions, pointsSum] = await Promise.all([
    sb.from('profiles').select('*', { count: 'exact', head: true }),
    sb.from('pronostics').select('*', { count: 'exact', head: true }),
    sb.from('pronostics').select('*', { count: 'exact', head: true }).eq('status', 'won'),
    sb.from('pronostics').select('*', { count: 'exact', head: true }).eq('scored', true),
    sb.from('profiles').select('total_points').then(r =>
      r.data ? r.data.reduce((s, p) => s + (p.total_points ?? 0), 0) : 0
    ),
  ])

  const scored  = scoredPredictions.count ?? 0
  const won     = wonPredictions.count ?? 0
  const precision = scored > 0 ? (won / scored) * 100 : null

  return NextResponse.json({
    players:     players.count     ?? 0,
    predictions: predictions.count ?? 0,
    precision,
    totalPoints: typeof pointsSum === 'number' ? pointsSum : 0,
  })
}
