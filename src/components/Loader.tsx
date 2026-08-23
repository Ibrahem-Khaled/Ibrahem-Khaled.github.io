import { useEffect, useState } from 'react'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 800)
    return () => window.clearTimeout(timer)
  }, [])

  if (gone) return null

  return (
    <div
      className={`loader-overlay ${hidden ? 'hidden' : ''}`}
      role="status"
      aria-label="Loading"
      onTransitionEnd={() => {
        if (hidden) setGone(true)
      }}
    >
      <p
        className="font-mono text-sm tracking-[0.25em]"
        style={{ color: 'var(--accent)', direction: 'ltr' }}
      >
        IK — PORTFOLIO<span className="cursor-blink" />
      </p>
      <div className="loader-bar">
        <span />
      </div>
    </div>
  )
}
