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

  const downloadCSV = (filename, rows) => {
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadText = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const generate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      if (!selected) return

      if (selected.id === 'audit') {
        downloadCSV(`audit_trail_${Date.now()}.csv`, [
          ['Timestamp', 'User', 'Action', 'Resource', 'IP', 'Result'],
          ['2026-04-08 09:12:34', 'marie.dupont@acme.com', 'LOGIN', 'Platform', '192.168.1.12', 'SUCCESS'],
          ['2026-04-08 09:14:21', 'marie.dupont@acme.com', 'SCENARIO_COMPLETE', 'Inbox Zero', '192.168.1.12', 'SCORE:850'],
          ['2026-04-08 10:05:11', 'pierre.martin@acme.com', 'LOGIN', 'Platform', '192.168.1.45', 'SUCCESS'],
          ['2026-04-08 10:22:30', 'admin@acme.com', 'CAMPAIGN_CREATE', 'Phishing Campaign #48', '192.168.1.1', 'SUCCESS'],
          ['2026-04-08 11:45:00', 'thomas.moreau@acme.com', 'CERTIFICATION_PASS', 'ROOMCA Foundation', '192.168.1.88', 'SCORE:92%']
        ])
      } else if (selected.id === 'campaign') {
        downloadCSV(`campaign_results_${Date.now()}.csv`, [
          ['Employee', 'Department', 'Email Sent', 'Opened', 'Clicked', 'Reported', 'Risk Level'],
          ['Marie Dupont', 'Finance', 'Yes', 'Yes', 'No', 'Yes', 'LOW'],
          ['Pierre Martin', 'IT', 'Yes', 'Yes', 'No', 'Yes', 'LOW'],
          ['Lucas Petit', 'Sales', 'Yes', 'Yes', 'Yes', 'No', 'HIGH'],
          ['Sophie Bernard', 'HR', 'Yes', 'Yes', 'Yes', 'No', 'MEDIUM'],
          ['Emma Robert', 'Marketing', 'Yes', 'Yes', 'No', 'No', 'MEDIUM']
        ])
      } else {
        const now = new Date().toLocaleDateString('fr-FR')
        const content = `ROOMCA - ${selected.name}
Généré le: ${now}
=====================================

RÉSUMÉ EXÉCUTIF
---------------
Organisation: ACME Corp
Période: Mars 2026
Score Sécurité Global: 83/100

INDICATEURS CLÉS
----------------
• Employés formés: 147/156 (94%)
• Taux de clic phishing: 8% (-12% vs mois dernier)
• Scénarios complétés: 312
• Score moyen: 78/100
• Incidents signalés: 3
• Certifications obtenues: 12

CONFORMITÉ
----------
• GDPR: 87% ✅
• ISO 27001: 81% ⚠️
• NIS2: 73% ⚠️

RECOMMANDATIONS
---------------
1. Renforcer formation "Social Engineering" (score dept Sales: 58%)
2. Activer campagne phishing mensuelle
3. Planifier audit ISO 27001 interne (score sous 85%)
4. Former nouveaux arrivants (9 employés sans formation)

=====================================
Rapport généré par ROOMCA Cyber Awareness Platform
`
        downloadText(`${selected.id}_report_${Date.now()}.txt`, content)
      }
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
                <button onClick={() => {
                  const content = `ROOMCA Report: ${r.name}\nGenerated: ${r.date}\nAuthor: ${r.author}\n\nThis is a sample report from ROOMCA Cyber Awareness Platform.\nFor full report generation, use the report templates above.`
                  const blob = new Blob([content], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url; a.download = `${r.name.replace(/ /g,'_')}.txt`; a.click()
                  URL.revokeObjectURL(url)
                }} style={{ padding: '6px 12px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>📥 Télécharger</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
