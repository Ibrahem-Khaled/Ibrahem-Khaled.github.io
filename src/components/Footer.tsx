import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { HEADERS, SOCIALS, type SocialIcon } from '../data/content'
import { BrandIcon } from './BrandIcons'

const FOOTER_ICONS: SocialIcon[] = ['github', 'linkedin', 'facebook', 'x']

export default function Footer() {
  const { lang } = useApp()
  const t = ui[lang]

  const quickLinks = [
    { id: 'about', label: t.quickAbout },
    { id: 'skills', label: t.quickSkills },
    { id: 'projects', label: t.quickProjects },
    { id: 'contact', label: t.quickContact },
  ] as const

  return (
    <footer className="border-t border-line pt-14 pb-8" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Giant wordmark */}
        <p
          className="select-none font-display font-bold leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 6.5rem)' }}
          aria-hidden="true"
        >
          IBRAHEM<span className="text-accent">.</span>
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px color-mix(in srgb, var(--text-primary) 45%, transparent)',
            }}
          >
            KHALED
          </span>
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {/* Blurb */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="logo-mark">IK</span>
              <span className="font-display text-sm font-semibold">
                {lang === 'en' ? 'Ibrahem Khaled' : 'إبراهيم خالد'}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-ink">{HEADERS.footerAbout[lang]}</p>
          </div>

          {/* Quick links */}
          <nav aria-label={t.quickLinks}>
            <h3 className="eyebrow mb-4 text-muted-ink!">{t.quickLinks}</h3>
            <ul className="space-y-2.5 text-sm text-muted-ink" role="list">
              {quickLinks.map(link => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={e => {
                      e.preventDefault()
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div>
            <h3 className="eyebrow mb-4 text-muted-ink!">{t.connect}</h3>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.filter(s => FOOTER_ICONS.includes(s.icon)).map(social => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="icon-btn h-10! w-10!"
                >
                  <BrandIcon name={social.icon} className="w-[17px] h-[17px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] tracking-wide text-muted-ink sm:flex-row" style={lang === 'ar' ? { fontFamily: "'Tajawal',sans-serif", fontSize: '0.75rem' } : undefined}>
          <p>© {new Date().getFullYear()}{t.rights}</p>
          <p>{t.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}
