// Real national flag SVG components — public-domain national symbols.
// Simplified vector renderings; central emblems abstracted for clarity at small sizes.
// Ported 1:1 from design/js/02-flags.jsx

import type { CSSProperties, ReactNode } from 'react'

export function FlagSVG({
  code, w = 44, h = 30, radius = 4,
}: { code: string; w?: number; h?: number; radius?: number }) {
  const style: CSSProperties = {
    width: w, height: h, borderRadius: radius, overflow:'hidden',
    border:'1px solid rgba(10,10,10,.12)', flexShrink:0, display:'block',
  }
  const sv = (vb: string, children: ReactNode) => (
    <svg width={w} height={h} viewBox={vb} preserveAspectRatio="none" style={style}>
      {children}
    </svg>
  )

  switch(code) {
    case 'FRA':
      return sv('0 0 3 2', <>
        <rect x="0" y="0" width="1" height="2" fill="#0033A0"/>
        <rect x="1" y="0" width="1" height="2" fill="#FFFFFF"/>
        <rect x="2" y="0" width="1" height="2" fill="#EF4135"/>
      </>)

    case 'BRA':
      return sv('0 0 14 10', <>
        <rect width="14" height="10" fill="#009C3B"/>
        <polygon points="7,1 13,5 7,9 1,5" fill="#FFDF00"/>
        <circle cx="7" cy="5" r="2" fill="#002776"/>
        <path d="M 5.2 5 Q 7 4 8.8 5" stroke="#FFFFFF" strokeWidth="0.4" fill="none"/>
        <circle cx="6" cy="4.6" r="0.12" fill="#FFFFFF"/>
        <circle cx="7" cy="4.5" r="0.14" fill="#FFFFFF"/>
        <circle cx="8" cy="4.7" r="0.12" fill="#FFFFFF"/>
        <circle cx="7.3" cy="5.4" r="0.12" fill="#FFFFFF"/>
      </>)

    case 'ARG':
      return sv('0 0 9 6', <>
        <rect width="9" height="2" fill="#74ACDF"/>
        <rect y="2" width="9" height="2" fill="#FFFFFF"/>
        <rect y="4" width="9" height="2" fill="#74ACDF"/>
        <circle cx="4.5" cy="3" r="0.6" fill="#F6B40E"/>
      </>)

    case 'POR':
      return sv('0 0 30 20', <>
        <rect x="0" y="0" width="12" height="20" fill="#006233"/>
        <rect x="12" y="0" width="18" height="20" fill="#D52B1E"/>
        <circle cx="12" cy="10" r="3.2" fill="#FFE800" stroke="#000" strokeWidth="0.3"/>
        <circle cx="12" cy="10" r="2.2" fill="#D52B1E"/>
        <circle cx="12" cy="10" r="1.3" fill="#FFFFFF"/>
      </>)

    case 'ESP':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#AA151B"/>
        <rect y="0.5" width="3" height="1" fill="#F1BF00"/>
        <rect x="0.6" y="0.85" width="0.4" height="0.3" fill="#AA151B" stroke="#000" strokeWidth="0.02"/>
      </>)

    case 'ENG':
      return sv('0 0 5 3', <>
        <rect width="5" height="3" fill="#FFFFFF"/>
        <rect x="2" y="0" width="1" height="3" fill="#CE1124"/>
        <rect x="0" y="1" width="5" height="1" fill="#CE1124"/>
      </>)

    case 'GER':
      return sv('0 0 5 3', <>
        <rect width="5" height="1" fill="#000000"/>
        <rect y="1" width="5" height="1" fill="#DD0000"/>
        <rect y="2" width="5" height="1" fill="#FFCE00"/>
      </>)

    case 'NED':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#AE1C28"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#21468B"/>
      </>)

    case 'MEX':
      return sv('0 0 7 4', <>
        <rect width="2.333" height="4" fill="#006847"/>
        <rect x="2.333" width="2.334" height="4" fill="#FFFFFF"/>
        <rect x="4.667" width="2.333" height="4" fill="#CE1126"/>
        <circle cx="3.5" cy="2" r="0.7" fill="none" stroke="#5C2C0C" strokeWidth="0.15"/>
        <circle cx="3.5" cy="2" r="0.35" fill="#8C5523"/>
      </>)

    case 'USA':
      return sv('0 0 19 10', <>
        <rect width="19" height="10" fill="#FFFFFF"/>
        {[0,2,4,6,8].map(y=> <rect key={y} y={y * (10/13) + 0} x="0" width="19" height={10/13} fill="#B22234"/>)}
        {[1,3,5].map(y=> <rect key={y} y={y * (10/13)} x="7.6" width={19-7.6} height={10/13} fill="#FFFFFF"/>)}
        {[6,8,10,12].map(y=> <rect key={y} y={y * (10/13)} x="0" width="19" height={10/13} fill={y%2? "#FFFFFF" : "#B22234"}/>)}
        <rect width="7.6" height={5.385} fill="#3C3B6E"/>
        {Array.from({length:5}).map((_,r)=>
          Array.from({length:6}).map((_,c)=>
            <circle key={r+'-'+c} cx={0.6 + c*1.2} cy={0.5 + r*1.05} r="0.22" fill="#FFFFFF"/>
          )
        )}
      </>)

    case 'CAN':
      return sv('0 0 4 2', <>
        <rect width="1" height="2" fill="#D52B1E"/>
        <rect x="1" width="2" height="2" fill="#FFFFFF"/>
        <rect x="3" width="1" height="2" fill="#D52B1E"/>
        <path d="M 2 0.7 L 2.15 1 L 2.4 0.95 L 2.25 1.2 L 2.4 1.3 L 2.15 1.3 L 2.2 1.55 L 2 1.4 L 1.8 1.55 L 1.85 1.3 L 1.6 1.3 L 1.75 1.2 L 1.6 0.95 L 1.85 1 Z" fill="#D52B1E"/>
      </>)

    case 'JPN':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#FFFFFF"/>
        <circle cx="1.5" cy="1" r="0.6" fill="#BC002D"/>
      </>)

    default:
      return null
  }
}
