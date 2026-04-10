import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

// --- CONSTANTS ---
const INITIAL_COMPANIES = [
  { id: 1, name: 'ACME Corp', plan: 'Business', users: 161, active: 142, scenarios: 6, licenses: 200, expire: '31/12/2025', status: 'active', email: 'admin@acme.com', sector: 'Finance' },
  { id: 2, name: 'BNP Finance', plan: 'Enterprise', users: 892, active: 814, scenarios: 12, licenses: 1000, expire: '30/06/2025', status: 'active', email: 'security@bnp.fr', sector: 'Finance' },
  { id: 3, name: 'Mairie de Lyon', plan: 'Starter', users: 24, active: 18, scenarios: 3, licenses: 25, expire: '15/05/2025', status: 'expiring', email: 'dsi@mairie-lyon.fr', sector: 'Administration' },
]

const INITIAL_SCENARIOS = [
  { id: 1, title: { fr: 'Opération : Inbox Zero', en: 'Operation: Inbox Zero' }, category: 'Phishing', difficulty: 'intermediate', duration: '15', plays: 3241, score: 724, status: 'published', description: 'Simulation d\'attaque phishing avancée par email' },
  { id: 2, title: { fr: 'Bureau Compromis', en: 'Compromised Desktop' }, category: 'Ransomware', difficulty: 'advanced', duration: '20', plays: 1892, score: 612, status: 'published', description: 'Scénario de ransomware sur poste de travail' },
]

const SECTORS = ['Finance', 'Santé', 'Administration', 'Éducation', 'Industrie', 'Commerce', 'Énergie', 'Juridique', 'Tech', 'Transport']
const PLANS = ['Starter', 'Business', 'Enterprise']
const STATUS_OPTIONS = ['active', 'expiring', 'suspended']
const SCENARIO_CATEGORIES = ['Phishing', 'Ransomware', 'Social Eng.', 'Insider', 'Réseau', 'Malware', 'OSINT']
const SCENARIO_STATUSES = ['draft', 'beta', 'published']
const SCENARIO_MODULES = ['photo', 'mapping', 'fakeLink', 'fakeEmail', 'video', 'quiz', 'miniPuzzle']

const DEFAULT_SCENARIO_FIELDS = {
  id: null,
  title: { fr: '', en: '' },
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
  plays: 0,
  score: 0,
  status: 'draft',
}

// --- UTILS ---
const createId = () => Math.floor(Math.random() * 10_000_000)

const withScenarioDefaults = (s) => ({
  ...DEFAULT_SCENARIO_FIELDS,
  ...s,
  photoHotspots: Array.isArray(s?.photoHotspots) ? s.photoHotspots : [],
  quizQuestions: Array.isArray(s?.quizQuestions) ? s.quizQuestions : [],
  modules: Array.isArray(s?.modules) ? s.modules : [],
})

function StatusBadge({ s, t }) {
  const map = { 
    active: [t('badgeActive'), '#22c55e'], 
    expiring: [t('badgeExpiring'), '#f59e0b'], 
    suspended: [t('badgeSuspended'), 'var(--red)'], 
    published: [t('badgePublished'), '#22c55e'], 
    beta: [t('badgeBeta'), '#f59e0b'], 
    draft: [t('badgeDraft'), 'var(--text-muted)'] 
  }
  const [label, color] = map[s] || [s, 'var(--text-muted)']
  return (
    <span style={{ padding: '3px 10px', fontSize: '11px', fontFamily: 'var(--mono)', color, border: `1px solid ${color}`, background: `${color}15` }}>
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
  
  const [companies, setCompanies] = useState(INITIAL_COMPANIES)
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS.map(withScenarioDefaults))
  
  const [editCompanyForm, setEditCompanyForm] = useState(null)
  const [editScenarioForm, setEditScenarioForm] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  // --- ACTIONS ENTREPRISES ---
  const openEditCompany = (c) => {
    setEditCompanyForm({ ...c })
    setModal({ type: 'editCompany' })
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

  // --- ACTIONS SCÉNARIOS ---
  const openEditScenario = (s) => {
    const data = withScenarioDefaults(s)
    setEditScenarioForm({ ...data, titleFr: data.title.fr, titleEn: data.title.en })
    setModal({ type: 'editScenario' })
  }

  const saveScenario = (e) => {
    e.preventDefault()
    const updated = {
      ...editScenarioForm,
      title: { fr: editScenarioForm.titleFr, en: editScenarioForm.titleEn },
    }
    setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s))
    setModal(null)
    showToast(lang === 'fr' ? 'Scénario mis à jour' : 'Scenario updated')
  }

  const createScenario = (e) => {
    e.preventDefault()
    const newS = {
      ...withScenarioDefaults(editScenarioForm),
      id: Date.now(),
      title: { fr: editScenarioForm.titleFr, en: editScenarioForm.titleEn || editScenarioForm.titleFr },
      status: 'draft'
    }
    setScenarios(prev => [...prev, newS])
    setModal(null)
    showToast(lang === 'fr' ? 'Scénario créé' : 'Scenario created')
  }

  // --- HELPERS FORMULAIRE ---
  const toggleScenarioModule = (moduleKey) => {
    setEditScenarioForm(prev => {
      const currentModules = prev?.modules || []
      const modules = currentModules.includes(moduleKey)
        ? currentModules.filter(m => m !== moduleKey)
        : [...currentModules, moduleKey]
      return { ...prev, modules }
    })
  }

  const onScenarioPhotoUpload = (file) => {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setEditScenarioForm(prev => ({
      ...prev,
      coverImage: localUrl,
      coverImageName: file.name,
      modules: Array.from(new Set([...(prev?.modules || []), 'photo']))
    }))
  }

  const addHotspotFromImageClick = (e) => {
    if (!editScenarioForm?.coverImage) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    
    setEditScenarioForm(prev => ({
      ...prev,
      modules: Array.from(new Set([...(prev?.modules || []), 'mapping'])),
      photoHotspots: [
        ...(prev?.photoHotspots || []),
        { id: createId(), x, y, label: lang === 'fr' ? 'Indice' : 'Clue', action: 'clue' }
      ]
    }))
  }

  // --- UI DATA ---
  const navItems = [
    { id: 'overview', label: t('saNavOverview'), icon: '▦' },
    { id: 'companies', label: t('saNavCompanies'), icon: '◉' },
    { id: 'scenarios', label: t('saNavScenarios'), icon: '▷' },
    { id: 'licenses', label: t('saNavLicenses'), icon: '◈' },
    { id: 'system', label: t('saNavSystem'), icon: '◎' },
  ]

  const moduleLabels = {
    photo: { fr: 'Photo', en: 'Photo' },
    mapping: { fr: 'Mapping', en: 'Mapping' },
    fakeLink: { fr: 'Faux lien', en: 'Fake link' },
    fakeEmail: { fr: 'Faux email', en: 'Fake email' },
    video: { fr: 'Vidéo', en: 'Video' },
    quiz: { fr: 'Quizz', en: 'Quiz' },
    miniPuzzle: { fr: 'Mini puzzle', en: 'Mini puzzle' },
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
      {toast && <Toast message={toast} type="success" />}

      {/* --- MODAL: EDIT COMPANY --- */}
      <Modal 
        isOpen={modal?.type === 'editCompany'} 
        onClose={() => setModal(null)} 
        title={editCompanyForm?.name}
      >
        {editCompanyForm && (
          <form onSubmit={saveCompany}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label className="label-mono">{lang === 'fr' ? 'NOM' : 'NAME'}</label>
                <input className="input-dark" value={editCompanyForm.name} onChange={e => setEditCompanyForm({...editCompanyForm, name: e.target.value})} required />
              </div>
              <div>
                <label className="label-mono">EMAIL</label>
                <input className="input-dark" type="email" value={editCompanyForm.email} onChange={e => setEditCompanyForm({...editCompanyForm, email: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-primary" type="submit" style={{ flex: 1 }}>{t('saSave')}</button>
              <button type="button" className="btn-danger-outline" onClick={() => deleteCompany(editCompanyForm.id)}>🗑</button>
            </div>
          </form>
        )}
      </Modal>

      {/* --- MODAL: EDIT/CREATE SCENARIO --- */}
      <Modal 
        isOpen={modal?.type === 'editScenario' || modal?.type === 'createScenario'} 
        onClose={() => setModal(null)} 
        title={modal?.type === 'createScenario' ? t('saCreateScenario') : t('saEdit')}
      >
        <form onSubmit={modal?.type === 'createScenario' ? createScenario : saveScenario}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label-mono">TITRE (FR)</label>
                <input className="input-dark" value={editScenarioForm?.titleFr || ''} onChange={e => setEditScenarioForm({...editScenarioForm, titleFr: e.target.value})} required />
              </div>
              <div>
                <label className="label-mono">CATÉGORIE</label>
                <select className="input-dark" value={editScenarioForm?.category} onChange={e => setEditScenarioForm({...editScenarioForm, category: e.target.value})}>
                  {SCENARIO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-mono">STATUS</label>
                <select className="input-dark" value={editScenarioForm?.status} onChange={e => setEditScenarioForm({...editScenarioForm, status: e.target.value})}>
                  {SCENARIO_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
           </div>

           {/* Mapping Section */}
           <div style={{ marginTop: '20px', border: '1px solid var(--border-subtle)', padding: '12px' }}>
              <label className="label-mono">MAPPING PHOTO</label>
              <input type="file" className="input-dark" style={{ marginBottom: '10px' }} onChange={e => onScenarioPhotoUpload(e.target.files[0])} />
              
              <div 
                onClick={addHotspotFromImageClick}
                style={{ position: 'relative', height: '200px', background: '#0a0a0a', cursor: 'crosshair', overflow: 'hidden', border: '1px dashed #333' }}
              >
                {editScenarioForm?.coverImage && (
                  <>
                    <img src={editScenarioForm.coverImage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Preview" />
                    {editScenarioForm.photoHotspots.map(h => (
                      <div key={h.id} style={{ position: 'absolute', left: `${h.x}%`, top: `${h.y}%`, width: '12px', height: '12px', background: 'red', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
                    ))}
                  </>
                )}
              </div>
           </div>

           <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '20px' }}>
             {lang === 'fr' ? '✓ Valider' : '✓ Confirm'}
           </button>
        </form>
      </Modal>

      {/* --- SIDEBAR --- */}
      <aside style={{ width: '240px', background: '#080808', borderRight: '1px solid var(--border-subtle)', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: '24px' }}>
          <img src={Logo} alt="ROOMCA" style={{ height: '30px' }} />
          <div className="tag-admin">SUPER ADMIN</div>
        </div>
        <nav>
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveNav(item.id)}
              className={`nav-btn ${activeNav === item.id ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <h1>{t('saTitle')}</h1>
          <div className="tag-prod">PROD</div>
        </header>

        {activeNav === 'companies' && (
          <div className="card-table">
            <div className="table-header">
              <span>{t('saCompaniesTitle')} ({companies.length})</span>
              <button className="btn-primary" onClick={() => setModal({ type: 'addCompany' })}>{t('saAdd')}</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{t('saColCompany')}</th>
                  <th>{t('saColPlan')}</th>
                  <th>{t('saColStatus')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.plan}</td>
                    <td><StatusBadge s={c.status} t={t} /></td>
                    <td>
                      <button className="btn-icon" onClick={() => openEditCompany(c)}>✎</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeNav === 'scenarios' && (
          <div className="card-table">
             <div className="table-header">
              <span>{t('saScenariosTitle')} ({scenarios.length})</span>
              <button className="btn-primary" onClick={() => { setEditScenarioForm(DEFAULT_SCENARIO_FIELDS); setModal({ type: 'createScenario' }) }}>
                {t('saCreateScenario')}
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{t('saColTitle')}</th>
                  <th>{t('saColCategory')}</th>
                  <th>{t('saColStatus')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map(s => (
                  <tr key={s.id}>
                    <td>{s.title[lang]}</td>
                    <td>{s.category}</td>
                    <td><StatusBadge s={s.status} t={t} /></td>
                    <td>
                      <button className="btn-icon" onClick={() => openEditScenario(s)}>✎</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}