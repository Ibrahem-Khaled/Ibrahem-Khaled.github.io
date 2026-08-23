/* ── BUG WARS · landing-page teaser ── */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../game/bugwars/bugwars.css'

const ERRORS = [
  'NullPointerException at Mainframe.java:42',
  'MemoryLeak detected → heap @ 98%',
  'SyntaxError: unexpected token "🔥"',
  'RaceCondition: 2 threads mutating state…',
  'InfiniteLoop spinning… CPU 100%',
  'SEGFAULT in production. again.',
]

function useErrorStream() {
  const [lines, setLines] = useState<{ id: number; text: string }[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    const push = () => {
      const text = ERRORS[Math.floor(Math.random() * ERRORS.length)]
      setLines((prev) => [...prev.slice(-4), { id: idRef.current++, text }])
    }
    push()
    push()
    const iv = window.setInterval(push, 1400)
    return () => window.clearInterval(iv)
  }, [])

  return lines
}

export default function BugWarsTeaser() {
  const { lang } = useApp()
  const lines = useErrorStream()
  const ar = lang === 'ar'

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8" aria-label="BUG WARS game teaser">
      <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-10">
        {/* glow backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(700px 320px at 85% 0%, rgba(57,255,110,0.10), transparent 65%), radial-gradient(500px 300px at 8% 100%, rgba(255,77,94,0.08), transparent 60%)',
          }}
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-xs tracking-[0.35em]" style={{ color: '#ff4d5e' }} dir="ltr">
              ⚠ CRITICAL ALERT · MAINFRAME UNDER ATTACK
            </p>

            <h2
              className="bw-glitch mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl"
              data-text={ar ? 'حرب الباجات' : 'BUG WARS'}
            >
              {ar ? 'حرب الباجات' : 'BUG WARS'}
            </h2>

            <p className={`mt-4 max-w-xl leading-relaxed text-muted-ink ${ar ? '' : 'font-mono text-sm'}`}>
              {ar ? (
                <>
                  الباجات زحف على الماين فريم. خُد الـ Debugger، ارمي{' '}
                  <code dir="ltr" className="bw-accent">rm -rf</code>، واصمد قدام مواجات من
                  SyntaxErrors وMemory Leaks… وزعيم اسمه LEGACY_CODE.
                </>
              ) : (
                <>
                  Bugs are storming the mainframe. Grab your Debugger, throw{' '}
                  <code dir="ltr" className="bw-accent">rm -rf</code> grenades, and survive waves of
                  SyntaxErrors, Memory Leaks… and a boss named LEGACY_CODE.
                </>
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/games/bug-wars" className="btn-accent px-8! py-3! text-base! font-bold">
                {ar ? '🎮 ادخل المعركة' : '▶ ENTER THE BATTLE'}
              </Link>
              <span className="font-mono text-xs tracking-widest text-white/40" dir="ltr">
                3D FPS · WEBGL · NO DOWNLOADS
              </span>
            </div>
          </div>

          {/* fake crashing terminal */}
          <Link
            to="/games/bug-wars"
            aria-hidden="true"
            tabIndex={-1}
            className="group relative block w-full max-w-md overflow-hidden rounded-xl border border-lime-400/25 bg-black/70 shadow-[0_0_50px_rgba(57,255,110,0.12)] transition-transform duration-300 hover:-translate-y-1 lg:w-[26rem]"
            dir="ltr"
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <span className="ml-2 font-mono text-[11px] text-white/45">kernel_panic.log</span>
              <span className="ml-auto animate-pulse font-mono text-[10px] text-red-400">● REC</span>
            </div>
            <div className="h-44 space-y-1.5 p-4 font-mono text-[12px] leading-relaxed">
              {lines.map((l, i) => (
                <div
                  key={l.id}
                  className="text-red-300 transition-opacity"
                  style={{ opacity: 0.35 + i * 0.18 }}
                >
                  <span className="text-white/30">$</span> ERROR: {l.text}
                </div>
              ))}
              <div className="pt-1 text-lime-300">
                &gt; SOLUTION: <span className="animate-pulse">▌BUG_WARS.EXE — CLICK TO LAUNCH</span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_2px,rgba(0,0,0,0.22)_2px_4px)]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
