import { useApp } from '../context/AppContext'
import { EXPERIENCE, HEADERS } from '../data/content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function Experience() {
  const { lang } = useApp()

  return (
    <section id="experience" className="section-alt py-20 md:py-28" aria-label="Experience">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="03" kicker={HEADERS.experience.kicker} title={HEADERS.experience.title} />

        <div className="mx-auto max-w-4xl">
          <div className="border-t border-line">
            {EXPERIENCE.map((job, i) => (
              <Reveal key={job.role.en}>
                <article className="group grid gap-3 border-b border-line py-9 md:grid-cols-[150px_1fr] md:gap-10">
                  {/* Period */}
                  <p className="pt-1 font-mono text-xs tracking-wider text-muted-ink md:text-sm">
                    {job.period[lang]}
                  </p>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                        {job.role[lang]}
                      </h3>
                      <span className="font-mono text-xs text-muted-ink">0{i + 1}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted-ink">{job.company[lang]}</p>
                    <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-muted-ink sm:text-[15px]">
                      {job.desc[lang]}
                    </p>
                    <div className="mt-4.5 flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
