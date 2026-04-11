// Shared premium header for standalone pages linked from the Admin sidebar.
// Respects the ROOMCA brand: red #eb2828 · grey scale · white · blue accent.
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import LangToggle from './LangToggle'

export default function PageHeader({ title, subtitle, backTo = '/admin', backLabel = 'RETOUR' }) {
  const navigate = useNavigate()
  const { theme } = useTheme() || { theme: 'dark' }
  const logoSrc = theme === 'light' ? '/assets/roomca-logo-light.png' : '/assets/roomca-logo-dark.png'

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: theme === 'light'
        ? 'rgba(253, 253, 253, 0.88)'
        : 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: theme === 'light' ? '1px solid #D9D9D9' : '1px solid #1a1a1a',
    }}>
      {/* Red accent line — brand signature */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #eb2828 20%, #eb2828 80%, transparent 100%)',
        opacity: 0.9,
      }} />

      <div style={{
        padding: '18px 44px',
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
        maxWidth: '1600px',
        margin: '0 auto',
      }}>
        {/* Logo + back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={logoSrc}
            alt="ROOMCA"
            style={{ height: '30px', width: 'auto', display: 'block', cursor: 'pointer' }}
            onClick={() => navigate(backTo)}
          />

          <div style={{
            width: '1px',
            height: '26px',
            background: theme === 'light' ? '#D9D9D9' : '#2a2a2a',
          }} />

          <button
            onClick={() => navigate(backTo)}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme === 'light' ? '#828080' : '#828080',
              padding: '4px 0',
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#eb2828' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#828080' }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>←</span>
            {backLabel}
          </button>
        </div>

        {/* Title */}
        {title && (
          <div style={{ flex: 1, minWidth: 0, paddingLeft: '8px' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: theme === 'light' ? '#2e2c2c' : '#fdfdfd',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{
                fontSize: '11px',
                color: '#828080',
                marginTop: '3px',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}>
                {subtitle}
              </div>
            )}
          </div>
        )}

        {!title && <div style={{ flex: 1 }} />}

        {/* Controls */}
        <div>
          <LangToggle />
        </div>
      </div>
    </div>
  )
}
