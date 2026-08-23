/* ── BUG WARS · menu / pause / game-over screens ── */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from './store'
import { requestLock, startRun, toggleMuteAndApply } from './flow'
import { BUGS, BOSS_EVERY } from './constants'

function isTouchOnly() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-hover: hover)').matches
}

export function MenuScreen({ lang }: { lang: 'en' | 'ar' }) {
  const best = useGame((s) => s.best)
  const muted = useGame((s) => s.muted)
  const touch = useMemo(isTouchOnly, [])
  const t = STRINGS[lang]

  const start = () => {
    startRun()
    requestLock()
  }

  return (
    <div className="bw-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bw-scanlines" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        <div className="bw-glitch font-display text-5xl font-black tracking-tight sm:text-7xl" data-text="BUG WARS" dir="ltr">
          BUG WARS
        </div>
        <p className="mt-3 font-mono text-sm tracking-[0.25em] text-white/60" dir="ltr">
          &gt;_ حرب ضد الباجات · DEFEND THE MAINFRAME
        </p>

        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/75">{t.tagline}</p>

        {/* bug dossier */}
        <div className="mt-7 grid grid-cols-2 gap-2 text-left sm:grid-cols-3" dir="ltr">
          {(Object.keys(BUGS) as (keyof typeof BUGS)[]).map((k) => (
            <div key={k} className="rounded border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: BUGS[k].emissive }} />
              <span className="ml-2 font-mono text-xs text-white/85">{BUGS[k].name}</span>
              <div className="mt-0.5 pl-4.5 font-mono text-[10px] text-white/45">
                {k === 'legacy' ? `BOSS · EVERY ${BOSS_EVERY} WAVES` : `${BUGS[k].hp} HP`}
              </div>
            </div>
          ))}
          <div className="rounded border border-amber-400/25 bg-amber-400/5 px-3 py-2 backdrop-blur-sm" dir="ltr">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="ml-2 font-mono text-xs text-amber-200">☕ CAFFEINE</span>
            <div className="mt-0.5 pl-4.5 font-mono text-[10px] text-amber-200/50">FIRE + SPEED BUFF</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={start} className="btn-accent px-10 py-3! text-base! font-bold">
            {t.start}
          </button>
          <button
            type="button"
            onClick={toggleMuteAndApply}
            className="rounded border border-white/20 px-4 py-3 font-mono text-sm text-white/70 transition-colors hover:border-white/50 hover:text-white"
            dir="ltr"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <Link to="/games" className="px-2 py-3 font-mono text-sm text-white/55 underline-offset-4 hover:text-white hover:underline">
            {t.exit}
          </Link>
        </div>

        {best > 0 && (
          <p className="mt-4 font-mono text-xs tracking-widest text-white/45" dir="ltr">
            HIGH SCORE: {best.toLocaleString('en-US')}
          </p>
        )}

        <div className="mx-auto mt-7 grid max-w-lg grid-cols-2 gap-x-6 gap-y-1.5 text-left sm:grid-cols-3" dir="ltr">
          {CONTROLS.map(([key, act]) => (
            <div key={key} className="flex items-center gap-2 font-mono text-[11px] text-white/60">
              <kbd className="min-w-9 rounded border border-white/25 bg-white/10 px-1.5 py-0.5 text-center text-white/90">{key}</kbd>
              {act}
            </div>
          ))}
        </div>

        {touch && (
          <p className="mx-auto mt-6 max-w-sm rounded border border-red-400/40 bg-red-500/10 px-4 py-2.5 font-mono text-xs leading-relaxed text-red-300">
            {t.touchWarning}
          </p>
        )}
      </div>
    </div>
  )
}

const CONTROLS: [string, string][] = [
  ['WASD', 'Move'],
  ['MOUSE', 'Aim'],
  ['LMB', 'Fire'],
  ['RMB / G', 'Grenade'],
  ['SHIFT', 'Sprint'],
  ['SPACE', 'Jump'],
  ['R', 'Reload'],
]

export function PauseScreen({ lang }: { lang: 'en' | 'ar' }) {
  const t = STRINGS[lang]
  return (
    <div className="bw-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative z-10 text-center">
        <div className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl">{t.paused}</div>
        <p className="mt-2 font-mono text-xs tracking-[0.3em] text-white/50" dir="ltr">
          PROCESS SUSPENDED
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => requestLock()} className="btn-accent px-8 py-3! font-bold">
            {t.resume}
          </button>
          <button
            type="button"
            onClick={() => {
              startRun()
              requestLock()
            }}
            className="bw-btn-ghost"
          >
            {t.restart}
          </button>
          <Link to="/games" className="bw-btn-ghost">
            {t.exit}
          </Link>
        </div>
      </div>
    </div>
  )
}

export function GameOverScreen({ lang }: { lang: 'en' | 'ar' }) {
  const score = useGame((s) => s.score)
  const best = useGame((s) => s.best)
  const kills = useGame((s) => s.kills)
  const wave = useGame((s) => s.wave)
  const t = STRINGS[lang]
  const newBest = score >= best && score > 0

  return (
    <div className="bw-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bw-scanlines" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <div
          className="font-mono text-sm tracking-[0.35em] text-red-400"
          dir="ltr"
        >
          FATAL EXCEPTION CAUGHT
        </div>
        <h2 className="mt-1 font-display text-4xl font-black tracking-tight text-white sm:text-5xl" dir="ltr">
          SEGFAULT 💀
        </h2>
        <p className="mt-2 text-sm text-white/65">{t.overSub}</p>

        {newBest && (
          <div className="mx-auto mt-4 inline-block rounded border border-lime-400/60 bg-lime-400/10 px-4 py-1 font-mono text-xs tracking-widest text-lime-300" dir="ltr">
            ★ NEW HIGH SCORE ★
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-2" dir="ltr">
          <Stat label="SCORE" value={score.toLocaleString('en-US')} />
          <Stat label="WAVES" value={String(wave)} />
          <Stat label="KILLS" value={String(kills)} />
        </div>
        <p className="mt-2 font-mono text-[11px] tracking-widest text-white/40" dir="ltr">
          BEST: {best.toLocaleString('en-US')}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              startRun()
              requestLock()
            }}
            className="btn-accent px-8 py-3! font-bold"
          >
            {t.retry}
          </button>
          <Link to="/games" className="bw-btn-ghost">
            {t.exit}
          </Link>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/12 bg-black/45 px-2 py-3 backdrop-blur-sm">
      <div className="font-mono text-[10px] tracking-widest text-white/45">{label}</div>
      <div className="mt-0.5 font-mono text-xl font-bold text-white">{value}</div>
    </div>
  )
}

const STRINGS = {
  en: {
    tagline: 'SyntaxErrors, NullPointers and Memory Leaks are storming the mainframe. Grab the debugger and squash them all.',
    start: '▶ START THE WAR',
    exit: 'Back to games',
    paused: 'PAUSED',
    resume: '▶ Resume',
    restart: '↻ Restart',
    overSub: 'The bugs overran your process. Reboot and try again?',
    retry: '↻ RUN AGAIN',
    touchWarning: '⚠ This battle needs a keyboard & mouse — open on desktop for the full experience.',
  },
  ar: {
    tagline: 'الـ SyntaxErrors والـ NullPointers والـ Memory Leaks بيهاجموا الماين فريم. خد الـ Debugger وابيدّهم كلهم.',
    start: '▶ ابدأ الحرب',
    exit: 'رجوع للألعاب',
    paused: 'إيقاف مؤقت',
    resume: '▶ استكمال',
    restart: '↻ إعادة',
    overSub: 'الباجات دمّرت العملية. تعمل Reboot وتحاول تاني؟',
    retry: '↻ هجوم جديد',
    touchWarning: '⚠ المعركة محتاجة كيبورد وماوس — افتح من الكمبيوتر للتجربة الكاملة.',
  },
} as const
