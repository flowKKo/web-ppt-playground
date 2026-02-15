import { motion } from 'framer-motion'
import type { CycleSlideData } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'

const VB_W = 800
const VB_H = 480

function CircularCycle({ steps, palette, textColor }: { steps: CycleSlideData['steps']; palette: string[]; textColor?: string }) {
  const n = steps.length
  const cx = VB_W / 2
  const cy = VB_H / 2
  const R = Math.min(cx - 110, cy - 70)
  const nodeR = Math.max(26, 46 - n * 3)

  const positions = steps.map((_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
  })

  return (
    <>
      <defs>
        <marker id="cyc-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill={colors.textCaption} opacity={0.5} />
        </marker>
      </defs>
      {/* Arc arrows between nodes */}
      {positions.map((from, i) => {
        const to = positions[(i + 1) % n]
        const fromAngle = Math.atan2(from.y - cy, from.x - cx)
        const toAngle = Math.atan2(to.y - cy, to.x - cx)
        const gap = (2 * Math.PI) / n / 4
        const sx = from.x + (nodeR + 4) * Math.cos(fromAngle + gap)
        const sy = from.y + (nodeR + 4) * Math.sin(fromAngle + gap)
        const ex = to.x + (nodeR + 4) * Math.cos(toAngle - gap)
        const ey = to.y + (nodeR + 4) * Math.sin(toAngle - gap)
        const mx = (sx + ex) / 2
        const my = (sy + ey) / 2
        const mAngle = Math.atan2(my - cy, mx - cx)
        const cpX = mx + 24 * Math.cos(mAngle)
        const cpY = my + 24 * Math.sin(mAngle)
        return (
          <path
            key={`a-${i}`}
            d={`M ${sx} ${sy} Q ${cpX} ${cpY} ${ex} ${ey}`}
            fill="none" stroke={colors.textCaption} strokeWidth="1.8"
            strokeDasharray="5 4" markerEnd="url(#cyc-arr)" opacity={0.35}
          />
        )
      })}
      {/* Nodes */}
      {positions.map((pos, i) => (
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r={nodeR} fill={palette[i]} fillOpacity={0.14} stroke={palette[i]} strokeWidth="2.5" />
          <text x={pos.x} y={steps[i].description ? pos.y - 5 : pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={n > 6 ? 11 : 13} fontWeight="700" fill={textColor || colors.textPrimary}>
            {steps[i].label}
          </text>
          {steps[i].description && (
            <text x={pos.x} y={pos.y + 11} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={colors.textSecondary}>
              {steps[i].description}
            </text>
          )}
        </g>
      ))}
    </>
  )
}

function GearCycle({ steps, palette, textColor }: { steps: CycleSlideData['steps']; palette: string[]; textColor?: string }) {
  const n = steps.length
  const cx = VB_W / 2
  const cy = VB_H / 2
  const R = Math.min(cx - 110, cy - 70)
  const nodeR = Math.max(28, 48 - n * 3)

  const positions = steps.map((_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
  })

  // Gear tooth path around a circle
  const gearPath = (gx: number, gy: number, r: number, teeth: number) => {
    const inner = r - 3
    const outer = r + 5
    const pts: string[] = []
    for (let t = 0; t < teeth; t++) {
      const a0 = (2 * Math.PI * t) / teeth
      const a1 = a0 + Math.PI / teeth * 0.4
      const a2 = a0 + Math.PI / teeth * 0.6
      const a3 = a0 + Math.PI / teeth
      pts.push(`${gx + inner * Math.cos(a0)},${gy + inner * Math.sin(a0)}`)
      pts.push(`${gx + outer * Math.cos(a1)},${gy + outer * Math.sin(a1)}`)
      pts.push(`${gx + outer * Math.cos(a2)},${gy + outer * Math.sin(a2)}`)
      pts.push(`${gx + inner * Math.cos(a3)},${gy + inner * Math.sin(a3)}`)
    }
    return pts.join(' ')
  }

  return (
    <>
      {/* Connecting lines */}
      {positions.map((from, i) => {
        const to = positions[(i + 1) % n]
        return (
          <line key={`l-${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={colors.textCaption} strokeWidth="1.5" strokeDasharray="4 3" opacity={0.3} />
        )
      })}
      {/* Gear nodes */}
      {positions.map((pos, i) => (
        <g key={i}>
          <polygon points={gearPath(pos.x, pos.y, nodeR, 8)} fill={palette[i]} fillOpacity={0.12} stroke={palette[i]} strokeWidth="2" />
          <circle cx={pos.x} cy={pos.y} r={nodeR - 6} fill={palette[i]} fillOpacity={0.06} />
          <text x={pos.x} y={steps[i].description ? pos.y - 5 : pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={n > 6 ? 11 : 13} fontWeight="700" fill={textColor || colors.textPrimary}>
            {steps[i].label}
          </text>
          {steps[i].description && (
            <text x={pos.x} y={pos.y + 11} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={colors.textSecondary}>
              {steps[i].description}
            </text>
          )}
        </g>
      ))}
    </>
  )
}

function LoopCycle({ steps, palette, textColor }: { steps: CycleSlideData['steps']; palette: string[]; textColor?: string }) {
  const n = steps.length
  const cx = VB_W / 2
  const cy = VB_H / 2
  // Racetrack shape: an elongated oval
  const rx = Math.min(cx - 80, 280) // horizontal radius
  const ry = Math.min(cy - 60, 150) // vertical radius

  // Distribute steps evenly along the oval perimeter
  const positions = steps.map((_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n
    return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) }
  })

  // Draw the oval track
  const trackPath = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx - 0.01} ${cy}`

  return (
    <>
      <defs>
        <marker id="loop-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0,0 8,3 0,6" fill={colors.textCaption} opacity={0.5} />
        </marker>
      </defs>
      {/* Track */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={colors.textCaption} strokeWidth="2" strokeDasharray="8 5" opacity={0.2} />
      {/* Direction arrow on track */}
      <path d={trackPath} fill="none" stroke="none" id="loop-track" />
      {/* Arrows between nodes */}
      {positions.map((from, i) => {
        const to = positions[(i + 1) % n]
        const mx = (from.x + to.x) / 2
        const my = (from.y + to.y) / 2
        const mAngle = Math.atan2(my - cy, mx - cx)
        const cpX = mx + 16 * Math.cos(mAngle)
        const cpY = my + 10 * Math.sin(mAngle)
        return (
          <path key={`a-${i}`}
            d={`M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`}
            fill="none" stroke={colors.textCaption} strokeWidth="1.5"
            strokeDasharray="4 3" markerEnd="url(#loop-arr)" opacity={0.3}
          />
        )
      })}
      {/* Nodes */}
      {positions.map((pos, i) => {
        const w = Math.max(60, 80 - n * 4)
        const h = 36
        return (
          <g key={i}>
            <rect x={pos.x - w / 2} y={pos.y - h / 2} width={w} height={h} rx={h / 2} fill={palette[i]} fillOpacity={0.14} stroke={palette[i]} strokeWidth="2" />
            <text x={pos.x} y={steps[i].description ? pos.y - 4 : pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={n > 6 ? 11 : 12} fontWeight="700" fill={textColor || colors.textPrimary}>
              {steps[i].label}
            </text>
            {steps[i].description && (
              <text x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill={colors.textSecondary}>
                {steps[i].description}
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}

export function CycleDiagram({ steps, variant, textColor, colorPalette }: { steps: CycleSlideData['steps']; variant: CycleSlideData['variant']; textColor?: string; colorPalette?: string }) {
  const palette = generateGradientColors(steps.length, colorPalette)
  if (steps.length === 0) return null

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
      {variant === 'gear' ? (
        <GearCycle steps={steps} palette={palette} textColor={textColor} />
      ) : variant === 'loop' ? (
        <LoopCycle steps={steps} palette={palette} textColor={textColor} />
      ) : (
        <CircularCycle steps={steps} palette={palette} textColor={textColor} />
      )}
    </svg>
  )
}

export default function CycleEngine({ title, body, steps, variant, titleSize, bodySize, titleColor, textColor, colorPalette }: CycleSlideData) {
  return (
    <motion.div
      className="flex flex-col gap-4 h-full"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <EngineTitle title={title} body={body} titleSize={titleSize} bodySize={bodySize} titleColor={titleColor} textColor={textColor} />
      <motion.div variants={motionConfig.child} className="flex-1 min-h-0 w-full">
        <CycleDiagram steps={steps} variant={variant} textColor={textColor} colorPalette={colorPalette} />
      </motion.div>
    </motion.div>
  )
}
