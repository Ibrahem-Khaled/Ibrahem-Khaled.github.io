/* ── BUG WARS · particles / tracers / explosions / pickups rendering ── */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PointsMaterial,
} from 'three'
import { fx } from './systems'
import { grenades, PARTICLE_MAX, particles, pickups, tracers } from './world'

const GRAV = -9.5

/* ───────────── particles ───────────── */

export function ParticleField() {
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(particles.pos, 3))
    g.setAttribute('color', new BufferAttribute(particles.col, 3))
    return g
  }, [])

  const mat = useMemo(
    () =>
      new PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const p = particles
    for (let i = 0; i < PARTICLE_MAX; i++) {
      if (p.life[i] <= 0) continue
      p.life[i] -= dt
      const o = i * 3
      if (p.life[i] <= 0) {
        p.pos[o + 1] = -999
        continue
      }
      p.vel[o + 1] += GRAV * dt
      p.pos[o] += p.vel[o] * dt
      p.pos[o + 1] += p.vel[o + 1] * dt
      p.pos[o + 2] += p.vel[o + 2] * dt
      if (p.pos[o + 1] < 0.03) {
        p.pos[o + 1] = 0.03
        p.vel[o + 1] *= -0.4
        p.vel[o] *= 0.7
        p.vel[o + 2] *= 0.7
      }
    }
    geo.attributes.position.needsUpdate = true
  })

  return <points geometry={geo} material={mat} frustumCulled={false} />
}

/* ───────────── tracers (dotted beams) ───────────── */

const TRACER_POINTS = 20 * 7 /* pool × steps+1 */

export function Tracers() {
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(TRACER_POINTS * 3), 3))
    return g
  }, [])

  const mat = useMemo(
    () =>
      new PointsMaterial({
        size: 0.075,
        color: new Color('#d9ff99'),
        transparent: true,
        opacity: 0.9,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const arr = geo.attributes.position.array as Float32Array
    arr.fill(0)
    let v = 0
    for (const tr of tracers) {
      if (tr.life <= 0) continue
      tr.life -= dt
      const steps = 6
      for (let s = 0; s <= steps; s++) {
        const f = s / steps
        arr[v++] = tr.a.x + (tr.b.x - tr.a.x) * f
        arr[v++] = tr.a.y + (tr.b.y - tr.a.y) * f
        arr[v++] = tr.a.z + (tr.b.z - tr.a.z) * f
      }
    }
    geo.setDrawRange(0, Math.ceil(v / 3))
    geo.attributes.position.needsUpdate = true
  })

  return <points geometry={geo} material={mat} frustumCulled={false} />
}

/* ───────────── explosion shockwaves ───────────── */

interface RingSlot {
  mesh: Mesh | null
  mat: MeshBasicMaterial | null
}

const RING_LIFE = 0.55

export function Shockwaves() {
  const slots = useRef<RingSlot[]>(Array.from({ length: 4 }, () => ({ mesh: null, mat: null })))

  useFrame((_, dt) => {
    for (let i = fx.explosions.length - 1; i >= 0; i--) {
      fx.explosions[i].t += dt
      if (fx.explosions[i].t > RING_LIFE) fx.explosions.splice(i, 1)
    }

    slots.current.forEach((s, i) => {
      if (!s.mesh || !s.mat) return
      const ex = fx.explosions[i]
      if (!ex) {
        s.mesh.visible = false
        return
      }
      s.mesh.visible = true
      s.mesh.position.copy(ex.at).setY(0.15)
      const k = ex.t / RING_LIFE
      s.mesh.scale.setScalar(0.6 + k * 5)
      s.mat.opacity = 0.85 * (1 - k)
    })
  })

  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            slots.current[i].mesh = el
            slots.current[i].mat = (el?.material as MeshBasicMaterial) ?? null
          }}
          rotation-x={-Math.PI / 2}
          visible={false}
        >
          <ringGeometry args={[0.72, 1, 40]} />
          <meshBasicMaterial
            color="#ffcf70"
            transparent
            opacity={0.8}
            side={DoubleSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}

/* ───────────── grenades ───────────── */

export function GrenadeMeshes() {
  const refs = useRef<(Group | null)[]>([])

  useFrame(({ clock }) => {
    grenades.forEach((g, i) => {
      const el = refs.current[i]
      if (!el) return
      if (!g.active) {
        el.visible = false
        return
      }
      el.visible = true
      el.position.copy(g.pos)
      el.rotation.x += 0.3
      el.rotation.z += 0.22
      const blink = g.fuse < 0.5 ? 18 : 6
      el.scale.setScalar(Math.sin(clock.elapsedTime * blink) > 0 ? 1.25 : 1)
    })
  })

  return (
    <>
      {grenades.map((_, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)} visible={false}>
          <mesh>
            <icosahedronGeometry args={[0.17, 0]} />
            <meshStandardMaterial color="#2b1010" emissive="#ff3030" emissiveIntensity={1.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </>
  )
}

/* ───────────── pickups ───────────── */

export function PickupMeshes() {
  const refs = useRef<(Group | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((el, i) => {
      if (!el) return
      const p = pickups[i]
      if (!p) {
        el.visible = false
        return
      }
      el.visible = true
      el.position.set(p.pos.x, 0.75 + Math.sin(t * 2.4 + p.bob) * 0.14, p.pos.z)
      el.rotation.y = t * 1.6 + p.bob
      const kindEl = (kind: string) => el.getObjectByName(kind)
      const health = kindEl('health')
      const coffee = kindEl('coffee')
      const grenadeP = kindEl('grenade')
      if (health) health.visible = p.kind === 'health'
      if (coffee) coffee.visible = p.kind === 'coffee'
      if (grenadeP) grenadeP.visible = p.kind === 'grenade'
    })
  })

  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)} visible={false}>
          <group name="health">
            <mesh>
              <boxGeometry args={[0.52, 0.16, 0.16]} />
              <meshStandardMaterial color="#062a10" emissive="#39ff6e" emissiveIntensity={1.5} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.16, 0.52, 0.16]} />
              <meshStandardMaterial color="#062a10" emissive="#39ff6e" emissiveIntensity={1.5} />
            </mesh>
          </group>
          <group name="coffee" visible={false}>
            <mesh>
              <octahedronGeometry args={[0.34, 0]} />
              <meshStandardMaterial color="#2a1c04" emissive="#ffb020" emissiveIntensity={1.7} />
            </mesh>
          </group>
          <group name="grenade" visible={false}>
            <mesh>
              <sphereGeometry args={[0.26, 10, 8]} />
              <meshStandardMaterial color="#230808" emissive="#ff5040" emissiveIntensity={1.4} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  )
}
