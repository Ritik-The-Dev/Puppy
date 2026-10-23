/* Scroll-driven pup: a single live mascot that walks the length of the page,
   resting at every [data-pup-stop] anchor, dropping paw prints as it goes.
   On phones it switches to a bottom "lane" and peeks out of each scene. */
import { useEffect, useRef } from 'react'
import PupBuddy from './PupBuddy'
import { POSES, MOTION, computeFrame, lerpPose } from './mascot'
import { applyFrame } from './rig'

const PAW_D =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z'

/* Mascot box offsets (same numbers as the live site's rig). */
const D = { x: 150, y: 228 }
const DEFAULT_BOX = [48, 30, 288, 236]
const BOXES = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
}
const SINK = D.y - 159
/* Rest bands as fractions of the safe viewport. The phone "lane" and the
   page stops use different bands in the original site. */
const LANE_HOLD = [0.6, 0.86]
const PAGE_HOLD = [0.42, 0.78]
const REACTIONS = ['jump', 'woof', 'love', 'sneeze']

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t
const progress = (from, to, at) => (to === from ? +(at >= to) : smooth(clamp01((at - from) / (to - from))))
const boxFor = (pose) => BOXES[pose] ?? DEFAULT_BOX

function holdAt(holds, g) {
  if (!holds.length || g <= holds[0][1]) return { k: 0, t: 0 }
  for (let i = 0; i < holds.length - 1; i++) {
    const end = holds[i][1]
    const start = holds[i + 1][0]
    if (g < start) return { k: i, t: clamp01((g - end) / Math.max(1, start - end)) }
    if (g <= holds[i + 1][1]) return { k: i + 1, t: 0 }
  }
  return { k: holds.length - 1, t: 0 }
}

/* The live site eases the mascot away from the edges with a soft clamp
   (log-sum-exp) instead of a hard stop. Matching it keeps the phone lane
   positions identical to the original. */
const softMax = (v, edge, s = 8) => {
  const d = (v - edge) / s
  return d > 20 ? v : edge + s * Math.log1p(Math.exp(d))
}
const softMin = (v, edge, s = 8) => -softMax(-v, -edge, s)
const softClamp = (v, lo, hi) => (lo > hi ? (lo + hi) / 2 : softMin(softMax(v, lo), hi))

function clampBox(x, y, box, safe, s, soft = false) {
  const left = (D.x - box[0]) * s
  const right = (box[2] - D.x) * s
  const top = (D.y - box[1]) * s
  const bottom = (box[3] - D.y) * s
  let nx = x
  let ny = y
  if (safe.right - safe.left > left + right) {
    nx = soft
      ? softClamp(x, safe.left + left, safe.right - right)
      : Math.min(Math.max(x, safe.left + left), safe.right - right)
  } else {
    nx = (safe.left + safe.right) / 2 - (right - left) / 2
  }
  if (safe.bottom - safe.top > top + bottom) {
    ny = soft
      ? softClamp(y, safe.top + top, safe.bottom - bottom)
      : Math.min(Math.max(y, safe.top + top), safe.bottom - bottom)
  } else {
    ny = safe.bottom - bottom
  }
  return { x: nx, y: ny }
}

function bezier(p0, c1, c2, p1, t) {
  const m = 1 - t
  const a = m * m * m
  const b = 3 * m * m * t
  const c = 3 * m * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * c1.x + c * c2.x + d * p1.x,
    y: a * p0.y + b * c1.y + c * c2.y + d * p1.y,
  }
}

function bezierArc(p0, c1, c2, p1, t) {
  let total = 0
  let prev = p0
  const steps = Math.max(1, Math.ceil(32 * clamp01(t)))
  for (let i = 1; i <= steps; i++) {
    const p = bezier(p0, c1, c2, p1, (i / steps) * t)
    total += Math.hypot(p.x - prev.x, p.y - prev.y)
    prev = p
  }
  return total
}

export default function PupWalker() {
  const probeRef = useRef(null)
  const layerRef = useRef(null)
  const actorRef = useRef(null)
  const bodyRef = useRef(null)
  const bubbleRef = useRef(null)
  const heartsRef = useRef(null)
  const printsRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const layer = layerRef.current
    const actor = actorRef.current
    const bodyEl = bodyRef.current
    const bubbleEl = bubbleRef.current
    const heartsEl = heartsRef.current
    const printsEl = printsRef.current
    if (!layer || !actor || !bodyEl || !bubbleEl) return
    const svg = bodyEl.querySelector('svg')
    if (!svg) return
    const printPool = printsEl ? Array.from(printsEl.children) : []

    const mobileMq = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)')
    let lane = mobileMq.matches
    let stopped = false
    let active = false
    let raf = 0
    let stops = []
    let meta = []
    let holds = []
    let sceneCount = 0
    let blendPx = 90

    const state = {
      x: 0,
      y: 0,
      s: 1,
      facing: 1,
      heading: 0,
      pose: 'peek',
      fromPose: 'peek',
      toPose: 'peek',
      poseT: 1,
      stride: 0,
      wag: 0.7,
      walked: 0,
      printStep: 0,
      printIdx: 0,
      restIndex: -1,
      bubbleUntil: 0,
      talkAt: 0,
      lookUntil: 0,
      ear: 0,
      earVel: 0,
      mouthUntil: 0,
      headCock: 0,
      headCockTarget: 0,
      queue: [],
      restAt: 0,
      restEnteredK: -1,
      idleActAt: 0,
      basketNext: 0,
      wagBoostUntil: 0,
      lookIdx: -1,
      lookNext: 0,
    }

    const pose = { ...POSES.sit }
    let hop = 0
    let hearts = 0

    const say = (text, secs = 1.6) => {
      state.bubbleUntil = performance.now() / 1000 + secs
      bubbleEl.textContent = text
      bubbleEl.dataset.show = 'true'
    }

    const sceneEl = (el) => el?.closest('[data-pup-scene]') ?? null

    function stickyTrack(el, rect) {
      let sticky = null
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).position === 'sticky') {
          sticky = p
          break
        }
      }
      if (!sticky) return { kind: 'page', top: rect.top + window.scrollY }
      const padTop = parseFloat(getComputedStyle(sticky).top) || 0
      const offset = rect.top - sticky.getBoundingClientRect().top
      const prev = sticky.style.position
      sticky.style.position = 'relative'
      const sr = sticky.getBoundingClientRect()
      const parent = sticky.parentElement
      const parentBottom =
        parent.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(parent).paddingBottom) || 0)
      sticky.style.position = prev
      const from = sr.top + window.scrollY - padTop
      const to = parentBottom + window.scrollY - sr.height - padTop
      if (to <= from) return { kind: 'page', top: sr.top + window.scrollY + offset }
      return { kind: 'pin', top: padTop + offset, from, to }
    }

    function measure() {
      const ViewW = document.documentElement.clientWidth
      /* The original measures the small-viewport-height probe instead of
         innerHeight: on phones 100svh is shorter than the live viewport while
         the URL bar is hidden, and every stop is laid out from that number. */
      const ViewH = probeRef.current?.getBoundingClientRect().height || window.innerHeight
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 76
      const bar = document.querySelector('[data-whatsapp-bar]')
      const barH = bar?.getClientRects().length ? bar.getBoundingClientRect().height : 0
      const safe = { left: 10, top: headerH + 10, right: ViewW - 10, bottom: ViewH - 10 - barH }
      const center = (safe.top + safe.bottom) / 2
      const span = safe.bottom - safe.top
      const fraction = lane ? LANE_HOLD : PAGE_HOLD
      blendPx = 0.12 * ViewH

      stops = []
      meta = []
      holds = []

      const push = (stop, info, range) => {
        stops.push(stop)
        meta.push(info)
        holds.push(range[0] <= range[1] ? [range[0], range[1]] : [(range[0] + range[1]) / 2, (range[0] + range[1]) / 2])
      }

      const place = (el) => {
        const rect = el.getBoundingClientRect()
        const pose0 = el.dataset.pose || 'sit'
        const act = el.dataset.act ?? ''
        const ratio = rect.width / 300
        const s = act === 'basket' || lane ? ratio : 1.12 * ratio
        const pivot = pose0 === 'peek' ? { x: D.x, y: 159 } : D
        const track = stickyTrack(el, rect)
        if (track.kind !== 'screen') track.top += pivot.y * (ratio - s)
        const stop = {
          x: rect.left + pivot.x * (ratio - s),
          track,
          s,
          behind: el.dataset.behind === 'true',
          sink: 0,
          box: boxFor(pose0),
        }
        const scene = sceneEl(el)
        const info = {
          scene,
          pose: pose0,
          facing: el.dataset.facing === 'left' ? -1 : 1,
          act,
          looks: scene ? [...scene.querySelectorAll('[data-pup-look]')] : [],
          track: act === 'treadmill' ? scene?.querySelector('[data-treadmill]') ?? null : null,
        }
        let range
        if (track.kind === 'pin') {
          range = [track.from, track.to]
        } else {
          const top = track.top
          const upper = top + stop.box[1] * s
          const lower = top + stop.box[3] * s
          const mid = (upper + lower) / 2
          let a = mid - (safe.top + fraction[1] * span)
          let b = mid - (safe.top + fraction[0] * span)
          a = Math.max(a, lower - safe.bottom)
          b = Math.min(b, upper - safe.top)
          if (a > b) a = b = mid - (safe.top + span / 2)
          range = [a, b]
        }
        if (!lane && scene && track.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
          const sTop = scene.getBoundingClientRect().top + window.scrollY
          const desired = sTop - safe.top + 0.08 * span
          const lowest = track.top + stop.box[3] * s - safe.bottom
          if (range[1] > desired) {
            const end = Math.max(desired, lowest + 0.12 * span)
            const len = Math.max(range[1] - range[0], 0.2 * span)
            range = [Math.max(lowest, end - len), end]
          }
        }
        push(stop, info, range)
      }

      const all = [...document.querySelectorAll('[data-pup-stop]')].filter((el) => el.getClientRects().length)

      if (lane) {
        const laneStops = all.filter((el) => el.dataset.lane === 'true')
        const first = laneStops[0]
        const lastLane = laneStops.length > 1 ? laneStops[laneStops.length - 1] : null
        if (first) place(first)
        const firstScene = meta[0]?.scene ?? null
        const scenes = [...document.querySelectorAll('#main [data-pup-scene]')].filter(
          (el) => el !== firstScene && el.getClientRects().length
        )
        const ds = Math.min(0.62, Math.max(0.5, ViewW / 650))
        const box = boxFor('peek')
        scenes.forEach((el, i) => {
          const left = i % 2 === 0
          const x = left ? safe.left + 2 - box[0] * ds : safe.right - 2 - box[2] * ds
          const rect = el.getBoundingClientRect()
          const top = rect.top + window.scrollY
          stops.push({ x, track: { kind: 'screen', top: 0 }, s: ds, behind: false, sink: SINK, box })
          meta.push({ scene: el, pose: 'peek', facing: left ? 1 : -1, act: 'lane', looks: [], track: null })
          const upper = top - 0.42 * ViewH
          const lower = rect.bottom + window.scrollY - 0.58 * ViewH
          holds.push(upper <= lower ? [upper, lower] : [(upper + lower) / 2, (upper + lower) / 2])
        })
        sceneCount = scenes.length
        /* The basket in the footer is the final lane stop: the pup walks into
           it instead of living in the bottom lane forever. */
        if (lastLane) place(lastLane)
      } else {
        all.forEach(place)
      }

      if (stops.length < 2) {
        active = false
        layer.hidden = true
        state.heading = 0
        delete document.documentElement.dataset.pup
        delete document.documentElement.dataset.pupFacing
        return
      }
      active = true

      // Normalise holds: first starts at -inf, last ends at +inf, blend the joins.
      if (!holds.length) return
      holds[0][0] = -Infinity
      const lastHold = holds[holds.length - 1]
      lastHold[1] = Infinity
      lastHold[0] = Math.min(lastHold[0], document.documentElement.scrollHeight - window.innerHeight - 1)
      const blend = lane ? 0.32 : 0.5
      for (let i = 0; i < holds.length - 1; i++) {
        const a = holds[i]
        const b = holds[i + 1]
        if (b[0] < a[1]) {
          const mid = (a[1] + b[0]) / 2
          a[1] = Math.max(a[0], mid)
          b[0] = Math.min(b[1], mid)
          if (b[0] < a[1]) b[0] = a[1]
        }
        /* The original sizes the walking stretch from the viewport height and
           the real horizontal gap between the two resting poses. */
        const gap = Math.min(
          1.4 * ViewH,
          Math.max(
            blend * ViewH,
            1.15 *
              Math.hypot(
                Math.abs(stops[i + 1].x + D.x * stops[i + 1].s - (stops[i].x + D.x * stops[i].s)),
                (PAGE_HOLD[1] - PAGE_HOLD[0]) * ViewH
              )
          )
        )
        const needed = gap - (b[0] - a[1])
        if (needed > 0) {
          const takeA = Math.min(needed / 2, a[1] - a[0])
          const takeB = Math.min(needed / 2, b[1] - b[0])
          a[1] -= takeA
          b[0] += takeB
          let rest = needed - takeA - takeB
          const extra = Math.min(rest, b[1] - b[0])
          b[0] += extra
          rest -= extra
          if (rest > 0) a[1] -= Math.min(rest, a[1] - a[0])
        }
      }
      for (const h of holds) if (h[1] < h[0]) h[1] = h[0]

      document.documentElement.dataset.pup = lane ? 'lane' : 'live'
      layer.dataset.anchor = 'top'
      layer.hidden = false
      if (state.restIndex >= 0 && !stops[state.restIndex]) state.restIndex = -1
    }

    const posOf = (stop, at) => ({
      x: stop.x + D.x * stop.s,
      y:
        (stop.track.kind === 'page'
          ? stop.track.top - at
          : stop.track.kind === 'screen'
            ? stop.track.top
            : at < stop.track.from
              ? stop.track.top - (at - stop.track.from)
              : at > stop.track.to
                ? stop.track.top - (at - stop.track.to)
                : stop.track.top) + D.y * stop.s,
    })

    function position(scroll) {
      if (!holds.length) return null
      const { k, t } = holdAt(holds, scroll)
      if (t <= 0 || k >= stops.length - 1) {
        const p = posOf(stops[k], scroll)
        const safe = clampBox(p.x, p.y, stops[k].box, currentSafe(), stops[k].s, lane)
        return { x: safe.x, y: safe.y, s: stops[k].s, front: !stops[k].behind, airborne: false, k, t: 0, walked: 0 }
      }
      const a = stops[k]
      const b = stops[k + 1]
      const from = holds[k][1]
      const to = holds[k + 1][0]
      const spanT = Math.max(1, to - from)
      const v = clamp01((scroll - from) / spanT)
      /* The walking curve is pinned to the hold boundaries, not to wherever
         the page happens to be, exactly like the original. */
      const pa = posOf(a, from)
      const pb = posOf(b, to)
      const nowA = posOf(a, scroll)
      const nowB = posOf(b, scroll)
      const safe = currentSafe()
      const dx = pb.x - pa.x
      const width = safe.right - safe.left
      const offset = Math.max(0.45 * Math.abs(dx), 0)
      const dir = dx >= 0 ? 1 : -1
      /* The curve is built from the sink-adjusted endpoints, exactly like the
         original, so all control-point maths start there. */
      const p0 = { x: pa.x, y: pa.y - a.sink * a.s }
      const p1 = { x: pb.x, y: pb.y - b.sink * b.s }
      let c1 = { x: p0.x + dir * offset, y: p0.y }
      let c2 = { x: p1.x - dir * offset, y: p1.y }
      const radius = 0.14 * width
      if (Math.abs(dx) < radius) {
        const nudge = ((pa.x + pb.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1) * (radius - Math.abs(dx)) * 0.9
        c1 = { x: c1.x + nudge, y: lerp(p0.y, p1.y, 0.2) }
        c2 = { x: c2.x + nudge, y: lerp(p0.y, p1.y, 0.8) }
      }
      const clip = (p) => ({
        x: Math.min(safe.right, Math.max(safe.left, p.x)),
        y: Math.min(safe.bottom, Math.max(safe.top, p.y)),
      })
      const c1c = clip(c1)
      const c2c = clip(c2)
      const eased = v * v * v * (v * (6 * v - 15) + 10)
      const point = bezier(p0, c1c, c2c, p1, eased)
      const scale = lerp(a.s, b.s, progress(0, 0.65, v))
      const blendBack = Math.min(0.3, Math.max(0.06, blendPx / spanT))
      const startW = 1 - progress(0, blendBack, v)
      const endW = progress(1 - blendBack, 1, v)
      let y = point.y + startW * (nowA.y - pa.y) + endW * (nowB.y - pb.y)
      const x = point.x
      y += a.sink * a.s * (1 - progress(0, 0.22, v)) + b.sink * b.s * progress(0.78, 1, v)
      let airborne = false
      if (a.behind && v < 0.36) {
        y -= Math.sin((v / 0.36) * Math.PI) * Math.min(64 * a.s, 72)
        airborne = v < 0.32
      }
      if (b.behind && v > 0.68) {
        y -= Math.sin(((v - 0.68) / 0.32) * Math.PI) * Math.min(56 * b.s, 60)
        airborne = true
      }
      if (a.sink && v < 0.2) airborne = true
      const front = !(a.behind && v < 0.12) && !(b.behind && v > 0.92)
      /* Halfway through a walk the original uses the default box, so the
         clamp bounds relax in the middle of the step. */
      const box =
        v < 0.5
          ? lerpBox(a.box, DEFAULT_BOX, progress(0, a.sink ? 0.22 : a.behind ? 0.36 : 0.06, v))
          : lerpBox(DEFAULT_BOX, b.box, progress(b.sink ? 0.78 : b.behind ? 0.68 : 0.94, 1, v))
      const hit = clampBox(x, y, box, safe, scale, lane)
      return {
        x: hit.x,
        y: hit.y,
        s: scale,
        front,
        airborne,
        k,
        t: v,
        walked: bezierArc(p0, c1c, c2c, p1, eased),
      }
    }

    function lerpBox(a, b, t) {
      return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)]
    }

    /* Top edge of the mobile action bar, or the bottom of the viewport when
       it is not rendered. */
    function barTop() {
      const bar = document.querySelector('[data-whatsapp-bar]')
      const rect = bar?.getClientRects().length ? bar.getBoundingClientRect() : null
      return rect?.height ? rect.top : window.innerHeight - 6
    }

    function currentSafe() {
      const ViewW = document.documentElement.clientWidth
      const top = (document.getElementById('site-header')?.offsetHeight ?? 76) + 10
      if (lane) return { left: 10, top, right: ViewW - 10, bottom: barTop() + 40 }
      const bar = document.querySelector('[data-whatsapp-bar]')
      const bottom = bar?.getClientRects().length ? bar.getBoundingClientRect().top : window.innerHeight
      return { left: 10, top, right: ViewW - 10, bottom: Math.min(window.innerHeight, bottom) - 10 }
    }

    function snapScroll(scroll) {
      const { k, t } = holdAt(holds, scroll)
      if (t <= 0 || k >= stops.length - 1) return scroll
      const a = stops[k]
      const b = stops[k + 1]
      const enter = a.sink ? 0.22 : a.behind ? 0.36 : 0
      const leave = b.sink ? 0.78 : b.behind ? 0.68 : 1
      let adjusted = t
      if (t < enter) adjusted = t < enter / 2 ? 0 : enter
      else if (t > leave) adjusted = t > (1 + leave) / 2 ? 1 : leave
      if (adjusted === t) return scroll
      return holds[k][1] + adjusted * (holds[k + 1][0] - holds[k][1])
    }

    /* ---- pose rig ---- */
    function setPose(name, immediate = false) {
      if (state.toPose === name) return
      state.fromPose = state.toPose
      state.toPose = name
      state.poseT = immediate ? 1 : 0
    }

    function dropPrint(v, facing) {
      if (!printPool.length) return
      const el = printPool[state.printIdx++ % printPool.length]
      const size = 14 * Math.max(0.75, 1.5 * v.s)
      const footX = v.x - D.x * v.s + (facing > 0 ? 186 : 114) * v.s
      const footY = v.y - D.y * v.s + 226 * v.s
      el.style.transform = `translate(${(footX - size / 2).toFixed(1)}px, ${(footY - size / 2).toFixed(1)}px) rotate(${(Math.random() * 0.4 - 0.2).toFixed(3)}rad)`
      el.style.width = `${size.toFixed(1)}px`
      el.style.height = `${size.toFixed(1)}px`
      el.animate(
        [{ opacity: 0 }, { opacity: 0.45, offset: 0.08 }, { opacity: 0.45, offset: 0.5 }, { opacity: 0 }],
        { duration: 2600, easing: 'ease-out' }
      )
    }

    function heartsBurst(v) {
      if (!heartsEl) return
      for (let i = 0; i < 3; i++) {
        const h = document.createElement('span')
        h.className = 'pup-heart'
        h.textContent = '♥'
        h.style.left = `${v.x + (i - 1) * 22}px`
        h.style.top = `${v.y - D.y * v.s + 40}px`
        heartsEl.appendChild(h)
        setTimeout(() => h.remove(), 1400)
      }
    }

    function react(name) {
      const bubble = {
        jump: ['wheee!', 'boing!', 'yip!'],
        woof: ['woof!'],
        love: ['I like you!'],
        sneeze: ['achoo!'],
      }[name]
      const nowS = performance.now() / 1000
      if (name === 'jump') {
        hop = 1.35
        state.earVel += 220
      } else if (name === 'love') {
        hop = 0.5
        hearts = 1
        state.wag = 1
        state.earVel += 100
        if (current) heartsBurst(current)
      } else if (name === 'sneeze') {
        hop = 0.4
        state.headCockTarget = 10
        state.earVel += 378
        state.mouthUntil = nowS + 0.22
      } else {
        hop = 0.3
        state.earVel += 260
        state.mouthUntil = nowS + 0.34
      }
      state.actionUntil = nowS + 0.9
      say(bubble[Math.floor(Math.random() * bubble.length)])
    }

    const onClick = () => react(REACTIONS[Math.floor(Math.random() * REACTIONS.length)])
    const onPointerMove = (e) => {
      if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 }
    }
    const onCue = (e) => {
      const detail = e.detail || {}
      if (!detail.look) return
      const scene = meta[state.restIndex]?.scene
      if (scene && !scene.contains(detail.look) && !detail.look.contains(scene)) return
      look = { el: detail.look, until: performance.now() / 1000 + (detail.secs ?? 1.6) }
      if (detail.say) say(detail.say, detail.secs ?? 1.8)
    }
    const onFocus = (e) => {
      const t = e.target
      if (t instanceof HTMLElement && t.matches('a, button, input, textarea, select, summary')) {
        look = { el: t, until: performance.now() / 1000 + 1.4 }
      }
    }

    let current = null
    let look = null
    let mouse = null
    let last = performance.now() / 1000
    let lastScroll = window.scrollY
    let lastMoveAt = last
    let trackLeft = null
    let greeted = false
    let scrollDir = 1
    let smooth = null
    let offset = { x: 0, y: 0 }
    let renderPos = null
    let prevBarTop = 0
    let stillFor = 0

    actor.addEventListener('click', onClick)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pup:cue', onCue)
    window.addEventListener('focusin', onFocus)

    function frame(now) {
      if (stopped || !active || !holds.length) {
        raf = requestAnimationFrame(frame)
        return
      }
      const t = now / 1000
      const dt = Math.min(0.05, Math.max(0.001, t - last))
      last = t
      while (state.queue.length && state.queue[0][0] <= t) state.queue.shift()[1]()

      const scroll = window.scrollY
      const scrolled = Math.abs(scroll - lastScroll) > 0.5
      if (scrolled) {
        scrollDir = scroll > lastScroll ? 1 : -1
        lastMoveAt = t
        lastScroll = scroll
      }
      const bar = lane ? barTop() : 0
      if (lane) {
        for (const st of stops) if (st.track.kind === 'screen') st.track.top = bar - 159 * st.s
      }
      const idle = t * 1000 - lastMoveAt * 1000 > 250
      const target = idle ? snapScroll(scroll) : scroll
      const v = position(target)
      if (!v) {
        raf = requestAnimationFrame(frame)
        return
      }

      /* Small spring that catches up after the anchored lane lets go, so the
         pup settles back into the page instead of snapping. */
      const decay = Math.exp(-dt / 0.28)
      offset.x *= decay
      offset.y *= decay
      if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05) offset.x = offset.y = 0

      /* Between two scene stops the layer is pinned to the bottom of the
         viewport and the pup is measured from the action bar, exactly like the
         original. The layer is 100lvh tall there, so its own top is removed. */
      let anchored = false
      if (lane) {
        const sa = stops[v.k]
        const sb = v.t > 0 ? stops[v.k + 1] : sa
        anchored = sa?.track.kind === 'screen' && sb?.track.kind === 'screen'
      }
      let dispX
      let dispY
      let settled = true
      if (anchored) {
        if (!smooth) smooth = renderPos ? { x: renderPos.x, y: renderPos.y - prevBarTop } : { x: v.x, y: v.y - bar }
        const follow = 1 - Math.exp(-dt / 0.14)
        smooth.x += (v.x - smooth.x) * follow
        smooth.y += (v.y - bar - smooth.y) * follow
        settled = Math.hypot(v.x - smooth.x, v.y - bar - smooth.y) < 1.5
        dispX = smooth.x
        dispY = bar + smooth.y
      } else {
        if (smooth) {
          offset.x = (renderPos?.x ?? v.x) - v.x
          offset.y = (renderPos?.y ?? v.y) - v.y
          smooth = null
        }
        dispX = v.x + offset.x
        dispY = v.y + offset.y
      }
      prevBarTop = bar

      // ---- rest / walk state ----
      const resting = v.t === 0 && settled
      if (v.k !== state.restIndex) {
        state.restIndex = v.k
        state.walked = 0
        state.printStep = 0
      }
      const info = meta[v.k] ?? {}
      let facing = info.facing ?? 1
      let stride = 0
      /* 0 means "no direction observed this frame" (resting); only a real
         change of heading drives the header hide/show. */
      let heading = 0

      if (resting) {
        setPose(info.pose || 'sit')
        if (!greeted && v.k === 0 && info.act === 'peekaboo') {
          greeted = true
          state.wag = 1
          setTimeout(() => say('peekaboo!', 1.8), 650)
        }
        state.stride += (0 - state.stride) * Math.min(1, dt * 10)
        state.restIndex = v.k
        /* Entering a rest resets the idle act queue and gives the ears the
           same little jolt the original rig applies. */
        if (state.restEnteredK !== v.k) {
          state.restEnteredK = v.k
          state.restAt = t
          state.basketNext = t + 2.4
          state.lookIdx = -1
          state.lookNext = t
          state.queue = []
          state.earVel += 88
          state.headCockTarget = 0
          if (!info.track) {
            state.wag = info.act === 'basket' ? 0.3 : 0.7
          }
        }
        // treadmill: walk in place while the door wall slides
        if (info.track) {
          const left = info.track.getBoundingClientRect().left
          const delta = trackLeft === null ? 0 : left - trackLeft
          trackLeft = left
          state.walked += -delta / Math.max(0.05, v.s)
          if (Math.abs(delta) > 0.15) {
            state.pose = 'walk'
            state.stride = 1
            facing = delta < 0 ? 1 : -1
            heading = facing
            state.idleT = 0
          } else {
            state.idleT = (state.idleT ?? 0) + dt
            if (state.idleT > 0.25) {
              setPose('stand')
              state.stride += (0 - state.stride) * Math.min(1, dt * 10)
            } else {
              setPose('walk')
              state.stride = 1
            }
          }
          state.wag = 0.7
        } else {
          trackLeft = null
          state.wag = info.act === 'basket' ? 0.3 : t < state.wagBoostUntil ? 1 : 0.7
          /* The reference scene marked "tilt" keeps cocking its head in a
             slow sine once it has settled. */
          if (info.act === 'tilt' && t - state.restAt > 1.2) {
            state.headCockTarget = Math.sin(t * 0.9) > 0.35 ? 13 : Math.sin(t * 0.9) < -0.35 ? -10 : 0
          }
          /* In the basket it jolts or yawns every few seconds, silently. */
          if (info.act === 'basket' && t > state.basketNext) {
            state.basketNext = t + 4.5 + Math.random() * 3
            if (Math.random() < 0.7) state.earVel += 121
            else state.mouthUntil = t + 0.7
          }
          /* After nine quiet seconds: a head-tilt ("hm?") or a tail wag. */
          if (
            info.act !== 'basket' &&
            t - Math.max(lastMoveAt, state.restAt, state.idleActAt) > 9 &&
            !state.queue.length
          ) {
            state.idleActAt = t
            if (Math.random() < 0.55) {
              state.headCockTarget = -14
              say('hm?')
              state.queue.push(
                [t + 0.8, () => { state.headCockTarget = 12 }],
                [t + 1.6, () => { state.headCockTarget = 0 }]
              )
            } else {
              state.wagBoostUntil = t + 2.4
              state.queue.push([t + 2.4, () => { state.wagBoostUntil = 0 }])
            }
          }
          /* Periodically looks at whatever the scene marks as interesting. */
          const userLooking = (look && look.until > t) || (mouse && t - mouse.t < 2.5)
          if (info.looks.length && !userLooking && t - state.restAt > 0.8 && t > state.lookNext) {
            state.lookNext = t + 1.7
            state.lookIdx = (state.lookIdx + 1) % (info.looks.length + 1)
            if (state.lookIdx < info.looks.length) {
              look = { el: info.looks[state.lookIdx], until: t + 1.4 }
            }
          }
        }
      } else {
        trackLeft = null
        /* In the lane a hop only happens while the page scrolls towards the
           pup's next stop; otherwise it trots or stands still. */
        let airborne = v.airborne
        if (lane && v.t > 0) {
          const sa = stops[v.k]
          const sb = stops[v.k + 1]
          if (sa?.sink && v.t < 0.22) airborne = scrollDir > 0
          else if (sb?.sink && v.t > 0.78) airborne = scrollDir < 0
        }
        const dxd = renderPos ? dispX - renderPos.x : 0
        const dyd = renderPos ? dispY - renderPos.y : 0
        if (lane) stillFor = Math.hypot(dxd, dyd) > 0.25 ? 0 : stillFor + dt
        if (airborne) {
          setPose('hop')
          state.stride += (0 - state.stride) * Math.min(1, dt * 12)
        } else if (lane && stillFor > 0.3) {
          setPose('stand')
          state.stride += (0 - state.stride) * Math.min(1, dt * 10)
          if (stillFor > 2.6 && stillFor - dt <= 2.6) say('coming?', 1.6)
        } else {
          setPose('walk')
          state.stride = 1
        }
        if (renderPos && Math.abs(dxd) > 0.6 && Math.abs(dxd) > 0.35 * Math.abs(dyd)) {
          facing = dxd > 0 ? 1 : -1
          heading = facing
        } else if (renderPos) {
          facing = state.facing
        }
        // paw prints every 34px of travel
        if (!lane) {
          const step = Math.floor(v.walked / (34 * Math.max(0.05, v.s)))
          if (step !== state.printStep && renderPos) {
            state.printStep = step
            dropPrint(v, facing)
          }
        }
        state.idleT = 0
      }
      state.facing = facing
      /* Hide the navbar while the pup is heading right, reveal it when it
         turns around. Resting frames keep the last direction. */
      if (heading && heading !== state.heading) {
        state.heading = heading
        document.documentElement.dataset.pupFacing = heading > 0 ? 'right' : 'left'
      }

      meta.forEach((item, i) => {
        if (!item.scene) return
        const here = resting && i === v.k
        const visited = i <= v.k || (i === v.k + 1 && v.t > 0.92)
        if (item.scene.dataset.here !== String(here)) item.scene.dataset.here = String(here)
        // Once a scene has been reached it stays "visited", so doors do not
        // flap shut again when the wall is nudged back and forth.
        if (visited && item.scene.dataset.visited !== 'true') item.scene.dataset.visited = 'true'
      })

      // ---- rig ----
      state.poseT = Math.min(1, state.poseT + dt * 6)
      const poseFrom = POSES[state.fromPose] || POSES.sit
      const poseTo = POSES[state.toPose] || POSES.sit
      const blended = lerpPose(poseFrom, poseTo, state.poseT)
      state.headCock +=
        (state.headCockTarget + 3 * MOTION.gazeX - state.headCock) * Math.min(1, dt / 0.18)
      if (Math.abs(state.headCock) > 0.01) blended.headRot += state.headCock
      if (t < state.mouthUntil) blended.mouth = 1
      if (hop > 0) {
        blended.bodyY -= Math.sin(Math.min(1, hop) * Math.PI) * 22
        blended.bodyRot -= 6
        hop = Math.max(0, hop - dt * 2.2)
      }
      MOTION.phase += dt * (state.stride > 0.05 ? 3.2 + 5.8 * state.stride : 1.2)
      MOTION.time = t
      MOTION.stride = state.stride
      MOTION.wag = state.wag
      /* Ear spring, matching the rig's impulse response. */
      state.earVel += (-150 * state.ear - 10 * state.earVel) * dt
      state.ear = Math.max(-28, Math.min(28, state.ear + state.earVel * dt))
      MOTION.ear = state.ear
      // blink
      if (!state.nextBlink || t > state.nextBlink) {
        state.blinkUntil = t + 0.16
        state.nextBlink = t + 2.4 + Math.random() * 4
      }
      MOTION.blink = t < (state.blinkUntil ?? 0) ? 1 : 0
      const computed = computeFrame(blended, MOTION)
      applyFrame(svg, computed, facing)

      // ---- place ----
      layer.dataset.anchor = anchored ? 'bottom' : 'top'
      const layerTop = anchored ? layer.getBoundingClientRect().top : 0
      actor.style.transform = `translate3d(${(dispX - D.x * v.s).toFixed(2)}px, ${(dispY - D.y * v.s - layerTop).toFixed(2)}px, 0)`
      bodyEl.style.transform = `scale(${v.s.toFixed(4)})`
      layer.dataset.front = String(v.front)
      actor.dataset.holding = String(resting)
      renderPos = { x: dispX, y: dispY }

      // ---- bubble ----
      if (bubbleEl.dataset.show === 'true') {
        if (t > state.bubbleUntil) bubbleEl.dataset.show = 'false'
        const bx = (facing > 0 ? 214 : 300 - 214) * v.s
        bubbleEl.parentElement.style.transform = `translate(${bx.toFixed(1)}px, ${(30 * v.s).toFixed(1)}px)`
      }

      // ---- look / gaze ----
      if (look && look.until < t) look = null
      const focusEl = look?.el
      if (focusEl) {
        const r = focusEl.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        MOTION.gazeX = Math.max(-1, Math.min(1, (cx - (v.x + 40)) / 160))
        MOTION.gazeY = Math.max(-1, Math.min(1, (cy - (v.y - 120 * v.s)) / 160))
        if (Math.abs(cx - v.x) > 30 && resting) state.facing = cx > v.x ? 1 : -1
      } else if (mouse && t - mouse.t < 2.5) {
        MOTION.gazeX = Math.max(-1, Math.min(1, (mouse.x - (v.x + 40)) / 180))
        MOTION.gazeY = Math.max(-1, Math.min(1, (mouse.y - (v.y - 130 * v.s)) / 180))
      } else {
        MOTION.gazeX *= 0.9
        MOTION.gazeY *= 0.9
      }

      current = v
      raf = requestAnimationFrame(frame)
    }

    measure()
    raf = requestAnimationFrame(frame)
    const remeasure = () => {
      measure()
    }
    const ro = new ResizeObserver(remeasure)
    ro.observe(document.body)
    window.addEventListener('resize', remeasure)
    window.addEventListener('load', remeasure)
    document.fonts?.ready.then(remeasure)
    const timer = setInterval(remeasure, 2500)

    const onMotion = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) teardown()
      lane = mobileMq.matches
      measure()
    }
    mobileMq.addEventListener?.('change', onMotion)

    function teardown() {
      stopped = true
      cancelAnimationFrame(raf)
      clearInterval(timer)
      ro.disconnect()
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('load', remeasure)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pup:cue', onCue)
      window.removeEventListener('focusin', onFocus)
      actor.removeEventListener('click', onClick)
      delete document.documentElement.dataset.pup
      delete document.documentElement.dataset.pupFacing
      delete layer.dataset.anchor
      layer.hidden = true
    }

    return teardown
  }, [])

  return (
    <>
      <div aria-hidden="true" className="pup-probe" ref={probeRef} />
      <div className="pup-layer" ref={layerRef} hidden data-front="true">
        <div aria-hidden="true" className="pup-prints" ref={printsRef}>
          {Array.from({ length: 24 }, (_, i) => (
            <svg key={i} viewBox="0 0 64 64">
              <path d={PAW_D} />
            </svg>
          ))}
        </div>
        <div className="pup-actor" ref={actorRef}>
          <div className="pup-actor__body" ref={bodyRef}>
            <PupBuddy pose="sit" />
          </div>
          <span className="pup-bubble-at">
            <span className="pup-bubble" data-show="false" ref={bubbleRef} />
          </span>
        </div>
        <span className="pup-hearts" ref={heartsRef} aria-hidden="true" />
      </div>
    </>
  )
}
