import { motion } from 'framer-motion'
import type { PlaceholderSlideData } from '../../data/types'
import { colors, cardStyle, motionConfig } from '../../theme/swiss'

export default function PlaceholderSlide({ title, body, placeholderLabel, metric, caption, cards }: PlaceholderSlideData) {
  return (
    <motion.div className="flex flex-col gap-8 h-full justify-center"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.h2 variants={motionConfig.child}
        className="text-5xl font-bold" style={{ color: colors.textPrimary }}>
        {title}
      </motion.h2>
      {body && (
        <motion.p variants={motionConfig.child}
          className="text-xl" style={{ color: colors.textSecondary }}>
          {body}
        </motion.p>
      )}
      <motion.div variants={motionConfig.child} className="flex gap-6 flex-1 min-h-0 items-stretch">
        <div className="flex-[3] border-[1.5px] border-dashed rounded-[14px] flex items-center justify-center text-lg"
          style={{ borderColor: 'rgba(0,0,0,0.15)', background: 'rgba(0,0,0,0.02)', color: colors.textCaption }}>
          {placeholderLabel}
        </div>
        {(metric || cards) && (
          <div className="flex-[1] flex flex-col gap-4 justify-center">
            {metric && (
              <div className="text-center">
                <span className="text-7xl font-extrabold block" style={{ color: colors.accentNeutral }}>{metric.value}</span>
                <span className="text-lg mt-1 block" style={{ color: colors.textSecondary }}>{metric.label}</span>
              </div>
            )}
            {cards?.map((card, i) => (
              <div key={i} className="rounded-[14px] px-5 py-4"
                style={cardStyle}>
                <span className="text-base" style={{ color: colors.textCaption }}>{card.label}</span>
                <p className="text-lg font-medium" style={{ color: colors.textPrimary }}>{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      {caption && (
        <motion.p variants={motionConfig.child}
          className="text-base" style={{ color: colors.textCaption }}>
          {caption}
        </motion.p>
      )}
    </motion.div>
  )
}
