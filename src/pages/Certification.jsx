import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

const certifications = [
  { id: 'cca', name: 'ROOMCA Certified Awareness', level: 'Foundation', duration: '4h', price: 99, badge: '🥉', topics: ['Phishing', 'Passwords', 'Social Eng.'], passRate: 78 },
  { id: 'ccp', name: 'ROOMCA Certified Practitioner', level: 'Intermediate', duration: '8h', price: 199, badge: '🥈', topics: ['Incident Response', 'Threat Hunting', 'Forensics'], passRate: 65 },
  { id: 'cce', name: 'ROOMCA Certified Expert', level: 'Advanced', duration: '16h', price: 399, badge: '🥇', topics: ['Advanced Persistent Threats', 'Red Team', 'Compliance'], passRate: 42 },
  { id: 'ccgdpr', name: 'GDPR Compliance Specialist', level: 'Specialty', duration: '6h', price: 249, badge: '🛡️', topics: ['Article 32', 'DPIA', 'Breach Notification'], passRate: 71 },
  { id: 'cchipaa', name: 'HIPAA Compliance Specialist', level: 'Specialty', duration: '6h', price: 249, badge: '🏥', topics: ['PHI', 'BAA', 'Safeguards'], passRate: 69 },
  { id: 'ccpci', name: 'PCI-DSS Implementer', level: 'Specialty', duration: '8h', price: 299, badge: '💳', topics: ['Cardholder Data', 'Network Seg.', 'Encryption'], passRate: 58 }
]

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
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/admin')} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>← Dashboard</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px' }}>🎓 Programme de Certification</h1>
          <p style={{ color: 'var(--text-muted)' }}>Certifications reconnues en cybersécurité et conformité</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {certifications.map(cert => (
            <div key={cert.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '24px', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{cert.badge}</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{cert.name}</h3>
              <div style={{ fontSize: '11px', color: '#eb2828', marginBottom: '16px' }}>{cert.level}</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ {cert.duration}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📊 {cert.passRate}% pass rate</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                {cert.topics.map((t, i) => (
                  <span key={i} style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(235,40,40,0.1)', color: '#eb2828', borderRadius: '12px', fontSize: '10px', marginRight: '4px', marginBottom: '4px' }}>{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#eb2828' }}>€{cert.price}</span>
                <button onClick={() => { setSelected(cert); setExamMode(true) }} className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>Démarrer l'examen</button>
              </div>
            </div>
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

  const questions = [
    { q: 'Que faire si vous recevez un email demandant un virement urgent du PDG ?', options: ['Virer immédiatement', 'Appeler le PDG sur sa ligne directe', 'Demander confirmation par email', 'Ignorer'], correct: 1 },
    { q: 'Quelle est la durée légale de conservation des logs sous GDPR ?', options: ['1 mois', '6 mois', '12 mois', 'Selon contexte/finalité'], correct: 3 },
    { q: 'Le principe du moindre privilège signifie :', options: ['Accès minimum nécessaire', 'Tout ouvert', 'Accès admin pour tous', 'Pas d\'accès'], correct: 0 },
    { q: 'Quel délai de notification GDPR en cas de breach ?', options: ['24h', '48h', '72h', '7 jours'], correct: 2 },
    { q: 'Le MFA protège contre :', options: ['Phishing', 'Vol de mot de passe', 'Les deux', 'Aucun'], correct: 2 }
  ]

  const handleAnswer = (idx) => {
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

  if (finished) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--bg-card)', padding: '60px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>{passed ? '🏆' : '❌'}</div>
          <h2 style={{ color: passed ? '#22c55e' : '#eb2828', marginBottom: '12px' }}>{passed ? 'Certifié !' : 'Échec'}</h2>
          <p style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '24px' }}>Score : {score}/{questions.length} ({Math.round(score/questions.length*100)}%)</p>
          {passed && <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Votre certificat {cert.name} sera envoyé par email.</p>}
          <button onClick={onExit} className="btn-primary">Retour</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)', padding: '40px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <button onClick={onExit} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>← Quitter</button>
          <h2 style={{ color: 'var(--text-primary)', marginTop: '12px' }}>{cert.name}</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Question {currentQ + 1} / {questions.length}</div>
        </div>

        <div style={{ height: '4px', background: 'var(--bg-card)', borderRadius: '2px', marginBottom: '32px' }}>
          <div style={{ height: '100%', width: `${((currentQ + 1) / questions.length) * 100}%`, background: '#eb2828', borderRadius: '2px' }}></div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>{questions[currentQ].q}</h3>
          {questions[currentQ].options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '16px', marginBottom: '8px',
              background: 'var(--bg-black)', border: '1px solid var(--border-subtle)', borderRadius: '8px',
              color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px'
            }}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
