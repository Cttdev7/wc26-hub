import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/leaderboard — classement des pronostiqueurs.
// Query: ?limit=10 (default) ou ?limit=all (max 500).
// Lit la vue `classement` créée dans supabase/003_predictions.sql.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const param = searchParams.get('limit') ?? '10'
  const limit = param === 'all' ? 500 : Math.min(500, Math.max(1, Number(param) || 10))

  const { data, error } = await supabase
    .from('classement')
    .select('*')
    .order('total_points', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leaderboard: data ?? [] })
}
