import { motion } from 'framer-motion'
import type { RoadmapSlideData, RoadmapPhase } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'

const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  done: { bg: '#4CAF5018', border: '#4CAF50', text: '#388E3C' },
  active: { bg: '#2196F318', border: '#2196F3', text: '#1565C0' },
  pending: { bg: `${colors.textCaption}0C`, border: colors.border, text: colors.textCaption },
}

function getStatusStyle(status?: string) {
  return statusColors[status || 'pending'] || statusColors.pending
}

function HorizontalRoadmap({ phases, palette, textColor }: { phases: RoadmapPhase[]; palette: string[]; textColor?: string }) {
  return (
    <div className="flex gap-1 h-full items-stretch overflow-x-auto px-2">
      {phases.map((phase, pi) => (
        <div key={pi} className="flex-1 min-w-0 flex flex-col rounded-xl p-3" style={{ borderTop: `4px solid ${palette[pi % palette.length]}`, background: `${palette[pi % palette.length]}08` }}>
          <div className="text-sm font-bold mb-3" style={{ color: textColor || colors.textPrimary }}>
            {phase.label}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            {phase.items.map((item, ii) => {
              const s = getStatusStyle(item.status)
              return (
                <div key={ii} className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}>
                  <span className="text-xs font-medium" style={{ color: s.text }}>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function VerticalRoadmap({ phases, palette, textColor }: { phases: RoadmapPhase[]; palette: string[]; textColor?: string }) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto px-4">
      {phases.map((phase, pi) => (
        <div key={pi} className="flex gap-4">
          {/* Timeline track */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: palette[pi % palette.length] }}>
              {pi + 1}
            </div>
            {pi < phases.length - 1 && (
              <div className="w-0.5 flex-1 min-h-[16px]" style={{ backgroundColor: `${colors.textCaption}20` }} />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 pb-2">
            <div className="text-sm font-bold mb-2" style={{ color: textColor || colors.textPrimary }}>
              {phase.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phase.items.map((item, ii) => {
                const s = getStatusStyle(item.status)
                return (
                  <span key={ii} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                    {item.status === 'done' && <span>&#10003;</span>}
                    {item.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                    {item.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MilestoneRoadmap({ phases, palette, textColor }: { phases: RoadmapPhase[]; palette: string[]; textColor?: string }) {
  const n = phases.length
  return (
    <div className="flex flex-col justify-center h-full px-6">
      {/* Track line */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2" style={{ backgroundColor: `${colors.textCaption}20` }} />
        <div className="flex justify-between relative">
          {phases.map((phase, pi) => {
            const color = palette[pi % palette.length]
            const allDone = phase.items.every(i => i.status === 'done')
            const hasActive = phase.items.some(i => i.status === 'active')
            return (
              <div key={pi} className="flex flex-col items-center" style={{ width: `${100 / n}%` }}>
                {/* Diamond milestone marker */}
                <div
                  className="w-5 h-5 rotate-45 border-2 mb-3"
                  style={{
                    backgroundColor: allDone ? color : hasActive ? `${color}60` : 'white',
                    borderColor: color,
                  }}
                />
                <div className="text-xs font-bold text-center mb-1.5" style={{ color: textColor || colors.textPrimary }}>
                  {phase.label}
                </div>
                <div className="flex flex-col items-center gap-1">
                  {phase.items.map((item, ii) => {
                    const s = getStatusStyle(item.status)
                    return (
                      <span key={ii} className="text-[11px]" style={{ color: s.text }}>
                        {item.status === 'done' ? '✓ ' : ''}{item.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function RoadmapDiagram({ phases, variant, textColor, colorPalette }: { phases: RoadmapSlideData['phases']; variant: RoadmapSlideData['variant']; textColor?: string; colorPalette?: string }) {
  const palette = generateGradientColors(phases.length, colorPalette)
  if (phases.length === 0) return null

  switch (variant) {
    case 'vertical':
      return <VerticalRoadmap phases={phases} palette={palette} textColor={textColor} />
    case 'milestone':
      return <MilestoneRoadmap phases={phases} palette={palette} textColor={textColor} />
    case 'horizontal':
    default:
      return <HorizontalRoadmap phases={phases} palette={palette} textColor={textColor} />
  }
}

export default function RoadmapEngine({ title, body, phases, variant, titleSize, bodySize, titleColor, textColor, colorPalette }: RoadmapSlideData) {
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
        <RoadmapDiagram phases={phases} variant={variant} textColor={textColor} colorPalette={colorPalette} />
      </motion.div>
    </motion.div>
  )
}
