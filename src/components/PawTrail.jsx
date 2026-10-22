/* Paw-print trail that follows the pointer across the whole page. */
import { useEffect, useRef } from 'react'

const PAW =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z'

export default function PawTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const path = new Path2D(PAW)
    const marks = []
    let dpr = 1
    let raf = 0
    let running = false
    let lastX = NaN
    let lastY = NaN
    let travelled = 0
    let flip = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()

    const frame = (now) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = marks.length - 1; i >= 0; i--) {
        const mark = marks[i]
        const age = now - mark.born
        if (age > 1000) {
          marks.splice(i, 1)
          continue
        }
        const fade = age < 600 ? 1 : 1 - (age - 600) / 400
        ctx.globalAlpha = 0.42 * fade * fade
        ctx.setTransform(0.27 * dpr, 0, 0, 0.27 * dpr, mark.x * dpr, mark.y * dpr)
        ctx.rotate(mark.angle)
        ctx.translate(-32, -34)
        ctx.fillStyle = '#c2622b'
        ctx.fill(path)
      }
      if (marks.length) raf = requestAnimationFrame(frame)
      else running = false
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      if (Number.isNaN(lastX)) {
        lastX = e.clientX
        lastY = e.clientY
        return
      }
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      travelled += Math.hypot(dx, dy)
      if (travelled >= 46) {
        travelled = 0
        const angle = Math.atan2(dy, dx) + Math.PI / 2
        flip = -flip
        const offset = 7 * flip
        marks.push({
          x: e.clientX + Math.cos(angle) * offset + 14,
          y: e.clientY + Math.sin(angle) * offset + 16,
          angle,
          born: performance.now(),
        })
        if (marks.length > 14) marks.shift()
        if (!running) {
          running = true
          raf = requestAnimationFrame(frame)
        }
      }
      lastX = e.clientX
      lastY = e.clientY
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />
}
