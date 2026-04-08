import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/home/lise/Room-Cyber-Awareness/public/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const templateLibrary = [
  { id: 1, name: 'CEO Fraud', desc: 'Faux email d\'un CEO demandant un virement', difficulty: 'hard', category: 'Social Engineering' },
  { id: 2, name: 'LinkedIn Phishing', desc: 'Faux email LinkedIn avec lien de validation', difficulty: 'medium', category: 'Phishing' },
  { id: 3, name: 'Password Reset', desc: 'Email faux réinitialisation de mot de passe', difficulty: 'easy', category: 'Phishing' },
  { id: 4, name: 'Banking Alert', desc: 'Alerte bancaire frauduleuse avec lien malveillant', difficulty: 'medium', category: 'Phishing' },
  { id: 5, name: 'USB Drop', desc: 'Simulation d\'une clé USB trouvée contenant des malwares', difficulty: 'hard', category: 'Physical' },
  { id: 6, name: 'Survey Scam', desc: 'Email d\'enquête client avec demande d\'infos sensibles', difficulty: 'easy', category: 'Social Engineering' },
]

const mockCampaigns = [
  { id: 1, name: 'Phishing Campaign #1', template: 'Password Reset', sent: 145, clicked: 52, reported: 8, status: 'completed', createdAt: '2026-04-01', isAB: false },
  { id: 2, name: 'CEO Fraud Test', template: 'CEO Fraud', sent: 89, clicked: 23, reported: 3, status: 'running', createdAt: '2026-04-05', isAB: false },
  { id: 3, name: 'LinkedIn Awareness', template: 'LinkedIn Phishing', sent: 230, clicked: 45, reported: 12, status: 'completed', createdAt: '2026-03-28', isAB: false },
  {
    id: 4, name: 'Password vs Banking A/B', template: 'Password Reset', templateB: 'Banking Alert',
    sent: 200, clicked: 66, reported: 7, status: 'running', createdAt: '2026-04-03', isAB: true,
    variantA: { sent: 100, clicked: 42, reported: 5 },
    variantB: { sent: 100, clicked: 24, reported: 2 },
  },
]

function ABComparisonCard({ campaign }) {
  const rateA = campaign.variantA ? Math.round((campaign.variantA.clicked / campaign.variantA.sent) * 100) : 0
  const rateB = campaign.variantB ? Math.round((campaign.variantB.clicked / campaign.variantB.sent) * 100) : 0
  const winner = rateA > rateB ? 'A' : rateB > rateA ? 'B' : null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{campaign.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Test A/B en cours · {campaign.sent} emails envoyés</div>
        </div>
        <span style={{ padding: '4px 12px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
          A/B TEST
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { label: 'Variant A', template: campaign.template, data: campaign.variantA, rate: rateA, isWinner: winner === 'A', color: '#3b82f6' },
          { label: 'Variant B', template: campaign.templateB, data: campaign.variantB, rate: rateB, isWinner: winner === 'B', color: '#f59e0b' },
        ].map(v => (
          <div key={v.label} style={{ padding: '16px', background: 'var(--bg-black)', borderRadius: '6px', border: `2px solid ${v.isWinner ? v.color : 'var(--border-subtle)'}`, position: 'relative' }}>
            {v.isWinner && <span style={{ position: 'absolute', top: '-10px', left: '12px', background: v.color, color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>GAGNANT</span>}
            <div style={{ fontWeight: 600, color: v.color, marginBottom: '4px' }}>{v.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>{v.template}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Envoyés</span>
              <span style={{ color: 'var(--text-primary)' }}>{v.data?.sent}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cliqués</span>
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>{v.data?.clicked}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ height: '100%', width: `${v.rate}%`, background: v.color, borderRadius: '3px', transition: 'width 0.8s' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: v.color }}>{v.rate}%</span>
            </div>
          </div>
        ))}
      </div>
      {winner && (
        <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', fontSize: '12px', color: '#22c55e' }}>
          ✓ Variant {winner} est plus efficace — envisagez de déployer ce template sur le reste de l'équipe.
        </div>
      )}
    </div>
  )
}

export default function Campaigns() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [showTemplate, setShowTemplate] = useState(null)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({ name: '', template: '', templateB: '', targets: 'all', schedule: 'now', isAB: false })

  const handleLogout = () => { logout(); navigate('/login') }

  const handleCreateCampaign = () => {
    if (!formData.name || !formData.template) {
      setToast({ msg: 'Veuillez remplir tous les champs', type: 'error' })
      return
    }
    if (formData.isAB && !formData.templateB) {
      setToast({ msg: 'Choisissez un template pour le Variant B', type: 'error' })
      return
    }

    const tplName = templateLibrary.find(t => t.id === parseInt(formData.template))?.name
    const tplBName = formData.isAB ? templateLibrary.find(t => t.id === parseInt(formData.templateB))?.name : null

    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name,
      template: tplName,
      templateB: tplBName,
      sent: 0, clicked: 0, reported: 0,
      status: formData.schedule === 'now' ? 'running' : 'scheduled',
      createdAt: new Date().toISOString().split('T')[0],
      isAB: formData.isAB,
      variantA: formData.isAB ? { sent: 0, clicked: 0, reported: 0 } : null,
      variantB: formData.isAB ? { sent: 0, clicked: 0, reported: 0 } : null,
    }

    setCampaigns([newCampaign, ...campaigns])
    setShowNewCampaign(false)
    setFormData({ name: '', template: '', templateB: '', targets: 'all', schedule: 'now', isAB: false })
    setToast({ msg: `Campagne "${newCampaign.name}" créée !`, type: 'success' })
  }

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id))
    setToast({ msg: 'Campagne supprimée', type: 'success' })
  }

  const abCampaigns = campaigns.filter(c => c.isAB)
  const normalCampaigns = campaigns.filter(c => !c.isAB)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      {/* Navigation */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Dashboard
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '8px' }}>
              🎣 Phishing Campaigns
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Créez et gérez des campagnes de sensibilisation au phishing avec tests A/B
            </p>
          </div>
          <button onClick={() => setShowNewCampaign(true)} className="btn-primary" style={{ padding: '12px 28px' }}>
            ➕ New Campaign
          </button>
        </div>

        {/* A/B Test Results */}
        {abCampaigns.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', marginBottom: '16px' }}>
              TESTS A/B EN COURS
            </h3>
            {abCampaigns.map(c => <ABComparisonCard key={c.id} campaign={c} />)}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Campaigns List */}
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', margin: 0 }}>Campagnes standard</h3>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Campaign</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Sent</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Clicked</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Rate</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Status</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {normalCampaigns.map(campaign => {
                    const clickRate = campaign.sent > 0 ? Math.round((campaign.clicked / campaign.sent) * 100) : 0
                    return (
                      <tr key={campaign.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{campaign.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{campaign.template}</div>
                        </td>
                        <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px' }}>{campaign.sent}</td>
                        <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px', color: 'var(--red)', fontWeight: 600 }}>{campaign.clicked}</td>
                        <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: clickRate > 30 ? 'var(--red)' : clickRate > 10 ? '#f59e0b' : '#22c55e' }}>
                          {clickRate}%
                        </td>
                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', padding: '4px 8px', background: campaign.status === 'running' ? 'rgba(34,197,94,0.2)' : 'rgba(84,84,84,0.2)', color: campaign.status === 'running' ? '#22c55e' : 'var(--text-muted)', borderRadius: '2px' }}>
                            {campaign.status === 'running' ? '🔄 Running' : campaign.status === 'scheduled' ? '📅 Scheduled' : '✓ Completed'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteCampaign(campaign.id)} style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Template Library */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '16px' }}>Template Library</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {templateLibrary.map(template => (
                <div
                  key={template.id}
                  onClick={() => setShowTemplate(template)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(235,40,40,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{template.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{template.desc}</div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: template.difficulty === 'hard' ? 'rgba(235,40,40,0.2)' : template.difficulty === 'easy' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.2)', color: template.difficulty === 'hard' ? 'var(--red)' : template.difficulty === 'easy' ? '#22c55e' : '#f59e0b', borderRadius: '2px', flexShrink: 0, marginLeft: '8px' }}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showNewCampaign} onClose={() => setShowNewCampaign(false)} title="Nouvelle campagne Phishing">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* A/B Toggle */}
          <div style={{ padding: '14px 16px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa', marginBottom: '2px' }}>Mode Test A/B</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Comparez deux templates sur des groupes séparés</div>
            </div>
            <button
              onClick={() => setFormData(f => ({ ...f, isAB: !f.isAB }))}
              style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: formData.isAB ? '#7c3aed' : '#333', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', transition: 'left 0.2s', left: formData.isAB ? '23px' : '3px' }} />
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Nom de la campagne</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-dark" placeholder="ex: CEO Fraud Awareness Q2" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{formData.isAB ? 'Template — Variant A' : 'Template'}</label>
            <select value={formData.template} onChange={e => setFormData({ ...formData, template: e.target.value })} className="input-dark">
              <option value="">Sélectionner un template</option>
              {templateLibrary.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {formData.isAB && (
            <div style={{ padding: '14px', border: '1px dashed rgba(139,92,246,0.4)', borderRadius: '8px', background: 'rgba(139,92,246,0.03)' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a78bfa', marginBottom: '6px' }}>Template — Variant B</label>
              <select value={formData.templateB} onChange={e => setFormData({ ...formData, templateB: e.target.value })} className="input-dark">
                <option value="">Sélectionner le variant B</option>
                {templateLibrary.filter(t => t.id !== parseInt(formData.template)).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                50% des destinataires recevront A, 50% recevront B
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Groupe cible</label>
            <select value={formData.targets} onChange={e => setFormData({ ...formData, targets: e.target.value })} className="input-dark">
              <option value="all">Tous les employés</option>
              <option value="finance">Finance</option>
              <option value="it">IT</option>
              <option value="hr">RH</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Planification</label>
            <select value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} className="input-dark">
              <option value="now">Maintenant</option>
              <option value="tomorrow">Demain matin</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>

          <button onClick={handleCreateCampaign} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            {formData.isAB ? '🧪 Lancer le Test A/B' : '🚀 Créer la campagne'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!showTemplate} onClose={() => setShowTemplate(null)} title={showTemplate?.name || ''}>
        {showTemplate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Catégorie</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>{showTemplate.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Description</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>{showTemplate.desc}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Difficulté</div>
              <div style={{ fontSize: '13px', marginTop: '4px', color: showTemplate.difficulty === 'hard' ? 'var(--red)' : showTemplate.difficulty === 'easy' ? '#22c55e' : '#f59e0b' }}>
                {showTemplate.difficulty.toUpperCase()}
              </div>
            </div>
            <button onClick={() => { setFormData(f => ({ ...f, template: showTemplate.id })); setShowTemplate(null); setShowNewCampaign(true) }} className="btn-primary" style={{ marginTop: '8px' }}>
              Utiliser ce template →
            </button>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
