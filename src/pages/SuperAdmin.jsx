import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const companiesData = [
  { id: 1, name: 'ACME Corp', plan: 'Business', users: 161, active: 142, scenarios: 6, licenses: 200, expire: '31/12/2025', status: 'active' },
  { id: 2, name: 'BNP Finance', plan: 'Enterprise', users: 892, active: 814, scenarios: 12, licenses: 1000, expire: '30/06/2025', status: 'active' },
  { id: 3, name: 'Mairie de Lyon', plan: 'Starter', users: 24, active: 18, scenarios: 3, licenses: 25, expire: '15/05/2025', status: 'expiring' },
  { id: 4, name: 'StartupTech SAS', plan: 'Starter', users: 12, active: 8, scenarios: 2, licenses: 25, expire: '01/09/2025', status: 'active' },
  { id: 5, name: 'Groupe Renault', plan: 'Enterprise', users: 2840, active: 2100, scenarios: 18, licenses: 3000, expire: '31/03/2026', status: 'active' },
]

const scenariosData = [
  { id: 1, title: { fr: 'Opération : Inbox Zero', en: 'Operation: Inbox Zero' }, category: 'Phishing', difficulty: 'intermediate', duration: '15 min', plays: 3241, score: 724, status: 'published' },
  { id: 2, title: { fr: 'Bureau Compromis', en: 'Compromised Desktop' }, category: 'Ransomware', difficulty: 'advanced', duration: '20 min', plays: 1892, score: 612, status: 'published' },
  { id: 3, title: { fr: 'Ingénierie Sociale', en: 'Social Engineering' }, category: 'Social Eng.', difficulty: 'beginner', duration: '10 min', plays: 4102, score: 831, status: 'published' },
  { id: 4, title: { fr: 'Fuite de Données', en: 'Data Breach' }, category: 'Insider', difficulty: 'advanced', duration: '25 min', plays: 987, score: 568, status: 'beta' },
  { id: 5, title: { fr: 'WiFi Piégé', en: 'Rogue WiFi' }, category: 'Réseau', difficulty: 'intermediate', duration: '12 min', plays: 0, score: 0, status: 'draft' },
]

const licensesData = [
  { id: 1, company: 'ACME Corp', plan: 'Business', seats: 200, used: 161, price: 199, period: 'monthly', expires: '31/12/2025' },
  { id: 2, company: 'BNP Finance', plan: 'Enterprise', seats: 1000, used: 814, price: 'custom', period: 'annual', expires: '30/06/2025' },
  { id: 3, company: 'Mairie de Lyon', plan: 'Starter', seats: 25, used: 18, price: 49, period: 'monthly', expires: '15/05/2025' },
]

function statusBadge(s, t) {
  const map = { active: [t('badgeActive'), '#22c55e'], expiring: [t('badgeExpiring'), '#f59e0b'], suspended: [t('badgeSuspended'), 'var(--red)'], published: [t('badgePublished'), '#22c55e'], beta: [t('badgeBeta'), '#f59e0b'], draft: [t('badgeDraft'), 'var(--text-muted)'] }
  const [label, color] = map[s] || [s, 'var(--text-muted)']
  return <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--mono)', color, border: `1px solid ${color}`, background: `${color}15` }}>{label}</span>
}

export default function SuperAdmin() {
  const { user, logout } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('overview')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

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

  const diffLabel = (d) => ({ intermediate: t('diffIntermediate'), advanced: t('diffAdvanced'), beginner: t('diffBeginner') })[d] || d

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {/* Toast */}
      {toast && <Toast message={toast} type="success" />}

      {/* Modals */}
      <Modal isOpen={modal?.type === 'addCompany'} onClose={() => setModal(null)} title={t('saAdd')}>
        <form onSubmit={(e) => { e.preventDefault(); setModal(null); showToast(lang === 'fr' ? 'Entreprise créée avec succès' : 'Company created successfully') }}>
          {['name', 'email', 'plan'].map(field => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label htmlFor={`field-${field}`} style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {lang === 'fr' ? (field === 'name' ? 'NOM' : field === 'email' ? 'EMAIL CONTACT' : 'PLAN') : (field === 'name' ? 'NAME' : field === 'email' ? 'CONTACT EMAIL' : 'PLAN')}
              </label>
              {field === 'plan' ? (
                <select id={`field-${field}`} style={{ width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '13px' }} aria-label={field === 'plan' ? 'Select plan' : undefined}>
                  <option>Starter</option>
                  <option>Business</option>
                  <option>Enterprise</option>
                </select>
              ) : (
                <input id={`field-${field}`} className="input-dark" placeholder={field === 'name' ? 'ACME Corp' : 'contact@company.com'} required aria-label={field === 'name' ? 'Company name' : 'Contact email'} />
              )}
            </div>
          ))}
          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }} aria-label="Create company">
            {lang === 'fr' ? 'Créer entreprise' : 'Create company'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={modal?.type === 'manageCompany' && !!modal.data} onClose={() => setModal(null)} title={modal?.data?.name || ''}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }} role="grid" aria-label="Company statistics">
          {[
            [lang === 'fr' ? 'Plan' : 'Plan', modal?.data?.plan],
            [lang === 'fr' ? 'Utilisateurs actifs' : 'Active users', `${modal?.data?.active}/${modal?.data?.users}`],
            [lang === 'fr' ? 'Scénarios' : 'Scenarios', modal?.data?.scenarios],
            [lang === 'fr' ? 'Licences' : 'Licenses', modal?.data?.licenses],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '16px' }} role="gridcell">
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: 'var(--red)' }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }} aria-label={`Add licenses to ${modal?.data?.name}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? 'Licences augmentées' : 'Licenses increased') }}>
            {lang === 'fr' ? '+ Ajouter licences' : '+ Add licenses'}
          </button>
          <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '12px' }} aria-label={`Configure ${modal?.data?.name}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? 'Configuration mise à jour' : 'Configuration updated') }}>
            {lang === 'fr' ? '⚙ Configurer' : '⚙ Configure'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={modal?.type === 'createScenario'} onClose={() => setModal(null)} title={lang === 'fr' ? 'Créer scénario' : 'Create scenario'}>
        <form onSubmit={(e) => { e.preventDefault(); setModal(null); showToast(lang === 'fr' ? 'Scénario créé' : 'Scenario created') }}>
          {['title', 'category', 'difficulty'].map(field => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label htmlFor={`scenario-${field}`} style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {lang === 'fr' ? (field === 'title' ? 'TITRE' : field === 'category' ? 'CATÉGORIE' : 'NIVEAU') : (field === 'title' ? 'TITLE' : field === 'category' ? 'CATEGORY' : 'DIFFICULTY')}
              </label>
              {field === 'category' ? (
                <select id={`scenario-${field}`} style={{ width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)' }} aria-label="Scenario category">
                  <option>Phishing</option>
                  <option>Ransomware</option>
                  <option>Social Eng.</option>
                </select>
              ) : field === 'difficulty' ? (
                <select id={`scenario-${field}`} style={{ width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)' }} aria-label="Scenario difficulty">
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </select>
              ) : (
                <input id={`scenario-${field}`} className="input-dark" placeholder={lang === 'fr' ? 'Ex: Bureau Compromis' : 'Ex: Compromised Desktop'} required aria-label="Scenario title" />
              )}
            </div>
          ))}
          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }} aria-label="Create scenario">
            {lang === 'fr' ? 'Créer' : 'Create'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={modal?.type === 'editScenario' && !!modal.data} onClose={() => setModal(null)} title={typeof modal?.data?.title === 'object' ? modal?.data?.title[lang] : modal?.data?.title || ''}>
        <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>{lang === 'fr' ? 'STATISTIQUES' : 'STATISTICS'}</div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>{lang === 'fr' ? 'Parties:' : 'Plays:'}</span> <span style={{ color: 'var(--red)', fontWeight: 700 }}>{modal?.data?.plays}</span></div>
            <div><span style={{ color: 'var(--text-muted)' }}>{lang === 'fr' ? 'Score moy:' : 'Avg score:'}</span> <span style={{ color: 'var(--red)', fontWeight: 700 }}>{modal?.data?.score}</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }} aria-label={`Edit scenario ${typeof modal?.data?.title === 'object' ? modal?.data?.title[lang] : modal?.data?.title}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? 'Scénario mis à jour' : 'Scenario updated') }}>
            {lang === 'fr' ? '✎ Éditer' : '✎ Edit'}
          </button>
          <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '12px' }} aria-label={`Archive scenario ${typeof modal?.data?.title === 'object' ? modal?.data?.title[lang] : modal?.data?.title}`} onClick={() => { setModal(null); showToast(lang === 'fr' ? 'Scénario archivé' : 'Scenario archived') }}>
            {lang === 'fr' ? '📦 Archiver' : '📦 Archive'}
          </button>
        </div>
      </Modal>

      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: '#080808', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Logo size="sm" />
          <div style={{ marginTop: '12px', padding: '8px 10px', background: 'rgba(235,40,40,0.12)', border: '1px solid rgba(235,40,40,0.3)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--red)', letterSpacing: '0.15em' }}>SUPER ADMIN</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t('saAccess')}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }} role="navigation" aria-label="Main navigation">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: activeNav === item.id ? 'rgba(235,40,40,0.08)' : 'transparent', borderLeft: activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent', color: activeNav === item.id ? 'var(--text-light)' : 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'all 0.15s', cursor: 'pointer' }} aria-current={activeNav === item.id ? 'page' : undefined} aria-label={`Navigate to ${item.label}`}>
              <span style={{ fontSize: '16px' }} aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <LangToggle style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }} />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{user?.name}</div>
          <button onClick={() => { logout(); navigate('/login') }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '12px', marginTop: '8px' }} aria-label="Logout">
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
          {/* Overview */}
          {activeNav === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border-subtle)' }}>
              {kpis.map(k => (
                <div key={k.label} style={{ background: 'var(--bg-card)', padding: '24px 28px', borderTop: k.accent ? '2px solid var(--red)' : '2px solid transparent' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '10px' }}>{k.label}</div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', fontWeight: 700, color: k.accent ? 'var(--red)' : 'var(--text-light)', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '6px' }}>↑ {k.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Companies */}
          {activeNav === 'companies' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saCompaniesTitle')} ({companiesData.length})</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={() => setModal({ type: 'addCompany' })} aria-label="Add new company">{t('saAdd')}</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Companies list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[t('saColCompany'), t('saColPlan'), t('saColUsers'), t('saColScenarios'), t('saColLicenses'), t('saColExpires'), t('saColStatus'), ''].map((h, i) => (
                      <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }} role="columnheader">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companiesData.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', cursor: 'pointer' }}>
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{c.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: '11px', fontFamily: 'var(--mono)' }}>{c.plan}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px' }}><span style={{ color: 'var(--text-light)' }}>{c.active}</span><span style={{ color: 'var(--text-muted)' }}>/{c.users}</span></td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.scenarios}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.licenses}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: c.status === 'expiring' ? '#f59e0b' : 'var(--text-muted)' }}>{c.expire}</td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(c.status, t)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <button onClick={() => setModal({ type: 'manageCompany', data: c })} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--mono)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          aria-label={`Manage company ${c.name}`}
                        >{t('saManage')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Scenarios */}
          {activeNav === 'scenarios' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saScenariosTitle')} ({scenariosData.length})</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={() => setModal({ type: 'createScenario' })}>{t('saCreateScenario')}</button>
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
                  {scenariosData.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{typeof s.title === 'object' ? s.title[lang] : s.title}</td>
                      <td style={{ padding: '14px 20px' }}><span className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{s.category}</span></td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{diffLabel(s.difficulty)}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{s.duration}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-light)' }}>{s.plays.toLocaleString()}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)' }}>{s.score > 0 ? s.score : '—'}</td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(s.status, t)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <button onClick={() => setModal({ type: 'editScenario', data: s })} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--mono)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                        >{t('saEdit')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Licenses */}
          {activeNav === 'licenses' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saNavLicenses')}</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[lang === 'fr' ? 'Entreprise' : 'Company', lang === 'fr' ? 'Plan' : 'Plan', lang === 'fr' ? 'Sièges' : 'Seats', lang === 'fr' ? 'Utilisés' : 'Used', lang === 'fr' ? 'Forfait' : 'Billing', lang === 'fr' ? 'Expire' : 'Expires'].map((h, i) => (
                      <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {licensesData.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{l.company}</td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', fontFamily: 'var(--mono)' }}>{l.plan}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-light)' }}>{l.seats}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                        <div style={{ color: 'var(--text-light)' }}>{l.used}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({Math.round(l.used / l.seats * 100)}%)</div>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)' }}>{l.price === 'custom' ? 'Custom' : `€${l.price}`}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{l.expires}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* System */}
          {activeNav === 'system' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { name: lang === 'fr' ? 'Infrastructure' : 'Infrastructure', status: 'operational', uptime: '99.98%', checks: 12 },
                { name: lang === 'fr' ? 'Bases de données' : 'Databases', status: 'operational', uptime: '100%', checks: 8 },
                { name: lang === 'fr' ? 'API' : 'API', status: 'operational', uptime: '99.95%', checks: 15 },
                { name: lang === 'fr' ? 'Stockage' : 'Storage', status: 'operational', uptime: '100%', checks: 5 },
              ].map(s => (
                <div key={s.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>{s.name}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>{lang === 'fr' ? 'Disponibilité' : 'Uptime'}</div>
                      <div style={{ color: '#22c55e', fontWeight: 700 }}>{s.uptime}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '4px' }}>{lang === 'fr' ? 'Vérifications' : 'Checks'}</div>
                      <div style={{ color: 'var(--text-light)', fontWeight: 700 }}>{s.checks}/sec</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
