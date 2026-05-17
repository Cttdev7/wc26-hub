'use client'

// Main views for WC26 HUB — Hero, Upcoming, Analyses, Teams, Match, Predictions
// Ported 1:1 from design/js/08-main-views.jsx

import { useState, useEffect } from 'react'
import type { Profile } from '@/lib/db-types'
import {
  TEAMS, MATCHES, FEATURED, FEATURED_PULSE, ANALYSES, TEAM_STATS, LINEUPS,
  CALENDAR, STAGE_INFO, TZ_LABEL, toParis,
} from './data'
import { Flag, TeamBadge, StatRow, FormDots, Pitch, ImagePlaceholder, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

export function HeroFeatured({ onOpenMatch }: { onOpenMatch: (id: string) => void }) {
  const m = FEATURED
  const home = teamByCode(m.home)
  const away = teamByCode(m.away)
  const pulse = FEATURED_PULSE

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const totalSec = 3*86400 + 11*3600 + 27*60 + 4 - tick
  const days = Math.max(0, Math.floor(totalSec / 86400))
  const hrs  = Math.max(0, Math.floor((totalSec % 86400)/3600))
  const mins = Math.max(0, Math.floor((totalSec % 3600)/60))
  const secs = Math.max(0, totalSec % 60)
  const pad = (n: number) => String(n).padStart(2,'0')

  return (
    <section style={{
      borderTop:'1.5px solid var(--ink)', borderBottom:'1.5px solid var(--ink)',
      background:'var(--paper)',
    }}>
      <div style={{
        maxWidth:1320, margin:'0 auto', padding:'40px 32px 48px',
        display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:48, alignItems:'center',
      }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>● Match à la une</span>
            <span style={{ fontSize:12, color:'var(--muted)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>
              {m.stage} · {m.venue}
            </span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:24, marginBottom:32 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:18 }}>
              <Flag team={home} w={132} h={88} />
              <div>
                <div className="display" style={{ fontSize:96, color: PALETTE.ink }}>{home.code}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--muted)' }}>{home.name.toUpperCase()}</div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
              <div className="display" style={{ fontSize:64, color: PALETTE.red }}>VS</div>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.1em' }}>{m.date} · {m.time}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:18 }}>
              <Flag team={away} w={132} h={88} />
              <div style={{ textAlign:'right' }}>
                <div className="display" style={{ fontSize:96, color: PALETTE.ink }}>{away.code}</div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--muted)' }}>{away.name.toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 22px', border:'1.5px solid var(--ink)', borderRadius:14 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Coup d&apos;envoi dans</span>
            <div style={{ display:'flex', gap:10, marginLeft:'auto' }}>
              {([['JOURS',days],['HEURES',hrs],['MIN',mins],['SEC',secs]] as Array<[string, number]>).map(([lbl,val], i) => (
                <div key={i} style={{ textAlign:'center' }}>
                  <div className="display mono" style={{ fontSize:34, color: i===3 ? PALETTE.red : PALETTE.ink, minWidth:54 }}>{pad(val)}</div>
                  <div style={{ fontSize:9, fontWeight:800, letterSpacing:'0.08em', color:'var(--muted)' }}>{lbl}</div>
                </div>
              ))}
            </div>
            <button onClick={() => onOpenMatch(m.id)} className="pill-btn solid" style={{ marginLeft:14 }}>Ouvrir le match →</button>
          </div>
        </div>

        <div className="card" style={{ padding:24, background: PALETTE.lime, border:'1.5px solid var(--ink)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>Le pouls de la communauté</span>
            <span className="mono" style={{ fontSize:11, fontWeight:700 }}>{pulse.volume.toLocaleString('fr-FR')} pronostics</span>
          </div>
          <div className="display" style={{ fontSize:26, marginBottom:18, lineHeight:1 }}>Qui gagne ?</div>
          {([['1 · ' + home.code, pulse.home],['NUL', pulse.draw],['2 · ' + away.code, pulse.away]] as Array<[string, number]>).map(([lbl, pct], i) => (
            <div key={i} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12, fontWeight:700 }}>
                <span>{lbl}</span><span className="mono">{pct}%</span>
              </div>
              <div style={{ height:10, background:'rgba(10,10,10,0.1)', borderRadius:5, overflow:'hidden' }}>
                <div style={{ height:'100%', width: pct+'%', background:'var(--ink)', borderRadius:5 }} />
              </div>
            </div>
          ))}
          <button onClick={() => onOpenMatch(m.id)} className="pill-btn" style={{ width:'100%', justifyContent:'center', marginTop:12, background:'var(--ink)', color:'var(--paper)' }}>
            Placer mon pronostic →
          </button>
        </div>
      </div>
    </section>
  )
}

export function UpcomingStrip({ onOpenMatch }: { onOpenMatch: (id: string) => void }) {
  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'48px 32px 16px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
        <h2 className="display" style={{ fontSize:36, margin:0 }}>Cette semaine</h2>
        <a style={{ fontSize:12, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Tout le calendrier →</a>
      </div>
      <div className="h-scroll" style={{ display:'flex', gap:14, paddingBottom:6 }}>
        {MATCHES.map((mBase, i) => {
          const m = CALENDAR.find(x => x.id === mBase.id) || mBase
          const h = teamByCode(m.home), a = teamByCode(m.away)
          const accent = [PALETTE.red, PALETTE.purple, PALETTE.blue, PALETTE.magenta, PALETTE.lime, PALETTE.orange][i%6]
          return (
            <div key={m.id} onClick={() => onOpenMatch(m.id)} className="card" style={{
              padding:18, minWidth:280, cursor:'pointer', transition:'transform .15s',
              borderTop:`6px solid ${accent}`, borderTopLeftRadius:18, borderTopRightRadius:18,
            }}
            onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>{m.stage}</span>
                <span className="mono" style={{ fontSize:11, color:'var(--ink)', fontWeight:700 }}>{m.date}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Flag team={h} w={32} h={22}/>
                  <span className="display" style={{ fontSize:22 }}>{h.code}</span>
                </div>
                <span className="mono" style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{m.odds.home.toFixed(2)}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Flag team={a} w={32} h={22}/>
                  <span className="display" style={{ fontSize:22 }}>{a.code}</span>
                </div>
                <span className="mono" style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>{m.odds.away.toFixed(2)}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px dashed var(--line)' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                  <span style={{ fontSize:11, color:'var(--ink)', fontWeight:800 }}>{m.time} {(m.vKey && TZ_LABEL[m.vKey]) || ''} · {m.venue.split('·')[1]?.trim()}</span>
                  {(() => {
                    const p = toParis(m.time, m.vKey)
                    if (!p) return null
                    return (
                      <span style={{ fontSize:10, color: PALETTE.blue, fontWeight:800 }}>↳ {p.time} Paris{p.dayShift>0 ? ' J+'+p.dayShift : ''}</span>
                    )
                  })()}
                </div>
                <span style={{ fontSize:11, fontWeight:800, color: accent, letterSpacing:'0.06em' }}>PARIER →</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function AnalysesGrid() {
  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'48px 32px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
        <h2 className="display" style={{ fontSize:36, margin:0 }}>Analyses &amp; data</h2>
        <a style={{ fontSize:12, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Toutes les analyses →</a>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        {ANALYSES.map((a, i) => (
          <article key={i} className="card" style={{ padding:0, overflow:'hidden', cursor:'pointer', transition:'transform .15s' }}
            onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
            <ImagePlaceholder kind={['tactical','data','portrait','news'][i%4]}
              label={'PHOTO · ' + a.tag.toLowerCase()} color={a.color} h={150}/>
            <div style={{ padding:18 }}>
              <span className="chip" style={{ background: a.color, color:'#FFFFFF', marginBottom:10 }}>{a.tag}</span>
              <h3 style={{ fontSize:16, fontWeight:800, lineHeight:1.25, margin:'10px 0 12px', textWrap:'pretty' }}>{a.title}</h3>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:600, color:'var(--muted)' }}>
                <span>{a.author}</span><span>{a.read}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function TeamsView({ onOpenTeam }: { onOpenTeam: (code: string) => void }) {
  const [left, setLeft] = useState('BRA')
  const [right, setRight] = useState('FRA')
  const [group, setGroup] = useState('ALL')
  const groups = ['ALL', ...Array.from(new Set(TEAMS.map(t => t.group))).sort()]
  const filtered = group==='ALL' ? TEAMS : TEAMS.filter(t => t.group===group)

  const L = teamByCode(left)
  const R = teamByCode(right)
  const sL = TEAM_STATS[left]
  const sR = TEAM_STATS[right]

  const onCardClick = (code: string, e: React.MouseEvent) => {
    if (e && e.shiftKey) {
      if (code===left || code===right) return
      setLeft(right); setRight(code)
      return
    }
    if (onOpenTeam) onOpenTeam(code)
  }

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'40px 32px 64px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
        <h1 className="display" style={{ fontSize:56, margin:0 }}>Les 48 nations</h1>
        <span style={{ fontSize:13, color:'var(--muted)', fontWeight:600 }}>Ouvre une fiche équipe ou compare deux nations ↓</span>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {groups.map(g => (
          <button key={g} onClick={() => setGroup(g)} className="pill-btn"
            style={{ padding:'8px 14px', fontSize:12, background: group===g ? 'var(--ink)' : 'var(--paper)', color: group===g ? 'var(--paper)' : 'var(--ink)' }}>
            {g==='ALL' ? 'TOUTES' : 'GROUPE ' + g}
          </button>
        ))}
      </div>

      <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, marginBottom:14 }}>
        Clic = ouvrir la fiche équipe · <kbd style={{ padding:'1px 5px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:3, fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontSize:10 }}>Shift</kbd>+clic = ajouter au comparateur
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:14, marginBottom:48 }}>
        {filtered.map(t => {
          const selected = t.code===left || t.code===right
          const role = t.code===left ? 'A' : t.code===right ? 'B' : null
          return (
            <div key={t.code} onClick={e => onCardClick(t.code, e)}
              className="card" style={{
                padding:16, cursor:'pointer', position:'relative',
                borderColor: selected ? PALETTE.ink : 'var(--ink)',
                background: selected ? PALETTE.lime : 'var(--paper)',
                transition:'all .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
              {role && (
                <span style={{ position:'absolute', top:-10, left:14, background:'var(--ink)', color:'var(--paper)', padding:'2px 10px', borderRadius:8, fontSize:10, fontWeight:800, letterSpacing:'0.1em' }}>
                  {role==='A' ? '← ÉQUIPE A' : 'ÉQUIPE B →'}
                </span>
              )}
              <Flag team={t} w={56} h={38} />
              <div className="display" style={{ fontSize:32, marginTop:12 }}>{t.code}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', marginBottom:10 }}>{t.name}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>GR. {t.group} · #{t.rank}</span>
                <FormDots form={t.form} size={11}/>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ padding:32 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', marginBottom:28 }}>
          <TeamBadge team={L} size="lg" />
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <span className="display" style={{ fontSize:24, color:PALETTE.red }}>VS</span>
            <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>STATS · PER 90 MIN</span>
          </div>
          <div style={{ justifySelf:'end' }}><TeamBadge team={R} size="lg" reverse/></div>
        </div>

        {([
          ['Possession %','possession'], ['Tirs','shots'], ['Tirs cadrés','sot'],
          ['Fautes','fouls'], ['Hors-jeu','offsides'], ['Corners','corners'],
          ['Coups francs','freekicks'], ['Passes','passes'], ['Passes réussies','succPasses'],
          ['Centres','crosses'], ['Interceptions','intercepts'], ['Tacles','tackles'],
          ['Arrêts','saves'],
        ] as Array<[string, string]>).map(([lbl, k]) => (
          <StatRow key={k} label={lbl} left={sL[k]} right={sR[k]} leftColor={PALETTE.blue} rightColor={PALETTE.lime} />
        ))}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:24 }}>
          <div style={{ padding:18, background:'var(--paper-2)', borderRadius:12, border:'1.5px solid var(--ink)' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em', marginBottom:6 }}>xG · {L.code}</div>
            <div className="display mono" style={{ fontSize:40, color: PALETTE.blue }}>{sL.xg.toFixed(2)}</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>Expected goals · attaque</div>
          </div>
          <div style={{ padding:18, background:'var(--paper-2)', borderRadius:12, border:'1.5px solid var(--ink)' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em', marginBottom:6 }}>xG · {R.code}</div>
            <div className="display mono" style={{ fontSize:40, color: PALETTE.lime, WebkitTextStroke:'1px var(--ink)' }}>{sR.xg.toFixed(2)}</div>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>Expected goals · attaque</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MatchView({
  matchId, onBack, onOpenTeam,
}: {
  matchId: string; onBack: () => void; onOpenTeam?: (code: string) => void;
}) {
  const m = CALENDAR.find(x => x.id===matchId) || MATCHES.find(x => x.id===matchId) || FEATURED
  const stageLbl = STAGE_INFO[m.stage]
    ? STAGE_INFO[m.stage].label + (m.group && m.group !== '-' ? ' · Groupe ' + m.group : '')
    : m.stage
  const home = teamByCode(m.home), away = teamByCode(m.away)
  const homeLineup = LINEUPS[m.home]
  const awayLineup = LINEUPS[m.away]

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:12, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:0, marginBottom:18 }}>← Retour</button>

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div className="card" style={{ padding:28, background: PALETTE.ink, color:'#FFFFFF', border:'1.5px solid var(--ink)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
              <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>● LIVE BIENTÔT</span>
              <span style={{ fontSize:11, fontWeight:700, opacity:0.7, letterSpacing:'0.06em' }}>{stageLbl} · {m.venue}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:18, cursor:'pointer' }} onClick={() => onOpenTeam && onOpenTeam(home.code)}>
                <Flag team={home} w={88} h={58} />
                <div>
                  <div className="display" style={{ fontSize:54, lineHeight:0.9 }}>{home.code}</div>
                  <div style={{ fontSize:12, fontWeight:700, opacity:0.7, marginTop:4 }}>{home.name.toUpperCase()} →</div>
                </div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div className="display mono" style={{ fontSize:42 }}>–&nbsp;:&nbsp;–</div>
                <div style={{ display:'inline-flex', alignItems:'baseline', gap:6, marginTop:8, padding:'4px 10px', background:'rgba(255,255,255,0.1)', borderRadius:6 }}>
                  <span className="mono" style={{ fontSize:14, fontWeight:800, color:'#FFFFFF' }}>{m.time}</span>
                  <span style={{ fontSize:9, fontWeight:800, opacity:0.7, letterSpacing:'0.06em' }}>
                    {(m.vKey && TZ_LABEL[m.vKey]) || 'LOCAL'}
                  </span>
                </div>
                {(() => {
                  const p = toParis(m.time, m.vKey)
                  if (!p) return null
                  return (
                    <div style={{ display:'inline-flex', alignItems:'baseline', gap:6, marginTop:6, padding:'4px 10px', background: PALETTE.lime, color:'var(--ink)', borderRadius:6 }}>
                      <span className="mono" style={{ fontSize:14, fontWeight:800 }}>{p.time}</span>
                      <span style={{ fontSize:9, fontWeight:800, letterSpacing:'0.06em' }}>
                        PARIS{p.dayShift>0 ? ' J+'+p.dayShift : ''}
                      </span>
                    </div>
                  )
                })()}
                <div style={{ fontSize:10, opacity:0.6, fontWeight:700, marginTop:8, letterSpacing:'0.06em' }}>{m.date}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:18, justifyContent:'flex-end', cursor:'pointer' }} onClick={() => onOpenTeam && onOpenTeam(away.code)}>
                <div style={{ textAlign:'right' }}>
                  <div className="display" style={{ fontSize:54, lineHeight:0.9 }}>{away.code}</div>
                  <div style={{ fontSize:12, fontWeight:700, opacity:0.7, marginTop:4 }}>← {away.name.toUpperCase()}</div>
                </div>
                <Flag team={away} w={88} h={58} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
              <h3 className="display" style={{ fontSize:24, margin:0 }}>Compositions probables</h3>
              <div style={{ display:'flex', gap:12, fontSize:11, fontWeight:700, color:'var(--muted)' }}>
                <span>{home.code} · {homeLineup?.formation || '—'}</span>
                <span style={{ color:'var(--line)' }}>|</span>
                <span>{away.code} · {awayLineup?.formation || '—'}</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {homeLineup ? <Pitch lineup={homeLineup} teamColor={home.color}/> :
                <div className="placeholder" style={{ aspectRatio:'4/5', borderRadius:14, border:'1.5px solid var(--ink)' }}>[ compo {home.code} ]</div>}
              {awayLineup ? <Pitch lineup={awayLineup} teamColor={away.color}/> :
                <div className="placeholder" style={{ aspectRatio:'4/5', borderRadius:14, border:'1.5px solid var(--ink)' }}>[ compo {away.code} ]</div>}
            </div>

            {homeLineup && awayLineup && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:18 }}>
                <BenchList title="Remplaçants" coach={homeLineup.coach} bench={homeLineup.bench}/>
                <BenchList title="Remplaçants" coach={awayLineup.coach} bench={awayLineup.bench}/>
              </div>
            )}
          </div>

          <MatchPreviewBlock matchId={m.id} home={home} away={away}/>
      </div>
    </section>
  )
}

function BenchList({ title, coach, bench }: { title: string; coach: string; bench: string[] }) {
  return (
    <div style={{ padding:14, background:'var(--paper-2)', borderRadius:12, border:'1.5px solid var(--line)' }}>
      <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:8 }}>{title.toUpperCase()}</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px 12px', fontSize:11, fontWeight:600 }}>
        {bench.map((b, i) => <span key={i} style={{ color:'var(--ink)' }}>{b}</span>)}
      </div>
      <div style={{ marginTop:10, paddingTop:10, borderTop:'1px dashed var(--line)', fontSize:11 }}>
        <span style={{ fontWeight:800, color:'var(--muted)', letterSpacing:'0.06em' }}>SÉLECTIONNEUR</span><br/>
        <span style={{ fontWeight:700 }}>{coach}</span>
      </div>
    </div>
  )
}

// Pseudo-stable avatar color per Supabase user id (no need to round-trip)
const LB_AVATARS = ['#FF0080', '#0033FF', '#C8FF00', '#6B2FB5', '#E10600', '#FF6E00', '#0A0A0A', '#FFD400']
const avatarFor = (id: string) => {
  let h = 0; for (let i=0; i<id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return LB_AVATARS[h % LB_AVATARS.length]
}

export function PredictionsView({
  onOpenMatch, onOpenLeaderboard, profile,
}: { onOpenMatch: (id: string) => void; onOpenLeaderboard: () => void; profile?: Profile | null }) {
  type LbRow = { id: string; pseudo: string; total_points: number; total_predictions: number; rang: number }
  const [top, setTop] = useState<LbRow[]>([])
  useEffect(() => {
    fetch('/api/leaderboard?limit=10').then(r => r.ok ? r.json() : { leaderboard: [] })
      .then((d: { leaderboard: LbRow[] }) => setTop(d.leaderboard ?? []))
      .catch(() => {})
  }, [])

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'40px 32px 64px' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24, gap:24 }}>
        <div>
          <h1 className="display" style={{ fontSize:64, margin:'0 0 8px' }}>Pronostics<br/>communautaires</h1>
          <p style={{ fontSize:15, color:'var(--muted)', maxWidth:520, lineHeight:1.4 }}>
            1 000 pts offerts à l&apos;inscription. <strong style={{ color:'var(--ink)' }}>Score exact</strong> = 5 pts ·
            <strong style={{ color:'var(--ink)' }}> Bon vainqueur</strong> = 3 pts · Faux = 0 pt.
          </p>
        </div>
        <div style={{ display:'flex', gap:14 }}>
          <BigStat label="Mes points" value={profile ? profile.total_points.toLocaleString('fr-FR') : '—'} color={PALETTE.lime}/>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24 }}>
        <div>
          <h2 className="display" style={{ fontSize:24, margin:'0 0 14px' }}>Matchs à pronostiquer</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {MATCHES.map((m, i) => {
              const h = teamByCode(m.home), a = teamByCode(m.away)
              const accent = [PALETTE.red, PALETTE.purple, PALETTE.blue, PALETTE.magenta, PALETTE.lime, PALETTE.orange][i%6]
              return (
                <div key={m.id} className="card" style={{ padding:18, display:'grid', gridTemplateColumns:'1fr auto', gap:18, alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:16, minWidth:0 }}>
                    <div style={{ width:8, height:48, background:accent, borderRadius:4, flexShrink:0 }}/>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>{m.stage}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                        <Flag team={h} w={28} h={18}/>
                        <span className="display" style={{ fontSize:18 }}>{h.code}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:'var(--muted)' }}>vs</span>
                        <span className="display" style={{ fontSize:18 }}>{a.code}</span>
                        <Flag team={a} w={28} h={18}/>
                      </div>
                      <div style={{ fontSize:10, fontWeight:600, color:'var(--muted)', marginTop:4 }}>{m.date} · {m.time}</div>
                    </div>
                  </div>
                  <button onClick={() => onOpenMatch(m.id)} className="pill-btn solid" style={{ padding:'10px 18px', fontSize:12, whiteSpace:'nowrap' }}>
                    Pronostiquer →
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden', height:'fit-content' }}>
          <div style={{ padding:'18px 20px', background: PALETTE.ink, color:'#FFFFFF' }}>
            <div className="display" style={{ fontSize:22 }}>🏆 Classement</div>
            <div style={{ fontSize:11, fontWeight:600, opacity:0.7, marginTop:2 }}>Top pronostiqueurs</div>
          </div>
          <div>
            {top.length === 0 ? (
              <div style={{ padding:'24px 18px', textAlign:'center', color:'var(--muted)', fontSize:12 }}>
                Aucun pronostiqueur encore. <strong style={{ color:'var(--ink)' }}>Sois le premier !</strong>
              </div>
            ) : top.map((p, i) => (
              <div key={p.id} style={{
                display:'grid', gridTemplateColumns:'28px 28px 1fr auto', alignItems:'center', gap:10,
                padding:'12px 18px', borderBottom: i<top.length-1 ? '1px solid var(--line)' : 'none',
                background: i<3 ? 'rgba(200,255,0,0.07)' : 'transparent',
              }}>
                <span className="display mono" style={{ fontSize:14, color: i===0 ? PALETTE.red : i<3 ? PALETTE.ink : 'var(--muted)' }}>{p.rang}</span>
                <div style={{ width:24, height:24, borderRadius:'50%', background: avatarFor(p.id), border:'1.5px solid var(--ink)' }}/>
                <div>
                  <div style={{ fontSize:12, fontWeight:800 }}>@{p.pseudo}</div>
                  <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{p.total_predictions} pronostic{p.total_predictions>1?'s':''}</div>
                </div>
                <span className="mono" style={{ fontSize:13, fontWeight:800 }}>{p.total_points.toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:14, borderTop:'1.5px solid var(--ink)' }}>
            <button onClick={onOpenLeaderboard} className="pill-btn" style={{ width:'100%', justifyContent:'center' }}>Voir tout le classement →</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function BigStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding:'14px 18px', border:'1.5px solid var(--ink)', borderRadius:12, background: color, minWidth:120 }}>
      <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', color:'var(--ink)', textTransform:'uppercase' }}>{label}</div>
      <div className="display mono" style={{ fontSize:28, marginTop:4 }}>{value}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Match preview block (probabilities + stats + H2H) — imported here
// to avoid circular reference. From 09-views-extra.jsx.
// ─────────────────────────────────────────────────────────────
import { MATCH_PROBS, H2H } from './data'

function MatchPreviewBlock({ matchId, home, away }: { matchId: string; home: any; away: any }) {
  const probs = MATCH_PROBS[matchId] || { home:33, draw:33, away:34, predictedScore:'1-1', expectedGoals:2.5, bothScore:55, over25:55 }
  const sL = TEAM_STATS[home.code]
  const sR = TEAM_STATS[away.code]
  const h2h = H2H[matchId] || []

  return (
    <div style={{ display:'grid', gap:16, marginTop:16 }}>
      <div className="card" style={{ padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <h3 className="display" style={{ fontSize:24, margin:0 }}>Probabilités du match</h3>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Modèle Poisson · v2.1</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:18 }}>
          {([['1 · '+home.code, probs.home, PALETTE.blue],['NUL', probs.draw, '#0A0A0A'],['2 · '+away.code, probs.away, PALETTE.red]] as Array<[string, number, string]>).map(([lbl, pct, c], i) => (
            <div key={i} style={{ padding:18, border:'1.5px solid var(--ink)', borderRadius:12, background: i===1 ? 'var(--paper-2)' : 'var(--paper)' }}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'var(--muted)' }}>{lbl}</div>
              <div className="display mono" style={{ fontSize:42, color: c, marginTop:6 }}>{pct}%</div>
              <div style={{ height:6, background:'var(--paper-2)', borderRadius:3, marginTop:10 }}>
                <div style={{ height:'100%', width:pct+'%', background:c, borderRadius:3 }}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
          {([
            ['Score prédit', probs.predictedScore, PALETTE.lime],
            ['xG total',     probs.expectedGoals.toFixed(1), PALETTE.purple],
            ['BTTS',         probs.bothScore + '%', PALETTE.magenta],
            ['+ 2.5 buts',   probs.over25 + '%', PALETTE.orange],
          ] as Array<[string, string, string]>).map(([lbl, v, c], i) => (
            <div key={i} style={{ padding:'12px 14px', background:'var(--paper-2)', borderRadius:10, borderLeft:`4px solid ${c}` }}>
              <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>{lbl.toUpperCase()}</div>
              <div className="display mono" style={{ fontSize:22, marginTop:4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding:24 }}>
        <h3 className="display" style={{ fontSize:24, margin:'0 0 18px' }}>Comparaison des stats</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', marginBottom:14 }}>
          <TeamBadge team={home} size="sm"/>
          <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em', padding:'0 14px' }}>PER 90 MIN</span>
          <div style={{ justifySelf:'end' }}><TeamBadge team={away} size="sm" reverse/></div>
        </div>
        {([
          ['Possession %','possession'], ['Tirs','shots'], ['Tirs cadrés','sot'],
          ['Passes réussies','succPasses'], ['xG','xg'], ['xGA','xga'],
        ] as Array<[string, string]>).map(([lbl, k]) => (
          <StatRow key={k} label={lbl} left={sL[k]} right={sR[k]} leftColor={PALETTE.blue} rightColor={PALETTE.lime}/>
        ))}
      </div>

      {h2h.length > 0 && (
        <div className="card" style={{ padding:24 }}>
          <h3 className="display" style={{ fontSize:24, margin:'0 0 14px' }}>Confrontations récentes</h3>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {h2h.map((g: any, i: number) => {
              const hm = teamByCode(g.home), aw = teamByCode(g.away)
              return (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr auto 1fr 80px', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i<h2h.length-1 ? '1px dashed var(--line)' : 'none' }}>
                  <span className="mono" style={{ fontSize:11, color:'var(--muted)', fontWeight:700 }}>{g.date}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Flag team={hm} w={28} h={18}/>
                    <span className="display" style={{ fontSize:14 }}>{hm.code}</span>
                  </div>
                  <span className="display mono" style={{ fontSize:18, padding:'4px 14px', border:'1.5px solid var(--ink)', borderRadius:6 }}>{g.score}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'flex-end' }}>
                    <span className="display" style={{ fontSize:14 }}>{aw.code}</span>
                    <Flag team={aw} w={28} h={18}/>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:'var(--muted)', textAlign:'right', letterSpacing:'0.06em' }}>{g.comp.toUpperCase()}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
