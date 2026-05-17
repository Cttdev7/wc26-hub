'use client'

// Team Detail View + Profile View
// Ported 1:1 from design/js/10-team-detail.jsx

import { TEAMS, SQUADS, TEAM_STATS, MATCHES, PROFILE } from './data'
import { Flag, FormDots, ImagePlaceholder, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

export function TeamDetailView({
  teamCode, onBack, onOpenMatch,
}: { teamCode: string; onBack: () => void; onOpenMatch: (id: string) => void }) {
  const team = teamByCode(teamCode)
  const squad = SQUADS[teamCode]
  const stats = TEAM_STATS[teamCode]
  if (!team || !squad) return null

  const matches = MATCHES.filter(m => m.home===teamCode || m.away===teamCode)

  const positions = ['GK', 'DEF', 'MID', 'FWD']
  const grouped = positions.map(p => ({
    pos:p,
    label: ({GK:'Gardiens', DEF:'Défenseurs', MID:'Milieux', FWD:'Attaquants'} as Record<string,string>)[p],
    players: squad.players.filter((pl: any) => pl.pos===p),
  }))

  return (
    <section style={{ background:'var(--paper)' }}>
      <div style={{
        borderBottom:'1.5px solid var(--ink)',
        background:`linear-gradient(180deg, ${team.color}15 0%, var(--paper) 100%)`,
      }}>
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'24px 32px 36px' }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:12, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', padding:0, marginBottom:18 }}>← Toutes les équipes</button>

          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:32 }}>
            <Flag team={team} w={180} h={120}/>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>
                Groupe {team.group} · FIFA #{team.rank}
              </div>
              <h1 className="display" style={{ fontSize:96, margin:'0 0 6px', lineHeight:0.9 }}>{team.name}</h1>
              <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:13, color:'var(--muted)', fontWeight:600 }}>
                <span>Sélectionneur · <b style={{ color:'var(--ink)' }}>{squad.coach}</b></span>
                <span>·</span>
                <span>Capitaine · <b style={{ color:'var(--ink)' }}>{squad.captain}</b></span>
                <span>·</span>
                <span>Système · <b style={{ color:'var(--ink)' }}>{squad.formation}</b></span>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
              <span style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.1em' }}>FORME · 5 DERNIERS</span>
              <FormDots form={team.form} size={22}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px', display:'grid', gridTemplateColumns:'1fr 360px', gap:24 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <ImagePlaceholder kind="locker" color={team.color}
              label={'AMBIANCE ' + squad.mood} h={120}/>
            <div style={{ padding:22 }}>
              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
                <h3 className="display" style={{ fontSize:24, margin:0 }}>Atmosphère du groupe</h3>
                <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>{squad.mood}</span>
              </div>
              <p style={{ fontSize:14, color:'var(--ink)', lineHeight:1.5, margin:'0 0 14px' }}>{squad.moodLabel}</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ flex:1, height:10, background:'var(--paper-2)', borderRadius:5, overflow:'hidden', border:'1px solid var(--line)' }}>
                  <div style={{ height:'100%', width: squad.moodScore + '%', background: squad.moodScore>=75 ? PALETTE.lime : squad.moodScore>=50 ? '#FFD400' : PALETTE.red }}/>
                </div>
                <span className="mono display" style={{ fontSize:24 }}>{squad.moodScore}<span style={{ fontSize:12, color:'var(--muted)' }}>/100</span></span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
              <h3 className="display" style={{ fontSize:24, margin:0 }}>Effectif &amp; forme du moment</h3>
              <span style={{ fontSize:11, color:'var(--muted)', fontWeight:700, letterSpacing:'0.06em' }}>FORME · 0-100 SUR LES 5 DERNIERS MATCHS CLUB</span>
            </div>
            {squad.players.length === 0 ? (
              <div style={{ padding:'40px 0', textAlign:'center', color:'var(--muted)', fontSize:13 }}>
                Liste détaillée bientôt disponible
              </div>
            ) : (
              <div style={{ display:'grid', gap:18 }}>
                {grouped.filter(g => g.players.length>0).map(g => (
                  <div key={g.pos}>
                    <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.12em', marginBottom:8 }}>{g.label.toUpperCase()} · {g.players.length}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:8 }}>
                      {g.players.map((p: any, i: number) => (
                        <div key={i} style={{
                          padding:'10px 12px', border:'1px solid var(--line)', borderRadius:10,
                          display:'grid', gridTemplateColumns:'24px 1fr 60px', alignItems:'center', gap:10,
                          background: p.captain ? `${team.color}10` : 'var(--paper)',
                        }}>
                          <span className="display mono" style={{ fontSize:14, color: 'var(--ink)' }}>{p.num}</span>
                          <div>
                            <div style={{ fontSize:12, fontWeight:800, display:'flex', alignItems:'center', gap:6 }}>
                              {p.name}
                              {p.captain && <span style={{ fontSize:9, padding:'1px 5px', background:'var(--ink)', color:'var(--paper)', borderRadius:3, fontWeight:800 }}>C</span>}
                            </div>
                            <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:1 }}>{p.club} · {p.age} ans</div>
                          </div>
                          <FormBar value={p.form}/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {stats && (
            <div className="card" style={{ padding:24 }}>
              <h3 className="display" style={{ fontSize:24, margin:'0 0 18px' }}>Stats de la sélection</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
                {([
                  ['Possession', stats.possession + '%', PALETTE.blue],
                  ['xG / match', stats.xg.toFixed(2), PALETTE.lime],
                  ['Tirs cadrés', stats.sot.toFixed(1), PALETTE.purple],
                  ['xGA / match', stats.xga.toFixed(2), PALETTE.red],
                ] as Array<[string, string, string]>).map(([lbl, v, c], i) => (
                  <div key={i} style={{ padding:14, background:'var(--paper-2)', borderRadius:10, borderTop:`4px solid ${c}` }}>
                    <div style={{ fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em' }}>{lbl.toUpperCase()}</div>
                    <div className="display mono" style={{ fontSize:26, marginTop:4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {squad.news.length > 0 && (
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
                <h3 className="display" style={{ fontSize:24, margin:0 }}>News {team.code}</h3>
                <a style={{ fontSize:11, color:'var(--muted)', fontWeight:800, letterSpacing:'0.06em' }}>TOUT →</a>
              </div>
              <div style={{ display:'flex', flexDirection:'column' }}>
                {squad.news.map((n: any, i: number) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:14, alignItems:'center', padding:'14px 0', borderBottom: i<squad.news.length-1 ? '1px dashed var(--line)' : 'none', cursor:'pointer' }}>
                    <span className="chip" style={{ background:'var(--ink)', color:'var(--paper)', fontSize:9, padding:'3px 8px', justifySelf:'start' }}>{n.tag}</span>
                    <span style={{ fontSize:13, fontWeight:700, textWrap:'pretty' }}>{n.title}</span>
                    <span style={{ fontSize:10, color:'var(--muted)', fontWeight:600 }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card" style={{ padding:20, borderColor: PALETTE.red, borderWidth:'1.5px', borderStyle:'solid' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12 }}>
              <h3 style={{ fontSize:13, fontWeight:900, margin:0, letterSpacing:'0.08em', textTransform:'uppercase', color: PALETTE.red }}>⊕ Infirmerie</h3>
              <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)' }}>{squad.injured.length} joueur(s)</span>
            </div>
            {squad.injured.length === 0 ? (
              <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Aucune blessure déclarée — staff serein.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {squad.injured.map((p: any, i: number) => (
                  <div key={i} style={{ padding:12, background:'var(--paper-2)', borderRadius:8, borderLeft: '4px solid ' + (p.severity==='high' ? PALETTE.red : '#FFD400') }}>
                    <div style={{ fontSize:13, fontWeight:800 }}>{p.name}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:11, color:'var(--muted)', fontWeight:600 }}>
                      <span>{p.issue}</span>
                      <span>retour · {p.return}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontSize:13, fontWeight:900, margin:'0 0 12px', letterSpacing:'0.08em', textTransform:'uppercase' }}>⊟ Suspensions</h3>
            {squad.suspended.length === 0 ? (
              <p style={{ fontSize:13, color:'var(--muted)', margin:0 }}>Aucun joueur suspendu.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {squad.suspended.map((p: any, i: number) => (
                  <div key={i} style={{ padding:10, background:'#FFD40020', borderRadius:8, borderLeft:`4px solid #FFD400` }}>
                    <div style={{ fontSize:13, fontWeight:800 }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:2, fontWeight:600 }}>{p.reason} · manque {p.miss}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', background:'var(--ink)', color:'var(--paper)' }}>
              <h3 className="display" style={{ fontSize:18, margin:0 }}>Agenda</h3>
              <div style={{ fontSize:11, opacity:0.7, fontWeight:600, marginTop:2 }}>Matchs &amp; événements à venir</div>
            </div>
            {squad.upcomingEvents.length === 0 ? (
              <p style={{ padding:20, fontSize:13, color:'var(--muted)', margin:0 }}>Aucun événement programmé.</p>
            ) : (
              <div>
                {squad.upcomingEvents.map((e: any, i: number) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 1fr', gap:14, padding:'12px 18px', borderBottom: i<squad.upcomingEvents.length-1 ? '1px solid var(--line)' : 'none', alignItems:'center' }}>
                    <div style={{ textAlign:'center', padding:'4px 0', background:'var(--paper-2)', borderRadius:6 }}>
                      <div className="display mono" style={{ fontSize:14, color: team.color }}>{e.date.split(' ')[0]}</div>
                      <div style={{ fontSize:9, fontWeight:800, color:'var(--muted)' }}>{e.date.split(' ')[1]}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:800 }}>{e.label}</div>
                      <div style={{ fontSize:10, color:'var(--muted)', fontWeight:600, marginTop:2 }}>{e.place}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {matches.length > 0 && (
            <div className="card" style={{ padding:20 }}>
              <h3 style={{ fontSize:13, fontWeight:900, margin:'0 0 12px', letterSpacing:'0.08em', textTransform:'uppercase' }}>⊙ Parier sur {team.code}</h3>
              {matches.map(m => {
                const opp = teamByCode(m.home===teamCode ? m.away : m.home)
                const home = teamCode===m.home
                return (
                  <button key={m.id} onClick={() => onOpenMatch(m.id)} style={{
                    width:'100%', background:'var(--paper-2)', border:'1px solid var(--line)',
                    borderRadius:8, padding:10, marginBottom:8, textAlign:'left', cursor:'pointer',
                    display:'grid', gridTemplateColumns:'1fr auto', gap:10, alignItems:'center',
                  }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:800 }}>{home ? '🏠' : '✈️'} vs {opp.code}</div>
                      <div style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{m.date} · {m.time}</div>
                    </div>
                    <span className="mono" style={{ fontSize:13, fontWeight:800, color: PALETTE.blue }}>{(home ? m.odds.home : m.odds.away).toFixed(2)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function FormBar({ value }: { value: number }) {
  const color = value >= 85 ? PALETTE.lime : value >= 70 ? PALETTE.blue : value >= 55 ? '#FFD400' : PALETTE.red
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ flex:1, height:5, background:'var(--paper-2)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width: value+'%', background: color }}/>
      </div>
      <span className="mono" style={{ fontSize:10, fontWeight:800, minWidth:18, textAlign:'right' }}>{value}</span>
    </div>
  )
}

export function ProfileView() {
  const p = PROFILE
  const team = teamByCode(p.country)
  const winRate = Math.round((p.won / (p.bets - p.pending)) * 100)
  const lost = p.bets - p.won - p.pending

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>
      <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:16, background:'var(--ink)', color:'var(--paper)' }}>
        <div style={{ padding:'32px 32px 28px', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:28, alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <div style={{
              width:120, height:120, borderRadius:'50%',
              background: `conic-gradient(${PALETTE.lime}, ${PALETTE.magenta}, ${PALETTE.blue}, ${PALETTE.lime})`,
              padding:4, position:'relative',
            }}>
              <div style={{
                width:'100%', height:'100%', borderRadius:'50%',
                background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:42, color:'var(--ink)',
              }}>{p.name.split(' ')[0][0]}{p.name.split(' ')[1]?.[0] || ''}</div>
            </div>
            <div style={{ position:'absolute', bottom:-4, right:-4, background:'var(--paper)', borderRadius:'50%', padding:3, border:'2px solid var(--ink)' }}>
              <Flag team={team} w={28} h={20} square/>
            </div>
          </div>
          <div>
            <div className="display" style={{ fontSize:56, lineHeight:0.9 }}>{p.name}</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginTop:6, fontWeight:600 }}>{p.handle} · membre depuis {p.joined}</div>
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>🔥 Série {p.streak}</span>
              <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color:'var(--paper)' }}>★ Top {Math.round((p.rank/p.rankTotal)*100*10)/10}%</span>
              <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color:'var(--paper)' }}>🎯 {p.accuracy}% précision</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <button className="pill-btn" style={{ background:'var(--paper)', color:'var(--ink)', border:'1.5px solid var(--paper)' }}>✎ Éditer le profil</button>
            <button className="pill-btn" style={{ background:'transparent', color:'var(--paper)', border:'1.5px solid rgba(255,255,255,0.3)' }}>+ Partager</button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', borderTop:'1px solid rgba(255,255,255,0.15)' }}>
          {([
            ['Points', p.points.toLocaleString('fr-FR'), PALETTE.lime],
            ['Classement', '#' + p.rank.toLocaleString('fr-FR'), PALETTE.blue],
            ['Cette semaine', '#' + p.weeklyRank, PALETTE.magenta],
            ['Précision', p.accuracy + '%', PALETTE.purple],
            ['Plus longue série', String(p.longestStreak), PALETTE.red],
          ] as Array<[string, string, string]>).map(([lbl, v, c], i) => (
            <div key={i} style={{ padding:'18px 24px', borderRight: i<4 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.55)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{lbl}</div>
              <div className="display mono" style={{ fontSize:30, marginTop:6, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <h3 className="display" style={{ fontSize:24, margin:0 }}>Évolution des points</h3>
            <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>9 DERNIERS JOURS</span>
          </div>
          <PointsChart data={p.pointsHistory}/>
        </div>

        <div className="card" style={{ padding:24 }}>
          <h3 className="display" style={{ fontSize:24, margin:'0 0 18px' }}>Bilan des paris</h3>
          <div style={{ display:'flex', gap:24, alignItems:'center' }}>
            <Donut won={p.won} lost={lost} pending={p.pending}/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
              <LegendRow color={PALETTE.lime} label="Gagnés" value={p.won}/>
              <LegendRow color={PALETTE.red}  label="Perdus" value={lost}/>
              <LegendRow color="#E8E4DE"      label="En attente" value={p.pending} muted/>
              <div style={{ paddingTop:12, marginTop:6, borderTop:'1px dashed var(--line)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:800 }}>
                  <span>Win rate</span>
                  <span className="mono">{winRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding:24, marginTop:16 }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
          <h3 className="display" style={{ fontSize:24, margin:0 }}>Badges</h3>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)' }}>{p.badges.filter(b => b.unlocked).length} / {p.badges.length} débloqués</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12 }}>
          {p.badges.map(b => (
            <div key={b.id} style={{
              padding:'20px 12px', borderRadius:12, textAlign:'center',
              background: b.unlocked ? b.color : 'var(--paper-2)',
              border: '1.5px solid ' + (b.unlocked ? 'var(--ink)' : 'var(--line)'),
              opacity: b.unlocked ? 1 : 0.5,
            }}>
              <div style={{ fontSize:36, marginBottom:6, filter: b.unlocked ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
              <div style={{
                fontSize:11, fontWeight:800,
                color: b.unlocked
                  ? (b.color === PALETTE.lime ? 'var(--ink)' : '#FFFFFF')
                  : 'var(--muted)',
                letterSpacing:'0.02em',
              }}>{b.label}</div>
              {!b.unlocked && <div style={{ fontSize:9, color:'var(--muted)', marginTop:4, fontWeight:700, letterSpacing:'0.06em' }}>VERROUILLÉ</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding:0, marginTop:16, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1.5px solid var(--ink)', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <h3 className="display" style={{ fontSize:24, margin:0 }}>Pronostics récents</h3>
          <a style={{ fontSize:11, color:'var(--muted)', fontWeight:800, letterSpacing:'0.06em' }}>HISTORIQUE COMPLET →</a>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--paper-2)' }}>
              {['MATCH','PRONOSTIC','COTE','MISE','RÉSULTAT','GAIN'].map((h, i) => (
                <th key={i} style={{ padding:'10px 18px', fontSize:10, fontWeight:800, color:'var(--muted)', letterSpacing:'0.08em', textAlign: i>=2 ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.recentBets.map((b, i) => {
              const color = b.status==='won' ? PALETTE.lime : b.status==='lost' ? PALETTE.red : '#E8E4DE'
              const lbl   = b.status==='won' ? 'GAGNÉ' : b.status==='lost' ? 'PERDU' : 'EN ATTENTE'
              return (
                <tr key={i} style={{ borderTop:'1px solid var(--line)' }}>
                  <td style={{ padding:'14px 18px', fontWeight:800, fontSize:13 }}>{b.match}</td>
                  <td style={{ padding:'14px 18px', fontSize:12, fontWeight:700 }}>{b.pick}</td>
                  <td style={{ padding:'14px 18px', textAlign:'right', fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontSize:12, fontWeight:700 }}>{b.odds.toFixed(2)}</td>
                  <td style={{ padding:'14px 18px', textAlign:'right', fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontSize:12, fontWeight:700 }}>{b.stake}</td>
                  <td style={{ padding:'14px 18px', textAlign:'right' }}>
                    <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.06em', padding:'3px 10px', borderRadius:99, background: color, color: 'var(--ink)' }}>{lbl}</span>
                  </td>
                  <td style={{ padding:'14px 18px', textAlign:'right', fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontSize:13, fontWeight:800, color: b.status==='won' ? PALETTE.lime : b.status==='lost' ? 'var(--muted)' : 'var(--ink)' }}>
                    {b.status==='won' ? '+'+b.payout : b.status==='lost' ? '—' : b.payout+'?'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function PointsChart({ data }: { data: number[] }) {
  const max = Math.max(...data) * 1.05
  const min = Math.min(...data) * 0.95
  const range = max - min || 1
  const W = 480, H = 160
  const stepX = W / (data.length - 1)
  const points = data.map((v, i) => [i*stepX, H - ((v-min)/range)*H])
  const path = points.map((p, i) => (i===0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ')
  const area = path + ` L ${W} ${H} L 0 ${H} Z`
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:160 }}>
        <defs>
          <linearGradient id="pchart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor={PALETTE.lime} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={PALETTE.lime} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#pchart)"/>
        <path d={path} fill="none" stroke={PALETTE.ink} strokeWidth="2.5"/>
        {points.map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={i===points.length-1 ? PALETTE.lime : '#FFF'} stroke={PALETTE.ink} strokeWidth="1.8"/>
        ))}
      </svg>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--muted)', fontWeight:700, marginTop:4 }}>
        <span>J-9</span><span>aujourd&apos;hui</span>
      </div>
    </div>
  )
}

function Donut({ won, lost, pending }: { won: number; lost: number; pending: number }) {
  const total = won + lost + pending
  const r = 56, cx = 70, cy = 70
  const C = 2 * Math.PI * r
  const wonLen = (won/total)*C
  const lostLen = (lost/total)*C
  const pendLen = (pending/total)*C
  return (
    <svg viewBox="0 0 140 140" style={{ width:140, height:140 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--paper-2)" strokeWidth="18"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={PALETTE.lime} strokeWidth="18"
        strokeDasharray={`${wonLen} ${C}`} strokeDashoffset="0"
        transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={PALETTE.red} strokeWidth="18"
        strokeDasharray={`${lostLen} ${C}`} strokeDashoffset={-wonLen}
        transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E4DE" strokeWidth="18"
        strokeDasharray={`${pendLen} ${C}`} strokeDashoffset={-(wonLen+lostLen)}
        transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"/>
      <text x={cx} y={cy-4} textAnchor="middle" style={{ fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:24, fill:'var(--ink)' }}>{won}</text>
      <text x={cx} y={cy+14} textAnchor="middle" style={{ fontSize:9, fontWeight:800, fill:'var(--muted)', letterSpacing:'0.08em' }}>GAGNÉS / {total}</text>
    </svg>
  )
}

function LegendRow({ color, label, value, muted }: { color: string; label: string; value: number; muted?: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ width:12, height:12, background:color, borderRadius:3, border:'1px solid var(--ink)' }}/>
      <span style={{ flex:1, fontSize:12, fontWeight:700, color: muted ? 'var(--muted)' : 'var(--ink)' }}>{label}</span>
      <span className="mono" style={{ fontSize:13, fontWeight:800 }}>{value}</span>
    </div>
  )
}
