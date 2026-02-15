import { motion } from 'framer-motion'
import type { StackSlideData } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'

function HorizontalStack({ layers, palette, textColor }: { layers: StackSlideData['layers']; palette: string[]; textColor?: string }) {
  const n = layers.length
  return (
    <div className="flex flex-col justify-center gap-2 h-full px-4">
      {layers.map((layer, i) => {
        const color = palette[i % palette.length]
        return (
          <div
            key={i}
            className="flex items-center rounded-lg px-5 py-3"
            style={{
              background: `${color}12`,
              borderLeft: `4px solid ${color}`,
              minHeight: `${Math.max(32, Math.min(60, 280 / n))}px`,
            }}
          >
            <div className="flex-1">
              <div className="text-sm font-bold" style={{ color: textColor || colors.textPrimary }}>
                {layer.label}
              </div>
              {layer.description && (
                <div className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  {layer.description}
                </div>
              )}
            </div>
            <div className="text-xs font-mono opacity-30 ml-2" style={{ color: textColor || colors.textCaption }}>
              L{n - i}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VerticalStack({ layers, palette, textColor }: { layers: StackSlideData['layers']; palette: string[]; textColor?: string }) {
  const n = layers.length
  return (
    <div className="flex items-end justify-center gap-0 h-full px-8 pb-4">
      {layers.map((layer, i) => {
        const color = palette[i % palette.length]
        const h = `${Math.max(20, 90 - i * (60 / n))}%`
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-end rounded-t-lg px-2 pb-3 pt-2"
            style={{
              background: `${color}18`,
              borderTop: `3px solid ${color}`,
              height: h,
              maxWidth: `${Math.min(120, 600 / n)}px`,
            }}
          >
            <div className="text-xs font-bold text-center mt-auto" style={{ color: textColor || colors.textPrimary }}>
              {layer.label}
            </div>
            {layer.description && (
              <div className="text-[10px] text-center mt-0.5" style={{ color: colors.textSecondary }}>
                {layer.description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function OffsetStack({ layers, palette, textColor }: { layers: StackSlideData['layers']; palette: string[]; textColor?: string }) {
  const n = layers.length
  return (
    <div className="relative h-full flex items-center justify-center px-8">
      {layers.map((layer, i) => {
        const color = palette[i % palette.length]
        const offset = i * 16
        const width = `${Math.max(50, 92 - i * (40 / n))}%`
        return (
          <div
            key={i}
            className="absolute rounded-xl px-5 py-3 flex items-center"
            style={{
              background: `${color}14`,
              border: `2px solid ${color}40`,
              width,
              top: `${12 + offset}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: n - i,
            }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 shrink-0" style={{ backgroundColor: color }}>
              {i + 1}
            </span>
            <div>
              <div className="text-sm font-bold" style={{ color: textColor || colors.textPrimary }}>
                {layer.label}
              </div>
              {layer.description && (
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  {layer.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function StackDiagram({ layers, variant, textColor, colorPalette }: { layers: StackSlideData['layers']; variant: StackSlideData['variant']; textColor?: string; colorPalette?: string }) {
  const palette = generateGradientColors(layers.length, colorPalette)
  if (layers.length === 0) return null

  switch (variant) {
    case 'vertical':
      return <VerticalStack layers={layers} palette={palette} textColor={textColor} />
    case 'offset':
      return <OffsetStack layers={layers} palette={palette} textColor={textColor} />
    case 'horizontal':
    default:
      return <HorizontalStack layers={layers} palette={palette} textColor={textColor} />
  }
}

export default function StackEngine({ title, body, layers, variant, titleSize, bodySize, titleColor, textColor, colorPalette }: StackSlideData) {
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
        <StackDiagram layers={layers} variant={variant} textColor={textColor} colorPalette={colorPalette} />
      </motion.div>
    </motion.div>
  )
}
