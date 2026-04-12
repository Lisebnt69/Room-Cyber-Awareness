import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { unlockSFX, setSFXEnabled, playSuccess, playError, playClick, playScore, playVictory, playChapter, playWarning } from '../services/sfx'
import AssignModal from '../components/AssignModal'

// ─── Global hacking-error fx — dispatches a window event so the root overlay
// can fire on ANY error across any block type without prop drilling.
const HACK_ERROR_EVT = 'roomca:hack-error'
const LINK_WARN_EVT  = 'roomca:link-warn'
function errorFX() {
  playError()
  try { window.dispatchEvent(new CustomEvent(HACK_ERROR_EVT)) } catch { /* noop */ }
}
function linkWarnFX() {
  playError()
  try { window.dispatchEvent(new CustomEvent(LINK_WARN_EVT)) } catch { /* noop */ }
}
import { useAuth, ROLES } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import LangToggle from '../components/LangToggle'
import ThemeToggle from '../components/ThemeToggle'
import BrandLogo from '../components/BrandLogo'

// ─── Keyframes (injected once) ────────────────────────────────────────────────

const CSS_KEYFRAMES = `
  @keyframes blink-urgent { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.65)} }
  @keyframes scanline-move { 0%{transform:translateX(-100%)} 100%{transform:translateX(100vw)} }
  @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 currentColor} 70%{box-shadow:0 0 0 6px transparent} 100%{box-shadow:0 0 0 0 transparent} }
  @keyframes block-enter { 0%{opacity:0;transform:translateY(18px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes fade-in { 0%{opacity:0} 100%{opacity:1} }
  @keyframes chapter-zoom { 0%{opacity:0;transform:scale(1.25);letter-spacing:0.5em} 50%{opacity:1} 100%{opacity:1;transform:scale(1);letter-spacing:0.18em} }
  @keyframes chapter-fade-out { 0%{opacity:1} 100%{opacity:0;transform:scale(0.98)} }
  @keyframes slide-up { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes slide-down { 0%{opacity:0;transform:translateY(-24px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes start-glow { 0%,100%{box-shadow:0 0 30px currentColor, inset 0 0 20px rgba(255,255,255,0.05)} 50%{box-shadow:0 0 60px currentColor, inset 0 0 30px rgba(255,255,255,0.1)} }
  @keyframes big-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes score-float { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.6)} 15%{opacity:1;transform:translate(-50%,-90%) scale(1.2)} 100%{opacity:0;transform:translate(-50%,-160%) scale(0.9)} }
  @keyframes shake-x { 0%,100%{transform:translateX(0)} 15%,55%{transform:translateX(-10px)} 35%,75%{transform:translateX(10px)} }
  @keyframes shake-hard { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-6px,4px)} 20%{transform:translate(6px,-4px)} 30%{transform:translate(-4px,-6px)} 40%{transform:translate(4px,6px)} 50%{transform:translate(-8px,2px)} 60%{transform:translate(8px,-2px)} 70%{transform:translate(-2px,4px)} 80%{transform:translate(2px,-4px)} 90%{transform:translate(-4px,0)} }
  @keyframes radar-sweep { 0%{transform:translateX(-120%)} 100%{transform:translateX(120%)} }
  @keyframes ping-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }
  @keyframes card-flip { 0%{opacity:0;transform:perspective(800px) rotateY(-90deg)} 100%{opacity:1;transform:perspective(800px) rotateY(0)} }
  @keyframes success-ring { 0%{box-shadow:0 0 0 0 #22c55e99} 100%{box-shadow:0 0 0 24px transparent} }
  @keyframes wrong-ring { 0%{box-shadow:0 0 0 0 #eb2828bb} 100%{box-shadow:0 0 0 24px transparent} }
  @keyframes xp-bar { 0%{width:0} 100%{width:100%} }
  @keyframes cursor-pulse { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.15);opacity:1} }
  @keyframes hack-glitch {
    0%   { transform: translate(0,0) skewX(0); filter: hue-rotate(0) contrast(1); }
    10%  { transform: translate(-8px,3px) skewX(-4deg); filter: hue-rotate(90deg) contrast(1.8); }
    20%  { transform: translate(7px,-2px) skewX(3deg); filter: hue-rotate(-40deg) contrast(1.2); }
    30%  { transform: translate(-4px,6px) skewX(-2deg); filter: hue-rotate(180deg) contrast(2) saturate(1.8); }
    40%  { transform: translate(5px,-5px) skewX(2deg); filter: hue-rotate(30deg) contrast(1.6); }
    50%  { transform: translate(-10px,2px) skewX(-5deg); filter: hue-rotate(-90deg) contrast(2.2); }
    60%  { transform: translate(8px,4px) skewX(4deg); filter: hue-rotate(60deg) contrast(1.4); }
    70%  { transform: translate(-3px,-3px) skewX(-1deg); filter: hue-rotate(-30deg) contrast(1.8); }
    80%  { transform: translate(6px,1px) skewX(2deg); filter: hue-rotate(120deg) contrast(1.3); }
    90%  { transform: translate(-2px,-1px) skewX(0); filter: hue-rotate(0) contrast(1.1); }
    100% { transform: translate(0,0) skewX(0); filter: none; }
  }
  @keyframes hack-scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes hack-text-flicker { 0%,100%{opacity:1} 3%{opacity:0.3} 6%{opacity:1} 40%{opacity:0.6} 43%{opacity:1} 70%{opacity:0.2} 73%{opacity:1} }
`

// ─── Template interpolation — {{employee}} {{company}} {{sector}} etc. ───────

function buildInterpolationContext(user) {
  const fullName = user?.name || user?.email?.split('@')[0] || 'Collaborateur'
  const nameParts = fullName.split(/\s+/)
  const firstName = nameParts[0] || fullName
  const lastName = nameParts.slice(1).join(' ') || ''
  const email = user?.email || 'vous@entreprise.com'
  const domain = email.split('@')[1] || 'entreprise.com'
  const company = user?.company || user?.companyName || 'Votre Entreprise'
  const sector = user?.sector || user?.companySector || 'Services'
  const now = new Date()
  return {
    'employee':             fullName,
    'employee.name':        fullName,
    'employee.firstName':   firstName,
    'employee.lastName':    lastName,
    'employee.email':       email,
    'employee.initials':    (firstName[0] || '') + (lastName[0] || ''),
    'company':              company,
    'company.name':         company,
    'company.sector':       sector,
    'company.domain':       domain,
    'sector':               sector,
    'date':                 now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
    'date.short':           now.toLocaleDateString('fr-FR'),
    'time':                 now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    'year':                 String(now.getFullYear()),
  }
}

const INTERPOLATION_RE = /\{\{\s*([^}]+?)\s*\}\}/g

function interpolateString(text, ctx) {
  if (typeof text !== 'string') return text
  return text.replace(INTERPOLATION_RE, (match, key) => {
    const k = key.trim()
    if (k in ctx) {
      const v = ctx[k]
      return v == null ? match : String(v)
    }
    return match
  })
}

// Deep-walk a block and interpolate every string value
function interpolateBlock(block, ctx) {
  if (block == null) return block
  const walk = (val) => {
    if (typeof val === 'string') return interpolateString(val, ctx)
    if (Array.isArray(val)) return val.map(walk)
    if (val && typeof val === 'object') {
      const out = {}
      for (const [k, v] of Object.entries(val)) out[k] = walk(v)
      return out
    }
    return val
  }
  return walk(block)
}

// Detect whether a string contains HTML tags (to switch from pre-wrap to dangerouslySetInnerHTML)
function looksLikeHTML(s) {
  return typeof s === 'string' && /<\w+[\s>/]|<\/\w+>/.test(s)
}

// Very light HTML sanitization — strip script tags and on* handlers
// (admin-trusted but let's be safe-ish)
function sanitizeHTML(html) {
  if (typeof html !== 'string') return ''
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

// ─── Live clock hook ──────────────────────────────────────────────────────────

// ─── Audio manager — scenario ambient + per-block overlay with overrides ─────
// Exposes explicit start()/stop() so the parent can call them from a user-gesture
// handler (click) and bypass browser autoplay policy.

function useScenarioAudio({ scenario, block, active }) {
  // User-controlled mute toggle (persisted in localStorage) — declared FIRST
  // so subsequent effects can safely reference it in their dependency arrays.
  const [userMuted, setUserMutedState] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('roomca_sound_muted') === '1'
  })

  // Keep the Web Audio SFX engine in sync with the persisted mute flag.
  useEffect(() => { setSFXEnabled(!userMuted) }, [userMuted])

  const ambientRef = useRef(null)
  const overlayRef = useRef(null)
  const scenarioRef = useRef(scenario)
  const blockRef = useRef(block)

  // Keep refs fresh for use inside stable callbacks
  useEffect(() => { scenarioRef.current = scenario }, [scenario])
  useEffect(() => { blockRef.current = block }, [block])

  const ambientUrl = scenario?.audio_url || scenario?.audioUrl || null

  // Helper: compute the current ambient volume based on scenario + block overrides
  // Supports both snake_case (from DB) and camelCase (from builder state)
  const computeAmbientVolume = () => {
    const sc = scenarioRef.current
    const bl = blockRef.current
    const sceneVol = sc?.audio_volume ?? sc?.audioVolume ?? 50
    const baseVolume = sceneVol / 100
    const muted = bl?.ambientMuted === true
    const chapterMultiplier = ((bl?.ambientVolume ?? 100) / 100)
    return muted ? 0 : Math.max(0, Math.min(1, baseVolume * chapterMultiplier))
  }

  const setUserMuted = (v) => {
    setUserMutedState(v)
    try { localStorage.setItem('roomca_sound_muted', v ? '1' : '0') } catch { /* noop */ }
    if (ambientRef.current) {
      ambientRef.current.volume = v ? 0 : computeAmbientVolume()
    }
    if (overlayRef.current) {
      overlayRef.current.volume = v ? 0 : ((blockRef.current?.audioVolume ?? 80) / 100)
    }
  }

  // Create / refresh ambient Audio element whenever the scenario audio URL changes
  useEffect(() => {
    if (!ambientUrl) {
      if (ambientRef.current) {
        ambientRef.current.pause()
        ambientRef.current = null
      }
      return
    }
    // Build a new element if needed (brand new or URL changed)
    if (!ambientRef.current || ambientRef.current._roomcaUrl !== ambientUrl) {
      if (ambientRef.current) {
        try { ambientRef.current.pause() } catch { /* noop */ }
      }
      const a = new Audio(ambientUrl)
      a.loop = true
      a.preload = 'auto'
      a.volume = computeAmbientVolume()
      // Tag the element with the URL as a plain JS property — avoids reflecting
      // megabytes of base64 into a DOM data-attribute (slow/flaky).
      a._roomcaUrl = ambientUrl
      ambientRef.current = a
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientUrl])

  // Apply volume / mute updates live on the existing ambient element
  useEffect(() => {
    const a = ambientRef.current
    if (!a) return
    a.volume = userMuted ? 0 : computeAmbientVolume()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.audio_volume, scenario?.audioVolume, block?.ambientMuted, block?.ambientVolume, userMuted])

  // Start ambient when game becomes active (best-effort — may be blocked
  // by autoplay policy if start() wasn't called from a click handler).
  useEffect(() => {
    const a = ambientRef.current
    if (!a) return
    if (active) {
      a.play().catch((err) => {
        // Silent fallback — start() from click handler should already have succeeded
        console.debug('[ROOMCA] Ambient autoplay blocked:', err?.message || err)
      })
    } else {
      try { a.pause() } catch { /* noop */ }
    }
  }, [active, ambientUrl])

  // Overlay block audio (SFX / voice-over) — restarted each chapter
  useEffect(() => {
    const url = block?.audioUrl
    if (overlayRef.current) {
      try { overlayRef.current.pause() } catch { /* noop */ }
      overlayRef.current = null
    }
    if (!active || !url) return
    const o = new Audio(url)
    o.preload = 'auto'
    o.volume = userMuted ? 0 : ((block?.audioVolume ?? 80) / 100)
    overlayRef.current = o
    o.play().catch((err) => {
      console.debug('[ROOMCA] Block audio autoplay blocked:', err?.message || err)
    })
    return () => {
      if (overlayRef.current) {
        try { overlayRef.current.pause() } catch { /* noop */ }
        overlayRef.current = null
      }
    }
  }, [block?.id, block?.audioUrl, block?.audioVolume, active, userMuted])

  // Cleanup on unmount
  useEffect(() => () => {
    if (ambientRef.current) {
      try { ambientRef.current.pause() } catch { /* noop */ }
      ambientRef.current = null
    }
    if (overlayRef.current) {
      try { overlayRef.current.pause() } catch { /* noop */ }
      overlayRef.current = null
    }
  }, [])

  // Explicit starter — call from a click handler for guaranteed autoplay
  const start = () => {
    const sc = scenarioRef.current
    const url = sc?.audio_url || sc?.audioUrl
    if (!url) {
      console.debug('[ROOMCA] No scenario audio URL configured')
      return
    }
    console.debug('[ROOMCA] Starting scenario audio:', url.slice(0, 80) + (url.length > 80 ? '…' : ''))
    if (!ambientRef.current || ambientRef.current._roomcaUrl !== url) {
      if (ambientRef.current) {
        try { ambientRef.current.pause() } catch { /* noop */ }
      }
      const a = new Audio(url)
      a.loop = true
      a.preload = 'auto'
      a._roomcaUrl = url
      a.addEventListener('error', (e) => {
        console.error('[ROOMCA] Audio element error:', a.error?.code, a.error?.message || e)
      })
      a.addEventListener('canplay', () => {
        console.debug('[ROOMCA] Audio ready to play')
      })
      ambientRef.current = a
    }
    const a = ambientRef.current
    a.volume = userMuted ? 0 : computeAmbientVolume()
    const p = a.play()
    if (p && typeof p.catch === 'function') {
      p.catch((err) => console.warn('[ROOMCA] Ambient start failed:', err?.message || err))
    }
  }

  const stop = () => {
    if (ambientRef.current) {
      try { ambientRef.current.pause() } catch { /* noop */ }
    }
    if (overlayRef.current) {
      try { overlayRef.current.pause() } catch { /* noop */ }
    }
  }

  return { start, stop, muted: userMuted, setMuted: setUserMuted }
}

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// ─── Virtual PC wrapper ───────────────────────────────────────────────────────

const APP_META = {
  email:    { icon: '📧', name: 'Messagerie — Outlook 365' },
  photo:    { icon: '🎥', name: 'Visionneuse Sécurité' },
  quiz:     { icon: '🎓', name: 'Formation Cyber — Quiz' },
  decision: { icon: '🔀', name: 'Protocole Décision' },
  puzzle:   { icon: '🧩', name: 'Exercice Analyse' },
  video:    { icon: '🎬', name: 'Lecteur Vidéo' },
  text:     { icon: '📝', name: 'Bloc-notes' },
}

function VirtualPC({ t, blockType, children }) {
  const clock = useClock()
  const app = APP_META[blockType] || { icon: '▪', name: 'Application' }
  const battery = 87

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(20,24,40,0.6) 0%, rgba(10,12,20,0.8) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 50px 120px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      position: 'relative',
    }}>
      {/* Desktop wallpaper pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        pointerEvents: 'none',
      }} />

      {/* Window title bar */}
      <div style={{
        position: 'relative', zIndex: 2,
        background: 'linear-gradient(180deg, #181820 0%, #0e0e14 100%)',
        borderBottom: '1px solid var(--bg-muted)',
        padding: '11px 16px',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ed6a5e', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }} />
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#f5bf4f', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }} />
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#61c554', boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.4)' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>{app.icon}</span>
          <span style={{ fontSize: '12px', color: '#ccc', fontWeight: 500, letterSpacing: '0.02em' }}>{app.name}</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          w × h
        </div>
      </div>

      {/* App content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Taskbar */}
      <div style={{
        position: 'relative', zIndex: 2,
        background: 'linear-gradient(180deg, #0a0a12 0%, #060608 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '7px 14px',
        display: 'flex', alignItems: 'center', gap: '10px',
        fontFamily: 'var(--mono)', fontSize: '10px', color: '#777',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px',
          background: t.accentDim, border: `1px solid ${t.accentBorder}`,
          borderRadius: '3px',
        }}>
          <span style={{ color: t.accent, fontWeight: 900 }}>⊞</span>
          <span style={{ color: t.accent, letterSpacing: '0.1em' }}>DÉMARRER</span>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
          <div style={{
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderBottom: `2px solid ${t.accent}`,
            borderRadius: '3px',
            color: '#ccc', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {app.icon} {app.name.split('—')[0].trim()}
          </div>
        </div>
        <span title="Son">🔊</span>
        <span title="Wi-Fi">📶</span>
        <span title="Batterie" style={{ color: '#999' }}>🔋 {battery}%</span>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '12px', marginLeft: '4px' }}>
          <div style={{ color: '#ccc', textAlign: 'right' }}>{clock.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: '9px', color: '#666', textAlign: 'right' }}>{clock.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Game-feel helpers ────────────────────────────────────────────────────────

function ScorePopup({ points, x, y, variant = 'good' }) {
  const color = variant === 'good' ? '#22c55e' : '#eb2828'
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      color, fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 900,
      pointerEvents: 'none', zIndex: 50,
      textShadow: `0 0 14px ${color}`, letterSpacing: '0.08em',
      animation: 'score-float 1.2s ease-out forwards',
    }}>
      {variant === 'good' ? '+' : '−'}{points}
    </div>
  )
}

function useScorePopups() {
  const [popups, setPopups] = useState([])
  const add = (x, y, points, variant = 'good') => {
    const id = Date.now() + Math.random()
    setPopups(prev => [...prev, { id, x, y, points, variant }])
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 1300)
  }
  return { popups, add }
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function getTheme(scenario) {
  const s = ((scenario?.category || '') + ' ' + (scenario?.title_fr || '') + ' ' + (scenario?.title_en || '')).toLowerCase()
  if (s.includes('ransomware') || s.includes('malware') || s.includes('virus')) return 'ransomware'
  if (s.includes('sms') || s.includes('smishing') || s.includes('mobile')) return 'smishing'
  if (s.includes('social') || s.includes('vishing') || s.includes('ingénierie')) return 'social'
  return 'email'
}

const THEMES = {
  email: {
    bg: 'radial-gradient(ellipse at 50% 0%,#0a1020 0%,#050810 60%,#020408 100%)',
    accent: '#4a9eff', accentDim: 'rgba(74,158,255,0.1)', accentBorder: 'rgba(74,158,255,0.3)',
    scanColor: 'rgba(74,158,255,0.02)', env: '💻 Bureau — Réseau Interne',
    frameBg: '#0d1117', frameBorder: 'rgba(74,158,255,0.25)',
    frameGlow: '0 0 50px rgba(74,158,255,0.07)',
    alertText: null,
  },
  ransomware: {
    bg: 'radial-gradient(ellipse at 50% 30%,#1a0000 0%,#0a0000 50%,#040000 100%)',
    accent: '#eb2828', accentDim: 'var(--violet-tint)', accentBorder: 'rgba(235,40,40,0.38)',
    scanColor: 'rgba(235,40,40,0.025)', env: '⚠ Terminal — Système Compromis',
    frameBg: '#080000', frameBorder: 'rgba(235,40,40,0.45)',
    frameGlow: '0 0 50px var(--violet-tint)',
    alertText: 'Système infecté — identifiez les vecteurs d\'attaque',
  },
  smishing: {
    bg: 'radial-gradient(ellipse at 50% 20%,#0d0a1a 0%,#070610 60%,#030308 100%)',
    accent: '#a78bfa', accentDim: 'rgba(167,139,250,0.1)', accentBorder: 'rgba(167,139,250,0.3)',
    scanColor: 'rgba(167,139,250,0.02)', env: '📱 Réseau Mobile — 4G',
    frameBg: '#090810', frameBorder: 'rgba(167,139,250,0.28)',
    frameGlow: '0 0 50px rgba(167,139,250,0.07)',
    alertText: null,
  },
  social: {
    bg: 'radial-gradient(ellipse at 50% 0%,#0f0c00 0%,#080600 60%,#040300 100%)',
    accent: '#f59e0b', accentDim: 'rgba(245,158,11,0.1)', accentBorder: 'rgba(245,158,11,0.3)',
    scanColor: 'rgba(245,158,11,0.02)', env: '🏢 Site Entreprise — Accueil',
    frameBg: '#090800', frameBorder: 'rgba(245,158,11,0.28)',
    frameGlow: '0 0 50px rgba(245,158,11,0.07)',
    alertText: null,
  },
}

const BLOCK_META = {
  email:    { icon: '📧', label: 'Faux email',      action: 'Email analysé' },
  photo:    { icon: '🖼', label: 'Photo + zones',   action: 'Zones identifiées' },
  video:    { icon: '🎬', label: 'Vidéo',           action: 'Vidéo vue' },
  quiz:     { icon: '❓', label: 'Quiz',             action: null },
  decision: { icon: '🔀', label: 'Décision',        action: null },
  puzzle:   { icon: '🧩', label: 'Mini puzzle',     action: null },
  text:     { icon: '📝', label: 'Briefing',        action: 'Lu et compris' },
}

// Returns block meta merged with the admin's custom chapterTitle / chapterIcon.
// chapterIcon can be an emoji OR an image URL / data:URL
function getBlockMeta(block) {
  const base = BLOCK_META[block?.type] || { icon: '▪', label: block?.type || '', action: 'Continuer' }
  return {
    icon: block?.chapterIcon || base.icon,
    label: block?.chapterTitle || base.label,
    action: base.action,
  }
}

// Helper: render an icon — if URL/data, as <img>; else as text/emoji
function IconNode({ icon, size = 32 }) {
  if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:') || icon.startsWith('/'))) {
    return <img src={icon} alt="" style={{ width: size, height: size, objectFit: 'cover', borderRadius: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
  }
  return <span style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block' }}>{icon}</span>
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function useTimer(durationMin = 15) {
  const total = durationMin * 60
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(true)
  const ref = useRef(null)
  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(ref.current)
  }, [running])
  const remaining = Math.max(0, total - elapsed)
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return { display: `${mm}:${ss}`, pct: Math.min(100, (elapsed / total) * 100), urgent: remaining < 120, stop: () => setRunning(false) }
}

// ─── Block Renderers ──────────────────────────────────────────────────────────
// All data comes from what the admin configures in ScenarioBuilder

// Fake inbox filler so the player can actually browse emails
const FAKE_EMAILS = [
  { id: 'f1', senderName: 'Newsletter Cyber', from: 'hello@cybernews.fr', subject: 'Votre édition hebdo — menaces actuelles', preview: 'Phishing, ransomware et nouvelles CVE...', time: '09:42', body: 'Bonjour,\n\nCette semaine dans la tech : nouvelles campagnes de phishing repérées en Europe, vulnérabilité critique sur plusieurs CMS, et focus sur les bonnes pratiques MFA.\n\nBonne lecture,\nL\'équipe CyberNews' },
  { id: 'f2', senderName: 'Service RH', from: 'rh@entreprise.com', subject: 'Rappel — Formation sécurité 2026', preview: 'Pensez à valider votre formation obligatoire...', time: '08:15', body: 'Bonjour,\n\nVotre formation annuelle Cybersécurité doit être validée avant fin du mois. Merci de vous connecter au portail RH pour effectuer le module.\n\nCordialement,\nService RH' },
  { id: 'f3', senderName: 'Teams', from: 'noreply@teams.microsoft.com', subject: 'Rappel : Stand-up — 10h00', preview: 'Votre réunion commence dans 15 minutes', time: '08:45', body: '📅 Stand-up quotidien\n\n🕙 10:00 — 10:15\n👥 5 participants\n📍 Salle virtuelle Équipe Dev\n\nRejoindre la réunion →' },
  { id: 'f4', senderName: 'IT Support', from: 'support@it.entreprise.com', subject: 'Ticket #4521 — Résolu', preview: 'Votre demande a été traitée...', time: 'Hier', body: 'Bonjour,\n\nVotre ticket #4521 (connexion VPN) a été résolu. Le problème venait d\'une expiration de certificat côté serveur. Merci de confirmer que tout fonctionne bien maintenant.\n\nIT Support' },
]

function EmailRow({ email, selected, unread, onClick, t, isTarget }) {
  const avatarColors = ['#4a9eff', '#a78bfa', '#f59e0b', '#22c55e', '#ec4899', '#06b6d4']
  const avatarColor = avatarColors[(email.senderName || '').charCodeAt(0) % avatarColors.length]
  const initials = (email.senderName || '?').split(/[\s.@]/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?'

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', gap: '12px', padding: '14px 16px',
        background: selected ? t.accentDim : unread ? 'rgba(255,255,255,0.025)' : 'transparent',
        borderBottom: '1px solid var(--bg-muted)',
        borderLeft: selected ? `3px solid ${t.accent}` : '3px solid transparent',
        cursor: 'pointer', transition: 'all 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-muted)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = unread ? 'rgba(255,255,255,0.025)' : 'transparent' }}
    >
      {/* Unread dot */}
      {unread && (
        <div style={{
          position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)',
          width: '6px', height: '6px', borderRadius: '50%', background: t.accent,
          boxShadow: `0 0 8px ${t.accent}`,
        }} />
      )}

      {/* Avatar */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}88 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: '12px',
        flexShrink: 0, boxShadow: `0 0 12px ${avatarColor}33`,
      }}>
        {initials}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: unread ? 700 : 500, color: unread ? '#e8e8e8' : '#aaa', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {email.senderName}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', flexShrink: 0 }}>
            {email.time}
          </span>
        </div>
        <div style={{
          fontSize: '12px', color: unread ? '#ddd' : '#888',
          fontWeight: unread ? 600 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginTop: '1px',
        }}>
          {email.subject}
          {isTarget && <span style={{ marginLeft: '6px', fontSize: '9px', background: 'var(--border-hover)', color: '#ff6b6b', padding: '1px 5px', borderRadius: '8px', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>⚠ À ANALYSER</span>}
        </div>
        <div style={{
          fontSize: '11px', color: '#666',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginTop: '2px',
        }}>
          {email.preview || (email.body || '').slice(0, 60)}
        </div>
      </div>
    </div>
  )
}

// EMAIL — full email client with browsable inbox
function EmailBlock({ data, t }) {
  const link = data.link || {}
  const hasLink = !!(link.text || link.hover || link.real)
  // The hover URL IS the real destination — phishing is detected when the
  // displayed link text doesn't match the hover/real URL.
  const isDangerous = hasLink && link.text && link.hover && link.text !== link.hover

  // Build inbox: target email first (as unread, newest), then fakes
  const targetEmail = {
    id: 'target',
    senderName: data.senderName || 'Inconnu',
    from: data.from || 'inconnu@exemple.com',
    to: data.to || 'vous@entreprise.com',
    subject: data.subject || '(sans objet)',
    preview: (data.body || '').slice(0, 70),
    time: 'Maintenant',
    body: data.body || '',
    link,
    isTarget: true,
  }
  const inbox = [targetEmail, ...FAKE_EMAILS]

  const [selectedId, setSelectedId] = useState(null) // player must choose — nothing open by default
  const [readIds, setReadIds] = useState(new Set())
  const [verdict, setVerdict] = useState(null)
  const [hoverLink, setHoverLink] = useState(false)
  const [clickWarning, setClickWarning] = useState(false)
  const [shake, setShake] = useState(false)

  const selected = inbox.find(e => e.id === selectedId)
  const isTargetOpen = selectedId === 'target'

  const openEmail = (id) => {
    playClick()
    setSelectedId(id)
    setReadIds(prev => new Set([...prev, id]))
  }

  const pick = (v) => {
    if (verdict !== null) return
    setVerdict(v)
    const correctPick = (v === 'danger' && isDangerous) || (v === 'safe' && !isDangerous)
    if (correctPick) {
      playSuccess()
    } else {
      errorFX()
      setShake(true); setTimeout(() => setShake(false), 500)
    }
    // No auto-advance — player clicks "CONTINUER" when ready
  }

  const handleLinkClick = (e) => {
    e.preventDefault()
    if (verdict !== null) return
    if (isDangerous) {
      // Dangerous link: show the security lesson overlay (hover to verify).
      linkWarnFX()
    } else {
      playWarning()
      setClickWarning(true)
      setShake(true); setTimeout(() => setShake(false), 500)
      setTimeout(() => setClickWarning(false), 2400)
    }
  }

  const correct = (verdict === 'danger' && isDangerous) || (verdict === 'safe' && !isDangerous)
  const unreadCount = inbox.filter(e => !readIds.has(e.id)).length

  const avatarColors = ['#4a9eff', '#a78bfa', '#f59e0b', '#22c55e', '#ec4899', '#06b6d4']
  const selectedAvatarColor = selected ? avatarColors[(selected.senderName || '').charCodeAt(0) % avatarColors.length] : 'var(--text-muted)'
  const selectedInitials = selected ? ((selected.senderName || '?').split(/[\s.@]/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?') : ''

  return (
    <div style={{
      display: 'flex', height: '640px',
      background: '#141414', border: '1px solid #2a2a2a',
      borderRadius: '6px', overflow: 'hidden',
      animation: shake ? 'shake-x 0.45s' : 'none',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
    }}>
      {/* ─── Folder sidebar ─── */}
      <div style={{
        width: '180px', flexShrink: 0,
        background: 'var(--bg-elevated)', borderRight: '1px solid #1f1f1f',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#666', letterSpacing: '0.14em', marginBottom: '4px' }}>CLIENT MAIL</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#e8e8e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.to || 'vous@entreprise.com'}</div>
        </div>
        <div style={{ padding: '12px 0', flex: 1 }}>
          {[
            { icon: '📥', label: 'Boîte de réception', count: unreadCount, active: true },
            { icon: '⭐', label: 'Favoris' },
            { icon: '📤', label: 'Envoyés' },
            { icon: '📝', label: 'Brouillons' },
            { icon: '🗑', label: 'Corbeille' },
            { icon: '⚠', label: 'Spam' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 16px', fontSize: '11px',
              color: f.active ? t.accent : '#777',
              background: f.active ? t.accentDim : 'transparent',
              borderLeft: f.active ? `2px solid ${t.accent}` : '2px solid transparent',
              cursor: 'default',
            }}>
              <span style={{ fontSize: '12px' }}>{f.icon}</span>
              <span style={{ flex: 1 }}>{f.label}</span>
              {f.count > 0 && <span style={{ background: t.accent, color: 'var(--bg)', fontSize: '9px', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>{f.count}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #1a1a1a', fontFamily: 'var(--mono)', fontSize: '9px', color: '#444', letterSpacing: '0.08em' }}>
          ● EN LIGNE
        </div>
      </div>

      {/* ─── Email list ─── */}
      <div style={{
        width: '280px', flexShrink: 0,
        background: 'var(--bg-input)', borderRight: '1px solid #1f1f1f',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '12px', color: '#ddd', fontWeight: 700 }}>Boîte de réception</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)' }}>{inbox.length} · {unreadCount} non lus</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {inbox.map(email => (
            <EmailRow
              key={email.id}
              email={email}
              selected={selectedId === email.id}
              unread={!readIds.has(email.id)}
              isTarget={email.isTarget}
              t={t}
              onClick={() => openEmail(email.id)}
            />
          ))}
        </div>
      </div>

      {/* ─── Detail panel ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#141414', minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{
          height: '42px', borderBottom: '1px solid #1f1f1f',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: '6px',
          background: 'var(--bg-input)',
        }}>
          {['↩ Répondre', '↪ Transférer', '🗑 Archiver', '⭐', '⋯'].map((a, i) => (
            <button key={i} disabled style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              padding: '5px 10px', fontSize: '11px', fontFamily: 'inherit',
              borderRadius: '3px', cursor: 'default',
            }}>{a}</button>
          ))}
        </div>

        {!selected ? (
          /* Empty state */
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '14px',
            color: '#444', textAlign: 'center', padding: '40px',
          }}>
            <div style={{ fontSize: '56px', opacity: 0.3 }}>📬</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#666', letterSpacing: '0.14em' }}>
              AUCUN EMAIL SÉLECTIONNÉ
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.6 }}>
              Cliquez sur un email dans la liste pour l'ouvrir. Un email <b style={{ color: t.accent }}>non lu</b> nécessite votre analyse.
            </div>
          </div>
        ) : (
          <>
            {/* Email header */}
            <div style={{ padding: '20px 26px 14px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '19px', fontWeight: 700, color: '#e8e8e8', marginBottom: '12px', lineHeight: 1.3 }}>
                {selected.subject}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${selectedAvatarColor} 0%, ${selectedAvatarColor}88 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '14px',
                  flexShrink: 0, boxShadow: `0 0 16px ${selectedAvatarColor}44`,
                }}>
                  {selectedInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#e8e8e8' }}>
                      {selected.senderName}
                    </span>
                    <span style={{ fontSize: '10px', color: '#666', fontFamily: 'var(--mono)' }}>
                      &lt;{selected.from}&gt;
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    à <span style={{ color: '#888' }}>{data.to || 'vous'}</span> · <span style={{ fontFamily: 'var(--mono)' }}>{selected.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{
              flex: 1, padding: '24px 26px', overflowY: 'auto',
              fontSize: '13px', lineHeight: 1.85, color: '#ccc',
              position: 'relative',
            }}>
              {looksLikeHTML(selected.body) ? (
                <div
                  className="email-body-html"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(selected.body) }}
                  style={{ color: '#ccc' }}
                />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>{selected.body || '(corps vide)'}</div>
              )}

              {isTargetOpen && hasLink && (
                <div style={{ marginTop: '22px' }}>
                  <a href="#" onClick={handleLinkClick}
                    onMouseEnter={() => setHoverLink(true)} onMouseLeave={() => setHoverLink(false)}
                    style={{ display: 'inline-block', color: '#4a9eff', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                    {link.text || 'Cliquez ici'}
                  </a>
                </div>
              )}

              {hoverLink && link.hover && isTargetOpen && (
                <div style={{
                  position: 'absolute', bottom: '16px', left: '26px',
                  background: 'var(--bg)', border: '1px solid #333',
                  padding: '6px 12px', fontSize: '11px', fontFamily: 'var(--mono)',
                  color: '#ccc', borderRadius: '2px', boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
                  maxWidth: 'calc(100% - 52px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  animation: 'fade-in 0.15s ease', zIndex: 3,
                }}>
                  🔗 {link.hover}
                </div>
              )}

              {clickWarning && isTargetOpen && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                  animation: 'fade-in 0.2s ease', zIndex: 5,
                }}>
                  <div style={{
                    background: '#1a0000', border: '2px solid #eb2828',
                    padding: '26px 32px', borderRadius: '6px', textAlign: 'center',
                    boxShadow: '0 0 60px rgba(235,40,40,0.5)',
                    animation: 'chapter-zoom 0.4s ease',
                  }}>
                    <div style={{ fontSize: '44px', marginBottom: '10px' }}>⚠</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#eb2828', letterSpacing: '0.18em', marginBottom: '6px' }}>
                      NE CLIQUEZ PAS !
                    </div>
                    <div style={{ fontSize: '12px', color: '#ddd', maxWidth: '300px', lineHeight: 1.5 }}>
                      Utilisez <b style={{ color: '#eb2828' }}>Signaler</b> ou <b style={{ color: '#22c55e' }}>Légitime</b> en bas.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action bar — only for target */}
            {isTargetOpen && hasLink && verdict === null && (
              <div style={{
                borderTop: '2px solid #1f1f1f', padding: '14px 18px',
                background: 'var(--bg-input)',
                display: 'flex', gap: '10px', alignItems: 'center',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#666', letterSpacing: '0.12em', marginRight: '6px' }}>
                  🎯 VERDICT :
                </div>
                <button onClick={() => pick('danger')}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'linear-gradient(180deg, rgba(235,40,40,0.15) 0%, rgba(235,40,40,0.05) 100%)',
                    border: '1.5px solid rgba(235,40,40,0.5)', color: '#ff6b6b',
                    fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', fontWeight: 900,
                    cursor: 'pointer', borderRadius: '4px', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(235,40,40,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(235,40,40,0.15) 0%, rgba(235,40,40,0.05) 100%)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  ⚠ SIGNALER
                </button>
                <button onClick={() => pick('safe')}
                  style={{
                    flex: 1, padding: '12px',
                    background: 'linear-gradient(180deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
                    border: '1.5px solid rgba(34,197,94,0.5)', color: '#4ade80',
                    fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', fontWeight: 900,
                    cursor: 'pointer', borderRadius: '4px', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  ✓ LÉGITIME
                </button>
              </div>
            )}

            {/* Rich feedback — detailed phishing analysis */}
            {isTargetOpen && verdict !== null && (
              <div style={{
                borderTop: `2px solid ${correct ? '#22c55e' : '#eb2828'}`,
                padding: '20px 24px',
                background: correct ? 'rgba(34,197,94,0.08)' : 'var(--violet-tint)',
                animation: 'fadeInUp 0.35s ease',
              }}>
                {/* Verdict header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '22px' }}>{correct ? '✓' : '✗'}</span>
                  <div>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '12px',
                      color: correct ? '#22c55e' : '#eb2828',
                      letterSpacing: '0.16em', fontWeight: 900,
                    }}>
                      {correct ? 'ANALYSE CORRECTE  ·  +100 XP' : 'PIÈGE RATÉ  ·  −50 XP'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      {isDangerous
                        ? `Cet email était un phishing. Vous ${verdict === 'danger' ? 'l\'avez correctement signalé.' : 'auriez dû le signaler.'}`
                        : `Cet email était légitime. Vous ${verdict === 'safe' ? 'avez eu raison de lui faire confiance.' : 'auriez pu le traiter normalement.'}`
                      }
                    </div>
                  </div>
                </div>

                {/* URL comparison (only if there's a link) */}
                {(link.text || link.hover) && (
                  <div style={{
                    padding: '12px 14px', marginBottom: '14px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                  }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#666', letterSpacing: '0.14em', marginBottom: '8px' }}>
                      🔗 ANALYSE DU LIEN
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 12px', fontSize: '11px', fontFamily: 'var(--mono)' }}>
                      <span style={{ color: '#666' }}>Texte affiché :</span>
                      <span style={{ color: '#ccc' }}>{link.text || '(aucun)'}</span>
                      <span style={{ color: '#666' }}>Vraie destination :</span>
                      <span style={{ color: isDangerous ? '#ff6b6b' : '#4ade80', fontWeight: 700 }}>{link.hover || '(aucune)'}</span>
                    </div>
                    {isDangerous && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-strong)', fontSize: '11px', color: '#ff9090', lineHeight: 1.6 }}>
                        ⚠ <b>Le texte affiché ne correspond pas à la vraie destination.</b> C'est une technique de <i>cloaking</i> classique : le pirate affiche un nom de domaine légitime pour rassurer la victime, mais le clic la redirige ailleurs.
                      </div>
                    )}
                  </div>
                )}

                {/* Phishing indicators checklist */}
                <div style={{
                  padding: '12px 14px', marginBottom: '14px',
                  background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#666', letterSpacing: '0.14em', marginBottom: '8px' }}>
                    🎯 SIGNAUX À RECONNAÎTRE
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#bbb', lineHeight: 1.8 }}>
                    <li>Expéditeur inhabituel ou domaine suspect</li>
                    <li>Ton urgent ou alarmiste (« action immédiate »)</li>
                    <li>Lien dont l'URL au survol ≠ le texte affiché</li>
                    <li>Demande de données sensibles (identifiants, RIB, MFA)</li>
                    <li>Pièce jointe inattendue (.zip, .xlsm, .exe)</li>
                  </ul>
                </div>

                {/* Admin-authored success/failure explanation */}
                <RichExplanation
                  kind={correct ? 'success' : 'failure'}
                  success={data.successExplanation}
                  failure={data.failureExplanation}
                  t={t}
                />

                {/* Continue hint */}
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--bg-muted)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  fontSize: '11px', color: t.accent,
                  fontFamily: 'var(--mono)', letterSpacing: '0.08em',
                  textAlign: 'center',
                }}>
                  → Prenez le temps de lire l'analyse, puis cliquez sur <b>CONTINUER</b> en bas de page
                </div>
              </div>
            )}

            {/* Non-target email footer */}
            {!isTargetOpen && (
              <div style={{
                borderTop: '1px solid #1f1f1f', padding: '14px 22px',
                background: 'rgba(34,197,94,0.05)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{ color: '#4ade80', fontSize: '14px' }}>✓</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#4ade80', letterSpacing: '0.1em' }}>
                  EMAIL LÉGITIME · Aucune action requise
                </span>
                <div style={{ flex: 1 }} />
                <button onClick={() => setSelectedId('target')}
                  style={{ background: 'transparent', border: `1px solid ${t.accentBorder}`, color: t.accent, padding: '5px 12px', fontFamily: 'var(--mono)', fontSize: '10px', cursor: 'pointer', borderRadius: '2px', letterSpacing: '0.08em' }}>
                  → OUVRIR L'EMAIL SUSPECT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Shared rich explanation card — shows admin-authored success/failure text ─

function RichExplanation({ kind, success, failure, t }) {
  const text = kind === 'success' ? success : failure
  if (!text) return null
  const isSuccess = kind === 'success'
  const color = isSuccess ? '#22c55e' : '#eb2828'
  return (
    <div style={{
      marginTop: '14px',
      padding: '14px 16px',
      background: isSuccess ? 'rgba(34,197,94,0.06)' : 'rgba(235,40,40,0.06)',
      border: `1px solid ${color}55`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '4px',
      animation: 'fadeInUp 0.35s ease',
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: '10px', color, letterSpacing: '0.14em',
        fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '14px' }}>{isSuccess ? '✓' : '✗'}</span>
        {isSuccess ? 'POURQUOI C\'ÉTAIT LA BONNE RÉPONSE' : 'POURQUOI C\'ÉTAIT FAUX'}
      </div>
      <div style={{ fontSize: '13px', color: '#ddd', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
        {text}
      </div>
      <div style={{
        marginTop: '12px', fontFamily: 'var(--mono)', fontSize: '10px',
        color: t?.accent || '#888', letterSpacing: '0.08em', opacity: 0.7,
      }}>
        → Cliquez sur CONTINUER en bas de page
      </div>
    </div>
  )
}

// PHOTO — admin defines: src, alt, zones:[{id,x,y,w,h,label,description,correct}]
function PhotoBlock({ data, t, onBlockDone }) {
  const rawZones = data.zones || data.hotspots || []
  const zones = rawZones.map(z => ({
    id: z.id,
    x: z.x ?? 50,
    y: z.y ?? 50,
    w: z.w ?? 0,
    h: z.h ?? 0,
    label: z.label || 'Zone',
    description: z.description || '',
    correct: z.correct !== false,
  }))

  const correctZones = zones.filter(z => z.correct)
  const totalTargets = correctZones.length || zones.length

  const [foundIds, setFoundIds] = useState(new Set())
  const [wrongIds, setWrongIds] = useState(new Set())
  const [missClicks, setMissClicks] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [mousePct, setMousePct] = useState(null) // for magnifier
  const [shake, setShake] = useState(false)
  const [feedbackPopup, setFeedbackPopup] = useState(null) // { x, y, zone, type: 'hit'|'wrong'|'miss' }
  const { popups, add: addPopup } = useScorePopups()

  // If the image has no target zones, the player has nothing to find — mark it
  // done immediately so the CONTINUER button isn't permanently locked.
  useEffect(() => {
    if (correctZones.length === 0 && onBlockDone) onBlockDone()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imgRef = useRef(null)
  if (!data.src && !data.url && !data.image) return (
    <div style={{ background: 'var(--bg-card)', border: `1px dashed var(--border)`, padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px', borderRadius: 'var(--r-xl)' }}>[IMAGE NON CONFIGURÉE]</div>
  )

  const handleMove = (e) => {
    if (revealed) return
    const r = imgRef.current.getBoundingClientRect()
    setMousePct({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }

  const handleImgClick = (e) => {
    if (revealed) return
    // If a feedback popup is showing, the next click dismisses it first
    if (feedbackPopup) { setFeedbackPopup(null); return }

    const r = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    const pxX = e.clientX - r.left
    const pxY = e.clientY - r.top

    let hit = null
    for (const z of zones) {
      if (foundIds.has(z.id) || wrongIds.has(z.id)) continue
      if (z.w > 0 && z.h > 0) {
        if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) { hit = z; break }
      } else {
        if (Math.hypot(z.x - x, z.y - y) <= 8) { hit = z; break }
      }
    }

    if (hit && hit.correct) {
      const next = new Set([...foundIds, hit.id])
      setFoundIds(next)
      addPopup(pxX, pxY, 100, 'good')
      playScore()
      setFeedbackPopup({ x: pxX, y: pxY, zone: hit, type: 'hit' })
      if (next.size === correctZones.length && correctZones.length > 0) {
        playSuccess()
        // All zones found — reveal and unlock CONTINUER
        setTimeout(() => setRevealed(true), 800)
        onBlockDone && onBlockDone()
      }
    } else if (hit && !hit.correct) {
      setWrongIds(prev => new Set([...prev, hit.id]))
      addPopup(pxX, pxY, 50, 'bad')
      errorFX()
      setFeedbackPopup({ x: pxX, y: pxY, zone: hit, type: 'wrong' })
      setShake(true); setTimeout(() => setShake(false), 500)
    } else {
      setMissClicks(prev => [...prev, { x, y, id: Date.now() + Math.random() }])
      addPopup(pxX, pxY, 20, 'bad')
      errorFX()
      setFeedbackPopup({ x: pxX, y: pxY, zone: null, type: 'miss' })
      setShake(true); setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div className="card-glass" style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, ${t.accent}, transparent)`,
        zIndex: 3,
      }} />
      {/* Header */}
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '11px',
          color: t.accent, letterSpacing: '0.14em', fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          🎯 Cliquez les zones suspectes
        </div>
        {totalTargets > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: t.accent, fontWeight: 800 }}>
              {foundIds.size} / {correctZones.length}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: correctZones.length }).map((_, i) => (
                <div key={i} style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: i < foundIds.size ? '#22c55e' : 'var(--border)',
                  boxShadow: i < foundIds.size ? '0 0 8px #22c55e' : 'none',
                  transition: 'all 0.3s var(--ease)',
                }} />
              ))}
            </div>
            {wrongIds.size + missClicks.length > 0 && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                ✗ {wrongIds.size + missClicks.length}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Image + overlays */}
      <div
        style={{
          position: 'relative', width: '100%',
          cursor: revealed ? 'default' : 'crosshair', background: 'var(--bg)',
          animation: shake ? 'shake-hard 0.45s' : 'none',
          overflow: 'hidden',
        }}
        onClick={handleImgClick}
        onMouseMove={handleMove}
        onMouseLeave={() => setMousePct(null)}
      >
        <img ref={imgRef} src={data.src || data.url || data.image} alt={data.alt || 'scenario'} style={{ width: '100%', display: 'block', userSelect: 'none' }} draggable={false} />

        {/* Radar sweep on mount */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${t.accent}22 45%, ${t.accent}55 50%, ${t.accent}22 55%, transparent 100%)`,
          pointerEvents: 'none', animation: 'radar-sweep 2.2s ease-out', mixBlendMode: 'screen',
        }} />

        {/* Magnifier follow cursor */}
        {mousePct && !revealed && (
          <div style={{
            position: 'absolute', left: `${mousePct.x}%`, top: `${mousePct.y}%`,
            transform: 'translate(-50%,-50%)',
            width: '44px', height: '44px', borderRadius: '50%',
            border: `2px solid ${t.accent}`, boxShadow: `0 0 24px ${t.accent}, inset 0 0 12px ${t.accent}44`,
            pointerEvents: 'none', animation: 'cursor-pulse 1.6s ease-in-out infinite',
          }}>
            <div style={{ position: 'absolute', inset: '40%', borderRadius: '50%', background: t.accent }} />
          </div>
        )}

        {/* Score popups */}
        {popups.map(p => <ScorePopup key={p.id} x={p.x} y={p.y} points={p.points} variant={p.variant} />)}

        {/* Per-zone feedback popup — shows label + description when a zone is clicked */}
        {feedbackPopup && (() => {
          const { x: fx, y: fy, zone, type } = feedbackPopup
          const isHit = type === 'hit'
          const isWrong = type === 'wrong'
          const color = isHit ? '#22c55e' : '#eb2828'
          const icon = isHit ? '✓' : '✗'
          const heading = isHit ? 'BIEN VU' : (isWrong ? 'FAUX POSITIF' : 'RIEN ICI')
          const subheading = isHit ? '+100 XP' : (isWrong ? '−50 XP' : '−20 XP')

          // Position popup near click, but clamp so it doesn't overflow the image
          const imgRect = imgRef.current?.getBoundingClientRect()
          const imgW = imgRect?.width || 800
          const imgH = imgRect?.height || 600
          const popupW = 280
          const popupH = 140
          // Try to the right of click, flip to left if not enough room
          let left = fx + 20
          if (left + popupW > imgW - 10) left = fx - popupW - 20
          if (left < 10) left = 10
          // Try below click, flip above if overflow
          let top = fy + 20
          if (top + popupH > imgH - 10) top = fy - popupH - 20
          if (top < 10) top = 10

          return (
            <div
              onClick={(e) => { e.stopPropagation(); setFeedbackPopup(null) }}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${popupW}px`,
                zIndex: 20,
                background: 'rgba(8,8,8,0.96)',
                border: `1.5px solid ${color}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: '6px',
                padding: '14px 16px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px ${color}33, 0 0 24px ${color}55`,
                animation: 'fadeInUp 0.22s ease',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '20px', fontWeight: 900, color,
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: `1.5px solid ${color}`, background: `${color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{icon}</span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '11px',
                  color, fontWeight: 900, letterSpacing: '0.14em', flex: 1,
                }}>{heading}</span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '10px',
                  color: '#888', fontWeight: 700,
                }}>{subheading}</span>
              </div>

              {/* Zone label */}
              {zone && (
                <div style={{
                  fontSize: '13px', fontWeight: 700, color: '#e8e8e8',
                  marginBottom: zone.description ? '6px' : '8px', lineHeight: 1.4,
                }}>
                  {zone.label}
                </div>
              )}

              {/* Zone description (if admin configured one) */}
              {zone?.description && (
                <div style={{
                  fontSize: '12px', color: '#bbb', lineHeight: 1.6,
                  marginBottom: '8px',
                }}>
                  {zone.description}
                </div>
              )}

              {/* Wrong / miss helper text */}
              {!isHit && !zone && (
                <div style={{ fontSize: '12px', color: '#aaa', lineHeight: 1.5, marginBottom: '8px' }}>
                  Vous avez cliqué dans une zone sans élément suspect. Regardez l'image plus attentivement.
                </div>
              )}
              {isWrong && (
                <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '8px' }}>
                  Cette zone n'est pas un piège. Continuez à chercher les vrais indices.
                </div>
              )}

              {/* Dismiss hint */}
              <div style={{
                paddingTop: '8px', borderTop: `1px dashed ${color}44`,
                fontFamily: 'var(--mono)', fontSize: '9px', color: '#666',
                letterSpacing: '0.08em', textAlign: 'center',
              }}>
                Cliquez n'importe où pour fermer
              </div>
            </div>
          )
        })()}

        {/* Revealed zones (found or end-reveal) */}
        {zones.map(z => {
          const found = foundIds.has(z.id)
          const wrong = wrongIds.has(z.id)
          const show = found || wrong || (revealed && z.correct)
          if (!show) return null
          const color = z.correct ? '#22c55e' : '#eb2828'
          if (z.w > 0 && z.h > 0) {
            return (
              <div key={z.id} style={{
                position: 'absolute', left: `${z.x}%`, top: `${z.y}%`,
                width: `${z.w}%`, height: `${z.h}%`,
                border: `2px solid ${color}`, background: `${color}22`,
                pointerEvents: 'none', animation: 'fade-in 0.3s ease',
                boxShadow: `0 0 16px ${color}66`,
              }}>
                <div style={{
                  position: 'absolute', top: '-24px', left: 0,
                  background: color, color: 'var(--bg)',
                  fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
                  padding: '3px 8px', whiteSpace: 'nowrap', maxWidth: '300px',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {z.correct ? '✓' : '✗'} {z.label}
                </div>
              </div>
            )
          }
          // Point marker (legacy)
          return (
            <div key={z.id} style={{
              position: 'absolute', left: `${z.x}%`, top: `${z.y}%`,
              transform: 'translate(-50%,-50%)',
              width: '32px', height: '32px', borderRadius: '50%',
              background: `${color}33`, border: `2px solid ${color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color, fontSize: '14px', fontWeight: 700,
              pointerEvents: 'none', animation: 'fade-in 0.3s ease',
              boxShadow: `0 0 14px ${color}80`,
            }}>
              {z.correct ? '✓' : '✗'}
            </div>
          )
        })}

        {/* Miss markers */}
        {missClicks.map((m, i) => (
          <div key={`miss-${i}`} style={{
            position: 'absolute', left: `${m.x}%`, top: `${m.y}%`,
            transform: 'translate(-50%,-50%)',
            width: '18px', height: '18px', borderRadius: '50%',
            background: 'rgba(235,40,40,0.25)', border: '1px solid #eb2828',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#eb2828', fontSize: '10px', fontWeight: 700,
            pointerEvents: 'none', animation: 'fade-in 0.25s ease',
          }}>
            ✗
          </div>
        ))}
      </div>

      {/* Rich feedback — detailed zone analysis */}
      {(foundIds.size > 0 || wrongIds.size > 0 || missClicks.length > 0) && (
        <div style={{
          background: revealed
            ? 'color-mix(in srgb, #22c55e 6%, var(--bg-card))'
            : 'var(--bg-elevated)',
          borderTop: `1px solid ${revealed ? '#22c55e' : 'var(--border)'}`,
          padding: '20px 24px',
          animation: revealed ? 'fadeInUp 0.4s ease' : 'none',
        }}>
          {revealed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: 'var(--r-full)',
                background: '#22c55e', color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 800,
              }}>✓</div>
              <div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '11px',
                  color: '#22c55e', letterSpacing: '0.14em',
                  fontWeight: 800, textTransform: 'uppercase',
                }}>
                  Analyse complète · +{foundIds.size * 100} XP
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Toutes les zones suspectes ont été identifiées.
                </div>
              </div>
            </div>
          )}
          {foundIds.size > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '10px',
                color: '#22c55e', letterSpacing: '0.14em',
                fontWeight: 700, textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                ✓ Zones identifiées ({foundIds.size}/{correctZones.length})
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {zones.filter(z => foundIds.has(z.id)).map(z => (
                  <li key={z.id}><b style={{ color: '#22c55e' }}>{z.label}</b></li>
                ))}
              </ul>
            </div>
          )}
          {wrongIds.size > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '10px',
                color: 'var(--red)', letterSpacing: '0.14em',
                fontWeight: 700, textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                ✗ Faux positifs ({wrongIds.size})
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {zones.filter(z => wrongIds.has(z.id)).map(z => (
                  <li key={z.id}>{z.label} <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>— cette zone n'était pas suspecte</span></li>
                ))}
              </ul>
            </div>
          )}
          {missClicks.length > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: '6px' }}>
              ✗ {missClicks.length} clic{missClicks.length > 1 ? 's' : ''} hors zone
            </div>
          )}

          {/* Admin-authored explanation (shown once revealed) */}
          {revealed && data.successExplanation && (
            <RichExplanation kind="success" success={data.successExplanation} t={t} />
          )}
        </div>
      )}

      {totalTargets === 0 && (
        <div style={{
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border)',
          padding: '14px',
          fontFamily: 'var(--mono)', fontSize: '11px',
          color: 'var(--text-muted)', textAlign: 'center',
          letterSpacing: '0.08em',
        }}>
          Aucune zone définie — cliquez sur Continuer
        </div>
      )}
    </div>
  )
}

// QUIZ — admin defines: question, options:[{text,correct}], explanation
function QuizBlock({ data, t, onBlockDone }) {
  const question = data.question || data.text || ''
  const options = data.options || []
  const explanation = data.explanation || ''
  const [pickedSet, setPickedSet] = useState(() => new Set())
  const [attempted, setAttempted] = useState(false)
  const [validated, setValidated] = useState(false)
  const [attemptCorrect, setAttemptCorrect] = useState(false)

  const correctIndices = options
    .map((opt, oi) => (opt?.correct ? oi : -1))
    .filter(oi => oi >= 0)
  const correctSet = new Set(correctIndices)

  const resetAttemptState = () => {
    setAttempted(false)
    setAttemptCorrect(false)
  }

  const togglePick = (oi) => {
    if (validated) return
    setPickedSet(prev => {
      const next = new Set(prev)
      if (next.has(oi)) next.delete(oi)
      else next.add(oi)
      return next
    })
    resetAttemptState()
  }

  const handleValidate = () => {
    if (validated || pickedSet.size === 0) return
    const isExactMatch = pickedSet.size === correctSet.size && [...pickedSet].every(i => correctSet.has(i))
    setAttempted(true)
    setAttemptCorrect(isExactMatch)
    if (isExactMatch) {
      setValidated(true)
      playSuccess()
      onBlockDone && onBlockDone()
      return
    }
    errorFX()
  }

  if (!question || options.length === 0) return (
    <div style={{ background: 'var(--bg-card)', border: `1px dashed var(--border)`, padding: '24px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center', borderRadius: 'var(--r-xl)' }}>[QUIZ NON CONFIGURÉ]</div>
  )

  const hasSelection = pickedSet.size > 0
  const shouldShowFeedback = attempted || validated

  return (
    <div className="card-glass" style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, ${t.accent}, transparent)`,
      }} />
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 22px',
        fontFamily: 'var(--mono)', fontSize: '11px',
        color: t.accent, letterSpacing: '0.14em', fontWeight: 700,
        textTransform: 'uppercase',
      }}>
        ❓ Quiz
      </div>
      <div style={{ padding: '28px' }}>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: '17px', color: 'var(--text)',
          marginBottom: '22px', fontWeight: 700, lineHeight: 1.5,
          letterSpacing: '-0.01em',
        }}>
          {question}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, oi) => {
            const isPicked = pickedSet.has(oi)
            let bg = 'var(--bg-elevated)', border = '1px solid var(--border)', color = 'var(--text)'
            if (validated && opt.correct) {
              bg = 'color-mix(in srgb, #22c55e 14%, var(--bg-card))'
              border = '1px solid #22c55e'
              color = '#22c55e'
            } else if (attempted && isPicked && !opt.correct) {
              bg = 'color-mix(in srgb, var(--red) 14%, var(--bg-card))'
              border = '1px solid var(--red)'
              color = 'var(--red)'
            } else if (isPicked) {
              bg = 'color-mix(in srgb, var(--accent) 12%, var(--bg-card))'
              border = `1px solid ${t.accentBorder}`
              color = t.accent
            }
            return (
              <button
                key={oi}
                onClick={() => togglePick(oi)}
                disabled={validated}
                style={{
                  background: bg, border, color,
                  padding: '14px 18px', textAlign: 'left',
                  fontSize: '14px', fontWeight: 500,
                  cursor: validated ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  borderRadius: 'var(--r-md)',
                  transition: 'all 0.2s var(--ease)',
                  lineHeight: 1.5,
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}
                onMouseEnter={e => { if (!validated) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateX(4px)' } }}
                onMouseLeave={e => { if (!validated) { e.currentTarget.style.borderColor = isPicked ? t.accentBorder : 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)' } }}
              >
                <div style={{
                  width: '30px', height: '30px', flexShrink: 0,
                  borderRadius: 'var(--r-full)',
                  background: validated && opt.correct
                    ? '#22c55e'
                    : attempted && isPicked && !opt.correct
                      ? 'var(--red)'
                      : isPicked
                        ? t.accent
                        : 'var(--bg-muted)',
                  color: isPicked || (validated && opt.correct) ? 'var(--white)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700,
                }}>
                  {validated && opt.correct
                    ? '✓'
                    : attempted && isPicked && !opt.correct
                      ? '✗'
                      : isPicked
                        ? '●'
                        : String.fromCharCode(65 + oi)}
                </div>
                <span style={{ flex: 1 }}>{opt.text}</span>
                {validated && opt.correct && <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>BONNE RÉPONSE</span>}
                {attempted && isPicked && !opt.correct && <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>MAUVAISE RÉPONSE</span>}
              </button>
            )
          })}
        </div>

        {!validated && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {hasSelection
                ? `${pickedSet.size} réponse${pickedSet.size > 1 ? 's' : ''} sélectionnée${pickedSet.size > 1 ? 's' : ''}`
                : 'Sélectionnez toutes les bonnes réponses'}
            </div>
            <button
              onClick={handleValidate}
              disabled={!hasSelection}
              className="btn-primary"
              style={{
                padding: '10px 18px',
                fontSize: '11px',
                letterSpacing: '0.1em',
                opacity: hasSelection ? 1 : 0.45,
                cursor: hasSelection ? 'pointer' : 'not-allowed',
              }}
            >
              ✓ Valider mes réponses
            </button>
          </div>
        )}

        {/* Rich feedback card */}
        {shouldShowFeedback && (
          <div className="card-glass" style={{
            marginTop: '24px', padding: '22px',
            borderRadius: 'var(--r-xl)',
            borderLeft: `4px solid ${attemptCorrect ? '#22c55e' : 'var(--red)'}`,
            animation: 'fadeInUp 0.35s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: 'var(--r-full)',
                background: attemptCorrect ? '#22c55e' : 'var(--red)',
                color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 800,
              }}>{attemptCorrect ? '✓' : '✗'}</div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                color: attemptCorrect ? '#22c55e' : 'var(--red)',
                letterSpacing: '0.14em', fontWeight: 800,
                textTransform: 'uppercase',
              }}>
                {attemptCorrect ? 'Toutes les bonnes réponses trouvées' : 'Réponses incomplètes ou incorrectes'}
              </span>
            </div>
            {!attemptCorrect && correctIndices.length > 0 && (
              <div style={{
                marginBottom: '14px', padding: '12px 14px',
                background: 'color-mix(in srgb, #22c55e 6%, var(--bg-card))',
                border: '1px dashed rgba(34,197,94,0.4)',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#22c55e', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  ✓ Réponse attendue
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                  {correctIndices.map(idx => <li key={idx}>{options[idx]?.text}</li>)}
                </ul>
              </div>
            )}
            {explanation ? (
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  💡 Pourquoi ?
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {explanation}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {attemptCorrect
                  ? 'Toutes les bonnes réponses sont cochées. Passez au chapitre suivant.'
                  : 'Sélectionnez toutes les bonnes réponses pour débloquer la suite.'}
              </div>
            )}

            <RichExplanation
              kind={attemptCorrect ? 'success' : 'failure'}
              success={data.successExplanation}
              failure={data.failureExplanation}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// DECISION — admin defines: question, choices:[{text,correct,feedback}]
function DecisionBlock({ data, t, onBlockDone }) {
  const question = data.question || ''
  const choices = data.choices || []
  const [picked, setPicked] = useState(null)

  const handlePick = (ci) => {
    if (picked !== null) return
    setPicked(ci)
    if (choices[ci]?.correct) playSuccess()
    else errorFX()
    onBlockDone && onBlockDone()
  }

  if (!question || choices.length === 0) return (
    <div style={{ background: 'var(--bg-card)', border: `1px dashed var(--border)`, padding: '24px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center', borderRadius: 'var(--r-xl)' }}>[DÉCISION NON CONFIGURÉE]</div>
  )

  const pickedChoice = picked !== null ? choices[picked] : null
  const correctChoice = choices.find(c => c.correct)

  return (
    <div className="card-glass" style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, ${t.accent}, transparent)`,
      }} />
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 22px',
        fontFamily: 'var(--mono)', fontSize: '11px',
        color: t.accent, letterSpacing: '0.14em', fontWeight: 700,
        textTransform: 'uppercase',
      }}>
        🔀 Décision — Choisissez votre réaction
      </div>
      <div style={{ padding: '28px' }}>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: '17px', color: 'var(--text)',
          marginBottom: '22px', fontWeight: 700, lineHeight: 1.5,
          letterSpacing: '-0.01em',
        }}>
          {question}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {choices.map((c, ci) => {
            const sel = picked !== null, chosen = picked === ci
            let bg = 'var(--bg-elevated)', border = '1px solid var(--border)', color = 'var(--text)'
            if (sel && chosen && c.correct) { bg = 'color-mix(in srgb, #22c55e 14%, var(--bg-card))'; border = '1px solid #22c55e'; color = '#22c55e' }
            else if (sel && chosen)          { bg = 'color-mix(in srgb, var(--red) 14%, var(--bg-card))'; border = '1px solid var(--red)'; color = 'var(--red)' }
            else if (sel && c.correct)       { bg = 'color-mix(in srgb, #22c55e 8%, var(--bg-card))';  border = '1px solid rgba(34,197,94,0.45)'; color = '#22c55e' }
            return (
              <button
                key={ci}
                onClick={() => handlePick(ci)}
                disabled={sel}
                style={{
                  background: bg, border, color,
                  padding: '16px 18px', textAlign: 'left',
                  fontSize: '14px', fontWeight: 500,
                  cursor: sel ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  borderRadius: 'var(--r-md)',
                  transition: 'all 0.2s var(--ease)',
                  lineHeight: 1.5,
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}
                onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateX(4px)' } }}
                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)' } }}
              >
                <div style={{
                  width: '30px', height: '30px', flexShrink: 0,
                  borderRadius: 'var(--r-full)',
                  background: sel && chosen ? (c.correct ? '#22c55e' : 'var(--red)') : 'var(--bg-muted)',
                  color: sel && chosen ? 'var(--white)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: 700,
                }}>
                  {sel && chosen ? (c.correct ? '✓' : '✗') : '→'}
                </div>
                <span style={{ flex: 1 }}>{c.text}</span>
                {sel && chosen && c.correct && <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>BON CHOIX</span>}
                {sel && chosen && !c.correct && <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em' }}>MAUVAIS CHOIX</span>}
                {sel && !chosen && c.correct && <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', opacity: 0.8 }}>← bon choix</span>}
              </button>
            )
          })}
        </div>

        {/* Rich feedback card */}
        {pickedChoice && (
          <div className="card-glass" style={{
            marginTop: '24px', padding: '22px',
            borderRadius: 'var(--r-xl)',
            borderLeft: `4px solid ${pickedChoice.correct ? '#22c55e' : 'var(--red)'}`,
            animation: 'fadeInUp 0.35s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: 'var(--r-full)',
                background: pickedChoice.correct ? '#22c55e' : 'var(--red)',
                color: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 800,
              }}>{pickedChoice.correct ? '✓' : '✗'}</div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                color: pickedChoice.correct ? '#22c55e' : 'var(--red)',
                letterSpacing: '0.14em', fontWeight: 800,
                textTransform: 'uppercase',
              }}>
                {pickedChoice.correct ? 'Bonne décision' : 'Mauvaise décision'}
              </span>
            </div>
            {!pickedChoice.correct && correctChoice && (
              <div style={{
                marginBottom: '14px', padding: '12px 14px',
                background: 'color-mix(in srgb, #22c55e 6%, var(--bg-card))',
                border: '1px dashed rgba(34,197,94,0.4)',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#22c55e', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  ✓ Réaction attendue
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                  {correctChoice.text}
                </div>
              </div>
            )}
            {pickedChoice.feedback ? (
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  💬 Analyse
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {pickedChoice.feedback}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {pickedChoice.correct
                  ? 'Vous avez pris la bonne décision. Passez au chapitre suivant.'
                  : 'Examinez la réaction attendue ci-dessus avant de continuer.'}
              </div>
            )}

            <RichExplanation
              kind={pickedChoice.correct ? 'success' : 'failure'}
              success={data.successExplanation}
              failure={data.failureExplanation}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// PUZZLE — admin defines: puzzleType (reorder|memory|crossword), instruction, items/pairs/words
function PuzzleBlock({ data, t, onBlockDone }) {
  const type = data.puzzleType || 'reorder'
  const handleDone = onBlockDone

  if (type === 'reorder')   return <PuzzleReorder   data={data} t={t} onComplete={handleDone} />
  if (type === 'memory')    return <PuzzleMemory    data={data} t={t} onComplete={handleDone} />
  if (type === 'crossword') return <PuzzleCrossword data={data} t={t} onComplete={handleDone} />

  return (
    <div style={{ background: 'rgba(0,0,0,0.35)', border: `1px dashed ${t.accentBorder}`, padding: '24px', color: t.accent, fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center', opacity: 0.6, borderRadius: '3px' }}>
      [PUZZLE "{type}" — AJOUT PRÉVU]
    </div>
  )
}

// CROSSWORD — real intersecting grid
function buildCrosswordLayout(rawWords) {
  const words = (rawWords || []).filter(w => w.word && w.word.length > 0).map(w => ({ ...w, word: w.word.toUpperCase().replace(/\s+/g, '') }))
  if (words.length === 0) return { cells: {}, placements: [], width: 0, height: 0 }

  const cells = {}
  const placements = []
  const setCell = (x, y, letter, wordIdx, letterIdx) => {
    const key = `${x},${y}`
    if (!cells[key]) cells[key] = { letter, words: [] }
    cells[key].words.push({ wordIdx, letterIdx })
  }

  // First word horizontal at 0,0
  const first = words[0].word
  for (let i = 0; i < first.length; i++) setCell(i, 0, first[i], 0, i)
  placements.push({ wordIdx: 0, dir: 'h', x: 0, y: 0, length: first.length })

  const neighborsFree = (x, y, dir) => {
    if (dir === 'h') return !cells[`${x},${y - 1}`] && !cells[`${x},${y + 1}`]
    return !cells[`${x - 1},${y}`] && !cells[`${x + 1},${y}`]
  }

  for (let wi = 1; wi < words.length; wi++) {
    const word = words[wi].word
    let placed = false
    for (let li = 0; li < word.length && !placed; li++) {
      const ch = word[li]
      for (const [key, cell] of Object.entries(cells)) {
        if (cell.letter !== ch) continue
        const [cx, cy] = key.split(',').map(Number)
        const existingDirs = cell.words.map(ww => placements.find(p => p.wordIdx === ww.wordIdx)?.dir)
        const dir = existingDirs.includes('h') ? 'v' : 'h'
        const x0 = dir === 'h' ? cx - li : cx
        const y0 = dir === 'v' ? cy - li : cy

        let ok = true
        for (let k = 0; k < word.length; k++) {
          const nx = dir === 'h' ? x0 + k : x0
          const ny = dir === 'v' ? y0 + k : y0
          const existing = cells[`${nx},${ny}`]
          if (existing) {
            if (existing.letter !== word[k]) { ok = false; break }
          } else {
            if (!neighborsFree(nx, ny, dir)) { ok = false; break }
          }
        }
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
          placed = true
          break
        }
      }
    }
    if (!placed) {
      const ys = Object.keys(cells).map(k => Number(k.split(',')[1]))
      const y = (ys.length ? Math.max(...ys) : 0) + 2
      for (let k = 0; k < word.length; k++) setCell(k, y, word[k], wi, k)
      placements.push({ wordIdx: wi, dir: 'h', x: 0, y, length: word.length })
    }
  }

  // Normalize
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
  shiftedPlacements.forEach((p, i) => {
    const k = `${p.x},${p.y}`
    if (shiftedCells[k] && !shiftedCells[k].number) shiftedCells[k].number = i + 1
  })

  return {
    cells: shiftedCells,
    placements: shiftedPlacements,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

function LinkWarningOverlay({ t, tr, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(4,6,12,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', cursor: 'pointer',
        animation: 'fade-in 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '560px', width: '100%',
          background: 'linear-gradient(180deg, rgba(20,24,40,0.95) 0%, rgba(8,10,20,0.98) 100%)',
          border: `1.5px solid ${t.accent}`,
          borderRadius: '8px',
          padding: '32px 36px',
          textAlign: 'center',
          cursor: 'default',
          boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 60px ${t.accentDim}`,
          animation: 'slide-up 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '32px', height: '32px',
            background: 'transparent',
            border: `1px solid ${t.accentBorder}`,
            color: t.accent,
            cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 900,
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = t.accentDim; e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          ✕
        </button>
        <div style={{ fontSize: '56px', marginBottom: '14px', filter: `drop-shadow(0 0 24px ${t.accent})` }}>🛡️</div>
        <div style={{
          display: 'inline-block',
          fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent,
          letterSpacing: '0.22em', fontWeight: 700,
          background: t.accentDim, border: `1px solid ${t.accentBorder}`,
          padding: '5px 12px', borderRadius: '2px', marginBottom: '16px',
        }}>
          {tr ? tr('linkWarnTag') : 'SECURITY RULE'}
        </div>
        <div style={{
          fontFamily: 'var(--font-title, inherit)',
          fontSize: '22px', fontWeight: 800, color: '#f5f5f5',
          lineHeight: 1.3, marginBottom: '16px',
          letterSpacing: '-0.01em',
        }}>
          {tr ? tr('linkWarnTitle') : 'Never click a link without verifying it first'}
        </div>
        <div style={{
          fontSize: '14px', color: '#cfd2da',
          lineHeight: 1.7, marginBottom: '18px',
        }}>
          {tr ? tr('linkWarnBody') : 'Before clicking, always hover over the link to see its real destination. If the displayed text and the actual URL don\'t match, it\'s a trap.'}
        </div>
        <div style={{
          fontSize: '12px', color: t.accent,
          fontFamily: 'var(--mono)', letterSpacing: '0.08em',
          padding: '10px 14px',
          background: t.accentDim, border: `1px dashed ${t.accentBorder}`,
          borderRadius: '4px',
        }}>
          {tr ? tr('linkWarnHint') : '💡 Tip: the URL shown on hover is the real destination.'}
        </div>
      </div>
    </div>
  )
}

function HackingOverlay({ t, tr }) {
  const lines = [
    tr ? tr('hackErrLine1') : '> SYSTEM BREACH DETECTED',
    tr ? tr('hackErrLine2') : '> SIGNATURE MISMATCH · 0x7F3A',
    tr ? tr('hackErrLine3') : '> UNAUTHORIZED ACTION',
    tr ? tr('hackErrLine4') : '> ROLLING BACK SECTOR...',
    tr ? tr('hackErrLine5') : '> KERNEL PANIC — REBOOT FAILSAFE',
  ]
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(8,0,0,0.82)',
      backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', pointerEvents: 'none',
      animation: 'fade-in 0.18s linear',
    }}>
      {/* moving scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: '90px',
        background: `linear-gradient(180deg, transparent 0%, ${t.accent}25 45%, ${t.accent}60 50%, ${t.accent}25 55%, transparent 100%)`,
        animation: 'hack-scanline 0.8s linear infinite',
        mixBlendMode: 'screen',
      }} />
      {/* horizontal noise bars */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(235,40,40,0.08) 3px, rgba(235,40,40,0.08) 4px)`,
        mixBlendMode: 'overlay',
      }} />

      <div style={{
        fontFamily: 'var(--mono)',
        textAlign: 'left',
        padding: '26px 32px',
        background: 'rgba(0,0,0,0.7)',
        border: `1px solid ${t.accent}`,
        boxShadow: `0 0 60px ${t.accent}, inset 0 0 22px rgba(235,40,40,0.25)`,
        borderRadius: '3px',
        animation: 'hack-text-flicker 0.35s linear infinite',
        maxWidth: '560px',
      }}>
        <div style={{
          fontSize: '24px', fontWeight: 900, color: '#ff3b3b',
          letterSpacing: '0.22em', marginBottom: '14px',
          textShadow: '2px 0 #00f2ff, -2px 0 #ff00aa',
        }}>
          {tr ? tr('hackErrTitle') : '⚠ ERROR · INTRUSION DETECTED'}
        </div>
        {lines.map((l, i) => (
          <div key={i} style={{
            fontSize: '13px', color: '#ff6060', letterSpacing: '0.08em',
            lineHeight: 1.7, whiteSpace: 'pre',
            textShadow: '1px 0 #00f2ff, -1px 0 #ff00aa',
          }}>
            {l}
          </div>
        ))}
        <div style={{
          marginTop: '14px', fontSize: '12px', color: t.accent,
          letterSpacing: '0.14em', fontWeight: 700,
        }}>
          {tr ? tr('hackErrFooter') : '█ RESTORING INTERFACE...'}
        </div>
      </div>
    </div>
  )
}

function PuzzleCrossword({ data, t }) {
  const words = (data.words || []).filter(w => w.word && w.word.length > 0)
  const layout = useRef(null)
  if (layout.current === null) layout.current = buildCrosswordLayout(words)
  const { cells, placements, width, height } = layout.current

  // State: letter entered at each cell (keyed by "x,y")
  const [letters, setLetters] = useState({})
  const [activeCell, setActiveCell] = useState(null) // "x,y"
  const [activeWord, setActiveWord] = useState(0) // wordIdx currently being filled
  const [direction, setDirection] = useState('h') // 'h' | 'v'
  const [checked, setChecked] = useState(false)
  const [hackingGlitch, setHackingGlitch] = useState(false)
  const cellRefs = useRef({})

  if (words.length === 0) return (
    <div style={{ background: 'rgba(0,0,0,0.35)', border: `1px dashed ${t.accentBorder}`, padding: '24px', color: t.accent, fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center', opacity: 0.5, borderRadius: '3px' }}>[MOTS CROISÉS — AUCUN MOT DÉFINI]</div>
  )

  const focusCell = (x, y) => {
    const el = cellRefs.current[`${x},${y}`]
    if (el) { el.focus(); el.select() }
  }

  const setLetter = (key, ch) => {
    if (checked) return
    const clean = (ch || '').replace(/[^a-zA-ZÀ-ÿ]/g, '').toUpperCase().slice(0, 1)
    setLetters(prev => ({ ...prev, [key]: clean }))

    if (clean) {
      // Advance in current direction
      const [x, y] = key.split(',').map(Number)
      const nx = direction === 'h' ? x + 1 : x
      const ny = direction === 'v' ? y + 1 : y
      if (cells[`${nx},${ny}`]) setTimeout(() => focusCell(nx, ny), 10)
    }
  }

  const handleKey = (key, e) => {
    const [x, y] = key.split(',').map(Number)
    if (e.key === 'Backspace') {
      if (!letters[key]) {
        e.preventDefault()
        const px = direction === 'h' ? x - 1 : x
        const py = direction === 'v' ? y - 1 : y
        if (cells[`${px},${py}`]) {
          setLetters(prev => ({ ...prev, [`${px},${py}`]: '' }))
          focusCell(px, py)
        }
      }
    } else if (e.key === 'ArrowLeft') { e.preventDefault(); if (cells[`${x - 1},${y}`]) { setDirection('h'); focusCell(x - 1, y) } }
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (cells[`${x + 1},${y}`]) { setDirection('h'); focusCell(x + 1, y) } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (cells[`${x},${y - 1}`]) { setDirection('v'); focusCell(x, y - 1) } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (cells[`${x},${y + 1}`]) { setDirection('v'); focusCell(x, y + 1) } }
    else if (e.key === ' ' || e.key === 'Tab') { e.preventDefault(); setDirection(d => d === 'h' ? 'v' : 'h') }
    else if (e.key === 'Enter') { check() }
  }

  const handleCellClick = (x, y) => {
    const key = `${x},${y}`
    if (activeCell === key) setDirection(d => d === 'h' ? 'v' : 'h')
    setActiveCell(key)
    // Pick a word containing this cell in current direction
    const cell = cells[key]
    if (cell) {
      const preferred = cell.words.find(w => placements[w.wordIdx].dir === direction)
      const word = preferred || cell.words[0]
      if (word) {
        setActiveWord(word.wordIdx)
        setDirection(placements[word.wordIdx].dir)
      }
    }
    focusCell(x, y)
  }

  const check = () => {
    setChecked(true)
    let allRight = true
    for (const [key, cell] of Object.entries(cells)) {
      if (letters[key] !== cell.letter) { allRight = false; break }
    }
    if (allRight) {
      playSuccess()
      // No auto-advance — player clicks CONTINUER when ready
    } else {
      errorFX()
      // Big hacking-mode glitch/freeze, then unfreeze wrong cells so user can retry.
      setHackingGlitch(true)
      setTimeout(() => {
        setHackingGlitch(false)
        // Clear wrong letters and exit checked state so the player can keep typing.
        setLetters(prev => {
          const next = { ...prev }
          for (const [key, cell] of Object.entries(cells)) {
            if (next[key] !== cell.letter) next[key] = ''
          }
          return next
        })
        setChecked(false)
      }, 1400)
    }
  }

  // Stats
  const totalCells = Object.keys(cells).length
  const filledCells = Object.keys(cells).filter(k => letters[k]).length
  const correctCells = Object.keys(cells).filter(k => letters[k] === cells[k].letter).length
  const solvedWords = placements.filter(p => {
    for (let k = 0; k < p.length; k++) {
      const x = p.dir === 'h' ? p.x + k : p.x
      const y = p.dir === 'v' ? p.y + k : p.y
      if (letters[`${x},${y}`] !== cells[`${x},${y}`].letter) return false
    }
    return true
  }).length

  // Active word cells (for highlighting)
  const activePlacement = placements[activeWord]
  const activeKeys = new Set()
  if (activePlacement) {
    for (let k = 0; k < activePlacement.length; k++) {
      const x = activePlacement.dir === 'h' ? activePlacement.x + k : activePlacement.x
      const y = activePlacement.dir === 'v' ? activePlacement.y + k : activePlacement.y
      activeKeys.add(`${x},${y}`)
    }
  }

  const CELL = 42

  return (
    <div style={{
      position: 'relative',
      border: `1px solid ${t.accentBorder}`,
      borderRadius: '3px',
      overflow: 'hidden',
      animation: hackingGlitch ? 'hack-glitch 0.18s steps(2) infinite' : 'none',
    }}>
      {hackingGlitch && <HackingOverlay t={t} />}
      <div style={{ background: t.accentDim, borderBottom: `1px solid ${t.accentBorder}`, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: t.accent, letterSpacing: '0.14em', fontWeight: 700 }}>
          📐 MOTS CROISÉS — {words.length} MOT{words.length > 1 ? 'S' : ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '100px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(correctCells / totalCells) * 100}%`, background: `linear-gradient(90deg, ${t.accent}, #22c55e)`, transition: 'width 0.3s ease', boxShadow: `0 0 8px ${t.accent}` }} />
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>
            {solvedWords} / {words.length}
          </span>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '28px' }}>
        {data.instruction && (
          <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px', lineHeight: 1.5, fontStyle: 'italic', borderLeft: `2px solid ${t.accent}`, paddingLeft: '12px' }}>
            {data.instruction}
          </div>
        )}

        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* ─── Grid ─── */}
          <div style={{
            padding: '12px',
            background: 'var(--bg)',
            border: `1px solid ${t.accentBorder}`,
            borderRadius: '4px',
            boxShadow: `inset 0 0 40px rgba(0,0,0,0.8), 0 0 30px ${t.accentDim}`,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${width}, ${CELL}px)`,
              gridAutoRows: `${CELL}px`,
              gap: '2px',
            }}>
              {Array.from({ length: height }).map((_, y) =>
                Array.from({ length: width }).map((_, x) => {
                  const key = `${x},${y}`
                  const cell = cells[key]
                  if (!cell) return <div key={key} style={{ background: 'transparent' }} />

                  const val = letters[key] || ''
                  const isActive = activeCell === key
                  const isActiveWord = activeKeys.has(key)
                  const isCorrect = checked && val === cell.letter
                  const isWrong = checked && val && val !== cell.letter

                  let bg = 'var(--bg-input)'
                  let border = `1px solid ${t.accentBorder}`
                  let color = '#e8e8e8'
                  let shadow = 'inset 0 0 6px rgba(0,0,0,0.8)'

                  if (isCorrect) {
                    bg = 'rgba(34,197,94,0.18)'
                    border = '1.5px solid #22c55e'
                    color = '#22c55e'
                    shadow = `0 0 12px rgba(34,197,94,0.4), inset 0 0 6px rgba(34,197,94,0.15)`
                  } else if (isWrong) {
                    bg = 'rgba(235,40,40,0.18)'
                    border = '1.5px solid #eb2828'
                    color = '#eb2828'
                  } else if (isActive) {
                    bg = t.accentDim
                    border = `2px solid ${t.accent}`
                    color = t.accent
                    shadow = `0 0 14px ${t.accent}, inset 0 0 8px ${t.accentDim}`
                  } else if (isActiveWord) {
                    bg = 'var(--bg-muted)'
                    border = `1px solid ${t.accent}`
                  } else if (val) {
                    border = `1.5px solid ${t.accent}`
                    color = t.accent
                  }

                  return (
                    <div key={key} style={{ position: 'relative' }}>
                      <input
                        ref={el => { if (el) cellRefs.current[key] = el }}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={e => setLetter(key, e.target.value)}
                        onKeyDown={e => handleKey(key, e)}
                        onFocus={() => setActiveCell(key)}
                        onClick={() => handleCellClick(x, y)}
                        disabled={checked && isCorrect}
                        autoComplete="off"
                        spellCheck={false}
                        style={{
                          width: `${CELL}px`, height: `${CELL}px`,
                          background: bg, border, color,
                          fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 900,
                          textAlign: 'center', textTransform: 'uppercase',
                          outline: 'none', borderRadius: '2px',
                          caretColor: t.accent, boxShadow: shadow,
                          transition: 'all 0.12s', padding: 0,
                        }}
                      />
                      {cell.number && (
                        <span style={{
                          position: 'absolute', top: '0px', left: '2px',
                          fontSize: '9px', fontFamily: 'var(--mono)',
                          color: isActive ? 'var(--bg)' : t.accent, fontWeight: 900,
                          pointerEvents: 'none', lineHeight: 1,
                        }}>
                          {cell.number}
                        </span>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ─── Clues list ─── */}
          <div style={{ flex: 1, minWidth: '240px', maxWidth: '420px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.18em', marginBottom: '12px' }}>
              INDICES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {placements.map((p, i) => {
                const word = words[p.wordIdx]
                const isActive = activeWord === p.wordIdx
                const solved = (() => {
                  for (let k = 0; k < p.length; k++) {
                    const x = p.dir === 'h' ? p.x + k : p.x
                    const y = p.dir === 'v' ? p.y + k : p.y
                    if (letters[`${x},${y}`] !== cells[`${x},${y}`].letter) return false
                  }
                  return true
                })()
                return (
                  <div
                    key={i}
                    onClick={() => { setActiveWord(p.wordIdx); setDirection(p.dir); focusCell(p.x, p.y) }}
                    style={{
                      padding: '10px 12px',
                      background: isActive ? t.accentDim : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? t.accent : 'var(--bg-muted)'}`,
                      borderLeft: `3px solid ${solved ? '#22c55e' : isActive ? t.accent : 'transparent'}`,
                      borderRadius: '3px', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: solved ? '#22c55e' : t.accent, fontWeight: 900 }}>
                        {i + 1}. {p.dir === 'h' ? 'HORIZ' : 'VERT'}
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
                        ({p.length} lettres)
                      </span>
                      {solved && <span style={{ color: '#22c55e', fontSize: '12px', marginLeft: 'auto' }}>✓</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: isActive ? '#e8e8e8' : '#aaa', lineHeight: 1.4 }}>
                      {word?.clue || '(pas d\'indice)'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {!checked ? (
            <button onClick={check}
              style={{
                background: `linear-gradient(135deg, ${t.accentDim} 0%, ${t.accentBorder} 100%)`,
                border: `2px solid ${t.accent}`, color: t.accent,
                padding: '13px 32px', cursor: 'pointer',
                fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 900, letterSpacing: '0.18em',
                borderRadius: '3px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 0 30px ${t.accentDim}` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
              ✓ VÉRIFIER LA GRILLE
            </button>
          ) : (
            <div style={{
              padding: '12px 20px',
              background: correctCells === totalCells ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${correctCells === totalCells ? '#22c55e' : '#f59e0b'}`,
              borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '11px',
              color: correctCells === totalCells ? '#22c55e' : '#f59e0b',
              letterSpacing: '0.1em', fontWeight: 700, animation: 'fade-in 0.4s ease',
            }}>
              {correctCells === totalCells
                ? `✓ GRILLE COMPLÈTE — ${correctCells}/${totalCells}`
                : `${correctCells}/${totalCells} LETTRES CORRECTES · ${solvedWords}/${words.length} MOTS`}
            </div>
          )}
          <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            ← → ↑ ↓ NAVIGUER · ESPACE BASCULER · ⏎ VÉRIFIER · {filledCells}/{totalCells} remplies
          </div>
        </div>

        {/* Admin-authored success/failure explanation */}
        {checked && (
          <RichExplanation
            kind={correctCells === totalCells ? 'success' : 'failure'}
            success={data.successExplanation}
            failure={data.failureExplanation}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

function PuzzleReorder({ data, t }) {
  const correctOrder = data.items || []
  const [order, setOrder] = useState(() => {
    // Fisher-Yates shuffle
    const arr = [...correctOrder]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })
  const [checked, setChecked] = useState(false)

  const move = (idx, dir) => {
    if (checked) return
    const next = [...order]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setOrder(next)
  }

  const isCorrect = checked && order.every((it, i) => it === correctOrder[i])

  const check = () => {
    setChecked(true)
    const ok = order.every((it, i) => it === correctOrder[i])
    if (ok) playSuccess()
    else errorFX()
    // No auto-advance — player clicks CONTINUER when ready
  }

  if (correctOrder.length === 0) return (
    <div style={{ background: 'rgba(0,0,0,0.35)', border: `1px dashed ${t.accentBorder}`, padding: '24px', color: t.accent, fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center', opacity: 0.5, borderRadius: '3px' }}>[PUZZLE — AUCUN ITEM]</div>
  )

  return (
    <div style={{ border: `1px solid ${t.accentBorder}`, borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ background: t.accentDim, borderBottom: `1px solid ${t.accentBorder}`, padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.12em' }}>
        🧩 REMETTEZ DANS L'ORDRE
      </div>
      <div style={{ background: 'rgba(0,0,0,0.35)', padding: '22px' }}>
        {data.instruction && (
          <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '18px', lineHeight: 1.6 }}>{data.instruction}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {order.map((item, idx) => {
            const correctHere = checked && item === correctOrder[idx]
            return (
              <div key={`${item}-${idx}`} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px',
                background: checked ? (correctHere ? 'rgba(34,197,94,0.1)' : 'var(--violet-tint)') : 'var(--bg-muted)',
                border: `1px solid ${checked ? (correctHere ? '#22c55e' : '#eb2828') : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '3px',
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: t.accent, fontWeight: 700, minWidth: '20px' }}>
                  {idx + 1}.
                </span>
                <span style={{ flex: 1, fontSize: '13px', color: '#e8e8e8' }}>{item}</span>
                {!checked && (
                  <>
                    <button onClick={() => move(idx, -1)} disabled={idx === 0}
                      style={{ background: 'transparent', border: `1px solid ${t.accentBorder}`, color: idx === 0 ? 'var(--border-strong)' : t.accent, padding: '4px 8px', cursor: idx === 0 ? 'default' : 'pointer', fontFamily: 'var(--mono)', fontSize: '11px', borderRadius: '2px' }}>↑</button>
                    <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1}
                      style={{ background: 'transparent', border: `1px solid ${t.accentBorder}`, color: idx === order.length - 1 ? 'var(--border-strong)' : t.accent, padding: '4px 8px', cursor: idx === order.length - 1 ? 'default' : 'pointer', fontFamily: 'var(--mono)', fontSize: '11px', borderRadius: '2px' }}>↓</button>
                  </>
                )}
                {checked && (
                  <span style={{ color: correctHere ? '#22c55e' : '#eb2828', fontSize: '14px', fontWeight: 700 }}>
                    {correctHere ? '✓' : '✗'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {!checked && (
          <button onClick={check}
            style={{ marginTop: '16px', background: t.accentDim, border: `1px solid ${t.accentBorder}`, color: t.accent, padding: '10px 20px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em', borderRadius: '3px', fontWeight: 700 }}>
            VÉRIFIER
          </button>
        )}
        {checked && (
          <div style={{
            marginTop: '14px', padding: '10px 14px',
            background: isCorrect ? 'rgba(34,197,94,0.1)' : 'var(--violet-tint)',
            border: `1px solid ${isCorrect ? '#22c55e' : '#eb2828'}`,
            borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '11px',
            color: isCorrect ? '#22c55e' : '#eb2828',
          }}>
            {isCorrect ? '✓ Ordre correct !' : '✗ Ce n\'est pas le bon ordre — les réponses correctes sont affichées'}
          </div>
        )}

        {/* Admin-authored success/failure explanation */}
        {checked && (
          <RichExplanation
            kind={isCorrect ? 'success' : 'failure'}
            success={data.successExplanation}
            failure={data.failureExplanation}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

// Connect-the-words game — click left word then right word to draw a line
function PuzzleMemory({ data, t }) {
  const pairs = data.pairs || []
  const [matched, setMatched] = useState(new Set())
  const [selectedA, setSelectedA] = useState(null)
  const [connections, setConnections] = useState([]) // {aIdx, bIdx, correct}
  const [wrongPair, setWrongPair] = useState(null)
  const [mousePos, setMousePos] = useState(null)
  const [, forceRender] = useState(0)

  const containerRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})

  // Shuffled right column (persistent across renders)
  const bShuffled = useRef(null)
  if (bShuffled.current === null) {
    const arr = pairs.map((p, i) => ({ text: p.b, origIdx: i }))
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    bShuffled.current = arr
  }

  // Re-render on resize so SVG lines stay aligned
  useEffect(() => {
    const onResize = () => forceRender(n => n + 1)
    window.addEventListener('resize', onResize)
    const id = setTimeout(() => forceRender(n => n + 1), 30)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(id) }
  }, [])

  const getAnchor = (el, side) => {
    // side: 'right' for left column (line exits from right edge)
    if (!el || !containerRef.current) return null
    const c = containerRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return {
      x: side === 'right' ? (r.right - c.left) : (r.left - c.left),
      y: r.top - c.top + r.height / 2,
    }
  }

  const handleLeftClick = (i) => {
    if (matched.has(i)) return
    setSelectedA(i)
  }

  const handleRightClick = (origIdx) => {
    if (selectedA === null || matched.has(selectedA) || matched.has(origIdx)) return
    const correct = selectedA === origIdx
    const newConn = { aIdx: selectedA, bIdx: origIdx, correct }
    setConnections(prev => [...prev, newConn])
    if (correct) {
      playScore()
      const next = new Set([...matched, selectedA])
      setMatched(next)
      setSelectedA(null)
      setMousePos(null)
      if (next.size === pairs.length) {
        playSuccess()
        // No auto-advance — player clicks CONTINUER when ready
      }
    } else {
      errorFX()
      setWrongPair({ a: selectedA, b: origIdx })
      setTimeout(() => {
        setConnections(prev => prev.filter(c => !(c.aIdx === newConn.aIdx && c.bIdx === newConn.bIdx)))
        setSelectedA(null)
        setWrongPair(null)
        setMousePos(null)
      }, 750)
    }
  }

  const handleMouseMove = (e) => {
    if (selectedA === null || !containerRef.current) return
    const c = containerRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - c.left, y: e.clientY - c.top })
  }

  if (pairs.length === 0) return (
    <div style={{ background: 'rgba(0,0,0,0.35)', border: `1px dashed ${t.accentBorder}`, padding: '24px', color: t.accent, fontFamily: 'var(--mono)', fontSize: '12px', textAlign: 'center', opacity: 0.5, borderRadius: '3px' }}>[PUZZLE — AUCUNE PAIRE]</div>
  )

  const pendingAnchor = selectedA !== null ? getAnchor(leftRefs.current[selectedA], 'right') : null

  return (
    <div style={{ border: `1px solid ${t.accentBorder}`, borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ background: t.accentDim, borderBottom: `1px solid ${t.accentBorder}`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.12em' }}>
          🔗 RELIEZ LES MOTS À LEUR DÉFINITION
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#22c55e', fontWeight: 700 }}>{matched.size} / {pairs.length}</span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={(e) => { if (e.target === e.currentTarget) { setSelectedA(null); setMousePos(null) } }}
        style={{ background: 'rgba(0,0,0,0.35)', padding: '26px 24px', position: 'relative' }}
      >
        {data.instruction && <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '18px' }}>{data.instruction}</div>}

        {/* SVG overlay for lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          {connections.map((c, i) => {
            const from = getAnchor(leftRefs.current[c.aIdx], 'right')
            const to = getAnchor(rightRefs.current[c.bIdx], 'left')
            if (!from || !to) return null
            const midX = (from.x + to.x) / 2
            const isWrong = wrongPair && wrongPair.a === c.aIdx && wrongPair.b === c.bIdx
            const color = isWrong ? '#eb2828' : (c.correct ? '#22c55e' : '#eb2828')
            return (
              <g key={i}>
                <path
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  stroke={color} strokeWidth="3" fill="none"
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 8px ${color})`,
                    opacity: isWrong ? 0.9 : 1,
                    animation: 'fade-in 0.25s ease',
                  }}
                />
                <circle cx={from.x} cy={from.y} r="5" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
                <circle cx={to.x} cy={to.y} r="5" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
              </g>
            )
          })}

          {/* Dynamic line following the mouse */}
          {pendingAnchor && mousePos && (
            <path
              d={`M ${pendingAnchor.x} ${pendingAnchor.y} C ${(pendingAnchor.x + mousePos.x) / 2} ${pendingAnchor.y}, ${(pendingAnchor.x + mousePos.x) / 2} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
              stroke={t.accent} strokeWidth="2" strokeDasharray="5,5" fill="none"
              strokeLinecap="round"
              style={{ opacity: 0.7, filter: `drop-shadow(0 0 6px ${t.accent})` }}
            />
          )}
          {pendingAnchor && (
            <circle cx={pendingAnchor.x} cy={pendingAnchor.y} r="5" fill={t.accent} style={{ filter: `drop-shadow(0 0 8px ${t.accent})` }} />
          )}
        </svg>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', position: 'relative', zIndex: 2 }}>
          {/* LEFT — terms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.18em', marginBottom: '4px' }}>TERMES</div>
            {pairs.map((p, i) => {
              const done = matched.has(i)
              const active = selectedA === i
              const isWrong = wrongPair && wrongPair.a === i
              return (
                <button
                  key={`a${i}`}
                  ref={el => { leftRefs.current[i] = el }}
                  disabled={done}
                  onClick={(e) => { e.stopPropagation(); handleLeftClick(i) }}
                  style={{
                    padding: '14px 16px', textAlign: 'left', fontSize: '13px',
                    background: done ? 'rgba(34,197,94,0.1)' : isWrong ? 'rgba(235,40,40,0.15)' : active ? t.accentDim : 'rgba(255,255,255,0.025)',
                    border: `1.5px solid ${done ? '#22c55e' : isWrong ? '#eb2828' : active ? t.accent : 'rgba(255,255,255,0.08)'}`,
                    color: done ? '#22c55e' : isWrong ? '#eb2828' : active ? t.accent : '#ddd',
                    fontFamily: 'inherit', cursor: done ? 'default' : 'pointer',
                    borderRadius: '3px', transition: 'all 0.2s', lineHeight: 1.4,
                    fontWeight: active || done ? 600 : 500,
                    boxShadow: active ? `0 0 16px ${t.accentDim}` : 'none',
                  }}
                >
                  {p.a}
                </button>
              )
            })}
          </div>

          {/* RIGHT — definitions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.18em', marginBottom: '4px' }}>DÉFINITIONS</div>
            {bShuffled.current.map((b) => {
              const done = matched.has(b.origIdx)
              const isWrong = wrongPair && wrongPair.b === b.origIdx
              const highlight = selectedA !== null && !done
              return (
                <button
                  key={`b${b.origIdx}`}
                  ref={el => { rightRefs.current[b.origIdx] = el }}
                  disabled={done}
                  onClick={(e) => { e.stopPropagation(); handleRightClick(b.origIdx) }}
                  style={{
                    padding: '14px 16px', textAlign: 'left', fontSize: '12px',
                    background: done ? 'rgba(34,197,94,0.1)' : isWrong ? 'rgba(235,40,40,0.15)' : 'rgba(255,255,255,0.025)',
                    border: `1.5px solid ${done ? '#22c55e' : isWrong ? '#eb2828' : highlight ? t.accentBorder : 'rgba(255,255,255,0.08)'}`,
                    color: done ? '#22c55e' : isWrong ? '#eb2828' : '#ccc',
                    fontFamily: 'inherit', cursor: done ? 'default' : 'pointer',
                    borderRadius: '3px', transition: 'all 0.2s', lineHeight: 1.4,
                  }}
                  onMouseEnter={e => { if (!done && highlight) e.currentTarget.style.borderColor = t.accent }}
                  onMouseLeave={e => { if (!done && !isWrong) e.currentTarget.style.borderColor = highlight ? t.accentBorder : 'rgba(255,255,255,0.08)' }}
                >
                  {b.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* Hint */}
        {selectedA !== null && (
          <div style={{ marginTop: '18px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.12em', animation: 'fade-in 0.2s ease' }}>
            → CLIQUEZ SUR LA DÉFINITION CORRESPONDANTE
          </div>
        )}

        {/* Admin-authored explanation when all pairs are matched */}
        {matched.size === pairs.length && pairs.length > 0 && data.successExplanation && (
          <RichExplanation
            kind="success"
            success={data.successExplanation}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

// VIDEO — admin defines: url, caption
function VideoBlock({ data, t }) {
  const src = data.url || data.src || data.videoUrl || ''
  const isLocal = src.startsWith('data:') || src.startsWith('blob:')
  const isYT = !isLocal && (src.includes('youtube.com') || src.includes('youtu.be'))
  const isVimeo = !isLocal && src.includes('vimeo.com')

  let embed = src
  if (isYT) {
    const m = src.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
    if (m) embed = `https://www.youtube.com/embed/${m[1]}?rel=0`
  } else if (isVimeo) {
    const m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (m) embed = `https://player.vimeo.com/video/${m[1]}`
  }

  // Extract MIME type from data URL for <source type>
  const mimeType = isLocal && src.startsWith('data:')
    ? (src.match(/^data:(video\/[\w+-]+);/)?.[1] || 'video/mp4')
    : undefined

  const label = isLocal ? '💾 VIDÉO LOCALE' : isYT ? '▶ YOUTUBE' : isVimeo ? '▶ VIMEO' : '🎬 VIDÉO'

  return (
    <div style={{ border: `1px solid ${t.accentBorder}`, borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ background: t.accentDim, borderBottom: `1px solid ${t.accentBorder}`, padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.12em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        {isLocal && <span style={{ fontSize: '9px', color: '#666' }}>ENCODÉE ({Math.round((src.length * 0.75) / 1024)} KB)</span>}
      </div>
      {src ? (
        (isYT || isVimeo) ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: 'var(--bg)' }}>
            <iframe src={embed} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="video" />
          </div>
        ) : (
          <video controls preload="metadata" style={{ width: '100%', display: 'block', background: 'var(--bg)', maxHeight: '520px' }}>
            <source src={src} {...(mimeType ? { type: mimeType } : {})} />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        )
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: t.accent, fontFamily: 'var(--mono)', fontSize: '12px', background: 'rgba(0,0,0,0.35)', opacity: 0.5 }}>
          [VIDÉO NON CONFIGURÉE]
        </div>
      )}
      {data.caption && (
        <div style={{ background: 'rgba(0,0,0,0.35)', borderTop: `1px solid ${t.accentBorder}`, padding: '14px 18px', fontSize: '13px', color: '#ccc', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {data.caption}
        </div>
      )}
    </div>
  )
}

// TEXT — admin defines: heading, content
function TextBlock({ data, t }) {
  return (
    <div style={{ border: `1px solid ${t.accentBorder}`, borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ background: t.accentDim, borderBottom: `1px solid ${t.accentBorder}`, padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: '10px', color: t.accent, letterSpacing: '0.12em' }}>📝 BRIEFING</div>
      <div style={{ background: 'rgba(0,0,0,0.35)', padding: '24px' }}>
        {data.heading && (
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#e8e8e8', marginBottom: '12px', lineHeight: 1.4 }}>{data.heading}</div>
        )}
        <div style={{ fontSize: '14px', lineHeight: '1.85', color: '#ccc', whiteSpace: 'pre-wrap' }}>
          {data.content || data.text || data.body || '(contenu vide)'}
        </div>
      </div>
    </div>
  )
}

function BlockRenderer({ block, t, onBlockDone }) {
  const { type, ...data } = block
  const props = { data, t, onBlockDone }
  switch (type) {
    case 'email':    return <EmailBlock {...props} />
    case 'photo':    return <PhotoBlock {...props} />
    case 'quiz':     return <QuizBlock {...props} />
    case 'decision': return <DecisionBlock {...props} />
    case 'puzzle':   return <PuzzleBlock {...props} />
    case 'video':    return <VideoBlock {...props} />
    case 'text':     return <TextBlock {...props} />
    default: return <div style={{ background: 'var(--bg-card)', border: `1px dashed var(--border)`, padding: '16px 20px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', borderRadius: 'var(--r-md)' }}>[BLOC "{type}" — APERÇU NON DISPONIBLE]</div>
  }
}

// ─── Intro Screen ─────────────────────────────────────────────────────────────

function IntroScreen({ t, scenario, blocks, lang, onStart, onBack, isAdmin, adminPanel, muted, onToggleMute }) {
  const title = lang === 'fr' ? scenario?.title_fr : (scenario?.title_en || scenario?.title_fr)
  const diffColor = { beginner: '#22c55e', intermediate: '#38bdf8', advanced: '#f59e0b' }[scenario?.difficulty] || 'var(--text-muted)'
  const diffLabelObj = {
    beginner:     { fr: 'DÉBUTANT',      en: 'BEGINNER'     },
    intermediate: { fr: 'INTERMÉDIAIRE', en: 'INTERMEDIATE' },
    advanced:     { fr: 'AVANCÉ',        en: 'ADVANCED'     },
  }[scenario?.difficulty]
  const diffLabel = diffLabelObj ? diffLabelObj[lang] || diffLabelObj.fr : (scenario?.difficulty?.toUpperCase() || '')
  const hasAudio = !!(scenario?.audio_url || scenario?.audioUrl)
  const accent = t.accent

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', zIndex: 200,
      background: 'var(--bg)', color: 'var(--text)',
      animation: 'fade-in 0.5s ease',
      overflow: 'hidden',
    }}>
      <div className="aurora-bg" style={{ opacity: 0.55 }} />
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.35 }} />

      {/* Sticky nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BrandLogo height={32} />
          <div className="tag tag-aurora">
            <span className="status-dot violet" /> {lang === 'en' ? 'Mission briefing' : 'Briefing de mission'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onToggleMute}
            title={muted ? (lang === 'en' ? 'Enable sound' : 'Activer le son') : (lang === 'en' ? 'Mute sound' : 'Couper le son')}
            aria-label={muted ? 'Enable sound' : 'Mute sound'}
            style={{
              padding: '9px 14px',
              background: muted ? 'color-mix(in srgb, var(--red) 12%, transparent)' : 'var(--bg-card)',
              border: `1px solid ${muted ? 'var(--red)' : 'var(--border)'}`,
              color: muted ? 'var(--red)' : 'var(--text-secondary)',
              borderRadius: 'var(--r-full)',
              fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s var(--ease)',
            }}
          >
            <span style={{ fontSize: '14px' }}>{muted ? '🔇' : '🔊'}</span>
            {hasAudio ? (muted ? 'OFF' : 'ON') : (lang === 'en' ? 'NO AUDIO' : 'AUCUN AUDIO')}
          </button>
          <LangToggle />
          <ThemeToggle />
          <button onClick={onBack} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
            ← {lang === 'en' ? 'Back' : 'Retour'}
          </button>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, padding: '56px 32px 80px', maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ animation: 'slide-up 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
          {/* Hero card */}
          <div className="card-glass" style={{
            padding: '40px',
            borderRadius: 'var(--r-2xl)',
            position: 'relative', overflow: 'hidden',
            marginBottom: '28px',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: `linear-gradient(90deg, ${accent}, transparent)`,
            }} />

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontFamily: 'var(--mono)', fontSize: '11px',
              color: accent, letterSpacing: '0.18em', fontWeight: 700,
              padding: '6px 14px',
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              border: `1px solid ${accent}`,
              borderRadius: 'var(--r-full)', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              {t.env}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.025em', lineHeight: 1.08,
              margin: '0 0 16px',
            }}>
              {title || 'MISSION'}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {scenario?.category && (
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
                  color: accent, letterSpacing: '0.12em',
                  padding: '5px 12px',
                  background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                  border: `1px solid ${accent}`,
                  borderRadius: 'var(--r-full)',
                  textTransform: 'uppercase',
                }}>
                  {scenario.category}
                </span>
              )}
              {scenario?.difficulty && (
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
                  color: diffColor, letterSpacing: '0.12em',
                  padding: '5px 12px',
                  background: `color-mix(in srgb, ${diffColor} 12%, transparent)`,
                  border: `1px solid ${diffColor}`,
                  borderRadius: 'var(--r-full)',
                  textTransform: 'uppercase',
                }}>
                  {diffLabel}
                </span>
              )}
              {scenario?.duration && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  ⏱ {scenario.duration} MIN
                </span>
              )}
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                🎬 {blocks.length} {lang === 'en' ? `CHAPTER${blocks.length > 1 ? 'S' : ''}` : `CHAPITRE${blocks.length > 1 ? 'S' : ''}`}
              </span>
            </div>

            {scenario?.description && (
              <div style={{
                fontSize: '15px', lineHeight: 1.7,
                color: 'var(--text-secondary)',
                borderLeft: `3px solid ${accent}`,
                paddingLeft: '18px',
                fontStyle: 'italic',
              }}>
                {scenario.description}
              </div>
            )}
          </div>

          {/* Chapters list */}
          {blocks.length > 0 && (
            <div className="card-glass" style={{ padding: '28px', borderRadius: 'var(--r-xl)', marginBottom: '28px' }}>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                color: 'var(--text-muted)', letterSpacing: '0.18em',
                fontWeight: 700, textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                {lang === 'en' ? 'Chapters' : 'Chapitres'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {blocks.map((b, i) => {
                  const m = getBlockMeta(b)
                  return (
                    <div key={b.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderLeft: `3px solid ${accent}`,
                      borderRadius: 'var(--r-md)',
                      transition: 'all 0.2s var(--ease)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: '11px',
                        color: accent, fontWeight: 700, minWidth: '28px',
                        letterSpacing: '0.05em',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <IconNode icon={m.icon} size={20} />
                      <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{m.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* START button */}
          <button
            onClick={onStart}
            className="btn-primary"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%',
              padding: '22px',
              fontSize: '15px', fontWeight: 800, letterSpacing: '0.18em',
              borderRadius: 'var(--r-xl)',
              textTransform: 'uppercase',
            }}
          >
            ▶ {lang === 'en' ? 'Launch the mission' : 'Lancer la mission'}
          </button>

          {/* Admin panel (only before starting) */}
          {isAdmin && adminPanel}
        </div>
      </div>
    </div>
  )
}

// ─── Chapter Intro Card (overlay) ─────────────────────────────────────────────

function ChapterCard({ t, index, total, meta }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 350,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
      animation: 'fade-in 0.35s ease',
      pointerEvents: 'auto',
    }}>
      <div style={{ textAlign: 'center', animation: 'chapter-zoom 0.9s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 'clamp(11px, 1.5vw, 14px)', color: t.accent,
          letterSpacing: '0.35em', marginBottom: '24px', opacity: 0.85,
        }}>
          CHAPITRE {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
        <div style={{ marginBottom: '16px', filter: `drop-shadow(0 0 30px ${t.accent})` }}>
          <IconNode icon={meta.icon} size={120} />
        </div>
        <div style={{
          fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 900, color: '#e8e8e8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          textShadow: `0 0 40px ${t.accent}`,
        }}>
          {meta.label}
        </div>
        <div style={{
          marginTop: '24px', width: '80px', height: '2px',
          background: t.accent, margin: '24px auto 0',
          boxShadow: `0 0 20px ${t.accent}`,
          animation: 'big-pulse 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  )
}

// ─── Game HUD ─────────────────────────────────────────────────────────────────

function GameHUD({ t, timer, current, total, onExit, muted, onToggleMute, lang }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 250,
      padding: '16px 32px',
      background: 'var(--glass-bg-strong)',
      backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      animation: 'slide-down 0.4s ease',
    }}>
      {/* Left: exit + chapter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={onExit} className="btn-secondary" style={{ padding: '9px 16px', fontSize: '12px', fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.08em' }}>
          ✕ {lang === 'en' ? 'QUIT' : 'QUITTER'}
        </button>

        <div style={{ fontFamily: 'var(--mono)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
            {lang === 'en' ? 'Chapter' : 'Chapitre'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: t.accent, letterSpacing: '0.08em' }}>
            {String(current + 1).padStart(2, '0')} <span style={{ color: 'var(--text-muted)' }}>/</span> {String(total).padStart(2, '0')}
          </div>
        </div>

        {/* Chapter dots */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === current ? '22px' : '8px', height: '4px',
              background: i <= current ? t.accent : 'var(--border)',
              borderRadius: 'var(--r-full)', transition: 'all 0.4s',
              boxShadow: i === current ? `0 0 10px ${t.accent}` : 'none',
            }} />
          ))}
        </div>
      </div>

      {/* Right: sound toggle + timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--mono)' }}>
        <button
          onClick={onToggleMute}
          title={muted ? (lang === 'en' ? 'Enable sound' : 'Activer le son') : (lang === 'en' ? 'Mute sound' : 'Couper le son')}
          aria-label={muted ? 'Enable sound' : 'Mute sound'}
          style={{
            padding: '9px 14px',
            background: muted ? 'color-mix(in srgb, var(--red) 12%, transparent)' : 'var(--bg-card)',
            border: `1px solid ${muted ? 'var(--red)' : 'var(--border)'}`,
            color: muted ? 'var(--red)' : 'var(--text-secondary)',
            borderRadius: 'var(--r-full)',
            fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s var(--ease)',
          }}
        >
          <span style={{ fontSize: '14px' }}>{muted ? '🔇' : '🔊'}</span>
          <span>{muted ? 'OFF' : 'ON'}</span>
        </button>

        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}>
          {lang === 'en' ? 'Time' : 'Temps'}
        </div>
        <div style={{
          fontFamily: 'var(--font-title)',
          fontSize: '26px', fontWeight: 800, letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
          color: timer.urgent ? 'var(--red)' : t.accent,
          animation: timer.urgent ? 'blink-urgent 1s steps(1) infinite' : 'none',
        }}>
          {timer.display}
        </div>
      </div>
    </div>
  )
}

// ─── Complete Screen ──────────────────────────────────────────────────────────

function CompleteScreen({ t, scenario, lang, timer, onBack, onRestart }) {
  const accent = t.accent
  return (
    <div style={{
      position: 'relative', minHeight: '100vh', zIndex: 400,
      background: 'var(--bg)', color: 'var(--text)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fade-in 0.5s ease', padding: '40px',
      overflow: 'hidden',
    }}>
      <div className="aurora-bg" style={{ opacity: 0.6 }} />
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />

      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10, display: 'flex', gap: '10px' }}>
        <LangToggle />
        <ThemeToggle />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', width: '100%', animation: 'slide-up 0.7s cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="card-glass" style={{
          padding: '48px',
          borderRadius: 'var(--r-2xl)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
          }} />

          <div style={{
            width: '110px', height: '110px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            fontSize: '54px', color: 'var(--white)',
            boxShadow: '0 16px 50px rgba(16,185,129,0.45)',
            animation: 'big-pulse 2.4s ease-in-out infinite',
          }}>✓</div>

          <div style={{
            fontFamily: 'var(--mono)', fontSize: '11px',
            color: '#10b981', letterSpacing: '0.22em', fontWeight: 700,
            textTransform: 'uppercase', marginBottom: '14px',
          }}>
            {lang === 'en' ? 'Mission accomplished' : 'Mission accomplie'}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.025em', lineHeight: 1.15,
            marginBottom: '32px',
          }}>
            {lang === 'fr' ? (scenario?.title_fr || 'Terminé') : (scenario?.title_en || 'Complete')}
          </h1>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
            marginBottom: '32px',
          }}>
            <div style={{
              padding: '20px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'en' ? 'Time' : 'Temps'}
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', fontWeight: 800, color: accent, letterSpacing: '-0.02em' }}>
                {timer.display}
              </div>
            </div>
            <div style={{
              padding: '20px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                {lang === 'en' ? 'Status' : 'Statut'}
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '32px', fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>
                ✓ OK
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onRestart} className="btn-secondary" style={{ padding: '13px 28px', fontSize: '13px' }}>
              ↻ {lang === 'en' ? 'Replay' : 'Rejouer'}
            </button>
            <button onClick={onBack} className="btn-primary" style={{ padding: '13px 28px', fontSize: '13px' }}>
              {lang === 'en' ? 'Dashboard →' : 'Tableau de bord →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ScenarioPreview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang, t: tr } = useLang()

  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [phase, setPhase] = useState('intro')        // 'intro' | 'playing' | 'complete'
  const [current, setCurrent] = useState(0)
  const [showChapterCard, setShowChapterCard] = useState(false)
  const [hackErrorActive, setHackErrorActive] = useState(false)
  const [linkWarnActive, setLinkWarnActive] = useState(false)
  const [blockDone, setBlockDone] = useState(false)
  const contentRef = useRef(null)

  // Interactive block types that require the player to finish an action
  // before the CONTINUER button can be clicked.
  const INTERACTIVE_TYPES = ['quiz', 'decision', 'photo', 'puzzle']

  // Listen for global error events — fires hacking glitch overlay on any error.
  // Multiple errors fired in quick succession (≤300 ms) are coalesced into a
  // single overlay so the player sees one continuous warning instead of two.
  useEffect(() => {
    let timer = null
    let lastFire = 0
    const onErr = () => {
      const now = Date.now()
      if (now - lastFire < 300 && timer) {
        // Already showing — keep current timer running, don't stack a 2nd overlay.
        return
      }
      lastFire = now
      setHackErrorActive(true)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        setHackErrorActive(false)
        timer = null
      }, 1800)
    }
    window.addEventListener(HACK_ERROR_EVT, onErr)
    return () => {
      window.removeEventListener(HACK_ERROR_EVT, onErr)
      if (timer) clearTimeout(timer)
    }
  }, [])

  // Listen for link-click warnings — player must close the overlay manually.
  useEffect(() => {
    const onWarn = () => setLinkWarnActive(true)
    window.addEventListener(LINK_WARN_EVT, onWarn)
    return () => window.removeEventListener(LINK_WARN_EVT, onWarn)
  }, [])

  // Admin state
  const [toast, setToast] = useState(null)
  const [assignOpen, setAssignOpen] = useState(false)

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN
  const isAdmin = user?.role === ROLES.ADMIN || isSuperAdmin

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    setLoading(true)
    fetch(`/api/scenarios/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => { setScenario(data); setLoading(false) })
      .catch(err => { setError(String(err)); setLoading(false) })
  }, [id])

  // Inject keyframes once
  useEffect(() => {
    if (document.getElementById('escape-kf')) return
    const s = document.createElement('style'); s.id = 'escape-kf'; s.textContent = CSS_KEYFRAMES
    document.head.appendChild(s)
  }, [])

  const theme = getTheme(scenario)
  const t = THEMES[theme]
  const timer = useTimer(scenario?.duration || 15)
  const blocks = scenario?.blocks || []

  // Reset the block-done gate whenever the chapter changes. Passive content
  // (text / email / video) is "done" on arrival; interactive blocks must be
  // finished by the player before CONTINUER unlocks.
  useEffect(() => {
    const type = blocks[current]?.type
    if (!type) { setBlockDone(false); return }
    setBlockDone(!INTERACTIVE_TYPES.includes(type))
  }, [current, blocks])

  // Audio manager — always called (Rules of Hooks). Exposes start/stop called
  // from the click handlers to bypass the browser autoplay policy.
  const audioRawBlock = blocks[current] || null
  const audio = useScenarioAudio({
    scenario,
    block: audioRawBlock,
    active: phase === 'playing' && !!scenario,
  })

  const triggerChapterCard = (idx) => {
    setCurrent(idx)
    setShowChapterCard(true)
    playChapter()
    setTimeout(() => contentRef.current?.scrollTo({ top: 0, behavior: 'auto' }), 20)
    setTimeout(() => setShowChapterCard(false), 1600)
  }

  const startGame = () => {
    unlockSFX()           // unlock Web Audio on user gesture (for SFX)
    audio.start()         // start scenario ambient music (user gesture)
    playClick()
    setPhase('playing')
    triggerChapterCard(0)
  }

  const advance = () => {
    const next = current + 1
    if (next >= blocks.length) {
      timer.stop()
      playVictory()
      setPhase('complete')
      return
    }
    playClick()
    triggerChapterCard(next)
  }

  const restart = () => {
    playClick()
    setCurrent(0)
    setPhase('intro')
    setShowChapterCard(false)
  }

  const handleAssignSuccess = ({ count, mode }) => {
    const target = mode === 'companies'
      ? (count > 1 ? `${count} entreprises` : 'entreprise')
      : (count > 1 ? `${count} groupes` : 'groupe')
    showToast(lang === 'fr' ? `Scénario assigné à ${target} !` : `Scenario assigned to ${count} ${mode}!`)
  }

  // ── Render: loading / error ──

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>⌛</div>
        <div style={{ fontSize: '12px', letterSpacing: '0.2em' }}>CHARGEMENT...</div>
      </div>
    </div>
  )

  if (error || !scenario) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#eb2828' }}>Scénario introuvable</div>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 20px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '12px' }}>← Retour</button>
    </div>
  )

  const interpCtx = buildInterpolationContext(user)
  const rawBlock = blocks[current]
  const block = rawBlock ? interpolateBlock(rawBlock, interpCtx) : null
  const meta = block ? getBlockMeta(block) : { icon: '▪', label: '', action: 'Continuer' }
  const interpolatedScenario = scenario ? {
    ...scenario,
    title_fr: interpolateString(scenario.title_fr, interpCtx),
    title_en: interpolateString(scenario.title_en, interpCtx),
    description: interpolateString(scenario.description, interpCtx),
  } : scenario

  // Admin panel (used only on intro screen) — opens the shared AssignModal
  const adminPanelNode = isAdmin ? (
    <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
      <button
        onClick={() => { playClick(); setAssignOpen(true) }}
        className="btn-secondary"
        style={{
          padding: '13px 28px',
          fontSize: '13px',
          fontWeight: 700,
          borderRadius: 'var(--r-full)',
          letterSpacing: '0.04em',
        }}
      >
        ＋ {isSuperAdmin
          ? (lang === 'en' ? 'Assign to companies' : 'Assigner à des entreprises')
          : (lang === 'en' ? 'Assign to groups'    : 'Assigner à des groupes')}
      </button>
    </div>
  ) : null

  return (
    <div className="scenario-preview-page" style={{ minHeight: '100vh', color: 'var(--text)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Aurora background (shared across all phases) */}
      {phase === 'playing' && (
        <>
          <div className="aurora-bg" style={{ opacity: 0.45 }} />
          <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.3 }} />
          {theme === 'ransomware' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`, opacity: 0.6, animation: 'scanline-move 4s linear infinite', zIndex: 10, pointerEvents: 'none' }} />
          )}
        </>
      )}

      {/* Global hacking error overlay — fires on any wrong answer */}
      {hackErrorActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none' }}>
          <HackingOverlay t={t} tr={tr} />
        </div>
      )}

      {/* Link-click security lesson overlay — player closes with × */}
      {linkWarnActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 510 }}>
          <LinkWarningOverlay t={t} tr={tr} onClose={() => setLinkWarnActive(false)} />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9999, background: toast.type === 'error' ? '#1a0a0a' : '#0a1a0a', border: `1px solid ${toast.type === 'error' ? '#eb2828' : '#22c55e'}`, color: toast.type === 'error' ? '#eb2828' : '#22c55e', padding: '12px 20px', fontFamily: 'var(--mono)', fontSize: '12px', borderRadius: '4px' }}>
          {toast.msg}
        </div>
      )}

      {/* ── PHASE: INTRO ── */}
      {phase === 'intro' && (
        <IntroScreen
          t={t} scenario={interpolatedScenario} blocks={blocks.map(b => interpolateBlock(b, interpCtx))} lang={lang}
          onStart={startGame} onBack={() => navigate(-1)}
          isAdmin={isAdmin} adminPanel={adminPanelNode}
          muted={audio.muted}
          onToggleMute={() => { audio.setMuted(!audio.muted); playClick() }}
        />
      )}

      {/* ── PHASE: COMPLETE ── */}
      {phase === 'complete' && (
        <CompleteScreen t={t} scenario={interpolatedScenario} lang={lang} timer={timer} onBack={() => navigate(-1)} onRestart={restart} />
      )}

      {/* ── PHASE: PLAYING ── */}
      {phase === 'playing' && (
        <>
          <GameHUD
            t={t} timer={timer} current={current} total={blocks.length}
            lang={lang}
            onExit={() => navigate(-1)}
            muted={audio.muted}
            onToggleMute={() => { audio.setMuted(!audio.muted); playClick() }}
          />

          {showChapterCard && <ChapterCard t={t} index={current} total={blocks.length} meta={meta} />}

          <div ref={contentRef} style={{
            position: 'relative', zIndex: 10,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '48px 32px 80px',
          }}>
            {block ? (
              <div key={`block-${current}`} style={{ width: '100%', maxWidth: '920px', animation: 'block-enter 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>

                {/* Chapter label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', justifyContent: 'center' }}>
                  <div style={{ filter: `drop-shadow(0 0 14px ${t.accent})` }}><IconNode icon={meta.icon} size={36} /></div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700, color: t.accent, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                      {lang === 'en' ? 'Chapter' : 'Chapitre'} {String(current + 1).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.015em', marginTop: '4px' }}>
                      {meta.label}
                    </div>
                  </div>
                </div>

                {/* Virtual PC wrapper — every block is an app inside a computer */}
                <VirtualPC t={t} blockType={block.type}>
                  <BlockRenderer block={block} t={t} onBlockDone={() => setBlockDone(true)} />
                </VirtualPC>

                {/* Continue button — disabled until the current block is finished */}
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <button
                    onClick={blockDone ? advance : undefined}
                    disabled={!blockDone}
                    className="btn-primary"
                    style={{
                      padding: '16px 56px',
                      fontSize: '13px', fontWeight: 800, letterSpacing: '0.18em',
                      borderRadius: 'var(--r-full)',
                      textTransform: 'uppercase',
                      opacity: blockDone ? 1 : 0.45,
                      cursor: blockDone ? 'pointer' : 'not-allowed',
                      pointerEvents: blockDone ? 'auto' : 'none',
                    }}
                  >
                    {current < blocks.length - 1
                      ? (lang === 'en' ? 'Continue →' : 'Continuer →')
                      : (lang === 'en' ? '✓ Finish mission' : '✓ Terminer la mission')}
                  </button>
                  {!blockDone && (
                    <div style={{
                      marginTop: '12px',
                      fontFamily: 'var(--mono)', fontSize: '11px',
                      color: 'var(--text-muted)', letterSpacing: '0.08em',
                    }}>
                      {lang === 'en' ? 'Finish this chapter to unlock' : 'Terminez ce chapitre pour débloquer'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px' }}>
                {lang === 'fr' ? 'Ce scénario ne contient aucun bloc.' : 'This scenario has no blocks.'}
              </div>
            )}
          </div>
        </>
      )}

      <AssignModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        scenario={scenario}
        onSuccess={handleAssignSuccess}
      />
    </div>
  )
}
