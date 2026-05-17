'use client'

// LeaderboardView — classement complet des pronostiqueurs.
// Lit /api/leaderboard?limit=all. Même styling que le bloc compact
// présent dans PredictionsView, étalé sur toute la largeur.

import { useEffect, useState } from 'react'
import type { LeaderboardRow } from '@/lib/db-types'
import { PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const AVATAR_COLORS = ['#FF0080', '#0033FF', '#C8FF00', '#6B2FB5', '#E10600', '#FF6E00', '#0A0A0A', '#FFD400']
const avatarFor = (id: string) => {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function LeaderboardView({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/leaderboard?limit=all')
      .then(r => r.ok ? r.json() : { leaderboard: [] })
      .then((d: { leaderboard: LeaderboardRow[] }) => { if (!cancelled) { setRows(d.leaderboard ?? []); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>
      <button onClick={onBack} style={{
        background:'none', border:'none', color:'var(--muted)', fontSize:12,
        fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase',
        padding:0, marginBottom:22, cursor:'pointer',
      }}>← Retour aux pronostics</button>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24, gap:24 }}>
        <div>
          <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>🏆 LEADERBOARD</span>
          <h1 className="display" style={{ fontSize:80, margin:'14px 0 0', lineHeight:0.9 }}>Classement</h1>
          <p style={{ fontSize:14, color:'var(--muted)', marginTop:8, maxWidth:580, lineHeight:1.45 }}>
            Tous les inscrits, triés par points cumulés. Score exact = 5 pts, bon vainqueur = 3 pts.
          </p>
        </div>
        <div style={{ display:'flex', gap:14, fontSize:11, fontWeight:700, color:'var(--muted)' }}>
          <span>{rows.length} joueur{rows.length>1?'s':''}</span>
        </div>
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'18px 24px', background:'var(--ink)', color:'var(--paper)' }}>
          <h3 className="display" style={{ fontSize:22, margin:0 }}>Top pronostiqueurs</h3>
          <div style={{ fontSize:11, opacity:0.7, fontWeight:600, marginTop:2 }}>Mis à jour après chaque match scoré</div>
        </div>

        {loading ? (
          <div style={{ padding:'40px 24px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>Chargement…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding:'48px 24px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>
            Aucun pronostiqueur encore. <strong style={{ color:'var(--ink)' }}>Sois le premier !</strong>
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--paper-2)' }}>
                <th style={th(50)}>#</th>
                <th style={{ ...th(), textAlign:'left', paddingLeft:18 }}>PSEUDO</th>
                <th style={th(80)}>PRONOSTICS</th>
                <th style={th(80)}>SCORE EXACT</th>
                <th style={th(80)}>BON RÉSULTAT</th>
                <th style={{ ...th(90), color:'var(--ink)' }}>POINTS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const posColor = i === 0 ? PALETTE.lime : i === 1 ? '#E8E4DE' : i === 2 ? PALETTE.orange : 'transparent'
                return (
                  <tr key={r.id} style={{ borderTop:'1px solid var(--line)', background: i<3 ? 'rgba(200,255,0,0.04)' : 'transparent' }}>
                    <td style={{ textAlign:'center', padding:'14px 4px' }}>
                      <span style={{
                        display:'inline-block', width:30, height:30, lineHeight:'27px',
                        borderRadius:6, background: posColor === 'transparent' ? 'var(--paper-2)' : posColor,
                        border:'1.5px solid var(--ink)', fontFamily:'var(--font-archivo-black), Archivo Black',
                        fontSize:14, color:'var(--ink)',
                      }}>{r.rang}</span>
                    </td>
                    <td style={{ padding:'14px 18px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ width:28, height:28, borderRadius:'50%', background: avatarFor(r.id), border:'1.5px solid var(--ink)', flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800 }}>@{r.pseudo}</div>
                          <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:1 }}>
                            {r.total_predictions} pronostic{r.total_predictions>1?'s':''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...td(), textAlign:'center' }}>{r.total_predictions}</td>
                    <td style={{ ...td(), textAlign:'center', color: PALETTE.lime, fontWeight:800 }}>{r.exact_scores}</td>
                    <td style={{ ...td(), textAlign:'center', color: PALETTE.blue, fontWeight:800 }}>{r.correct_outcomes}</td>
                    <td style={{ ...td(), textAlign:'center', fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:18, color:'var(--ink)' }}>
                      {r.total_points.toLocaleString('fr-FR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

function th(w?: number): React.CSSProperties {
  return {
    padding:'10px 6px', fontSize:9, fontWeight:800, color:'var(--muted)',
    letterSpacing:'0.08em', textAlign:'center', width: w || undefined,
  }
}
function td(): React.CSSProperties {
  return {
    padding:'14px 6px', fontSize:12,
    fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontWeight:700,
    color:'var(--ink)',
  }
}
