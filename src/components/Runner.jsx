/* The CSS-animated walking runner (used by the intro curtain). */
import runnerSvg from '../assets/svg/runner.svg?raw'
import Svg from './Svg'

export default function Runner() {
  return <Svg src={runnerSvg} />
}
