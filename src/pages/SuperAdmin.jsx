import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
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
  { id: 6, title: { fr: 'Facture urgente du fournisseur', en: 'Urgent Supplier Invoice' }, category: 'Phishing', difficulty: 'intermediate', duration: '9', plays: 0, score: 0, status: 'draft', description: 'Faux email compta avec lien de facture piégée', modules: ['photo', 'mapping', 'fakeLink', 'fakeEmail', 'quiz'], coverImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80', photoHotspots: [{ id: 6001, x: 28, y: 44, label: 'Domaine suspect' }, { id: 6002, x: 69, y: 66, label: 'Bouton dangereux' }], fakeEmailSender: 'finance@cornpany-secure.com', fakeEmailSubject: 'PAIEMENT BLOQUÉ - action sous 2h', fakeEmailBody: 'Veuillez régler la facture en attente immédiatement pour éviter la suspension des services.', fakeLinkLabel: 'Consulter la facture', fakeLinkUrl: 'https://billing-company-secure.example', fakeLinkHover: 'Lien externe non vérifié' },
  { id: 7, title: { fr: 'Document RH confidentiel', en: 'Confidential HR Document' }, category: 'Social Eng.', difficulty: 'advanced', duration: '12', plays: 0, score: 0, status: 'draft', description: 'Usurpation RH avec partage de document', modules: ['photo', 'mapping', 'fakeLink', 'fakeEmail', 'quiz'], coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', photoHotspots: [{ id: 7001, x: 34, y: 51, label: 'URL trompeuse' }], fakeEmailSender: 'rh@intranet-support-alert.com', fakeEmailSubject: 'Mise à jour obligatoire du contrat', fakeEmailBody: 'Merci de signer ce document avant la fin de journée.', fakeLinkLabel: 'Signer le document', fakeLinkUrl: 'https://secure-hr-sign.example', fakeLinkHover: 'Nom de domaine inhabituel' },
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
const SCENARIO_MODULES = ['photo', 'mapping', 'fakeLink', 'fakeEmail', 'video', 'quiz', 'miniPuzzle']



const DEFAULT_SCENARIO_FIELDS = {
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
}

const withScenarioDefaults = (scenario) => ({
  ...DEFAULT_SCENARIO_FIELDS,
  ...scenario,
  photoHotspots: Array.isArray(scenario.photoHotspots) ? scenario.photoHotspots : [],
  quizQuestions: Array.isArray(scenario.quizQuestions) ? scenario.quizQuestions : [],
  modules: Array.isArray(scenario.modules) ? scenario.modules : [],
})

const moduleLabels = {
  photo: { fr: 'Photo', en: 'Photo' },
  mapping: { fr: 'Mapping', en: 'Mapping' },
  fakeLink: { fr: 'Faux lien', en: 'Fake link' },
  fakeEmail: { fr: 'Faux email', en: 'Fake email' },
  video: { fr: 'Vidéo', en: 'Video' },
  quiz: { fr: 'Quizz', en: 'Quiz' },
  miniPuzzle: { fr: 'Mini puzzle', en: 'Mini puzzle' },
}

const createId = () => Math.floor(Math.random() * 10_000_000)

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
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)
  const [companies, setCompanies] = useState(INITIAL_COMPANIES)
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS.map(withScenarioDefaults))
  const [editCompanyForm, setEditCompanyForm] = useState(null)
  const [editScenarioForm, setEditScenarioForm] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
    setEditScenarioForm(withScenarioDefaults({ ...s, titleFr: s.title.fr, titleEn: s.title.en }))
    setModal({ type: 'editScenario', data: s })
  }

  const saveScenario = (e) => {
    e.preventDefault()
    const updated = {
      ...DEFAULT_SCENARIO_FIELDS,
      ...editScenarioForm,
      title: { fr: editScenarioForm.titleFr, en: editScenarioForm.titleEn },
      modules: Array.isArray(editScenarioForm.modules) ? editScenarioForm.modules : []
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
      coverImage: editScenarioForm.coverImage || '',
      mappingContext: editScenarioForm.mappingContext || '',
      fakeLinkLabel: editScenarioForm.fakeLinkLabel || '',
      fakeLinkUrl: editScenarioForm.fakeLinkUrl || '',
      fakeLinkHover: editScenarioForm.fakeLinkHover || '',
      fakeEmailSender: editScenarioForm.fakeEmailSender || '',
      fakeEmailSubject: editScenarioForm.fakeEmailSubject || '',
      fakeEmailBody: editScenarioForm.fakeEmailBody || '',
      videoUrl: editScenarioForm.videoUrl || '',
      coverImageName: editScenarioForm.coverImageName || '',
      photoHotspots: Array.isArray(editScenarioForm.photoHotspots) ? editScenarioForm.photoHotspots : [],
      quizQuestions: Array.isArray(editScenarioForm.quizQuestions) ? editScenarioForm.quizQuestions : [],
      modules: Array.isArray(editScenarioForm.modules) ? editScenarioForm.modules : [],
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

  const isMobile = viewportWidth < 1024
  const isCompact = viewportWidth < 768
  const twoCols = isCompact ? '1fr' : '1fr 1fr'
  const threeCols = isCompact ? '1fr' : '1fr 1fr 1fr'
  const companiesTableMinWidth = isCompact ? '680px' : '920px'
  const scenariosTableMinWidth = isCompact ? '760px' : '980px'
  const licensesTableMinWidth = isCompact ? '620px' : '760px'

  const diffLabel = (d) => ({ intermediate: t('diffIntermediate'), advanced: t('diffAdvanced'), beginner: t('diffBeginner') })[d] || d

  const toggleScenarioModule = (moduleKey) => {
    setEditScenarioForm(prev => {
      const current = prev || {}
      const currentModules = Array.isArray(current.modules) ? current.modules : []
      const modules = currentModules.includes(moduleKey)
        ? currentModules.filter(m => m !== moduleKey)
        : [...currentModules, moduleKey]
      return { ...current, modules }
    })
  }

  const onScenarioPhotoUpload = (file) => {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setEditScenarioForm(prev => ({
      ...(prev || {}),
      coverImage: localUrl,
      coverImageName: file.name,
    }))
    if (!((editScenarioForm?.modules || []).includes('photo'))) toggleScenarioModule('photo')
  }

  const addHotspotFromImageClick = (e) => {
    if (!editScenarioForm?.coverImage) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setEditScenarioForm(prev => {
      const current = prev || {}
      const photoHotspots = Array.isArray(current.photoHotspots) ? current.photoHotspots : []
      return {
        ...current,
        modules: Array.from(new Set([...(current.modules || []), 'mapping'])),
        photoHotspots: [...photoHotspots, { id: createId(), x: Math.round(x), y: Math.round(y), label: lang === 'fr' ? 'Indice' : 'Clue', action: 'clue' }],
      }
    })
  }

  const updateHotspot = (id, patch) => {
    setEditScenarioForm(prev => ({
      ...(prev || {}),
      photoHotspots: (prev?.photoHotspots || []).map(h => h.id === id ? { ...h, ...patch } : h),
    }))
  }

  const removeHotspot = (id) => {
    setEditScenarioForm(prev => ({
      ...(prev || {}),
      photoHotspots: (prev?.photoHotspots || []).filter(h => h.id !== id),
    }))
  }

  const addQuizQuestion = () => {
    setEditScenarioForm(prev => {
      const current = prev || {}
      const quizQuestions = Array.isArray(current.quizQuestions) ? current.quizQuestions : []
      const newQuestion = {
        id: createId(),
        prompt: '',
        design: 'cards',
        options: [
          { id: createId(), text: '', isCorrect: true },
          { id: createId(), text: '', isCorrect: false },
        ],
      }
      return {
        ...current,
        modules: Array.from(new Set([...(current.modules || []), 'quiz'])),
        quizQuestions: [...quizQuestions, newQuestion],
      }
    })
  }

  const updateQuizQuestion = (questionId, patch) => {
    setEditScenarioForm(prev => ({
      ...(prev || {}),
      quizQuestions: (prev?.quizQuestions || []).map(q => q.id === questionId ? { ...q, ...patch } : q),
    }))
  }

  const updateQuizOption = (questionId, optionId, patch) => {
    setEditScenarioForm(prev => ({
      ...(prev || {}),
      quizQuestions: (prev?.quizQuestions || []).map(q => q.id === questionId
        ? { ...q, options: (q.options || []).map(o => o.id === optionId ? { ...o, ...patch } : o) }
        : q),
    }))
  }

  const getScenarioModulesLabel = (scenario) => {
    const modules = Array.isArray(scenario.modules) ? scenario.modules : []
    if (!modules.length) return lang === 'fr' ? 'Aucun module' : 'No modules'
    return modules.map(m => moduleLabels[m]?.[lang] || m).join(' · ')
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: '#000', color: 'var(--text-light)' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', marginBottom: '20px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'NOM' : 'NAME'}</label>
                <input className="input-dark" value={editCompanyForm.name} onChange={e => setEditCompanyForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>EMAIL</label>
                <input className="input-dark" type="email" value={editCompanyForm.email} onChange={e => setEditCompanyForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: threeCols, gap: '12px', marginBottom: '16px' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', marginBottom: '20px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', marginBottom: '16px' }}>
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
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'PHOTO (URL)' : 'PHOTO (URL)'}</label>
              <input className="input-dark" placeholder="https://..." value={editScenarioForm?.coverImage || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), coverImage: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'OU IMPORTER UNE PHOTO' : 'OR UPLOAD PHOTO'}</label>
              <input className="input-dark" type="file" accept="image/*" onChange={e => onScenarioPhotoUpload(e.target.files?.[0])} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>VIDEO (URL)</label>
              <input className="input-dark" placeholder="https://..." value={editScenarioForm?.videoUrl || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), videoUrl: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'MAPPING / CONTEXTE' : 'MAPPING / CONTEXT'}</label>
              <textarea className="input-dark" rows={3} placeholder={lang === 'fr' ? 'Ex: Bureau, Open-space, Salle serveur...' : 'Ex: Office, Open-space, Server room...'} value={editScenarioForm?.mappingContext || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), mappingContext: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1', border: '1px solid var(--border-subtle)', padding: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>{lang === 'fr' ? 'MAPPING EXACT SUR LA PHOTO (CLIQUE POUR POSER UN POINT)' : 'EXACT PHOTO MAPPING (CLICK TO ADD HOTSPOT)'}</label>
              <div onClick={addHotspotFromImageClick} style={{ position: 'relative', border: '1px dashed var(--border-subtle)', minHeight: '180px', cursor: editScenarioForm?.coverImage ? 'crosshair' : 'not-allowed', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {editScenarioForm?.coverImage ? (
                  <>
                    <img src={editScenarioForm.coverImage} alt="Scenario mapping" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', opacity: 0.7 }} />
                    {(editScenarioForm?.photoHotspots || []).map((hotspot) => (
                      <button key={hotspot.id} type="button" title={`${hotspot.label} (${hotspot.x}%, ${hotspot.y}%)`} style={{ position: 'absolute', left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #fff', background: 'var(--red)', cursor: 'pointer' }} />
                    ))}
                  </>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{lang === 'fr' ? 'Ajoute une photo puis clique pour placer des zones.' : 'Add a photo then click to place hotspots.'}</div>
                )}
              </div>
              {(editScenarioForm?.photoHotspots || []).map((hotspot) => (
                <div key={hotspot.id} style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 100px 100px auto', gap: '8px', marginTop: '8px' }}>
                  <input className="input-dark" value={hotspot.label} onChange={e => updateHotspot(hotspot.id, { label: e.target.value })} placeholder={lang === 'fr' ? 'Label du point' : 'Hotspot label'} />
                  <input className="input-dark" value={hotspot.x} onChange={e => updateHotspot(hotspot.id, { x: Number(e.target.value) || 0 })} />
                  <input className="input-dark" value={hotspot.y} onChange={e => updateHotspot(hotspot.id, { y: Number(e.target.value) || 0 })} />
                  <button type="button" className="btn-secondary" onClick={() => removeHotspot(hotspot.id)}>✕</button>
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'FAUX LIEN (LABEL)' : 'FAKE LINK (LABEL)'}</label>
              <input className="input-dark" placeholder={lang === 'fr' ? 'Voir la facture' : 'View invoice'} value={editScenarioForm?.fakeLinkLabel || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), fakeLinkLabel: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'FAUX LIEN (URL)' : 'FAKE LINK (URL)'}</label>
              <input className="input-dark" placeholder="https://fake.example" value={editScenarioForm?.fakeLinkUrl || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), fakeLinkUrl: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'TEXTE AU SURVOL DU FAUX LIEN' : 'HOVER TEXT FOR FAKE LINK'}</label>
              <input className="input-dark" placeholder={lang === 'fr' ? 'Lien externe suspect' : 'Suspicious external link'} value={editScenarioForm?.fakeLinkHover || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), fakeLinkHover: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'EXPÉDITEUR FAUX MAIL' : 'FAKE EMAIL SENDER'}</label>
              <input className="input-dark" placeholder="finance-secure@internal-alert.com" value={editScenarioForm?.fakeEmailSender || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), fakeEmailSender: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'OBJET FAUX MAIL' : 'FAKE EMAIL SUBJECT'}</label>
              <input className="input-dark" placeholder={lang === 'fr' ? 'Action requise sous 24h' : 'Action required within 24h'} value={editScenarioForm?.fakeEmailSubject || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), fakeEmailSubject: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'CORPS DU FAUX MAIL' : 'FAKE EMAIL BODY'}</label>
              <textarea className="input-dark" rows={3} value={editScenarioForm?.fakeEmailBody || ''} onChange={e => setEditScenarioForm(f => ({ ...(f || {}), fakeEmailBody: e.target.value }))} />
              <div style={{ marginTop: '8px', border: '1px solid var(--border-subtle)', padding: '10px', background: '#0b0b0b' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{editScenarioForm?.fakeEmailSender || 'sender@example.com'} → {editScenarioForm?.fakeEmailSubject || (lang === 'fr' ? 'Objet' : 'Subject')}</div>
                <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-light)' }}>{editScenarioForm?.fakeEmailBody || (lang === 'fr' ? 'Aperçu du faux mail.' : 'Fake email preview.')}</div>
                {(editScenarioForm?.fakeLinkLabel || editScenarioForm?.fakeLinkUrl) && (
                  <a href={editScenarioForm?.fakeLinkUrl || '#'} title={editScenarioForm?.fakeLinkHover || ''} style={{ display: 'inline-block', marginTop: '8px', color: '#4ea1ff', textDecoration: 'underline' }}>
                    {editScenarioForm?.fakeLinkLabel || (lang === 'fr' ? 'Lien cliquable' : 'Clickable link')}
                  </a>
                )}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1', border: '1px solid var(--border-subtle)', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{lang === 'fr' ? 'DESIGN DES QUESTIONS (QUIZZ)' : 'QUESTION DESIGN (QUIZ)'}</label>
                <button type="button" className="btn-secondary" onClick={addQuizQuestion}>+ {lang === 'fr' ? 'Ajouter question' : 'Add question'}</button>
              </div>
              {(editScenarioForm?.quizQuestions || []).map((question, index) => (
                <div key={question.id} style={{ border: '1px solid var(--border-subtle)', padding: '10px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <input className="input-dark" placeholder={(lang === 'fr' ? 'Question ' : 'Question ') + (index + 1)} value={question.prompt} onChange={e => updateQuizQuestion(question.id, { prompt: e.target.value })} />
                  <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '140px 1fr', gap: '8px', marginTop: '8px' }}>
                    <select value={question.design || 'cards'} onChange={e => updateQuizQuestion(question.id, { design: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '12px' }}>
                      <option value="cards">{lang === 'fr' ? 'Cartes' : 'Cards'}</option>
                      <option value="list">{lang === 'fr' ? 'Liste' : 'List'}</option>
                      <option value="terminal">{lang === 'fr' ? 'Terminal' : 'Terminal'}</option>
                    </select>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>{lang === 'fr' ? 'Style visuel de cette question' : 'Visual style for this question'}</div>
                  </div>
                  {(question.options || []).map((option) => (
                    <div key={option.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginTop: '8px' }}>
                      <input className="input-dark" placeholder={lang === 'fr' ? 'Réponse' : 'Answer'} value={option.text} onChange={e => updateQuizOption(question.id, option.id, { text: e.target.value })} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <input type="checkbox" checked={!!option.isCorrect} onChange={e => updateQuizOption(question.id, option.id, { isCorrect: e.target.checked })} />
                        {lang === 'fr' ? 'Correcte' : 'Correct'}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ gridColumn: '1 / -1', padding: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>{lang === 'fr' ? 'MODULES NATIFS DU SCÉNARIO' : 'NATIVE SCENARIO MODULES'}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SCENARIO_MODULES.map((moduleKey) => {
                  const isActive = (editScenarioForm?.modules || []).includes(moduleKey)
                  return (
                    <button
                      key={moduleKey}
                      type="button"
                      onClick={() => toggleScenarioModule(moduleKey)}
                      style={{
                        padding: '6px 10px',
                        border: `1px solid ${isActive ? 'var(--red)' : 'var(--border-subtle)'}`,
                        background: isActive ? 'rgba(235,40,40,0.12)' : 'transparent',
                        color: isActive ? 'var(--text-light)' : 'var(--text-muted)',
                        fontFamily: 'var(--mono)',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      {moduleLabels[moduleKey]?.[lang] || moduleKey}
                    </button>
                  )
                })}
              </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', marginBottom: '16px' }}>
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
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'PHOTO (URL)' : 'PHOTO (URL)'}</label>
                <input className="input-dark" value={editScenarioForm.coverImage || ''} onChange={e => setEditScenarioForm(f => ({ ...f, coverImage: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'OU IMPORTER UNE PHOTO' : 'OR UPLOAD PHOTO'}</label>
                <input className="input-dark" type="file" accept="image/*" onChange={e => onScenarioPhotoUpload(e.target.files?.[0])} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>VIDEO (URL)</label>
                <input className="input-dark" value={editScenarioForm.videoUrl || ''} onChange={e => setEditScenarioForm(f => ({ ...f, videoUrl: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'MAPPING / CONTEXTE' : 'MAPPING / CONTEXT'}</label>
                <textarea className="input-dark" rows={3} value={editScenarioForm.mappingContext || ''} onChange={e => setEditScenarioForm(f => ({ ...f, mappingContext: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1', border: '1px solid var(--border-subtle)', padding: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>{lang === 'fr' ? 'MAPPING EXACT SUR LA PHOTO (CLIQUE POUR POSER UN POINT)' : 'EXACT PHOTO MAPPING (CLICK TO ADD HOTSPOT)'}</label>
                <div onClick={addHotspotFromImageClick} style={{ position: 'relative', border: '1px dashed var(--border-subtle)', minHeight: '180px', cursor: editScenarioForm?.coverImage ? 'crosshair' : 'not-allowed', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {editScenarioForm?.coverImage ? (
                    <>
                      <img src={editScenarioForm.coverImage} alt="Scenario mapping" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', opacity: 0.7 }} />
                      {(editScenarioForm.photoHotspots || []).map((hotspot) => (
                        <button key={hotspot.id} type="button" title={`${hotspot.label} (${hotspot.x}%, ${hotspot.y}%)`} style={{ position: 'absolute', left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #fff', background: 'var(--red)', cursor: 'pointer' }} />
                      ))}
                    </>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{lang === 'fr' ? 'Ajoute une photo puis clique pour placer des zones.' : 'Add a photo then click to place hotspots.'}</div>
                  )}
                </div>
                {(editScenarioForm.photoHotspots || []).map((hotspot) => (
                  <div key={hotspot.id} style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 100px 100px auto', gap: '8px', marginTop: '8px' }}>
                    <input className="input-dark" value={hotspot.label} onChange={e => updateHotspot(hotspot.id, { label: e.target.value })} placeholder={lang === 'fr' ? 'Label du point' : 'Hotspot label'} />
                    <input className="input-dark" value={hotspot.x} onChange={e => updateHotspot(hotspot.id, { x: Number(e.target.value) || 0 })} />
                    <input className="input-dark" value={hotspot.y} onChange={e => updateHotspot(hotspot.id, { y: Number(e.target.value) || 0 })} />
                    <button type="button" className="btn-secondary" onClick={() => removeHotspot(hotspot.id)}>✕</button>
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'FAUX LIEN (LABEL)' : 'FAKE LINK (LABEL)'}</label>
                <input className="input-dark" value={editScenarioForm.fakeLinkLabel || ''} onChange={e => setEditScenarioForm(f => ({ ...f, fakeLinkLabel: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'FAUX LIEN (URL)' : 'FAKE LINK (URL)'}</label>
                <input className="input-dark" value={editScenarioForm.fakeLinkUrl || ''} onChange={e => setEditScenarioForm(f => ({ ...f, fakeLinkUrl: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'TEXTE AU SURVOL DU FAUX LIEN' : 'HOVER TEXT FOR FAKE LINK'}</label>
                <input className="input-dark" value={editScenarioForm.fakeLinkHover || ''} onChange={e => setEditScenarioForm(f => ({ ...f, fakeLinkHover: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'EXPÉDITEUR FAUX MAIL' : 'FAKE EMAIL SENDER'}</label>
                <input className="input-dark" value={editScenarioForm.fakeEmailSender || ''} onChange={e => setEditScenarioForm(f => ({ ...f, fakeEmailSender: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'OBJET FAUX MAIL' : 'FAKE EMAIL SUBJECT'}</label>
                <input className="input-dark" value={editScenarioForm.fakeEmailSubject || ''} onChange={e => setEditScenarioForm(f => ({ ...f, fakeEmailSubject: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>{lang === 'fr' ? 'CORPS DU FAUX MAIL' : 'FAKE EMAIL BODY'}</label>
                <textarea className="input-dark" rows={3} value={editScenarioForm.fakeEmailBody || ''} onChange={e => setEditScenarioForm(f => ({ ...f, fakeEmailBody: e.target.value }))} />
                <div style={{ marginTop: '8px', border: '1px solid var(--border-subtle)', padding: '10px', background: '#0b0b0b' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{editScenarioForm.fakeEmailSender || 'sender@example.com'} → {editScenarioForm.fakeEmailSubject || (lang === 'fr' ? 'Objet' : 'Subject')}</div>
                  <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-light)' }}>{editScenarioForm.fakeEmailBody || (lang === 'fr' ? 'Aperçu du faux mail.' : 'Fake email preview.')}</div>
                  {(editScenarioForm.fakeLinkLabel || editScenarioForm.fakeLinkUrl) && (
                    <a href={editScenarioForm.fakeLinkUrl || '#'} title={editScenarioForm.fakeLinkHover || ''} style={{ display: 'inline-block', marginTop: '8px', color: '#4ea1ff', textDecoration: 'underline' }}>
                      {editScenarioForm.fakeLinkLabel || (lang === 'fr' ? 'Lien cliquable' : 'Clickable link')}
                    </a>
                  )}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1', border: '1px solid var(--border-subtle)', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{lang === 'fr' ? 'DESIGN DES QUESTIONS (QUIZZ)' : 'QUESTION DESIGN (QUIZ)'}</label>
                  <button type="button" className="btn-secondary" onClick={addQuizQuestion}>+ {lang === 'fr' ? 'Ajouter question' : 'Add question'}</button>
                </div>
                {(editScenarioForm.quizQuestions || []).map((question, index) => (
                  <div key={question.id} style={{ border: '1px solid var(--border-subtle)', padding: '10px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)' }}>
                    <input className="input-dark" placeholder={(lang === 'fr' ? 'Question ' : 'Question ') + (index + 1)} value={question.prompt} onChange={e => updateQuizQuestion(question.id, { prompt: e.target.value })} />
                    <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '140px 1fr', gap: '8px', marginTop: '8px' }}>
                      <select value={question.design || 'cards'} onChange={e => updateQuizQuestion(question.id, { design: e.target.value })} style={{ width: '100%', padding: '10px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '12px' }}>
                        <option value="cards">{lang === 'fr' ? 'Cartes' : 'Cards'}</option>
                        <option value="list">{lang === 'fr' ? 'Liste' : 'List'}</option>
                        <option value="terminal">{lang === 'fr' ? 'Terminal' : 'Terminal'}</option>
                      </select>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>{lang === 'fr' ? 'Style visuel de cette question' : 'Visual style for this question'}</div>
                    </div>
                    {(question.options || []).map((option) => (
                      <div key={option.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginTop: '8px' }}>
                        <input className="input-dark" placeholder={lang === 'fr' ? 'Réponse' : 'Answer'} value={option.text} onChange={e => updateQuizOption(question.id, option.id, { text: e.target.value })} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <input type="checkbox" checked={!!option.isCorrect} onChange={e => updateQuizOption(question.id, option.id, { isCorrect: e.target.checked })} />
                          {lang === 'fr' ? 'Correcte' : 'Correct'}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ gridColumn: '1 / -1', padding: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>{lang === 'fr' ? 'MODULES NATIFS DU SCÉNARIO' : 'NATIVE SCENARIO MODULES'}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SCENARIO_MODULES.map((moduleKey) => {
                    const isActive = (editScenarioForm.modules || []).includes(moduleKey)
                    return (
                      <button
                        key={moduleKey}
                        type="button"
                        onClick={() => toggleScenarioModule(moduleKey)}
                        style={{
                          padding: '6px 10px',
                          border: `1px solid ${isActive ? 'var(--red)' : 'var(--border-subtle)'}`,
                          background: isActive ? 'rgba(235,40,40,0.12)' : 'transparent',
                          color: isActive ? 'var(--text-light)' : 'var(--text-muted)',
                          fontFamily: 'var(--mono)',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {moduleLabels[moduleKey]?.[lang] || moduleKey}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              {lang === 'fr' ? '✓ Sauvegarder les modifications' : '✓ Save changes'}
            </button>
          </form>
        )}
      </Modal>

      {/* Sidebar */}
      <aside style={{ width: isMobile ? '100%' : '240px', flexShrink: 0, background: '#080808', borderRight: isMobile ? 'none' : '1px solid var(--border-subtle)', borderBottom: isMobile ? '1px solid var(--border-subtle)' : 'none', display: 'flex', flexDirection: 'column', position: isMobile ? 'relative' : 'fixed', top: 0, left: 0, bottom: isMobile ? 'auto' : 0, zIndex: 50 }}>
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
        <nav style={{ flex: 1, padding: isMobile ? '8px 12px' : '16px 0', display: 'flex', flexDirection: isMobile ? 'row' : 'column', overflowX: isMobile ? 'auto' : 'visible' }} role="navigation" aria-label="Main navigation">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ width: isMobile ? 'auto' : '100%', minWidth: isMobile ? '140px' : 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: isMobile ? '10px 12px' : '12px 24px', background: activeNav === item.id ? 'rgba(235,40,40,0.08)' : 'transparent', borderLeft: !isMobile && activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent', borderBottom: isMobile && activeNav === item.id ? '2px solid var(--red)' : '2px solid transparent', color: activeNav === item.id ? 'var(--text-light)' : 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'all 0.15s', cursor: 'pointer', flexShrink: 0 }} aria-current={activeNav === item.id ? 'page' : undefined} aria-label={`Navigate to ${item.label}`}>
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
      <main style={{ marginLeft: isMobile ? 0 : '240px', flex: 1 }}>
        <div style={{ padding: isCompact ? '16px' : '20px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: '#080808', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '20px' }}>{t('saTitle')}</h1>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>ROOMCA Platform v2.4.1 — 07/04/2025</div>
          </div>
          <div className="tag"><span className="status-dot red" /> {t('saEnvProd')}</div>
        </div>

        <div style={{ padding: isCompact ? '16px' : '40px' }}>
          {/* Overview */}
          {activeNav === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1px', background: 'var(--border-subtle)' }}>
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
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saCompaniesTitle')} ({companies.length})</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={() => setModal({ type: 'addCompany' })} aria-label="Add new company">{t('saAdd')}</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: companiesTableMinWidth }} role="table" aria-label="Companies list">
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
            </div>
          )}

          {/* Scenarios */}
          {activeNav === 'scenarios' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saScenariosTitle')} ({scenarios.length})</div>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }} onClick={() => { setEditScenarioForm({ ...DEFAULT_SCENARIO_FIELDS }); setModal({ type: 'createScenario' }) }} aria-label="Create new scenario">{t('saCreateScenario')}</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: scenariosTableMinWidth }} role="table" aria-label="Scenarios list">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {[t('saColTitle'), t('saColCategory'), t('saColDifficulty'), t('saColDuration'), lang === 'fr' ? 'Modules' : 'Modules', t('saColPlays'), t('saColAvgScore'), t('saColStatus'), ''].map((h, i) => (
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
                      <td style={{ padding: '14px 20px', fontSize: '11px', color: 'var(--text-muted)', maxWidth: '240px' }}>{getScenarioModulesLabel(s)}</td>
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
            </div>
          )}

          {/* Licenses */}
          {activeNav === 'licenses' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('saNavLicenses')}</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: licensesTableMinWidth }} role="table" aria-label="Licenses list">
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
            </div>
          )}

          {/* System */}
          {activeNav === 'system' && (
            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: '20px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: twoCols, gap: '12px', fontSize: '13px' }}>
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
