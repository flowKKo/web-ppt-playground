import { motion } from 'framer-motion'
import type { ChartSlideData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'
import BarChart from '../../charts/BarChart'

const colorMap: Record<string, string> = {
  positive: colors.accentPositive,
  negative: colors.accentNegative,
  neutral: colors.accentNeutral,
}

export default function ChartSlide({ title, body, bars, highlight }: ChartSlideData) {
  const categories = bars.map(b => b.category)
  const seriesNames = [...new Set(bars.flatMap(b => b.values.map(v => v.name)))]
  const series = seriesNames.map(name => {
    const firstMatch = bars.flatMap(b => b.values).find(v => v.name === name)
    return {
      name,
      data: bars.map(b => b.values.find(v => v.name === name)?.value ?? 0),
      color: firstMatch?.color ? colorMap[firstMatch.color] : undefined,
    }
  })

  return (
    <motion.div className="flex flex-col gap-8 h-full justify-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="flex items-end justify-between">
        <div>
          <motion.h2 variants={motionConfig.child}
            className="text-5xl font-bold" style={{ color: colors.textPrimary }}>
            {title}
          </motion.h2>
          {body && (
            <motion.p variants={motionConfig.child}
              className="text-xl mt-3" style={{ color: colors.textSecondary }}>
              {body}
            </motion.p>
          )}
        </div>
        {highlight && (
          <motion.span variants={motionConfig.child}
            className="text-5xl font-extrabold" style={{ color: colors.accentPositive }}>
            {highlight}
          </motion.span>
        )}
      </div>
      <motion.div variants={motionConfig.child} className="flex-1 min-h-0">
        <BarChart categories={categories} series={series} height={320} />
      </motion.div>
    </motion.div>
  )
}
