import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { complianceService } from '../services/compliance'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

export default function Compliance() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { t } = useLang()
  const [selectedFramework, setSelectedFramework] = useState(null)
  const [filter, setFilter] = useState('all')

  const frameworks = complianceService.getAllFrameworks()
  const breachDeadlines = complianceService.getBreachDeadlines()

  const filtered = filter === 'all' ? frameworks : frameworks.filter(f => f.category === filter)
  const categories = ['all', ...new Set(frameworks.map(f => f.category))]

  const mockScores = {
    GDPR: 87, HIPAA: 92, 'PCI-DSS': 78, SOC2: 95, ISO27001: 81,
    NIS2: 73, DORA: 68, CMMC2: 85, FERPA: 90, 'NERC-CIP': 76,
    IEC62443: 82, CCPA: 88, COPPA: 91, HDS: 79, RGS: 84
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🛡️ Centre de Conformité</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>15 frameworks réglementaires · Audit-ready · Multi-juridictions</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Frameworks Suivis', value: '15', icon: '📋', color: '#3b82f6' },
            { label: 'Score Moyen', value: '83%', icon: '📊', color: '#22c55e' },
            { label: 'Audits Passés', value: '7', icon: '✅', color: '#eb2828' },
            { label: 'Gaps Critiques', value: '12', icon: '⚠️', color: '#f59e0b' }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '12px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', color: stat.color, fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Breach Deadlines */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid #eb2828', padding: '24px', borderRadius: '12px', marginBottom: '40px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '16px' }}>⏰ Délais de Notification de Violation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {breachDeadlines.map((d, i) => (
              <div key={i} style={{ padding: '16px', background: 'rgba(235,40,40,0.05)', borderRadius: '8px', border: '1px solid rgba(235,40,40,0.2)' }}>
                <div style={{ fontWeight: 'bold', color: '#eb2828', marginBottom: '4px' }}>{d.framework}</div>
                <div style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '4px' }}>{d.deadline}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.authority}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '8px 16px', background: filter === c ? '#eb2828' : 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', borderRadius: '20px', color: 'var(--text-primary)',
              cursor: 'pointer', fontSize: '12px', textTransform: 'capitalize'
            }}>{c}</button>
          ))}
        </div>

        {/* Framework grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(fw => {
            const score = mockScores[fw.id] || 75
            const status = score >= 90 ? 'compliant' : score >= 70 ? 'partial' : 'non-compliant'
            const color = score >= 90 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#eb2828'

            return (
              <div key={fw.id} onClick={() => setSelectedFramework(fw)} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px',
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '4px' }}>{fw.id}</h3>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fw.region} · {fw.category}</div>
                  </div>
                  <div style={{ background: color, color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{score}%</div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>{fw.description}</p>
                <div style={{ height: '6px', background: 'var(--bg-black)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ height: '100%', width: `${score}%`, background: color }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{fw.controls} contrôles</span>
                  <span style={{ color }}>{status}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected framework detail */}
        {selectedFramework && (
          <div style={{ marginTop: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '32px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', marginBottom: '4px' }}>{selectedFramework.name}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{selectedFramework.description}</div>
              </div>
              <button onClick={() => setSelectedFramework(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            {selectedFramework.penalty && (
              <div style={{ padding: '16px', background: 'rgba(235,40,40,0.05)', borderRadius: '8px', marginBottom: '16px' }}>
                <strong style={{ color: '#eb2828' }}>Sanctions:</strong> <span style={{ color: 'var(--text-primary)' }}>{selectedFramework.penalty}</span>
              </div>
            )}

            {selectedFramework.requirements && (
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Exigences principales</h4>
                {selectedFramework.requirements.map(req => (
                  <div key={req.id} style={{ padding: '12px', background: 'var(--bg-black)', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{req.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
