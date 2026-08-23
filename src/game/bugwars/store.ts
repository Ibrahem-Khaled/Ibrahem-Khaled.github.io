/* ── BUG WARS · reactive UI state (zustand) ──
   Only discrete events flow through here; per-frame data lives in world.ts */

import { create } from 'zustand'
import { BEST_KEY, GRENADE_COUNT_START, MAG_SIZE } from './constants'
export type Phase = 'menu' | 'playing' | 'paused' | 'over'

export interface Banner {
  title: string
  sub?: string
  tone: 'wave' | 'boss' | 'clear' | 'buff'
}

interface BugWarsState {
  phase: Phase
  hp: number
  maxHp: number
  score: number
  best: number
  kills: number
  wave: number
  intermission: number /* ceil'd seconds, -1 = none */
  bugsLeft: number
  ammo: number
  magSize: number
  reloading: boolean
  grenades: number
  comboMult: number
  coffeeT: number /* ceil'd seconds, -1 = none */
  banner: Banner | null
  hitAt: number
  hurtAt: number
  killAt: number
  muted: boolean
  bossHp: number | null

  setPhase: (p: Phase) => void
  setHp: (hp: number) => void
  setScore: (s: number, kills: number, mult: number) => void
  setWave: (w: number) => void
  setIntermission: (s: number) => void
  setBugsLeft: (n: number) => void
  setAmmo: (a: number, reloading: boolean) => void
  setGrenades: (n: number) => void
  setCombo: (m: number) => void
  setCoffee: (t: number) => void
  showBanner: (b: Banner | null) => void
  registerHit: () => void
  registerHurt: () => void
  commitBest: (score: number) => boolean
  toggleMute: () => void
  setBoss: (frac: number | null) => void
  resetHud: () => void
}

const INITIAL = {
  hp: 100,
  maxHp: 100,
  score: 0,
  kills: 0,
  wave: 0,
  intermission: -1,
  bugsLeft: 0,
  ammo: MAG_SIZE,
  magSize: MAG_SIZE,
  reloading: false,
  grenades: GRENADE_COUNT_START,
  comboMult: 1,
  coffeeT: -1,
  banner: null as Banner | null,
  bossHp: null as number | null,
}

export const useGame = create<BugWarsState>((set, get) => ({
  ...INITIAL,
  best: Number(localStorage.getItem(BEST_KEY) ?? 0),
  hitAt: 0,
  hurtAt: 0,
  killAt: 0,
  muted: false,
  phase: 'menu',

  setPhase: (phase) => set({ phase }),
  setHp: (hp) => {
    if (get().hp !== hp) set({ hp })
  },
  setScore: (score, kills, comboMult) => {
    const s = get()
    if (s.score !== score || s.kills !== kills || s.comboMult !== comboMult)
      set({ score, kills, comboMult, killAt: performance.now() })
  },
  setWave: (wave) => {
    if (get().wave !== wave) set({ wave })
  },
  setIntermission: (intermission) => {
    if (get().intermission !== intermission) set({ intermission })
  },
  setBugsLeft: (bugsLeft) => {
    if (get().bugsLeft !== bugsLeft) set({ bugsLeft })
  },
  setAmmo: (ammo, reloading) => {
    const s = get()
    if (s.ammo !== ammo || s.reloading !== reloading) set({ ammo, reloading })
  },
  setGrenades: (grenades) => {
    if (get().grenades !== grenades) set({ grenades })
  },
  setCombo: (comboMult) => {
    if (get().comboMult !== comboMult) set({ comboMult })
  },
  setCoffee: (coffeeT) => {
    if (get().coffeeT !== coffeeT) set({ coffeeT })
  },
  showBanner: (banner) => set({ banner }),
  registerHit: () => set({ hitAt: performance.now() }),
  registerHurt: () => set({ hurtAt: performance.now() }),
  commitBest: (score) => {
    if (score > get().best) {
      localStorage.setItem(BEST_KEY, String(score))
      set({ best: score })
      return true
    }
    return false
  },
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setBoss: (bossHp) => {
    if (get().bossHp !== bossHp) set({ bossHp })
  },
  resetHud: () =>
    set((s) => ({
      ...INITIAL,
      best: s.best,
      muted: s.muted,
      hitAt: s.hitAt,
      hurtAt: s.hurtAt,
      killAt: s.killAt,
      phase: s.phase,
    })),
}))
