import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { INTEGRATIONS, slackIntegration, teamsIntegration, emailIntegration, scimIntegration } from '../services/integrations'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Integrations() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [connectedIntegrations, setConnectedIntegrations] = useState(['email'])
  const [showConfig, setShowConfig] = useState(null)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({})

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleConnect = async (integrationId) => {
    setShowConfig(integrationId)
  }

  const handleSaveConfig = async (integrationId) => {
    try {
      let result = { error: null }

      switch (integrationId) {
        case 'slack':
          result = await slackIntegration.connect(formData.slackWebhook)
          break
        case 'teams':
          result = await teamsIntegration.connect(formData.teamsWebhook)
          break
        case 'email':
          result = await emailIntegration.configureSmtp({
            host: formData.smtpHost,
            port: formData.smtpPort,
            user: formData.smtpUser,
            password: formData.smtpPassword
          })
          break
        case 'scim':
          result = await scimIntegration.connect(formData.scimUrl, formData.scimToken)
          break
      }

      if (result.error) {
        setToast({ msg: result.error, type: 'error' })
      } else {
        setConnectedIntegrations([...connectedIntegrations, integrationId])
        setShowConfig(null)
        setFormData({})
        setToast({ msg: `${INTEGRATIONS[integrationId.toUpperCase()].name} connected!`, type: 'success' })
      }
    } catch {
      setToast({ msg: 'Configuration failed', type: 'error' })
    }
  }

  const handleDisconnect = (integrationId) => {
    setConnectedIntegrations(connectedIntegrations.filter(id => id !== integrationId))
    setToast({ msg: `${INTEGRATIONS[integrationId.toUpperCase()].name} disconnected`, type: 'success' })
  }

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
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '8px' }}>
            🔗 Integrations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Connect your tools and automate notifications
          </p>
        </div>

        {/* Integrations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {Object.entries(INTEGRATIONS).map(([_key, integration]) => {
            const isConnected = connectedIntegrations.includes(integration.id)
            return (
              <div
                key={integration.id}
                style={{
                  background: isConnected ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)',
                  border: isConnected ? '2px solid #22c55e' : '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '24px',
                  position: 'relative'
                }}
              >
                {isConnected && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#22c55e',
                    color: '#000',
                    padding: '4px 12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '2px'
                  }}>
                    ✓ CONNECTED
                  </div>
                )}

                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {integration.icon}
                </div>

                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', marginBottom: '8px' }}>
                  {integration.name}
                </h3>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {integration.description}
                </p>

                <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px', listStyle: 'none' }}>
                  {integration.features.map((feature, idx) => (
                    <li key={idx} style={{ marginBottom: '6px', display: 'flex', gap: '6px' }}>
                      <span style={{ color: 'var(--red)' }}>›</span> {feature}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {isConnected ? (
                    <>
                      <button onClick={() => handleConnect(integration.id)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                        Reconfigure
                      </button>
                      <button onClick={() => handleDisconnect(integration.id)} style={{ flex: 1, background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', color: 'var(--red)', padding: '8px', cursor: 'pointer', borderRadius: '2px', fontSize: '12px', fontWeight: 600 }}>
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleConnect(integration.id)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>
                      Connect
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Connected Services List */}
        {connectedIntegrations.length > 0 && (
          <div style={{ marginTop: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '16px' }}>
              Active Integrations
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {connectedIntegrations.map(id => {
                const integration = INTEGRATIONS[Object.keys(INTEGRATIONS).find(k => INTEGRATIONS[k].id === id)]
                return (
                  <div key={id} style={{
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid #22c55e',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{integration?.icon}</span>
                    <span>{integration?.name}</span>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Config Modal */}
      <Modal isOpen={!!showConfig} onClose={() => { setShowConfig(null); setFormData({}) }} title={showConfig ? `Configure ${INTEGRATIONS[showConfig.toUpperCase()]?.name}` : ''}>
        {showConfig === 'slack' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Webhook URL</label>
              <input
                type="text"
                value={formData.slackWebhook || ''}
                onChange={e => setFormData({ ...formData, slackWebhook: e.target.value })}
                className="input-dark"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
            <button onClick={() => handleSaveConfig('slack')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Connect Slack
            </button>
          </div>
        )}
        {showConfig === 'teams' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Webhook URL</label>
              <input
                type="text"
                value={formData.teamsWebhook || ''}
                onChange={e => setFormData({ ...formData, teamsWebhook: e.target.value })}
                className="input-dark"
                placeholder="https://webhook.office.com/webhookb2/..."
              />
            </div>
            <button onClick={() => handleSaveConfig('teams')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Connect Teams
            </button>
          </div>
        )}
        {showConfig === 'email' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              value={formData.smtpHost || ''}
              onChange={e => setFormData({ ...formData, smtpHost: e.target.value })}
              className="input-dark"
              placeholder="SMTP Host"
            />
            <input
              type="number"
              value={formData.smtpPort || ''}
              onChange={e => setFormData({ ...formData, smtpPort: e.target.value })}
              className="input-dark"
              placeholder="Port (587)"
            />
            <input
              type="text"
              value={formData.smtpUser || ''}
              onChange={e => setFormData({ ...formData, smtpUser: e.target.value })}
              className="input-dark"
              placeholder="Email Address"
            />
            <input
              type="password"
              value={formData.smtpPassword || ''}
              onChange={e => setFormData({ ...formData, smtpPassword: e.target.value })}
              className="input-dark"
              placeholder="Password"
            />
            <button onClick={() => handleSaveConfig('email')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Configure Email
            </button>
          </div>
        )}
        {showConfig === 'scim' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              value={formData.scimUrl || ''}
              onChange={e => setFormData({ ...formData, scimUrl: e.target.value })}
              className="input-dark"
              placeholder="SCIM Base URL"
            />
            <input
              type="text"
              value={formData.scimToken || ''}
              onChange={e => setFormData({ ...formData, scimToken: e.target.value })}
              className="input-dark"
              placeholder="Bearer Token"
            />
            <button onClick={() => handleSaveConfig('scim')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Connect SCIM
            </button>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
