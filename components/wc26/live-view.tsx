'use client'

// LIVE VIEW — match list + real-time match experience
// Ported 1:1 from design/js/13-live-view.jsx, extended with match selection

import { useState, useEffect, useRef } from 'react'
import { TEAMS, LINEUPS, PREDICTORS, CALENDAR } from './data'
import type { Match } from './data'
import { Flag, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

const DAY1_DATE = '2026-06-11'

const LIVE_EVENTS_BASE = [
  { min: 14, type:'CARD',  team:'BRA', player:'Casemiro',  detail:'Carton jaune' },
  { min: 23, type:'GOAL',  team:'FRA', player:'K. Mbappé', detail:'Reprise du pied droit, lucarne' },
  { min: 38, type:'CORNER',team:'BRA', player:'', detail:'Corner brésilien' },
  { min: 41, type:'GOAL',  team:'BRA', player:'Vini Jr',   detail:'Égalisation, frappe enroulée' },
  { min: 46, type:'INFO',  team:'',    player:'',          detail:"Coup d'envoi 2e mi-temps" },
  { min: 58, type:'SUB',   team:'FRA', player:'Cherki ↔ Olise', detail:'Changement français' },
  { min: 64, type:'CARD',  team:'FRA', player:'Tchouaméni', detail:'Carton jaune' },
  { min: 71, type:'GOAL',  team:'FRA', player:'O. Dembélé', detail:'Contre-attaque conclue à 8 mètres' },
]

const CHAT_SEED = [
  { who:'@northtactic',  txt:'On y est. Allez !!', color:'#6B2FB5', m:'9'  },
  { who:'@samba_pro',    txt:'Vini Jr en feu sur ce match 🔥', color:'#C8FF00', m:'15' },
  { who:'@lola.pred',    txt:'Mbappé va punir, je le sens',  color:'#E10600', m:'21' },
  { who:'@kylian.fr',    txt:'CARTON YELLOW POUR CASEMIRO 😅', color:'#0033FF', m:'15' },
  { who:'@maradona_22',  txt:'GOOOAAAAL !!! 🇫🇷',     color:'#FF0080', m:'23' },
  { who:'@xg_addict',    txt:'xG Home 0.74 vs Away 0.51, mérité', color:'#0A0A0A', m:'31' },
  { who:'@bigben.bets',  txt:'Allez allez, faut égaliser', color:'#FF6E00', m:'38' },
  { who:'@tiki.taka',    txt:'Possession énorme là', color:'#FFD400', m:'40' },
  { who:'@samba_pro',    txt:'VINI VINI VINI !!! 1-1 ⚽',     color:'#C8FF00', m:'41' },
  { who:'@maradona_22',  txt:'On va à la mi-temps là',       color:'#FF0080', m:'45' },
  { who:'@northtactic',  txt:'Faut recadrer le pressing', color:'#6B2FB5', m:'46' },
  { who:'@kylian.fr',    txt:'Cherki rentre, joli choix',    color:'#0033FF', m:'58' },
  { who:'@bigben.bets',  txt:'Ousmane !!!! 2-1 !!!!', color:'#FF6E00', m:'71' },
]

// ─── Match list (day 1) ──────────────────────────────────────────────────────

function LiveMatchList({ onSelect }: { onSelect: (id: string) => void }) {
  const day1 = CALENDAR
    .filter(m => m.date === DAY1_DATE)
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>

      <div style={{ marginBottom:28 }}>
        <span className="chip" style={{ background: PALETTE.red, color:'#FFFFFF', display:'inline-flex', alignItems:'center', gap:8 }}>
          <span style={{ position:'relative', width:8, height:8 }}>
            <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#FFF', animation:'pulse 1.4s infinite' }}/>
            <span style={{ position:'absolute', inset:2, borderRadius:'50%', background:'#FFF' }}/>
          </span>
          EN DIRECT
        </span>
        <h1 className="display" style={{ fontSize:72, margin:'14px 0 0', lineHeight:0.9 }}>Matchs du jour</h1>
        <p style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginTop:10, letterSpacing:'0.06em', textTransform:'uppercase' }}>
          11 JUIN 2026 · JOURNÉE 1 · PHASE DE GROUPES
        </p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {day1.map(m => <MatchDayCard key={m.id} match={m} onSelect={onSelect}/>)}
      </div>

    </section>
  )
}

function MatchDayCard({ match, onSelect }: { match: Match; onSelect: (id: string) => void }) {
  const home = teamByCode(match.home)
  const away = teamByCode(match.away)
  const isOpener = match.id === 'gA1'

  return (
    <div
      className="card"
      onClick={() => onSelect(match.id)}
      style={{ padding:0, overflow:'hidden', cursor:'pointer', transition:'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)' }}
    >
      {/* Top band */}
      <div style={{
        padding:'10px 24px', background:'var(--ink)', color:'var(--paper)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em' }}>
            GROUPE {match.group} · {match.stage}
          </span>
          {isOpener && (
            <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)', fontSize:9, padding:'2px 8px' }}>
              MATCH D&apos;OUVERTURE
            </span>
          )}
        </div>
        <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:'0.04em' }}>
          {match.venue}
        </span>
      </div>

      {/* Match row */}
      <div style={{ padding:'28px 32px', display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:24 }}>

        {/* Home team */}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Flag team={home} w={64} h={42}/>
          <div>
            <div className="display" style={{ fontSize:40, lineHeight:0.9 }}>{home.code}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', marginTop:4 }}>{home.name.toUpperCase()}</div>
          </div>
        </div>

        {/* Centre — time + status */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div className="display mono" style={{ fontSize:52, lineHeight:1 }}>{match.time}</div>
          <span style={{
            padding:'4px 12px', borderRadius:999, border:'1.5px solid var(--ink)',
            fontSize:10, fontWeight:800, letterSpacing:'0.08em', color:'var(--muted)',
          }}>
            À VENIR
          </span>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', marginTop:4 }}>
            Cliquer pour suivre →
          </span>
        </div>

        {/* Away team */}
        <div style={{ display:'flex', alignItems:'center', gap:16, justifyContent:'flex-end', flexDirection:'row-reverse' }}>
          <Flag team={away} w={64} h={42}/>
          <div style={{ textAlign:'right' }}>
            <div className="display" style={{ fontSize:40, lineHeight:0.9 }}>{away.code}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', marginTop:4 }}>{away.name.toUpperCase()}</div>
          </div>
        </div>

      </div>

      {/* Cotes bottom strip */}
      {match.odds && (
        <div style={{
          padding:'10px 32px', background:'var(--paper-2)', borderTop:'1px solid var(--line)',
          display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0,
        }}>
          {[
            ['1 · ' + home.code, match.odds.home],
            ['NUL',              match.odds.draw],
            ['2 · ' + away.code, match.odds.away],
          ].map(([lbl, odd], i) => (
            <div key={i} style={{ textAlign:'center', padding:'4px 0' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>{lbl}</div>
              <div className="display mono" style={{ fontSize:18 }}>{(odd as number).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Match detail (live experience) ─────────────────────────────────────────

function LiveMatchDetail({ matchId, onBack, onOpenTeam }: {
  matchId: string
  onBack: () => void
  onOpenTeam?: (code: string) => void
}) {
  const match   = CALENDAR.find(m => m.id === matchId) ?? CALENDAR[0]
  const home    = teamByCode(match.home)
  const away    = teamByCode(match.away)
  // Reuse BRA/FRA lineups as generic placeholders
  const homeLineup = LINEUPS.BRA ?? LINEUPS.FRA
  const awayLineup = LINEUPS.FRA

  const [minute, setMinute]       = useState(72)
  const [score]                   = useState({ h:1, a:2 })
  const [possession, setPossession] = useState(58)
  const [odds, setOdds]           = useState({ home: match.odds?.home ?? 2.6, draw: match.odds?.draw ?? 3.3, away: match.odds?.away ?? 2.7 })
  const [oddsDir, setOddsDir]     = useState({ home:'flat', draw:'flat', away:'flat' })
  const [events]                  = useState(LIVE_EVENTS_BASE.filter(e => e.min<=72))
  const [chat, setChat]           = useState(CHAT_SEED)
  const [flashGoal]               = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setMinute(m => {
        if (m >= 90) return m
        const next = m + 1
        setOdds(o => {
          const drift = (k: keyof typeof o) => Math.max(1.1, +(o[k] + (Math.random()-0.5)*0.15).toFixed(2))
          const newO = { home: drift('home'), draw: drift('draw'), away: drift('away') }
          setOddsDir({
            home: newO.home > o.home ? 'up' : newO.home < o.home ? 'down' : 'flat',
            draw: newO.draw > o.draw ? 'up' : newO.draw < o.draw ? 'down' : 'flat',
            away: newO.away > o.away ? 'up' : newO.away < o.away ? 'down' : 'flat',
          })
          return newO
        })
        setPossession(p => Math.max(35, Math.min(70, p + (Math.random()*4 - 2))))
        return next
      })
    }, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const phrases = [
      'Belle relance !','Toujours dangereux','Tient bon au milieu',
      'Il déborde, ça pique','Pressing haut','Le rythme est fou ce soir',
      'Il était proche !!!','Allez !!!','Quel match... 🤯',
      "J'ai mis ma mise, easy money 💸",'Sub à venir ?','Au pressing constant 💪',
    ]
    const authors = PREDICTORS
    const t = setInterval(() => {
      const a = authors[Math.floor(Math.random()*authors.length)]
      const txt = phrases[Math.floor(Math.random()*phrases.length)]
      setChat(c => [...c, { who:a.name, txt, color:a.avatar, m:String(Math.min(90, minute)) }])
    }, 5000)
    return () => clearInterval(t)
  }, [minute])

  return (
    <section style={{ background:'var(--paper)' }}>

      {/* Scoreboard header */}
      <div style={{ background:'var(--ink)', color:'var(--paper)', borderBottom:'1.5px solid var(--ink)' }}>

        {/* Back button row */}
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'12px 32px 0', display:'flex', alignItems:'center', gap:12 }}>
          <button
            onClick={onBack}
            style={{
              padding:'6px 14px', borderRadius:999, border:'1.5px solid rgba(255,255,255,0.25)',
              background:'transparent', color:'rgba(255,255,255,0.7)', fontSize:11, fontWeight:800,
              letterSpacing:'0.06em', cursor:'pointer', display:'flex', alignItems:'center', gap:6,
            }}>
            ← Tous les matchs
          </button>
        </div>

        <div style={{ maxWidth:1320, margin:'0 auto', padding:'14px 32px', display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ position:'relative', width:14, height:14 }}>
              <span style={{ position:'absolute', inset:0, borderRadius:'50%', background: PALETTE.red, animation:'pulse 1.4s infinite' }}/>
              <span style={{ position:'absolute', inset:3, borderRadius:'50%', background: PALETTE.red }}/>
            </span>
            <span className="display" style={{ fontSize:22, color: PALETTE.red }}>EN DIRECT</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24 }}>
            <div onClick={() => onOpenTeam && onOpenTeam(home.code)} style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <Flag team={home} w={48} h={32}/>
              <span className="display" style={{ fontSize:30 }}>{home.code}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div className="display mono" style={{ fontSize:48, lineHeight:1, color:'#FFFFFF' }}>{score.h} : {score.a}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background: PALETTE.red, animation:'pulse 1.4s infinite' }}/>
                <span className="mono" style={{ fontSize:14, fontWeight:800, color: PALETTE.lime }}>{minute}&apos;</span>
              </div>
            </div>
            <div onClick={() => onOpenTeam && onOpenTeam(away.code)} style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <span className="display" style={{ fontSize:30 }}>{away.code}</span>
              <Flag team={away} w={48} h={32}/>
            </div>
          </div>
          <div style={{ textAlign:'right', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.6)', letterSpacing:'0.04em' }}>
            <div>{match.venue.toUpperCase()}</div>
            <div style={{ marginTop:2 }}>JOURNÉE 1 · GROUPE {match.group}</div>
          </div>
        </div>

        {/* Possession bar */}
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 32px 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:14, fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:700, letterSpacing:'0.06em' }}>
            <span style={{ color: PALETTE.lime }}>{home.code} · {possession.toFixed(0)}%</span>
            <div style={{ height:6, background:'rgba(255,255,255,0.15)', borderRadius:3, overflow:'hidden', position:'relative' }}>
              <div style={{ position:'absolute', left:0, top:0, height:'100%', width: possession+'%', background: home.color, transition:'width 1.5s ease' }}/>
              <div style={{ position:'absolute', right:0, top:0, height:'100%', width: (100-possession)+'%', background: away.color, transition:'width 1.5s ease' }}/>
            </div>
            <span style={{ color: PALETTE.lime, textAlign:'right' }}>{away.code} · {(100-possession).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {flashGoal && (
        <div style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(225,6,0,0.92)', color:'#FFFFFF',
          display:'flex', alignItems:'center', justifyContent:'center',
          animation:'fadeInOut 2.5s ease', pointerEvents:'none',
        }}>
          <div style={{ textAlign:'center' }}>
            <div className="display" style={{ fontSize:140, lineHeight:0.9 }}>BUT !</div>
            <div className="display" style={{ fontSize:48, marginTop:14, color: PALETTE.lime }}>{flashGoal}</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut { 0% { opacity:0; } 15% { opacity:1; } 85% { opacity:1; } 100% { opacity:0; } }
        @keyframes flash { 0%,100% { background:var(--paper); } 50% { background:#C8FF00; } }
      `}</style>

      <div style={{ maxWidth:1320, margin:'0 auto', padding:'24px 32px 64px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:18, marginBottom:18 }}>
          <div className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
              <h3 className="display" style={{ fontSize:20, margin:0 }}>Terrain en direct</h3>
              <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>
                POSITIONS · BALLON · TEMPS RÉEL
              </span>
            </div>
            <LivePitch
              homeCode={home.code} awayCode={away.code}
              homeColor={home.color} awayColor={away.color}
              homeStarters={homeLineup.starters} awayStarters={awayLineup.starters}
            />
            <div style={{ marginTop:14, padding:'12px 16px', background: PALETTE.lime, borderRadius:10, display:'flex', alignItems:'center', gap:12 }}>
              <span className="chip" style={{ background:'var(--ink)', color: PALETTE.lime, fontSize:9, padding:'2px 8px' }}>71&apos;</span>
              <span style={{ fontSize:13, fontWeight:800 }}>⚽ BUT — Dembélé — contre-attaque conclue à 8 mètres</span>
            </div>
          </div>

          <LiveChat chat={chat} setChat={setChat} minute={minute}/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:18, marginBottom:18 }}>
          <LiveBettingPanel odds={odds} dir={oddsDir} home={home} away={away}/>
          <LiveEventsFeed events={events} homeCode={home.code} awayCode={away.code} home={home} away={away}/>
        </div>

        <LiveStatsGrid homeCode={home.code} awayCode={away.code}/>
      </div>
    </section>
  )
}

// ─── Export principal ────────────────────────────────────────────────────────

export function LiveView({ onOpenTeam }: { onOpenTeam?: (code: string) => void }) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  if (selectedMatchId) {
    return (
      <LiveMatchDetail
        matchId={selectedMatchId}
        onBack={() => setSelectedMatchId(null)}
        onOpenTeam={onOpenTeam}
      />
    )
  }
  return <LiveMatchList onSelect={setSelectedMatchId}/>
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function LivePitch({
  homeCode, awayCode, homeColor, awayColor, homeStarters, awayStarters,
}: { homeCode:string; awayCode:string; homeColor:string; awayColor:string; homeStarters:any[]; awayStarters:any[] }) {
  const [ball, setBall] = useState({ x: 50, y: 62 })

  useEffect(() => {
    const t = setInterval(() => {
      const all = [...homeStarters.map(p => ({...p,side:'h'})), ...awayStarters.map(p => ({...p,side:'a'}))]
      const target = all[Math.floor(Math.random()*all.length)]
      if (!target) return
      const baseLeft = 3 + (90 - target.y) / 76 * 46
      const tx = target.side==='h' ? baseLeft : 100 - baseLeft
      const ty = 10 + (target.x - 14) / 70 * 80
      setBall({ x: tx + (Math.random()*3-1.5), y: ty + (Math.random()*3-1.5) })
    }, 1800)
    return () => clearInterval(t)
  }, [homeStarters, awayStarters])

  return (
    <div style={{ position:'relative', aspectRatio:'5/3', width:'100%',
      background:'linear-gradient(180deg,#F4F2EE 0%, #EAE7E0 100%)',
      borderRadius:14, border:'1.5px solid var(--ink)', overflow:'hidden' }}>
      <svg viewBox="0 0 150 90" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <rect x="2" y="2" width="146" height="86" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <line x1="75" y1="2" x2="75" y2="88" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <circle cx="75" cy="45" r="10" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <circle cx="75" cy="45" r="0.7" fill="rgba(10,10,10,0.3)"/>
        <rect x="2"   y="25" width="14" height="40" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <rect x="134" y="25" width="14" height="40" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <rect x="2"   y="36" width="5"  height="18" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <rect x="143" y="36" width="5"  height="18" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
      </svg>

      {homeStarters.map((p, i) => {
        const left = 3 + (90 - p.y) / 76 * 46
        const top  = 10 + (p.x - 14) / 70 * 80
        return (
          <div key={'h'+i} style={{
            position:'absolute', left: left+'%', top: top+'%',
            transform:'translate(-50%,-50%)', transition:'all 1.4s ease-in-out',
          }}>
            <PlayerDot num={p.num} color={homeColor}/>
          </div>
        )
      })}
      {awayStarters.map((p, i) => {
        const left = 100 - (3 + (90 - p.y) / 76 * 46)
        const top  = 10 + (p.x - 14) / 70 * 80
        return (
          <div key={'a'+i} style={{
            position:'absolute', left: left+'%', top: top+'%',
            transform:'translate(-50%,-50%)', transition:'all 1.4s ease-in-out',
          }}>
            <PlayerDot num={p.num} color={awayColor}/>
          </div>
        )
      })}

      <div style={{
        position:'absolute', left:`${ball.x}%`, top:`${ball.y}%`,
        width:14, height:14, borderRadius:'50%',
        background:'radial-gradient(circle at 30% 30%, #FFF 0%, #FFF 60%, #888 100%)',
        border:'1.5px solid var(--ink)',
        transform:'translate(-50%,-50%)',
        transition:'all 1.4s cubic-bezier(.42,0,.2,1)',
        boxShadow:'0 3px 8px rgba(0,0,0,0.35)',
        zIndex:5,
      }}/>

      <div style={{ position:'absolute', top:8, left:12, padding:'4px 10px', background:'var(--paper)', border:'1.5px solid var(--ink)', borderRadius:6, fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:12 }}>{homeCode} →</div>
      <div style={{ position:'absolute', top:8, right:12, padding:'4px 10px', background:'var(--paper)', border:'1.5px solid var(--ink)', borderRadius:6, fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:12 }}>← {awayCode}</div>
    </div>
  )
}

function PlayerDot({ num, color }: { num: number; color: string }) {
  return (
    <div style={{
      width:30, height:30, borderRadius:'50%', background:'var(--paper)',
      border:`2.5px solid ${color}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:11, color:'var(--ink)',
      boxShadow:'0 2px 0 rgba(10,10,10,0.18)',
    }}>{num}</div>
  )
}

function LiveEventsFeed({ events, homeCode, awayCode, home, away }: { events:any[]; homeCode:string; awayCode:string; home:any; away:any }) {
  const sorted = [...events].sort((a, b) => b.min - a.min)
  const iconOf = (t: string) => ({ GOAL:'⚽', CARD:'⬛', SUB:'⇆', CORNER:'⌐', INFO:'ⓘ' } as Record<string,string>)[t] || '•'
  const colorOf = (t: string) => ({ GOAL: PALETTE.lime, CARD:'#FFD400', SUB: PALETTE.blue, CORNER: PALETTE.purple, INFO:'var(--muted)' } as Record<string,string>)[t] || 'var(--muted)'

  const teamOf = (code: string) => code === 'BRA' ? home : code === 'FRA' ? away : null

  return (
    <div className="card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', background:'var(--ink)', color:'var(--paper)', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <h3 className="display" style={{ fontSize:20, margin:0 }}>Fil du match</h3>
        <span style={{ fontSize:10, fontWeight:800, color: PALETTE.lime, letterSpacing:'0.08em' }}>{sorted.length} ACTIONS</span>
      </div>
      <div style={{ maxHeight:300, overflowY:'auto' }}>
        {sorted.map((e, i) => {
          const tm = teamOf(e.team)
          return (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'48px 26px 1fr', gap:10, alignItems:'center',
              padding:'12px 18px', borderBottom: i<sorted.length-1 ? '1px solid var(--line)' : 'none',
              background: e.type==='GOAL' ? 'rgba(200,255,0,0.08)' : 'transparent',
            }}>
              <span className="display mono" style={{ fontSize:18, color: colorOf(e.type) }}>{e.min}&apos;</span>
              <span style={{ fontSize:18, textAlign:'center' }}>{iconOf(e.type)}</span>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {tm && <Flag team={tm} w={20} h={14}/>}
                <div>
                  <div style={{ fontSize:13, fontWeight:800 }}>{e.player || e.detail}</div>
                  {e.player && <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{e.detail}</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LiveStatsGrid({ homeCode, awayCode }: { homeCode:string; awayCode:string }) {
  const stats = [
    { lbl:'Tirs',    h:9,    a:12,  max:14  },
    { lbl:'Cadrés',  h:3,    a:6,   max:8   },
    { lbl:'Corners', h:5,    a:3,   max:8   },
    { lbl:'Fautes',  h:8,    a:11,  max:14  },
    { lbl:'Passes',  h:412,  a:367, max:500 },
    { lbl:'xG',      h:1.18, a:1.74,max:2.5 },
  ]
  return (
    <div className="card" style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
        <h3 className="display" style={{ fontSize:20, margin:0 }}>Stats temps réel</h3>
        <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.06em' }}>{homeCode} vs {awayCode} · 72&apos;</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:700, color:'var(--muted)', marginBottom:4 }}>
              <span className="mono" style={{ color:'var(--ink)' }}>{s.h}</span>
              <span style={{ letterSpacing:'0.06em' }}>{s.lbl.toUpperCase()}</span>
              <span className="mono" style={{ color:'var(--ink)' }}>{s.a}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <div style={{ height:5, background:'var(--paper-2)', borderRadius:3, overflow:'hidden', direction:'rtl' }}>
                <div style={{ height:'100%', width:(s.h/s.max*100)+'%', background: PALETTE.blue, borderRadius:3, transition:'width 1s ease' }}/>
              </div>
              <div style={{ height:5, background:'var(--paper-2)', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:(s.a/s.max*100)+'%', background: PALETTE.lime, borderRadius:3, transition:'width 1s ease' }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LiveBettingPanel({
  odds, dir, home, away,
}: { odds:any; dir:any; home:any; away:any }) {
  const [pick, setPick]             = useState<string | null>(null)
  const [stake, setStake]           = useState(50)
  const [extraMarket, setExtraMarket] = useState('next_goal')

  const arrow = (d: string) => d==='up' ? <span style={{ color:'#1F8A5B' }}>▲</span> : d==='down' ? <span style={{ color: PALETTE.red }}>▼</span> : <span style={{ color:'var(--muted)' }}>—</span>

  const markets: Record<string, { lbl:string; opts:Array<[string,number]> }> = {
    next_goal:   { lbl:'Prochain but',     opts:[[home.code, 2.1], ['Aucun', 4.0], [away.code, 1.75]] },
    next_corner: { lbl:'Prochain corner',  opts:[[home.code, 1.95], ['Aucun', 5.5], [away.code, 1.95]] },
    over_total:  { lbl:'Total buts > 3.5', opts:[['Oui', 2.6], ['Non', 1.45]] },
    scorer:      { lbl:'Prochain buteur',  opts:[['Joueur 1', 4.5], ['Joueur 2', 5.0], ['Joueur 3', 6.0]] },
  }

  return (
    <div className="card" style={{ padding:20, background: PALETTE.lime, border:'1.5px solid var(--ink)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span className="chip" style={{ background:'var(--ink)', color: PALETTE.lime }}>⚡ PARIS EN DIRECT</span>
        <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.06em' }}>COTES VIVANTES</span>
      </div>
      <h3 className="display" style={{ fontSize:24, margin:'0 0 14px' }}>Résultat final</h3>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:18 }}>
        {([['home','1 · '+home.code, odds.home, dir.home],['draw','NUL', odds.draw, dir.draw],['away','2 · '+away.code, odds.away, dir.away]] as Array<[string,string,number,string]>).map(([k, lbl, o, d]) => (
          <button key={k} onClick={() => setPick(k)} style={{
            padding:'12px 6px', borderRadius:12, border:'1.5px solid var(--ink)',
            background: pick===k ? 'var(--ink)' : 'var(--paper)',
            color: pick===k ? 'var(--paper)' : 'var(--ink)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:3,
          }}>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.06em' }}>{lbl}</span>
            <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
              <span className="display mono" style={{ fontSize:22 }}>{o.toFixed(2)}</span>
              <span style={{ fontSize:11 }}>{arrow(d)}</span>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:5, marginBottom:12, overflowX:'auto' }}>
        {Object.entries(markets).map(([k, m]) => (
          <button key={k} onClick={() => setExtraMarket(k)} style={{
            padding:'5px 10px', borderRadius:99, border:'1px solid var(--ink)', fontSize:10, fontWeight:800, whiteSpace:'nowrap',
            background: extraMarket===k ? 'var(--ink)' : 'transparent', color: extraMarket===k ? PALETTE.lime : 'var(--ink)',
          }}>{m.lbl.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:`repeat(${markets[extraMarket].opts.length}, 1fr)`, gap:6, marginBottom:14 }}>
        {markets[extraMarket].opts.map(([lbl, o], i) => (
          <button key={i} style={{
            padding:'8px 4px', borderRadius:8, border:'1.5px solid var(--ink)',
            background:'var(--paper)', display:'flex', flexDirection:'column', alignItems:'center', gap:2,
          }}>
            <span style={{ fontSize:10, fontWeight:800 }}>{lbl.toUpperCase()}</span>
            <span className="mono" style={{ fontSize:14, fontWeight:800 }}>{o.toFixed(2)}</span>
          </button>
        ))}
      </div>

      <div style={{ marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
          <span style={{ fontSize:11, fontWeight:800 }}>Mise (points)</span>
          <span className="mono" style={{ fontSize:13, fontWeight:800 }}>{stake}</span>
        </div>
        <input type="range" min="10" max="500" step="10" value={stake} onChange={e => setStake(+e.target.value)} style={{ width:'100%', accentColor:'var(--ink)' }}/>
      </div>

      <div style={{ padding:'12px 14px', background:'var(--ink)', color: PALETTE.lime, borderRadius:10, marginBottom:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.06em' }}>GAIN POTENTIEL</span>
          <span className="display mono" style={{ fontSize:24 }}>{pick ? (stake*odds[pick]).toFixed(2) : '0.00'}</span>
        </div>
      </div>

      <button disabled={!pick} style={{
        width:'100%', padding:'12px 0', borderRadius:10, border:'1.5px solid var(--ink)',
        background: pick ? 'var(--ink)' : 'transparent', color: pick ? PALETTE.lime : 'var(--muted)',
        fontWeight:800, fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase',
        cursor: pick ? 'pointer' : 'not-allowed', opacity: pick ? 1 : 0.5,
      }}>
        ⚡ Parier en direct
      </button>
    </div>
  )
}

function LiveChat({
  chat, setChat, minute,
}: { chat:any[]; setChat:React.Dispatch<React.SetStateAction<any[]>>; minute:number }) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chat.length])

  const submit = () => {
    if (!draft.trim()) return
    setChat(c => [...c, { who:'@maxbets26', txt:draft.trim(), color:'#FF0080', m:String(minute), me:true }])
    setDraft('')
  }

  const reactions = ['🔥','⚽','😱','🇫🇷','🇧🇷','❤️','💪']

  return (
    <div className="card" style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column', height:560 }}>
      <div style={{ padding:'14px 18px', background:'var(--ink)', color:'var(--paper)', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <h3 className="display" style={{ fontSize:20, margin:0 }}>💬 Chat live</h3>
        <span style={{ fontSize:10, fontWeight:800, color: PALETTE.lime, letterSpacing:'0.06em' }}>{chat.length} MESSAGES · 4.2k EN LIGNE</span>
      </div>

      <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:10, background:'var(--paper-2)' }}>
        {chat.map((c, i) => (
          <div key={i} style={{
            alignSelf: c.me ? 'flex-end' : 'flex-start',
            display:'flex', gap:8, maxWidth:'80%', flexDirection: c.me ? 'row-reverse' : 'row',
          }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background: c.color, border:'1.5px solid var(--ink)', flexShrink:0, marginTop:14 }}/>
            <div>
              <div style={{ display:'flex', gap:6, alignItems:'baseline', marginBottom:2, justifyContent: c.me ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize:11, fontWeight:800, color: c.me ? PALETTE.magenta : 'var(--ink)' }}>{c.who}</span>
                <span className="mono" style={{ fontSize:9, color:'var(--muted)', fontWeight:700 }}>{c.m}&apos;</span>
              </div>
              <div style={{
                padding:'8px 12px', borderRadius: c.me ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: c.me ? 'var(--ink)' : 'var(--paper)',
                color: c.me ? '#FFFFFF' : 'var(--ink)',
                border:'1px solid ' + (c.me ? 'var(--ink)' : 'var(--line)'),
                fontSize:12.5, fontWeight:600, lineHeight:1.35,
              }}>{c.txt}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'8px 14px', borderTop:'1px solid var(--line)', display:'flex', gap:6, background:'var(--paper)' }}>
        {reactions.map(r => (
          <button key={r} onClick={() => {
            setChat(c => [...c, { who:'@maxbets26', txt:r, color:'#FF0080', m:String(minute), me:true }])
          }} style={{
            width:32, height:32, borderRadius:8, border:'1px solid var(--line)', background:'var(--paper)',
            fontSize:18, cursor:'pointer', padding:0,
          }}>{r}</button>
        ))}
      </div>

      <div style={{ padding:'12px 14px', borderTop:'1px solid var(--line)', display:'flex', gap:8 }}>
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter') submit() }}
          placeholder="Écris ton commentaire..."
          style={{
            flex:1, padding:'10px 14px', borderRadius:10, border:'1.5px solid var(--ink)',
            fontSize:13, fontWeight:600, fontFamily:'inherit', outline:'none',
          }}/>
        <button onClick={submit} className="pill-btn solid" style={{ padding:'10px 16px', fontSize:12 }}>Envoyer</button>
      </div>
    </div>
  )
}
