import { motion } from 'framer-motion'
import type { DataComparisonSlideData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'

const colorMap = {
  positive: colors.accentPositive,
  negative: colors.accentNegative,
  neutral: colors.accentNeutral,
}

export default function DataComparisonSlide({ title, body, items, conclusion }: DataComparisonSlideData) {
  return (
    <motion.div className="flex flex-col gap-8 h-full justify-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div>
        <motion.h2 variants={motionConfig.child}
          className="text-5xl font-bold leading-tight" style={{ color: colors.textPrimary }}>
          {title}
        </motion.h2>
        {body && (
          <motion.p variants={motionConfig.child}
            className="text-xl mt-3" style={{ color: colors.textSecondary }}>
            {body}
          </motion.p>
        )}
      </div>
      <motion.div variants={motionConfig.child} className="flex gap-6 items-end justify-center py-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-7xl font-extrabold"
              style={{ color: item.color ? colorMap[item.color] : colors.textPrimary }}>
              {item.value}
            </span>
            <span className="text-lg" style={{ color: colors.textSecondary }}>{item.label}</span>
          </div>
        ))}
      </motion.div>
      {conclusion && (
        <motion.p variants={motionConfig.child}
          className="text-xl font-semibold text-center" style={{ color: colors.textPrimary }}>
          {conclusion}
        </motion.p>
      )}
    </motion.div>
  )
}
