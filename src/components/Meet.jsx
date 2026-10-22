/* Meet the pups: pinned hall of doors that swing open as the wall scrolls past. */
import { useEffect, useRef, useState } from 'react'
import peepholeSvg from '../assets/svg/peephole.svg?raw'
import Svg from './Svg'
import PupStop from '../pup/PupStop'
import { DOORS } from '../data'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export default function Meet() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const hallRef = useRef(null)
  const trackRef = useRef(null)
  const [pinned, setPinned] = useState(false)
  const pinnedRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const hall = hallRef.current
    const track = trackRef.current
    if (!root || !stage || !hall || !track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let travel = 0
    let raf = 0
    let value = 0
    let velocity = 0
    let last = performance.now()

    const measure = () => {
      const wide = window.matchMedia('(min-width: 1024px)').matches
      const isPinned = wide && !reduced
      pinnedRef.current = isPinned
      setPinned(isPinned)

      if (isPinned) {
        const head = stage.querySelector('.tp-meet__head')
        const plates = [...track.querySelectorAll('.tp-door__plate')].map((e) => e.offsetHeight)
        const plateH = Math.max(64, ...plates)
        const floorH = hall.querySelector('.tp-meet__floor')?.offsetHeight ?? 0
        const doorW = Math.max(
          128,
          Math.min(
            256,
            window.innerWidth * 0.15,
            (stage.clientHeight - (head ? head.offsetTop + head.offsetHeight : 0) - floorH - plateH - 40) / 1.3
          )
        )
        hall.style.setProperty('--door-w', `${doorW.toFixed(0)}px`)
      } else {
        hall.style.removeProperty('--door-w')
      }

      const overflow = isPinned ? Math.max(0, track.scrollWidth - window.innerWidth) : 0
      travel = overflow
      root.style.height = isPinned ? `calc(100vh + ${Math.round(overflow * 0.8)}px)` : ''
      if (!isPinned) {
        track.style.transform = ''
        hall.querySelector('.tp-meet__floor')?.style.setProperty('--floor-x', '0px')
        for (const door of track.children) door.dataset.open = 'true'
        // The track is not translated while unpinned, so re-seed the spring there.
        value = 0
        velocity = 0
      }
    }

    const syncDoors = (x, cue) => {
      const threshold = window.innerWidth * 0.36
      for (const door of track.children) {
        if (door.classList.contains('tp-door--all')) continue
        const open = door.offsetLeft + x < threshold
        if (door.dataset.open !== String(open)) {
          door.dataset.open = String(open)
          if (open && cue) {
            dispatchEvent(new CustomEvent('pup:cue', { detail: { look: door, secs: 0.9 } }))
          }
        }
      }
    }

    const apply = (x, cue) => {
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
      hall.querySelector('.tp-meet__floor')?.style.setProperty('--floor-x', `${x.toFixed(1)}px`)
      syncDoors(x, cue)
    }

    const tick = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      if (!pinnedRef.current) {
        raf = requestAnimationFrame(tick)
        return
      }
      const rect = root.getBoundingClientRect()
      const range = Math.max(1, rect.height - window.innerHeight)
      const progress = clamp(-rect.top / range, 0, 1)
      const target = -travel * progress
      // Spring (stiffness 170, damping 32, mass 0.35) — matches the live site's feel.
      // Integrate in small fixed sub-steps: one big Euler step is numerically
      // unstable at low frame rates and can fling the whole track off-screen.
      const h = 1 / 240
      const steps = Math.max(1, Math.ceil(dt / h))
      const sub = dt / steps
      for (let i = 0; i < steps; i++) {
        const accel = ((target - value) * 170 - velocity * 32) / 0.35
        velocity += accel * sub
        value += velocity * sub
      }
      if (!Number.isFinite(value) || !Number.isFinite(velocity)) {
        value = target
        velocity = 0
      }
      // Damping is over-critical, so the live track never overshoots: keep the
      // translation inside the track's real travel range.
      if (value > 0) {
        value = 0
        velocity = Math.min(velocity, 0)
      } else if (value < -travel) {
        value = -travel
        velocity = Math.max(velocity, 0)
      }
      if (Math.abs(target - value) < 0.1 && Math.abs(velocity) < 0.5) {
        value = target
        velocity = 0
      }
      apply(value, true)
      raf = requestAnimationFrame(tick)
    }

    measure()
    for (const door of track.children) if (!pinnedRef.current) door.dataset.open = 'true'
    else door.dataset.open = 'false'

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    if (stage) ro.observe(stage)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    raf = requestAnimationFrame(tick)
    const settle = setTimeout(measure, 400)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
      clearTimeout(settle)
    }
  }, [])

  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-meet"
      data-pinned={pinned || undefined}
      style={{ '--sky-top': '#fff1d8', '--sky-bottom': '#fbe3b4' }}
      aria-labelledby="meet-title"
      id="meet"
    >
      <div data-pin-range="true" ref={rootRef} style={{ '--pinned': pinned ? 1 : 0 }}>
        <div className="tp-meet__stage" ref={stageRef}>
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">Meet the pups</h2>
              <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">Real puppies, real photos, looking for their families right now.</p>
            </div>
            <a className="btn btn-primary shrink-0" href="/puppies">See all available puppies</a>
          </header>
          <div className="tp-meet__hall" ref={hallRef}>
            <ul className="tp-meet__track" data-treadmill="true" ref={trackRef} aria-label="Puppies looking for a family">
              {DOORS.map((d, i) => (
                <li className="tp-door" data-open="false" key={`${d.name}-${i}`}>
                  <a className="tp-door__link" style={{ '--door': d.door }} href={`/puppies`}>
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">{d.name}</span>
                      <span className="tp-door__meta">{d.meta}</span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room">
                        <img alt={`${d.name} puppy`} loading="lazy" src={d.img} style={{ objectPosition: d.pos }} />
                      </span>
                      <span aria-hidden="true" className="tp-door__way">
                        <span className="tp-door__leaf">
                          <Svg src={peepholeSvg} className="tp-door__peephole" />
                          <span className="tp-door__knob" />
                        </span>
                      </span>
                      <span className="tp-door__tag font-scrawl">Available</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <a className="tp-door__link" href="/puppies">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </a>
              </li>
            </ul>
            <div aria-hidden="true" className="tp-meet__floor" />
            <PupStop pose={pinned ? 'walk' : 'sit'} act={pinned ? 'treadmill' : undefined} className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </section>
  )
}
