/* Scroll-driven paper plane: follows the dashed Korea → Dubai route. */
import { useEffect, useId, useRef } from 'react'

const ROUTE = 'M40 250 C 170 40, 470 20, 620 168'
const FALLBACK = 0.62

const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function Flight({ photo, label = 'A plane bringing a puppy from Korea to Dubai' }) {
  const rootRef = useRef(null)
  const pathRef = useRef(null)
  const planeRef = useRef(null)
  const rawId = useId()
  const clipId = `tp-plane-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    const plane = planeRef.current
    if (!root || !path || !plane) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let length = 0
    try {
      length = path.getTotalLength()
    } catch {
      length = 0
    }

    const draw = (progress) => {
      if (!length) return
      const at = clamp01(progress) * length
      const point = path.getPointAtLength(at)
      const ahead = path.getPointAtLength(Math.min(length, at + 1))
      const behind = path.getPointAtLength(Math.max(0, at - 1))
      const angle = (180 * Math.atan2(ahead.y - behind.y, ahead.x - behind.x)) / Math.PI
      plane.setAttribute('transform', `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)}) rotate(${angle.toFixed(1)})`)
      plane.style.opacity = String(clamp01((progress - 0.11) / 0.06))
    }

    if (reduced) {
      draw(FALLBACK)
      return
    }

    let raf = 0
    let lastScroll = null
    let lastHeight = null

    const update = () => {
      raf = 0
      const rect = root.getBoundingClientRect()
      const viewport = window.innerHeight
      // offset: ["start 95%", "end 25%"] — the flight starts when the element's
      // top crosses 95% of the viewport and ends when its bottom crosses 25%.
      const distance = rect.height + viewport * 0.7
      const progress = distance <= 0 ? 1 : (viewport * 0.95 - rect.top) / distance
      draw(progress)
      lastScroll = window.scrollY
      lastHeight = viewport
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      void lastScroll
      void lastHeight
    }
  }, [])

  return (
    <div className="tp-flight" ref={rootRef}>
      <svg viewBox="0 0 660 300" role="img" aria-label={label}>
        <defs>
          <clipPath id={clipId}>
            <circle r="25" />
          </clipPath>
        </defs>
        <path ref={pathRef} d={ROUTE} className="tp-flight__route" />
        <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
        <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
        <text x="40" y="284" textAnchor="middle" className="tp-flight__label">Korea</text>
        <text x="620" y="202" textAnchor="middle" className="tp-flight__label">Dubai</text>
        <g ref={planeRef} className="tp-flight__plane" transform="translate(40 250) rotate(-58.1)" style={{ opacity: 0 }}>
          <g transform="translate(-126 -78)">
            <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
            <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far" />
            <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" className="tp-flight__body" />
            <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
            <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
          </g>
          {photo && (
            <g transform="translate(10 2)">
              <image
                href={photo}
                x="-25"
                y="-25"
                width="50"
                height="50"
                clipPath={`url(#${clipId})`}
                preserveAspectRatio="xMidYMid slice"
              />
              <circle r="25" className="tp-flight__porthole" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
