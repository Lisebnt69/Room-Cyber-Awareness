import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useAuth, ROLES } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'

const HINTS = [
  { label: 'Player', email: 'player@roomca.com', role: { fr: 'Escape game', en: 'Escape game' } },
  { label: 'Admin', email: 'admin@roomca.com', role: { fr: 'Dashboard RSSI', en: 'CISO Dashboard' } },
  {
    label: 'Super Admin',
    email: 'superadmin@roomca.io',
    role: { fr: 'Console plateforme', en: 'Platform console' },
  },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [errors, setErrors] = useState({})

  const { login, error, setError } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  useEffect(() => {
    setError(null)
  }, [setError])

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

    await new Promise((r) => setTimeout(r, 800))

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-black)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(235,40,40,0.05) 0%, transparent 70%)',
        }}
      />

      <div style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 10 }}>
        <LangToggle />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '420px',
          padding: '24px',
        }}
      >
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
            <img src={Logo} alt="ROOMCA" style={{ height: '48px', width: 'auto' }} />
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                fontFamily: 'var(--mono)',
              }}
            >
              CYBER AWARENESS
            </span>
          </motion.div>

          <div
            style={{
              marginTop: '16px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
            }}
          >
            {t('loginPortal')}
          </div>
        </motion.div>

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '40px',
            position: 'relative',
            animation: shake ? 'glitch 0.4s linear' : 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'var(--red)',
            }}
          />

          <div style={{ marginBottom: '28px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '20px',
                marginBottom: '6px',
              }}
            >
              {t('loginTitle')}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--mono)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                {t('loginEmailLabel')}
              </label>

              <input
                className="input-dark"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: null })
                }}
                placeholder={t('loginEmailPlaceholder')}
                aria-label="Email address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />

              {errors.email && (
                <div
                  id="email-error"
                  style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}
                >
                  ⚠ {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--mono)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                {t('loginPasswordLabel')}
              </label>

              <input
                className="input-dark"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
                placeholder="••••••••"
                aria-label="Password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />

              {errors.password && (
                <div
                  id="password-error"
                  style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}
                >
                  ⚠ {errors.password}
                </div>
              )}
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(235,40,40,0.1)',
                  border: '1px solid rgba(235,40,40,0.3)',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  color: 'var(--red)',
                }}
                role="alert"
              >
                ⚠ {error}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              aria-busy={loading}
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span className="animate-spin" style={{ display: 'inline-block' }}>
                    ◌
                  </span>{' '}
                  {t('loginLoading')}
                </>
              ) : (
                t('loginSubmit')
              )}
            </button>
          </form>
        </div>

        <div
          style={{
            marginTop: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginBottom: '14px',
            }}
          >
            {t('loginDemoLabel')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HINTS.map((h) => (
              <button
                key={h.label}
                type="button"
                onClick={() => {
                  setEmail(h.email)
                  setPassword('demo')
                  setError(null)
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--red)'
                  e.currentTarget.style.background = 'rgba(235,40,40,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '12px',
                      color: 'var(--text-light)',
                    }}
                  >
                    {h.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {h.email}
                  </div>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {h.role[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {t('loginBack')}
          </a>
        </div>
      </div>
    </div>
  )
}