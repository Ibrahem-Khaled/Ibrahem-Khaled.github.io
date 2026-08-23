/* ── BUG WARS · pooled bug renderer ── */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BoxGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  TetrahedronGeometry,
  type BufferGeometry,
} from 'three'
import { BUGS, MAX_BUGS, type BugKind } from './constants'
import { bugs, player } from './world'

function makeGeometries(): Record<BugKind, BufferGeometry> {
  return {
    syntax: new BoxGeometry(0.95, 0.8, 0.95),
    nullop: new OctahedronGeometry(0.62, 0),
    leak: new IcosahedronGeometry(0.85, 1),
    race: new TetrahedronGeometry(0.82, 0),
    legacy: new IcosahedronGeometry(1.7, 1),
  }
}

interface Slot {
  root: Group | null
  body: Mesh | null
  wire: Mesh | null
  legs: Group | null
  ring: Group | null
  lastKind: BugKind | null
}

const LEG_COUNT = 6

export default function BugSwarm() {
  const geos = useMemo(makeGeometries, [])
  const slots = useRef<Slot[]>(
    Array.from({ length: MAX_BUGS }, () => ({
      root: null,
      body: null,
      wire: null,
      legs: null,
      ring: null,
      lastKind: null,
    })),
  )

  const mats = useMemo(
    () =>
      Array.from(
        { length: MAX_BUGS },
        () =>
          new MeshStandardMaterial({
            color: '#ffffff',
            emissive: '#ffffff',
            emissiveIntensity: 0.7,
            roughness: 0.35,
            metalness: 0.45,
          }),
      ),
    [],
  )
  const wireMat = useMemo(
    () => new MeshBasicMaterial({ color: '#04140a', wireframe: true, transparent: true, opacity: 0.5 }),
    [],
  )
  const legMat = useMemo(() => new MeshStandardMaterial({ color: '#101418', roughness: 0.7 }), [])

  const register = (i: number) => (el: Group | null) => {
    slots.current[i].root = el
  }

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const list = slots.current

    for (let i = 0; i < MAX_BUGS; i++) {
      const s = list[i]
      if (!s.root || !s.body || !s.wire) continue

      const b = bugs[i]
      if (!b) {
        if (s.root.visible) s.root.visible = false
        continue
      }
      s.root.visible = true
      const mat = mats[i]

      /* swap geometry / palette when kind changes on this slot */
      if (s.lastKind !== b.kind) {
        s.lastKind = b.kind
        const geo = geos[b.kind]
        s.body.geometry = geo
        s.wire.geometry = geo
        mat.color.set(BUGS[b.kind].color)
        mat.emissive.set(BUGS[b.kind].emissive)
      }

      /* transform */
      s.root.position.copy(b.pos)
      const dx = player.pos.x - b.pos.x
      const dz = player.pos.z - b.pos.z
      s.root.rotation.y = Math.atan2(dx, dz)

      /* pop-in */
      const popT = Math.max(0, b.spawnT / 0.35)
      const pop = popT > 0 ? 1 - popT * popT * popT : 1
      let sc = b.scale * pop
      if (b.kind === 'leak') sc *= 1 + Math.sin(t * 3 + b.seed) * 0.05 * b.scale
      s.root.scale.setScalar(Math.max(0.001, sc))

      /* flash white-hot on hit */
      mat.emissiveIntensity = b.flash > 0 ? 3.2 : b.kind === 'legacy' ? 1.15 : 0.7

      /* wobble & legs */
      const moving = b.vel.lengthSq() > 0.05 || b.kind === 'nullop'
      if (s.body) {
        s.body.rotation.z = BUGS[b.kind].flying ? Math.sin(t * 6 + b.seed) * 0.25 : 0
        s.body.rotation.x = BUGS[b.kind].flying ? Math.sin(t * 4 + b.seed) * 0.15 : 0
      }
      if (s.legs) {
        s.legs.visible = !BUGS[b.kind].flying
        if (!BUGS[b.kind].flying && s.legs.visible) {
          const wig = moving ? t * 16 : t * 2
          for (let l = 0; l < LEG_COUNT; l++) {
            const leg = s.legs.children[l]
            if (leg) leg.rotation.x = Math.sin(wig + l * 1.7) * (moving ? 0.7 : 0.15)
          }
        }
      }
      if (s.ring) {
        s.ring.visible = b.kind === 'legacy'
        if (b.kind === 'legacy') s.ring.rotation.y = t * 1.4
      }
    }
  })

  return (
    <group>
      {Array.from({ length: MAX_BUGS }, (_, i) => (
        <group key={i} ref={register(i)} visible={false}>
          <mesh ref={(el) => void (slots.current[i].body = el)} material={mats[i]}>
            <boxGeometry />
          </mesh>
          <mesh ref={(el) => void (slots.current[i].wire = el)} material={wireMat} scale={1.02}>
            <boxGeometry />
          </mesh>
          <group ref={(el) => void (slots.current[i].legs = el)}>
            {Array.from({ length: LEG_COUNT }, (_, l) => {
              const side = l % 2 === 0 ? 1 : -1
              const row = Math.floor(l / 2) - 1
              return (
                <mesh
                  key={l}
                  material={legMat}
                  position={[side * 0.52, -0.18, row * 0.34]}
                  rotation-z={side * -0.9}
                >
                  <boxGeometry args={[0.5, 0.07, 0.07]} />
                </mesh>
              )
            })}
          </group>
          <group ref={(el) => void (slots.current[i].ring = el)} visible={false}>
            <mesh>
              <torusGeometry args={[2.35, 0.06, 8, 40]} />
              <meshBasicMaterial color="#39ff6e" transparent opacity={0.65} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
