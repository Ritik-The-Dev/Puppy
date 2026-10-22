/* Footer: hill, moon, basket with a snug puppy, links, mobile action bar. */
import hillSvg from '../assets/svg/hill.svg?raw'
import twinkleSvg from '../assets/svg/twinkle.svg?raw'
import basketBackSvg from '../assets/svg/basket-back.svg?raw'
import basketFrontSvg from '../assets/svg/basket-front.svg?raw'
import Svg from './Svg'
import PupStop from '../pup/PupStop'
import { FOOTER_EXPLORE, FOOTER_STARS, SOCIALS, WA_LINK, PHONE_TEL } from '../data'

export default function Footer() {
  return (
    <>
      <footer className="tp-footer relative pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
        <Svg src={hillSvg} className="tp-footer__hill" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {FOOTER_STARS.map((s, i) => (
              <Svg key={i} src={twinkleSvg} className="tp-twinkle absolute text-honey" style={{ left: s.left, top: s.top, width: s.size, height: s.size }} />
            ))}
          </div>
          <span className="tp-moon" />
        </div>
        <div className="gutter relative mx-auto grid max-w-[110rem] gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
          <div className="md:col-span-5">
            <p className="font-plush text-big text-honey-soft">Home, at last.</p>
            <p className="mt-5 max-w-md text-milk/80">
              TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
            </p>
          </div>
          <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
            <div className="tp-basket">
              <Svg src={basketBackSvg} className="tp-basket__back" />
              <PupStop pose="snug" facing="right" act="basket" behind lane className="tp-basket__pup" />
              <Svg src={basketFrontSvg} className="tp-basket__front" />
            </div>
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
            <h2 className="font-scrawl text-lg text-honey">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_EXPLORE.map((l) => (
                <li key={l.label}>
                  <a className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3 md:row-span-2 md:row-start-1">
            <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
            <ul className="mt-4 space-y-2.5 text-milk/90">
              <li><a className="font-semibold hover:text-honey" href={WA_LINK} target="_blank" rel="noopener noreferrer">WhatsApp +971 54 167 6733</a></li>
              <li><a className="break-all hover:text-honey" href="mailto:teddypupsadmin@gmail.com">teddypupsadmin@gmail.com</a></li>
              <li>Downtown Dubai, United Arab Emirates</li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social media">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="gutter relative mx-auto mt-16 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
          <span className="flex items-center gap-3">
            <img alt="" loading="lazy" width="36" height="36" className="size-9" src="/brand/logo.png" />© 2026 TeddyPups U.A.E.
          </span>
          <span className="font-scrawl text-base text-honey/80">every puppy is family</span>
        </div>
      </footer>
      <div data-whatsapp-bar="true" className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-cocoa bg-milk px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp !min-h-12 flex-1 !shadow-none">WhatsApp us</a>
          <a href={PHONE_TEL} className="btn btn-ghost !min-h-12 !px-5">Call</a>
        </div>
      </div>
    </>
  )
}
