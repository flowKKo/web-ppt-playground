import { motion } from 'framer-motion'
import type { SwotSlideData, SwotItem } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'

const QUADRANT_META = [
  { key: 'strengths', label: '优势 (S)', icon: '↑' },
  { key: 'weaknesses', label: '劣势 (W)', icon: '↓' },
  { key: 'opportunities', label: '机会 (O)', icon: '★' },
  { key: 'threats', label: '威胁 (T)', icon: '⚠' },
] as const

export function SwotDiagram({ strengths, weaknesses, opportunities, threats, textColor, colorPalette }: {
  strengths: SwotItem[]; weaknesses: SwotItem[]; opportunities: SwotItem[]; threats: SwotItem[]
  textColor?: string; colorPalette?: string
}) {
  const palette = generateGradientColors(4, colorPalette)
  const quadrants = [strengths, weaknesses, opportunities, threats]

  return (
    <div className="grid grid-cols-2 gap-3 h-full p-2">
      {QUADRANT_META.map((meta, qi) => (
        <div
          key={meta.key}
          className="rounded-xl p-4 flex flex-col overflow-hidden"
          style={{ background: `${palette[qi]}10`, border: `2px solid ${palette[qi]}30` }}
        >
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: palette[qi] }}>
              {meta.icon}
            </span>
            <span className="text-sm font-bold" style={{ color: textColor || colors.textPrimary }}>
              {meta.label}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 overflow-y-auto flex-1">
            {quadrants[qi].map((item, ii) => (
              <div key={ii} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: palette[qi] }} />
                <div>
                  <span className="text-xs font-medium" style={{ color: textColor || colors.textPrimary }}>
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-[11px] ml-1" style={{ color: colors.textCaption }}>
                      — {item.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SwotEngine({ title, body, strengths, weaknesses, opportunities, threats, titleSize, bodySize, titleColor, textColor, colorPalette }: SwotSlideData) {
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
        <SwotDiagram strengths={strengths} weaknesses={weaknesses} opportunities={opportunities} threats={threats} textColor={textColor} colorPalette={colorPalette} />
      </motion.div>
    </motion.div>
  )
}
