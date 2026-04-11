import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import PageHeader from '../components/PageHeader'
import { generateReportPDF } from '../services/pdfGenerator'

const heatmapData = [
  { scenario: 'Inbox Zero', easy: 95, medium: 87, hard: 42 },
  { scenario: 'Compromised Desktop', easy: 88, medium: 72, hard: 35 },
  { scenario: 'Social Engineering', easy: 92, medium: 81, hard: 58 },
  { scenario: 'Credential Theft', easy: 81, medium: 65, hard: 29 },
]

const trendData = [
  { week: 'W1', avg_score: 72, completion: 68, accuracy: 75 },
  { week: 'W2', avg_score: 74, completion: 71, accuracy: 78 },
  { week: 'W3', avg_score: 76, completion: 75, accuracy: 81 },
  { week: 'W4', avg_score: 79, completion: 78, accuracy: 84 },
]

const vulnerabilityData = [
  { type: 'Phishing', percentage: 45, count: 142, severity: 'high' },
  { type: 'Weak Passwords', percentage: 28, count: 88, severity: 'high' },
  { type: 'USB Drops', percentage: 18, count: 56, severity: 'medium' },
  { type: 'Social Eng.', percentage: 9, count: 28, severity: 'low' },
]

const COLORS = ['#eb2828', '#f59e0b', '#22c55e', '#3b82f6']

export default function Analytics({ embedded = false }) {
  const [dateRange, setDateRange] = useState('month')

  const [exporting, setExporting] = useState(false)
  const handleExportPDF = async () => {
    setExporting(true)
    try {
      await generateReportPDF(
        { id: 'exec', name: 'Rapport Analytics — Cybersécurité' },
        { period: dateRange === 'week' ? 'Cette semaine' : dateRange === 'month' ? 'Ce mois' : 'Ce trimestre', org: 'Mon Entreprise' }
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      {!embedded && <div className="aurora-bg" style={{ opacity: 0.4 }} />}
      {!embedded && <PageHeader title="📊 Analytics" subtitle="Vulnérabilités & tendances de sécurité" />}

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '8px' }}>
              📊 Analytics
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Analysez les vulnérabilités et tendances de sécurité
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['week', 'month', 'quarter'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  padding: '8px 16px',
                  background: dateRange === range ? 'var(--red)' : 'var(--bg-card)',
                  border: `1px solid ${dateRange === range ? 'var(--red)' : 'var(--border)'}`,
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'var(--font-title)',
                  transition: 'all 0.2s'
                }}
              >
                {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'Quarter'}
              </button>
            ))}
            <button onClick={handleExportPDF} disabled={exporting} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px', opacity: exporting ? 0.7 : 1 }}>
              {exporting ? '⏳ Génération...' : '📥 Export PDF'}
            </button>
          </div>
        </nav>

        <div className="analytics-container">
          <div className="analytics-header">
            <div>
              <h1>📊 Analytics</h1>
              <p>Analysez les vulnérabilités et tendances de sécurité</p>
            </div>
            <div className="analytics-header-actions">
              {['week', 'month', 'quarter'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`range-btn ${dateRange === range ? 'active' : ''}`}
                >
                  {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'Quarter'}
                </button>
              ))}
              <button onClick={handleExportPDF} className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                📥 Export PDF
              </button>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>🚨 Vulnerability Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={vulnerabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {vulnerabilityData.map((entry, index) => (
                      <Cell key={`cell-${entry.type}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0d0d0d', border: '1px solid #333' }}
                    formatter={(value) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-card">
              <h3>⚠️ Top Vulnerabilities</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Type</th>
                    <th>Occurrences</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilityData.map((v) => (
                    <tr key={v.type}>
                      <td>{v.type}</td>
                      <td style={{ fontWeight: 700 }}>{v.count}</td>
                      <td className={`severity-${v.severity}`}>{v.severity.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="analytics-card" style={{ marginBottom: '24px' }}>
            <h3>📈 Weekly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" />
                <XAxis dataKey="week" tick={{ fill: '#828080', fontSize: 11 }} />
                <YAxis tick={{ fill: '#828080', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid #333' }} />
                <Legend />
                <Line type="monotone" dataKey="avg_score" stroke="#eb2828" strokeWidth={2} name="Avg Score" />
                <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={2} name="Completion %" />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-card">
            <h3>🔥 Success Rate by Difficulty</h3>
            <table className="analytics-table analytics-heatmap">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Scenario</th>
                  <th>Easy</th>
                  <th>Medium</th>
                  <th>Hard</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.scenario}>
                    <td>{row.scenario}</td>
                    {['easy', 'medium', 'hard'].map((difficulty) => (
                      <td key={difficulty}>
                        <span className={`level-pill ${scoreClass(row[difficulty])}`}>
                          {row[difficulty]}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trends Chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '20px' }}>
            📈 Weekly Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" />
              <XAxis dataKey="week" tick={{ fill: '#828080', fontSize: '11px' }} />
              <YAxis tick={{ fill: '#828080', fontSize: '11px' }} />
              <Tooltip contentStyle={{ background: '#0d0d0d', border: '1px solid #333' }} />
              <Legend />
              <Line type="monotone" dataKey="avg_score" stroke="#eb2828" strokeWidth={2} name="Avg Score" />
              <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={2} name="Completion %" />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Difficulty Heatmap */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '24px', borderRadius: '4px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '16px', marginBottom: '20px' }}>
            🔥 Success Rate by Difficulty
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Scenario</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Easy</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Medium</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Hard</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map(row => (
                <tr key={row.scenario} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{row.scenario}</td>
                  {['easy', 'medium', 'hard'].map(difficulty => (
                    <td key={difficulty} style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{
                        background: row[difficulty] > 80 ? 'rgba(34,197,94,0.2)' : row[difficulty] > 60 ? 'rgba(245,158,11,0.2)' : 'rgba(235,40,40,0.2)',
                        padding: '8px 12px',
                        borderRadius: '2px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: row[difficulty] > 80 ? '#22c55e' : row[difficulty] > 60 ? '#f59e0b' : 'var(--red)'
                      }}>
                        {row[difficulty]}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
