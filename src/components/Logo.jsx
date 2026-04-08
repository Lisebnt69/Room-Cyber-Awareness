// Fingerprint SVG recreated from the official ROOMCA brand identity
function FingerprintIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer left arc - bright red */}
      <path d="M15 85 C4 65, 4 45, 15 25" stroke="#eb2828" strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Outer right arc - bright red */}
      <path d="M85 85 C96 65, 96 45, 85 25" stroke="#eb2828" strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Second left arc - dark red */}
      <path d="M25 92 C12 70, 12 40, 25 18" stroke="#7a1010" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
      {/* Second right arc - dark red */}
      <path d="M75 92 C88 70, 88 40, 75 18" stroke="#7a1010" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
      {/* Third left arc - bright red */}
      <path d="M35 95 C23 74, 23 36, 35 15" stroke="#eb2828" strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Third right arc - bright red */}
      <path d="M65 95 C77 74, 77 36, 65 15" stroke="#eb2828" strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Fourth left arc - dark red */}
      <path d="M44 93 C34 74, 34 36, 44 17" stroke="#7a1010" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Fourth right arc - dark red */}
      <path d="M56 93 C66 74, 66 36, 56 17" stroke="#7a1010" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Center spine - bright red */}
      <path d="M50 15 L50 95" stroke="#eb2828" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Top arch connecting all */}
      <path d="M35 15 Q50 4, 65 15" stroke="#eb2828" strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Bottom arch */}
      <path d="M35 95 Q50 106, 65 95" stroke="#7a1010" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

const sizes = {
  sm: { icon: 22, text: '17px', sub: '8px', gap: 8 },
  md: { icon: 28, text: '22px', sub: '9px', gap: 10 },
  lg: { icon: 38, text: '30px', sub: '10px', gap: 12 },
  xl: { icon: 52, text: '40px', sub: '12px', gap: 14 },
}

export default function Logo({ size = 'md', showSub = false, style = {} }) {
  const s = sizes[size] || sizes.md

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap, ...style }}>
      <FingerprintIcon size={s.icon} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontSize: s.text,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: 'var(--text-light)',
          lineHeight: 1,
        }}>
          ROOMCA
        </span>
        {showSub && (
          <span style={{
            fontFamily: 'var(--font-title)',
            fontSize: s.sub,
            letterSpacing: '0.18em',
            color: 'var(--text-muted)',
            marginTop: '4px',
            textTransform: 'uppercase',
          }}>
            Cyber Awareness Game
          </span>
        )}
      </div>
    </div>
  )
}
