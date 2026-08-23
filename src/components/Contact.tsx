import { useState, type FormEvent, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { ui } from '../data/ui'
import { HEADERS, LINKS, SOCIALS } from '../data/content'
import { Icon, type IconName } from './Icons'
import { BrandIcon } from './BrandIcons'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { isValidEmail } from '../utils'

interface Errors {
  name: boolean
  email: boolean
  message: boolean
}

export default function Contact() {
  const { lang } = useApp()
  const t = ui[lang]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({ name: false, email: false, message: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: Errors = {
      name: name.trim() === '',
      email: !isValidEmail(email.trim()),
      message: message.trim() === '',
    }
    setErrors(nextErrors)
    if (nextErrors.name || nextErrors.email || nextErrors.message) return

    setStatus('sending')
    window.setTimeout(() => {
      setStatus('sent')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      window.setTimeout(() => setStatus('idle'), 6000)
    }, 1600)
  }

  const infoRows: { icon: IconName; label: string; value: ReactNode; href?: string }[] = [
    { icon: 'mail', label: t.labelEmail, value: LINKS.email, href: `mailto:${LINKS.email}` },
    { icon: 'phoneCall', label: t.labelWhatsApp, value: '+201159253196', href: LINKS.whatsapp },
    { icon: 'pin', label: t.labelLocation, value: t.locationValue },
  ]

  return (
    <section id="contact" className="section-alt py-20 md:py-28" aria-label="Contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading num="08" kicker={HEADERS.contact.kicker} title={HEADERS.contact.title} />

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Info column */}
          <Reveal className="lg:col-span-2">
            <div className="border-t border-line">
              {infoRows.map(row => (
                <div key={row.label} className="flex items-center gap-4 border-b border-line py-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'var(--accent-dim)' }}
                  >
                    <Icon name={row.icon} className="h-[18px] w-[18px] text-accent" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-ink">{row.label}</p>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-medium transition-colors hover:text-accent"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{row.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <p className="eyebrow mb-4 text-muted-ink!">{t.findMeOn}</p>
              <div className="flex flex-wrap gap-2.5">
                {SOCIALS.map(social => (
                  <a
                    key={social.icon}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="icon-btn"
                  >
                    <BrandIcon name={social.icon} className="w-[17px] h-[17px]" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-3">
            <form
              className="glass space-y-5 rounded-2xl p-7 sm:p-9"
              noValidate
              aria-label="Contact form"
              onSubmit={onSubmit}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-xs text-muted-ink">
                    {t.formName}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder={t.phName}
                    aria-required="true"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="form-input w-full px-4 py-3 text-sm"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">{t.errName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-xs text-muted-ink">
                    {t.formEmail}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder={t.phEmail}
                    aria-required="true"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full px-4 py-3 text-sm"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-xs text-red-400">{t.errEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-2 block text-xs text-muted-ink">
                  {t.formSubject}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder={t.phSubject}
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="form-input w-full px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-xs text-muted-ink">
                  {t.formMessage}
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  aria-required="true"
                  placeholder={t.phMessage}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="form-input w-full resize-none px-4 py-3 text-sm"
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs text-red-400">{t.errMsg}</p>
                )}
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-accent w-full py-3.5">
                <span>{status === 'sending' ? t.sending : t.send}</span>
                {status === 'sending' ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>

              {status === 'sent' && (
                <div
                  role="status"
                  className="rounded-xl py-3.5 text-center text-sm font-medium text-emerald-400"
                  style={{ background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.25)' }}
                >
                  {t.sentOk}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
