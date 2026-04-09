import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'

const templates = [
  { id: 1, name: 'CEO Wire Transfer', cat: 'BEC', difficulty: 'hard', clickRate: 32, sector: 'finance' },
  { id: 2, name: 'IT Password Reset', cat: 'Phishing', difficulty: 'medium', clickRate: 45, sector: 'all' },
  { id: 3, name: 'HR Annual Review', cat: 'Phishing', difficulty: 'medium', clickRate: 38, sector: 'all' },
  { id: 4, name: 'DocuSign Contract', cat: 'Phishing', difficulty: 'easy', clickRate: 52, sector: 'all' },
  { id: 5, name: 'Office 365 Login', cat: 'Credentials', difficulty: 'medium', clickRate: 41, sector: 'all' },
  { id: 6, name: 'Adobe Cloud Invoice', cat: 'Phishing', difficulty: 'easy', clickRate: 49, sector: 'all' },
  { id: 7, name: 'Patient Records Audit', cat: 'BEC', difficulty: 'hard', clickRate: 28, sector: 'healthcare' },
  { id: 8, name: 'Wire Fraud Bank', cat: 'BEC', difficulty: 'hard', clickRate: 22, sector: 'finance' },
  { id: 9, name: 'Salesforce Update', cat: 'Credentials', difficulty: 'medium', clickRate: 36, sector: 'all' },
  { id: 10, name: 'AWS Billing Alert', cat: 'Phishing', difficulty: 'medium', clickRate: 33, sector: 'tech' },
  { id: 11, name: 'CMMC Audit Notice', cat: 'BEC', difficulty: 'hard', clickRate: 18, sector: 'government' },
  { id: 12, name: 'Stripe Verification', cat: 'Phishing', difficulty: 'medium', clickRate: 39, sector: 'tech' },
  { id: 13, name: 'GitHub Security Alert', cat: 'Credentials', difficulty: 'hard', clickRate: 27, sector: 'tech' },
  { id: 14, name: 'LinkedIn Connection', cat: 'Social Eng.', difficulty: 'easy', clickRate: 58, sector: 'all' },
  { id: 15, name: 'Package Delivery FedEx', cat: 'Phishing', difficulty: 'easy', clickRate: 61, sector: 'all' },
  { id: 16, name: 'Tax Refund IRS', cat: 'Phishing', difficulty: 'medium', clickRate: 47, sector: 'all' },
  { id: 17, name: 'Zoom Meeting Recording', cat: 'Phishing', difficulty: 'easy', clickRate: 55, sector: 'all' },
  { id: 18, name: 'Bonus Payment HR', cat: 'BEC', difficulty: 'medium', clickRate: 42, sector: 'all' },
  { id: 19, name: 'ServiceNow Ticket', cat: 'Phishing', difficulty: 'medium', clickRate: 35, sector: 'all' },
  { id: 20, name: 'Slack Channel Invite', cat: 'Phishing', difficulty: 'easy', clickRate: 51, sector: 'all' }
]

export default function EmailTemplates() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [filter, setFilter] = useState('all')
  const [preview, setPreview] = useState(null)

  const handleLogout = () => { logout(); navigate('/login') }
  const filtered = filter === 'all' ? templates : templates.filter(t => t.cat === filter || t.sector === filter)
  const cats = ['all', 'BEC', 'Phishing', 'Credentials', 'Social Eng.']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>📧 Email Templates Library</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{templates.length}+ templates phishing prêts à l'emploi avec metrics réels</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '8px 16px', background: filter === c ? '#eb2828' : 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', borderRadius: '20px', color: 'var(--text-primary)',
              cursor: 'pointer', fontSize: '12px'
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(235,40,40,0.1)', color: '#eb2828', borderRadius: '4px' }}>{t.cat}</span>
                <span style={{ fontSize: '11px', color: t.difficulty === 'hard' ? '#eb2828' : t.difficulty === 'medium' ? '#f59e0b' : '#22c55e' }}>{t.difficulty}</span>
              </div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '8px' }}>{t.name}</h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>Click rate moyen : <strong style={{ color: '#eb2828' }}>{t.clickRate}%</strong></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setPreview(t)} style={{ flex: 1, padding: '8px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '11px' }}>👁️ Preview</button>
                <button style={{ flex: 1, padding: '8px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>Utiliser</button>
              </div>
            </div>
          ))}
        </div>

        {preview && (
          <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#fff', maxWidth: '600px', padding: '32px', borderRadius: '12px', color: '#000' }}>
              <h3>{preview.name}</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>From: it-support@acme-corp.io</p>
              <p style={{ fontSize: '12px', color: '#666' }}>Subject: ⚠️ Action Required: Verify Account</p>
              <hr />
              <p>Dear User,</p>
              <p>We detected unusual activity on your account. Please verify your credentials by clicking the link below:</p>
              <p><a href="#" style={{ color: 'blue' }}>https://acme-corp.io/verify-account</a></p>
              <p>Failure to verify within 24 hours will result in account suspension.</p>
              <p>Best regards,<br/>IT Security Team</p>
              <button onClick={() => setPreview(null)} style={{ marginTop: '16px', padding: '8px 16px', background: '#eb2828', color: '#fff', border: 'none', borderRadius: '6px' }}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
