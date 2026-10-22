/* /contact — the letter form, contact details and the showroom card. */
import { useEffect, useRef, useState } from 'react'
import Svg from '../components/Svg'
import PupBuddy from '../pup/PupBuddy'
import stampSvg from '../assets/svg/pages/contact-22.svg?raw'
import shopfrontSvg from '../assets/svg/pages/contact-24.svg?raw'
import pinSvg from '../assets/svg/pages/contact-25.svg?raw'
import pages from '../data/pages.json'
import { WA_LINK, PHONE_TEL } from '../data'

const PUPPY_OPTIONS = pages.puppies.map((p) => ({ value: p.href, label: `${p.name} (${p.meta})` }))
/* Same shape the live server accepts: no doubled dots and a real 2+ letter TLD. */
const EMAIL_RE = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i

/* Mirrors the live server rules: a real name, at least 7 digits of phone and a
   sane email. Missing/invalid fields get the exact messages the original shows. */
function validateValues(values) {
  const errors = {}
  if ((values.name || '').trim().length < 2) {
    errors.name = 'Please tell us your name.'
  }
  if ((values.phone || '').replace(/\D/g, '').length < 7) {
    errors.phone = 'Add a phone or WhatsApp number we can reach, with country code.'
  }
  const email = (values.email || '').trim()
  if (email && !EMAIL_RE.test(email)) {
    errors.email = "That email doesn't look right."
  }
  return errors
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Contact() {
  const [phase, setPhase] = useState('writing')
  const [errors, setErrors] = useState({})
  const [minHeight, setMinHeight] = useState(undefined)
  const postRef = useRef(null)
  const formRef = useRef(null)
  const sentRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /* Focus the first bad field, like the original server action does. */
  useEffect(() => {
    if (!Object.keys(errors).length) return
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [errors])

  /* Bring the confirmation into view once the envelope has been posted. */
  useEffect(() => {
    if (phase !== 'sent') return
    const el = sentRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    const top = el.getBoundingClientRect().top
    const headerH = 16 * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76
    if (top < headerH + 8) {
      window.scrollBy({ top: top - headerH - 24, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
  }, [phase])

  const postLetter = (form) => {
    setErrors({})
    if (prefersReducedMotion()) {
      form.reset()
      setPhase('sent')
      return
    }
    setMinHeight(postRef.current?.offsetHeight)
    setPhase('sealing')
    timers.current = [
      setTimeout(() => setPhase('posting'), 750),
      setTimeout(() => {
        form.reset()
        setMinHeight(undefined)
        setPhase('sent')
        timers.current = []
      }, 1750),
    ]
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (phase !== 'writing') return
    const form = e.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    /* Honeypot: bots get the same confirmation without anything being checked. */
    if (values.website) {
      postLetter(form)
      return
    }
    const nextErrors = validateValues(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    postLetter(form)
  }

  const errorEntries = Object.entries(errors)

  return (
    <div data-page="contact" className="tp-page">
      <section data-pup-scene="true" data-tone="light" className="tp-scene" style={{ '--sky-top': '#fff9ee', '--sky-bottom': '#f9dca4' }} aria-labelledby="contact-title">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">Get in touch with us</h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we’d love to hear from you!
            </p>
          </header>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <div ref={postRef} className="tp-post" data-phase={phase} style={minHeight ? { minHeight } : undefined}>
                {phase !== 'sent' && (
                  <form
                    ref={formRef}
                    noValidate
                    className="tp-letterform"
                    onSubmit={onSubmit}
                    aria-hidden={phase !== 'writing' || undefined}
                    inert={phase !== 'writing' ? '' : undefined}
                  >
                    <span aria-hidden="true" className="tp-letter__stamp">
                      <Svg src={stampSvg} />
                    </span>
                    <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
                    {errorEntries.length > 0 && (
                      <div role="alert" className="tp-letterform__alert">
                        <p className="font-semibold">Please check the highlighted fields.</p>
                        <ul>
                          {errorEntries.map(([field, message]) => (
                            <li key={field} id={`${field}-err`}>{message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="tp-letterform__line">
                      my name is{' '}
                      <span className="tp-blank" style={{ '--size': '16ch' }}>
                        <input
                          aria-label="Your name (required)"
                          autoComplete="name"
                          required
                          minLength={2}
                          maxLength={80}
                          name="name"
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={errors.name ? 'name-err' : undefined}
                        />
                      </span>
                      , and you can reach me on{' '}
                      <span className="tp-blank" style={{ '--size': '15ch' }}>
                        <input
                          aria-label="Phone or WhatsApp number with country code (required)"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          placeholder="+971 50 123 4567"
                          name="phone"
                          aria-invalid={errors.phone ? true : undefined}
                          aria-describedby={errors.phone ? 'phone-err' : undefined}
                        />
                      </span>{' '}
                      or by email at{' '}
                      <span className="tp-blank" style={{ '--size': '20ch' }}>
                        <input
                          aria-label="Email (optional)"
                          type="email"
                          autoComplete="email"
                          placeholder="optional"
                          name="email"
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={errors.email ? 'email-err' : undefined}
                        />
                      </span>.
                    </p>
                    <p className="tp-letterform__line">
                      I live in{' '}
                      <span className="tp-blank" style={{ '--size': '13ch' }}>
                        <input aria-label="Your area (optional)" autoComplete="address-level2" maxLength={80} placeholder="e.g. Dubai Marina" name="area" />
                      </span>
                      , and I’m curious about{' '}
                      <span className="tp-blank tp-blank--select">
                        <label htmlFor="contact-puppy" className="sr-only">Puppy you’re interested in (optional)</label>
                        <select id="contact-puppy" name="puppyId" defaultValue="">
                          <option value="">any puppy (not sure yet)</option>
                          {PUPPY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </span>.
                    </p>
                    <label htmlFor="contact-message" className="sr-only">Your message (optional)</label>
                    <textarea id="contact-message" name="message" rows={4} maxLength={2000} placeholder="Anything else you’d like to tell us…" className="tp-letterform__note" />
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>Website<input tabIndex={-1} autoComplete="off" name="website" defaultValue="" /></label>
                    </div>
                    <div className="tp-letterform__sign">
                      <p className="font-scrawl">with love, a future puppy parent</p>
                      <button type="submit" className="btn btn-primary disabled:opacity-70">Post my letter</button>
                    </div>
                  </form>
                )}

                {(phase === 'sealing' || phase === 'posting') && (
                  <div aria-hidden="true" className="tp-post__scene">
                    <svg viewBox="0 0 160 112" className="tp-post__envelope">
                      <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
                      <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
                      <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                      <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
                    </svg>
                    <svg viewBox="0 0 200 260" className="tp-post__box">
                      <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                      <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                      <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
                      <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
                      <g className="tp-post__flag">
                        <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                        <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                      </g>
                    </svg>
                  </div>
                )}

                {phase === 'sent' && (
                  <div ref={sentRef} tabIndex={-1} role="status" className="tp-post__sent">
                    <svg viewBox="0 0 200 150" aria-hidden="true" className="tp-post__box tp-post__box--sent">
                      <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                      <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                      <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
                      <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                      <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                    </svg>
                    <p className="font-plush mt-4 text-[2rem]">Message received!</p>
                    <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">
                      Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
                    </p>
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">WhatsApp us</a>
                  </div>
                )}
              </div>
              <div className="pup-buddy ml-auto mr-6 -mt-3 w-36 md:w-40" data-facing="left">
                <PupBuddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
                <span aria-hidden="true" className="pup-bubble" data-show="false" />
              </div>
            </div>
            <div className="lg:col-span-5 lg:row-start-1">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">WhatsApp +971 54 167 6733</a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold"><a className="link-ink" href={PHONE_TEL}>+971 54 167 6733</a></dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold"><a className="link-ink" href="mailto:teddypupsadmin@gmail.com">teddypupsadmin@gmail.com</a></dd>
                </div>
              </dl>
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <Svg src={shopfrontSvg} />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">Visit us in Downtown Dubai</h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.</p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Svg src={pinSvg} />
                      Downtown Dubai, United Arab Emirates
                    </p>
                    <a href="https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">Open in Google Maps</a>
                  </div>
                  <figure className="tp-visit__photo">
                    <img
                      alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                      loading="lazy"
                      style={{ objectPosition: '45.3% 44.4%' }}
                      src="/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg"
                    />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
