/* ── BUG WARS · page shell ── */

import { Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ui } from '../../data/ui'
import GameCanvas from '../../game/bugwars/GameCanvas'
import Hud from '../../game/bugwars/Hud'
import { GameOverScreen, MenuScreen, PauseScreen } from '../../game/bugwars/Screens'
import { useGame } from '../../game/bugwars/store'
import { stopMusic } from '../../game/bugwars/audio'
import '../../game/bugwars/bugwars.css'

function Chrome() {
  const { lang } = useApp()
  const t = ui[lang]
  return (
    <Link
      to="/games"
      className="absolute top-4 left-1/2 z-40 -translate-x-1/2 rounded border border-white/15 bg-black/45 px-3 py-1 font-mono text-xs text-white/60 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
    >
      ← {t.backHome}
    </Link>
  )
}

export default function BugWars() {
  const { lang } = useApp()
  const phase = useGame((s) => s.phase)

  /* auto-pause when tab hidden */
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && useGame.getState().phase === 'playing') {
        document.exitPointerLock()
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])

  /* block page scroll while in battle */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      stopMusic()
    }
  }, [])

  return (
    <main className="fixed inset-0 z-[60] bg-[#05060e]" aria-label="BUG WARS game">
      <Suspense fallback={null}>
        <GameCanvas />
      </Suspense>
      <Hud />
      {phase === 'menu' && <MenuScreen lang={lang} />}
      {phase === 'paused' && <PauseScreen lang={lang} />}
      {phase === 'over' && <GameOverScreen lang={lang} />}
      <Chrome />
    </main>
  )
}
