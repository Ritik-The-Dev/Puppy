/* Writes a computed mascot frame onto an inline PupBuddy SVG. */

export function applyFrame(svg, frame, facing) {
  const g = (name) => svg.querySelector(`g[data-p="${name}"]`)
  const root = g('root')
  if (root) root.setAttribute('transform', facing < 0 ? 'translate(300 0) scale(-1 1)' : '')
  const shadow = svg.querySelector('ellipse[data-p="shadow"]')
  if (shadow) {
    shadow.setAttribute('transform', frame.shadow)
    shadow.setAttribute('opacity', frame.shadowOpacity)
  }
  const bodyG = g('body')
  if (bodyG) {
    bodyG.setAttribute('transform', frame.body)
    bodyG.setAttribute('opacity', frame.side)
  }
  for (const key of ['fn', 'ff', 'bn', 'bf', 'tail', 'haunch', 'head', 'earL', 'earR', 'eyes', 'blink']) {
    const el = g(key)
    if (el && frame[key]) el.setAttribute('transform', frame[key])
  }
  for (const key of ['bn', 'bf']) {
    const el = g(key)
    if (el) el.setAttribute('opacity', frame.backLegs)
  }
  const haunch = g('haunch')
  if (haunch) haunch.setAttribute('opacity', frame.haunchOpacity)
  const open = g('open')
  if (open) open.setAttribute('opacity', frame.openEyes)
  const happy = svg.querySelector('path[data-p="happy"]')
  if (happy) happy.setAttribute('opacity', frame.happyEyes)
  const shut = svg.querySelector('path[data-p="shut"]')
  if (shut) shut.setAttribute('opacity', frame.shutEyes)
  const ledge = g('ledge')
  if (ledge) ledge.setAttribute('opacity', frame.ledge)
  const tongue = svg.querySelector('path[data-p="tongue"]')
  if (tongue) tongue.setAttribute('opacity', frame.tongue)
  const mouth = g('mouth')
  if (mouth) mouth.setAttribute('opacity', frame.mouth)
}
