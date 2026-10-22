/* /happy-families — the polaroid wall with a photo viewer dialog. */
import { useEffect, useRef, useState } from 'react'
import PupBuddy from '../pup/PupBuddy'
import pages from '../data/pages.json'

export default function HappyFamilies() {
  const dialogRef = useRef(null)
  const [current, setCurrent] = useState(0)

  const open = (i) => {
    setCurrent(i)
    dialogRef.current?.showModal()
  }

  const close = () => dialogRef.current?.close()

  const step = (dir) => setCurrent((i) => (i + dir + pages.polaroids.length) % pages.polaroids.length)

  useEffect(() => {
    const onKey = (e) => {
      if (!dialogRef.current?.open) return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const photo = pages.polaroids[current]
  const imgSrc = photo ? (photo.html.match(/src="([^"]+)"/) || [])[1] : ''

  return (
    <div data-page="families" className="tp-page">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">our wall of happy endings</p>
              <h1 id="families-title" className="font-plush text-giant tp-memories__title" data-reveal="true">
                Happy families
                <svg viewBox="0 0 48 44" className="tp-memories__heart" aria-hidden="true">
                  <path
                    d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal="true">
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal="true">{pages.polaroids.length} moments and counting</p>
            </div>
            <figure className="tp-memories__note" data-reveal="true">
              <span aria-hidden="true" className="tp-tape tp-tape--center" style={{ '--tape': '#cfe5f6' }} />
              <blockquote className="font-plush-text">
                &ldquo;TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.&rdquo;
              </blockquote>
              <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
            </figure>
          </div>
          <div className="mt-16 md:mt-20">
            <div>
              <ul className="tp-wall" aria-label="Photos from TeddyPups families">
                {pages.polaroids.map((p, i) => (
                  <li key={i} className="tp-wall__item" data-reveal="true" style={{ '--d': p.d }}>
                    <button type="button" className="tp-wall__print" aria-label={p.label} onClick={() => open(i)}>
                      <span dangerouslySetInnerHTML={{ __html: p.html }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <dialog
              aria-label="Photo viewer"
              className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
              data-lenis-prevent="true"
              ref={dialogRef}
              onClick={(e) => { if (e.target === dialogRef.current) close() }}
            >
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 p-4">
                <button type="button" className="absolute right-4 top-4 h-11 rounded-full bg-milk px-5 font-semibold text-cocoa" onClick={close}>
                  Close
                </button>
                <img alt={photo?.label || ''} src={imgSrc} className="max-h-[78vh] max-w-full rounded-[1.2rem] object-contain" />
                <div className="flex items-center gap-3">
                  <button type="button" className="btn btn-ghost !bg-milk !text-cocoa" onClick={() => step(-1)}>Previous</button>
                  <span className="font-scrawl text-lg text-honey">{current + 1} / {pages.polaroids.length}</span>
                  <button type="button" className="btn btn-ghost !bg-milk !text-cocoa" onClick={() => step(1)}>Next</button>
                </div>
              </div>
            </dialog>
          </div>
          <div className="tp-memories__foot">
            <div className="pup-buddy w-36 md:w-44" data-facing="left">
              <PupBuddy pose="sit" facing="left" />
              <span aria-hidden="true" className="pup-bubble" data-show="false" />
            </div>
            <p className="font-scrawl text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
          </div>
        </div>
      </section>
    </div>
  )
}
