import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'

const READY_TO_USE_SCENARIOS = [
  {
    id: 'invoice-trap',
    title: 'Facture urgente du fournisseur',
    category: 'Phishing',
    difficulty: 'medium',
    duration: 540,
    description: 'Un faux email de comptabilité pousse à cliquer sur une facture.',
    narrative: 'Vous recevez un email urgent prétendant venir du service finance. L’attaquant joue sur la pression temporelle.',
    decisions: [
      { id: 1, text: 'Cliquer le lien de facture', isSafe: false, consequence: 'Exposition à un site de vol de credentials.' },
      { id: 2, text: 'Vérifier le domaine expéditeur', isSafe: true, consequence: 'Détection du domaine typosquatté.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [{ id: 11, x: 28, y: 44, label: 'Domaine suspect' }, { id: 12, x: 69, y: 66, label: 'Bouton dangereux' }],
    videoUrl: 'https://www.youtube.com/watch?v=8QxIIz1yEsA',
    fakeEmailSender: 'finance@cornpany-secure.com',
    fakeEmailSubject: 'PAIEMENT BLOQUÉ - action sous 2h',
    fakeEmailBody: 'Veuillez régler la facture en attente immédiatement pour éviter la suspension des services.',
    fakeLinkLabel: 'Consulter la facture',
    fakeLinkUrl: 'https://billing-company-secure.example',
    fakeLinkHover: 'Lien externe non vérifié',
    quizQuestions: [{ id: 21, prompt: 'Quel est le premier réflexe ?' }],
  },
  {
    id: 'hr-doc',
    title: 'Document RH confidentiel',
    category: 'Social Engineering',
    difficulty: 'hard',
    duration: 720,
    description: 'Un attaquant se fait passer pour les RH avec un faux partage.',
    narrative: 'Un mail RH vous demande de signer un nouveau document contractuel via un lien externe.',
    decisions: [
      { id: 3, text: 'Valider l’URL avant connexion', isSafe: true, consequence: 'Réduction du risque d’hameçonnage.' },
      { id: 4, text: 'Saisir ses identifiants SSO', isSafe: false, consequence: 'Compromission du compte entreprise.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [{ id: 13, x: 34, y: 51, label: 'URL trompeuse' }],
    videoUrl: '',
    fakeEmailSender: 'rh@intranet-support-alert.com',
    fakeEmailSubject: 'Mise à jour obligatoire du contrat',
    fakeEmailBody: 'Merci de signer ce document avant la fin de journée.',
    fakeLinkLabel: 'Signer le document',
    fakeLinkUrl: 'https://secure-hr-sign.example',
    fakeLinkHover: 'Nom de domaine inhabituel',
    quizQuestions: [{ id: 22, prompt: 'Quel indicateur est le plus critique ?' }],
  },
  {
    id: 'vishing-it',
    title: 'Vishing support IT',
    category: 'Social Engineering',
    difficulty: 'medium',
    duration: 480,
    description: 'Un faux technicien appelle pour obtenir un code MFA.',
    narrative: 'Un appel urgent du “support IT” demande votre code pour résoudre un incident.',
    decisions: [
      { id: 5, text: 'Partager son code MFA', isSafe: false, consequence: 'Prise de contrôle du compte.' },
      { id: 6, text: 'Raccrocher et rappeler le support officiel', isSafe: true, consequence: 'Vérification d’identité réussie.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [
      { id: 14, x: 41, y: 55, label: 'Numéro inconnu' },
      { id: 1401, x: 66, y: 34, label: 'Ton urgent' },
      { id: 1402, x: 23, y: 72, label: 'Demande code MFA' },
    ],
    videoUrl: '',
    fakeEmailSender: '',
    fakeEmailSubject: '',
    fakeEmailBody: '',
    fakeLinkLabel: '',
    fakeLinkUrl: '',
    fakeLinkHover: '',
    quizQuestions: [
      { id: 23, prompt: 'Que faire avant toute action demandée par téléphone ?' },
      { id: 2301, prompt: 'Partager un code MFA est-il acceptable ?' },
      { id: 2302, prompt: 'Quel canal utiliser pour vérifier l’identité ?' },
    ],
  },
  {
    id: 'usb-drop',
    title: 'Clé USB “salaire 2026”',
    category: 'Malware',
    difficulty: 'hard',
    duration: 600,
    description: 'Une clé USB est trouvée dans les locaux avec un nom attractif.',
    narrative: 'Un collaborateur découvre une clé USB et hésite à l’ouvrir pour identifier le propriétaire.',
    decisions: [
      { id: 7, text: 'Brancher la clé sur son poste', isSafe: false, consequence: 'Risque d’exécution malware.' },
      { id: 8, text: 'Remettre la clé au SOC/IT', isSafe: true, consequence: 'Analyse en environnement isolé.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [
      { id: 15, x: 52, y: 63, label: 'Média inconnu' },
      { id: 1501, x: 31, y: 45, label: 'Nom attractif du fichier' },
      { id: 1502, x: 72, y: 58, label: 'Absence de propriétaire' },
    ],
    videoUrl: '',
    fakeEmailSender: '',
    fakeEmailSubject: '',
    fakeEmailBody: '',
    fakeLinkLabel: '',
    fakeLinkUrl: '',
    fakeLinkHover: '',
    quizQuestions: [
      { id: 24, prompt: 'Quelle procédure appliquer pour un support inconnu ?' },
      { id: 2401, prompt: 'Pourquoi éviter de brancher sur son poste ?' },
      { id: 2402, prompt: 'Quel service doit analyser la clé ?' },
    ],
  },
  {
    id: 'qr-code-trap',
    title: 'QR code parking gratuit',
    category: 'Phishing',
    difficulty: 'easy',
    duration: 420,
    description: 'Un QR code promet un service gratuit mais redirige vers une fausse page.',
    narrative: 'Des affiches dans le hall invitent à scanner un QR pour activer un avantage.',
    decisions: [
      { id: 9, text: 'Scanner et valider immédiatement', isSafe: false, consequence: 'Collecte d’identifiants.' },
      { id: 10, text: 'Contrôler l’URL avant saisie', isSafe: true, consequence: 'Lien frauduleux identifié.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1620987277181-11db5f7f7f3f?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [
      { id: 16, x: 47, y: 49, label: 'QR non officiel' },
      { id: 1601, x: 61, y: 64, label: 'Promesse trop belle' },
      { id: 1602, x: 29, y: 40, label: 'Absence de marque officielle' },
    ],
    videoUrl: '',
    fakeEmailSender: 'parking@city-access-support.com',
    fakeEmailSubject: 'Activez votre accès gratuit',
    fakeEmailBody: 'Scannez le QR et connectez-vous pour activer votre avantage.',
    fakeLinkLabel: 'Activer mon accès',
    fakeLinkUrl: 'https://parking-free-access.example',
    fakeLinkHover: 'Domaine hors organisation',
    quizQuestions: [
      { id: 25, prompt: 'Quel est le risque principal du quishing ?' },
      { id: 2501, prompt: 'Que vérifier avant de saisir ses identifiants ?' },
      { id: 2502, prompt: 'Comment signaler un QR suspect ?' },
    ],
  },
  {
    id: 'fake-teams',
    title: 'Invitation Teams externe',
    category: 'Credentials',
    difficulty: 'medium',
    duration: 540,
    description: 'Une invitation visio externe demande une reconnexion SSO.',
    narrative: 'Un contact inconnu partage une réunion “urgent board update”.',
    decisions: [
      { id: 11, text: 'Se connecter via la page reçue', isSafe: false, consequence: 'Vol des identifiants.' },
      { id: 12, text: 'Passer par l’app officielle', isSafe: true, consequence: 'Tentative bloquée.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1616587894289-86480e533129?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [
      { id: 17, x: 63, y: 58, label: 'Fausse page login' },
      { id: 1701, x: 36, y: 44, label: 'Expéditeur externe' },
      { id: 1702, x: 72, y: 31, label: 'Réunion “urgente” inattendue' },
    ],
    videoUrl: '',
    fakeEmailSender: 'teams-notify@meeting-secure-alert.com',
    fakeEmailSubject: 'Invitation réunion confidentielle',
    fakeEmailBody: 'Merci de vous reconnecter pour accéder à la réunion.',
    fakeLinkLabel: 'Rejoindre la réunion',
    fakeLinkUrl: 'https://teams-signin-alert.example',
    fakeLinkHover: 'URL non Microsoft',
    quizQuestions: [
      { id: 26, prompt: 'Quel comportement est recommandé ?' },
      { id: 2601, prompt: 'Pourquoi éviter le lien direct du mail ?' },
      { id: 2602, prompt: 'Quel outil officiel utiliser pour rejoindre la réunion ?' },
    ],
  },
  {
    id: 'ceo-fraud',
    title: 'Fraude au président (CEO Fraud)',
    category: 'Social Engineering',
    difficulty: 'hard',
    duration: 780,
    description: 'Un message urgent du “CEO” demande un virement discret.',
    narrative: 'La pression hiérarchique et l’urgence sont utilisées pour contourner les contrôles.',
    decisions: [
      { id: 13, text: 'Exécuter le virement rapidement', isSafe: false, consequence: 'Perte financière majeure.' },
      { id: 14, text: 'Valider via double canal + procédure finance', isSafe: true, consequence: 'Fraude stoppée.' },
    ],
    coverImage: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    photoHotspots: [
      { id: 18, x: 39, y: 47, label: 'Ton inhabituel' },
      { id: 19, x: 71, y: 60, label: 'Demande hors process' },
      { id: 1901, x: 22, y: 68, label: 'Urgence artificielle' },
    ],
    videoUrl: '',
    fakeEmailSender: 'ceo.office@exec-priority-mail.com',
    fakeEmailSubject: 'Virement confidentiel immédiat',
    fakeEmailBody: 'Je suis en réunion, traite ce paiement dans l’heure et confirme uniquement par mail.',
    fakeLinkLabel: 'Valider le virement',
    fakeLinkUrl: 'https://wire-validation-priority.example',
    fakeLinkHover: 'Action financière anormale',
    quizQuestions: [
      { id: 27, prompt: 'Quelle règle anti-fraude appliquer ?' },
      { id: 2701, prompt: 'Pourquoi la double validation est obligatoire ?' },
      { id: 2702, prompt: 'Quel signal révèle une fraude au président ?' },
    ],
  },
]

export default function ScenarioBuilder() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [scenario, setScenario] = useState({
    title: '',
    category: 'Phishing',
    difficulty: 'medium',
    duration: 600,
    description: '',
    narrative: '',
    framework: '',
    sector: '',
    decisions: [],
    coverImage: '',
    photoHotspots: [],
    videoUrl: '',
    fakeEmailSender: '',
    fakeEmailSubject: '',
    fakeEmailBody: '',
    fakeLinkLabel: '',
    fakeLinkUrl: '',
    fakeLinkHover: '',
    quizQuestions: [],
    storyBlocks: [
      { id: 1, title: 'Introduction', text: 'Contexte du scénario', visual: '' }
    ]
  })
  const [newDecision, setNewDecision] = useState({ text: '', isSafe: true, consequence: '' })

  const handleLogout = () => { logout(); navigate('/login') }

  const addDecision = () => {
    if (!newDecision.text) return
    setScenario({ ...scenario, decisions: [...scenario.decisions, { ...newDecision, id: Date.now() }] })
    setNewDecision({ text: '', isSafe: true, consequence: '' })
  }

  const removeDecision = (id) => {
    setScenario({ ...scenario, decisions: scenario.decisions.filter(d => d.id !== id) })
  }

  const handleImageUpload = (file) => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setScenario(prev => ({ ...prev, coverImage: objectUrl }))
  }

  const addHotspot = (e) => {
    if (!scenario.coverImage) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setScenario(prev => ({
      ...prev,
      photoHotspots: [...prev.photoHotspots, { id: Date.now() + Math.random(), x, y, label: 'Indice' }],
    }))
  }

  const updateHotspot = (id, patch) => {
    setScenario(prev => ({ ...prev, photoHotspots: prev.photoHotspots.map(h => h.id === id ? { ...h, ...patch } : h) }))
  }

  const removeHotspot = (id) => {
    setScenario(prev => ({ ...prev, photoHotspots: prev.photoHotspots.filter(h => h.id !== id) }))
  }

  const addQuizQuestion = () => {
    setScenario(prev => ({
      ...prev,
      quizQuestions: [...prev.quizQuestions, {
        id: Date.now() + Math.random(),
        prompt: '',
        options: [
          { id: Math.random(), text: '', isCorrect: true },
          { id: Math.random(), text: '', isCorrect: false },
        ]
      }]
    }))
  }

  const addStoryBlock = () => {
    setScenario(prev => ({
      ...prev,
      storyBlocks: [...(prev.storyBlocks || []), { id: Date.now() + Math.random(), title: '', text: '', visual: '' }]
    }))
  }

  const updateStoryBlock = (id, patch) => {
    setScenario(prev => ({
      ...prev,
      storyBlocks: (prev.storyBlocks || []).map(block => block.id === id ? { ...block, ...patch } : block)
    }))
  }

  const removeStoryBlock = (id) => {
    setScenario(prev => ({
      ...prev,
      storyBlocks: (prev.storyBlocks || []).filter(block => block.id !== id)
    }))
  }

  const save = () => {
    alert(`Scénario "${scenario.title}" sauvegardé !`)
  }

  const testPlayerView = () => {
    localStorage.setItem('roomca_preview_scenario', JSON.stringify(scenario))
    navigate('/player?preview=1')
  }

  const loadReadyScenario = (preset) => {
    setScenario({
      ...preset,
      framework: preset.framework || '',
      sector: preset.sector || '',
      fakeEmailSender: preset.fakeEmailSender || '',
      fakeEmailSubject: preset.fakeEmailSubject || '',
      fakeEmailBody: preset.fakeEmailBody || '',
      fakeLinkLabel: preset.fakeLinkLabel || '',
      fakeLinkUrl: preset.fakeLinkUrl || '',
      fakeLinkHover: preset.fakeLinkHover || '',
      quizQuestions: preset.quizQuestions || [],
      photoHotspots: preset.photoHotspots || [],
      storyBlocks: preset.storyBlocks || [{ id: 'intro-block', title: 'Introduction', text: preset.description || '', visual: preset.coverImage || '' }],
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)', fontFamily: 'Roboto, var(--font-body), sans-serif' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🛠️ Scenario Builder</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Créez vos scénarios immersifs personnalisés</p>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '16px' }}>Scénarios prêts à l’emploi</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {READY_TO_USE_SCENARIOS.map((preset) => (
              <button key={preset.id} onClick={() => loadReadyScenario(preset)} style={{ textAlign: 'left', padding: '14px', border: '1px solid var(--border-subtle)', background: 'var(--bg-black)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{preset.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>1. Informations de base</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Titre du scénario</label>
              <input type="text" value={scenario.title} onChange={e => setScenario({...scenario, title: e.target.value})}
                placeholder="Ex: Phishing CEO Wire"
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Catégorie</label>
              <select value={scenario.category} onChange={e => setScenario({...scenario, category: e.target.value})}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }}>
                <option>Phishing</option>
                <option>Malware</option>
                <option>Social Engineering</option>
                <option>Credentials</option>
                <option>Compliance</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Difficulté</label>
              <select value={scenario.difficulty} onChange={e => setScenario({...scenario, difficulty: e.target.value})}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }}>
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Durée (secondes)</label>
              <input type="number" value={scenario.duration} onChange={e => setScenario({...scenario, duration: parseInt(e.target.value) || 0})}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Description courte</label>
            <input type="text" value={scenario.description} onChange={e => setScenario({...scenario, description: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>2. Narration immersive</h3>
          <textarea value={scenario.narrative} onChange={e => setScenario({...scenario, narrative: e.target.value})}
            placeholder="Écrivez la mise en situation immersive..."
            rows={8}
            style={{ width: '100%', padding: '12px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', resize: 'vertical' }} />
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>3. Décisions ({scenario.decisions.length})</h3>
          {scenario.decisions.map(d => (
            <div key={d.id} style={{ padding: '16px', background: 'var(--bg-black)', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{d.isSafe ? '✅' : '❌'} {d.text}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{d.consequence}</div>
                </div>
                <button onClick={() => removeDecision(d.id)} style={{ background: 'transparent', border: 'none', color: '#eb2828', cursor: 'pointer' }}>×</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-black)', borderRadius: '8px' }}>
            <input type="text" value={newDecision.text} onChange={e => setNewDecision({...newDecision, text: e.target.value})}
              placeholder="Texte de la décision..."
              style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', marginBottom: '8px' }} />
            <input type="text" value={newDecision.consequence} onChange={e => setNewDecision({...newDecision, consequence: e.target.value})}
              placeholder="Conséquence..."
              style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', marginBottom: '8px' }} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                <input type="checkbox" checked={newDecision.isSafe} onChange={e => setNewDecision({...newDecision, isSafe: e.target.checked})} /> Décision sûre
              </label>
              <button onClick={addDecision} style={{ marginLeft: 'auto', padding: '6px 16px', background: '#eb2828', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>+ Ajouter décision</button>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>4. Image + Mapping + Vidéo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Image (URL)</label>
              <input type="text" value={scenario.coverImage} onChange={e => setScenario({ ...scenario, coverImage: e.target.value })}
                placeholder="https://..."
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Ou importer une image</label>
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files?.[0])}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Vidéo (URL)</label>
              <input type="text" value={scenario.videoUrl} onChange={e => setScenario({ ...scenario, videoUrl: e.target.value })}
                placeholder="https://youtube.com/..."
                style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', marginTop: '4px' }} />
            </div>
          </div>
          <div onClick={addHotspot} style={{ position: 'relative', border: '1px dashed var(--border-subtle)', minHeight: '220px', borderRadius: '8px', overflow: 'hidden', cursor: scenario.coverImage ? 'crosshair' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-black)' }}>
            {scenario.coverImage ? (
              <>
                <img src={scenario.coverImage} alt="mapping" style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', opacity: 0.7 }} />
                {scenario.photoHotspots.map(h => (
                  <span key={h.id} style={{ position: 'absolute', left: `${h.x}%`, top: `${h.y}%`, width: '14px', height: '14px', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: '#eb2828', border: '1px solid #fff' }} />
                ))}
              </>
            ) : <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Ajoute une image puis clique pour poser des hotspots</span>}
          </div>
          <div style={{ marginTop: '12px' }}>
            {scenario.photoHotspots.map(h => (
              <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px auto', gap: '8px', marginBottom: '8px' }}>
                <input value={h.label} onChange={e => updateHotspot(h.id, { label: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
                <input value={h.x} onChange={e => updateHotspot(h.id, { x: Number(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
                <input value={h.y} onChange={e => updateHotspot(h.id, { y: Number(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
                <button onClick={() => removeHotspot(h.id)} style={{ padding: '8px', background: 'transparent', border: '1px solid #eb282860', color: '#eb2828', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>5. Faux mail + faux lien + quiz</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input type="text" value={scenario.fakeEmailSender} onChange={e => setScenario({ ...scenario, fakeEmailSender: e.target.value })} placeholder="Expéditeur"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            <input type="text" value={scenario.fakeEmailSubject} onChange={e => setScenario({ ...scenario, fakeEmailSubject: e.target.value })} placeholder="Objet"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            <textarea rows={3} value={scenario.fakeEmailBody} onChange={e => setScenario({ ...scenario, fakeEmailBody: e.target.value })} placeholder="Corps du faux email"
              style={{ gridColumn: '1 / -1', width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            <input type="text" value={scenario.fakeLinkLabel} onChange={e => setScenario({ ...scenario, fakeLinkLabel: e.target.value })} placeholder="Label faux lien"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            <input type="text" value={scenario.fakeLinkUrl} onChange={e => setScenario({ ...scenario, fakeLinkUrl: e.target.value })} placeholder="URL faux lien"
              style={{ width: '100%', padding: '10px', background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)' }} />
          </div>
          <div style={{ marginTop: '12px', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-black)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{scenario.fakeEmailSender || 'sender@example.com'} → {scenario.fakeEmailSubject || 'Objet'}</div>
            <div style={{ marginTop: '6px', color: 'var(--text-primary)' }}>{scenario.fakeEmailBody || 'Aperçu du faux email'}</div>
            {scenario.fakeLinkLabel && <a href={scenario.fakeLinkUrl || '#'} style={{ marginTop: '8px', display: 'inline-block', color: '#4ea1ff' }}>{scenario.fakeLinkLabel}</a>}
          </div>
          <div style={{ marginTop: '16px' }}>
            <button onClick={addQuizQuestion} className="btn-secondary">+ Ajouter une question quiz</button>
            {scenario.quizQuestions.map((q, index) => (
              <div key={q.id} style={{ marginTop: '8px', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-black)' }}>
                <input value={q.prompt} onChange={e => setScenario(prev => ({ ...prev, quizQuestions: prev.quizQuestions.map(item => item.id === q.id ? { ...item, prompt: e.target.value } : item) }))}
                  placeholder={`Question ${index + 1}`}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#eb2828', marginBottom: '20px' }}>6. Storyboard cinématique (bloc par bloc)</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Crée un rendu diapo / film ultra visuel</span>
            <button onClick={addStoryBlock} className="btn-secondary">+ Ajouter un bloc</button>
          </div>
          {(scenario.storyBlocks || []).map((block, index) => (
            <div key={block.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', background: '#0a0a0a', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bloc #{index + 1}</div>
                <button onClick={() => removeStoryBlock(block.id)} style={{ background: 'transparent', border: '1px solid #eb282860', color: '#eb2828', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px' }}>Supprimer</button>
              </div>
              <input value={block.title} onChange={e => updateStoryBlock(block.id, { title: e.target.value })} placeholder="Titre du bloc"
                style={{ width: '100%', padding: '8px', marginBottom: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
              <textarea rows={2} value={block.text} onChange={e => updateStoryBlock(block.id, { text: e.target.value })} placeholder="Texte narratif"
                style={{ width: '100%', padding: '8px', marginBottom: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
              <input value={block.visual} onChange={e => updateStoryBlock(block.id, { visual: e.target.value })} placeholder="URL image/visuel du bloc"
                style={{ width: '100%', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)' }} />
            </div>
          ))}
          <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {(scenario.storyBlocks || []).map((block) => (
              <div key={`preview-${block.id}`} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#070707' }}>
                <div style={{ height: '110px', background: block.visual ? `url(${block.visual}) center/cover no-repeat` : 'linear-gradient(135deg,#121212,#2a2a2a)' }} />
                <div style={{ padding: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{block.title || 'Bloc sans titre'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{block.text || 'Ajoute un texte narratif.'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={save} className="btn-primary" style={{ padding: '12px 32px' }}>💾 Sauvegarder</button>
          <button onClick={testPlayerView} className="btn-secondary" style={{ padding: '12px 32px' }}>👁️ Tester vue joueur</button>
          <button className="btn-secondary" style={{ padding: '12px 32px' }}>🚀 Publier sur Marketplace</button>
        </div>
      </div>
    </div>
  )
}
