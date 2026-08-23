import { useApp } from '../context/AppContext'
import { HEADERS, SKILL_CATEGORIES, TECH_TAGS, type SkillIcon } from '../data/content'
import { Icon, type IconName } from './Icons'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { useInView } from '../hooks/useInView'

const ICON_MAP: Record<SkillIcon, IconName> = {
  monitor: 'monitor',
  server: 'server',
  phone: 'phoneDevice',
  cog: 'cog',
}

function SkillRow({ name, level }: { name: string; level: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)
  return (
    <div className="skill-row py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{name}</span>
        <span className="font-mono text-[11px] text-muted-ink">{level}%</span>
      </div>
      <div className="skill-bar mt-2" ref={ref}>
        <div className="skill-bar-fill" style={{ width: inView ? `${level}%` : 0 }} />
      </div>
    </div>
  )
}

export default function Skills() {
  const { lang } = useApp()

  return (
    <section id="skills" className="py-20 md:py-28" aria-label="Skills">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="02" kicker={HEADERS.skills.kicker} title={HEADERS.skills.title} />

        {/* Hairline grid columns */}
        <Reveal>
          <div
            className="grid overflow-hidden rounded-2xl border border-line md:grid-cols-2 xl:grid-cols-4"
            style={{ borderColor: 'var(--surface-border)', gap: 1, background: 'var(--surface-border)' }}
          >
            {SKILL_CATEGORIES.map((cat, i) => (
              <div key={cat.title.en} className="bg-panel p-6 md:p-7">
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: 'var(--accent-dim)' }}
                  >
                    <Icon name={ICON_MAP[cat.icon]} className="h-[18px] w-[18px] text-accent" />
                  </span>
                  <h3 className="font-display font-semibold tracking-tight">{cat.title[lang]}</h3>
                  <span className="ms-auto font-mono text-xs text-muted-ink">0{i + 1}</span>
                </div>

                <div>
                  {cat.skills.map(skill => (
                    <SkillRow key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tech chips */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {TECH_TAGS.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
