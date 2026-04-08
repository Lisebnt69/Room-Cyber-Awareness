import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const progressData = [
  { mois: 'Oct', participation: 42, reussite: 31 },
  { mois: 'Nov', participation: 58, reussite: 44 },
  { mois: 'Déc', participation: 65, reussite: 52 },
  { mois: 'Jan', participation: 71, reussite: 60 },
  { mois: 'Fév', participation: 80, reussite: 68 },
  { mois: 'Mar', participation: 88, reussite: 76 },
]

const deptData = [
  { dept: 'Finance', score: 82 },
  { dept: 'RH', score: 74 },
  { dept: 'IT', score: 91 },
  { dept: 'Commercial', score: 63 },
  { dept: 'Direction', score: 88 },
]

const pieData = [
  { name: 'Réussi', value: 76 },
  { name: 'Échoué', value: 14 },
  { name: 'En cours', value: 10 },
]

const employees = [
  { id: 1, name: 'Sophie Bernard', dept: 'Finance', score: 920, scenarios: 4, status: 'Excellent', lastPlay: '05/04/2025' },
  { id: 2, name: 'Thomas Keller', dept: 'IT', score: 850, scenarios: 5, status: 'Excellent', lastPlay: '06/04/2025' },
  { id: 3, name: 'Amélie Durand', dept: 'RH', score: 710, scenarios: 3, status: 'Bien', lastPlay: '03/04/2025' },
  { id: 4, name: 'Marc Lefebvre', dept: 'Commercial', score: 540, scenarios: 2, status: 'À améliorer', lastPlay: '28/03/2025' },
  { id: 5, name: 'Julie Martin', dept: 'Direction', score: 880, scenarios: 4, status: 'Excellent', lastPlay: '07/04/2025' },
  { id: 6, name: 'Pierre Rousseau', dept: 'Finance', score: 630, scenarios: 3, status: 'Bien', lastPlay: '04/04/2025' },
  { id: 7, name: 'Nadia Chouaib', dept: 'Commercial', score: 490, scenarios: 1, status: 'À améliorer', lastPlay: '01/04/2025' },
  { id: 8, name: 'Antoine Moreau', dept: 'IT', score: 960, scenarios: 6, status: 'Excellent', lastPlay: '07/04/2025' },
]

const COLORS = ['#eb2828', '#545454', '#2e2c2c']

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '▦' },
  { id: 'employees', label: 'Employés', icon: '◉' },
  { id: 'scenarios', label: 'Scénarios', icon: '▷' },
  { id: 'reports', label: 'Rapports', icon: '◈' },
  { id: 'settings', label: 'Paramètres', icon: '◎' },
]

function KpiCard({ label, value, sub, trend, accent }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
      borderTop: accent ? '2px solid var(--red)' : '2px solid transparent',
      padding: '24px 28px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-title)', fontSize: '36px', fontWeight: 700, color: accent ? 'var(--red)' : 'var(--text-light)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: trend === 'up' ? '#22c55e' : trend === 'down' ? 'var(--red)' : 'var(--text-muted)', marginTop: '8px' }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}
        </div>
      )}
    </div>
  )
}

const tooltipStyle = {
  contentStyle: { background: '#0d0d0d', border: '1px solid #333', borderRadius: 0, fontFamily: 'var(--mono)', fontSize: '11px' },
  labelStyle: { color: 'var(--text-muted)' },
  itemStyle: { color: 'var(--text-light)' },
}

function statusColor(s) {
  if (s === 'Excellent') return '#22c55e'
  if (s === 'Bien') return '#f59e0b'
  return 'var(--red)'
}

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [search, setSearch] = useState('')

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: '#080808', borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Logo size="sm" />
          <div style={{ marginTop: '12px', padding: '8px 10px', background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.2)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>CONSOLE RSSI</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{user?.company}</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 24px', background: activeNav === item.id ? 'rgba(235,40,40,0.08)' : 'transparent',
              borderLeft: activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent',
              color: activeNav === item.id ? 'var(--text-light)' : 'var(--text-muted)',
              fontSize: '13px', fontFamily: 'var(--font-body)',
              transition: 'all 0.15s', cursor: 'pointer',
            }}>
              <span style={{ fontSize: '16px', opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{user?.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', marginBottom: '12px' }}>Administrateur</div>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '12px' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '0' }}>
        {/* Top bar */}
        <div style={{
          padding: '20px 40px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#080808', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: 700 }}>Tableau de bord</h1>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Mis à jour le 07/04/2025 — 09:42
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="tag"><span className="status-dot green" style={{ background: '#22c55e' }} /> Système opérationnel</div>
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>
              + Nouveau scénario
            </button>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border-subtle)', marginBottom: '32px' }}>
            <KpiCard label="TAUX DE PARTICIPATION" value="88%" sub="+8% ce mois" trend="up" accent />
            <KpiCard label="TAUX DE RÉUSSITE" value="76%" sub="+12% ce mois" trend="up" />
            <KpiCard label="SCORE MOYEN" value="724" sub="sur 1000 pts" />
            <KpiCard label="EMPLOYÉS FORMÉS" value="142/161" sub="89% de la cible" trend="up" />
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1px', background: 'var(--border-subtle)', marginBottom: '32px' }}>
            {/* Area chart */}
            <div style={{ background: 'var(--bg-card)', padding: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>
                PROGRESSION — 6 DERNIERS MOIS
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="gParticipation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eb2828" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#eb2828" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gReussite" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#545454" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#545454" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" />
                  <XAxis dataKey="mois" tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="participation" stroke="#eb2828" strokeWidth={2} fill="url(#gParticipation)" name="Participation %" />
                  <Area type="monotone" dataKey="reussite" stroke="#545454" strokeWidth={2} fill="url(#gReussite)" name="Réussite %" />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 2, background: 'var(--red)' }} /> Participation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 2, background: '#545454' }} /> Réussite
                </div>
              </div>
            </div>

            {/* Pie chart */}
            <div style={{ background: 'var(--bg-card)', padding: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>
                RÉSULTATS GLOBAUX
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                      <div style={{ width: 8, height: 8, background: COLORS[i] }} />
                      {d.name}
                    </div>
                    <span style={{ color: 'var(--text-light)', fontFamily: 'var(--mono)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>
              SCORE MOYEN PAR DÉPARTEMENT
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={deptData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" vertical={false} />
                <XAxis dataKey="dept" tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="score" fill="#eb2828" name="Score moyen" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Employees table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                LISTE DES EMPLOYÉS ({filtered.length})
              </div>
              <input
                className="input-dark"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '220px', padding: '8px 12px', fontSize: '12px' }}
              />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Employé', 'Département', 'Score', 'Scénarios', 'Statut', 'Dernière activité'].map(h => (
                    <th key={h} style={{ padding: '12px 28px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr key={emp.id} style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,40,40,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ padding: '14px 28px', fontSize: '13px', color: 'var(--text-light)' }}>{emp.name}</td>
                    <td style={{ padding: '14px 28px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{emp.dept}</td>
                    <td style={{ padding: '14px 28px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--red)' }}>{emp.score}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}> /1000</span>
                    </td>
                    <td style={{ padding: '14px 28px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{emp.scenarios}</td>
                    <td style={{ padding: '14px 28px' }}>
                      <span style={{
                        padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--mono)',
                        color: statusColor(emp.status),
                        border: `1px solid ${statusColor(emp.status)}`,
                        background: `${statusColor(emp.status)}15`,
                      }}>{emp.status}</span>
                    </td>
                    <td style={{ padding: '14px 28px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{emp.lastPlay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
