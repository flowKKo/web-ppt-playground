import { motion } from 'framer-motion'
import type { GridSlideData } from '../../data/types'
import { colors, cardStyle, motionConfig } from '../../theme/swiss'

export default function GridSlide({ title, items }: GridSlideData) {
  const cols = items.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
  return (
    <motion.div className="flex flex-col gap-8 h-full justify-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.h2 variants={motionConfig.child}
        className="text-5xl font-bold" style={{ color: colors.textPrimary }}>
        {title}
      </motion.h2>
      <motion.div variants={motionConfig.child} className={`grid ${cols} gap-6`}>
        {items.map((item) => (
          <div key={item.number} className="rounded-[14px] px-8 py-6 flex gap-6 items-start"
            style={cardStyle}>
            <span className="text-2xl font-extrabold shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
              style={{ color: colors.accentNeutral, background: 'rgba(84,110,122,0.08)' }}>
              {item.number}
            </span>
            <div>
              <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{item.title}</h3>
              <p className="text-base mt-1" style={{ color: colors.textSecondary }}>{item.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
