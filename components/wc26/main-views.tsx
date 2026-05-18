'use client'

// Main views for WC26 HUB — Hero, Upcoming, Analyses, Teams, Match, Predictions
// Ported 1:1 from design/js/08-main-views.jsx

import { useState, useEffect, useMemo } from 'react'
import type { Profile, Prediction } from '@/lib/db-types'
import {
  TEAMS, MATCHES, FEATURED_PULSE, ANALYSES, TEAM_STATS, LINEUPS,
  CALENDAR, STAGE_INFO, TZ_LABEL, TZ_OFFSET, toParis,
} from './data'
import { Flag, TeamBadge, StatRow, FormDots, Pitch, ImagePlaceholder, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

// Format '2026-06-15' → '15 JUIN'
const MOIS = ['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEP','OCT','NOV','DÉC']
function fmtDate(iso: string): string {
  const [, mo, day] = iso.split('-')
  return `${parseInt(day)} ${MOIS[parseInt(mo)-1]}`
}

// Convert match local time to UTC ms
function matchUTCms(dateISO: string, time: string, vKey: string): number {
  const [hh, mm] = time.split(':').map(Number)
  const localToUTC = (TZ_OFFSET[vKey] ?? 6) - 2
  return new Date(dateISO + 'T00:00:00Z').getTime() + (hh + localToUTC) * 3_600_000 + mm * 60_000
}

// First FRA match from CALENDAR (sorted by date)
const FRA_HERO = CALENDAR.filter(m => m.home === 'FRA' || m.away === 'FRA')
  .sort((a, b) => a.date.localeCompare(b.date))[0]

export function HeroFeatured({ onOpenMatch }: { onOpenMatch: (id: string) => void }) {
  const m = FRA_HERO
  const home = teamByCode(m.home)
  const away = teamByCode(m.away)
  const pulse = FEATURED_PULSE

  const targetUTC = matchUTCms(m.date, m.time, m.vKey ?? 'DAL')
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const totalSec = Math.max(0, Math.floor((targetUTC - now) / 1000))
  const days = Math.floor(totalSec / 86400)
  const hrs  = Math.floor((totalSec % 86400) / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  const secs = totalSec % 60
  const pad = (n: number) => String(n).padStart(2, '0')

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
              Groupe {m.group} · {m.stage} · {m.venue}
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
              <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.1em' }}>{fmtDate(m.date)} · {m.time}</div>
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

export function UpcomingStrip({ onOpenMatch, onOpenCalendar }: { onOpenMatch: (id: string) => void; onOpenCalendar?: () => void }) {
  const todayISO = new Date().toISOString().slice(0, 10)
  const upcoming = [...CALENDAR]
    .sort((a, b) => {
      const dc = a.date.localeCompare(b.date)
      return dc !== 0 ? dc : a.time.localeCompare(b.time)
    })
    .filter(m => m.date >= todayISO)
    .slice(0, 12)

  const displayMatches = upcoming.length > 0 ? upcoming : CALENDAR.slice(0, 12)

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'48px 32px 16px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
        <h2 className="display" style={{ fontSize:36, margin:0 }}>Prochains matchs</h2>
        <button onClick={onOpenCalendar} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase', padding:0 }}>
          Tout le calendrier →
        </button>
      </div>
      <div className="h-scroll" style={{ display:'flex', gap:14, paddingBottom:6 }}>
        {displayMatches.map((m, i) => {
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
                <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>
                  {m.group !== '-' ? `Groupe ${m.group} · ` : ''}{m.stage}
                </span>
                <span className="mono" style={{ fontSize:11, color:'var(--ink)', fontWeight:700 }}>{fmtDate(m.date)}</span>
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
  const [group, setGroup] = useState('ALL')
  const groups = ['ALL', ...Array.from(new Set(TEAMS.map(t => t.group))).sort()]
  const filtered = group==='ALL' ? TEAMS : TEAMS.filter(t => t.group===group)

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'40px 32px 64px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
        <h1 className="display" style={{ fontSize:56, margin:0 }}>Les 48 nations</h1>
        <span style={{ fontSize:13, color:'var(--muted)', fontWeight:600 }}>Clique sur une équipe pour ouvrir sa fiche</span>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {groups.map(g => (
          <button key={g} onClick={() => setGroup(g)} className="pill-btn"
            style={{ padding:'8px 14px', fontSize:12, background: group===g ? 'var(--ink)' : 'var(--paper)', color: group===g ? 'var(--paper)' : 'var(--ink)' }}>
            {g==='ALL' ? 'TOUTES' : 'GROUPE ' + g}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:14 }}>
        {filtered.map(t => (
          <div key={t.code} onClick={() => onOpenTeam(t.code)}
            className="card" style={{
              padding:16, cursor:'pointer',
              background:'var(--paper)',
              transition:'transform .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
            onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
            <Flag team={t} w={56} h={38} />
            <div className="display" style={{ fontSize:32, marginTop:12 }}>{t.code}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', marginBottom:10 }}>{t.name}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>GR. {t.group} · #{t.rank}</span>
              <FormDots form={t.form} size={11}/>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function MatchView({
  matchId, onBack, onOpenTeam,
}: {
  matchId: string; onBack: () => void; onOpenTeam?: (code: string) => void;
}) {
  const m = CALENDAR.find(x => x.id===matchId) || MATCHES.find(x => x.id===matchId) || FRA_HERO
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

const DOW = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const MONTHS = ['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC']

// "today" en local browser → string YYYY-MM-DD comparable aux dates du CALENDAR
function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// Construit la grille de jours qui couvre tous les matchs (premier lundi
// avant le 1er match → dernier dimanche après le dernier match).
function buildGridDays(matchDates: string[]): string[] {
  if (matchDates.length === 0) return []
  const first = matchDates[0]
  const last  = matchDates[matchDates.length - 1]
  const start = new Date(first + 'T00:00:00')
  const end   = new Date(last  + 'T00:00:00')
  // Reculer jusqu'au lundi
  const dow = (start.getDay() + 6) % 7  // 0 = Lundi
  start.setDate(start.getDate() - dow)
  // Avancer jusqu'au dimanche
  const dowEnd = (end.getDay() + 6) % 7
  end.setDate(end.getDate() + (6 - dowEnd))
  const days: string[] = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)
  }
  return days
}

export function PredictionsView({
  onOpenMatch, onOpenLeaderboard, profile, user,
}: {
  onOpenMatch: (id: string) => void;
  onOpenLeaderboard: () => void;
  profile?: Profile | null;
  user?: { id: string } | null;
}) {
  type LbRow = { id: string; pseudo: string; total_points: number; total_predictions: number; rang: number }
  const [top, setTop] = useState<LbRow[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])

  useEffect(() => {
    fetch('/api/leaderboard?limit=10').then(r => r.ok ? r.json() : { leaderboard: [] })
      .then((d: { leaderboard: LbRow[] }) => setTop(d.leaderboard ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) { setPredictions([]); return }
    fetch('/api/predictions').then(r => r.ok ? r.json() : { predictions: [] })
      .then((d: { predictions: Prediction[] }) => setPredictions(d.predictions ?? []))
      .catch(() => {})
  }, [user])

  const today = todayStr()

  const matchesByDate = useMemo(() => {
    const m = new Map<string, typeof CALENDAR>()
    for (const x of CALENDAR) {
      if (!m.has(x.date)) m.set(x.date, [])
      m.get(x.date)!.push(x)
    }
    return m
  }, [])

  const predictionByMatch = useMemo(() => {
    const m = new Map<string, Prediction>()
    for (const p of predictions) m.set(p.match_id, p)
    return m
  }, [predictions])

  const sortedDates = useMemo(() => Array.from(matchesByDate.keys()).sort(), [matchesByDate])
  const gridDays = useMemo(() => buildGridDays(sortedDates), [sortedDates])

  // Jour sélectionné : aujourd'hui s'il a un match, sinon prochain jour avec match
  const initialSelected = matchesByDate.has(today)
    ? today
    : sortedDates.find(d => d >= today) ?? sortedDates[sortedDates.length - 1]
  const [selectedDate, setSelectedDate] = useState<string>(initialSelected)

  const todaysMatches = matchesByDate.get(today) ?? []
  const dayLockState = (d: string): 'past' | 'today' | 'future' =>
    d < today ? 'past' : d === today ? 'today' : 'future'

  // Statut d'un pronostic individuel (pour les pastilles dans les cellules)
  const predictionStatus = (matchId: string): 'won' | 'lost' | 'pending' | 'none' => {
    const p = predictionByMatch.get(matchId)
    if (!p) return 'none'
    if (!p.scored) return 'pending'
    return p.points_earned > 0 ? 'won' : 'lost'
  }

  const openTodayCTA = () => {
    if (todaysMatches.length > 0) onOpenMatch(todaysMatches[0].id)
    else if (sortedDates.length > 0) setSelectedDate(sortedDates.find(d => d >= today) ?? sortedDates[0])
  }

  // Mois affichés (de juin à juillet 2026 typiquement) → calculé à partir de gridDays
  const monthsInRange = useMemo(() => {
    const seen = new Set<string>()
    const out: { key: string; label: string }[] = []
    for (const d of gridDays) {
      const key = d.slice(0, 7)
      if (!seen.has(key)) {
        seen.add(key)
        const dt = new Date(d + 'T00:00:00')
        out.push({ key, label: `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}` })
      }
    }
    return out
  }, [gridDays])

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'40px 32px 64px' }}>
      {/* HEADER */}
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>🎯 JEU DU JOUR</span>
        <h1 className="display" style={{ fontSize:88, margin:'14px 0 12px', lineHeight:0.88 }}>Pronostics WC26</h1>
        <p style={{ fontSize:16, color:'var(--muted)', maxWidth:620, margin:'0 auto', lineHeight:1.45 }}>
          Un nouveau match à pronostiquer chaque jour. <strong style={{ color:'var(--ink)' }}>Score exact = 5 pts</strong> ·{' '}
          <strong style={{ color:'var(--ink)' }}>Bon résultat = 3 pts</strong> · Faux = 0 pt.
        </p>
      </div>

      {/* CTA principal centré */}
      <div style={{ display:'flex', justifyContent:'center', gap:14, marginBottom:42, flexWrap:'wrap' }}>
        <button
          onClick={openTodayCTA}
          disabled={todaysMatches.length === 0}
          className="pill-btn solid"
          style={{
            padding:'18px 32px', fontSize:15, letterSpacing:'0.04em', textTransform:'uppercase',
            opacity: todaysMatches.length===0 ? 0.55 : 1, cursor: todaysMatches.length===0 ? 'not-allowed' : 'pointer',
          }}>
          {todaysMatches.length > 0
            ? `Jouer aujourd'hui · ${todaysMatches.length} match${todaysMatches.length>1?'s':''}`
            : 'Pas de match aujourd’hui'}
        </button>
        <button
          onClick={onOpenLeaderboard}
          className="pill-btn"
          style={{ padding:'18px 32px', fontSize:15, letterSpacing:'0.04em', textTransform:'uppercase' }}>
          🏆 Classement
        </button>
      </div>

      {/* Stats user (s'il est connecté) */}
      {profile && (
        <div style={{ display:'flex', justifyContent:'center', gap:14, marginBottom:32, flexWrap:'wrap' }}>
          <BigStat label="Mes points"   value={profile.total_points.toLocaleString('fr-FR')} color={PALETTE.lime}/>
          <BigStat label="Pronostiqués" value={String(predictions.length)}                    color={PALETTE.blue}/>
          <BigStat label="Score exact"  value={String(predictions.filter(p => p.points_earned === 5).length)} color={PALETTE.magenta}/>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24, alignItems:'start' }}>
        {/* CALENDRIER */}
        <div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14, gap:14, flexWrap:'wrap' }}>
            <h2 className="display" style={{ fontSize:24, margin:0 }}>Le calendrier du jeu</h2>
            <div style={{ display:'flex', gap:8, fontSize:11, fontWeight:700, color:'var(--muted)' }}>
              {monthsInRange.map(m => <span key={m.key}>{m.label}</span>)}
            </div>
          </div>

          {/* Légende */}
          <div style={{ display:'flex', gap:14, fontSize:10, fontWeight:700, color:'var(--muted)', marginBottom:14, flexWrap:'wrap' }}>
            <LegendDot color={PALETTE.lime} label="GAGNÉ"/>
            <LegendDot color={PALETTE.red}  label="PERDU"/>
            <LegendDot color={PALETTE.blue} label="EN ATTENTE"/>
            <LegendDot color="var(--line)"  label="NON JOUÉ"/>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
              <span>🔒</span><span>Verrouillé</span>
            </span>
          </div>

          {/* Header jours de semaine */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6, marginBottom:6 }}>
            {DOW.map(d => (
              <div key={d} style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', textAlign:'center' }}>{d}</div>
            ))}
          </div>

          {/* Grille des jours */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6 }}>
            {gridDays.map(d => {
              const matchesOfDay = matchesByDate.get(d) ?? []
              const lock = dayLockState(d)
              const isSelected = d === selectedDate
              const hasMatch = matchesOfDay.length > 0
              return (
                <DayCell
                  key={d}
                  date={d}
                  matches={matchesOfDay}
                  hasMatch={hasMatch}
                  lock={lock}
                  selected={isSelected}
                  predictionStatus={predictionStatus}
                  onClick={() => hasMatch && setSelectedDate(d)}
                />
              )
            })}
          </div>

          {/* Section : matchs du jour sélectionné */}
          <SelectedDaySection
            date={selectedDate}
            matches={matchesByDate.get(selectedDate) ?? []}
            lock={dayLockState(selectedDate)}
            predictionByMatch={predictionByMatch}
            onOpenMatch={onOpenMatch}
          />
        </div>

        {/* CLASSEMENT */}
        <div className="card" style={{ padding:0, overflow:'hidden', height:'fit-content', marginTop:38 }}>
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background: color, border:'1px solid var(--ink)' }}/>
      <span>{label}</span>
    </span>
  )
}

function DayCell({
  date, matches, hasMatch, lock, selected, predictionStatus, onClick,
}: {
  date: string;
  matches: typeof CALENDAR;
  hasMatch: boolean;
  lock: 'past' | 'today' | 'future';
  selected: boolean;
  predictionStatus: (id: string) => 'won' | 'lost' | 'pending' | 'none';
  onClick: () => void;
}) {
  const d = new Date(date + 'T00:00:00')
  const dayNum = d.getDate()

  // Background/border selon état
  const bg =
    !hasMatch ? 'var(--paper-2)'
    : lock === 'today' ? PALETTE.lime
    : lock === 'future' ? '#F0EDE6'
    : '#E8E4DE'
  const border =
    selected ? '2px solid var(--ink)'
    : !hasMatch ? '1px solid var(--line)'
    : lock === 'today' ? '2px solid var(--ink)'
    : '1.5px solid var(--ink)'
  const opacity = !hasMatch ? 0.35 : 1
  const cursor = hasMatch ? 'pointer' : 'default'

  const dotColor = (status: ReturnType<typeof predictionStatus>) =>
    status === 'won' ? PALETTE.lime
    : status === 'lost' ? PALETTE.red
    : status === 'pending' ? PALETTE.blue
    : 'var(--line)'

  return (
    <button
      onClick={onClick}
      disabled={!hasMatch}
      style={{
        position:'relative', aspectRatio:'1', padding:8, borderRadius:10,
        background: bg, border, opacity, cursor,
        display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'space-between',
        fontFamily:'inherit', textAlign:'left', transition:'transform .12s, background .12s',
      }}
      onMouseEnter={e => { if (hasMatch) e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)' }}>

      {/* Jour + cadenas */}
      <div style={{ width:'100%', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <span className="display mono" style={{ fontSize:18, lineHeight:1 }}>{dayNum}</span>
        {hasMatch && lock === 'future' && (
          <span style={{ fontSize:18, lineHeight:1 }}>🔒</span>
        )}
        {hasMatch && lock === 'today' && (
          <span style={{ fontSize:9, fontWeight:800, background:'var(--ink)', padding:'2px 5px', borderRadius:3, lineHeight:1 }}>
            <span style={{ color: PALETTE.lime }}>JOUR</span>
          </span>
        )}
      </div>

      {/* Codes équipes des matchs du jour */}
      {hasMatch && (
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:2 }}>
          {matches.slice(0, 2).map(m => (
            <div key={m.id} style={{ fontSize:9, fontWeight:800, letterSpacing:'0.04em', lineHeight:1.1 }}>
              {m.home}·{m.away}
            </div>
          ))}
          {matches.length > 2 && (
            <div style={{ fontSize:8, fontWeight:700, color:'var(--muted)' }}>+{matches.length - 2}</div>
          )}
          <div style={{ display:'flex', gap:3, marginTop:2 }}>
            {matches.map(m => (
              <span key={m.id} style={{
                width:7, height:7, borderRadius:'50%',
                background: dotColor(predictionStatus(m.id)),
                border:'1px solid var(--ink)',
              }}/>
            ))}
          </div>
        </div>
      )}
    </button>
  )
}

function SelectedDaySection({
  date, matches, lock, predictionByMatch, onOpenMatch,
}: {
  date: string;
  matches: typeof CALENDAR;
  lock: 'past' | 'today' | 'future';
  predictionByMatch: Map<string, Prediction>;
  onOpenMatch: (id: string) => void;
}) {
  if (matches.length === 0) return null
  const d = new Date(date + 'T00:00:00')
  const heading = `${['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`

  const lockLabel = lock === 'future' ? '🔒 Pronostic verrouillé jusqu’au jour J' : lock === 'past' ? 'Résultat finalisé' : 'À pronostiquer aujourd’hui'
  const lockBg    = lock === 'future' ? 'var(--paper-2)' : lock === 'past' ? 'var(--paper-2)' : PALETTE.lime

  return (
    <div style={{ marginTop:24 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12, gap:14, flexWrap:'wrap' }}>
        <h3 className="display" style={{ fontSize:22, margin:0 }}>{heading}</h3>
        <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.06em', padding:'4px 10px', background: lockBg, border:'1.5px solid var(--ink)', borderRadius:99 }}>
          {lockLabel.toUpperCase()}
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {matches.map((m, i) => {
          const h = teamByCode(m.home), a = teamByCode(m.away)
          const accent = [PALETTE.red, PALETTE.purple, PALETTE.blue, PALETTE.magenta, PALETTE.lime, PALETTE.orange][i%6]
          const pred = predictionByMatch.get(m.id)
          const pickLabel = pred ? (pred.pick === 'home' ? h.code : pred.pick === 'away' ? a.code : 'NUL') : null
          const locked = lock === 'future'
          return (
            <div key={m.id} className="card" style={{ padding:16, display:'grid', gridTemplateColumns:'1fr auto', gap:18, alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, minWidth:0 }}>
                <div style={{ width:6, height:42, background: accent, borderRadius:3, flexShrink:0 }}/>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>{m.stage} · {m.time}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                    <Flag team={h} w={26} h={17}/>
                    <span className="display" style={{ fontSize:18 }}>{h.code}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--muted)' }}>vs</span>
                    <span className="display" style={{ fontSize:18 }}>{a.code}</span>
                    <Flag team={a} w={26} h={17}/>
                  </div>
                  {pred && (
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--ink)', marginTop:5 }}>
                      Ton pari : <span style={{ background: PALETTE.lime, padding:'1px 6px', borderRadius:3 }}>{pickLabel}</span>
                      {pred.score_home != null && pred.score_away != null && (
                        <> · <span className="mono">{pred.score_home}-{pred.score_away}</span></>
                      )}
                      {pred.scored && (
                        <> · <span style={{ color: pred.points_earned > 0 ? PALETTE.lime : PALETTE.red, fontWeight:800 }}>+{pred.points_earned} pts</span></>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onOpenMatch(m.id)}
                disabled={locked}
                className="pill-btn solid"
                style={{
                  padding:'10px 18px', fontSize:12, whiteSpace:'nowrap',
                  opacity: locked ? 0.45 : 1, cursor: locked ? 'not-allowed' : 'pointer',
                }}>
                {locked ? '🔒 Verrouillé' : pred ? 'Modifier →' : 'Pronostiquer →'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
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
