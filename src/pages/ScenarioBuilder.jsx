import { useEffect, useRef, useState } from 'react'

const BLOCK_TYPES = [
  { type: 'email', icon: '📧', label: 'Faux email' },
  { type: 'photo', icon: '🖼️', label: 'Photo + Zones' },
  { type: 'video', icon: '🎬', label: 'Vidéo' },
  { type: 'quiz', icon: '❓', label: 'Quiz' },
  { type: 'puzzle', icon: '🧩', label: 'Mini Puzzle' },
  { type: 'text', icon: '📝', label: 'Texte' },
  { type: 'decision', icon: '🔀', label: 'Décision' },
]

function makeBlock(type) {
  const id = Date.now() + Math.random()

  switch (type) {
    case 'email':
      return {
        id,
        type,
        senderName: 'PayPal Security',
        from: 'noreply@paypal-secure.com',
        to: '{{employee}}',
        subject: 'Action requise',
        body: 'Votre compte a été suspendu. Cliquez pour réactiver.',
        link: {
          text: 'Réactiver',
          hover: 'https://paypal.com',
          real: 'https://paypal-fake.ru',
        },
      }

    case 'photo':
      return { id, type, src: '', alt: 'Image', zones: [] }

    case 'video':
      return { id, type, url: '', caption: '' }

    case 'quiz':
      return {
        id,
        type,
        question: 'Est-ce normal ?',
        options: [
          { text: 'Oui', correct: false },
          { text: 'Non', correct: true },
        ],
        explanation: '',
      }

    case 'puzzle':
      return {
        id,
        type,
        puzzleType: 'reorder',
        instruction: 'Ordre correct',
        items: ['Vérifier', 'Signaler', 'Supprimer'],
      }

    case 'text':
      return { id, type, heading: '', content: '' }

    case 'decision':
      return {
        id,
        type,
        question: 'Que faites-vous ?',
        choices: [
          { text: 'Je clique', correct: false, feedback: '❌ Mauvais' },
          { text: 'Je signale', correct: true, feedback: '✅ Bon' },
        ],
      }

    default:
      return { id, type }
  }
}

function BlockPreview({
  block,
  selected,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}) {
  const icons = {
    email: '📧',
    photo: '🖼️',
    video: '🎬',
    quiz: '❓',
    puzzle: '🧩',
    text: '📝',
    decision: '🔀',
  }

  const getPreview = () => {
    switch (block.type) {
      case 'email':
        return block.subject || 'Email'
      case 'photo':
        return `${block.zones.length} zone(s)`
      case 'video':
        return block.url ? 'Vidéo' : "Pas d'URL"
      case 'quiz':
        return block.question || 'Quiz'
      case 'puzzle':
        return `${block.items.length} éléments`
      case 'text':
        return block.heading || 'Texte'
      case 'decision':
        return block.question || 'Décision'
      default:
        return ''
    }
  }



  const loadReadyScenario = (preset) => {
    setScenario({
      ...preset,
      framework: preset.framework || '',
      sector: preset.sector || '',
      fakeEmailSender: preset.fakeEmailSender || '',
      fakeEmailSubject: preset.fakeEmailSubject || '',
      fakeEmailBody: preset.fakeEmailBody || '',
      fakeLinkLabel: preset.fakeLinkLabel || '',
      fakeLinkUrl: preset.fakeLinkUrl || '',
      fakeLinkHover: preset.fakeLinkHover || '',
      quizQuestions: preset.quizQuestions || [],
      photoHotspots: preset.photoHotspots || [],
    })
  }

  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? '2px solid var(--red)' : '1px solid var(--border-subtle)',
        background: selected ? 'rgba(235,40,40,0.05)' : 'var(--bg-card)',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '18px' }}>{icons[block.type]}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '9px',
            color: 'var(--red)',
            marginBottom: '2px',
          }}
        >
          {block.type}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {getPreview()}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2px' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onMoveUp()
          }}
          disabled={isFirst}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: isFirst ? 'var(--border)' : 'var(--text-muted)',
            width: '20px',
            height: '20px',
            cursor: isFirst ? 'default' : 'pointer',
            fontSize: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '3px',
          }}
        >
          ↑
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onMoveDown()
          }}
          disabled={isLast}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: isLast ? 'var(--border)' : 'var(--text-muted)',
            width: '20px',
            height: '20px',
            cursor: isLast ? 'default' : 'pointer',
            fontSize: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '3px',
          }}
        >
          ↓
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        style={{
          background: 'transparent',
          border: '1px solid rgba(235,40,40,0.3)',
          color: 'var(--red)',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '3px',
        }}
      >
        ✕
      </button>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--mono)',
  fontSize: '9px',
  color: 'var(--text-muted)',
  letterSpacing: '0.1em',
  marginBottom: '4px',
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

function EmailEditor({ block, onChange }) {
  const [linkHovered, setLinkHovered] = useState(false)

  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateLink = (k, v) =>
    onChange({
      ...block,
      link: { ...block.link, [k]: v },
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Field label="EXPÉDITEUR" value={block.senderName} onChange={(v) => update('senderName', v)} />
      <Field label="EMAIL" value={block.from} onChange={(v) => update('from', v)} />
      <Field label="OBJET" value={block.subject} onChange={(v) => update('subject', v)} />

      <div style={{ marginBottom: '8px' }}>
        <label style={labelStyle}>MESSAGE</label>
        <textarea
          value={block.body}
          onChange={(e) => update('body', e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: '#0d0d0d',
            border: '1px solid var(--border)',
            color: 'var(--text-light)',
            fontSize: '11px',
            resize: 'vertical',
            borderRadius: '3px',
            fontFamily: 'var(--mono)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div
        style={{
          padding: '8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '8px',
            color: 'var(--red)',
            marginBottom: '6px',
          }}
        >
          🔗 LIEN
        </div>

        <Field label="TEXTE" value={block.link.text} onChange={(v) => updateLink('text', v)} />
        <Field label="URL AFFICHÉE" value={block.link.hover} onChange={(v) => updateLink('hover', v)} />
        <Field label="URL RÉELLE" value={block.link.real} onChange={(v) => updateLink('real', v)} />

        <div
          style={{
            marginTop: '6px',
            padding: '6px',
            background: '#0a0a0a',
            border: '1px solid var(--border)',
            borderRadius: '3px',
            fontSize: '11px',
            position: 'relative',
          }}
        >
          <span
            style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            {block.link.text}
          </span>

          {linkHovered && (
            <div
              style={{
                position: 'absolute',
                background: '#1a1a1a',
                padding: '2px 6px',
                fontSize: '9px',
                color: '#22c55e',
                marginTop: '2px',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                top: '100%',
                left: 0,
                zIndex: 2,
              }}
            >
              🔗 {block.link.hover}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PhotoEditor({ block, onChange }) {
  const imgRef = useRef(null)
  const fileRef = useRef(null)
  const [addingZone, setAddingZone] = useState(false)

  const update = (k, v) => onChange({ ...block, [k]: v })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => update('src', ev.target?.result || '')
    reader.readAsDataURL(file)
  }

  const handleImageClick = (e) => {
    if (!addingZone || !imgRef.current) return

    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newZone = {
      id: Date.now(),
      x: x - 5,
      y: y - 5,
      w: 12,
      h: 12,
      label: 'Zone',
      correct: true,
    }

    update('zones', [...block.zones, newZone])
    setAddingZone(false)
  }

  const updateZone = (id, k, v) =>
    update(
      'zones',
      block.zones.map((z) => (z.id === id ? { ...z, [k]: v } : z)),
    )

  const removeZone = (id) =>
    update(
      'zones',
      block.zones.filter((z) => z.id !== id),
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            padding: '6px 12px',
            background: 'rgba(235,40,40,0.1)',
            border: '1px solid rgba(235,40,40,0.3)',
            color: 'var(--red)',
            cursor: 'pointer',
            fontSize: '11px',
            borderRadius: '3px',
          }}
        >
          📂 Image
        </button>

        {block.src && (
          <button
            type="button"
            onClick={() => setAddingZone(!addingZone)}
            style={{
              padding: '6px 12px',
              background: addingZone ? 'rgba(235,40,40,0.2)' : 'var(--bg-card)',
              border: `1px solid ${addingZone ? 'var(--red)' : 'var(--border-subtle)'}`,
              color: addingZone ? 'var(--red)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '11px',
              borderRadius: '3px',
            }}
          >
            + Zone
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {block.src ? (
        <div
          style={{
            position: 'relative',
            border: `2px solid ${addingZone ? 'var(--red)' : 'var(--border-subtle)'}`,
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: addingZone ? 'crosshair' : 'default',
          }}
          onClick={handleImageClick}
        >
          <img
            ref={imgRef}
            src={block.src}
            alt="preview"
            style={{
              width: '100%',
              display: 'block',
              maxHeight: '180px',
              objectFit: 'cover',
            }}
          />

          {block.zones.map((z) => (
            <div
              key={z.id}
              style={{
                position: 'absolute',
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: `${z.w}%`,
                height: `${z.h}%`,
                border: `1px solid ${z.correct ? '#22c55e' : 'var(--red)'}`,
                background: z.correct ? 'rgba(34,197,94,0.15)' : 'rgba(235,40,40,0.15)',
                borderRadius: '3px',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: 0,
                  fontSize: '8px',
                  background: z.correct ? '#22c55e' : 'var(--red)',
                  color: '#fff',
                  padding: '0 3px',
                  borderRadius: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                {z.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '20px',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '4px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '11px',
          }}
        >
          Aucune image
        </div>
      )}

      {block.zones.map((z) => (
        <div key={z.id} style={{ display: 'flex', gap: '4px', fontSize: '11px' }}>
          <input
            value={z.label}
            onChange={(e) => updateZone(z.id, 'label', e.target.value)}
            style={{
              flex: 1,
              padding: '4px 6px',
              background: '#0d0d0d',
              border: '1px solid var(--border)',
              color: 'var(--text-light)',
              fontSize: '10px',
              borderRadius: '2px',
            }}
          />

          <button
            type="button"
            onClick={() => updateZone(z.id, 'correct', !z.correct)}
            style={{
              padding: '4px 8px',
              background: z.correct ? 'rgba(34,197,94,0.15)' : 'rgba(235,40,40,0.15)',
              border: `1px solid ${z.correct ? '#22c55e' : 'var(--red)'}`,
              color: z.correct ? '#22c55e' : 'var(--red)',
              cursor: 'pointer',
              fontSize: '10px',
              borderRadius: '2px',
            }}
          >
            {z.correct ? '✓' : '✕'}
          </button>

          <button
            type="button"
            onClick={() => removeZone(z.id)}
            style={{
              padding: '4px 6px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '10px',
              borderRadius: '2px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

function VideoEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Field
        label="URL"
        value={block.url}
        onChange={(v) => update('url', v)}
        placeholder="https://youtube.com/watch?v=..."
      />
      <Field label="LÉGENDE" value={block.caption} onChange={(v) => update('caption', v)} />
    </div>
  )
}

function QuizEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateOption = (i, k, v) =>
    update(
      'options',
      block.options.map((o, idx) => (idx === i ? { ...o, [k]: v } : o)),
    )

  const setCorrect = (i) =>
    update(
      'options',
      block.options.map((o, idx) => ({ ...o, correct: idx === i })),
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ marginBottom: '4px' }}>
        <label style={labelStyle}>QUESTION</label>
        <textarea
          value={block.question}
          onChange={(e) => update('question', e.target.value)}
          rows={2}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: '#0d0d0d',
            border: '1px solid var(--border)',
            color: 'var(--text-light)',
            fontSize: '11px',
            resize: 'vertical',
            borderRadius: '3px',
            fontFamily: 'var(--font-body)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {block.options.map((o, i) => (
        <div key={i} style={{ display: 'flex', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setCorrect(i)}
            style={{
              width: '22px',
              height: '22px',
              background: o.correct ? 'rgba(34,197,94,0.2)' : 'var(--bg-card)',
              border: `1px solid ${o.correct ? '#22c55e' : 'var(--border)'}`,
              color: o.correct ? '#22c55e' : 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '50%',
              fontSize: '10px',
              flexShrink: 0,
            }}
          >
            {o.correct ? '✓' : ''}
          </button>

          <input
            value={o.text}
            onChange={(e) => updateOption(i, 'text', e.target.value)}
            placeholder={`Option ${i + 1}`}
            style={{
              flex: 1,
              padding: '6px 8px',
              background: '#0d0d0d',
              border: `1px solid ${o.correct ? '#22c55e' : 'var(--border)'}`,
              color: 'var(--text-light)',
              fontSize: '11px',
              borderRadius: '3px',
            }}
          />
        </div>
      ))}

      <Field
        label="EXPLICATION"
        value={block.explanation}
        onChange={(v) => update('explanation', v)}
        placeholder="Pourquoi ?"
      />
    </div>
  )
}

function PuzzleEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateItem = (i, v) =>
    update(
      'items',
      block.items.map((it, idx) => (idx === i ? v : it)),
    )

  const moveItem = (i, dir) => {
    const arr = [...block.items]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    update('items', arr)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Field
        label="INSTRUCTION"
        value={block.instruction}
        onChange={(v) => update('instruction', v)}
      />

      {block.items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              width: '16px',
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>

          <input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            style={{
              flex: 1,
              padding: '6px 8px',
              background: '#0d0d0d',
              border: '1px solid var(--border)',
              color: 'var(--text-light)',
              fontSize: '11px',
              borderRadius: '3px',
            }}
          />

          <button
            type="button"
            onClick={() => moveItem(i, -1)}
            disabled={i === 0}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: i === 0 ? 'var(--border)' : 'var(--text-muted)',
              width: '18px',
              height: '18px',
              cursor: i === 0 ? 'default' : 'pointer',
              fontSize: '10px',
              borderRadius: '2px',
            }}
          >
            ↑
          </button>

          <button
            type="button"
            onClick={() => moveItem(i, 1)}
            disabled={i === block.items.length - 1}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: i === block.items.length - 1 ? 'var(--border)' : 'var(--text-muted)',
              width: '18px',
              height: '18px',
              cursor: i === block.items.length - 1 ? 'default' : 'pointer',
              fontSize: '10px',
              borderRadius: '2px',
            }}
          >
            ↓
          </button>
        </div>
      ))}
    </div>
  )
}

function TextEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Field label="TITRE" value={block.heading} onChange={(v) => update('heading', v)} />

      <div>
        <label style={labelStyle}>CONTENU</label>
        <textarea
          value={block.content}
          onChange={(e) => update('content', e.target.value)}
          rows={5}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: '#0d0d0d',
            border: '1px solid var(--border)',
            color: 'var(--text-light)',
            fontSize: '11px',
            resize: 'vertical',
            borderRadius: '3px',
            fontFamily: 'var(--font-body)',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  )
}

function DecisionEditor({ block, onChange }) {
  const update = (k, v) => onChange({ ...block, [k]: v })
  const updateChoice = (i, k, v) =>
    update(
      'choices',
      block.choices.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)),
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>
        <label style={labelStyle}>QUESTION</label>
        <textarea
          value={block.question}
          onChange={(e) => update('question', e.target.value)}
          rows={2}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: '#0d0d0d',
            border: '1px solid var(--border)',
            color: 'var(--text-light)',
            fontSize: '11px',
            resize: 'vertical',
            borderRadius: '3px',
            fontFamily: 'var(--font-body)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {block.choices.map((c, i) => (
        <div
          key={i}
          style={{
            padding: '6px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${c.correct ? 'rgba(34,197,94,0.3)' : 'rgba(235,40,40,0.2)'}`,
            borderRadius: '3px',
          }}
        >
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            <button
              type="button"
              onClick={() => updateChoice(i, 'correct', !c.correct)}
              style={{
                padding: '3px 8px',
                background: c.correct ? 'rgba(34,197,94,0.15)' : 'rgba(235,40,40,0.1)',
                border: `1px solid ${c.correct ? '#22c55e' : 'var(--red)'}`,
                color: c.correct ? '#22c55e' : 'var(--red)',
                cursor: 'pointer',
                fontSize: '9px',
                borderRadius: '2px',
                flexShrink: 0,
              }}
            >
              {c.correct ? '✓' : '✕'}
            </button>

            <input
              value={c.text}
              onChange={(e) => updateChoice(i, 'text', e.target.value)}
              placeholder={`Choix ${i + 1}`}
              style={{
                flex: 1,
                padding: '4px 6px',
                background: '#0d0d0d',
                border: '1px solid var(--border)',
                color: 'var(--text-light)',
                fontSize: '11px',
                borderRadius: '2px',
              }}
            />
          </div>

          <input
            value={c.feedback}
            onChange={(e) => updateChoice(i, 'feedback', e.target.value)}
            placeholder="Feedback..."
            style={{
              width: '100%',
              padding: '4px 6px',
              background: '#0d0d0d',
              border: '1px solid var(--border)',
              color: 'var(--text-light)',
              fontSize: '10px',
              borderRadius: '2px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function ScenarioBuilder({
  initialData = null,
  onSave = () => {},
  onBack = () => {},
  initialData = null,
}) {
  const [meta, setMeta] = useState(initialData ? {
    titleFr: initialData.title_fr || initialData.titleFr || '',
    titleEn: initialData.title_en || initialData.titleEn || '',
    category: initialData.category || 'Phishing',
    difficulty: initialData.difficulty || 'intermediate',
    duration: String(initialData.duration || '15'),
    description: initialData.description || '',
  } : {
    titleFr: '',
    titleEn: '',
    category: 'Phishing',
    difficulty: 'intermediate',
    duration: '15',
    description: '',
  })

  const [blocks, setBlocks] = useState(
    initialData?.blocks?.map((b, i) => ({ ...b, id: b.id ?? (Date.now() + i) })) || []
  )
  const [selectedId, setSelectedId] = useState(null)
  const [step, setStep] = useState('meta')

  useEffect(() => {
    if (!initialData) return

    setMeta({
      titleFr: initialData.titleFr || initialData.title?.fr || '',
      titleEn: initialData.titleEn || initialData.title?.en || '',
      category: initialData.category || 'Phishing',
      difficulty: initialData.difficulty || 'intermediate',
      duration: initialData.duration || '15',
      description: initialData.description || '',
    })

    setBlocks(Array.isArray(initialData.blocks) ? initialData.blocks : [])
    setSelectedId(initialData.blocks?.[0]?.id || null)
  }, [initialData])

  const updateMeta = (k, v) => setMeta((m) => ({ ...m, [k]: v }))

  const addBlock = (type) => {
    const b = makeBlock(type)
    setBlocks((prev) => [...prev, b])
    setSelectedId(b.id)
  }

  const updateBlock = (id, updated) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? updated : b)))

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const moveBlock = (id, dir) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      const j = idx + dir

      if (idx === -1 || j < 0 || j >= prev.length) return prev

      const arr = [...prev]
      ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
      return arr
    })
  }

  const selectedBlock = blocks.find((b) => b.id === selectedId)

  const renderBlockEditor = () => {
    if (!selectedBlock) {
      return (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '11px',
          }}
        >
          Sélectionnez un bloc
        </div>
      )
    }

    const props = {
      block: selectedBlock,
      onChange: (updated) => updateBlock(selectedBlock.id, updated),
    }

    switch (selectedBlock.type) {
      case 'email':
        return <EmailEditor {...props} />
      case 'photo':
        return <PhotoEditor {...props} />
      case 'video':
        return <VideoEditor {...props} />
      case 'quiz':
        return <QuizEditor {...props} />
      case 'puzzle':
        return <PuzzleEditor {...props} />
      case 'text':
        return <TextEditor {...props} />
      case 'decision':
        return <DecisionEditor {...props} />
      default:
        return null
    }
  }

  const handleSave = (status = 'draft') => {
    onSave({
      ...meta,
      blocks,
      status,
      id: initialData?.id || Date.now(),
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#000',
        color: 'var(--text-light)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: '#080808',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '11px',
            borderRadius: '4px',
          }}
        >
          ← Retour
        </button>

        <div style={{ flex: 1 }}>
          <input
            value={meta.titleFr}
            onChange={(e) => updateMeta('titleFr', e.target.value)}
            placeholder="Titre..."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-light)',
              fontFamily: 'var(--font-title)',
              fontSize: '16px',
              width: '100%',
              outline: 'none',
              padding: 0,
            }}
          />

          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '9px',
              color: 'var(--text-muted)',
              marginTop: '1px',
            }}
          >
            {meta.category} · {meta.difficulty} · {meta.duration}min · {blocks.length} bloc(s)
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSave('draft')}
          style={{
            padding: '6px 14px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '11px',
            borderRadius: '4px',
          }}
        >
          💾 Brouillon
        </button>

        <button
          type="button"
          onClick={() => handleSave('published')}
          className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '11px' }}
        >
          🚀 Publier
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: '#080808',
          flexShrink: 0,
        }}
      >
        {[
          { id: 'meta', label: '① Infos' },
          { id: 'blocks', label: '② Blocs' },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            style={{
              padding: '8px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: step === s.id ? '2px solid var(--red)' : '2px solid transparent',
              color: step === s.id ? 'var(--text-light)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {step === 'meta' && (
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '20px',
                marginBottom: '20px',
              }}
            >
              Infos
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="TITRE FR" value={meta.titleFr} onChange={(v) => updateMeta('titleFr', v)} />
                <Field label="TITLE EN" value={meta.titleEn} onChange={(v) => updateMeta('titleEn', v)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>CATÉGORIE</label>
                  <select
                    value={meta.category}
                    onChange={(e) => updateMeta('category', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: '#0d0d0d',
                      border: '1px solid var(--border)',
                      color: 'var(--text-light)',
                      fontSize: '12px',
                      borderRadius: '3px',
                    }}
                  >
                    {['Phishing', 'Ransomware', 'Social Eng.', 'Insider', 'Réseau', 'Malware', 'OSINT'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>NIVEAU</label>
                  <select
                    value={meta.difficulty}
                    onChange={(e) => updateMeta('difficulty', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px',
                      background: '#0d0d0d',
                      border: '1px solid var(--border)',
                      color: 'var(--text-light)',
                      fontSize: '12px',
                      borderRadius: '3px',
                    }}
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>

                <Field
                  label="DURÉE (min)"
                  type="number"
                  value={meta.duration}
                  onChange={(v) => updateMeta('duration', v)}
                />
              </div>

              <div>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea
                  value={meta.description}
                  onChange={(e) => updateMeta('description', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    background: '#0d0d0d',
                    border: '1px solid var(--border)',
                    color: 'var(--text-light)',
                    fontSize: '12px',
                    resize: 'vertical',
                    borderRadius: '3px',
                    fontFamily: 'var(--font-body)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('blocks')}
                className="btn-primary"
                style={{ padding: '10px', fontSize: '12px', width: '100%' }}
              >
                Continuer → Ajouter blocs
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'blocks' && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div
            style={{
              width: '160px',
              flexShrink: 0,
              background: '#080808',
              borderRight: '1px solid var(--border-subtle)',
              padding: '12px',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '8px',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                marginBottom: '8px',
              }}
            >
              BLOCS
            </div>

            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                type="button"
                onClick={() => addBlock(bt.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  marginBottom: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--red)'
                  e.currentTarget.style.color = 'var(--text-light)'
                  e.currentTarget.style.background = 'rgba(235,40,40,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ fontSize: '14px' }}>{bt.icon}</span>
                <span>{bt.label}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '16px',
              background: '#050505',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {blocks.length === 0 && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                ← Ajoutez des blocs
                <br />
                <span style={{ fontSize: '10px', opacity: 0.6 }}>
                  Email · Photo · Video · Quiz · Puzzle · Texte · Décision
                </span>
              </div>
            )}

            {blocks.map((b, i) => (
              <BlockPreview
                key={b.id}
                block={b}
                selected={selectedId === b.id}
                onClick={() => setSelectedId(b.id)}
                onMoveUp={() => moveBlock(b.id, -1)}
                onMoveDown={() => moveBlock(b.id, 1)}
                onDelete={() => deleteBlock(b.id)}
                isFirst={i === 0}
                isLast={i === blocks.length - 1}
              />
            ))}
          </div>

          <div
            style={{
              width: '300px',
              flexShrink: 0,
              background: '#080808',
              borderLeft: '1px solid var(--border-subtle)',
              overflow: 'auto',
              padding: '12px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '8px',
                color: 'var(--red)',
                letterSpacing: '0.1em',
                marginBottom: '12px',
              }}
            >
              ÉDITER
            </div>

            {renderBlockEditor()}
          </div>
        </div>
      )}
    </div>
  )
}