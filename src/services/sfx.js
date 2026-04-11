// ROOMCA — Synthesized sound effects via Web Audio API
// Zero file dependencies, unlocks on first user gesture, respects volume preference.

let ctx = null
let masterGain = null
let enabled = true
let unlocked = false

function getCtx() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      ctx = new AC()
      masterGain = ctx.createGain()
      masterGain.gain.value = 0.45
      masterGain.connect(ctx.destination)
    } catch {
      ctx = null
    }
  }
  return ctx
}

// Unlock audio context (browsers require user gesture)
export function unlockSFX() {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => {})
  unlocked = true
}

export function setSFXEnabled(v) { enabled = !!v }
export function setSFXVolume(v) { if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v)) }
export function isSFXUnlocked() { return unlocked }

// ─── Tone helper ─────────────────────────────────────────────────────────────

function tone({ freq, type = 'sine', duration = 0.15, attack = 0.005, release = 0.08, gain = 0.3, detune = 0, delay = 0 }) {
  const c = getCtx()
  if (!c || !enabled) return
  const now = c.currentTime + delay
  const osc = c.createOscillator()
  const env = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  if (detune) osc.detune.value = detune
  env.gain.setValueAtTime(0, now)
  env.gain.linearRampToValueAtTime(gain, now + attack)
  env.gain.linearRampToValueAtTime(gain, now + duration - release)
  env.gain.linearRampToValueAtTime(0, now + duration)
  osc.connect(env)
  env.connect(masterGain)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

function noise({ duration = 0.1, gain = 0.2, filterFreq = 2000, delay = 0 }) {
  const c = getCtx()
  if (!c || !enabled) return
  const now = c.currentTime + delay
  const bufSize = c.sampleRate * duration
  const buf = c.createBuffer(1, bufSize, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = filterFreq
  filter.Q.value = 1
  const env = c.createGain()
  env.gain.setValueAtTime(0, now)
  env.gain.linearRampToValueAtTime(gain, now + 0.005)
  env.gain.linearRampToValueAtTime(0, now + duration)
  src.connect(filter)
  filter.connect(env)
  env.connect(masterGain)
  src.start(now)
  src.stop(now + duration + 0.02)
}

// ─── Public SFX ──────────────────────────────────────────────────────────────

// Positive feedback — ascending two-note chime (C5 → E5)
export function playSuccess() {
  tone({ freq: 523.25, type: 'sine', duration: 0.12, gain: 0.25 })                    // C5
  tone({ freq: 659.25, type: 'sine', duration: 0.16, gain: 0.28, delay: 0.08 })       // E5
  tone({ freq: 783.99, type: 'sine', duration: 0.20, gain: 0.22, delay: 0.18 })       // G5
}

// Negative feedback — descending buzz (A4 → F4)
export function playError() {
  tone({ freq: 440, type: 'square', duration: 0.18, gain: 0.15 })
  tone({ freq: 349.23, type: 'square', duration: 0.22, gain: 0.13, delay: 0.10 })
  noise({ duration: 0.12, gain: 0.04, filterFreq: 800, delay: 0.02 })
}

// Subtle tick for UI clicks
export function playClick() {
  tone({ freq: 1200, type: 'sine', duration: 0.04, attack: 0.001, release: 0.03, gain: 0.12 })
}

// Score popup — quick bright chirp
export function playScore() {
  tone({ freq: 880, type: 'triangle', duration: 0.08, gain: 0.22 })
  tone({ freq: 1320, type: 'triangle', duration: 0.10, gain: 0.18, delay: 0.05 })
}

// Mission complete — fanfare (C major triad + octave)
export function playVictory() {
  tone({ freq: 523.25, type: 'triangle', duration: 0.25, gain: 0.28 })
  tone({ freq: 659.25, type: 'triangle', duration: 0.25, gain: 0.28, delay: 0.10 })
  tone({ freq: 783.99, type: 'triangle', duration: 0.30, gain: 0.28, delay: 0.20 })
  tone({ freq: 1046.50, type: 'triangle', duration: 0.45, gain: 0.26, delay: 0.32 })
}

// Chapter start — low thump + high ping
export function playChapter() {
  tone({ freq: 110, type: 'sine', duration: 0.18, gain: 0.3 })
  tone({ freq: 880, type: 'sine', duration: 0.10, gain: 0.18, delay: 0.04 })
}

// Warning / danger (used when clicking phishing link)
export function playWarning() {
  for (let i = 0; i < 3; i++) {
    tone({ freq: 660, type: 'square', duration: 0.08, gain: 0.16, delay: i * 0.12 })
    tone({ freq: 440, type: 'square', duration: 0.08, gain: 0.16, delay: i * 0.12 + 0.06 })
  }
}
