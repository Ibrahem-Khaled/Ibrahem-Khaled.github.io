import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FAQS, HEADERS } from '../data/content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function Faq() {
  const { lang } = useApp()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section-alt py-20 md:py-28" aria-label="FAQ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="07" kicker={HEADERS.faq.kicker} title={HEADERS.faq.title} />

        <div className="mx-auto max-w-3xl">
          {FAQS.map((faq, i) => {
            const active = openIndex === i
            return (
              <Reveal key={faq.q.en}>
                <div className={`faq-item ${active ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={active}
                    onClick={() => setOpenIndex(active ? null : i)}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-muted-ink">{String(i + 1).padStart(2, '0')}</span>
                      <span>{faq.q[lang]}</span>
                    </span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.a[lang]}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
