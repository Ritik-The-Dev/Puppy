/* The pose-driven Teddy mascot, rendered as inline SVG. */
import {
  COLORS, PATHS, LEGS, LEG_TOES, POSES, MOTION,
  computeFrame,
} from './mascot'

function Leg({ part, d, len, fill, transform, opacity }) {
  return (
    <g data-p={part} transform={transform} opacity={opacity}>
      <path d={`${d}Z`} fill={fill} />
      <path d={d} fill="none" stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
      <path d={LEG_TOES(len)} fill="none" stroke={COLORS.dark} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  )
}

export default function PupBuddy({ pose = 'sit', facing = 'right', className, label, style, motion = MOTION, live = false, onClick }) {
  const p = POSES[pose] || POSES.sit
  const f = computeFrame(p, motion)
  const flip = facing === 'left' ? 'translate(300 0) scale(-1 1)' : undefined
  return (
    <svg
      viewBox="0 0 300 240"
      className={className}
      data-pose={pose}
      style={{ overflow: 'visible', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      onClick={onClick}
    >
      <g data-p="root" transform={flip}>
        <ellipse
          data-p="shadow"
          cx={150} cy={230} rx={92} ry={7}
          fill={COLORS.dark}
          opacity={f.shadowOpacity}
          transform={f.shadow}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <g data-p="body" transform={f.body} opacity={f.side}>
          <Leg part="bf" d={LEGS.backFar} len={228 - 192} fill={COLORS.far} transform={f.bf} opacity={f.backLegs} />
          <Leg part="ff" d={LEGS.frontFar} len={228 - 192} fill={COLORS.far} transform={f.ff} />
          <g data-p="tail" transform={f.tail}>
            <path d={PATHS.tailStem} fill="none" stroke={COLORS.dark} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
            <path d={PATHS.tailStem} stroke={COLORS.honey} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={PATHS.tail} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          </g>
          <Leg part="bn" d={LEGS.back} len={228 - 194} fill={COLORS.honey} transform={f.bn} opacity={f.backLegs} />
          <path d={PATHS.body} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATHS.chest} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          <Leg part="fn" d={LEGS.front} len={228 - 194} fill={COLORS.honey} transform={f.fn} />
        </g>

        <g data-p="haunch" opacity={f.haunchOpacity} transform={f.haunch}>
          <path d={PATHS.haunch} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATHS.haunchPaw} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          <path d="M132 222v5M139 222v5" fill="none" stroke={COLORS.dark} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        </g>

        <g data-p="head" transform={f.head}>
          <path d={PATHS.collar} fill={COLORS.collar} stroke={COLORS.dark} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATHS.tag} fill={COLORS.honeySoft} stroke={COLORS.dark} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
          <path data-p="earL" d={PATHS.earL} fill={COLORS.far} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" transform={f.earL} />
          <path data-p="earR" d={PATHS.earR} fill={COLORS.far} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" transform={f.earR} />
          <path d={PATHS.head} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATHS.topknot} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATHS.muzzle} fill={COLORS.honeySoft} />
          <circle cx={181} cy={116} r={7} fill={COLORS.blush} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={COLORS.blush} opacity={0.85} />
          <g data-p="eyes" transform={f.eyes}>
            <g data-p="open" opacity={f.openEyes}>
              <g data-p="blink" transform={f.blink}>
                <ellipse cx={194} cy={98} rx={7.4} ry={8.6} fill={COLORS.dark} />
                <ellipse cx={230} cy={98} rx={7.4} ry={8.6} fill={COLORS.dark} />
                <circle cx={196.6} cy={94.6} r={2.7} fill="#fff" />
                <circle cx={232.6} cy={94.6} r={2.7} fill="#fff" />
                <circle cx={192} cy={101.2} r={1.2} fill="#fff" />
                <circle cx={228} cy={101.2} r={1.2} fill="#fff" />
              </g>
            </g>
          </g>
          <path data-p="happy" d={PATHS.happyEyes} fill="none" stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" opacity={f.happyEyes} />
          <path data-p="shut" d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97" fill="none" stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" opacity={f.shutEyes} />
          <path d={PATHS.nose} fill={COLORS.dark} />
          <path d={PATHS.mouth} fill="none" stroke={COLORS.dark} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          <path data-p="tongue" d={PATHS.tongue} fill="#e98c8c" stroke={COLORS.dark} strokeWidth={2.2} strokeLinejoin="round" opacity={f.tongue} />
          <g data-p="mouth" opacity={f.mouth}>
            <path d={PATHS.mouthOpen} fill="#6b2a1c" stroke={COLORS.dark} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
            <path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c" />
          </g>
        </g>
        <g data-p="ledge" opacity={f.ledge}>
          <path d={PATHS.ledgePaws} fill={COLORS.honey} stroke={COLORS.dark} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
          <path d={PATHS.ledgeToes} fill="none" stroke={COLORS.dark} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}
