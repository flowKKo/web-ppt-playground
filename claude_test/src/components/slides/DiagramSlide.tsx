import { motion } from 'framer-motion'
import type { DiagramSlideData } from '../../data/types'
import { colors, cardStyle, motionConfig } from '../../theme/swiss'

export default function DiagramSlide({ title, body, steps, sideNote }: DiagramSlideData) {
  return (
    <motion.div className="flex flex-col gap-8 h-full justify-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
      <motion.div variants={motionConfig.child} className="flex items-center gap-6 justify-center py-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="rounded-[14px] px-8 py-6 text-center min-w-[160px]"
              style={cardStyle}>
              <h3 className="text-xl font-semibold" style={{ color: colors.accentNeutral }}>{step.label}</h3>
              <p className="text-base mt-1" style={{ color: colors.textSecondary }}>{step.description}</p>
            </div>
            {i < steps.length - 1 && (
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                <path d="M0 10h24M20 4l8 6-8 6" stroke={colors.textCaption} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </motion.div>
      {sideNote && (
        <motion.p variants={motionConfig.child}
          className="text-base whitespace-pre-line px-8 py-6 rounded-[14px]"
          style={{ color: colors.textSecondary, background: 'rgba(0,0,0,0.03)' }}>
          {sideNote}
        </motion.p>
      )}
    </motion.div>
  )
}
