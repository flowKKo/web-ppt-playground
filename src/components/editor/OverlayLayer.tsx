import { useCallback, useRef, useState } from 'react'
import { useEditor } from './EditorProvider'
import ResizeHandles from './ResizeHandles'
import type { OverlayElement, TextOverlay, RectOverlay, LineOverlay } from '../../data/editor-types'

interface OverlayLayerProps {
  slideIndex: number
  readOnly?: boolean
}

let overlayCounter = 0
function genId() {
  return `overlay-${Date.now()}-${++overlayCounter}`
}

export default function OverlayLayer({ slideIndex, readOnly = false }: OverlayLayerProps) {
  const {
    editMode, activeTool, selection, activeColor,
    setSelection, getOverlays, addOverlay, updateOverlay, removeOverlay,
  } = useEditor()

  const overlays = getOverlays(slideIndex)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const lineStartRef = useRef<{ x: number; y: number } | null>(null)
  const [linePreview, setLinePreview] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const toPercent = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 }
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }, [])

  // Create overlay on click in empty area
  const handleLayerClick = useCallback((e: React.MouseEvent) => {
    if (readOnly || !editMode) return
    // Don't create if clicking an overlay
    if ((e.target as HTMLElement).closest('[data-overlay-id]')) return

    const pos = toPercent(e.clientX, e.clientY)

    if (activeTool === 'text') {
      const overlay: TextOverlay = {
        type: 'text', id: genId(),
        x: pos.x - 10, y: pos.y - 3, width: 20, height: 6,
        text: '文本', fontSize: 24, color: activeColor,
        fontWeight: 600, textAlign: 'center',
      }
      addOverlay(slideIndex, overlay)
      setSelection({ type: 'overlay', slideIndex, id: overlay.id })
    } else if (activeTool === 'rect') {
      const overlay: RectOverlay = {
        type: 'rect', id: genId(),
        x: pos.x - 7.5, y: pos.y - 6, width: 15, height: 12,
        fill: 'transparent', stroke: activeColor, strokeWidth: 2, borderRadius: 4,
      }
      addOverlay(slideIndex, overlay)
      setSelection({ type: 'overlay', slideIndex, id: overlay.id })
    } else if (activeTool === 'select') {
      setSelection(null)
    }
  }, [readOnly, editMode, activeTool, activeColor, slideIndex, addOverlay, setSelection, toPercent])

  // Line drawing
  const handleLineDown = useCallback((e: React.PointerEvent) => {
    if (readOnly || !editMode || activeTool !== 'line') return
    if ((e.target as HTMLElement).closest('[data-overlay-id]')) return
    const pos = toPercent(e.clientX, e.clientY)
    lineStartRef.current = pos
    setLinePreview({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [readOnly, editMode, activeTool, toPercent])

  const handleLineMove = useCallback((e: React.PointerEvent) => {
    if (!lineStartRef.current) return
    const pos = toPercent(e.clientX, e.clientY)
    setLinePreview({ x1: lineStartRef.current.x, y1: lineStartRef.current.y, x2: pos.x, y2: pos.y })
  }, [toPercent])

  const handleLineUp = useCallback((e: React.PointerEvent) => {
    if (!lineStartRef.current) return
    const pos = toPercent(e.clientX, e.clientY)
    const start = lineStartRef.current
    lineStartRef.current = null
    setLinePreview(null)
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)

    // Only create if line has some length
    const dist = Math.hypot(pos.x - start.x, pos.y - start.y)
    if (dist < 1) return

    const overlay: LineOverlay = {
      type: 'line', id: genId(),
      x1: start.x, y1: start.y, x2: pos.x, y2: pos.y,
      stroke: activeColor, strokeWidth: 2,
    }
    addOverlay(slideIndex, overlay)
    setSelection({ type: 'overlay', slideIndex, id: overlay.id })
  }, [activeColor, slideIndex, addOverlay, setSelection, toPercent])

  // Keyboard delete
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!editMode || readOnly) return
    if ((e.key === 'Delete' || e.key === 'Backspace') && selection?.type === 'overlay' && selection.slideIndex === slideIndex) {
      // Don't delete if editing text
      if (editingTextId === selection.id) return
      e.preventDefault()
      removeOverlay(slideIndex, selection.id)
    }
  }, [editMode, readOnly, selection, slideIndex, removeOverlay, editingTextId])

  const isInteractive = editMode && !readOnly
  // When select tool is active, let clicks pass through to slide content (EditableText etc.)
  // Only capture events on the overlay layer itself when using a drawing tool (text/rect/line)
  const isDrawingTool = activeTool !== 'select'
  const layerPointerEvents = isInteractive && isDrawingTool ? 'auto' : 'none'

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        zIndex: 20,
        pointerEvents: layerPointerEvents,
      }}
      onClick={handleLayerClick}
      onPointerDown={handleLineDown}
      onPointerMove={handleLineMove}
      onPointerUp={handleLineUp}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {overlays.map((overlay) => (
        <OverlayItem
          key={overlay.id}
          overlay={overlay}
          slideIndex={slideIndex}
          isSelected={selection?.type === 'overlay' && selection.id === overlay.id}
          isEditing={editingTextId === overlay.id}
          onStartEditing={() => setEditingTextId(overlay.id)}
          onStopEditing={() => setEditingTextId(null)}
          interactive={isInteractive}
        />
      ))}

      {/* Line preview while drawing */}
      {linePreview && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
          <line
            x1={linePreview.x1} y1={linePreview.y1}
            x2={linePreview.x2} y2={linePreview.y2}
            stroke={activeColor} strokeWidth="0.3" strokeDasharray="0.5"
          />
        </svg>
      )}
    </div>
  )
}

// ─── Individual Overlay Item ───

interface OverlayItemProps {
  overlay: OverlayElement
  slideIndex: number
  isSelected: boolean
  isEditing: boolean
  onStartEditing: () => void
  onStopEditing: () => void
  interactive: boolean
}

function OverlayItem({ overlay, slideIndex, isSelected, isEditing, onStartEditing, onStopEditing, interactive }: OverlayItemProps) {
  const { setSelection, updateOverlay, updateOverlayQuiet, beginDrag } = useEditor()
  const dragRef = useRef<{ startMouse: { x: number; y: number }; startPos: { x: number; y: number }; containerRect: DOMRect } | null>(null)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!interactive) return
    e.stopPropagation()
    setSelection({ type: 'overlay', slideIndex, id: overlay.id })
  }, [interactive, setSelection, slideIndex, overlay.id])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!interactive || overlay.type !== 'text') return
    e.stopPropagation()
    onStartEditing()
  }, [interactive, overlay.type, onStartEditing])

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    if (!interactive || !isSelected || isEditing) return
    if ((e.target as HTMLElement).closest('[data-resize-handle]')) return
    e.stopPropagation()
    e.preventDefault()
    beginDrag()
    const container = (e.currentTarget as HTMLElement).closest('[data-overlay-layer]') ?? (e.currentTarget as HTMLElement).parentElement!
    const pos = overlay.type === 'line'
      ? { x: overlay.x1, y: overlay.y1 }
      : { x: overlay.x, y: overlay.y }
    dragRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: pos,
      containerRect: container.getBoundingClientRect(),
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [interactive, isSelected, isEditing, overlay, beginDrag])

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const { startMouse, startPos, containerRect } = dragRef.current
    const dx = ((e.clientX - startMouse.x) / containerRect.width) * 100
    const dy = ((e.clientY - startMouse.y) / containerRect.height) * 100

    if (overlay.type === 'line') {
      const origLine = overlay as LineOverlay
      const lineDx = origLine.x2 - origLine.x1
      const lineDy = origLine.y2 - origLine.y1
      updateOverlayQuiet(slideIndex, overlay.id, {
        x1: startPos.x + dx,
        y1: startPos.y + dy,
        x2: startPos.x + dx + lineDx,
        y2: startPos.y + dy + lineDy,
      })
    } else {
      updateOverlayQuiet(slideIndex, overlay.id, {
        x: startPos.x + dx,
        y: startPos.y + dy,
      })
    }
  }, [overlay, slideIndex, updateOverlayQuiet])

  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    dragRef.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  const handleTextBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    onStopEditing()
    updateOverlay(slideIndex, overlay.id, { text: e.currentTarget.textContent || '' })
  }, [onStopEditing, updateOverlay, slideIndex, overlay.id])

  const handleResize = useCallback((newBounds: { x: number; y: number; width: number; height: number }) => {
    updateOverlayQuiet(slideIndex, overlay.id, newBounds)
  }, [updateOverlayQuiet, slideIndex, overlay.id])

  if (overlay.type === 'line') {
    return (
      <div
        data-overlay-id={overlay.id}
        className="absolute inset-0"
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        onClick={handleClick}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Wider invisible stroke for easier clicking */}
          <line
            x1={overlay.x1} y1={overlay.y1} x2={overlay.x2} y2={overlay.y2}
            stroke="transparent" strokeWidth="1.5"
          />
          <line
            x1={overlay.x1} y1={overlay.y1} x2={overlay.x2} y2={overlay.y2}
            stroke={overlay.stroke} strokeWidth={overlay.strokeWidth * 0.15}
          />
        </svg>
        {isSelected && interactive && (
          <>
            <LineEndpoint
              x={overlay.x1} y={overlay.y1}
              onChange={(x, y) => updateOverlayQuiet(slideIndex, overlay.id, { x1: x, y1: y })}
              onDragStart={beginDrag}
              containerRef={null}
            />
            <LineEndpoint
              x={overlay.x2} y={overlay.y2}
              onChange={(x, y) => updateOverlayQuiet(slideIndex, overlay.id, { x2: x, y2: y })}
              onDragStart={beginDrag}
              containerRef={null}
            />
          </>
        )}
      </div>
    )
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${overlay.x}%`,
    top: `${overlay.y}%`,
    width: `${overlay.width}%`,
    height: `${overlay.height}%`,
    pointerEvents: interactive ? 'auto' : 'none',
    cursor: interactive ? (isSelected ? 'move' : 'pointer') : 'default',
  }

  if (overlay.type === 'rect') {
    return (
      <div
        data-overlay-id={overlay.id}
        style={{
          ...style,
          background: overlay.fill,
          border: `${overlay.strokeWidth}px solid ${overlay.stroke}`,
          borderRadius: overlay.borderRadius,
          outline: isSelected && interactive ? '1px solid #AB47BC' : undefined,
        }}
        onClick={handleClick}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
      >
        {isSelected && interactive && (
          <ResizeHandles
            constraint="free"
            bounds={{ x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height }}
            onResize={handleResize}
            onResizeStart={beginDrag}
            color="#AB47BC"
          />
        )}
      </div>
    )
  }

  // Text overlay
  const textOverlay = overlay as TextOverlay
  return (
    <div
      data-overlay-id={overlay.id}
      style={{
        ...style,
        outline: isSelected && interactive ? '1px solid #AB47BC' : undefined,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      <div
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleTextBlur}
        className="w-full h-full flex items-center outline-none"
        style={{
          fontSize: textOverlay.fontSize,
          color: textOverlay.color,
          fontWeight: textOverlay.fontWeight,
          textAlign: textOverlay.textAlign,
          justifyContent: textOverlay.textAlign === 'center' ? 'center' : textOverlay.textAlign === 'right' ? 'flex-end' : 'flex-start',
          cursor: isEditing ? 'text' : 'inherit',
          pointerEvents: isEditing ? 'auto' : 'inherit',
        }}
      >
        {textOverlay.text}
      </div>
      {isSelected && interactive && !isEditing && (
        <ResizeHandles
          constraint="free"
          bounds={{ x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height }}
          onResize={handleResize}
          color="#AB47BC"
        />
      )}
    </div>
  )
}

// ─── Line Endpoint Handle ───

function LineEndpoint({ x, y, onChange, onDragStart }: { x: number; y: number; onChange: (x: number, y: number) => void; onDragStart?: () => void; containerRef: unknown }) {
  const dragRef = useRef<{ startMouse: { x: number; y: number }; startPos: { x: number; y: number }; containerRect: DOMRect } | null>(null)

  const handleDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDragStart?.()
    const container = (e.currentTarget as HTMLElement).parentElement!
    dragRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: { x, y },
      containerRect: container.getBoundingClientRect(),
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [x, y, onDragStart])

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const { startMouse, startPos, containerRect } = dragRef.current
    const dx = ((e.clientX - startMouse.x) / containerRect.width) * 100
    const dy = ((e.clientY - startMouse.y) / containerRect.height) * 100
    onChange(startPos.x + dx, startPos.y + dy)
  }, [onChange])

  const handleUp = useCallback((e: React.PointerEvent) => {
    dragRef.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: 10,
        height: 10,
        transform: 'translate(-5px, -5px)',
        background: '#AB47BC',
        border: '1px solid white',
        borderRadius: '50%',
        cursor: 'crosshair',
        zIndex: 30,
      }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
    />
  )
}
