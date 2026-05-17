# WC26 HUB

Stats, analyses et pronostics communautaires pour la Coupe du Monde 2026.

🌐 **Prod** : https://wc26-hub-teal.vercel.app

## Commandes

```bash
npm run dev      # Local sur http://localhost:3000
npm run build    # Build de production
npx tsc --noEmit # Vérification TypeScript
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · next/font/local (Archivo + JetBrains Mono) · Supabase + API-Football (plomberie en place, pas encore câblée à l'UI) · Vercel.

## Comprendre le projet

- [CLAUDE.md](./CLAUDE.md) — doc projet complète : architecture SPA, design tokens, mapping ZIP→TSX, statut data
- [docs/superpowers/specs/](./docs/superpowers/specs/) — specs des refontes (le dernier port de design est dans `2026-05-16-wc2026-design-port-design.md`)

## Structure

- `app/` — entrée Next.js (layout, page racine, routes API, OAuth callback)
- `components/wc26/` — tout le design porté du ZIP `WC2026.zip`
- `lib/` — wrapper API-Football + client Supabase serveur (utilisés par les routes API)
- `supabase/001_initial.sql` — schéma de la base
- `public/fonts/` — Archivo + JetBrains Mono en woff2 self-hosted
