/* /puppies — the sketchbook: filters, available puppies, gone-home strip. */
import { useMemo, useState } from 'react'
import PupBuddy from '../pup/PupBuddy'
import pages from '../data/pages.json'

function Sketch({ p, small = false }) {
  return (
    <a
      className={small ? 'tp-sketch tp-sketch--small' : 'tp-sketch'}
      data-reveal="true"
      style={{ '--tilt': p.tilt, '--d': p.d, '--wash': p.wash }}
      aria-label={p.aria}
      href={p.href}
    >
      <span className="tp-sketch__frame">
        <span dangerouslySetInnerHTML={{ __html: p.frame }} />
        <span className={`tp-sketch__sticker font-scrawl${small ? ' tp-sketch__sticker--home' : ''}`}>{p.sticker}</span>
        {p.video ? <span className="tp-sketch__video">▶ video</span> : null}
      </span>
      <span className="tp-sketch__name font-plush">{p.name}</span>
      {p.meta ? <span className="tp-sketch__meta">{p.meta}</span> : null}
    </a>
  )
}

const WHERE = ['Everywhere', 'Imported', 'Korean Teacup']
const BREEDS = ['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu']
const SEXES = ['Boys', 'Girls']

/* Breed/sex come from the listing meta: "Maltipoo · boy · 3 months". */
function traits(p) {
  const [breed = '', sex = ''] = p.meta.split('·').map((s) => s.trim())
  return { breed, sex: sex.toLowerCase(), name: p.name }
}

export default function Puppies() {
  const [where, setWhere] = useState('Everywhere')
  const [breed, setBreed] = useState(null)
  const [sex, setSex] = useState(null)

  const list = useMemo(() => {
    return pages.puppies.filter((p) => {
      const t = traits(p)
      if (where === 'Korean Teacup' && !t.name.startsWith('Korean Teacup')) return false
      if (breed && !t.name.includes(breed)) return false
      if (sex === 'Boys' && !t.sex.startsWith('boy')) return false
      if (sex === 'Girls' && !t.sex.startsWith('girl')) return false
      return true
    })
  }, [where, breed, sex])

  const label = list.length === pages.puppies.length
    ? `${list.length} puppies looking for a home`
    : `${list.length} ${list.length === 1 ? 'puppy' : 'puppies'} match`

  return (
    <div data-page="pups" className="tp-page">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">from Teddy&rsquo;s sketchbook</p>
              <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="true">
                Available puppies
                <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                  <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1" />
                </svg>
              </h1>
              <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">
                Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
              </p>
            </div>
            <div className="tp-sketchbook__self" data-reveal="true">
              <div className="pup-buddy" data-facing="left">
                <PupBuddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
                <span aria-hidden="true" className="pup-bubble" data-show="false" />
              </div>
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>
          <div className="mt-12">
            <div>
              <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">where</span>
                  {WHERE.map((w) => (
                    <button key={w} type="button" aria-pressed={where === w} className="tp-sticker-chip" onClick={() => setWhere(w)}>{w}</button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">breed</span>
                  {BREEDS.map((b) => (
                    <button key={b} type="button" aria-pressed={breed === b} className="tp-sticker-chip" onClick={() => setBreed(b)}>{b}</button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">boy or girl</span>
                  {SEXES.map((s) => (
                    <button key={s} type="button" aria-pressed={sex === s} className="tp-sticker-chip" onClick={() => setSex(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">{label}</p>
              <div>
                <ul className="tp-sketches mt-8">
                  {list.map((p) => (
                    <li key={p.href}>
                      <Sketch p={p} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
          <div className="md:w-1/3" data-reveal="true">
            <h2 id="gone-title" className="font-plush text-big">Already gone home</h2>
            <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
            <a className="btn btn-primary mt-6" href="/gone-home">See the puppies who&rsquo;ve gone home</a>
          </div>
          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {pages.goneStrip.map((p) => (
              <li key={p.href}>
                <Sketch p={p} small />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
