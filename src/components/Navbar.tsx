import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { SECTION_LINKS } from '../data/content'

export default function Navbar() {
  const { lang, theme, toggleLang, toggleTheme } = useApp()
  const t = ui[lang]
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveId(location.pathname === '/games' ? 'games' : '')
      return
    }
    const sections = SECTION_LINKS
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [location.pathname])

  const goToSection = (id: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
        120,
      )
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goHome = () => {
    setOpen(false)
    if (location.pathname !== '/') navigate('/')
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="site-nav-wrap">
      <header
        className={`site-nav ${scrolled ? 'scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <nav className="flex h-14 items-center justify-between gap-4 px-3 sm:px-4" aria-label="Main">
          {/* Logo */}
          <a
            href="#hero"
            onClick={e => {
              e.preventDefault()
              goHome()
            }}
            className="flex shrink-0 items-center gap-2.5 rounded-lg px-1 py-1"
            aria-label="Ibrahem Khaled — Home"
          >
            <span className="logo-mark">IK</span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
              <span>{lang === 'en' ? 'Ibrahem' : 'إبراهيم'}</span>
              <span className="text-accent">{lang === 'en' ? '.Khaled' : '.خالد'}</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 text-[13px] lg:flex" role="list">
            {SECTION_LINKS.map(link =>
              link.id === 'games' ? (
                <li key={link.id}>
                  <a
                    href="#/games"
                    onClick={e => {
                      e.preventDefault()
                      setOpen(false)
                      navigate('/games')
                    }}
                    className={`nav-link-pill block ${location.pathname.startsWith('/games') ? 'active' : ''}`}
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ) : (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={e => {
                      e.preventDefault()
                      goToSection(link.id)
                    }}
                    className={`nav-link-pill block ${
                      location.pathname === '/' && activeId === link.id ? 'active' : ''
                    }`}
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ),
            )}
          </ul>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.switchThemeAria}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted-ink transition-colors hover:border-accent hover:text-accent"
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleLang}
              aria-label={t.switchLangAria}
              className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-muted-ink transition-colors hover:border-accent hover:text-accent"
            >
              {t.langLabel}
            </button>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-label={t.openMenu}
              aria-expanded={open}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className={`h-0.5 w-5 bg-current transition-all ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-current transition-all ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <nav
          className={`mobile-menu lg:hidden ${open ? 'open' : ''}`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 border-t border-line px-4 py-4 text-sm text-muted-ink" role="list">
            {SECTION_LINKS.map(link =>
              link.id === 'games' ? (
                <li key={link.id}>
                  <a
                    href="#/games"
                    onClick={e => {
                      e.preventDefault()
                      setOpen(false)
                      navigate('/games')
                    }}
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-panel hover:text-fg"
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ) : (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={e => {
                      e.preventDefault()
                      goToSection(link.id)
                    }}
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-panel hover:text-fg"
                  >
                    {link.label[lang]}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      </header>
    </div>
  )
}
