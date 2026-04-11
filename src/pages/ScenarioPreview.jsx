import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

// ─── Block Renderers ──────────────────────────────────────────────────────────

function EmailBlock({ data }) {
  return (
    <div style={{ border: '1px solid #333', borderRadius: '4px', overflow: 'hidden', fontFamily: 'monospace' }}>
      <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '12px 16px', fontSize: '11px', color: '#888', letterSpacing: '0.08em' }}>
        APERCU EMAIL
      </div>
      <div style={{ background: '#0a0a0a', padding: '20px 24px' }}>
        <div style={{ marginBottom: '8px', fontSize: '12px' }}>
          <span style={{ color: '#555', fontFamily: 'var(--mono)' }}>DE: </span>
          <span style={{ color: '#e8e8e8' }}>{data.from || data.sender || 'expediteur@exemple.com'}</span>
        </div>
        <div style={{ marginBottom: '16px', fontSize: '12px' }}>
          <span style={{ color: '#555', fontFamily: 'var(--mono)' }}>OBJET: </span>
          <span style={{ color: '#e8e8e8', fontWeight: 600 }}>{data.subject || '(sans objet)'}</span>
        </div>
        <div style={{ borderTop: '1px solid #222', paddingTop: '16px', fontSize: '13px', lineHeight: '1.7', color: '#ccc', whiteSpace: 'pre-wrap' }}>
          {data.body || data.content || '(corps du mail vide)'}
        </div>
        {(data.linkText || data.link) && (
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #222' }}>
            <span style={{ color: '#4a9eff', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>
              {data.linkText || (typeof data.link === 'object' ? data.link?.text : data.link) || 'Cliquez ici'}
            </span>
            <span style={{ marginLeft: '8px', fontSize: '11px', color: '#eb2828' }}>[LIEN PIEGE]</span>
          </div>
        )}
      </div>
    </div>
  )
}

function FakeLinkBlock({ data }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', padding: '20px 24px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '12px' }}>
        LIEN PIEGE — DEMO SURVOL
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{ color: '#4a9eff', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px', padding: '4px 0' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {data.label || data.linkText || data.text || 'Lien suspect'}
        </span>
        {hovered && (
          <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '6px', background: '#1a1a1a', border: '1px solid #eb2828', borderRadius: '4px', padding: '8px 12px', fontSize: '11px', color: '#eb2828', fontFamily: 'var(--mono)', whiteSpace: 'nowrap', zIndex: 10 }}>
            ⚠ {data.tooltip || data.hoverText || data.realUrl || 'URL malveillante détectée'}
          </div>
        )}
      </div>
      {data.url && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#555', fontFamily: 'var(--mono)' }}>
          URL: {data.url}
        </div>
      )}
    </div>
  )
}

function PhotoBlock({ data, blockId }) {
  const [hotspots, setHotspots] = useState(data.hotspots || [])
  const [dragging, setDragging] = useState(null)
  const imgRef = useRef(null)

  const updateLocalHotspot = (id, changes) => {
    setHotspots(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h))
  }

  if (!data.url && !data.src && !data.image) {
    return (
      <div style={{ background: '#0a0a0a', border: '1px dashed #333', padding: '40px', textAlign: 'center', color: '#555', fontFamily: 'var(--mono)', fontSize: '12px' }}>
        [IMAGE NON CONFIGUREE]
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '10px 16px', fontSize: '10px', color: '#555', fontFamily: 'var(--mono)', letterSpacing: '0.12em' }}>
        PHOTO / MAPPING — {hotspots.length} POINT(S) CHAUD(S) — GLISSEZ POUR DEPLACER
      </div>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <img
          ref={imgRef}
          src={data.url || data.src || data.image}
          alt="scenario"
          style={{ width: '100%', display: 'block', userSelect: 'none' }}
          draggable={false}
        />
        {hotspots.map((h, idx) => (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              left: `${h.x}%`,
              top: `${h.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: dragging === h.id ? '#eb2828' : 'rgba(235,40,40,0.85)',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'var(--mono)',
              cursor: 'grab',
              zIndex: 5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              touchAction: 'none',
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              setDragging(h.id)
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerMove={(e) => {
              if (dragging !== h.id) return
              const rect = imgRef.current.getBoundingClientRect()
              const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
              const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)))
              updateLocalHotspot(h.id, { x, y })
            }}
            onPointerUp={async (e) => {
              if (dragging !== h.id) return
              setDragging(null)
              const current = hotspots.find(hs => hs.id === h.id)
              if (current) {
                await fetch(`/api/hotspots/${h.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ x: current.x, y: current.y }),
                }).catch(() => {})
              }
            }}
            title={h.label}
          >
            {idx + 1}
          </div>
        ))}
      </div>
      {hotspots.length > 0 && (
        <div style={{ background: '#0a0a0a', borderTop: '1px solid #222', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#555', letterSpacing: '0.12em', marginBottom: '12px' }}>POINTS CHAUDS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hotspots.map((h, idx) => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eb2828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                  {idx + 1}
                </div>
                <input
                  defaultValue={h.label}
                  style={{ flex: 1, background: '#111', border: '1px solid #333', color: '#e8e8e8', padding: '6px 10px', fontSize: '12px', fontFamily: 'var(--mono)', outline: 'none' }}
                  onBlur={async (e) => {
                    const label = e.target.value
                    updateLocalHotspot(h.id, { label })
                    await fetch(`/api/hotspots/${h.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ label }),
                    }).catch(() => {})
                  }}
                />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#444' }}>
                  x:{h.x} y:{h.y}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QuizBlock({ data }) {
  const [answered, setAnswered] = useState({})
  const questions = data.questions || []

  if (questions.length === 0) {
    return (
      <div style={{ background: '#0a0a0a', border: '1px dashed #333', padding: '24px', color: '#555', fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center' }}>
        [QUIZ — AUCUNE QUESTION CONFIGUREE]
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '10px 16px', fontSize: '10px', color: '#555', fontFamily: 'var(--mono)', letterSpacing: '0.12em' }}>
        QUIZ — {questions.length} QUESTION(S)
      </div>
      <div style={{ background: '#0a0a0a', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {questions.map((q, qi) => (
          <div key={qi}>
            <div style={{ fontSize: '14px', color: '#e8e8e8', marginBottom: '12px', fontWeight: 600 }}>
              {qi + 1}. {q.question || q.text || '(question vide)'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(q.options || q.answers || []).map((opt, oi) => {
                const optText = typeof opt === 'object' ? (opt.text || opt.label) : opt
                const isCorrect = typeof opt === 'object' ? opt.correct : (oi === q.correctIndex)
                const selected = answered[qi] !== undefined
                const isSelected = answered[qi] === oi
                let bg = '#111'
                let border = '1px solid #333'
                let color = '#ccc'
                if (selected && isSelected && isCorrect) { bg = 'rgba(34,197,94,0.1)'; border = '1px solid #22c55e'; color = '#22c55e' }
                else if (selected && isSelected && !isCorrect) { bg = 'rgba(235,40,40,0.1)'; border = '1px solid #eb2828'; color = '#eb2828' }
                else if (selected && isCorrect) { bg = 'rgba(34,197,94,0.07)'; border = '1px solid #22c55e'; color = '#22c55e' }
                return (
                  <button
                    key={oi}
                    onClick={() => !selected && setAnswered(a => ({ ...a, [qi]: oi }))}
                    style={{ background: bg, border, color, padding: '10px 14px', textAlign: 'left', fontSize: '13px', cursor: selected ? 'default' : 'pointer', fontFamily: 'inherit', borderRadius: '3px', transition: 'all 0.15s' }}
                  >
                    {String.fromCharCode(65 + oi)}. {optText}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideoBlock({ data }) {
  const src = data.url || data.src || data.videoUrl || ''
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be')
  let embedSrc = src
  if (isYoutube) {
    const match = src.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (match) embedSrc = `https://www.youtube.com/embed/${match[1]}`
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '10px 16px', fontSize: '10px', color: '#555', fontFamily: 'var(--mono)', letterSpacing: '0.12em' }}>
        VIDEO
      </div>
      {src ? (
        isYoutube ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
            <iframe
              src={embedSrc}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="video"
            />
          </div>
        ) : (
          <video controls style={{ width: '100%', display: 'block', background: '#000' }}>
            <source src={src} />
          </video>
        )
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: '#555', fontFamily: 'var(--mono)', fontSize: '12px', background: '#0a0a0a' }}>
          [VIDEO NON CONFIGUREE]
        </div>
      )}
    </div>
  )
}

function TextBlock({ data }) {
  return (
    <div style={{ border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '10px 16px', fontSize: '10px', color: '#555', fontFamily: 'var(--mono)', letterSpacing: '0.12em' }}>
        TEXTE NARRATIF
      </div>
      <div style={{ background: '#0a0a0a', padding: '20px 24px', fontSize: '14px', lineHeight: '1.8', color: '#ccc', whiteSpace: 'pre-wrap' }}>
        {data.content || data.text || data.body || '(contenu vide)'}
      </div>
    </div>
  )
}

function BlockRenderer({ block }) {
  const { type, ...data } = block
  switch (type) {
    case 'email':
    case 'fakeEmail':
      return <EmailBlock data={data} />
    case 'fakelink':
    case 'fakeLink':
      return <FakeLinkBlock data={data} />
    case 'photo':
    case 'mapping':
      return <PhotoBlock data={data} blockId={block.id} />
    case 'quiz':
      return <QuizBlock data={data} />
    case 'video':
      return <VideoBlock data={data} />
    case 'text':
      return <TextBlock data={data} />
    default:
      return (
        <div style={{ background: '#0a0a0a', border: '1px dashed #333', padding: '16px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: '#555' }}>
          [BLOC TYPE "{type}" — APERCU NON DISPONIBLE]
        </div>
      )
  }
}

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

function DiffBadge({ difficulty }) {
  const colors = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#eb2828' }
  const labels = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }
  return (
    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', border: `1px solid ${colors[difficulty] || '#555'}`, color: colors[difficulty] || '#555', borderRadius: '2px', letterSpacing: '0.08em' }}>
      {labels[difficulty] || difficulty}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScenarioPreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang } = useLang()

  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Assignment state
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [assignEmail, setAssignEmail] = useState('')
  const [assignName, setAssignName] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN
  const isPlayer = user?.role === ROLES.PLAYER
  const isAdmin = user?.role === ROLES.ADMIN || isSuperAdmin

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    setLoading(true)
    fetch(`/api/scenarios/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => { setScenario(data); setLoading(false) })
      .catch(err => { setError(String(err)); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (isSuperAdmin) {
      fetch('/api/companies')
        .then(r => r.json())
        .then(data => {
          setCompanies(data)
          if (data.length > 0) setSelectedCompany(String(data[0].id))
        })
        .catch(() => {})
    }
  }, [isSuperAdmin])

  const handleAssignToCompany = async () => {
    if (!selectedCompany) return
    setAssignLoading(true)
    try {
      const res = await fetch(`/api/companies/${selectedCompany}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: Number(id) }),
      })
      if (res.ok) {
        showToast(lang === 'fr' ? 'Scénario assigné à l\'entreprise !' : 'Scenario assigned to company!')
      } else {
        const d = await res.json()
        showToast(d.error || 'Erreur', 'error')
      }
    } catch (e) {
      showToast('Erreur réseau', 'error')
    }
    setAssignLoading(false)
  }

  const handleAssignToPlayer = async () => {
    if (!assignEmail.trim()) return
    setAssignLoading(true)
    try {
      const res = await fetch(`/api/companies/1/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_email: assignEmail.trim(), player_name: assignName.trim() || assignEmail.trim(), scenario_id: Number(id) }),
      })
      if (res.ok) {
        showToast(lang === 'fr' ? `Scénario assigné à ${assignEmail} !` : `Scenario assigned to ${assignEmail}!`)
        setAssignEmail('')
        setAssignName('')
      } else {
        const d = await res.json()
        showToast(d.error || 'Erreur', 'error')
      }
    } catch (e) {
      showToast('Erreur réseau', 'error')
    }
    setAssignLoading(false)
  }

  const title = scenario ? (lang === 'fr' ? scenario.title_fr : (scenario.title_en || scenario.title_fr)) : ''

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '14px', color: '#555' }}>
        Chargement...
      </div>
    )
  }

  if (error || !scenario) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#eb2828' }}>Scénario introuvable</div>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 20px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '12px' }}>
          ← Retour
        </button>
      </div>
    )
  }

  const blocks = scenario.blocks || []

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#e8e8e8' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: toast.type === 'error' ? '#1a0a0a' : '#0a1a0a',
          border: `1px solid ${toast.type === 'error' ? '#eb2828' : '#22c55e'}`,
          color: toast.type === 'error' ? '#eb2828' : '#22c55e',
          padding: '12px 20px', fontFamily: 'var(--mono)', fontSize: '12px',
          borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050505', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: '1px solid #222', color: '#888', padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
          >
            ← {lang === 'fr' ? 'Retour' : 'Back'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#e8e8e8' }}>{title}</span>
            {scenario.category && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '2px 8px', border: '1px solid #333', color: '#888', borderRadius: '2px' }}>
                {scenario.category}
              </span>
            )}
            {scenario.difficulty && <DiffBadge difficulty={scenario.difficulty} />}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {scenario.duration && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#555' }}>
              ⏱ {scenario.duration} min
            </span>
          )}
          {isAdmin && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', padding: '3px 10px', background: 'rgba(235,40,40,0.1)', border: '1px solid #eb2828', color: '#eb2828', borderRadius: '2px', letterSpacing: '0.12em', fontWeight: 700 }}>
              MODE TEST
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>
        {/* Scenario info */}
        {scenario.description && (
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '16px 20px', marginBottom: '32px', borderLeft: '3px solid #eb2828' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#555', letterSpacing: '0.12em', marginBottom: '6px' }}>DESCRIPTION</div>
            <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>{scenario.description}</div>
          </div>
        )}

        {/* Blocks */}
        {blocks.length === 0 ? (
          <div style={{ background: '#0a0a0a', border: '1px dashed #333', padding: '60px', textAlign: 'center', color: '#555', fontFamily: 'var(--mono)', fontSize: '12px' }}>
            {lang === 'fr' ? 'Ce scénario ne contient aucun bloc.' : 'This scenario has no blocks.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            {blocks.map((block, idx) => (
              <div key={block.id || idx}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#444', letterSpacing: '0.15em', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Bloc {idx + 1} — {block.type}
                </div>
                <BlockRenderer block={block} />
              </div>
            ))}
          </div>
        )}

        {/* Assignment section — admin only */}
        {isAdmin && <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '40px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '24px' }}>
            {lang === 'fr' ? 'ASSIGNER CE SCENARIO' : 'ASSIGN THIS SCENARIO'}
          </div>

          {isSuperAdmin ? (
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#666', letterSpacing: '0.1em', marginBottom: '16px' }}>
                {lang === 'fr' ? 'ASSIGNER A UNE ENTREPRISE' : 'ASSIGN TO COMPANY'}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                  style={{ flex: 1, minWidth: '200px', background: '#111', border: '1px solid #333', color: '#e8e8e8', padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: '12px', outline: 'none' }}
                >
                  {companies.map(c => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAssignToCompany}
                  disabled={assignLoading || !selectedCompany}
                  style={{ background: assignLoading ? '#1a1a1a' : 'rgba(235,40,40,0.1)', border: '1px solid #eb2828', color: '#eb2828', padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.08em', transition: 'all 0.15s', opacity: assignLoading ? 0.5 : 1 }}
                >
                  {assignLoading ? '...' : (lang === 'fr' ? '+ Assigner à cette entreprise' : '+ Assign to company')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '24px', borderRadius: '4px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#666', letterSpacing: '0.1em', marginBottom: '16px' }}>
                {lang === 'fr' ? 'ASSIGNER A UN JOUEUR' : 'ASSIGN TO PLAYER'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="email"
                  placeholder={lang === 'fr' ? 'Email du joueur' : 'Player email'}
                  value={assignEmail}
                  onChange={e => setAssignEmail(e.target.value)}
                  style={{ background: '#111', border: '1px solid #333', color: '#e8e8e8', padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: '12px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder={lang === 'fr' ? 'Nom du joueur (optionnel)' : 'Player name (optional)'}
                  value={assignName}
                  onChange={e => setAssignName(e.target.value)}
                  style={{ background: '#111', border: '1px solid #333', color: '#e8e8e8', padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: '12px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
                <button
                  onClick={handleAssignToPlayer}
                  disabled={assignLoading || !assignEmail.trim()}
                  style={{ background: assignLoading ? '#1a1a1a' : 'rgba(235,40,40,0.1)', border: '1px solid #eb2828', color: '#eb2828', padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.08em', transition: 'all 0.15s', opacity: (assignLoading || !assignEmail.trim()) ? 0.5 : 1, alignSelf: 'flex-start' }}
                >
                  {assignLoading ? '...' : (lang === 'fr' ? '+ Assigner à ce joueur' : '+ Assign to player')}
                </button>
              </div>
            </div>
          )}
        </div>}
      </div>
    </div>
  )
}
