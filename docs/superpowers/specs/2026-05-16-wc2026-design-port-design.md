# Port du design WC2026 vers wc26-hub

## Objectif

Rendre le site **wc26-hub** (Next.js) visuellement identique au design fourni dans `WC2026.zip`. Focus exclusif sur le visuel et la structure des vues — la connexion aux vraies données (Supabase, API-Football) sera traitée dans un second temps.

## Décisions validées

| Décision | Choix |
|---|---|
| Thème | **Light éditorial** (paper `#FFFFFF`, ink `#0A0A0A`, lime `#C8FF00`) — pas le dark actuel |
| Périmètre | **Port complet** — toutes les vues du ZIP (home, teams, team detail, match detail, calendar, groups, live, predictions, profile) |
| Approche technique | **Port littéral (option B)** — copie 1:1 des 14 modules JSX en TSX, structure préservée |
| Données | **Mock data du ZIP** comme source de vérité — branchement Supabase / API-Football traité plus tard |
| Routing | **SPA interne** — état `view` dans `<App/>`, l'URL reste sur `/` (identique au design) |

## Architecture cible

```
wc26-hub/
├── app/
│   ├── page.tsx              ← rend <App/> (client component)
│   ├── layout.tsx            ← fonts Archivo + Archivo Black + JetBrains Mono via next/font/local
│   ├── globals.css           ← styles.css du ZIP (sans les @font-face — gérés par next/font)
│   ├── favicon.ico
│   └── api/                  ← routes laissées intactes (orphelines pour l'instant)
│       ├── matches/sync/route.ts
│       ├── pronostics/route.ts
│       └── cron/score/route.ts
├── components/wc26/          ← 14 modules .tsx, mapping 1:1 avec js/*.jsx du ZIP
│   ├── tweaks-panel.tsx      ← ex 01-tweaks-panel.jsx
│   ├── flags.tsx             ← ex 02-flags.jsx
│   ├── wc26-data.ts          ← ex 03-wc26-data.jsx (data, pas de JSX)
│   ├── wc26-data-extra.ts    ← ex 04-wc26-data-extra.jsx
│   ├── calendar-data.ts      ← ex 05-calendar-data.jsx
│   ├── groups-data.ts        ← ex 06-groups-data.jsx
│   ├── ui-primitives.tsx     ← ex 07-ui-primitives.jsx (TopBar, Marquee, Footer, Flag, chips, etc.)
│   ├── main-views.tsx        ← ex 08-main-views.jsx (HeroFeatured, UpcomingStrip, FavoritesSection…)
│   ├── views-extra.tsx       ← ex 09-views-extra.jsx
│   ├── team-detail.tsx       ← ex 10-team-detail.jsx
│   ├── calendar-view.tsx     ← ex 11-calendar-view.jsx
│   ├── groups-view.tsx       ← ex 12-groups-view.jsx
│   ├── live-view.tsx         ← ex 13-live-view.jsx
│   └── app.tsx               ← ex 14-app.jsx — racine <App/> avec routing interne
└── public/fonts/             ← woff2 du ZIP recopiés
    ├── archivo-900-latin.woff2
    ├── archivo-900-latin-ext.woff2
    ├── archivo-900-vietnamese.woff2
    ├── archivo-black-400-latin.woff2
    ├── archivo-black-400-latin-ext.woff2
    └── jetbrains-mono-600-*.woff2 (toutes les variantes)
```

## Conversions à appliquer pendant le port

1. **`.jsx` → `.tsx`** : renommer chaque fichier. Pas de typage strict pour aller vite — utiliser `any` où nécessaire, types simples pour les structures de données (équipe, match).
2. **`'use client'`** : ajouter en tête de tout fichier qui utilise `useState`, `useEffect`, `useRef` ou des event handlers (la plupart des composants UI).
3. **`window.X` → `import`** : remplacer le partage de variables globales par des imports ES propres (les fichiers de data exportent `TEAMS`, `MATCHES`, `FEATURED`, etc.).
4. **`const { useState } = React;`** → `import { useState } from 'react'`.
5. **CSS** : copier le contenu de `styles.css` (à partir de la section `:root`, pas les `@font-face`) dans `globals.css`. Les variables CSS (`--ink`, `--paper`, `--lime`, etc.) restent identiques.
6. **Fonts** : déclarer Archivo (400/500/600/700/900), Archivo Black (400), JetBrains Mono (600) via `next/font/local`, injecter les classes dans `<body>` du `layout.tsx`.

## Vues et routage

L'URL reste `/`. La navigation se fait par état interne `view` dans `<App/>` (identique au ZIP) :

| `view` | Composant rendu |
|---|---|
| `home` | `HeroFeatured` + `UpcomingStrip` + `FavoritesSection` + `NewsSection` + `AnalysesGrid` + `CommunityCallout` |
| `teams` | `TeamsView` |
| `team` | `TeamDetailView` (paramètre `teamCode`) |
| `match` | `MatchView` (paramètre `matchId`) |
| `calendar` | `CalendarView` |
| `groups` | `GroupsView` |
| `live` | `LiveView` |
| `predictions` | `PredictionsView` |
| `profile` | `ProfileView` |

Le `TopBar` et le `Marquee` sont rendus systématiquement (sauf si désactivés via le `TweaksPanel`).

## Ce qui est supprimé / remplacé

- **Remplacé** : `app/page.tsx`, `app/matchs/`, `app/stats/`, `app/paris/`, `app/classement/`, `app/profil/page.tsx`, `app/profil/login/`, `app/profil/signup/`, `app/profil/logout-button.tsx`, `app/globals.css`.
- **Conservé tel quel** : `app/api/**`, `app/auth/**`, `lib/**`, `supabase/**`, `next.config.ts`, `package.json`, `tsconfig.json`, `vercel.json`. Ces fichiers servent au branchement data futur, ils ne sont juste pas appelés par la nouvelle UI.
- **Composants UI existants** (`components/ui/navbar.tsx`, `components/ui/match-card.tsx`, `components/ui/pronostic-form.tsx`) : supprimés, remplacés par les composants du design.

## Critères de réussite

1. `npm run dev` lance le site sur `localhost:3000` sans erreur.
2. La page rendue est visuellement indistinguable de `WC26 Hub.standalone.html` ouvert en local.
3. Les fonts Archivo / Archivo Black / JetBrains Mono sont chargées (pas de fallback système visible).
4. Toutes les vues internes du design sont navigables (clic sur TopBar, clic sur match, clic sur drapeau d'équipe, retour).
5. Le panneau `Tweaks` (couleurs, marquee) fonctionne et applique les changements en live.
6. `npx tsc --noEmit` passe sans erreur bloquante.

## Hors périmètre (pour plus tard)

- Branchement Supabase (auth, pronostics, classement).
- Branchement API-Football (matchs réels).
- Pages `/login`, `/signup` (le design n'a pas de page auth — à imaginer dans une itération suivante).
- SEO / metadata par vue (l'app étant SPA, c'est une refonte à part).
- Responsive mobile fin (le design est principalement desktop — on garde son comportement actuel).
