import { motion } from 'framer-motion'
import type { KeyPointSlideData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'

export default function KeyPointSlide({ title, subtitle, body }: KeyPointSlideData) {
  return (
    <motion.div className="flex flex-col items-center justify-center text-center gap-8 h-full"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.h2 variants={motionConfig.child}
        className="text-5xl font-bold leading-tight"
        style={{ color: colors.textPrimary }}>
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={motionConfig.child}
          className="text-3xl font-semibold" style={{ color: colors.accentNeutral }}>
          {subtitle}
        </motion.p>
      )}
      {body && (
        <motion.p variants={motionConfig.child}
          className="text-xl max-w-3xl leading-relaxed" style={{ color: colors.textSecondary }}>
          {body}
        </motion.p>
      )}
    </motion.div>
  )
}
