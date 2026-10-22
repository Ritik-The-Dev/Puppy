/* Inline an SVG file's markup, folding the caller's class onto the <svg> root.
   Classes already present in the source file are kept and the caller's class is
   added, so styling baked into the SVG (e.g. tp-postcard__city) is never lost. */
export default function Svg({ src, className, style, ...rest }) {
  let html = src
  if (className || style) {
    html = src.replace(/<svg\b([^>]*)>/, (match, existing) => {
      let existingClass = ''
      const stripped = existing.replace(/\s*class="([^"]*)"/, (m, value) => {
        existingClass = value
        return ''
      })
      const merged = [existingClass, className].filter(Boolean).join(' ')
      const extra = [merged ? `class="${merged}"` : '', style ? `style="${styleToCss(style)}"` : '']
        .filter(Boolean)
        .join(' ')
      return `<svg${stripped}${extra ? ` ${extra}` : ''}>`
    })
  }
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} {...rest} />
}

function styleToCss(style) {
  if (typeof style === 'string') return style
  return Object.entries(style)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value}`)
    .join(';')
}
