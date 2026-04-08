import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { db } from '../services/db'
import Logo from '/home/lise/Room-Cyber-Awareness/public/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import { visualScenarios } from '../data/visualScenarios'

const allBadges = [
  { id: 'first_blood', name: 'Premier Sang', icon: '🩸', desc: 'Terminer votre premier scénario' },
  { id: 'phishing_expert', name: 'Anti-Phishing', icon: '🎣', desc: 'Identifier 10 phishing sans erreur' },
  { id: 'streak_7', name: 'Semaine de feu', icon: '🔥', desc: '7 jours de connexion consécutifs' },
  { id: 'perfect_score', name: 'Perfection', icon: '💯', desc: 'Score parfait sur un scénario' },
  { id: 'compliance_pro', name: 'Compliance Pro', icon: '🛡️', desc: 'Réussir 3 scénarios conformité' },
  { id: 'speed_run', name: 'Speed Runner', icon: '⚡', desc: 'Finir un scénario en moins de 5min' },
  { id: 'social_guard', name: 'Social Guard', icon: '🕵️', desc: 'Détecter 5 social engineering' },
  { id: 'certified', name: 'Certifié ROOMCA', icon: '🎓', desc: 'Obtenir une certification officielle' }
]

const mockActivity = [
  { date: '2026-04-07', scenario: 'Inbox Zero', score: 850, passed: true },
  { date: '2026-04-06', scenario: 'Fausse Urgence', score: 920, passed: true },
  { date: '2026-04-04', scenario: 'Clone Phishing', score: 680, passed: true },
  { date: '2026-04-01', scenario: 'Ransomware Décision', score: 450, passed: false },
  { date: '2026-03-29', scenario: 'Credential Theft', score: 760, passed: true }
]

const mockModules = [
  { name: 'Phishing Fundamentals', progress: 100, completed: true },
  { name: 'Social Engineering', progress: 75, completed: false },
  { name: 'Malware Defense', progress: 60, completed: false },
  { name: 'GDPR Basics', progress: 100, completed: true },
  { name: 'Password Security', progress: 40, completed: false }
]

const weeklyDefis = [
  { id: 'd1', title: 'Détective phishing', desc: 'Identifier 3 emails suspects cette semaine', icon: '🔍', points: 150, target: 3, done: 2, expires: '2026-04-13', claimed: false },
  { id: 'd2', title: 'Streak de 5 jours', desc: 'Se connecter 5 jours consécutifs', icon: '🔥', points: 200, target: 5, done: 3, expires: '2026-04-13', claimed: false },
  { id: 'd3', title: 'Score parfait', desc: 'Obtenir 900+ sur n\'importe quel scénario', icon: '💯', points: 300, target: 1, done: 0, expires: '2026-04-13', claimed: false },
  { id: 'd4', title: 'Mission sociale', desc: 'Partager votre score avec un collègue', icon: '🤝', points: 50, target: 1, done: 1, expires: '2026-04-13', claimed: true },
]

const earnedCertificates = [
  { id: 'cert1', title: 'Phishing Fundamentals', date: '2026-03-15', score: 94, level: 'Intermédiaire', issuer: 'ROOMCA Certification Authority' },
  { id: 'cert2', title: 'GDPR Awareness', date: '2026-03-29', score: 88, level: 'Débutant', issuer: 'ROOMCA Certification Authority' },
]

function downloadCertificate(cert, userName) {
  const content = `
CERTIFICAT DE COMPLÉTION
========================
Module : ${cert.title}
Niveau : ${cert.level}
Titulaire : ${userName || 'Employé ROOMCA'}
Score obtenu : ${cert.score}/100
Date d'émission : ${cert.date}
Émis par : ${cert.issuer}

Ce certificat atteste que le titulaire a complété avec succès
le module de formation en cybersécurité ROOMCA.

ID de vérification : ROOMCA-${cert.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROOMCA — Cybersecurity Awareness Platform
https://roomca.io
  `.trim()
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Certificat_ROOMCA_${cert.title.replace(/\s+/g, '_')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function PlayerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])
  const [defis, setDefis] = useState(weeklyDefis)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, msg: '🔥 Défi "Streak 5 jours" — plus que 2 jours !', time: 'Il y a 2h', read: false },
    { id: 2, msg: '🏆 Nouveau classement disponible — vous êtes #3', time: 'Il y a 5h', read: false },
    { id: 3, msg: '📧 Nouveau scénario assigné : Social Engineering Pro', time: 'Hier', read: true },
  ])

  useEffect(() => {
    if (!user) return
    db.seedIfEmpty()
    const s = db.getUserStats(user.id)
    setStats(s)
    const b = db.getUserBadges(user.id)
    setBadges(b)
    // Award first badge
    if (db.getUserResults(user.id).length > 0) {
      db.awardBadge(user.id, allBadges[0])
      setBadges(db.getUserBadges(user.id))
    }
  }, [user])

  const handleLogout = () => { logout(); navigate('/login') }

  const globalScore = stats?.avgScore || 78
  const scoreColor = globalScore >= 80 ? '#22c55e' : globalScore >= 60 ? '#f59e0b' : '#eb2828'

  const heatMap = Array(7).fill(null).map((_, week) =>
    Array(7).fill(null).map((_, day) => {
      const hasActivity = Math.random() > 0.6
      const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0
      return intensity
    })
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-black)' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-black)' }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/play')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>▶ Jouer</button>
          <button onClick={() => navigate('/leaderboards')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>🏆 Classement</button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setNotifOpen(o => !o); setNotifications(n => n.map(x => ({ ...x, read: true }))) }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', position: 'relative', padding: '4px' }}>
              🔔
              {notifications.some(n => !n.read) && <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%' }} />}
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', right: 0, top: '36px', width: '300px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600 }}>Notifications</div>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                    <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{n.msg}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => navigate('/settings')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>⚙️</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Bonjour, <span style={{ color: '#eb2828' }}>{user?.name?.split(' ')[0] || 'Joueur'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user?.company || 'ACME Corp'} · Niveau Defender</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(235,40,40,0.15)', border: '2px solid #eb2828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#eb2828', fontWeight: 'bold' }}>
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </div>

        {/* Score hero */}
        <div style={{ background: 'linear-gradient(135deg, rgba(235,40,40,0.1), rgba(235,40,40,0.03))', border: '1px solid rgba(235,40,40,0.2)', padding: '32px', borderRadius: '16px', marginBottom: '28px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>VOTRE SCORE DE SÉCURITÉ</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '72px', fontWeight: 'bold', color: scoreColor, lineHeight: 1 }}>{globalScore}</span>
              <span style={{ fontSize: '24px', color: 'var(--text-muted)' }}>/100</span>
            </div>
            <div style={{ fontSize: '13px', color: scoreColor, marginTop: '8px' }}>
              {globalScore >= 80 ? '✅ Excellent - Vous êtes un asset pour la sécurité' : globalScore >= 60 ? '⚠️ Bien - Continuez à pratiquer' : '🔴 En progression - Entraînement recommandé'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: scoreColor }}>{globalScore}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Niveau</div>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Scénarios', value: stats?.scenariosCompleted || mockActivity.length, icon: '🎮', color: '#3b82f6' },
            { label: 'Score total', value: stats?.totalScore || 3660, icon: '⭐', color: '#f59e0b' },
            { label: 'Badges', value: badges.length || 1, icon: '🏅', color: '#22c55e' },
            { label: 'Streak', value: `${stats?.streak || 3}j`, icon: '🔥', color: '#eb2828' }
          ].map((k, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{k.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          {['overview', 'activité', 'badges', 'modules', 'défis', 'certificats', 'classement'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: '2px solid',
              borderColor: tab === t ? '#eb2828' : 'transparent',
              color: tab === t ? '#eb2828' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '13px', textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Activity heatmap */}
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>Activité des 7 dernières semaines</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {heatMap.flat().map((intensity, i) => (
                  <div key={i} style={{
                    height: '20px', borderRadius: '3px',
                    background: intensity === 0 ? 'var(--bg-black)' : `rgba(235,40,40,${intensity * 0.25})`,
                    border: '1px solid var(--border-subtle)'
                  }} title={intensity > 0 ? `${intensity} scénario(s)` : 'Aucun'} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)', alignItems: 'center' }}>
                <span>Moins</span>
                {[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: '12px', height: '12px', background: i === 0 ? 'var(--bg-black)' : `rgba(235,40,40,${i * 0.25})`, borderRadius: '2px' }} />)}
                <span>Plus</span>
              </div>
            </div>

            {/* Next recommended */}
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '16px' }}>Recommandé pour vous</h3>
              {[
                { name: 'Social Engineering Pro', tag: 'Faiblesse détectée', icon: '🎭', difficulty: 'hard' },
                { name: 'GDPR Breach Sim', tag: 'Conformité', icon: '🛡️', difficulty: 'medium' }
              ].map((s, i) => (
                <div key={i} onClick={() => navigate('/play')} style={{ padding: '14px', background: 'var(--bg-black)', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{s.icon}</span>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 'bold' }}>{s.name}</div>
                      <div style={{ fontSize: '10px', color: '#eb2828' }}>{s.tag}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '20px', color: 'var(--text-muted)' }}>›</span>
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/play')} className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>🎮 Jouer maintenant</button>
            </div>
          </div>
        )}

        {tab === 'overview' && (
          <div style={{ marginTop: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: '4px' }}>🔍 Scénarios Visuels — Cherche &amp; Trouve</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Analysez des captures d'écran réelles et identifiez les indices cachés</p>
              </div>
              <div className="tag"><span className="status-dot red" /> {visualScenarios.length} scénarios</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {visualScenarios.map(vs => {
                const diffColor = vs.difficulty.fr === 'DÉBUTANT' ? '#22c55e' : vs.difficulty.fr === 'INTERMÉDIAIRE' ? '#f59e0b' : '#eb2828'
                const sceneIcon = vs.scene === 'login' ? '🌐' : vs.scene === 'ceo_email' ? '📧' : vs.scene === 'desktop' ? '🖥️' : '📄'
                return (
                  <div key={vs.id} onClick={() => navigate(`/visual/${vs.id}`)}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(235,40,40,0.4)'; e.currentTarget.style.background = 'rgba(235,40,40,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-card)' }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{sceneIcon}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: diffColor, letterSpacing: '0.1em', marginBottom: '6px' }}>{vs.difficulty.fr}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-light)', marginBottom: '6px', lineHeight: 1.3 }}>{vs.title.fr}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>{vs.category.fr}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                      <span>🔍 {vs.hotspots.length} indices</span>
                      <span>⏱ {Math.round(vs.duration / 60)}min</span>
                      <span style={{ color: '#f59e0b' }}>🪙 {vs.coins}</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${diffColor}, transparent)` }} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'activité' && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ background: 'var(--bg-black)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>DATE</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>SCÉNARIO</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>SCORE</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11px' }}>RÉSULTAT</th>
                </tr>
              </thead>
              <tbody>
                {mockActivity.map((a, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '12px' }}>{a.date}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-primary)', fontSize: '13px' }}>{a.scenario}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '50px', height: '4px', background: 'var(--bg-black)', borderRadius: '2px' }}>
                          <div style={{ width: `${a.score / 10}%`, height: '100%', background: a.passed ? '#22c55e' : '#eb2828', borderRadius: '2px' }} />
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{a.score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '4px 10px', background: a.passed ? 'rgba(34,197,94,0.1)' : 'rgba(235,40,40,0.1)', color: a.passed ? '#22c55e' : '#eb2828', borderRadius: '12px', fontSize: '11px' }}>
                        {a.passed ? '✅ Réussi' : '❌ Échoué'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {allBadges.map(b => {
              const earned = badges.some(ub => ub.id === b.id)
              return (
                <div key={b.id} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid', borderColor: earned ? 'rgba(235,40,40,0.4)' : 'var(--border-subtle)', opacity: earned ? 1 : 0.45 }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px', filter: earned ? 'none' : 'grayscale(100%)' }}>{b.icon}</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>{b.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{b.desc}</div>
                  {earned && <div style={{ marginTop: '8px', fontSize: '10px', color: '#22c55e' }}>✅ Obtenu</div>}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'modules' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {mockModules.map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{m.name}</h3>
                  {m.completed && <span style={{ color: '#22c55e', fontSize: '18px' }}>✅</span>}
                </div>
                <div style={{ height: '8px', background: 'var(--bg-black)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: `${m.progress}%`, background: m.completed ? '#22c55e' : '#eb2828', borderRadius: '4px', transition: 'width 1s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{m.progress}% complété</span>
                  {!m.completed && <button onClick={() => navigate('/play')} style={{ background: 'transparent', border: 'none', color: '#eb2828', cursor: 'pointer', fontSize: '11px' }}>Continuer →</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'défis' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '4px' }}>Défis de la semaine</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Expire le dimanche 13 avril 2026</p>
              </div>
              <div style={{ padding: '8px 16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', fontSize: '12px', color: '#f59e0b' }}>
                {defis.filter(d => d.claimed).length}/{defis.length} défis complétés
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {defis.map(d => {
                const pct = Math.min(100, Math.round((d.done / d.target) * 100))
                const complete = d.done >= d.target
                return (
                  <div key={d.id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '20px', border: `1px solid ${d.claimed ? 'rgba(34,197,94,0.3)' : complete ? 'rgba(245,158,11,0.3)' : 'var(--border-subtle)'}`, position: 'relative', overflow: 'hidden' }}>
                    {d.claimed && <div style={{ position: 'absolute', top: 0, right: 0, background: '#22c55e', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '0 0 0 8px' }}>RÉCLAMÉ</div>}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '32px' }}>{d.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{d.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.desc}</div>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-black)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: d.claimed ? '#22c55e' : complete ? '#f59e0b' : 'var(--red)', borderRadius: '3px', transition: 'width 0.8s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.done}/{d.target} · {d.points} pts</span>
                      {complete && !d.claimed && (
                        <button onClick={() => setDefis(prev => prev.map(x => x.id === d.id ? { ...x, claimed: true } : x))} style={{ padding: '6px 14px', background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                          Réclamer +{d.points} pts
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === 'certificats' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', marginBottom: '4px' }}>Mes certificats</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Téléchargez et partagez vos certifications ROOMCA</p>
            </div>
            {earnedCertificates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
                <div>Terminez des modules pour obtenir des certificats</div>
                <button onClick={() => navigate('/play')} className="btn-primary" style={{ marginTop: '16px' }}>Commencer un scénario</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {earnedCertificates.map(cert => (
                  <div key={cert.id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(235,40,40,0.1)', border: '2px solid rgba(235,40,40,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🎓</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{cert.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{cert.level} · Score : {cert.score}/100</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Émis le {cert.date} par {cert.issuer}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                      <div style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px', fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>
                        ✓ Validé
                      </div>
                      <button onClick={() => downloadCertificate(cert, user?.name)} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                      >
                        ↓ Télécharger
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '20px', background: 'rgba(235,40,40,0.04)', border: '1px dashed rgba(235,40,40,0.2)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                    Terminez encore 3 modules pour débloquer le certificat "Cyber Guardian"
                  </div>
                  <button onClick={() => navigate('/play')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                    Continuer les formations →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'classement' && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>Classement {user?.company || 'ACME Corp'}</h3>
              <span style={{ color: '#f59e0b', fontSize: '13px' }}>Votre rang : #3 / 47</span>
            </div>
            {[
              { rank: 1, name: 'Thomas M.', dept: 'Engineering', score: 2450, badge: '🥇' },
              { rank: 2, name: 'Julie L.', dept: 'Legal', score: 2380, badge: '🥈' },
              { rank: 3, name: user?.name || 'Vous', dept: 'Finance', score: 2290, badge: '🥉', isMe: true },
              { rank: 4, name: 'Pierre M.', dept: 'IT', score: 2180, badge: '' },
              { rank: 5, name: 'Marie D.', dept: 'Finance', score: 2050, badge: '' }
            ].map(p => (
              <div key={p.rank} style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px', background: p.isMe ? 'rgba(235,40,40,0.05)' : 'transparent' }}>
                <span style={{ fontSize: '20px', width: '32px', textAlign: 'center' }}>{p.badge || `#${p.rank}`}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: p.isMe ? '#eb2828' : 'var(--text-primary)', fontWeight: p.isMe ? 'bold' : 'normal' }}>{p.name}{p.isMe && ' (vous)'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.dept}</div>
                </div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{p.score.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
