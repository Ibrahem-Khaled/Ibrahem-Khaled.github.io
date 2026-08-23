import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { ABOUT_CHIPS, HEADERS, LINKS } from '../data/content'
import { Icon } from './Icons'
import CountUp from './CountUp'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function About() {
  const { lang } = useApp()
  const t = ui[lang]

  const infoRows = [
    { label: t.personalLocation, value: lang === 'en' ? 'Egypt 🇪🇬' : 'مصر 🇪🇬' },
    { label: t.personalEmail, value: LINKS.email, href: `mailto:${LINKS.email}` },
    { label: t.personalGithub, value: 'Ibrahem-Khaled', href: LINKS.github },
    {
      label: t.personalLinkedin,
      value: 'ibrahim-khalid',
      href: LINKS.linkedin,
    },
  ]

  return (
    <section id="about" className="section-alt py-20 md:py-28" aria-label="About Me">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="01" kicker={HEADERS.about.kicker} title={HEADERS.about.title} />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: portrait */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-[400px]">
              <div
                className="absolute -inset-3 rounded-3xl border border-line"
                style={{ transform: 'rotate(-2deg)' }}
                aria-hidden="true"
              />
              <img
                src="assets/ibrahem-main.jpg"
                alt="About Ibrahem Khaled"
                className="relative w-full rounded-2xl object-cover"
                style={{ aspectRatio: '4/5', objectPosition: 'top' }}
                loading="lazy"
                decoding="async"
              />
              {/* corner chip */}
              <span className="absolute bottom-4 end-4 rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-wider" style={{ background: 'var(--bg)', border: '1px solid var(--surface-border)' }}>
                EGY · REMOTE
              </span>
            </div>
          </Reveal>

          {/* Right: text */}
          <div>
            <Reveal>
              <p className="text-base leading-relaxed text-muted-ink sm:text-lg">{HEADERS.aboutP1[lang]}</p>
              <p className="mt-5 text-base leading-relaxed text-muted-ink sm:text-lg">{HEADERS.aboutP2[lang]}</p>
            </Reveal>

            {/* Info rows */}
            <Reveal delay={0.1}>
              <dl className="mt-9 grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {infoRows.map(row => (
                  <div key={row.label} className="flex flex-col gap-0.5">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-ink" style={lang === 'ar' ? { fontFamily: undefined } : undefined}>
                      {row.label}
                    </dt>
                    <dd className="text-sm font-medium">
                      {row.href ? (
                        <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="transition-colors hover:text-accent">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Chips + CTA */}
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                {ABOUT_CHIPS.map(chip => (
                  <div key={chip.labelKey} className="flex items-baseline gap-2">
                    <p className="stat-num text-xl sm:text-2xl">
                      <CountUp value={chip.value} suffix={chip.suffix} pad />
                    </p>
                    <p className="text-xs text-muted-ink">{t[chip.labelKey]}</p>
                  </div>
                ))}
              </div>

              <a href={LINKS.cv} download className="btn-accent mt-8">
                <Icon name="download" className="w-4 h-4" />
                {t.downloadCV}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
