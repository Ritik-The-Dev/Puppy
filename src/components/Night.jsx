/* Night scene: twinkling stars + frequently asked questions. */
import starSvg from '../assets/svg/star.svg?raw'
import twinkleSvg from '../assets/svg/twinkle.svg?raw'
import Svg from './Svg'
import PupStop from '../pup/PupStop'
import { FAQS, NIGHT_STARS } from '../data'

export default function Night() {
  return (
    <section
      data-pup-scene="true"
      data-tone="dark"
      className="tp-scene tp-night"
      style={{ '--sky-top': '#4d2b19', '--sky-bottom': '#2f1a10' }}
      aria-labelledby="questions-title"
      id="questions"
    >
      <div aria-hidden="true" className="pointer-events-none tp-night__stars">
        {NIGHT_STARS.map((s, i) => (
          <Svg
            key={i}
            src={twinkleSvg}
            className="tp-twinkle absolute text-honey"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          />
        ))}
      </div>
      <div className="tp-night__grid gutter">
        <div className="tp-night__intro">
          <h2 id="questions-title" className="font-plush text-huge">Questions, answered</h2>
          <a className="btn btn-ghost tp-night__cta" href="#questions">Read all questions</a>
          <div className="tp-night__pup">
            <span aria-hidden="true" className="tp-night__wonder font-plush">?</span>
            <PupStop pose="sit" facing="right" act="tilt" className="tp-night__teddy" />
          </div>
        </div>
        <dl className="tp-night__list">
          {FAQS.map((f, i) => (
            <div className="tp-qa" data-pup-look="" key={i}>
              <dt className="font-plush tp-qa__q">
                <Svg src={starSvg} className="tp-qa__star" />
                {f.q}
              </dt>
              <dd className="tp-qa__a">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
