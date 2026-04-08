import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '/home/lise/Room-Cyber-Awareness/public/roomca-logo.png'
import LangToggle from '../components/LangToggle'

const employees = [
  { id: 1, name: 'Marie Dupont', dept: 'Finance', score: 92, risk: 'low', lastTraining: '2 days ago', incidents: 0 },
  { id: 2, name: 'Pierre Martin', dept: 'IT', score: 88, risk: 'low', lastTraining: '5 days ago', incidents: 0 },
  { id: 3, name: 'Sophie Bernard', dept: 'HR', score: 67, risk: 'medium', lastTraining: '3 weeks ago', incidents: 1 },
  { id: 4, name: 'Lucas Petit', dept: 'Sales', score: 45, risk: 'high', lastTraining: '2 months ago', incidents: 3 },
  { id: 5, name: 'Emma Robert', dept: 'Marketing', score: 78, risk: 'medium', lastTraining: '1 week ago', incidents: 1 },
  { id: 6, name: 'Thomas Moreau', dept: 'Engineering', score: 95, risk: 'low', lastTraining: '1 day ago', incidents: 0 },
  { id: 7, name: 'Julie Lambert', dept: 'Legal', score: 38, risk: 'critical', lastTraining: '4 months ago', incidents: 5 },
  { id: 8, name: 'Nicolas Dubois', dept: 'Finance', score: 82, risk: 'low', lastTraining: '1 week ago', incidents: 0 }
]

const departments = [
  { name: 'Finance', score: 87, employees: 23, trend: 'up' },
  { name: 'IT', score: 92, employees: 15, trend: 'up' },
  { name: 'HR', score: 71, employees: 8, trend: 'down' },
  { name: 'Sales', score: 58, employees: 34, trend: 'down' },
  { name: 'Marketing', score: 76, employees: 12, trend: 'up' },
  { name: 'Engineering', score: 89, employees: 45, trend: 'stable' },
  { name: 'Legal', score: 64, employees: 6, trend: 'down' }
]

const riskColor = (risk) => ({ low: '#22c55e', medium: '#f59e0b', high: '#eb2828', critical: '#7c0a0a' }[risk])

export default function RiskScore() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [view, setView] = useState('employees')

  const handleLogout = () => { logout(); navigate('/login') }
  const avgScore = Math.round(employees.reduce((s, e) => s + e.score, 0) / employees.length)

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
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>⚠️ Risk Score Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Score de risque par employé/département. Détection comportementale.</p>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Score Moyen Global</div>
            <div style={{ fontSize: '40px', color: '#22c55e', fontWeight: 'bold' }}>{avgScore}</div>
            <div style={{ fontSize: '11px', color: '#22c55e' }}>↑ +5 vs. mois dernier</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Employés à risque</div>
            <div style={{ fontSize: '40px', color: '#eb2828', fontWeight: 'bold' }}>{employees.filter(e => e.risk === 'high' || e.risk === 'critical').length}</div>
            <div style={{ fontSize: '11px', color: '#eb2828' }}>Action requise</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Incidents 30j</div>
            <div style={{ fontSize: '40px', color: '#f59e0b', fontWeight: 'bold' }}>{employees.reduce((s, e) => s + e.incidents, 0)}</div>
            <div style={{ fontSize: '11px', color: '#22c55e' }}>↓ -12 vs. mois dernier</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Couverture formation</div>
            <div style={{ fontSize: '40px', color: '#3b82f6', fontWeight: 'bold' }}>87%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cible : 95%</div>
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => setView('employees')} style={{ padding: '10px 20px', background: view === 'employees' ? '#eb2828' : 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>👥 Par Employé</button>
          <button onClick={() => setView('departments')} style={{ padding: '10px 20px', background: view === 'departments' ? '#eb2828' : 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>🏢 Par Département</button>
        </div>

        {view === 'employees' && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-black)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>EMPLOYÉ</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>DÉPARTEMENT</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>SCORE</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>RISQUE</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>DERNIÈRE FORMATION</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>INCIDENTS</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {employees.sort((a, b) => a.score - b.score).map(e => (
                  <tr key={e.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{e.name}</td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>{e.dept}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--bg-black)', borderRadius: '3px' }}>
                          <div style={{ width: `${e.score}%`, height: '100%', background: riskColor(e.risk), borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ color: 'var(--text-primary)' }}>{e.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', background: riskColor(e.risk), color: '#fff', borderRadius: '12px', fontSize: '11px', textTransform: 'uppercase' }}>{e.risk}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>{e.lastTraining}</td>
                    <td style={{ padding: '16px', color: e.incidents > 0 ? '#eb2828' : 'var(--text-muted)', fontSize: '12px' }}>{e.incidents}</td>
                    <td style={{ padding: '16px' }}>
                      <button style={{ padding: '6px 12px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>Assigner formation</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'departments' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {departments.map((d, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>{d.name}</h3>
                <div style={{ fontSize: '40px', color: d.score >= 80 ? '#22c55e' : d.score >= 60 ? '#f59e0b' : '#eb2828', fontWeight: 'bold' }}>{d.score}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{d.employees} employés</span>
                  <span>{d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '→'} {d.trend}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
