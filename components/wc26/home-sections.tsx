'use client'

// Additional home sections: Favorites + News
// Ported 1:1 from design/js/09-views-extra.jsx

import { useState, useEffect, useCallback } from 'react'
import { TEAMS, FAVORITES, NEWS } from './data'
import { Flag, ImagePlaceholder, PALETTE } from './ui-primitives'
import type { NewsItem } from '@/app/api/news/route'

/* eslint-disable @typescript-eslint/no-explicit-any */

const teamByCode = (c: string) => TEAMS.find(t => t.code===c)!

function NewsImg({ src, color, label, h, fallbackLabel }: { src: string | null; color: string; label?: string; fallbackLabel?: string; h: number | string }) {
  const [failed, setFailed] = useState(false)
  const onErr = useCallback(() => setFailed(true), [])
  if (src && !failed) {
    return <img src={src} alt={label ?? ''} onError={onErr} style={{ width:'100%', height:h, objectFit:'cover', display:'block' }}/>
  }
  return <ImagePlaceholder kind="news" color={color} label={fallbackLabel ?? label} h={h}/>
}

export function FavoritesSection({ onOpenTeam }: { onOpenTeam: (code: string) => void }) {
  const max = Math.max(...FAVORITES.map(f => f.community))
  return (
    <section style={{ borderTop:'1.5px solid var(--ink)', borderBottom:'1.5px solid var(--ink)', background: PALETTE.ink, color:'#FFFFFF' }}>
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px 32px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, gap:24 }}>
          <div>
            <span className="chip" style={{ background: PALETTE.lime, color:'var(--ink)' }}>★ FAVORIS DU TROPHÉE</span>
            <h2 className="display" style={{ fontSize:56, margin:'14px 0 8px', color:'#FFFFFF' }}>
              Qui soulève la <span style={{ color: PALETTE.lime }}>26</span> ?
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.65)', maxWidth:520, lineHeight:1.4 }}>
              Cotes officielles et choix de la communauté. La barre indique le % des pronostics communautaires.
            </p>
          </div>
          <div style={{ display:'flex', gap:18, fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.65)' }}>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10, height:10, background: PALETTE.lime, borderRadius:'50%' }}/> Choix communauté
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10, height:10, background: '#FFFFFF', borderRadius:'50%' }}/> Cote bookmaker
            </span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
          {FAVORITES.map((f, i) => {
            const team = teamByCode(f.code)
            const pct = (f.community / max) * 100
            const trendColor = f.trend==='up' ? PALETTE.lime : f.trend==='down' ? PALETTE.red : '#FFFFFF'
            const trendGlyph = f.trend==='up' ? '↑' : f.trend==='down' ? '↓' : '—'
            return (
              <div key={f.code} onClick={() => onOpenTeam(f.code)}
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:14, padding:18, cursor:'pointer', transition:'background .12s' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.06)')}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <span className="mono display" style={{ fontSize:24, color: i<3 ? PALETTE.lime : 'rgba(255,255,255,0.4)' }}>#{i+1}</span>
                  <Flag team={team} w={42} h={28}/>
                  <div>
                    <div className="display" style={{ fontSize:22, lineHeight:0.9 }}>{team.code}</div>
                    <div style={{ fontSize:10, opacity:0.6, fontWeight:600, marginTop:3 }}>{team.name.toUpperCase()}</div>
                  </div>
                  <span style={{ marginLeft:'auto', fontSize:14, fontWeight:800, color:trendColor }}>{trendGlyph}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
                  <span style={{ fontSize:10, fontWeight:700, opacity:0.6, letterSpacing:'0.06em' }}>COMMU.</span>
                  <span className="mono" style={{ fontSize:12, fontWeight:800, color: PALETTE.lime }}>{f.community}%</span>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.15)', borderRadius:3, overflow:'hidden', marginBottom:10 }}>
                  <div style={{ height:'100%', width: pct+'%', background: PALETTE.lime }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingTop:8, borderTop:'1px dashed rgba(255,255,255,0.15)' }}>
                  <span style={{ fontSize:10, fontWeight:700, opacity:0.6, letterSpacing:'0.06em' }}>COTE BOOK.</span>
                  <span className="mono display" style={{ fontSize:18 }}>{f.odds.toFixed(1)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function NewsSection() {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.ok ? r.json() : null)
      .then((d: { articles: NewsItem[] } | null) => {
        if (d?.articles?.length) setArticles(d.articles)
      })
      .catch(() => {/* silently fall back to mock */})
      .finally(() => setLoading(false))
  }, [])

  // Fall back to mock data while loading or if API returned nothing
  const mockFallback = NEWS.map((n, i) => ({
    id: String(i),
    title: n.title,
    excerpt: n.excerpt,
    link: '',
    pubDate: '',
    time: n.time,
    tag: n.tag,
    color: n.color,
    image: null,
  })) as NewsItem[]

  const items = (!loading && articles.length > 0) ? articles : mockFallback
  const [top, ...rest] = items

  return (
    <section style={{ maxWidth:1320, margin:'0 auto', padding:'56px 32px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <span className="chip" style={{ background:'var(--ink)', color: PALETTE.lime }}>● ACTU</span>
          <h2 className="display" style={{ fontSize:48, margin:'10px 0 0' }}>L&apos;actu football</h2>
        </div>
        {!loading && articles.length > 0 && (
          <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)', letterSpacing:'0.06em' }}>
            LIVE · RMC SPORT · SO FOOT · FOOT MERCATO · LE FIGARO
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }}>
          <div className="card" style={{ height:420, background:'var(--paper-2)', animation:'pulse 1.4s infinite' }}/>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="card" style={{ height:108, background:'var(--paper-2)', animation:'pulse 1.4s infinite' }}/>
            ))}
          </div>
        </div>
      ) : (
        <>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }}>
          {/* Article principal */}
          <a
            href={top.link || undefined}
            target={top.link ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="card"
            style={{ overflow:'hidden', cursor:'pointer', textDecoration:'none', color:'var(--ink)', display:'block' }}
          >
            <NewsImg src={top.image} color={top.color} fallbackLabel={'RSS · ' + top.tag} h={320}/>
            <div style={{ padding:24 }}>
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
                <span className="chip" style={{ background: top.color, color:'#FFFFFF' }}>{top.tag}</span>
                <span style={{ fontSize:11, fontWeight:700, color:'var(--muted)' }}>{top.time}</span>
              </div>
              <h3 className="display" style={{ fontSize:30, lineHeight:1.05, margin:'0 0 12px', textTransform:'none', letterSpacing:'-0.01em' }}>{top.title}</h3>
              <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.5, margin:0 }}>{top.excerpt}</p>
            </div>
          </a>

          {/* Articles secondaires */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {rest.slice(0,5).map((a) => (
              <a
                key={a.id}
                href={a.link || undefined}
                target={a.link ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="card"
                style={{
                  display:'grid', gridTemplateColumns:'120px 1fr', gap:0, overflow:'hidden',
                  transition:'transform .15s', minHeight:108, textDecoration:'none', color:'var(--ink)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform='translateX(3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform='translateX(0)')}>
                <div style={{ borderRight:'1.5px solid var(--ink)', overflow:'hidden' }}>
                  <NewsImg src={a.image} color={a.color} h="100%"/>
                </div>
                <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div>
                    <span className="chip" style={{ background: a.color, color:'#FFFFFF', fontSize:9, padding:'2px 8px' }}>{a.tag}</span>
                    <h4 style={{ fontSize:14, fontWeight:800, lineHeight:1.25, margin:'8px 0 0', textWrap:'pretty' }}>{a.title}</h4>
                  </div>
                  <div style={{ fontSize:10, fontWeight:600, color:'var(--muted)', marginTop:8 }}>{a.time}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Rangée supplémentaire : plus d'articles en grille 4 colonnes */}
        {rest.length > 5 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginTop:16 }}>
            {rest.slice(5, 13).map((a) => (
              <a
                key={a.id}
                href={a.link || undefined}
                target={a.link ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="card"
                style={{
                  display:'flex', flexDirection:'column', overflow:'hidden',
                  textDecoration:'none', color:'var(--ink)',
                  transition:'transform .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform='translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
                <div style={{ borderBottom:'1.5px solid var(--ink)', overflow:'hidden' }}>
                  <NewsImg src={a.image} color={a.color} h={160}/>
                </div>
                <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'space-between', flex:1 }}>
                  <div>
                    <span className="chip" style={{ background: a.color, color:'#FFFFFF', fontSize:9, padding:'2px 8px' }}>{a.tag}</span>
                    <h4 style={{ fontSize:14, fontWeight:800, lineHeight:1.25, margin:'10px 0 0', textWrap:'pretty' }}>{a.title}</h4>
                  </div>
                  <div style={{ fontSize:10, fontWeight:600, color:'var(--muted)', marginTop:10 }}>{a.time}</div>
                </div>
              </a>
            ))}
          </div>
        )}
        </>
      )}
    </section>
  )
}
