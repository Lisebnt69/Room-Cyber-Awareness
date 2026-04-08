import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      background: 'transparent', border: '1px solid var(--border-subtle)',
      borderRadius: '20px', padding: '6px 12px', color: 'var(--text-primary)',
      cursor: 'pointer', fontSize: '14px'
    }}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
