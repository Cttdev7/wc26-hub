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

    case 'KOR':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#FFFFFF"/>
        <circle cx="1.5" cy="1" r="0.5" fill="#CD2E3A"/>
        <circle cx="1.5" cy="1" r="0.25" fill="#0047A0"/>
      </>)

    case 'RSA':
      return sv('0 0 6 4', <>
        <rect width="6" height="4" fill="#007A4D"/>
        <rect y="0" width="6" height="1.33" fill="#000000"/>
        <rect y="2.67" width="6" height="1.33" fill="#DE3831"/>
        <polygon points="0,0 2,2 0,4" fill="#FFB612"/>
        <polygon points="0,0.3 1.4,2 0,3.7" fill="#007A4D"/>
        <rect x="1.8" y="1.75" width="4.2" height="0.5" fill="#FFFFFF"/>
      </>)

    case 'CZE':
      return sv('0 0 3 2', <>
        <rect width="3" height="1" fill="#FFFFFF"/>
        <rect y="1" width="3" height="1" fill="#D7141A"/>
        <polygon points="0,0 1.2,1 0,2" fill="#11457E"/>
      </>)

    case 'BIH':
      return sv('0 0 2 1', <>
        <rect width="2" height="1" fill="#002395"/>
        <polygon points="0.5,0 1.5,1 0.5,1" fill="#F0CF00"/>
        <circle cx="0.2" cy="0.15" r="0.08" fill="#FFFFFF"/>
        <circle cx="0.35" cy="0.3" r="0.08" fill="#FFFFFF"/>
        <circle cx="0.5" cy="0.45" r="0.08" fill="#FFFFFF"/>
        <circle cx="0.65" cy="0.6" r="0.08" fill="#FFFFFF"/>
        <circle cx="0.8" cy="0.75" r="0.08" fill="#FFFFFF"/>
        <circle cx="0.95" cy="0.9" r="0.08" fill="#FFFFFF"/>
        <circle cx="1.1" cy="0.95" r="0.08" fill="#FFFFFF"/>
      </>)

    case 'HAI':
      return sv('0 0 3 2', <>
        <rect width="3" height="1" fill="#00209F"/>
        <rect y="1" width="3" height="1" fill="#D21034"/>
      </>)

    case 'CUW':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#002B7F"/>
        <rect y="1.2" width="3" height="0.3" fill="#F9E814"/>
        <circle cx="0.5" cy="0.7" r="0.18" fill="#FFFFFF"/>
        <circle cx="0.75" cy="0.7" r="0.18" fill="#FFFFFF"/>
      </>)

    case 'IRQ':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#CE1126"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#000000"/>
        <rect x="1.1" y="0.75" width="0.8" height="0.5" fill="#007A3D"/>
      </>)

    case 'JOR':
      return sv('0 0 4 2', <>
        <rect width="4" height="0.667" fill="#007A3D"/>
        <rect y="0.667" width="4" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="4" height="0.667" fill="#000000"/>
        <polygon points="0,0 1.5,1 0,2" fill="#CE1126"/>
        <polygon points="0.6,1 0.75,0.7 0.9,1 0.65,0.85 0.85,0.85" fill="#FFFFFF"/>
      </>)

    case 'COD':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#007FFF"/>
        <polygon points="0,2 3,0 3,0.4 0,2" fill="#F7D900"/>
        <polygon points="0,1.6 3,0 0,0" fill="#CE1126"/>
      </>)

    case 'UZB':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#1EB53A"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#009FCA"/>
        <rect y="0.63" width="3" height="0.08" fill="#E8112D"/>
        <rect y="1.29" width="3" height="0.08" fill="#E8112D"/>
      </>)

    case 'CPV':
      return sv('0 0 4 2', <>
        <rect width="4" height="2" fill="#003893"/>
        <rect y="1.1" width="4" height="0.22" fill="#CF2027"/>
        <rect y="1.5" width="4" height="0.22" fill="#CF2027"/>
        <circle cx="1.2" cy="1.3" r="0.12" fill="#FECC00"/>
        <circle cx="1.5" cy="1.1" r="0.12" fill="#FECC00"/>
        <circle cx="1.8" cy="1.3" r="0.12" fill="#FECC00"/>
        <circle cx="1.5" cy="1.5" r="0.12" fill="#FECC00"/>
      </>)

    case 'BEL':
      return sv('0 0 3 2', <>
        <rect width="1" height="2" fill="#000000"/>
        <rect x="1" width="1" height="2" fill="#FAE042"/>
        <rect x="2" width="1" height="2" fill="#ED2939"/>
      </>)

    case 'IRN':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#239F40"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#DA0000"/>
      </>)

    case 'NZL':
      return sv('0 0 4 2', <>
        <rect width="4" height="2" fill="#00247D"/>
        <rect width="2" height="1" fill="#00247D"/>
        <line x1="0" y1="0" x2="2" y2="1" stroke="#FFFFFF" strokeWidth="0.3"/>
        <line x1="2" y1="0" x2="0" y2="1" stroke="#FFFFFF" strokeWidth="0.3"/>
        <line x1="0" y1="0" x2="2" y2="1" stroke="#CF142B" strokeWidth="0.18"/>
        <line x1="2" y1="0" x2="0" y2="1" stroke="#CF142B" strokeWidth="0.18"/>
        <circle cx="2.8" cy="0.35" r="0.12" fill="#CC142B"/>
        <circle cx="3.5" cy="0.6" r="0.12" fill="#CC142B"/>
        <circle cx="3.2" cy="0.85" r="0.12" fill="#CC142B"/>
        <circle cx="2.7" cy="0.65" r="0.12" fill="#CC142B"/>
      </>)

    case 'URU':
      return sv('0 0 4 3', <>
        <rect width="4" height="3" fill="#FFFFFF"/>
        {[0,1,2,3,4,5,6,7].map((i: number) => (
          <rect key={i} y={i * (3/9)} width="4" height={1.5/9} fill={i%2===0?'#FFFFFF':'#75AADB'}/>
        ))}
        <rect width="1.5" height="1.5" fill="#FFFFFF"/>
        <circle cx="0.75" cy="0.75" r="0.3" fill="#FFD700"/>
      </>)

    case 'KSA':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#006C35"/>
        <rect y="1.7" width="3" height="0.3" fill="#FFFFFF"/>
        <text x="1.5" y="1.1" textAnchor="middle" fontSize="0.5" fill="#FFFFFF" fontFamily="serif">بسم</text>
      </>)

    case 'CPV':
      return sv('0 0 4 2', <>
        <rect width="4" height="2" fill="#003893"/>
        <rect y="1.1" width="4" height="0.22" fill="#CF2027"/>
        <rect y="1.5" width="4" height="0.22" fill="#CF2027"/>
      </>)

    case 'SUI':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#D52B1E"/>
        <rect x="1.3" y="0.6" width="0.4" height="0.8" fill="#FFFFFF"/>
        <rect x="1.0" y="0.85" width="1.0" height="0.3" fill="#FFFFFF"/>
      </>)

    case 'QAT':
      return sv('0 0 4 2', <>
        <rect width="1" height="2" fill="#FFFFFF"/>
        <rect x="1" width="3" height="2" fill="#8D1B3D"/>
        <polyline points="1,0 1.5,0.25 1,0.5 1.5,0.75 1,1 1.5,1.25 1,1.5 1.5,1.75 1,2" fill="none" stroke="#FFFFFF" strokeWidth="0.1"/>
      </>)

    case 'MAR':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#C1272D"/>
        <polygon points="1.5,0.5 1.62,0.88 2,0.88 1.69,1.12 1.81,1.5 1.5,1.26 1.19,1.5 1.31,1.12 1,0.88 1.38,0.88" fill="none" stroke="#006233" strokeWidth="0.06"/>
      </>)

    case 'SCO':
      return sv('0 0 5 3', <>
        <rect width="5" height="3" fill="#0065BD"/>
        <line x1="0" y1="0" x2="5" y2="3" stroke="#FFFFFF" strokeWidth="0.6"/>
        <line x1="5" y1="0" x2="0" y2="3" stroke="#FFFFFF" strokeWidth="0.6"/>
      </>)

    case 'TUR':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#E30A17"/>
        <circle cx="1.2" cy="1" r="0.4" fill="#FFFFFF"/>
        <circle cx="1.35" cy="1" r="0.3" fill="#E30A17"/>
        <polygon points="1.8,1 2.0,0.88 1.95,1.14 2.1,0.96 2.1,1.04 1.95,0.86 2.0,1.12" fill="#FFFFFF"/>
      </>)

    case 'PAR':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#D52B1E"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#0038A8"/>
        <circle cx="1.5" cy="1" r="0.25" fill="#FFD700" opacity="0.8"/>
      </>)

    case 'AUS':
      return sv('0 0 4 2', <>
        <rect width="4" height="2" fill="#0B3E91"/>
        <rect width="2" height="1" fill="#0B3E91"/>
        <line x1="0" y1="0" x2="2" y2="1" stroke="#FFFFFF" strokeWidth="0.3"/>
        <line x1="2" y1="0" x2="0" y2="1" stroke="#FFFFFF" strokeWidth="0.3"/>
        <line x1="0" y1="0" x2="2" y2="1" stroke="#E4002B" strokeWidth="0.18"/>
        <line x1="2" y1="0" x2="0" y2="1" stroke="#E4002B" strokeWidth="0.18"/>
        <circle cx="3" cy="1.5" r="0.22" fill="#FFFFFF"/>
        <circle cx="3.6" cy="0.8" r="0.12" fill="#FFFFFF"/>
        <circle cx="3.6" cy="1.3" r="0.12" fill="#FFFFFF"/>
        <circle cx="3.2" cy="1.7" r="0.12" fill="#FFFFFF"/>
        <circle cx="2.6" cy="1.2" r="0.12" fill="#FFFFFF"/>
      </>)

    case 'CIV':
      return sv('0 0 3 2', <>
        <rect width="1" height="2" fill="#FF8200"/>
        <rect x="1" width="1" height="2" fill="#FFFFFF"/>
        <rect x="2" width="1" height="2" fill="#009E60"/>
      </>)

    case 'ECU':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.8" fill="#FFD100"/>
        <rect y="0.8" width="3" height="0.6" fill="#0072CE"/>
        <rect y="1.4" width="3" height="0.6" fill="#EF3340"/>
      </>)

    case 'SUE':
      return sv('0 0 8 5', <>
        <rect width="8" height="5" fill="#006AA7"/>
        <rect x="2.4" width="0.8" height="5" fill="#FECC00"/>
        <rect y="2.1" width="8" height="0.8" fill="#FECC00"/>
      </>)

    case 'TUN':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#E70013"/>
        <circle cx="1.5" cy="1" r="0.55" fill="#FFFFFF"/>
        <circle cx="1.5" cy="1" r="0.35" fill="#E70013"/>
        <circle cx="1.7" cy="0.92" r="0.25" fill="#FFFFFF"/>
        <polygon points="1.75,1 1.95,0.92 1.9,1.15 2.05,0.98 2.05,1.02 1.9,0.85 1.95,1.08" fill="#E70013"/>
      </>)

    case 'EGY':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#CE1126"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#000000"/>
        <circle cx="1.5" cy="1" r="0.2" fill="#C09300" opacity="0.7"/>
      </>)

    case 'SEN':
      return sv('0 0 3 2', <>
        <rect width="1" height="2" fill="#00853F"/>
        <rect x="1" width="1" height="2" fill="#FDEF42"/>
        <rect x="2" width="1" height="2" fill="#E31B23"/>
        <polygon points="1.5,0.6 1.58,0.84 1.84,0.84 1.63,1.0 1.71,1.24 1.5,1.08 1.29,1.24 1.37,1.0 1.16,0.84 1.42,0.84" fill="#00853F"/>
      </>)

    case 'ALG':
      return sv('0 0 3 2', <>
        <rect width="1.5" height="2" fill="#FFFFFF"/>
        <rect x="1.5" width="1.5" height="2" fill="#006233"/>
        <circle cx="1.35" cy="1" r="0.4" fill="#D21034"/>
        <circle cx="1.5" cy="1" r="0.3" fill="#FFFFFF"/>
      </>)

    case 'AUT':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#ED2939"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#ED2939"/>
      </>)

    case 'COL':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.8" fill="#FCD116"/>
        <rect y="0.8" width="3" height="0.6" fill="#003893"/>
        <rect y="1.4" width="3" height="0.6" fill="#CE1126"/>
      </>)

    case 'CRO':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#FF0000"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#171796"/>
        <rect x="1.25" y="0.25" width="0.5" height="0.5" fill="#FF0000" stroke="#FFFFFF" strokeWidth="0.05"/>
      </>)

    case 'PAN':
      return sv('0 0 4 3', <>
        <rect width="2" height="1.5" fill="#FFFFFF"/>
        <rect x="2" y="1.5" width="2" height="1.5" fill="#FFFFFF"/>
        <rect x="2" width="2" height="1.5" fill="#D21034"/>
        <rect y="1.5" width="2" height="1.5" fill="#005AA7"/>
        <polygon points="1,0.25 1.1,0.57 1.45,0.57 1.17,0.78 1.28,1.1 1,0.89 0.72,1.1 0.83,0.78 0.55,0.57 0.9,0.57" fill="#005AA7" opacity="0.8"/>
        <polygon points="3,1.75 3.1,2.07 3.45,2.07 3.17,2.28 3.28,2.6 3,2.39 2.72,2.6 2.83,2.28 2.55,2.07 2.9,2.07" fill="#D21034" opacity="0.8"/>
      </>)

    case 'GHA':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#CF0921"/>
        <rect y="0.667" width="3" height="0.666" fill="#FCD116"/>
        <rect y="1.333" width="3" height="0.667" fill="#006B3F"/>
        <polygon points="1.5,0.75 1.59,1.02 1.88,1.02 1.64,1.19 1.74,1.47 1.5,1.29 1.26,1.47 1.36,1.19 1.12,1.02 1.41,1.02" fill="#000000"/>
      </>)

    case 'NOR':
      return sv('0 0 8 5', <>
        <rect width="8" height="5" fill="#EF2B2D"/>
        <rect x="2.2" width="1" height="5" fill="#FFFFFF"/>
        <rect y="2" width="8" height="1" fill="#FFFFFF"/>
        <rect x="2.5" width="0.4" height="5" fill="#002868"/>
        <rect y="2.3" width="8" height="0.4" fill="#002868"/>
      </>)

    case 'IRQ':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#CE1126"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#000000"/>
        <text x="1.5" y="1.1" textAnchor="middle" fontSize="0.4" fill="#007A3D" fontFamily="serif">الله</text>
      </>)

    case 'JOR':
      return sv('0 0 4 2', <>
        <rect width="4" height="0.667" fill="#007A3D"/>
        <rect y="0.667" width="4" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="4" height="0.667" fill="#000000"/>
        <polygon points="0,0 1.5,1 0,2" fill="#CE1126"/>
        <polygon points="0.65,1 0.75,0.75 0.85,1 0.7,0.88 0.8,0.88" fill="#FFFFFF"/>
      </>)

    case 'COD':
      return sv('0 0 3 2', <>
        <rect width="3" height="2" fill="#007FFF"/>
        <rect x="0" y="0" width="3" height="0.5" fill="#CE1126"/>
        <line x1="0" y1="2" x2="3" y2="0" stroke="#F7D900" strokeWidth="0.25"/>
      </>)

    case 'UZB':
      return sv('0 0 3 2', <>
        <rect width="3" height="0.667" fill="#1EB53A"/>
        <rect y="0.667" width="3" height="0.666" fill="#FFFFFF"/>
        <rect y="1.333" width="3" height="0.667" fill="#009FCA"/>
        <rect y="0.63" width="3" height="0.08" fill="#E8112D"/>
        <rect y="1.29" width="3" height="0.08" fill="#E8112D"/>
        <circle cx="0.35" cy="0.33" r="0.18" fill="#FFFFFF"/>
        <circle cx="0.55" cy="0.33" r="0.12" fill="#1EB53A"/>
      </>)

    default:
      return null
  }
}
