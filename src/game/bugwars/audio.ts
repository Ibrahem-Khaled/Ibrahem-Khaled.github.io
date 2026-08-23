/* ── BUG WARS · procedural audio engine (zero assets, pure Web Audio) ── */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let sfxBus: GainNode | null = null
let musicBus: GainNode | null = null
let noiseBuf: AudioBuffer | null = null
let muted = false

/* ── music sequencer state ── */
let seqTimer: number | null = null
let nextNoteTime = 0
let step = 0
const BPM = 116
const STEP_TIME = 60 / BPM / 4 /* 16th notes */

export function initAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume()
    return
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.9

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.knee.value = 24
  comp.ratio.value = 6
  comp.attack.value = 0.003
  comp.release.value = 0.22

  master.connect(comp)
  comp.connect(ctx.destination)

  sfxBus = ctx.createGain()
  sfxBus.gain.value = 0.85
  sfxBus.connect(master)

  musicBus = ctx.createGain()
  musicBus.gain.value = 0.34
  musicBus.connect(master)

  /* pre-render white-noise buffer */
  const len = ctx.sampleRate * 1.2
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
}

/** cheap guard used by every sfx entry point */
function ensureAudio() {
  if (!ctx || ctx.state === 'suspended') initAudio()
}

export function setMuted(m: boolean) {
  muted = m
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05)
  }
}

export function isMuted() {
  return muted
}

/* ───────────────────────── helpers ───────────────────────── */

function tone(
  freqStart: number,
  freqEnd: number,
  dur: number,
  opts: { type?: OscillatorType; vol?: number; delay?: number; bus?: GainNode | null } = {},
) {
  if (!ctx || !sfxBus) return
  const t0 = ctx.currentTime + (opts.delay ?? 0)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = opts.type ?? 'square'
  osc.frequency.setValueAtTime(Math.max(20, freqStart), t0)
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + dur)
  const v = (opts.vol ?? 0.5) * (opts.bus ? 1 : 1)
  g.gain.setValueAtTime(v, t0)
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur)
  osc.connect(g)
  g.connect(opts.bus ?? sfxBus)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noise(
  dur: number,
  opts: {
    vol?: number
    delay?: number
    filter?: BiquadFilterType
    from?: number
    to?: number
    q?: number
  } = {},
) {
  if (!ctx || !sfxBus || !noiseBuf) return
  const t0 = ctx.currentTime + (opts.delay ?? 0)
  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  src.loop = true
  const flt = ctx.createBiquadFilter()
  flt.type = opts.filter ?? 'lowpass'
  flt.frequency.setValueAtTime(opts.from ?? 3000, t0)
  flt.frequency.exponentialRampToValueAtTime(Math.max(30, opts.to ?? 200), t0 + dur)
  flt.Q.value = opts.q ?? 0.8
  const g = ctx.createGain()
  g.gain.setValueAtTime(opts.vol ?? 0.5, t0)
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur)
  src.connect(flt)
  flt.connect(g)
  g.connect(sfxBus)
  src.start(t0, Math.random())
  src.stop(t0 + dur + 0.02)
}

/* ───────────────────────── SFX ───────────────────────── */

export const sfx = {
  shoot() {
    ensureAudio()
    tone(880, 160, 0.09, { type: 'square', vol: 0.28 })
    noise(0.07, { vol: 0.32, from: 5200, to: 900 })
  },
  empty() {
    ensureAudio()
    tone(220, 180, 0.05, { type: 'square', vol: 0.18 })
  },
  reload() {
    ensureAudio()
    tone(500, 500, 0.04, { type: 'square', vol: 0.2 })
    tone(700, 700, 0.05, { type: 'square', vol: 0.22, delay: 0.16 })
    tone(950, 900, 0.06, { type: 'triangle', vol: 0.26, delay: 0.55 })
  },
  hit() {
    ensureAudio()
    tone(1500, 1100, 0.045, { type: 'triangle', vol: 0.3 })
  },
  kill() {
    ensureAudio()
    tone(620, 90, 0.22, { type: 'sawtooth', vol: 0.3 })
    noise(0.18, { vol: 0.3, from: 2600, to: 120 })
    tone(1240, 1650, 0.08, { type: 'square', vol: 0.14, delay: 0.03 })
  },
  explode() {
    ensureAudio()
    noise(0.6, { vol: 0.75, from: 1400, to: 45 })
    tone(120, 28, 0.55, { type: 'sine', vol: 0.7 })
    noise(0.25, { vol: 0.4, filter: 'highpass', from: 2400, to: 600 })
  },
  grenadeThrow() {
    ensureAudio()
    noise(0.16, { vol: 0.2, filter: 'bandpass', from: 400, to: 1600, q: 2 })
  },
  hurt() {
    ensureAudio()
    tone(190, 70, 0.24, { type: 'sawtooth', vol: 0.42 })
    noise(0.12, { vol: 0.22, from: 800, to: 150 })
  },
  pickup() {
    ensureAudio()
    tone(660, 660, 0.07, { type: 'square', vol: 0.24 })
    tone(880, 880, 0.07, { type: 'square', vol: 0.24, delay: 0.08 })
    tone(1320, 1320, 0.11, { type: 'square', vol: 0.26, delay: 0.16 })
  },
  coffee() {
    ensureAudio()
    tone(520, 1040, 0.14, { type: 'triangle', vol: 0.3 })
    tone(780, 1560, 0.18, { type: 'triangle', vol: 0.24, delay: 0.1 })
  },
  waveIncoming() {
    ensureAudio()
    ;[196, 262, 330].forEach((f, i) => tone(f, f, 0.14, { type: 'square', vol: 0.26, delay: i * 0.13 }))
    tone(392, 392, 0.3, { type: 'square', vol: 0.3, delay: 0.42 })
  },
  bossIncoming() {
    ensureAudio()
    ;[110, 104, 98].forEach((f, i) => {
      tone(f, f * 0.97, 0.4, { type: 'sawtooth', vol: 0.4, delay: i * 0.35 })
      noise(0.3, { vol: 0.16, from: 500, to: 80, delay: i * 0.35 })
    })
  },
  waveClear() {
    ensureAudio()
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.12, { type: 'square', vol: 0.24, delay: i * 0.09 }))
  },
  gameOver() {
    ensureAudio()
    ;[330, 262, 220, 147].forEach((f, i) => tone(f, f * 0.94, 0.34, { type: 'sawtooth', vol: 0.3, delay: i * 0.26 }))
  },
  uiClick() {
    ensureAudio()
    tone(900, 700, 0.05, { type: 'square', vol: 0.16 })
  },
}

/* ───────────────────── music loop ───────────────────── */
/* dark synthwave-ish bass pulse + sparse arp, scheduled ahead */

const BASS = [0, 0, 12, 0, 0, 10, 0, 7, 0, 0, 12, 0, 5, 0, 7, 10]
const ARP = [24, -1, 19, -1, 24, -1, 22, -1, 24, -1, 19, -1, 17, -1, 15, -1]
const ROOT = 55 /* A1 */

function noteFreq(semi: number) {
  return ROOT * Math.pow(2, semi / 12)
}

function scheduleStep(time: number, s: number) {
  if (!ctx || !musicBus) return

  /* kick on quarters */
  if (s % 4 === 0) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(130, time)
    o.frequency.exponentialRampToValueAtTime(38, time + 0.12)
    g.gain.setValueAtTime(0.85, time)
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.16)
    o.connect(g)
    g.connect(musicBus)
    o.start(time)
    o.stop(time + 0.2)
  }

  /* hat on off-8ths */
  if (noiseBuf && s % 2 === 1) {
    const src = ctx.createBufferSource()
    src.buffer = noiseBuf
    const flt = ctx.createBiquadFilter()
    flt.type = 'highpass'
    flt.frequency.value = 7000
    const g = ctx.createGain()
    g.gain.setValueAtTime(s % 8 === 7 ? 0.14 : 0.07, time)
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
    src.connect(flt)
    flt.connect(g)
    g.connect(musicBus)
    src.start(time, Math.random())
    src.stop(time + 0.08)
  }

  /* bass */
  const bsemi = BASS[s]
  if (bsemi !== undefined) {
    const o = ctx.createOscillator()
    const flt = ctx.createBiquadFilter()
    const g = ctx.createGain()
    o.type = 'sawtooth'
    o.frequency.value = noteFreq(bsemi)
    flt.type = 'lowpass'
    flt.frequency.setValueAtTime(420, time)
    flt.frequency.exponentialRampToValueAtTime(120, time + STEP_TIME * 0.9)
    g.gain.setValueAtTime(0.32, time)
    g.gain.exponentialRampToValueAtTime(0.002, time + STEP_TIME * 1.6)
    o.connect(flt)
    flt.connect(g)
    g.connect(musicBus)
    o.start(time)
    o.stop(time + STEP_TIME * 2)
  }

  /* arp sparkle */
  const asemi = ARP[s]
  if (asemi >= 0 && Math.random() < 0.8) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'square'
    o.frequency.value = noteFreq(asemi + 12)
    g.gain.setValueAtTime(0.06, time)
    g.gain.exponentialRampToValueAtTime(0.001, time + STEP_TIME * 1.2)
    o.connect(g)
    g.connect(musicBus)
    o.start(time)
    o.stop(time + STEP_TIME * 1.5)
  }
}

export function startMusic() {
  ensureAudio()
  if (!ctx || seqTimer !== null) return
  step = 0
  nextNoteTime = ctx.currentTime + 0.08
  seqTimer = window.setInterval(() => {
    if (!ctx) return
    while (nextNoteTime < ctx.currentTime + 0.14) {
      scheduleStep(nextNoteTime, step % 16)
      nextNoteTime += STEP_TIME
      step++
    }
  }, 40)
}

export function stopMusic() {
  if (seqTimer !== null) {
    window.clearInterval(seqTimer)
    seqTimer = null
  }
}
