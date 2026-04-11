import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import AssignModal from '../components/AssignModal'
import Toast from '../components/Toast'
import { generateReportPDF } from '../services/pdfGenerator'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// Pages embedded as Admin tabs (no PageHeader when embedded)
import Analytics from './Analytics'
import Reports from './Reports'
import Compliance from './Compliance'
import Campaigns from './Campaigns'
import RiskScore from './RiskScore'
import EmailTemplates from './EmailTemplates'

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

const COLORS = ['#7c5cff', '#38bdf8', '#f472b6', '#facc15', '#34d399']

// All scenarios + employees are now loaded dynamically from the backend (/api/*).
// Departments come from user-managed groups (see Groups tab).
const DEPTS = ['Finance', 'IT', 'RH', 'Commercial', 'Direction', 'Marketing', 'Juridique', 'Opérations']

function statusColor(s) {
  if (s === 'excellent') return '#22c55e'
  if (s === 'good') return '#f59e0b'
  return 'var(--red)'
}

const tooltipStyle = {
  contentStyle: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
  },
  labelStyle: { color: 'var(--text-muted)' },
  itemStyle: { color: 'var(--text-primary)' },
}

function KpiCard({ label, value, sub, trend, accent }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s var(--ease)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        background: accent ? 'var(--grad-aurora)' : 'var(--grad-ocean)',
      }} />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-title)',
        fontSize: '40px',
        fontWeight: 800,
        background: accent ? 'var(--grad-aurora)' : 'none',
        WebkitBackgroundClip: accent ? 'text' : 'unset',
        backgroundClip: accent ? 'text' : 'unset',
        WebkitTextFillColor: accent ? 'transparent' : 'var(--text)',
        color: accent ? 'transparent' : 'var(--text)',
        lineHeight: 1,
        letterSpacing: '-0.025em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '13px', color: trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--red)' : 'var(--text-muted)', marginTop: '10px', fontWeight: 500 }}>
          {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{sub}
        </div>
      )}
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

function riskColorValue(r) {
  if (r >= 70) return '#eb2828'
  if (r >= 40) return '#f59e0b'
  return '#22c55e'
}

function riskLabel(r) {
  if (r >= 70) return 'Critique'
  if (r >= 40) return 'Modéré'
  return 'Faible'
}

function TabDashboard({ t, pieData }) {
  const [expandedRisk, setExpandedRisk] = useState(null)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <KpiCard label={t('kpiParticipation')} value="88%" sub={t('kpiParticipationSub')} trend="up" accent />
        <KpiCard label={t('kpiSuccess')} value="76%" sub={t('kpiSuccessSub')} trend="up" />
        <KpiCard label={t('kpiScore')} value="724" sub={t('kpiScoreSub')} />
        <KpiCard label={t('kpiTrained')} value="142/161" sub={t('kpiTrainedSub')} trend="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '28px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>
            {t('chartProgress')}
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" />
              <XAxis dataKey="mois" tick={{ fill: '#828080', fontSize: '11px', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#828080', fontSize: '11px', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="participation" stroke="#38bdf8" strokeWidth={2} fill="url(#gP)" name={t('chartParticipation')} />
              <Area type="monotone" dataKey="reussite" stroke="#7c5cff" strokeWidth={2} fill="url(#gR)" name={t('chartReussite')} />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <div style={{ width: 12, height: 2, background: '#38bdf8' }} />
              {t('chartParticipation')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <div style={{ width: 12, height: 2, background: '#7c5cff' }} />
              {t('chartReussite')}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '28px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>
            {t('chartGlobal')}
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <div style={{ width: 8, height: 8, background: COLORS[i] }} />
                  {d.name}
                </div>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px', marginBottom: '32px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '20px' }}>
          {t('chartDept')}
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={deptData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(84,84,84,0.2)" vertical={false} />
            <XAxis dataKey="dept" tick={{ fill: '#828080', fontSize: '11px', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#828080', fontSize: '11px', fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="score" fill="#38bdf8" radius={[4, 4, 0, 0]} name={t('kpiScore')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            SCORE DE RISQUE IA — EMPLOYÉS PRIORITAIRES
          </div>
          <span style={{ fontSize: '13px', padding: '3px 10px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', fontFamily: 'var(--font-body)' }}>
            IA ROOMCA
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {AI_RISK_EMPLOYEES.map((emp, i) => (
            <div key={i}>
              <div
                onClick={() => setExpandedRisk(expandedRisk === i ? null : i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  background: expandedRisk === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${riskColorValue(emp.risk)}20`, border: `2px solid ${riskColorValue(emp.risk)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: riskColorValue(emp.risk), flexShrink: 0 }}>
                  {emp.risk}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{emp.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{emp.dept}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '80px', height: '4px', background: 'var(--bg-dark)', borderRadius: '2px' }}>
                    <div style={{ width: `${emp.risk}%`, height: '100%', background: riskColorValue(emp.risk), borderRadius: '2px', transition: 'width 0.8s' }} />
                  </div>
                  <span style={{ fontSize: '14px', color: riskColorValue(emp.risk), fontWeight: 600, width: '48px', textAlign: 'right' }}>
                    {riskLabel(emp.risk)}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{expandedRisk === i ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedRisk === i && (
                <div style={{ marginLeft: '52px', padding: '10px 14px', background: 'rgba(235,40,40,0.04)', border: '1px solid rgba(235,40,40,0.1)', borderRadius: '6px', marginTop: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    FACTEURS DE RISQUE DÉTECTÉS
                  </div>
                  {emp.factors.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: riskColorValue(emp.risk), flexShrink: 0 }}>•</span>
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

function TabEmployees({ t, lang, employees, onSelectEmployee, onCreateEmployee, onToggleLicense }) {
  const [search, setSearch] = useState('')

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  )

  const licensed = employees.filter((e) => e.license).length

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px 24px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            {lang === 'fr' ? 'TOTAL EMPLOYÉS' : 'TOTAL EMPLOYEES'}
          </div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--text-primary)' }}>{employees.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px 24px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            {lang === 'fr' ? 'LICENCES ACTIVES' : 'ACTIVE LICENSES'}
          </div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--red)' }}>
            {licensed}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {employees.length}</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '16px 24px', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            {lang === 'fr' ? 'LICENCES DISPONIBLES' : 'AVAILABLE LICENSES'}
          </div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: '#22c55e' }}>{200 - licensed}</div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            {t('tableEmployees')} ({filtered.length})
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              className="input-dark"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '200px', padding: '8px 12px', fontSize: '15px' }}
              aria-label="Search employees"
            />
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '15px', whiteSpace: 'nowrap' }} onClick={onCreateEmployee}>
              + {lang === 'fr' ? 'Créer employé' : 'Add employee'}
            </button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Employee performance table">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {[t('colEmployee'), t('colDept'), t('colScore'), t('colScenarios'), t('colStatus'), lang === 'fr' ? 'Licence' : 'License', t('colLastPlay'), ''].map((h, i) => (
                <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((emp, i) => (
              <tr
                key={emp.id}
                style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(235,40,40,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
              >
                <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-primary)' }}>{emp.name}</td>
                <td style={{ padding: '14px 20px', fontSize: '15px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{emp.dept}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--red)' }}>{emp.score}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}> /1000</span>
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)' }}>{emp.scenarios}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ padding: '3px 10px', fontSize: '14px', fontFamily: 'var(--font-body)', color: statusColor(emp.status), border: `1px solid ${statusColor(emp.status)}`, background: `${statusColor(emp.status)}15` }}>
                    {t(`status${emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}`)}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => onToggleLicense(emp.id)}
                    aria-label={`Toggle license for ${emp.name}`}
                    style={{ padding: '4px 12px', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)', border: `1px solid ${emp.license ? '#22c55e' : 'var(--border-subtle)'}`, background: emp.license ? 'rgba(34,197,94,0.1)' : 'transparent', color: emp.license ? '#22c55e' : 'var(--text-muted)', transition: 'all 0.2s', borderRadius: '4px' }}
                  >
                    {emp.license ? '✓ Active' : '× Inactive'}
                  </button>
                </td>
                <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>{emp.lastPlay || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => onSelectEmployee(emp)}
                    aria-label={`View details for ${emp.name}`}
                    style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    ›
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

function TabScenarios({ t, lang, onAssign, scenarioLibrary, canEdit }) {
  const navigate = useNavigate()

  const diffLabel = (d) => ({
    intermediate: t('diffIntermediate'),
    advanced: t('diffAdvanced'),
    beginner: t('diffBeginner'),
  })[d] || d

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {scenarioLibrary.map((s) => (
        <div
          key={s.id}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '15px', marginBottom: '8px' }}>
              {typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '15px', color: 'var(--text-muted)' }}>
              <span className="tag" style={{ fontSize: '13px', padding: '2px 8px' }}>{s.category}</span>
              <span>{diffLabel(s.difficulty)}</span>
              <span>⏱ {s.duration}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/preview/' + s.id)}
              style={{ background: 'rgba(34,197,94,0.08)', border: '1.5px solid #22c55e', color: '#22c55e', padding: '11px 20px', fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
              aria-label={`Test scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
            >
              ▶ TESTER
            </button>

            {canEdit && (
              <button
                onClick={() => navigate(`/scenario-builder?id=${s.id}`)}
                style={{ background: 'transparent', border: '1.5px solid var(--border-hover)', color: 'var(--text-muted)', padding: '11px 18px', fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#eb2828'; e.currentTarget.style.color = '#eb2828' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                aria-label={`Edit scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
              >
                ✎ ÉDITER
              </button>
            )}

            <button
              onClick={() => onAssign(s)}
              aria-label={`Assign scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
              style={{ background: 'linear-gradient(135deg, #eb2828 0%, #c71f1f 100%)', border: '1.5px solid #ff5050', color: '#fff', padding: '12px 28px', fontSize: '13px', fontFamily: 'var(--mono)', fontWeight: 900, letterSpacing: '0.14em', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.18s', boxShadow: '0 4px 18px rgba(235,40,40,0.35), inset 0 1px 0 rgba(255,255,255,0.15)', whiteSpace: 'nowrap', textTransform: 'uppercase' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(235,40,40,0.55), inset 0 1px 0 rgba(255,255,255,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(235,40,40,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' }}
            >
              + {lang === 'fr' ? 'Assigner' : 'Assign'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// TabReports removed — now handled by <Reports embedded /> from ./Reports.jsx

function TabExecutive({ lang }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      await generateReportPDF(
        { id: 'exec', name: lang === 'fr' ? 'Vue Dirigeant — Rapport Cybersécurité' : 'Executive View — Cybersecurity Report' },
        { period: 'Avril 2026', org: 'ROOMCA Corp' }
      )
    } finally {
      setExporting(false)
    }
  }

  const deptRisks = [
    { dept: 'IT', score: 91, click: 1, risk: 'low' },
    { dept: 'Direction', score: 88, click: 2, risk: 'low' },
    { dept: 'Finance', score: 82, click: 3, risk: 'low' },
    { dept: 'RH', score: 74, click: 9, risk: 'medium' },
    { dept: 'Marketing', score: 67, click: 14, risk: 'medium' },
    { dept: 'Commercial', score: 58, click: 18, risk: 'high' },
  ]

  const compliances = [
    { label: 'GDPR', score: 87, color: '#22c55e' },
    { label: 'ISO 27001', score: 81, color: '#f59e0b' },
    { label: 'NIS2', score: 73, color: '#f59e0b' },
    { label: 'DORA', score: 68, color: '#ef4444' },
  ]

  const recs = [
    { icon: '🎯', text: lang === 'fr' ? 'Formation urgente — Commercial (score 58/100)' : 'Urgent training — Sales (score 58/100)', sev: 'high' },
    { icon: '📧', text: lang === 'fr' ? 'Activer campagne phishing mensuelle automatisée' : 'Enable automated monthly phishing campaign', sev: 'medium' },
    { icon: '🛡️', text: lang === 'fr' ? 'Audit NIS2 interne recommandé (score < 80%)' : 'Internal NIS2 audit recommended (score < 80%)', sev: 'medium' },
    { icon: '👤', text: lang === 'fr' ? '9 nouveaux arrivants sans formation à intégrer' : '9 new employees with no training to onboard', sev: 'low' },
  ]

  const score = 83
  const radius = 54
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
  const sevColor = { high: '#ef4444', medium: '#f59e0b', low: 'var(--border-subtle)' }
  const riskColor = (r) => r === 'high' ? '#ef4444' : r === 'medium' ? '#f59e0b' : '#22c55e'

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', padding: '28px 20px', backdropFilter: 'var(--glass-blur)', boxShadow: 'var(--glass-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 130, height: 130 }}>
            <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="65" cy="65" r={radius} fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '34px', fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/100</div>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textAlign: 'center' }}>
            {lang === 'fr' ? 'SCORE CYBER GLOBAL' : 'GLOBAL CYBER SCORE'}
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#22c55e' }}>
            {lang === 'fr' ? '✓ Risque maîtrisé' : '✓ Risk under control'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <KpiCard label={lang === 'fr' ? 'EMPLOYÉS FORMÉS' : 'TRAINED EMPLOYEES'} value="94%" sub="147 / 156" trend="up" accent />
          <KpiCard label={lang === 'fr' ? 'TAUX CLIC PHISHING' : 'PHISHING CLICK RATE'} value="8%" sub={lang === 'fr' ? '−12 pts vs M−1' : '−12 pts vs prev. mo.'} trend="up" />
          <KpiCard label={lang === 'fr' ? 'SCORE MOYEN ÉQUIPE' : 'AVG TEAM SCORE'} value="724" sub="/1000" />
          <KpiCard label={lang === 'fr' ? 'INCIDENTS SIGNALÉS' : 'REPORTED INCIDENTS'} value="3" sub={lang === 'fr' ? 'ce mois' : 'this month'} />
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '14px' }}>
          {lang === 'fr' ? 'CONFORMITÉ RÉGLEMENTAIRE' : 'REGULATORY COMPLIANCE'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {compliances.map((c) => (
            <div key={c.label} style={{ background: 'var(--glass-bg)', border: `1px solid ${c.color}33`, borderTop: `2px solid ${c.color}`, borderRadius: 'var(--r-md)', padding: '16px 20px', backdropFilter: 'var(--glass-blur)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{c.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: c.color, lineHeight: 1, marginBottom: '10px' }}>{c.score}%</div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${c.score}%`, background: c.color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', padding: '24px', backdropFilter: 'var(--glass-blur)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '16px' }}>
            {lang === 'fr' ? 'RISQUE PAR DÉPARTEMENT' : 'RISK BY DEPARTMENT'}
          </div>
          {deptRisks.map((d) => (
            <div key={d.dept} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{d.dept}</span>
                <span style={{ fontSize: '12px', color: riskColor(d.risk) }}>{d.score}/100 · {d.click}% clics</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${d.score}%`, background: riskColor(d.risk), borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', padding: '24px', backdropFilter: 'var(--glass-blur)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '16px' }}>
            {lang === 'fr' ? 'ACTIONS PRIORITAIRES' : 'PRIORITY ACTIONS'}
          </div>
          {recs.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${sevColor[r.sev]}33`, borderLeft: `3px solid ${sevColor[r.sev]}`, borderRadius: '6px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{r.icon}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleExport} disabled={exporting} className="btn-primary" style={{ padding: '12px 28px', opacity: exporting ? 0.7 : 1 }}>
          {exporting ? (lang === 'fr' ? '⏳ Génération...' : '⏳ Generating...') : (lang === 'fr' ? '📥 Exporter rapport PDF' : '📥 Export PDF report')}
        </button>
      </div>
    </div>
  )
}

// ─── Tab: Groups ──────────────────────────────────────────────────
function TabGroups({ lang, companyId, showToast, scenarioLibrary }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [newGroupName, setNewGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [groupScenarios, setGroupScenarios] = useState([])
  const [addMemberForm, setAddMemberForm] = useState({ email: '', name: '' })
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  const tl = (fr, en) => lang === 'fr' ? fr : en

  const loadGroups = () => {
    setLoading(true)
    fetch(`/api/companies/${companyId}/groups`)
      .then(r => r.json())
      .then(data => { setGroups(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadGroups() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [companyId])

  const loadGroupDetail = (groupId) => {
    Promise.all([
      fetch(`/api/groups/${groupId}/members`).then(r => r.json()),
      fetch(`/api/groups/${groupId}/scenarios`).then(r => r.json()),
    ]).then(([m, s]) => {
      setMembers(Array.isArray(m) ? m : [])
      setGroupScenarios(Array.isArray(s) ? s : [])
    }).catch(() => {})
  }

  const openGroup = (g) => {
    setSelectedGroup(g)
    loadGroupDetail(g.id)
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) return
    setCreating(true)
    try {
      const res = await fetch(`/api/companies/${companyId}/groups`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName.trim() }),
      })
      if (res.ok) {
        setNewGroupName('')
        showToast(tl('Groupe créé', 'Group created'))
        loadGroups()
      }
    } catch { showToast(tl('Erreur réseau', 'Network error')) }
    setCreating(false)
  }

  const deleteGroup = async (g) => {
    if (!confirm(tl(`Supprimer le groupe "${g.name}" ? Les membres ne seront pas supprimés.`, `Delete group "${g.name}"? Members will not be removed.`))) return
    await fetch(`/api/groups/${g.id}`, { method: 'DELETE' }).catch(() => {})
    if (selectedGroup?.id === g.id) setSelectedGroup(null)
    loadGroups()
    showToast(tl('Groupe supprimé', 'Group deleted'))
  }

  const saveRename = async (g) => {
    if (!renameValue.trim()) { setRenamingId(null); return }
    await fetch(`/api/groups/${g.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameValue.trim() }),
    }).catch(() => {})
    setRenamingId(null); setRenameValue('')
    loadGroups()
    if (selectedGroup?.id === g.id) setSelectedGroup(prev => ({ ...prev, name: renameValue.trim() }))
  }

  const addMember = async () => {
    if (!selectedGroup || !addMemberForm.email.trim()) return
    await fetch(`/api/groups/${selectedGroup.id}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_email: addMemberForm.email.trim(),
        player_name: addMemberForm.name.trim() || addMemberForm.email.trim(),
        company_id: companyId,
      }),
    }).catch(() => {})
    setAddMemberForm({ email: '', name: '' })
    loadGroupDetail(selectedGroup.id)
    loadGroups()
    showToast(tl('Membre ajouté', 'Member added'))
  }

  const removeMember = async (playerId) => {
    if (!selectedGroup) return
    await fetch(`/api/groups/${selectedGroup.id}/members/${playerId}`, { method: 'DELETE' }).catch(() => {})
    loadGroupDetail(selectedGroup.id)
    loadGroups()
  }

  const assignScenario = async (scenarioId) => {
    if (!selectedGroup) return
    await fetch(`/api/groups/${selectedGroup.id}/scenarios`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_id: scenarioId }),
    }).catch(() => {})
    loadGroupDetail(selectedGroup.id)
    loadGroups()
    showToast(tl('Scénario assigné au groupe', 'Scenario assigned to group'))
  }

  const unassignScenario = async (scenarioId) => {
    if (!selectedGroup) return
    await fetch(`/api/groups/${selectedGroup.id}/scenarios/${scenarioId}`, { method: 'DELETE' }).catch(() => {})
    loadGroupDetail(selectedGroup.id)
    loadGroups()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', marginBottom: '6px' }}>
            👥 {tl('Groupes d\'employés', 'Employee groups')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {tl('Créez des groupes (équipes, départements) pour assigner plusieurs scénarios en une fois.', 'Create groups (teams, departments) to assign multiple scenarios at once.')}
          </p>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
          {groups.length} {tl('groupe(s)', 'group(s)')}
        </div>
      </div>

      {/* Create new group */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder={tl('Nom du nouveau groupe (ex: Équipe Marketing)', 'New group name (ex: Marketing Team)')}
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') createGroup() }}
          className="input-dark"
          style={{ flex: 1 }}
        />
        <button
          onClick={createGroup}
          disabled={creating || !newGroupName.trim()}
          className="btn-primary"
          style={{ padding: '10px 24px', fontSize: '13px', opacity: (creating || !newGroupName.trim()) ? 0.5 : 1 }}
        >
          {creating ? '...' : `+ ${tl('Créer le groupe', 'Create group')}`}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        {/* Groups list */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '10px' }}>
            {tl('VOS GROUPES', 'YOUR GROUPS')}
          </div>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              {tl('Chargement...', 'Loading...')}
            </div>
          ) : groups.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-card)', border: '1px dashed var(--border-subtle)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {tl('Aucun groupe. Créez-en un ci-dessus pour commencer.', 'No groups yet. Create one above to get started.')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {groups.map(g => (
                <div
                  key={g.id}
                  onClick={() => openGroup(g)}
                  style={{
                    padding: '14px 16px',
                    background: selectedGroup?.id === g.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    border: `1px solid ${selectedGroup?.id === g.id ? 'var(--red)' : 'var(--border-subtle)'}`,
                    borderLeft: `3px solid ${selectedGroup?.id === g.id ? 'var(--red)' : 'transparent'}`,
                    borderRadius: '6px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    {renamingId === g.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => saveRename(g)}
                        onKeyDown={e => { if (e.key === 'Enter') saveRename(g); if (e.key === 'Escape') setRenamingId(null) }}
                        onClick={e => e.stopPropagation()}
                        className="input-dark"
                        style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
                      />
                    ) : (
                      <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {g.name}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setRenamingId(g.id); setRenameValue(g.name) }}
                        title={tl('Renommer', 'Rename')}
                        style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', borderRadius: '3px' }}
                      >✏</button>
                      <button
                        onClick={e => { e.stopPropagation(); deleteGroup(g) }}
                        title={tl('Supprimer', 'Delete')}
                        style={{ background: 'transparent', border: '1px solid rgba(235,40,40,0.35)', color: 'var(--red)', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', borderRadius: '3px' }}
                      >🗑</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>👤 {g.member_count || 0} {tl('membre(s)', 'member(s)')}</span>
                    <span>▷ {g.scenario_count || 0} {tl('scénario(s)', 'scenario(s)')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group detail */}
        <div>
          {!selectedGroup ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-card)', border: '1px dashed var(--border-subtle)', borderRadius: '6px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '40px', opacity: 0.3, marginBottom: '14px' }}>👥</div>
              <div style={{ fontSize: '13px' }}>
                {tl('Sélectionnez un groupe pour gérer ses membres et scénarios.', 'Select a group to manage members and scenarios.')}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.14em', marginBottom: '4px' }}>
                  {tl('GROUPE SÉLECTIONNÉ', 'SELECTED GROUP')}
                </div>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: 'var(--text-primary)' }}>
                  {selectedGroup.name}
                </h3>
              </div>

              {/* Members */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '10px' }}>
                  👤 {tl('MEMBRES', 'MEMBERS')} — {members.length}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                  <input
                    type="email"
                    placeholder={tl('email@entreprise.com', 'email@company.com')}
                    value={addMemberForm.email}
                    onChange={e => setAddMemberForm(f => ({ ...f, email: e.target.value }))}
                    className="input-dark"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder={tl('Nom (optionnel)', 'Name (optional)')}
                    value={addMemberForm.name}
                    onChange={e => setAddMemberForm(f => ({ ...f, name: e.target.value }))}
                    className="input-dark"
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={addMember}
                    disabled={!addMemberForm.email.trim()}
                    className="btn-primary"
                    style={{ padding: '10px 18px', fontSize: '12px', opacity: !addMemberForm.email.trim() ? 0.5 : 1 }}
                  >
                    + {tl('Ajouter', 'Add')}
                  </button>
                </div>
                {members.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {tl('Aucun membre. Ajoutez-en un ci-dessus.', 'No members yet. Add one above.')}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {members.map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--cyan), var(--red))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                        }}>
                          {(m.name || m.email).slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{m.name || m.email}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{m.email}</div>
                        </div>
                        <button
                          onClick={() => removeMember(m.id)}
                          title={tl('Retirer du groupe', 'Remove from group')}
                          style={{ background: 'transparent', border: '1px solid rgba(235,40,40,0.3)', color: 'var(--red)', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', borderRadius: '3px' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scenarios */}
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '10px' }}>
                  ▷ {tl('SCÉNARIOS ASSIGNÉS', 'ASSIGNED SCENARIOS')} — {groupScenarios.length}
                </div>

                {groupScenarios.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    {groupScenarios.map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#22c55e', fontFamily: 'var(--mono)', fontWeight: 700 }}>✓</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{s.title_fr || s.title_en}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.category} · {s.difficulty}</div>
                        </div>
                        <button
                          onClick={() => unassignScenario(s.id)}
                          title={tl('Retirer', 'Unassign')}
                          style={{ background: 'transparent', border: '1px solid rgba(235,40,40,0.3)', color: 'var(--red)', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', borderRadius: '3px' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <details style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '12px 16px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
                    + {tl('AJOUTER UN SCÉNARIO AU GROUPE', 'ADD A SCENARIO TO THE GROUP')}
                  </summary>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', maxHeight: '240px', overflowY: 'auto' }}>
                    {scenarioLibrary
                      .filter(s => !groupScenarios.some(gs => gs.id === (typeof s.id === 'number' ? s.id : parseInt(s.id))))
                      .map(s => (
                        <button
                          key={s.id}
                          onClick={() => assignScenario(typeof s.id === 'number' ? s.id : parseInt(s.id))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '8px 12px',
                            background: 'transparent', border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)', cursor: 'pointer',
                            borderRadius: '3px', fontSize: '12px', textAlign: 'left',
                            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'var(--violet-tint)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'transparent' }}
                        >
                          <span style={{ fontSize: '10px', color: 'var(--red)' }}>+</span>
                          <span style={{ flex: 1 }}>{typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.category}</span>
                        </button>
                      ))}
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabSettings({ lang, user }) {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    company: user?.company || 'ROOMCA Corp',
    email: 'admin@roomca-corp.com',
    notifications: true,
    twoFactor: false,
    weeklyReport: true,
  })

  const save = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const lbl = (fr, en) => lang === 'fr' ? fr : en

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '24px' }}>
          {lbl('INFORMATIONS ENTREPRISE', 'COMPANY INFORMATION')}
        </div>

        <form onSubmit={save}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="company-name" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              {lbl('NOM ENTREPRISE', 'COMPANY NAME')}
            </label>
            <input id="company-name" className="input-dark" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} aria-label="Company name" />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="admin-email" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              {lbl('EMAIL ADMIN', 'ADMIN EMAIL')}
            </label>
            <input id="admin-email" className="input-dark" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} aria-label="Admin email address" />
          </div>

          <button className="btn-primary" type="submit" style={{ padding: '10px 24px', fontSize: '15px', background: saved ? '#22c55e' : undefined, borderColor: saved ? '#22c55e' : undefined }} aria-label="Save settings">
            {saved ? lbl('✓ Sauvegardé', '✓ Saved') : lbl('Sauvegarder', 'Save')}
          </button>
        </form>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '28px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '24px' }}>
          {lbl('PRÉFÉRENCES', 'PREFERENCES')}
        </div>

        {[
          ['notifications', lbl('Notifications par email', 'Email notifications')],
          ['twoFactor', lbl('Double authentification (2FA)', 'Two-factor authentication (2FA)')],
          ['weeklyReport', lbl('Rapport hebdomadaire automatique', 'Automatic weekly report')],
        ].map(([key, label]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            <label htmlFor={`toggle-${key}`} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</label>
            <button
              id={`toggle-${key}`}
              onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
              style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: form[key] ? 'var(--red)' : '#333', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
              role="switch"
              aria-checked={form[key]}
              aria-label={label}
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', transition: 'left 0.2s', left: form[key] ? '23px' : '3px' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Admin() {
  const { user, logout } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [activeNav, setActiveNav] = useState('dashboard')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [employees, setEmployees] = useState([])
  const [newEmpForm, setNewEmpForm] = useState({ name: '', email: '', dept: 'Finance', license: true })
  const [scenarioLibrary, setScenarioLibrary] = useState([])
  const [assignScenario, setAssignScenario] = useState(null)

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'dark'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  // Admins only see scenarios the super-admin has granted to their company.
  // The full /api/scenarios catalog is reserved for the super-admin.
  const adminCompanyId = user?.companyId || 1
  useEffect(() => {
    fetch(`/api/companies/${adminCompanyId}/scenarios`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setScenarioLibrary(data.map((s) => ({
            ...s,
            title: { fr: s.title_fr, en: s.title_en || s.title_fr },
            duration: s.duration ? `${s.duration} min` : '—',
          })))
        }
      })
      .catch(() => {})
  }, [adminCompanyId])

  // Load employees from the backend (player list of this company)
  useEffect(() => {
    fetch('/api/companies/1/players')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data.map((p) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            dept: p.department_name || '—',
            score: p.score || 0,
            scenarios: 0,
            status: (p.score || 0) > 800 ? 'excellent' : (p.score || 0) > 600 ? 'good' : 'improve',
            lastPlay: '—',
            completionRate: 0,
            avgTime: '—',
            lastScenario: '—',
            license: p.license !== false,
          })))
        }
      })
      .catch(() => {})
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

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

    setEmployees((prev) => [...prev, newEmp])
    setNewEmpForm({ name: '', email: '', dept: 'Finance', license: true })
    setModal(null)
    showToast(lang === 'fr' ? `${newEmp.name} ajouté avec succès` : `${newEmp.name} added successfully`)
  }

  const handleToggleLicense = (id) => {
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, license: !e.license } : e))
    const emp = employees.find((e) => e.id === id)
    showToast(
      lang === 'fr'
        ? `Licence ${emp?.license ? 'retirée' : 'assignée'} — ${emp?.name}`
        : `License ${emp?.license ? 'removed' : 'assigned'} — ${emp?.name}`
    )
  }

  const navItems = [
    { id: 'executive',     label: lang === 'fr' ? 'Vue Dirigeant' : 'Executive View', icon: '👔' },
    { id: 'dashboard',     label: t('adminNavDashboard'), icon: '▦' },
    { id: 'employees',     label: t('adminNavEmployees'), icon: '◉' },
    { id: 'groups',        label: lang === 'fr' ? 'Groupes' : 'Groups', icon: '👥' },
    { id: 'scenarios',     label: t('adminNavScenarios'), icon: '▷' },
    { id: 'analytics',     label: lang === 'fr' ? 'Analytics' : 'Analytics', icon: '📊' },
    { id: 'reports',       label: t('adminNavReports'), icon: '◈' },
    { id: 'compliance',    label: lang === 'fr' ? 'Conformité' : 'Compliance', icon: '🛡' },
    { id: 'campaigns',     label: lang === 'fr' ? 'Campagnes' : 'Campaigns', icon: '📢' },
    { id: 'riskscore',     label: lang === 'fr' ? 'Risk Score' : 'Risk Score', icon: '⚠' },
    { id: 'templates',     label: lang === 'fr' ? 'Templates' : 'Templates', icon: '📧' },
    { id: 'settings',      label: t('adminNavSettings'), icon: '◎' },
  ]

  const pieData = [
    { name: t('pieSuccess'), value: 76 },
    { name: t('pieFailed'), value: 14 },
    { name: t('pieInProgress'), value: 10 },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', position: 'relative' }}>
      <div className="aurora-bg" style={{ opacity: 0.4 }} />
      {toast && <Toast message={toast} type="success" />}

      <AssignModal
        isOpen={!!assignScenario}
        onClose={() => setAssignScenario(null)}
        scenario={assignScenario}
        onSuccess={({ count, mode }) => {
          const target = mode === 'companies'
            ? (count > 1 ? `${count} entreprises` : 'entreprise')
            : (count > 1 ? `${count} groupes` : 'groupe')
          showToast(lang === 'fr' ? `Scénario assigné à ${target} !` : `Scenario assigned to ${count} ${mode}!`)
        }}
      />

      <Modal isOpen={modal?.type === 'createEmployee'} onClose={() => setModal(null)} title={lang === 'fr' ? 'Créer un employé' : 'Add employee'}>
        <form onSubmit={handleCreateEmployee}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {lang === 'fr' ? 'NOM COMPLET' : 'FULL NAME'}
            </label>
            <input className="input-dark" required placeholder={lang === 'fr' ? 'Marie Dupont' : 'Jane Smith'} value={newEmpForm.name} onChange={(e) => setNewEmpForm((f) => ({ ...f, name: e.target.value }))} aria-label="Employee full name" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {lang === 'fr' ? 'EMAIL PROFESSIONNEL' : 'WORK EMAIL'}
            </label>
            <input className="input-dark" type="email" required placeholder="marie.dupont@company.com" value={newEmpForm.email} onChange={(e) => setNewEmpForm((f) => ({ ...f, email: e.target.value }))} aria-label="Employee email" />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {lang === 'fr' ? 'DÉPARTEMENT' : 'DEPARTMENT'}
            </label>
            <select
              value={newEmpForm.dept}
              onChange={(e) => setNewEmpForm((f) => ({ ...f, dept: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '13px' }}
              aria-label="Department"
            >
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {lang === 'fr' ? 'Assigner une licence' : 'Assign a license'}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {lang === 'fr' ? 'Accès immédiat aux scénarios' : 'Immediate access to scenarios'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNewEmpForm((f) => ({ ...f, license: !f.license }))}
              style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: newEmpForm.license ? 'var(--red)' : '#333', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
              role="switch"
              aria-checked={newEmpForm.license}
              aria-label="Toggle license"
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', transition: 'left 0.2s', left: newEmpForm.license ? '23px' : '3px' }} />
            </button>
          </div>

          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {lang === 'fr' ? "+ Créer l'employé" : '+ Create employee'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={modal?.type === 'newScenario'} onClose={() => setModal(null)} title={t('adminNewScenario')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scenarioLibrary.map((s) => (
            <div
              key={s.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  {typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <span>{s.category}</span><span>•</span><span>{s.duration}</span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '15px' }}
                aria-label={`Assign scenario ${typeof s.title === 'object' ? s.title[lang] : (s.title_fr || s.title)}`}
                onClick={() => { setModal(null); showToast(lang === 'fr' ? "Scénario assigné à toute l'équipe" : 'Scenario assigned to all employees') }}
              >
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
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '22px', color: 'var(--red)' }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {lang === 'fr' ? 'DERNIER SCÉNARIO' : 'LAST SCENARIO'}
          </div>
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

      <aside style={{ width: '260px', flexShrink: 0, background: 'var(--glass-bg-strong)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, color: 'var(--text)' }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <img
            src={theme === 'light' ? '/assets/roomca-logo-light.png' : '/assets/roomca-logo-dark.png'}
            alt="ROOMCA"
            style={{ height: '32px', width: 'auto', display: 'block' }}
          />

          <div style={{ marginTop: '12px', padding: '8px 10px', background: theme === 'light' ? 'rgba(0, 153, 204, 0.06)' : 'rgba(0, 212, 255, 0.08)', border: theme === 'light' ? '1px solid rgba(0, 153, 204, 0.16)' : '1px solid rgba(0, 212, 255, 0.18)', borderRadius: '10px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {t('adminConsoleName')}
            </div>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {user?.company}
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }} role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  width: 'calc(100% - 16px)',
                  margin: '2px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  background: isActive ? 'var(--grad-aurora-soft)' : 'transparent',
                  border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                  borderRadius: 'var(--r-md)',
                  color: isActive ? 'var(--violet)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s var(--ease-quick)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-muted)' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
              >
                <span style={{ fontSize: '15px', opacity: isActive ? 1 : 0.7 }} aria-hidden="true">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <LangToggle style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }} />

          <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '4px' }}>{user?.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--cyan)', marginBottom: '12px' }}>{t('adminRole')}</div>

          <button
            onClick={() => { logout(); navigate('/login') }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '15px' }}
            aria-label="Logout"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: '260px', flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg-strong)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: 700 }}>
              {navItems.find((n) => n.id === activeNav)?.label}
            </h1>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('adminUpdated')}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="tag"><span className="status-dot green" style={{ background: '#22c55e' }} /> {t('adminSystemOk')}</div>
            {isSuperAdmin && (
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '15px' }} aria-label="Create new scenario" onClick={() => navigate('/scenario-builder')}>
                {t('adminNewScenario')}
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: activeNav === 'analytics' || activeNav === 'reports' || activeNav === 'compliance' || activeNav === 'campaigns' || activeNav === 'riskscore' || activeNav === 'templates' ? '0' : '40px' }}>
          {activeNav === 'executive' && <TabExecutive lang={lang} />}
          {activeNav === 'dashboard' && <TabDashboard t={t} pieData={pieData} />}
          {activeNav === 'employees' && <TabEmployees t={t} lang={lang} employees={employees} onSelectEmployee={(emp) => setModal({ type: 'employee', data: emp })} onCreateEmployee={() => setModal({ type: 'createEmployee' })} onToggleLicense={handleToggleLicense} />}
          {activeNav === 'groups' && <TabGroups lang={lang} companyId={1} showToast={showToast} scenarioLibrary={scenarioLibrary} />}
          {activeNav === 'scenarios' && <TabScenarios t={t} lang={lang} scenarioLibrary={scenarioLibrary} onAssign={(s) => setAssignScenario(s)} canEdit={isSuperAdmin} />}
          {activeNav === 'analytics'  && <Analytics embedded />}
          {activeNav === 'reports'    && <Reports embedded />}
          {activeNav === 'compliance' && <Compliance embedded />}
          {activeNav === 'campaigns'  && <Campaigns embedded />}
          {activeNav === 'riskscore'  && <RiskScore embedded />}
          {activeNav === 'templates'  && <EmailTemplates embedded />}
          {activeNav === 'settings' && <TabSettings lang={lang} user={user} />}
        </div>
      </main>
    </div>
  )
}