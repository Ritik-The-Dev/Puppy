/* /how-it-works — the two journeys, the promise passport, delivery, why us. */
import { useState } from 'react'
import Svg from '../components/Svg'
import PupBuddy from '../pup/PupBuddy'
import contactSticky from '../assets/svg/pages/how-23.svg?raw'
import stepLocal0 from '../assets/svg/pages/how-24.svg?raw'
import stepLocal1 from '../assets/svg/pages/how-25.svg?raw'
import stepLocal2 from '../assets/svg/pages/how-26.svg?raw'
import stepLocal3 from '../assets/svg/pages/how-27.svg?raw'
import routeSvg from '../assets/svg/pages/how-28.svg?raw'
import planeSvg from '../assets/svg/pages/how-29.svg?raw'
import stepImp0 from '../assets/svg/pages/how-30.svg?raw'
import stepImp1 from '../assets/svg/pages/how-31.svg?raw'
import stepImp2 from '../assets/svg/pages/how-32.svg?raw'
import stepImp3 from '../assets/svg/pages/how-33.svg?raw'
import stamp0 from '../assets/svg/pages/how-34.svg?raw'
import stamp1 from '../assets/svg/pages/how-35.svg?raw'
import stamp2 from '../assets/svg/pages/how-36.svg?raw'
import flightHill from '../assets/svg/pages/how-37.svg?raw'
import Flight from '../components/Flight'
import why0 from '../assets/svg/pages/how-39.svg?raw'
import why1 from '../assets/svg/pages/how-40.svg?raw'
import why2 from '../assets/svg/pages/how-41.svg?raw'
import { WA_LINK } from '../data'

const LOCAL_STEPS = [
  {
    icon: stepLocal0,
    title: 'Explore our puppies',
    text: 'Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.',
    tint: '#fbe3b4',
  },
  {
    icon: stepLocal1,
    title: 'Choose your puppy',
    text: 'Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.',
    tint: '#fde6de',
  },
  {
    icon: stepLocal2,
    title: 'Meet before you choose',
    text: 'Spend time bonding before making your decision.',
    tint: '#e3f0fb',
  },
  {
    icon: stepLocal3,
    title: 'Pick-up or delivery',
    text: 'Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.',
    tint: '#e6f2df',
  },
]

const IMPORTED_STEPS = [
  {
    icon: stepImp0,
    title: 'Reserve your puppy',
    text: 'Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.',
    tint: '#fbe3b4',
  },
  {
    icon: stepImp1,
    title: 'Personalized consultation',
    text: 'Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy’s journey.',
    tint: '#fde6de',
  },
  {
    icon: stepImp2,
    title: 'Import and arrival',
    text: 'We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.',
    tint: '#e3f0fb',
  },
  {
    icon: stepImp3,
    title: 'Welcome home',
    text: 'Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.',
    tint: '#e6f2df',
  },
]

function Steps({ steps }) {
  return (
    <ol className="tp-steps">
      {steps.map((s, i) => (
        <li key={s.title} className="tp-step" style={{ '--i': i, '--tint': s.tint }}>
          <span aria-hidden="true" className="tp-step__icon"><Svg src={s.icon} /></span>
          <span className="tp-step__num font-plush">Step {i + 1}</span>
          <h4 className="font-plush-text tp-step__title">{s.title}</h4>
          <p className="tp-step__text">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}

export default function HowItWorks() {
  const [tab, setTab] = useState(0)

  return (
    <div data-page="how" className="tp-page">
      <section data-pup-scene="true" data-tone="light" className="tp-scene" style={{ '--sky-top': '#fffbf3', '--sky-bottom': '#f6cc85' }} aria-labelledby="how-title">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-8 md:grid-cols-12 md:items-end">
            <h1 id="how-title" className="font-plush text-giant md:col-span-7">How it works</h1>
            <p className="text-lede text-[var(--ink-soft)] md:col-span-5 md:pb-4">
              Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.
            </p>
          </header>
          <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
            <a href="#two-ways" className="chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft"><span className="font-plush text-toffee">1</span> Two ways home</a>
            <a href="#promise" className="chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft"><span className="font-plush text-toffee">2</span> Our premium puppy promise</a>
            <a href="#delivery" className="chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft"><span className="font-plush text-toffee">3</span> Delivery &amp; collection</a>
            <a href="#why" className="chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft"><span className="font-plush text-toffee">4</span> Why choose us</a>
          </nav>
          <div id="two-ways">
            <section className="tp-journeys" aria-labelledby="two-ways-title">
              <div className="tp-journeys__top">
                <div>
                  <p className="font-scrawl tp-journeys__kicker">choose your way</p>
                  <h2 id="two-ways-title" className="font-plush text-big">Two ways home</h2>
                </div>
                <div className="tp-journeys__pick">
                  <div role="tablist" aria-label="Ways to bring your puppy home" className="tp-switch" style={{ '--at': tab, '--n': 2 }}>
                    <span aria-hidden="true" className="tp-switch__thumb" />
                    <button
                      type="button"
                      role="tab"
                      id="tab-local"
                      aria-selected={tab === 0}
                      aria-controls="panel-local"
                      tabIndex={tab === 0 ? 0 : -1}
                      className="tp-switch__tab"
                      onClick={() => setTab(0)}
                    >
                      <span className="font-plush tp-switch__label">In Dubai</span>
                      <span className="tp-switch__hint">meet in person</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      id="tab-imported"
                      aria-selected={tab === 1}
                      aria-controls="panel-imported"
                      tabIndex={tab === 1 ? 0 : -1}
                      className="tp-switch__tab"
                      onClick={() => setTab(1)}
                    >
                      <span className="font-plush tp-switch__label">Imported</span>
                      <span className="tp-switch__hint">order upon request</span>
                    </button>
                  </div>
                  <div className="pup-buddy tp-journeys__teddy" data-facing="right">
                    <PupBuddy pose="sit" facing="right" label="Teddy, waiting to see which way you pick" />
                    <span aria-hidden="true" className="pup-bubble" data-show="false" />
                  </div>
                </div>
              </div>
              <div role="tabpanel" id="panel-local" aria-labelledby="tab-local" className="tp-journey" hidden={tab !== 0}>
                <div className="tp-journey__head">
                  <div>
                    <h3 className="font-plush tp-journey__title">Meet your puppy in person</h3>
                    <p className="text-lede mt-4 text-[var(--ink-soft)]">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they’re raised with care, proper nutrition, and veterinary checks.
                    </p>
                  </div>
                  <div aria-hidden="true" className="tp-postcard">
                    <span className="tp-postcard__sun" />
                    <Svg src={contactSticky} />
                    <span className="font-scrawl tp-postcard__to tp-postcard__to--left">Downtown Dubai</span>
                  </div>
                </div>
                <Steps steps={LOCAL_STEPS} />
              </div>
              <div role="tabpanel" id="panel-imported" aria-labelledby="tab-imported" className="tp-journey" hidden={tab !== 1}>
                <div className="tp-journey__head">
                  <div>
                    <h3 className="font-plush tp-journey__title">Order upon request</h3>
                    <p className="text-lede mt-4 text-[var(--ink-soft)]">
                      Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world’s most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.
                    </p>
                    <p className="font-scrawl mt-4 text-toffee-ink">
                      From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world’s finest puppies to Dubai, just for you.
                    </p>
                  </div>
                  <div aria-hidden="true" className="tp-postcard tp-postcard--sky">
                    <Svg src={routeSvg} />
                    <Svg src={planeSvg} />
                    <span className="font-scrawl tp-postcard__from">Europe · Korea</span>
                    <span className="font-scrawl tp-postcard__to">Dubai</span>
                  </div>
                </div>
                <Steps steps={IMPORTED_STEPS} />
              </div>
            </section>
          </div>

          <section id="promise" aria-labelledby="promise-title" className="tp-paper mt-24 -rotate-[0.6deg]">
            <p aria-hidden="true" className="font-scrawl text-lg text-toffee-ink">puppy passport</p>
            <h2 id="promise-title" className="font-plush text-huge mt-1 max-w-[16ch]">Our premium puppy promise</h2>
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <li className="tp-entry" style={{ '--ink-stamp': '#a24a1a', '--tilt': '-8deg', '--i': 0 }}>
                <span className="tp-stamp tp-stamp--round">
                  <Svg src={stamp0} />
                  <span className="tp-stamp__title font-plush">Hand-selected breeders</span>
                </span>
                <p className="tp-entry__text">We work only with breeders who uphold the highest ethical and health standards.</p>
              </li>
              <li className="tp-entry" style={{ '--ink-stamp': '#1f6b45', '--tilt': '5deg', '--i': 1 }}>
                <span className="tp-stamp tp-stamp--ticket">
                  <Svg src={stamp1} />
                  <span className="tp-stamp__title font-plush">Full transparency</span>
                </span>
                <p className="tp-entry__text">Photos, videos, and health certificates are shared before your puppy travels.</p>
              </li>
              <li className="tp-entry" style={{ '--ink-stamp': '#5a3a28', '--tilt': '-4deg', '--i': 2 }}>
                <span className="tp-stamp tp-stamp--oval">
                  <Svg src={stamp2} />
                  <span className="tp-stamp__title font-plush">Safe, stress-free delivery</span>
                </span>
                <p className="tp-entry__text">We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you.</p>
              </li>
            </ul>
          </section>

          <section id="delivery" aria-labelledby="delivery-title" className="mt-24 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 id="delivery-title" className="font-plush text-huge">Delivery &amp; collection</h2>
              <p className="text-lede mt-5 text-[var(--ink-soft)]">
                From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely.
              </p>
              <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <li>
                  <h3 className="font-plush-text text-[1.3rem] font-bold leading-snug">Take your puppy home the same day</h3>
                  <p className="mt-1.5 text-[var(--ink-soft)]">Local puppies are available immediately — visit, fall in love, and go home together.</p>
                </li>
                <li>
                  <h3 className="font-plush-text text-[1.3rem] font-bold leading-snug">Delivery within Dubai</h3>
                  <p className="mt-1.5 text-[var(--ink-soft)]">Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably.</p>
                </li>
                <li>
                  <h3 className="font-plush-text text-[1.3rem] font-bold leading-snug">Safe international cargo</h3>
                  <p className="mt-1.5 text-[var(--ink-soft)]">We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free.</p>
                </li>
                <li>
                  <h3 className="font-plush-text text-[1.3rem] font-bold leading-snug">Worldwide delivery</h3>
                  <p className="mt-1.5 text-[var(--ink-soft)]">We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.</p>
                </li>
              </ul>
            </div>
            <div className="relative h-[clamp(14rem,30vw,22rem)] lg:col-span-6">
              <Svg src={flightHill} />
              <Flight />
            </div>
          </section>

          <section id="why" aria-labelledby="why-title" className="mt-24 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="why-title" className="font-plush text-huge">Why choose us</h2>
              <p className="text-lede mt-6 text-[var(--ink-soft)]">
                We’re here to help you find a new family member. From the moment you visit our site to the joyful day your puppy arrives at your door, we’re with you every step of the way. Our mission is to make the entire adoption process smooth, transparent, and full of love.
              </p>
            </div>
            <ul className="space-y-8 lg:col-span-6 lg:col-start-7">
              <li className="flex gap-5">
                <Svg src={why0} />
                <div>
                  <h3 className="font-plush text-[1.7rem]">International cargo</h3>
                  <p className="mt-2 text-[var(--ink-soft)]">We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <Svg src={why1} />
                <div>
                  <h3 className="font-plush text-[1.7rem]">Support 24/7</h3>
                  <p className="mt-2 text-[var(--ink-soft)]">Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we’re just a message away.</p>
                </div>
              </li>
              <li className="flex gap-5">
                <Svg src={why2} />
                <div>
                  <h3 className="font-plush text-[1.7rem]">Health guarantee</h3>
                  <p className="mt-2 text-[var(--ink-soft)]">All our puppies come with a verified health certificate from licensed vets. We ensure every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.</p>
                </div>
              </li>
            </ul>
          </section>

          <section aria-labelledby="care-title" className="tp-board mt-24 grid items-center gap-8 md:grid-cols-[1fr_auto] md:!p-12">
            <div>
              <h2 id="care-title" className="font-plush text-big">Unique and high quality puppies</h2>
              <p className="text-lede measure mt-5 text-cocoa-soft">
                When you choose TeddyPups, you can trust that you’re getting a puppy of the highest quality. We also provide guidance and support to new pet owners, offering advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Ask us on WhatsApp</a>
                <a className="btn btn-ghost" href="/puppies">See available puppies</a>
              </div>
            </div>
            <div className="pup-buddy mx-auto w-48 md:w-56" data-facing="left">
              <PupBuddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
              <span aria-hidden="true" className="pup-bubble" data-show="false" />
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
