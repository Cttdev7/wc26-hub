'use client'
import { useState } from 'react'
import { Match } from '@/lib/types'

export default function PronosticForm({
  match,
  existing,
}: {
  match: Match
  existing?: { score_home: number; score_away: number }
}) {
  const [home, setHome] = useState(existing?.score_home ?? 0)
  const [away, setAway] = useState(existing?.score_away ?? 0)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(!!existing)
  const [error, setError] = useState('')

  if (match.status !== 'NS') {
    return <span style={{ color: '#444', fontSize: 13 }}>Paris fermés</span>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/pronostics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_id: match.id, score_home: home, score_away: away }),
    })
    if (res.ok) {
      setSaved(true)
    } else {
      const data = await res.json()
      setError(data.error)
    }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: 44, background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
    padding: 6, color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 700,
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <input type="number" min={0} max={20} value={home}
        onChange={e => { setHome(+e.target.value); setSaved(false) }}
        style={inputStyle} />
      <span style={{ color: '#555' }}>-</span>
      <input type="number" min={0} max={20} value={away}
        onChange={e => { setAway(+e.target.value); setSaved(false) }}
        style={inputStyle} />
      <button type="submit" disabled={loading || saved}
        style={{
          background: saved ? 'transparent' : '#C8FF00',
          color: saved ? '#C8FF00' : '#0A0A0A',
          fontWeight: 700, fontSize: 13, padding: '6px 14px', borderRadius: 6,
          border: saved ? '1px solid #C8FF00' : 'none',
          cursor: saved ? 'default' : 'pointer',
        }}>
        {saved ? '✓ Sauvé' : loading ? '...' : 'Parier'}
      </button>
      {error && <span style={{ color: '#ff6b6b', fontSize: 12 }}>{error}</span>}
    </form>
  )
}
