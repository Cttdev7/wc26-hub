import { NextResponse } from 'next/server'

const FEEDS = [
  { url: 'https://rmcsport.bfmtv.com/rss/football/',    tag: 'RMC SPORT',    color: '#0033FF' },
  { url: 'https://feeds.feedburner.com/sofoot',          tag: 'SO FOOT',      color: '#E10600' },
  { url: 'https://www.footmercato.net/flux-rss',         tag: 'FOOT MERCATO', color: '#FF6E00' },
  { url: 'https://www.lefigaro.fr/rss/figaro_sport.xml', tag: 'LE FIGARO',    color: '#006847' },
]

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  link: string
  pubDate: string
  time: string
  tag: string
  color: string
  image: string | null
}

function cdata(raw: string, tag: string): string {
  const cd = raw.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (cd) return cd[1].trim()
  const plain = raw.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))
  return plain ? plain[1].trim() : ''
}

function extractLink(raw: string): string {
  // BBC uses bare <link>url</link>, others may differ
  const direct = raw.match(/<link>([^<]+)<\/link>/)
  if (direct) return direct[1].trim()
  // Some feeds use <link href="..."/>
  const href = raw.match(/<link[^>]+href="([^"]+)"/)
  return href ? href[1].trim() : ''
}

function extractImage(raw: string): string | null {
  const mc = raw.match(/media:content[^>]+url="([^"]+)"/)
  if (mc) return mc[1]
  const enc = raw.match(/enclosure[^>]+url="([^"]+)"/)
  if (enc) return enc[1]
  const thumb = raw.match(/media:thumbnail[^>]+url="([^"]+)"/)
  if (thumb) return thumb[1]
  // img src inside description
  const img = raw.match(/<img[^>]+src="([^"]+)"/)
  return img ? img[1] : null
}

function relativeTime(pubDate: string): string {
  try {
    const diff = Date.now() - new Date(pubDate).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1) return 'Il y a moins d\'1h'
    if (h < 24) return `Il y a ${h}h`
    const d = Math.floor(h / 24)
    return d === 1 ? 'Hier' : `Il y a ${d}j`
  } catch {
    return ''
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim()
}

function parseItems(xml: string, source: (typeof FEEDS)[0]): NewsItem[] {
  const items: NewsItem[] = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = re.exec(xml)) !== null) {
    const raw = m[1]
    const title = stripHtml(cdata(raw, 'title'))
    if (!title) continue
    const desc = stripHtml(cdata(raw, 'description')).slice(0, 160)
    const link = extractLink(raw)
    const pubDate = cdata(raw, 'pubDate')
    items.push({
      id: link || title,
      title,
      excerpt: desc,
      link,
      pubDate,
      time: relativeTime(pubDate),
      tag: source.tag,
      color: source.color,
      image: extractImage(raw),
    })
  }
  return items
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        next: { revalidate: 900 },
        headers: { 'User-Agent': 'Mozilla/5.0 WC26HUB/1.0' },
      })
      if (!res.ok) throw new Error(`${feed.tag} HTTP ${res.status}`)
      const xml = await res.text()
      return parseItems(xml, feed)
    })
  )

  const WC_KEYWORDS = [
    'coupe du monde','world cup','mundial','wc2026','wc 2026','2026',
    'fifa','équipe de france','bleus','mbappé','mbappe','ronaldo','messi',
    'neymar','haaland','vinicius','lewandowski','salah','kane',
    'qualification','éliminatoires','groupe','phase de groupes',
    'sélection','sélectionneur','coach','entraîneur national',
    'mondial','ballon d\'or','coupe',
  ]

  const isWC = (a: NewsItem) => {
    const text = (a.title + ' ' + a.excerpt).toLowerCase()
    return WC_KEYWORDS.some(kw => text.includes(kw))
  }

  const allArticles = results
    .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => a.pubDate)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  // Prefer WC-related articles; fall back to all if not enough
  const wcArticles = allArticles.filter(isWC)
  const articles = (wcArticles.length >= 4 ? wcArticles : allArticles).slice(0, 6)

  const sources = results.map((r, i) => ({
    tag: FEEDS[i].tag,
    ok: r.status === 'fulfilled',
  }))

  return NextResponse.json({ articles, sources })
}
