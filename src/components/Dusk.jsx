/* Happy families: dusk photowall of polaroids above a lit storefront. */
import { useEffect, useRef, useState } from 'react'
import PupStop from '../pup/PupStop'
import { FAMILY_PHOTOS } from '../data'

function Tape({ pos, color }) {
  const cls = pos === 'tl-tr' ? ['tp-tape tp-tape--tl', 'tp-tape tp-tape--tr'] : [`tp-tape tp-tape--${pos}`]
  return (
    <>
      {cls.map((c, i) => (
        <span aria-hidden="true" key={i} className={c} style={{ '--tape': color }} />
      ))}
    </>
  )
}

export default function Dusk() {
  const wallRef = useRef(null)
  const [open, setOpen] = useState(-1)

  useEffect(() => {
    const items = wallRef.current ? Array.from(wallRef.current.querySelectorAll('li[data-reveal]')) : []
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.setAttribute('data-revealed', '')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.25 }
    )
    items.forEach((el) => { el.setAttribute('data-armed', ''); io.observe(el) })
    return () => io.disconnect()
  }, [])

  return (
    <section
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-dusk"
      style={{ '--sky-top': '#a65a30', '--sky-bottom': '#4d2b19' }}
      aria-labelledby="dusk-title"
      id="families"
    >
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">Happy families &amp; puppies</h2>
          <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
            We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
          </p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">
            “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
          </blockquote>
          <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
        </figure>
      </div>
      <div className="tp-photowall">
        <div className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families" ref={wallRef}>
            {FAMILY_PHOTOS.map((p, i) => (
              <li data-reveal="true" key={i} style={{ '--d': `${p.delay}ms` }}>
                <button type="button" className="tp-photowall__print" aria-label={`Open photo ${i + 1} of 64: ${p.caption}`} onClick={() => setOpen(i)}>
                  <span className="tp-polaroid" style={{ '--tilt': p.tilt, '--tape': p.tape, '--i': i }}>
                    <Tape pos={p.tapePos} color={p.tape} />
                    <span className="tp-polaroid__photo">
                      <img alt="A happy TeddyPups family with their new puppy" loading="lazy" width="433" height="433" src={p.img} />
                    </span>
                    <span className="tp-polaroid__caption font-scrawl">{p.caption}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp"><span className="tp-lamp__light" /></span>
            <a className="btn btn-primary tp-facade__cta" href="#families">See every happy family</a>
            <PupStop pose="sit" facing="right" className="tp-dusk__teddy" />
          </div>
        </div>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
      {open >= 0 && (
        <dialog aria-label="Photo viewer" className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70" open onClick={() => setOpen(-1)} style={{ display: 'grid', placeItems: 'center' }}>
          <img alt={FAMILY_PHOTOS[open].caption} src={FAMILY_PHOTOS[open].img} style={{ maxWidth: '92vw', maxHeight: '86dvh', borderRadius: '0.4rem' }} />
          <button type="button" className="btn btn-ghost" style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', borderColor: 'var(--color-milk)', color: 'var(--color-milk)' }} onClick={() => setOpen(-1)}>Close</button>
        </dialog>
      )}
    </section>
  )
}
