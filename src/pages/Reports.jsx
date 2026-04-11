import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { generateReportPDF } from '../services/pdfGenerator'
import { businessIntelligence } from '../services/businessIntelligence'

const reportTemplates = [
  { id: 'exec', name: 'Executive Summary', icon: '👔', desc: 'Rapport mensuel pour direction', pages: 4, format: 'PDF' },
  { id: 'compliance', name: 'Compliance Report', icon: '🛡️', desc: 'Rapport de conformité réglementaire', pages: 12, format: 'PDF' },
  { id: 'risk', name: 'Risk Assessment', icon: '⚠️', desc: 'Évaluation des risques par employé', pages: 8, format: 'PDF' },
  { id: 'campaign', name: 'Campaign Results', icon: '📊', desc: 'Résultats de campagne phishing', pages: 6, format: 'PDF/CSV' },
  { id: 'training', name: 'Training Progress', icon: '📈', desc: 'Progression formation par équipe', pages: 5, format: 'PDF' },
  { id: 'audit', name: 'Audit Trail', icon: '📋', desc: 'Logs d\'audit conformité', pages: 'Dynamic', format: 'CSV' },
  { id: 'breach', name: 'Breach Notification', icon: '🚨', desc: 'Template notification de breach (GDPR/HIPAA)', pages: 3, format: 'PDF' },
  { id: 'roi', name: 'ROI Report', icon: '💰', desc: 'Retour sur investissement cybersécurité', pages: 4, format: 'PDF' }
]

const recentReports = [
  { name: 'Executive Summary - Mars 2026', date: '2026-04-01', size: '2.3 MB', author: 'System', id: 'exec' },
  { name: 'GDPR Compliance Report - Q1 2026', date: '2026-04-01', size: '5.1 MB', author: 'System', id: 'compliance' },
  { name: 'Phishing Campaign #47 Results', date: '2026-03-28', size: '1.8 MB', author: 'Marie Admin', id: 'campaign' },
  { name: 'Risk Assessment - Finance Dept', date: '2026-03-25', size: '3.2 MB', author: 'Pierre RSSI', id: 'risk' }
]

const SECTORS = [
  { value: 'general', label: 'Général' },
  { value: 'finance', label: 'Finance / Banque' },
  { value: 'healthcare', label: 'Santé / HIPAA' },
  { value: 'retail', label: 'Commerce / Retail' },
  { value: 'tech', label: 'Technologie' },
  { value: 'energy', label: 'Énergie / Industrie' },
  { value: 'education', label: 'Éducation' },
]

function ROICalculator({ onGenerate }) {
  const [form, setForm] = useState({
    investment: 48000,
    employees: 150,
    sector: 'general',
    incidentsPrevented: 2,
    avgCyberPremium: 24000,
    avgSalary: 42000,
    complianceFineRisk: 50000,
  })
  const [result, setResult] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const calculate = () => {
    const roi = businessIntelligence.calculateROI({
      investmentAmount: Number(form.investment),
      employees: Number(form.employees),
      sector: form.sector,
      incidentsPrevented: Number(form.incidentsPrevented),
      avgCyberPremium: Number(form.avgCyberPremium),
      avgSalary: Number(form.avgSalary),
      complianceFineRisk: Number(form.complianceFineRisk),
    })
    setResult(roi)
  }

  const fmt = (n) => Number(n).toLocaleString('fr-FR')
  const inp = { width: '100%', padding: '8px 10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '13px' }
  const lbl = { color: 'var(--text-muted)', fontSize: '10px', marginBottom: '4px', display: 'block' }

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '28px', border: '1px solid var(--border-subtle)', marginBottom: '40px' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px', fontSize: '18px' }}>💰 Calculateur ROI Cybersécurité</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>Modèle basé sur IBM Cost of Data Breach 2024 & Ponemon Institute</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div>
          <label style={lbl}>Investissement formation (€)</label>
          <input type="number" style={inp} value={form.investment} onChange={e => set('investment', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Nombre d'employés</label>
          <input type="number" style={inp} value={form.employees} onChange={e => set('employees', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Secteur d'activité</label>
          <select style={inp} value={form.sector} onChange={e => set('sector', e.target.value)}>
            {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Incidents évités (estimés)</label>
          <input type="number" style={inp} value={form.incidentsPrevented} onChange={e => set('incidentsPrevented', e.target.value)} min="0" max="20" />
        </div>
        <div>
          <label style={lbl}>Prime assurance cyber annuelle (€)</label>
          <input type="number" style={inp} value={form.avgCyberPremium} onChange={e => set('avgCyberPremium', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Salaire moyen employé (€/an)</label>
          <input type="number" style={inp} value={form.avgSalary} onChange={e => set('avgSalary', e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Risque amende conformité (€)</label>
          <input type="number" style={inp} value={form.complianceFineRisk} onChange={e => set('complianceFineRisk', e.target.value)} />
        </div>
      </div>

      <button onClick={calculate} className="btn-primary" style={{ padding: '10px 24px', marginBottom: result ? '28px' : 0 }}>
        Calculer le ROI
      </button>

      {result && (
        <>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'ROI Net', value: `${result.roi}%`, color: '#22c55e' },
              { label: 'Économies totales', value: `€${fmt(result.totalSavings)}`, color: '#22c55e' },
              { label: 'Bénéfice net', value: `€${fmt(result.netBenefit)}`, color: '#22c55e' },
              { label: 'Retour en mois', value: `${result.paybackMonths} mois`, color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--bg-black)', borderRadius: '8px', padding: '14px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Décomposition économies */}
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '13px' }}>Décomposition des économies</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {[
              { label: `Incidents évités (${result.incidentsAvoided} × €${fmt(result.avgIncidentCost)})`, value: result.directSavings, pct: result.directSavings / result.totalSavings },
              { label: 'Réduction risque résiduel de breach', value: result.residualRiskValue, pct: result.residualRiskValue / result.totalSavings },
              { label: 'Gain productivité employés', value: result.productivitySavings, pct: result.productivitySavings / result.totalSavings },
              { label: 'Réduction prime assurance cyber', value: result.insuranceSavings, pct: result.insuranceSavings / result.totalSavings },
              { label: 'Réduction risque amende conformité', value: result.complianceSavings, pct: result.complianceSavings / result.totalSavings },
            ].map(({ label, value, pct }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: '600' }}>€{fmt(value)}</span>
                </div>
                <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, pct * 100).toFixed(0)}%`, background: '#eb2828', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Scénarios */}
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px', fontSize: '13px' }}>Analyse de scénarios</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Pessimiste', ...result.scenarios.pessimistic, color: '#f59e0b' },
              { label: 'Réaliste', ...result.scenarios.realistic, color: '#22c55e' },
              { label: 'Optimiste', ...result.scenarios.optimistic, color: '#6366f1' },
            ].map(({ label, roi, savings, color }) => (
              <div key={label} style={{ background: 'var(--bg-black)', borderRadius: '8px', padding: '12px', border: `1px solid ${color}33`, textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color }}>{roi}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>€{fmt(savings)}</div>
              </div>
            ))}
          </div>

          {/* Benchmark */}
          <div style={{ background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '11px', color: 'var(--text-muted)' }}>
            💡 <strong style={{ color: 'var(--text-primary)' }}>Benchmark industrie :</strong> ROI moyen formation cybersécurité = <strong>342%</strong> (Ponemon 2023).
            Votre estimation : <strong style={{ color: Number(result.roi) >= 342 ? '#22c55e' : '#f59e0b' }}>{result.roi}%</strong>
            {Number(result.roi) >= 342 ? ' ✅ Au-dessus de la moyenne' : ' — résultats selon vos paramètres sectoriels'}
          </div>

          <button
            onClick={() => onGenerate(result)}
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            📥 Exporter en PDF
          </button>
        </>
      )}
    </div>
  )
}

export default function Reports({ embedded = false }) {
  const [selected, setSelected] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [period, setPeriod] = useState('Dernier mois')

  const downloadCSV = (filename, rows) => {
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const generate = async () => {
    if (!selected) return
    setGenerating(true)

    if (selected.id === 'audit') {
      downloadCSV(`audit_trail_${Date.now()}.csv`, [
        ['Timestamp', 'User', 'Action', 'Resource', 'IP', 'Result'],
        ['2026-04-08 09:12:34', 'marie.dupont@roomca.com', 'LOGIN', 'Platform', '192.168.1.12', 'SUCCESS'],
        ['2026-04-08 09:14:21', 'marie.dupont@roomca.com', 'SCENARIO_COMPLETE', 'Inbox Zero', '192.168.1.12', 'SCORE:850'],
        ['2026-04-08 10:05:11', 'pierre.martin@roomca.com', 'LOGIN', 'Platform', '192.168.1.45', 'SUCCESS'],
        ['2026-04-08 10:22:30', 'admin@roomca.com', 'CAMPAIGN_CREATE', 'Phishing Campaign #48', '192.168.1.1', 'SUCCESS'],
        ['2026-04-08 11:45:00', 'thomas.moreau@roomca.com', 'CERTIFICATION_PASS', 'ROOMCA Foundation', '192.168.1.88', 'SCORE:92%']
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
      await generateReportPDF(selected, { period })
    }

    setGenerating(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      {!embedded && <div className="aurora-bg" style={{ opacity: 0.4 }} />}
      {!embedded && <PageHeader title="📑 Centre de Rapports" subtitle="Génération PDF / CSV exécutifs et conformité" />}

      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>📑 Centre de Rapports</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Génération automatique de rapports PDF/CSV exécutifs et conformité</p>

        {/* ROI Calculator */}
        <ROICalculator onGenerate={async (roiData) => {
          await generateReportPDF(
            { id: 'roi', name: 'ROI Report — Retour sur Investissement' },
            { roi: roiData, period }
          )
        }} />

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
                <select
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '6px', marginTop: '4px' }}
                >
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
                  {(selected.id === 'audit' || selected.id === 'campaign') && <option>CSV</option>}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={generate} disabled={generating} className="btn-primary" style={{ padding: '12px 24px' }}>
                {generating ? '⏳ Génération...' : '📥 Générer le rapport PDF'}
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
                <button onClick={async () => {
                  const tpl = reportTemplates.find(t => t.id === r.id) || reportTemplates[0]
                  await generateReportPDF(tpl, { period: r.date })
                }} style={{ padding: '6px 12px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>
                  📥 PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
