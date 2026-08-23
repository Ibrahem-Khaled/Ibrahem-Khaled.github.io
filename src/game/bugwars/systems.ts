/* ── BUG WARS · combat & AI systems (pure logic, runs inside useFrame) ── */

import { Color, Vector3 } from 'three'
import {
  ARENA_RADIUS,
  BUGS,
  COFFEE_TIME,
  GRENADE_DAMAGE,
  GRENADE_FUSE,
  GRENADE_RADIUS,
  HEALTH_PACK_AMOUNT,
  MAX_BUGS,
  PISTOL_DAMAGE,
  RANGE,
  type BugKind,
} from './constants'
import { OBSTACLES } from './Scenery'
import { sfx } from './audio'
import { useGame } from './store'
import {
  beginWave,
  bugs,
  buffs,
  comboMult,
  edgeSpawnPoint,
  emitBurst,
  grenades,
  pickups,
  player,
  registerKill,
  run,
  spawnBug,
  tickCombo,
  tracers,
  waves,
  weapon,
} from './world'

const tmpA = new Vector3()
const tmpB = new Vector3()

/* ───────────────────────── hitscan ───────────────────────── */

function raySphereT(ro: Vector3, rd: Vector3, center: Vector3, radius: number): number | null {
  tmpB.subVectors(center, ro)
  const t = tmpB.dot(rd)
  if (t < 0 || t > RANGE) return null
  const d2 = tmpB.lengthSq() - t * t
  const r2 = radius * radius
  if (d2 > r2) return null
  return t - Math.sqrt(r2 - d2)
}

export function fireHitscan(origin: Vector3, dir: Vector3): boolean {
  /* returns true if something was hit */
  let bestBug = null as (typeof bugs)[number] | null
  let bestT = Infinity

  for (const b of bugs) {
    const r = Math.max(b.radius * 1.25, 0.55)
    const t = raySphereT(origin, dir, b.pos, r)
    if (t !== null && t < bestT) {
      bestT = t
      bestBug = b
    }
  }

  const end = tmpA.copy(dir).multiplyScalar(bestBug ? bestT : RANGE).add(origin).clone()

  /* tracer */
  const tr = tracers.find((x) => x.life <= 0)
  if (tr) {
    tr.a.copy(origin)
    tr.b.copy(end)
    tr.life = 0.09
  }

  if (!bestBug) return false

  damageBug(bestBug, PISTOL_DAMAGE, dir)
  return true
}

export function damageBug(b: (typeof bugs)[number], dmg: number, knockDir?: Vector3) {
  b.hp -= dmg
  b.flash = 0.12
  if (knockDir && !BUGS[b.kind].flying) {
    b.vel.addScaledVector(knockDir, b.kind === 'legacy' ? 1.2 : 5.5)
  }
  useGame.getState().registerHit()
  sfx.hit()

  if (b.kind === 'legacy') {
    useGame.getState().setBoss(Math.max(0, b.hp / b.maxHp))
  }

  if (b.hp <= 0) killBug(b)
}

const colorCache = new Map<BugKind, { r: number; g: number; b: number }>()
function kindColor(kind: BugKind) {
  let c = colorCache.get(kind)
  if (!c) {
    const col = new Color(BUGS[kind].emissive)
    c = { r: col.r, g: col.g, b: col.b }
    colorCache.set(kind, c)
  }
  return c
}

function killBug(b: (typeof bugs)[number]) {
  const idx = bugs.indexOf(b)
  if (idx === -1) return
  bugs.splice(idx, 1)

  if (b.kind === 'legacy') useGame.getState().setBoss(null)

  const cfg = BUGS[b.kind]
  emitBurst(b.pos, b.kind === 'legacy' ? 90 : 22 + Math.floor(Math.random() * 10), kindColor(b.kind), b.kind === 'legacy' ? 12 : 6)
  sfx.kill()

  /* race condition splits */
  if (b.kind === 'race' && !b.mini && bugs.length < MAX_BUGS - 2) {
    for (let i = 0; i < 2; i++) {
      const p = new Vector3(b.pos.x + (i === 0 ? 0.9 : -0.9), 0, b.pos.z + (i === 0 ? 0.9 : -0.9))
      spawnBug('race', {
        hp: 34,
        speed: cfg.speed * 1.45,
        radius: cfg.radius,
        pos: p,
        scale: 0.55,
        mini: true,
      })
    }
  }

  /* drops */
  if (b.kind === 'legacy') {
    dropPickup('health', b.pos)
    dropPickup('coffee', b.pos)
    dropPickup('grenade', b.pos)
  } else {
    const roll = Math.random()
    if (roll < 0.14) dropPickup('health', b.pos)
    else if (roll < 0.24) dropPickup('coffee', b.pos)
    else if (roll < 0.3 && weapon.grenadeCd <= 0) dropPickup('grenade', b.pos)
  }

  /* score & combo */
  registerKill()
  const gained = cfg.score * comboMult() * (b.mini ? 0.4 : 1)
  run.score += Math.round(gained)
  run.kills++
  const st = useGame.getState()
  st.setScore(run.score, run.kills, comboMult())
}

function dropPickup(kind: 'health' | 'coffee' | 'grenade', at: Vector3) {
  if (pickups.length >= 8) pickups.shift()
  pickups.push({ kind, pos: at.clone().setY(0.75), bob: Math.random() * 6 })
}

/* ───────────────────── grenades ───────────────────── */

export function throwGrenade(origin: Vector3, dir: Vector3): boolean {
  const g = grenades.find((x) => !x.active)
  if (!g) return false
  g.active = true
  g.pos.copy(origin).addScaledVector(dir, 0.7)
  g.vel.copy(dir).multiplyScalar(17)
  g.vel.y += 4.5
  g.fuse = GRENADE_FUSE
  sfx.grenadeThrow()
  return true
}

export function explodeGrenades(dt: number) {
  for (const g of grenades) {
    if (!g.active) continue
    g.fuse -= dt
    g.vel.y -= 20 * dt
    g.pos.addScaledVector(g.vel, dt)

    /* bounce on floor */
    if (g.pos.y < 0.18) {
      g.pos.y = 0.18
      g.vel.y = Math.abs(g.vel.y) * 0.45
      g.vel.x *= 0.7
      g.vel.z *= 0.7
    }
    /* wall clamp */
    const d = Math.hypot(g.pos.x, g.pos.z)
    if (d > ARENA_RADIUS - 0.5) {
      g.pos.x *= (ARENA_RADIUS - 0.5) / d
      g.pos.z *= (ARENA_RADIUS - 0.5) / d
      g.vel.x *= -0.5
      g.vel.z *= -0.5
    }

    if (g.fuse <= 0) {
      g.active = false
      detonate(g.pos)
    }
  }
}

function detonate(at: Vector3) {
  sfx.explode()
  emitBurst(at, 70, { r: 1, g: 0.62, b: 0.15 }, 11)
  emitBurst(at, 30, { r: 1, g: 0.95, b: 0.6 }, 7)

  for (let i = bugs.length - 1; i >= 0; i--) {
    const b = bugs[i]
    const dist = b.pos.distanceTo(at)
    if (dist < GRENADE_RADIUS + b.radius) {
      tmpA.subVectors(b.pos, at).normalize()
      const falloff = 1 - Math.min(1, dist / (GRENADE_RADIUS + b.radius))
      b.vel.addScaledVector(tmpA, 12 * falloff)
      damageBug(b, GRENADE_DAMAGE * (0.45 + falloff * 0.55), tmpA)
    }
  }

  /* shockwave ring visual handled by Effects via lastExplosion hook */
  fx.explosions.push({ at: at.clone(), t: 0 })
}

/* lightweight FX channel toward rendering layer */
export const fx = {
  explosions: [] as { at: Vector3; t: number }[],
  shake: 0,
}

export function addShake(amount: number) {
  fx.shake = Math.min(0.6, fx.shake + amount)
}

/* ───────────────────── waves ───────────────────── */

export function updateWaves(dt: number, playing: boolean) {
  if (!playing) return
  const st = useGame.getState()

  if (waves.intermission > 0) {
    waves.intermission -= dt
    st.setIntermission(Math.max(0, Math.ceil(waves.intermission)))
    if (waves.intermission <= 0) {
      beginWave(run.wave + 1)
      st.setWave(run.wave)
      st.setIntermission(-1)
      const hasBoss = run.wave % 5 === 0
      st.showBanner(
        hasBoss
          ? { title: `WAVE ${run.wave}`, sub: '⚠ BOSS: LEGACY_CODE.EXE', tone: 'boss' }
          : { title: `WAVE ${run.wave}`, sub: 'INCOMING…', tone: 'wave' },
      )
      if (hasBoss) sfx.bossIncoming()
      else sfx.waveIncoming()
      window.setTimeout(() => st.showBanner(null), 2200)
    }
    return
  }

  /* spawning drip */
  if (waves.roster.length > 0) {
    waves.spawnTimer -= dt
    if (waves.spawnTimer <= 0 && bugs.length < MAX_BUGS) {
      const kind = waves.roster.pop()
      if (kind) spawnFromRoster(kind)
      waves.spawnTimer = kind === 'legacy' ? 1.2 : 0.55 + Math.random() * 0.5
    }
  }

  /* wave complete? */
  if (waves.roster.length === 0 && bugs.length === 0) {
    if (run.wave > 0) {
      sfx.waveClear()
      st.showBanner({ title: `WAVE ${run.wave} CLEARED`, sub: '+150 BONUS', tone: 'clear' })
      run.score += 150
      st.setScore(run.score, run.kills, comboMult())
      window.setTimeout(() => st.showBanner(null), 1800)
    }
    st.setBoss(null)
    waves.intermission = 3.2
    st.setIntermission(4)
  }

  tickCombo(dt)
  const cm = comboMult()
  st.setCombo(cm)
}

function spawnFromRoster(kind: BugKind) {
  const cfg = BUGS[kind]
  const pos = edgeSpawnPoint(new Vector3())
  spawnBug(kind, {
    hp: cfg.hp,
    speed: cfg.speed * waves.speedMult * (0.92 + Math.random() * 0.16),
    radius: cfg.radius,
    pos,
    scale: 1,
  })
}

/* ───────────────────── bug AI ───────────────────── */

export function updateBugs(dt: number, time: number) {
  let anyAttack = false

  for (let i = bugs.length - 1; i >= 0; i--) {
    const b = bugs[i]
    b.flash = Math.max(0, b.flash - dt)
    if (b.spawnT > 0) b.spawnT -= dt
    b.attackCd = Math.max(0, b.attackCd - dt)

    const toPlayer = tmpA.subVectors(player.pos, b.pos)
    toPlayer.y = 0
    const dist = toPlayer.length()
    toPlayer.normalize()

    /* steering per kind */
    let speed = b.speed
    if (b.kind === 'nullop') {
      /* zigzag strafing while approaching */
      const wob = Math.sin(time * 5 + b.seed) 
      tmpB.set(-toPlayer.z, 0, toPlayer.x).multiplyScalar(wob * 0.85)
      toPlayer.add(tmpB).normalize()
    } else if (b.kind === 'legacy') {
      /* pulse charge */
      speed *= 1 + 0.5 * Math.max(0, Math.sin(time * 0.7 + b.seed))
    }

    if (dist > b.radius + 1.05) {
      b.pos.addScaledVector(toPlayer, speed * dt)
    } else if (b.attackCd <= 0) {
      /* melee the developer */
      b.attackCd = 1.0
      hurtPlayer(BUGS[b.kind].damage)
      anyAttack = true
    }

    /* separation from other bugs */
    for (let j = i - 1; j >= 0; j--) {
      const o = bugs[j]
      const dx = b.pos.x - o.pos.x
      const dz = b.pos.z - o.pos.z
      const minD = (b.radius + o.radius) * 0.9
      const d2 = dx * dx + dz * dz
      if (d2 < minD * minD && d2 > 0.0001) {
        const d = Math.sqrt(d2)
        const push = ((minD - d) / minD) * 3.2 * dt
        b.pos.x += (dx / d) * push
        b.pos.z += (dz / d) * push
        o.pos.x -= (dx / d) * push
        o.pos.z -= (dz / d) * push
      }
    }

    /* knockback velocity decay */
    b.pos.addScaledVector(b.vel, dt)
    b.vel.multiplyScalar(Math.max(0, 1 - 8 * dt))

    /* arena clamp + height */
    const dd = Math.hypot(b.pos.x, b.pos.z)
    if (dd > ARENA_RADIUS - b.radius) {
      const k = (ARENA_RADIUS - b.radius) / dd
      b.pos.x *= k
      b.pos.z *= k
    }

    /* slide around rock obstacles */
    for (const o of OBSTACLES) {
      const dx = b.pos.x - o.x
      const dz = b.pos.z - o.z
      const minD = o.r + b.radius + 0.25
      const d2 = dx * dx + dz * dz
      if (d2 < minD * minD && d2 > 1e-4) {
        const od = Math.sqrt(d2)
        const k2 = minD / od
        b.pos.x = o.x + dx * k2
        b.pos.z = o.z + dz * k2
      }
    }
    if (BUGS[b.kind].flying) {
      b.pos.y = 1.35 + Math.sin(time * 2.4 + b.seed) * 0.35
    } else {
      b.pos.y = Math.abs(Math.sin(time * 8 + b.seed)) * 0.08
    }
  }

  if (anyAttack) addShake(0.12)

  /* memory leak growth */
  for (const b of bugs) {
    if (b.kind === 'leak' && b.scale < 2.1) {
      b.scale += dt * 0.045
      b.radius = BUGS.leak.radius * b.scale
    }
  }
}

export function hurtPlayer(dmg: number) {
  if (player.hurtCd > 0) return
  player.hurtCd = 0.45
  const hp = Math.max(0, useGame.getState().hp - dmg)
  useGame.getState().setHp(hp)
  useGame.getState().registerHurt()
  sfx.hurt()
  addShake(0.2)

  if (hp <= 0) {
    gameOver()
  }
}

function gameOver() {
  const st = useGame.getState()
  st.setPhase('over')
  st.commitBest(run.score)
  sfx.gameOver()
  document.exitPointerLock()
}

/* ───────────────────── pickups ───────────────────── */

export function updatePickups(dt: number) {
  const st = useGame.getState()
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i]
    p.bob += dt
    const dx = player.pos.x - p.pos.x
    const dz = player.pos.z - p.pos.z
    if (dx * dx + dz * dz < 1.44) {
      pickups.splice(i, 1)
      if (p.kind === 'coffee') {
        buffs.coffeeT = COFFEE_TIME
        sfx.coffee()
        st.showBanner({ title: '☕ CAFFEINE RUSH', sub: 'SPEED + FIRE RATE', tone: 'buff' })
        window.setTimeout(() => st.showBanner(null), 1300)
      } else if (p.kind === 'health') {
        const hp = Math.min(st.maxHp, st.hp + HEALTH_PACK_AMOUNT)
        st.setHp(hp)
        sfx.pickup()
      } else {
        sfx.pickup()
      }
    }
  }

  if (buffs.coffeeT > 0) {
    buffs.coffeeT -= dt
    st.setCoffee(Math.max(0, Math.ceil(buffs.coffeeT)))
    if (buffs.coffeeT <= 0) st.setCoffee(-1)
  }
}
