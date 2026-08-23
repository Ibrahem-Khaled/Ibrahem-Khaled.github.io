/* ── BUG WARS · tuning & configuration ── */

export const ARENA_RADIUS = 36
export const PLAYER_EYE = 1.65
export const PLAYER_RADIUS = 0.6
export const GRAVITY = 22
export const JUMP_V = 7.5
export const WALK_SPEED = 9
export const SPRINT_MULT = 1.45
export const ACCEL = 90
export const FRICTION = 10

/* ── Weapons ── */
export const MAG_SIZE = 14
export const FIRE_INTERVAL = 0.16
export const RELOAD_TIME = 1.05
export const PISTOL_DAMAGE = 34
export const RANGE = 120
export const GRENADE_COUNT_START = 3
export const GRENADE_MAX = 4
export const GRENADE_CD = 1.2
export const GRENADE_DAMAGE = 130
export const GRENADE_RADIUS = 5.2
export const GRENADE_FUSE = 1.35

/* ── Combo ── */
export const COMBO_WINDOW = 2.6
export const COMBO_MAX_MULT = 5

/* ── Buffs ── */
export const COFFEE_TIME = 8
export const COFFEE_FIRE_MULT = 0.62
export const COFFEE_SPEED_MULT = 1.28
export const HEALTH_PACK_AMOUNT = 30

/* ── Waves ── */
export const INTERMISSION_TIME = 3.5
export const BOSS_EVERY = 5
export const MAX_BUGS = 56

export type BugKind = 'syntax' | 'nullop' | 'leak' | 'race' | 'legacy'

export interface BugConfig {
  name: string
  hp: number
  speed: number
  radius: number
  damage: number
  score: number
  color: string
  emissive: string
  flying: boolean
}

export const BUGS: Record<BugKind, BugConfig> = {
  syntax: {
    name: 'SyntaxError',
    hp: 68,
    speed: 4.4,
    radius: 0.62,
    damage: 9,
    score: 100,
    color: '#ff4d5e',
    emissive: '#ff2233',
    flying: false,
  },
  nullop: {
    name: 'NullPointer',
    hp: 40,
    speed: 8.2,
    radius: 0.5,
    damage: 7,
    score: 160,
    color: '#38e1ff',
    emissive: '#00cfff',
    flying: true,
  },
  leak: {
    name: 'MemoryLeak',
    hp: 240,
    speed: 2.6,
    radius: 0.95,
    damage: 18,
    score: 320,
    color: '#c26bff',
    emissive: '#a020f0',
    flying: false,
  },
  race: {
    name: 'RaceCondition',
    hp: 80,
    speed: 5.6,
    radius: 0.58,
    damage: 11,
    score: 220,
    color: '#ffb347',
    emissive: '#ff9500',
    flying: false,
  },
  legacy: {
    name: 'LEGACY_CODE',
    hp: 2600,
    speed: 3.1,
    radius: 2.1,
    damage: 32,
    score: 2500,
    color: '#8affa0',
    emissive: '#39ff6e',
    flying: false,
  },
}

/** Wave composition: returns list of kinds to spawn */
export function waveRoster(wave: number): BugKind[] {
  const roster: BugKind[] = []
  const grunts = 4 + Math.floor(wave * 1.8)

  for (let i = 0; i < grunts; i++) roster.push('syntax')
  if (wave >= 2) for (let i = 0; i < Math.floor(wave / 2); i++) roster.push('nullop')
  if (wave >= 3) for (let i = 0; i < Math.floor((wave - 1) / 2); i++) roster.push('race')
  if (wave >= 4) for (let i = 0; i < Math.floor((wave - 2) / 2); i++) roster.push('leak')

  /* shuffle */
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[roster[i], roster[j]] = [roster[j], roster[i]]
  }

  if (wave % BOSS_EVERY === 0) roster.push('legacy')
  return roster
}

export function waveSpeedMult(wave: number): number {
  return 1 + Math.min(0.85, (wave - 1) * 0.055)
}

export const BEST_KEY = 'bugwars_best_v1'
