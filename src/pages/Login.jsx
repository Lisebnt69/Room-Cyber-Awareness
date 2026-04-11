import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useAuth, ROLES } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import BrandLogo from '../components/BrandLogo'
import LangToggle from '../components/LangToggle'

const HINTS = [
  { label: 'Player',      email: 'player@roomca.com',     icon: '🎮', tint: 'var(--cyan)',   role: { fr: 'Escape game',      en: 'Escape game' } },
  { label: 'Admin',       email: 'admin@roomca.com',      icon: '🛡️', tint: 'var(--violet)', role: { fr: 'Dashboard RSSI',   en: 'CISO Dashboard' } },
  { label: 'Super Admin', email: 'superadmin@roomca.io',  icon: '⚡', tint: 'var(--rose)',   role: { fr: 'Console plateforme', en: 'Platform console' } },
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

  useEffect(() => { setError(null) }, [setError])

  const validateForm = () => {
    const e = {}
    if (!email) e.email = 'Email requis'
    else if (!email.includes('@')) e.email = 'Format invalide'
    if (!password) e.password = 'Mot de passe requis'
    else if (password.length < 2) e.password = 'Trop court'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return }
    setErrors({}); setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px',
    }}>
      {/* Aurora ambient background */}
      <div className="aurora-bg" />
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Lang toggle top right */}
      <div style={{ position: 'absolute', top: '24px', right: '28px', zIndex: 20 }}>
        <LangToggle />
      </div>

      {/* Back link top left */}
      <a href="/" style={{
        position: 'absolute',
        top: '28px',
        left: '32px',
        zIndex: 20,
        fontSize: '13px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-title)',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        ← {t('loginBack') || 'Retour'}
      </a>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {/* Logo header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
          >
            <BrandLogo height={44} />
            <div className="tag tag-aurora" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
              <span className="status-dot violet" /> CYBER AWARENESS PLATFORM
            </div>
          </motion.div>
        </div>

        {/* Main card */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="card-glass"
          style={{
            padding: '40px 36px',
            borderRadius: 'var(--r-2xl)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Aurora accent bar */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            background: 'var(--grad-aurora)',
          }} />

          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontFamily: 'var(--font-title)',
              fontSize: '26px',
              fontWeight: 700,
              marginBottom: '8px',
              letterSpacing: '-0.025em',
            }}>
              {t('loginTitle') || 'Bon retour parmi nous'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {t('loginSubtitle') || 'Connectez-vous pour reprendre votre entraînement'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                letterSpacing: '-0.005em',
              }}>
                {t('loginEmailLabel') || 'Email professionnel'}
              </label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: null })
                }}
                placeholder="vous@entreprise.com"
                aria-label="Email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <div style={{ fontSize: '12px', color: 'var(--red)', marginTop: '6px', fontWeight: 500 }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '26px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}>
                {t('loginPasswordLabel') || 'Mot de passe'}
              </label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
                placeholder="••••••••"
                aria-label="Password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <div style={{ fontSize: '12px', color: 'var(--red)', marginTop: '6px', fontWeight: 500 }}>
                  {errors.password}
                </div>
              )}
            </div>

            {error && (
              <div style={{
                background: 'var(--red-tint)',
                border: '1px solid rgba(239, 62, 71, 0.32)',
                padding: '12px 16px',
                marginBottom: '20px',
                borderRadius: 'var(--r-md)',
                fontSize: '13px',
                color: 'var(--red)',
                fontWeight: 500,
              }} role="alert">
                ⚠ {error}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '15px', fontSize: '15px' }}
            >
              {loading ? (
                <><span className="animate-spin" style={{ display: 'inline-block' }}>◌</span> {t('loginLoading') || 'Connexion...'}</>
              ) : (
                <>{t('loginSubmit') || 'Se connecter'} →</>
              )}
            </button>
          </form>
        </motion.div>

        {/* Demo accounts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            marginTop: '24px',
            padding: '24px',
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px',
          }}>
            <span style={{ fontSize: '16px' }}>✨</span>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}>
              {t('loginDemoLabel') || 'Comptes de démonstration'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {HINTS.map((h) => (
              <button
                key={h.label}
                type="button"
                onClick={() => { setEmail(h.email); setPassword('demo'); setError(null) }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.25s var(--ease)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--r-md)',
                  background: `color-mix(in srgb, ${h.tint} 14%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  {h.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '2px',
                  }}>
                    {h.label}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {h.email}
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: h.tint,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {h.role[lang]}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          Protégé par chiffrement bout-en-bout · RGPD compliant
        </div>
      </motion.div>
    </div>
  )
}
