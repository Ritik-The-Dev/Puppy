/* Your puppy journey: scroll-synced steps with a WhatsApp phone mock. */
import { useEffect, useRef, useState } from 'react'
import routeSvg from '../assets/svg/route.svg?raw'
import playSvg from '../assets/svg/icon-a.svg?raw'
import sendSvg from '../assets/svg/icon-b.svg?raw'
import Svg from './Svg'
import PupStop from '../pup/PupStop'
import { CHAT_STEPS, BREED_CHIPS, PUPPY_IMAGES, WA_LINK } from '../data'

export default function Chat() {
  const stepsRef = useRef(null)
  const screenRef = useRef(null)
  const [active, setActive] = useState(-1)
  const [typing, setTyping] = useState(false)
  const [layout, setLayout] = useState(() => ({
    wide: window.matchMedia('(min-width: 1024px)').matches,
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }))
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setLayout({ wide: wide.matches, reduced: reduced.matches })
    sync()
    wide.addEventListener?.('change', sync)
    reduced.addEventListener?.('change', sync)
    return () => {
      wide.removeEventListener?.('change', sync)
      reduced.removeEventListener?.('change', sync)
    }
  }, [])

  // Which step the story column is centred on (desktop only, like the live site).
  useEffect(() => {
    if (!layout.wide || layout.reduced) return
    const root = stepsRef.current
    if (!root) return
    const items = Array.from(root.children)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(items.indexOf(entry.target))
        }
      },
      { rootMargin: '-28% 0px -62% 0px' }
    )
    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [layout.wide, layout.reduced])

  // A new step "types" for 750ms, then its messages pop in.
  const lastStep = useRef(-1)
  useEffect(() => {
    if (!layout.wide || layout.reduced) {
      setTyping(false)
      lastStep.current = -1
      return
    }
    const grew = active > lastStep.current
    lastStep.current = active
    if (!grew || active < 0) return
    setTyping(true)
    const timer = setTimeout(() => {
      setTyping(false)
      const el = screenRef.current?.querySelector(`[data-step="${active}"]`)
      if (el) {
        dispatchEvent(
          new CustomEvent('pup:cue', {
            detail: {
              look: el,
              secs: 1.4,
              say: active === 1 ? 'ooh, photos!' : active === 2 ? 'home soon!' : undefined,
            },
          })
        )
      }
    }, 750)
    return () => clearTimeout(timer)
  }, [active, layout.wide, layout.reduced])

  const shown = !layout.wide || layout.reduced ? CHAT_STEPS.length - 1 : active
  const typingNow = typing && layout.wide && !layout.reduced

  const toggleVideo = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play().catch(() => {}); setPlaying(true) }
  }

  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-chat"
      style={{ '--sky-top': '#f7d18d', '--sky-bottom': '#f0b866' }}
      aria-labelledby="journey-title"
      id="journey"
    >
      <div className="tp-chat__grid gutter" data-pin-range="true">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">Your puppy journey</h2>
          <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.</p>
          <ol className="tp-chat__steps" ref={stepsRef}>
            {CHAT_STEPS.map((s, i) => (
              <li className="tp-chat__step" key={i} data-active={i === shown || undefined} data-done={i < shown || undefined}>
                <span className="tp-chat__num font-plush" aria-hidden="true">{i + 1}</span>
                <h3 className="font-plush tp-chat__title">{s.title}</h3>
                <p className="tp-chat__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <a className="btn btn-ghost tp-chat__cta" href="#journey">How it works</a>
        </div>
        <div className="tp-chat__side">
          <div className="tp-phone" aria-label="A WhatsApp conversation with TeddyPups U.A.E." role="group">
            <div className="tp-phone__bar">
              <img alt="" width="40" height="40" className="tp-phone__avatar" src="/brand/logo.png" />
              <span>
                <span className="tp-phone__name">TeddyPups U.A.E.</span>
                <span className="tp-phone__status">{typingNow ? 'typing…' : 'online'}</span>
              </span>
            </div>
            <div className="tp-phone__screen" ref={screenRef}>
              <p className="tp-msg tp-msg--me">Hi TeddyPups! I'd love to know more about your puppies.</p>
              <div className="tp-msg-group" data-step="0" data-show={0 < shown || (0 === shown && !typingNow)}>
                <div className="tp-msg tp-msg--them">
                  <p>{CHAT_STEPS[0].text}</p>
                  <ul className="tp-chips" aria-label="Breeds we have now">
                    {BREED_CHIPS.map((c) => (
                      <li key={c.label}><a href={c.href}>{c.label}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="tp-msg-group" data-step="1" data-show={1 < shown || (1 === shown && !typingNow)}>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-snaps">
                    {[PUPPY_IMAGES.show1, PUPPY_IMAGES.show2, PUPPY_IMAGES.show3, PUPPY_IMAGES.show4].map((src, i) => (
                      <span className="tp-snaps__one" key={i}>
                        <img alt="The apricot teddy bear puppy from our showroom" loading="lazy" src={src} />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-clip">
                    <video
                      ref={videoRef}
                      src={PUPPY_IMAGES.video}
                      poster={PUPPY_IMAGES.show1}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom"
                    />
                    <button type="button" className="tp-clip__play" aria-pressed={playing} aria-label="Play video" onClick={toggleVideo}>
                      <Svg src={playSvg} />
                    </button>
                  </div>
                </div>
                <p className="tp-msg tp-msg--them">{CHAT_STEPS[1].text}</p>
              </div>
              <div className="tp-msg-group" data-step="2" data-show={2 < shown || (2 === shown && !typingNow)}>
                <div className="tp-msg tp-msg--them">
                  <p>{CHAT_STEPS[2].text}</p>
                  <Svg src={routeSvg} className="tp-route" />
                </div>
              </div>
              <p className="tp-typing" data-show={typingNow} aria-hidden="true"><span /><span /><span /></p>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <Svg src={sendSvg} />
            </a>
          </div>
          <PupStop pose="sit" facing="right" className="tp-chat__teddy" />
        </div>
      </div>
    </section>
  )
}
