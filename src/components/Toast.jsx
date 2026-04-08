export default function Toast({ message, type = 'success' }) {
  if (!message) return null

  const colors = {
    success: { bg: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', text: '#22c55e', icon: '✓' },
    error: { bg: 'rgba(235,40,40,0.1)', border: '1px solid var(--red)', text: 'var(--red)', icon: '✕' },
    info: { bg: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', text: '#3b82f6', icon: 'ℹ' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', text: '#f59e0b', icon: '⚠' },
  }

  const color = colors[type] || colors.success

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 300,
        background: color.bg,
        border: color.border,
        padding: '14px 20px',
        fontFamily: 'var(--mono)',
        fontSize: '12px',
        color: color.text,
        animation: 'fadeInUp 0.3s ease',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        maxWidth: '300px'
      }}
      role="alert"
      aria-live="polite"
    >
      <span>{color.icon}</span>
      {message}
    </div>
  )
}
