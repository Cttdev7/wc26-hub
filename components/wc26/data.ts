// Data fixtures for WC26 HUB prototype
// Ported 1:1 from design/js/{03,04,05,06}*.jsx
// Original team data, original brand — NOT FIFA branding.

/* eslint-disable @typescript-eslint/no-explicit-any */

export type Team = {
  code: string
  name: string
  color: string
  flag: string[]
  group: string
  rank: number
  form: string[]
}

export type Match = {
  id: string
  home: string
  away: string
  date: string
  time: string
  stage: string
  venue: string
  group?: string
  city?: string
  vKey?: string
  score?: string | null
  status?: string
  odds: { home: number; draw: number; away: number }
}

const BASE_TEAMS: Team[] = [
  // Rangs FIFA — classement officiel du 1er avril 2026
  { code:'FRA', name:'France',      color:'#0033FF', flag:['#0033FF','#FFFFFF','#E10600'], group:'I', rank: 1, form:['W','W','D','W','W'] },
  { code:'BRA', name:'Brazil',      color:'#FFD400', flag:['#009C3B','#FFD400','#002776'], group:'C', rank: 6, form:['W','D','W','W','L'] },
  { code:'ARG', name:'Argentina',   color:'#75AADB', flag:['#75AADB','#FFFFFF','#75AADB'], group:'J', rank: 3, form:['W','W','W','D','W'] },
  { code:'POR', name:'Portugal',    color:'#006B3F', flag:['#006B3F','#DA291C'], group:'K', rank: 5, form:['W','L','W','W','D'] },
  { code:'ESP', name:'Spain',       color:'#C60B1E', flag:['#C60B1E','#FFC400','#C60B1E'], group:'H', rank: 2, form:['W','W','W','W','W'] },
  { code:'ENG', name:'England',     color:'#E10600', flag:['#FFFFFF','#E10600'], group:'L', rank: 4, form:['W','D','W','L','W'] },
  { code:'GER', name:'Germany',     color:'#0A0A0A', flag:['#0A0A0A','#E10600','#FFD400'], group:'E', rank:10, form:['D','W','L','W','W'] },
  { code:'NED', name:'Netherlands', color:'#FF6E00', flag:['#AE1C28','#FFFFFF','#21468B'], group:'F', rank: 7, form:['W','W','D','W','L'] },
  { code:'MEX', name:'Mexico',      color:'#006847', flag:['#006847','#FFFFFF','#CE1126'], group:'A', rank:15, form:['W','L','W','D','W'] },
  { code:'USA', name:'USA',         color:'#0033FF', flag:['#B22234','#FFFFFF','#3C3B6E'], group:'D', rank:16, form:['D','W','W','L','W'] },
  { code:'CAN', name:'Canada',      color:'#E10600', flag:['#E10600','#FFFFFF','#E10600'], group:'B', rank:30, form:['L','W','D','W','L'] },
  { code:'JPN', name:'Japan',       color:'#BC002D', flag:['#FFFFFF','#BC002D','#FFFFFF'], group:'F', rank:18, form:['W','W','W','D','W'] },
]

// ── Vrais groupes du tirage au sort FIFA du 5 déc. 2025 ────────────────────
const TEAMS_EXTRA: Team[] = [
  // ── Groupe A : MEX · KOR · RSA · CZE ──
  { code:'KOR', name:'Korea Rep.',      color:'#CD2E3A', flag:['#FFFFFF','#CD2E3A','#0047A0'], group:'A', rank:23, form:['W','W','D','L','W'] },
  { code:'RSA', name:'South Africa',    color:'#007A4D', flag:['#007A4D','#FFB612','#000000'], group:'A', rank:57, form:['W','D','L','D','W'] },
  { code:'CZE', name:'Czech Republic',  color:'#D7141A', flag:['#FFFFFF','#D7141A','#11457E'], group:'A', rank:40, form:['D','W','W','L','D'] },
  // ── Groupe B : CAN · SUI · QAT · BIH ──
  { code:'SUI', name:'Switzerland',     color:'#D52B1E', flag:['#D52B1E','#FFFFFF','#D52B1E'], group:'B', rank:19, form:['W','D','W','L','W'] },
  { code:'QAT', name:'Qatar',           color:'#8A1538', flag:['#8A1538','#FFFFFF','#8A1538'], group:'B', rank:58, form:['L','L','D','L','W'] },
  { code:'BIH', name:'Bosnia-Herzeg.',  color:'#002395', flag:['#002395','#F0CF00','#FFFFFF'], group:'B', rank:62, form:['D','W','L','D','W'] },
  // ── Groupe C : BRA · MAR · HAI · SCO ──
  { code:'MAR', name:'Morocco',         color:'#C1272D', flag:['#C1272D','#006233','#C1272D'], group:'C', rank: 8, form:['W','W','W','D','W'] },
  { code:'HAI', name:'Haiti',           color:'#00209F', flag:['#00209F','#D21034','#00209F'], group:'C', rank:91, form:['L','D','L','W','L'] },
  { code:'SCO', name:'Scotland',        color:'#0065BD', flag:['#0065BD','#FFFFFF','#0065BD'], group:'C', rank:35, form:['W','D','L','W','D'] },
  // ── Groupe D : USA · TUR · PAR · AUS ──
  { code:'TUR', name:'Türkiye',         color:'#E30A17', flag:['#E30A17','#FFFFFF','#E30A17'], group:'D', rank:25, form:['W','D','W','L','W'] },
  { code:'PAR', name:'Paraguay',        color:'#D52B1E', flag:['#D52B1E','#FFFFFF','#0038A8'], group:'D', rank:48, form:['D','L','D','W','L'] },
  { code:'AUS', name:'Australia',       color:'#00843D', flag:['#0B3E91','#FFFFFF','#E4002B'], group:'D', rank:24, form:['W','L','D','W','D'] },
  // ── Groupe E : GER · CIV · ECU · CUW ──
  { code:'CIV', name:"Côte d'Ivoire",   color:'#FF8200', flag:['#FF8200','#FFFFFF','#009E60'], group:'E', rank:39, form:['W','W','D','L','W'] },
  { code:'ECU', name:'Ecuador',         color:'#FFD100', flag:['#FFD100','#0072CE','#EF3340'], group:'E', rank:32, form:['D','W','L','W','D'] },
  { code:'CUW', name:'Curaçao',         color:'#002B7F', flag:['#002B7F','#F9E814','#FFFFFF'], group:'E', rank:84, form:['L','W','L','D','L'] },
  // ── Groupe F : NED · JPN · SUE · TUN ──
  { code:'SUE', name:'Sweden',          color:'#006AA7', flag:['#006AA7','#FECC00','#006AA7'], group:'F', rank:27, form:['W','D','W','D','W'] },
  { code:'TUN', name:'Tunisia',         color:'#E70013', flag:['#E70013','#FFFFFF','#E70013'], group:'F', rank:42, form:['L','D','W','L','D'] },
  // ── Groupe G : BEL · IRN · EGY · NZL ──
  { code:'BEL', name:'Belgium',         color:'#FFD90C', flag:['#000000','#FAE042','#ED2939'], group:'G', rank: 9, form:['W','D','W','W','D'] },
  { code:'IRN', name:'Iran',            color:'#239F40', flag:['#239F40','#FFFFFF','#DA0000'], group:'G', rank:20, form:['W','L','W','D','W'] },
  { code:'EGY', name:'Egypt',           color:'#CE1126', flag:['#CE1126','#FFFFFF','#000000'], group:'G', rank:34, form:['D','L','W','L','D'] },
  { code:'NZL', name:'New Zealand',     color:'#000000', flag:['#FFFFFF','#000000','#FFFFFF'], group:'G', rank:101, form:['L','W','L','D','L'] },
  // ── Groupe H : ESP · URU · KSA · CPV ──
  { code:'URU', name:'Uruguay',         color:'#0038A8', flag:['#FFFFFF','#0038A8','#FFFFFF'], group:'H', rank:17, form:['W','D','W','W','L'] },
  { code:'KSA', name:'Saudi Arabia',    color:'#006C35', flag:['#006C35','#FFFFFF','#006C35'], group:'H', rank:56, form:['L','D','W','L','L'] },
  { code:'CPV', name:'Cape Verde',      color:'#003893', flag:['#003893','#CF2027','#FECC00'], group:'H', rank:73, form:['W','D','W','L','W'] },
  // ── Groupe I : FRA · SEN · IRQ · NOR ──
  { code:'SEN', name:'Senegal',         color:'#00853F', flag:['#00853F','#FDEF42','#E31B23'], group:'I', rank:14, form:['W','W','D','W','L'] },
  { code:'IRQ', name:'Iraq',            color:'#CE1126', flag:['#CE1126','#FFFFFF','#007A3D'], group:'I', rank:63, form:['W','D','L','W','D'] },
  { code:'NOR', name:'Norway',          color:'#EF2B2D', flag:['#EF2B2D','#FFFFFF','#002868'], group:'I', rank:33, form:['W','W','W','D','W'] },
  // ── Groupe J : ARG · ALG · AUT · JOR ──
  { code:'ALG', name:'Algeria',         color:'#006233', flag:['#006233','#FFFFFF','#D21034'], group:'J', rank:36, form:['W','D','L','W','D'] },
  { code:'AUT', name:'Austria',         color:'#ED2939', flag:['#ED2939','#FFFFFF','#ED2939'], group:'J', rank:23, form:['D','W','D','W','L'] },
  { code:'JOR', name:'Jordan',          color:'#007A3D', flag:['#007A3D','#FFFFFF','#CE1126'], group:'J', rank:74, form:['W','L','D','W','D'] },
  // ── Groupe K : POR · COL · UZB · COD ──
  { code:'COL', name:'Colombia',        color:'#FCD116', flag:['#FCD116','#003893','#CE1126'], group:'K', rank:13, form:['W','W','D','W','W'] },
  { code:'UZB', name:'Uzbekistan',      color:'#1EB53A', flag:['#1EB53A','#FFFFFF','#009FCA'], group:'K', rank:68, form:['W','W','D','L','W'] },
  { code:'COD', name:'Congo DR',        color:'#007FFF', flag:['#007FFF','#CE1126','#F7D900'], group:'K', rank:76, form:['D','W','L','D','W'] },
  // ── Groupe L : ENG · CRO · PAN · GHA ──
  { code:'CRO', name:'Croatia',         color:'#171796', flag:['#FF0000','#FFFFFF','#171796'], group:'L', rank:11, form:['D','W','W','L','D'] },
  { code:'PAN', name:'Panama',          color:'#005AA7', flag:['#005AA7','#FFFFFF','#D21034'], group:'L', rank:38, form:['D','L','W','D','L'] },
  { code:'GHA', name:'Ghana',           color:'#FCD116', flag:['#CE1126','#FCD116','#006B3F'], group:'L', rank:72, form:['L','D','L','W','D'] },
]

// Groupes officiels du tirage FIFA du 5 décembre 2025
const GROUP_ASSIGN: Record<string, string> = {
  ARG:'J', MEX:'A',
  ESP:'H', CAN:'B',
  FRA:'I', USA:'D',
  ENG:'L', JPN:'F',
  GER:'E',
  BRA:'C',
  NED:'F',
  POR:'K',
}

BASE_TEAMS.forEach(t => { if (GROUP_ASSIGN[t.code]) t.group = GROUP_ASSIGN[t.code] })

export const TEAMS: Team[] = [...BASE_TEAMS, ...TEAMS_EXTRA]

export const MATCHES: Match[] = [
  { id:'m1', home:'POR', away:'ARG', date:'18 JUN', time:'21:00', stage:'Group A · MD2', venue:'SoFi Stadium · Los Angeles', odds:{home:3.2, draw:3.4, away:2.1} },
  { id:'m2', home:'BRA', away:'FRA', date:'19 JUN', time:'18:00', stage:'Group F · MD1', venue:'AT&T Stadium · Dallas',     odds:{home:2.6, draw:3.3, away:2.7} },
  { id:'m3', home:'ESP', away:'GER', date:'20 JUN', time:'15:00', stage:'Group B · MD2', venue:'MetLife Stadium · NJ',     odds:{home:2.1, draw:3.4, away:3.3} },
  { id:'m4', home:'ENG', away:'JPN', date:'21 JUN', time:'21:00', stage:'Group D · MD1', venue:'Mercedes Stadium · Atlanta', odds:{home:1.5, draw:4.2, away:5.8} },
  { id:'m5', home:'NED', away:'MEX', date:'22 JUN', time:'18:00', stage:'Group G · MD1', venue:'BMO Field · Toronto',      odds:{home:1.9, draw:3.5, away:4.0} },
  { id:'m6', home:'USA', away:'CAN', date:'23 JUN', time:'21:00', stage:'Group A · MD3', venue:'BC Place · Vancouver',     odds:{home:2.0, draw:3.4, away:3.7} },
]

export const FEATURED = MATCHES[1] // BRA vs FRA

export const TEAM_STATS: Record<string, any> = {
  FRA: { possession:54, shots:14.2, sot:5.1, fouls:11, offsides:1.8, corners:4.6, freekicks:13.2, passes:510, succPasses:428, crosses:7, intercepts:11, tackles:12, saves:3.1, xg:1.78, xga:0.92 },
  BRA: { possession:58, shots:16.4, sot:6.0, fouls:12, offsides:2.2, corners:5.8, freekicks:11.8, passes:580, succPasses:498, crosses:13, intercepts:9, tackles:13, saves:2.4, xg:1.92, xga:0.81 },
  ARG: { possession:56, shots:15.0, sot:5.4, fouls:10, offsides:1.4, corners:5.2, freekicks:12.0, passes:545, succPasses:472, crosses:9, intercepts:10, tackles:11, saves:2.8, xg:1.86, xga:0.74 },
  POR: { possession:55, shots:14.8, sot:5.0, fouls:11, offsides:1.9, corners:5.0, freekicks:12.5, passes:520, succPasses:445, crosses:10, intercepts:9, tackles:12, saves:2.9, xg:1.71, xga:0.96 },
  ESP: { possession:64, shots:15.5, sot:5.5, fouls:9, offsides:1.6, corners:6.0, freekicks:10.8, passes:640, succPasses:572, crosses:8, intercepts:8, tackles:10, saves:2.2, xg:1.95, xga:0.68 },
  ENG: { possession:57, shots:14.0, sot:4.8, fouls:10, offsides:1.7, corners:5.4, freekicks:11.2, passes:530, succPasses:450, crosses:11, intercepts:10, tackles:12, saves:2.6, xg:1.74, xga:0.88 },
  GER: { possession:60, shots:14.6, sot:5.2, fouls:11, offsides:1.5, corners:5.6, freekicks:11.6, passes:560, succPasses:483, crosses:9, intercepts:9, tackles:12, saves:2.7, xg:1.80, xga:0.85 },
  NED: { possession:55, shots:13.5, sot:4.6, fouls:11, offsides:2.0, corners:4.8, freekicks:12.4, passes:510, succPasses:438, crosses:10, intercepts:10, tackles:13, saves:2.8, xg:1.66, xga:0.94 },
  MEX: { possession:51, shots:11.8, sot:3.9, fouls:13, offsides:2.1, corners:4.2, freekicks:13.6, passes:470, succPasses:392, crosses:8, intercepts:11, tackles:14, saves:3.4, xg:1.32, xga:1.18 },
  USA: { possession:50, shots:11.0, sot:3.6, fouls:12, offsides:1.8, corners:4.0, freekicks:13.0, passes:455, succPasses:378, crosses:9, intercepts:11, tackles:14, saves:3.5, xg:1.24, xga:1.22 },
  CAN: { possession:46, shots:10.2, sot:3.2, fouls:14, offsides:1.6, corners:3.6, freekicks:14.0, passes:420, succPasses:340, crosses:8, intercepts:12, tackles:15, saves:3.8, xg:1.12, xga:1.42 },
  JPN: { possession:53, shots:12.6, sot:4.2, fouls:9, offsides:1.4, corners:4.8, freekicks:11.0, passes:490, succPasses:418, crosses:7, intercepts:10, tackles:12, saves:3.0, xg:1.42, xga:1.06 },
}

const FRA_LINEUP = {
  formation: '4-2-3-1',
  coach: 'Didier Deschamps',
  starters: [
    { num:16, name:'Mike Maignan', pos:'GK',  x:50, y:90 },
    { num: 6, name:'Douglas Santos', pos:'LB', x:14, y:70 },
    { num: 5, name:'Léo Pereira',    pos:'CB', x:36, y:74 },
    { num:14, name:'Bremer',         pos:'CB', x:62, y:74 },
    { num: 2, name:'Malo Gusto',     pos:'RB', x:84, y:70 },
    { num:14, name:'Adrien Rabiot',  pos:'CM', x:36, y:54 },
    { num: 6, name:'Tchouaméni',     pos:'CM', x:62, y:54 },
    { num:22, name:'Hugo Ekitiké',   pos:'LW', x:14, y:34 },
    { num:11, name:'Michael Olise',  pos:'AM', x:50, y:38 },
    { num: 7, name:'Ousmane Dembélé',pos:'RW', x:84, y:34 },
    { num:10, name:'Kylian Mbappé',  pos:'ST', x:50, y:14 },
  ],
  bench: [
    '21 Lucas Hernández','24 Rayan Cherki','12 Randal Kolo Muani','18 Warren Zaïre-Emery',
    '6 Eduardo Camavinga','3 Lucas Digne','1 Brice Samba','23 Lucas Chevalier',
    '17 Maxence Lacroix','20 Désiré Doué','9 Marcus Thuram',"13 N'Golo Kanté",
    '25 Maghnes Akliouche','5 Pierre Kalulu',
  ],
}

const BRA_LINEUP = {
  formation: '4-3-3',
  coach: 'Dorival Júnior',
  starters: [
    { num: 1, name:'Alisson',     pos:'GK', x:50, y:90 },
    { num: 6, name:'W. Estêvão',  pos:'LB', x:14, y:70 },
    { num: 4, name:'Marquinhos',  pos:'CB', x:36, y:74 },
    { num: 3, name:'Éder Militão',pos:'CB', x:62, y:74 },
    { num: 2, name:'Vanderson',   pos:'RB', x:84, y:70 },
    { num: 5, name:'Casemiro',    pos:'CM', x:50, y:58 },
    { num: 8, name:'Bruno G.',    pos:'CM', x:30, y:48 },
    { num:10, name:'Rodrygo',     pos:'CM', x:70, y:48 },
    { num: 7, name:'Vini Jr',     pos:'LW', x:14, y:28 },
    { num: 9, name:'Endrick',     pos:'ST', x:50, y:18 },
    { num:11, name:'Raphinha',    pos:'RW', x:84, y:28 },
  ],
  bench: [
    '12 Bento','22 Beraldo','13 Wesley','15 João Gomes','16 Andreas P.',
    '17 Lucas Paquetá','18 Savinho','19 Antony','20 Pedro','21 Matheus Cunha',
  ],
}

export const LINEUPS: Record<string, any> = { FRA: FRA_LINEUP, BRA: BRA_LINEUP }

export const PREDICTORS = [
  { name:'@maradona_22',   pts:12480, streak: 7, accuracy: 71, avatar:'#FF0080' },
  { name:'@kylian.fr',     pts:11930, streak: 4, accuracy: 68, avatar:'#0033FF' },
  { name:'@samba_pro',     pts:11410, streak: 9, accuracy: 73, avatar:'#C8FF00' },
  { name:'@northtactic',   pts:10880, streak: 3, accuracy: 64, avatar:'#6B2FB5' },
  { name:'@lola.pred',     pts:10240, streak: 5, accuracy: 67, avatar:'#E10600' },
  { name:'@bigben.bets',   pts: 9820, streak: 2, accuracy: 62, avatar:'#FF6E00' },
  { name:'@xg_addict',     pts: 9610, streak: 6, accuracy: 65, avatar:'#0A0A0A' },
  { name:'@tiki.taka',     pts: 9180, streak: 1, accuracy: 60, avatar:'#FFD400' },
]

export const FEATURED_PULSE = { home: 38, draw: 22, away: 40, volume: 14820 }

export const ANALYSES = [
  { tag:'TACTIQUE',   color:'#6B2FB5', title:'Pourquoi le double pivot français va craquer face au pressing brésilien', author:'A. Lasalle', read:'7 min' },
  { tag:'DATA',       color:'#0033FF', title:"xG cumulé : l'Espagne creuse l'écart, l'Allemagne stagne", author:'M. Ortega', read:'4 min' },
  { tag:'JOUEUR',     color:'#E10600', title:'Endrick, 19 ans : la courbe de progression la plus folle du tournoi', author:'R. Pinto', read:'6 min' },
  { tag:'COMMUNAUTÉ', color:'#FF0080', title:"Le crowd s'est trompé 64% du temps sur les matchs serrés. Pourquoi ?", author:'Équipe HUB', read:'5 min' },
]

export const FAVORITES = [
  { code:'ARG', odds:5.5,  community:18, trend:'up'   },
  { code:'BRA', odds:6.0,  community:16, trend:'up'   },
  { code:'FRA', odds:6.5,  community:14, trend:'flat' },
  { code:'ESP', odds:7.0,  community:13, trend:'up'   },
  { code:'ENG', odds:8.5,  community:10, trend:'down' },
  { code:'GER', odds:14.0, community: 6, trend:'flat' },
  { code:'POR', odds:15.0, community: 6, trend:'down' },
  { code:'NED', odds:17.0, community: 5, trend:'flat' },
]

export const NEWS = [
  { id:'n1', tag:'TRANSFERTS', color:'#E10600', title:"Mbappé prolonge avec les Bleus jusqu'en 2030, prime de capitanat record", excerpt:"Le capitaine de l'équipe de France a renouvelé son contrat moral avec la FFF avant l'entrée en lice à Dallas.", time:'il y a 2 h', views:'24.3k', img:'team', team:'FRA' },
  { id:'n2', tag:'BLESSURE', color:'#FF6E00', title:"Pedri forfait pour le premier tour : un séisme pour l'Espagne", excerpt:"Le milieu du Barça souffre d'une lésion du biceps fémoral. De la Fuente convoque Aleix García en urgence.", time:'il y a 4 h', views:'18.9k', img:'medical', team:'ESP' },
  { id:'n3', tag:'TACTIQUE', color:'#6B2FB5', title:"Pourquoi Dorival Júnior va titulariser Endrick au lieu de Vini Jr ce soir", excerpt:"La presse brésilienne révèle les choix surprises du sélectionneur avant le choc contre la France.", time:'il y a 6 h', views:'15.2k', img:'tactical', team:'BRA' },
  { id:'n4', tag:'COULISSES', color:'#FF0080', title:"Ambiance ultra-tendue dans le vestiaire portugais après une dispute Ronaldo-Bruno", excerpt:"Un échange musclé en demi-finale du dernier rassemblement aurait fissuré le groupe avant le tournoi.", time:'il y a 8 h', views:'12.7k', img:'locker', team:'POR' },
  { id:'n5', tag:'DATA', color:'#0033FF', title:"Les 7 statistiques qui prouvent que l'Argentine est encore plus forte qu'en 2022", excerpt:"xG, pressing, transitions : tout indique que la Albiceleste tient sa meilleure équipe depuis Maradona.", time:'il y a 12 h', views:'11.4k', img:'data', team:'ARG' },
  { id:'n6', tag:'JEUNE', color:'#C8FF00', title:"Lamine Yamal, 18 ans : portrait du futur Ballon d'Or selon Xavi", excerpt:"L'ailier du Barça est entré dans une dimension nouvelle. Comment la Roja a construit son crack.", time:'hier', views:'10.1k', img:'portrait', team:'ESP' },
]

export const MATCH_PROBS: Record<string, any> = {
  m1: { home: 30, draw: 26, away: 44, predictedScore:'1-2', expectedGoals: 2.4, bothScore: 58, over25: 52 },
  m2: { home: 38, draw: 26, away: 36, predictedScore:'2-2', expectedGoals: 3.1, bothScore: 68, over25: 64 },
  m3: { home: 46, draw: 28, away: 26, predictedScore:'2-1', expectedGoals: 2.7, bothScore: 54, over25: 58 },
  m4: { home: 64, draw: 22, away: 14, predictedScore:'2-0', expectedGoals: 2.2, bothScore: 38, over25: 48 },
  m5: { home: 52, draw: 26, away: 22, predictedScore:'2-1', expectedGoals: 2.5, bothScore: 51, over25: 54 },
  m6: { home: 48, draw: 28, away: 24, predictedScore:'1-1', expectedGoals: 2.3, bothScore: 56, over25: 50 },
}

export const H2H: Record<string, any[]> = {
  m2: [
    { date:'06-2022', comp:'Friendly', home:'BRA', away:'FRA', score:'1-1' },
    { date:'07-2018', comp:'WC QF',    home:'BRA', away:'FRA', score:'0-1' },
    { date:'09-2015', comp:'Friendly', home:'FRA', away:'BRA', score:'3-1' },
    { date:'06-2013', comp:'Friendly', home:'FRA', away:'BRA', score:'0-3' },
    { date:'02-2011', comp:'Friendly', home:'FRA', away:'BRA', score:'1-0' },
  ],
}

export const SQUADS: Record<string, any> = {
  FRA: {
    coach:'Didier Deschamps', formation:'4-2-3-1', captain:'Kylian Mbappé',
    mood: 'CONFIANTE', moodScore: 82,
    moodLabel: 'Groupe soudé, deux entraînements rugueux mais zéro tension publique',
    upcomingEvents:[
      { date:'17 JUN', label:'Entraînement ouvert', place:'AT&T Stadium · Dallas' },
      { date:'18 JUN', label:'Conférence presse Mbappé', place:'Centre de Frisco' },
      { date:'19 JUN', label:'BRA vs FRA — MD1', place:'Dallas · 18h00' },
      { date:'23 JUN', label:'FRA vs CAN — MD2', place:'Mercedes Stadium · Atlanta' },
    ],
    injured:[
      { name:'Aurélien Tchouaméni', issue:'Pubalgie', return:'incertain', severity:'high' },
      { name:'Wesley Fofana',       issue:'Cuisse',     return:'huitièmes',  severity:'mid' },
    ],
    suspended:[ { name:'Ibrahima Konaté', reason:'Cumul cartons', miss:'1 match' } ],
    players:[
      { num:16, name:'Mike Maignan',    pos:'GK', age:30, club:'Milan',     form:84 },
      { num: 1, name:'Brice Samba',     pos:'GK', age:31, club:'Rennes',    form:71 },
      { num: 3, name:'Lucas Digne',     pos:'DEF',age:32, club:'Aston Villa',form:68 },
      { num: 4, name:'Dayot Upamecano', pos:'DEF',age:27, club:'Bayern',    form:78 },
      { num: 5, name:'Jules Koundé',    pos:'DEF',age:27, club:'Barcelona', form:81 },
      { num: 2, name:'Malo Gusto',      pos:'DEF',age:23, club:'Chelsea',   form:77 },
      { num:14, name:'Adrien Rabiot',   pos:'MID',age:31, club:'Marseille', form:76 },
      { num: 6, name:'Aurélien Tchouaméni', pos:'MID',age:26,club:'Real Madrid',form:60 },
      { num:13, name:"N'Golo Kanté",pos:'MID',age:35, club:'Al-Ittihad',form:72 },
      { num:11, name:'Michael Olise',   pos:'MID',age:24, club:'Bayern',    form:89 },
      { num:10, name:'Kylian Mbappé',   pos:'FWD',age:27, club:'Real Madrid',form:92, captain:true },
      { num: 7, name:'Ousmane Dembélé', pos:'FWD',age:28, club:'PSG',       form:85 },
      { num:22, name:'Hugo Ekitiké',    pos:'FWD',age:23, club:'Liverpool', form:80 },
      { num: 9, name:'Marcus Thuram',   pos:'FWD',age:28, club:'Inter',     form:74 },
      { num:24, name:'Rayan Cherki',    pos:'MID',age:22, club:'Man City',  form:88 },
    ],
    news:[
      { tag:'BLESSURE',  title:"Tchouaméni à l'infirmerie : décision finale demain matin", time:'il y a 5 h' },
      { tag:'EFFECTIF',  title:'Cherki annoncé titulaire surprise face au Brésil', time:'il y a 2 h' },
      { tag:'AMBIANCE',  title:'Match de Mölkky improvisé au camp de base, Deschamps approuve', time:'hier' },
    ],
  },
  BRA: {
    coach:'Dorival Júnior', formation:'4-3-3', captain:'Marquinhos',
    mood:'EUPHORIQUE', moodScore: 88,
    moodLabel: 'Onze enchaînements sans défaite, presse brésilienne dithyrambique',
    upcomingEvents:[
      { date:'17 JUN', label:'Entraînement fermé', place:'Camp Toyota · Dallas' },
      { date:'19 JUN', label:'BRA vs FRA — MD1', place:'AT&T Stadium · 18h00' },
      { date:'24 JUN', label:'BRA vs MAR — MD2', place:'NRG Stadium · Houston' },
    ],
    injured:[ { name:'Neymar Jr', issue:'Ligaments genou', return:'phase à élim.', severity:'high' } ],
    suspended:[],
    players:[
      { num: 1, name:'Alisson',       pos:'GK', age:33, club:'Liverpool', form:86, captain:false },
      { num: 4, name:'Marquinhos',    pos:'DEF',age:31, club:'PSG',       form:84, captain:true },
      { num: 3, name:'Éder Militão',  pos:'DEF',age:28, club:'Real Madrid',form:78 },
      { num: 2, name:'Vanderson',     pos:'DEF',age:24, club:'Monaco',    form:79 },
      { num: 6, name:'Wendell',       pos:'DEF',age:32, club:'Porto',     form:73 },
      { num: 5, name:'Casemiro',      pos:'MID',age:34, club:'Man United',form:71 },
      { num: 8, name:'Bruno Guimarães',pos:'MID',age:28,club:'Newcastle',  form:84 },
      { num:10, name:'Rodrygo',       pos:'MID',age:25, club:'Real Madrid',form:82 },
      { num: 7, name:'Vini Jr',       pos:'FWD',age:26, club:'Real Madrid',form:91 },
      { num: 9, name:'Endrick',       pos:'FWD',age:20, club:'Real Madrid',form:89 },
      { num:11, name:'Raphinha',      pos:'FWD',age:29, club:'Barcelona', form:87 },
      { num:19, name:'Antony',        pos:'FWD',age:26, club:'Real Betis',form:74 },
    ],
    news:[
      { tag:'AMBIANCE', title:"Samba dans le bus de l'équipe avant le départ pour Dallas", time:'il y a 1 j' },
      { tag:'TACTIQUE', title:'Endrick titulaire face à la France, Vini repositionné', time:'il y a 3 h' },
    ],
  },
  ARG: {
    coach:'Lionel Scaloni', formation:'4-3-3', captain:'Lionel Messi',
    mood:'DÉTERMINÉE', moodScore: 85,
    moodLabel: 'Champions en titre, sérénité absolue mais pression maximale',
    upcomingEvents:[
      { date:'18 JUN', label:'POR vs ARG — MD2', place:'SoFi Stadium · 21h00' },
      { date:'23 JUN', label:'ARG vs MEX — MD3', place:'Estadio Azteca · Mexico' },
    ],
    injured:[], suspended:[], players:[],
    news:[ { tag:'CAPITAINE', title:'Messi : "Mon dernier tournoi, je veux finir au sommet"', time:'il y a 1 h' } ],
  },
}

const teamCodes = [
  'FRA','BRA','ARG','POR','ESP','ENG','GER','NED','MEX','USA','CAN','JPN',
  'KOR','RSA','CZE','SUI','QAT','BIH','MAR','HAI','SCO','TUR','PAR','AUS',
  'CIV','ECU','CUW','SUE','TUN','BEL','IRN','EGY','NZL','URU','KSA','CPV',
  'SEN','IRQ','NOR','ALG','AUT','JOR','COL','UZB','COD','CRO','PAN','GHA',
]
teamCodes.forEach(c => {
  if (!SQUADS[c]) {
    SQUADS[c] = {
      coach: '— sélectionneur —', formation:'4-3-3', captain:'—',
      mood:'CONCENTRÉE', moodScore: 70,
      moodLabel: 'Aucune information divulguée par le staff cette semaine',
      upcomingEvents: [], injured: [], suspended: [], players: [], news: [],
    }
  }
})

export const PROFILE = {
  handle:'@maxbets26', name:'Maxime D.', joined:'avril 2026', country:'FRA',
  points: 1247, rank: 1842, rankTotal: 48200, weeklyRank: 412,
  accuracy: 62, streak: 3, longestStreak: 11,
  bets: 47, won: 29, pending: 4,
  badges:[
    { id:'b1', emoji:'🔥', label:'Série de 10',   unlocked:true,  color:'#FF0080' },
    { id:'b2', emoji:'🎯', label:'Sniper',         unlocked:true,  color:'#0033FF' },
    { id:'b3', emoji:'💎', label:'Cote +5.0',      unlocked:true,  color:'#C8FF00' },
    { id:'b4', emoji:'👑', label:'Top 1 %',        unlocked:false, color:'#6B2FB5' },
    { id:'b5', emoji:'🌍', label:'Tous continents',unlocked:false, color:'#FF6E00' },
    { id:'b6', emoji:'⚡', label:'Live betting',   unlocked:true,  color:'#E10600' },
  ],
  recentBets:[
    { match:'ESP vs GER', pick:'1 · ESP',  odds:2.10, stake:80, status:'won',     payout:168 },
    { match:'ENG vs JPN', pick:'1 · ENG',  odds:1.50, stake:50, status:'won',     payout:75  },
    { match:'POR vs ARG', pick:'2 · ARG',  odds:2.10, stake:100,status:'pending', payout:210 },
    { match:'NED vs MEX', pick:'NUL',      odds:3.50, stake:25, status:'lost',    payout:0   },
    { match:'BRA vs FRA', pick:'2 · FRA',  odds:2.70, stake:120,status:'pending', payout:324 },
    { match:'USA vs CAN', pick:'1 · USA',  odds:2.00, stake:40, status:'won',     payout:80  },
    { match:'GER vs JPN', pick:'1 · GER',  odds:1.80, stake:60, status:'lost',    payout:0   },
  ],
  pointsHistory:[ 1000, 1020, 1085, 1060, 1110, 1180, 1145, 1210, 1247 ],
}

// ─── Calendar data ─────────────────────────────────────────────
export const VENUES: Record<string, { city: string; stadium: string }> = {
  NY:  { city:'New York/NJ', stadium:'MetLife Stadium' },
  LA:  { city:'Los Angeles', stadium:'SoFi Stadium' },
  DAL: { city:'Dallas',      stadium:'AT&T Stadium' },
  HOU: { city:'Houston',     stadium:'NRG Stadium' },
  ATL: { city:'Atlanta',     stadium:'Mercedes Stadium' },
  KC:  { city:'Kansas City', stadium:'Arrowhead Stadium' },
  PHI: { city:'Philadelphia',stadium:'Lincoln Field' },
  MIA: { city:'Miami',       stadium:'Hard Rock Stadium' },
  SEA: { city:'Seattle',     stadium:'Lumen Field' },
  SF:  { city:'San Francisco',stadium:"Levi's Stadium" },
  BOS: { city:'Boston',      stadium:'Gillette Stadium' },
  TOR: { city:'Toronto',     stadium:'BMO Field' },
  VAN: { city:'Vancouver',   stadium:'BC Place' },
  GDL: { city:'Guadalajara', stadium:'Estadio Akron' },
  MTY: { city:'Monterrey',   stadium:'Estadio BBVA' },
  MEX: { city:'Mexico',      stadium:'Estadio Azteca' },
}

function fx(
  id: string, dateISO: string, time: string, home: string, away: string,
  stage: string, grp: string, vKey: string,
  score: string | null = null, status = 'scheduled',
  odds: { home: number; draw: number; away: number } | null = null,
): Match {
  const v = VENUES[vKey]
  return {
    id, date: dateISO, time, home, away, stage, group: grp,
    venue: v.stadium + ' · ' + v.city, city: v.city, vKey,
    score, status,
    odds: odds || { home: 2.0 + Math.random()*1.5, draw: 3.0 + Math.random()*0.8, away: 2.0 + Math.random()*1.5 },
  }
}

export const TZ_OFFSET: Record<string, number> = {
  NY: 6, PHI: 6, BOS: 6, MIA: 6, ATL: 6, TOR: 6,
  DAL: 7, HOU: 7, KC: 7,
  LA: 9, SF: 9, SEA: 9, VAN: 9,
  MEX: 8, MTY: 8, GDL: 8,
}

export const TZ_LABEL: Record<string, string> = {
  NY: 'ET', PHI: 'ET', BOS: 'ET', MIA: 'ET', ATL: 'ET', TOR: 'ET',
  DAL: 'CT', HOU: 'CT', KC: 'CT',
  LA: 'PT', SF: 'PT', SEA: 'PT', VAN: 'PT',
  MEX: 'CST', MTY: 'CST', GDL: 'CST',
}

export function toParis(localTime: string, vKey?: string) {
  if (!localTime || !vKey) return null
  const [h, mn] = localTime.split(':').map(Number)
  const offset = TZ_OFFSET[vKey] != null ? TZ_OFFSET[vKey] : 6
  let nh = h + offset
  let dayShift = 0
  while (nh >= 24) { nh -= 24; dayShift++ }
  return {
    time: String(nh).padStart(2,'0') + ':' + String(mn).padStart(2,'0'),
    dayShift,
  }
}

export const CALENDAR: Match[] = [
  // ── PHASE DE GROUPES ─────────────────────────────────────────────────────

  // GROUPE A : MEX · KOR · RSA · CZE
  fx('gA1','2026-06-11','21:00','MEX','KOR','MD1','A','MEX'),  // Match d'ouverture
  fx('gA2','2026-06-11','18:00','RSA','CZE','MD1','A','DAL'),
  fx('gA3','2026-06-18','18:00','MEX','RSA','MD2','A','GDL'),
  fx('gA4','2026-06-18','21:00','KOR','CZE','MD2','A','LA'),
  fx('gA5','2026-06-24','15:00','MEX','CZE','MD3','A','MTY'),  // simultané
  fx('gA6','2026-06-24','15:00','KOR','RSA','MD3','A','SF'),   // simultané

  // GROUPE B : CAN · SUI · QAT · BIH
  fx('gB1','2026-06-12','15:00','CAN','BIH','MD1','B','TOR'),
  fx('gB2','2026-06-12','18:00','SUI','QAT','MD1','B','HOU'),
  fx('gB3','2026-06-18','15:00','CAN','QAT','MD2','B','VAN'),
  fx('gB4','2026-06-18','18:00','SUI','BIH','MD2','B','PHI'),
  fx('gB5','2026-06-24','18:00','CAN','SUI','MD3','B','TOR'),  // simultané
  fx('gB6','2026-06-24','18:00','BIH','QAT','MD3','B','BOS'),  // simultané

  // GROUPE C : BRA · MAR · HAI · SCO
  fx('gC1','2026-06-12','21:00','BRA','HAI','MD1','C','MIA'),
  fx('gC2','2026-06-12','18:00','MAR','SCO','MD1','C','ATL'),
  fx('gC3','2026-06-19','15:00','BRA','MAR','MD2','C','DAL'),
  fx('gC4','2026-06-19','18:00','SCO','HAI','MD2','C','KC'),
  fx('gC5','2026-06-24','21:00','BRA','SCO','MD3','C','NY'),   // simultané
  fx('gC6','2026-06-24','21:00','MAR','HAI','MD3','C','SEA'),  // simultané

  // GROUPE D : USA · TUR · PAR · AUS
  fx('gD1','2026-06-13','21:00','USA','TUR','MD1','D','LA'),
  fx('gD2','2026-06-13','18:00','PAR','AUS','MD1','D','MIA'),
  fx('gD3','2026-06-19','21:00','USA','PAR','MD2','D','ATL'),
  fx('gD4','2026-06-19','18:00','TUR','AUS','MD2','D','SF'),
  fx('gD5','2026-06-25','15:00','USA','AUS','MD3','D','KC'),   // simultané
  fx('gD6','2026-06-25','15:00','TUR','PAR','MD3','D','HOU'),  // simultané

  // GROUPE E : GER · CIV · ECU · CUW
  fx('gE1','2026-06-13','15:00','GER','CIV','MD1','E','NY'),
  fx('gE2','2026-06-13','18:00','ECU','CUW','MD1','E','MEX'),
  fx('gE3','2026-06-20','15:00','GER','ECU','MD2','E','PHI'),
  fx('gE4','2026-06-20','18:00','CIV','CUW','MD2','E','BOS'),
  fx('gE5','2026-06-25','18:00','GER','CUW','MD3','E','DAL'),  // simultané
  fx('gE6','2026-06-25','18:00','CIV','ECU','MD3','E','SEA'),  // simultané

  // GROUPE F : NED · JPN · SUE · TUN
  fx('gF1','2026-06-14','15:00','NED','JPN','MD1','F','ATL'),
  fx('gF2','2026-06-14','18:00','SUE','TUN','MD1','F','KC'),
  fx('gF3','2026-06-20','21:00','NED','SUE','MD2','F','NY'),
  fx('gF4','2026-06-20','18:00','JPN','TUN','MD2','F','VAN'),
  fx('gF5','2026-06-25','21:00','NED','TUN','MD3','F','MIA'),  // simultané
  fx('gF6','2026-06-25','21:00','JPN','SUE','MD3','F','BOS'),  // simultané

  // GROUPE G : BEL · IRN · EGY · NZL
  fx('gG1','2026-06-14','21:00','BEL','EGY','MD1','G','LA'),
  fx('gG2','2026-06-14','18:00','IRN','NZL','MD1','G','SF'),
  fx('gG3','2026-06-21','15:00','BEL','IRN','MD2','G','MIA'),
  fx('gG4','2026-06-21','18:00','EGY','NZL','MD2','G','DAL'),
  fx('gG5','2026-06-26','15:00','BEL','NZL','MD3','G','ATL'),  // simultané
  fx('gG6','2026-06-26','15:00','IRN','EGY','MD3','G','KC'),   // simultané

  // GROUPE H : ESP · URU · KSA · CPV
  fx('gH1','2026-06-15','21:00','ESP','URU','MD1','H','LA'),
  fx('gH2','2026-06-15','18:00','KSA','CPV','MD1','H','MEX'),
  fx('gH3','2026-06-21','21:00','ESP','KSA','MD2','H','NY'),
  fx('gH4','2026-06-21','18:00','URU','CPV','MD2','H','PHI'),
  fx('gH5','2026-06-26','18:00','ESP','CPV','MD3','H','BOS'),  // simultané
  fx('gH6','2026-06-26','18:00','URU','KSA','MD3','H','HOU'),  // simultané

  // GROUPE I : FRA · SEN · IRQ · NOR
  fx('gI1','2026-06-15','15:00','FRA','SEN','MD1','I','DAL'),
  fx('gI2','2026-06-15','18:00','IRQ','NOR','MD1','I','ATL'),
  fx('gI3','2026-06-22','15:00','FRA','IRQ','MD2','I','NY'),
  fx('gI4','2026-06-22','18:00','SEN','NOR','MD2','I','SEA'),
  fx('gI5','2026-06-26','21:00','FRA','NOR','MD3','I','LA'),   // simultané
  fx('gI6','2026-06-26','21:00','SEN','IRQ','MD3','I','SF'),   // simultané

  // GROUPE J : ARG · ALG · AUT · JOR
  fx('gJ1','2026-06-16','21:00','ARG','AUT','MD1','J','MIA'),
  fx('gJ2','2026-06-16','18:00','ALG','JOR','MD1','J','GDL'),
  fx('gJ3','2026-06-22','21:00','ARG','ALG','MD2','J','NY'),
  fx('gJ4','2026-06-22','18:00','AUT','JOR','MD2','J','PHI'),
  fx('gJ5','2026-06-27','15:00','ARG','JOR','MD3','J','LA'),   // simultané
  fx('gJ6','2026-06-27','15:00','ALG','AUT','MD3','J','BOS'),  // simultané

  // GROUPE K : POR · COL · UZB · COD
  fx('gK1','2026-06-16','15:00','POR','COL','MD1','K','DAL'),
  fx('gK2','2026-06-16','18:00','UZB','COD','MD1','K','SEA'),
  fx('gK3','2026-06-23','15:00','POR','UZB','MD2','K','NY'),
  fx('gK4','2026-06-23','18:00','COL','COD','MD2','K','ATL'),
  fx('gK5','2026-06-27','18:00','POR','COD','MD3','K','MIA'),  // simultané
  fx('gK6','2026-06-27','18:00','UZB','COL','MD3','K','PHI'),  // simultané

  // GROUPE L : ENG · CRO · PAN · GHA
  fx('gL1','2026-06-17','18:00','ENG','CRO','MD1','L','SF'),
  fx('gL2','2026-06-17','21:00','PAN','GHA','MD1','L','TOR'),
  fx('gL3','2026-06-23','21:00','ENG','PAN','MD2','L','DAL'),
  fx('gL4','2026-06-23','18:00','CRO','GHA','MD2','L','KC'),
  fx('gL5','2026-06-27','21:00','ENG','GHA','MD3','L','LA'),   // simultané
  fx('gL6','2026-06-27','21:00','CRO','PAN','MD3','L','VAN'),  // simultané

  // ── 16es DE FINALE ───────────────────────────────────────────────────────
  fx('r32a','2026-06-29','18:00','FRA','ECU', 'R32','-','DAL'),
  fx('r32b','2026-06-29','21:00','BEL','NOR', 'R32','-','ATL'),
  fx('r32c','2026-06-29','18:00','BRA','CRO', 'R32','-','MIA'),
  fx('r32d','2026-06-29','21:00','ENG','SCO', 'R32','-','NY'),
  fx('r32e','2026-06-30','18:00','GER','AUS', 'R32','-','SF'),
  fx('r32f','2026-06-30','21:00','NED','CIV', 'R32','-','LA'),
  fx('r32g','2026-06-30','18:00','ESP','IRN', 'R32','-','PHI'),
  fx('r32h','2026-06-30','21:00','USA','SUE', 'R32','-','SEA'),
  fx('r32i','2026-07-01','12:00','MEX','SUI', 'R32','-','GDL'),
  fx('r32j','2026-07-01','15:00','CAN','COL', 'R32','-','TOR'),
  fx('r32k','2026-07-01','18:00','POR','JPN', 'R32','-','BOS', null,'scheduled',{home:1.8,draw:3.6,away:5.0}),
  fx('r32l','2026-07-01','21:00','ARG','SEN', 'R32','-','MIA', null,'scheduled',{home:1.7,draw:3.8,away:5.2}),
  fx('r32m','2026-07-02','18:00','URU','PAR', 'R32','-','MTY'),
  fx('r32n','2026-07-02','21:00','AUT','EGY', 'R32','-','KC'),
  fx('r32o','2026-07-03','18:00','MAR','TUR', 'R32','-','HOU', null,'scheduled',{home:2.2,draw:3.4,away:3.2}),
  fx('r32p','2026-07-03','21:00','KOR','ALG', 'R32','-','DAL'),

  // ── 8es DE FINALE ────────────────────────────────────────────────────────
  fx('r16a','2026-07-04','18:00','FRA','MEX', 'R16','-','NY',  null,'scheduled',{home:1.6,draw:3.9,away:5.8}),
  fx('r16b','2026-07-04','21:00','NED','BEL', 'R16','-','LA',  null,'scheduled',{home:2.3,draw:3.3,away:3.1}),
  fx('r16c','2026-07-05','18:00','BRA','KOR', 'R16','-','MIA', null,'scheduled',{home:1.5,draw:4.0,away:6.5}),
  fx('r16d','2026-07-05','21:00','ENG','AUT', 'R16','-','DAL', null,'scheduled',{home:1.7,draw:3.7,away:5.2}),
  fx('r16e','2026-07-06','18:00','ESP','USA', 'R16','-','HOU', null,'scheduled',{home:2.0,draw:3.5,away:4.0}),
  fx('r16f','2026-07-06','21:00','GER','POR', 'R16','-','SF',  null,'scheduled',{home:2.4,draw:3.3,away:2.9}),
  fx('r16g','2026-07-07','18:00','ARG','CAN', 'R16','-','ATL', null,'scheduled',{home:1.4,draw:4.2,away:7.5}),
  fx('r16h','2026-07-07','21:00','URU','BEL', 'R16','-','PHI', null,'scheduled',{home:2.8,draw:3.3,away:2.5}),

  // ── QUARTS DE FINALE ─────────────────────────────────────────────────────
  fx('qf1','2026-07-09','18:00','FRA','NED',  'QF','-','LA',   null,'scheduled',{home:2.2,draw:3.4,away:3.2}),
  fx('qf2','2026-07-09','21:00','BRA','ENG',  'QF','-','NY',   null,'scheduled',{home:2.0,draw:3.3,away:3.7}),
  fx('qf3','2026-07-10','18:00','ESP','GER',  'QF','-','DAL',  null,'scheduled',{home:2.1,draw:3.4,away:3.5}),
  fx('qf4','2026-07-10','21:00','ARG','URU',  'QF','-','MIA',  null,'scheduled',{home:1.9,draw:3.5,away:4.2}),

  // ── DEMI-FINALES ─────────────────────────────────────────────────────────
  fx('c60','2026-07-14','21:00','FRA','BRA',  'SF','-','NY',   null,'scheduled',{home:2.6,draw:3.3,away:2.7}),
  fx('c61','2026-07-15','21:00','ESP','ARG',  'SF','-','LA',   null,'scheduled',{home:2.4,draw:3.3,away:2.9}),

  // ── 3e PLACE ─────────────────────────────────────────────────────────────
  fx('c70','2026-07-18','18:00','BRA','ESP',  '3RD','-','MIA', null,'scheduled',{home:2.6,draw:3.3,away:2.7}),

  // ── FINALE ───────────────────────────────────────────────────────────────
  fx('c80','2026-07-19','21:00','FRA','ARG',  'F','-','NY',    null,'scheduled',{home:2.7,draw:3.2,away:2.6}),
]

export const STAGE_INFO: Record<string, { label: string; short: string; color: string }> = {
  'MD1':  { label:'Journée 1',     short:'J1',   color:'#0033FF' },
  'MD2':  { label:'Journée 2',     short:'J2',   color:'#0033FF' },
  'MD3':  { label:'Journée 3',     short:'J3',   color:'#0033FF' },
  'R32':  { label:'16es de finale', short:'16es', color:'#6B2FB5' },
  'R16':  { label:'8es de finale',  short:'8es',  color:'#FF0080' },
  'QF':   { label:'Quarts',         short:'QF',   color:'#FF6E00' },
  'SF':   { label:'Demi-finales',   short:'1/2',  color:'#E10600' },
  '3RD':  { label:'3e place',       short:'3e',   color:'#C8FF00' },
  'F':    { label:'FINALE',         short:'F',    color:'#C8FF00' },
}

export const PHASE_ORDER = ['MD1','MD2','MD3','R32','R16','QF','SF','3RD','F']

export function phaseGroup(stage: string) {
  if (['MD1','MD2','MD3'].includes(stage)) return 'GROUPS'
  if (['R32'].includes(stage)) return 'R32'
  if (['R16'].includes(stage)) return 'R16'
  if (['QF'].includes(stage)) return 'QF'
  if (['SF'].includes(stage)) return 'SF'
  if (['3RD','F'].includes(stage)) return 'FINAL'
  return 'GROUPS'
}

// ─── Groups ─────────────────────────────────────────────
export const GROUPS: Record<string, string[]> = {}
TEAMS.forEach(t => {
  if (!GROUPS[t.group]) GROUPS[t.group] = []
  GROUPS[t.group].push(t.code)
})
export const GROUP_LETTERS = Object.keys(GROUPS).sort()

// Tournoi pas encore commencé : tous les standings démarrent à zéro.
// La GroupsView overlay les vrais chiffres depuis /api/standings (API-Football)
// dès qu'ils sont disponibles.
const ZERO_STANDING = { P:0, W:0, D:0, L:0, GF:0, GA:0, Pts:0, GD:0 }

export const STANDINGS: Record<string, { P: number; W: number; D: number; L: number; GF: number; GA: number; Pts: number; GD: number }> = {}
TEAMS.forEach(t => { STANDINGS[t.code] = { ...ZERO_STANDING } })
