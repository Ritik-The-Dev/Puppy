/* A resting mascot at a fixed spot ("pup stop"). */
import PupBuddy from './PupBuddy'

export default function PupStop({ pose = 'sit', facing = 'right', act, behind, lane, className = '', style, children }) {
  return (
    <div
      data-pup-stop="true"
      data-pose={pose}
      data-facing={facing}
      data-act={act}
      data-behind={behind || undefined}
      data-lane={lane || undefined}
      className={`pup-stop ${className}`}
      style={style}
    >
      <div className="pup-buddy" data-facing={facing}>
        <PupBuddy pose={pose} facing={facing} />
        <span aria-hidden="true" className="pup-bubble" data-show="false" />
      </div>
    </div>
  )
}
