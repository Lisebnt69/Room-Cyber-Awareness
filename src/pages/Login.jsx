import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import Logo from '../components/Logo'

const HINTS = [
  { label: 'Player', email: 'player@acme.com', role: 'Escape game' },
  { label: 'Admin', email: 'admin@acme.com', role: 'Dashboard RSSI' },
  { label: 'Super Admin', email: 'superadmin@roomca.io', role: 'Console plateforme' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const { login, error, setError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { setError(null) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      if (result.role === ROLES.SUPER_ADMIN) navigate('/super-admin')
      else if (result.role === ROLES.ADMIN) navigate('/admin')
      else navigate('/play')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-black)', position: 'relative', overflow: 'hidden' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(235,40,40,0.05) 0%, transparent 70%)' }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Logo size="lg" />
          <div style={{ marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>PORTAIL D&apos;ACCÈS SÉCURISÉ</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '40px', position: 'relative', animation: shake ? 'glitch 0.4s linear' : 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--red)' }} />
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', marginBottom: '6px' }}>Connexion</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Entrez vos identifiants pour accéder à la plateforme</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>ADRESSE E-MAIL</label>
              <input className="input-dark" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@entreprise.com" required />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>MOT DE PASSE</label>
              <input className="input-dark" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && (
              <div style={{ background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', padding: '12px 16px', marginBottom: '20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)' }}>
                ⚠ {error}
              </div>
            )}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="animate-spin" style={{ display: 'inline-block' }}>◌</span> Authentification...</> : 'Accéder à la plateforme →'}
            </button>
          </form>
        </div>
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '14px' }}>COMPTES DÉMO (mot de passe : demo)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HINTS.map(h => (
              <button key={h.label} onClick={() => { setEmail(h.email); setPassword('demo'); setError(null) }} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '10px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(235,40,40,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '12px', color: 'var(--text-light)' }}>{h.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{h.email}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.role}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>← Retour à l&apos;accueil</a>
        </div>
      </div>
    </div>
  )
}
