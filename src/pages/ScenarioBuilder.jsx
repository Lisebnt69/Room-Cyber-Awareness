import { useState, useRef } from 'react'
import Logo from '/roomca-logo.png'

const CATEGORIES = ['Phishing', 'Ransomware', 'Social Eng.', 'Insider', 'Réseau', 'Malware', 'OSINT']
const STATUSES = ['draft', 'beta', 'published']
const createId = () => Math.floor(Math.random() * 10_000_000)

const emptyMeta = {
  titleFr: '', titleEn: '', category: 'Phishing', difficulty: 'intermediate',
  duration: '15', description: '', status: 'draft',
}
const emptyBlocks = {
  coverImage: '', coverImageName: '', photoHotspots: [],
  fakeLinkLabel: '', fakeLinkUrl: '', fakeLinkHover: '',
  fakeEmailSender: '', fakeEmailSubject: '', fakeEmailBody: '',
  videoUrl: '', quizQuestions: [], narrative: '',
}

export default function ScenarioBuilder({ initialData = null, onSave, onBack }) {
  const isEdit = !!initialData

  const [tab, setTab] = useState('meta')
  const [meta, setMeta] = useState(initialData ? {
    titleFr: initialData.title?.fr || initialData.titleFr || '',
    titleEn: initialData.title?.en || initialData.titleEn || '',
    category: initialData.category || 'Phishing',
    difficulty: initialData.difficulty || 'intermediate',
    duration: initialData.duration || '15',
    description: initialData.description || '',
    status: initialData.status || 'draft',
  } : { ...emptyMeta })

  const [blocks, setBlocks] = useState(initialData ? {
    coverImage: initialData.coverImage || '',
    coverImageName: initialData.coverImageName || '',
    photoHotspots: initialData.photoHotspots || [],
    fakeLinkLabel: initialData.fakeLinkLabel || '',
    fakeLinkUrl: initialData.fakeLinkUrl || '',
    fakeLinkHover: initialData.fakeLinkHover || '',
    fakeEmailSender: initialData.fakeEmailSender || '',
    fakeEmailSubject: initialData.fakeEmailSubject || '',
    fakeEmailBody: initialData.fakeEmailBody || '',
    videoUrl: initialData.videoUrl || '',
    quizQuestions: initialData.quizQuestions || [],
    narrative: initialData.narrative || '',
  } : { ...emptyBlocks })

  const imgRef = useRef(null)
  const [hoverLink, setHoverLink] = useState(false)
  const [newOption, setNewOption] = useState({})

  const setB = (patch) => setBlocks(b => ({ ...b, ...patch }))

  const handlePhotoUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setB({ coverImage: ev.target.result, coverImageName: file.name })
    reader.readAsDataURL(file)
  }

  const addHotspot = (e) => {
    if (!blocks.coverImage) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setB({ photoHotspots: [...blocks.photoHotspots, { id: createId(), x, y, label: 'Zone' }] })
  }

  const updateHotspot = (id, patch) =>
    setB({ photoHotspots: blocks.photoHotspots.map(h => h.id === id ? { ...h, ...patch } : h) })

  const removeHotspot = (id) =>
    setB({ photoHotspots: blocks.photoHotspots.filter(h => h.id !== id) })

  const addQuestion = () => {
    const q = {
      id: createId(), prompt: '',
      options: [
        { id: createId(), text: '', isCorrect: true },
        { id: createId(), text: '', isCorrect: false },
        { id: createId(), text: '', isCorrect: false },
      ]
    }
    setB({ quizQuestions: [...blocks.quizQuestions, q] })
  }

  const updateQ = (qid, patch) =>
    setB({ quizQuestions: blocks.quizQuestions.map(q => q.id === qid ? { ...q, ...patch } : q) })

  const updateOpt = (qid, oid, patch) =>
    setB({
      quizQuestions: blocks.quizQuestions.map(q =>
        q.id === qid ? { ...q, options: q.options.map(o => o.id === oid ? { ...o, ...patch } : o) } : q
      )
    })

  const addOption = (qid) =>
    setB({
      quizQuestions: blocks.quizQuestions.map(q =>
        q.id === qid ? { ...q, options: [...q.options, { id: createId(), text: '', isCorrect: false }] } : q
      )
    })

  const removeQ = (qid) =>
    setB({ quizQuestions: blocks.quizQuestions.filter(q => q.id !== qid) })

  const handleSave = (status) => {
    if (onSave) onSave({ ...meta, ...blocks, status: status || meta.status, id: initialData?.id || Date.now() })
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', background: '#0d0d0d',
    border: '1px solid #2a2a2a', color: '#e8e8e8', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }
  const labelStyle = {
    display: 'block', fontSize: '10px', fontFamily: 'monospace',
    letterSpacing: '0.1em', color: '#666', marginBottom: '6px',
  }
  const sectionStyle = {
    background: '#111', border: '1px solid #1e1e1e', padding: '24px', marginBottom: '16px',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#e8e8e8', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 32px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080808', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={Logo} alt="ROOMCA" style={{ height: '28px' }} />
          <div style={{ width: '1px', height: '24px', background: '#1e1e1e' }} />
          <span style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>
            {isEdit ? `✎ MODIFIER — ${initialData.title?.fr || 'Scénario'}` : '+ NOUVEAU SCÉNARIO'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleSave('draft')} style={{ padding: '8px 18px', background: 'transparent', border: '1px solid #2a2a2a', color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace' }}>
            Sauvegarder brouillon
          </button>
          <button onClick={() => handleSave('published')} style={{ padding: '8px 18px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
            {isEdit ? '✓ Enregistrer' : '🚀 Publier'}
          </button>
          <button onClick={onBack} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a2a', color: '#555', fontSize: '12px', cursor: 'pointer' }}>✕</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #1a1a1a', display: 'flex', background: '#080808' }}>
        {[
          { id: 'meta', label: '① Infos de base' },
          { id: 'email', label: '② Faux email & lien' },
          { id: 'photo', label: '③ Photo & mapping' },
          { id: 'quiz', label: '④ Quizz' },
          { id: 'media', label: '⑤ Vidéo & narration' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '14px 24px', background: 'transparent', border: 'none',
            borderBottom: tab === t.id ? '2px solid #eb2828' : '2px solid transparent',
            color: tab === t.id ? '#e8e8e8' : '#555', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'monospace', letterSpacing: '0.05em', transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px', maxWidth: '860px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* ① META */}
        {tab === 'meta' && (
          <div>
            <div style={sectionStyle}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '20px' }}>INFORMATIONS GÉNÉRALES</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>TITRE (FRANÇAIS)</label>
                  <input style={inputStyle} placeholder="Ex: Opération Inbox Zero" value={meta.titleFr} onChange={e => setMeta(m => ({ ...m, titleFr: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>TITLE (ENGLISH)</label>
                  <input style={inputStyle} placeholder="Ex: Operation Inbox Zero" value={meta.titleEn} onChange={e => setMeta(m => ({ ...m, titleEn: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>CATÉGORIE</label>
                  <select style={inputStyle} value={meta.category} onChange={e => setMeta(m => ({ ...m, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>NIVEAU</label>
                  <select style={inputStyle} value={meta.difficulty} onChange={e => setMeta(m => ({ ...m, difficulty: e.target.value }))}>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>DURÉE (minutes)</label>
                  <input style={inputStyle} type="number" min="5" max="60" value={meta.duration} onChange={e => setMeta(m => ({ ...m, duration: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>STATUT</label>
                  <select style={inputStyle} value={meta.status} onChange={e => setMeta(m => ({ ...m, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>DESCRIPTION COURTE</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} />
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setTab('email')} style={{ padding: '10px 28px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>Suivant →</button>
            </div>
          </div>
        )}

        {/* ② FAKE EMAIL & LINK */}
        {tab === 'email' && (
          <div>
            <div style={sectionStyle}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '20px' }}>FAUX EMAIL DE PHISHING</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>EXPÉDITEUR</label>
                  <input style={inputStyle} placeholder="support@banque-secure.fr" value={blocks.fakeEmailSender} onChange={e => setB({ fakeEmailSender: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>OBJET</label>
                  <input style={inputStyle} placeholder="Alerte sécurité — action requise" value={blocks.fakeEmailSubject} onChange={e => setB({ fakeEmailSubject: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>CORPS DU MAIL</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={6} placeholder="Rédigez le contenu du faux email..." value={blocks.fakeEmailBody} onChange={e => setB({ fakeEmailBody: e.target.value })} />
                </div>
              </div>

              {/* Email preview */}
              {(blocks.fakeEmailSender || blocks.fakeEmailSubject || blocks.fakeEmailBody) && (
                <div style={{ border: '1px solid #2a2a2a', background: '#0a0a0a', padding: '16px', marginTop: '8px' }}>
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555', marginBottom: '10px' }}>APERÇU EMAIL</div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>De : <span style={{ color: '#eb2828' }}>{blocks.fakeEmailSender || 'expéditeur@exemple.com'}</span></div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px' }}>Objet : <span style={{ color: '#e8e8e8' }}>{blocks.fakeEmailSubject || 'Objet du mail'}</span></div>
                  <div style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.7, whiteSpace: 'pre-wrap', borderTop: '1px solid #1e1e1e', paddingTop: '12px' }}>{blocks.fakeEmailBody}</div>
                  {(blocks.fakeLinkLabel || blocks.fakeLinkUrl) && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e1e1e' }}>
                      <span
                        onMouseEnter={() => setHoverLink(true)}
                        onMouseLeave={() => setHoverLink(false)}
                        style={{ color: '#4ea1ff', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', position: 'relative' }}
                      >
                        {blocks.fakeLinkLabel || 'Cliquez ici'}
                        {hoverLink && blocks.fakeLinkHover && (
                          <span style={{ position: 'absolute', bottom: '-28px', left: 0, background: '#1a1a1a', border: '1px solid #333', padding: '4px 8px', fontSize: '11px', fontFamily: 'monospace', color: '#eb2828', whiteSpace: 'nowrap', zIndex: 10 }}>
                            {blocks.fakeLinkHover}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '20px' }}>FAUX LIEN (HOVER PIÈGE)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>TEXTE DU LIEN (affiché)</label>
                  <input style={inputStyle} placeholder="Vérifier mon compte" value={blocks.fakeLinkLabel} onChange={e => setB({ fakeLinkLabel: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>URL RÉELLE (malveillante)</label>
                  <input style={inputStyle} placeholder="http://banque-secure-login.xyz/auth" value={blocks.fakeLinkUrl} onChange={e => setB({ fakeLinkUrl: e.target.value })} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>TEXTE AU SURVOL (indice pour le joueur)</label>
                  <input style={inputStyle} placeholder="http://malware-download.ru/payload.exe" value={blocks.fakeLinkHover} onChange={e => setB({ fakeLinkHover: e.target.value })} />
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '6px' }}>Ce texte s'affiche dans la barre de statut quand le joueur survole le lien.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ③ PHOTO & MAPPING */}
        {tab === 'photo' && (
          <div>
            <div style={sectionStyle}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '20px' }}>IMAGE DE COUVERTURE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>IMPORTER UNE IMAGE</label>
                  <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e.target.files?.[0])}
                    style={{ ...inputStyle, padding: '8px', cursor: 'pointer' }} />
                  {blocks.coverImageName && <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '6px' }}>✓ {blocks.coverImageName}</div>}
                </div>
                <div>
                  <label style={labelStyle}>OU URL EXTERNE</label>
                  <input style={inputStyle} placeholder="https://exemple.com/image.jpg" value={blocks.coverImage && !blocks.coverImage.startsWith('data:') ? blocks.coverImage : ''} onChange={e => setB({ coverImage: e.target.value, coverImageName: '' })} />
                </div>
              </div>
              {blocks.coverImage && (
                <div>
                  <div style={{ fontSize: '11px', color: '#555', marginBottom: '8px', fontFamily: 'monospace' }}>
                    CLIQUE SUR L'IMAGE POUR PLACER DES ZONES INTERACTIVES
                  </div>
                  <div
                    onClick={addHotspot}
                    style={{ position: 'relative', cursor: 'crosshair', border: '1px solid #2a2a2a', overflow: 'hidden', userSelect: 'none' }}
                  >
                    <img src={blocks.coverImage} alt="" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block', opacity: 0.8 }} />
                    {blocks.photoHotspots.map(h => (
                      <div
                        key={h.id}
                        style={{
                          position: 'absolute', left: `${h.x}%`, top: `${h.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: 'rgba(235,40,40,0.9)', border: '2px solid #fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', color: '#fff', fontWeight: 700, pointerEvents: 'none',
                        }}
                      >
                        {blocks.photoHotspots.indexOf(h) + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!blocks.coverImage && (
                <div style={{ border: '2px dashed #1e1e1e', padding: '40px', textAlign: 'center', color: '#444', fontSize: '13px' }}>
                  Importez une image pour activer le mapping de zones
                </div>
              )}
            </div>

            {blocks.photoHotspots.length > 0 && (
              <div style={sectionStyle}>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '16px' }}>
                  ZONES INTERACTIVES ({blocks.photoHotspots.length})
                </div>
                {blocks.photoHotspots.map((h, idx) => (
                  <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px auto', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eb2828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                    <input style={inputStyle} value={h.label} onChange={e => updateHotspot(h.id, { label: e.target.value })} placeholder="Label de la zone" />
                    <input style={inputStyle} type="number" value={h.x} onChange={e => updateHotspot(h.id, { x: Number(e.target.value) })} placeholder="X%" />
                    <input style={inputStyle} type="number" value={h.y} onChange={e => updateHotspot(h.id, { y: Number(e.target.value) })} placeholder="Y%" />
                    <button onClick={() => removeHotspot(h.id)} style={{ padding: '8px 12px', background: 'rgba(235,40,40,0.1)', border: '1px solid rgba(235,40,40,0.3)', color: '#eb2828', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ④ QUIZ */}
        {tab === 'quiz' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666', letterSpacing: '0.15em' }}>
                {blocks.quizQuestions.length} QUESTION{blocks.quizQuestions.length !== 1 ? 'S' : ''}
              </div>
              <button onClick={addQuestion} style={{ padding: '8px 18px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>+ Ajouter une question</button>
            </div>

            {blocks.quizQuestions.length === 0 && (
              <div style={{ ...sectionStyle, textAlign: 'center', color: '#444', padding: '48px' }}>
                Aucune question — cliquez sur "+ Ajouter une question" pour commencer.
              </div>
            )}

            {blocks.quizQuestions.map((q, qi) => (
              <div key={q.id} style={{ ...sectionStyle, borderLeft: '3px solid #eb2828' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.1em' }}>QUESTION {qi + 1}</div>
                  <button onClick={() => removeQ(q.id)} style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>ÉNONCÉ</label>
                  <input style={inputStyle} value={q.prompt} onChange={e => updateQ(q.id, { prompt: e.target.value })} placeholder="Quelle est la bonne action ?" />
                </div>
                <div>
                  <label style={labelStyle}>RÉPONSES (cochez la ou les bonne(s))</label>
                  {q.options.map(o => (
                    <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <input style={{ ...inputStyle, borderColor: o.isCorrect ? '#22c55e' : '#2a2a2a' }} value={o.text} onChange={e => updateOpt(q.id, o.id, { text: e.target.value })} placeholder="Texte de la réponse" />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: o.isCorrect ? '#22c55e' : '#555', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <input type="checkbox" checked={!!o.isCorrect} onChange={e => updateOpt(q.id, o.id, { isCorrect: e.target.checked })} />
                        Correcte
                      </label>
                    </div>
                  ))}
                  <button onClick={() => addOption(q.id)} style={{ marginTop: '4px', padding: '6px 14px', background: 'transparent', border: '1px dashed #2a2a2a', color: '#555', fontSize: '11px', cursor: 'pointer', width: '100%' }}>
                    + Ajouter une réponse
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ⑤ MEDIA & NARRATION */}
        {tab === 'media' && (
          <div>
            <div style={sectionStyle}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '20px' }}>VIDÉO</div>
              <label style={labelStyle}>URL DE LA VIDÉO (YouTube, Vimeo, mp4...)</label>
              <input style={inputStyle} placeholder="https://www.youtube.com/watch?v=..." value={blocks.videoUrl} onChange={e => setB({ videoUrl: e.target.value })} />
              {blocks.videoUrl && blocks.videoUrl.includes('youtube') && (
                <div style={{ marginTop: '12px', position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    src={blocks.videoUrl.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                    title="Vidéo scénario"
                  />
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#eb2828', letterSpacing: '0.15em', marginBottom: '20px' }}>NARRATION / MISE EN SITUATION</div>
              <label style={labelStyle}>TEXTE NARRATIF (introduction immersive)</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical' }}
                rows={10}
                placeholder="Vous êtes chef de projet chez ACME Corp. Ce matin, en ouvrant votre messagerie, vous trouvez un email urgent de votre PDG..."
                value={blocks.narrative}
                onChange={e => setB({ narrative: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer save bar */}
      <div style={{ padding: '16px 32px', borderTop: '1px solid #1a1a1a', background: '#080808', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2a2a2a', color: '#555', fontSize: '12px', cursor: 'pointer' }}>
          ← Retour
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleSave('draft')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2a2a2a', color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace' }}>
            💾 Brouillon
          </button>
          <button onClick={() => handleSave('published')} style={{ padding: '10px 28px', background: '#eb2828', border: 'none', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
            {isEdit ? '✓ Enregistrer les modifications' : '🚀 Publier le scénario'}
          </button>
        </div>
      </div>
    </div>
  )
}
