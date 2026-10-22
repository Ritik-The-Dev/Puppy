/* /faq — the pinned notes board with search and an accordion per question. */
import { useMemo, useState } from 'react'
import Svg from '../components/Svg'
import PupBuddy from '../pup/PupBuddy'
import lensSvg from '../assets/svg/pages/faq-22.svg?raw'
import pages from '../data/pages.json'
import { WA_NUMBER } from '../data'

const ASK_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi TeddyPups! I have a question:')}`

export default function Faq() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(null)

  const faqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pages.faqs
    return pages.faqs.filter((f) => (f.q + ' ' + f.a).toLowerCase().includes(q))
  }, [query])

  return (
    <div data-page="faq" className="tp-page">
      <section data-pup-scene="true" data-tone="dark" className="tp-scene tp-faqroom overflow-hidden" style={{ '--sky-top': '#a95e32', '--sky-bottom': '#331c11' }} aria-labelledby="faq-title">
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">Questions &amp; answers</h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              Can’t find what you’re looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>
          <div className="mt-12 md:mt-16">
            <div className="tp-notes">
              <aside className="tp-notes__side" aria-label="Find a question">
                <label htmlFor="faq-search" className="font-scrawl tp-notes__label">sniff out a question</label>
                <div className="tp-notes__search">
                  <Svg src={lensSvg} />
                  <input
                    id="faq-search"
                    type="search"
                    placeholder="delivery, Korea, vaccinated…"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <p className="tp-notes__count" aria-live="polite">{faqs.length} notes on the board</p>
                <div className="tp-notes__teddy">
                  <span aria-hidden="true" className="tp-notes__bubble font-plush">
                    <span className="tp-notes__q">?</span>
                    <span className="tp-notes__a">!</span>
                  </span>
                  <div className="pup-buddy" data-facing="right">
                    <PupBuddy pose="sit" facing="right" label="Teddy, ready to answer" />
                    <span aria-hidden="true" className="pup-bubble" data-show="false" />
                  </div>
                </div>
                <a href={ASK_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">Ask your own question</a>
              </aside>
              <div className="tp-notes__board">
                <ul className="tp-notes__list">
                  {faqs.map((f) => {
                    const isOpen = open === f.i
                    return (
                      <li key={f.i} className="tp-note" data-reveal="true" data-unfolded={isOpen || undefined} style={{ '--tilt': f.tilt, '--pin': f.pin, '--i': f.i }}>
                        <span aria-hidden="true" className="tp-note__pin" />
                        <h2 className="tp-note__q">
                          <button
                            type="button"
                            id={`q-${f.i}`}
                            aria-expanded={isOpen}
                            aria-controls={`a-${f.i}`}
                            onClick={() => setOpen(isOpen ? null : f.i)}
                          >
                            <span className="font-plush-text">{f.q}</span>
                            <span aria-hidden="true" className="tp-note__chevron" />
                          </button>
                        </h2>
                        <div id={`a-${f.i}`} role="region" aria-labelledby={`q-${f.i}`} className="tp-note__answer" inert={!isOpen || undefined}>
                          <div className="tp-note__flap">
                            <p>{f.a}</p>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
