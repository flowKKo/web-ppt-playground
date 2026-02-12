import { motion } from 'framer-motion'
import type { ListSlideData } from '../../data/types'
import { colors, cardStyle, motionConfig } from '../../theme/swiss'

export default function ListSlide({ title, items }: ListSlideData) {
  return (
    <motion.div className="flex flex-col gap-8 h-full justify-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.h2 variants={motionConfig.child}
        className="text-5xl font-bold" style={{ color: colors.textPrimary }}>
        {title}
      </motion.h2>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <motion.div key={i} variants={motionConfig.child}
            className="flex gap-6 items-start rounded-[14px] px-8 py-6"
            style={cardStyle}>
            <span className="text-2xl font-extrabold shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
              style={{ color: colors.accentNeutral, background: 'rgba(84,110,122,0.08)' }}>
              {i + 1}
            </span>
            <p className="text-xl leading-relaxed" style={{ color: colors.textPrimary }}>{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
