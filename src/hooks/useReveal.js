/* Scroll-reveal: arms [data-reveal] nodes below the fold and reveals them on entry. */
import { useEffect } from 'react'

export default function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const arm = (el) => {
      if (el.dataset.revealed) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.92) {
        el.dataset.revealed = 'true'
        delete el.dataset.armed
      } else {
        el.dataset.armed = 'true'
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target
          if (el.dataset.revealed) continue
          el.dataset.revealed = 'true'
          delete el.dataset.armed
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    )

    const watch = (root) => {
      root.querySelectorAll('[data-reveal]').forEach((el) => {
        if (reduce) {
          el.dataset.revealed = 'true'
          return
        }
        arm(el)
        io.observe(el)
      })
    }

    watch(document)

    const mo = new MutationObserver((muts) => {
      let dirty = false
      for (const m of muts) if (m.addedNodes.length) dirty = true
      if (dirty) watch(document)
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
