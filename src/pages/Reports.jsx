import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

const reportTemplates = [
  { id: 'exec', name: 'Executive Summary', icon: '👔', desc: 'Rapport mensuel pour direction', pages: 4, format: 'PDF' },
  { id: 'compliance', name: 'Compliance Report', icon: '🛡️', desc: 'Rapport de conformité réglementaire', pages: 12, format: 'PDF' },
  { id: 'risk', name: 'Risk Assessment', icon: '⚠️', desc: 'Évaluation des risques par employé', pages: 8, format: 'PDF' },
  { id: 'campaign', name: 'Campaign Results', icon: '📊', desc: 'Résultats de campagne phishing', pages: 6, format: 'PDF/CSV' },
  { id: 'training', name: 'Training Progress', icon: '📈', desc: 'Progression formation par équipe', pages: 5, format: 'PDF' },
  { id: 'audit', name: 'Audit Trail', icon: '📋', desc: 'Logs d\'audit conformité', pages: 'Dynamic', format: 'CSV/JSON' },
  { id: 'breach', name: 'Breach Notification', icon: '🚨', desc: 'Template notification de breach (GDPR/HIPAA)', pages: 3, format: 'PDF' },
  { id: 'roi', name: 'ROI Report', icon: '💰', desc: 'Retour sur investissement', pages: 4, format: 'PDF' }
]

const recentReports = [
  { name: 'Executive Summary - Mars 2026', date: '2026-04-01', size: '2.3 MB', author: 'System' },
  { name: 'GDPR Compliance Report - Q1 2026', date: '2026-04-01', size: '5.1 MB', author: 'System' },
  { name: 'Phishing Campaign #47 Results', date: '2026-03-28', size: '1.8 MB', author: 'Marie Admin' },
  { name: 'Risk Assessment - Finance Dept', date: '2026-03-25', size: '3.2 MB', author: 'Pierre RSSI' }
]

export default function Reports() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [selected, setSelected] = useState(null)
  const [generating, setGenerating] = useState(false)

  const generate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      alert(`Rapport "${selected.name}" généré ! Téléchargement en cours...`)
    }, 1500)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>📑 Centre de Rapports</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Génération automatique de rapports PDF/CSV exécutifs et conformité</p>

        <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Templates disponibles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {reportTemplates.map(t => (
            <div key={t.id} onClick={() => setSelected(t)} style={{
              background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', cursor: 'pointer',
              border: '1px solid', borderColor: selected?.id === t.id ? '#eb2828' : 'var(--border-subtle)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{t.icon}</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '16px' }}>{t.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px' }}>{t.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>📄 {t.pages} pages</span>
                <span>{t.format}</span>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #eb2828' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Configuration : {selected.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Période</label>
                <select style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '6px', marginTop: '4px' }}>
                  <option>Dernier mois</option>
                  <option>Dernier trimestre</option>
                  <option>Année en cours</option>
                  <option>Personnalisé</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Format</label>
                <select style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '6px', marginTop: '4px' }}>
                  <option>PDF</option>
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>Excel</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={generate} disabled={generating} className="btn-primary" style={{ padding: '12px 24px' }}>
                {generating ? '⏳ Génération...' : '📥 Générer le rapport'}
              </button>
              <button className="btn-secondary" style={{ padding: '12px 24px' }}>📅 Programmer (mensuel)</button>
            </div>
          </div>
        )}

        <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Rapports récents</h2>
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
          {recentReports.map((r, i) => (
            <div key={i} style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < recentReports.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{r.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{r.date} · {r.author} · {r.size}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '11px' }}>👁️ Voir</button>
                <button style={{ padding: '6px 12px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>📥 Télécharger</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
