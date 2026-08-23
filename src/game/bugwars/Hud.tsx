/* ── BUG WARS · in-game HUD overlay ── */

import { useGame } from './store'
import { toggleMuteAndApply } from './flow'

function Crosshair() {
  const hitAt = useGame((s) => s.hitAt)
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="bw-cross">
        <span />
        <span />
        <span />
        <span />
      </div>
      {hitAt > 0 && (
        <div key={hitAt} className="bw-hitmark" aria-hidden="true">
          ✕
        </div>
      )}
    </div>
  )
}

function DamageVignette() {
  const hurtAt = useGame((s) => s.hurtAt)
  if (hurtAt === 0) return null
  return <div key={hurtAt} className="bw-vignette" aria-hidden="true" />
}

function HpBar() {
  const hp = useGame((s) => s.hp)
  const maxHp = useGame((s) => s.maxHp)
  const coffeeT = useGame((s) => s.coffeeT)
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100))
  const low = pct <= 30

  return (
    <div className="absolute bottom-5 left-5 w-64 max-w-[42vw]">
      <div className="mb-1 flex items-end justify-between font-mono text-[11px] tracking-widest text-white/70">
        <span>INTEGRITY</span>
        <span className={low ? 'bw-danger blink' : ''}>{Math.ceil(hp)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-sm border border-white/25 bg-black/55">
        <div
          className={`h-full transition-all duration-200 ${low ? 'bg-red-500' : 'bw-accent-bg'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {coffeeT >= 0 && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-sm border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] text-amber-300">
          ☕ CAFFEINE ×{coffeeT}s
        </div>
      )}
    </div>
  )
}

function AmmoPanel() {
  const ammo = useGame((s) => s.ammo)
  const magSize = useGame((s) => s.magSize)
  const reloading = useGame((s) => s.reloading)
  const grenades = useGame((s) => s.grenades)

  return (
    <div className="absolute right-5 bottom-5 text-right">
      <div className="flex items-end justify-end gap-1" dir="ltr">
        {Array.from({ length: magSize }, (_, i) => (
          <span
            key={i}
            className={`inline-block h-4 w-[7px] rounded-t-sm ${
              i < ammo ? 'bw-accent-bg' : 'bg-white/15'
            }`}
          />
        ))}
      </div>
      <div className="mt-1.5 font-mono text-xs tracking-widest text-white/75" dir="ltr">
        {reloading ? (
          <span className="text-amber-300">RELOADING…</span>
        ) : (
          <>
            DEBUGGER <span className="bw-accent">{ammo}</span>/{magSize}
          </>
        )}
      </div>
      <div className="mt-0.5 font-mono text-xs tracking-widest text-white/60" dir="ltr">
        rm -rf GRENADES: [<span className="text-red-400">{'▮'.repeat(grenades)}</span>] ({grenades})
      </div>
    </div>
  )
}

function ScorePanel() {
  const score = useGame((s) => s.score)
  const best = useGame((s) => s.best)
  const kills = useGame((s) => s.kills)
  const comboMult = useGame((s) => s.comboMult)
  const killAt = useGame((s) => s.killAt)

  return (
    <div className="absolute top-4 right-5 text-right font-mono" dir="ltr">
      <div className="text-2xl leading-none font-bold tracking-wider text-white sm:text-3xl">
        {score.toLocaleString('en-US')}
      </div>
      <div className="mt-0.5 text-[11px] tracking-widest text-white/55">
        BEST {best.toLocaleString('en-US')} · KILLS {kills}
      </div>
      {comboMult > 1 && (
        <div key={killAt} className="bw-combo mt-1 inline-block">
          COMBO ×{comboMult}
        </div>
      )}
    </div>
  )
}

function WavePanel() {
  const wave = useGame((s) => s.wave)
  const bugsLeft = useGame((s) => s.bugsLeft)
  const intermission = useGame((s) => s.intermission)

  return (
    <div className="absolute top-4 left-5 font-mono" dir="ltr">
      <div className="text-xl leading-none font-bold tracking-widest text-white">
        WAVE <span className="bw-accent">{String(wave).padStart(2, '0')}</span>
      </div>
      <div className="mt-0.5 text-[11px] tracking-widest text-white/55">
        {intermission >= 0 ? `NEXT IN ${intermission}` : `BUGS LEFT ${bugsLeft}`}
      </div>
    </div>
  )
}

function BannerLayer() {
  const banner = useGame((s) => s.banner)
  if (!banner) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center px-4">
      <div
        key={`${banner.title}-${banner.sub ?? ''}`}
        className={`bw-banner ${banner.tone === 'boss' ? 'bw-banner-boss' : ''} ${banner.tone === 'clear' ? 'bw-banner-clear' : ''} ${banner.tone === 'buff' ? 'bw-banner-buff' : ''}`}
        dir="ltr"
      >
        <div className="bw-banner-title">{banner.title}</div>
        {banner.sub && <div className="bw-banner-sub">{banner.sub}</div>}
      </div>
    </div>
  )
}

function BossBar() {
  const bossHp = useGame((s) => s.bossHp)
  if (bossHp === null) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto w-80 max-w-[70vw] text-center">
      <div className="mb-1 font-mono text-[11px] tracking-[0.3em] text-red-300" dir="ltr">
        LEGACY_CODE.EXE
      </div>
      <div className="h-2 overflow-hidden border border-red-500/50 bg-black/60">
        <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${Math.max(0, bossHp * 100)}%` }} />
      </div>
    </div>
  )
}

export default function Hud() {
  const muted = useGame((s) => s.muted)
  const phase = useGame((s) => s.phase)
  if (phase !== 'playing') return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      <WavePanel />
      <ScorePanel />
      <BannerLayer />
      <BossBar />
      <Crosshair />
      <DamageVignette />
      <HpBar />
      <AmmoPanel />

      <div className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          onClick={toggleMuteAndApply}
          className="rounded border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-xs text-white/70 backdrop-blur hover:border-white/50 hover:text-white"
          dir="ltr"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇 MUTED' : '🔊 SOUND'}
        </button>
        <span className="font-mono text-[10px] tracking-widest text-white/35" dir="ltr">
          ESC = PAUSE
        </span>
      </div>

      {/* scanlines */}
      <div className="bw-scanlines" aria-hidden="true" />
    </div>
  )
}
