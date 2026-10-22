/* App shell: curtain, header, the routed page, walker, footer. */
import { useEffect } from 'react'
import Curtain from './components/Curtain'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Meet from './components/Meet'
import Paths from './components/Paths'
import Chat from './components/Chat'
import Passport from './components/Passport'
import Dusk from './components/Dusk'
import Night from './components/Night'
import HomeCta from './components/HomeCta'
import Puppies from './pages/Puppies'
import GoneHome from './pages/GoneHome'
import HappyFamilies from './pages/HappyFamilies'
import HowItWorks from './pages/HowItWorks'
import Faq from './pages/Faq'
import Contact from './pages/Contact'
import PupDetail from './pages/PupDetail'
import PawTrail from './components/PawTrail'
import PupWalker from './pup/PupWalker'
import PupIdle from './pup/PupIdle'
import useReveal from './hooks/useReveal'
import details from './data/details.json'

function HomePage() {
  return (
    <div data-page="home" className="tp-page">
      <Hero />
      <Meet />
      <Paths />
      <Chat />
      <Passport />
      <Dusk />
      <Night />
      <HomeCta />
    </div>
  )
}

const TITLES = {
  '/': 'TeddyPups U.A.E. — Premium teacup puppies in Dubai',
  '/puppies': 'Available puppies | TeddyPups U.A.E.',
  '/gone-home': 'Gone home | TeddyPups U.A.E.',
  '/happy-families': 'Happy families | TeddyPups U.A.E.',
  '/how-it-works': 'How it works | TeddyPups U.A.E.',
  '/faq': 'Questions & answers | TeddyPups U.A.E.',
  '/contact': 'Visit & contact | TeddyPups U.A.E.',
}

function resolve(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return { active: '', node: <HomePage /> , title: TITLES['/'] }
  if (path === '/puppies') return { active: '/puppies', node: <Puppies />, title: TITLES[path] }
  if (path === '/gone-home') return { active: '', node: <GoneHome />, title: TITLES[path] }
  if (path === '/happy-families') return { active: '/happy-families', node: <HappyFamilies />, title: TITLES[path] }
  if (path === '/how-it-works') return { active: '/how-it-works', node: <HowItWorks />, title: TITLES[path] }
  if (path === '/faq') return { active: '/faq', node: <Faq />, title: TITLES[path] }
  if (path === '/contact') return { active: '/contact', node: <Contact />, title: TITLES[path] }
  const m = path.match(/^\/puppies\/([^/]+)$/)
  if (m) {
    const pup = details[m[1]]
    return {
      active: '/puppies',
      node: <PupDetail slug={m[1]} />,
      title: pup ? `${pup.name}, ${(pup.fields || {}).Breed || 'puppy'} | TeddyPups U.A.E.` : 'Puppy | TeddyPups U.A.E.',
    }
  }
  return { active: '', node: <HomePage />, title: TITLES['/'] }
}

export default function App() {
  const { active, node, title } = resolve(window.location.pathname)
  useReveal()

  useEffect(() => {
    document.title = title
    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [title])

  return (
    <>
      <Curtain />
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">Skip to content</a>
      <Header active={active} />
      <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
        {node}
        <PupWalker />
        <PupIdle />
      </main>
      <Footer />
      <PawTrail />
    </>
  )
}
