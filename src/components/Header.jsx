/* Sticky site header with scroll states, desktop nav and mobile menu dialog. */
import { useEffect, useRef, useState } from 'react'
import hemSvg from '../assets/svg/hem.svg?raw'
import pawSvg from '../assets/svg/paw.svg?raw'
import pawMenuSvg from '../assets/svg/paw-menu.svg?raw'
import Svg from './Svg'
import { NAV_LINKS, WA_LINK, PHONE_TEL } from '../data'

export default function Header({ active = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const headerRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const header = headerRef.current
    let lastY = window.scrollY
    let ticking = false
    /* Phones/tablets hide the bar while scrolling down and bring it back on
       the way up, matching the original site. */
    const phone = window.matchMedia('(max-width: 1023px)')
    const apply = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (phone.matches) {
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > 220)
          lastY = y
        }
      }
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(apply)
    }
    const onFocus = () => setHidden(false)
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    header?.addEventListener('focusin', onFocus)
    phone.addEventListener?.('change', apply)
    return () => {
      window.removeEventListener('scroll', onScroll)
      header?.removeEventListener('focusin', onFocus)
      phone.removeEventListener?.('change', apply)
    }
  }, [])

  /* On desktop the walking pup drives the navbar: heading right tucks it
     away, turning back to the left brings it down again. */
  useEffect(() => {
    const root = document.documentElement
    const desktop = window.matchMedia('(min-width: 1024px)')
    const sync = () => {
      if (desktop.matches) setHidden(root.dataset.pupFacing === 'right')
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['data-pup-facing'] })
    desktop.addEventListener?.('change', sync)
    return () => {
      observer.disconnect()
      desktop.removeEventListener?.('change', sync)
    }
  }, [])

  const closeMenu = () => {
    const d = dialogRef.current
    if (!d || !d.open || d.dataset.closing) return
    d.dataset.closing = 'true'
    const done = () => {
      clearTimeout(timer)
      d.removeEventListener('animationend', onEnd)
      if (d.dataset.closing) d.close()
    }
    const onEnd = (e) => e.target === d && done()
    const timer = setTimeout(done, 600)
    d.addEventListener('animationend', onEnd)
  }
  const openMenu = () => dialogRef.current?.showModal()

  return (
    <header ref={headerRef} id="site-header" data-scrolled={scrolled} data-hidden={hidden} data-home={active === '' ? 'true' : 'false'} className="tp-header fixed inset-x-0 top-0 z-50">
      <div className="tp-header__bar gutter">
        <a className="tp-header__brand" aria-label="TeddyPups U.A.E. — home" href="/">
          <img alt="" width="56" height="56" className="tp-header__logo" src="/brand/logo.png" />
          <span className="font-plush tp-header__name">TeddyPups</span>
        </a>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a aria-current={l.href === active ? 'page' : undefined} data-active={l.href === active} className="tp-nav-link" href={l.href}>
                  <span>{l.label}</span>
                  <Svg src={pawSvg} className="tp-nav-link__paw" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">WhatsApp us</a>
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden" aria-haspopup="dialog" onClick={openMenu}>
            <Svg src={pawMenuSvg} className="size-4" />
            Menu
          </button>
          <dialog
            aria-label="Site menu"
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
            ref={dialogRef}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeMenu()
            }}
            onCancel={(e) => {
              e.preventDefault()
              closeMenu()
            }}
            onClose={(e) => {
              delete e.currentTarget.dataset.closing
            }}
          >
            <div className="flex h-full flex-col gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button type="button" className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk" onClick={closeMenu}>Close</button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {NAV_LINKS.map((l) => (
                    <li key={l.label}>
                      <a aria-current={l.href === active ? 'page' : undefined} data-active={l.href === active} className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]" href={l.href} onClick={closeMenu}>
                        <span>{l.label}</span>
                        <Svg src={pawSvg} className="tp-nav-link__paw" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-3">
                <a href={WA_LINK} className="btn btn-whatsapp w-full" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
                <p className="text-center text-sm font-medium">+971 54 167 6733</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <Svg src={hemSvg} className="tp-header__hem" />
    </header>
  )
}
