import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import BrandLogo from '../components/BrandLogo'
import LangToggle from '../components/LangToggle'
import ThemeToggle from '../components/ThemeToggle'
import { db } from '../services/db'

const L = (obj, lang) => (obj && typeof obj === 'object' ? (obj[lang] || obj.fr || obj.en) : obj)

// Map a backend scenario row → the shape PhaseSelect/PhaseScenario expect
function normalizeAssignedScenario(row) {
  const diffMap = { beginner: 'easy', intermediate: 'intermediate', advanced: 'hard' }
  return {
    id: String(row.id),
    title: { fr: row.title_fr, en: row.title_en || row.title_fr },
    category: row.category || 'Phishing',
    difficulty: diffMap[row.difficulty] || row.difficulty || 'medium',
    duration: (Number(row.duration) || 15) * 60,
    description: row.description || '',
    narrative: '',
    status: row.status || 'pending',
    score: row.score,
    source: row.source,
  }
}

const CATEGORY_META = {
  'Phishing':                   { icon: '🎣', tint: 'var(--red)'    },
  'Social Engineering':         { icon: '🎭', tint: 'var(--rose)'   },
  'Malware':                    { icon: '🦠', tint: '#f59e0b'       },
  'Advanced Malware':           { icon: '☣️', tint: '#f59e0b'       },
  'Business Email Compromise':  { icon: '💼', tint: 'var(--violet)' },
  'Credentials':                { icon: '🔑', tint: 'var(--cyan)'   },
  'Cloud Security':             { icon: '☁️', tint: 'var(--cyan)'   },
  'Data Breach':                { icon: '🧱', tint: 'var(--red)'    },
  'Advanced':                   { icon: '🧠', tint: 'var(--violet)' },
}

const DIFFICULTY_META = {
  easy:         { label: { fr: 'Facile',       en: 'Easy'         }, color: '#22c55e' },
  medium:       { label: { fr: 'Moyen',        en: 'Medium'       }, color: '#38bdf8' },
  intermediate: { label: { fr: 'Intermédiaire',en: 'Intermediate' }, color: '#38bdf8' },
  hard:         { label: { fr: 'Difficile',    en: 'Hard'         }, color: '#f59e0b' },
}

const CHOICE_TEMPLATES = {
  'Phishing': [
    { id: 'report',  correct: true,  points: 1000, text: { fr: "Signaler l'e-mail à l'équipe IT via le bouton « Phish Alert »",                  en: 'Report the email to IT via the "Phish Alert" button' },                 feedback: { fr: "Parfait. Le signalement permet de bloquer la campagne à la source et d'alerter vos collègues.",                      en: 'Perfect. Reporting blocks the campaign at the source and warns your colleagues.' } },
    { id: 'verify',  correct: true,  points: 750,  text: { fr: "Appeler l'expéditeur sur un numéro connu pour vérifier",                          en: 'Call the sender on a known number to verify' },                          feedback: { fr: 'Excellent. La vérification hors bande reste une des meilleures défenses.',                                            en: 'Excellent. Out-of-band verification is one of the best defenses.' } },
    { id: 'ignore',  correct: false, points: 150,  text: { fr: 'Supprimer discrètement sans prévenir personne',                                   en: 'Quietly delete without telling anyone' },                                 feedback: { fr: 'Mieux que cliquer, mais vos collègues ne seront pas avertis — la campagne continue.',                                 en: 'Better than clicking, but colleagues stay unwarned — the campaign continues.' } },
    { id: 'click',   correct: false, points: 0,    text: { fr: 'Cliquer sur le lien pour « juste vérifier »',                                     en: 'Click the link to "just check"' },                                        feedback: { fr: "Erreur critique. Identifiants volés ou malware déposé en une fraction de seconde.",                                  en: 'Critical error. Credentials stolen or malware dropped in a fraction of a second.' } },
  ],
  'Social Engineering': [
    { id: 'verify',  correct: true,  points: 1000, text: { fr: "Exiger une vérification d'identité via un canal officiel",                       en: 'Demand identity verification through an official channel' },             feedback: { fr: 'Réflexe parfait. Un vrai interlocuteur coopérera sans protester.',                                                    en: 'Perfect reflex. A legitimate contact will cooperate without pushback.' } },
    { id: 'report',  correct: true,  points: 800,  text: { fr: "Raccrocher et signaler l'incident à l'équipe sécurité",                          en: 'Hang up and report the incident to security' },                         feedback: { fr: 'Excellent. Le signalement protège toute votre organisation.',                                                          en: 'Excellent. Reporting protects your entire organization.' } },
    { id: 'comply',  correct: false, points: 0,    text: { fr: 'Coopérer immédiatement pour éviter les ennuis',                                  en: 'Cooperate immediately to avoid trouble' },                                feedback: { fr: "Trop rapide. L'urgence est l'arme principale de l'ingénieur social.",                                                 en: 'Too fast. Urgency is the primary weapon of the social engineer.' } },
    { id: 'pass',    correct: false, points: 200,  text: { fr: 'Transférer le dossier à un collègue',                                            en: 'Pass the case to a colleague' },                                          feedback: { fr: 'Vous déplacez le problème sans le résoudre.',                                                                          en: 'You move the problem without solving it.' } },
  ],
  'Malware': [
    { id: 'isolate', correct: true,  points: 1000, text: { fr: "Débrancher le réseau et appeler l'équipe SOC",                                   en: 'Unplug from the network and call the SOC team' },                       feedback: { fr: 'Réflexe parfait. Isoler stoppe la propagation latérale.',                                                             en: 'Perfect reflex. Isolation stops lateral spread.' } },
    { id: 'scan',    correct: true,  points: 650,  text: { fr: "Lancer un scan antivirus complet immédiatement",                                 en: 'Run a full antivirus scan immediately' },                                feedback: { fr: "Bonne approche, mais certains malwares évadent les signatures : isolez aussi la machine.",                            en: 'Good move, but some malware evades signatures — also isolate the machine.' } },
    { id: 'open',    correct: false, points: 0,    text: { fr: 'Ouvrir le fichier pour « voir ce que c\'est »',                                  en: 'Open the file to "see what it is"' },                                    feedback: { fr: "Désastreux. Le malware s'exécute à l'instant de l'ouverture.",                                                        en: 'Disastrous. Malware executes the moment you open it.' } },
    { id: 'share',   correct: false, points: 0,    text: { fr: 'Partager le fichier à un collègue pour avis',                                    en: 'Share the file with a colleague for advice' },                            feedback: { fr: 'Catastrophique. Vous propagez activement l\'infection.',                                                              en: 'Catastrophic. You actively spread the infection.' } },
  ],
  'Advanced Malware': [
    { id: 'ir',      correct: true,  points: 1000, text: { fr: "Déclencher la procédure de réponse à incident (IR)",                             en: 'Trigger the incident response (IR) procedure' },                          feedback: { fr: 'Parfait. Les menaces avancées requièrent une équipe dédiée.',                                                          en: 'Perfect. Advanced threats require a dedicated team.' } },
    { id: 'sandbox', correct: true,  points: 750,  text: { fr: "Analyser l'échantillon dans une sandbox isolée",                                 en: 'Analyze the sample in an isolated sandbox' },                             feedback: { fr: 'Bonne méthode pour collecter les IOCs sans contaminer le SI.',                                                        en: 'Good method for collecting IOCs without contaminating the environment.' } },
    { id: 'trust',   correct: false, points: 100,  text: { fr: "Faire confiance à l'antivirus seul",                                             en: 'Rely on antivirus alone' },                                               feedback: { fr: 'Le polymorphisme contourne les signatures traditionnelles.',                                                           en: 'Polymorphism bypasses traditional signatures.' } },
    { id: 'reuse',   correct: false, points: 0,    text: { fr: 'Réutiliser la machine une fois « nettoyée »',                                    en: 'Reuse the machine once "cleaned"' },                                      feedback: { fr: 'Jamais. Réinstallez complètement — la persistance peut être cachée.',                                                 en: 'Never. Fully reinstall — persistence may be hidden.' } },
  ],
  'Business Email Compromise': [
    { id: 'oob',     correct: true,  points: 1000, text: { fr: 'Appeler le demandeur sur un numéro déjà connu',                                  en: 'Call the requester on a pre-known number' },                              feedback: { fr: 'Excellent. La vérification hors bande est essentielle pour les virements.',                                            en: 'Excellent. Out-of-band verification is essential for wire transfers.' } },
    { id: 'dual',    correct: true,  points: 800,  text: { fr: 'Exiger une double signature avant tout virement',                                en: 'Require dual-signature on any wire' },                                     feedback: { fr: 'Bonne pratique. Le contrôle à quatre yeux bloque la majorité des BEC.',                                                en: 'Good practice. Four-eyes control blocks most BEC fraud.' } },
    { id: 'reply',   correct: false, points: 100,  text: { fr: "Répondre à l'e-mail pour confirmer les détails",                                 en: 'Reply to the email to confirm details' },                                 feedback: { fr: 'Erreur : le fraudeur contrôle déjà cette boîte.',                                                                      en: 'Wrong: the fraudster already controls that inbox.' } },
    { id: 'rush',    correct: false, points: 0,    text: { fr: "Exécuter le virement sans délai par peur du retard",                             en: 'Rush the wire transfer for fear of being late' },                         feedback: { fr: "L'urgence est un drapeau rouge BEC. Argent perdu.",                                                                   en: 'Urgency is a red-flag BEC tactic. Money lost.' } },
  ],
  'Credentials': [
    { id: 'mfa',     correct: true,  points: 1000, text: { fr: 'Activer le MFA et révoquer toutes les sessions',                                 en: 'Enable MFA and revoke all active sessions' },                             feedback: { fr: 'Parfait. Le MFA bloque plus de 99 % des attaques de credentials.',                                                    en: 'Perfect. MFA blocks over 99% of credential attacks.' } },
    { id: 'rotate',  correct: true,  points: 800,  text: { fr: 'Changer les mots de passe réutilisés et utiliser un gestionnaire',               en: 'Change reused passwords and adopt a password manager' },                  feedback: { fr: 'Très bien. La réutilisation est la première cause de compromission.',                                                 en: 'Well done. Reuse is the #1 cause of compromise.' } },
    { id: 'ignore',  correct: false, points: 0,    text: { fr: "Ne rien faire, « ça n'arrive qu'aux autres »",                                   en: 'Do nothing, "it only happens to others"' },                               feedback: { fr: 'Faux sentiment de sécurité — les attaques sont automatisées 24/7.',                                                   en: 'False security — attacks are automated around the clock.' } },
    { id: 'share',   correct: false, points: 0,    text: { fr: 'Partager le mot de passe avec un collègue « de confiance »',                     en: 'Share the password with a "trusted" colleague' },                         feedback: { fr: 'Violation de politique. Chaque compte doit rester nominatif.',                                                        en: 'Policy violation. Every account must stay nominative.' } },
  ],
  'Cloud Security': [
    { id: 'revoke',  correct: true,  points: 1000, text: { fr: 'Révoquer immédiatement les partages « tous avec le lien »',                      en: 'Immediately revoke all "anyone with link" shares' },                      feedback: { fr: 'Parfait. Coupez l\'exposition avant toute autre action.',                                                             en: 'Perfect. Cut exposure before anything else.' } },
    { id: 'audit',   correct: true,  points: 800,  text: { fr: 'Auditer toutes les permissions et appliquer le moindre privilège',                en: 'Audit all permissions and enforce least privilege' },                     feedback: { fr: 'Excellent. Le moindre privilège est la base du cloud sécurisé.',                                                       en: 'Excellent. Least privilege is the foundation of secure cloud.' } },
    { id: 'private', correct: false, points: 300,  text: { fr: 'Rendre tous les dossiers privés par défaut',                                      en: 'Set every folder to private by default' },                                feedback: { fr: 'Mieux, mais il faut aussi notifier les personnes dont les données ont fuité.',                                         en: 'Better, but you must also notify exposed data subjects.' } },
    { id: 'ignore',  correct: false, points: 0,    text: { fr: "Ignorer : « c'est un vieux dossier »",                                            en: 'Ignore it — "that\'s an old folder"' },                                    feedback: { fr: 'Les vieux dossiers sont souvent les plus sensibles.',                                                                 en: 'Old folders are often the most sensitive.' } },
  ],
  'Data Breach': [
    { id: 'ir',      correct: true,  points: 1000, text: { fr: "Déclencher le plan de réponse et notifier la CNIL sous 72 h",                    en: 'Trigger the IR plan and notify the authority within 72h' },               feedback: { fr: "Parfait. Les délais légaux RGPD commencent dès la découverte.",                                                      en: 'Perfect. GDPR legal timelines start at discovery.' } },
    { id: 'contain', correct: true,  points: 800,  text: { fr: "Contenir la fuite et préserver les preuves forensiques",                         en: 'Contain the leak and preserve forensic evidence' },                       feedback: { fr: 'Excellent. La preuve est essentielle pour enquêter et pour le juridique.',                                            en: 'Excellent. Evidence is essential for investigation and legal.' } },
    { id: 'quiet',   correct: false, points: 0,    text: { fr: 'Retirer discrètement le dépôt et espérer que personne ne voit',                  en: 'Quietly take down the repo and hope nobody noticed' },                    feedback: { fr: 'Trop tard — les bots indexent en quelques minutes. Amende garantie.',                                                 en: 'Too late — bots index within minutes. Fine guaranteed.' } },
    { id: 'wait',    correct: false, points: 0,    text: { fr: "Attendre de voir si ça remonte avant d'agir",                                    en: 'Wait to see if it surfaces before acting' },                             feedback: { fr: "Non-conformité RGPD. Les 72 h sont un délai strict.",                                                                 en: 'GDPR non-compliance. 72h is a hard deadline.' } },
  ],
  'Advanced': [
    { id: 'ir',      correct: true,  points: 1000, text: { fr: "Escalader à l'équipe Threat Intelligence",                                       en: 'Escalate to the Threat Intelligence team' },                              feedback: { fr: 'Parfait. Les menaces avancées demandent des experts.',                                                                en: 'Perfect. Advanced threats demand experts.' } },
    { id: 'logs',    correct: true,  points: 750,  text: { fr: "Collecter logs et artefacts avant toute autre action",                           en: 'Collect logs and artifacts before anything else' },                       feedback: { fr: 'Excellent. La forensique en direct est précieuse.',                                                                   en: 'Excellent. Live forensics is priceless.' } },
    { id: 'reboot',  correct: false, points: 0,    text: { fr: 'Redémarrer la machine pour « repartir propre »',                                 en: 'Reboot the machine to "start clean"' },                                  feedback: { fr: 'Vous détruisez les indicateurs en mémoire.',                                                                          en: 'You destroy in-memory indicators.' } },
    { id: 'solo',    correct: false, points: 0,    text: { fr: 'Gérer seul sans impliquer personne',                                             en: 'Handle it alone without involving anyone' },                              feedback: { fr: 'Trop risqué. Vous manquerez d\'indicateurs et de coordination.',                                                       en: 'Too risky. You will miss indicators and coordination.' } },
  ],
}

function getChoices(category) {
  return CHOICE_TEMPLATES[category] || CHOICE_TEMPLATES['Phishing']
}

// ──────────────────────────────────────────────────────────────
// PHASE 1 — scenario selection grid (assigned scenarios only)
// ──────────────────────────────────────────────────────────────
function PhaseSelect({ assignedScenarios, loading, onSelect, onExit }) {
  const { t, lang } = useLang()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const categories = useMemo(() => ['all', ...Array.from(new Set(assignedScenarios.map(s => s.category)))], [assignedScenarios])
  const filtered = useMemo(() => {
    return assignedScenarios.filter(s => {
      if (filter !== 'all' && s.category !== filter) return false
      if (search && !L(s.title, lang).toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [assignedScenarios, filter, search, lang])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ opacity: 0.55 }} />
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.35 }} />

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border)',
      }}>
        <BrandLogo height={32} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LangToggle />
          <ThemeToggle />
          <button onClick={onExit} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
            ← {lang === 'en' ? 'Dashboard' : 'Tableau de bord'}
          </button>
        </div>
      </nav>

      <div style={{ padding: '48px 40px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="tag tag-aurora" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            <span className="status-dot green" /> {lang === 'en' ? 'Assigned to you' : 'Assignés à vous'}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px',
          }}>
            {lang === 'en' ? 'Your assigned' : 'Vos scénarios'}{' '}
            <span className="text-gradient">{lang === 'en' ? 'scenarios' : 'assignés'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '620px', margin: '0 auto' }}>
            {lang === 'en'
              ? `${assignedScenarios.length} scenario${assignedScenarios.length !== 1 ? 's' : ''} assigned by your administrator. Each one is a real decision.`
              : `${assignedScenarios.length} scénario${assignedScenarios.length !== 1 ? 's' : ''} assigné${assignedScenarios.length !== 1 ? 's' : ''} par votre administrateur. Chaque scénario est une vraie décision.`}
          </p>
        </div>

        {/* Filters */}
        {assignedScenarios.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search scenarios…' : 'Rechercher un scénario…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1 1 260px',
              padding: '12px 18px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-full)',
              fontSize: '14px',
              color: 'var(--text)',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const active = filter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--r-full)',
                    fontSize: '12px', fontWeight: 600,
                    background: active ? 'var(--grad-aurora)' : 'var(--bg-card)',
                    color: active ? 'var(--white)' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s var(--ease)',
                  }}
                >
                  {cat === 'all' ? (lang === 'en' ? 'All' : 'Tous') : cat}
                </button>
              )
            })}
          </div>
        </div>
        )}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(s => {
            const meta = CATEGORY_META[s.category] || { icon: '🎯', tint: 'var(--violet)' }
            const diff = DIFFICULTY_META[s.difficulty] || DIFFICULTY_META.medium
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                className="card-glass"
                style={{
                  textAlign: 'left',
                  padding: '24px',
                  borderRadius: 'var(--r-xl)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                  minHeight: '220px',
                  transition: 'all 0.25s var(--ease)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-aurora)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: `linear-gradient(90deg, ${meta.tint}, transparent)`,
                }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: 'var(--r-md)',
                    background: `color-mix(in srgb, ${meta.tint} 15%, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px',
                  }}>{meta.icon}</div>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.1em',
                    padding: '4px 10px', borderRadius: 'var(--r-full)',
                    background: `color-mix(in srgb, ${diff.color} 15%, transparent)`,
                    color: diff.color,
                    border: `1px solid ${diff.color}`,
                    textTransform: 'uppercase', fontWeight: 700,
                  }}>{L(diff.label, lang)}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '17px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                    {L(s.title, lang)}
                  </div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: meta.tint, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {s.category}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>
                  {s.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-soft)' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    ⏱ {Math.round((s.duration || 900) / 60)} min
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: meta.tint }}>
                    {lang === 'en' ? 'Play' : 'Jouer'} →
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {!loading && assignedScenarios.length === 0 && (
          <div className="card-glass" style={{
            textAlign: 'center',
            padding: '60px 32px',
            borderRadius: 'var(--r-2xl)',
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>
              {lang === 'en' ? 'No scenarios assigned yet' : 'Aucun scénario assigné'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'Your administrator has not assigned any scenarios to you yet. Check back later, or contact your security team to request training.'
                : 'Votre administrateur ne vous a pas encore assigné de scénarios. Revenez plus tard ou contactez votre équipe sécurité pour demander un entraînement.'}
            </p>
          </div>
        )}

        {!loading && assignedScenarios.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
            {lang === 'en' ? 'No scenario matches your filters.' : 'Aucun scénario ne correspond à vos filtres.'}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--mono)' }}>
            {lang === 'en' ? 'LOADING…' : 'CHARGEMENT…'}
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// PHASE 2 — scenario briefing + decision
// ──────────────────────────────────────────────────────────────
function PhaseScenario({ scenario, onComplete, onExit }) {
  const { lang } = useLang()
  const [pickedId, setPickedId] = useState(null)
  const choices = useMemo(() => getChoices(scenario.category), [scenario.category])
  const meta = CATEGORY_META[scenario.category] || { icon: '🎯', tint: 'var(--violet)' }
  const picked = choices.find(c => c.id === pickedId) || null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ opacity: 0.4 }} />
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border)',
      }}>
        <BrandLogo height={32} />
        <div className="tag tag-aurora">
          <span className="status-dot red" /> {lang === 'en' ? 'Scenario in progress' : 'Scénario en cours'}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LangToggle />
          <ThemeToggle />
          <button onClick={onExit} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
            {lang === 'en' ? 'Quit' : 'Quitter'}
          </button>
        </div>
      </nav>

      <div style={{ padding: '48px 40px', maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Briefing */}
        <div className="card-glass" style={{ padding: '36px', borderRadius: 'var(--r-2xl)', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${meta.tint}, transparent)` }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '64px', height: '64px',
              borderRadius: 'var(--r-lg)',
              background: `color-mix(in srgb, ${meta.tint} 18%, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px',
              border: `1px solid ${meta.tint}`,
            }}>{meta.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em', color: meta.tint, fontWeight: 700, textTransform: 'uppercase' }}>{scenario.category}</div>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '4px' }}>
                {L(scenario.title, lang)}
              </h1>
            </div>
          </div>

          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '18px' }}>
            {scenario.description}
          </div>

          {scenario.narrative && (
            <div style={{
              padding: '18px 22px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--mono)',
              fontSize: '12px',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-line',
            }}>
              {scenario.narrative.trim()}
            </div>
          )}
        </div>

        {/* Question */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            {lang === 'en' ? 'Decision' : 'Décision'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.01em' }}>
            {lang === 'en' ? 'What do you do?' : 'Que faites-vous ?'}
          </h2>
        </div>

        {/* Choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {choices.map((c, i) => {
            const isPicked = pickedId === c.id
            const showResult = pickedId !== null
            let borderColor = 'var(--border)'
            let bg = 'var(--bg-card)'
            if (showResult && isPicked) {
              borderColor = c.correct ? '#22c55e' : 'var(--red)'
              bg = c.correct ? 'color-mix(in srgb, #22c55e 12%, var(--bg-card))' : 'color-mix(in srgb, var(--red) 12%, var(--bg-card))'
            }
            return (
              <button
                key={c.id}
                onClick={() => !showResult && setPickedId(c.id)}
                disabled={showResult && !isPicked}
                style={{
                  textAlign: 'left',
                  padding: '18px 22px',
                  borderRadius: 'var(--r-lg)',
                  border: `1px solid ${borderColor}`,
                  background: bg,
                  cursor: showResult ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  transition: 'all 0.2s var(--ease)',
                  opacity: showResult && !isPicked ? 0.45 : 1,
                }}
                onMouseEnter={e => { if (!showResult) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateX(4px)' } }}
                onMouseLeave={e => { if (!showResult) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)' } }}
              >
                <div style={{
                  width: '32px', height: '32px', flexShrink: 0,
                  borderRadius: 'var(--r-full)',
                  background: showResult && isPicked ? (c.correct ? '#22c55e' : 'var(--red)') : 'var(--bg-muted)',
                  color: showResult && isPicked ? 'var(--white)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700,
                }}>
                  {showResult && isPicked ? (c.correct ? '✓' : '✗') : String.fromCharCode(65 + i)}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5, flex: 1 }}>
                  {L(c.text, lang)}
                </div>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {picked && (
          <div className="card-glass" style={{
            padding: '24px 26px',
            borderRadius: 'var(--r-xl)',
            borderLeft: `4px solid ${picked.correct ? '#22c55e' : 'var(--red)'}`,
            marginBottom: '24px',
            animation: 'fadeInUp 0.35s var(--ease)',
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em',
              color: picked.correct ? '#22c55e' : 'var(--red)',
              fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px',
            }}>
              {picked.correct
                ? (lang === 'en' ? `Correct · +${picked.points} pts` : `Correct · +${picked.points} pts`)
                : (lang === 'en' ? `Incorrect · +${picked.points} pts` : `Incorrect · +${picked.points} pts`)}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {L(picked.feedback, lang)}
            </div>
          </div>
        )}

        {picked && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => setPickedId(null)} style={{ padding: '12px 24px' }}>
              {lang === 'en' ? 'Change answer' : 'Changer de réponse'}
            </button>
            <button className="btn-primary" onClick={() => onComplete(picked.points)} style={{ padding: '12px 32px' }}>
              {lang === 'en' ? 'Continue →' : 'Continuer →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// PHASE 3 — debrief
// ──────────────────────────────────────────────────────────────
function PhaseDebrief({ scenario, score, onRetry, onPickAnother, onExit }) {
  const { lang } = useLang()
  const maxScore = 1000
  const pct = Math.round((score / maxScore) * 100)
  const success = pct >= 60

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ opacity: 0.55 }} />
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />

      <div style={{ position: 'fixed', top: '24px', right: '28px', zIndex: 10, display: 'flex', gap: '12px' }}>
        <LangToggle />
        <ThemeToggle />
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '760px', animation: 'fadeInUp 0.6s var(--ease)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: success ? 'linear-gradient(135deg, #10b981, #34d399)' : 'var(--grad-cta)',
            fontSize: '48px', color: 'var(--white)',
            boxShadow: success ? '0 12px 40px rgba(16,185,129,0.45)' : 'var(--shadow-red)',
          }}>{success ? '✓' : '✗'}</div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '10px' }}>
            {success
              ? (lang === 'en' ? 'Mission accomplished' : 'Mission accomplie')
              : (lang === 'en' ? 'Debrief required' : 'Débriefing nécessaire')}
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {L(scenario.title, lang)} · {scenario.category}
          </div>
        </div>

        <div className="card-glass" style={{ borderRadius: 'var(--r-2xl)', padding: '36px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: success ? 'linear-gradient(135deg, #10b981, #34d399)' : 'var(--grad-cta)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', marginBottom: '28px' }}>
            {[
              { label: lang === 'en' ? 'Score' : 'Score', value: score, color: 'var(--violet)', sub: `/ ${maxScore} pts` },
              { label: lang === 'en' ? 'Accuracy' : 'Précision', value: `${pct}%`, color: success ? 'var(--success)' : 'var(--warning)', sub: '' },
              { label: lang === 'en' ? 'Reward' : 'Récompense', value: `+${success ? 50 : 20}`, color: 'var(--gold)', sub: lang === 'en' ? 'coins' : 'pièces' },
            ].map(m => (
              <div key={m.label} style={{
                padding: '20px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '40px', color: m.color, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{m.value}</div>
                {m.sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.sub}</div>}
              </div>
            ))}
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div className="progress-bar" style={{ width: `${pct}%`, background: success ? 'linear-gradient(135deg, #10b981, #34d399)' : 'var(--grad-cta)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onPickAnother} style={{ padding: '12px 28px' }}>
            {lang === 'en' ? 'Another scenario' : 'Autre scénario'}
          </button>
          <button className="btn-secondary" onClick={onRetry} style={{ padding: '12px 28px' }}>
            {lang === 'en' ? 'Retry' : 'Rejouer'}
          </button>
          <button className="btn-secondary" onClick={onExit} style={{ padding: '12px 28px' }}>
            {lang === 'en' ? 'Dashboard' : 'Tableau de bord'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Root component
// ──────────────────────────────────────────────────────────────
export default function Player() {
  const { user } = useAuth()
  const { lang } = useLang()
  const navigate = useNavigate()
  const [phase, setPhase] = useState('select')
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [assignedScenarios, setAssignedScenarios] = useState([])
  const [loadingAssigned, setLoadingAssigned] = useState(true)

  // Fetch only the scenarios assigned to this player (direct + via department).
  // Players never see the rest of the catalog.
  useEffect(() => {
    if (!user?.email) { setLoadingAssigned(false); return }
    let cancelled = false
    setLoadingAssigned(true)
    fetch(`/api/players/${encodeURIComponent(user.email)}/scenarios`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (cancelled) return
        const list = Array.isArray(data) ? data.map(normalizeAssignedScenario) : []
        setAssignedScenarios(list)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingAssigned(false) })
    return () => { cancelled = true }
  }, [user?.email])

  const handleExit = () => navigate('/dashboard')

  const handleSelect = (scenario) => {
    setSelected(scenario)
    setScore(0)
    setPhase('play')
  }

  const handleComplete = (finalScore) => {
    setScore(finalScore)
    setPhase('debrief')
    if (user && selected) {
      db.saveScenarioResult(user.id, {
        scenarioId: selected.id,
        scenarioName: L(selected.title, lang),
        score: finalScore,
        passed: finalScore >= 600,
        duration: selected.duration || 600,
      })
      if (finalScore >= 1000) db.awardBadge(user.id, { id: 'perfect_score', name: 'Perfection', icon: '💯' })
      if (finalScore > 0)     db.awardBadge(user.id, { id: 'first_blood',  name: 'Premier Sang', icon: '🩸' })
    }
  }

  const handleRetry = () => {
    setScore(0)
    setPhase('play')
  }

  const handlePickAnother = () => {
    setSelected(null)
    setScore(0)
    setPhase('select')
  }

  if (phase === 'play' && selected) {
    return <PhaseScenario scenario={selected} onComplete={handleComplete} onExit={handleExit} />
  }
  if (phase === 'debrief' && selected) {
    return <PhaseDebrief scenario={selected} score={score} onRetry={handleRetry} onPickAnother={handlePickAnother} onExit={handleExit} />
  }
  return <PhaseSelect assignedScenarios={assignedScenarios} loading={loadingAssigned} onSelect={handleSelect} onExit={handleExit} />
}
