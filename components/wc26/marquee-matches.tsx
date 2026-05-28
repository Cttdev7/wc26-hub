'use client'

import { useEffect, useState } from 'react'
import { Flag, PALETTE } from './ui-primitives'
import { TEAMS } from './data'

type FeaturedMatch = {
  id: string
  home: { code: string; name: string; rank: number }
  away: { code: string; name: string; rank: number }
  date: string
  time: string
  stage: string
  group?: string
  venue: string
  city?: string
}

const MONTHS_SHORT = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']

function formatDateShort(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS_SHORT[m - 1]}`
}

// Bandeau déroulant infini affichant les matchs WC26 à venir les plus populaires.
// Chaque item est un bouton cliquable → ouvre la page du match.
export function MarqueeMatches({ onOpenMatch }: { onOpenMatch: (id: string) => void }) {
  const [matches, setMatches] = useState<FeaturedMatch[]>([])

  useEffect(() => {
    fetch('/api/featured-matches')
      .then(r => r.ok ? r.json() : { matches: [] })
      .then((d: { matches: FeaturedMatch[] }) => setMatches(d.matches ?? []))
      .catch(() => setMatches([]))
  }, [])

  if (matches.length === 0) {
    // Fallback discret pendant le chargement / si pas de matchs
    return (
      <div style={{
        overflow: 'hidden',
        borderTop: '1.5px solid var(--ink)',
        borderBottom: '1.5px solid var(--ink)',
        background: 'var(--paper)',
        padding: '12px 0',
        textAlign: 'center',
        fontSize: 12, fontWeight: 700, color: 'var(--muted)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        Coupe du Monde 2026 · 16 villes hôtes · 48 nations · 104 matchs
      </div>
    )
  }

  const content = (
    <>{matches.map((m, i) => (
      <MatchPill key={`${m.id}-${i}`} match={m} onClick={() => onOpenMatch(m.id)} />
    ))}</>
  )

  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1.5px solid var(--ink)',
      borderBottom: '1.5px solid var(--ink)',
      background: 'var(--paper)',
    }}>
      <div className="marquee-track" style={{ padding: '10px 0', gap: 36 }}>
        {content}{content}
      </div>
    </div>
  )
}

function MatchPill({ match, onClick }: { match: FeaturedMatch; onClick: () => void }) {
  const home = TEAMS.find(t => t.code === match.home.code) ?? null
  const away = TEAMS.find(t => t.code === match.away.code) ?? null

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 14px', borderRadius: 999,
        border: '1.5px solid var(--ink)', background: 'var(--paper-2)',
        cursor: 'pointer', fontFamily: 'inherit',
        whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = PALETTE.lime
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--paper-2)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <span className="display" style={{ fontSize: 12, color: PALETTE.blue }}>★</span>

      {home && <Flag team={home} w={22} h={15} />}
      <span className="display" style={{ fontSize: 13, lineHeight: 1 }}>{match.home.code}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em' }}>vs</span>
      <span className="display" style={{ fontSize: 13, lineHeight: 1 }}>{match.away.code}</span>
      {away && <Flag team={away} w={22} h={15} />}

      <span style={{
        fontSize: 11, fontWeight: 700, color: 'var(--muted)',
        marginLeft: 4, letterSpacing: '0.02em',
      }}>
        · {formatDateShort(match.date)} · {match.time} · {match.venue}
      </span>
    </button>
  )
}
