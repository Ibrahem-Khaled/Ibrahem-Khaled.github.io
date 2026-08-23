import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { HERO_STATS, LINKS } from '../data/content'
import { useTyping } from '../hooks/useTyping'
import { Icon } from './Icons'
import CountUp from './CountUp'

/* ── Terminal window (dev-flavoured hero visual) ── */
function TerminalCard() {
  const { lang, theme } = useApp()
  const t = ui[lang]

  return (
    <div className="terminal" dir="ltr">
      <div className="terminal-header">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#febc2e' }} />
        <span className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="ml-auto text-[11px] text-[#6b6b76]">~/portfolio — zsh</span>
      </div>

      <div className="terminal-body">
        <p>
          <span className="tk-prompt">$</span> <span className="tk-cmd">whoami</span>
        </p>
        <p className="tk-out">ibrahem_khaled</p>
        <p>&nbsp;</p>
        <p>
          <span className="tk-prompt">$</span> <span className="tk-cmd">cat ./profile.json</span>
        </p>
        <p><span className="tk-pun">{'{'}</span></p>
        <p>
          {'  '}<span className="tk-key">"role"</span><span className="tk-pun">:</span> <span className="tk-str">"senior_full_stack_dev"</span><span className="tk-pun">,</span>
        </p>
        <p>
          {'  '}<span className="tk-key">"experience"</span><span className="tk-pun">:</span> <span className="tk-val">"7+ years"</span><span className="tk-pun">,</span>
        </p>
        <p>
          {'  '}<span className="tk-key">"stack"</span><span className="tk-pun">:</span> <span className="tk-pun">[</span><span className="tk-str">"laravel"</span><span className="tk-pun">,</span> <span className="tk-str">"react"</span><span className="tk-pun">,</span> <span className="tk-str">"react_native"</span><span className="tk-pun">],</span>
        </p>
        <p>
          {'  '}<span className="tk-key">"theme"</span><span className="tk-pun">:</span> <span className="tk-str">"{theme}"</span><span className="tk-pun">,</span>
        </p>
        <p>
          {'  '}<span className="tk-key">"open_to_work"</span><span className="tk-pun">:</span> <span className="tk-val">true</span>
        </p>
        <p><span className="tk-pun">{'}'}</span></p>
        <p>
          <span className="tk-prompt">$</span> <span className="cursor-blink text-[#f4f3ee]" />
        </p>
      </div>

      <div className="flex items-center gap-3 border-t px-4 py-3.5" style={{ borderColor: '#1e1e24', background: 'rgba(255,255,255,0.02)' }}>
        <img
          src="assets/ibrahem-main.jpg"
          alt="Ibrahem Khaled"
          className="h-10 w-10 rounded-full object-cover"
          style={{ boxShadow: '0 0 0 2px rgba(163,230,53,.45)' }}
          loading="eager"
          decoding="async"
          width={40}
          height={40}
        />
        <div className={lang === 'ar' ? 'text-right' : ''}>
          <p className="text-sm font-semibold text-[#f4f3ee]" style={{ fontFamily: lang === 'en' ? "'Space Grotesk',sans-serif" : undefined }}>
            {lang === 'en' ? 'Ibrahem Khaled' : 'إبراهيم خالد'}
          </p>
          <p className="text-[11px] text-[#9e9ea8]" style={{ fontFamily: lang === 'en' ? "'JetBrains Mono',monospace" : undefined }}>
            {t.seniorRole}
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[10px] uppercase tracking-wider text-[#9e9ea8]" style={{ fontFamily: lang === 'en' ? "'JetBrains Mono',monospace" : undefined }}>
            {t.available}
          </span>
        </span>
      </div>
    </div>
  )
}

export default function Hero() {
  const { lang } = useApp()
  const t = ui[lang]
  const typed = useTyping(lang)

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-20 pb-16" aria-label="Hero">
      <div className="hero-glow" />
      <span className="ghost-word select-none" aria-hidden="true">IK</span>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">

          {/* ── Left: editorial headline ── */}
          <div className="lg:col-span-7">
            <p className="eyebrow animate-slide-up anim-delay-1">{t.heroEyebrow}</p>

            <h1
              className="mt-6 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl xl:text-[4.4rem]"
            >
              <span className="sr-only">Ibrahem Khaled — </span>
              <span className="block animate-slide-up anim-delay-1">{t.hiIm}</span>
              <span className="mt-1 block animate-slide-up anim-delay-2">
                {t.heroBefore}{' '}
                <span className="underline decoration-accent/50 decoration-[3px] underline-offset-8">{t.heroAccent}</span>{' '}
                {t.heroAfter}
              </span>
            </h1>

            {/* Role rotator */}
            <p className="animate-slide-up anim-delay-3 mt-7 min-h-[1.75rem] font-mono text-sm text-muted-ink sm:text-base" aria-live="polite" style={{ fontFamily: lang === 'en' ? undefined : "'Tajawal',sans-serif" }}>
              <span className="me-2 text-accent">→</span>
              <span className="typing-text">{typed}</span>
            </p>

            <p className="animate-slide-up anim-delay-3 mt-5 max-w-xl text-base leading-relaxed text-muted-ink sm:text-lg">
              {t.heroDesc}
            </p>

            {/* CTAs */}
            <div className="animate-slide-up anim-delay-4 mt-9 flex flex-wrap items-center gap-3">
              <a href={LINKS.cv} download aria-label={t.downloadCV} className="btn-accent">
                <Icon name="download" className="w-4 h-4" />
                {t.downloadCV}
              </a>
              <a
                href="#projects"
                aria-label={t.viewProjects}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-outline group"
              >
                {t.viewProjects}
                <Icon name="arrowRight" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>

            {/* Stats — mono numbers, hairline separated */}
            <dl className="animate-slide-up anim-delay-5 mt-12 flex flex-wrap gap-x-10 gap-y-5">
              {HERO_STATS.map(stat => (
                <div key={stat.labelKey}>
                  <dt className="sr-only">{t[stat.labelKey]}</dt>
                  <dd className="stat-num text-2xl sm:text-3xl">
                    <CountUp value={stat.value} suffix={stat.suffix} pad />
                  </dd>
                  <dd className="mt-1.5 text-xs text-muted-ink">{t[stat.labelKey]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right: terminal ── */}
          <div className="animate-fade-in anim-delay-3 lg:col-span-5">
            <TerminalCard />
          </div>

        </div>
      </div>
    </section>
  )
}
