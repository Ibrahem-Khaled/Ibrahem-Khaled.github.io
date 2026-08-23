import { useApp } from '../context/AppContext'
import { HEADERS, TEAM } from '../data/content'
import { BrandIcon, type BrandIconName } from './BrandIcons'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function Team() {
  const { lang } = useApp()

  return (
    <section id="team" className="section-alt py-20 md:py-28" aria-label="Our Team">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="05" kicker={HEADERS.team.kicker} title={HEADERS.team.title} />

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {TEAM.map((member, i) => (
            <Reveal key={member.name.en} delay={i * 0.1}>
              <div className="glass group flex h-full flex-col items-center rounded-2xl p-8 text-center">
                <div className="relative mb-6">
                  <img
                    src={member.img}
                    alt={member.name.en}
                    className="h-28 w-28 rounded-2xl object-cover"
                    style={{ boxShadow: '0 0 0 3px var(--accent-dim-strong)' }}
                    loading="lazy"
                    decoding="async"
                    width={112}
                    height={112}
                  />
                  <span
                    className="absolute -bottom-2 -end-2 flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[10px]"
                    style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-tight">{member.name[lang]}</h3>
                <p className="mt-1 font-mono text-xs text-accent" style={lang === 'ar' ? { fontFamily: "'Tajawal',sans-serif", fontSize: '0.8rem' } : undefined}>
                  {member.role[lang]}
                </p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-ink">{member.bio[lang]}</p>

                <div className="mt-auto flex justify-center gap-3 pt-6">
                  {member.socials.map(social => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="icon-btn h-9! w-9!"
                    >
                      <BrandIcon name={social.icon as BrandIconName} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
