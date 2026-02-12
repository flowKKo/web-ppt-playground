import { motion } from 'framer-motion'
import type { FunnelSlideData } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'
import EditableText from '../editor/EditableText'

function getClipPath(variant: FunnelSlideData['variant'], index: number, total: number): string {
  const step = 100 / total
  const topOffset = index * step
  const bottomOffset = (index + 1) * step

  if (variant === 'funnel') {
    // top-wide → bottom-narrow
    const topInset = (topOffset / 100) * 30
    const bottomInset = (bottomOffset / 100) * 30
    return `polygon(${topInset}% 0, ${100 - topInset}% 0, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`
  }
  if (variant === 'pyramid') {
    // top-narrow → bottom-wide (inverted funnel)
    const topInset = ((total - index) / total) * 30
    const bottomInset = ((total - index - 1) / total) * 30
    return `polygon(${topInset}% 0, ${100 - topInset}% 0, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`
  }
  // slope — left-aligned diagonal
  const topWidth = 40 + (index / Math.max(total - 1, 1)) * 60
  const bottomWidth = 40 + ((index + 1) / Math.max(total - 1, 1)) * 60
  return `polygon(0 0, ${topWidth}% 0, ${bottomWidth}% 100%, 0 100%)`
}

export default function FunnelPyramidEngine({ title, body, layers, variant }: FunnelSlideData) {
  const palette = generateGradientColors(layers.length)

  return (
    <motion.div
      className="flex flex-col gap-6 h-full justify-center"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <EngineTitle title={title} body={body} />
      <div className="flex flex-col items-center gap-1 flex-1">
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            variants={motionConfig.child}
            className="w-full flex items-center justify-center text-center relative"
            style={{
              flex: 1,
              clipPath: getClipPath(variant, i, layers.length),
              backgroundColor: palette[i],
              minHeight: 48,
            }}
          >
            <div className="px-6 py-2">
              <EditableText value={layer.label} field={`layers.${i}.label`} as="div" className="text-sm font-bold text-white" />
              {layer.description && <EditableText value={layer.description} field={`layers.${i}.description`} as="div" className="text-xs text-white/80" />}
              {layer.value !== undefined && <div className="text-xs text-white/70 font-semibold">{layer.value}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
