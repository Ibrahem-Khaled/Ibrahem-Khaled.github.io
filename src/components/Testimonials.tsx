import { useApp } from '../context/AppContext'
import { HEADERS, TESTIMONIALS } from '../data/content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function Testimonials() {
  const { lang } = useApp()

  return (
    <section id="testimonials" className="py-20 md:py-28" aria-label="Testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="06" kicker={HEADERS.testimonials.kicker} title={HEADERS.testimonials.title} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.initials} delay={(i % 3) * 0.08}>
              <figure className="glass relative flex h-full flex-col rounded-2xl p-7">
                <div className="quote-mark" aria-hidden="true">"</div>
                <blockquote className="relative z-10 mt-2 grow text-sm leading-relaxed text-muted-ink sm:text-[15px]">
                  {item.text[lang]}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    {item.initials}
                  </span>
                  <div className={lang === 'ar' ? 'text-right' : ''}>
                    <p className="text-sm font-semibold">{item.name[lang]}</p>
                    <p className="text-xs text-muted-ink">{item.project[lang]}</p>
                  </div>
                  <span className="ms-auto text-xs tracking-widest text-accent" aria-label="5/5">★★★★★</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
