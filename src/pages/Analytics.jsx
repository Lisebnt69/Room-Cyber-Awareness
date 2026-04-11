import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import './Analytics.css'

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

const scoreClass = (value) => {
  if (value > 80) return 'high'
  if (value > 60) return 'medium'
  return 'low'
}

export default function Analytics() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [dateRange, setDateRange] = useState('month')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleExportPDF = () => {
    alert('PDF export feature coming soon!')
  }

  return (
    <div className="analytics-page">
      <div className="analytics-shell">
        <nav className="analytics-nav">
          <img src={Logo} alt="ROOMCA" style={{ height: '32px', width: 'auto', display: 'block' }} />
          <div className="analytics-nav-actions">
            <LangToggle />
            <button onClick={() => navigate('/admin')} className="analytics-link-btn">
              ← Dashboard
            </button>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>
              Logout
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
      </div>
    </div>
  )
}
