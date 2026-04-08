import { useLang } from '../context/LangContext'

export default function LangToggle({ style = {} }) {
  const { lang, toggleLang } = useLang()

  return (
    <button
      onClick={toggleLang}
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
      style={{
        display: 'flex', alignItems: 'center', gap: '2px',
        background: 'transparent',
        border: '1px solid var(--border-subtle)',
        padding: '5px 10px',
        cursor: 'pointer',
        fontFamily: 'var(--mono)',
        fontSize: '11px',
        letterSpacing: '0.1em',
        transition: 'all 0.2s',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--text-light)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = '' }}
    >
      <span style={{ color: lang === 'fr' ? 'var(--red)' : 'var(--text-muted)' }}>FR</span>
      <span style={{ color: 'var(--border)', margin: '0 3px' }}>|</span>
      <span style={{ color: lang === 'en' ? 'var(--red)' : 'var(--text-muted)' }}>EN</span>
    </button>
  )
}
