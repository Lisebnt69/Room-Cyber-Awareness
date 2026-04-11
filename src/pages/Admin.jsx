import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { generateReportPDF } from '../services/pdfGenerator'
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
  { dept: 'Finance', score: 82 }, { dept: 'RH', score: 74 },
  { dept: 'IT', score: 91 }, { dept: 'Commercial', score: 63 }, { dept: 'Direction', score: 88 },
]
const COLORS = ['#00d4ff', '#1a3a6b', '#0a1f3d']

const INITIAL_SCENARIO_LIBRARY = [
  { id: 's1', title: { fr: 'Opération : Inbox Zero', en: 'Operation: Inbox Zero' }, category: 'Phishing', difficulty: 'intermediate', duration: '15 min', status: 'available' },
  { id: 's2', title: { fr: 'Bureau Compromis', en: 'Compromised Desktop' }, category: 'Ransomware', difficulty: 'advanced', duration: '20 min', status: 'available' },
  { id: 's3', title: { fr: 'Ingénierie Sociale', en: 'Social Engineering' }, category: 'Social Eng.', difficulty: 'beginner', duration: '10 min', status: 'available' },
]

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Sophie Bernard', dept: 'Finance', score: 920, scenarios: 4, status: 'excellent', lastPlay: '05/04/2025', email: 'sophieb@acme-corp.com', completionRate: 95, avgTime: '12min', lastScenario: 'Inbox Zero', license: true },
  { id: 2, name: 'Thomas Keller', dept: 'IT', score: 850, scenarios: 5, status: 'excellent', lastPlay: '06/04/2025', email: 'thomask@acme-corp.com', completionRate: 88, avgTime: '11min', lastScenario: 'Bureau Compromis', license: true },
  { id: 3, name: 'Amélie Durand', dept: 'RH', score: 710, scenarios: 3, status: 'good', lastPlay: '03/04/2025', email: 'amelied@acme-corp.com', completionRate: 72, avgTime: '14min', lastScenario: 'Inbox Zero', license: true },
  { id: 4, name: 'Marc Lefebvre', dept: 'Commercial', score: 540, scenarios: 2, status: 'improve', lastPlay: '28/03/2025', email: 'marcl@acme-corp.com', completionRate: 51, avgTime: '18min', lastScenario: 'Ingénierie Sociale', license: true },
  { id: 5, name: 'Julie Martin', dept: 'Direction', score: 880, scenarios: 4, status: 'excellent', lastPlay: '07/04/2025', email: 'juliem@acme-corp.com', completionRate: 91, avgTime: '10min', lastScenario: 'Inbox Zero', license: true },
  { id: 6, name: 'Pierre Rousseau', dept: 'Finance', score: 630, scenarios: 3, status: 'good', lastPlay: '04/04/2025', email: 'pierrer@acme-corp.com', completionRate: 68, avgTime: '15min', lastScenario: 'Bureau Compromis', license: true },
  { id: 7, name: 'Nadia Chouaib', dept: 'Commercial', score: 490, scenarios: 1, status: 'improve', lastPlay: '01/04/2025', email: 'nadiac@acme-corp.com', completionRate: 44, avgTime: '21min', lastScenario: 'Ingénierie Sociale', license: false },
  { id: 8, name: 'Antoine Moreau', dept: 'IT', score: 960, scenarios: 6, status: 'excellent', lastPlay: '07/04/2025', email: 'antoinem@acme-corp.com', completionRate: 98, avgTime: '9min', lastScenario: 'Bureau Compromis', license: true },
]

const DEPTS = ['Finance', 'IT', 'RH', 'Commercial', 'Direction', 'Marketing', 'Juridique', 'Opérations']

function statusColor(s) {
  if (s === 'excellent') return '#22c55e'
  if (s === 'good') return '#f59e0b'
  return 'var(--red)'
}

const tooltipStyle = {
  contentStyle: { background: 'rgba(4,15,32,0.95)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontFamily: 'var(--font-body)', fontSize: '14px' },
  labelStyle: { color: 'var(--text-muted)' },
  itemStyle: { color: 'var(--text-light)' },
}

function KpiCard({ label, value, sub, trend, accent }) {
  return (
    <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderTop: accent ? '2px solid var(--cyan)' : '2px solid transparent', borderRadius: 'var(--r-md)', padding: '24px 28px', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--glass-shadow)', transition: 'border-color 0.2s' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '12px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-title)', fontSize: '36px', fontWeight: 700, color: accent ? 'var(--cyan)' : 'var(--text-light)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '15px', color: trend === 'up' ? '#22c55e' : trend === 'down' ? 'var(--danger)' : 'var(--text-muted)', marginTop: '8px' }}>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}</div>}
    </div>
  )
}

const AI_RISK_EMPLOYEES = [
  { name: 'Marc Lefebvre', dept: 'Commercial', risk: 87, factors: ['Faible taux de complétion (51%)', 'Cliqué sur 2 phishing simulés', 'Score bas : 540/1000'] },
  { name: 'Nadia Chouaib', dept: 'Commercial', risk: 79, factors: ['1 seul scénario complété', 'Aucune connexion depuis 7 jours', 'Sans licence active'] },
  { name: 'Pierre Rousseau', dept: 'Finance', risk: 52, factors: ['Taux de complétion moyen (68%)', 'Score en baisse ce mois'] },
  { name: 'Amélie Durand', dept: 'RH', risk: 38, factors: ['Progression normale', 'Score en amélioration'] },
  { name: 'Sophie Bernard', dept: 'Finance', risk: 12, factors: ['Excellent score (920/1000)', 'Top performer'] },
]

function riskColor(r) {
  if (r >= 70) return '#eb2828'
  if (r >= 40) return '#f59e0b'
  return '#22c55e'
}

function riskLabel(r) {
  if (r >= 70) return 'Critique'
  if (r >= 40) return 'Modéré'
  return 'Faible'
}

// ─── Tab: Dashboard ───────────────────────────────────────────────
function TabDashboard({ t, pieData }) {
  const [expandedRisk, setExpandedRisk] = useState(null)
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border-subtle)', marginBottom: '32px' }}>
        <KpiCard label={t('kpiParticipation')} value="88%" sub={t('kpiParticipationSub')} trend="up" accent />
        <KpiCard label={t('kpiSuccess')} value="76%" sub={t('kpiSuccessSub')} trend="up" />
        <KpiCard label={t('kpiScore')} value="724" sub={t('kpiScoreSub')} />
        <KpiCard label={t('kpiTrained')} value="142/161" sub={t('kpiTrainedSub')} trend="up" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1px', background: 'var(--border-subtle)', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '28px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>{t('chartProgress')}</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} /><stop offset="95%" stopColor="#00d4ff" stopOpacity={0} /></linearGradient>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a3a6b" stopOpacity={0.4} /><stop offset="95%" stopColor="#1a3a6b" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" />
              <XAxis dataKey="mois" tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="participation" stroke="#00d4ff" strokeWidth={2} fill="url(#gP)" name={t('chartParticipation')} />
              <Area type="monotone" dataKey="reussite" stroke="#1a3a6b" strokeWidth={2} fill="url(#gR)" name={t('chartReussite')} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}><div style={{ width: 12, height: 2, background: '#00d4ff' }} />{t('chartParticipation')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}><div style={{ width: 12, height: 2, background: '#1a3a6b' }} />{t('chartReussite')}</div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '28px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>{t('chartGlobal')}</div>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip {...tooltipStyle} /></PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><div style={{ width: 8, height: 8, background: COLORS[i] }} />{d.name}</div>
                <span style={{ color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>{t('chartDept')}</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={deptData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" vertical={false} />
            <XAxis dataKey="dept" tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#828080', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="score" fill="#00d4ff" radius={[4,4,0,0]} name={t('kpiScore')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Risk Score */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>SCORE DE RISQUE IA — EMPLOYÉS PRIORITAIRES</div>
          <span style={{ fontSize: '13px', padding: '3px 10px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', fontFamily: 'var(--font-body)' }}>IA ROOMCA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {AI_RISK_EMPLOYEES.map((emp, i) => (
            <div key={i}>
              <div onClick={() => setExpandedRisk(expandedRisk === i ? null : i)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 14px', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--border-subtle)', background: expandedRisk === i ? 'rgba(255,255,255,0.03)' : 'transparent', transition: 'all 0.15s' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${riskColor(emp.risk)}20`, border: `2px solid ${riskColor(emp.risk)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: riskColor(emp.risk), flexShrink: 0 }}>
                  {emp.risk}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{emp.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{emp.dept}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '80px', height: '4px', background: 'var(--bg-black)', borderRadius: '2px' }}>
                    <div style={{ width: `${emp.risk}%`, height: '100%', background: riskColor(emp.risk), borderRadius: '2px', transition: 'width 0.8s' }} />
                  </div>
                  <span style={{ fontSize: '14px', color: riskColor(emp.risk), fontWeight: 600, width: '48px', textAlign: 'right' }}>{riskLabel(emp.risk)}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{expandedRisk === i ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedRisk === i && (
                <div style={{ marginLeft: '52px', padding: '10px 14px', background: 'rgba(235,40,40,0.04)', border: '1px solid rgba(235,40,40,0.1)', borderRadius: '6px', marginTop: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>FACTEURS DE RISQUE DÉTECTÉS</div>
                  {emp.factors.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: riskColor(emp.risk), flexShrink: 0 }}>•</span>
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Tab: Employees ───────────────────────────────────────────────
function TabEmployees({ t, lang, employees, onSelectEmployee, onCreateEmployee, onToggleLicense }) {
  const [search, setSearch] = useState('')
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  )
  const licensed = employees.filter(e => e.license).length
  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px 24px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'TOTAL EMPLOYÉS' : 'TOTAL EMPLOYEES'}</div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--text-light)' }}>{employees.length}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px 24px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'LICENCES ACTIVES' : 'ACTIVE LICENSES'}</div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--red)' }}>{licensed}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/{employees.length}</span></div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px 24px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'LICENCES DISPONIBLES' : 'AVAILABLE LICENSES'}</div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: '#22c55e' }}>{200 - licensed}</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('tableEmployees')} ({filtered.length})</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input className="input-dark" placeholder={t('searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: '200px', padding: '8px 12px', fontSize: '15px' }} aria-label="Search employees" />
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '15px', whiteSpace: 'nowrap' }} onClick={onCreateEmployee}>
              + {lang === 'fr' ? 'Créer employé' : 'Add employee'}
            </button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Employee performance table">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {[t('colEmployee'), t('colDept'), t('colScore'), t('colScenarios'), t('colStatus'), lang === 'fr' ? 'Licence' : 'License', t('colLastPlay'), ''].map((h, i) => (
                <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }} role="columnheader">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, i) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,40,40,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-light)' }}>{emp.name}</td>
                <td style={{ padding: '14px 20px', fontSize: '15px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{emp.dept}</td>
                <td style={{ padding: '14px 20px' }}><span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--red)' }}>{emp.score}</span><span style={{ fontSize: '13px', color: 'var(--text-muted)' }}> /1000</span></td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)' }}>{emp.scenarios}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '3px 10px', fontSize: '14px', fontFamily: 'var(--font-body)', color: statusColor(emp.status), border: `1px solid ${statusColor(emp.status)}`, background: `${statusColor(emp.status)}15` }}>
                    {t(`status${emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}`)}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => onToggleLicense(emp.id)} aria-label={`Toggle license for ${emp.name}`} style={{ padding: '4px 12px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)', border: `1px solid ${emp.license ? '#22c55e' : 'var(--border-subtle)'}`, background: emp.license ? 'rgba(34,197,94,0.1)' : 'transparent', color: emp.license ? '#22c55e' : 'var(--text-muted)', transition: 'all 0.2s', borderRadius: '4px' }}>
                    {emp.license ? '✓ Active' : '× Inactive'}
                  </button>
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>{emp.lastPlay || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => onSelectEmployee(emp)} aria-label={`View details for ${emp.name}`} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >›</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Tab: Scenarios ───────────────────────────────────────────────
function TabScenarios({ t, lang, onAssign, scenarioLibrary }) {
  const navigate = useNavigate()
  const [launched, setLaunched] = useState({})
  const diffLabel = (d) => ({ intermediate: t('diffIntermediate'), advanced: t('diffAdvanced'), beginner: t('diffBeginner') })[d] || d
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {scenarioLibrary.map(s => (
        <div key={s.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(235,40,40,0.4)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '15px', marginBottom: '8px' }}>{typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}</div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '15px', color: 'var(--text-muted)' }}>
              <span className="tag" style={{ fontSize: '13px', padding: '2px 8px' }}>{s.category}</span>
              <span>{diffLabel(s.difficulty)}</span>
              <span>⏱ {s.duration}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/preview/' + (typeof s.id === 'number' ? s.id : s.id))}
              style={{ background: 'transparent', border: '1px solid #22c55e', color: '#22c55e', padding: '8px 16px', fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              aria-label={`Test scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
            >
              ▶ Tester
            </button>
            {launched[s.id] ? (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#22c55e', border: '1px solid #22c55e', padding: '8px 16px' }}>✓ {lang === 'fr' ? 'Assigné' : 'Assigned'}</span>
            ) : (
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '15px' }} aria-label={`Assign scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`} onClick={() => { setLaunched(l => ({ ...l, [s.id]: true })); onAssign(s) }}>
                {lang === 'fr' ? '+ Assigner' : '+ Assign'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tab: Reports ─────────────────────────────────────────────────
function TabReports({ t, lang }) {
  const [downloading, setDownloading] = useState(null)
  const [sendingReport, setSendingReport] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  const sendWeeklyReport = () => {
    setSendingReport(true)
    setTimeout(() => { setSendingReport(false); setReportSent(true); setTimeout(() => setReportSent(false), 4000) }, 1800)
  }

  const reports = [
    { id: 'r1', name: lang === 'fr' ? 'Rapport mensuel — Mars 2025' : 'Monthly Report — March 2025', date: '01/04/2025', size: '1.2 MB', type: 'PDF' },
    { id: 'r2', name: lang === 'fr' ? 'Rapport mensuel — Février 2025' : 'Monthly Report — February 2025', date: '01/03/2025', size: '1.1 MB', type: 'PDF' },
    { id: 'r3', name: lang === 'fr' ? 'Export employés — Q1 2025' : 'Employee Export — Q1 2025', date: '31/03/2025', size: '0.3 MB', type: 'CSV' },
    { id: 'r4', name: lang === 'fr' ? 'Analyse des risques — T1 2025' : 'Risk Analysis — Q1 2025', date: '31/03/2025', size: '2.4 MB', type: 'PDF' },
  ]
  const dl = async (id) => {
    setDownloading(id)
    const report = reports.find(r => r.id === id)
    if (report?.type === 'PDF') {
      const tplId = id === 'r4' ? 'risk' : id === 'r3' ? 'audit' : 'exec'
      await generateReportPDF(
        { id: tplId, name: report.name },
        { period: report.date, org: 'ACME Corp' }
      )
    } else {
      // CSV export
      const csv = 'Prénom,Nom,Département,Score,Dernière formation\nMarie,Dupont,Finance,82,2026-03-15\nPierre,Martin,IT,91,2026-04-01\nLucas,Petit,Ventes,58,2026-02-10\nSophie,Bernard,RH,74,2026-03-20'
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${report.name.replace(/ /g,'_')}.csv`; a.click()
      URL.revokeObjectURL(url)
    }
    setDownloading(null)
  }
  return (
    <div>
      {/* Weekly Report Card */}
      <div style={{ background: 'linear-gradient(135deg, rgba(235,40,40,0.06), rgba(235,40,40,0.02))', border: '1px solid rgba(235,40,40,0.2)', borderRadius: '8px', padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '16px' }}>{lang === 'fr' ? 'Rapport hebdomadaire automatique' : 'Automatic Weekly Report'}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {lang === 'fr' ? 'Envoyé chaque lundi matin · Prochaine édition : Lundi 13 avril' : 'Sent every Monday morning · Next edition: Monday April 13'}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
              {[
                { label: lang === 'fr' ? 'Participation' : 'Participation', value: '88%', trend: '+4%', up: true },
                { label: lang === 'fr' ? 'Score moyen' : 'Avg Score', value: '724', trend: '+12', up: true },
                { label: lang === 'fr' ? 'Employés à risque' : 'At-risk employees', value: '3', trend: '-1', up: false },
              ].map((m, i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{m.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-light)' }}>{m.value}</div>
                  <div style={{ fontSize: '14px', color: m.up ? '#22c55e' : 'var(--red)', marginTop: '2px' }}>{m.up ? '↑' : '↓'} {m.trend} {lang === 'fr' ? 'vs semaine préc.' : 'vs prev. week'}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
            <button onClick={sendWeeklyReport} disabled={sendingReport} className="btn-primary" style={{ padding: '10px 20px', fontSize: '15px', opacity: sendingReport ? 0.7 : 1 }}>
              {reportSent ? '✓ Envoyé !' : sendingReport ? '⏳ Envoi...' : lang === 'fr' ? '✉ Envoyer maintenant' : '✉ Send now'}
            </button>
            <button style={{ padding: '8px 20px', fontSize: '15px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '4px' }}>
              {lang === 'fr' ? 'Aperçu email' : 'Preview email'}
            </button>
          </div>
        </div>
      </div>

    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
          {lang === 'fr' ? 'RAPPORTS DISPONIBLES' : 'AVAILABLE REPORTS'}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Available reports">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {[lang === 'fr' ? 'Rapport' : 'Report', lang === 'fr' ? 'Date' : 'Date', 'Type', lang === 'fr' ? 'Taille' : 'Size', ''].map((h, i) => (
              <th key={i} style={{ padding: '12px 28px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }} role="columnheader">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <td style={{ padding: '14px 28px', fontSize: '13px', color: 'var(--text-light)' }}>{r.name}</td>
              <td style={{ padding: '14px 28px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>{r.date}</td>
              <td style={{ padding: '14px 28px' }}><span className="tag" style={{ fontSize: '13px', padding: '2px 8px' }}>{r.type}</span></td>
              <td style={{ padding: '14px 28px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>{r.size}</td>
              <td style={{ padding: '14px 28px' }}>
                <button onClick={() => dl(r.id)} aria-label={`Download ${r.name}`} style={{ background: downloading === r.id ? 'rgba(34,197,94,0.1)' : 'transparent', border: `1px solid ${downloading === r.id ? '#22c55e' : 'var(--border-subtle)'}`, color: downloading === r.id ? '#22c55e' : 'var(--text-muted)', padding: '6px 16px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
                  {downloading === r.id ? (lang === 'fr' ? '↓ Téléchargement...' : '↓ Downloading...') : (lang === 'fr' ? '↓ Télécharger' : '↓ Download')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

// ─── Tab: Settings ────────────────────────────────────────────────
function TabSettings({ t, lang, user }) {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ company: user?.company || 'ACME Corp', email: 'admin@acme-corp.com', notifications: true, twoFactor: false, weeklyReport: true })
  const save = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const lbl = (fr, en) => lang === 'fr' ? fr : en
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '24px' }}>{lbl('INFORMATIONS ENTREPRISE', 'COMPANY INFORMATION')}</div>
        <form onSubmit={save}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="company-name" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>{lbl('NOM ENTREPRISE', 'COMPANY NAME')}</label>
            <input id="company-name" className="input-dark" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} aria-label="Company name" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="admin-email" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>{lbl('EMAIL ADMIN', 'ADMIN EMAIL')}</label>
            <input id="admin-email" className="input-dark" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} aria-label="Admin email address" />
          </div>
          <button className="btn-primary" type="submit" style={{ padding: '10px 24px', fontSize: '15px', background: saved ? '#22c55e' : undefined, borderColor: saved ? '#22c55e' : undefined }} aria-label="Save settings">
            {saved ? (lbl('✓ Sauvegardé', '✓ Saved')) : lbl('Sauvegarder', 'Save')}
          </button>
        </form>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '24px' }}>{lbl('PRÉFÉRENCES', 'PREFERENCES')}</div>
        {[['notifications', lbl('Notifications par email', 'Email notifications')], ['twoFactor', lbl('Double authentification (2FA)', 'Two-factor authentication (2FA)')], ['weeklyReport', lbl('Rapport hebdomadaire automatique', 'Automatic weekly report')]].map(([key, label]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <label htmlFor={`toggle-${key}`} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</label>
            <button id={`toggle-${key}`} onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: form[key] ? 'var(--red)' : '#333', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }} role="switch" aria-checked={form[key]} aria-label={label}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', transition: 'left 0.2s', left: form[key] ? '23px' : '3px' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export default function Admin() {
  const { user, logout } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [modal, setModal] = useState(null) // null | { type, data }
  const [toast, setToast] = useState(null)
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES)
  const [newEmpForm, setNewEmpForm] = useState({ name: '', email: '', dept: 'Finance', license: true })
  const [scenarioLibrary, setScenarioLibrary] = useState(INITIAL_SCENARIO_LIBRARY)

  useEffect(() => {
    fetch('/api/companies/1/scenarios')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setScenarioLibrary(data.map(s => ({
            ...s,
            title: { fr: s.title_fr, en: s.title_en || s.title_fr },
            duration: s.duration ? s.duration + ' min' : '—',
          })))
        }
      })
      .catch(() => {})
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleCreateEmployee = (e) => {
    e.preventDefault()
    if (!newEmpForm.name.trim() || !newEmpForm.email.trim()) return
    const newEmp = {
      id: Date.now(),
      name: newEmpForm.name,
      email: newEmpForm.email,
      dept: newEmpForm.dept,
      license: newEmpForm.license,
      score: 0,
      scenarios: 0,
      status: 'improve',
      lastPlay: null,
      completionRate: 0,
      avgTime: '—',
      lastScenario: '—',
    }
    setEmployees(prev => [...prev, newEmp])
    setNewEmpForm({ name: '', email: '', dept: 'Finance', license: true })
    setModal(null)
    showToast(lang === 'fr' ? `${newEmp.name} ajouté avec succès` : `${newEmp.name} added successfully`)
  }

  const handleToggleLicense = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, license: !e.license } : e))
    const emp = employees.find(e => e.id === id)
    showToast(lang === 'fr'
      ? `Licence ${emp?.license ? 'retirée' : 'assignée'} — ${emp?.name}`
      : `License ${emp?.license ? 'removed' : 'assigned'} — ${emp?.name}`)
  }

  const navItems = [
    { id: 'dashboard', label: t('adminNavDashboard'), icon: '▦' },
    { id: 'employees', label: t('adminNavEmployees'), icon: '◉' },
    { id: 'scenarios', label: t('adminNavScenarios'), icon: '▷' },
    { id: 'reports', label: t('adminNavReports'), icon: '◈' },
    { id: 'settings', label: t('adminNavSettings'), icon: '◎' },
  ]

  const pieData = [
    { name: t('pieSuccess'), value: 76 },
    { name: t('pieFailed'), value: 14 },
    { name: t('pieInProgress'), value: 10 },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {/* Toast */}
      {toast && <Toast message={toast} type="success" />}

      {/* Modals */}
      <Modal isOpen={modal?.type === 'createEmployee'} onClose={() => setModal(null)} title={lang === 'fr' ? 'Créer un employé' : 'Add employee'}>
        <form onSubmit={handleCreateEmployee}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'NOM COMPLET' : 'FULL NAME'}</label>
            <input className="input-dark" required placeholder={lang === 'fr' ? 'Marie Dupont' : 'Jane Smith'} value={newEmpForm.name} onChange={e => setNewEmpForm(f => ({ ...f, name: e.target.value }))} aria-label="Employee full name" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'EMAIL PROFESSIONNEL' : 'WORK EMAIL'}</label>
            <input className="input-dark" type="email" required placeholder="marie.dupont@company.com" value={newEmpForm.email} onChange={e => setNewEmpForm(f => ({ ...f, email: e.target.value }))} aria-label="Employee email" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'DÉPARTEMENT' : 'DEPARTMENT'}</label>
            <select value={newEmpForm.dept} onChange={e => setNewEmpForm(f => ({ ...f, dept: e.target.value }))} style={{ width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '13px' }} aria-label="Department">
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '2px' }}>{lang === 'fr' ? 'Assigner une licence' : 'Assign a license'}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{lang === 'fr' ? 'Accès immédiat aux scénarios' : 'Immediate access to scenarios'}</div>
            </div>
            <button type="button" onClick={() => setNewEmpForm(f => ({ ...f, license: !f.license }))} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: newEmpForm.license ? 'var(--red)' : '#333', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }} role="switch" aria-checked={newEmpForm.license} aria-label="Toggle license">
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', transition: 'left 0.2s', left: newEmpForm.license ? '23px' : '3px' }} />
            </button>
          </div>
          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {lang === 'fr' ? '+ Créer l\'employé' : '+ Create employee'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={modal?.type === 'newScenario'} onClose={() => setModal(null)} title={t('adminNewScenario')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scenarioLibrary.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(235,40,40,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}</div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <span>{s.category}</span><span>•</span><span>{s.duration}</span>
                </div>
              </div>
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '15px' }} aria-label={`Assign scenario ${typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? `Scénario assigné à toute l'équipe` : 'Scenario assigned to all employees') }}>
                {lang === 'fr' ? 'Assigner' : 'Assign'}
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={modal?.type === 'employee' && !!modal.data} onClose={() => setModal(null)} title={modal?.data?.name || ''}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }} role="grid" aria-label="Employee statistics">
          {[
            [lang === 'fr' ? 'Score' : 'Score', `${modal?.data?.score} / 1000`],
            [lang === 'fr' ? 'Scénarios complétés' : 'Completed scenarios', modal?.data?.scenarios],
            [lang === 'fr' ? 'Taux de complétion' : 'Completion rate', `${modal?.data?.completionRate}%`],
            [lang === 'fr' ? 'Temps moyen' : 'Avg. time', modal?.data?.avgTime],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '16px' }} role="gridcell">
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '22px', color: 'var(--red)' }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{lang === 'fr' ? 'DERNIER SCÉNARIO' : 'LAST SCENARIO'}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{modal?.data?.lastScenario}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '15px' }} aria-label={`Send reminder to ${modal?.data?.name}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? 'Rappel envoyé par email' : 'Reminder sent by email') }}>
            {lang === 'fr' ? '✉ Envoyer rappel' : '✉ Send reminder'}
          </button>
          <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '15px' }} aria-label={`Export report for ${modal?.data?.name}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? 'Rapport exporté' : 'Report exported') }}>
            {lang === 'fr' ? '↓ Exporter' : '↓ Export'}
          </button>
        </div>
      </Modal>

      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: '#080808', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
          <div style={{ marginTop: '12px', padding: '8px 10px', background: 'rgba(235,40,40,0.08)', border: '1px solid rgba(235,40,40,0.2)' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('adminConsoleName')}</div>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>{user?.company}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }} role="navigation" aria-label="Main navigation">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: activeNav === item.id ? 'rgba(235,40,40,0.08)' : 'transparent', borderLeft: activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent', color: activeNav === item.id ? 'var(--text-light)' : 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'all 0.15s', cursor: 'pointer' }} aria-current={activeNav === item.id ? 'page' : undefined} aria-label={`Navigate to ${item.label}`}>
              <span style={{ fontSize: '16px', opacity: 0.8 }} aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <LangToggle style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }} />
          <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '4px' }}>{user?.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--red)', marginBottom: '12px' }}>{t('adminRole')}</div>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '15px' }} aria-label="Logout">{t('logout')}</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1 }}>
        <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080808', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: 700 }}>{navItems.find(n => n.id === activeNav)?.label}</h1>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>{t('adminUpdated')}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="tag"><span className="status-dot green" style={{ background: '#22c55e' }} /> {t('adminSystemOk')}</div>
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '15px' }} aria-label="Open new scenario dialog" onClick={() => setModal({ type: 'newScenario' })}>
              {t('adminNewScenario')}
            </button>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {activeNav === 'dashboard' && <TabDashboard t={t} pieData={pieData} />}
          {activeNav === 'employees' && <TabEmployees t={t} lang={lang} employees={employees} onSelectEmployee={(emp) => setModal({ type: 'employee', data: emp })} onCreateEmployee={() => setModal({ type: 'createEmployee' })} onToggleLicense={handleToggleLicense} />}
          {activeNav === 'scenarios' && <TabScenarios t={t} lang={lang} scenarioLibrary={scenarioLibrary} onAssign={(s) => showToast(lang === 'fr' ? `"${typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}" assigné avec succès` : `"${typeof s.title === 'object' ? s.title[lang] : (s.title_en || s.title_fr || s.title)}" successfully assigned`)} />}
          {activeNav === 'reports' && <TabReports t={t} lang={lang} />}
          {activeNav === 'settings' && <TabSettings t={t} lang={lang} user={user} />}
        </div>
      </main>
    </div>
  )
}
