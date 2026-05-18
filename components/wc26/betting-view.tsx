'use client'

// BettingView — catégorie Paris sportifs.
// Cards partenaires avec liens d'affiliation cachés (via /affiliate/<slug>)
// + tableau des cotes 1/N/2 par match, agrégé depuis API-Football.

import { useEffect, useState } from 'react'
import { TEAMS } from './data'
import { Flag, PALETTE } from './ui-primitives'

/* eslint-disable @typescript-eslint/no-explicit-any */

type Partner = {
  slug: string
  name: string
  bg: string
  ink: string
  bonus: string
  tagline: string
}

const PARTNERS: Partner[] = [
  { slug:'betclic', name:'BETCLIC', bg:'#E60000', ink:'#FFFFFF', bonus:"JUSQU'À 100€ OFFERTS", tagline:"Le n°1 français du pari en ligne" },
  { slug:'winamax', name:'WINAMAX', bg:'#FFC500', ink:'#000000', bonus:"JUSQU'À 100€ OFFERTS", tagline:'Boostez vos cotes WC26' },
  { slug:'unibet',  name:'UNIBET',  bg:'#147B45', ink:'#FFFFFF', bonus:'100€ REMBOURSÉS',       tagline:'Cash-out instantané sur tous les matchs' },
  { slug:'pmu',     name:'PMU',     bg:'#0033FF', ink:'#FFFFFF', bonus:'150€ DE BIENVENUE',     tagline:'Multi+ et combiné boostés' },
]

type OddRow = {
  fixture_id: number
  home_code: string | null
  away_code: string | null
  home_name: string
  away_name: string
  kickoff: string
  bookmakers: Array<{ name: string; home: number | null; draw: number | null; away: number | null }>
}

const teamByCode = (c: string | null) => c ? TEAMS.find(t => t.code===c) : undefined

export function BettingView() {
  const [odds, setOdds] = useState<OddRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/odds')
      .then(r => r.ok ? r.json() : { odds: [] })
      .then((d: { odds: OddRow[] }) => { if (!cancelled) { setOdds(d.odds ?? []); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'32px 32px 64px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18, gap:24 }}>
        <div>
          <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>● PARIS SPORTIFS</span>
          <h1 className="display" style={{ fontSize:80, margin:'14px 0 0', lineHeight:0.9 }}>Pari WC26</h1>
          <p style={{ fontSize:14, color:'var(--muted)', marginTop:8, maxWidth:620, lineHeight:1.45 }}>
            Compare les cotes des bookmakers agréés ANJ et ouvre un compte directement chez le partenaire de ton choix.
            Tous les liens passent par nos partenariats officiels.
          </p>
        </div>
      </div>

      {/* Disclaimer ANJ — obligatoire en France */}
      <div style={{
        padding:'12px 18px', background:'var(--paper-2)', borderRadius:10,
        border:'1.5px solid var(--ink)', marginBottom:28,
        display:'flex', alignItems:'center', gap:14,
      }}>
        <span style={{ fontSize:24 }}>⚠️</span>
        <div style={{ fontSize:12, fontWeight:600, color:'var(--ink)', lineHeight:1.45 }}>
          <strong style={{ letterSpacing:'0.06em' }}>JOUER COMPORTE DES RISQUES : ENDETTEMENT, ISOLEMENT, DÉPENDANCE.</strong>{' '}
          Pour vous aider, appelez le 09 74 75 13 13 (appel non surtaxé). Interdit aux mineurs.
        </div>
      </div>

      {/* Cards partenaires */}
      <h2 className="display" style={{ fontSize:24, margin:'0 0 14px' }}>Nos partenaires</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14, marginBottom:48 }}>
        {PARTNERS.map(p => <PartnerCard key={p.slug} p={p}/>)}
      </div>

      {/* Cotes par match */}
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
        <h2 className="display" style={{ fontSize:24, margin:0 }}>Cotes des matchs</h2>
        <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>
          1X2 · Agrégé · MAJ toutes les 30 min
        </span>
      </div>

      {loading ? (
        <div className="card" style={{ padding:'40px 24px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>
          Chargement des cotes…
        </div>
      ) : odds.length === 0 ? (
        <div className="card" style={{ padding:'40px 24px', textAlign:'center', color:'var(--muted)', fontSize:13, lineHeight:1.6 }}>
          Aucune cote disponible pour l&apos;instant.<br/>
          API-Football n&apos;a pas encore les cotes WC26 — elles arrivent quelques jours avant le coup d&apos;envoi du tournoi.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {odds.map(row => <OddCard key={row.fixture_id} row={row}/>)}
        </div>
      )}

      {/* Disclaimer bottom */}
      <div style={{ marginTop:48, paddingTop:24, borderTop:'1px dashed var(--line)', fontSize:11, color:'var(--muted)', lineHeight:1.6 }}>
        WC26 HUB diffuse des contenus à caractère informatif sur les paris sportifs. Les liens « Créer mon compte »
        renvoient vers des opérateurs détenteurs d&apos;une licence ANJ. Réservé aux personnes majeures. Le jeu peut
        provoquer une dépendance. <a href="https://www.joueurs-info-service.fr/" target="_blank" rel="noreferrer noopener" style={{ color:'var(--ink)', fontWeight:700, textDecoration:'underline' }}>joueurs-info-service.fr</a>
      </div>
    </section>
  )
}

function PartnerCard({ p }: { p: Partner }) {
  return (
    <a
      href={`/affiliate/${p.slug}`}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="card"
      style={{
        padding:0, overflow:'hidden', display:'flex', flexDirection:'column',
        cursor:'pointer', textDecoration:'none', color:'var(--ink)',
        transition:'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)' }}>
      {/* Top brand band */}
      <div style={{
        padding:'24px 22px 22px', background: p.bg, color: p.ink,
        borderBottom:'1.5px solid var(--ink)',
      }}>
        <div className="display" style={{ fontSize:30, letterSpacing:'-0.02em', lineHeight:0.95 }}>{p.name}</div>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', opacity:0.85, marginTop:6 }}>{p.bonus}</div>
      </div>
      {/* Body */}
      <div style={{ padding:'18px 22px 22px', display:'flex', flexDirection:'column', gap:14, flex:1, justifyContent:'space-between' }}>
        <p style={{ fontSize:13, fontWeight:600, color:'var(--muted)', margin:0, lineHeight:1.4 }}>{p.tagline}</p>
        <div className="pill-btn solid" style={{ justifyContent:'center', padding:'12px 0', fontSize:12, letterSpacing:'0.04em', textTransform:'uppercase' }}>
          Créer mon compte →
        </div>
      </div>
    </a>
  )
}

function OddCard({ row }: { row: OddRow }) {
  const home = teamByCode(row.home_code)
  const away = teamByCode(row.away_code)
  const date = row.kickoff ? new Date(row.kickoff).toLocaleString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'

  return (
    <div className="card" style={{ padding:18 }}>
      {/* Match line */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14, paddingBottom:12, borderBottom:'1px dashed var(--line)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {home && <Flag team={home} w={28} h={18}/>}
          <span className="display" style={{ fontSize:18 }}>{row.home_code ?? row.home_name}</span>
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:'var(--muted)' }}>vs</span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="display" style={{ fontSize:18 }}>{row.away_code ?? row.away_name}</span>
          {away && <Flag team={away} w={28} h={18}/>}
        </div>
        <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>{date}</span>
      </div>
      {/* Bookmakers grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:10 }}>
        {row.bookmakers.map(bk => {
          const slug = bk.name.toLowerCase().replace(/\s+/g, '').replace('parionssport','fdj')
          return (
            <a
              key={bk.name}
              href={`/affiliate/${slug}`}
              target="_blank"
              rel="sponsored noopener noreferrer"
              style={{
                display:'block', padding:'10px 12px', border:'1.5px solid var(--ink)', borderRadius:10,
                textDecoration:'none', color:'var(--ink)', background:'var(--paper)',
                transition:'background .12s, transform .12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--paper-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--paper)' }}>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', marginBottom:6 }}>{bk.name.toUpperCase()}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontSize:12, fontWeight:800 }}>
                <span style={{ textAlign:'center' }}>{bk.home != null ? bk.home.toFixed(2) : '—'}</span>
                <span style={{ textAlign:'center', color:'var(--muted)' }}>{bk.draw != null ? bk.draw.toFixed(2) : '—'}</span>
                <span style={{ textAlign:'center' }}>{bk.away != null ? bk.away.toFixed(2) : '—'}</span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
