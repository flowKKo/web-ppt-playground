import { useRef, useState, useCallback, type CSSProperties, type KeyboardEvent } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useInlineEdit } from './InlineEditContext'

type ElementTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

interface EditableTextProps {
  value: string
  field: string
  as?: ElementTag
  className?: string
  style?: CSSProperties
  variants?: Variants
  singleLine?: boolean
}

const MotionMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const

export default function EditableText({
  value,
  field,
  as = 'div',
  className = '',
  style,
  variants,
  singleLine = true,
}: EditableTextProps) {
  const ctx = useInlineEdit()
  const ref = useRef<HTMLElement>(null)
  const [editing, setEditing] = useState(false)
  const originalRef = useRef(value)
  const Comp = MotionMap[as]

  const canEdit = ctx?.editMode ?? false

  const handleDoubleClick = useCallback(() => {
    if (!canEdit || !ref.current) return
    originalRef.current = value
    setEditing(true)
    // Focus after React re-renders with contentEditable
    requestAnimationFrame(() => {
      ref.current?.focus()
      // Select all text
      const sel = window.getSelection()
      const range = document.createRange()
      if (ref.current && sel) {
        range.selectNodeContents(ref.current)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    })
  }, [canEdit, value])

  const commit = useCallback(() => {
    if (!ref.current || !ctx) return
    const newValue = ref.current.textContent?.trim() ?? ''
    setEditing(false)
    if (newValue && newValue !== originalRef.current) {
      ctx.updateField(field, newValue)
    } else {
      // Restore original text if empty or unchanged
      ref.current.textContent = originalRef.current
    }
  }, [ctx, field])

  const handleBlur = useCallback(() => {
    commit()
  }, [commit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (ref.current) ref.current.textContent = originalRef.current
        setEditing(false)
        ref.current?.blur()
      } else if (e.key === 'Enter' && singleLine) {
        e.preventDefault()
        commit()
        ref.current?.blur()
      }
    },
    [singleLine, commit],
  )

  // Build edit-mode styles
  const editStyles: CSSProperties = canEdit
    ? {
        cursor: editing ? 'text' : 'default',
        borderBottom: editing ? 'none' : undefined,
        outline: 'none',
        borderRadius: 2,
        backgroundColor: editing ? 'rgba(59,130,246,0.08)' : undefined,
        transition: 'background-color 0.15s',
      }
    : {}

  const hoverClass = canEdit && !editing ? 'editable-hover' : ''

  return (
    <Comp
      ref={ref as React.Ref<HTMLElement> & React.Ref<HTMLHeadingElement> & React.Ref<HTMLParagraphElement> & React.Ref<HTMLSpanElement> & React.Ref<HTMLDivElement>}
      data-editable-text=""
      className={`${className} ${hoverClass}`}
      style={{ ...style, ...editStyles }}
      variants={variants}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={editing ? handleKeyDown : undefined}
      onPointerDown={canEdit ? (e: React.PointerEvent) => e.stopPropagation() : undefined}
    >
      {value}
    </Comp>
  )
}
