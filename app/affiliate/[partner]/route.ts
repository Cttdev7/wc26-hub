import { NextResponse } from 'next/server'

// Affiliate link cloaking — the real partner URL never leaves the server.
// Configurez les vraies URLs dans les vars d'env (Vercel > Project > Settings >
// Environment Variables). Le code public n'expose que /affiliate/<slug>.

const AFFILIATE_URLS: Record<string, string> = {
  betclic:  process.env.AFFILIATE_BETCLIC  ?? 'https://www.betclic.fr/',
  winamax:  process.env.AFFILIATE_WINAMAX  ?? 'https://www.winamax.fr/parrain?code=CTTPLL',
  unibet:   process.env.AFFILIATE_UNIBET   ?? 'https://www.unibet.fr/inscription/?campaign=120526&parrain=0E7660EB5C7F9211',
  pmu:      process.env.AFFILIATE_PMU      ?? 'https://www.pmu.fr/',
  fdj:      process.env.AFFILIATE_FDJ      ?? 'https://www.parionssport.fdj.fr/',
  zebet:    process.env.AFFILIATE_ZEBET    ?? 'https://www.zebet.fr/',
  netbet:   process.env.AFFILIATE_NETBET   ?? 'https://www.netbet.fr/',
  bwin:     process.env.AFFILIATE_BWIN     ?? 'https://sports.bwin.fr/',
}

// 302 (temporaire) plutôt que 301 (permanent) — on garde la liberté de
// changer les URLs cibles sans pénalité SEO côté navigateur.
export async function GET(
  request: Request,
  ctx: { params: Promise<{ partner: string }> },
) {
  const { partner } = await ctx.params
  const key = partner.toLowerCase()
  const target = AFFILIATE_URLS[key]
  if (!target) {
    // Slug inconnu → on renvoie vers l'accueil sans erreur visible.
    return NextResponse.redirect(new URL('/', request.url), { status: 302 })
  }
  return NextResponse.redirect(target, { status: 302 })
}
