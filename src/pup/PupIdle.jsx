/* Ambient life for statically rendered puppets: breathing, tail wag, blinks,
   and the original nine-second idle act (a "hm?" head tilt or a wag pulse).
   They only speak when clicked, exactly like the live site. */
import { useEffect } from 'react'
import { POSES, computeFrame } from './mascot'
import { applyFrame } from './rig'

const LINES = ['woof!', 'pats please', "i'm friendly", 'hello!', 'sniff sniff', 'best day ever', 'wanna play?', 'hm?']

export default function PupIdle() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const puppets = [...document.querySelectorAll('.pup-buddy')]
      .filter((el) => !el.closest('.pup-actor'))
      .map((el) => {
        const svg = el.querySelector('svg')
        if (!svg) return null
        const pose = svg.dataset.pose || 'sit'
        const face = el.dataset.facing === 'left' ? -1 : 1
        el.setAttribute('data-live', '')
        return {
          el,
          svg,
          // Stop puppets are hidden while the travelling rig owns that spot.
          inStop: !!el.closest('.pup-stop'),
          pose: POSES[pose] || POSES.sit,
          facing: face,
          bubble: el.querySelector(':scope > .pup-bubble'),
          motion: {
            phase: Math.random() * Math.PI * 2,
            stride: 0,
            time: 0,
            wag: 0.55 + Math.random() * 0.3,
            gazeX: 0,
            gazeY: 0,
            blink: 0,
            ear: 0,
          },
          seed: Math.random() * 10,
          nextBlink: performance.now() / 1000 + 1 + Math.random() * 4,
          blinkUntil: 0,
          bubbleUntil: 0,
          queue: [],
          lastAct: performance.now() / 1000,
          headCock: 0,
          headCockTarget: 0,
          wagBoostUntil: 0,
          tilt: 0,
          tiltUntil: 0,
          hop: 0,
        }
      })
      .filter(Boolean)
    if (!puppets.length) return

    const onClick = (p) => {
      if (p.bubble) {
        p.bubble.textContent = LINES[Math.floor(Math.random() * LINES.length)]
        p.bubble.dataset.show = 'true'
        p.bubbleUntil = performance.now() / 1000 + 1.9
      }
      const now = performance.now() / 1000
      p.hop = 1
      p.motion.wag = 1
      p.tilt = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 4)
      p.tiltUntil = now + 1.1
      p.lastAct = now
      p.queue = []
      p.headCockTarget = 0
      p.wagBoostUntil = 0
    }
    for (const p of puppets) p.svg.addEventListener('click', () => onClick(p))

    let raf = 0
    let last = performance.now() / 1000

    const frame = (now) => {
      const time = now / 1000
      const dt = Math.min(0.05, Math.max(0.001, time - last))
      last = time
      const rig = document.documentElement.dataset.pup
      for (const p of puppets) {
        if (p.inStop && rig) continue
        const m = p.motion
        m.time = time
        m.phase += dt * 1.25
        m.wag += ((p.wagBoostUntil > time ? 1 : 0.65) - m.wag) * Math.min(1, dt * 1.5)
        m.gazeX += (Math.sin(time * 0.45 + p.seed) * 0.4 - m.gazeX) * Math.min(1, dt * 3)
        m.gazeY += (Math.sin(time * 0.31 + p.seed * 2) * 0.22 - m.gazeY) * Math.min(1, dt * 3)

        if (time > p.nextBlink) {
          p.blinkUntil = time + 0.16
          p.nextBlink = time + 2.6 + Math.random() * 4.2
        }
        m.blink = time < p.blinkUntil ? 1 : 0

        while (p.queue.length && p.queue[0][0] <= time) p.queue.shift()[1]()
        p.headCock += (p.headCockTarget - p.headCock) * Math.min(1, dt / 0.18)

        /* The original waits nine quiet seconds, then either cocks its head
           ("hm?") or gives a short wag. No unprompted chatter. */
        if (!p.queue.length && time - p.lastAct > 9) {
          p.lastAct = time
          if (Math.random() < 0.55) {
            p.headCockTarget = -14
            if (p.bubble) {
              p.bubble.textContent = 'hm?'
              p.bubble.dataset.show = 'true'
              p.bubbleUntil = time + 1.4
            }
            p.queue.push(
              [time + 0.8, () => { p.headCockTarget = 12 }],
              [time + 1.6, () => { p.headCockTarget = 0 }]
            )
          } else {
            p.wagBoostUntil = time + 2.4
            p.queue.push([time + 2.4, () => { p.wagBoostUntil = 0 }])
          }
        }

        if (p.bubble && p.bubble.dataset.show === 'true' && time > p.bubbleUntil) {
          p.bubble.dataset.show = 'false'
        }

        if (p.tilt && time > p.tiltUntil) p.tilt = 0

        const computed = computeFrame(p.pose, m)
        applyFrame(p.svg, computed, p.facing)
        const cock = p.headCock + p.tilt
        if (Math.abs(cock) > 0.01) {
          const head = p.svg.querySelector('g[data-p="head"]')
          if (head) head.setAttribute('transform', `${computed.head} rotate(${cock.toFixed(2)} 212 100)`)
        }

        if (p.hop > 0) {
          const lift = Math.sin(Math.min(1, p.hop) * Math.PI) * 7
          p.el.style.translate = `0 ${(-lift).toFixed(1)}px`
          p.hop = Math.max(0, p.hop - dt * 2.2)
          if (p.hop === 0) p.el.style.removeProperty('translate')
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      for (const p of puppets) {
        p.el.removeAttribute('data-live')
        p.el.style.removeProperty('translate')
        if (p.bubble) p.bubble.dataset.show = 'false'
      }
    }
  }, [])

  return null
}
