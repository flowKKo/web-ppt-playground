import { colors, motionConfig } from '../../../theme/swiss'
import EditableText from '../../editor/EditableText'

interface EngineTitleProps {
  title: string
  body?: string
}

export default function EngineTitle({ title, body }: EngineTitleProps) {
  return (
    <div>
      <EditableText
        value={title}
        field="title"
        as="h2"
        className="text-4xl font-bold"
        style={{ color: colors.textPrimary }}
        variants={motionConfig.child}
      />
      {body && (
        <EditableText
          value={body}
          field="body"
          as="p"
          className="text-lg mt-2"
          style={{ color: colors.textSecondary }}
          variants={motionConfig.child}
        />
      )}
    </div>
  )
}
