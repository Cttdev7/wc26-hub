'use client'

import { useEffect, useRef, useState } from 'react'
import { PALETTE, Flag } from './ui-primitives'
import { CALENDAR, type Team, type Match } from './data'
import { parseIntent, type Intent } from '@/lib/agent/match-parser'

const SUGGESTED = [
  { icon: '⚽', label: 'Analyse FRA vs BRA', kind: 'match' },
  { icon: '🇫🇷', label: 'Parle-moi de la France pour cette Coupe du Monde', kind: 'team' },
  { icon: '🧠', label: 'Que penses-tu de Mbappé en 2026 ?', kind: 'player' },
  { icon: '🏆', label: 'Qui sont les favoris pour gagner la WC26 ?', kind: 'general' },
  { icon: '📊', label: 'Analyse Brésil vs Maroc', kind: 'match' },
  { icon: '⚔️', label: 'Compare Lamine Yamal et Vinicius Jr', kind: 'compare' },
]

type ContextInfo =
  | { kind: 'match'; home: Team; away: Team; match: Match | null }
  | { kind: 'team'; team: Team }
  | { kind: 'general' }

type Message = {
  role: 'user' | 'agent'
  text: string
  probs?: Probs | null
  context?: ContextInfo | null
  durationMs?: number | null
}

type Probs = { dom: number; nul: number; ext: number }

function parseProbs(raw: string): { text: string; probs: Probs | null } {
  const re = /```probabilities\s*\n([\s\S]*?)```/i
  const m = raw.match(re)
  if (!m) return { text: raw, probs: null }
  const block = m[1]
  const get = (key: string) => {
    const line = block.match(new RegExp(`${key}\\s*=\\s*(\\d+)`, 'i'))
    return line ? parseInt(line[1], 10) : null
  }
  const dom = get('PROBA_DOM')
  const nul = get('PROBA_NUL')
  const ext = get('PROBA_EXT')
  if (dom == null || nul == null || ext == null) return { text: raw, probs: null }
  const text = raw.replace(re, '').trimEnd()
  return { text, probs: { dom, nul, ext } }
}

function resolveContext(message: string): ContextInfo {
  const intent: Intent = parseIntent(message)
  if (intent.mode === 'match') {
    const match = intent.matchId ? CALENDAR.find(m => m.id === intent.matchId) ?? null : null
    return { kind: 'match', home: intent.home, away: intent.away, match }
  }
  if (intent.mode === 'team') {
    return { kind: 'team', team: intent.team }
  }
  return { kind: 'general' }
}

export function AgentView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function send(text: string) {
    const cleaned = text.trim()
    if (!cleaned || loading) return
    setInput('')

    const context = resolveContext(cleaned)
    const startedAt = performance.now()

    setMessages(prev => [
      ...prev,
      { role: 'user', text: cleaned, context },
      { role: 'agent', text: '', probs: null, context, durationMs: null },
    ])
    setLoading(true)

    try {
      const res = await fetch('/api/agent/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleaned }),
      })

      if (!res.ok || !res.body) {
        appendToLastAgent('⚠️ Une erreur est survenue. Réessaie dans un instant.')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const { text: displayText, probs } = parseProbs(accumulated)
        setMessages(prev => {
          const next = [...prev]
          const lastIdx = next.length - 1
          if (next[lastIdx]?.role === 'agent') {
            next[lastIdx] = { ...next[lastIdx], text: displayText, probs }
          }
          return next
        })
      }

      const durationMs = Math.round(performance.now() - startedAt)
      setMessages(prev => {
        const next = [...prev]
        const lastIdx = next.length - 1
        if (next[lastIdx]?.role === 'agent') {
          next[lastIdx] = { ...next[lastIdx], durationMs }
        }
        return next
      })
    } catch {
      appendToLastAgent('⚠️ Une erreur est survenue. Réessaie dans un instant.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function appendToLastAgent(text: string) {
    setMessages(prev => {
      const next = [...prev]
      const lastIdx = next.length - 1
      if (next[lastIdx]?.role === 'agent') {
        next[lastIdx] = { ...next[lastIdx], text, probs: null }
      }
      return next
    })
  }

  function clearConversation() {
    setMessages([])
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ borderBottom: '1.5px solid var(--ink)', padding: '32px 32px 24px', maxWidth: 1320, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: PALETTE.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 className="display" style={{ fontSize: 28, margin: 0 }}>Agent IA</h1>
                <span className="chip" style={{ background: PALETTE.lime, color: 'var(--ink)', fontSize: 9 }}>BÊTA</span>
                <span className="chip" style={{
                  background: 'var(--ink)', color: PALETTE.lime, fontSize: 9,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: PALETTE.lime,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                  GEMINI 2.5 FLASH
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0', fontWeight: 600 }}>
                Matchs · Équipes · Joueurs · Pronostics chiffrés
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 999,
                border: '1.5px solid var(--ink)', background: 'var(--paper)',
                fontSize: 12, fontWeight: 800, letterSpacing: '0.04em',
                cursor: 'pointer', color: 'var(--ink)', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--paper)' }}
            >
              <span style={{ fontSize: 14 }}>↺</span> Nouvelle analyse
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, maxWidth: 1320, margin: '0 auto', width: '100%',
          padding: '32px 32px 16px', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: 24,
          overflowY: 'auto',
        }}
      >
        {messages.length === 0 && <EmptyState onPick={send} />}

        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            message={m}
            isStreaming={loading && i === messages.length - 1 && m.role === 'agent'}
          />
        ))}
      </div>

      {/* Input bar */}
      <div style={{ borderTop: '1.5px solid var(--ink)', padding: '20px 32px', background: 'var(--paper)', position: 'sticky', bottom: 0 }}>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input) }}
          style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center' }}
        >
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 12,
            border: '1.5px solid var(--ink)', borderRadius: 999, padding: '4px 20px',
            background: 'var(--paper-2)',
          }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Analyse un match, une équipe, un joueur…"
              disabled={loading}
              maxLength={250}
              style={{
                flex: 1, padding: '10px 0', fontSize: 14, fontWeight: 600,
                border: 'none', outline: 'none', background: 'transparent',
                color: 'var(--ink)', fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 22px', borderRadius: 999, border: '1.5px solid var(--ink)',
              background: PALETTE.ink, color: PALETTE.lime,
              fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.45 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Analyse…' : 'Envoyer →'}
          </button>
        </form>
        <div style={{ maxWidth: 1320, margin: '8px auto 0', fontSize: 10, color: 'var(--muted)', fontWeight: 600, textAlign: 'center', letterSpacing: '0.04em' }}>
          Propulsé par Google Gemini 2.5 Flash · L&apos;agent peut se tromper, vérifie les informations importantes.
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <>
      <div style={{
        border: '1.5px solid var(--ink)', borderRadius: 16, padding: '32px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center',
        background: 'var(--paper-2)',
      }}>
        <div style={{ fontSize: 40 }}>🧠</div>
        <div>
          <div className="display" style={{ fontSize: 28, marginBottom: 8 }}>Ton expert WC26</div>
          <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 540, lineHeight: 1.5, margin: 0 }}>
            Pose-moi n&apos;importe quelle question football : analyse pré-match avec probabilités, analyse d&apos;une équipe, focus sur un joueur, comparaison, favoris d&apos;un groupe…
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
          {['Match', 'Équipe', 'Joueur', 'Comparaison', 'Favoris'].map(tag => (
            <span key={tag} className="chip" style={{ background: 'var(--ink)', color: PALETTE.lime, fontSize: 10 }}>{tag}</span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
          Suggestions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SUGGESTED.map((s) => (
            <button
              key={s.label}
              onClick={() => onPick(s.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                border: '1.5px solid var(--line)', borderRadius: 12, background: 'var(--paper)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.background = 'var(--paper-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--paper)' }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function MessageBubble({ message, isStreaming }: { message: Message; isStreaming: boolean }) {
  const isUser = message.role === 'user'
  const ctx = message.context ?? null

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', animation: 'wc26-slide-in 0.3s ease-out' }}>
        <div style={{
          maxWidth: '70%', padding: '12px 18px', borderRadius: 18,
          background: PALETTE.ink, color: 'var(--paper)',
          fontSize: 14, fontWeight: 600, lineHeight: 1.4,
        }}>
          {message.text}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'wc26-slide-in 0.3s ease-out' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12, background: PALETTE.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {ctx?.kind === 'match' && <MatchHeaderCard home={ctx.home} away={ctx.away} match={ctx.match} />}
        {ctx?.kind === 'team' && <TeamHeaderCard team={ctx.team} />}
        {ctx?.kind === 'general' && <GeneralHeaderChip />}

        <div style={{
          padding: '16px 20px', borderRadius: 18,
          border: '1.5px solid var(--line)', background: 'var(--paper)',
          fontSize: 14, lineHeight: 1.6, color: 'var(--ink)',
          marginTop: 12,
        }}>
          {renderAgentText(message.text)}
          {isStreaming && message.text === '' && <TypingDots />}
          {isStreaming && message.text !== '' && <span style={{ opacity: 0.4 }}>▌</span>}
        </div>

        {message.probs && ctx?.kind === 'match' && (
          <ProbsCard probs={message.probs} home={ctx.home} away={ctx.away} />
        )}

        {message.durationMs != null && !isStreaming && (
          <div style={{
            marginTop: 10, fontSize: 10, color: 'var(--muted)',
            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            ⚡ Analysé en {(message.durationMs / 1000).toFixed(1)}s · Gemini 2.5 Flash
          </div>
        )}
      </div>
    </div>
  )
}

function MatchHeaderCard({ home, away, match }: { home: Team; away: Team; match: Match | null }) {
  return (
    <div style={{
      border: '1.5px solid var(--ink)', borderRadius: 14,
      background: 'var(--paper-2)', overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '14px 18px', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <Flag team={home} w={42} h={28} />
          <div style={{ minWidth: 0 }}>
            <div className="display" style={{ fontSize: 22, lineHeight: 1, letterSpacing: '0.02em' }}>{home.code}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {home.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0 8px' }}>
          <span className="display" style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.1em' }}>VS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, justifyContent: 'flex-end' }}>
          <div style={{ minWidth: 0, textAlign: 'right' }}>
            <div className="display" style={{ fontSize: 22, lineHeight: 1, letterSpacing: '0.02em' }}>{away.code}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {away.name}
            </div>
          </div>
          <Flag team={away} w={42} h={28} />
        </div>
      </div>

      {match && (
        <div style={{
          borderTop: '1.5px solid var(--line)',
          padding: '8px 18px',
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>
          {match.group && <span>Groupe {match.group}</span>}
          <span>·</span>
          <span>{formatDateFR(match.date)}</span>
          <span>·</span>
          <span>{match.venue}</span>
        </div>
      )}
    </div>
  )
}

function TeamHeaderCard({ team }: { team: Team }) {
  return (
    <div style={{
      border: '1.5px solid var(--ink)', borderRadius: 14,
      background: 'var(--paper-2)', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px' }}>
        <Flag team={team} w={64} h={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display" style={{ fontSize: 26, lineHeight: 1, letterSpacing: '0.01em' }}>{team.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 6, letterSpacing: '0.04em' }}>
            {team.code} · Groupe {team.group} · Rang FIFA #{team.rank}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {team.form.map((f, i) => (
            <span key={i} style={{
              width: 16, height: 16, borderRadius: 4,
              background: f === 'W' ? PALETTE.lime : f === 'D' ? 'var(--line)' : PALETTE.red,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 900, color: f === 'D' ? 'var(--ink)' : (f === 'W' ? 'var(--ink)' : 'white'),
            }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function GeneralHeaderChip() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px', borderRadius: 999,
      border: '1.5px solid var(--line)', background: 'var(--paper-2)',
      fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'var(--muted)',
    }}>
      <span>💬</span>
      <span>Question ouverte</span>
    </div>
  )
}

function formatDateFR(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
  return `${d} ${months[m - 1]} ${y}`
}

function renderAgentText(text: string) {
  if (!text) return null
  const lines = text.split('\n')
  const blocks: React.ReactNode[] = []
  let para: string[] = []

  const flushPara = (keyPrefix: string) => {
    if (para.length === 0) return
    const joined = para.join(' ').trim()
    if (joined) {
      blocks.push(
        <p key={`p-${keyPrefix}-${blocks.length}`} style={{ margin: '6px 0', lineHeight: 1.6 }}>
          {renderInline(joined, `${keyPrefix}-${blocks.length}`)}
        </p>,
      )
    }
    para = []
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushPara(`l${i}`)
      return
    }
    if (trimmed.startsWith('### ')) {
      flushPara(`l${i}`)
      blocks.push(
        <div key={`h-${i}`} className="display" style={{
          fontSize: 14, fontWeight: 900, letterSpacing: '0.02em',
          marginTop: blocks.length === 0 ? 0 : 18, marginBottom: 6,
        }}>
          {trimmed.replace(/^### /, '')}
        </div>,
      )
      return
    }
    if (/^[-•]\s+/.test(trimmed)) {
      flushPara(`l${i}`)
      blocks.push(
        <div key={`li-${i}`} style={{ display: 'flex', gap: 8, marginLeft: 4, marginBottom: 4 }}>
          <span style={{ color: 'var(--muted)', flexShrink: 0 }}>·</span>
          <span>{renderInline(trimmed.replace(/^[-•]\s+/, ''), `li${i}`)}</span>
        </div>,
      )
      return
    }
    para.push(trimmed)
  })
  flushPara('end')

  return <>{blocks}</>
}

function renderInline(text: string, key: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={`${key}-${i}`} style={{ fontWeight: 800 }}>{p.slice(2, -2)}</strong>
    }
    return <span key={`${key}-${i}`}>{p}</span>
  })
}

function ProbsCard({ probs, home, away }: { probs: Probs; home: Team; away: Team }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50)
    return () => clearTimeout(t)
  }, [])

  const total = probs.dom + probs.nul + probs.ext || 100
  const pctDom = (probs.dom / total) * 100
  const pctNul = (probs.nul / total) * 100
  const pctExt = (probs.ext / total) * 100
  const max = Math.max(probs.dom, probs.nul, probs.ext)

  return (
    <div style={{
      marginTop: 14, padding: 18, borderRadius: 14,
      border: '1.5px solid var(--ink)', background: 'var(--paper-2)',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>📈</span>
        <span>Probabilités</span>
      </div>

      <div style={{
        display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden',
        border: '1.5px solid var(--ink)', marginBottom: 14, position: 'relative',
      }}>
        <div style={{
          width: animated ? `${pctDom}%` : '0%',
          background: PALETTE.lime,
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: 'var(--ink)',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          {pctDom > 12 && `${probs.dom}%`}
        </div>
        <div style={{
          width: animated ? `${pctNul}%` : '0%',
          background: 'var(--line)',
          borderLeft: '1.5px solid var(--ink)', borderRight: '1.5px solid var(--ink)',
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: 'var(--ink)',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          {pctNul > 12 && `${probs.nul}%`}
        </div>
        <div style={{
          width: animated ? `${pctExt}%` : '0%',
          background: PALETTE.blue,
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: 'white',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          {pctExt > 12 && `${probs.ext}%`}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <ProbCell label={home.code} sub="Victoire dom." value={probs.dom} accent={PALETTE.lime} highlight={probs.dom === max} />
        <ProbCell label="Match nul" sub="Égalité" value={probs.nul} accent="var(--muted)" highlight={probs.nul === max} />
        <ProbCell label={away.code} sub="Victoire ext." value={probs.ext} accent={PALETTE.blue} highlight={probs.ext === max} />
      </div>
    </div>
  )
}

function ProbCell({ label, sub, value, accent, highlight }: {
  label: string; sub: string; value: number; accent: string; highlight: boolean
}) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      border: highlight ? '1.5px solid var(--ink)' : '1.5px solid var(--line)',
      background: highlight ? 'var(--paper)' : 'transparent',
      transition: 'border 0.2s, background 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: accent, display: 'inline-block' }} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)' }}>
          {label}
        </span>
      </div>
      <div className="display" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 16, color: 'var(--muted)' }}>%</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <Dot delay={0} />
      <Dot delay={0.2} />
      <Dot delay={0.4} />
    </span>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <span style={{
      width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)',
      animation: `wc26-blink 1s ${delay}s infinite`,
    }} />
  )
}
