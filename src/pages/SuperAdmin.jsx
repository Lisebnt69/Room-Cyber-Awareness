import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ScenarioBuilder from './ScenarioBuilder'

const INITIAL_COMPANIES = [
  { id: 1, name: 'ACME Corp', plan: 'Business', users: 161, active: 142, scenarios: 6, licenses: 200, expire: '31/12/2025', status: 'active', email: 'admin@acme.com', sector: 'Finance' },
  { id: 2, name: 'BNP Finance', plan: 'Enterprise', users: 892, active: 814, scenarios: 12, licenses: 1000, expire: '30/06/2025', status: 'active', email: 'security@bnp.fr', sector: 'Finance' },
  { id: 3, name: 'Mairie de Lyon', plan: 'Starter', users: 24, active: 18, scenarios: 3, licenses: 25, expire: '15/05/2025', status: 'expiring', email: 'dsi@mairie-lyon.fr', sector: 'Administration' },
  { id: 4, name: 'StartupTech SAS', plan: 'Starter', users: 12, active: 8, scenarios: 2, licenses: 25, expire: '01/09/2025', status: 'active', email: 'cto@startuptech.io', sector: 'Tech' },
  { id: 5, name: 'Groupe Renault', plan: 'Enterprise', users: 2840, active: 2100, scenarios: 18, licenses: 3000, expire: '31/03/2026', status: 'active', email: 'cybersec@renault.com', sector: 'Industrie' },
]

const licensesData = [
  { id: 1, company: 'ACME Corp', plan: 'Business', seats: 200, used: 161, price: 199, period: 'monthly', expires: '31/12/2025' },
  { id: 2, company: 'BNP Finance', plan: 'Enterprise', seats: 1000, used: 814, price: 'custom', period: 'annual', expires: '30/06/2025' },
  { id: 3, company: 'Mairie de Lyon', plan: 'Starter', seats: 25, used: 18, price: 49, period: 'monthly', expires: '15/05/2025' },
]

const SECTORS = ['Finance', 'Santé', 'Administration', 'Éducation', 'Industrie', 'Commerce', 'Énergie', 'Juridique', 'Tech', 'Transport']
const PLANS = ['Starter', 'Business', 'Enterprise']
const STATUS_OPTIONS = ['active', 'expiring', 'suspended']

const DEFAULT_SCENARIO_FIELDS = {
  id: null,
  title: { fr: '', en: '' },
  titleFr: '',
  titleEn: '',
  category: 'Phishing',
  difficulty: 'intermediate',
  duration: '15',
  description: '',
  coverImage: '',
  coverImageName: '',
  mappingContext: '',
  fakeLinkLabel: '',
  fakeLinkUrl: '',
  fakeLinkHover: '',
  fakeEmailSender: '',
  fakeEmailSubject: '',
  fakeEmailBody: '',
  videoUrl: '',
  photoHotspots: [],
  quizQuestions: [],
  modules: [],
  blocks: [],
  plays: 0,
  score: 0,
  status: 'draft',
}

const moduleLabels = {
  photo: { fr: 'Photo', en: 'Photo' },
  mapping: { fr: 'Mapping', en: 'Mapping' },
  fakeLink: { fr: 'Faux lien', en: 'Fake link' },
  fakeEmail: { fr: 'Faux email', en: 'Fake email' },
  video: { fr: 'Vidéo', en: 'Video' },
  quiz: { fr: 'Quiz', en: 'Quiz' },
  miniPuzzle: { fr: 'Mini puzzle', en: 'Mini puzzle' },
}

const withScenarioDefaults = (scenario = {}) => ({
  ...DEFAULT_SCENARIO_FIELDS,
  ...scenario,
  title: {
    fr: scenario?.title?.fr || scenario?.title_fr || '',
    en: scenario?.title?.en || scenario?.title_en || scenario?.title_fr || '',
  },
  titleFr: scenario?.titleFr || scenario?.title_fr || scenario?.title?.fr || '',
  titleEn: scenario?.titleEn || scenario?.title_en || scenario?.title?.en || '',
  photoHotspots: Array.isArray(scenario?.photoHotspots) ? scenario.photoHotspots : [],
  quizQuestions: Array.isArray(scenario?.quizQuestions) ? scenario.quizQuestions : [],
  modules: Array.isArray(scenario?.modules) ? scenario.modules : [],
  blocks: Array.isArray(scenario?.blocks) ? scenario.blocks : [],
})

const apiToState = (scenario) => withScenarioDefaults({ ...scenario })

function statusBadge(status, t) {
  const map = {
    active: [t('badgeActive'), '#22c55e'],
    expiring: [t('badgeExpiring'), '#f59e0b'],
    suspended: [t('badgeSuspended'), 'var(--red)'],
    published: [t('badgePublished'), '#22c55e'],
    beta: [t('badgeBeta'), '#f59e0b'],
    draft: [t('badgeDraft'), 'var(--text-muted)'],
  }

  const [label, color] = map[status] || [status, 'var(--text-muted)']

  return (
    <span
      style={{
        padding: '3px 10px',
        fontSize: '14px',
        fontFamily: 'var(--font-body)',
        color,
        border: `1px solid ${color}`,
        background: `${color}15`,
      }}
    >
      {label}
    </span>
  )
}

export default function SuperAdmin() {
  const { user, logout } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [activeNav, setActiveNav] = useState('overview')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)
  const [companies, setCompanies] = useState(INITIAL_COMPANIES)
  const [scenarios, setScenarios] = useState([])
  const [editCompanyForm, setEditCompanyForm] = useState(null)
  const [builderMode, setBuilderMode] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadScenarios = () =>
    fetch('/api/scenarios')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setScenarios(data.map(apiToState))
        }
      })
      .catch(() => {})

  useEffect(() => {
    loadScenarios()
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCompanies(data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isCompact = viewportWidth < 1100
  const twoCols = isCompact ? '1fr' : '1fr 1fr'

  const handleBuilderSave = async (data) => {
    const body = {
      title_fr: data.titleFr,
      title_en: data.titleEn || data.titleFr,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      description: data.description,
      status: data.status || 'draft',
      blocks: data.blocks || [],
      plays: data.plays || 0,
      score: data.score || 0,
      mappingContext: data.mappingContext || '',
    }

    try {
      const isEdit = builderMode?.mode === 'edit' && data.id
      const url = isEdit ? `/api/scenarios/${data.id}` : '/api/scenarios'

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(`Erreur: ${err.error || 'inconnue'}`)
        return
      }

      await loadScenarios()
      showToast(
        lang === 'fr'
          ? `"${body.title_fr}" ${isEdit ? 'mis à jour' : 'créé'}`
          : `"${body.title_fr}" ${isEdit ? 'updated' : 'created'}`
      )
    } catch {
      showToast(lang === 'fr' ? 'Erreur réseau' : 'Network error')
    }

    setBuilderMode(null)
  }

  const handleDeleteScenario = async (scenario) => {
    const label =
      lang === 'fr'
        ? scenario.title?.fr || scenario.title_fr
        : scenario.title?.en || scenario.title_fr

    if (!confirm(lang === 'fr' ? `Supprimer "${label}" ?` : `Delete "${label}" ?`)) {
      return
    }

    await fetch(`/api/scenarios/${scenario.id}`, { method: 'DELETE' })
    await loadScenarios()
    showToast(lang === 'fr' ? 'Scénario supprimé' : 'Scenario deleted')
  }

  const openEditCompany = (company) => {
    setEditCompanyForm({ ...company })
    setModal({ type: 'editCompany', data: company })
  }

  const saveCompany = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/companies/${editCompanyForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCompanyForm),
      })

      if (!res.ok) {
        showToast(lang === 'fr' ? 'Erreur sauvegarde' : 'Save error')
        return
      }

      const updated = await res.json()
      setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setModal(null)
      showToast(lang === 'fr' ? `${updated.name} mis à jour` : `${updated.name} updated`)
    } catch {
      showToast(lang === 'fr' ? 'Erreur réseau' : 'Network error')
    }
  }

  const deleteCompany = async (id) => {
    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' })
      setCompanies((prev) => prev.filter((c) => c.id !== id))
      setModal(null)
      showToast(lang === 'fr' ? 'Entreprise supprimée' : 'Company deleted')
    } catch {
      showToast(lang === 'fr' ? 'Erreur réseau' : 'Network error')
    }
  }

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

  const diffLabel = (difficulty) =>
    ({
      intermediate: t('diffIntermediate'),
      advanced: t('diffAdvanced'),
      beginner: t('diffBeginner'),
    }[difficulty] || difficulty)

  const getScenarioModulesLabel = (scenario) => {
    const modules = Array.isArray(scenario.modules) ? scenario.modules : []
    if (!modules.length) return lang === 'fr' ? 'Aucun module' : 'No modules'
    return modules.map((m) => moduleLabels[m]?.[lang] || m).join(' · ')
  }

  if (builderMode) {
    return (
      <ScenarioBuilder
        initialData={builderMode.mode === 'edit' ? builderMode.scenario : null}
        onSave={handleBuilderSave}
        onBack={() => setBuilderMode(null)}
      />
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {toast && <Toast message={toast} type="success" />}

      <Modal isOpen={modal?.type === 'addCompany'} onClose={() => setModal(null)} title={t('saAdd')}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const plan = fd.get('plan')

            const body = {
              name: fd.get('name'),
              email: fd.get('email'),
              plan,
              sector: fd.get('sector'),
              licenses: plan === 'Starter' ? 25 : plan === 'Business' ? 200 : 1000,
              expire: '31/12/2026',
              status: 'active',
            }

            try {
              const res = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
              })

              if (!res.ok) {
                showToast(lang === 'fr' ? 'Erreur création' : 'Creation error')
                return
              }

              const created = await res.json()
              setCompanies((prev) => [...prev, created])
              setModal(null)
              showToast(lang === 'fr' ? `${created.name} créée avec succès` : `${created.name} created successfully`)
            } catch {
              showToast(lang === 'fr' ? 'Erreur réseau' : 'Network error')
            }
          }}
        >
          {[
            {
              name: 'name',
              label: lang === 'fr' ? 'NOM ENTREPRISE' : 'COMPANY NAME',
              type: 'text',
              placeholder: 'ACME Corp',
            },
            {
              name: 'email',
              label: lang === 'fr' ? 'EMAIL CONTACT' : 'CONTACT EMAIL',
              type: 'email',
              placeholder: 'admin@company.com',
            },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                }}
              >
                {field.label}
              </label>
              <input
                name={field.name}
                className="input-dark"
                type={field.type}
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                }}
              >
                PLAN
              </label>
              <select
                name="plan"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d0d0d',
                  border: '1px solid var(--border)',
                  color: 'var(--text-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                }}
              >
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                }}
              >
                {lang === 'fr' ? 'SECTEUR' : 'SECTOR'}
              </label>
              <select
                name="sector"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#0d0d0d',
                  border: '1px solid var(--border)',
                  color: 'var(--text-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                }}
              >
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
            {lang === 'fr' ? '+ Créer entreprise' : '+ Create company'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={modal?.type === 'editCompany' && !!editCompanyForm}
        onClose={() => setModal(null)}
        title={lang === 'fr' ? `Éditer : ${editCompanyForm?.name}` : `Edit: ${editCompanyForm?.name}`}
      >
        {editCompanyForm && (
          <form onSubmit={saveCompany}>
            <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {lang === 'fr' ? 'NOM' : 'NAME'}
                </label>
                <input
                  className="input-dark"
                  value={editCompanyForm.name}
                  onChange={(e) => setEditCompanyForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  EMAIL
                </label>
                <input
                  className="input-dark"
                  type="email"
                  value={editCompanyForm.email}
                  onChange={(e) => setEditCompanyForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  PLAN
                </label>
                <select
                  value={editCompanyForm.plan}
                  onChange={(e) => setEditCompanyForm((f) => ({ ...f, plan: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}
                >
                  {PLANS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  SECTEUR
                </label>
                <select
                  value={editCompanyForm.sector}
                  onChange={(e) => setEditCompanyForm((f) => ({ ...f, sector: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}
                >
                  {SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  STATUS
                </label>
                <select
                  value={editCompanyForm.status}
                  onChange={(e) => setEditCompanyForm((f) => ({ ...f, status: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {lang === 'fr' ? 'LICENCES' : 'LICENSES'}
                </label>
                <input
                  className="input-dark"
                  type="number"
                  min="1"
                  value={editCompanyForm.licenses}
                  onChange={(e) =>
                    setEditCompanyForm((f) => ({
                      ...f,
                      licenses: parseInt(e.target.value, 10) || f.licenses,
                    }))
                  }
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {lang === 'fr' ? 'EXPIRATION' : 'EXPIRES'}
                </label>
                <input
                  className="input-dark"
                  value={editCompanyForm.expire}
                  onChange={(e) => setEditCompanyForm((f) => ({ ...f, expire: e.target.value }))}
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" type="submit" style={{ flex: 1, justifyContent: 'center' }}>
                {lang === 'fr' ? '✓ Sauvegarder' : '✓ Save changes'}
              </button>

              <button
                type="button"
                onClick={() => deleteCompany(editCompanyForm.id)}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(235,40,40,0.1)',
                  border: '1px solid rgba(235,40,40,0.3)',
                  color: 'var(--red)',
                  cursor: 'pointer',
                  fontSize: '15px',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
              >
                🗑 {lang === 'fr' ? 'Supprimer' : 'Delete'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: '#080808',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <img src={Logo} alt="ROOMCA" style={{ height: '32px', width: 'auto', display: 'block' }} />

          <div
            style={{
              marginTop: '12px',
              padding: '8px 10px',
              background: 'rgba(235,40,40,0.12)',
              border: '1px solid rgba(235,40,40,0.3)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--red)', letterSpacing: '0.15em' }}>
              SUPER ADMIN
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t('saAccess')}
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }} role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: activeNav === item.id ? 'rgba(235,40,40,0.08)' : 'transparent',
                borderLeft: activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent',
                color: activeNav === item.id ? 'var(--text-light)' : 'var(--text-muted)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
              aria-current={activeNav === item.id ? 'page' : undefined}
              aria-label={`Navigate to ${item.label}`}
            >
              <span style={{ fontSize: '16px' }} aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <LangToggle style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }} />
          <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '4px' }}>{user?.name}</div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '15px', marginTop: '8px' }}
            aria-label="Logout"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: '240px', flex: 1 }}>
        <div
          style={{
            padding: '20px 40px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#080808',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '20px' }}>{t('saTitle')}</h1>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
              ROOMCA Platform v2.4.1 — 07/04/2025
            </div>
          </div>
          <div className="tag">
            <span className="status-dot red" /> {t('saEnvProd')}
          </div>
        </div>

        <div style={{ padding: isCompact ? '16px' : '40px' }}>
          {activeNav === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border-subtle)' }}>
              {kpis.map((k) => (
                <div
                  key={k.label}
                  style={{
                    background: 'var(--bg-card)',
                    padding: '24px 28px',
                    borderTop: k.accent ? '2px solid var(--red)' : '2px solid transparent',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '10px' }}>
                    {k.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: k.accent ? 'var(--red)' : 'var(--text-light)',
                      lineHeight: 1,
                    }}
                  >
                    {k.value}
                  </div>
                  <div style={{ fontSize: '15px', color: '#22c55e', marginTop: '6px' }}>↑ {k.sub}</div>
                </div>
              ))}
            </div>
          )}

          {activeNav === 'companies' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  padding: '20px 28px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                  {t('saCompaniesTitle')} ({companies.length})
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '15px' }}
                  onClick={() => setModal({ type: 'addCompany' })}
                  aria-label="Add new company"
                >
                  {t('saAdd')}
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Companies list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[t('saColCompany'), t('saColPlan'), lang === 'fr' ? 'Secteur' : 'Sector', t('saColUsers'), t('saColLicenses'), t('saColExpires'), t('saColStatus'), ''].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '12px 20px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em',
                          fontWeight: 400,
                        }}
                        role="columnheader"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {companies.map((c, i) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(235,40,40,0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                      }}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{c.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', fontFamily: 'var(--font-body)' }}>{c.plan}</td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--text-muted)' }}>{c.sector || '—'}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px' }}>
                        <span style={{ color: 'var(--text-light)' }}>{c.active}</span>
                        <span style={{ color: 'var(--text-muted)' }}>/ {c.users}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)' }}>{c.licenses}</td>
                      <td
                        style={{
                          padding: '14px 20px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          color: c.status === 'expiring' ? '#f59e0b' : 'var(--text-muted)',
                        }}
                      >
                        {c.expire}
                      </td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(c.status, t)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => openEditCompany(c)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-muted)',
                            padding: '4px 12px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--red)'
                            e.currentTarget.style.color = 'var(--red)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)'
                            e.currentTarget.style.color = 'var(--text-muted)'
                          }}
                          aria-label={`Edit company ${c.name}`}
                        >
                          ✎ {t('saEdit')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeNav === 'scenarios' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  padding: '20px 28px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                  {t('saScenariosTitle')} ({scenarios.length})
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '15px' }}
                  onClick={() => setBuilderMode({ mode: 'create' })}
                  aria-label="Create new scenario"
                >
                  {t('saCreateScenario')}
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Scenarios list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[t('saColTitle'), t('saColCategory'), t('saColDifficulty'), t('saColDuration'), 'Modules', t('saColPlays'), t('saColAvgScore'), t('saColStatus'), ''].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '12px 20px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em',
                          fontWeight: 400,
                        }}
                        role="columnheader"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {scenarios.map((s, i) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(235,40,40,0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                      }}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>
                        {typeof s.title === 'object' ? s.title[lang] : s.title}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className="tag" style={{ fontSize: '13px', padding: '2px 8px' }}>
                          {s.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
                        {diffLabel(s.difficulty)}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
                        {s.duration} min
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--text-muted)', maxWidth: '240px' }}>
                        {getScenarioModulesLabel(s)}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-light)' }}>
                        {(s.plays || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--red)' }}>
                        {s.score > 0 ? s.score : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(s.status, t)}</td>
                      <td style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => navigate('/preview/' + s.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #22c55e',
                            color: '#22c55e',
                            padding: '4px 10px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                          }}
                          aria-label={`Test scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
                        >
                          ▶ Tester
                        </button>

                        <button
                          onClick={() => setBuilderMode({ mode: 'edit', scenario: s })}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-muted)',
                            padding: '4px 12px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--red)'
                            e.currentTarget.style.color = 'var(--red)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)'
                            e.currentTarget.style.color = 'var(--text-muted)'
                          }}
                          aria-label={`Edit scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
                        >
                          ✎ {t('saEdit')}
                        </button>

                        <button
                          onClick={() => handleDeleteScenario(s)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(235,40,40,0.4)',
                            color: 'rgba(235,40,40,0.7)',
                            padding: '4px 10px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--red)'
                            e.currentTarget.style.color = 'var(--red)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(235,40,40,0.4)'
                            e.currentTarget.style.color = 'rgba(235,40,40,0.7)'
                          }}
                          aria-label="Delete scenario"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeNav === 'licenses' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                  {t('saNavLicenses')}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Licenses list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[lang === 'fr' ? 'Entreprise' : 'Company', lang === 'fr' ? 'Plan' : 'Plan', lang === 'fr' ? 'Sièges' : 'Seats', lang === 'fr' ? 'Utilisés' : 'Used', lang === 'fr' ? 'Forfait' : 'Billing', lang === 'fr' ? 'Expire' : 'Expires'].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: '12px 20px',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em',
                        }}
                        role="columnheader"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {licensesData.map((l, i) => (
                    <tr
                      key={l.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      }}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{l.company}</td>
                      <td style={{ padding: '14px 20px', fontSize: '15px', fontFamily: 'var(--font-body)' }}>{l.plan}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-light)' }}>{l.seats}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px' }}>
                        <div style={{ color: 'var(--text-light)' }}>{l.used}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          ({Math.round((l.used / l.seats) * 100)}%)
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--red)' }}>
                        {l.price === 'custom' ? 'Custom' : `€${l.price}`}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
                        {l.expires}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeNav === 'system' && (
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: '20px' }}>
              {[
                { name: lang === 'fr' ? 'Infrastructure' : 'Infrastructure', status: 'operational', uptime: '99.98%', checks: 12 },
                { name: lang === 'fr' ? 'Bases de données' : 'Databases', status: 'operational', uptime: '100%', checks: 8 },
                { name: lang === 'fr' ? 'API' : 'API', status: 'operational', uptime: '99.95%', checks: 15 },
                { name: lang === 'fr' ? 'Stockage' : 'Storage', status: 'operational', uptime: '100%', checks: 5 },
              ].map((s) => (
                <div key={s.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: '15px', fontWeight: 600 }}>{s.name}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>
                        {lang === 'fr' ? 'Disponibilité' : 'Uptime'}
                      </div>
                      <div style={{ color: '#22c55e', fontWeight: 700 }}>{s.uptime}</div>
                    </div>

                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>
                        {lang === 'fr' ? 'Vérifications' : 'Checks'}
                      </div>
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