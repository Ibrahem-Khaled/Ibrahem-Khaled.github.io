import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = ref.current
    if (!glow) return
    if (window.innerWidth < 768) return

    let mouseX = 0
    let mouseY = 0
    let glowX = 0
    let glowY = 0
    let raf = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const updateGlow = () => {
      glowX += (mouseX - glowX) * 0.08
      glowY += (mouseY - glowY) * 0.08
      glow.style.left = `${glowX}px`
      glow.style.top = `${glowY}px`
      raf = requestAnimationFrame(updateGlow)
    }

    document.addEventListener('mousemove', onMouseMove)
    updateGlow()

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
