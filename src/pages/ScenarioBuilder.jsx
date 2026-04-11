import { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import ThemeToggle from '../components/ThemeToggle'

// ─── Crossword layout helper — places words so they intersect where possible ──

function buildCrosswordPreview(rawWords) {
  const words = (rawWords || []).filter(w => w.word && w.word.length > 0).map(w => ({ ...w, word: w.word.toUpperCase().replace(/\s+/g, '') }))
  if (words.length === 0) return { cells: {}, placements: [], width: 0, height: 0 }

  const cells = {}
  const placements = []

  const setCell = (x, y, letter, wordIdx, letterIdx) => {
    const key = `${x},${y}`
    if (!cells[key]) cells[key] = { letter, words: [] }
    cells[key].words.push({ wordIdx, letterIdx })
  }

  // Place first word horizontally
  const first = words[0].word
  for (let i = 0; i < first.length; i++) setCell(i, 0, first[i], 0, i)
  placements.push({ wordIdx: 0, dir: 'h', x: 0, y: 0, length: first.length })

  const neighborsFree = (x, y, dir) => {
    // Check that cells perpendicular to the word aren't occupied at (x,y)
    if (dir === 'h') {
      return !cells[`${x},${y - 1}`] && !cells[`${x},${y + 1}`]
    }
    return !cells[`${x - 1},${y}`] && !cells[`${x + 1},${y}`]
  }

  const tryPlace = (w, wi) => {
    const word = w.word
    for (let li = 0; li < word.length; li++) {
      const ch = word[li]
      for (const [key, cell] of Object.entries(cells)) {
        if (cell.letter !== ch) continue
        const [cx, cy] = key.split(',').map(Number)
        const existingDirs = cell.words.map(ww => placements.find(p => p.wordIdx === ww.wordIdx)?.dir)
        const dir = existingDirs.includes('h') ? 'v' : 'h'
        const x0 = dir === 'h' ? cx - li : cx
        const y0 = dir === 'v' ? cy - li : cy

        // Validate placement
        let ok = true
        for (let k = 0; k < word.length; k++) {
          const nx = dir === 'h' ? x0 + k : x0
          const ny = dir === 'v' ? y0 + k : y0
          const existing = cells[`${nx},${ny}`]
          if (existing) {
            if (existing.letter !== word[k]) { ok = false; break }
            // Cell reused — must already be in the same dir (a crossing)
          } else {
            // Empty cell — check perpendicular neighbors are free
            if (!neighborsFree(nx, ny, dir)) { ok = false; break }
          }
        }
        // Check cell just before start and just after end are empty
        if (ok) {
          const bx = dir === 'h' ? x0 - 1 : x0
          const by = dir === 'v' ? y0 - 1 : y0
          const ax = dir === 'h' ? x0 + word.length : x0
          const ay = dir === 'v' ? y0 + word.length : y0
          if (cells[`${bx},${by}`] || cells[`${ax},${ay}`]) ok = false
        }
        if (ok) {
          for (let k = 0; k < word.length; k++) {
            const nx = dir === 'h' ? x0 + k : x0
            const ny = dir === 'v' ? y0 + k : y0
            setCell(nx, ny, word[k], wi, k)
          }
          placements.push({ wordIdx: wi, dir, x: x0, y: y0, length: word.length })
          return true
        }
      }
    }
    return false
  }

  for (let wi = 1; wi < words.length; wi++) {
    if (!tryPlace(words[wi], wi)) {
      // Fallback: place horizontally below everything
      const ys = Object.keys(cells).map(k => Number(k.split(',')[1]))
      const maxY = ys.length ? Math.max(...ys) : 0
      const y = maxY + 2
      const word = words[wi].word
      for (let k = 0; k < word.length; k++) setCell(k, y, word[k], wi, k)
      placements.push({ wordIdx: wi, dir: 'h', x: 0, y, length: word.length })
    }
  }

  // Normalize to 0,0
  const keys = Object.keys(cells).map(k => k.split(',').map(Number))
  const minX = Math.min(...keys.map(k => k[0]))
  const minY = Math.min(...keys.map(k => k[1]))
  const maxX = Math.max(...keys.map(k => k[0]))
  const maxY = Math.max(...keys.map(k => k[1]))

  const shiftedCells = {}
  for (const [key, cell] of Object.entries(cells)) {
    const [x, y] = key.split(',').map(Number)
    shiftedCells[`${x - minX},${y - minY}`] = { ...cell }
  }
  const shiftedPlacements = placements.map(p => ({ ...p, x: p.x - minX, y: p.y - minY }))

  // Number the starting cells in placement order
  shiftedPlacements.forEach((p, i) => {
    const k = `${p.x},${p.y}`
    if (shiftedCells[k] && !shiftedCells[k].number) {
      shiftedCells[k].number = i + 1
    }
  })

  return {
    cells: shiftedCells,
    placements: shiftedPlacements,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: 'email',    icon: '📧', label: 'Faux Email',    desc: 'Simuler un email de phishing' },
  { type: 'photo',    icon: '🖼️', label: 'Photo + Zones', desc: 'Image avec zones cliquables' },
  { type: 'video',    icon: '🎬', label: 'Vidéo',         desc: 'Vidéo explicative ou piège' },
  { type: 'quiz',     icon: '❓', label: 'Quiz',           desc: 'QCM avec réponses correctes' },
  { type: 'puzzle',   icon: '🧩', label: 'Mini Puzzle',   desc: 'Mémory, mots croisés, tri' },
  { type: 'text',     icon: '📝', label: 'Texte',          desc: 'Contenu informatif libre' },
  { type: 'decision', icon: '🔀', label: 'Décision',      desc: 'Arbre de décision ramifié' },
]

const TYPE_COLORS = {
  email:    '#3b82f6',
  photo:    '#8b5cf6',
  video:    '#ec4899',
  quiz:     '#f59e0b',
  puzzle:   '#10b981',
  text:     '#6b7280',
  decision: 'var(--red)',
}

// ─── MAKE BLOCK ────────────────────────────────────────────────────────────────

function makeBlock(type) {
  const id = Date.now() + Math.random()
  switch (type) {
    case 'email':
      return {
        id, type, audioUrl: '',
        senderName: 'PayPal Security',
        from: 'noreply@paypal-secure.com',
        to: '{{employee}}',
        subject: 'Action requise',
        body: 'Votre compte a été suspendu. Cliquez pour réactiver.',
        link: { text: 'Réactiver', hover: 'https://paypal.com', real: 'https://paypal-fake.ru' },
      }
    case 'photo':
      return { id, type, audioUrl: '', src: '', alt: 'Image', zones: [] }
    case 'video':
      return { id, type, audioUrl: '', url: '', caption: '' }
    case 'quiz':
      return {
        id, type, audioUrl: '',
        question: 'Est-ce normal ?',
        options: [{ text: 'Oui', correct: false }, { text: 'Non', correct: true }],
        explanation: '',
      }
    case 'puzzle':
      return {
        id, type, audioUrl: '',
        puzzleType: 'reorder',
        instruction: 'Ordre correct',
        items: ['Vérifier', 'Signaler', 'Supprimer'],
        pairs: [{ a: 'Terme 1', b: 'Définition 1' }],
        words: [{ word: 'PHISHING', clue: "Tentative de vol d'identité par email" }],
      }
    case 'text':
      return { id, type, audioUrl: '', heading: '', content: '' }
    case 'decision':
      return {
        id, type, audioUrl: '',
        question: 'Que faites-vous ?',
        choices: [
          { text: 'Je clique', correct: false, feedback: '❌ Mauvais choix' },
          { text: 'Je signale', correct: true, feedback: '✅ Bonne réaction' },
        ],
      }
    default:
      return { id, type, audioUrl: '' }
  }
}

// ─── BLOCK CARD (canvas centre) ───────────────────────────────────────────────

function BlockCard({ block, index, selected, total, onClick, onMoveUp, onMoveDown, onDelete, onDuplicate }) {
  const [hovered, setHovered] = useState(false)
  const color = TYPE_COLORS[block.type] || 'var(--text-muted)'
  const bt = BLOCK_TYPES.find(b => b.type === block.type)

  const renderPreview = () => {
    switch (block.type) {
      case 'email':
        return (
          <div style={{ fontSize: '11px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '2px', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', minWidth: '32px' }}>De :</span>
              <span style={{ color: 'var(--text-secondary)' }}>{block.senderName || block.from}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#ffffff20', marginLeft: '4px' }}>&lt;{block.from}&gt;</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', minWidth: '32px' }}>Objet :</span>
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>{block.subject}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '4px 6px', background: 'var(--bg-muted)', borderRadius: '3px' }}>
              {block.body}
            </div>
            {block.link?.text && (
              <div style={{ marginTop: '4px', fontSize: '10px', color: '#60a5fa', textDecoration: 'underline' }}>🔗 {block.link.text}</div>
            )}
          </div>
        )
      case 'photo':
        return block.src ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <img src={block.src} style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '4px', opacity: 0.85 }} alt="" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{block.alt}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{(block.zones || []).length} zone(s) définie(s)</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px', border: '1px dashed #ffffff15', borderRadius: '4px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
            Aucune image — cliquez pour configurer
          </div>
        )
      case 'video':
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '30px', background: '#ec489910', border: '1px solid #ec489930', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>▶</div>
            <span style={{ fontSize: '11px', color: block.url ? 'var(--text-secondary)' : 'var(--text-muted)', fontStyle: block.url ? 'normal' : 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {block.url ? block.url.replace(/^https?:\/\//, '') : "Pas d'URL — cliquez pour configurer"}
            </span>
          </div>
        )
      case 'quiz':
        return (
          <div>
            <div style={{ fontSize: '12px', marginBottom: '6px', fontStyle: block.question ? 'normal' : 'italic', color: block.question ? 'var(--text)' : 'var(--text-muted)' }}>
              {block.question || 'Aucune question'}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(block.options || []).map((o, i) => (
                <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: o.correct ? 'rgba(34,197,94,0.12)' : 'var(--bg-muted)', border: `1px solid ${o.correct ? '#22c55e40' : '#ffffff15'}`, color: o.correct ? '#22c55e' : 'var(--text-muted)' }}>
                  {o.correct ? '✓ ' : ''}{o.text}
                </span>
              ))}
            </div>
          </div>
        )
      case 'puzzle': {
        const pIcons = { reorder: '🔀', memory: '🔗', crossword: '📐' }
        const pLabels = { reorder: 'Réordonner', memory: 'Relier les mots', crossword: 'Mots croisés' }
        const pCount = block.puzzleType === 'memory'
          ? `${(block.pairs || []).length} paire(s)`
          : block.puzzleType === 'crossword'
            ? `${(block.words || []).length} mot(s)`
            : `${(block.items || []).length} élément(s)`
        return (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '3px 10px', borderRadius: '10px', marginBottom: '6px' }}>
              {pIcons[block.puzzleType]} {pLabels[block.puzzleType]}
              <span style={{ opacity: 0.6 }}>· {pCount}</span>
            </div>
            {block.instruction && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{block.instruction}</div>
            )}
          </div>
        )
      }
      case 'text':
        return (
          <div>
            {block.heading && <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>{block.heading}</div>}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {block.content || <em>Aucun contenu</em>}
            </div>
          </div>
        )
      case 'decision':
        return (
          <div>
            <div style={{ fontSize: '12px', color: block.question ? 'var(--text)' : 'var(--text-muted)', fontStyle: block.question ? 'normal' : 'italic', marginBottom: '6px' }}>
              {block.question || 'Aucune question'}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(block.choices || []).map((c, i) => (
                <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: c.correct ? 'rgba(34,197,94,0.12)' : 'var(--violet-tint)', border: `1px solid ${c.correct ? '#22c55e40' : 'rgba(235,40,40,0.25)'}`, color: c.correct ? '#22c55e' : 'var(--red)80' }}>
                  {c.correct ? '✓ ' : ''}{c.text}
                </span>
              ))}
            </div>
          </div>
        )
      default: return null
    }
  }

  const iconBtnStyle = (disabled = false) => ({
    background: 'transparent',
    border: '1px solid var(--border)',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-muted)',
    width: '26px',
    height: '26px',
    cursor: disabled ? 'default' : 'pointer',
    borderRadius: 'var(--r-xs)',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s var(--ease-quick)',
  })

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: `1.5px solid ${selected ? 'transparent' : hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)',
        padding: '16px 16px 16px 20px',
        cursor: 'pointer',
        transition: 'all 0.25s var(--ease)',
        boxShadow: selected
          ? `0 0 0 2px ${color}, 0 12px 32px ${color}22, 0 4px 12px ${color}18`
          : hovered ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: selected ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden',
      }}
    >
      {/* Aurora accent strip on the left */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '4px',
        background: selected
          ? color
          : `linear-gradient(180deg, ${color}, ${color}40)`,
        opacity: selected ? 1 : hovered ? 0.7 : 0.4,
        transition: 'opacity 0.25s var(--ease)',
      }} />

      {/* Soft aurora glow when selected */}
      {selected && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 0% 50%, ${color}10, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', position: 'relative' }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: 'var(--r-full)',
          background: `color-mix(in srgb, ${color} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontFamily: 'var(--font-title)',
          color,
          flexShrink: 0,
          fontWeight: 700,
        }}>
          {index + 1}
        </div>
        <span style={{ fontSize: '17px', lineHeight: 1 }}>{bt?.icon}</span>
        <span style={{
          fontSize: '11px',
          fontFamily: 'var(--font-title)',
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          flex: 1,
          fontWeight: 700,
        }}>
          {bt?.label}
        </span>
        {block.audioUrl && <span title="Audio de fond actif" style={{ fontSize: '12px' }}>🎵</span>}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            opacity: hovered || selected ? 1 : 0,
            transition: 'opacity 0.2s var(--ease-quick)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button type="button" onClick={onDuplicate} title="Dupliquer" style={iconBtnStyle()}>⧉</button>
          <button type="button" onClick={onMoveUp} disabled={index === 0} title="Monter" style={iconBtnStyle(index === 0)}>↑</button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Descendre" style={iconBtnStyle(index === total - 1)}>↓</button>
          <button
            type="button"
            onClick={onDelete}
            title="Supprimer"
            style={{
              ...iconBtnStyle(),
              border: '1px solid rgba(239, 62, 71, 0.30)',
              color: 'var(--red)',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div style={{ paddingLeft: '36px', position: 'relative' }}>
        {renderPreview()}
      </div>

      {/* Connector line to next block */}
      {index < total - 1 && (
        <div style={{
          position: 'absolute',
          bottom: '-18px',
          left: '32px',
          width: '2px',
          height: '18px',
          background: `linear-gradient(to bottom, ${color}50, transparent)`,
          borderRadius: 'var(--r-full)',
          zIndex: 1,
        }} />
      )}
    </div>
  )
}

// ─── SHARED STYLES ─────────────────────────────────────────────────────────────

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--mono)',
  fontSize: '11px',
  color: 'var(--text-secondary)',
  letterSpacing: '0.08em',
  marginBottom: '8px',
  fontWeight: 500,
}

const inputBase = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--bg-input)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: '14px',
  borderRadius: '6px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const metaModalLabelStyle = {
  display: 'block',
  fontFamily: 'var(--mono)',
  fontSize: '11px',
  color: 'var(--text-secondary)',
  letterSpacing: '0.08em',
  marginBottom: '8px',
}

const metaModalSelectStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(4, 15, 32, 0.70)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)',
  color: 'var(--text)',
  fontSize: '14px',
  boxSizing: 'border-box',
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputBase}
      />
    </div>
  )
}

// ─── AUDIO PANEL — shared (scenario ambient OR per-block SFX) ─────────────────

function AudioPanel({
  label = 'AUDIO',
  url,
  onUrlChange,
  volume,
  onVolumeChange,
  accept = 'audio/*',
  maxSizeMB = 8,
  help,
  accent = 'var(--red)',
}) {
  const fileRef = useRef(null)
  const [err, setErr] = useState(null)
  const [uploading, setUploading] = useState(false)
  const previewRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const isLocal = url && url.startsWith('data:')

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(null)
    if (!file.type.startsWith('audio/')) { setErr('Le fichier doit être un audio.'); return }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErr(`Fichier trop lourd (${(file.size / 1024 / 1024).toFixed(1)} MB). Max : ${maxSizeMB} MB.`)
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => { onUrlChange(reader.result); setUploading(false) }
    reader.onerror = () => { setErr('Erreur lecture fichier.'); setUploading(false) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const togglePlay = () => {
    if (!previewRef.current) return
    if (playing) {
      previewRef.current.pause()
      setPlaying(false)
    } else {
      previewRef.current.volume = (volume ?? 50) / 100
      previewRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <div style={{
      padding: '16px 18px',
      background: 'rgba(235, 40, 40, 0.04)',
      border: '1px solid rgba(235, 40, 40, 0.18)',
      borderRadius: '8px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px' }}>🎵</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: accent, letterSpacing: '0.14em', fontWeight: 700 }}>
            {label}
          </span>
        </div>
        {url && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" onClick={togglePlay}
              style={{ background: 'transparent', border: `1px solid ${accent}55`, color: accent, padding: '4px 10px', cursor: 'pointer', fontSize: '10px', borderRadius: '3px', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
              {playing ? '⏸ PAUSE' : '▶ APERÇU'}
            </button>
            <button type="button" onClick={() => { onUrlChange(''); setErr(null); setPlaying(false) }}
              title="Retirer"
              style={{ background: 'transparent', border: '1px solid #333', color: 'var(--text-muted)', padding: '4px 8px', cursor: 'pointer', fontSize: '10px', borderRadius: '3px' }}>
              ✕
            </button>
            <audio ref={previewRef} src={url} onEnded={() => setPlaying(false)} style={{ display: 'none' }} />
          </div>
        )}
      </div>

      {/* URL / upload */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        <input
          type="text"
          value={isLocal ? '' : (url || '')}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={isLocal ? '💾 Fichier local chargé' : 'https://... (mp3, ogg, wav) ou uploadez un fichier →'}
          disabled={isLocal}
          style={{ ...inputBase, fontSize: '12px', fontFamily: 'var(--mono)' }}
        />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{
            padding: '0 14px',
            background: isLocal ? 'rgba(235,40,40,0.15)' : 'var(--violet-tint)',
            border: `1px solid ${isLocal ? accent : 'rgba(235,40,40,0.35)'}`,
            color: accent, cursor: uploading ? 'default' : 'pointer',
            fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.08em',
            borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap',
          }}>
          {uploading ? '⏳' : '📁 FICHIER'}
        </button>
        <input ref={fileRef} type="file" accept={accept} onChange={handleFile} style={{ display: 'none' }} />
      </div>

      {/* Volume slider */}
      {onVolumeChange && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.12em', minWidth: '50px' }}>
            VOLUME
          </span>
          <input
            type="range"
            min="0" max="100"
            value={volume ?? 50}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: accent, cursor: 'pointer' }}
          />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: accent, fontWeight: 700, minWidth: '32px', textAlign: 'right' }}>
            {volume ?? 50}%
          </span>
        </div>
      )}

      {err && (
        <div style={{ padding: '6px 10px', background: 'var(--violet-tint)', border: '1px solid rgba(235,40,40,0.35)', borderRadius: '3px', fontSize: '10px', color: 'var(--red)', fontFamily: 'var(--mono)' }}>
          ⚠ {err}
        </div>
      )}
      {help && !err && (
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {help}
        </div>
      )}
    </div>
  )
}

// ─── CHAPTER INFO EDITOR (common to all blocks) ───────────────────────────────

function ChapterInfoEditor({ block, onChange, defaultIcon, defaultLabel }) {
  const fileRef = useRef(null)
  const update = (k, v) => onChange({ ...block, [k]: v })
  const icon = block.chapterIcon || ''
  const isImage = icon && (icon.startsWith('http') || icon.startsWith('data:') || icon.startsWith('/'))

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await compressImage(file, 256, 0.85)
      update('chapterIcon', compressed)
    } catch {
      // Fallback: raw base64
      const reader = new FileReader()
      reader.onload = () => update('chapterIcon', reader.result)
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  return (
    <div style={{
      padding: '16px 18px',
      background: 'rgba(99,102,241,0.05)',
      border: '1px solid rgba(99,102,241,0.18)',
      borderRadius: '8px',
      display: 'flex', flexDirection: 'column', gap: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '15px' }}>🎬</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#6366f1', letterSpacing: '0.14em', fontWeight: 700 }}>
          APPARENCE DU CHAPITRE
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          (vu par le joueur sur l'écran d'intro et la carte chapitre)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '14px', alignItems: 'start' }}>
        {/* Icon preview / picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          <label style={{ ...labelStyle, marginBottom: '0', textAlign: 'center' }}>ICÔNE</label>
          <div style={{
            width: '72px', height: '72px', borderRadius: '10px',
            background: 'var(--bg-elevated)', border: '1.5px dashed rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
          }}>
            {isImage ? (
              <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '38px', lineHeight: 1 }}>{icon || defaultIcon || '▪'}</span>
            )}
            {!icon && (
              <div style={{ position: 'absolute', bottom: '4px', fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                DÉFAUT
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button type="button" onClick={() => fileRef.current?.click()}
              title="Téléverser une image"
              style={{ background: 'transparent', border: '1px solid #333', color: 'var(--text-muted)', padding: '4px 8px', cursor: 'pointer', fontSize: '10px', borderRadius: '3px', fontFamily: 'var(--mono)' }}>
              📁
            </button>
            {icon && (
              <button type="button" onClick={() => update('chapterIcon', '')}
                title="Réinitialiser"
                style={{ background: 'transparent', border: '1px solid #333', color: 'var(--text-muted)', padding: '4px 8px', cursor: 'pointer', fontSize: '10px', borderRadius: '3px', fontFamily: 'var(--mono)' }}>
                ✕
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>

        {/* Title + emoji input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          <div>
            <label style={labelStyle}>TITRE DU CHAPITRE</label>
            <input
              value={block.chapterTitle || ''}
              onChange={(e) => update('chapterTitle', e.target.value)}
              placeholder={defaultLabel || 'Titre personnalisé...'}
              style={inputBase}
            />
          </div>
          <div>
            <label style={labelStyle}>OU ENTRER UN EMOJI</label>
            <input
              value={isImage ? '' : icon}
              onChange={(e) => update('chapterIcon', e.target.value)}
              placeholder={defaultIcon || '📧'}
              maxLength={4}
              style={{ ...inputBase, fontSize: '16px', textAlign: 'center', maxWidth: '120px', letterSpacing: '0' }}
              disabled={isImage}
            />
            {isImage && (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                Une image est chargée — cliquez sur ✕ pour utiliser un emoji à la place.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Block Explanation Editor (common to all blocks) ─────────────────────────
// Lets the admin write a rich explanation that the player will see
// once the block is completed (success) or after a wrong answer (failure).

function BlockExplanationEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  return (
    <div style={{
      padding: '16px 18px',
      background: 'rgba(34, 197, 94, 0.05)',
      border: '1px solid rgba(34, 197, 94, 0.22)',
      borderRadius: '8px',
      display: 'flex', flexDirection: 'column', gap: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '15px' }}>💡</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#22c55e', letterSpacing: '0.14em', fontWeight: 700 }}>
          EXPLICATIONS APRÈS RÉPONSE
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          (affichées au joueur dans la carte feedback du bloc)
        </span>
      </div>

      <div>
        <label style={{ ...labelStyle, color: '#22c55e' }}>
          ✓ APRÈS RÉUSSITE — POURQUOI C'EST LA BONNE RÉPONSE
        </label>
        <textarea
          value={block.successExplanation || ''}
          onChange={(e) => update('successExplanation', e.target.value)}
          rows={4}
          placeholder="Ex: Cet email était bien un phishing. Le domaine 'paypaI.com' contenait un i majuscule à la place du L minuscule, et le ton urgent (« compte suspendu sous 24h ») est typique du social engineering. À l'avenir, vérifiez toujours le domaine en survolant le lien."
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.6, minHeight: '90px' }}
        />
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
          Apparaît dans la carte de feedback verte une fois le bloc complété. Vous pouvez utiliser les balises dynamiques <code style={{ color: '#10b981' }}>{'{{employee}}'}</code>, <code style={{ color: '#10b981' }}>{'{{company}}'}</code>, etc.
        </div>
      </div>

      <div>
        <label style={{ ...labelStyle, color: '#eb2828' }}>
          ✗ APRÈS ÉCHEC — POURQUOI C'ÉTAIT FAUX (OPTIONNEL)
        </label>
        <textarea
          value={block.failureExplanation || ''}
          onChange={(e) => update('failureExplanation', e.target.value)}
          rows={3}
          placeholder="Ex: Vous avez fait confiance à cet email, c'est une erreur classique. Les attaquants imitent souvent des marques connues. Toujours vérifier l'URL réelle avant de cliquer."
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.6, minHeight: '70px' }}
        />
      </div>
    </div>
  )
}

// ─── Dynamic tags reference panel (shown in email/text/quiz editors) ──────────

const AVAILABLE_TAGS = [
  { tag: '{{employee}}',           desc: 'Nom complet du joueur' },
  { tag: '{{employee.firstName}}', desc: 'Prénom' },
  { tag: '{{employee.lastName}}',  desc: 'Nom de famille' },
  { tag: '{{employee.email}}',     desc: 'Email du joueur' },
  { tag: '{{employee.initials}}',  desc: 'Initiales (ex: AM)' },
  { tag: '{{company}}',            desc: 'Nom du client / de l\'entreprise' },
  { tag: '{{company.sector}}',     desc: 'Secteur d\'activité' },
  { tag: '{{company.domain}}',     desc: 'Domaine email (ex: acme.com)' },
  { tag: '{{sector}}',             desc: 'Alias de company.sector' },
  { tag: '{{date}}',               desc: 'Date courante (11 avril 2026)' },
  { tag: '{{time}}',               desc: 'Heure courante (14:32)' },
  { tag: '{{year}}',               desc: 'Année courante (2026)' },
]

function TagsHelpPanel() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const copy = (tag) => {
    navigator.clipboard?.writeText(tag).catch(() => {})
    setCopied(tag)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div style={{
      background: 'rgba(16,185,129,0.06)',
      border: '1px solid rgba(16,185,129,0.25)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', background: 'transparent', border: 'none',
          color: '#10b981', fontFamily: 'var(--mono)', fontSize: '11px',
          fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '14px' }}>🏷</span>
        <span style={{ flex: 1 }}>
          BALISES DYNAMIQUES {open ? '— cliquez pour refermer' : '— cliquez pour afficher'}
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '4px 14px 14px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.5 }}>
            Insérez ces balises n'importe où dans les champs (objet, message, titre, options…). Elles seront remplacées par les vraies données du joueur (prénom, entreprise, secteur) au moment où il joue le scénario.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            {AVAILABLE_TAGS.map(({ tag, desc }) => (
              <button
                key={tag}
                type="button"
                onClick={() => copy(tag)}
                title="Cliquez pour copier"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px',
                  background: copied === tag ? 'rgba(34,197,94,0.15)' : 'rgba(0,0,0,0.35)',
                  border: `1px solid ${copied === tag ? '#22c55e' : 'var(--bg-muted)'}`,
                  borderRadius: '4px', cursor: 'pointer',
                  textAlign: 'left', minWidth: 0,
                  transition: 'all 0.15s',
                }}
              >
                <code style={{
                  fontFamily: 'var(--mono)', fontSize: '11px',
                  color: copied === tag ? '#22c55e' : '#10b981',
                  fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  {copied === tag ? '✓ copié' : tag}
                </code>
                <span style={{
                  fontSize: '10px', color: 'var(--text-muted)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {desc}
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            💡 <b style={{ color: 'var(--text-secondary)' }}>HTML autorisé</b> dans le corps du mail : <code style={{ color: '#10b981' }}>&lt;b&gt;</code> <code style={{ color: '#10b981' }}>&lt;p&gt;</code> <code style={{ color: '#10b981' }}>&lt;a&gt;</code> <code style={{ color: '#10b981' }}>&lt;br/&gt;</code> <code style={{ color: '#10b981' }}>&lt;ul&gt;</code> etc. Détection automatique.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── EMAIL EDITOR ──────────────────────────────────────────────────────────────

function EmailEditor({ block, onChange }) {
  const [linkHovered, setLinkHovered] = useState(false)
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateLink = (k, v) => onChange({ ...block, link: { ...block.link, [k]: v } })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Dynamic tags help panel */}
      <TagsHelpPanel />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="NOM EXPÉDITEUR" value={block.senderName} onChange={(v) => update('senderName', v)} />
        <Field label="EMAIL EXPÉDITEUR" value={block.from} onChange={(v) => update('from', v)} />
      </div>
      <Field label="DESTINATAIRE" value={block.to} onChange={(v) => update('to', v)} placeholder="{{employee}}" />
      <Field label="OBJET" value={block.subject} onChange={(v) => update('subject', v)} placeholder="Bonjour {{employee.firstName}}, ..." />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>MESSAGE (texte ou HTML)</label>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            HTML auto-détecté si balises présentes
          </span>
        </div>
        <textarea
          value={block.body}
          onChange={(e) => update('body', e.target.value)}
          rows={7}
          placeholder={'Bonjour {{employee.firstName}},\n\nEn raison d\'un incident sur votre compte {{company}}, merci de...\n\nOu utiliser du HTML :\n<p>Bonjour <b>{{employee}}</b>,</p>\n<p>Cordialement,<br/>Service {{sector}}</p>'}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--mono)', fontSize: '12px', lineHeight: 1.6, minHeight: '160px' }}
        />
      </div>

      <div style={{ padding: '18px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#3b82f6', marginBottom: '14px', letterSpacing: '0.08em', fontWeight: 500 }}>🔗 LIEN PIÉGÉ</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
          <Field label="TEXTE DU LIEN" value={block.link.text} onChange={(v) => updateLink('text', v)} />
          <Field label="URL AFFICHÉE (hover)" value={block.link.hover} onChange={(v) => updateLink('hover', v)} />
        </div>
        <Field label="URL RÉELLE (destination)" value={block.link.real} onChange={(v) => updateLink('real', v)} />

        <div style={{ marginTop: '14px', padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginRight: '10px', letterSpacing: '0.08em' }}>APERÇU :</span>
          <span
            style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            {block.link.text}
          </span>
          {linkHovered && (
            <div style={{ display: 'inline-block', marginLeft: '10px', background: 'var(--border)', padding: '3px 10px', fontSize: '10px', color: '#22c55e', borderRadius: '4px', fontFamily: 'var(--mono)' }}>
              🔗 {block.link.hover}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PHOTO EDITOR ──────────────────────────────────────────────────────────────

function compressImage(file, maxWidth = 1200, quality = 0.78) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function PhotoEditor({ block, onChange }) {
  const imgRef = useRef(null)
  const fsImgRef = useRef(null)
  const fileRef = useRef(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [interaction, setInteraction] = useState(null)
  // interaction shapes:
  //  { type: 'drawing',  startX, startY, x, y, w, h }
  //  { type: 'moving',   id, offsetX, offsetY }
  //  { type: 'resizing', id, corner, start: {x,y,w,h} }

  const update = (k, v) => onChange({ ...block, [k]: v })
  const zones = block.zones || []

  // Refs to always access latest state inside window event handlers
  const blockRef = useRef(block)
  blockRef.current = block
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const fullscreenRef = useRef(fullscreen)
  fullscreenRef.current = fullscreen

  const writeZones = (newZones) => onChangeRef.current({ ...blockRef.current, zones: newZones })
  const getActiveImgEl = () => (fullscreenRef.current ? fsImgRef : imgRef).current

  const getPercentFromEvent = (e) => {
    const img = getActiveImgEl()
    if (!img) return null
    const rect = img.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const compressed = await compressImage(file)
      update('src', compressed)
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const startDrawing = (e) => {
    if (e.button !== 0) return
    const pos = getPercentFromEvent(e)
    if (!pos) return
    e.preventDefault()
    setSelectedZoneId(null)
    setInteraction({ type: 'drawing', startX: pos.x, startY: pos.y, x: pos.x, y: pos.y, w: 0, h: 0 })
  }

  const startMoving = (e, zone) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    const pos = getPercentFromEvent(e)
    if (!pos) return
    setSelectedZoneId(zone.id)
    setInteraction({ type: 'moving', id: zone.id, offsetX: pos.x - zone.x, offsetY: pos.y - zone.y })
  }

  const startResizing = (e, zone, corner) => {
    if (e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    setSelectedZoneId(zone.id)
    setInteraction({ type: 'resizing', id: zone.id, corner, start: { x: zone.x, y: zone.y, w: zone.w, h: zone.h } })
  }

  // Drag handling — single window listener, re-registered when interaction changes
  useEffect(() => {
    if (!interaction) return

    const handleMove = (e) => {
      const pos = getPercentFromEvent(e)
      if (!pos) return
      const cx = clamp(pos.x, 0, 100)
      const cy = clamp(pos.y, 0, 100)

      if (interaction.type === 'drawing') {
        const nx = Math.min(interaction.startX, cx)
        const ny = Math.min(interaction.startY, cy)
        const nw = Math.abs(cx - interaction.startX)
        const nh = Math.abs(cy - interaction.startY)
        setInteraction({ ...interaction, x: nx, y: ny, w: nw, h: nh })
      } else if (interaction.type === 'moving') {
        const current = blockRef.current.zones || []
        const z = current.find(zz => zz.id === interaction.id)
        if (!z) return
        const nx = clamp(cx - interaction.offsetX, 0, 100 - z.w)
        const ny = clamp(cy - interaction.offsetY, 0, 100 - z.h)
        writeZones(current.map(zz => (zz.id === interaction.id ? { ...zz, x: nx, y: ny } : zz)))
      } else if (interaction.type === 'resizing') {
        const start = interaction.start
        const corner = interaction.corner
        const left   = corner.includes('w') ? clamp(cx, 0, 100) : start.x
        const top    = corner.includes('n') ? clamp(cy, 0, 100) : start.y
        const right  = corner.includes('e') ? clamp(cx, 0, 100) : start.x + start.w
        const bottom = corner.includes('s') ? clamp(cy, 0, 100) : start.y + start.h
        const nx = Math.min(left, right)
        const ny = Math.min(top, bottom)
        const nw = Math.max(2, Math.abs(right - left))
        const nh = Math.max(2, Math.abs(bottom - top))
        const current = blockRef.current.zones || []
        writeZones(current.map(zz => (zz.id === interaction.id ? { ...zz, x: nx, y: ny, w: nw, h: nh } : zz)))
      }
    }

    const handleUp = () => {
      if (interaction.type === 'drawing' && interaction.w >= 3 && interaction.h >= 3) {
        const current = blockRef.current.zones || []
        const newZone = {
          id: Date.now(),
          x: interaction.x,
          y: interaction.y,
          w: interaction.w,
          h: interaction.h,
          label: `Zone ${current.length + 1}`,
          correct: true,
        }
        writeZones([...current, newZone])
        setSelectedZoneId(newZone.id)
      }
      setInteraction(null)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
    // getPercentFromEvent reads from refs only — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interaction])

  // Escape closes fullscreen
  useEffect(() => {
    if (!fullscreen) return
    const handleKey = (e) => { if (e.key === 'Escape') setFullscreen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [fullscreen])

  const updateZone = (id, k, v) => update('zones', zones.map((z) => (z.id === id ? { ...z, [k]: v } : z)))
  const removeZone = (id) => {
    update('zones', zones.filter((z) => z.id !== id))
    if (selectedZoneId === id) setSelectedZoneId(null)
  }

  // Renders the interactive image canvas — used in both normal & fullscreen mode
  const renderImageCanvas = ({ isFullscreen }) => {
    const activeRef = isFullscreen ? fsImgRef : imgRef
    const containerMaxHeight = isFullscreen ? 'calc(100vh - 180px)' : '60vh'

    return (
      <div style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: '100%',
        lineHeight: 0,
        userSelect: 'none',
        boxShadow: isFullscreen ? '0 20px 60px rgba(0,0,0,0.6)' : 'none',
        borderRadius: '8px',
        overflow: 'visible',
      }}>
        <img
          ref={activeRef}
          src={block.src}
          alt="preview"
          draggable={false}
          onMouseDown={startDrawing}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: containerMaxHeight,
            border: `2px solid ${interaction?.type === 'drawing' ? '#8b5cf6' : 'var(--border)'}`,
            borderRadius: '8px',
            cursor: interaction ? (interaction.type === 'drawing' ? 'crosshair' : 'grabbing') : 'crosshair',
          }}
        />

        {/* Existing zones */}
        {zones.map((z) => {
          const isSel = selectedZoneId === z.id
          const col = z.correct ? '#22c55e' : 'var(--red)'
          const colRaw = z.correct ? '34,197,94' : '235,40,40'
          return (
            <div
              key={z.id}
              onMouseDown={(e) => startMoving(e, z)}
              style={{
                position: 'absolute',
                left: `${z.x}%`, top: `${z.y}%`,
                width: `${z.w}%`, height: `${z.h}%`,
                border: `2px solid ${col}`,
                background: `rgba(${colRaw}, ${isSel ? 0.22 : 0.15})`,
                borderRadius: '4px',
                cursor: interaction?.type === 'moving' && interaction.id === z.id ? 'grabbing' : 'grab',
                boxShadow: isSel ? `0 0 0 2px rgba(${colRaw},0.35)` : 'none',
                transition: interaction?.id === z.id ? 'none' : 'box-shadow 0.15s',
              }}
            >
              {/* Label */}
              <span style={{
                position: 'absolute', top: '-24px', left: 0,
                fontSize: '11px', background: col,
                color: '#fff', padding: '3px 8px', borderRadius: '4px',
                whiteSpace: 'nowrap', fontWeight: 500, pointerEvents: 'none',
              }}>{z.label}</span>

              {/* Size badge (bottom-right) */}
              {isSel && (
                <span style={{
                  position: 'absolute', bottom: '-24px', right: 0,
                  fontSize: '10px', fontFamily: 'var(--mono)',
                  background: 'rgba(0,0,0,0.75)', color: '#fff',
                  padding: '3px 7px', borderRadius: '4px',
                  whiteSpace: 'nowrap', pointerEvents: 'none',
                }}>{Math.round(z.w)}×{Math.round(z.h)}</span>
              )}

              {/* Resize handles — only on selected zone */}
              {isSel && ['nw', 'ne', 'sw', 'se'].map(corner => (
                <div
                  key={corner}
                  onMouseDown={(e) => startResizing(e, z, corner)}
                  style={{
                    position: 'absolute',
                    width: '14px', height: '14px',
                    background: '#fff',
                    border: `2px solid ${col}`,
                    borderRadius: '50%',
                    ...(corner.includes('n') ? { top: '-8px' } : { bottom: '-8px' }),
                    ...(corner.includes('w') ? { left: '-8px' } : { right: '-8px' }),
                    cursor: `${corner}-resize`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  }}
                />
              ))}
            </div>
          )
        })}

        {/* Draft rectangle being drawn */}
        {interaction?.type === 'drawing' && interaction.w > 0.2 && interaction.h > 0.2 && (
          <div style={{
            position: 'absolute',
            left: `${interaction.x}%`, top: `${interaction.y}%`,
            width: `${interaction.w}%`, height: `${interaction.h}%`,
            border: '2px dashed #8b5cf6',
            background: 'rgba(139,92,246,0.15)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}>
            <span style={{
              position: 'absolute', bottom: '-24px', right: 0,
              fontSize: '10px', fontFamily: 'var(--mono)',
              background: '#8b5cf6', color: '#fff',
              padding: '3px 7px', borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}>{Math.round(interaction.w)}×{Math.round(interaction.h)}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => !loading && fileRef.current?.click()}
          style={{ padding: '10px 18px', background: loading ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', color: '#8b5cf6', cursor: loading ? 'default' : 'pointer', fontSize: '13px', borderRadius: '6px', opacity: loading ? 0.7 : 1, fontWeight: 500 }}>
          {loading ? '⏳ Compression...' : '📂 Choisir une image'}
        </button>
        {block.src && !loading && (
          <button type="button" onClick={() => setFullscreen(true)}
            style={{ padding: '10px 18px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', color: '#8b5cf6', cursor: 'pointer', fontSize: '13px', borderRadius: '6px', fontWeight: 500 }}>
            ⛶ Plein écran
          </button>
        )}
        {block.src && !loading && (
          <button type="button" onClick={() => { update('src', ''); update('zones', []) }}
            style={{ padding: '10px 14px', background: 'transparent', border: '1px solid var(--border-strong)', color: 'var(--red)', cursor: 'pointer', fontSize: '13px', borderRadius: '6px' }}>
            ✕ Retirer
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>

      {block.src && !loading && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, padding: '10px 14px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '6px' }}>
          💡 <strong style={{ color: '#8b5cf6' }}>Cliquez-glissez</strong> sur l'image pour dessiner une zone.
          Cliquez une zone pour la sélectionner, glissez-la pour la déplacer, et utilisez les poignées des coins pour la redimensionner.
        </div>
      )}

      {loading && (
        <div style={{ padding: '20px', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: '#8b5cf6', background: 'rgba(139,92,246,0.05)' }}>
          ⏳ Compression de l'image en cours...
        </div>
      )}

      {!loading && block.src && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 28px' }}>
          {renderImageCanvas({ isFullscreen: false })}
        </div>
      )}

      {!loading && !block.src && (
        <div onClick={() => fileRef.current?.click()} style={{ padding: '50px 20px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139,92,246,0.03)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{ fontSize: '36px', marginBottom: '10px', opacity: 0.5 }}>🖼️</div>
          <div style={{ fontWeight: 500 }}>Cliquez pour choisir une image</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>JPG, PNG, WebP — compressée automatiquement</div>
        </div>
      )}

      {zones.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={labelStyle}>ZONES DÉFINIES ({zones.length})</div>
          {zones.map((z) => {
            const isSel = selectedZoneId === z.id
            return (
              <div key={z.id}
                onClick={() => setSelectedZoneId(z.id)}
                style={{
                  display: 'flex', gap: '8px', alignItems: 'center',
                  padding: '8px', borderRadius: '6px', cursor: 'pointer',
                  background: isSel ? 'rgba(139,92,246,0.08)' : 'transparent',
                  border: `1px solid ${isSel ? 'rgba(139,92,246,0.4)' : 'transparent'}`,
                  transition: 'all 0.12s',
                }}
              >
                <input value={z.label} onClick={(e) => e.stopPropagation()} onChange={(e) => updateZone(z.id, 'label', e.target.value)}
                  style={{ ...inputBase, flex: 1, padding: '9px 12px', fontSize: '13px' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', minWidth: '56px', textAlign: 'right' }}>
                  {Math.round(z.w)}×{Math.round(z.h)}
                </span>
                <button type="button" onClick={(e) => { e.stopPropagation(); updateZone(z.id, 'correct', !z.correct) }}
                  style={{ padding: '9px 14px', background: z.correct ? 'rgba(34,197,94,0.12)' : 'var(--violet-tint)', border: `1px solid ${z.correct ? '#22c55e' : 'var(--red)'}`, color: z.correct ? '#22c55e' : 'var(--red)', cursor: 'pointer', fontSize: '12px', borderRadius: '6px', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {z.correct ? '✓ Correct' : '✕ Faux'}
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeZone(z.id) }}
                  style={{ width: '36px', height: '36px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', borderRadius: '6px', flexShrink: 0 }}>✕</button>
              </div>
            )
          })}
        </div>
      )}

      {/* ── FULLSCREEN MAPPING OVERLAY ── */}
      {fullscreen && block.src && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.94)',
            backdropFilter: 'blur(6px)',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Fullscreen header */}
          <div style={{
            flexShrink: 0, padding: '18px 28px',
            display: 'flex', alignItems: 'center', gap: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
              🖼️ Mapping plein écran
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {zones.length} zone{zones.length !== 1 ? 's' : ''}
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>💡 Glisser = dessiner · Cliquer = sélectionner · Poignées = redimensionner</span>
            </div>
            <button type="button" onClick={() => setFullscreen(false)}
              style={{ padding: '10px 18px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', borderRadius: '6px', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            >
              ✕ Fermer (Esc)
            </button>
          </div>

          {/* Fullscreen canvas */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 60px', overflow: 'hidden' }}>
            {renderImageCanvas({ isFullscreen: true })}
          </div>

          {/* Fullscreen footer — selected zone controls */}
          {selectedZoneId && (() => {
            const z = zones.find(zz => zz.id === selectedZoneId)
            if (!z) return null
            return (
              <div style={{
                flexShrink: 0, padding: '18px 28px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', gap: '12px', alignItems: 'center',
                background: 'rgba(0,0,0,0.5)',
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  ZONE SÉLECTIONNÉE
                </span>
                <input value={z.label} onChange={(e) => updateZone(z.id, 'label', e.target.value)}
                  placeholder="Nom de la zone"
                  style={{ ...inputBase, flex: 1, maxWidth: '360px' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {Math.round(z.x)},{Math.round(z.y)} · {Math.round(z.w)}×{Math.round(z.h)}
                </span>
                <button type="button" onClick={() => updateZone(z.id, 'correct', !z.correct)}
                  style={{ padding: '11px 18px', background: z.correct ? 'rgba(34,197,94,0.12)' : 'var(--violet-tint)', border: `1px solid ${z.correct ? '#22c55e' : 'var(--red)'}`, color: z.correct ? '#22c55e' : 'var(--red)', cursor: 'pointer', fontSize: '13px', borderRadius: '6px', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {z.correct ? '✓ Bonne zone' : '✕ Fausse zone'}
                </button>
                <button type="button" onClick={() => removeZone(z.id)}
                  style={{ padding: '11px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', borderRadius: '6px' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  🗑 Supprimer
                </button>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

// ─── VIDEO EDITOR ──────────────────────────────────────────────────────────────

function VideoEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

  const isDataUrl = block.url && block.url.startsWith('data:')
  const isYoutube = block.url && (block.url.includes('youtube.com') || block.url.includes('youtu.be'))
  const isVimeo = block.url && block.url.includes('vimeo.com')
  const sourceLabel = isDataUrl ? '💾 Fichier local' : isYoutube ? '▶ YouTube' : isVimeo ? '▶ Vimeo' : block.url ? '🔗 URL externe' : null

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    if (!file.type.startsWith('video/')) {
      setUploadError('Le fichier doit être une vidéo.')
      return
    }
    if (file.size > MAX_SIZE) {
      setUploadError(`Fichier trop lourd (${(file.size / 1024 / 1024).toFixed(1)} MB). Max : 20 MB — utilisez plutôt une URL.`)
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      update('url', reader.result)
      setUploading(false)
    }
    reader.onerror = () => {
      setUploadError('Erreur lors de la lecture du fichier.')
      setUploading(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <TagsHelpPanel />

      {/* Source selection — URL or local upload */}
      <div>
        <label style={labelStyle}>SOURCE DE LA VIDÉO</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'stretch' }}>
          {/* URL input */}
          <div style={{
            padding: '14px',
            background: isDataUrl ? 'transparent' : 'rgba(236,72,153,0.05)',
            border: `1px solid ${isDataUrl ? 'var(--border)' : 'rgba(236,72,153,0.3)'}`,
            borderRadius: '6px',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: isDataUrl ? 'var(--text-muted)' : '#ec4899', letterSpacing: '0.14em', marginBottom: '8px', fontWeight: 700 }}>
              🔗 URL EXTERNE
            </div>
            <input
              type="text"
              value={isDataUrl ? '' : (block.url || '')}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://youtube.com/watch?v=... ou https://..."
              disabled={isDataUrl}
              style={{ ...inputBase, fontSize: '12px' }}
            />
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              YouTube, Vimeo, ou n'importe quel lien direct (.mp4, .webm)
            </div>
          </div>

          {/* Separator */}
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.1em' }}>
            OU
          </div>

          {/* Local upload */}
          <div style={{
            padding: '14px',
            background: isDataUrl ? 'rgba(236,72,153,0.08)' : 'rgba(0,0,0,0.25)',
            border: `1px solid ${isDataUrl ? 'rgba(236,72,153,0.4)' : 'var(--border)'}`,
            borderRadius: '6px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: isDataUrl ? '#ec4899' : 'var(--text-muted)', letterSpacing: '0.14em', fontWeight: 700 }}>
              💾 FICHIER LOCAL
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '10px 14px',
                background: uploading ? 'var(--border)' : 'rgba(236,72,153,0.12)',
                border: '1px dashed rgba(236,72,153,0.5)',
                color: '#ec4899', cursor: uploading ? 'default' : 'pointer',
                fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em',
                borderRadius: '4px', fontWeight: 700,
              }}
            >
              {uploading ? '⏳ Lecture...' : '📁 CHOISIR UN FICHIER'}
            </button>
            <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} style={{ display: 'none' }} />
            {isDataUrl && (
              <button type="button" onClick={() => { update('url', ''); setUploadError(null) }}
                style={{ padding: '4px 8px', background: 'transparent', border: '1px solid #333', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '3px', fontFamily: 'var(--mono)' }}>
                ✕ Retirer
              </button>
            )}
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Formats : MP4, WebM, OGG · Max 20 MB
            </div>
          </div>
        </div>

        {uploadError && (
          <div style={{ marginTop: '10px', padding: '10px 14px', background: 'var(--violet-tint)', border: '1px solid rgba(235,40,40,0.35)', borderRadius: '4px', fontSize: '11px', color: 'var(--red)', fontFamily: 'var(--mono)' }}>
            ⚠ {uploadError}
          </div>
        )}
      </div>

      <Field
        label="LÉGENDE"
        value={block.caption}
        onChange={(v) => update('caption', v)}
        placeholder="Ex: Bonjour {{employee.firstName}}, voici la consigne du jour..."
      />

      {sourceLabel && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(236,72,153,0.08)',
          border: '1px solid rgba(236,72,153,0.3)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '16px' }}>🎬</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#ec4899', fontWeight: 700 }}>{sourceLabel}</div>
            {isDataUrl ? (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Vidéo encodée directement dans le scénario (~{Math.round((block.url.length * 0.75) / 1024)} KB)
              </div>
            ) : (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                {block.url}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── QUIZ EDITOR ───────────────────────────────────────────────────────────────

function QuizEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateOption = (i, k, v) => update('options', block.options.map((o, idx) => (idx === i ? { ...o, [k]: v } : o)))
  const toggleCorrect = (i) => update('options', block.options.map((o, idx) => (idx === i ? { ...o, correct: !o.correct } : o)))
  const addOption = () => update('options', [...block.options, { text: '', correct: false }])
  const removeOption = (i) => { if (block.options.length > 2) update('options', block.options.filter((_, idx) => idx !== i)) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={labelStyle}>QUESTION</label>
        <textarea value={block.question} onChange={(e) => update('question', e.target.value)} rows={2}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.5, minHeight: '72px' }} />
      </div>

      <div>
        <div style={labelStyle}>OPTIONS — cocher les réponses correctes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {block.options.map((o, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" onClick={() => toggleCorrect(i)} style={{ width: '36px', height: '36px', background: o.correct ? 'rgba(34,197,94,0.18)' : 'var(--bg-input)', border: `2px solid ${o.correct ? '#22c55e' : 'var(--border)'}`, color: o.correct ? '#22c55e' : 'transparent', cursor: 'pointer', borderRadius: '50%', fontSize: '16px', flexShrink: 0, fontWeight: 600 }}>
                {o.correct ? '✓' : ''}
              </button>
              <input value={o.text} onChange={(e) => updateOption(i, 'text', e.target.value)} placeholder={`Option ${i + 1}`}
                style={{ ...inputBase, background: o.correct ? 'rgba(34,197,94,0.05)' : 'var(--bg-input)', border: `1px solid ${o.correct ? '#22c55e50' : 'var(--border)'}` }} />
              <button type="button" onClick={() => removeOption(i)} disabled={block.options.length <= 2}
                style={{ width: '36px', height: '36px', background: 'transparent', border: '1px solid var(--border)', color: block.options.length <= 2 ? 'var(--border)' : 'var(--red)', cursor: block.options.length <= 2 ? 'default' : 'pointer', borderRadius: '6px', fontSize: '14px', flexShrink: 0 }}>
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addOption} style={{ marginTop: '12px', padding: '10px 16px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', borderRadius: '6px', width: '100%', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#f59e0b' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          + Ajouter une option
        </button>
      </div>

      <div>
        <label style={labelStyle}>EXPLICATION (affichée après réponse)</label>
        <textarea value={block.explanation} onChange={(e) => update('explanation', e.target.value)} rows={3} placeholder="Pourquoi cette réponse ?"
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.5, minHeight: '90px' }} />
      </div>
    </div>
  )
}

// ─── PUZZLE EDITOR ─────────────────────────────────────────────────────────────

const PUZZLE_TYPES = [
  { value: 'reorder',   label: '🔀 Réordonner',      desc: 'Remettre dans l\'ordre' },
  { value: 'memory',    label: '🔗 Relier les mots',  desc: 'Relier un terme à sa définition' },
  { value: 'crossword', label: '📐 Mots croisés',     desc: 'Grille entrecroisée' },
]

function PuzzleEditor({ 
  block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const items = block.items || []
  const pairs = block.pairs || []
  const words = block.words || []

  const updateItem = (i, v) => update('items', items.map((it, idx) => (idx === i ? v : it)))
  const moveItem = (i, dir) => { const arr = [...items]; const j = i + dir; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; update('items', arr) }
  const addItem = () => update('items', [...items, ''])
  const removeItem = (i) => { if (items.length > 2) update('items', items.filter((_, idx) => idx !== i)) }

  const updatePair = (i, k, v) => update('pairs', pairs.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)))
  const addPair = () => update('pairs', [...pairs, { a: '', b: '' }])
  const removePair = (i) => { if (pairs.length > 1) update('pairs', pairs.filter((_, idx) => idx !== i)) }

  const updateWord = (i, k, v) => update('words', words.map((w, idx) => (idx === i ? { ...w, [k]: v } : w)))
  const addWord = () => update('words', [...words, { word: '', clue: '' }])
  const removeWord = (i) => { if (words.length > 1) update('words', words.filter((_, idx) => idx !== i)) }

  const iStyle = { ...inputBase, padding: '10px 12px', fontSize: '13px' }
  const rmBtn = (dis, fn) => (
    <button type="button" onClick={fn} disabled={dis} style={{ width: '36px', height: '36px', background: 'transparent', border: '1px solid var(--border)', color: dis ? 'var(--border)' : 'var(--red)', cursor: dis ? 'default' : 'pointer', borderRadius: '6px', fontSize: '14px', flexShrink: 0 }}>×</button>
  )
  const moveBtn = (arrow, dis, fn) => (
    <button type="button" onClick={fn} disabled={dis} style={{ background: 'transparent', border: '1px solid var(--border)', color: dis ? 'var(--border)' : 'var(--text-muted)', width: '36px', height: '36px', cursor: dis ? 'default' : 'pointer', fontSize: '13px', borderRadius: '6px', flexShrink: 0 }}>{arrow}</button>
  )
  const addBtn = (label, fn, color = '#10b981') => (
    <button type="button" onClick={fn} style={{ marginTop: '12px', padding: '10px 16px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', borderRadius: '6px', width: '100%', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
    >{label}</button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={labelStyle}>TYPE DE PUZZLE</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {PUZZLE_TYPES.map((pt) => (
            <button key={pt.value} type="button" onClick={() => update('puzzleType', pt.value)} style={{ flex: 1, padding: '14px 10px', background: block.puzzleType === pt.value ? 'rgba(16,185,129,0.12)' : 'transparent', border: `1px solid ${block.puzzleType === pt.value ? '#10b981' : 'var(--border)'}`, color: block.puzzleType === pt.value ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', borderRadius: '8px', textAlign: 'center', fontWeight: 500, transition: 'all 0.15s' }}>
              <div style={{ fontSize: '15px', marginBottom: '4px' }}>{pt.label}</div>
              <div style={{ fontSize: '10px', opacity: 0.7, fontFamily: 'var(--font-body)', fontWeight: 400 }}>{pt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Field label="INSTRUCTION" value={block.instruction} onChange={(v) => update('instruction', v)} placeholder="Consigne affichée au joueur" />

      {block.puzzleType === 'reorder' && (
        <div>
          <label style={labelStyle}>ÉLÉMENTS À RÉORDONNER (dans le bon ordre)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', width: '24px', textAlign: 'center', flexShrink: 0, fontWeight: 500 }}>{i + 1}</span>
                <input value={item} onChange={(e) => updateItem(i, e.target.value)} style={iStyle} />
                {moveBtn('↑', i === 0, () => moveItem(i, -1))}
                {moveBtn('↓', i === items.length - 1, () => moveItem(i, 1))}
                {rmBtn(items.length <= 2, () => removeItem(i))}
              </div>
            ))}
          </div>
          {addBtn('+ Ajouter un élément', addItem)}
        </div>
      )}

      {block.puzzleType === 'memory' && (
        <div>
          <label style={labelStyle}>PAIRES À RELIER — Terme ↔ Définition</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pairs.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', width: '24px', textAlign: 'center', flexShrink: 0, fontWeight: 500 }}>{i + 1}</span>
                <input value={p.a} onChange={(e) => updatePair(i, 'a', e.target.value)} placeholder="Terme" style={{ ...iStyle, borderColor: 'rgba(99,102,241,0.4)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '16px', flexShrink: 0 }}>↔</span>
                <input value={p.b} onChange={(e) => updatePair(i, 'b', e.target.value)} placeholder="Définition" style={{ ...iStyle, borderColor: 'rgba(99,102,241,0.25)' }} />
                {rmBtn(pairs.length <= 1, () => removePair(i))}
              </div>
            ))}
          </div>
          {addBtn('+ Ajouter une paire', addPair)}
        </div>
      )}

      {block.puzzleType === 'crossword' && (
        <div>
          <label style={labelStyle}>MOTS — Réponse (majuscules) / Définition / Indice</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {words.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', width: '24px', textAlign: 'center', flexShrink: 0, fontWeight: 500 }}>{i + 1}</span>
                <input value={w.word} onChange={(e) => updateWord(i, 'word', e.target.value)} placeholder="MOT" style={{ ...iStyle, flex: '0 0 140px', textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '0.1em', fontWeight: 500 }} />
                <input value={w.clue} onChange={(e) => updateWord(i, 'clue', e.target.value)} placeholder="Définition / indice" style={iStyle} />
                {rmBtn(words.length <= 1, () => removeWord(i))}
              </div>
            ))}
          </div>
          {addBtn('+ Ajouter un mot', addWord)}
        </div>
      )}
    </div>
  )
}

// ─── TEXT EDITOR ───────────────────────────────────────────────────────────────

function TextEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <Field label="TITRE (optionnel)" value={block.heading} onChange={(v) => update('heading', v)} placeholder="Titre de la section" />
      <div>
        <label style={labelStyle}>CONTENU</label>
        <textarea value={block.content} onChange={(e) => update('content', e.target.value)} rows={8} placeholder="Rédigez votre contenu ici..."
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.7, minHeight: '200px' }} />
      </div>
    </div>
  )
}

// ─── DECISION EDITOR ───────────────────────────────────────────────────────────

function DecisionEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateChoice = (i, k, v) => update('choices', block.choices.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)))
  const addChoice = () => update('choices', [...block.choices, { text: '', correct: false, feedback: '' }])
  const removeChoice = (i) => { if (block.choices.length > 2) update('choices', block.choices.filter((_, idx) => idx !== i)) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={labelStyle}>QUESTION / SITUATION</label>
        <textarea value={block.question} onChange={(e) => update('question', e.target.value)} rows={3}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.5, minHeight: '90px' }} />
      </div>

      <div>
        <label style={labelStyle}>CHOIX — cocher le/les bons choix</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {block.choices.map((c, i) => (
            <div key={i} style={{ padding: '14px', background: c.correct ? 'rgba(34,197,94,0.04)' : 'rgba(235,40,40,0.04)', border: `1px solid ${c.correct ? 'rgba(34,197,94,0.25)' : 'rgba(235,40,40,0.15)'}`, borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <button type="button" onClick={() => updateChoice(i, 'correct', !c.correct)}
                  style={{ width: '36px', height: '36px', background: c.correct ? 'rgba(34,197,94,0.18)' : 'var(--violet-tint)', border: `2px solid ${c.correct ? '#22c55e' : 'var(--red)'}`, color: c.correct ? '#22c55e' : 'var(--red)', cursor: 'pointer', borderRadius: '6px', fontSize: '15px', flexShrink: 0, fontWeight: 600 }}>
                  {c.correct ? '✓' : '✕'}
                </button>
                <input value={c.text} onChange={(e) => updateChoice(i, 'text', e.target.value)} placeholder={`Choix ${i + 1}`}
                  style={inputBase} />
                <button type="button" onClick={() => removeChoice(i)} disabled={block.choices.length <= 2}
                  style={{ width: '36px', height: '36px', background: 'transparent', border: '1px solid var(--border)', color: block.choices.length <= 2 ? 'var(--border)' : 'var(--red)', cursor: block.choices.length <= 2 ? 'default' : 'pointer', borderRadius: '6px', fontSize: '14px', flexShrink: 0 }}>
                  ×
                </button>
              </div>
              <input value={c.feedback} onChange={(e) => updateChoice(i, 'feedback', e.target.value)} placeholder="Feedback affiché après ce choix..."
                style={{ ...inputBase, padding: '10px 14px', fontSize: '13px', background: 'var(--bg-elevated)' }} />
            </div>
          ))}
        </div>
        <button type="button" onClick={addChoice} style={{ marginTop: '12px', padding: '10px 16px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', borderRadius: '6px', width: '100%', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          + Ajouter un choix
        </button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

const CATEGORIES = ['Phishing', 'Ransomware', 'Social Eng.', 'Insider', 'Réseau', 'Malware', 'OSINT']
const DIFFICULTIES = [{ v: 'beginner', l: 'Débutant' }, { v: 'intermediate', l: 'Intermédiaire' }, { v: 'advanced', l: 'Avancé' }]

export default function ScenarioBuilder({
  initialData = null,
  onSave = () => {},
  onBack = () => {},
}) {
  const [meta, setMeta] = useState(initialData ? {
    titleFr:     initialData.title_fr || initialData.titleFr || '',
    titleEn:     initialData.title_en || initialData.titleEn || '',
    category:    initialData.category || 'Phishing',
    difficulty:  initialData.difficulty || 'intermediate',
    duration:    String(initialData.duration || '15'),
    description: initialData.description || '',
    audioUrl:    initialData.audio_url || initialData.audioUrl || '',
    audioVolume: initialData.audioVolume ?? 50,
  } : { titleFr: '', titleEn: '', category: 'Phishing', difficulty: 'intermediate', duration: '15', description: '', audioUrl: '', audioVolume: 50 })

  const [blocks, setBlocks] = useState(
    initialData?.blocks?.map((b, i) => ({ ...b, id: b.id ?? (Date.now() + i) })) || []
  )
  const [selectedId, setSelectedId] = useState(null)
  const [metaModalOpen, setMetaModalOpen] = useState(!initialData)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!initialData) return
    setMeta({
      titleFr:     initialData.titleFr || initialData.title?.fr || initialData.title_fr || '',
      titleEn:     initialData.titleEn || initialData.title?.en || initialData.title_en || '',
      category:    initialData.category || 'Phishing',
      difficulty:  initialData.difficulty || 'intermediate',
      duration:    String(initialData.duration || '15'),
      description: initialData.description || '',
      audioUrl:    initialData.audio_url || initialData.audioUrl || '',
      audioVolume: initialData.audioVolume ?? 50,
    })
    const b = Array.isArray(initialData.blocks) ? initialData.blocks : []
    setBlocks(b)
    setSelectedId(b[0]?.id || null)
  }, [initialData])

  const updateMeta = (k, v) => setMeta((m) => ({ ...m, [k]: v }))

  const addBlock = (type) => {
    const b = makeBlock(type)
    setBlocks((prev) => [...prev, b])
    setSelectedId(b.id)
  }

  const updateBlock = (id, updated) => setBlocks((prev) => prev.map((b) => (b.id === id ? updated : b)))

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const moveBlock = (id, dir) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      const j = idx + dir
      if (idx === -1 || j < 0 || j >= prev.length) return prev
      const arr = [...prev];
      [arr[idx], arr[j]] = [arr[j], arr[idx]]
      return arr
    })
  }

  const duplicateBlock = (id) => {
    const b = blocks.find((b) => b.id === id)
    if (!b) return
    const clone = { ...b, id: Date.now() + Math.random() }
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      const arr = [...prev]
      arr.splice(idx + 1, 0, clone)
      return arr
    })
    setSelectedId(clone.id)
  }

  const handleSave = (status = 'draft') => {
    // Normalize audio_url key for backend persistence
    onSave({
      ...meta,
      audio_url: meta.audioUrl || null,
      blocks,
      status,
      id: initialData?.id || Date.now(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selectedBlock = blocks.find((b) => b.id === selectedId)
  const [panelTab, setPanelTab] = useState('edit') // 'edit' | 'preview'

  // ── Player preview components (inline) ──────────────────────────────────────

  function BlockPlayerPreview({ block: b }) {
    const [quizSel, setQuizSel] = useState(null)
    const [quizDone, setQuizDone] = useState(false)
    const [decChoice, setDecChoice] = useState(null)
    const [emailHover, setEmailHover] = useState(false)

    const previewBox = {
      background: 'var(--bg-elevated)',
      border: '1px solid #1a1a1a',
      borderRadius: '8px',
      overflow: 'hidden',
      fontSize: '13px',
      color: 'var(--text)',
    }
    const label = (txt, color = 'var(--text-muted)') => (
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color, letterSpacing: '0.1em', padding: '8px 14px', borderBottom: '1px solid #111', background: 'var(--bg-elevated)' }}>
        {txt}
      </div>
    )

    switch (b.type) {
      case 'email': {
        const link = typeof b.link === 'object' ? b.link : { text: b.link, hover: '', real: b.link }
        return (
          <div style={previewBox}>
            {label('📧 APERÇU EMAIL JOUEUR')}
            <div style={{ padding: '18px 20px' }}>
              <div style={{ marginBottom: '4px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>De : </span>
                <span style={{ color: '#ddd' }}>{b.senderName}</span>
                <span style={{ color: 'var(--border-strong)', marginLeft: '6px' }}>&lt;{b.from}&gt;</span>
              </div>
              <div style={{ marginBottom: '14px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Objet : </span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{b.subject}</span>
              </div>
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '14px', color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{b.body}</div>
              {link?.text && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
                  <span
                    style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
                    onMouseEnter={() => setEmailHover(true)}
                    onMouseLeave={() => setEmailHover(false)}
                  >
                    {link.text}
                  </span>
                  {emailHover && (
                    <span style={{ marginLeft: '10px', background: 'var(--border)', border: '1px solid #333', padding: '2px 8px', fontSize: '10px', color: '#22c55e', borderRadius: '3px' }}>
                      🔗 {link.hover}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      }

      case 'quiz': {
        const opts = b.options || []
        return (
          <div style={previewBox}>
            {label('❓ APERÇU QUIZ JOUEUR')}
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '14px', lineHeight: 1.5 }}>{b.question}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {opts.map((o, i) => {
                  const isSelected = quizSel === i
                  const showResult = quizDone
                  return (
                    <button key={i} type="button"
                      onClick={() => { if (!quizDone) { setQuizSel(i); setQuizDone(true) } }}
                      style={{ padding: '10px 14px', textAlign: 'left', border: `1px solid ${showResult && o.correct ? '#22c55e' : showResult && isSelected && !o.correct ? 'var(--red)' : 'var(--border)'}`, background: showResult && o.correct ? 'rgba(34,197,94,0.12)' : showResult && isSelected && !o.correct ? 'var(--violet-tint)' : isSelected ? 'var(--border)' : 'transparent', color: showResult && o.correct ? '#22c55e' : showResult && isSelected && !o.correct ? '#ef4444' : '#ddd', borderRadius: '5px', cursor: quizDone ? 'default' : 'pointer', fontSize: '13px' }}>
                      {showResult && o.correct ? '✓ ' : showResult && isSelected && !o.correct ? '✕ ' : ''}{o.text}
                    </button>
                  )
                })}
              </div>
              {quizDone && b.explanation && (
                <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--bg-muted)', border: '1px solid #222', borderRadius: '5px', fontSize: '12px', color: '#aaa', lineHeight: 1.6 }}>
                  💡 {b.explanation}
                </div>
              )}
              {quizDone && (
                <button type="button" onClick={() => { setQuizSel(null); setQuizDone(false) }}
                  style={{ marginTop: '8px', padding: '4px 10px', background: 'transparent', border: '1px solid #333', color: '#666', cursor: 'pointer', fontSize: '10px', borderRadius: '4px' }}>
                  ↺ Réessayer
                </button>
              )}
            </div>
          </div>
        )
      }

      case 'decision': {
        const choices = b.choices || []
        return (
          <div style={previewBox}>
            {label('🔀 APERÇU DÉCISION JOUEUR')}
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '14px', lineHeight: 1.5 }}>{b.question}</div>
              {!decChoice ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {choices.map((c, i) => (
                    <button key={i} type="button" onClick={() => setDecChoice(c)}
                      style={{ padding: '10px 14px', textAlign: 'left', border: '1px solid #222', background: 'transparent', color: '#ddd', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' }}>
                      {c.text}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ padding: '12px 14px', background: decChoice.correct ? 'rgba(34,197,94,0.1)' : 'var(--violet-tint)', border: `1px solid ${decChoice.correct ? '#22c55e40' : 'var(--border-strong)'}`, borderRadius: '5px', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 600, color: decChoice.correct ? '#22c55e' : '#ef4444', marginBottom: '4px' }}>
                      {decChoice.correct ? '✓ Bonne réaction' : '✕ Mauvais choix'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{decChoice.feedback}</div>
                  </div>
                  <button type="button" onClick={() => setDecChoice(null)}
                    style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #333', color: '#666', cursor: 'pointer', fontSize: '10px', borderRadius: '4px' }}>
                    ↺ Réessayer
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      }

      case 'puzzle': {
        if (b.puzzleType === 'memory') {
          const pairs = b.pairs || []
          return (
            <div style={previewBox}>
              {label('🔗 APERÇU JEU DE LIAISON — JOUEUR')}
              <div style={{ padding: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {b.instruction || 'Reliez chaque terme à sa définition'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1fr', gap: '10px', alignItems: 'center' }}>
                  {pairs.map((p, i) => (
                    <>
                      <div key={`a${i}`} style={{ padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid #1f1f1f', borderLeft: '2px solid rgba(99,102,241,0.5)', borderRadius: '3px', fontSize: '12px', color: '#ddd' }}>
                        {p.a || '(vide)'}
                      </div>
                      <div key={`l${i}`} style={{ textAlign: 'center', color: 'var(--border-strong)', fontSize: '14px' }}>⋯</div>
                      <div key={`b${i}`} style={{ padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid #1f1f1f', borderRight: '2px solid rgba(99,102,241,0.5)', borderRadius: '3px', fontSize: '12px', color: '#ccc' }}>
                        {p.b || '(vide)'}
                      </div>
                    </>
                  ))}
                </div>
                <div style={{ marginTop: '10px', fontSize: '10px', color: '#444', fontStyle: 'italic' }}>
                  (les définitions seront mélangées côté joueur — des traits apparaîtront au clic)
                </div>
              </div>
            </div>
          )
        }
        if (b.puzzleType === 'crossword') {
          const words = (b.words || []).filter(w => w.word)
          const grid = buildCrosswordPreview(words)
          return (
            <div style={previewBox}>
              {label('📐 APERÇU MOTS CROISÉS — GRILLE')}
              <div style={{ padding: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>{b.instruction}</div>
                {grid && grid.width > 0 ? (
                  <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${grid.width}, 26px)`,
                      gridAutoRows: '26px',
                      gap: '2px',
                      padding: '8px',
                      background: 'var(--bg-soft)',
                      border: '1px solid #1a1a1a',
                      borderRadius: '3px',
                    }}>
                      {Array.from({ length: grid.height }).map((_, y) =>
                        Array.from({ length: grid.width }).map((_, x) => {
                          const cell = grid.cells[`${x},${y}`]
                          if (!cell) return <div key={`${x}-${y}`} style={{ background: 'transparent' }} />
                          return (
                            <div key={`${x}-${y}`} style={{
                              position: 'relative',
                              background: 'var(--bg-elevated)',
                              border: '1px solid #2a2a2a',
                              borderRadius: '1px',
                            }}>
                              {cell.number && (
                                <span style={{ position: 'absolute', top: '0px', left: '1px', fontSize: '7px', color: '#666', fontFamily: 'var(--mono)', lineHeight: 1 }}>
                                  {cell.number}
                                </span>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#666', letterSpacing: '0.12em', marginBottom: '6px' }}>INDICES</div>
                      {words.map((w, i) => (
                        <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '11px', color: '#888', marginBottom: '4px', lineHeight: 1.5 }}>
                          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', minWidth: '18px' }}>{i + 1}.</span>
                          <span style={{ flex: 1 }}>{w.clue} <span style={{ color: '#444' }}>({w.word.length})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ajoutez des mots pour générer la grille.</div>
                )}
              </div>
            </div>
          )
        }
        // reorder
        const items = b.items || []
        const shuffled = [...items].sort(() => Math.random() - 0.5)
        return (
          <div style={previewBox}>
            {label('🔀 APERÇU RÉORDONNER JOUEUR')}
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{b.instruction}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {shuffled.map((item, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid #222', borderRadius: '5px', fontSize: '12px', color: '#ddd', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--border-strong)', fontSize: '11px' }}>⠿</span>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#444', fontStyle: 'italic' }}>
                (les items sont mélangés pour le joueur)
              </div>
            </div>
          </div>
        )
      }

      case 'text':
        return (
          <div style={previewBox}>
            {label('📝 APERÇU TEXTE JOUEUR')}
            <div style={{ padding: '18px 20px' }}>
              {b.heading && <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px', color: '#fff' }}>{b.heading}</h3>}
              <div style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{b.content}</div>
            </div>
          </div>
        )

      case 'video':
        return (
          <div style={previewBox}>
            {label('🎬 APERÇU VIDÉO JOUEUR')}
            <div style={{ padding: '18px 20px' }}>
              {b.url ? (
                <div style={{ aspectRatio: '16/9', background: 'var(--bg-elevated)', border: '1px solid #222', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '28px' }}>▶</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '200px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.url}</div>
                </div>
              ) : (
                <div style={{ color: '#444', fontSize: '12px', fontStyle: 'italic' }}>Aucune URL configurée</div>
              )}
              {b.caption && <div style={{ marginTop: '8px', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>{b.caption}</div>}
            </div>
          </div>
        )

      case 'photo':
        return (
          <div style={previewBox}>
            {label('🖼️ APERÇU PHOTO JOUEUR')}
            <div style={{ padding: '14px' }}>
              {b.src ? (
                <div style={{ position: 'relative' }}>
                  <img src={b.src} alt={b.alt} style={{ width: '100%', borderRadius: '5px', display: 'block' }} />
                  {(b.zones || []).map((z) => (
                    <div key={z.id} style={{ position: 'absolute', left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`, border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '4px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }} title={z.label} />
                  ))}
                </div>
              ) : (
                <div style={{ color: '#444', fontSize: '12px', fontStyle: 'italic' }}>Aucune image configurée</div>
              )}
            </div>
          </div>
        )

      default:
        return <div style={{ padding: '20px', color: '#444', fontSize: '12px' }}>Aperçu non disponible</div>
    }
  }

  const renderEditor = () => {
    if (!selectedBlock) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '14px', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', opacity: 0.2 }}>✏️</div>
          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Aucun bloc sélectionné</div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '320px', opacity: 0.7 }}>
            Cliquez sur un bloc dans le flux pour l'éditer, ou ajoutez-en un nouveau depuis la palette à gauche.
          </div>
        </div>
      )
    }

    const props = { block: selectedBlock, onChange: (u) => updateBlock(selectedBlock.id, u) }
    const color = TYPE_COLORS[selectedBlock.type] || 'var(--text-muted)'
    const bt = BLOCK_TYPES.find(b => b.type === selectedBlock.type)
    const blockIndex = blocks.findIndex(b => b.id === selectedId) + 1

    let specificEditor = null
    switch (selectedBlock.type) {
      case 'email':    specificEditor = <EmailEditor {...props} />;    break
      case 'photo':    specificEditor = <PhotoEditor {...props} />;    break
      case 'video':    specificEditor = <VideoEditor {...props} />;    break
      case 'quiz':     specificEditor = <QuizEditor {...props} />;     break
      case 'puzzle':   specificEditor = <PuzzleEditor {...props} />;   break
      case 'text':     specificEditor = <TextEditor {...props} />;     break
      case 'decision': specificEditor = <DecisionEditor {...props} />; break
      default: return null
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Editor header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', background: `linear-gradient(135deg, ${color}10, transparent)`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: color + '18', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            {bt?.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '2px' }}>
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '17px', color: 'var(--text)', fontWeight: 600 }}>{bt?.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                BLOC #{blockIndex}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{bt?.desc}</div>
          </div>
        </div>

        <div style={{ padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Chapter info — common to all block types */}
          <ChapterInfoEditor block={selectedBlock} onChange={(u) => updateBlock(selectedBlock.id, u)} defaultIcon={bt?.icon} defaultLabel={bt?.label} />

          <div style={{ height: '1px', background: 'var(--border)' }} />

          {specificEditor}

          {/* Explanations shown to the player after they answer */}
          <BlockExplanationEditor block={selectedBlock} onChange={(u) => updateBlock(selectedBlock.id, u)} />

          {/* Block-specific audio (SFX / voice-over played during this chapter) */}
          <div style={{ marginTop: '12px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AudioPanel
              label="🔊 AUDIO DU BLOC (SFX / VOIX-OFF)"
              url={selectedBlock.audioUrl}
              onUrlChange={(v) => updateBlock(selectedBlock.id, { ...selectedBlock, audioUrl: v })}
              volume={selectedBlock.audioVolume ?? 80}
              onVolumeChange={(v) => updateBlock(selectedBlock.id, { ...selectedBlock, audioVolume: v })}
              help="Joué pendant ce chapitre uniquement. Idéal pour une voix-off ou un effet sonore."
              maxSizeMB={8}
            />

            {/* Ambient override — reduce/mute the scenario general ambient on this block */}
            <div style={{
              padding: '14px 16px',
              background: 'rgba(37, 99, 235, 0.04)',
              border: '1px solid rgba(37, 99, 235, 0.18)',
              borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px' }}>🎚</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#60a5fa', letterSpacing: '0.14em', fontWeight: 700, flex: 1 }}>
                  AMBIANCE GÉNÉRALE SUR CE BLOC
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
                  <input
                    type="checkbox"
                    checked={selectedBlock.ambientMuted === true}
                    onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock, ambientMuted: e.target.checked })}
                    style={{ accentColor: 'var(--red)', cursor: 'pointer' }}
                  />
                  COUPER
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: selectedBlock.ambientMuted ? 0.35 : 1, pointerEvents: selectedBlock.ambientMuted ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', minWidth: '50px' }}>
                  VOLUME
                </span>
                <input
                  type="range"
                  min="0" max="100"
                  value={selectedBlock.ambientVolume ?? 100}
                  onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock, ambientVolume: Number(e.target.value) })}
                  style={{ flex: 1, accentColor: '#60a5fa', cursor: 'pointer' }}
                />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#60a5fa', fontWeight: 700, minWidth: '32px', textAlign: 'right' }}>
                  {selectedBlock.ambientVolume ?? 100}%
                </span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                100% = son normal · 30% = ambiance discrète · 0% ou "Couper" = silence complet pendant ce chapitre.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const diffLabel = DIFFICULTIES.find(d => d.v === meta.difficulty)?.l || meta.difficulty

  return (
    <div className="scenario-builder-page" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', color: 'var(--text)', position: 'relative' }}>
      <div className="aurora-bg" style={{ opacity: 0.35 }} />

      {/* ── TOP BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', background: 'var(--glass-bg-strong)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button type="button" onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 12px', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', flexShrink: 0 }}>
          ← Retour
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={meta.titleFr}
            onChange={(e) => updateMeta('titleFr', e.target.value)}
            placeholder="Titre du scénario..."
            style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'var(--font-title)', fontSize: '16px', width: '100%', outline: 'none', padding: 0 }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', background: 'var(--bg-muted)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '3px' }}>{meta.category}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', background: 'var(--bg-muted)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '3px' }}>{diffLabel}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', background: 'var(--bg-muted)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '3px' }}>{meta.duration}min</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', opacity: 0.5 }}>{blocks.length} bloc{blocks.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {saved && (
          <span className="tag tag-success" style={{ fontSize: '11px' }}>
            ✓ Sauvegardé
          </span>
        )}

        <ThemeToggle />

        <button type="button" onClick={() => handleSave('draft')} className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '12px', flexShrink: 0 }}>
          💾 Brouillon
        </button>
        <button type="button" onClick={() => handleSave('published')} className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '12px', flexShrink: 0 }}>
          🚀 Publier
        </button>
      </div>

      {/* ── 3-COLUMN LAYOUT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: META + PALETTE ── */}
        <div style={{ width: '280px', flexShrink: 0, background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Meta summary card */}
          <div style={{ flexShrink: 0, padding: '18px 18px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>⚙ INFOS SCÉNARIO</span>
              <button type="button" onClick={() => setMetaModalOpen(true)}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '10px', fontFamily: 'var(--mono)', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.05em', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
              >
                ✏ ÉDITER
              </button>
            </div>
            <button type="button" onClick={() => setMetaModalOpen(true)}
              style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ fontSize: '15px', color: meta.titleFr ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600, lineHeight: 1.3, wordBreak: 'break-word', fontFamily: 'var(--font-title)' }}>
                {meta.titleFr || 'Titre non défini'}
              </div>
              {meta.description && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {meta.description}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'var(--bg-muted)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.02em' }}>{meta.category}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'var(--bg-muted)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.02em' }}>{DIFFICULTIES.find(d => d.v === meta.difficulty)?.l || meta.difficulty}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', background: 'var(--bg-muted)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.02em' }}>{meta.duration} min</span>
              </div>
            </button>
          </div>

          {/* Block palette */}
          <div style={{ flex: 1, overflow: 'auto', padding: '18px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '12px' }}>+ AJOUTER UN BLOC</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {BLOCK_TYPES.map((bt) => {
                const color = TYPE_COLORS[bt.type]
                return (
                  <button key={bt.type} type="button" onClick={() => addBlock(bt.type)}
                    style={{ padding: '12px 14px', background: 'transparent', border: `1px solid #181818`, color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '12px' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.background = color + '08'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: color + '15', border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{bt.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'inherit', marginBottom: '2px' }}>{bt.label}</div>
                      <div style={{ fontSize: '11px', opacity: 0.65, lineHeight: 1.3 }}>{bt.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── CENTER: CANVAS ── */}
        <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)', padding: '20px' }}>
          {blocks.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '40px', opacity: 0.2 }}>🧱</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Scénario vide</div>
              <div style={{ fontSize: '11px', opacity: 0.6, textAlign: 'center', maxWidth: '240px', lineHeight: 1.5 }}>
                Ajoutez des blocs depuis la palette à gauche pour construire votre scénario
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {BLOCK_TYPES.map(bt => (
                  <button key={bt.type} type="button" onClick={() => addBlock(bt.type)}
                    style={{ padding: '6px 12px', background: 'var(--bg-muted)', border: '1px solid #1a1a1a', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', borderRadius: '5px' }}>
                    {bt.icon} {bt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Flow header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>FLUX DU SCÉNARIO</div>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)' }}>{blocks.length} bloc{blocks.length !== 1 ? 's' : ''}</div>
              </div>

              {blocks.map((b, i) => (
                <BlockCard
                  key={b.id}
                  block={b}
                  index={i}
                  selected={selectedId === b.id}
                  total={blocks.length}
                  onClick={() => setSelectedId(b.id)}
                  onMoveUp={() => moveBlock(b.id, -1)}
                  onMoveDown={() => moveBlock(b.id, 1)}
                  onDelete={() => deleteBlock(b.id)}
                  onDuplicate={() => duplicateBlock(b.id)}
                />
              ))}

              {/* Add block at bottom */}
              <div style={{ paddingTop: '4px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '6px' }}>AJOUTER À LA SUITE</div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {BLOCK_TYPES.map(bt => (
                    <button key={bt.type} type="button" onClick={() => addBlock(bt.type)}
                      style={{ padding: '5px 10px', background: 'transparent', border: '1px dashed #1f1f1f', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '4px', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = TYPE_COLORS[bt.type] + '50'; e.currentTarget.style.color = 'var(--text)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                      {bt.icon} {bt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: EDITOR / PREVIEW ── */}
        <div style={{ width: 'min(640px, 45vw)', minWidth: '480px', flexShrink: 0, background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border)', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Tab toggle */}
          {selectedBlock && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-elevated)' }}>
              <button
                type="button"
                onClick={() => setPanelTab('edit')}
                style={{
                  flex: 1, padding: '16px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontFamily: 'var(--mono)', letterSpacing: '0.1em', fontWeight: 500,
                  color: panelTab === 'edit' ? 'var(--text)' : 'var(--text-muted)',
                  borderBottom: panelTab === 'edit' ? '2px solid var(--red)' : '2px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                ✏ ÉDITER
              </button>
              <button
                type="button"
                onClick={() => setPanelTab('preview')}
                style={{
                  flex: 1, padding: '16px 0', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontFamily: 'var(--mono)', letterSpacing: '0.1em', fontWeight: 500,
                  color: panelTab === 'preview' ? 'var(--text)' : 'var(--text-muted)',
                  borderBottom: panelTab === 'preview' ? '2px solid #3b82f6' : '2px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                👁 APERÇU JOUEUR
              </button>
            </div>
          )}
          {panelTab === 'preview' && selectedBlock
            ? (
              <div className="force-dark" style={{ background: 'var(--bg)', flex: 1, overflow: 'auto' }}>
                <BlockPlayerPreview block={selectedBlock} />
              </div>
            )
            : renderEditor()
          }
        </div>

      </div>

      {/* ── INFOS SCÉNARIO MODAL ── */}
      <Modal
        isOpen={metaModalOpen}
        onClose={() => setMetaModalOpen(false)}
        size="lg"
        title={initialData ? 'Éditer les infos du scénario' : 'Nouveau scénario'}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); setMetaModalOpen(false) }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Renseignez les informations principales du scénario. Vous pourrez toujours les modifier par la suite depuis la barre latérale.
          </p>

          <div>
            <label style={metaModalLabelStyle}>
              TITRE (FR) <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <input
              className="input-dark"
              value={meta.titleFr}
              onChange={(e) => updateMeta('titleFr', e.target.value)}
              placeholder="Ex. Bureau Compromis"
              required
              autoFocus
            />
          </div>

          <div>
            <label style={metaModalLabelStyle}>TITLE (EN)</label>
            <input
              className="input-dark"
              value={meta.titleEn}
              onChange={(e) => updateMeta('titleEn', e.target.value)}
              placeholder="Ex. Compromised Desktop"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={metaModalLabelStyle}>CATÉGORIE</label>
              <select
                value={meta.category}
                onChange={(e) => updateMeta('category', e.target.value)}
                style={metaModalSelectStyle}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={metaModalLabelStyle}>NIVEAU</label>
              <select
                value={meta.difficulty}
                onChange={(e) => updateMeta('difficulty', e.target.value)}
                style={metaModalSelectStyle}
              >
                {DIFFICULTIES.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={metaModalLabelStyle}>DURÉE (minutes)</label>
            <input
              className="input-dark"
              type="number"
              min="1"
              max="120"
              value={meta.duration}
              onChange={(e) => updateMeta('duration', e.target.value)}
              style={{ maxWidth: '200px' }}
            />
          </div>

          <div>
            <label style={metaModalLabelStyle}>DESCRIPTION</label>
            <textarea
              className="input-dark"
              rows={4}
              value={meta.description}
              onChange={(e) => updateMeta('description', e.target.value)}
              placeholder="Décrivez le scénario en quelques phrases…"
              style={{ resize: 'vertical', minHeight: '100px', fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Scenario-level ambient audio */}
          <AudioPanel
            label="🎼 AMBIANCE GÉNÉRALE DU SCÉNARIO (OPTIONNEL)"
            url={meta.audioUrl}
            onUrlChange={(v) => updateMeta('audioUrl', v)}
            volume={meta.audioVolume}
            onVolumeChange={(v) => updateMeta('audioVolume', v)}
            help="Joué en continu pendant tout le scénario. Chaque bloc peut réduire ou couper ce son."
            maxSizeMB={8}
          />

          <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setMetaModalOpen(false)}
              className="btn-secondary"
              style={{ padding: '10px 20px', justifyContent: 'center' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              ✓ Enregistrer les infos
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
