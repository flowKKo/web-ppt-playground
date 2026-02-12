import { motion } from 'framer-motion'
import type { PlayerCardSlideData } from '../../data/types'
import { colors, cardStyle, motionConfig } from '../../theme/swiss'
import BarChart from '../../charts/BarChart'

export default function PlayerCardSlide({ rank, name, score, model, highlight, features, comparison }: PlayerCardSlideData) {
  return (
    <motion.div className="flex gap-8 h-full items-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {/* Left: identity */}
      <motion.div variants={motionConfig.child} className="flex flex-col gap-4 shrink-0 w-[320px]">
        <span className="text-xl font-semibold" style={{ color: colors.accentNeutral }}>{rank}</span>
        <h2 className="text-4xl font-bold leading-tight" style={{ color: colors.textPrimary }}>{name}</h2>
        <span className="text-7xl font-extrabold" style={{ color: colors.accentPositive }}>{score}</span>
        <span className="text-lg" style={{ color: colors.textSecondary }}>{model}</span>
        {highlight && (
          <span className="text-base font-medium px-3 py-1.5 rounded-lg inline-block self-start"
            style={{ color: colors.accentPositive, background: 'rgba(76,175,80,0.1)' }}>
            {highlight}
          </span>
        )}
      </motion.div>

      {/* Right: features + optional chart */}
      <motion.div variants={motionConfig.child} className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {features.map((f, i) => (
            <div key={i} className="rounded-[14px] px-8 py-6 flex gap-6 items-baseline"
              style={cardStyle}>
              <span className="text-base font-semibold shrink-0 w-24" style={{ color: colors.accentNeutral }}>{f.label}</span>
              <span className="text-lg" style={{ color: colors.textPrimary }}>{f.value}</span>
            </div>
          ))}
        </div>
        {comparison && (
          <BarChart
            categories={comparison.map(c => c.name)}
            series={[{ name: 'Token (K)', data: comparison.map(c => c.value) }]}
            height={160}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
