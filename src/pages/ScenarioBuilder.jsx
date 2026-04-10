import { useEffect, useRef, useState } from 'react'

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
  decision: '#eb2828',
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
  const color = TYPE_COLORS[block.type] || '#888'
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
              <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>{block.subject}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
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
            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '6px', fontStyle: block.question ? 'normal' : 'italic', color: block.question ? 'var(--text-light)' : 'var(--text-muted)' }}>
              {block.question || 'Aucune question'}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(block.options || []).map((o, i) => (
                <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: o.correct ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${o.correct ? '#22c55e40' : '#ffffff15'}`, color: o.correct ? '#22c55e' : 'var(--text-muted)' }}>
                  {o.correct ? '✓ ' : ''}{o.text}
                </span>
              ))}
            </div>
          </div>
        )
      case 'puzzle': {
        const pIcons = { reorder: '🔀', memory: '🃏', crossword: '📐' }
        const pLabels = { reorder: 'Réordonner', memory: 'Mémory', crossword: 'Mots croisés' }
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
            {block.heading && <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', marginBottom: '3px' }}>{block.heading}</div>}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {block.content || <em>Aucun contenu</em>}
            </div>
          </div>
        )
      case 'decision':
        return (
          <div>
            <div style={{ fontSize: '12px', color: block.question ? 'var(--text-light)' : 'var(--text-muted)', fontStyle: block.question ? 'normal' : 'italic', marginBottom: '6px' }}>
              {block.question || 'Aucune question'}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(block.choices || []).map((c, i) => (
                <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: c.correct ? 'rgba(34,197,94,0.12)' : 'rgba(235,40,40,0.08)', border: `1px solid ${c.correct ? '#22c55e40' : 'rgba(235,40,40,0.25)'}`, color: c.correct ? '#22c55e' : '#eb282880' }}>
                  {c.correct ? '✓ ' : ''}{c.text}
                </span>
              ))}
            </div>
          </div>
        )
      default: return null
    }
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: selected ? '#0c0c0c' : hovered ? '#0a0a0a' : '#070707',
        border: `1px solid ${selected ? color + '60' : hovered ? '#222' : '#141414'}`,
        borderLeft: `3px solid ${selected ? color : hovered ? color + '60' : color + '25'}`,
        borderRadius: '8px',
        padding: '12px 12px 12px 14px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: selected ? `0 0 0 1px ${color}15, 0 2px 12px ${color}10` : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: color + '18', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: 'var(--mono)', color, flexShrink: 0, fontWeight: 600 }}>
          {index + 1}
        </div>
        <span style={{ fontSize: '15px', lineHeight: 1 }}>{bt?.icon}</span>
        <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color, textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, fontWeight: 500 }}>
          {bt?.label}
        </span>
        {block.audioUrl && <span title="Audio de fond actif" style={{ fontSize: '11px' }}>🎵</span>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '2px', opacity: hovered || selected ? 1 : 0.3, transition: 'opacity 0.15s' }} onClick={e => e.stopPropagation()}>
          <button type="button" onClick={onDuplicate} title="Dupliquer"
            style={{ background: 'transparent', border: '1px solid #ffffff15', color: '#ffffff50', width: '22px', height: '22px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ⧉
          </button>
          <button type="button" onClick={onMoveUp} disabled={index === 0}
            style={{ background: 'transparent', border: '1px solid #ffffff15', color: index === 0 ? '#ffffff20' : '#ffffff50', width: '22px', height: '22px', cursor: index === 0 ? 'default' : 'pointer', borderRadius: '3px', fontSize: '10px' }}>
            ↑
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1}
            style={{ background: 'transparent', border: '1px solid #ffffff15', color: index === total - 1 ? '#ffffff20' : '#ffffff50', width: '22px', height: '22px', cursor: index === total - 1 ? 'default' : 'pointer', borderRadius: '3px', fontSize: '10px' }}>
            ↓
          </button>
          <button type="button" onClick={onDelete} title="Supprimer"
            style={{ background: 'transparent', border: '1px solid rgba(235,40,40,0.25)', color: 'rgba(235,40,40,0.5)', width: '22px', height: '22px', cursor: 'pointer', borderRadius: '3px', fontSize: '10px' }}>
            ✕
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div style={{ paddingLeft: '30px' }}>
        {renderPreview()}
      </div>

      {/* Connector line */}
      {index < total - 1 && (
        <div style={{ position: 'absolute', bottom: '-16px', left: '23px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '16px', zIndex: 1 }}>
          <div style={{ width: '1px', flex: 1, background: 'linear-gradient(to bottom, #1f1f1f, #141414)' }} />
        </div>
      )}
    </div>
  )
}

// ─── SHARED STYLES ─────────────────────────────────────────────────────────────

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--mono)',
  fontSize: '9px',
  color: 'var(--text-muted)',
  letterSpacing: '0.1em',
  marginBottom: '4px',
}

const inputBase = {
  width: '100%',
  padding: '6px 8px',
  background: '#0d0d0d',
  border: '1px solid var(--border)',
  color: 'var(--text-light)',
  fontSize: '11px',
  borderRadius: '3px',
  boxSizing: 'border-box',
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-dark"
        style={{ fontSize: '12px', padding: '6px 8px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  )
}

// ─── EMAIL EDITOR ──────────────────────────────────────────────────────────────

function EmailEditor({ block, onChange }) {
  const [linkHovered, setLinkHovered] = useState(false)
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateLink = (k, v) => onChange({ ...block, link: { ...block.link, [k]: v } })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Field label="NOM EXPÉDITEUR" value={block.senderName} onChange={(v) => update('senderName', v)} />
        <Field label="EMAIL EXPÉDITEUR" value={block.from} onChange={(v) => update('from', v)} />
      </div>
      <Field label="DESTINATAIRE" value={block.to} onChange={(v) => update('to', v)} placeholder="{{employee}}" />
      <Field label="OBJET" value={block.subject} onChange={(v) => update('subject', v)} />

      <div>
        <label style={labelStyle}>MESSAGE</label>
        <textarea
          value={block.body}
          onChange={(e) => update('body', e.target.value)}
          rows={4}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)' }}
        />
      </div>

      <div style={{ padding: '10px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '6px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: '#3b82f6', marginBottom: '8px', letterSpacing: '0.1em' }}>🔗 LIEN PIÉGÉ</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
          <Field label="TEXTE DU LIEN" value={block.link.text} onChange={(v) => updateLink('text', v)} />
          <Field label="URL AFFICHÉE (hover)" value={block.link.hover} onChange={(v) => updateLink('hover', v)} />
        </div>
        <Field label="URL RÉELLE (destination)" value={block.link.real} onChange={(v) => updateLink('real', v)} />

        <div style={{ marginTop: '6px', padding: '8px', background: '#0a0a0a', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', marginRight: '8px' }}>Aperçu :</span>
          <span
            style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            {block.link.text}
          </span>
          {linkHovered && (
            <div style={{ display: 'inline-block', marginLeft: '8px', background: '#1a1a1a', padding: '2px 8px', fontSize: '9px', color: '#22c55e', borderRadius: '3px' }}>
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
  const fileRef = useRef(null)
  const [addingZone, setAddingZone] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (k, v) => onChange({ ...block, [k]: v })

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

  const handleImageClick = (e) => {
    if (!addingZone || !imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    update('zones', [...block.zones, { id: Date.now(), x: x - 5, y: y - 5, w: 12, h: 12, label: 'Zone', correct: true }])
    setAddingZone(false)
  }

  const updateZone = (id, k, v) => update('zones', block.zones.map((z) => (z.id === id ? { ...z, [k]: v } : z)))
  const removeZone = (id) => update('zones', block.zones.filter((z) => z.id !== id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => !loading && fileRef.current?.click()}
          style={{ padding: '6px 14px', background: loading ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', color: '#8b5cf6', cursor: loading ? 'default' : 'pointer', fontSize: '11px', borderRadius: '4px', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Compression...' : '📂 Choisir une image'}
        </button>
        {block.src && !loading && (
          <button type="button" onClick={() => setAddingZone(!addingZone)}
            style={{ padding: '6px 14px', background: addingZone ? 'rgba(139,92,246,0.2)' : 'transparent', border: `1px solid ${addingZone ? '#8b5cf6' : 'var(--border-subtle)'}`, color: addingZone ? '#8b5cf6' : 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', borderRadius: '4px' }}>
            {addingZone ? '✕ Annuler' : '+ Ajouter zone'}
          </button>
        )}
        {block.src && !loading && (
          <button type="button" onClick={() => update('src', '')}
            style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(235,40,40,0.3)', color: 'var(--red)', cursor: 'pointer', fontSize: '11px', borderRadius: '4px' }}>
            ✕ Retirer
          </button>
        )}
        {addingZone && <span style={{ fontSize: '10px', color: '#8b5cf6', fontStyle: 'italic' }}>Cliquez sur l'image pour poser une zone</span>}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>

      {loading && (
        <div style={{ padding: '16px', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '6px', textAlign: 'center', fontSize: '11px', color: '#8b5cf6', background: 'rgba(139,92,246,0.05)' }}>
          ⏳ Compression de l'image en cours...
        </div>
      )}

      {!loading && block.src && (
        <div style={{ position: 'relative', border: `2px solid ${addingZone ? '#8b5cf6' : 'var(--border-subtle)'}`, borderRadius: '6px', overflow: 'hidden', cursor: addingZone ? 'crosshair' : 'default' }} onClick={handleImageClick}>
          <img ref={imgRef} src={block.src} alt="preview" style={{ width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover' }} />
          {block.zones.map((z) => (
            <div key={z.id} style={{ position: 'absolute', left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`, border: `1px solid ${z.correct ? '#22c55e' : 'var(--red)'}`, background: z.correct ? 'rgba(34,197,94,0.15)' : 'rgba(235,40,40,0.15)', borderRadius: '3px' }}>
              <span style={{ position: 'absolute', top: '-14px', left: 0, fontSize: '8px', background: z.correct ? '#22c55e' : 'var(--red)', color: '#fff', padding: '0 4px', borderRadius: '2px', whiteSpace: 'nowrap' }}>{z.label}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && !block.src && (
        <div onClick={() => fileRef.current?.click()} style={{ padding: '30px', border: '1px dashed var(--border-subtle)', borderRadius: '6px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>
          🖼️ Cliquez pour choisir une image
        </div>
      )}

      {block.zones.map((z) => (
        <div key={z.id} style={{ display: 'flex', gap: '4px', fontSize: '11px', alignItems: 'center' }}>
          <input value={z.label} onChange={(e) => updateZone(z.id, 'label', e.target.value)} style={{ flex: 1, padding: '4px 6px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '10px', borderRadius: '3px' }} />
          <button type="button" onClick={() => updateZone(z.id, 'correct', !z.correct)} style={{ padding: '4px 8px', background: z.correct ? 'rgba(34,197,94,0.12)' : 'rgba(235,40,40,0.1)', border: `1px solid ${z.correct ? '#22c55e' : 'var(--red)'}`, color: z.correct ? '#22c55e' : 'var(--red)', cursor: 'pointer', fontSize: '10px', borderRadius: '3px' }}>
            {z.correct ? '✓ Correct' : '✕ Faux'}
          </button>
          <button type="button" onClick={() => removeZone(z.id)} style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '3px' }}>✕</button>
        </div>
      ))}
    </div>
  )
}

// ─── VIDEO EDITOR ──────────────────────────────────────────────────────────────

function VideoEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Field label="URL VIDÉO (YouTube, Vimeo...)" value={block.url} onChange={(v) => update('url', v)} placeholder="https://youtube.com/watch?v=..." />
      <Field label="LÉGENDE" value={block.caption} onChange={(v) => update('caption', v)} placeholder="Description affichée sous la vidéo" />
      {block.url && (
        <div style={{ padding: '8px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '4px', fontSize: '10px', color: '#ec4899' }}>
          🎬 Vidéo configurée
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <label style={labelStyle}>QUESTION</label>
        <textarea value={block.question} onChange={(e) => update('question', e.target.value)} rows={2}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      </div>

      <div>
        <div style={{ ...labelStyle, marginBottom: '6px' }}>OPTIONS — cocher les réponses correctes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {block.options.map((o, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button type="button" onClick={() => toggleCorrect(i)} style={{ width: '26px', height: '26px', background: o.correct ? 'rgba(34,197,94,0.18)' : '#0d0d0d', border: `2px solid ${o.correct ? '#22c55e' : 'var(--border)'}`, color: o.correct ? '#22c55e' : 'transparent', cursor: 'pointer', borderRadius: '50%', fontSize: '12px', flexShrink: 0 }}>
                {o.correct ? '✓' : ''}
              </button>
              <input value={o.text} onChange={(e) => updateOption(i, 'text', e.target.value)} placeholder={`Option ${i + 1}`}
                style={{ flex: 1, padding: '6px 8px', background: o.correct ? 'rgba(34,197,94,0.05)' : '#0d0d0d', border: `1px solid ${o.correct ? '#22c55e50' : 'var(--border)'}`, color: 'var(--text-light)', fontSize: '11px', borderRadius: '4px' }} />
              <button type="button" onClick={() => removeOption(i)} disabled={block.options.length <= 2}
                style={{ width: '22px', height: '22px', background: 'transparent', border: '1px solid var(--border-subtle)', color: block.options.length <= 2 ? 'var(--border)' : 'var(--red)', cursor: block.options.length <= 2 ? 'default' : 'pointer', borderRadius: '3px', fontSize: '12px', flexShrink: 0 }}>
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addOption} style={{ marginTop: '6px', padding: '5px 12px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '4px', width: '100%' }}>
          + Ajouter une option
        </button>
      </div>

      <div>
        <label style={labelStyle}>EXPLICATION (affichée après réponse)</label>
        <textarea value={block.explanation} onChange={(e) => update('explanation', e.target.value)} rows={2} placeholder="Pourquoi cette réponse ?"
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      </div>
    </div>
  )
}

// ─── PUZZLE EDITOR ─────────────────────────────────────────────────────────────

const PUZZLE_TYPES = [
  { value: 'reorder',   label: '🔀 Réordonner',  desc: 'Remettre dans l\'ordre' },
  { value: 'memory',    label: '🃏 Mémory',       desc: 'Associer des paires' },
  { value: 'crossword', label: '📐 Mots croisés', desc: 'Compléter la grille' },
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

  const iStyle = { flex: 1, padding: '6px 8px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '11px', borderRadius: '4px' }
  const rmBtn = (dis, fn) => (
    <button type="button" onClick={fn} disabled={dis} style={{ width: '22px', height: '22px', background: 'transparent', border: '1px solid var(--border-subtle)', color: dis ? 'var(--border)' : 'var(--red)', cursor: dis ? 'default' : 'pointer', borderRadius: '3px', fontSize: '12px', flexShrink: 0 }}>×</button>
  )
  const addBtn = (label, fn) => (
    <button type="button" onClick={fn} style={{ marginTop: '4px', padding: '5px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '4px', width: '100%' }}>{label}</button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={labelStyle}>TYPE DE PUZZLE</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PUZZLE_TYPES.map((pt) => (
            <button key={pt.value} type="button" onClick={() => update('puzzleType', pt.value)} style={{ flex: 1, padding: '8px 4px', background: block.puzzleType === pt.value ? 'rgba(16,185,129,0.12)' : 'transparent', border: `1px solid ${block.puzzleType === pt.value ? '#10b981' : 'var(--border)'}`, color: block.puzzleType === pt.value ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '5px', textAlign: 'center' }}>
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="INSTRUCTION" value={block.instruction} onChange={(v) => update('instruction', v)} placeholder="Consigne affichée au joueur" />

      {block.puzzleType === 'reorder' && (
        <div>
          <label style={labelStyle}>ÉLÉMENTS À RÉORDONNER (dans le bon ordre)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', width: '18px', textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                <input value={item} onChange={(e) => updateItem(i, e.target.value)} style={iStyle} />
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: i === 0 ? 'var(--border)' : 'var(--text-muted)', width: '22px', height: '22px', cursor: i === 0 ? 'default' : 'pointer', fontSize: '11px', borderRadius: '3px' }}>↑</button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: i === items.length - 1 ? 'var(--border)' : 'var(--text-muted)', width: '22px', height: '22px', cursor: i === items.length - 1 ? 'default' : 'pointer', fontSize: '11px', borderRadius: '3px' }}>↓</button>
                {rmBtn(items.length <= 2, () => removeItem(i))}
              </div>
            ))}
          </div>
          {addBtn('+ Ajouter un élément', addItem)}
        </div>
      )}

      {block.puzzleType === 'memory' && (
        <div>
          <label style={labelStyle}>PAIRES DE CARTES — Carte A ↔ Carte B</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {pairs.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', width: '18px', textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                <input value={p.a} onChange={(e) => updatePair(i, 'a', e.target.value)} placeholder="Carte A" style={{ ...iStyle, borderColor: 'rgba(99,102,241,0.4)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0 }}>↔</span>
                <input value={p.b} onChange={(e) => updatePair(i, 'b', e.target.value)} placeholder="Carte B" style={{ ...iStyle, borderColor: 'rgba(99,102,241,0.25)' }} />
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {words.map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', width: '18px', textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                <input value={w.word} onChange={(e) => updateWord(i, 'word', e.target.value)} placeholder="MOT" style={{ ...iStyle, flex: '0 0 100px', textTransform: 'uppercase', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Field label="TITRE (optionnel)" value={block.heading} onChange={(v) => update('heading', v)} placeholder="Titre de la section" />
      <div>
        <label style={labelStyle}>CONTENU</label>
        <textarea value={block.content} onChange={(e) => update('content', e.target.value)} rows={6} placeholder="Rédigez votre contenu ici..."
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.6 }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <label style={labelStyle}>QUESTION / SITUATION</label>
        <textarea value={block.question} onChange={(e) => update('question', e.target.value)} rows={2}
          style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      </div>

      <div>
        <label style={labelStyle}>CHOIX — cocher le/les bons choix</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {block.choices.map((c, i) => (
            <div key={i} style={{ padding: '8px', background: c.correct ? 'rgba(34,197,94,0.04)' : 'rgba(235,40,40,0.04)', border: `1px solid ${c.correct ? 'rgba(34,197,94,0.25)' : 'rgba(235,40,40,0.15)'}`, borderRadius: '5px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '5px', alignItems: 'center' }}>
                <button type="button" onClick={() => updateChoice(i, 'correct', !c.correct)}
                  style={{ width: '24px', height: '24px', background: c.correct ? 'rgba(34,197,94,0.18)' : 'rgba(235,40,40,0.1)', border: `2px solid ${c.correct ? '#22c55e' : 'var(--red)'}`, color: c.correct ? '#22c55e' : 'var(--red)', cursor: 'pointer', borderRadius: '4px', fontSize: '11px', flexShrink: 0 }}>
                  {c.correct ? '✓' : '✕'}
                </button>
                <input value={c.text} onChange={(e) => updateChoice(i, 'text', e.target.value)} placeholder={`Choix ${i + 1}`}
                  style={{ flex: 1, padding: '5px 8px', background: '#0d0d0d', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '11px', borderRadius: '3px' }} />
                <button type="button" onClick={() => removeChoice(i)} disabled={block.choices.length <= 2}
                  style={{ width: '22px', height: '22px', background: 'transparent', border: '1px solid var(--border-subtle)', color: block.choices.length <= 2 ? 'var(--border)' : 'var(--red)', cursor: block.choices.length <= 2 ? 'default' : 'pointer', borderRadius: '3px', fontSize: '12px', flexShrink: 0 }}>
                  ×
                </button>
              </div>
              <input value={c.feedback} onChange={(e) => updateChoice(i, 'feedback', e.target.value)} placeholder="Feedback affiché après ce choix..."
                style={{ width: '100%', padding: '4px 8px', background: '#0a0a0a', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '10px', borderRadius: '3px', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <button type="button" onClick={addChoice} style={{ marginTop: '6px', padding: '5px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '4px', width: '100%' }}>
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
  } : { titleFr: '', titleEn: '', category: 'Phishing', difficulty: 'intermediate', duration: '15', description: '' })

  const [blocks, setBlocks] = useState(
    initialData?.blocks?.map((b, i) => ({ ...b, id: b.id ?? (Date.now() + i) })) || []
  )
  const [selectedId, setSelectedId] = useState(null)
  const [metaOpen, setMetaOpen] = useState(true)
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
    onSave({ ...meta, blocks, status, id: initialData?.id || Date.now() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selectedBlock = blocks.find((b) => b.id === selectedId)

  const renderEditor = () => {
    if (!selectedBlock) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '8px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', opacity: 0.3 }}>←</div>
          <div style={{ fontSize: '11px' }}>Sélectionnez un bloc<br /><span style={{ fontSize: '10px', opacity: 0.6 }}>ou ajoutez-en un depuis la palette</span></div>
        </div>
      )
    }

    const props = { block: selectedBlock, onChange: (u) => updateBlock(selectedBlock.id, u) }
    const color = TYPE_COLORS[selectedBlock.type] || '#888'
    const bt = BLOCK_TYPES.find(b => b.type === selectedBlock.type)

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Editor header */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', background: color + '08', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{bt?.icon}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{bt?.label}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Bloc #{blocks.findIndex(b => b.id === selectedId) + 1}
          </span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {specificEditor}

          {/* Audio */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <label style={labelStyle}>🎵 AUDIO DE FOND (URL .mp3 / .ogg)</label>
            <input
              value={selectedBlock.audioUrl || ''}
              onChange={(e) => updateBlock(selectedBlock.id, { ...selectedBlock, audioUrl: e.target.value })}
              placeholder="https://exemple.com/audio.mp3"
              style={{ ...inputBase }}
            />
          </div>
        </div>
      </div>
    )
  }

  const diffLabel = DIFFICULTIES.find(d => d.v === meta.difficulty)?.l || meta.difficulty

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: 'var(--text-light)' }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: '#060606', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <button type="button" onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '5px 12px', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', flexShrink: 0 }}>
          ← Retour
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={meta.titleFr}
            onChange={(e) => updateMeta('titleFr', e.target.value)}
            placeholder="Titre du scénario..."
            style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', fontFamily: 'var(--font-title)', fontSize: '16px', width: '100%', outline: 'none', padding: 0 }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '3px' }}>{meta.category}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '3px' }}>{diffLabel}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '3px' }}>{meta.duration}min</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', opacity: 0.5 }}>{blocks.length} bloc{blocks.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {saved && <span style={{ fontSize: '10px', color: '#22c55e', fontFamily: 'var(--mono)' }}>✓ Sauvegardé</span>}

        <button type="button" onClick={() => handleSave('draft')}
          style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', borderRadius: '4px', flexShrink: 0 }}>
          💾 Brouillon
        </button>
        <button type="button" onClick={() => handleSave('published')} className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '11px', flexShrink: 0 }}>
          🚀 Publier
        </button>
      </div>

      {/* ── 3-COLUMN LAYOUT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: META + PALETTE ── */}
        <div style={{ width: '220px', flexShrink: 0, background: '#070707', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Meta accordion */}
          <div style={{ flexShrink: 0 }}>
            <button type="button" onClick={() => setMetaOpen(o => !o)}
              style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', fontFamily: 'var(--mono)', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', letterSpacing: '0.1em' }}>
              <span>⚙ INFOS SCÉNARIO</span>
              <span style={{ fontSize: '9px' }}>{metaOpen ? '▲' : '▼'}</span>
            </button>

            {metaOpen && (
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <label style={labelStyle}>TITRE FR</label>
                  <input value={meta.titleFr} onChange={(e) => updateMeta('titleFr', e.target.value)} placeholder="Titre français" style={{ ...inputBase, fontSize: '11px' }} />
                </div>
                <div>
                  <label style={labelStyle}>TITLE EN</label>
                  <input value={meta.titleEn} onChange={(e) => updateMeta('titleEn', e.target.value)} placeholder="English title" style={{ ...inputBase, fontSize: '11px' }} />
                </div>
                <div>
                  <label style={labelStyle}>CATÉGORIE</label>
                  <select value={meta.category} onChange={(e) => updateMeta('category', e.target.value)} style={{ ...inputBase, fontSize: '11px' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={labelStyle}>NIVEAU</label>
                    <select value={meta.difficulty} onChange={(e) => updateMeta('difficulty', e.target.value)} style={{ ...inputBase, fontSize: '11px' }}>
                      {DIFFICULTIES.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>DURÉE (min)</label>
                    <input type="number" value={meta.duration} onChange={(e) => updateMeta('duration', e.target.value)} style={{ ...inputBase, fontSize: '11px' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>DESCRIPTION</label>
                  <textarea value={meta.description} onChange={(e) => updateMeta('description', e.target.value)} rows={2}
                    style={{ ...inputBase, resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '11px' }} />
                </div>
              </div>
            )}
          </div>

          {/* Block palette */}
          <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>+ AJOUTER UN BLOC</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              {BLOCK_TYPES.map((bt) => {
                const color = TYPE_COLORS[bt.type]
                return (
                  <button key={bt.type} type="button" onClick={() => addBlock(bt.type)}
                    style={{ padding: '8px 6px', background: 'transparent', border: `1px solid #1a1a1a`, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px', borderRadius: '5px', textAlign: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.background = color + '0a'; e.currentTarget.style.color = 'var(--text-light)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <div style={{ fontSize: '18px', marginBottom: '3px' }}>{bt.icon}</div>
                    <div style={{ fontSize: '9px', fontWeight: 500 }}>{bt.label}</div>
                    <div style={{ fontSize: '8px', opacity: 0.6, marginTop: '2px', lineHeight: 1.3 }}>{bt.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── CENTER: CANVAS ── */}
        <div style={{ flex: 1, overflow: 'auto', background: '#040404', padding: '20px' }}>
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
                    style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a1a', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', borderRadius: '5px' }}>
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
                <div style={{ flex: 1, height: '1px', background: '#111' }} />
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
                      onMouseEnter={e => { e.currentTarget.style.borderColor = TYPE_COLORS[bt.type] + '50'; e.currentTarget.style.color = 'var(--text-light)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                      {bt.icon} {bt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: EDITOR ── */}
        <div style={{ width: '320px', flexShrink: 0, background: '#070707', borderLeft: '1px solid var(--border-subtle)', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderEditor()}
        </div>

      </div>
    </div>
  )
}
