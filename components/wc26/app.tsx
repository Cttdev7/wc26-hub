'use client'

// Main app shell — WC26 HUB
// Ported 1:1 from design/js/14-app.jsx
// (TweaksPanel dev tool dropped — its CSS-var defaults are baked into globals.css)

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/db-types'
import { LogoMark, Marquee, PALETTE } from './ui-primitives'
import { HeroFeatured, UpcomingStrip, AnalysesGrid } from './main-views'
import { FavoritesSection, NewsSection } from './home-sections'
import { AuthView } from './auth-view'

// Heavy views — loaded on demand only when the user navigates to them
const TeamsView          = dynamic(() => import('./main-views').then(m => ({ default: m.TeamsView })))
const MatchView          = dynamic(() => import('./main-views').then(m => ({ default: m.MatchView })))
const PredictionsView    = dynamic(() => import('./main-views').then(m => ({ default: m.PredictionsView })))
const TeamDetailView     = dynamic(() => import('./team-detail').then(m => ({ default: m.TeamDetailView })))
const ProfileView        = dynamic(() => import('./team-detail').then(m => ({ default: m.ProfileView })))
const CalendarView       = dynamic(() => import('./calendar-view').then(m => ({ default: m.CalendarView })))
const GroupsView         = dynamic(() => import('./groups-view').then(m => ({ default: m.GroupsView })))
const LiveView           = dynamic(() => import('./live-view').then(m => ({ default: m.LiveView })))
const PredictionFormView = dynamic(() => import('./prediction-view').then(m => ({ default: m.PredictionFormView })))
const LeaderboardView    = dynamic(() => import('./leaderboard-view').then(m => ({ default: m.LeaderboardView })))
const BettingView        = dynamic(() => import('./betting-view').then(m => ({ default: m.BettingView })))

type View = 'home' | 'teams' | 'team' | 'match' | 'calendar' | 'groups' | 'live' | 'predictions' | 'profile' | 'auth' | 'prediction' | 'leaderboard' | 'betting'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [activeMatch, setActiveMatch] = useState('m2')
  const [activeTeam, setActiveTeam] = useState('FRA')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  // Track Supabase auth session + matching profile row on the client.
  useEffect(() => {
    const supabase = createClient()
    const loadProfile = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      setProfile(data ?? null)
    }
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) loadProfile(u.id); else setProfile(null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        loadProfile(u.id)
        setView(prev => prev === 'auth' ? 'home' : prev)
      } else {
        setProfile(null)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const openMatch = (id: string) => { setActiveMatch(id); setView('match'); window.scrollTo(0,0) }
  const openTeam  = (code: string) => { setActiveTeam(code); setView('team'); window.scrollTo(0,0) }
  const openPrediction = (id: string) => {
    setActiveMatch(id)
    setView(user ? 'prediction' : 'auth')
    window.scrollTo(0,0)
  }
  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setView('home'); window.scrollTo(0,0)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--paper)' }}>
      <TopBar view={view} setView={setView} user={user} profile={profile} onSignOut={signOut}/>
      <Marquee
        color={PALETTE.blue}
        items={[
          'Coupe du monde 2026 — 16 villes hôtes',
          'BRA vs FRA · 19 juin · Dallas',
          'POR vs ARG · 18 juin · Los Angeles',
          '14 820 pronostics communautaires cette semaine',
          'Nouveau : marchés "premier buteur" disponibles',
          '48 nations · 104 matchs · 1 trophée',
        ]}/>

      {view==='home' && (
        <>
          <HeroFeatured onOpenMatch={openMatch}/>
          <UpcomingStrip onOpenMatch={openMatch}/>
          <FavoritesSection onOpenTeam={openTeam}/>
          <NewsSection/>
          <AnalysesGrid/>
          <CommunityCallout onJoin={() => setView(user ? 'predictions' : 'auth')}/>

        </>
      )}
      {view==='teams' && <TeamsView onOpenTeam={openTeam}/>}
      {view==='team' && <TeamDetailView teamCode={activeTeam} onBack={() => setView('teams')} onOpenMatch={openMatch}/>}
      {view==='match' && <MatchView matchId={activeMatch} onBack={() => setView('home')} onOpenTeam={openTeam}/>}
      {view==='calendar' && <CalendarView onOpenMatch={openMatch}/>}
      {view==='groups' && <GroupsView onOpenTeam={openTeam} onOpenMatch={openMatch}/>}
      {view==='live' && <LiveView onOpenTeam={openTeam}/>}
      {view==='predictions' && <PredictionsView onOpenMatch={openPrediction} onOpenLeaderboard={() => { setView('leaderboard'); window.scrollTo(0,0) }} profile={profile}/>}
      {view==='prediction' && <PredictionFormView matchId={activeMatch} onBack={() => setView('predictions')} user={user}/>}
      {view==='leaderboard' && <LeaderboardView onBack={() => setView('predictions')}/>}
      {view==='betting' && <BettingView/>}
      {view==='profile' && <ProfileView profile={profile} user={user}/>}
      {view==='auth' && <AuthView onBack={() => setView('home')}/>}

      <Footer/>
    </div>
  )
}

function TopBar({ view, setView, user, profile, onSignOut }: {
  view: View; setView: (v: View) => void;
  user: User | null; profile: Profile | null; onSignOut: () => void;
}) {
  const items: Array<[View, string, boolean?]> = [
    ['home', 'Accueil'],
    ['live', 'En direct', true],
    ['calendar', 'Calendrier'],
    ['groups', 'Groupes'],
    ['teams', 'Équipes'],
    ['predictions', 'Pronostics'],
    ['betting', 'Paris'],
  ]
  return (
    <header style={{
      borderBottom:'1.5px solid var(--ink)', background:'var(--paper)',
      position:'sticky', top:0, zIndex:50, backdropFilter:'blur(8px)',
    }}>
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'14px 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div onClick={() => setView('home')} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
          <LogoMark size={40}/>
          <div>
            <div className="display" style={{ fontSize:20, lineHeight:0.9 }}>WC26 HUB</div>
            <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', letterSpacing:'0.12em', marginTop:2 }}>STATS · ANALYSES · COMMUNAUTÉ</div>
          </div>
        </div>

        <nav style={{ display:'flex', gap:6 }}>
          {items.map(([k, lbl, live]) => (
            <button key={k} onClick={() => setView(k)} style={{
              padding:'9px 14px', borderRadius:999, border:'1.5px solid transparent',
              background: view===k ? 'var(--ink)' : 'transparent',
              color: view===k ? 'var(--paper)' : 'var(--ink)',
              fontWeight:700, fontSize:12.5, whiteSpace:'nowrap',
              transition:'all .12s',
              display:'inline-flex', alignItems:'center', gap:6,
            }}>
              {live && (
                <span style={{ position:'relative', width:8, height:8 }}>
                  <span style={{ position:'absolute', inset:0, borderRadius:'50%', background: PALETTE.red, animation:'pulse 1.4s infinite' }}/>
                  <span style={{ position:'absolute', inset:2, borderRadius:'50%', background: PALETTE.red }}/>
                </span>
              )}
              {lbl}
            </button>
          ))}
        </nav>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {user ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:'1.5px solid var(--ink)', borderRadius:999, whiteSpace:'nowrap' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background: PALETTE.lime, border:'1px solid var(--ink)' }}/>
                <span className="mono" style={{ fontSize:11, fontWeight:700 }}>
                  {profile ? `${profile.total_points.toLocaleString('fr-FR')} pts` : '— pts'}
                </span>
              </div>
              <button onClick={() => setView('profile')} className="pill-btn solid" style={{ padding:'8px 14px', fontSize:11.5, whiteSpace:'nowrap' }}>
                <span style={{ width:16, height:16, borderRadius:'50%', background: PALETTE.magenta, border:'1.5px solid var(--paper)' }}/>
                Profil
              </button>
              <button onClick={onSignOut} aria-label="Déconnexion" title="Déconnexion" style={{
                padding:'8px 12px', borderRadius:999, border:'1.5px solid var(--line)',
                background:'var(--paper)', color:'var(--muted)', fontSize:11, fontWeight:700,
                cursor:'pointer', whiteSpace:'nowrap',
              }}>↪</button>
            </>
          ) : (
            <button onClick={() => setView('auth')} className="pill-btn solid" style={{ padding:'8px 16px', fontSize:11.5, whiteSpace:'nowrap' }}>
              Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function CommunityCallout({ onJoin }: { onJoin: () => void }) {
  return (
    <section style={{ background: PALETTE.ink, color:'#FFFFFF', borderTop:'1.5px solid var(--ink)' }}>
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'72px 32px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'center' }}>
        <div>
          <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>★ JEU COMMUNAUTAIRE</span>
          <h2 className="display" style={{ fontSize:84, margin:'18px 0 18px', color:'#FFFFFF' }}>
            Tu crois savoir<br/>
            <span style={{ color: PALETTE.lime }}>qui va gagner ?</span>
          </h2>
          <p style={{ fontSize:17, lineHeight:1.45, opacity:0.85, maxWidth:520 }}>
            1 000 points à l&apos;inscription. Pronostique chaque match, débloque des badges,
            grimpe au classement. Pas un centime en jeu — juste du flex et de la fierté.
          </p>
          <div style={{ display:'flex', gap:12, marginTop:24 }}>
            <button onClick={onJoin} className="pill-btn" style={{ background: PALETTE.lime, color:'var(--ink)', borderColor: PALETTE.lime, fontSize:14, padding:'14px 22px' }}>
              Rejoindre la ligue →
            </button>
            <button className="pill-btn" style={{ background:'transparent', color:'#FFFFFF', borderColor:'#FFFFFF', fontSize:14, padding:'14px 22px' }}>
              Comment ça marche
            </button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <BigKpi color={PALETTE.lime}    label="Joueurs actifs"   value="48 200"/>
          <BigKpi color={PALETTE.magenta} label="Pronostics posés" value="312k"/>
          <BigKpi color={PALETTE.blue}    label="Précision moy."   value="58.4%"/>
          <BigKpi color={PALETTE.red}     label="Points distribués" value="9.4M"/>
        </div>
      </div>
    </section>
  )
}

function BigKpi({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ padding:'22px 22px 18px', background:'#FFFFFF', borderRadius:14, color:'var(--ink)' }}>
      <div style={{ width:32, height:6, background: color, borderRadius:3, marginBottom:14 }}/>
      <div className="display mono" style={{ fontSize:42, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'var(--muted)', textTransform:'uppercase', marginTop:8 }}>{label}</div>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop:'1.5px solid var(--ink)', background:'var(--paper)' }}>
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'48px 32px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:32, marginBottom:32 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <LogoMark size={40}/>
              <span className="display" style={{ fontSize:22 }}>WC26 HUB</span>
            </div>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.5, maxWidth:380 }}>
              Plateforme indépendante de stats, analyses et pronostics communautaires pour la Coupe du Monde 2026. Pas affiliée aux organisateurs.
            </p>
          </div>
          {([
            ['Tournoi', ['Calendrier','48 nations','Stades','Diffusion']],
            ['Communauté', ['Classement','Ligues privées','Badges','Règles du jeu']],
            ['Plus', ['Newsletter','Mentions','Confidentialité','Contact']],
          ] as Array<[string, string[]]>).map(([t, ls]) => (
            <div key={t}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.1em', color:'var(--ink)', textTransform:'uppercase', marginBottom:14 }}>{t}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {ls.map(l => <a key={l} style={{ fontSize:13, color:'var(--muted)', fontWeight:600 }}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:24, borderTop:'1px solid var(--line)', fontSize:11, color:'var(--muted)', fontWeight:600 }}>
          <span>© 2026 WC26 HUB · Prototype design</span>
          <span className="mono">v0.1 · 17 mai 2026</span>
        </div>
      </div>
    </footer>
  )
}
