import Reveal from './Reveal'
import { useApp } from '../context/AppContext'
import type { Localized } from '../types'

export default function SectionHeading({
  num,
  kicker,
  title,
  center = false,
}: {
  num: string
  kicker: Localized
  title: Localized
  center?: boolean
}) {
  const { lang } = useApp()
  return (
    <Reveal className={center ? 'mb-10 md:mb-14 text-center' : 'mb-10 md:mb-14'}>
      <p className={`eyebrow mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <span className="font-mono">{num}</span>
        <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
        <span>{kicker[lang]}</span>
      </p>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
        {title[lang]}
      </h2>
    </Reveal>
  )
}
