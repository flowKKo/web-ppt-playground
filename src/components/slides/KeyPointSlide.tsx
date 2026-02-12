import { motion } from 'framer-motion'
import type { KeyPointSlideData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'
import EditableText from '../editor/EditableText'

export default function KeyPointSlide({ title, subtitle, body }: KeyPointSlideData) {
  return (
    <motion.div className="flex flex-col items-center justify-center text-center gap-8 h-full"
      variants={motionConfig.stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <EditableText
        value={title}
        field="title"
        as="h2"
        className="text-5xl font-bold leading-tight"
        style={{ color: colors.textPrimary }}
        variants={motionConfig.child}
      />
      {subtitle && (
        <EditableText
          value={subtitle}
          field="subtitle"
          as="p"
          className="text-3xl font-semibold"
          style={{ color: colors.accentNeutral }}
          variants={motionConfig.child}
        />
      )}
      {body && (
        <EditableText
          value={body}
          field="body"
          as="p"
          className="text-xl max-w-3xl leading-relaxed"
          style={{ color: colors.textSecondary }}
          variants={motionConfig.child}
          singleLine={false}
        />
      )}
    </motion.div>
  )
}
