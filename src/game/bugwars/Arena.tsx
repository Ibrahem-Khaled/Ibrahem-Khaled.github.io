/* ── BUG WARS · arena environment ── */

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Stars } from '@react-three/drei'
import {
  DoubleSide,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  Group,
} from 'three'
import { ARENA_RADIUS } from './constants'

const PILLARS = 26

export default function Arena() {
  const coreLight = useRef<PointLight>(null)
  const core = useRef<Mesh>(null)
  const ringA = useRef<Group>(null)
  const ringB = useRef<Group>(null)
  const pillars = useRef<InstancedMesh>(null)

  const pillarMat = useMemo(() => new MeshBasicMaterial({ color: '#1c2a52' }), [])
  const dummy = useMemo(() => new Matrix4(), [])

  useLayoutEffect(() => {
    const im = pillars.current
    if (!im) return
    for (let i = 0; i < PILLARS; i++) {
      const a = (i / PILLARS) * Math.PI * 2
      const r = ARENA_RADIUS + 1.6
      dummy.makeTranslation(Math.cos(a) * r, 2.2, Math.sin(a) * r)
      im.setMatrixAt(i, dummy)
    }
    im.instanceMatrix.needsUpdate = true
  }, [dummy])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const pulse = 0.9 + Math.sin(t * 2.2) * 0.35
    if (coreLight.current) coreLight.current.intensity = 14 * pulse
    if (core.current) {
      core.current.rotation.y = t * 0.4
      core.current.rotation.z = Math.sin(t * 0.7) * 0.12
    }
    if (ringA.current) ringA.current.rotation.y = -t * 0.55
    if (ringB.current) ringB.current.rotation.y = t * 0.35
  })

  return (
    <group>
      <color attach="background" args={['#05060e']} />
      <fog attach="fog" args={['#0b1026', 26, 95]} />

      <ambientLight intensity={0.3} color="#9fb8ff" />
      <hemisphereLight args={['#1c2a4a', '#0a0f05', 0.55]} />
      <directionalLight position={[12, 22, 8]} intensity={0.55} color="#dbe7ff" />

      {/* floor */}
      <Grid
        position={[0, 0.01, 0]}
        args={[ARENA_RADIUS * 2.4, ARENA_RADIUS * 2.4]}
        cellSize={1.75}
        cellThickness={0.65}
        cellColor="#16223e"
        sectionSize={7}
        sectionThickness={1.15}
        sectionColor="#22d3ee"
        fadeDistance={105}
        fadeStrength={1.4}
        followCamera={false}
        infiniteGrid
      />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02}>
        <circleGeometry args={[ARENA_RADIUS + 3, 64]} />
        <meshStandardMaterial color="#070b18" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* boundary glow ring + cage */}
      <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[ARENA_RADIUS - 0.28, ARENA_RADIUS, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[ARENA_RADIUS + 0.05, ARENA_RADIUS + 0.05, 3.2, 72, 1, true]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.07} side={DoubleSide} wireframe />
      </mesh>

      {/* perimeter pillars */}
      <instancedMesh ref={pillars} args={[undefined, undefined, PILLARS]} matrixAutoUpdate={false}>
        <boxGeometry args={[0.55, 4.4, 0.55]} />
        <primitive object={pillarMat} attach="material" />
      </instancedMesh>

      {/* mainframe core */}
      <group>
        <mesh ref={core} position={[0, 2.4, 0]}>
          <octahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial
            color="#07230d"
            emissive="#39ff6e"
            emissiveIntensity={1.4}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.42, 0.62, 1.8, 6]} />
          <meshStandardMaterial color="#0a1428" roughness={0.6} metalness={0.5} />
        </mesh>
        <pointLight ref={coreLight} position={[0, 2.6, 0]} color="#39ff6e" distance={26} intensity={12} />

        <group ref={ringA} position={[0, 2.4, 0]} rotation-x={Math.PI / 2}>
          <mesh>
            <torusGeometry args={[1.9, 0.05, 8, 48]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
          </mesh>
        </group>
        <group ref={ringB} position={[0, 2.4, 0]} rotation-x={Math.PI / 2.4}>
          <mesh>
            <torusGeometry args={[2.45, 0.03, 8, 48]} />
            <meshBasicMaterial color="#f472b6" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>

      <Stars radius={140} depth={40} count={2200} factor={3.2} saturation={0} fade speed={0.6} />
    </group>
  )
}
