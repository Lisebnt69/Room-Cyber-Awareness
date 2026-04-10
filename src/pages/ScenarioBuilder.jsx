import { useState, useRef, useCallback } from 'react'
import Logo from '/roomca-logo.png'

const CATEGORIES = ['Phishing', 'Ransomware', 'Social Eng.', 'Insider', 'Réseau', 'Malware', 'OSINT']
const STATUSES = ['draft', 'beta', 'published']
let _uid = 1
const uid = () => ++_uid

const BLOCK_TYPES = [
  { type: 'email',    icon: '✉',  label: 'Faux email' },
  { type: 'fakelink', icon: '🔗', label: 'Faux lien' },
  { type: 'photo',    icon: '🖼', label: 'Photo + zones' },
  { type: 'quiz',     icon: '❓', label: 'Quizz' },
  { type: 'video',    icon: '▶',  label: 'Vidéo' },
  { type: 'text',     icon: '📝', label: 'Narration' },
  { type: 'decision', icon: '⚡', label: 'Décision' },
]

function makeBlock(type) {
  switch (type) {
    case 'email':    return { id: uid(), type, sender: '', subject: '', body: '' }
    case 'fakelink': return { id: uid(), type, label: '', url: '', hoverText: '' }
    case 'photo':    return { id: uid(), type, image: '', imageName: '', hotspots: [] }
    case 'quiz':     return { id: uid(), type, questions: [] }
    case 'video':    return { id: uid(), type, url: '' }
    case 'text':     return { id: uid(), type, content: '' }
    case 'decision': return { id: uid(), type, prompt: '', choices: [] }
    default:         return { id: uid(), type }
  }
}

// Convert old flat scenario format → blocks array
function legacyToBlocks(data) {
  if (Array.isArray(data.blocks) && data.blocks.length > 0) return data.blocks.map(b => ({ ...b, id: b.id || uid() }))
  const blocks = []
  if (data.fakeEmailSender || data.fakeEmailSubject || data.fakeEmailBody)
    blocks.push({ id: uid(), type: 'email', sender: data.fakeEmailSender || '', subject: data.fakeEmailSubject || '', body: data.fakeEmailBody || '' })
  if (data.fakeLinkLabel || data.fakeLinkUrl)
    blocks.push({ id: uid(), type: 'fakelink', label: data.fakeLinkLabel || '', url: data.fakeLinkUrl || '', hoverText: data.fakeLinkHover || '' })
  if (data.coverImage)
    blocks.push({ id: uid(), type: 'photo', image: data.coverImage, imageName: data.coverImageName || '', hotspots: (data.photoHotspots || []).map(h => ({ ...h, id: h.id || uid() })) })
  if (data.quizQuestions && data.quizQuestions.length)
    blocks.push({ id: uid(), type: 'quiz', questions: data.quizQuestions })
  if (data.videoUrl)
    blocks.push({ id: uid(), type: 'video', url: data.videoUrl })
  if (data.narrative)
    blocks.push({ id: uid(), type: 'text', content: data.narrative })
  return blocks
}

// ─── BLOCK EDITORS ───────────────────────────────────────────────────────────

function EmailEditor({ block, onChange }) {
  const [hover, setHover] = useState(false)
  return (
    <div>
      <Row label="EXPÉDITEUR">
        <input style={inp} value={block.sender} onChange={e => onChange({ sender: e.target.value })} placeholder="ceo@acme-corp.fr" />
      </Row>
      <Row label="OBJET">
        <input style={inp} value={block.subject} onChange={e => onChange({ subject: e.target.value })} placeholder="Action requise — virement urgent" />
      </Row>
      <Row label="CORPS DU MAIL">
        <textarea style={{ ...inp, resize: 'vertical' }} rows={6} value={block.body} onChange={e => onChange({ body: e.target.value })} placeholder="Bonjour,\n\nJe vous demande de procéder à un virement..." />
      </Row>
      {(block.sender || block.subject || block.body) && (
        <div style={{ border: '1px solid #222', background: '#0a0a0a', padding: '16px', marginTop: '8px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555', marginBottom: '10px' }}>APERÇU</div>
          <div style={{ fontSize: '11px', color: '#888' }}>De : <span style={{ color: '#eb2828' }}>{block.sender || 'expéditeur'}</span></div>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '10px' }}>Objet : {block.subject}</div>
          <div style={{ fontSize: '13px', color: '#ccc', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{block.body}</div>
        </div>
      )}
    </div>
  )
}

function FakeLinkEditor({ block, onChange }) {
  const [hover, setHover] = useState(false)
  return (
    <div>
      <Row label="TEXTE DU LIEN (affiché)">
        <input style={inp} value={block.label} onChange={e => onChange({ label: e.target.value })} placeholder="Vérifier mon compte" />
      </Row>
      <Row label="URL RÉELLE (piège)">
        <input style={inp} value={block.url} onChange={e => onChange({ url: e.target.value })} placeholder="http://banque-secure-login.xyz/auth" />
      </Row>
      <Row label="TEXTE AU SURVOL (info cachée)">
        <input style={inp} value={block.hoverText} onChange={e => onChange({ hoverText: e.target.value })} placeholder="http://malware-dl.ru/payload.exe" />
      </Row>
      {block.label && (
        <div style={{ marginTop: '12px', padding: '12px 16px', background: '#0a0a0a', border: '1px solid #222' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555', marginBottom: '8px' }}>APERÇU LIEN</div>
          <span
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{ color: '#4ea1ff', textDecoration: 'underline', cursor: 'pointer', position: 'relative', fontSize: '13px' }}
          >
            {block.label}
            {hover && block.hoverText && (
              <span style={{ position: 'absolute', bottom: '-30px', left: 0, background: '#111', border: '1px solid #333', padding: '4px 8px', fontSize: '11px', fontFamily: 'monospace', color: '#eb2828', whiteSpace: 'nowrap', zIndex: 20 }}>
                {block.hoverText}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

function PhotoEditor({ block, onChange }) {
  const containerRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)

  const handleUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onChange({ image: ev.target.result, imageName: file.name })
    reader.readAsDataURL(file)
  }

  const addHotspot = useCallback((e) => {
    if (!block.image || draggingId) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    onChange({ hotspots: [...(block.hotspots || []), { id: uid(), x, y, label: 'Zone' }] })
  }, [block.image, block.hotspots, draggingId])

  const startDrag = useCallback((e, hid) => {
    e.stopPropagation()
    e.preventDefault()
    setDraggingId(hid)
    const rect = containerRef.current.getBoundingClientRect()
    const move = (ev) => {
      const x = Math.round(Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100)))
      const y = Math.round(Math.max(0, Math.min(100, ((ev.clientY - rect.top) / rect.height) * 100)))
      onChange({ hotspots: block.hotspots.map(h => h.id === hid ? { ...h, x, y } : h) })
    }
    const up = () => { setDraggingId(null); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }, [block.hotspots, onChange])

  const updateHs = (id, patch) => onChange({ hotspots: block.hotspots.map(h => h.id === id ? { ...h, ...patch } : h) })
  const removeHs = (id) => onChange({ hotspots: block.hotspots.filter(h => h.id !== id) })

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={lbl}>IMPORTER UNE IMAGE</label>
          <input type="file" accept="image/*" style={{ ...inp, padding: '8px', cursor: 'pointer' }} onChange={e => handleUpload(e.target.files?.[0])} />
          {block.imageName && <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '4px' }}>✓ {block.imageName}</div>}
        </div>
        <div>
          <label style={lbl}>OU URL</label>
          <input style={inp} placeholder="https://..." value={block.image && !block.image.startsWith('data:') ? block.image : ''} onChange={e => onChange({ image: e.target.value, imageName: '' })} />
        </div>
      </div>

      {block.image ? (
        <div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#555', marginBottom: '6px' }}>
            CLIQUE = ajouter une zone · GLISSE un point = repositionner
          </div>
          <div ref={containerRef} onClick={addHotspot}
            style={{ position: 'relative', cursor: 'crosshair', border: '1px solid #222', overflow: 'hidden', userSelect: 'none' }}
          >
            <img src={block.image} alt="" style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block', opacity: 0.85 }} />
            {(block.hotspots || []).map((h, idx) => (
              <div
                key={h.id}
                onMouseDown={e => startDrag(e, h.id)}
                style={{
                  position: 'absolute', left: `${h.x}%`, top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: draggingId === h.id ? '#ff6b6b' : '#eb2828',
                  border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: '#fff', fontWeight: 700,
                  cursor: 'grab', userSelect: 'none', zIndex: 10,
                  transition: draggingId === h.id ? 'none' : 'background 0.15s',
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ border: '2px dashed #1e1e1e', padding: '40px', textAlign: 'center', color: '#333', fontSize: '13px' }}>
          Importez une image pour activer le placement de zones
        </div>
      )}

      {(block.hotspots || []).length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555', marginBottom: '10px' }}>
            ZONES ({block.hotspots.length}) — modifie le label ou ajuste X/Y manuellement
          </div>
          {block.hotspots.map((h, idx) => (
            <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 72px 72px auto', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eb2828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{idx + 1}</div>
              <input style={inp} value={h.label} onChange={e => updateHs(h.id, { label: e.target.value })} placeholder="Label" />
              <input style={{ ...inp, textAlign: 'center' }} type="number" value={h.x} onChange={e => updateHs(h.id, { x: Number(e.target.value) })} />
              <input style={{ ...inp, textAlign: 'center' }} type="number" value={h.y} onChange={e => updateHs(h.id, { y: Number(e.target.value) })} />
              <button onClick={() => removeHs(h.id)} style={{ padding: '8px 10px', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', color: '#eb2828', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QuizEditor({ block, onChange }) {
  const addQ = () => onChange({ questions: [...(block.questions || []), { id: uid(), prompt: '', options: [{ id: uid(), text: '', isCorrect: true }, { id: uid(), text: '', isCorrect: false }] }] })
  const removeQ = (qid) => onChange({ questions: block.questions.filter(q => q.id !== qid) })
  const updateQ = (qid, patch) => onChange({ questions: block.questions.map(q => q.id === qid ? { ...q, ...patch } : q) })
  const updateOpt = (qid, oid, patch) => onChange({ questions: block.questions.map(q => q.id === qid ? { ...q, options: q.options.map(o => o.id === oid ? { ...o, ...patch } : o) } : q) })
  const addOpt = (qid) => onChange({ questions: block.questions.map(q => q.id === qid ? { ...q, options: [...q.options, { id: uid(), text: '', isCorrect: false }] } : q) })
  const removeOpt = (qid, oid) => onChange({ questions: block.questions.map(q => q.id === qid ? { ...q, options: q.options.filter(o => o.id !== oid) } : q) })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>{(block.questions || []).length} question(s)</span>
        <button onClick={addQ} style={{ padding: '7px 16px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>+ Question</button>
      </div>
      {(block.questions || []).length === 0 && (
        <div style={{ padding: '32px', textAlign: 'center', color: '#333', border: '1px dashed #1e1e1e', fontSize: '13px' }}>Aucune question encore</div>
      )}
      {(block.questions || []).map((q, qi) => (
        <div key={q.id} style={{ border: '1px solid #1e1e1e', borderLeft: '3px solid #eb2828', padding: '16px', marginBottom: '12px', background: '#0d0d0d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#eb2828' }}>Q{qi + 1}</span>
            <button onClick={() => removeQ(q.id)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '14px' }}>✕</button>
          </div>
          <input style={{ ...inp, marginBottom: '12px' }} value={q.prompt} onChange={e => updateQ(q.id, { prompt: e.target.value })} placeholder="Quelle est la bonne décision ?" />
          {q.options.map(o => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
              <input style={{ ...inp, borderColor: o.isCorrect ? '#22c55e' : '#1e1e1e' }} value={o.text} onChange={e => updateOpt(q.id, o.id, { text: e.target.value })} placeholder="Réponse..." />
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: o.isCorrect ? '#22c55e' : '#555', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={!!o.isCorrect} onChange={e => updateOpt(q.id, o.id, { isCorrect: e.target.checked })} /> Correcte
              </label>
              <button onClick={() => removeOpt(q.id, o.id)} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <button onClick={() => addOpt(q.id)} style={{ marginTop: '4px', padding: '5px 12px', background: 'transparent', border: '1px dashed #1e1e1e', color: '#444', fontSize: '11px', cursor: 'pointer', width: '100%' }}>
            + Réponse
          </button>
        </div>
      ))}
    </div>
  )
}

function DecisionEditor({ block, onChange }) {
  const addChoice = () => onChange({ choices: [...(block.choices || []), { id: uid(), text: '', isSafe: false, consequence: '' }] })
  const updateC = (cid, patch) => onChange({ choices: block.choices.map(c => c.id === cid ? { ...c, ...patch } : c) })
  const removeC = (cid) => onChange({ choices: block.choices.filter(c => c.id !== cid) })

  return (
    <div>
      <Row label="QUESTION / MISE EN SITUATION">
        <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={block.prompt || ''} onChange={e => onChange({ prompt: e.target.value })} placeholder="Vous recevez un appel de votre banque..." />
      </Row>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', marginBottom: '10px' }}>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555' }}>{(block.choices || []).length} CHOIX</span>
        <button onClick={addChoice} style={{ padding: '6px 14px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>+ Choix</button>
      </div>
      {(block.choices || []).map(c => (
        <div key={c.id} style={{ border: `1px solid ${c.isSafe ? '#22c55e33' : '#eb282833'}`, padding: '12px', marginBottom: '8px', background: '#0d0d0d' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <input style={inp} value={c.text} onChange={e => updateC(c.id, { text: e.target.value })} placeholder="Texte du choix..." />
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: c.isSafe ? '#22c55e' : '#eb2828', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={!!c.isSafe} onChange={e => updateC(c.id, { isSafe: e.target.checked })} /> {c.isSafe ? '✓ Sûr' : '✗ Risqué'}
            </label>
            <button onClick={() => removeC(c.id)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer' }}>✕</button>
          </div>
          <input style={{ ...inp, fontSize: '12px' }} value={c.consequence || ''} onChange={e => updateC(c.id, { consequence: e.target.value })} placeholder="Conséquence de ce choix..." />
        </div>
      ))}
    </div>
  )
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inp = { width: '100%', padding: '10px 12px', background: '#0d0d0d', border: '1px solid #1e1e1e', color: '#e8e8e8', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const lbl = { display: 'block', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#555', marginBottom: '6px' }
function Row({ label, children }) {
  return <div style={{ marginBottom: '14px' }}><label style={lbl}>{label}</label>{children}</div>
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ScenarioBuilder({ initialData = null, onSave, onBack }) {
  const isEdit = !!initialData
  const [meta, setMeta] = useState({
    titleFr: initialData?.title?.fr || initialData?.titleFr || '',
    titleEn: initialData?.title?.en || initialData?.titleEn || '',
    category: initialData?.category || 'Phishing',
    difficulty: initialData?.difficulty || 'intermediate',
    duration: initialData?.duration || '15',
    description: initialData?.description || '',
    status: initialData?.status || 'draft',
  })
  const [blocks, setBlocks] = useState(() => initialData ? legacyToBlocks(initialData) : [])
  const [selectedId, setSelectedId] = useState(null)
  const [showMeta, setShowMeta] = useState(!isEdit || blocks.length === 0)

  const selectedBlock = blocks.find(b => b.id === selectedId) || null

  const addBlock = (type) => {
    const b = makeBlock(type)
    setBlocks(prev => [...prev, b])
    setSelectedId(b.id)
    setShowMeta(false)
  }

  const updateBlock = useCallback((id, patch) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
  }, [])

  const deleteBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const moveBlock = (id, dir) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  const handleSave = (status) => {
    if (onSave) onSave({ ...meta, status: status || meta.status, id: initialData?.id || Date.now(), blocks })
  }

  const renderEditor = () => {
    if (!selectedBlock) return null
    const change = (patch) => updateBlock(selectedBlock.id, patch)
    switch (selectedBlock.type) {
      case 'email':    return <EmailEditor block={selectedBlock} onChange={change} />
      case 'fakelink': return <FakeLinkEditor block={selectedBlock} onChange={change} />
      case 'photo':    return <PhotoEditor block={selectedBlock} onChange={change} />
      case 'quiz':     return <QuizEditor block={selectedBlock} onChange={change} />
      case 'video':    return <Row label="URL VIDÉO (YouTube, mp4...)"><input style={inp} value={selectedBlock.url || ''} onChange={e => change({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></Row>
      case 'text':     return <Row label="NARRATION / MISE EN SITUATION"><textarea style={{ ...inp, resize: 'vertical' }} rows={10} value={selectedBlock.content || ''} onChange={e => change({ content: e.target.value })} placeholder="Vous êtes en plein travail quand..." /></Row>
      case 'decision': return <DecisionEditor block={selectedBlock} onChange={change} />
      default: return null
    }
  }

  const blockType = (type) => BLOCK_TYPES.find(t => t.type === type) || { icon: '?', label: type }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#e8e8e8', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 28px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#060606', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={Logo} alt="ROOMCA" style={{ height: '26px' }} />
          <div style={{ width: '1px', height: '20px', background: '#1a1a1a' }} />
          <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>
            {isEdit ? `✎ ${meta.titleFr || 'Scénario'}` : '+ Nouveau scénario'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleSave('draft')} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #222', color: '#777', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace' }}>Brouillon</button>
          <button onClick={() => handleSave('published')} style={{ padding: '7px 20px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
            {isEdit ? '✓ Enregistrer' : '🚀 Publier'}
          </button>
          <button onClick={onBack} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #1a1a1a', color: '#444', fontSize: '12px', cursor: 'pointer' }}>✕</button>
        </div>
      </div>

      {/* Body: 3 columns */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — palette + block list */}
        <div style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #111', background: '#080808', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Meta button */}
          <button onClick={() => { setShowMeta(true); setSelectedId(null) }}
            style={{ margin: '12px', padding: '10px', background: showMeta && !selectedId ? 'rgba(235,40,40,0.1)' : 'transparent', border: `1px solid ${showMeta && !selectedId ? '#eb2828' : '#1a1a1a'}`, color: showMeta && !selectedId ? '#e8e8e8' : '#666', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
            ① Infos générales
          </button>

          {/* Block list */}
          <div style={{ padding: '0 12px', flex: 1 }}>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#333', letterSpacing: '0.15em', marginBottom: '8px' }}>BLOCS ({blocks.length})</div>
            {blocks.map((b, idx) => {
              const bt = blockType(b.type)
              return (
                <div key={b.id} style={{ marginBottom: '4px' }}>
                  <div
                    onClick={() => { setSelectedId(b.id); setShowMeta(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: selectedId === b.id ? 'rgba(235,40,40,0.1)' : 'transparent', border: `1px solid ${selectedId === b.id ? '#eb2828' : '#1a1a1a'}`, cursor: 'pointer', transition: 'all 0.1s' }}
                  >
                    <span style={{ fontSize: '14px' }}>{bt.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: selectedId === b.id ? '#e8e8e8' : '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bt.label}</div>
                      <div style={{ fontSize: '9px', color: '#444', fontFamily: 'monospace' }}>#{idx + 1}</div>
                    </div>
                  </div>
                  {selectedId === b.id && (
                    <div style={{ display: 'flex', borderTop: 'none' }}>
                      <button onClick={() => moveBlock(b.id, -1)} style={{ flex: 1, padding: '3px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderTop: 'none', color: '#444', cursor: 'pointer', fontSize: '11px' }}>↑</button>
                      <button onClick={() => moveBlock(b.id, 1)} style={{ flex: 1, padding: '3px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderTop: 'none', borderLeft: 'none', color: '#444', cursor: 'pointer', fontSize: '11px' }}>↓</button>
                      <button onClick={() => deleteBlock(b.id)} style={{ flex: 1, padding: '3px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderTop: 'none', borderLeft: 'none', color: '#eb2828', cursor: 'pointer', fontSize: '11px' }}>✕</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add block palette */}
          <div style={{ padding: '12px', borderTop: '1px solid #111' }}>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#333', letterSpacing: '0.15em', marginBottom: '8px' }}>+ AJOUTER</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} onClick={() => addBlock(bt.type)}
                  style={{ padding: '6px 4px', background: 'transparent', border: '1px solid #1a1a1a', color: '#666', fontSize: '10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#eb2828'; e.currentTarget.style.color = '#e8e8e8' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#666' }}
                >
                  {bt.icon} {bt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — editor */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', maxWidth: '780px' }}>
          {showMeta && !selectedId && (
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '24px' }}>INFORMATIONS GÉNÉRALES</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>TITRE (FRANÇAIS)</label><input style={inp} placeholder="Opération Inbox Zero" value={meta.titleFr} onChange={e => setMeta(m => ({ ...m, titleFr: e.target.value }))} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>TITLE (ENGLISH)</label><input style={inp} placeholder="Operation Inbox Zero" value={meta.titleEn} onChange={e => setMeta(m => ({ ...m, titleEn: e.target.value }))} /></div>
                <div><label style={lbl}>CATÉGORIE</label><select style={inp} value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label style={lbl}>NIVEAU</label><select style={inp} value={meta.difficulty} onChange={e => setMeta(m => ({ ...m, difficulty: e.target.value }))}><option value="beginner">Débutant</option><option value="intermediate">Intermédiaire</option><option value="advanced">Avancé</option></select></div>
                <div><label style={lbl}>DURÉE (min)</label><input style={inp} type="number" min="5" max="60" value={meta.duration} onChange={e => setMeta(m => ({ ...m, duration: e.target.value }))} /></div>
                <div><label style={lbl}>STATUT</label><select style={inp} value={meta.status} onChange={e => setMeta(m => ({ ...m, status: e.target.value }))}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>DESCRIPTION</label><textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} /></div>
              </div>
              {blocks.length === 0 && (
                <div style={{ marginTop: '32px', padding: '24px', border: '1px dashed #1a1a1a', textAlign: 'center', color: '#333', fontSize: '13px' }}>
                  Après les infos, ajoutez des blocs depuis le panneau gauche ↙
                </div>
              )}
            </div>
          )}

          {selectedBlock && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <span style={{ fontSize: '20px' }}>{blockType(selectedBlock.type).icon}</span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#eb2828', letterSpacing: '0.15em' }}>{blockType(selectedBlock.type).label.toUpperCase()}</span>
              </div>
              {renderEditor()}
            </div>
          )}

          {!showMeta && !selectedBlock && (
            <div style={{ textAlign: 'center', color: '#333', padding: '60px 0', fontSize: '13px' }}>
              Sélectionne un bloc dans la liste ou ajoutes-en un nouveau ↙
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
