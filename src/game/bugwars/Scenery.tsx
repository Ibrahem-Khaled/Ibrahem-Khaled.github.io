/* ── BUG WARS · natural scenery: mountains, pines, rocks, moon, fireflies ── */

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three'
import { ARENA_RADIUS } from './constants'

export interface Obstacle {
  x: number
  z: number
  r: number
}

/** solid rocks inside the play area — also used for collision */
export const OBSTACLES: Obstacle[] = [
  { x: 10, z: -14, r: 1.9 },
  { x: -16, z: -9, r: 2.4 },
  { x: -11, z: 15, r: 1.7 },
  { x: 18, z: 12, r: 2.1 },
  { x: 2, z: -24, r: 1.6 },
  { x: -26, z: 3, r: 2.0 },
]

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/* ─────────── sky dome (vertex-gradient, no shader) ─────────── */

function SkyDome() {
  const geo = useMemo(() => {
    const g = new SphereGeometry(190, 24, 14)
    const pos = g.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const top = new Color('#060a1c')
    const mid = new Color('#141b3d')
    const horizon = new Color('#3b1d54')
    const c = new Color()
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 190
      if (y <= 0) c.copy(horizon).lerp(mid, Math.min(1, -y * 2.2))
      else c.copy(mid).lerp(top, Math.min(1, y * 1.6))
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3))
    return g
  }, [])

  const mat = useMemo(
    () => new MeshBasicMaterial({ vertexColors: true, side: BackSide, fog: false }),
    [],
  )

  return <mesh geometry={geo} material={mat} renderOrder={-10} />
}

/* ─────────── moon ─────────── */

function Moon() {
  return (
    <group position={[-95, 62, -120]}>
      <mesh>
        <sphereGeometry args={[13, 24, 18]} />
        <meshBasicMaterial color="#fff3c4" fog={false} />
      </mesh>
      <mesh position={[4, 3, 9]}>
        <sphereGeometry args={[2.6, 12, 10]} />
        <meshBasicMaterial color="#e8d9a0" fog={false} />
      </mesh>
      <pointLight position={[0, 0, 30]} intensity={260} distance={320} color="#ffe9b8" />
    </group>
  )
}

/* ─────────── shared transform helpers ─────────── */

const tmpPos = new Vector3()
const tmpScale = new Vector3()
const tmpQuat = new Quaternion()
const tmpEuler = new Euler()

function setInstance(
  dummy: Matrix4,
  x: number,
  y: number,
  z: number,
  sx: number,
  sy: number,
  sz: number,
  rotY = 0,
) {
  tmpPos.set(x, y, z)
  tmpScale.set(sx, sy, sz)
  tmpEuler.set(0, rotY, 0)
  tmpQuat.setFromEuler(tmpEuler)
  dummy.compose(tmpPos, tmpQuat, tmpScale)
}

/* ─────────── mountain ring ─────────── */

const MOUNTAINS = 16

function Mountains() {
  const ref = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Matrix4(), [])

  const placements = useMemo(
    () =>
      Array.from({ length: MOUNTAINS }, (_, i) => ({
        a: (i / MOUNTAINS) * Math.PI * 2 + rand(-0.12, 0.12),
        r: rand(72, 92),
        h: rand(26, 52),
        w: rand(16, 26),
      })),
    [],
  )

  useLayoutEffect(() => {
    const im = ref.current
    if (!im) return
    placements.forEach((p, i) => {
      setInstance(dummy, Math.cos(p.a) * p.r, p.h * 0.42, Math.sin(p.a) * p.r, p.w, p.h, p.w)
      im.setMatrixAt(i, dummy)
    })
    im.instanceMatrix.needsUpdate = true
  }, [placements, dummy])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MOUNTAINS]} matrixAutoUpdate={false}>
      <coneGeometry args={[1, 1, 5]} />
      <meshStandardMaterial color="#131c33" roughness={1} flatShading />
    </instancedMesh>
  )
}

/* ─────────── pine forest ─────────── */

const PINES = 64

function Pines() {
  const trunks = useRef<InstancedMesh>(null)
  const foliageA = useRef<InstancedMesh>(null)
  const foliageB = useRef<InstancedMesh>(null)

  const placements = useMemo(
    () =>
      Array.from({ length: PINES }, () => {
        const a = Math.random() * Math.PI * 2
        const r = rand(ARENA_RADIUS + 6, 58)
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, s: rand(0.75, 1.7), rot: rand(0, Math.PI * 2) }
      }),
    [],
  )

  const trunkGeo = useMemo(() => new CylinderGeometry(0.22, 0.34, 2.4, 5), [])
  const coneGeo = useMemo(() => new ConeGeometry(1.55, 3.4, 6), [])
  const trunkMat = useMemo(() => new MeshStandardMaterial({ color: '#33241a', roughness: 1 }), [])
  const leafMatA = useMemo(() => new MeshStandardMaterial({ color: '#0f4426', roughness: 1, flatShading: true }), [])
  const leafMatB = useMemo(() => new MeshStandardMaterial({ color: '#177a3e', roughness: 1, flatShading: true }), [])

  const dummy = useMemo(() => new Matrix4(), [])

  useLayoutEffect(() => {
    const t = trunks.current
    const fa = foliageA.current
    const fb = foliageB.current
    if (!t || !fa || !fb) return

    placements.forEach((p, i) => {
      setInstance(dummy, p.x, 1.2 * p.s, p.z, p.s, p.s, p.s, p.rot)
      t.setMatrixAt(i, dummy)
      setInstance(dummy, p.x, 3.4 * p.s, p.z, p.s, p.s, p.s, p.rot)
      fa.setMatrixAt(i, dummy)
      setInstance(dummy, p.x, 5.4 * p.s, p.z, p.s * 0.68, p.s * 0.85, p.s * 0.68, p.rot)
      fb.setMatrixAt(i, dummy)
    })
    t.instanceMatrix.needsUpdate = true
    fa.instanceMatrix.needsUpdate = true
    fb.instanceMatrix.needsUpdate = true
  }, [placements, dummy])

  return (
    <group>
      <instancedMesh ref={trunks} args={[trunkGeo, trunkMat, PINES]} matrixAutoUpdate={false} />
      <instancedMesh ref={foliageA} args={[coneGeo, leafMatA, PINES]} matrixAutoUpdate={false} />
      <instancedMesh ref={foliageB} args={[coneGeo, leafMatB, PINES]} matrixAutoUpdate={false} />
    </group>
  )
}

/* ─────────── inside-arena obstacle rocks (with glow moss) ─────────── */

const RING_COLORS = ['#22d3ee', '#39ff6e', '#ffb020', '#f472b6']

function ObstacleRocks() {
  return (
    <>
      {OBSTACLES.map((o, i) => (
        <group key={i} position={[o.x, 0, o.z]}>
          <mesh position-y={o.r * 0.45} rotation-y={i * 1.3}>
            <dodecahedronGeometry args={[o.r, 0]} />
            <meshStandardMaterial color="#233042" roughness={0.9} flatShading />
          </mesh>
          <mesh position-y={0.06} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[o.r * 0.92, o.r * 1.25, 20]} />
            <meshBasicMaterial color={RING_COLORS[i % RING_COLORS.length]} transparent opacity={0.32} side={DoubleSide} />
          </mesh>
        </group>
      ))}
    </>
  )
}

/* ─────────── scattered outdoor boulders ─────────── */

const BOULDERS = 22

function Boulders() {
  const ref = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Matrix4(), [])

  const placements = useMemo(
    () =>
      Array.from({ length: BOULDERS }, () => {
        const a = Math.random() * Math.PI * 2
        const r = rand(ARENA_RADIUS + 4.5, 60)
        const s = rand(0.5, 2.2)
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, s }
      }),
    [],
  )

  useLayoutEffect(() => {
    const im = ref.current
    if (!im) return
    placements.forEach((p, i) => {
      setInstance(dummy, p.x, p.s * 0.35, p.z, p.s, p.s * 0.8, p.s, Math.random() * 3)
      im.setMatrixAt(i, dummy)
    })
    im.instanceMatrix.needsUpdate = true
  }, [placements, dummy])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, BOULDERS]} matrixAutoUpdate={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#232c44" roughness={1} flatShading />
    </instancedMesh>
  )
}

/* ─────────── floating islands ─────────── */

const ISLANDS = [
  { pos: [-46, 17, -34], s: 3.2, crystal: '#39ff6e' },
  { pos: [52, 21, -44], s: 2.4, crystal: '#22d3ee' },
  { pos: [40, 15, 48], s: 2.8, crystal: '#f472b6' },
  { pos: [-56, 24, 36], s: 2.1, crystal: '#ffb020' },
] as const

function FloatingIslands() {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.children.forEach((child, i) => {
      child.position.y = ISLANDS[i].pos[1] + Math.sin(clock.elapsedTime * 0.5 + i * 2.1) * 0.9
      child.rotation.y = clock.elapsedTime * 0.05 + i
    })
  })

  return (
    <group ref={group}>
      {ISLANDS.map(({ pos, s, crystal }, i) => (
        <group key={i} position={[pos[0], pos[1], pos[2]]}>
          <mesh>
            <dodecahedronGeometry args={[s, 0]} />
            <meshStandardMaterial color="#1a2340" roughness={1} flatShading />
          </mesh>
          {/* grass cap */}
          <mesh position-y={s * 0.55}>
            <dodecahedronGeometry args={[s * 0.82, 0]} />
            <meshStandardMaterial color="#1f6b3a" roughness={1} flatShading />
          </mesh>
          {/* glowing crystal underneath */}
          <mesh position-y={-s * 0.9} rotation-x={Math.PI}>
            <coneGeometry args={[s * 0.3, s * 0.9, 5]} />
            <meshStandardMaterial color="#101425" emissive={crystal} emissiveIntensity={1.8} flatShading />
          </mesh>
          {/* mini pine on top */}
          <mesh position-y={s * 1.35}>
            <coneGeometry args={[s * 0.42, s * 1.1, 6]} />
            <meshStandardMaterial color="#177a3e" roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ─────────── fireflies / spores drifting ─────────── */

const FLIES = 130

const FLY_COLORS = ['#baff7a', '#7dd3fc', '#ffb020', '#f9a8d4']

function Fireflies() {
  const ref = useRef<Points>(null)

  const geo = useMemo(() => {
    const g = new BufferGeometry()
    const arr = new Float32Array(FLIES * 3)
    const cols = new Float32Array(FLIES * 3)
    const c = new Color()
    for (let i = 0; i < FLIES; i++) {
      const a = Math.random() * Math.PI * 2
      const r = rand(6, ARENA_RADIUS + 20)
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = rand(0.4, 7)
      arr[i * 3 + 2] = Math.sin(a) * r
      c.set(FLY_COLORS[i % FLY_COLORS.length])
      cols[i * 3] = c.r
      cols[i * 3 + 1] = c.g
      cols[i * 3 + 2] = c.b
    }
    g.setAttribute('position', new BufferAttribute(arr, 3))
    g.setAttribute('color', new BufferAttribute(cols, 3))
    return g
  }, [])

  const seeds = useMemo(() => Array.from({ length: FLIES }, () => rand(0, 100)), [])

  const mat = useMemo(
    () =>
      new PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const attr = geo.attributes.position as BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < FLIES; i++) {
      arr[i * 3] += Math.sin(t * 0.7 + seeds[i]) * 0.004
      arr[i * 3 + 1] += Math.cos(t * 0.5 + seeds[i] * 1.3) * 0.003
      arr[i * 3 + 2] += Math.cos(t * 0.6 + seeds[i] * 0.7) * 0.004
    }
    attr.needsUpdate = true
    if (ref.current) (ref.current.material as PointsMaterial).opacity = 0.55 + Math.sin(t * 1.4) * 0.2
  })

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />
}

/* ─────────── ground tone patches ─────────── */

function GroundPatches() {
  const patches = useMemo(
    () =>
      Array.from({ length: 10 }, () => {
        const a = Math.random() * Math.PI * 2
        const r = rand(5, ARENA_RADIUS - 6)
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, s: rand(2.5, 7), o: rand(0.05, 0.13) }
      }),
    [],
  )
  return (
    <>
      {patches.map((p, i) => (
        <mesh key={i} position={[p.x, 0.005 + i * 0.001, p.z]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[p.s, 18]} />
          <meshBasicMaterial
            color={['#12314f', '#14203c', '#0f2d3a', '#1b1442'][i % 4]}
            transparent
            opacity={p.o}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}

export default function Scenery() {
  return (
    <group>
      <SkyDome />
      <Moon />
      <Mountains />
      <Pines />
      <Boulders />
      <FloatingIslands />
      <Fireflies />
      <GroundPatches />
      <ObstacleRocks />
    </group>
  )
}
