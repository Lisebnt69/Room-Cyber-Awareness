import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { db } from '../services/db'
import Logo from '../components/Logo'
import LangToggle from '../components/LangToggle'

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

export default function PlayerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])

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
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LangToggle />
          <button onClick={() => navigate('/play')} className="btn-primary" style={{ padding: '8px 20px', fontSize: '12px' }}>▶ Jouer</button>
          <button onClick={() => navigate('/leaderboards')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>🏆 Classement</button>
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
          {['overview', 'activité', 'badges', 'modules', 'classement'].map(t => (
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
