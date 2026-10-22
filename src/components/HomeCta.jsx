/* Final CTA: the lit house with an opening door and "welcome home" mat. */
import PupStop from '../pup/PupStop'
import { PUPPY_IMAGES, WA_LINK } from '../data'

export default function HomeCta() {
  return (
    <section
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-home"
      style={{ '--sky-top': '#2f1a10', '--sky-bottom': '#24130b' }}
      aria-labelledby="cta-title"
      id="cta"
    >
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">Ready to meet your new best friend?</h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
        </p>
      </div>
      <div className="tp-house">
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden="true" className="tp-house__lamp" />
        <div className="tp-house__doorway">
          <span className="tp-house__inside">
            <img alt="Max, waiting inside" loading="lazy" src={PUPPY_IMAGES.max} style={{ objectPosition: '53.8% 44.3%' }} />
          </span>
          <span aria-hidden="true" className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden="true" className="tp-house__mat font-scrawl">welcome home</span>
        <PupStop pose="bow" facing="right" className="tp-house__teddy" />
      </div>
      <div className="tp-home__actions gutter">
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Enquire on WhatsApp</a>
        <a className="btn btn-ghost tp-home__ghost" href="#cta">Visit &amp; contact</a>
      </div>
    </section>
  )
}
