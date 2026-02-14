import { motion } from 'framer-motion'
import type { SequenceSlideData } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'
import ConnectorArrow from './shared/ConnectorArrow'
import EditableText from '../editor/EditableText'

function TimelineStep({ label, description, index, color }: { label: string; description?: string; index: number; color: string }) {
  return (
    <motion.div variants={motionConfig.child} className="flex flex-col items-center text-center flex-1 min-w-0">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2" style={{ backgroundColor: color }}>
        {index + 1}
      </div>
      <EditableText value={label} field={`steps.${index}.label`} as="div" className="text-sm font-semibold" style={{ color: colors.textPrimary }} />
      {description && <EditableText value={description} field={`steps.${index}.description`} as="div" className="text-xs mt-1" style={{ color: colors.textSecondary }} />}
    </motion.div>
  )
}

function ChainStep({ label, description, index, color }: { label: string; description?: string; index: number; color: string }) {
  return (
    <motion.div variants={motionConfig.child} className="flex-1 min-w-0 rounded-lg p-4" style={{ borderLeft: `4px solid ${color}`, background: colors.card }}>
      <EditableText value={label} field={`steps.${index}.label`} as="div" className="text-sm font-semibold" style={{ color: colors.textPrimary }} />
      {description && <EditableText value={description} field={`steps.${index}.description`} as="div" className="text-xs mt-1" style={{ color: colors.textSecondary }} />}
    </motion.div>
  )
}

function ArrowStep({ label, description, index, color }: { label: string; description?: string; index: number; color: string }) {
  return (
    <motion.div variants={motionConfig.child} className="flex-1 min-w-0 rounded-lg p-4 text-center" style={{ background: color }}>
      <EditableText value={label} field={`steps.${index}.label`} as="div" className="text-sm font-bold text-white" />
      {description && <EditableText value={description} field={`steps.${index}.description`} as="div" className="text-xs mt-1 text-white/80" />}
    </motion.div>
  )
}

function PillStep({ label, description, index, color }: { label: string; description?: string; index: number; color: string }) {
  return (
    <motion.div variants={motionConfig.child} className="flex-1 min-w-0 flex flex-col items-center text-center">
      <EditableText value={label} field={`steps.${index}.label`} as="div" className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: color }} />
      {description && <EditableText value={description} field={`steps.${index}.description`} as="div" className="text-xs mt-2" style={{ color: colors.textSecondary }} />}
    </motion.div>
  )
}

function RibbonStep({ label, description, index, color, isLast }: { label: string; description?: string; index: number; color: string; isLast: boolean }) {
  return (
    <motion.div variants={motionConfig.child} className="flex-1 min-w-0 relative">
      <div className="p-4 text-center" style={{ backgroundColor: color, clipPath: isLast ? undefined : 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)' }}>
        <EditableText value={label} field={`steps.${index}.label`} as="div" className="text-sm font-bold text-white" />
        {description && <EditableText value={description} field={`steps.${index}.description`} as="div" className="text-xs mt-1 text-white/80" />}
      </div>
    </motion.div>
  )
}

export function SequenceDiagram({ steps, variant, direction = 'horizontal', gap = 8 }: { steps: SequenceSlideData['steps']; variant: SequenceSlideData['variant']; direction?: 'horizontal' | 'vertical'; gap?: number }) {
  const isH = direction === 'horizontal'
  const palette = generateGradientColors(steps.length)

  const renderSteps = () => {
    switch (variant) {
      case 'chain':
        return steps.map((s, i) => (
          <ChainStep key={i} label={s.label} description={s.description} index={i} color={palette[i]} />
        ))
      case 'arrows':
        return steps.map((s, i) => (
          <ArrowStep key={i} label={s.label} description={s.description} index={i} color={palette[i]} />
        ))
      case 'pills':
        return steps.map((s, i) => (
          <PillStep key={i} label={s.label} description={s.description} index={i} color={palette[i]} />
        ))
      case 'ribbon-arrows':
        return steps.map((s, i) => (
          <RibbonStep key={i} label={s.label} description={s.description} index={i} color={palette[i]} isLast={i === steps.length - 1} />
        ))
      case 'timeline':
      default:
        return steps.map((s, i) => (
          <TimelineStep key={i} label={s.label} description={s.description} index={i} color={palette[i]} />
        ))
    }
  }

  const needsConnector = variant === 'timeline' || variant === 'chain' || variant === 'pills'
  const connectorVariant = variant === 'pills' ? 'dot' : 'arrow'

  const stepsWithConnectors = () => {
    const result: React.ReactNode[] = []
    const rendered = renderSteps()
    rendered.forEach((node, i) => {
      result.push(node)
      if (needsConnector && i < rendered.length - 1) {
        result.push(
          <ConnectorArrow
            key={`c-${i}`}
            direction={direction}
            variant={connectorVariant}
            size={24}
          />
        )
      }
    })
    return result
  }

  return (
    <div className={`flex ${isH ? 'flex-row' : 'flex-col'} items-center`} style={{ gap: `${gap}px` }}>
      {stepsWithConnectors()}
    </div>
  )
}

export default function SequenceEngine({ title, body, steps, variant, direction = 'horizontal', gap }: SequenceSlideData) {
  return (
    <motion.div
      className="flex flex-col gap-6 h-full justify-center"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <EngineTitle title={title} body={body} />
      <SequenceDiagram steps={steps} variant={variant} direction={direction} gap={gap} />
    </motion.div>
  )
}
