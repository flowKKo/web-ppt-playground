import { useCallback, useRef, type ReactNode } from 'react'
import { useEditor } from './EditorProvider'
import ResizeHandles from './ResizeHandles'
import type { ContentBox } from '../../data/editor-types'
import { getResizeConstraint } from '../../data/editor-types'
import type { SlideData } from '../../data/types'

interface ContentBoxWrapperProps {
  slideIndex: number
  slideData: SlideData
  children: ReactNode
}

const DEFAULT_BOX: ContentBox = { x: 0, y: 0, width: 100, height: 100 }

export default function ContentBoxWrapper({ slideIndex, slideData, children }: ContentBoxWrapperProps) {
  const { editMode, selection, setSelection, getContentBox, setContentBox, setContentBoxQuiet, beginDrag } = useEditor()
  const box = getContentBox(slideIndex) ?? DEFAULT_BOX
  const isSelected = selection?.type === 'content-box' && selection.slideIndex === slideIndex
  const constraint = getResizeConstraint(slideData)
  const dragRef = useRef<{ startMouse: { x: number; y: number }; startBox: ContentBox; containerRect: DOMRect } | null>(null)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return
    e.stopPropagation()
    setSelection({ type: 'content-box', slideIndex })
  }, [editMode, setSelection, slideIndex])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current) return
    const { startMouse, startBox, containerRect } = dragRef.current
    const dx = ((e.clientX - startMouse.x) / containerRect.width) * 100
    const dy = ((e.clientY - startMouse.y) / containerRect.height) * 100
    setContentBoxQuiet(slideIndex, {
      ...startBox,
      x: startBox.x + dx,
      y: startBox.y + dy,
    })
  }, [slideIndex, setContentBoxQuiet])

  const handlePointerUp = useCallback((e: PointerEvent) => {
    dragRef.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (!editMode || !isSelected) return
    // Only drag on the wrapper itself, not child interactions
    if ((e.target as HTMLElement).closest('[data-resize-handle]')) return
    // Don't start drag when user interacts with editable text
    if ((e.target as HTMLElement).closest('[data-editable-text]')) return
    e.preventDefault()
    beginDrag()
    const container = (e.currentTarget as HTMLElement).parentElement!
    dragRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startBox: { ...box },
      containerRect: container.getBoundingClientRect(),
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }, [editMode, isSelected, box, beginDrag, handlePointerMove, handlePointerUp])

  const handleResize = useCallback((newBounds: { x: number; y: number; width: number; height: number }) => {
    setContentBoxQuiet(slideIndex, newBounds)
  }, [slideIndex, setContentBoxQuiet])

  if (!editMode) {
    // Non-edit: just render children in a full container (no overlays etc are separate)
    const hasCustomBox = getContentBox(slideIndex) !== undefined
    if (!hasCustomBox) {
      return <div className="w-full h-full flex flex-col justify-center">{children}</div>
    }
    // Even outside edit mode, apply custom box position
    return (
      <div className="absolute inset-0">
        <div
          className="absolute overflow-hidden flex flex-col justify-center"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
          }}
        >
          {children}
        </div>
      </div>
    )
  }

  // Edit mode
  return (
    <div className="absolute inset-0" style={{ zIndex: 10 }}>
      <div
        className="absolute overflow-hidden flex flex-col justify-center"
        style={{
          left: `${box.x}%`,
          top: `${box.y}%`,
          width: `${box.width}%`,
          height: `${box.height}%`,
          border: isSelected
            ? '2px dashed #42A5F5'
            : '1px dotted rgba(0,0,0,0.15)',
          cursor: isSelected ? 'move' : 'pointer',
          boxSizing: 'border-box',
        }}
        onClick={handleClick}
        onPointerDown={handleDragStart}
      >
        {children}
      </div>

      {isSelected && (
        <ResizeHandles
          constraint={constraint}
          bounds={box}
          onResize={handleResize}
          onResizeStart={beginDrag}
          color="#42A5F5"
        />
      )}
    </div>
  )
}
