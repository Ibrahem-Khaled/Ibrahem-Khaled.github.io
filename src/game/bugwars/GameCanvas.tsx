/* ── BUG WARS · canvas composition + per-frame systems orchestration ── */

import { Canvas, useFrame } from '@react-three/fiber'
import { PLAYER_EYE } from './constants'
import Arena from './Arena'
import BugSwarm from './BugSwarm'
import Player from './Player'
import Scenery from './Scenery'
import { GrenadeMeshes, ParticleField, PickupMeshes, Shockwaves, Tracers } from './Effects'
import { explodeGrenades, updateBugs, updatePickups, updateWaves } from './systems'
import { useGame } from './store'
import { bugs } from './world'

function Systems() {
  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const st = useGame.getState()
    if (st.phase !== 'playing') return

    updateWaves(dt, true)
    updateBugs(dt, clock.elapsedTime)
    updatePickups(dt)
    explodeGrenades(dt)

    /* bugs-left counter (0 during intermission) */
    const remaining = st.intermission >= 0 ? 0 : bugs.length
    st.setBugsLeft(remaining)
  })
  return null
}

export default function GameCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 76, near: 0.05, far: 240, position: [0, PLAYER_EYE, 10] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#030704')
      }}
    >
      <Arena />
      <Scenery />
      <BugSwarm />
      <ParticleField />
      <Tracers />
      <Shockwaves />
      <GrenadeMeshes />
      <PickupMeshes />
      <Player />
      <Systems />
    </Canvas>
  )
}
