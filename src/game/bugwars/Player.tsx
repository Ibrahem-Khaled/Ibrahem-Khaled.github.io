/* ── BUG WARS · player controller: pointer-lock FPS + weapons ── */

import { useEffect, useRef, type ComponentRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Group, Mesh, MeshBasicMaterial, PointLight, Vector3 } from 'three'
import {
  ACCEL,
  ARENA_RADIUS,
  COFFEE_FIRE_MULT,
  COFFEE_SPEED_MULT,
  FIRE_INTERVAL,
  FRICTION,
  GRAVITY,
  GRENADE_CD,
  JUMP_V,
  MAG_SIZE,
  PLAYER_EYE,
  PLAYER_RADIUS,
  RELOAD_TIME,
  SPRINT_MULT,
  WALK_SPEED,
} from './constants'
import { sfx, initAudio } from './audio'
import { LOCK_EVENT } from './flow'
import { OBSTACLES } from './Scenery'
import { useGame } from './store'
import { addShake, fireHitscan, fx, throwGrenade } from './systems'
import { buffs, player, weapon } from './world'

const keys = new Set<string>()
const tmpDir = new Vector3()
const fwdTmp = new Vector3()
const rightTmp = new Vector3()
const wishTmp = new Vector3()

export default function Player() {
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)
  const controls = useRef<ComponentRef<typeof PointerLockControls>>(null)
  const gunRef = useRef<Group>(null)
  const muzzleLight = useRef<PointLight>(null)

  /* keyboard / mouse input */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.add(e.code)
      if (e.code === 'KeyR') startReload()
      if (e.code === 'KeyG') tryGrenade()
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
    }
    const up = (e: KeyboardEvent) => keys.delete(e.code)
    const blur = () => keys.clear()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)

    const mdown = (e: MouseEvent) => {
      if (useGame.getState().phase !== 'playing') return
      if (e.button === 0) weapon.triggerDown = true
      if (e.button === 2) tryGrenade()
    }
    const mup = (e: MouseEvent) => {
      if (e.button === 0) weapon.triggerDown = false
    }
    const ctxMenu = (e: MouseEvent) => e.preventDefault()

    window.addEventListener('mousedown', mdown)
    window.addEventListener('mouseup', mup)
    window.addEventListener('contextmenu', ctxMenu)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      window.removeEventListener('mousedown', mdown)
      window.removeEventListener('mouseup', mup)
      window.removeEventListener('contextmenu', ctxMenu)
    }
  }, [])

  /* pointer lock ↔ phase sync */
  useEffect(() => {
    const el = controls.current
    if (!el) return
    const lock = () => {
      /* any successful lock means we're in battle: menu, pause or post-death retry */
      initAudio()
      useGame.getState().setPhase('playing')
    }
    const unlock = () => {
      const st = useGame.getState()
      weapon.triggerDown = false
      keys.clear()
      if (st.phase === 'playing') st.setPhase('paused')
    }
    el.addEventListener('lock', lock)
    el.addEventListener('unlock', unlock)
    const onLockEvent = () => {
      try {
        el.lock()
      } catch {
        /* browser cooldown after Esc — user clicks again */
      }
    }
    window.addEventListener(LOCK_EVENT, onLockEvent)
    return () => {
      el.removeEventListener('lock', lock)
      el.removeEventListener('unlock', unlock)
      window.removeEventListener(LOCK_EVENT, onLockEvent)
    }
  }, [])

  /* attach gun view-model to the camera (and camera to scene so it renders children) */
  useEffect(() => {
    const g = gunRef.current
    if (!g) return
    scene.add(camera)
    camera.add(g)
    return () => {
      camera.remove(g)
      scene.remove(camera)
    }
  }, [camera, scene])

  const bobT = useRef(0)

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const st = useGame.getState()
    const playing = st.phase === 'playing'

    /* decay timers */
    player.recoilKick = Math.max(0, player.recoilKick - dt * 5)
    player.muzzle = Math.max(0, player.muzzle - dt * 14)
    player.hurtCd = Math.max(0, player.hurtCd - dt)
    weapon.fireCd = Math.max(0, weapon.fireCd - dt)
    weapon.grenadeCd = Math.max(0, weapon.grenadeCd - dt)
    fx.shake = Math.max(0, fx.shake - dt * 1.6)

    if (weapon.reloadT > 0) {
      weapon.reloadT -= dt
      if (weapon.reloadT <= 0) {
        weapon.ammo = MAG_SIZE
        st.setAmmo(weapon.ammo, false)
      }
    }

    /* keep camera pinned even while paused/menus */
    if (!playing) {
      state.camera.position.set(player.pos.x, player.pos.y, player.pos.z)
      animateGun(bobT, 0)
      return
    }

    /* ── movement ──
       Direction is derived from the camera's world basis (NOT euler angles —
       decomposing yaw from rotation.y breaks once pitch is applied, which made
       W sometimes strafe). Works at any pitch/yaw combination. */
    let f = 0
    let r = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) f += 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) f -= 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) r -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) r += 1

    if (f !== 0 || r !== 0) {
      state.camera.getWorldDirection(fwdTmp)
      fwdTmp.y = 0
      if (fwdTmp.lengthSq() < 1e-6) fwdTmp.set(0, 0, -1) /* staring straight down */
      else fwdTmp.normalize()
      rightTmp.set(-fwdTmp.z, 0, fwdTmp.x) /* forward × up */

      wishTmp.set(0, 0, 0).addScaledVector(fwdTmp, f).addScaledVector(rightTmp, r)
      wishTmp.normalize()
      player.vel.x += wishTmp.x * ACCEL * dt
      player.vel.z += wishTmp.z * ACCEL * dt
    }

    const sprint = keys.has('ShiftLeft') || keys.has('ShiftRight')
    const maxSpeed = WALK_SPEED * (sprint ? SPRINT_MULT : 1) * (buffs.coffeeT > 0 ? COFFEE_SPEED_MULT : 1)

    /* friction + clamp */
    const fr = Math.max(0, 1 - FRICTION * dt)
    player.vel.x *= fr
    player.vel.z *= fr
    const hv = Math.hypot(player.vel.x, player.vel.z)
    if (hv > maxSpeed) {
      player.vel.x *= maxSpeed / hv
      player.vel.z *= maxSpeed / hv
    }

    /* jump & gravity */
    if (keys.has('Space') && player.onGround) {
      player.vy = JUMP_V
      player.onGround = false
    }
    player.vy -= GRAVITY * dt
    player.pos.y += player.vy * dt
    if (player.pos.y <= PLAYER_EYE) {
      player.pos.y = PLAYER_EYE
      player.vy = 0
      player.onGround = true
    }

    player.pos.x += player.vel.x * dt
    player.pos.z += player.vel.z * dt

    const d = Math.hypot(player.pos.x, player.pos.z)
    if (d > ARENA_RADIUS - PLAYER_RADIUS) {
      const k = (ARENA_RADIUS - PLAYER_RADIUS) / d
      player.pos.x *= k
      player.pos.z *= k
    }

    /* rock obstacles push-out */
    for (const o of OBSTACLES) {
      const dx = player.pos.x - o.x
      const dz = player.pos.z - o.z
      const minD = o.r + PLAYER_RADIUS + 0.35
      const d2 = dx * dx + dz * dz
      if (d2 < minD * minD && d2 > 1e-4) {
        const dd = Math.sqrt(d2)
        const k2 = minD / dd
        player.pos.x = o.x + dx * k2
        player.pos.z = o.z + dz * k2
        /* cancel velocity pointing into the rock */
        const nx = dx / dd
        const nz = dz / dd
        const into = player.vel.x * nx + player.vel.z * nz
        if (into < 0) {
          player.vel.x -= nx * into
          player.vel.z -= nz * into
        }
      }
    }

    /* view bob + shake */
    if (player.onGround && hv > 0.6) bobT.current += dt * hv * 1.35
    const bobY = player.onGround ? Math.sin(bobT.current) * 0.035 * Math.min(1, hv / 8) : 0
    const shk = fx.shake

    state.camera.position.set(
      player.pos.x + (shk > 0 ? (Math.random() - 0.5) * shk : 0),
      player.pos.y + bobY + (shk > 0 ? (Math.random() - 0.5) * shk : 0),
      player.pos.z,
    )

    /* ── shooting ── */
    if (weapon.triggerDown && weapon.fireCd <= 0 && weapon.reloadT <= 0) {
      if (weapon.ammo > 0) {
        shoot()
        weapon.fireCd = buffs.coffeeT > 0 ? FIRE_INTERVAL * COFFEE_FIRE_MULT : FIRE_INTERVAL
      } else {
        sfx.empty()
        weapon.fireCd = 0.25
        startReload()
      }
    }

    animateGun(bobT, hv)
  })

  function animateGun(bobT: { current: number }, hv: number) {
    const g = gunRef.current
    if (!g) return
    const kick = player.recoilKick
    const reloading = weapon.reloadT > 0
    g.position.set(
      0.34 - kick * 0.02,
      -0.3 + Math.sin(bobT.current) * 0.01 * Math.min(1, hv / 8) - (reloading ? 0.14 : 0),
      -0.62 + kick * 0.06,
    )
    g.rotation.x = kick * 0.24 + (reloading ? 0.55 : 0)
    if (muzzleLight.current) muzzleLight.current.intensity = player.muzzle * 26
  }

  function shoot() {
    weapon.ammo--
    player.recoilKick = Math.min(1, player.recoilKick + 0.55)
    player.muzzle = 1
    addShake(0.03)
    sfx.shoot()
    useGame.getState().setAmmo(weapon.ammo, false)

    camera.getWorldDirection(tmpDir)
    fireHitscan(player.pos, tmpDir)

    if (weapon.ammo === 0) startReload()
  }

  function tryGrenade() {
    const st = useGame.getState()
    if (st.phase !== 'playing' || st.grenades <= 0 || weapon.grenadeCd > 0) return
    camera.getWorldDirection(tmpDir)
    if (throwGrenade(player.pos, tmpDir)) {
      st.setGrenades(st.grenades - 1)
      weapon.grenadeCd = GRENADE_CD
    }
  }

  function startReload() {
    if (weapon.reloadT > 0 || weapon.ammo === MAG_SIZE) return
    if (useGame.getState().phase !== 'playing') return
    weapon.reloadT = RELOAD_TIME
    sfx.reload()
    useGame.getState().setAmmo(weapon.ammo, true)
  }

  return (
    <>
      {/* selector matches nothing on purpose: drei otherwise binds a document-wide
          click → lock() listener, which resumed the game from ANY click (even after
          death) and skipped the START button / audio init entirely */}
      <PointerLockControls ref={controls} makeDefault selector=".bw-never-autolock" />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <group ref={gunRef}>
        {/* debugger blaster body */}
        <mesh>
          <boxGeometry args={[0.09, 0.13, 0.52]} />
          <meshStandardMaterial color="#151a20" roughness={0.45} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.045, -0.3]}>
          <boxGeometry args={[0.05, 0.06, 0.28]} />
          <meshStandardMaterial color="#0c0f13" roughness={0.4} metalness={0.75} />
        </mesh>
        <mesh position={[0, -0.085, 0.12]} rotation-x={0.32}>
          <boxGeometry args={[0.07, 0.17, 0.1]} />
          <meshStandardMaterial color="#10141a" roughness={0.55} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.075, 0.02]}>
          <boxGeometry args={[0.04, 0.03, 0.2]} />
          <meshStandardMaterial color="#39ff6e" emissive="#39ff6e" emissiveIntensity={2.2} />
        </mesh>
        <mesh position={[0, 0.045, -0.46]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.035, 0.05, 0.07, 8]} />
          <meshStandardMaterial color="#39ff6e" emissive="#39ff6e" emissiveIntensity={2} />
        </mesh>
        <pointLight ref={muzzleLight} position={[0, 0.05, -0.5]} color="#baff7a" intensity={0} distance={9} />

        {/* muzzle flash quad */}
        <FlashSprite />
      </group>
    </>
  )
}

function FlashSprite() {
  const mesh = useRef<Mesh>(null)
  useFrame(() => {
    if (!mesh.current) return
    const m = mesh.current.material as MeshBasicMaterial
    const k = player.muzzle
    mesh.current.visible = k > 0.05
    m.opacity = k
    mesh.current.scale.setScalar(0.5 + k * 0.9)
  })
  return (
    <mesh ref={mesh} position={[0, 0.05, -0.55]} visible={false}>
      <planeGeometry args={[0.34, 0.34]} />
      <meshBasicMaterial color="#eaffb0" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
