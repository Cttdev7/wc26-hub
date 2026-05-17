'use client'

// PredictionFormView — page de pronostic d'un match.
// Pick 1/N/2 obligatoire + score exact optionnel.
// Barème de points (appliqué après le match) : exact 5 pts, bon vainqueur 3 pts, faux 0.

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Prediction } from '@/lib/db-types'
import { TEAMS, MATCHES, CALENDAR, FEATURED, STAGE_INFO, TZ_LABEL, toParis } from './data'
import { Flag, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

export function PredictionFormView({
  matchId, onBack, user,
}: { matchId: string; onBack: () => void; user?: User | null }) {
  const m = CALENDAR.find(x => x.id===matchId) || MATCHES.find(x => x.id===matchId) || FEATURED
  const home = teamByCode(m.home), away = teamByCode(m.away)
  const stageLbl = STAGE_INFO[m.stage]
    ? STAGE_INFO[m.stage].label + (m.group && m.group !== '-' ? ' · Groupe ' + m.group : '')
    : m.stage

  const [pick, setPick] = useState<'home' | 'draw' | 'away' | null>(null)
  const [scoreH, setScoreH] = useState<string>('')
  const [scoreA, setScoreA] = useState<string>('')
  const [exactOn, setExactOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [existing, setExisting] = useState<Prediction | null>(null)

  // Charge le pronostic existant pour ce match.
  useEffect(() => {
    if (!user) { setExisting(null); return }
    fetch(`/api/predictions?match_id=${encodeURIComponent(m.id)}`)
      .then(r => r.ok ? r.json() : { predictions: [] })
      .then((d: { predictions: Prediction[] }) => {
        const ex = d.predictions[0] ?? null
        setExisting(ex)
        if (ex) {
          setPick(ex.pick)
          if (ex.score_home != null && ex.score_away != null) {
            setScoreH(String(ex.score_home))
            setScoreA(String(ex.score_away))
            setExactOn(true)
          }
        }
      })
      .catch(() => setExisting(null))
  }, [user, m.id])

  const submit = async () => {
    if (!user) { onBack(); return }
    if (!pick) return
    setBusy(true); setFeedback(null)
    const body: any = { match_id: m.id, pick }
    if (exactOn && scoreH !== '' && scoreA !== '') {
      const sH = Number(scoreH), sA = Number(scoreA)
      if (Number.isNaN(sH) || Number.isNaN(sA) || sH < 0 || sA < 0) {
        setFeedback({ kind: 'err', msg: 'Score exact invalide.' })
        setBusy(false); return
      }
      body.score_home = sH; body.score_away = sA
    }
    const res = await fetch('/api/predictions', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) setFeedback({ kind: 'err', msg: json.error || 'Erreur' })
    else {
      setFeedback({ kind: 'ok', msg: 'Pronostic enregistré.' })
      // Refresh local state
      const r2 = await fetch(`/api/predictions?match_id=${encodeURIComponent(m.id)}`)
      if (r2.ok) {
        const d: { predictions: Prediction[] } = await r2.json()
        setExisting(d.predictions[0] ?? null)
      }
    }
    setBusy(false)
  }

  const pickLabel = (p: 'home' | 'draw' | 'away') =>
    p === 'home' ? '1 · ' + home.code : p === 'away' ? '2 · ' + away.code : 'NUL'

  return (
    <section style={{ maxWidth:760, margin:'0 auto', padding:'32px 24px 64px' }}>
      <button onClick={onBack} style={{
        background:'none', border:'none', color:'var(--muted)', fontSize:12,
        fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase',
        padding:0, marginBottom:22, cursor:'pointer',
      }}>← Retour</button>

      {/* En-tête match (style scoreline noir) */}
      <div className="card" style={{ padding:24, marginBottom:18, background: PALETTE.ink, color:'#FFFFFF', border:'1.5px solid var(--ink)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
          <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>● PRONOSTIQUER</span>
          <span style={{ fontSize:11, fontWeight:700, opacity:0.7, letterSpacing:'0.06em' }}>{stageLbl}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <Flag team={home} w={64} h={42}/>
            <div>
              <div className="display" style={{ fontSize:36, lineHeight:0.9 }}>{home.code}</div>
              <div style={{ fontSize:11, fontWeight:700, opacity:0.7, marginTop:3 }}>{home.name.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div className="display mono" style={{ fontSize:28 }}>–&nbsp;:&nbsp;–</div>
            <div style={{ fontSize:10, fontWeight:700, opacity:0.7, marginTop:6, letterSpacing:'0.06em' }}>{m.date} · {m.time} {(m.vKey && TZ_LABEL[m.vKey]) || ''}</div>
            {(() => {
              const p = toParis(m.time, m.vKey)
              if (!p) return null
              return <div style={{ fontSize:10, color: PALETTE.lime, fontWeight:800, marginTop:3 }}>↳ {p.time} Paris{p.dayShift>0 ? ' J+'+p.dayShift : ''}</div>
            })()}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14, justifyContent:'flex-end' }}>
            <div style={{ textAlign:'right' }}>
              <div className="display" style={{ fontSize:36, lineHeight:0.9 }}>{away.code}</div>
              <div style={{ fontSize:11, fontWeight:700, opacity:0.7, marginTop:3 }}>{away.name.toUpperCase()}</div>
            </div>
            <Flag team={away} w={64} h={42}/>
          </div>
        </div>
      </div>

      {/* Form de pronostic */}
      <div className="card" style={{ padding:24 }}>
        <h2 className="display" style={{ fontSize:32, margin:'0 0 6px' }}>Ton pronostic</h2>
        <p style={{ fontSize:13, color:'var(--muted)', margin:'0 0 18px', lineHeight:1.45 }}>
          <strong style={{ color:'var(--ink)' }}>Score exact</strong> = 5 pts ·{' '}
          <strong style={{ color:'var(--ink)' }}>Bon vainqueur</strong> = 3 pts · Faux = 0 pt
        </p>

        {/* Pick 1 / N / 2 */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:8 }}>QUI GAGNE ?</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {(['home', 'draw', 'away'] as const).map(k => (
              <button key={k} onClick={() => setPick(k)} type="button" style={{
                padding:'18px 8px', borderRadius:12, border:'1.5px solid var(--ink)',
                background: pick===k ? 'var(--ink)' : 'var(--paper)',
                color: pick===k ? PALETTE.lime : 'var(--ink)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                cursor:'pointer', transition:'all .12s', fontFamily:'inherit',
              }}>
                <span style={{ fontSize:12, fontWeight:800, letterSpacing:'0.06em' }}>{pickLabel(k)}</span>
                <span style={{ fontSize:10, fontWeight:600, opacity:0.7 }}>+3 pts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Score exact (optionnel) */}
        <div style={{ marginBottom:18 }}>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:10 }}>
            <input type="checkbox" checked={exactOn} onChange={e => setExactOn(e.target.checked)}
              style={{ width:18, height:18, accentColor: PALETTE.ink, cursor:'pointer' }}/>
            <span style={{ fontSize:13, fontWeight:700 }}>Ajouter un score exact</span>
            <span style={{ fontSize:11, fontWeight:600, color: PALETTE.lime, marginLeft:'auto', background:'var(--ink)', padding:'3px 8px', borderRadius:4 }}>+5 PTS</span>
          </label>
          {exactOn && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:10, alignItems:'center', marginTop:10 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em', marginBottom:4 }}>{home.code}</div>
                <input type="number" min={0} max={20} value={scoreH} onChange={e => setScoreH(e.target.value)} placeholder="0"
                  style={inputStyle}/>
              </div>
              <span className="display mono" style={{ fontSize:24, color:'var(--muted)' }}>:</span>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em', marginBottom:4 }}>{away.code}</div>
                <input type="number" min={0} max={20} value={scoreA} onChange={e => setScoreA(e.target.value)} placeholder="0"
                  style={inputStyle}/>
              </div>
            </div>
          )}
        </div>

        {feedback && (
          <div style={{
            marginBottom:14, padding:'10px 14px', borderRadius:8,
            background: feedback.kind === 'ok' ? PALETTE.lime : 'rgba(225,6,0,0.1)',
            color: feedback.kind === 'ok' ? 'var(--ink)' : PALETTE.red,
            border: `1.5px solid ${feedback.kind === 'ok' ? 'var(--ink)' : PALETTE.red}`,
            fontSize:12, fontWeight:700,
          }}>{feedback.msg}</div>
        )}

        <button
          disabled={!pick || busy}
          onClick={submit}
          className="pill-btn solid"
          style={{
            width:'100%', justifyContent:'center', padding:'14px 0', fontSize:13,
            letterSpacing:'0.04em', textTransform:'uppercase',
            opacity: (!pick || busy) ? 0.5 : 1, cursor: (!pick || busy) ? 'not-allowed' : 'pointer',
          }}>
          {busy ? 'Enregistrement…'
            : !user ? 'Connecte-toi pour pronostiquer'
            : !pick ? 'Choisir un résultat'
            : existing ? 'Mettre à jour mon pronostic'
            : 'Valider mon pronostic'}
        </button>

        {existing && (
          <div style={{ marginTop:14, padding:'12px 14px', background:'var(--paper-2)', borderRadius:8, fontSize:12, fontWeight:600, color:'var(--ink)' }}>
            <strong style={{ fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>Pronostic actuel</strong>
            <div style={{ marginTop:4 }}>
              {pickLabel(existing.pick)}
              {existing.score_home != null && existing.score_away != null && (
                <> · <span className="mono">{existing.score_home}-{existing.score_away}</span></>
              )}
              {existing.scored && existing.points_earned > 0 && (
                <> · <span style={{ color: PALETTE.lime, fontWeight:800 }}>+{existing.points_earned} pts</span></>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const inputStyle: React.CSSProperties = {
  width:'100%', padding:'14px', fontSize:24, fontWeight:800,
  fontFamily:'var(--font-jetbrains-mono), JetBrains Mono, monospace',
  textAlign:'center', border:'1.5px solid var(--ink)', borderRadius:10,
  background:'var(--paper)', color:'var(--ink)', outline:'none',
  WebkitAppearance: 'none', MozAppearance: 'textfield',
}
