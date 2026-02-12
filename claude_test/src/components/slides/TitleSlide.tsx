import { motion } from 'framer-motion'
import type { TitleSlideData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'

export default function TitleSlide({ title, subtitle, badge }: TitleSlideData) {
  return (
    <motion.div className="flex flex-col items-center justify-center text-center gap-8 h-full"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {badge && (
        <motion.span variants={motionConfig.child}
          className="text-base font-medium px-4 py-1.5 rounded-full"
          style={{ color: colors.textSecondary, background: 'rgba(0,0,0,0.04)' }}>
          {badge}
        </motion.span>
      )}
      <motion.h1 variants={motionConfig.child}
        className="text-6xl font-bold leading-tight"
        style={{ color: colors.textPrimary }}>
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p variants={motionConfig.child}
          className="text-2xl font-medium"
          style={{ color: colors.textSecondary }}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
