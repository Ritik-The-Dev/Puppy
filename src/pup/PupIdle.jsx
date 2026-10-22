/* Ambient life for statically rendered puppets: breathing, tail wag, blinks,
   head tilts and the occasional speech bubble above their heads. */
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
          nextTalk: performance.now() / 1000 + 2 + Math.random() * 6,
          bubbleUntil: 0,
          line: Math.floor(Math.random() * LINES.length),
          nextTilt: performance.now() / 1000 + 4 + Math.random() * 5,
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
      p.hop = 1
      p.motion.wag = 1
      p.tilt = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 4)
      p.tiltUntil = performance.now() / 1000 + 1.1
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
        m.wag += (0.65 - m.wag) * Math.min(1, dt * 1.5)
        m.gazeX += (Math.sin(time * 0.45 + p.seed) * 0.4 - m.gazeX) * Math.min(1, dt * 3)
        m.gazeY += (Math.sin(time * 0.31 + p.seed * 2) * 0.22 - m.gazeY) * Math.min(1, dt * 3)

        if (time > p.nextBlink) {
          p.blinkUntil = time + 0.16
          p.nextBlink = time + 2.6 + Math.random() * 4.2
        }
        m.blink = time < p.blinkUntil ? 1 : 0

        if (p.bubble) {
          if (time > p.nextTalk) {
            p.nextTalk = time + 7 + Math.random() * 5
            p.bubble.textContent = LINES[p.line++ % LINES.length]
            p.bubble.dataset.show = 'true'
            p.bubbleUntil = time + 1.9
          }
          if (p.bubble.dataset.show === 'true' && time > p.bubbleUntil) p.bubble.dataset.show = 'false'
        }

        if (time > p.nextTilt) {
          p.tilt = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 4)
          p.tiltUntil = time + 1.1 + Math.random() * 0.6
          p.nextTilt = time + 6 + Math.random() * 5
        }
        if (p.tilt && time > p.tiltUntil) p.tilt = 0

        const computed = computeFrame(p.pose, m)
        applyFrame(p.svg, computed, p.facing)
        if (p.tilt) {
          const head = p.svg.querySelector('g[data-p="head"]')
          if (head) head.setAttribute('transform', `${computed.head} rotate(${p.tilt.toFixed(2)} 212 100)`)
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
