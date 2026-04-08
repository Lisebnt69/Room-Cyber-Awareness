export default function Logo({ size = 'md', showTag = true }) {
  const sizes = {
    sm: { text: '18px', tag: '9px' },
    md: { text: '24px', tag: '10px' },
    lg: { text: '36px', tag: '12px' },
    xl: { text: '52px', tag: '14px' },
  }
  const s = sizes[size]
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
      <span style={{ fontFamily: 'var(--font-title)', fontSize: s.text, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-light)', lineHeight: 1 }}>
        ROOM<span style={{ color: 'var(--red)' }}>CA</span>
      </span>
      {showTag && (
        <span style={{ fontFamily: 'var(--mono)', fontSize: s.tag, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Cyber Awareness
        </span>
      )}
    </div>
  )
}
