'use client'

// Full tournament calendar view
// Ported 1:1 from design/js/11-calendar-view.jsx
// + overlay scores from /api/scores (API-Football, cached 5 min)

import { useEffect, useMemo, useState } from 'react'
import { TEAMS, CALENDAR, STAGE_INFO, phaseGroup, TZ_LABEL, toParis } from './data'
import { Flag, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

// Shape returned by GET /api/scores
type ScoreUpdate = {
  home_code: string; away_code: string; kickoff_date: string;
  status_short: string;
  bucket: 'finished' | 'live' | 'scheduled' | 'other';
  score_home: number | null; score_away: number | null;
  elapsed: number | null;
}

// Key used to look up an API score from a mock match row.
const keyFor = (home: string, away: string, date: string) => `${home}-${away}-${date}`

// Lightweight hook : fetch /api/scores once + every 60 s while the tab is open.
function useScoreOverlay(): Map<string, ScoreUpdate> {
  const [scores, setScores] = useState<ScoreUpdate[]>([])
  useEffect(() => {
    let cancelled = false
    const load = () => fetch('/api/scores')
      .then(r => r.ok ? r.json() : { scores: [] })
      .then((d: { scores?: ScoreUpdate[] }) => { if (!cancelled) setScores(d.scores ?? []) })
      .catch(() => { /* silent : on garde l'affichage scheduled */ })
    load()
    const interval = setInterval(load, 60_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])
  return useMemo(() => {
    const m = new Map<string, ScoreUpdate>()
    for (const s of scores) m.set(keyFor(s.home_code, s.away_code, s.kickoff_date), s)
    return m
  }, [scores])
}

function fmtDay(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const days = ['DIM','LUN','MAR','MER','JEU','VEN','SAM']
  const months = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.']
  return {
    weekday: days[d.getDay()],
    dayNum:  d.getDate(),
    month:   months[d.getMonth()],
    full:    days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()],
  }
}

export function CalendarView({ onOpenMatch }: { onOpenMatch: (id: string) => void }) {
  const [phaseFilter, setPhaseFilter] = useState('ALL')
  const [groupFilter, setGroupFilter] = useState('ALL')
  const [teamFilter, setTeamFilter] = useState('ALL')

  const scoreMap = useScoreOverlay()
  const all = CALENDAR
  const matches = all.filter(m => {
    if (phaseFilter !== 'ALL') {
      const pg = phaseGroup(m.stage)
      if (phaseFilter !== pg) return false
    }
    if (groupFilter !== 'ALL') {
      if (phaseGroup(m.stage) !== 'GROUPS') return false
      if (m.group !== groupFilter) return false
    }
    if (teamFilter !== 'ALL') {
      if (m.home !== teamFilter && m.away !== teamFilter) return false
    }
    return true
  })

  const byDate: Record<string, typeof CALENDAR> = {}
  matches.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = []
    byDate[m.date].push(m)
  })
  const dates = Object.keys(byDate).sort()

  const phases: Array<[string, string, string | null]> = [
    ['ALL',    'TOUS',          null],
    ['GROUPS', 'Phase de groupes', '#0033FF'],
    ['R32',    '16es',           '#6B2FB5'],
    ['R16',    '8es',            '#FF0080'],
    ['QF',     'Quarts',         '#FF6E00'],
    ['SF',     '1/2 finales',    '#E10600'],
    ['FINAL',  'Finales',        '#C8FF00'],
  ]

  const groups = ['A','B','C','D','E','F','G','H']
  const teamsList = TEAMS

  const total = all.length
  // Compte les matchs vraiment terminés via l'overlay API ; à défaut, le mock.
  const played = all.filter(m => {
    const live = scoreMap.get(keyFor(m.home, m.away, m.date))
    return live ? live.bucket === 'finished' : m.status === 'finished'
  }).length
  const upcoming = total - played

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18, gap:24 }}>
        <div>
          <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>★ FIXTURES</span>
          <h1 className="display" style={{ fontSize:80, margin:'14px 0 0', lineHeight:0.9 }}>Le calendrier</h1>
          <p style={{ fontSize:14, color:'var(--muted)', marginTop:8, maxWidth:540, lineHeight:1.45 }}>
            104 matchs · 16 villes hôtes · 48 nations. Du 11 juin au 19 juillet 2026.
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <CalKpi color={PALETTE.lime}    label="Matchs joués" value={played}/>
          <CalKpi color={PALETTE.blue}    label="À venir" value={upcoming}/>
          <CalKpi color={PALETTE.magenta} label="Total" value={total}/>
        </div>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
        {phases.map(([k, lbl, c]) => (
          <button key={k} onClick={() => { setPhaseFilter(k); if (k!=='GROUPS' && k!=='ALL') setGroupFilter('ALL') }}
            className="pill-btn" style={{
              padding:'8px 14px', fontSize:12,
              background: phaseFilter===k ? (c || 'var(--ink)') : 'var(--paper)',
              color:      phaseFilter===k ? (c===PALETTE.lime ? 'var(--ink)' : 'var(--paper)') : 'var(--ink)',
              borderColor: phaseFilter===k ? (c || 'var(--ink)') : 'var(--ink)',
              fontWeight: 700,
            }}>{lbl.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:24, alignItems:'center', padding:'14px 18px', background:'var(--paper-2)', borderRadius:12, border:'1.5px solid var(--line)' }}>
        {(phaseFilter==='GROUPS' || phaseFilter==='ALL') && (
          <>
            <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em' }}>GROUPE</span>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              <button onClick={() => setGroupFilter('ALL')} style={mkChip(groupFilter==='ALL')}>TOUS</button>
              {groups.map(g => (
                <button key={g} onClick={() => setGroupFilter(g)} style={mkChip(groupFilter===g)}>{g}</button>
              ))}
            </div>
          </>
        )}
        <div style={{ width:1, height:24, background:'var(--line)' }}/>
        <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em' }}>ÉQUIPE</span>
        <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)}
          style={{ padding:'6px 12px', fontSize:12, fontWeight:700, border:'1px solid var(--ink)', borderRadius:99, background:'var(--paper)', cursor:'pointer', fontFamily:'inherit' }}>
          <option value="ALL">Toutes les équipes</option>
          {teamsList.map(t => (
            <option key={t.code} value={t.code}>{t.name}</option>
          ))}
        </select>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:'var(--muted)' }}>
          {matches.length} match{matches.length>1 ? 's' : ''} affiché{matches.length>1 ? 's' : ''}
        </span>
      </div>

      {dates.length === 0 ? (
        <div className="card" style={{ padding:'48px 24px', textAlign:'center', color:'var(--muted)', fontSize:14 }}>
          Aucun match ne correspond aux filtres sélectionnés.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {dates.map(date => {
            const d = fmtDay(date)
            const dayMatches = byDate[date]
            return (
              <div key={date} style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:24 }}>
                <div style={{ position:'sticky', top:80, alignSelf:'start' }}>
                  <div style={{ padding:'14px 16px', background:'var(--ink)', color:'var(--paper)', borderRadius:12 }}>
                    <div style={{ fontSize:10, fontWeight:800, opacity:0.7, letterSpacing:'0.1em' }}>{d.weekday}</div>
                    <div className="display mono" style={{ fontSize:42, lineHeight:0.9, marginTop:4 }}>{d.dayNum}</div>
                    <div style={{ fontSize:10, fontWeight:700, opacity:0.6, letterSpacing:'0.08em', marginTop:4 }}>{d.month.toUpperCase()}</div>
                  </div>
                  <div style={{ fontSize:10, color:'var(--muted)', fontWeight:700, marginTop:8, textAlign:'center', letterSpacing:'0.06em' }}>
                    {dayMatches.length} match{dayMatches.length>1 ? 's' : ''}
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {dayMatches.map(m => (
                    <CalMatchRow
                      key={m.id} m={m} onOpenMatch={onOpenMatch}
                      live={scoreMap.get(keyFor(m.home, m.away, m.date))}/>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function mkChip(active: boolean): React.CSSProperties {
  return {
    padding:'5px 11px', fontSize:11, fontWeight:800,
    borderRadius:99, border:'1px solid var(--ink)',
    background: active ? 'var(--ink)' : 'var(--paper)',
    color: active ? 'var(--paper)' : 'var(--ink)',
    cursor:'pointer', fontFamily:'inherit',
  }
}

function CalKpi({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div style={{ padding:'10px 16px', background: color, borderRadius:10, border:'1.5px solid var(--ink)', minWidth:110 }}>
      <div style={{ fontSize:9, fontWeight:800, color:'var(--ink)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</div>
      <div className="display mono" style={{ fontSize:22, marginTop:2 }}>{value}</div>
    </div>
  )
}

function CalMatchRow({ m, onOpenMatch, live }: { m: any; onOpenMatch: (id: string) => void; live?: ScoreUpdate }) {
  const home = teamByCode(m.home), away = teamByCode(m.away)
  const si = STAGE_INFO[m.stage]

  // Si l'API a un score pour ce match, on l'overlay sur le mock.
  const isFinished = live ? live.bucket === 'finished' : m.status === 'finished'
  const isLive     = live?.bucket === 'live'
  const scoreH = live?.score_home != null ? String(live.score_home)
                : m.score ? m.score.split('-')[0] : null
  const scoreA = live?.score_away != null ? String(live.score_away)
                : m.score ? m.score.split('-')[1] : null
  const finished = isFinished
  const winnerHome = finished && scoreH != null && scoreA != null && Number(scoreH) > Number(scoreA)
  const winnerAway = finished && scoreH != null && scoreA != null && Number(scoreA) > Number(scoreH)

  return (
    <div onClick={() => onOpenMatch(m.id)} className="card" style={{
      padding:'14px 18px', cursor:'pointer', display:'grid',
      gridTemplateColumns:'120px 1fr auto auto', alignItems:'center', gap:18,
      transition:'transform .12s, border-color .12s',
      borderLeft:`6px solid ${si.color}`,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)' }}>

      <div style={{ borderRight:'1px solid var(--line)', paddingRight:14 }}>
        {finished ? (
          <>
            <span className="chip" style={{ background:'var(--muted)', color:'var(--paper)', fontSize:10, padding:'3px 10px' }}>TERMINÉ</span>
            <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', marginTop:6, letterSpacing:'0.06em' }}>
              {si.label.toUpperCase()}{m.group !== '-' ? ' · GR ' + m.group : ''}
            </div>
          </>
        ) : isLive ? (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ position:'relative', width:8, height:8 }}>
                <span style={{ position:'absolute', inset:0, borderRadius:'50%', background: PALETTE.red, animation:'pulse 1.4s infinite' }}/>
                <span style={{ position:'absolute', inset:2, borderRadius:'50%', background: PALETTE.red }}/>
              </span>
              <span className="display" style={{ fontSize:14, color: PALETTE.red }}>EN DIRECT</span>
            </div>
            {live?.elapsed != null && (
              <div className="mono" style={{ fontSize:13, fontWeight:800, marginTop:4 }}>{live.elapsed}&apos;</div>
            )}
            <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', marginTop:6, letterSpacing:'0.06em' }}>
              {si.label.toUpperCase()}{m.group !== '-' ? ' · GR ' + m.group : ''}
            </div>
          </>
        ) : (
          <>
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <span className="display mono" style={{ fontSize:28, lineHeight:1 }}>{m.time}</span>
              <span style={{ fontSize:10, fontWeight:800, color:'var(--ink)', letterSpacing:'0.06em', padding:'2px 6px', background:'var(--paper-2)', borderRadius:4 }}>
                {(m.vKey && TZ_LABEL[m.vKey]) || 'LOC'}
              </span>
            </div>
            {(() => {
              const p = toParis(m.time, m.vKey)
              if (!p) return null
              return (
                <div style={{
                  display:'inline-flex', alignItems:'baseline', gap:5, marginTop:7,
                  padding:'3px 8px 4px', background: PALETTE.blue, color:'#FFFFFF',
                  borderRadius:6,
                }}>
                  <span className="mono" style={{ fontSize:14, fontWeight:800, lineHeight:1 }}>{p.time}</span>
                  <span style={{ fontSize:9, fontWeight:800, letterSpacing:'0.06em', opacity:0.85 }}>
                    PARIS{p.dayShift>0 ? ' J+'+p.dayShift : ''}
                  </span>
                </div>
              )
            })()}
            <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', marginTop:7, letterSpacing:'0.06em' }}>
              {si.label.toUpperCase()}{m.group !== '-' ? ' · GR ' + m.group : ''}
            </div>
          </>
        )}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <TeamLine team={home} score={(finished || isLive) ? scoreH : null} winner={winnerHome}/>
        <TeamLine team={away} score={(finished || isLive) ? scoreA : null} winner={winnerAway}/>
      </div>

      <div style={{ textAlign:'right', fontSize:10, color:'var(--muted)', fontWeight:700, lineHeight:1.4, minWidth:120 }}>
        <div style={{ letterSpacing:'0.06em', fontSize:9 }}>STADE</div>
        <div style={{ color:'var(--ink)', fontSize:12, fontWeight:800, marginTop:2 }}>{m.city}</div>
      </div>

      {!finished && !isLive && m.odds && (
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <OddPill label="1" value={m.odds.home}/>
          <OddPill label="N" value={m.odds.draw}/>
          <OddPill label="2" value={m.odds.away}/>
        </div>
      )}
      {(finished || isLive) && (
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.06em', color: isLive ? PALETTE.red : 'var(--muted)' }}>
          {isLive ? 'EN COURS →' : 'RÉSULTAT →'}
        </div>
      )}
    </div>
  )
}

function TeamLine({ team, score, winner }: { team: any; score: string | null; winner: boolean | null }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, opacity: score!==null && !winner ? 0.55 : 1 }}>
      <Flag team={team} w={28} h={18}/>
      <span style={{ fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:18, letterSpacing:'-0.01em', minWidth:48 }}>{team.code}</span>
      <span style={{ fontSize:12, color:'var(--muted)', fontWeight:600 }}>{team.name}</span>
      {score !== null && (
        <span className="display mono" style={{ fontSize:22, marginLeft:'auto', fontWeight: winner ? 900 : 600 }}>{score}</span>
      )}
    </div>
  )
}

function OddPill({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding:'6px 10px', border:'1px solid var(--line)', borderRadius:8, textAlign:'center', minWidth:48 }}>
      <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)', letterSpacing:'0.06em' }}>{label}</div>
      <div className="mono" style={{ fontSize:12, fontWeight:800, marginTop:1 }}>{(+value).toFixed(2)}</div>
    </div>
  )
}
