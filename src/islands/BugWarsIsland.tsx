import { Suspense, useEffect } from 'react'
import GameCanvas from '../game/bugwars/GameCanvas'
import Hud from '../game/bugwars/Hud'
import { GameOverScreen, MenuScreen, PauseScreen } from '../game/bugwars/Screens'
import { useGame } from '../game/bugwars/store'
import { stopMusic } from '../game/bugwars/audio'
import '../game/bugwars/bugwars.css'

interface Props {
  lang?: 'en' | 'ar'
  backHref: string
}

export default function BugWarsIsland({ lang = 'en', backHref }: Props) {
  const phase = useGame((s) => s.phase)

  useEffect(() => {
    const onHide = () => {
      if (document.hidden && useGame.getState().phase === 'playing') {
        document.exitPointerLock()
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      stopMusic()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#05060e]" role="application" aria-label="BUG WARS 3D FPS">
      <Suspense fallback={null}>
        <GameCanvas />
      </Suspense>
      <Hud />
      {phase === 'menu' && <MenuScreen lang={lang} backHref={backHref} />}
      {phase === 'paused' && <PauseScreen lang={lang} backHref={backHref} />}
      {phase === 'over' && <GameOverScreen lang={lang} backHref={backHref} />}
      <a
        href={backHref}
        className="absolute top-4 left-1/2 z-40 -translate-x-1/2 border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs text-white/75 backdrop-blur-xs transition-colors hover:border-white/50 hover:text-white"
      >
        ← {lang === 'en' ? 'Back to Lab' : 'العودة إلى المختبر'}
      </a>
    </div>
  )
}
