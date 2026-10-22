/* Parametric puppy mascot: wobbly-ellipse path generation, poses, frame math. */

function wobble(cx, cy, rx, ry, points, wobbleAmt, rotDeg = -90, phase = 0) {
  const start = (rotDeg * Math.PI) / 180
  const pt = (ang, k) => {
    const c = Math.cos(ang) * (rx + k)
    const s = Math.sin(ang) * (ry + (ry / rx) * k)
    return `${(cx + c * Math.cos(start) - s * Math.sin(start)).toFixed(1)} ${(cy + c * Math.sin(start) + s * Math.cos(start)).toFixed(1)}`
  }
  let d = ''
  for (let i = 0; i < points; i++) {
    const a0 = start + (i / points) * Math.PI * 2
    const a1 = start + ((i + 1) / points) * Math.PI * 2
    const mid = (a0 + a1) / 2
    d += `${i === 0 ? `M${pt(a0, 0)}` : ''}Q${pt(mid, 2.1 * wobbleAmt)} ${pt(a1, 0)}`
  }
  return `${d}Z`
}

export const SHOULDER_N = [168, 192]
export const SHOULDER_F = [186, 194]
export const HIP_N = [110, 194]
export const HIP_F = [94, 192]
export const TAIL_BASE = [84, 150]
export const HEAD_PIVOT = [212, 100]
export const EAR_L = [174, 82]
export const EAR_R = [250, 82]
export const BODY_PIVOT = [196, 206]
export const GROUND_Y = 228

export const COLORS = {
  blush: '#f9b9a6',
  collar: '#a24a1a',
  honey: '#f2be6b',
  honeySoft: '#fbe3b4',
  dark: '#2a170e',
  far: '#e4a352',
}

export const PATHS = {
  body: wobble(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: wobble(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: wobble(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: wobble(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw:
    'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: wobble(212, 100, 51, 46, 16, 3.6),
  topknot: wobble(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: wobble(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: wobble(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle:
    'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  ledgePaws:
    'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth: 'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen: 'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag:
    'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  happyEyes:
    'M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101',
}

function leg(w, len) {
  const a = w / 2
  return `M${a} -14 C${a} 4 -12 ${len - 18} -12 ${len - 9} C-12 ${len - 2} -7 ${len} 0 ${len} C9 ${len} 13 ${len - 3} 13 ${len - 9} C13 ${len - 18} ${a} 4 ${a} -14`
}

export const LEGS = {
  front: leg(24, GROUND_Y - SHOULDER_N[1]),
  frontFar: leg(22, GROUND_Y - SHOULDER_F[1]),
  back: leg(30, GROUND_Y - HIP_N[1]),
  backFar: leg(28, GROUND_Y - HIP_F[1]),
}

export const LEG_TOES = (len) => `M-3.5 ${len - 7} v5 M4.5 ${len - 7} v5`

const base = {
  bodyRot: 0, bodyX: 0, bodyY: 0, stretch: 1,
  headX: 0, headY: 0, headRot: 0, earL: 0, earR: 0,
  tail: 0, fn: 0, ff: 0, bn: 0, bf: 0,
  sit: 0, eyes: 1, happy: 0, tongue: 0, mouth: 0, front: 0,
}

export const POSES = {
  stand: base,
  walk: { ...base, tail: -6, tongue: 1 },
  sit: { ...base, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...base, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...base, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: { ...base, bodyRot: -5, bodyY: 22, headX: 12, headY: 40, headRot: 3, fn: -84, ff: -80, sit: 1, tail: 58, tongue: 0 },
  sleep: { ...base, bodyRot: -5, bodyY: 22, headX: 14, headY: 44, headRot: -8, fn: -84, ff: -80, sit: 1, tail: 64, eyes: 0, earL: 4, earR: -4 },
  settle: { ...base, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...base, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  sniff: { ...base, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: { ...base, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...base, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 },
}

export const MOTION = { phase: 0, stride: 0, time: 0, wag: 0, gazeX: 0, gazeY: 0, blink: 0, ear: 0 }

const r2 = (n) => Math.round(n * 100) / 100
const rot = (deg, x, y) => `rotate(${r2(deg)} ${x} ${y})`

export function lerpPose(a, b, t) {
  const out = { ...a }
  for (const k of Object.keys(a)) out[k] = a[k] + (b[k] - a[k]) * t
  return out
}

export function computeFrame(p, m = MOTION) {
  const h = Math.sin(m.phase)
  const f = Math.sin(m.phase + Math.PI)
  const swing = 20 + 10 * m.stride
  const bump = (1 - Math.cos(2 * m.phase)) / 2
  const walking = +(m.stride > 0.01)
  const idle = Math.sin(2.4 * m.time) * (1 - walking)
  const y = p.bodyY - bump * (2.5 + 4 * m.stride) * walking + 0.6 * idle
  const bodyRotDeg = p.bodyRot + 1.6 * Math.sin(m.phase) * walking
  const legBase = -p.bodyRot
  const wagAmp = 5 + 17 * m.wag
  const wagSpeed = 1.2 + 2.6 * m.wag
  const tailDeg = p.tail + Math.sin(m.time * wagSpeed * Math.PI * 2) * wagAmp
  const headBob = -(1 - Math.cos(2 * m.phase - 0.7)) / 2 * (2 + 3 * m.stride) * walking + 0.9 * idle

  return {
    body: `translate(${r2(p.bodyX)} ${r2(y)}) ${rot(bodyRotDeg, ...BODY_PIVOT)} translate(${BODY_PIVOT[0]} 0) scale(${r2(p.stretch)} 1) translate(${-BODY_PIVOT[0]} 0)`,
    fn: `translate(${SHOULDER_F[0]} ${SHOULDER_F[1]}) rotate(${r2(p.fn + legBase + h * swing * walking)})`,
    ff: `translate(${SHOULDER_N[0]} ${SHOULDER_N[1]}) rotate(${r2(p.ff + legBase + f * swing * walking)})`,
    bn: `translate(${HIP_N[0]} ${HIP_N[1]}) rotate(${r2(p.bn + f * swing * walking)})`,
    bf: `translate(${HIP_F[0]} ${HIP_F[1]}) rotate(${r2(p.bf + h * swing * walking)})`,
    tail: rot(tailDeg, ...TAIL_BASE),
    haunch: `translate(0 ${r2(-0.06 * p.bodyRot)})`,
    head: `translate(${r2(p.headX)} ${r2(p.headY + headBob)}) ${rot(p.headRot + 1.4 * Math.sin(m.phase) * walking, ...HEAD_PIVOT)}`,
    earL: rot(p.earL + m.ear + 4 * Math.sin(2 * m.phase) * walking, ...EAR_L),
    earR: rot(p.earR - m.ear - 4 * Math.sin(2 * m.phase) * walking, ...EAR_R),
    eyes: `translate(${r2(3.4 * m.gazeX)} ${r2(2.6 * m.gazeY)})`,
    blink: `translate(0 ${r2(98 * m.blink * 0.92)}) scale(1 ${r2(1 - 0.92 * m.blink)})`,
    openEyes: r2(Math.max(0, p.eyes - p.happy)),
    happyEyes: r2(Math.min(p.happy, p.eyes)),
    tongue: r2(p.tongue * (1 - p.mouth)),
    shutEyes: r2(1 - p.eyes),
    mouth: r2(p.mouth),
    backLegs: r2(1 - p.sit),
    haunchOpacity: r2(p.sit * (1 - p.front)),
    side: r2(1 - p.front),
    ledge: r2(p.front),
    shadow: `translate(${r2(0.6 * p.bodyX)} 0) scale(${r2(1 - 0.05 * bump * walking)} 1)`,
    shadowOpacity: r2(0.12 * (1 - p.front)),
  }
}
