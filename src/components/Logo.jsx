// Fingerprint SVG matching the official ROOMCA brand identity
// Concentric arcs forming a finger-tip pattern, bright/dark red alternating
function FingerprintIcon({ size = 28 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 60 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Core central ridge */}
      <path d="M30 62 C30 62, 30 38, 30 18 C30 12, 30 8, 30 6" stroke="#eb2828" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Ridge 1 - innermost */}
      <path d="M30 62 C22 60, 16 52, 16 42 C16 32, 22 24, 30 20 C38 24, 44 32, 44 42 C44 52, 38 60, 30 62" stroke="#c0201e" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      {/* Ridge 2 */}
      <path d="M30 65 C18 63, 10 53, 10 42 C10 31, 18 21, 28 17 C32 15, 34 15, 32 15" stroke="#eb2828" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <path d="M30 65 C42 63, 50 53, 50 42 C50 31, 42 21, 32 17" stroke="#eb2828" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      {/* Ridge 3 */}
      <path d="M30 67 C14 65, 4 54, 4 42 C4 30, 12 19, 24 14" stroke="#c0201e" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      <path d="M30 67 C46 65, 56 54, 56 42 C56 30, 48 19, 36 14" stroke="#c0201e" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      {/* Ridge 4 - outermost */}
      <path d="M20 10 C10 14, 2 22, 1 34 C0 46, 6 57, 16 63" stroke="#eb2828" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M40 10 C50 14, 58 22, 59 34 C60 46, 54 57, 44 63" stroke="#eb2828" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Top arch of fingerprint */}
      <path d="M24 14 C26 8, 34 8, 36 14" stroke="#eb2828" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <path d="M20 10 C22 3, 38 3, 40 10" stroke="#c0201e" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {/* Cut/break lines for realism */}
      <path d="M14 55 C12 53, 11 50, 12 47" stroke="#eb2828" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="2 3"/>
    </svg>
  )
}

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
      <FingerprintIcon size={s.icon} />
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
