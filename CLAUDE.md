# WC26 HUB — CLAUDE.md

Application web pour la Coupe du Monde 2026 : stats, analyses et pronostics communautaires.

> **État au 17 mai 2026** : le visuel a été entièrement refait à partir du design `WC2026.zip` (light éditorial). L'UI tourne en mode SPA avec données factices. Le branchement Supabase / API-Football n'est PAS encore reconnecté à la nouvelle UI — toute la plomberie data existe dans `lib/`, `supabase/` et `app/api/` mais n'est plus appelée par les vues. Voir « Statut data » plus bas.
>
> **Audit post-port (commit `8c16fc2`)** : supprimé `proxy.ts` (middleware Supabase mort), retiré Tailwind (jamais réimporté après le port), supprimé `lib/types.ts` + `lib/supabase/client.ts` (orphelins), lazy-loadé 8 vues lourdes via `next/dynamic`.
>
> **Auth Supabase (commit `b94e4b7`)** : nouveau bouton « Connexion » dans la topbar + vue `auth` (Google OAuth + email/mot de passe) → `components/wc26/auth-view.tsx`. `lib/supabase/client.ts` recréé pour le browser. Session suivie via `onAuthStateChange` dans `<App/>`. Bouton « Profil » + pill points + bouton déconnexion (↪) apparaissent une fois connecté.

## Stack

- **Next.js 16** (App Router) + TypeScript + Turbopack
- **next/font/local** : Archivo, Archivo Black, JetBrains Mono (woff2 dans `public/fonts/`)
- **next/dynamic** : les 8 vues hors-home sont lazy-loadées
- **Supabase** + **API-Football** : présents dans `lib/` et `app/api/` mais non câblés à l'UI actuelle
- **Vercel** : hébergement + crons (cf. `vercel.json`)

(Tailwind / PostCSS ont été retirés à l'audit du 17 mai 2026 — le design s'appuie uniquement sur les CSS vars de `globals.css` + des inline styles.)

## Commandes

```bash
npm run dev      # Local sur http://localhost:3000 (ou 3004 si 3000 pris)
npm run build    # Build de production
npx tsc --noEmit # Vérification TypeScript stricte
```

## Variables d'environnement (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
API_FOOTBALL_KEY=
CRON_SECRET=wc26hubsecret2026
```

## Architecture actuelle (post-port du design)

Le site est un **SPA mono-page** : `app/page.tsx` ne fait que rendre `<App/>` (composant client). La navigation se fait par état React interne `view` dans `<App/>` — l'URL reste sur `/`.

```
app/
  page.tsx                 # Rend <App/> (composant client)
  layout.tsx               # Charge les fonts via next/font/local
  globals.css              # Tokens de design (--paper, --ink, --lime…) + utilities (.display, .mono, .chip, .pill-btn, .card, marquee, pulse)
  api/                     # Routes API conservées (orphelines pour l'instant)
    matches/sync/route.ts  # Sync API-Football → Supabase
    pronostics/route.ts    # CRUD pronostics
    cron/score/route.ts    # Scoring automatique
  auth/callback/route.ts   # OAuth Supabase

components/wc26/           # Tout le design porté 1:1 du ZIP (14 modules JSX → 9 fichiers TSX)
  data.ts                  # Mock data : TEAMS (48 nations), MATCHES, CALENDAR, FEATURED, FEATURED_PULSE,
                           # ANALYSES, FAVORITES, NEWS, MATCH_PROBS, H2H, SQUADS, PROFILE,
                           # TEAM_STATS, LINEUPS, PREDICTORS, GROUPS, STANDINGS, VENUES,
                           # STAGE_INFO, TZ_OFFSET, TZ_LABEL, toParis(), phaseGroup()
  flags.tsx                # SVG drapeaux par code (FRA, BRA, ARG, POR, ESP, ENG, GER, NED, MEX, USA, CAN, JPN)
  ui-primitives.tsx        # Flag, TeamBadge, StatRow, FormDots, Marquee, Pitch, LogoMark, ImagePlaceholder, PALETTE
  main-views.tsx           # HeroFeatured, UpcomingStrip, AnalysesGrid, TeamsView (avec comparateur),
                           # MatchView (avec lineup + paris), PredictionsView, MatchPreviewBlock
  home-sections.tsx        # FavoritesSection, NewsSection
  team-detail.tsx          # TeamDetailView (effectif, infirmerie, agenda…), ProfileView (badges, donut, chart)
  calendar-view.tsx        # CalendarView avec filtres (phase / groupe / équipe), conversions de fuseaux
  groups-view.tsx          # GroupsView (12 poules) + GroupDetail
  live-view.tsx            # LiveView : terrain animé, chat live, paris live, fil du match
  app.tsx                  # <App/> racine : TopBar, Marquee, Footer, CommunityCallout, routing interne

lib/                       # CONSERVÉ mais non utilisé par la nouvelle UI
  types.ts                 # Types Match, Pronostic… (à harmoniser avec components/wc26/data.ts)
  api-football.ts          # Wrapper API-Football
  supabase/client.ts       # Client navigateur
  supabase/server.ts       # Client serveur/SSR

supabase/
  001_initial.sql          # Schéma : matches, profiles, pronostics, vue classement

public/fonts/              # Archivo 900, Archivo Black 400, JetBrains Mono 600 — toutes variantes unicode

docs/superpowers/specs/    # Specs des refontes
  2026-05-16-wc2026-design-port-design.md   # Brief du port de design
```

### Convention SPA importante

- **Une seule URL** : tout est sur `/`. Les vues changent via `setView('home' | 'teams' | 'team' | 'match' | 'calendar' | 'groups' | 'live' | 'predictions' | 'profile')` dans `<App/>`.
- **Pas de routes Next.js** pour `/matchs`, `/stats`, `/paris`, etc. — elles ont été supprimées.
- Si tu dois ajouter une vraie route Next.js (ex : `/auth/login`), c'est un choix d'architecture à valider d'abord.

## Design tokens (light éditorial)

Tous dans `app/globals.css`, exposés en CSS vars :

| Var | Valeur | Usage |
|---|---|---|
| `--paper` | `#FFFFFF` | Fond principal |
| `--paper-2` | `#F4F2EE` | Fond secondaire (lignes, placeholders) |
| `--ink` | `#0A0A0A` | Texte / bordures |
| `--line` | `#E8E4DE` | Bordures discrètes |
| `--muted` | `#6B6660` | Texte secondaire |
| `--lime` | `#C8FF00` | Accent principal (chips, CTA) |
| `--blue` | `#0033FF` | Accent secondaire |
| `--red` | `#E10600` | Live / alerte |
| `--purple` | `#6B2FB5` | Tag tactique |
| `--magenta` | `#FF0080` | Tag communauté |

Aussi exposés en TypeScript via `PALETTE` dans `components/wc26/ui-primitives.tsx`.

**Typo** :
- `.display` → Archivo Black, uppercase, letter-spacing -0.02em — pour les gros titres
- `.mono` → JetBrains Mono — pour les chiffres et codes
- Body par défaut → Archivo

**Composants CSS** : `.chip`, `.pill-btn`, `.pill-btn.solid`, `.card`, `.placeholder`, `.h-scroll`, `.marquee-track`, animation `pulse`.

## Source du design (référence)

Le design original est dans le ZIP **`/Users/clementctt/Downloads/WC2026.zip`** — extrait précédemment dans `/tmp/WC2026_design/WC26-Hub/`. C'est la **source de vérité visuelle**. Pour toute modification de design ou ajout de section :

1. Regarde d'abord si le truc existait déjà dans `/tmp/WC2026_design/WC26-Hub/js/*.jsx`
2. Préserve la palette, la typo, les espacements, les patterns de composants
3. Le port a été **littéral** (option B validée par l'utilisateur) — pas de refactor "idiomatic Next.js" non demandé

Mapping fichier ZIP → fichier TSX :

| ZIP | TSX |
|---|---|
| `js/01-tweaks-panel.jsx` | **non porté** (dev tool de prototypage, retiré volontairement) |
| `js/02-flags.jsx` | `components/wc26/flags.tsx` |
| `js/03-wc26-data.jsx` + `04-…-extra.jsx` + `05-calendar-data.jsx` + `06-groups-data.jsx` | `components/wc26/data.ts` (consolidé) |
| `js/07-ui-primitives.jsx` + `ImagePlaceholder` de `09` | `components/wc26/ui-primitives.tsx` |
| `js/08-main-views.jsx` | `components/wc26/main-views.tsx` |
| `js/09-views-extra.jsx` (Favoris/News) | `components/wc26/home-sections.tsx` |
| `js/10-team-detail.jsx` | `components/wc26/team-detail.tsx` |
| `js/11-calendar-view.jsx` | `components/wc26/calendar-view.tsx` |
| `js/12-groups-view.jsx` | `components/wc26/groups-view.tsx` |
| `js/13-live-view.jsx` | `components/wc26/live-view.tsx` |
| `js/14-app.jsx` | `components/wc26/app.tsx` (TopBar, Footer, CommunityCallout + routing SPA) |

## Statut data (à câbler plus tard)

L'utilisateur a explicitement dit « on verra plus tard » pour le branchement data. Toute la plomberie existe :

- **Auth Supabase** : `app/auth/callback/route.ts`, `lib/supabase/{client,server}.ts` — pas de page login/signup côté UI pour l'instant
- **Sync matchs** : `app/api/matches/sync/route.ts` + cron Vercel toutes les 6h → écrit dans `matches`
- **Pronostics** : `app/api/pronostics/route.ts` (CRUD) + `app/api/cron/score/route.ts` (scoring auto)
- **Schéma DB** : `supabase/001_initial.sql` — tables `matches`, `profiles`, `pronostics` + vue `classement`

Pour reconnecter quand le moment viendra :

1. Décider quelle vue affiche du vrai data (Calendar → `matches` ; Predictions → `pronostics` ; Profil → `profiles` ; Live → API-Football endpoint live)
2. Remplacer les imports de `components/wc26/data.ts` par des fetchs serveur ou des Server Components
3. Garder le mock data en fallback pour les sections sans équivalent en base (News, Analyses, Marquee, FavoritesSection, CommunityCallout)
4. Réintroduire les pages auth (`/profil/login`, `/profil/signup`) sous forme de routes dédiées OU de vues `auth` dans le SPA

## Système de points (rappel data)

| Résultat | Points |
|---|---|
| Score exact | 3 pts |
| Bon vainqueur | 1 pt |
| Mauvais pronostic | 0 pt |

Scoring déclenché par le cron `/api/cron/score` (toutes les 10 min sur Vercel).

## Synchronisation des matchs (rappel data)

```bash
curl -X GET http://localhost:3000/api/matches/sync \
  -H "Authorization: Bearer wc26hubsecret2026"
```

En prod Vercel l'appelle toutes les 6h.

## Déploiement

1. Push sur GitHub
2. Importer sur vercel.com
3. Ajouter les 5 variables d'environnement
4. Configurer les URLs Supabase (Auth > URL Configuration)
5. Lancer la synchro initiale des matchs

## Préférences utilisateur (vibe coding)

- **Ne sait pas coder**, fait du vibe coding avec Claude. Va à l'essentiel, propose des choix clairs, évite le jargon technique gratuit.
- **Veut le design EXACTEMENT identique au ZIP** : pas de réinterprétation, pas de "j'ai amélioré ça au passage". Le ZIP est la vérité.
- **Aime aller vite** : a refusé le brainstorming long et a demandé « implémentation direct » dès qu'il avait validé l'approche.
- **Skill brainstorming superpowers** activé : avant tout vrai travail créatif/changement de design, suivre le flow (questions ciblées, propositions A/B/C, doc de spec). Mais ne pas s'éterniser — l'utilisateur coupe court vite.

## À ne PAS faire

- Repasser le site en dark theme (la décision « light éditorial » a été validée et commitée — voir `707aacd`)
- Recréer les pages `/matchs`, `/stats`, `/paris`, `/classement`, `/profil` en tant que routes Next.js (volontairement supprimées au profit du SPA)
- Remplacer les inline styles par du Tailwind sans demander (le design utilise des inline styles + CSS vars, c'est volontaire)
- Lancer un branchement Supabase sans valider d'abord ce qui doit être câblé (« on verra plus tard » est la consigne actuelle)
- Réintroduire `Math.random()` dans des composants rendus côté serveur (cause une erreur d'hydratation — voir le fix `useId()` dans `ImagePlaceholder`)
