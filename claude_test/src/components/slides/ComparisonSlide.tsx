import { motion } from 'framer-motion'
import type { ComparisonSlideData } from '../../data/types'
import { colors, cardStyle, motionConfig } from '../../theme/swiss'

export default function ComparisonSlide({ title, body, columns }: ComparisonSlideData) {
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
      <motion.div variants={motionConfig.child}
        className={`grid gap-6 flex-1 ${columns.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {columns.map((col, i) => (
          <div key={i} className="rounded-[14px] px-8 py-6 flex flex-col gap-4"
            style={cardStyle}>
            <h3 className="text-xl font-semibold" style={{ color: colors.accentNeutral }}>{col.name}</h3>
            <div className="flex flex-col gap-4">
              {col.items.map((item, j) => (
                <div key={j}>
                  <span className="text-base font-medium" style={{ color: colors.textCaption }}>{item.label}</span>
                  <p className="text-lg whitespace-pre-line" style={{ color: colors.textPrimary }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
