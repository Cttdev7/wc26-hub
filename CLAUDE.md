# WC26 HUB — CLAUDE.md

Application web pour la Coupe du Monde 2026 : scores en temps réel, stats, pronostics communautaires et classement.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (config via CSS, pas de tailwind.config.ts)
- **Supabase** : base de données PostgreSQL + authentification
- **API-Football** : données de matchs (100 appels/jour en plan gratuit)
- **Vercel** : hébergement + crons automatiques

## Commandes

```bash
npm run dev      # Serveur local sur http://localhost:3000
npm run build    # Build de production
npx tsc --noEmit # Vérification TypeScript sans compiler
```

## Variables d'environnement (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
API_FOOTBALL_KEY=
CRON_SECRET=wc26hubsecret2026
```

## Structure des fichiers

```
app/
  page.tsx                    # Accueil (hero + matchs + top joueurs)
  layout.tsx                  # Layout global + navbar
  matchs/page.tsx             # Calendrier et scores
  stats/page.tsx              # Classements de groupe + buteurs
  paris/page.tsx              # Pronostics (auth requis)
  classement/page.tsx         # Leaderboard communautaire
  profil/page.tsx             # Profil utilisateur (auth requis)
  profil/login/page.tsx       # Page de connexion
  profil/signup/page.tsx      # Page d'inscription
  profil/logout-button.tsx    # Bouton déconnexion (client)
  auth/callback/route.ts      # Callback OAuth Supabase
  api/matches/sync/route.ts   # Sync matchs depuis API-Football
  api/pronostics/route.ts     # CRUD pronostics
  api/cron/score/route.ts     # Scoring automatique des paris

components/ui/
  navbar.tsx                  # Navigation principale
  match-card.tsx              # Carte d'un match (score/statut)
  pronostic-form.tsx          # Formulaire de pari (client)

lib/
  types.ts                    # Types TypeScript (Match, Pronostic, etc.)
  api-football.ts             # Wrapper API-Football
  supabase/client.ts          # Client Supabase (navigateur)
  supabase/server.ts          # Client Supabase (serveur/SSR)

supabase/
  001_initial.sql             # Schéma SQL à exécuter dans Supabase
```

## Design

Palette identique au fichier `WC26 Hub.standalone.html` :
- Fond : `#0A0A0A`
- Accent (vert fluo) : `#C8FF00`
- Texte : `#FFFFFF`
- Cartes : `#111111`
- Bordures : `#222222`

Utilise des inline styles React (pas de classes Tailwind pour le design principal).

## Base de données Supabase

Tables : `matches`, `profiles`, `pronostics`
Vue : `classement` (ranking calculé automatiquement)

Schéma complet dans `supabase/001_initial.sql`.

## Système de points

| Résultat | Points |
|---|---|
| Score exact | 3 pts |
| Bon vainqueur | 1 pt |
| Mauvais pronostic | 0 pt |

Le scoring est déclenché automatiquement par le cron `/api/cron/score` (toutes les 10 min sur Vercel).

## Synchronisation des matchs

Appel manuel :
```bash
curl -X GET http://localhost:3000/api/matches/sync \
  -H "Authorization: Bearer wc26hubsecret2026"
```

En production, Vercel appelle cette route automatiquement toutes les 6h.

## Déploiement

1. Push sur GitHub
2. Importer sur vercel.com
3. Ajouter les 5 variables d'environnement
4. Configurer les URLs Supabase (Auth > URL Configuration)
5. Lancer la synchro initiale des matchs
