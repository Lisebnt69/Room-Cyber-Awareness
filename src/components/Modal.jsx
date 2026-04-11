import { useEffect } from 'react'

const MODAL_SIZES = {
  sm: '480px',
  md: '600px',
  lg: '760px',
  xl: '920px',
}

export default function Modal({ isOpen, onClose, title, children, closeButton = true, size = 'md' }) {
  const isCompact = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const desktopMaxWidth = MODAL_SIZES[size] || MODAL_SIZES.md
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          maxWidth: isCompact ? '96vw' : desktopMaxWidth,
          width: isCompact ? '96vw' : '92%',
          maxHeight: isCompact ? '92vh' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isCompact ? '16px' : '22px 32px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <h2 id="modal-title" style={{ fontFamily: 'var(--font-title)', fontSize: '20px', margin: 0 }}>{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-light)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              ✕
            </button>
          )}
        </div>
        <div style={{ color: 'var(--text-secondary)', padding: isCompact ? '16px' : '24px 32px 28px', overflow: 'auto', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
