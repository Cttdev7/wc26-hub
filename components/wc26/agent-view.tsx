'use client'

import { PALETTE } from './ui-primitives'

const SUGGESTED = [
  { icon: '⚽', label: 'Analyse le match FRA vs BRA' },
  { icon: '📊', label: 'Qui sont les favoris du groupe A ?' },
  { icon: '🔭', label: 'Prédis le vainqueur de la Coupe du Monde' },
  { icon: '🧠', label: 'Compare Mbappe et Vinicius Jr' },
  { icon: '📅', label: 'Quel match ne pas rater cette semaine ?' },
  { icon: '🏟️', label: 'Quelle équipe a la meilleure défense ?' },
]

export function AgentView() {
  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ borderBottom: '1.5px solid var(--ink)', padding: '32px 32px 24px', maxWidth: 1320, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: PALETTE.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>🤖</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 className="display" style={{ fontSize: 28, margin: 0 }}>Agent IA</h1>
              <span className="chip" style={{ background: PALETTE.lime, color: 'var(--ink)', fontSize: 9 }}>BÊTA</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0', fontWeight: 600 }}>
              Analyse des matchs · Prédictions · Tactique · Stats
            </p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, maxWidth: 1320, margin: '0 auto', width: '100%', padding: '40px 32px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Coming soon banner */}
        <div style={{
          border: '1.5px dashed var(--ink)', borderRadius: 16, padding: '40px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center',
          background: 'var(--paper-2)',
        }}>
          <div style={{ fontSize: 48 }}>🧠</div>
          <div>
            <div className="display" style={{ fontSize: 32, marginBottom: 10 }}>L&apos;agent arrive bientôt</div>
            <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 480, lineHeight: 1.5, margin: 0 }}>
              Un agent IA spécialisé football sera connecté ici pour analyser les matchs en temps réel,
              prédire les résultats et décortiquer les tactiques des 48 équipes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {['Analyse tactique', 'Prédictions', 'Stats avancées', 'Live commentary'].map(tag => (
              <span key={tag} className="chip" style={{ background: 'var(--ink)', color: PALETTE.lime, fontSize: 10 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Suggested prompts */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
            Questions suggérées
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {SUGGESTED.map((s) => (
              <button key={s.label} disabled style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                border: '1.5px solid var(--line)', borderRadius: 12, background: 'var(--paper)',
                cursor: 'not-allowed', textAlign: 'left', opacity: 0.55,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ borderTop: '1.5px solid var(--ink)', padding: '20px 32px', background: 'var(--paper)', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 12,
            border: '1.5px solid var(--ink)', borderRadius: 999, padding: '12px 20px',
            background: 'var(--paper-2)', opacity: 0.55,
          }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>
              Posez votre question à l&apos;agent… (bientôt disponible)
            </span>
          </div>
          <button disabled style={{
            padding: '12px 22px', borderRadius: 999, border: '1.5px solid var(--ink)',
            background: PALETTE.ink, color: PALETTE.lime,
            fontWeight: 800, fontSize: 13, cursor: 'not-allowed', opacity: 0.45, whiteSpace: 'nowrap',
          }}>
            Envoyer →
          </button>
        </div>
        <div style={{ maxWidth: 1320, margin: '8px auto 0', fontSize: 10, color: 'var(--muted)', fontWeight: 600, textAlign: 'center', letterSpacing: '0.04em' }}>
          L&apos;agent IA WC26 peut se tromper. Vérifiez les informations importantes.
        </div>
      </div>
    </div>
  )
}
