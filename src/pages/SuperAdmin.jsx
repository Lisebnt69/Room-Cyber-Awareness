import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

const companies = [
  { id: 1, name: 'ACME Corp', plan: 'Business', users: 161, active: 142, scenarios: 6, licenses: 200, expire: '31/12/2025', status: 'active' },
  { id: 2, name: 'BNP Finance', plan: 'Enterprise', users: 892, active: 814, scenarios: 12, licenses: 1000, expire: '30/06/2025', status: 'active' },
  { id: 3, name: 'Mairie de Lyon', plan: 'Starter', users: 24, active: 18, scenarios: 3, licenses: 25, expire: '15/05/2025', status: 'expiring' },
  { id: 4, name: 'StartupTech SAS', plan: 'Starter', users: 12, active: 8, scenarios: 2, licenses: 25, expire: '01/09/2025', status: 'active' },
  { id: 5, name: 'Groupe Renault', plan: 'Enterprise', users: 2840, active: 2100, scenarios: 18, licenses: 3000, expire: '31/03/2026', status: 'active' },
]

const scenarios = [
  { id: 1, title: { fr: 'Opération : Inbox Zero', en: 'Operation: Inbox Zero' }, category: 'Phishing', difficulty: 'intermediate', duration: '15 min', plays: 3241, score: 724, status: 'published' },
  { id: 2, title: { fr: 'Bureau Compromis', en: 'Compromised Desktop' }, category: 'Ransomware', difficulty: 'advanced', duration: '20 min', plays: 1892, score: 612, status: 'published' },
  { id: 3, title: { fr: 'Ingénierie Sociale', en: 'Social Engineering' }, category: 'Social Eng.', difficulty: 'beginner', duration: '10 min', plays: 4102, score: 831, status: 'published' },
  { id: 4, title: { fr: 'Fuite de Données', en: 'Data Breach' }, category: 'Insider', difficulty: 'advanced', duration: '25 min', plays: 987, score: 568, status: 'beta' },
  { id: 5, title: { fr: 'WiFi Piégé', en: 'Rogue WiFi' }, category: 'Réseau', difficulty: 'intermediate', duration: '12 min', plays: 0, score: 0, status: 'draft' },
]

export default function SuperAdmin() {
  const { user, logout } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('overview')

  const navItems = [
    { id: 'overview', label: t('saNavOverview'), icon: '▦' },
    { id: 'companies', label: t('saNavCompanies'), icon: '◉' },
    { id: 'scenarios', label: t('saNavScenarios'), icon: '▷' },
    { id: 'licenses', label: t('saNavLicenses'), icon: '◈' },
    { id: 'system', label: t('saNavSystem'), icon: '◎' },
  ]

  const kpis = [
    { label: t('saKpiCompanies'), value: '48', sub: t('saKpiCompaniesSub'), accent: true },
    { label: t('saKpiUsers'), value: '12 840', sub: t('saKpiUsersSub') },
    { label: t('saKpiPlays'), value: '89 412', sub: t('saKpiPlaysSub') },
    { label: t('saKpiMrr'), value: '€24 800', sub: t('saKpiMrrSub') },
  ]

  const statusBadge = (s) => {
    const map = {
      active: { label: t('badgeActive'), color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
      expiring: { label: t('badgeExpiring'), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      suspended: { label: t('badgeSuspended'), color: 'var(--red)', bg: 'rgba(235,40,40,0.1)' },
      published: { label: t('badgePublished'), color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
      beta: { label: t('badgeBeta'), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      draft: { label: t('badgeDraft'), color: 'var(--text-muted)', bg: 'rgba(84,84,84,0.1)' },
    }
    const style = map[s] || { label: s, color: 'var(--text-muted)', bg: 'transparent' }
    return <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--mono)', color: style.color, border: `1px solid ${style.color}`, background: style.bg }}>{style.label}</span>
  }

  const diffLabel = (d) => ({ intermediate: t('diffIntermediate'), advanced: t('diffAdvanced'), beginner: t('diffBeginner') })[d] || d

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: '#080808', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Logo size="sm" />
          <div style={{ marginTop: '12px', padding: '8px 10px', background: 'rgba(235,40,40,0.12)', border: '1px solid rgba(235,40,40,0.3)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--red)', letterSpacing: '0.15em' }}>SUPER ADMIN</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t('saAccess')}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: activeNav === item.id ? 'rgba(235,40,40,0.08)' : 'transparent', borderLeft: activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent', color: activeNav === item.id ? 'var(--text-light)' : 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'all 0.15s', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <LangToggle style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }} />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{user?.name}</div>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '12px', marginTop: '8px' }}>
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '240px', flex: 1 }}>
        <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080808', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '20px' }}>{t('saTitle')}</h1>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>ROOMCA Platform v2.4.1 — 07/04/2025</div>
          </div>
          <div className="tag"><span className="status-dot red" /> {t('saEnvProd')}</div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border-subtle)', marginBottom: '40px' }}>
            {kpis.map(k => (
              <div key={k.label} style={{ background: 'var(--bg-card)', padding: '24px 28px', borderTop: k.accent ? '2px solid var(--red)' : '2px solid transparent' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '10px' }}>{k.label}</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', fontWeight: 700, color: k.accent ? 'var(--red)' : 'var(--text-light)', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '6px' }}>↑ {k.sub}</div>
              </div>
            ))}
          </div>

          {/* Companies */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', marginBottom: '32px' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saCompaniesTitle')} ({companies.length})</div>
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>{t('saAdd')}</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {[t('saColCompany'), t('saColPlan'), t('saColUsers'), t('saColScenarios'), t('saColLicenses'), t('saColExpires'), t('saColStatus'), ''].map((h, i) => (
                    <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,40,40,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: '14px 20px' }}><span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: c.plan === 'Enterprise' ? 'var(--red)' : 'var(--text-muted)', border: '1px solid', borderColor: c.plan === 'Enterprise' ? 'var(--red)' : 'var(--border)', padding: '2px 8px' }}>{c.plan}</span></td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px' }}><span style={{ color: 'var(--text-light)' }}>{c.active}</span><span style={{ color: 'var(--text-muted)' }}>/{c.users}</span></td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.scenarios}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.licenses}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: c.status === 'expiring' ? '#f59e0b' : 'var(--text-muted)' }}>{c.expire}</td>
                    <td style={{ padding: '14px 20px' }}>{statusBadge(c.status)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--mono)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                      >{t('saManage')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scenarios */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saScenariosTitle')} ({scenarios.length})</div>
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>{t('saCreateScenario')}</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {[t('saColTitle'), t('saColCategory'), t('saColDifficulty'), t('saColDuration'), t('saColPlays'), t('saColAvgScore'), t('saColStatus'), ''].map((h, i) => (
                    <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,40,40,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500 }}>{typeof s.title === 'object' ? s.title[lang] : s.title}</td>
                    <td style={{ padding: '14px 20px' }}><span className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{s.category}</span></td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{diffLabel(s.difficulty)}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{s.duration}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-light)' }}>{s.plays.toLocaleString()}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)' }}>{s.score > 0 ? s.score : '—'}</td>
                    <td style={{ padding: '14px 20px' }}>{statusBadge(s.status)}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--mono)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                      >{t('saEdit')}</button>
                    </td>
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
