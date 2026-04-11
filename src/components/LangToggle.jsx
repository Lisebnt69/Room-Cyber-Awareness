import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'

// Named for historical reasons — this bar now also holds the theme toggle.
// Pass showTheme={false} to hide the theme toggle (used on the landing page).
export default function LangToggle({ style = {}, showTheme = true }) {
  const { lang, toggleLang } = useLang()
  const { theme, toggle: toggleTheme } = useTheme() || { theme: 'dark', toggle: () => {} }

  const btnBase = {
    display: 'flex', alignItems: 'center', gap: '4px',
    background: 'transparent',
    border: '1px solid var(--border-subtle)',
    padding: '6px 11px',
    cursor: 'pointer',
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    letterSpacing: '0.1em',
    color: 'var(--text-primary)',
    borderRadius: '3px',
    transition: 'all 0.2s',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
      {/* Theme toggle */}
      {showTheme && (
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          aria-label="Toggle theme"
          style={btnBase}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
        >
          <span style={{ fontSize: '13px', lineHeight: 1 }}>{theme === 'dark' ? '☾' : '☀'}</span>
          <span>{theme === 'dark' ? 'SOMBRE' : 'CLAIR'}</span>
        </button>
      )}

      {/* Lang toggle */}
      <button
        onClick={toggleLang}
        title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
        style={btnBase}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
      >
        <span style={{ color: lang === 'fr' ? 'var(--red)' : 'var(--text-muted)' }}>FR</span>
        <span style={{ color: 'var(--border)', margin: '0 3px' }}>|</span>
        <span style={{ color: lang === 'en' ? 'var(--red)' : 'var(--text-muted)' }}>EN</span>
      </button>
    </div>
  )
}
