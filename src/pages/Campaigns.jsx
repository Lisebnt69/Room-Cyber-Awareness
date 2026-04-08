import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '../components/Logo'
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
  { id: 1, name: 'Phishing Campaign #1', template: 'Password Reset', sent: 145, clicked: 52, reported: 8, status: 'completed', createdAt: '2026-04-01' },
  { id: 2, name: 'CEO Fraud Test', template: 'CEO Fraud', sent: 89, clicked: 23, reported: 3, status: 'running', createdAt: '2026-04-05' },
  { id: 3, name: 'LinkedIn Awareness', template: 'LinkedIn Phishing', sent: 230, clicked: 45, reported: 12, status: 'completed', createdAt: '2026-03-28' },
]

export default function Campaigns() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [showTemplate, setShowTemplate] = useState(null)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({ name: '', template: '', targets: 'all', schedule: 'now' })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCreateCampaign = () => {
    if (!formData.name || !formData.template) {
      setToast({ msg: 'Veuillez remplir tous les champs', type: 'error' })
      return
    }

    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name,
      template: templateLibrary.find(t => t.id === parseInt(formData.template))?.name,
      sent: 0,
      clicked: 0,
      reported: 0,
      status: formData.schedule === 'now' ? 'running' : 'scheduled',
      createdAt: new Date().toISOString().split('T')[0]
    }

    setCampaigns([newCampaign, ...campaigns])
    setShowNewCampaign(false)
    setFormData({ name: '', template: '', targets: 'all', schedule: 'now' })
    setToast({ msg: `Campaign "${newCampaign.name}" created!`, type: 'success' })
  }

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id))
    setToast({ msg: 'Campaign deleted', type: 'success' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      {/* Navigation */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <Logo size="sm" />
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '8px' }}>
              🎣 Phishing Campaigns
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Créez et gérez des campagnes de sensibilisation au phishing
            </p>
          </div>
          <button onClick={() => setShowNewCampaign(true)} className="btn-primary" style={{ padding: '12px 28px' }}>
            ➕ New Campaign
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          {/* Campaigns List */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', margin: 0 }}>Recent Campaigns</h3>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Campaign</th>
                    <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Sent</th>
                    <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Clicked</th>
                    <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Rate</th>
                    <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Status</th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => {
                    const clickRate = campaign.sent > 0 ? Math.round((campaign.clicked / campaign.sent) * 100) : 0
                    return (
                      <tr key={campaign.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 24px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{campaign.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{campaign.template}</div>
                        </td>
                        <td style={{ padding: '12px 24px', textAlign: 'center', fontSize: '13px' }}>{campaign.sent}</td>
                        <td style={{ padding: '12px 24px', textAlign: 'center', fontSize: '13px', color: 'var(--red)', fontWeight: 600 }}>{campaign.clicked}</td>
                        <td style={{ padding: '12px 24px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: clickRate > 30 ? 'var(--red)' : clickRate > 10 ? '#f59e0b' : '#22c55e' }}>
                          {clickRate}%
                        </td>
                        <td style={{ padding: '12px 24px', textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', padding: '4px 8px', background: campaign.status === 'running' ? 'rgba(34,197,94,0.2)' : 'rgba(84,84,84,0.2)', color: campaign.status === 'running' ? '#22c55e' : 'var(--text-muted)', borderRadius: '2px' }}>
                            {campaign.status === 'running' ? '🔄 Running' : campaign.status === 'scheduled' ? '📅 Scheduled' : '✓ Completed'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 24px', textAlign: 'right' }}>
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
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    padding: '16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(235,40,40,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{template.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{template.desc}</div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: template.difficulty === 'hard' ? 'rgba(235,40,40,0.2)' : 'rgba(245,158,11,0.2)', color: template.difficulty === 'hard' ? 'var(--red)' : '#f59e0b', borderRadius: '2px' }}>
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
      <Modal isOpen={showNewCampaign} onClose={() => setShowNewCampaign(false)} title="New Phishing Campaign">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="input-dark"
              placeholder="e.g., CEO Fraud Awareness"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Template</label>
            <select
              value={formData.template}
              onChange={e => setFormData({ ...formData, template: e.target.value })}
              className="input-dark"
            >
              <option value="">Select a template</option>
              {templateLibrary.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Target Group</label>
            <select
              value={formData.targets}
              onChange={e => setFormData({ ...formData, targets: e.target.value })}
              className="input-dark"
            >
              <option value="all">All Employees</option>
              <option value="finance">Finance Department</option>
              <option value="it">IT Department</option>
              <option value="hr">HR Department</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Schedule</label>
            <select
              value={formData.schedule}
              onChange={e => setFormData({ ...formData, schedule: e.target.value })}
              className="input-dark"
            >
              <option value="now">Send Now</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <button onClick={handleCreateCampaign} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
            Create Campaign
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!showTemplate} onClose={() => setShowTemplate(null)} title={showTemplate?.name || ''}>
        {showTemplate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Category</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>{showTemplate.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Description</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>{showTemplate.desc}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Difficulty</div>
              <div style={{ fontSize: '13px', marginTop: '4px', color: showTemplate.difficulty === 'hard' ? 'var(--red)' : '#f59e0b' }}>
                {showTemplate.difficulty.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
