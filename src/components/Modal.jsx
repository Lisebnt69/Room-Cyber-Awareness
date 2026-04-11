import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, closeButton = true }) {
  const isCompact = typeof window !== 'undefined' ? window.innerWidth < 768 : false
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
          maxWidth: isCompact ? '96vw' : '600px',
          width: isCompact ? '96vw' : '90%',
          maxHeight: isCompact ? '92vh' : '80vh',
          overflow: 'auto',
          padding: isCompact ? '16px' : '32px',
          position: 'relative',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
        <div style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
