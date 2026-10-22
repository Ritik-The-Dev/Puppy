/* Two ways to meet your puppy: signpost fork with showroom window + flight path. */
import skylineSvg from '../assets/svg/skyline.svg?raw'
import Svg from './Svg'
import Flight from './Flight'
import PupStop from '../pup/PupStop'
import { PUPPY_IMAGES } from '../data'

export default function Paths() {
  return (
    <section
      data-pup-scene="true"
      data-tone="light"
      className="tp-scene tp-paths"
      style={{ '--sky-top': '#fbe3b4', '--sky-bottom': '#f7d18d' }}
      aria-labelledby="paths-title"
      id="paths"
    >
      <div className="gutter mx-auto max-w-[110rem]">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">Two ways to meet your puppy</h2>
        <div className="tp-fork">
          <div aria-hidden="true" className="tp-fork__post" />
          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">Puppies in Dubai</h3>
            <div className="tp-way__scene" data-pup-look="true">
              <Svg src={skylineSvg} className="tp-way__skyline" />
              <figure className="tp-window">
                <span className="tp-window__glass">
                  <img alt="A tiny apricot teddy bear puppy held up in the TeddyPups showroom" loading="lazy" src={PUPPY_IMAGES.show1} style={{ objectPosition: '54.3% 48.3%' }} />
                </span>
                <figcaption className="font-scrawl">In our showroom</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
            <a className="btn btn-primary" href="#meet">Meet local puppies</a>
          </article>
          <article className="tp-way tp-way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">Imported for you</h3>
            <div className="tp-way__scene" data-pup-look="true">
              <Flight photo={PUPPY_IMAGES.ktm} />
            </div>
            <p className="tp-way__text">Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.</p>
            <a className="btn btn-primary" href="#meet">See imported puppies</a>
          </article>
          <PupStop pose="sit" facing="right" className="tp-fork__teddy" />
        </div>
      </div>
    </section>
  )
}
