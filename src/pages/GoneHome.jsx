/* /gone-home — ticket stubs for every puppy who found a family. */
import PupBuddy from '../pup/PupBuddy'
import heartSvg from '../assets/svg/pages/gone-22.svg?raw'
import Svg from '../components/Svg'
import pages from '../data/pages.json'

export default function GoneHome() {
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <Svg src={heartSvg} />
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us &mdash; we&rsquo;ll help you find your match.
            </p>
            <a className="btn btn-primary mt-8" href="/puppies">See available puppies</a>
          </div>
          <div aria-hidden="true" className="tp-booth">
            <div className="pup-buddy tp-booth__teddy" data-facing="right">
              <PupBuddy pose="sit" facing="right" />
              <span aria-hidden="true" className="pup-bubble" data-show="false" />
            </div>
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>
        <div>
          <ul className="tp-tickets" aria-label="Puppies who have gone home">
            {pages.tickets.map((t, i) => (
              <li key={`${t.href}-${i}`} className="tp-ticket" data-reveal="true" style={{ '--tilt': t.tilt, '--i': t.i }}>
                <a className="tp-ticket__link" href={t.href} dangerouslySetInnerHTML={{ __html: t.html }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
