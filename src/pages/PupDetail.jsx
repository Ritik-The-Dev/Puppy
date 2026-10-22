/* /puppies/:slug — one puppy's profile: gallery, tag, promise, trail, enquiry. */
import { useState } from 'react'
import PupBuddy from '../pup/PupBuddy'
import details from '../data/details.json'
import pages from '../data/pages.json'
import { WA_NUMBER } from '../data'

const CHECK = 'M5 17l7 7L27 8'
const PROMISES = [
  'Vaccinated',
  'Dewormed',
  'Verified health certificate from licensed vets',
  'Thoroughly checked before joining your family',
]
const TRAIL = [
  ['Reserve your puppy', 'Tell us which puppy has captured your heart.'],
  ['Personalized consultation', 'We finalize details with you and share updates on your puppy’s journey.'],
  ['Import and arrival', 'We manage health checks, travel arrangements, and documentation.'],
  ['Welcome home', 'We help your new puppy settle in and ensure a smooth transition into your home.'],
]

function Check() {
  return (
    <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden="true">
      <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PupDetail({ slug }) {
  const pup = details[slug]
  const [index, setIndex] = useState(0)

  if (!pup) {
    return (
      <div data-page="pup" className="tp-page">
        <div className="gutter mx-auto min-h-[60vh] max-w-[110rem] pt-16">
          <h1 className="font-plush text-giant">Puppy not found</h1>
          <p className="text-lede mt-4 text-cocoa-soft">This puppy may have already gone home.</p>
          <a className="btn btn-primary mt-8" href="/puppies">See available puppies</a>
        </div>
      </div>
    )
  }

  const media = pup.media || []
  const active = media[index] || media[0]
  const f = pup.fields || {}
  const list = pages.puppies
  const here = list.findIndex((p) => p.href.endsWith('/' + slug))
  const prev = list[(here - 1 + list.length) % list.length]
  const next = list[(here + 1) % list.length]
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi TeddyPups! I'm interested in ${pup.name}, the ${f.Breed || ''}: https://puppy.instabizweb.com/puppies/${slug}`
  )}`

  return (
    <div data-page="pup" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
          <a href="/puppies" className="link-ink">Available puppies</a>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{pup.name}</span>
        </nav>
        <p className="tp-chapter">
          <span aria-hidden="true" className="tp-chapter__n font-plush">1</span>
          <span className="font-scrawl">hello, it&rsquo;s me</span>
        </p>
        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[2.2rem] border-[3px] border-cocoa bg-honey-soft" style={{ aspectRatio: '4 / 5' }}>
                {active?.kind === 'video' ? (
                  <video
                    key={active.url}
                    className="size-full object-cover"
                    style={{ objectPosition: `${active.focalX * 100}% ${active.focalY * 100}%` }}
                    src={active.url}
                    poster={active.poster?.url || undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <img
                    key={active?.url}
                    className="size-full object-cover"
                    style={{ objectPosition: `${(active?.focalX ?? 0.5) * 100}% ${(active?.focalY ?? 0.5) * 100}%`, backgroundColor: active?.color || '#f2be6b' }}
                    src={active?.url}
                    alt={active?.alt || `${pup.name}, ${f['Boy or girl'] || ''} ${f.Breed || ''} puppy`}
                  />
                )}
              </div>
              {media.length > 1 ? (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {media.map((m, i) => (
                    <li key={m.id || i}>
                      <button
                        type="button"
                        aria-label={`Show media ${i + 1}`}
                        aria-current={i === index}
                        onClick={() => setIndex(i)}
                        className={`relative h-24 w-20 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft transition-transform duration-300 ${i === index ? '-translate-y-1' : 'opacity-80 hover:-translate-y-0.5'}`}
                      >
                        <img
                          className="size-full object-cover"
                          style={{ objectPosition: `${(m.poster?.focalX ?? m.focalX ?? 0.5) * 100}% ${(m.poster?.focalY ?? m.focalY ?? 0.5) * 100}%` }}
                          src={m.kind === 'video' ? m.poster?.url : m.url}
                          alt=""
                        />
                        {m.kind === 'video' ? <span className="absolute inset-x-0 bottom-0 bg-cocoa/70 py-0.5 text-[0.6rem] font-semibold text-milk">▶ video</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
              <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="true">
                <span aria-hidden="true" className="tp-tag__ring" />
                <div className="pup-buddy absolute -top-[4.8rem] right-6 w-[9.5rem]" data-facing="right">
                  <PupBuddy pose="peek" facing="right" label={`Teddy, peeking over ${pup.name}'s tag`} />
                  <span aria-hidden="true" className="pup-bubble" data-show="false" />
                </div>
                <span className="chip">
                  <svg viewBox="0 0 64 64" className="size-4 text-toffee" aria-hidden="true" fill="currentColor">
                    <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                  </svg>
                  Available
                </span>
                <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.name}</h1>
                <p className="mt-2 text-lg font-semibold text-cocoa-soft">{f.Breed || pup.subtitle}</p>
                <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(f).map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                      <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-col gap-3">
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Ask about {pup.name} on WhatsApp</a>
                  <a href={`#enquire-${slug}`} className="btn btn-ghost">Send an enquiry</a>
                </div>
              </div>
              <div className="tp-paper mt-8 -rotate-1">
                <p className="tp-chapter">
                  <span aria-hidden="true" className="tp-chapter__n font-plush">2</span>
                  <span className="font-scrawl">what comes with {pup.name}</span>
                </p>
                <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                <ul className="mt-4 space-y-2.5">
                  {PROMISES.map((t) => (
                    <li key={t} className="flex items-start gap-3 font-semibold"><Check />{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby={`home-steps-${slug}`} className="mt-20">
          <p className="tp-chapter">
            <span aria-hidden="true" className="tp-chapter__n font-plush">3</span>
            <span className="font-scrawl">the way home</span>
          </p>
          <h2 id={`home-steps-${slug}`} className="font-plush text-big mt-3">Coming home from abroad</h2>
          <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
            {TRAIL.map(([title, text], i) => (
              <li key={title}>
                <span aria-hidden="true" className="tp-trail__num font-plush">{i + 1}</span>
                <h3 className="font-plush-text text-xl font-bold leading-tight">{title}</h3>
                <p className="mt-2 max-w-[38ch] text-cocoa-soft">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id={`enquire-${slug}`} aria-labelledby={`enquire-title-${slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
          <span aria-hidden="true" className="tp-letter__stamp">
            <svg viewBox="0 0 64 64" className="size-9" aria-hidden="true" fill="currentColor">
              <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
            </svg>
          </span>
          <div className="lg:col-span-4">
            <p className="tp-chapter">
              <span aria-hidden="true" className="tp-chapter__n font-plush">4</span>
              <span className="font-scrawl">dear TeddyPups…</span>
            </p>
            <h2 id={`enquire-title-${slug}`} className="font-plush text-big mt-2">Ask about {pup.name}</h2>
            <p className="mt-4 text-cocoa-soft">Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Message us on WhatsApp</a>
            <p className="mt-4 text-sm text-cocoa-soft">We reply 24/7, usually within a few minutes.</p>
          </div>
        </section>

        <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
          {[['Previous pup', prev], ['Next pup', next]].map(([label, p]) => (
            <a
              key={label}
              href={p.href}
              className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
            >
              <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
                <img
                  className="size-full object-cover"
                  style={{ objectFit: 'cover' }}
                  src={(p.frame.match(/<img src="([^"]+)"/) || [])[1]}
                  alt=""
                />
              </span>
              <span>
                <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
                <span className="font-plush text-[1.6rem]">{p.name}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
