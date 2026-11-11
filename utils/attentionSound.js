// A chime that says "look at the screen" — played when a scan did NOT end in an
// instant cart add (product not found, or the pick-a-product modal opened).
// Cashiers scan without looking, so it is deliberately an attention chime
// (rising-falling three notes), not an error buzz. Synthesised in the browser:
// no audio file to ship or cache, and it works offline.
//
// Browsers (Safari most of all) only let a page make sound after a real tap or
// click, so two independent paths are primed on the first gesture of the session:
//   1. Web Audio (preferred) — the context is resumed and a silent buffer is
//      started inside the gesture, which is what Safari wants;
//   2. an <audio> element playing the same chime as a WAV — used when the
//      context is still suspended, because an element that has been played once
//      inside a gesture may be played again from code.
const NOTES = [
  { freq: 880, at: 0, len: 0.16 },
  { freq: 1175, at: 0.18, len: 0.16 },
  { freq: 880, at: 0.36, len: 0.26 },
]
const PEAK_GAIN = 0.6
const SAMPLE_RATE = 22050

let ctx = null
let element = null
let elementPrimed = false

const getContext = () => {
  if (ctx) return ctx
  const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
  if (!AudioCtx) return null
  ctx = new AudioCtx()
  return ctx
}

// The same three notes rendered to a 16-bit mono WAV, for the <audio> fallback.
const buildWavUrl = () => {
  const total = Math.ceil((NOTES[NOTES.length - 1].at + NOTES[NOTES.length - 1].len + 0.05) * SAMPLE_RATE)
  const pcm = new Int16Array(total)
  NOTES.forEach(({ freq, at, len }) => {
    const first = Math.floor(at * SAMPLE_RATE)
    const count = Math.floor(len * SAMPLE_RATE)
    for (let i = 0; i < count && first + i < total; i++) {
      const t = i / SAMPLE_RATE
      const envelope = Math.min(t / 0.02, 1) * Math.max(1 - t / len, 0)
      pcm[first + i] += Math.round(Math.sin(2 * Math.PI * freq * t) * envelope * PEAK_GAIN * 32767)
    }
  })
  const buffer = new ArrayBuffer(44 + pcm.length * 2)
  const view = new DataView(buffer)
  const text = (offset, str) => [...str].forEach((ch, i) => view.setUint8(offset + i, ch.charCodeAt(0)))
  text(0, 'RIFF')
  view.setUint32(4, 36 + pcm.length * 2, true)
  text(8, 'WAVE')
  text(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  text(36, 'data')
  view.setUint32(40, pcm.length * 2, true)
  pcm.forEach((sample, i) => view.setInt16(44 + i * 2, sample, true))
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }))
}

const getElement = () => {
  if (element) return element
  element = new Audio(buildWavUrl())
  element.preload = 'auto'
  return element
}

const unlock = () => {
  try {
    const audio = getContext()
    if (audio) {
      if (audio.state === 'suspended') audio.resume().catch(() => {})
      // a silent one-sample buffer started inside the gesture
      const source = audio.createBufferSource()
      source.buffer = audio.createBuffer(1, 1, SAMPLE_RATE)
      source.connect(audio.destination)
      source.start(0)
    }
    if (!elementPrimed) {
      const el = getElement()
      el.volume = 0
      el.play()
        .then(() => {
          el.pause()
          el.currentTime = 0
          el.volume = 1
          elementPrimed = true
        })
        .catch(() => {
          el.volume = 1
        })
    }
  } catch (e) {
    // ignore
  }
}

// Safari only honours some of these (click/touchend/keyup) as audio gestures
const UNLOCK_EVENTS = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown', 'keyup']
if (typeof window !== 'undefined') {
  UNLOCK_EVENTS.forEach((evt) => window.addEventListener(evt, unlock, { capture: true, passive: true }))
}

const playWithContext = (audio) => {
  const start = audio.currentTime + 0.01
  NOTES.forEach(({ freq, at, len }) => {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    // short attack and release so the notes don't click
    gain.gain.setValueAtTime(0.0001, start + at)
    gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, start + at + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + at + len)
    osc.connect(gain).connect(audio.destination)
    osc.start(start + at)
    osc.stop(start + at + len + 0.02)
  })
}

export const playAttentionSound = () => {
  try {
    const audio = getContext()
    if (audio && audio.state === 'running') {
      playWithContext(audio)
      return
    }
    if (audio) audio.resume().catch(() => {})
    // context not allowed (yet): fall back to the primed <audio> element
    const el = getElement()
    el.currentTime = 0
    el.volume = 1
    el.play().catch(() => {
      console.warn('attention sound: the browser blocked audio — click/tap the POS page once (not the dev tools) so it allows sound')
    })
  } catch (e) {
    // sound is a convenience; a scan must never fail because of it
  }
}
