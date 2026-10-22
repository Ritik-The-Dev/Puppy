/* Puppy passport: trust stamps in a big passport book, sunset horizon. */
import heartSvg from '../assets/svg/heart.svg?raw'
import planeSvg from '../assets/svg/plane.svg?raw'
import headsetSvg from '../assets/svg/headset.svg?raw'
import globeSvg from '../assets/svg/globe.svg?raw'
import citySvg from '../assets/svg/city.svg?raw'
import Svg from './Svg'
import PupStop from '../pup/PupStop'
import { STAMP_ENTRIES } from '../data'

const ICONS = { heart: heartSvg, plane: planeSvg, headset: headsetSvg, globe: globeSvg }

export default function Passport() {
  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-passport"
      style={{ '--sky-top': '#f0b866', '--sky-bottom': '#a65a30' }}
      aria-labelledby="trust-title"
      id="trust"
    >
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden="true" className="tp-book__kicker font-scrawl">puppy passport</p>
            <h2 id="trust-title" className="font-plush tp-book__title">Why families trust TeddyPups</h2>
            <PupStop pose="sit" facing="right" className="tp-book__teddy" />
          </div>
          <ul className="tp-book__page tp-book__page--right">
            {STAMP_ENTRIES.map((e, i) => (
              <li className="tp-entry" key={i} style={{ '--ink-stamp': e.ink, '--tilt': e.tilt, '--i': i }}>
                <span className={`tp-stamp tp-stamp--${e.shape}`}>
                  <Svg src={ICONS[e.icon]} className="tp-stamp__icon" />
                  <span className="tp-stamp__title font-plush">{e.title}</span>
                </span>
                <p className="tp-entry__text">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="tp-horizon">
        <span className="tp-horizon__sun" />
        <Svg src={citySvg} className="tp-horizon__city" />
      </div>
    </section>
  )
}
