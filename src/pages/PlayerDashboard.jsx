import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { db } from '../services/db'
import BrandLogo from '../components/BrandLogo'
import LangToggle from '../components/LangToggle'
import { generateCertificatePDF } from '../services/pdfGenerator'

const allBadges = [
  { id: 'first_blood',     name: 'Premier Sang',    icon: '🩸', desc: 'Terminer votre premier scénario' },
  { id: 'phishing_expert', name: 'Anti-Phishing',   icon: '🎣', desc: 'Identifier 10 phishing sans erreur' },
  { id: 'streak_7',        name: 'Semaine de feu',  icon: '🔥', desc: '7 jours de connexion consécutifs' },
  { id: 'perfect_score',   name: 'Perfection',      icon: '💯', desc: 'Score parfait sur un scénario' },
  { id: 'compliance_pro',  name: 'Compliance Pro',  icon: '🛡️', desc: 'Réussir 3 scénarios conformité' },
  { id: 'speed_run',       name: 'Speed Runner',    icon: '⚡', desc: 'Finir un scénario en moins de 5min' },
  { id: 'social_guard',    name: 'Social Guard',    icon: '🕵️', desc: 'Détecter 5 social engineering' },
  { id: 'certified',       name: 'Certifié ROOMCA', icon: '🎓', desc: 'Obtenir une certification officielle' },
]

const mockActivity = [
  { date: '2026-04-07', scenario: 'Inbox Zero',          score: 850, passed: true  },
  { date: '2026-04-06', scenario: 'Fausse Urgence',      score: 920, passed: true  },
  { date: '2026-04-04', scenario: 'Clone Phishing',      score: 680, passed: true  },
  { date: '2026-04-01', scenario: 'Ransomware Décision', score: 450, passed: false },
  { date: '2026-03-29', scenario: 'Credential Theft',    score: 760, passed: true  },
]

const mockModules = [
  { name: 'Phishing Fundamentals', progress: 100, completed: true  },
  { name: 'Social Engineering',    progress: 75,  completed: false },
  { name: 'Malware Defense',       progress: 60,  completed: false },
  { name: 'GDPR Basics',           progress: 100, completed: true  },
  { name: 'Password Security',     progress: 40,  completed: false },
]

const weeklyDefis = [
  { id: 'd1', title: 'Détective phishing', desc: 'Identifier 3 emails suspects cette semaine',   icon: '🔍', points: 150, target: 3, done: 2, expires: '2026-04-13', claimed: false },
  { id: 'd2', title: 'Streak de 5 jours',  desc: 'Se connecter 5 jours consécutifs',             icon: '🔥', points: 200, target: 5, done: 3, expires: '2026-04-13', claimed: false },
  { id: 'd3', title: 'Score parfait',      desc: "Obtenir 900+ sur n'importe quel scénario",     icon: '💯', points: 300, target: 1, done: 0, expires: '2026-04-13', claimed: false },
  { id: 'd4', title: 'Mission sociale',    desc: 'Partager votre score avec un collègue',        icon: '🤝', points: 50,  target: 1, done: 1, expires: '2026-04-13', claimed: true  },
]

const earnedCertificates = [
  { id: 'cert1', title: 'Phishing Fundamentals', date: '2026-03-15', score: 94, level: 'Intermédiaire', issuer: 'ROOMCA Certification Authority' },
  { id: 'cert2', title: 'GDPR Awareness',        date: '2026-03-29', score: 88, level: 'Débutant',      issuer: 'ROOMCA Certification Authority' },
]

async function downloadCertificate(cert, userName) {
  await generateCertificatePDF({
    title: cert.title,
    level: cert.level,
    userName: userName || 'Employé ROOMCA',
    score: cert.score,
    date: cert.date,
    issuer: cert.issuer,
    certId: cert.id,
  })
}

const TABS = [
  { id: 'overview',    label: 'Vue d\'ensemble', icon: '🏠' },
  { id: 'activité',    label: 'Activité',         icon: '📊' },
  { id: 'modules',     label: 'Modules',          icon: '📚' },
  { id: 'défis',       label: 'Défis',            icon: '🎯' },
  { id: 'badges',      label: 'Badges',           icon: '🏅' },
  { id: 'certificats', label: 'Certificats',      icon: '🎓' },
  { id: 'classement',  label: 'Classement',       icon: '🏆' },
]

export default function PlayerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])
  const [defis, setDefis] = useState(weeklyDefis)
  const [assignedScenarios, setAssignedScenarios] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, msg: '🔥 Défi "Streak 5 jours" — plus que 2 jours !',        time: 'Il y a 2h', read: false },
    { id: 2, msg: '🏆 Nouveau classement disponible — vous êtes #3',       time: 'Il y a 5h', read: false },
    { id: 3, msg: '📧 Nouveau scénario assigné : Social Engineering Pro', time: 'Hier',      read: true  },
  ])

  useEffect(() => {
    if (!user) return
    db.seedIfEmpty()
    const s = db.getUserStats(user.id)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(s)
    const b = db.getUserBadges(user.id)
    setBadges(b)
    if (db.getUserResults(user.id).length > 0) {
      db.awardBadge(user.id, allBadges[0])
      setBadges(db.getUserBadges(user.id))
    }
    if (user.email) {
      fetch(`/api/players/${encodeURIComponent(user.email)}/scenarios`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setAssignedScenarios(data) })
        .catch(() => {})
    }
  }, [user])

  const handleLogout = () => { logout(); navigate('/login') }

  const globalScore = stats?.avgScore || 78
  const scoreGradient = globalScore >= 80
    ? 'linear-gradient(135deg, #10b981, #34d399)'
    : globalScore >= 60
    ? 'linear-gradient(135deg, #f59e0b, #facc15)'
    : 'linear-gradient(135deg, #ef3e47, #f472b6)'
  const scoreColor = globalScore >= 80 ? 'var(--success)' : globalScore >= 60 ? 'var(--warning)' : 'var(--red)'

  const heatMap = Array(48).fill(null).map(() => {
    const hasActivity = Math.random() > 0.55
    return hasActivity ? Math.floor(Math.random() * 4) + 1 : 0
  })

  const heatColor = (i) => {
    if (i === 0) return 'var(--bg-muted)'
    const alpha = 0.15 + (i * 0.20)
    return `rgba(124, 92, 255, ${alpha})`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <div className="aurora-bg" style={{ opacity: 0.5 }} />

      {/* NAV */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border)',
      }}>
        <BrandLogo height={34} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LangToggle />
          <button
            onClick={() => navigate('/play')}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            ▶ Jouer
          </button>
          <button onClick={() => navigate('/leaderboards')} className="btn-ghost">🏆 Classement</button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setNotifOpen(o => !o)
                setNotifications(n => n.map(x => ({ ...x, read: true })))
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--r-full)',
                background: 'var(--bg-muted)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '16px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🔔
              {notifications.some(n => !n.read) && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  background: 'var(--red)',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 2px var(--bg-elevated)',
                }} />
              )}
            </button>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50px',
                  width: '340px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  zIndex: 100,
                  boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '15px' }}>
                  Notifications
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                    <div style={{ color: 'var(--text)', marginBottom: '4px', lineHeight: 1.5 }}>{n.msg}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{n.time}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <button
            onClick={() => navigate('/settings')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--r-full)',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ⚙️
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>Déconnexion</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}
        >
          <div>
            <div className="tag tag-aurora" style={{ marginBottom: '12px' }}>
              <span className="status-dot green" /> En ligne
            </div>
            <h1 style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}>
              Bonjour, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Joueur'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              {user?.company || 'ROOMCA Corp'} · Niveau <strong style={{ color: 'var(--violet)' }}>Defender</strong>
            </p>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--r-full)',
            background: 'var(--grad-aurora)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'var(--white)',
            fontWeight: 700,
            boxShadow: 'var(--shadow-aurora)',
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </motion.div>

        {/* Hero score card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="card-glass"
          style={{
            padding: '40px',
            marginBottom: '28px',
            borderRadius: 'var(--r-2xl)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '32px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              fontWeight: 600,
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}>
              Votre score de sécurité
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
              <span style={{
                fontSize: 'clamp(64px, 10vw, 96px)',
                fontWeight: 800,
                lineHeight: 1,
                background: scoreGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.04em',
              }}>
                {globalScore}
              </span>
              <span style={{ fontSize: '24px', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
            </div>
            <div className="progress" style={{ maxWidth: '400px', marginBottom: '14px' }}>
              <div className="progress-bar" style={{ width: `${globalScore}%`, background: scoreGradient }} />
            </div>
            <div style={{ fontSize: '14px', color: scoreColor, fontWeight: 500 }}>
              {globalScore >= 80
                ? '✅ Excellent — Vous êtes un atout pour la sécurité'
                : globalScore >= 60
                ? '⚠️ Bien — Continuez à vous entraîner'
                : '🔴 À améliorer — Entraînement recommandé'}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `conic-gradient(from 180deg, var(--violet) 0%, var(--cyan) ${globalScore}%, var(--bg-muted) ${globalScore}%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
              }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  background: scoreGradient,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}>
                  {globalScore}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Maîtrise</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          marginBottom: '36px',
        }}>
          {[
            { label: 'Scénarios joués', value: stats?.scenariosCompleted || mockActivity.length, icon: '🎮', tint: 'var(--cyan)'   },
            { label: 'Score total',     value: stats?.totalScore || 3660,                          icon: '⭐', tint: 'var(--gold)'   },
            { label: 'Badges gagnés',   value: badges.length || 1,                                 icon: '🏅', tint: 'var(--mint)'   },
            { label: 'Streak',          value: `${stats?.streak || 3}j`,                           icon: '🔥', tint: 'var(--rose)'   },
          ].map((k, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="card"
              style={{
                padding: '24px',
                borderRadius: 'var(--r-xl)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '3px',
                background: k.tint,
              }} />
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--r-md)',
                background: `color-mix(in srgb, ${k.tint} 14%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '14px',
              }}>
                {k.icon}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--text)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '4px',
              }}>{k.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{k.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '28px',
          padding: '6px',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--r-full)',
          border: '1px solid var(--border)',
          width: 'fit-content',
          maxWidth: '100%',
          overflowX: 'auto',
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-full)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                color: tab === t.id ? 'var(--violet)' : 'var(--text-secondary)',
                boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.25s var(--ease)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* TAB: overview */}
        {tab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
              {/* Heatmap */}
              <div className="card" style={{ padding: '28px', borderRadius: 'var(--r-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Activité des 12 derniers mois</h3>
                  <span className="tag tag-aurora">📈 Progression</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: '6px',
                }}>
                  {heatMap.map((intensity, i) => (
                    <div key={i} style={{
                      height: '24px',
                      borderRadius: '6px',
                      background: heatColor(intensity),
                      border: '1px solid var(--border)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title={intensity > 0 ? `${intensity} scénario(s)` : 'Aucun'} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', alignItems: 'center' }}>
                  <span>Moins</span>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      width: '14px', height: '14px',
                      borderRadius: '4px',
                      background: heatColor(i),
                      border: '1px solid var(--border)',
                    }} />
                  ))}
                  <span>Plus</span>
                </div>
              </div>

              {/* Recommended */}
              <div className="card-aurora" style={{ padding: '28px', borderRadius: 'var(--r-xl)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '18px' }}>✨ Recommandé pour vous</h3>
                {[
                  { name: 'Social Engineering Pro', tag: 'Faiblesse détectée', icon: '🎭', tint: 'var(--rose)' },
                  { name: 'GDPR Breach Sim',        tag: 'Conformité',         icon: '🛡️', tint: 'var(--cyan)' },
                ].map((s, i) => (
                  <div key={i}
                    onClick={() => navigate('/play')}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--r-md)',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      transition: 'all 0.25s var(--ease)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-hover)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px',
                        borderRadius: 'var(--r-md)',
                        background: `color-mix(in srgb, ${s.tint} 14%, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{s.name}</div>
                        <div style={{ fontSize: '12px', color: s.tint, fontWeight: 500 }}>{s.tag}</div>
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                    </div>
                  </div>
                ))}
                <button onClick={() => navigate('/play')} className="btn-primary" style={{ width: '100%', padding: '13px', marginTop: '10px' }}>
                  🎮 Jouer maintenant
                </button>
              </div>
            </div>

            {/* Assigned scenarios */}
            <div style={{ marginTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Mes scénarios assignés</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Scénarios de sensibilisation attribués par votre équipe</p>
                </div>
                <div className="tag tag-aurora">
                  <span className="status-dot violet" /> {assignedScenarios.length} scénario{assignedScenarios.length !== 1 ? 's' : ''}
                </div>
              </div>

              {assignedScenarios.length === 0 ? (
                <div className="card" style={{
                  padding: '56px 24px',
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderRadius: 'var(--r-xl)',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Aucun scénario assigné. Contactez votre administrateur.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {assignedScenarios.map(s => {
                    const diffColor = s.difficulty === 'beginner' ? 'var(--success)' : s.difficulty === 'advanced' ? 'var(--red)' : 'var(--warning)'
                    const statusColor = s.status === 'completed' ? 'var(--success)' : s.status === 'in_progress' ? 'var(--warning)' : 'var(--text-muted)'
                    return (
                      <motion.div
                        key={s.assignment_id}
                        whileHover={{ y: -4 }}
                        className="card"
                        style={{
                          padding: '24px',
                          borderRadius: 'var(--r-xl)',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0,
                          height: '3px',
                          background: `linear-gradient(90deg, ${diffColor}, transparent)`,
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="tag" style={{ background: `color-mix(in srgb, ${diffColor} 12%, transparent)`, borderColor: `color-mix(in srgb, ${diffColor} 35%, transparent)`, color: diffColor }}>
                            {s.difficulty === 'beginner' ? 'Débutant' : s.difficulty === 'advanced' ? 'Avancé' : 'Intermédiaire'}
                          </span>
                          <span style={{ fontSize: '12px', color: statusColor, fontWeight: 600 }}>
                            {s.status === 'completed' ? '✓ Terminé' : s.status === 'in_progress' ? '▶ En cours' : '○ En attente'}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.3 }}>{s.title_fr}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.category}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {s.duration && <span>⏱ {s.duration} min</span>}
                          {s.score > 0 && <span style={{ color: 'var(--success)' }}>⭐ {s.score}</span>}
                        </div>
                        <button
                          onClick={() => navigate(`/preview/${s.id}`)}
                          className="btn-primary"
                          style={{ padding: '11px', fontSize: '13px', marginTop: 'auto' }}
                        >
                          {s.status === 'completed' ? '↺ Rejouer' : '▶ Jouer'}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB: activité */}
        {tab === 'activité' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '0', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-muted)' }}>
                  {['Date', 'Scénario', 'Score', 'Résultat'].map(h => (
                    <th key={h} style={{
                      padding: '16px 24px',
                      textAlign: 'left',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockActivity.map((a, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px' }}>{a.date}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text)', fontSize: '14px', fontWeight: 500 }}>{a.scenario}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '80px', height: '6px', background: 'var(--bg-muted)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${a.score / 10}%`,
                            height: '100%',
                            background: a.passed ? 'var(--grad-ocean)' : 'var(--grad-cta)',
                            borderRadius: 'var(--r-full)',
                          }} />
                        </div>
                        <span style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 600 }}>{a.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={a.passed ? 'tag tag-success' : 'tag tag-danger'}>
                        {a.passed ? '✅ Réussi' : '❌ Échoué'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* TAB: badges */}
        {tab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}
          >
            {allBadges.map((b, idx) => {
              const earned = badges.some(ub => ub.id === b.id)
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={earned ? 'card-aurora' : 'card'}
                  style={{
                    padding: '28px',
                    borderRadius: 'var(--r-xl)',
                    textAlign: 'center',
                    opacity: earned ? 1 : 0.55,
                  }}
                >
                  <div style={{
                    fontSize: '56px',
                    marginBottom: '14px',
                    filter: earned ? 'none' : 'grayscale(100%)',
                  }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px' }}>{b.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5 }}>{b.desc}</div>
                  {earned && <div className="tag tag-success" style={{ marginTop: '12px' }}>✓ Obtenu</div>}
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* TAB: modules */}
        {tab === 'modules' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}
          >
            {mockModules.map((m, i) => (
              <div key={i} className="card" style={{ padding: '28px', borderRadius: 'var(--r-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{m.name}</h3>
                  {m.completed && <span className="tag tag-success">✓ Terminé</span>}
                </div>
                <div className="progress" style={{ marginBottom: '12px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${m.progress}%`,
                      background: m.completed ? 'var(--grad-ocean)' : 'var(--grad-aurora)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{m.progress}% complété</span>
                  {!m.completed && (
                    <button
                      onClick={() => navigate('/play')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--violet)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Continuer →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB: défis */}
        {tab === 'défis' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>🎯 Défis de la semaine</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Expire le dimanche 13 avril 2026</p>
              </div>
              <div className="tag tag-warning" style={{ fontSize: '13px' }}>
                {defis.filter(d => d.claimed).length}/{defis.length} défis complétés
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {defis.map(d => {
                const pct = Math.min(100, Math.round((d.done / d.target) * 100))
                const complete = d.done >= d.target
                return (
                  <div key={d.id} className="card" style={{
                    padding: '24px',
                    borderRadius: 'var(--r-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: d.claimed ? '1px solid var(--success)' : complete ? '1px solid var(--warning)' : '1px solid var(--border)',
                  }}>
                    {d.claimed && (
                      <div className="tag tag-success" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                        ✓ Réclamé
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: 'var(--r-md)',
                        background: 'var(--grad-aurora-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        flexShrink: 0,
                      }}>{d.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{d.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{d.desc}</div>
                      </div>
                    </div>
                    <div className="progress" style={{ marginBottom: '12px' }}>
                      <div className="progress-bar" style={{
                        width: `${pct}%`,
                        background: d.claimed ? 'var(--grad-ocean)' : complete ? 'linear-gradient(135deg, #f59e0b, #facc15)' : 'var(--grad-aurora)',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{d.done}/{d.target} · <strong style={{ color: 'var(--violet)' }}>+{d.points} pts</strong></span>
                      {complete && !d.claimed && (
                        <button
                          onClick={() => setDefis(prev => prev.map(x => x.id === d.id ? { ...x, claimed: true } : x))}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                          Réclamer
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* TAB: certificats */}
        {tab === 'certificats' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>🎓 Mes certificats</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Téléchargez et partagez vos certifications ROOMCA</p>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {earnedCertificates.map(cert => (
                <div key={cert.id} className="card-aurora" style={{
                  padding: '28px',
                  borderRadius: 'var(--r-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--grad-aurora)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-aurora)',
                    }}>🎓</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>{cert.title}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {cert.level} · Score : <strong style={{ color: 'var(--success)' }}>{cert.score}/100</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Émis le {cert.date} · {cert.issuer}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <span className="tag tag-success">✓ Validé</span>
                    <button onClick={() => downloadCertificate(cert, user?.name)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                      ↓ Télécharger
                    </button>
                  </div>
                </div>
              ))}
              <div className="card" style={{
                padding: '28px',
                borderRadius: 'var(--r-xl)',
                borderStyle: 'dashed',
                textAlign: 'center',
                background: 'var(--grad-aurora-soft)',
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Terminez encore <strong>3 modules</strong> pour débloquer le certificat <strong>"Cyber Guardian"</strong>
                </div>
                <button onClick={() => navigate('/play')} className="btn-primary" style={{ padding: '12px 24px', fontSize: '13px' }}>
                  Continuer les formations →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: classement */}
        {tab === 'classement' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '0', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>🏆 Classement {user?.company || 'ROOMCA Corp'}</h3>
              <span className="tag tag-warning">Votre rang : #3 / 47</span>
            </div>
            {[
              { rank: 1, name: 'Thomas M.',            dept: 'Engineering', score: 2450, badge: '🥇' },
              { rank: 2, name: 'Julie L.',             dept: 'Legal',       score: 2380, badge: '🥈' },
              { rank: 3, name: user?.name || 'Vous',   dept: 'Finance',    score: 2290, badge: '🥉', isMe: true },
              { rank: 4, name: 'Pierre M.',            dept: 'IT',          score: 2180, badge: ''   },
              { rank: 5, name: 'Marie D.',             dept: 'Finance',     score: 2050, badge: ''   },
            ].map(p => (
              <div key={p.rank} style={{
                padding: '18px 28px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                background: p.isMe ? 'var(--grad-aurora-soft)' : 'transparent',
                transition: 'background 0.2s',
              }}>
                <span style={{
                  fontSize: '22px',
                  width: '36px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                }}>{p.badge || `#${p.rank}`}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: p.isMe ? 700 : 500,
                    color: p.isMe ? 'var(--violet)' : 'var(--text)',
                    fontSize: '14px',
                  }}>
                    {p.name}{p.isMe && ' (vous)'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.dept}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
                  {p.score.toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>pts</span>
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
