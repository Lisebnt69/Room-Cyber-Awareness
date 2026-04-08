const sizes = {
  sm: { icon: 26, text: '17px', sub: '8px', gap: 8 },
  md: { icon: 32, text: '22px', sub: '9px', gap: 10 },
  lg: { icon: 44, text: '30px', sub: '10px', gap: 12 },
  xl: { icon: 60, text: '40px', sub: '12px', gap: 14 },
}

export default function Logo({ size = 'md', showSub = false, style = {} }) {
  const s = sizes[size] || sizes.md

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap, ...style }}>
      <img
        src="/roomca-logo.svg"
        alt="ROOMCA"
        width={s.icon}
        height={Math.round(s.icon * 1.13)}
        style={{ display: 'block', flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontSize: s.text,
          fontWeight: 700,
          letterSpacing: '0.10em',
          color: 'var(--text-light)',
          lineHeight: 1,
        }}>
          ROOMCA
        </span>
        {showSub && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: s.sub,
            letterSpacing: '0.16em',
            color: 'var(--text-muted)',
            marginTop: '5px',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>
            Cyber Awareness
          </span>
        )}
      </div>
    </div>
  )
}
