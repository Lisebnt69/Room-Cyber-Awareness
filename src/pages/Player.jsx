import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { emails as emailsFr, emailsEn, logLines as logLinesFr, logLinesEn } from '../data/scenarioData'
import Logo from '/roomca-logo.png'
import LangToggle from '../components/LangToggle'
import { db } from '../services/db'

function useTimer(initial, running) {
  const [seconds, setSeconds] = useState(initial)
  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [running])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return { display: `${mm}:${ss}`, seconds }
}

function ConfirmDialog({ title, subtitle, confirmLabel, cancelLabel, onConfirm, onCancel, danger = true }) {
  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#0a0a0a', border: '1px solid var(--border)', borderTop: `2px solid ${danger ? 'var(--red)' : '#f59e0b'}`, maxWidth: '440px', width: '100%', padding: '32px', animation: 'fadeInUp 0.25s ease' }}
      >
        <div style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: 'var(--text-light)', marginBottom: '10px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>{subtitle}</div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onCancel} style={{ padding: '10px 20px', fontSize: '12px' }}>{cancelLabel}</button>
          <button
            onClick={onConfirm}
            style={{ padding: '10px 20px', fontFamily: 'var(--font-title)', fontSize: '12px', letterSpacing: '0.08em', background: danger ? 'rgba(235,40,40,0.15)' : 'rgba(245,158,11,0.15)', border: `1px solid ${danger ? 'var(--red)' : '#f59e0b'}`, color: danger ? 'var(--red)' : '#f59e0b', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function PhaseIntro({ onStart, previewScenario }) {
  const { t } = useLang()
  const [step, setStep] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)
  const storyBlocks = previewScenario?.storyBlocks || []
  const lines = [
    { t: t('playerLine1'), c: 'var(--red)' },
    { t: t('playerLine2'), c: 'var(--text-muted)' },
    { t: t('playerLine3'), c: '#f59e0b' },
    { t: t('playerLine4'), c: '#f59e0b' },
    { t: t('playerLine5'), c: 'var(--red)' },
    { t: t('playerLine6'), c: 'var(--text-secondary)' },
    { t: t('playerLine7'), c: 'var(--text-secondary)' },
    { t: t('playerLine8'), c: '#22c55e' },
  ]
  useEffect(() => {
    if (step < lines.length) {
      const timer = setTimeout(() => setStep(s => s + 1), step === 0 ? 400 : 480)
      return () => clearTimeout(timer)
    }
  }, [step])
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.4 }} />
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 10 }}>
        <LangToggle />
      </div>
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '720px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="tag" style={{ display: 'inline-flex', marginBottom: '16px' }}><span className="status-dot red" /> {t('playerIncidentTag')}</div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px' }}>{t('playerOperation')} <span style={{ color: 'var(--red)' }}>{previewScenario?.title || 'INBOX ZERO'}</span></h1>
          {previewScenario && <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>Mode test créateur (vue joueur)</div>}
        </div>
        {storyBlocks.length > 0 && (
          <div style={{ marginBottom: '16px', border: '1px solid #1c1c1c', background: '#050505' }}>
            <div style={{ height: '180px', background: storyBlocks[storyIndex]?.visual ? `url(${storyBlocks[storyIndex].visual}) center/cover no-repeat` : 'linear-gradient(135deg,#121212,#2a2a2a)' }} />
            <div style={{ padding: '14px 18px' }}>
              <div style={{ fontFamily: 'var(--font-title)', color: 'var(--text-light)' }}>{storyBlocks[storyIndex]?.title || 'Bloc narratif'}</div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>{storyBlocks[storyIndex]?.text || ''}</div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{storyIndex + 1}/{storyBlocks.length}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setStoryIndex(s => Math.max(0, s - 1))} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '11px' }}>◀</button>
                  <button onClick={() => setStoryIndex(s => Math.min(storyBlocks.length - 1, s + 1))} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '11px' }}>▶</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ background: '#050505', border: '1px solid #1c1c1c', borderTop: '2px solid var(--red)', padding: '32px', fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 2.4, minHeight: '300px' }}>
          {lines.slice(0, step).map((line, i) => <div key={i} style={{ color: line.c, animation: 'fadeIn 0.3s ease' }}>&gt; {line.t}</div>)}
          {step < lines.length && <span className="animate-blink" style={{ color: 'var(--red)' }}>█</span>}
        </div>
        {step >= lines.length && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', animation: 'fadeInUp 0.5s ease' }}>
            <button className="btn-primary" onClick={onStart} style={{ fontSize: '15px', padding: '14px 44px' }}>{t('playerStart')}</button>
          </div>
        )}
      </div>
    </div>
  )
}

function PhaseInbox({ onComplete, score, setScore, previewScenario, onRestart, onQuit }) {
  const { t, lang } = useLang()
  const [paused, setPaused] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'restart' | 'quit' | null
  const defaultEmails = lang === 'en' ? emailsEn : emailsFr
  const previewEmail = previewScenario ? {
    id: 999,
    fromName: previewScenario.fakeEmailSender || 'Preview Sender',
    from: previewScenario.fakeEmailSender || 'preview@scenario.local',
    subject: previewScenario.fakeEmailSubject || (lang === 'en' ? 'Preview Scenario Email' : 'Email de scénario (preview)'),
    preview: previewScenario.fakeEmailBody || (lang === 'en' ? 'Scenario preview body' : 'Corps du scénario en aperçu'),
    body: `${previewScenario.fakeEmailBody || ''}\n\n${previewScenario.fakeLinkUrl || ''}`,
    time: '09:12',
    read: false,
    safe: false,
    suspiciousLink: previewScenario.fakeLinkUrl || '',
    hasAttachment: false,
    clues: [
      { id: 'p-domain', type: 'domain', points: 120, label: lang === 'en' ? 'Suspicious sender' : 'Expéditeur suspect', description: lang === 'en' ? 'Domain mismatch with company sender.' : 'Le domaine ne correspond pas au domaine attendu.' },
      { id: 'p-link', type: 'link', points: 160, label: lang === 'en' ? 'Suspicious link' : 'Lien suspect', description: lang === 'en' ? 'Link points outside trusted perimeter.' : 'Le lien pointe hors périmètre de confiance.' },
      { id: 'p-urgency', type: 'urgency', points: 110, label: lang === 'en' ? 'Urgency pressure' : 'Pression d’urgence', description: lang === 'en' ? 'Urgent wording to bypass controls.' : 'Le message force une action rapide pour contourner les contrôles.' },
    ],
  } : null
  const emails = previewEmail ? [previewEmail] : defaultEmails
  // logLines resolved via import below
  const [selected, setSelected] = useState(null)
  const [found, setFound] = useState([])
  const [showHint, setShowHint] = useState(null)
  const [glitch, setGlitch] = useState(false)
  const [classified, setClassified] = useState({})
  const timer = useTimer(900, !paused && !confirm)

  const discoverClue = (clue) => {
    if (found.includes(clue.id)) return
    setFound(f => [...f, clue.id])
    setScore(s => s + clue.points)
    setShowHint(clue)
    setGlitch(true)
    setTimeout(() => setGlitch(false), 600)
    setTimeout(() => setShowHint(null), 4000)
  }

  const classify = (emailId, verdict) => setClassified(c => ({ ...c, [emailId]: verdict }))
  const allClassified = emails.every(e => classified[e.id])
  const levelColor = (l) => l === 'CRITICAL' ? 'var(--red)' : l === 'ALERT' || l === 'WARN' ? '#f59e0b' : 'var(--text-muted)'

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', animation: glitch ? 'glitch 0.5s linear' : 'none' }}>
      {/* Header bar */}
      <div style={{ background: '#080808', borderBottom: '1px solid var(--border-subtle)', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <img
  src={Logo}
  alt="ROOMCA"
  style={{ height: '32px', width: 'auto', display: 'block' }}
/>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[[t('playerScenarioLabel'), (previewScenario?.title || 'INBOX ZERO').toUpperCase(), 'var(--text-light)'], [t('playerCluesLabel'), `${found.length}/6`, 'var(--red)'], [t('playerScoreLabel'), score, '#22c55e'], [t('playerTimeLabel'), timer.display, timer.seconds < 120 ? 'var(--red)' : 'var(--text-light)']].map(([lbl, val, col]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{lbl}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '18px', color: col }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setPaused(p => !p)}
            title={paused ? t('playerResume') : t('playerPause')}
            style={{ padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em', background: paused ? 'rgba(34,197,94,0.12)' : 'transparent', border: `1px solid ${paused ? '#22c55e' : 'var(--border-subtle)'}`, color: paused ? '#22c55e' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {paused ? t('playerResume') : t('playerPause')}
          </button>
          <button
            onClick={() => setConfirm('restart')}
            title={t('playerRestart')}
            style={{ padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {t('playerRestart')}
          </button>
          <button
            onClick={() => setConfirm('quit')}
            title={t('playerQuit')}
            style={{ padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {t('playerQuit')}
          </button>
          <LangToggle />
          <div className="tag">
            <span className={`status-dot ${paused ? '' : 'red'}`} style={paused ? { background: '#f59e0b' } : undefined} />
            {paused ? t('playerPausedTitle') : t('playerInProgress')}
          </div>
        </div>
      </div>

      {/* Clue popup */}
      {showHint && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 200, background: 'var(--bg-card)', border: '1px solid var(--red)', padding: '16px 20px', maxWidth: '320px', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.15em', marginBottom: '8px' }}>{t('playerClueFound')} +{showHint.points} pts</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{showHint.label}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{showHint.description}</div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Email list */}
        <div style={{ width: '320px', flexShrink: 0, borderRight: '1px solid var(--border-subtle)', background: '#080808' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            {t('playerInbox')} — sophieb@roomca-corp.com
          </div>
          {emails.map(email => (
            <div key={email.id} onClick={() => setSelected(email)} style={{ padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', background: selected?.id === email.id ? 'rgba(235,40,40,0.08)' : 'transparent', borderLeft: selected?.id === email.id ? '2px solid var(--red)' : '2px solid transparent', transition: 'all 0.15s' }}
              onMouseEnter={e => { if (selected?.id !== email.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { if (selected?.id !== email.id) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: email.read ? 400 : 700, color: email.read ? 'var(--text-muted)' : 'var(--text-light)' }}>{email.fromName}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{email.time}</span>
              </div>
              <div style={{ fontSize: '12px', color: email.read ? 'var(--text-muted)' : 'var(--text-secondary)', fontWeight: email.read ? 400 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{email.subject}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.preview}</div>
              {classified[email.id] && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', padding: '2px 8px', border: '1px solid', borderColor: classified[email.id] === 'phishing' ? 'var(--red)' : '#22c55e', color: classified[email.id] === 'phishing' ? 'var(--red)' : '#22c55e', background: classified[email.id] === 'phishing' ? 'rgba(235,40,40,0.1)' : 'rgba(34,197,94,0.1)' }}>
                    {classified[email.id] === 'phishing' ? t('playerTagPhishing') : t('playerTagSafe')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Email body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', marginBottom: '16px' }}>{selected.subject}</h2>
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>{t('playerFrom')}</div>
                    <div style={{ fontSize: '13px', cursor: 'pointer', padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s' }}
                      onClick={() => { const c = selected.clues?.find(cl => cl.type === 'domain'); if (c) discoverClue(c) }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(235,40,40,0.06)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                      title={t('playerInspectTitle')}
                    >
                      {selected.from}{!selected.safe && <span style={{ marginLeft: '8px', color: 'var(--red)', fontSize: '11px', fontFamily: 'var(--mono)' }}>🔍</span>}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>{t('playerTime')}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.time}</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 2.2, color: 'var(--text-secondary)', whiteSpace: 'pre-line', maxWidth: '640px' }}>
                  {selected.body.split('\n').map((line, i) => {
                    if (selected.suspiciousLink && line.includes(selected.suspiciousLink)) {
                      return <span key={i}><span style={{ color: 'var(--red)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }} onClick={() => { const c = selected.clues?.find(cl => cl.type === 'link'); if (c) discoverClue(c) }} title={`${t('playerClickUrl')} ${selected.suspiciousLink}`}>
                        {lang === 'en' ? 'Click here to verify your account' : 'Cliquez ici pour vérifier votre compte'}
                      </span>{'\n'}</span>
                    }
                    if (line.includes('24 heures') || line.includes('48 heures') || line.includes('24 hours') || line.includes('48 hours')) {
                      return <span key={i}><span style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 700, background: 'rgba(245,158,11,0.1)', padding: '0 4px' }} onClick={() => { const c = selected.clues?.find(cl => cl.type === 'urgency' || cl.type === 'context'); if (c) discoverClue(c) }}>{line}</span>{'\n'}</span>
                    }
                    return <span key={i}>{line}{'\n'}</span>
                  })}
                </div>
                {selected.hasAttachment && (
                  <div style={{ marginTop: '24px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <span style={{ color: 'var(--red)' }}>📎</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.attachmentName}</span>
                  </div>
                )}
                <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                  <button onClick={() => classify(selected.id, 'phishing')} style={{ padding: '10px 24px', fontFamily: 'var(--font-title)', fontSize: '12px', letterSpacing: '0.08em', background: classified[selected.id] === 'phishing' ? 'rgba(235,40,40,0.2)' : 'transparent', border: '1px solid var(--red)', color: 'var(--red)', cursor: 'pointer', transition: 'all 0.2s' }}>{t('playerMarkPhishing')}</button>
                  <button onClick={() => classify(selected.id, 'safe')} style={{ padding: '10px 24px', fontFamily: 'var(--font-title)', fontSize: '12px', letterSpacing: '0.08em', background: classified[selected.id] === 'safe' ? 'rgba(34,197,94,0.1)' : 'transparent', border: '1px solid #22c55e', color: '#22c55e', cursor: 'pointer', transition: 'all 0.2s' }}>{t('playerMarkSafe')}</button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text-muted)' }}>{t('playerSelectEmail')}</div>
              <div style={{ fontSize: '12px', color: '#333', fontFamily: 'var(--mono)' }}>{t('playerClickHint')}</div>
            </div>
          )}
        </div>

        {/* System log */}
        <div style={{ width: '300px', flexShrink: 0, borderLeft: '1px solid var(--border-subtle)', background: '#060606', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{t('playerLog')}</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {(lang === 'en' ? logLinesEn : logLinesFr).map((log, i) => (
              <div key={i} style={{ marginBottom: '10px', fontFamily: 'var(--mono)', fontSize: '10px', lineHeight: 1.7 }}>
                <span style={{ color: 'var(--text-muted)' }}>{log.time} </span>
                <span style={{ color: levelColor(log.level), fontWeight: 700 }}>[{log.level}]</span><br />
                <span style={{ color: 'var(--text-secondary)' }}>{log.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '12px' }}>{t('playerFoundClues')} ({found.length}/6)</div>
            {found.length === 0 && <div style={{ fontSize: '11px', color: '#333', fontFamily: 'var(--mono)' }}>{t('playerNoClues')}</div>}
            {found.map(id => {
              const clue = emails.flatMap(e => e.clues || []).find(c => c.id === id)
              return clue ? (
                <div key={id} style={{ marginBottom: '8px', padding: '8px 10px', background: 'rgba(235,40,40,0.06)', border: '1px solid rgba(235,40,40,0.2)', fontSize: '11px' }}>
                  <div style={{ color: 'var(--red)', fontFamily: 'var(--mono)', fontSize: '10px' }}>+{clue.points} pts</div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{clue.label}</div>
                </div>
              ) : null
            })}
            {allClassified && (
              <button className="btn-primary" onClick={() => onComplete(score)} style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '12px', padding: '10px' }}>
                {t('playerFinish')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.25s ease' }}>
          <div style={{ textAlign: 'center', maxWidth: '460px' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '56px', color: '#f59e0b', marginBottom: '16px' }}>⏸</div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '28px', color: 'var(--text-light)', marginBottom: '10px' }}>{t('playerPausedTitle')}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>{t('playerPausedSub')}</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => setPaused(false)} style={{ padding: '12px 28px' }}>{t('playerResume')}</button>
              <button className="btn-secondary" onClick={() => setConfirm('restart')} style={{ padding: '12px 28px' }}>{t('playerRestart')}</button>
              <button className="btn-secondary" onClick={() => setConfirm('quit')} style={{ padding: '12px 28px' }}>{t('playerQuit')}</button>
            </div>
          </div>
        </div>
      )}

      {confirm === 'restart' && (
        <ConfirmDialog
          title={t('playerConfirmRestartTitle')}
          subtitle={t('playerConfirmRestartSub')}
          confirmLabel={t('playerConfirmYes')}
          cancelLabel={t('playerConfirmNo')}
          danger={false}
          onConfirm={() => { setConfirm(null); setPaused(false); onRestart && onRestart() }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {confirm === 'quit' && (
        <ConfirmDialog
          title={t('playerConfirmQuitTitle')}
          subtitle={t('playerConfirmQuitSub')}
          confirmLabel={t('playerConfirmYes')}
          cancelLabel={t('playerConfirmNo')}
          danger={true}
          onConfirm={() => { setConfirm(null); onQuit && onQuit() }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

// Workaround for variable reference in PhaseInbox

function PhaseDebrief({ score, onRetry, onExit, onDashboard }) {
  const { t } = useLang()
  const maxScore = 1000
  const pct = Math.round((score / maxScore) * 100)
  const success = pct >= 60
  const [showCert, setShowCert] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 10 }}>
        <LangToggle />
      </div>
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '720px', animation: 'fadeInUp 0.6s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '52px', color: success ? '#22c55e' : 'var(--red)', marginBottom: '8px' }}>{success ? '✓' : '✗'}</div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', marginBottom: '8px' }}>{success ? t('debriefSuccess') : t('debriefFailure')}</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{success ? t('debriefSuccessSub') : t('debriefFailureSub')}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: `2px solid ${success ? '#22c55e' : 'var(--red)'}`, padding: '36px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '32px', textAlign: 'center', marginBottom: '32px' }}>
            {[[t('debriefScore'), score, 'var(--red)', `/ ${maxScore} pts`], [t('debriefAccuracy'), `${pct}%`, success ? '#22c55e' : '#f59e0b', ''], [t('debriefCoins'), `+${success ? 50 : 20}`, '#f59e0b', '']].map(([lbl, val, col, sub]) => (
              <div key={lbl}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>{lbl}</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '40px', color: col, fontWeight: 700 }}>{val}</div>
                {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--border-subtle)', height: '4px', marginBottom: '32px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: success ? '#22c55e' : 'var(--red)', transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '16px' }}>{t('debriefLearned')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[t('debriefL1'), t('debriefL2'), t('debriefL3'), t('debriefL4')].map((txt) => (
              <div key={txt} style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{txt}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {success && <button className="btn-primary" onClick={() => setShowCert(true)} style={{ padding: '12px 32px' }}>{t('debriefCert')}</button>}
          <button className="btn-secondary" onClick={onRetry} style={{ padding: '12px 32px' }}>{t('debriefRetry')}</button>
          <button className="btn-secondary" onClick={onDashboard || onExit} style={{ padding: '12px 32px' }}>📊 Mon Dashboard</button>
          <button className="btn-secondary" onClick={onExit} style={{ padding: '12px 32px' }}>{t('debriefBack')}</button>
        </div>
      </div>

      {showCert && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }} onClick={() => setShowCert(false)}>
          <div style={{ background: '#0a0a0a', border: '1px solid var(--border)', maxWidth: '600px', width: '100%', padding: '48px', textAlign: 'center', position: 'relative', animation: 'fadeInUp 0.4s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', inset: '8px', border: '1px solid rgba(235,40,40,0.2)', pointerEvents: 'none' }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.3em', marginBottom: '24px' }}>{t('certOfficial')}</div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.15em' }}>{t('certAwarded')}</div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', color: 'var(--text-light)', marginBottom: '20px' }}>{t('certAnalyst')}</div>
            <div style={{ width: '60px', height: '2px', background: 'var(--red)', margin: '0 auto 20px' }} />
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('certFor')}</div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '20px', color: 'var(--red)', marginBottom: '24px' }}>{t('certOperation')}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{t('certScore')} {score} {t('certPts')} — {new Date().toLocaleDateString()}</div>
            <div style={{ marginTop: '32px', fontFamily: 'var(--mono)', fontSize: '28px', color: 'var(--red)' }}>ROOMCA</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Player() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [phase, setPhase] = useState('intro')
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [gameKey, setGameKey] = useState(0)
  const previewScenario = useMemo(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('preview') !== '1') return null
    const raw = localStorage.getItem('roomca_preview_scenario')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [location.search])

  const handleExit = () => navigate('/dashboard')

  const handleRestart = () => {
    setScore(0)
    setStartTime(Date.now())
    setGameKey(k => k + 1)
    setPhase('inbox')
  }

  const handleRetryFromDebrief = () => {
    setScore(0)
    setGameKey(k => k + 1)
    setPhase('intro')
  }

  const handleComplete = (s) => {
    setScore(s)
    setPhase('debrief')
    // Save to DB
    if (user) {
      const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 600
      db.saveScenarioResult(user.id, {
        scenarioId: 'scenario_1',
        scenarioName: 'Inbox Zero',
        score: s,
        passed: s >= 600,
        duration
      })
      if (s >= 1000) db.awardBadge(user.id, { id: 'perfect_score', name: 'Perfection', icon: '💯' })
      if (s > 0) db.awardBadge(user.id, { id: 'first_blood', name: 'Premier Sang', icon: '🩸' })
    }
  }

  if (phase === 'intro') return <PhaseIntro key={`intro-${gameKey}`} previewScenario={previewScenario} onStart={() => { setPhase('inbox'); setStartTime(Date.now()) }} />
  if (phase === 'inbox') return (
    <PhaseInbox
      key={`inbox-${gameKey}`}
      previewScenario={previewScenario}
      onComplete={handleComplete}
      score={score}
      setScore={setScore}
      onRestart={handleRestart}
      onQuit={handleExit}
    />
  )
  return <PhaseDebrief score={score} onRetry={handleRetryFromDebrief} onExit={handleExit} onDashboard={() => navigate('/dashboard')} />
}
