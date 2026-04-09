import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import { sectors } from '../data/sectorScenarios'


const STEPS = [
  { id: 1, label: 'Bienvenue', icon: '👋' },
  { id: 2, label: 'Votre entreprise', icon: '🏢' },
  { id: 3, label: 'Vos employés', icon: '👥' },
  { id: 4, label: 'Premier scénario', icon: '🎯' },
  { id: 5, label: 'C\'est parti !', icon: '🚀' },
]

const SECTORS = ['Finance / Banque', 'Santé', 'Administration publique', 'Éducation', 'Industrie / Manufacturing', 'Commerce / Retail', 'Tech / SaaS', 'Juridique', 'Énergie', 'Transport']
const SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ company: '', sector: '', size: '', emails: '', scenario: 'phishing' })
  const total = STEPS.length

  const next = () => setStep(s => Math.min(s + 1, total))
  const prev = () => setStep(s => Math.max(s - 1, 1))
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const progress = ((step - 1) / (total - 1)) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'var(--text-light)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <button onClick={() => navigate('/admin')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>
          Passer →
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'var(--border-subtle)' }}>
        <div style={{ height: '100%', background: 'var(--red)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '24px 40px 0' }}>
        {STEPS.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              background: step > s.id ? 'var(--red)' : step === s.id ? 'rgba(235,40,40,0.2)' : 'var(--bg-card)',
              border: step === s.id ? '2px solid var(--red)' : step > s.id ? '2px solid var(--red)' : '2px solid var(--border-subtle)',
              transition: 'all 0.3s',
            }}>
              {step > s.id ? '✓' : s.icon}
            </div>
            {s.id < total && <div style={{ width: '32px', height: '1px', background: step > s.id ? 'var(--red)' : 'var(--border-subtle)' }} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '560px', width: '100%' }}>

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>👋</div>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '36px', marginBottom: '16px' }}>
                Bienvenue sur ROOMCA
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                En 5 minutes, votre équipe sera prête à affronter de vraies cyberattaques — en simulation.<br /><br />
                Nous allons configurer votre espace, inviter vos employés et lancer votre premier scénario.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
                {['⚡ 5 minutes de setup', '🎯 1er scénario inclus', '👥 Invitations automatiques'].map(t => (
                  <span key={t} style={{ padding: '6px 14px', background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>{t}</span>
                ))}
              </div>
              <button onClick={next} className="btn-primary" style={{ padding: '14px 48px', fontSize: '15px' }}>Commencer →</button>
            </div>
          )}

          {/* Step 2 — Company info */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', marginBottom: '8px' }}>🏢 Votre entreprise</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>Ces informations permettent d'adapter les scénarios à votre contexte.</p>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>NOM DE L'ENTREPRISE</label>
                <input className="input-dark" placeholder="ACME Corp" value={form.company} onChange={e => set('company', e.target.value)} style={{ fontSize: '15px', padding: '12px 16px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>SECTEUR D'ACTIVITÉ</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {SECTORS.map(s => (
                    <button key={s} onClick={() => set('sector', s)} style={{
                      padding: '10px 14px', background: form.sector === s ? 'rgba(235,40,40,0.12)' : 'var(--bg-card)',
                      border: form.sector === s ? '1px solid var(--red)' : '1px solid var(--border-subtle)',
                      color: form.sector === s ? 'var(--text-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px',
                      borderRadius: '6px', textAlign: 'left', transition: 'all 0.15s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>TAILLE DE L'ÉQUIPE</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {SIZES.map(s => (
                    <button key={s} onClick={() => set('size', s)} style={{
                      flex: 1, padding: '10px', background: form.size === s ? 'rgba(235,40,40,0.12)' : 'var(--bg-card)',
                      border: form.size === s ? '1px solid var(--red)' : '1px solid var(--border-subtle)',
                      color: form.size === s ? 'var(--text-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px',
                      borderRadius: '6px', transition: 'all 0.15s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Employees */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', marginBottom: '8px' }}>👥 Invitez vos employés</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>Entrez les emails de vos collaborateurs. Ils recevront une invitation à rejoindre ROOMCA.</p>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>EMAILS (un par ligne ou séparés par des virgules)</label>
                <textarea
                  placeholder={'marie.dupont@company.com\nthomas.martin@company.com\njulie.bernard@company.com'}
                  value={form.emails}
                  onChange={e => set('emails', e.target.value)}
                  rows={6}
                  style={{ width: '100%', padding: '12px 16px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--mono)', fontSize: '12px', resize: 'vertical', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ padding: '14px 16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', fontSize: '12px', color: '#22c55e' }}>
                ✓ Chaque employé reçoit un lien sécurisé — aucune installation requise
              </div>
              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                💡 Vous pourrez aussi importer depuis un CSV ou ajouter manuellement depuis votre dashboard.
              </div>
            </div>
          )}

          {/* Step 4 — First scenario */}
          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', marginBottom: '8px' }}>🎯 Premier scénario</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Choisissez le scénario à assigner immédiatement à votre équipe.</p>
              {[
                { id: 'phishing', icon: '🎣', name: 'Opération Inbox Zero', desc: 'Phishing email du PDG · 15 min · Intermédiaire', recommended: true },
                { id: 'ransomware', icon: '🔒', name: 'Bureau Compromis', desc: 'Ransomware sur poste · 20 min · Avancé', recommended: false },
                { id: 'social', icon: '🎭', name: 'Ingénierie Sociale', desc: 'Manipulation psychologique · 10 min · Débutant', recommended: false },
              ].map(s => (
                <button key={s.id} onClick={() => set('scenario', s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '16px 20px', marginBottom: '10px',
                  background: form.scenario === s.id ? 'rgba(235,40,40,0.08)' : 'var(--bg-card)',
                  border: form.scenario === s.id ? '2px solid var(--red)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative',
                }}>
                  {s.recommended && <span style={{ position: 'absolute', top: '-8px', right: '12px', background: 'var(--red)', color: '#fff', fontSize: '9px', padding: '2px 8px', fontWeight: 700 }}>RECOMMANDÉ</span>}
                  <span style={{ fontSize: '28px' }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.scenario === s.id ? 'var(--red)' : 'var(--border)'}`, background: form.scenario === s.id ? 'var(--red)' : 'transparent', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}

          {/* Step 5 — Done */}
          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>🚀</div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '16px' }}>
                {form.company || 'Votre espace'} est prêt !
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
                Le scénario a été assigné à vos équipes. Les invitations email sont en route.<br />
                Suivez les résultats en temps réel depuis votre dashboard.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
                {[
                  { icon: '✅', text: 'Espace créé' },
                  { icon: '✅', text: 'Scénario assigné' },
                  { icon: '📧', text: 'Invitations envoyées' },
                  { icon: '📊', text: 'Analytics activées' },
                ].map(i => (
                  <div key={i.text} style={{ display: 'flex', gap: '10px', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                    <span>{i.icon}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{i.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/admin')} className="btn-primary" style={{ padding: '14px 48px', fontSize: '15px' }}>
                Voir mon dashboard →
              </button>
            </div>
          )}

          {/* Navigation buttons */}
          {step < total && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              {step > 1 ? (
                <button onClick={prev} className="btn-secondary" style={{ padding: '10px 24px' }}>← Retour</button>
              ) : <div />}
              {step > 1 && (
                <button onClick={next} className="btn-primary" style={{ padding: '10px 32px' }}>
                  {step === total - 1 ? 'Finaliser 🚀' : 'Continuer →'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
