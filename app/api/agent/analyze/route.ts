import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { parseIntent } from '@/lib/agent/match-parser'
import { buildContext } from '@/lib/agent/context-builder'
import { MATCH_PROMPT, TEAM_PROMPT, GENERAL_PROMPT } from '@/lib/agent/system-prompt'

export const runtime = 'nodejs'
export const maxDuration = 30

const FALLBACK_NO_KEY = `⚠️ L'agent IA n'est pas encore configuré.

La clé API Google (GOOGLE_GENERATIVE_AI_API_KEY) n'est pas définie dans .env.local.

Pour l'activer :
1. Récupère une clé gratuite sur https://aistudio.google.com
2. Ajoute-la dans wc26-hub/.env.local : GOOGLE_GENERATIVE_AI_API_KEY=...
3. Relance npm run dev`

const FALLBACK_EMPTY = `Pose-moi une question sur la Coupe du Monde 2026.

Exemples :
- **Match** : "Analyse FRA vs SEN"
- **Équipe** : "Parle-moi du Brésil pour cette Coupe du Monde"
- **Joueur** : "Que penses-tu de Mbappé ?"
- **Général** : "Qui sont les favoris du groupe A ?"`

export async function POST(req: Request) {
  let message = ''
  try {
    const body = await req.json()
    message = typeof body?.message === 'string' ? body.message.trim() : ''
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  if (!message) {
    return textStream(FALLBACK_EMPTY)
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return textStream(FALLBACK_NO_KEY)
  }

  const intent = parseIntent(message)
  const origin = new URL(req.url).origin
  const context = await buildContext(intent, origin)

  const systemPrompt =
    intent.mode === 'match' ? MATCH_PROMPT :
    intent.mode === 'team'  ? TEAM_PROMPT  :
    GENERAL_PROMPT

  const userPrompt = `Question du visiteur : "${message}"

Voici le contexte factuel à utiliser (n'invente rien en dehors) :

${context}

Produis maintenant ta réponse selon le format imposé pour ce mode.`

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.6,
  })

  return result.toTextStreamResponse()
}

function textStream(text: string) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text))
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
