import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { whitelabelConfig, ssoIntegration, twoFactorAuth } from '../services/multitenancy'
import { auditLog, gdprCompliance, dataExport, complianceChecklist } from '../services/audit'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('security')
  const [show2FA, setShow2FA] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [toast, setToast] = useState(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleEnable2FA = async () => {
    const result = await twoFactorAuth.generateSecret(user?.id)
    setShow2FA(true)
  }

  const handleConfirm2FA = async () => {
    setTwoFactorEnabled(true)
    setShow2FA(false)
    setToast({ msg: '2FA enabled successfully!', type: 'success' })
  }

  const handleExportData = async (type) => {
    try {
      let result
      switch (type) {
        case 'personal':
          result = await gdprCompliance.exportUserData(user?.id)
          break
        case 'scenarios':
          result = await dataExport.exportScenarios('tenant_1')
          break
        case 'audit':
          result = await dataExport.exportAuditLog('tenant_1')
          break
      }
      setToast({ msg: `${type} data exported!`, type: 'success' })
      setShowExport(false)
    } catch (error) {
      setToast({ msg: 'Export failed', type: 'error' })
    }
  }

  const compliance = complianceChecklist.getStatus()

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

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '40px' }}>⚙️ Settings</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '32px' }}>
          {['security', 'data', 'compliance'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--red)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--text-light)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-title)',
                fontWeight: activeTab === tab ? 700 : 400,
                transition: 'all 0.2s'
              }}
            >
              {tab === 'security' && '🔐 Security'}
              {tab === 'data' && '📊 Data'}
              {tab === 'compliance' && '✓ Compliance'}
            </button>
          ))}
        </div>

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* 2FA */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '12px' }}>Two-Factor Authentication</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Add an extra layer of security to your account
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '2px', marginBottom: '16px', fontSize: '12px' }}>
                Status: <span style={{ color: twoFactorEnabled ? '#22c55e' : 'var(--red)', fontWeight: 700 }}>
                  {twoFactorEnabled ? '✓ Enabled' : '✕ Disabled'}
                </span>
              </div>
              <button
                onClick={handleEnable2FA}
                className={twoFactorEnabled ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', justifyContent: 'center', padding: '8px' }}
              >
                {twoFactorEnabled ? 'Reconfigure' : 'Enable 2FA'}
              </button>
            </div>

            {/* SSO */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '12px' }}>Single Sign-On</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Sign in with your corporate identity provider
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px', justifyContent: 'center' }}>
                  OAuth2 / OIDC
                </button>
                <button className="btn-secondary" style={{ padding: '8px', fontSize: '12px', justifyContent: 'center' }}>
                  SAML 2.0
                </button>
              </div>
            </div>

            {/* IP Whitelist */}
            <div style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '12px' }}>IP Whitelist</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Restrict access to specific IP addresses
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className="input-dark" placeholder="192.168.1.1" style={{ flex: 1 }} />
                <button className="btn-primary" style={{ padding: '8px 16px' }}>Add</button>
              </div>
              <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                192.168.1.0/24 • 10.0.0.0/8
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {['Personal Data', 'Scenarios', 'Audit Logs'].map((type, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '12px' }}>📥 Export {type}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Download your {type.toLowerCase()} as JSON
                </p>
                <button onClick={() => handleExportData(type.toLowerCase().replace(' ', '_'))} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '8px' }}>
                  Export
                </button>
              </div>
            ))}

            {/* GDPR Right to be Forgotten */}
            <div style={{ gridColumn: '1 / -1', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', padding: '24px', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '12px', color: 'var(--red)' }}>🗑️ Delete Account</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button style={{ background: 'rgba(235,40,40,0.2)', border: '1px solid var(--red)', color: 'var(--red)', padding: '8px 16px', cursor: 'pointer', borderRadius: '2px', fontWeight: 600, fontSize: '12px' }}>
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '16px' }}>Compliance Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[{ label: 'Completed', value: compliance.completed, color: '#22c55e' }, { label: 'In Progress', value: compliance.inProgress, color: '#f59e0b' }, { label: 'Pending', value: compliance.pending, color: 'var(--red)' }].map((stat, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', height: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ background: '#22c55e', height: '100%', width: `${compliance.percentage}%` }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                {compliance.percentage}% Complete
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              {complianceChecklist.items.map((item, idx) => (
                <div key={idx} style={{ padding: '16px 24px', borderBottom: idx < complianceChecklist.items.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Due: {item.dueDate}</div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '4px 8px', background: item.status === 'completed' ? 'rgba(34,197,94,0.2)' : item.status === 'in_progress' ? 'rgba(245,158,11,0.2)' : 'rgba(235,40,40,0.2)', color: item.status === 'completed' ? '#22c55e' : item.status === 'in_progress' ? '#f59e0b' : 'var(--red)', borderRadius: '2px', fontWeight: 600 }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2FA Modal */}
      <Modal isOpen={show2FA} onClose={() => setShow2FA(false)} title="Enable Two-Factor Authentication">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '80px' }}>📱</div>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Scan this QR code with your authenticator app
          </p>
          <div style={{ background: 'white', padding: '20px', borderRadius: '4px', width: '200px', height: '200px' }}>
            QR Code Here
          </div>
          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Verification Code</label>
            <input type="text" className="input-dark" placeholder="000000" maxLength="6" />
          </div>
          <button onClick={handleConfirm2FA} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Confirm & Enable
          </button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  )
}
