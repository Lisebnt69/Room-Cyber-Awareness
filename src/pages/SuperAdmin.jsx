import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/home/lise/Room-Cyber-Awareness/public/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

const INITIAL_COMPANIES = [
  { id: 1, name: 'ACME Corp', plan: 'Business', users: 161, active: 142, scenarios: 6, licenses: 200, expire: '31/12/2025', status: 'active', email: 'admin@acme.com', sector: 'Finance' },
  { id: 2, name: 'BNP Finance', plan: 'Enterprise', users: 892, active: 814, scenarios: 12, licenses: 1000, expire: '30/06/2025', status: 'active', email: 'security@bnp.fr', sector: 'Finance' },
  { id: 3, name: 'Mairie de Lyon', plan: 'Starter', users: 24, active: 18, scenarios: 3, licenses: 25, expire: '15/05/2025', status: 'expiring', email: 'dsi@mairie-lyon.fr', sector: 'Administration' },
  { id: 4, name: 'StartupTech SAS', plan: 'Starter', users: 12, active: 8, scenarios: 2, licenses: 25, expire: '01/09/2025', status: 'active', email: 'cto@startuptech.io', sector: 'Tech' },
  { id: 5, name: 'Groupe Renault', plan: 'Enterprise', users: 2840, active: 2100, scenarios: 18, licenses: 3000, expire: '31/03/2026', status: 'active', email: 'cybersec@renault.com', sector: 'Industrie' },
]

const INITIAL_SCENARIOS = [
  { id: 1, title: { fr: 'Opération : Inbox Zero', en: 'Operation: Inbox Zero' }, category: 'Phishing', difficulty: 'intermediate', duration: '15', plays: 3241, score: 724, status: 'published', description: 'Simulation d\'attaque phishing avancée par email' },
  { id: 2, title: { fr: 'Bureau Compromis', en: 'Compromised Desktop' }, category: 'Ransomware', difficulty: 'advanced', duration: '20', plays: 1892, score: 612, status: 'published', description: 'Scénario de ransomware sur poste de travail' },
  { id: 3, title: { fr: 'Ingénierie Sociale', en: 'Social Engineering' }, category: 'Social Eng.', difficulty: 'beginner', duration: '10', plays: 4102, score: 831, status: 'published', description: 'Manipulation psychologique et pretexting' },
  { id: 4, title: { fr: 'Fuite de Données', en: 'Data Breach' }, category: 'Insider', difficulty: 'advanced', duration: '25', plays: 987, score: 568, status: 'beta', description: 'Détection d\'une exfiltration de données sensibles' },
  { id: 5, title: { fr: 'WiFi Piégé', en: 'Rogue WiFi' }, category: 'Réseau', difficulty: 'intermediate', duration: '12', plays: 0, score: 0, status: 'draft', description: 'Attaque par point d\'accès WiFi malveillant' },
]

const licensesData = [
  { id: 1, company: 'ACME Corp', plan: 'Business', seats: 200, used: 161, price: 199, period: 'monthly', expires: '31/12/2025' },
  { id: 2, company: 'BNP Finance', plan: 'Enterprise', seats: 1000, used: 814, price: 'custom', period: 'annual', expires: '30/06/2025' },
  { id: 3, company: 'Mairie de Lyon', plan: 'Starter', seats: 25, used: 18, price: 49, period: 'monthly', expires: '15/05/2025' },
]

const SECTORS = ['Finance', 'Santé', 'Administration', 'Éducation', 'Industrie', 'Commerce', 'Énergie', 'Juridique', 'Tech', 'Transport']
const PLANS = ['Starter', 'Business', 'Enterprise']
const STATUS_OPTIONS = ['active', 'expiring', 'suspended']
const SCENARIO_CATEGORIES = ['Phishing', 'Ransomware', 'Social Eng.', 'Insider', 'Réseau', 'Malware', 'OSINT']
const SCENARIO_STATUSES = ['draft', 'beta', 'published']

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
  const [companies, setCompanies] = useState(INITIAL_COMPANIES)
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS)
  const [editCompanyForm, setEditCompanyForm] = useState(null)
  const [editScenarioForm, setEditScenarioForm] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const openEditCompany = (c) => {
    setEditCompanyForm({ ...c })
    setModal({ type: 'editCompany', data: c })
  }

  const saveCompany = (e) => {
    e.preventDefault()
    setCompanies(prev => prev.map(c => c.id === editCompanyForm.id ? { ...editCompanyForm } : c))
    setModal(null)
    showToast(lang === 'fr' ? `${editCompanyForm.name} mis à jour` : `${editCompanyForm.name} updated`)
  }

  const deleteCompany = (id) => {
    setCompanies(prev => prev.filter(c => c.id !== id))
    setModal(null)
    showToast(lang === 'fr' ? 'Entreprise supprimée' : 'Company deleted')
  }

  const openEditScenario = (s) => {
    setEditScenarioForm({ ...s, titleFr: s.title.fr, titleEn: s.title.en })
    setModal({ type: 'editScenario', data: s })
  }

  const saveScenario = (e) => {
    e.preventDefault()
    const updated = {
      ...editScenarioForm,
      title: { fr: editScenarioForm.titleFr, en: editScenarioForm.titleEn }
    }
    setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s))
    setModal(null)
    showToast(lang === 'fr' ? 'Scénario mis à jour' : 'Scenario updated')
  }

  const createScenario = (e) => {
    e.preventDefault()
    const newS = {
      id: Date.now(),
      title: { fr: editScenarioForm.titleFr, en: editScenarioForm.titleEn || editScenarioForm.titleFr },
      category: editScenarioForm.category || 'Phishing',
      difficulty: editScenarioForm.difficulty || 'intermediate',
      duration: editScenarioForm.duration || '15',
      description: editScenarioForm.description || '',
      plays: 0, score: 0, status: 'draft',
    }
    setScenarios(prev => [...prev, newS])
    setModal(null)
    showToast(lang === 'fr' ? 'Scénario créé' : 'Scenario created')
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

  const diffLabel = (d) => ({ intermediate: t('diffIntermediate'), advanced: t('diffAdvanced'), beginner: t('diffBeginner') })[d] || d

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {/* Toast */}
      {toast && <Toast message={toast} type="success" />}

      {/* Modals */}
      {/* Add Company Modal */}
      <Modal isOpen={modal?.type === 'addCompany'} onClose={() => setModal(null)} title={t('saAdd')}>
        <form onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const newC = { id: Date.now(), name: fd.get('name'), email: fd.get('email'), plan: fd.get('plan'), sector: fd.get('sector'), users: 0, active: 0, scenarios: 0, licenses: fd.get('plan') === 'Starter' ? 25 : fd.get('plan') === 'Business' ? 200 : 1000, expire: '31/12/2026', status: 'active' }
          setCompanies(prev => [...prev, newC])
          setModal(null)
          showToast(lang === 'fr' ? `${newC.name} créée avec succès` : `${newC.name} created successfully`)
        }}>
          {[
            { name: 'name', label: lang === 'fr' ? 'NOM ENTREPRISE' : 'COMPANY NAME', type: 'text', placeholder: 'ACME Corp' },
            { name: 'email', label: lang === 'fr' ? 'EMAIL CONTACT' : 'CONTACT EMAIL', type: 'email', placeholder: 'admin@company.com' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{f.label}</label>
              <input name={f.name} className="input-dark" type={f.type} placeholder={f.placeholder} required />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>PLAN</label>
              <select name="plan" style={{ width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                {PLANS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>SECTEUR</label>
              <select name="sector" style={{ width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
            {lang === 'fr' ? '+ Créer entreprise' : '+ Create company'}
          </button>
        </form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal isOpen={modal?.type === 'editCompany' && !!editCompanyForm} onClose={() => setModal(null)} title={lang === 'fr' ? `Éditer : ${editCompanyForm?.name}` : `Edit: ${editCompanyForm?.name}`}>
        {editCompanyForm && (
          <form onSubmit={saveCompany}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'NOM' : 'NAME'}</label>
                <input className="input-dark" value={editCompanyForm.name} onChange={e => setEditCompanyForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>EMAIL</label>
                <input className="input-dark" type="email" value={editCompanyForm.email} onChange={e => setEditCompanyForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>PLAN</label>
                <select value={editCompanyForm.plan} onChange={e => setEditCompanyForm(f => ({ ...f, plan: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                  {PLANS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>SECTEUR</label>
                <select value={editCompanyForm.sector} onChange={e => setEditCompanyForm(f => ({ ...f, sector: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>STATUS</label>
                <select value={editCompanyForm.status} onChange={e => setEditCompanyForm(f => ({ ...f, status: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'LICENCES' : 'LICENSES'}</label>
                <input className="input-dark" type="number" min="1" value={editCompanyForm.licenses} onChange={e => setEditCompanyForm(f => ({ ...f, licenses: parseInt(e.target.value) || f.licenses }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'EXPIRATION' : 'EXPIRES'}</label>
                <input className="input-dark" value={editCompanyForm.expire} onChange={e => setEditCompanyForm(f => ({ ...f, expire: e.target.value }))} placeholder="DD/MM/YYYY" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" type="submit" style={{ flex: 1, justifyContent: 'center' }}>
                {lang === 'fr' ? '✓ Sauvegarder' : '✓ Save changes'}
              </button>
              <button type="button" onClick={() => deleteCompany(editCompanyForm.id)} style={{ padding: '10px 16px', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', color: 'var(--red)', cursor: 'pointer', fontSize: '12px', borderRadius: '4px', transition: 'all 0.2s' }}>
                🗑 {lang === 'fr' ? 'Supprimer' : 'Delete'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Scenario Modal */}
      <Modal isOpen={modal?.type === 'createScenario'} onClose={() => setModal(null)} title={lang === 'fr' ? 'Nouveau scénario' : 'New scenario'}>
        <form onSubmit={createScenario}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'TITRE (FR)' : 'TITLE (FR)'}</label>
              <input className="input-dark" placeholder="Bureau Compromis" required value={editScenarioForm?.titleFr || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), titleFr: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>TITLE (EN)</label>
              <input className="input-dark" placeholder="Compromised Desktop" value={editScenarioForm?.titleEn || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), titleEn: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'CATÉGORIE' : 'CATEGORY'}</label>
              <select value={editScenarioForm?.category || 'Phishing'} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), category: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                {SCENARIO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'NIVEAU' : 'DIFFICULTY'}</label>
              <select value={editScenarioForm?.difficulty || 'intermediate'} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), difficulty: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                <option value="beginner">{lang === 'fr' ? 'Débutant' : 'Beginner'}</option>
                <option value="intermediate">{lang === 'fr' ? 'Intermédiaire' : 'Intermediate'}</option>
                <option value="advanced">{lang === 'fr' ? 'Avancé' : 'Advanced'}</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'DURÉE (min)' : 'DURATION (min)'}</label>
              <input className="input-dark" type="number" min="5" max="60" placeholder="15" value={editScenarioForm?.duration || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), duration: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>DESCRIPTION</label>
              <input className="input-dark" placeholder={lang === 'fr' ? 'Description courte' : 'Short description'} value={editScenarioForm?.description || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), description: e.target.value }))} />
            </div>
          </div>
          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
            {lang === 'fr' ? '+ Créer scénario' : '+ Create scenario'}
          </button>
        </form>
      </Modal>

      {/* Edit Scenario Modal */}
      <Modal isOpen={modal?.type === 'editScenario' && !!editScenarioForm} onClose={() => setModal(null)} title={lang === 'fr' ? `Éditer scénario` : `Edit scenario`}>
        {editScenarioForm && (
          <form onSubmit={saveScenario}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '24px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{lang === 'fr' ? 'Parties:' : 'Plays:'} <strong style={{ color: 'var(--red)' }}>{editScenarioForm.plays?.toLocaleString()}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>{lang === 'fr' ? 'Score moy:' : 'Avg score:'} <strong style={{ color: 'var(--red)' }}>{editScenarioForm.score || '—'}</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'TITRE (FR)' : 'TITLE (FR)'}</label>
                <input className="input-dark" required value={editScenarioForm.titleFr} onChange={e => setEditScenarioForm(f => ({ ...f, titleFr: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>TITLE (EN)</label>
                <input className="input-dark" value={editScenarioForm.titleEn} onChange={e => setEditScenarioForm(f => ({ ...f, titleEn: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'CATÉGORIE' : 'CATEGORY'}</label>
                <select value={editScenarioForm.category} onChange={e => setEditScenarioForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                  {SCENARIO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'NIVEAU' : 'DIFFICULTY'}</label>
                <select value={editScenarioForm.difficulty} onChange={e => setEditScenarioForm(f => ({ ...f, difficulty: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                  <option value="beginner">{lang === 'fr' ? 'Débutant' : 'Beginner'}</option>
                  <option value="intermediate">{lang === 'fr' ? 'Intermédiaire' : 'Intermediate'}</option>
                  <option value="advanced">{lang === 'fr' ? 'Avancé' : 'Advanced'}</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'DURÉE (min)' : 'DURATION (min)'}</label>
                <input className="input-dark" type="number" min="5" max="60" value={editScenarioForm.duration} onChange={e => setEditScenarioForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>STATUS</label>
                <select value={editScenarioForm.status} onChange={e => setEditScenarioForm(f => ({ ...f, status: e.target.value }))} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '13px' }}>
                  {SCENARIO_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>DESCRIPTION</label>
                <input className="input-dark" value={editScenarioForm.description || ''} onChange={e => setEditScenarioForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              {lang === 'fr' ? '✓ Sauvegarder les modifications' : '✓ Save changes'}
            </button>
          </form>
        )}
      </Modal>

      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: '#080808', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
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
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saCompaniesTitle')} ({companies.length})</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={() => setModal({ type: 'addCompany' })} aria-label="Add new company">{t('saAdd')}</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Companies list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[t('saColCompany'), t('saColPlan'), lang === 'fr' ? 'Secteur' : 'Sector', t('saColUsers'), t('saColLicenses'), t('saColExpires'), t('saColStatus'), ''].map((h, i) => (
                      <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }} role="columnheader">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,40,40,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{c.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: '11px', fontFamily: 'var(--mono)' }}>{c.plan}</td>
                      <td style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--text-muted)' }}>{c.sector || '—'}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px' }}><span style={{ color: 'var(--text-light)' }}>{c.active}</span><span style={{ color: 'var(--text-muted)' }}>/{c.users}</span></td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.licenses}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: c.status === 'expiring' ? '#f59e0b' : 'var(--text-muted)' }}>{c.expire}</td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(c.status, t)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <button onClick={() => openEditCompany(c)} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--mono)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          aria-label={`Edit company ${c.name}`}
                        >✎ {t('saEdit')}</button>
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
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saScenariosTitle')} ({scenarios.length})</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={() => { setEditScenarioForm({}); setModal({ type: 'createScenario' }) }} aria-label="Create new scenario">{t('saCreateScenario')}</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Scenarios list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[t('saColTitle'), t('saColCategory'), t('saColDifficulty'), t('saColDuration'), t('saColPlays'), t('saColAvgScore'), t('saColStatus'), ''].map((h, i) => (
                      <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }} role="columnheader">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(235,40,40,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>{typeof s.title === 'object' ? s.title[lang] : s.title}</td>
                      <td style={{ padding: '14px 20px' }}><span className="tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{s.category}</span></td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{diffLabel(s.difficulty)}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{s.duration} min</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-light)' }}>{s.plays.toLocaleString()}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)' }}>{s.score > 0 ? s.score : '—'}</td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(s.status, t)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <button onClick={() => openEditScenario(s)} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--mono)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          aria-label={`Edit scenario ${typeof s.title === 'object' ? s.title[lang] : s.title}`}
                        >✎ {t('saEdit')}</button>
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
              <table style={{ width: '100%', borderCollapse: 'collapse' }} role="table" aria-label="Licenses list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[lang === 'fr' ? 'Entreprise' : 'Company', lang === 'fr' ? 'Plan' : 'Plan', lang === 'fr' ? 'Sièges' : 'Seats', lang === 'fr' ? 'Utilisés' : 'Used', lang === 'fr' ? 'Forfait' : 'Billing', lang === 'fr' ? 'Expire' : 'Expires'].map((h, i) => (
                      <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }} role="columnheader">{h}</th>
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
