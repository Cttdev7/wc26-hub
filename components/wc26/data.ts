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
  { code:'FRA', name:'France',     color:'#0033FF', flag:['#0033FF','#FFFFFF','#E10600'], group:'C', rank: 2, form:['W','W','D','W','W'] },
  { code:'BRA', name:'Brazil',     color:'#FFD400', flag:['#009C3B','#FFD400','#002776'], group:'F', rank: 4, form:['W','D','W','W','L'] },
  { code:'ARG', name:'Argentina',  color:'#75AADB', flag:['#75AADB','#FFFFFF','#75AADB'], group:'A', rank: 1, form:['W','W','W','D','W'] },
  { code:'POR', name:'Portugal',   color:'#006B3F', flag:['#006B3F','#DA291C'], group:'H', rank: 6, form:['W','L','W','W','D'] },
  { code:'ESP', name:'Spain',      color:'#C60B1E', flag:['#C60B1E','#FFC400','#C60B1E'], group:'B', rank: 3, form:['W','W','W','W','W'] },
  { code:'ENG', name:'England',    color:'#E10600', flag:['#FFFFFF','#E10600'], group:'D', rank: 5, form:['W','D','W','L','W'] },
  { code:'GER', name:'Germany',    color:'#0A0A0A', flag:['#0A0A0A','#E10600','#FFD400'], group:'E', rank: 8, form:['D','W','L','W','W'] },
  { code:'NED', name:'Netherlands',color:'#FF6E00', flag:['#AE1C28','#FFFFFF','#21468B'], group:'G', rank: 7, form:['W','W','D','W','L'] },
  { code:'MEX', name:'Mexico',     color:'#006847', flag:['#006847','#FFFFFF','#CE1126'], group:'A', rank: 12, form:['W','L','W','D','W'] },
  { code:'USA', name:'USA',        color:'#0033FF', flag:['#B22234','#FFFFFF','#3C3B6E'], group:'A', rank: 14, form:['D','W','W','L','W'] },
  { code:'CAN', name:'Canada',     color:'#E10600', flag:['#E10600','#FFFFFF','#E10600'], group:'B', rank: 22, form:['L','W','D','W','L'] },
  { code:'JPN', name:'Japan',      color:'#BC002D', flag:['#FFFFFF','#BC002D','#FFFFFF'], group:'D', rank: 15, form:['W','W','W','D','W'] },
]

const TEAMS_EXTRA: Team[] = [
  { code:'KSA', name:'Saudi Arabia', color:'#006C35', flag:['#006C35','#FFFFFF','#006C35'], group:'A', rank:58, form:['L','D','W','L','L'] },
  { code:'NZL', name:'New Zealand',  color:'#000000', flag:['#FFFFFF','#000000','#FFFFFF'], group:'A', rank:103, form:['L','W','L','D','L'] },
  { code:'BEL', name:'Belgium',      color:'#FFD90C', flag:['#000000','#FAE042','#ED2939'], group:'B', rank:11, form:['W','D','W','W','D'] },
  { code:'AUS', name:'Australia',    color:'#00843D', flag:['#0B3E91','#FFFFFF','#E4002B'], group:'B', rank:24, form:['W','L','D','W','D'] },
  { code:'NOR', name:'Norway',       color:'#EF2B2D', flag:['#EF2B2D','#FFFFFF','#002868'], group:'C', rank:18, form:['W','W','W','D','W'] },
  { code:'TUN', name:'Tunisia',      color:'#E70013', flag:['#E70013','#FFFFFF','#E70013'], group:'C', rank:42, form:['L','D','W','L','D'] },
  { code:'CRO', name:'Croatia',      color:'#171796', flag:['#FF0000','#FFFFFF','#171796'], group:'D', rank:9, form:['D','W','W','L','D'] },
  { code:'IRN', name:'Iran',         color:'#239F40', flag:['#239F40','#FFFFFF','#DA0000'], group:'D', rank:21, form:['W','L','W','D','W'] },
  { code:'SEN', name:'Senegal',      color:'#00853F', flag:['#00853F','#FDEF42','#E31B23'], group:'E', rank:19, form:['W','W','D','W','L'] },
  { code:'ECU', name:'Ecuador',      color:'#FFD100', flag:['#FFD100','#0072CE','#EF3340'], group:'E', rank:32, form:['D','W','L','W','D'] },
  { code:'PAN', name:'Panama',       color:'#005AA7', flag:['#005AA7','#FFFFFF','#D21034'], group:'E', rank:38, form:['D','L','W','D','L'] },
  { code:'KOR', name:'Korea Rep.',   color:'#CD2E3A', flag:['#FFFFFF','#CD2E3A','#0047A0'], group:'F', rank:23, form:['W','W','D','L','W'] },
  { code:'CMR', name:'Cameroon',     color:'#007A33', flag:['#007A33','#CE1126','#FCD116'], group:'F', rank:51, form:['L','D','W','L','D'] },
  { code:'PAR', name:'Paraguay',     color:'#D52B1E', flag:['#D52B1E','#FFFFFF','#0038A8'], group:'F', rank:48, form:['D','L','D','W','L'] },
  { code:'SUI', name:'Switzerland',  color:'#D52B1E', flag:['#D52B1E','#FFFFFF','#D52B1E'], group:'G', rank:17, form:['W','D','W','L','W'] },
  { code:'COL', name:'Colombia',     color:'#FCD116', flag:['#FCD116','#003893','#CE1126'], group:'G', rank:13, form:['W','W','D','W','W'] },
  { code:'GHA', name:'Ghana',        color:'#FCD116', flag:['#CE1126','#FCD116','#006B3F'], group:'G', rank:73, form:['L','D','L','W','D'] },
  { code:'URU', name:'Uruguay',      color:'#0038A8', flag:['#FFFFFF','#0038A8','#FFFFFF'], group:'H', rank:14, form:['W','D','W','W','L'] },
  { code:'MAR', name:'Morocco',      color:'#C1272D', flag:['#C1272D','#006233','#C1272D'], group:'H', rank:12, form:['W','W','W','D','W'] },
  { code:'EGY', name:'Egypt',        color:'#CE1126', flag:['#CE1126','#FFFFFF','#000000'], group:'H', rank:35, form:['D','L','W','L','D'] },
  { code:'ITA', name:'Italy',        color:'#0066CC', flag:['#008C45','#FFFFFF','#CD212A'], group:'I', rank:10, form:['W','W','D','W','D'] },
  { code:'SCO', name:'Scotland',     color:'#0065BD', flag:['#0065BD','#FFFFFF','#0065BD'], group:'I', rank:34, form:['W','D','L','W','D'] },
  { code:'NGA', name:'Nigeria',      color:'#008753', flag:['#008753','#FFFFFF','#008753'], group:'I', rank:40, form:['L','W','W','D','L'] },
  { code:'JAM', name:'Jamaica',      color:'#FFD100', flag:['#000000','#FFD100','#009B3A'], group:'I', rank:55, form:['L','L','D','W','L'] },
  { code:'DEN', name:'Denmark',      color:'#C8102E', flag:['#C8102E','#FFFFFF','#C8102E'], group:'J', rank:15, form:['W','D','W','W','D'] },
  { code:'POL', name:'Poland',       color:'#DC143C', flag:['#FFFFFF','#DC143C'], group:'J', rank:28, form:['D','L','W','D','L'] },
  { code:'CIV', name:'Côte d’Ivoire',color:'#FF8200', flag:['#FF8200','#FFFFFF','#009E60'], group:'J', rank:39, form:['W','W','D','L','W'] },
  { code:'CRC', name:'Costa Rica',   color:'#002B7F', flag:['#002B7F','#FFFFFF','#CE1126'], group:'J', rank:50, form:['L','D','L','D','W'] },
  { code:'TUR', name:'Türkiye',      color:'#E30A17', flag:['#E30A17','#FFFFFF','#E30A17'], group:'K', rank:25, form:['W','D','W','L','W'] },
  { code:'AUT', name:'Austria',      color:'#ED2939', flag:['#ED2939','#FFFFFF','#ED2939'], group:'K', rank:26, form:['D','W','D','W','L'] },
  { code:'CHI', name:'Chile',        color:'#D52B1E', flag:['#FFFFFF','#0033A0','#D52B1E'], group:'K', rank:43, form:['L','D','W','L','D'] },
  { code:'QAT', name:'Qatar',        color:'#8A1538', flag:['#8A1538','#FFFFFF','#8A1538'], group:'K', rank:60, form:['L','L','D','L','W'] },
  { code:'SUE', name:'Sweden',       color:'#006AA7', flag:['#006AA7','#FECC00','#006AA7'], group:'L', rank:27, form:['W','D','W','D','W'] },
  { code:'PER', name:'Peru',         color:'#D91023', flag:['#D91023','#FFFFFF','#D91023'], group:'L', rank:33, form:['D','L','W','D','L'] },
  { code:'ALG', name:'Algeria',      color:'#006233', flag:['#006233','#FFFFFF','#D21034'], group:'L', rank:37, form:['W','D','L','W','D'] },
  { code:'HON', name:'Honduras',     color:'#0073CF', flag:['#0073CF','#FFFFFF','#0073CF'], group:'L', rank:78, form:['L','D','L','W','L'] },
]

// Group reassignment for the existing 12 teams (from 04-wc26-data-extra.jsx)
const GROUP_ASSIGN: Record<string, string> = {
  ARG:'A', MEX:'A',
  ESP:'B', CAN:'B',
  FRA:'C', USA:'C',
  ENG:'D', JPN:'D',
  GER:'E',
  BRA:'F',
  NED:'G',
  POR:'H',
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
    '17 Maxence Lacroix','20 Désiré Doué','9 Marcus Thuram','13 N’Golo Kanté',
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
  { tag:'DATA',       color:'#0033FF', title:'xG cumulé : l’Espagne creuse l’écart, l’Allemagne stagne', author:'M. Ortega', read:'4 min' },
  { tag:'JOUEUR',     color:'#E10600', title:'Endrick, 19 ans : la courbe de progression la plus folle du tournoi', author:'R. Pinto', read:'6 min' },
  { tag:'COMMUNAUTÉ', color:'#FF0080', title:'Le crowd s’est trompé 64% du temps sur les matchs serrés. Pourquoi ?', author:'Équipe HUB', read:'5 min' },
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
  { id:'n1', tag:'TRANSFERTS', color:'#E10600', title:'Mbappé prolonge avec les Bleus jusqu’en 2030, prime de capitanat record', excerpt:'Le capitaine de l’équipe de France a renouvelé son contrat moral avec la FFF avant l’entrée en lice à Dallas.', time:'il y a 2 h', views:'24.3k', img:'team', team:'FRA' },
  { id:'n2', tag:'BLESSURE', color:'#FF6E00', title:'Pedri forfait pour le premier tour : un séisme pour l’Espagne', excerpt:'Le milieu du Barça souffre d’une lésion du biceps fémoral. De la Fuente convoque Aleix García en urgence.', time:'il y a 4 h', views:'18.9k', img:'medical', team:'ESP' },
  { id:'n3', tag:'TACTIQUE', color:'#6B2FB5', title:'Pourquoi Dorival Júnior va titulariser Endrick au lieu de Vini Jr ce soir', excerpt:'La presse brésilienne révèle les choix surprises du sélectionneur avant le choc contre la France.', time:'il y a 6 h', views:'15.2k', img:'tactical', team:'BRA' },
  { id:'n4', tag:'COULISSES', color:'#FF0080', title:'Ambiance ultra-tendue dans le vestiaire portugais après une dispute Ronaldo-Bruno', excerpt:'Un échange musclé en demi-finale du dernier rassemblement aurait fissuré le groupe avant le tournoi.', time:'il y a 8 h', views:'12.7k', img:'locker', team:'POR' },
  { id:'n5', tag:'DATA', color:'#0033FF', title:'Les 7 statistiques qui prouvent que l’Argentine est encore plus forte qu’en 2022', excerpt:'xG, pressing, transitions : tout indique que la Albiceleste tient sa meilleure équipe depuis Maradona.', time:'il y a 12 h', views:'11.4k', img:'data', team:'ARG' },
  { id:'n6', tag:'JEUNE', color:'#C8FF00', title:'Lamine Yamal, 18 ans : portrait du futur Ballon d’Or selon Xavi', excerpt:'L’ailier du Barça est entré dans une dimension nouvelle. Comment la Roja a construit son crack.', time:'hier', views:'10.1k', img:'portrait', team:'ESP' },
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
      { num:13, name:'N’Golo Kanté',pos:'MID',age:35, club:'Al-Ittihad',form:72 },
      { num:11, name:'Michael Olise',   pos:'MID',age:24, club:'Bayern',    form:89 },
      { num:10, name:'Kylian Mbappé',   pos:'FWD',age:27, club:'Real Madrid',form:92, captain:true },
      { num: 7, name:'Ousmane Dembélé', pos:'FWD',age:28, club:'PSG',       form:85 },
      { num:22, name:'Hugo Ekitiké',    pos:'FWD',age:23, club:'Liverpool', form:80 },
      { num: 9, name:'Marcus Thuram',   pos:'FWD',age:28, club:'Inter',     form:74 },
      { num:24, name:'Rayan Cherki',    pos:'MID',age:22, club:'Man City',  form:88 },
    ],
    news:[
      { tag:'EFFECTIF',  title:'Cherki annoncé titulaire surprise face au Brésil', time:'il y a 2 h' },
      { tag:'BLESSURE',  title:'Tchouaméni à l’infirmerie : décision finale demain matin', time:'il y a 5 h' },
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
      { tag:'TACTIQUE', title:'Endrick titulaire face à la France, Vini repositionné', time:'il y a 3 h' },
      { tag:'AMBIANCE', title:'Samba dans le bus de l’équipe avant le départ pour Dallas', time:'il y a 1 j' },
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

const teamCodes = ['FRA','BRA','ARG','POR','ESP','ENG','GER','NED','MEX','USA','CAN','JPN']
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
  SF:  { city:'San Francisco',stadium:'Levi’s Stadium' },
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
  fx('c1',  '2026-06-11','20:00','MEX','JPN','MD1','A','MEX', '3-1','finished'),
  fx('c2',  '2026-06-12','18:00','CAN','GER','MD1','B','TOR', '1-2','finished'),
  fx('c3',  '2026-06-12','21:00','USA','NED','MD1','C','LA',  '2-2','finished'),
  fx('c4',  '2026-06-13','18:00','ESP','POR','MD1','D','NY',  '1-0','finished'),
  fx('c5',  '2026-06-14','15:00','ARG','JPN','MD1','A','LA',  '2-0','finished'),
  fx('c6',  '2026-06-15','21:00','ENG','ARG','MD1','E','MIA'),
  fx('c7',  '2026-06-15','18:00','GER','BRA','MD1','F','PHI'),
  fx('m1', '2026-06-18','21:00','POR','ARG','MD2','A','LA',  null,'scheduled',{home:3.2,draw:3.4,away:2.1}),
  fx('m2', '2026-06-19','18:00','BRA','FRA','MD1','F','DAL', null,'scheduled',{home:2.6,draw:3.3,away:2.7}),
  fx('m3', '2026-06-20','15:00','ESP','GER','MD2','B','NY',  null,'scheduled',{home:2.1,draw:3.4,away:3.3}),
  fx('m4', '2026-06-21','21:00','ENG','JPN','MD1','D','ATL', null,'scheduled',{home:1.5,draw:4.2,away:5.8}),
  fx('m5', '2026-06-22','18:00','NED','MEX','MD1','G','TOR', null,'scheduled',{home:1.9,draw:3.5,away:4.0}),
  fx('m6', '2026-06-23','21:00','USA','CAN','MD3','A','VAN', null,'scheduled',{home:2.0,draw:3.4,away:3.7}),
  fx('c10','2026-06-23','18:00','ESP','MEX','MD2','D','HOU',  null,'scheduled',{home:1.9,draw:3.4,away:4.2}),
  fx('c11','2026-06-23','21:00','POR','ENG','MD2','D','DAL',  null,'scheduled',{home:3.0,draw:3.3,away:2.4}),
  fx('c12','2026-06-24','15:00','ARG','MEX','MD2','A','MEX',  null,'scheduled',{home:1.7,draw:3.6,away:5.0}),
  fx('c13','2026-06-24','18:00','BRA','CAN','MD2','F','ATL',  null,'scheduled',{home:1.4,draw:4.4,away:7.5}),
  fx('c14','2026-06-25','21:00','FRA','USA','MD2','C','SEA',  null,'scheduled',{home:1.6,draw:3.8,away:5.5}),
  fx('c15','2026-06-25','18:00','GER','JPN','MD2','E','KC',   null,'scheduled',{home:1.8,draw:3.5,away:4.4}),
  fx('c16','2026-06-25','21:00','NED','POR','MD2','G','BOS',  null,'scheduled',{home:2.3,draw:3.4,away:3.1}),
  fx('c20','2026-06-27','21:00','FRA','MEX','MD3','C','MIA',  null,'scheduled',{home:1.6,draw:3.9,away:5.4}),
  fx('c21','2026-06-27','21:00','BRA','ARG','MD3','F','NY',   null,'scheduled',{home:2.7,draw:3.3,away:2.6}),
  fx('c22','2026-06-28','18:00','ENG','GER','MD3','E','PHI',  null,'scheduled',{home:2.5,draw:3.3,away:2.8}),
  fx('c23','2026-06-28','15:00','ESP','NED','MD3','B','GDL',  null,'scheduled',{home:2.0,draw:3.4,away:3.7}),
  fx('c30','2026-07-01','18:00','ESP','JPN','R32','-','HOU',  null,'scheduled',{home:1.5,draw:4.0,away:6.5}),
  fx('c31','2026-07-01','21:00','FRA','POR','R32','-','MTY',  null,'scheduled',{home:2.1,draw:3.4,away:3.4}),
  fx('c32','2026-07-02','18:00','BRA','USA','R32','-','BOS',  null,'scheduled',{home:1.4,draw:4.4,away:7.0}),
  fx('c33','2026-07-02','21:00','ARG','NED','R32','-','DAL',  null,'scheduled',{home:2.0,draw:3.3,away:3.7}),
  fx('c34','2026-07-03','18:00','ENG','CAN','R32','-','KC',   null,'scheduled',{home:1.4,draw:4.5,away:7.5}),
  fx('c35','2026-07-03','21:00','GER','MEX','R32','-','MEX',  null,'scheduled',{home:2.3,draw:3.4,away:3.1}),
  fx('c40','2026-07-06','18:00','ESP','FRA','R16','-','NY',   null,'scheduled',{home:2.4,draw:3.3,away:2.9}),
  fx('c41','2026-07-06','21:00','BRA','ARG','R16','-','LA',   null,'scheduled',{home:2.6,draw:3.3,away:2.7}),
  fx('c42','2026-07-07','18:00','ENG','GER','R16','-','MIA',  null,'scheduled',{home:2.5,draw:3.3,away:2.8}),
  fx('c43','2026-07-07','21:00','POR','NED','R16','-','SF',   null,'scheduled',{home:2.4,draw:3.3,away:2.9}),
  fx('c50','2026-07-10','18:00','FRA','ARG','QF','-','DAL',   null,'scheduled',{home:2.7,draw:3.2,away:2.6}),
  fx('c51','2026-07-10','21:00','BRA','GER','QF','-','PHI',   null,'scheduled',{home:2.3,draw:3.3,away:3.1}),
  fx('c52','2026-07-11','18:00','ESP','ENG','QF','-','HOU',   null,'scheduled',{home:2.2,draw:3.3,away:3.3}),
  fx('c53','2026-07-11','21:00','POR','NED','QF','-','ATL',   null,'scheduled',{home:2.5,draw:3.3,away:2.8}),
  fx('c60','2026-07-14','21:00','FRA','BRA','SF','-','NY',    null,'scheduled',{home:2.6,draw:3.3,away:2.7}),
  fx('c61','2026-07-15','21:00','ESP','ARG','SF','-','LA',    null,'scheduled',{home:2.4,draw:3.3,away:2.9}),
  fx('c70','2026-07-18','18:00','BRA','ESP','3RD','-','MIA',  null,'scheduled',{home:2.6,draw:3.3,away:2.7}),
  fx('c80','2026-07-19','21:00','FRA','ARG','F','-','NY',     null,'scheduled',{home:2.7,draw:3.2,away:2.6}),
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

function buildStanding(posInGroup: number) {
  const stories = [
    { P:2, W:2, D:0, L:0, GF:5, GA:1 },
    { P:2, W:1, D:1, L:0, GF:3, GA:1 },
    { P:1, W:0, D:1, L:0, GF:1, GA:1 },
    { P:2, W:0, D:0, L:2, GF:0, GA:4 },
  ]
  const base = stories[Math.min(posInGroup, 3)]
  const Pts = base.W*3 + base.D
  const GD = base.GF - base.GA
  return { ...base, Pts, GD }
}

export const STANDINGS: Record<string, { P: number; W: number; D: number; L: number; GF: number; GA: number; Pts: number; GD: number }> = {}
GROUP_LETTERS.forEach(g => {
  const ordered = [...GROUPS[g]].sort((a,b) => {
    const ta = TEAMS.find(t => t.code===a)
    const tb = TEAMS.find(t => t.code===b)
    return (ta?.rank || 99) - (tb?.rank || 99)
  })
  ordered.forEach((code, i) => {
    STANDINGS[code] = buildStanding(i)
  })
})
