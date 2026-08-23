import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { GAMES } from '../data/content'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import Footer from '../components/Footer'

export default function Games() {
  const { lang } = useApp()
  const t = ui[lang]

  return (
    <>
      <main id="main-content" className="min-h-screen pt-28">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <SectionHeading num="09" kicker={{ en: t.gamesKicker, ar: t.gamesKicker }} title={{ en: t.gamesTitle, ar: t.gamesTitle }} />

          <Reveal className="-mt-6 mb-12 max-w-xl">
            <p className="text-muted-ink">{t.gamesDesc}</p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {GAMES.map((game, i) => {
              const live = game.status === 'live'
              const inner = (
                <div
                  className={`glass flex h-full flex-col rounded-2xl p-6 ${
                    live ? 'project-card' : 'opacity-55 saturate-50'
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                      style={{ background: 'var(--accent-dim)' }}
                    >
                      {game.emoji}
                    </span>
                    <span className="font-mono text-xs text-muted-ink">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="font-display text-lg font-semibold tracking-tight">{game.title[lang]}</h3>
                  <p className="mt-1.5 grow text-sm leading-relaxed text-muted-ink">{game.desc[lang]}</p>

                  <div className="mt-6">
                    {live ? (
                      <span className="btn-accent w-full py-2.5! text-sm">
                        {t.playNow} →
                      </span>
                    ) : (
                      <span className="tag inline-block">{t.comingSoon}</span>
                    )}
                  </div>
                </div>
              )

              return (
                <Reveal key={game.id} delay={(i % 4) * 0.07}>
                  {live ? (
                    <Link to={`/games/${game.id}`} aria-label={game.title[lang]} className="block h-full">
                      {inner}
                    </Link>
                  ) : (
                    <div aria-disabled="true" className="block h-full cursor-not-allowed">
                      {inner}
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
