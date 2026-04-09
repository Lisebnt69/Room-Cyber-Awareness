import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'

const HINTS = [
  { label: 'Player', email: 'player@acme.com', role: { fr: 'Escape game', en: 'Escape game' } },
  { label: 'Admin', email: 'admin@acme.com', role: { fr: 'Dashboard RSSI', en: 'CISO Dashboard' } },
  { label: 'Super Admin', email: 'superadmin@roomca.io', role: { fr: 'Console plateforme', en: 'Platform console' } },
]

// Floating particles
function Particles() {
  const particles = [
    { x: '12%', y: '20%', size: 3, dur: '5s', delay: '0s', color: 'rgba(0,212,255,0.5)' },
    { x: '88%', y: '15%', size: 2, dur: '6s', delay: '1s', color: 'rgba(0,212,255,0.3)' },
    { x: '72%', y: '70%', size: 4, dur: '7s', delay: '0.5s', color: 'rgba(235,40,40,0.4)' },
    { x: '25%', y: '75%', size: 2, dur: '4s', delay: '2s', color: 'rgba(0,212,255,0.4)' },
    { x: '90%', y: '55%', size: 3, dur: '5.5s', delay: '1.5s', color: 'rgba(235,40,40,0.3)' },
    { x: '5%',  y: '50%', size: 2, dur: '6.5s', delay: '0.8s', color: 'rgba(0,212,255,0.35)' },
    { x: '50%', y: '8%',  size: 3, dur: '4.5s', delay: '3s', color: 'rgba(235,40,40,0.45)' },
    { x: '35%', y: '90%', size: 2, dur: '7s', delay: '0.3s', color: 'rgba(0,212,255,0.25)' },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <div key={i} className="particle" style={{
          left: p.x, top: p.y,
          width: p.size, height: p.size,
          background: p.color,
          '--dur': p.dur, '--delay': p.delay,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
        }} />
      ))}
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [errors, setErrors] = useState({})
  const { login, error, setError } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  useEffect(() => { setError(null) }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email required'
    else if (!email.includes('@')) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password required'
    else if (password.length < 2) newErrors.password = 'Password too short'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      if (result.role === ROLES.SUPER_ADMIN) navigate('/super-admin')
      else if (result.role === ROLES.ADMIN) navigate('/admin')
      else navigate('/dashboard')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-black)', position: 'relative', overflow: 'hidden' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(235,40,40,0.05) 0%, transparent 70%)' }} />
      <Particles />
      <motion.div
        style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 10 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <LangToggle />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px', padding: '24px' }}>
<<<<<<< HEAD
        {/* Logo entrance */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '40px' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
=======
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
>>>>>>> 73e59b1 (FIX)
            <img src={Logo} alt="ROOMCA" style={{ height: '48px', width: 'auto' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.15em', fontFamily: 'var(--mono)' }}>CYBER AWARENESS</span>
          </motion.div>
          <div style={{ marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            {t('loginPortal')}
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '40px', position: 'relative' }}
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--red)' }} />
            {/* Animated corner accents */}
            <div style={{ position: 'absolute', top: '2px', left: 0, width: '40px', height: '2px', background: 'linear-gradient(90deg, rgba(0,212,255,0.8), transparent)' }} />
            <div style={{ position: 'absolute', top: '2px', right: 0, width: '40px', height: '2px', background: 'linear-gradient(270deg, rgba(0,212,255,0.5), transparent)' }} />

            <motion.div
              style={{ marginBottom: '28px' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', marginBottom: '6px' }}>{t('loginTitle')}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('loginSubtitle')}</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div
                style={{ marginBottom: '20px' }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('loginEmailLabel')}</label>
                <input
                  className="input-dark"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({...errors, email: null}) }}
                  placeholder={t('loginEmailPlaceholder')}
                  aria-label="Email address"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      id="email-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px', overflow: 'hidden' }}
                    >⚠ {errors.email}</motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                style={{ marginBottom: '28px' }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42, duration: 0.4 }}
              >
                <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('loginPasswordLabel')}</label>
                <input
                  className="input-dark"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors({...errors, password: null}) }}
                  placeholder="••••••••"
                  aria-label="Password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      id="password-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px', overflow: 'hidden' }}
                    >⚠ {errors.password}</motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', padding: '12px 16px', marginBottom: '20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--red)' }}
                    role="alert"
                  >⚠ {error}</motion.div>
                )}
              </AnimatePresence>

              <motion.button
                className="btn-primary"
                type="submit"
                disabled={loading}
                aria-busy={loading}
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(0,212,255,0.35)' }}
                whileTap={{ scale: 0.97 }}
              >
                {loading
                  ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>◌</motion.span> {t('loginLoading')}</>
                  : t('loginSubmit')
                }
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Demo hints */}
        <motion.div
          style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '14px' }}>{t('loginDemoLabel')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HINTS.map((h, i) => (
              <motion.button
                key={h.label}
                onClick={() => { setEmail(h.email); setPassword('demo'); setError(null) }}
                style={{ background: 'transparent', border: '1px solid var(--border-subtle)', padding: '10px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.35 }}
                whileHover={{ borderColor: 'var(--cyan)', background: 'rgba(0,212,255,0.04)', x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '12px', color: 'var(--text-light)' }}>{h.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{h.email}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.role[lang]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ textAlign: 'center', marginTop: '24px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <a href="/" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('loginBack')}</a>
        </motion.div>
      </div>
    </div>
  )
}
