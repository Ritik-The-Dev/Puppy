/* Hero scene: sunrise glow, headline, rotating arch lineup of puppies, quilt. */
import { useEffect, useRef, useState } from 'react'
import underlineSvg from '../assets/svg/underline.svg?raw'
import quiltEdgeSvg from '../assets/svg/quilt-edge.svg?raw'
import Svg from './Svg'
import PupStop from '../pup/PupStop'
import { DOORS, WA_LINK } from '../data'

const SEATS = [
  { x: '9%', w: '8.6rem', peek: 0.62, tilt: '-5deg' },
  { x: '22.5%', w: '10.4rem', peek: 0.8, tilt: '3deg' },
  { x: '35%', w: '9.2rem', peek: 0.7, tilt: '-2deg' },
  { x: '65%', w: '9.4rem', peek: 0.74, tilt: '3deg' },
  { x: '77.5%', w: '10.6rem', peek: 0.82, tilt: '-3deg' },
  { x: '91%', w: '8.4rem', peek: 0.6, tilt: '4deg' },
]
const DWELL = [1900, 2500, 1700, 2300, 2000, 2800, 1800]

function shuffled(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function Hero() {
  const friends = DOORS
  const seatCount = Math.min(SEATS.length, friends.length)
  const [order, setOrder] = useState(() => friends.slice(0, seatCount).map((_, i) => i))
  const [states, setStates] = useState({})
  const [tagSeat, setTagSeat] = useState(null)
  const [focusSeat, setFocusSeat] = useState(null)
  const lineupRef = useRef(null)
  const orderRef = useRef(order)

  useEffect(() => {
    orderRef.current = order
  }, [order])

  useEffect(() => {
    const root = lineupRef.current
    if (!root || !seatCount) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hasExtra = friends.length > seatCount
    if (!hasExtra) return

    const scene = root.closest('[data-pup-scene]')
    let visible = true
    let quietUntil = 0
    let alive = true
    let nextDwell = 0
    const timers = []
    const wait = (fn, ms) => timers.push(setTimeout(fn, ms))
    const seen = new Set(orderRef.current)
    let queue = shuffled(friends.map((_, i) => i).filter((i) => !seen.has(i)))

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0.35 })
    io.observe(root)

    const quiet = () => { quietUntil = performance.now() + 1200 }
    window.addEventListener('scroll', quiet, { passive: true })
    window.addEventListener('pointerdown', quiet, { passive: true })
    root.addEventListener('pointerover', quiet, { passive: true })

    const step = () => {
      if (!alive) return
      if (document.hidden || !visible || performance.now() < quietUntil || scene?.dataset.here === 'false') {
        wait(step, 900)
        return
      }
      if (!queue.length) {
        const current = new Set(orderRef.current)
        queue = shuffled(friends.map((_, i) => i).filter((i) => !current.has(i)))
      }
      const seat = Math.floor(Math.random() * seatCount)
      const friend = queue.shift()
      if (friend === undefined) return wait(step, 2000)
      setStates((s) => ({ ...s, [seat]: 'duck' }))
      wait(() => {
        setOrder((prev) => prev.map((v, i) => (i === seat ? friend : v)))
        queue.push(orderRef.current[seat])
        setStates((s) => ({ ...s, [seat]: 'pop' }))
        setTagSeat(seat)
        wait(() => setTagSeat((cur) => (cur === seat ? null : cur)), 1800)
        wait(() => setStates((s) => ({ ...s, [seat]: undefined })), 700)
      }, 360)
      wait(step, DWELL[nextDwell++ % DWELL.length])
    }
    wait(step, 1600)

    return () => {
      alive = false
      timers.forEach(clearTimeout)
      io.disconnect()
      window.removeEventListener('scroll', quiet)
      window.removeEventListener('pointerdown', quiet)
      root.removeEventListener('pointerover', quiet)
    }
  }, [friends, seatCount])

  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-hero"
      style={{ '--sky-top': '#fffdf8', '--sky-bottom': '#fff1d8', '--quilt': '#fff1d8' }}
      aria-labelledby="hero-title"
    >
      <span aria-hidden="true" className="tp-hero__sun" />
      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          every puppy is family
          <Svg src={underlineSvg} className="absolute -bottom-2 left-0 h-3 w-full text-toffee" />
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="tp-hero__line">Premium teacup</span>
          <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
        </h1>
        <p className="tp-hero__lede">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
        </p>
        <div className="tp-hero__actions">
          <a className="btn btn-primary" href="/puppies">View available puppies</a>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Enquire on WhatsApp</a>
        </div>
      </div>
      <div className="tp-hero__stage">
        <ul className="tp-lineup" aria-label="Some of the puppies in our showroom" ref={lineupRef}>
          {order.map((friendIndex, seat) => {
            const p = friends[friendIndex]
            const s = SEATS[seat]
            return (
              <li key={seat} className="tp-lineup__seat" style={{ '--x': s.x, '--w': s.w, '--peek': s.peek, '--tilt': s.tilt, '--i': seat }}>
                <a
                  className="tp-lineup__pup"
                  data-pup-friend="true"
                  data-state={states[seat]}
                  aria-label={`Meet ${p.name}, ${p.meta.split(',')[0]}`}
                  href="/puppies"
                  onPointerEnter={() => setFocusSeat(seat)}
                  onPointerLeave={() => setFocusSeat((cur) => (cur === seat ? null : cur))}
                  onFocus={() => setFocusSeat(seat)}
                  onBlur={() => setFocusSeat((cur) => (cur === seat ? null : cur))}
                >
                  <span className="tp-lineup__photo">
                    <img alt={`${p.name} puppy`} loading="eager" src={p.img} style={{ objectPosition: p.pos }} />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
          {order.map((friendIndex, seat) => {
            const p = friends[friendIndex]
            const s = SEATS[seat]
            return (
              <li key={seat} className="tp-lineup__seat" style={{ '--x': s.x, '--w': s.w, '--peek': s.peek, '--tilt': s.tilt, '--i': seat }}>
                <span className="tp-lineup__ghost" data-state={states[seat]} data-tag={tagSeat === seat || focusSeat === seat ? 'show' : undefined}>
                  <span className="tp-lineup__name font-scrawl">{p.name}</span>
                </span>
              </li>
            )
          })}
        </ul>
        <span aria-hidden="true" className="tp-lineup__wings" />
        <PupStop pose="peek" facing="right" act="peekaboo" behind lane className="tp-hero__teddy" />
        <div aria-hidden="true" className="tp-quilt">
          <Svg src={quiltEdgeSvg} className="tp-quilt__edge" />
        </div>
      </div>
    </section>
  )
}
