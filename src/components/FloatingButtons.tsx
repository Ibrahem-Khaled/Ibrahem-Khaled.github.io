import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { LINKS } from '../data/content'
import { BrandIcon } from './BrandIcons'

export default function FloatingButtons() {
  const { lang } = useApp()
  const t = ui[lang]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t.scrollTop}
        className="fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300"
        style={{
          background: 'var(--accent)',
          color: 'var(--on-accent)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M12 19V5m0 0l-6 6m6-6l6 6" />
        </svg>
      </button>

      <a
        href={LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-float"
      >
        <BrandIcon name="whatsapp" className="w-6 h-6" />
      </a>
    </>
  )
}
