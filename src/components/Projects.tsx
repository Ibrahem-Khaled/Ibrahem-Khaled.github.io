import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import {
  HEADERS,
  LINKS,
  PROJECT_FILTERS,
  PROJECTS,
  type ProjectCategory,
  type ProjectIcon,
} from '../data/content'
import { Icon, type IconName } from './Icons'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { BrandIcon } from './BrandIcons'

const ICON_MAP: Record<ProjectIcon, IconName> = {
  home: 'home',
  phone: 'phoneDevice',
  server: 'server',
  chart: 'chart',
  users: 'users',
  lock: 'lock',
}

type Filter = ProjectCategory | 'all'

export default function Projects() {
  const { lang } = useApp()
  const t = ui[lang]
  const [filter, setFilter] = useState<Filter>('all')

  const visible = PROJECTS.filter(p => filter === 'all' || p.category === filter)

  return (
    <section id="projects" className="py-20 md:py-28" aria-label="Projects">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="04" kicker={HEADERS.projects.kicker} title={HEADERS.projects.title} />

        {/* Filters */}
        <Reveal className="mb-10 flex flex-wrap justify-center gap-2.5">
          <div role="group" aria-label="Filter projects" className="flex flex-wrap justify-center gap-2.5">
            {PROJECT_FILTERS.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`filter-btn rounded-full border px-5 py-2 text-sm transition-all ${
                  filter === f.key ? 'active' : 'border-line text-muted-ink hover:border-accent hover:text-accent'
                }`}
              >
                {f.label[lang]}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal key={project.title.en} delay={(i % 3) * 0.08}>
              <article className="project-card glass flex h-full flex-col overflow-hidden rounded-2xl">
                {/* Cover art */}
                <div className="project-thumb relative h-44" style={{ background: project.gradient }}>
                  <div
                    className="thumb-art absolute inset-0 flex items-center justify-center"
                    style={{ background: project.overlay }}
                  >
                    <span
                      className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm"
                    >
                      <Icon name={ICON_MAP[project.icon]} className="h-9 w-9 text-white/80" />
                    </span>
                  </div>
                  <span className="project-index absolute -bottom-5 end-2 select-none" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute start-4 top-4 rounded-md border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur-sm">
                    {project.categoryLabel[lang]}
                  </span>
                </div>

                {/* Body */}
                <div className="flex grow flex-col p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight">{project.title[lang]}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-ink">{project.desc[lang]}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-6">
                    <a
                      href={LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub — ${project.title.en}`}
                      className="icon-btn h-9! w-9!"
                    >
                      <BrandIcon name="github" className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      onClick={e => e.preventDefault()}
                      className="group ms-auto inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:text-accent-bright"
                    >
                      {project.ctaLabel[lang]}
                      <Icon name="arrowRight" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <BrandIcon name="github" className="w-4 h-4" />
            {t.viewAllRepos}
          </a>
        </div>
      </div>
    </section>
  )
}
