/* ── BUG WARS · mutable world state (non-reactive, driven at 60fps) ──
   React/zustand only hears about discrete events; everything per-frame
   lives here to keep renders off the hot path. */

import { Vector3 } from 'three'
import {
  ARENA_RADIUS,
  COMBO_WINDOW,
  COMBO_MAX_MULT,
  FIRE_INTERVAL,
  INTERMISSION_TIME,
  MAG_SIZE,
  PLAYER_EYE,
  waveRoster,
  waveSpeedMult,
  type BugKind,
} from './constants'

export interface Bug {
  id: number
  kind: BugKind
  pos: Vector3
  vel: Vector3
  hp: number
  maxHp: number
  speed: number
  radius: number
  scale: number
  seed: number
  attackCd: number
  flash: number
  spawnT: number /* grow-in animation */
  mini?: boolean
}

export interface Grenade {
  active: boolean
  pos: Vector3
  vel: Vector3
  fuse: number
}

export interface Pickup {
  kind: 'health' | 'coffee' | 'grenade'
  pos: Vector3
  bob: number
}

export interface Tracer {
  life: number
  a: Vector3
  b: Vector3
}

export const player = {
  pos: new Vector3(0, PLAYER_EYE, 10),
  vel: new Vector3(),
  vy: 0,
  onGround: true,
  hurtCd: 0,
  recoilKick: 0,
  muzzle: 0,
}

export const weapon = {
  ammo: MAG_SIZE,
  reloadT: 0,
  fireCd: 0,
  grenadeCd: 0,
  triggerDown: false,
}

export const buffs = {
  coffeeT: 0,
}

export const combo = {
  chain: 0,
  timer: 0,
}

export const run = {
  score: 0,
  kills: 0,
  wave: 0,
  best: Number(localStorage.getItem('bugwars_best_v1') ?? 0),
}

/* ── entity pools / arrays ── */
export const bugs: Bug[] = []
let bugId = 1

const GRENADE_POOL = 6
export const grenades: Grenade[] = Array.from({ length: GRENADE_POOL }, () => ({
  active: false,
  pos: new Vector3(),
  vel: new Vector3(),
  fuse: 0,
}))

export const pickups: Pickup[] = []

const TRACER_POOL = 20
export const tracers: Tracer[] = Array.from({ length: TRACER_POOL }, () => ({
  life: 0,
  a: new Vector3(),
  b: new Vector3(),
}))

/* ── particles: single Points buffer ── */
export const PARTICLE_MAX = 420
export const particles = {
  pos: new Float32Array(PARTICLE_MAX * 3),
  vel: new Float32Array(PARTICLE_MAX * 3),
  col: new Float32Array(PARTICLE_MAX * 3),
  life: new Float32Array(PARTICLE_MAX),
  maxLife: new Float32Array(PARTICLE_MAX),
  cursor: 0,
}

export function emitBurst(at: Vector3, count: number, color: { r: number; g: number; b: number }, power = 7) {
  for (let i = 0; i < count; i++) {
    const idx = particles.cursor
    particles.cursor = (particles.cursor + 1) % PARTICLE_MAX
    const o = idx * 3
    particles.pos[o] = at.x
    particles.pos[o + 1] = at.y
    particles.pos[o + 2] = at.z
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const sp = power * (0.35 + Math.random() * 0.65)
    particles.vel[o] = Math.sin(phi) * Math.cos(theta) * sp
    particles.vel[o + 1] = Math.abs(Math.cos(phi)) * sp * 0.9 + 2
    particles.vel[o + 2] = Math.sin(phi) * Math.sin(theta) * sp
    const shade = 0.55 + Math.random() * 0.45
    particles.col[o] = color.r * shade
    particles.col[o + 1] = color.g * shade
    particles.col[o + 2] = color.b * shade
    const life = 0.45 + Math.random() * 0.5
    particles.life[idx] = life
    particles.maxLife[idx] = life
  }
}

/* ── wave state ── */
export const waves = {
  intermission: 0,
  roster: [] as BugKind[],
  spawnTimer: 0,
  speedMult: 1,
}

export function beginWave(n: number) {
  run.wave = n
  waves.roster = waveRoster(n)
  waves.intermission = 0
  waves.spawnTimer = 0.4
  waves.speedMult = waveSpeedMult(n)
}

export function spawnBug(kind: BugKind, cfg: { hp: number; speed: number; radius: number; pos: Vector3; scale: number; mini?: boolean }): Bug {
  const b: Bug = {
    id: bugId++,
    kind,
    pos: cfg.pos.clone(),
    vel: new Vector3(),
    hp: cfg.hp,
    maxHp: cfg.hp,
    speed: cfg.speed,
    radius: cfg.radius * cfg.scale,
    scale: cfg.scale,
    seed: Math.random() * 100,
    attackCd: 0.6,
    flash: 0,
    spawnT: 0.35,
    mini: cfg.mini,
  }
  bugs.push(b)
  return b
}

export function edgeSpawnPoint(out: Vector3): Vector3 {
  const a = Math.random() * Math.PI * 2
  const r = ARENA_RADIUS - 2.5
  return out.set(Math.cos(a) * r, 0, Math.sin(a) * r)
}

/* combo helpers */
export function registerKill() {
  combo.chain++
  combo.timer = COMBO_WINDOW
}
export function comboMult(): number {
  return Math.min(COMBO_MAX_MULT, 1 + Math.floor(combo.chain / 4))
}
export function tickCombo(dt: number) {
  if (combo.timer > 0) {
    combo.timer -= dt
    if (combo.timer <= 0) {
      combo.chain = 0
      combo.timer = 0
    }
  }
}

export function fireCooldown(): number {
  return buffs.coffeeT > 0 ? FIRE_INTERVAL * 0.62 : FIRE_INTERVAL
}

/* full reset for a fresh run */
export function resetWorld() {
  bugs.length = 0
  pickups.length = 0
  grenades.forEach((g) => (g.active = false))
  tracers.forEach((t) => (t.life = 0))
  particles.life.fill(0)
  particles.cursor = 0

  player.pos.set(0, PLAYER_EYE, 10)
  player.vel.set(0, 0, 0)
  player.vy = 0
  player.onGround = true
  player.hurtCd = 0
  player.recoilKick = 0
  player.muzzle = 0

  weapon.ammo = MAG_SIZE
  weapon.reloadT = 0
  weapon.fireCd = 0
  weapon.grenadeCd = 0
  weapon.triggerDown = false

  buffs.coffeeT = 0
  combo.chain = 0
  combo.timer = 0
  run.score = 0
  run.kills = 0
  run.wave = 0

  waves.intermission = INTERMISSION_TIME
  waves.roster = []
  waves.spawnTimer = 0
  waves.speedMult = 1
}
