'use client'

// Groups (poules) view — 12 groups standings + matches per group
// Ported 1:1 from design/js/12-groups-view.jsx

import { useState } from 'react'
import { TEAMS, GROUPS, GROUP_LETTERS, STANDINGS, CALENDAR, STAGE_INFO } from './data'
import { Flag, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

export function GroupsView({
  onOpenTeam, onOpenMatch,
}: { onOpenTeam: (code: string) => void; onOpenMatch: (id: string) => void }) {
  const [focused, setFocused] = useState<string | null>(null)

  if (focused) {
    return <GroupDetail letter={focused} onBack={() => setFocused(null)} onOpenTeam={onOpenTeam} onOpenMatch={onOpenMatch}/>
  }

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24, gap:24 }}>
        <div>
          <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>● PHASE DE GROUPES</span>
          <h1 className="display" style={{ fontSize:80, margin:'14px 0 0', lineHeight:0.9 }}>Les 12 poules</h1>
          <p style={{ fontSize:14, color:'var(--muted)', marginTop:8, maxWidth:580, lineHeight:1.45 }}>
            48 nations · 12 groupes de 4 · Les 2 premiers et les 8 meilleurs troisièmes se qualifient pour les 16es de finale.
          </p>
        </div>
        <div style={{ display:'flex', gap:14, fontSize:11, fontWeight:700 }}>
          <LegendDot color={PALETTE.lime} label="Qualifié direct"/>
          <LegendDot color={PALETTE.orange} label="3e place — repêchage"/>
          <LegendDot color={PALETTE.red} label="Éliminé"/>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
        {GROUP_LETTERS.map(letter => (
          <GroupCard key={letter} letter={letter} onOpenTeam={onOpenTeam} onFocus={() => setFocused(letter)}/>
        ))}
      </div>
    </section>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display:'flex', alignItems:'center', gap:6 }}>
      <span style={{ width:14, height:14, borderRadius:3, background: color, border:'1.5px solid var(--ink)' }}/>
      <span style={{ color:'var(--muted)' }}>{label}</span>
    </span>
  )
}

function GroupCard({
  letter, onOpenTeam, onFocus,
}: { letter: string; onOpenTeam: (code: string) => void; onFocus: () => void }) {
  const codes = GROUPS[letter]
  const rows = codes.map(c => ({
    team: teamByCode(c),
    s: STANDINGS[c],
  })).sort((a, b) => {
    if (b.s.Pts !== a.s.Pts) return b.s.Pts - a.s.Pts
    if (b.s.GD !== a.s.GD) return b.s.GD - a.s.GD
    return b.s.GF - a.s.GF
  })

  const posColor = (i: number) => i<2 ? PALETTE.lime : i===2 ? PALETTE.orange : PALETTE.red

  return (
    <div className="card" style={{ padding:0, overflow:'hidden', cursor:'pointer', transition:'transform .15s' }}
      onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
      onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}
      onClick={onFocus}>
      <div style={{ padding:'14px 18px', background:'var(--ink)', color:'var(--paper)', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, opacity:0.6, letterSpacing:'0.1em' }}>GROUPE</div>
          <div className="display" style={{ fontSize:36, lineHeight:0.85 }}>{letter}</div>
        </div>
        <span style={{ fontSize:11, fontWeight:800, color: PALETTE.lime, letterSpacing:'0.06em' }}>OUVRIR →</span>
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'var(--paper-2)' }}>
            <th style={th(28)}>#</th>
            <th style={{ ...th(), textAlign:'left' }}>ÉQUIPE</th>
            <th style={th(28)}>J</th>
            <th style={th(28)}>G</th>
            <th style={th(28)}>N</th>
            <th style={th(28)}>P</th>
            <th style={th(36)}>+/-</th>
            <th style={{ ...th(36), color:'var(--ink)' }}>PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.team.code}
              onClick={e => { e.stopPropagation(); onOpenTeam && onOpenTeam(r.team.code) }}
              style={{ borderTop:'1px solid var(--line)', cursor:'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background='var(--paper-2)')}
              onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
              <td style={{ ...td(), textAlign:'center' }}>
                <span style={{ display:'inline-block', width:18, height:18, borderRadius:4, background: posColor(i), border:'1px solid var(--ink)', fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:11, lineHeight:'17px', color:'var(--ink)' }}>{i+1}</span>
              </td>
              <td style={{ ...td(), display:'flex', alignItems:'center', gap:8 }}>
                <Flag team={r.team} w={22} h={14}/>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <span style={{ fontWeight:800, fontSize:12 }}>{r.team.code}</span>
                  <span style={{ fontSize:9, color:'var(--muted)', fontWeight:600 }}>{r.team.name}</span>
                </div>
              </td>
              <td style={td()}>{r.s.P}</td>
              <td style={td()}>{r.s.W}</td>
              <td style={td()}>{r.s.D}</td>
              <td style={td()}>{r.s.L}</td>
              <td style={{ ...td(), color: r.s.GD>0 ? PALETTE.lime : r.s.GD<0 ? PALETTE.red : 'var(--ink)', fontWeight:800 }}>
                {r.s.GD>0 ? '+' : ''}{r.s.GD}
              </td>
              <td style={{ ...td(), fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:14 }}>{r.s.Pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function th(w?: number): React.CSSProperties {
  return {
    padding:'8px 6px', fontSize:9, fontWeight:800, color:'var(--muted)',
    letterSpacing:'0.06em', textAlign:'center', width: w || undefined,
  }
}
function td(): React.CSSProperties {
  return {
    padding:'10px 6px', fontSize:11, fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontWeight:700,
    textAlign:'center', color:'var(--ink)',
  }
}

function GroupDetail({
  letter, onBack, onOpenTeam, onOpenMatch,
}: { letter: string; onBack: () => void; onOpenTeam?: (code: string) => void; onOpenMatch?: (id: string) => void }) {
  const codes = GROUPS[letter]
  const rows = codes.map(c => ({ team: teamByCode(c), s: STANDINGS[c] }))
    .sort((a, b) => (b.s.Pts - a.s.Pts) || (b.s.GD - a.s.GD) || (b.s.GF - a.s.GF))

  const matches = CALENDAR.filter(m => m.group === letter)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  const posColor = (i: number) => i<2 ? PALETTE.lime : i===2 ? PALETTE.orange : PALETTE.red

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:12, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:0, marginBottom:14 }}>← Tous les groupes</button>

      <div style={{ display:'flex', alignItems:'baseline', gap:24, marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ width:88, height:88, borderRadius:18, background:'var(--ink)', color:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="display" style={{ fontSize:56, lineHeight:0.85 }}>{letter}</div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em' }}>GROUPE {letter} · {codes.length} ÉQUIPES</div>
            <h1 className="display" style={{ fontSize:48, margin:'4px 0 0', lineHeight:0.95 }}>
              {rows.map(r => r.team.code).join(' · ')}
            </h1>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:18 }}>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', background:'var(--ink)', color:'var(--paper)' }}>
            <h3 className="display" style={{ fontSize:22, margin:0 }}>Classement</h3>
            <div style={{ fontSize:11, opacity:0.7, fontWeight:600, marginTop:2 }}>Mis à jour après chaque match</div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--paper-2)' }}>
                <th style={{ ...th(40), textAlign:'center' }}>#</th>
                <th style={{ ...th(), textAlign:'left', paddingLeft:18 }}>ÉQUIPE</th>
                <th style={th(36)}>J</th>
                <th style={th(36)}>G</th>
                <th style={th(36)}>N</th>
                <th style={th(36)}>P</th>
                <th style={th(40)}>BP</th>
                <th style={th(40)}>BC</th>
                <th style={th(44)}>+/-</th>
                <th style={{ ...th(48), color:'var(--ink)' }}>PTS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.team.code}
                  onClick={() => onOpenTeam && onOpenTeam(r.team.code)}
                  style={{ borderTop:'1px solid var(--line)', cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background='var(--paper-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                  <td style={{ textAlign:'center', padding:'14px 4px' }}>
                    <span style={{ display:'inline-block', width:24, height:24, borderRadius:6, background: posColor(i), border:'1.5px solid var(--ink)', fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:14, lineHeight:'22px' }}>{i+1}</span>
                  </td>
                  <td style={{ padding:'14px 18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Flag team={r.team} w={32} h={22}/>
                      <div>
                        <div className="display" style={{ fontSize:16 }}>{r.team.code}</div>
                        <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:2 }}>{r.team.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...td(), padding:'14px 4px' }}>{r.s.P}</td>
                  <td style={{ ...td(), padding:'14px 4px' }}>{r.s.W}</td>
                  <td style={{ ...td(), padding:'14px 4px' }}>{r.s.D}</td>
                  <td style={{ ...td(), padding:'14px 4px' }}>{r.s.L}</td>
                  <td style={{ ...td(), padding:'14px 4px' }}>{r.s.GF}</td>
                  <td style={{ ...td(), padding:'14px 4px' }}>{r.s.GA}</td>
                  <td style={{ ...td(), padding:'14px 4px', color: r.s.GD>0 ? PALETTE.lime : r.s.GD<0 ? PALETTE.red : 'var(--ink)' }}>
                    {r.s.GD>0 ? '+' : ''}{r.s.GD}
                  </td>
                  <td style={{ ...td(), padding:'14px 4px', fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:18 }}>{r.s.Pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', background:'var(--ink)', color:'var(--paper)' }}>
            <h3 className="display" style={{ fontSize:22, margin:0 }}>Matchs du groupe</h3>
            <div style={{ fontSize:11, opacity:0.7, fontWeight:600, marginTop:2 }}>{matches.length} rencontre{matches.length>1 ? 's' : ''}</div>
          </div>
          {matches.length === 0 ? (
            <div style={{ padding:'40px 24px', color:'var(--muted)', fontSize:13, textAlign:'center' }}>
              Pas de matchs disponibles pour ce groupe pour l&apos;instant.
            </div>
          ) : (
            <div>
              {matches.map((m, i) => {
                const h = teamByCode(m.home), a = teamByCode(m.away)
                const finished = m.status === 'finished'
                const si = STAGE_INFO[m.stage]
                return (
                  <div key={m.id} onClick={() => onOpenMatch && onOpenMatch(m.id)} style={{
                    padding:'14px 20px', borderBottom: i<matches.length-1 ? '1px solid var(--line)' : 'none',
                    cursor:'pointer', display:'grid', gridTemplateColumns:'68px 1fr auto', gap:14, alignItems:'center',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background='var(--paper-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                    <div style={{ paddingRight:8, borderRight:'1px solid var(--line)' }}>
                      <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>{si.short}</div>
                      <div className="mono" style={{ fontSize:12, fontWeight:700, marginTop:2 }}>{m.date.slice(-2)+'/'+m.date.slice(5,7)}</div>
                      <div className="mono" style={{ fontSize:11, color:'var(--muted)', fontWeight:600 }}>{m.time}</div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, opacity: finished && +m.score!.split('-')[0] < +m.score!.split('-')[1] ? 0.55 : 1 }}>
                        <Flag team={h} w={24} h={16}/>
                        <span className="display" style={{ fontSize:15 }}>{h.code}</span>
                        {finished && <span className="display mono" style={{ fontSize:16, marginLeft:'auto' }}>{m.score!.split('-')[0]}</span>}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, opacity: finished && +m.score!.split('-')[1] < +m.score!.split('-')[0] ? 0.55 : 1 }}>
                        <Flag team={a} w={24} h={16}/>
                        <span className="display" style={{ fontSize:15 }}>{a.code}</span>
                        {finished && <span className="display mono" style={{ fontSize:16, marginLeft:'auto' }}>{m.score!.split('-')[1]}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.06em' }}>{finished ? 'TERMINÉ' : '→'}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
