import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

export default function CountUp({
  value,
  suffix = '',
  className = '',
  pad = false,
}: {
  value: number
  suffix?: string
  className?: string
  pad?: boolean
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 1800

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * ease))
      if (progress < 1) raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  const text = pad ? String(display).padStart(2, '0') : String(display)

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  )
}
