# WC26 HUB — CLAUDE.md

Application web pour la Coupe du Monde 2026 : hub communautaire de stats, analyses, pronostics et paris sportifs autour des 48 équipes et 104 matchs du tournoi.

**But du projet** : créer la référence francophone pour suivre la CdM 2026 — live scores, effectifs réels, pronostics entre amis, actu filtrée, et monétisation via l'affiliation paris sportifs.

---

> **État au 18 mai 2026** — Mise à jour du CLAUDE.md après session de branchement data.

## Ce qui est connecté à de vraies données (API-Football + Supabase)

| Feature | Endpoint | Statut |
|---|---|---|
| Scores phase de groupes | `/api/scores` → API-Football | ✅ live, rafraîchi 60s |
| Effectifs joueurs | `/api/squad?code=XXX` → API-Football | ✅ 42 équipes, cache 24h |
| Classement communautaire | `/api/leaderboard` → Supabase | ✅ |
| Pronostics utilisateurs | `/api/predictions` → Supabase | ✅ |
| Stats communauté (KPIs accueil) | `/api/community-stats` → Supabase | ✅ rafraîchi 60s |
| Actu football | `/api/news` → RSS FR (RMC, SoFoot, FootMercato, Figaro) | ✅ cache 15min, filtre WC |
| Scoring automatique | `/api/cron/score` → Supabase | ✅ cron Vercel 23h UTC |
| Auth utilisateur | Supabase OAuth + email | ✅ |

## Ce qui reste en mock data

- `ANALYSES`, `FAVORITES`, `MATCH_PROBS`, `H2H`, `SQUADS` (coach/capitaine/formation/ambiance) pour les équipes sans ID API
- `LINEUPS` (compositions probables) — non connecté à API-Football
- `FEATURED_PULSE` (sondage communauté accueil)
- `NEWS` mock — utilisé en fallback si les RSS échouent

---

## Stack

- **Next.js 16** (App Router) + TypeScript + Turbopack
- **next/font/local** : Archivo, Archivo Black, JetBrains Mono (woff2 dans `public/fonts/`)
- **next/dynamic** : toutes les vues hors-home sont lazy-loadées
- **Supabase** (auth + DB) + **API-Football** (`v3.football.api-sports.io`, clé `API_FOOTBALL_KEY`)
- **Vercel** : hébergement + crons (`vercel.json`)

(Pas de Tailwind — inline styles + CSS vars uniquement, c'est volontaire.)

## Commandes

```bash
npm run dev      # Local sur http://localhost:3000
npm run build    # Build de production
npx tsc --noEmit # Vérification TypeScript stricte
```

## Variables d'environnement (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
API_FOOTBALL_KEY=c796bcca11980bc5fd10a39e9ee1e683
CRON_SECRET=wc26hubsecret2026

AFFILIATE_BETCLIC=https://www.betclic.fr/?aff=TON_ID
AFFILIATE_WINAMAX=https://www.winamax.fr/parrain?code=CTTPLL
AFFILIATE_UNIBET=https://www.unibet.fr/inscription/?campaign=120526&parrain=0E7660EB5C7F9211
AFFILIATE_PMU=https://www.pmu.fr/?aff=TON_ID
```

## Architecture SPA

Le site est un **SPA mono-page** : `app/page.tsx` rend `<App/>`. L'URL reste `/`, la navigation est un état React `view` dans `<App/>`.

```
View = 'home' | 'teams' | 'team' | 'match' | 'calendar' | 'groups'
      | 'live' | 'predictions' | 'prediction' | 'leaderboard'
      | 'betting' | 'agent' | 'profile' | 'auth'
```

```
app/
  page.tsx
  layout.tsx
  globals.css                   # tokens CSS + utilities
  api/
    news/route.ts               # RSS FR (RMC/SoFoot/FootMercato/Figaro) → NewsItem[]
    scores/route.ts             # API-Football scores phase de groupes
    squad/route.ts              # API-Football effectifs → SquadPlayer[]
    community-stats/route.ts    # Supabase stats KPI accueil
    odds/route.ts               # API-Football cotes bookmakers
    predictions/route.ts        # CRUD pronostics Supabase
    leaderboard/route.ts        # Classement Supabase
    cron/score/route.ts         # Scoring auto (cron Vercel)
    matches/sync/route.ts       # Sync API-Football → Supabase
  affiliate/[partner]/route.ts  # Redirection affilié (302, URL masquée)
  auth/callback/route.ts        # OAuth Supabase

components/wc26/
  data.ts           # Mock data : 48 équipes, CALENDAR (104 matchs), GROUPS, etc.
  flags.tsx         # SVG drapeaux
  ui-primitives.tsx # Flag, TeamBadge, StatRow, Pitch, LogoMark, ImagePlaceholder, PALETTE
  app.tsx           # Shell SPA : TopBar (9 onglets), Marquee, Footer, CommunityCallout
  main-views.tsx    # HeroFeatured (FRA · chrono live), UpcomingStrip (CALENDAR trié),
                    # AnalysesGrid, TeamsView, MatchView, PredictionsView
  home-sections.tsx # FavoritesSection, NewsSection (RSS + images réelles)
  team-detail.tsx   # TeamDetailView (joueurs API-Football + photos), ProfileView
  calendar-view.tsx # CalendarView (filtres phase/groupe/équipe, fuseaux horaires)
  groups-view.tsx   # 12 poules + scores live via API-Football (overlay 60s)
  live-view.tsx     # Liste matchs J1 → LiveMatchDetail (terrain, chat, events)
  betting-view.tsx  # 4 partenaires affiliés (Betclic, Winamax, Unibet, PMU)
  agent-view.tsx    # Placeholder Agent IA (à connecter)
  auth-view.tsx     # Login / inscription Supabase
  prediction-view.tsx   # Form pronostic par match
  leaderboard-view.tsx  # Classement complet

lib/
  api-football.ts       # Wrapper base URL API-Football
  supabase/client.ts    # Client navigateur Supabase
  supabase/server.ts    # Client serveur/SSR Supabase
  db-types.ts           # Types Profile, Prediction

supabase/
  001_initial.sql        # Schéma : matches, profiles, pronostics, vue classement
  003_predictions.sql    # Système 5/3/0 + place_prediction + score_prediction
```

## Données clés

### Hero accueil
- Affiche le **premier match de la France** (FRA vs SEN, 15 juin 2026, 15h00 Dallas)
- Chrono "Coup d'envoi dans" calculé dynamiquement depuis la date/heure UTC réelle du match

### Bandeau "Prochains matchs"
- Branché sur `CALENDAR` (104 matchs), trié chronologiquement, filtre `date >= aujourd'hui`
- "Tout le calendrier →" ouvre la vue Calendrier

### Actu football
- 4 flux RSS français : RMC Sport, So Foot, Foot Mercato, Le Figaro Sport
- Filtre WC2026 par mots-clés (coupe du monde, mondial, 2026, FIFA, noms de stars…)
- Images réelles depuis les flux ; fallback placeholder coloré si hotlinking bloqué

### Effectifs équipes (API-Football)
- Route `/api/squad?code=FRA` → `players/squads?team={id}` (cache 24h)
- 42 équipes mappées, affichage photo + numéro + nom + âge + poste
- 6 équipes sans ID connu (USA, CAN, NZL, ECU, COD, CPV) → données mock

### Scores live (API-Football)
- Route `/api/scores` → fixture statistics WC2026
- Overlay dans `GroupsView` rafraîchi toutes les 60s
- Scores live = chiffres rouges + badge LIVE + minutage rouge

### Paris sportifs (affiliés)
- 4 partenaires : Betclic, Winamax, Unibet, PMU
- URLs masquées via `/affiliate/<slug>` → var d'env `AFFILIATE_XXX`
- Disclaimers ANJ obligatoires présents

### Pronostics (jeu communautaire)
- Score exact = 5 pts · Bon vainqueur = 3 pts · Faux = 0
- Verrouillé le jour du match (🔒 affiché dans le calendrier)
- Scoring déclenché par cron Vercel 23h UTC via `score_prediction()`

### Agent IA
- Vue `agent` : placeholder complet (UI chat, suggestions, input grisé)
- À connecter par l'utilisateur ultérieurement

## Système de points

| Résultat | Points |
|---|---|
| Score exact | 5 pts |
| Bon vainqueur | 3 pts |
| Mauvais pronostic | 0 pt |

## Déploiement

- **Local** : `npm run dev` → http://localhost:3000
- **Vercel** : déployer uniquement sur demande explicite de l'utilisateur (jamais de push automatique)
- Variables d'env à ajouter sur Vercel : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `API_FOOTBALL_KEY`, `CRON_SECRET`, `AFFILIATE_*`

## Design tokens (light éditorial)

| Var | Valeur | Usage |
|---|---|---|
| `--paper` | `#FFFFFF` | Fond principal |
| `--paper-2` | `#F4F2EE` | Fond secondaire |
| `--ink` | `#0A0A0A` | Texte / bordures |
| `--line` | `#E8E4DE` | Bordures discrètes |
| `--muted` | `#6B6660` | Texte secondaire |
| `--lime` | `#C8FF00` | Accent principal |
| `--blue` | `#0033FF` | Accent secondaire |
| `--red` | `#E10600` | Live / alerte |
| `--purple` | `#6B2FB5` | Tag tactique |
| `--magenta` | `#FF0080` | Tag communauté |

Aussi disponibles en TypeScript via `PALETTE` dans `ui-primitives.tsx`.

**Typo** : `.display` → Archivo Black · `.mono` → JetBrains Mono · body → Archivo

## À ne PAS faire

- Passer en dark theme (décision validée : light éditorial uniquement)
- Créer des routes Next.js pour `/matchs`, `/stats`, etc. (tout est SPA sur `/`)
- Remplacer les inline styles par Tailwind (volontaire)
- Push sur Vercel sans demande explicite de l'utilisateur
- Réintroduire `Math.random()` côté serveur (cause hydratation — fix `useId()` dans `ImagePlaceholder`)
- Committer sans que l'utilisateur le demande
