/* First-visit intro curtain: blanket with a runner dashing across. */
import { useEffect, useRef, useState } from 'react'
import edge from '../assets/svg/curtain-edge.svg?raw'
import print from '../assets/svg/curtain-print.svg?raw'
import Svg from './Svg'
import Runner from './Runner'

export default function Curtain() {
  const [state, setState] = useState(() =>
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('tp-curtain') ? 'done' : 'intro'
  )
  const printsRef = useRef(null)

  useEffect(() => {
    if (state !== 'intro') return
    const prints = printsRef.current ? Array.from(printsRef.current.children) : []
    prints.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-down'), 350 + i * 340)
    })
    const t1 = setTimeout(() => setState('lifting'), 2350)
    const t2 = setTimeout(() => {
      sessionStorage.setItem('tp-curtain', '1')
      setState('done')
    }, 3600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [state])

  if (state === 'done') return null

  return (
    <div className="tp-curtain" data-state={state === 'intro' ? 'intro' : 'lifting'} aria-hidden="true">
      <div className="tp-curtain__blanket">
        <Svg src={edge} className="tp-curtain__edge tp-curtain__edge--top" />
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints" ref={printsRef}>
            {Array.from({ length: 5 }, (_, i) => (
              <Svg key={i} src={print} className="tp-curtain__print" />
            ))}
          </div>
          <div className="tp-curtain__runner">
            <Runner />
          </div>
          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>
        <Svg src={edge} className="tp-curtain__edge tp-curtain__edge--bottom" />
      </div>
    </div>
  )
}
