import { useEffect, useRef, useState } from 'react'

/**
 * Global fixed background image with a whisper of parallax.
 * If the image file is missing, this layer hides itself gracefully.
 */
export default function BackgroundImage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  /* Gentle GPU parallax — smoothed, respects reduced-motion */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let current = 0
    let active = !document.hidden

    const tick = () => {
      if (!active) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const target = max > 0 ? window.scrollY / max : 0
      current += (target - current) * 0.06 // eased follow
      const wrap = wrapRef.current
      if (wrap) {
        const shift = (current - 0.5) * -46
        wrap.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(1.09)`
      }
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (document.hidden) {
        active = false
        cancelAnimationFrame(raf)
      } else {
        active = true
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      active = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (failed) return null

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 -z-10 overflow-hidden will-change-transform"
      style={{ transform: 'scale(1.09)' }}
      aria-hidden="true"
    >
      <img
        src="assets/hero-bg.jpg"
        alt=""
        className="h-full w-full object-cover"
        decoding="async"
        onError={() => setFailed(true)}
      />

      {/* Global legibility veil */}
      <div
        className="absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--bg) 68%, transparent)' }}
      />
      {/* Vignette — darker edges & bottom for readable content zones */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 36%, transparent 26%, color-mix(in srgb, var(--bg) 88%, transparent) 100%)',
        }}
      />
    </div>
  )
}
