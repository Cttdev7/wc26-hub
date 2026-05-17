'use client'

// Shared UI primitives for WC26 HUB
// Ported 1:1 from design/js/07-ui-primitives.jsx + ImagePlaceholder from 09-views-extra.jsx

import { useId, type ReactNode } from 'react'
import { FlagSVG } from './flags'

/* eslint-disable @typescript-eslint/no-explicit-any */

export const PALETTE = {
  red:    '#E10600',
  purple: '#6B2FB5',
  lime:   '#C8FF00',
  blue:   '#0033FF',
  magenta:'#FF0080',
  orange: '#FF6E00',
  yellow: '#FFD400',
  ink:    '#0A0A0A',
}

export function Flag({ team, w = 44, h = 30, square = false }: any) {
  if (!team) return null
  const flag = FlagSVG({ code: team.code, w: square ? h : w, h, radius: 6 })
  if (flag) return flag
  return (
    <div style={{
      width: square ? h : w, height: h, borderRadius: 6, overflow:'hidden',
      display:'flex', flexShrink:0, border:'1px solid rgba(10,10,10,.12)',
    }}>
      {(team.flag || ['#999','#666']).map((c: string, i: number) => (
        <div key={i} style={{ flex:1, background: c }} />
      ))}
    </div>
  )
}

export function TeamBadge({ team, size = 'md', reverse = false, onClick }: any) {
  const flagW = size==='lg' ? 56 : size==='sm' ? 34 : 44
  const flagH = size==='lg' ? 38 : size==='sm' ? 22 : 30
  const codeFs= size==='lg' ? 28 : size==='sm' ? 14 : 18
  const nameFs= size==='lg' ? 13 : 11
  return (
    <div
      onClick={onClick}
      style={{
        display:'flex', alignItems:'center', gap: size==='lg' ? 14 : 10,
        flexDirection: reverse ? 'row-reverse' : 'row',
        cursor: onClick ? 'pointer' : 'default',
      }}>
      <Flag team={team} w={flagW} h={flagH} />
      <div style={{ display:'flex', flexDirection:'column', alignItems: reverse ? 'flex-end' : 'flex-start' }}>
        <span className="display" style={{ fontSize: codeFs, lineHeight:0.9 }}>{team.code}</span>
        <span style={{ fontSize: nameFs, color:'var(--muted)', fontWeight:600, marginTop:2 }}>{team.name}</span>
      </div>
    </div>
  )
}

export function StatRow({ label, left, right, leftColor='#0033FF', rightColor='#C8FF00', max }: any) {
  const total = max || Math.max(left, right) * 1.15
  const lw = (left / total) * 100
  const rw = (right / total) * 100
  return (
    <div style={{ display:'grid', gridTemplateColumns:'52px 1fr auto 1fr 52px', alignItems:'center', columnGap:14, padding:'10px 0' }}>
      <span className="mono" style={{ fontSize:15, fontWeight:600, color:'var(--ink)' }}>{left}</span>
      <div style={{ position:'relative', height:8, background:'var(--paper-2)', borderRadius:4, overflow:'hidden', direction:'rtl' }}>
        <div style={{ height:'100%', width:lw+'%', background:leftColor, borderRadius:4 }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--muted)', whiteSpace:'nowrap', padding:'0 8px' }}>{label}</span>
      <div style={{ position:'relative', height:8, background:'var(--paper-2)', borderRadius:4, overflow:'hidden' }}>
        <div style={{ height:'100%', width:rw+'%', background:rightColor, borderRadius:4 }} />
      </div>
      <span className="mono" style={{ fontSize:15, fontWeight:600, textAlign:'right', color:'var(--ink)' }}>{right}</span>
    </div>
  )
}

export function FormDots({ form, size = 14 }: { form: string[]; size?: number }) {
  const colorOf = (r: string) => r==='W' ? PALETTE.lime : r==='D' ? '#E8E4DE' : PALETTE.red
  return (
    <div style={{ display:'flex', gap:4 }}>
      {form.map((r, i) => (
        <div key={i} title={r} style={{
          width:size, height:size, borderRadius:'50%', background: colorOf(r),
          border: r==='D' ? '1px solid var(--line)' : 'none',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 8, fontWeight: 900, color: r==='L' ? '#FFFFFF' : 'var(--ink)',
        }}>{r}</div>
      ))}
    </div>
  )
}

export function Marquee({ items, color = '#0033FF' }: { items: string[]; color?: string }) {
  const content = (
    <>{items.map((it, i) => (
      <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:16 }}>
        <span className="display" style={{ fontSize:14, color }}>★</span>
        <span style={{ fontWeight: 700, fontSize: 13, letterSpacing:'0.02em' }}>{it}</span>
      </span>
    ))}</>
  )
  return (
    <div style={{ overflow:'hidden', borderTop:'1.5px solid var(--ink)', borderBottom:'1.5px solid var(--ink)', background:'var(--paper)' }}>
      <div className="marquee-track" style={{ padding:'12px 0' }}>
        {content}{content}
      </div>
    </div>
  )
}

export function Pitch({ lineup, teamColor }: { lineup: any; teamColor: string }) {
  return (
    <div style={{ position:'relative', aspectRatio:'4/5', width:'100%',
      background:'linear-gradient(180deg,#F4F2EE 0%, #EFEEE9 100%)',
      borderRadius:14, border:'1.5px solid var(--ink)', overflow:'hidden' }}>
      <svg viewBox="0 0 100 125" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <rect x="2" y="2" width="96" height="121" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <line x1="2" y1="62.5" x2="98" y2="62.5" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <circle cx="50" cy="62.5" r="10" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <circle cx="50" cy="62.5" r="0.6" fill="rgba(10,10,10,0.3)"/>
        <rect x="25" y="2"   width="50" height="14" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <rect x="25" y="109" width="50" height="14" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <rect x="38" y="2"   width="24" height="6" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
        <rect x="38" y="117" width="24" height="6" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="0.4"/>
      </svg>
      {lineup.starters.map((p: any, i: number) => (
        <div key={i} style={{
          position:'absolute', left:`${p.x}%`, top:`${p.y}%`, transform:'translate(-50%,-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:4,
        }}>
          <div style={{
            width:44, height:44, borderRadius:'50%', background:'var(--paper)',
            border: `2px solid ${teamColor}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:14, color:'var(--ink)',
            boxShadow:'0 2px 0 rgba(10,10,10,0.15)',
          }}>{p.num}</div>
          <span style={{
            fontSize:9, fontWeight:700, color:'var(--ink)', background:'var(--paper)',
            padding:'2px 6px', borderRadius:4, border:'1px solid var(--line)',
            whiteSpace:'nowrap', maxWidth:90, overflow:'hidden', textOverflow:'ellipsis',
          }}>{p.name}</span>
        </div>
      ))}
    </div>
  )
}

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-label="WC26 HUB">
      <rect x="0" y="0" width="44" height="44" rx="10" fill={PALETTE.ink}/>
      <text x="22" y="20" textAnchor="middle"
        style={{ fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:11, fill: PALETTE.lime, letterSpacing:'0.05em' }}>WC</text>
      <text x="22" y="34" textAnchor="middle"
        style={{ fontFamily:'var(--font-archivo-black), Archivo Black', fontSize:13, fill: '#FFFFFF', letterSpacing:'0.04em' }}>26</text>
    </svg>
  )
}

export function ImagePlaceholder({
  kind = 'photo', label, color = '#0033FF', h = 160, team = null,
}: { kind?: string; label?: string; color?: string; h?: number | string; team?: any }) {
  const stripeId = 'sp-' + useId().replace(/:/g, '')
  const glyph = ({
    team:'⚑', medical:'+', tactical:'▦', locker:'▣', data:'∿',
    portrait:'◐', match:'●', news:'☷', stadium:'▼', training:'◌', photo:'◇',
  } as Record<string, string>)[kind] || '◇'
  const isPctH = typeof h === 'string'
  const glyphSize = isPctH ? 140 : (h as number) * 1.1

  return (
    <div style={{
      position:'relative', height:h, width:'100%', overflow:'hidden',
      background: color, borderBottom:'1.5px solid var(--ink)',
    }}>
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
        <defs>
          <pattern id={stripeId} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
            <rect width="14" height="14" fill="rgba(255,255,255,0.06)"/>
            <rect width="1" height="14" fill="rgba(255,255,255,0.14)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${stripeId})`}/>
      </svg>
      <div style={{
        position:'absolute', right:-12, bottom:-30,
        fontSize: glyphSize, lineHeight:1, color:'rgba(255,255,255,0.18)',
        fontFamily:'var(--font-archivo-black), Archivo Black', userSelect:'none',
      }}>{glyph as ReactNode}</div>
      {team && (
        <div style={{ position:'absolute', top:12, left:12 }}>
          <Flag team={team} w={36} h={24}/>
        </div>
      )}
      {label && (
        <div style={{
          position:'absolute', bottom:12, left:14,
          fontFamily:'var(--font-jetbrains-mono), JetBrains Mono', fontSize:10, fontWeight:700,
          color:'rgba(255,255,255,0.85)', letterSpacing:'0.08em',
          textTransform:'uppercase',
          padding:'4px 8px', background:'rgba(0,0,0,0.35)', borderRadius:4,
          backdropFilter:'blur(4px)',
        }}>{label}</div>
      )}
    </div>
  )
}
