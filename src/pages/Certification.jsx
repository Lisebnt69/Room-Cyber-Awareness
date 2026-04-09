import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import { generateCertificatePDF } from '../services/pdfGenerator'

const certifications = [
  { id: 'cca', name: 'ROOMCA Certified Awareness', level: 'Foundation', duration: '4h', price: 99, badge: '🥉', topics: ['Phishing', 'Passwords', 'Social Eng.'], passRate: 78 },
  { id: 'ccp', name: 'ROOMCA Certified Practitioner', level: 'Intermediate', duration: '8h', price: 199, badge: '🥈', topics: ['Incident Response', 'Threat Hunting', 'Forensics'], passRate: 65 },
  { id: 'cce', name: 'ROOMCA Certified Expert', level: 'Advanced', duration: '16h', price: 399, badge: '🥇', topics: ['Advanced Persistent Threats', 'Red Team', 'Compliance'], passRate: 42 },
  { id: 'ccgdpr', name: 'GDPR Compliance Specialist', level: 'Specialty', duration: '6h', price: 249, badge: '🛡️', topics: ['Article 32', 'DPIA', 'Breach Notification'], passRate: 71 },
  { id: 'cchipaa', name: 'HIPAA Compliance Specialist', level: 'Specialty', duration: '6h', price: 249, badge: '🏥', topics: ['PHI', 'BAA', 'Safeguards'], passRate: 69 },
  { id: 'ccpci', name: 'PCI-DSS Implementer', level: 'Specialty', duration: '8h', price: 299, badge: '💳', topics: ['Cardholder Data', 'Network Seg.', 'Encryption'], passRate: 58 }
]

// Confetti animation component
function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ['#eb2828', '#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#00d4ff'][i % 6],
    dur: `${2 + Math.random() * 2}s`,
    delay: `${Math.random() * 1}s`,
    size: `${6 + Math.random() * 8}px`,
    br: Math.random() > 0.5 ? '50%' : '2px',
  }))
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left,
          background: p.color,
          width: p.size,
          height: p.size,
          '--dur': p.dur,
          '--delay': p.delay,
          '--br': p.br,
          borderRadius: p.br,
        }} />
      ))}
    </div>
  )
}

export default function Certification() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [selected, setSelected] = useState(null)
  const [examMode, setExamMode] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  if (examMode && selected) {
    return <ExamInterface cert={selected} onExit={() => setExamMode(false)} />
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <img src={Logo} alt="ROOMCA" style={{ height: '32px', width: 'auto', display: 'block' }} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <motion.div
          style={{ marginBottom: '40px' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🎓 Programme de Certification</h1>
          <p style={{ color: 'var(--text-muted)' }}>Certifications reconnues en cybersécurité et conformité</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(235,40,40,0.2)' }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '12px', cursor: 'default' }}
            >
              <motion.div
                style={{ fontSize: '48px', marginBottom: '12px' }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
              >{cert.badge}</motion.div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{cert.name}</h3>
              <div style={{ fontSize: '11px', color: '#eb2828', marginBottom: '16px' }}>{cert.level}</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ {cert.duration}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📊 {cert.passRate}% pass rate</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                {cert.topics.map((t, ti) => (
                  <motion.span
                    key={ti}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 + ti * 0.05 + 0.2 }}
                    style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(235,40,40,0.1)', color: '#eb2828', borderRadius: '12px', fontSize: '10px', marginRight: '4px', marginBottom: '4px' }}
                  >{t}</motion.span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#eb2828' }}>€{cert.price}</span>
                <motion.button
                  onClick={() => { setSelected(cert); setExamMode(true) }}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '12px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >Démarrer l'examen</motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExamInterface({ cert, onExit }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  const questions = [
    { q: 'Que faire si vous recevez un email demandant un virement urgent du PDG ?', options: ['Virer immédiatement', 'Appeler le PDG sur sa ligne directe', 'Demander confirmation par email', 'Ignorer'], correct: 1 },
    { q: 'Quelle est la durée légale de conservation des logs sous GDPR ?', options: ['1 mois', '6 mois', '12 mois', 'Selon contexte/finalité'], correct: 3 },
    { q: 'Le principe du moindre privilège signifie :', options: ['Accès minimum nécessaire', 'Tout ouvert', 'Accès admin pour tous', 'Pas d\'accès'], correct: 0 },
    { q: 'Quel délai de notification GDPR en cas de breach ?', options: ['24h', '48h', '72h', '7 jours'], correct: 2 },
    { q: 'Le MFA protège contre :', options: ['Phishing', 'Vol de mot de passe', 'Les deux', 'Aucun'], correct: 2 }
  ]

  const handleAnswer = (idx) => {
    setDirection(1)
    const newAnswers = [...answers, idx]
    setAnswers(newAnswers)
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
    } else {
      setFinished(true)
    }
  }

  const score = answers.filter((a, i) => a === questions[i].correct).length
  const passed = score >= questions.length * 0.7
  const scorePercent = Math.round(score / questions.length * 100)

  if (finished) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {passed && <Confetti />}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: 'var(--bg-card)', padding: '60px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px', position: 'relative', zIndex: 10 }}
        >
          <motion.div
            style={{ fontSize: '72px', marginBottom: '16px' }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >{passed ? '🏆' : '❌'}</motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{ color: passed ? '#22c55e' : '#eb2828', marginBottom: '12px' }}
          >{passed ? 'Certifié !' : 'Échec'}</motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '16px' }}
          >Score : {score}/{questions.length} ({scorePercent}%)</motion.p>

          {/* Score progress bar */}
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: passed ? '#22c55e' : '#eb2828', borderRadius: '4px' }}
            />
          </div>

          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Votre certificat {cert.name} est prêt.</p>
              <motion.button
                onClick={async () => {
                  setDownloading(true)
                  await generateCertificatePDF({
                    title: cert.name,
                    level: cert.level,
                    userName: 'Employé ROOMCA',
                    score: scorePercent,
                    date: new Date().toLocaleDateString('fr-FR'),
                    issuer: 'ROOMCA Certification Authority',
                    certId: cert.id,
                  })
                  setDownloading(false)
                }}
                className="btn-primary"
                style={{ marginBottom: '12px', width: '100%' }}
                disabled={downloading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(0,212,255,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                {downloading ? '⏳ Génération...' : '📥 Télécharger le Certificat PDF'}
              </motion.button>
            </motion.div>
          )}
          <motion.button
            onClick={onExit}
            className="btn-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >Retour</motion.button>
        </motion.div>
      </div>
    )
  }

  const progressPct = ((currentQ) / questions.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)', padding: '40px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <motion.div
          style={{ marginBottom: '24px' }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button onClick={onExit} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>← Quitter</button>
          <h2 style={{ color: 'var(--text-primary)', marginTop: '12px' }}>{cert.name}</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Question {currentQ + 1} / {questions.length}</div>
        </motion.div>

        {/* Animated progress bar */}
        <div style={{ height: '4px', background: 'var(--bg-card)', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #eb2828, #ff6b6b)', borderRadius: '2px' }}
          />
        </div>

        {/* Question card with slide animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px' }}
          >
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>{questions[currentQ].q}</h3>
            {questions[currentQ].options.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileHover={{ x: 6, background: 'rgba(235,40,40,0.08)', borderColor: 'rgba(235,40,40,0.4)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '16px', marginBottom: '8px',
                  background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '8px',
                  color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginRight: '12px' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
