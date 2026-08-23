import type { MouseEvent } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import Hero from '../components/Hero'
import BugWarsTeaser from '../components/BugWarsTeaser'
import About from '../components/About'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import TechMarquee from '../components/TechMarquee'

function Divider() {
  return <hr className="section-divider" />
}

export default function Home() {
  const { lang } = useApp()
  const t = ui[lang]

  const skipToContent = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById('main-content')
    if (!el) return
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
    el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <a href="#main-content" className="skip-link" onClick={skipToContent}>
        {t.skipToContent}
      </a>
      <main id="main-content">
        <Hero />
        <TechMarquee />
        <Divider />
        <BugWarsTeaser />
        <Divider />
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Experience />
        <Divider />
        <Projects />
        <Divider />
        <Team />
        <Divider />
        <Testimonials />
        <Divider />
        <Faq />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
