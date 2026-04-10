import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import ScenarioBuilder from './ScenarioBuilder'

const INITIAL_COMPANIES = [
  {
    id: 1,
    name: 'ACME Corp',
    plan: 'Business',
    users: 161,
    active: 142,
    scenarios: 6,
    licenses: 200,
    expire: '31/12/2025',
    status: 'active',
    email: 'admin@acme.com',
    sector: 'Finance',
  },
  {
    id: 2,
    name: 'BNP Finance',
    plan: 'Enterprise',
    users: 892,
    active: 814,
    scenarios: 12,
    licenses: 1000,
    expire: '30/06/2025',
    status: 'active',
    email: 'security@bnp.fr',
    sector: 'Finance',
  },
  {
    id: 3,
    name: 'Mairie de Lyon',
    plan: 'Starter',
    users: 24,
    active: 18,
    scenarios: 3,
    licenses: 25,
    expire: '15/05/2025',
    status: 'expiring',
    email: 'dsi@mairie-lyon.fr',
    sector: 'Administration',
  },
]

const INITIAL_SCENARIOS = [
  {
    id: 1,
    title: { fr: 'Opération : Inbox Zero', en: 'Operation: Inbox Zero' },
    category: 'Phishing',
    difficulty: 'intermediate',
    duration: '15',
    plays: 3241,
    score: 724,
    status: 'published',
    description: "Simulation d'attaque phishing avancée par email",
  },
  {
    id: 2,
    title: { fr: 'Bureau Compromis', en: 'Compromised Desktop' },
    category: 'Ransomware',
    difficulty: 'advanced',
    duration: '20',
    plays: 1892,
    score: 612,
    status: 'published',
    description: 'Scénario de ransomware sur poste de travail',
  },
]

const SCENARIO_CATEGORIES = [
  'Phishing',
  'Ransomware',
  'Social Eng.',
  'Insider',
  'Réseau',
  'Malware',
  'OSINT',
]

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

// --- UTILS ---
const withScenarioDefaults = (s) => ({
  ...DEFAULT_SCENARIO_FIELDS,
  ...s,
  title: {
    fr: s?.title?.fr || '',
    en: s?.title?.en || '',
  },
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
    draft: [t('badgeDraft'), 'var(--text-muted)'],
  }

  const [label, color] = map[s] || [s, 'var(--text-muted)']

  return (
    <span
      style={{
        padding: '3px 10px',
        fontSize: '11px',
        fontFamily: 'var(--mono)',
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

  const [companies, setCompanies] = useState(INITIAL_COMPANIES)
  const [scenarios, setScenarios] = useState(
    INITIAL_SCENARIOS.map(withScenarioDefaults),
  )

  const [editCompanyForm, setEditCompanyForm] = useState(null)
  const [editScenarioForm, setEditScenarioForm] = useState(null)
  const [builderMode, setBuilderMode] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleBuilderSave = (data) => {
    const updated = {
      id: data.id || Date.now(),
      title: { fr: data.titleFr, en: data.titleEn || data.titleFr },
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      description: data.description,
      status: data.status,
      coverImage: data.coverImage || '',
      coverImageName: data.coverImageName || '',
      photoHotspots: data.photoHotspots || [],
      fakeLinkLabel: data.fakeLinkLabel || '',
      fakeLinkUrl: data.fakeLinkUrl || '',
      fakeLinkHover: data.fakeLinkHover || '',
      fakeEmailSender: data.fakeEmailSender || '',
      fakeEmailSubject: data.fakeEmailSubject || '',
      fakeEmailBody: data.fakeEmailBody || '',
      videoUrl: data.videoUrl || '',
      quizQuestions: data.quizQuestions || [],
      narrative: data.narrative || '',
      modules: data.modules || [],
      plays: data.plays || 0,
      score: data.score || 0,
      mappingContext: data.mappingContext || '',
    }
    if (builderMode?.mode === 'edit') {
      setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s))
      showToast(lang === 'fr' ? `"${updated.title.fr}" mis à jour` : `"${updated.title.en}" updated`)
    } else {
      setScenarios(prev => [...prev, updated])
      showToast(lang === 'fr' ? `"${updated.title.fr}" créé` : `"${updated.title.en}" created`)
    }
    setBuilderMode(null)
  }

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
    setCompanies((prev) =>
      prev.map((c) => (c.id === editCompanyForm.id ? { ...editCompanyForm } : c)),
    )
    setModal(null)
    showToast(lang === 'fr' ? `${editCompanyForm.name} mis à jour` : `${editCompanyForm.name} updated`)
  }

  const deleteCompany = (id) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id))
    setModal(null)
    showToast(lang === 'fr' ? 'Entreprise supprimée' : 'Company deleted')
  }

  const openEditScenario = (s) => {
    const data = withScenarioDefaults(s)
    setEditScenarioForm({
      ...data,
      titleFr: data.title.fr,
      titleEn: data.title.en,
    })
    setModal({ type: 'editScenario' })
  }

  const saveScenario = (e) => {
    e.preventDefault()

    const updated = withScenarioDefaults({
      ...editScenarioForm,
      title: {
        fr: editScenarioForm.titleFr,
        en: editScenarioForm.titleEn || editScenarioForm.titleFr,
      },
    })

    setScenarios((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setModal(null)
    showToast(lang === 'fr' ? 'Scénario mis à jour' : 'Scenario updated')
  }

  const createScenario = (e) => {
    e.preventDefault()

    const newS = withScenarioDefaults({
      ...editScenarioForm,
      id: Date.now(),
      title: {
        fr: editScenarioForm.titleFr,
        en: editScenarioForm.titleEn || editScenarioForm.titleFr,
      },
      status: editScenarioForm.status || 'draft',
    })

    setScenarios((prev) => [...prev, newS])
    setModal(null)
    showToast(lang === 'fr' ? 'Scénario créé' : 'Scenario created')
  }

  const handleBuilderSave = (scenarioData) => {
    const newS = withScenarioDefaults({
      id: scenarioData.id,
      title: {
        fr: scenarioData.titleFr,
        en: scenarioData.titleEn || scenarioData.titleFr,
      },
      category: scenarioData.category,
      difficulty: scenarioData.difficulty,
      duration: scenarioData.duration,
      description: scenarioData.description,
      blocks: scenarioData.blocks || [],
      plays: 0,
      score: 0,
      status: scenarioData.status,
    })

    setScenarios((prev) => [...prev, newS])
    setBuilderMode(false)

    showToast(
      lang === 'fr'
        ? `Scénario "${newS.title.fr}" ${scenarioData.status === 'published' ? 'publié' : 'en brouillon'}`
        : `Scenario "${newS.title.fr}" ${scenarioData.status === 'published' ? 'published' : 'saved as draft'}`,
    )
  }

  const onScenarioPhotoUpload = (file) => {
    if (!file) return

    const localUrl = URL.createObjectURL(file)

    setEditScenarioForm((prev) => ({
      ...prev,
      coverImage: localUrl,
      coverImageName: file.name,
      modules: Array.from(new Set([...(prev?.modules || []), 'photo'])),
    }))
  }
  reader.readAsDataURL(file)
}

  const addHotspotFromImageClick = (e) => {
    if (!editScenarioForm?.coverImage) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)

    setEditScenarioForm((prev) => ({
      ...prev,
      modules: Array.from(new Set([...(prev?.modules || []), 'mapping'])),
      photoHotspots: [
        ...(prev?.photoHotspots || []),
        {
          id: Date.now() + Math.random(),
          x,
          y,
          label: lang === 'fr' ? 'Indice' : 'Clue',
          action: 'clue',
        },
      ],
    }))
  }

const updateHotspot = (id, patch) => {
  setEditScenarioForm(prev => ({
    ...(prev || {}),
    photoHotspots: (prev?.photoHotspots || []).map(h => (h.id === id ? { ...h, ...patch } : h)),
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
    quizQuestions: (prev?.quizQuestions || []).map(q => (q.id === questionId ? { ...q, ...patch } : q)),
  }))
}

const updateQuizOption = (questionId, optionId, patch) => {
  setEditScenarioForm(prev => ({
    ...(prev || {}),
    quizQuestions: (prev?.quizQuestions || []).map(q =>
      q.id === questionId
        ? {
            ...q,
            options: (q.options || []).map(o => (o.id === optionId ? { ...o, ...patch } : o)),
          }
        : q
    ),
  }))
}
  const getScenarioModulesLabel = (scenario) => {
    const modules = Array.isArray(scenario.modules) ? scenario.modules : []
    if (!modules.length) return lang === 'fr' ? 'Aucun module' : 'No modules'
    return modules.map(m => moduleLabels[m]?.[lang] || m).join(' · ')
  }

  if (builderMode) {
    return (
      <ScenarioBuilder
        onSave={handleBuilderSave}
        onBack={() => setBuilderMode(false)}
      />
    )
  }

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
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#000',
        color: 'var(--text-light)',
      }}
    >
      {toast && <Toast message={toast} type="success" />}

      <Modal
        isOpen={modal?.type === 'editCompany'}
        onClose={() => setModal(null)}
        title={editCompanyForm?.name}
      >
        {editCompanyForm && (
          <form onSubmit={saveCompany}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label className="label-mono">{lang === 'fr' ? 'NOM' : 'NAME'}</label>
                <input
                  className="input-dark"
                  value={editCompanyForm.name}
                  onChange={(e) =>
                    setEditCompanyForm({ ...editCompanyForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="label-mono">EMAIL</label>
                <input
                  className="input-dark"
                  type="email"
                  value={editCompanyForm.email}
                  onChange={(e) =>
                    setEditCompanyForm({ ...editCompanyForm, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-primary" type="submit" style={{ flex: 1 }}>
                {t('saSave')}
              </button>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => deleteCompany(editCompanyForm.id)}
              >
                🗑
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={modal?.type === 'editScenario' || modal?.type === 'createScenario'}
        onClose={() => setModal(null)}
        title={modal?.type === 'createScenario' ? t('saCreateScenario') : t('saEdit')}
      >
        <form onSubmit={modal?.type === 'createScenario' ? createScenario : saveScenario}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label-mono">TITRE (FR)</label>
              <input
                className="input-dark"
                value={editScenarioForm?.titleFr || ''}
                onChange={(e) =>
                  setEditScenarioForm({ ...editScenarioForm, titleFr: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label-mono">TITLE (EN)</label>
              <input
                className="input-dark"
                value={editScenarioForm?.titleEn || ''}
                onChange={(e) =>
                  setEditScenarioForm({ ...editScenarioForm, titleEn: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-mono">CATÉGORIE</label>
              <select
                className="input-dark"
                value={editScenarioForm?.category || 'Phishing'}
                onChange={(e) =>
                  setEditScenarioForm({ ...editScenarioForm, category: e.target.value })
                }
              >
                {SCENARIO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-mono">STATUS</label>
              <select
                className="input-dark"
                value={editScenarioForm?.status || 'draft'}
                onChange={(e) =>
                  setEditScenarioForm({ ...editScenarioForm, status: e.target.value })
                }
              >
                {SCENARIO_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '12px',
            }}
          >
            <label className="label-mono">MAPPING PHOTO</label>
            <input
              type="file"
              className="input-dark"
              style={{ marginBottom: '10px' }}
              onChange={(e) => onScenarioPhotoUpload(e.target.files?.[0])}
            />

            <div
              onClick={addHotspotFromImageClick}
              style={{
                position: 'relative',
                height: '200px',
                background: '#0a0a0a',
                cursor: 'crosshair',
                overflow: 'hidden',
                border: '1px dashed #333',
              }}
            >
              {editScenarioForm?.coverImage && (
                <>
                  <img
                    src={editScenarioForm.coverImage}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    alt="Preview"
                  />
                  {(editScenarioForm.photoHotspots || []).map((h) => (
                    <div
                      key={h.id}
                      style={{
                        position: 'absolute',
                        left: `${h.x}%`,
                        top: `${h.y}%`,
                        width: '12px',
                        height: '12px',
                        background: 'red',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </>
              )}
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

          <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '20px' }}>
            {lang === 'fr' ? '✓ Valider' : '✓ Confirm'}
          </button>
        </form>
      </Modal>

      <aside
        style={{
          width: '240px',
          background: '#080808',
          borderRight: '1px solid var(--border-subtle)',
          position: 'fixed',
          height: '100vh',
        }}
      >
        <div style={{ padding: '24px' }}>
          <img src={Logo} alt="ROOMCA" style={{ height: '30px' }} />
          <div className="tag-admin">SUPER ADMIN</div>
        </div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`nav-btn ${activeNav === item.id ? 'active' : ''}`}
            >
              {item.icon} {item.label}
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

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px' }}>
        <header
          style={{
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>{t('saTitle')}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LangToggle />
            <div className="tag-prod">PROD</div>
          </div>
        </header>

        {activeNav === 'companies' && (
          <div className="card-table">
            <div className="table-header">
              <span>
                {t('saCompaniesTitle')} ({companies.length})
              </span>
              <button className="btn-primary" onClick={() => setModal({ type: 'addCompany' })}>
                {t('saAdd')}
              </button>
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
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.plan}</td>
                    <td>
                      <StatusBadge s={c.status} t={t} />
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => openEditCompany(c)}>
                        ✎
                      </button>
                    </td>
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

        {activeNav === 'scenarios' && (
          <div className="card-table">
            <div className="table-header">
              <span>
                {t('saScenariosTitle')} ({scenarios.length})
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEditScenarioForm({
                      ...DEFAULT_SCENARIO_FIELDS,
                      titleFr: '',
                      titleEn: '',
                    })
                    setModal({ type: 'createScenario' })
                  }}
                >
                  {lang === 'fr' ? 'Formulaire simple' : 'Simple form'}
                </button>

                <button
                  className="btn-primary"
                  onClick={() => setBuilderMode(true)}
                >
                  {t('saCreateScenario')}
                </button>
              </div>
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
                {scenarios.map((s) => (
                  <tr key={s.id}>
                    <td>{s.title?.[lang] || s.title?.fr || 'Sans titre'}</td>
                    <td>{s.category}</td>
                    <td>
                      <StatusBadge s={s.status} t={t} />
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => openEditScenario(s)}>
                        ✎
                      </button>
                    </td>
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
