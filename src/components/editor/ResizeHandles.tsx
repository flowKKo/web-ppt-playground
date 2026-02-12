import { useCallback, useRef } from 'react'
import type { ResizeConstraint, HandlePosition } from '../../data/editor-types'
import { getHandlePositions } from '../../data/editor-types'

interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

interface ResizeHandlesProps {
  constraint: ResizeConstraint
  bounds: Bounds
  onResize: (newBounds: Bounds) => void
  onResizeStart?: () => void
  color?: string // handle color
}

const HANDLE_SIZE = 8
const MIN_SIZE = 10 // minimum 10% in either dimension

const handleCursors: Record<HandlePosition, string> = {
  'top-left': 'nwse-resize',
  'top': 'ns-resize',
  'top-right': 'nesw-resize',
  'right': 'ew-resize',
  'bottom-right': 'nwse-resize',
  'bottom': 'ns-resize',
  'bottom-left': 'nesw-resize',
  'left': 'ew-resize',
}

function getHandleStyle(pos: HandlePosition, bounds: Bounds): React.CSSProperties {
  const half = HANDLE_SIZE / 2
  const base: React.CSSProperties = {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    cursor: handleCursors[pos],
    zIndex: 30,
  }

  // Position handles at the edges of the bounds
  switch (pos) {
    case 'top-left':
      return { ...base, left: `${bounds.x}%`, top: `${bounds.y}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'top':
      return { ...base, left: `${bounds.x + bounds.width / 2}%`, top: `${bounds.y}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'top-right':
      return { ...base, left: `${bounds.x + bounds.width}%`, top: `${bounds.y}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'right':
      return { ...base, left: `${bounds.x + bounds.width}%`, top: `${bounds.y + bounds.height / 2}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'bottom-right':
      return { ...base, left: `${bounds.x + bounds.width}%`, top: `${bounds.y + bounds.height}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'bottom':
      return { ...base, left: `${bounds.x + bounds.width / 2}%`, top: `${bounds.y + bounds.height}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'bottom-left':
      return { ...base, left: `${bounds.x}%`, top: `${bounds.y + bounds.height}%`, transform: `translate(-${half}px, -${half}px)` }
    case 'left':
      return { ...base, left: `${bounds.x}%`, top: `${bounds.y + bounds.height / 2}%`, transform: `translate(-${half}px, -${half}px)` }
  }
}

export default function ResizeHandles({ constraint, bounds, onResize, onResizeStart, color = '#42A5F5' }: ResizeHandlesProps) {
  const positions = getHandlePositions(constraint)
  const startRef = useRef<{ pos: HandlePosition; startBounds: Bounds; startMouse: { x: number; y: number }; containerRect: DOMRect } | null>(null)

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!startRef.current) return
    const { pos, startBounds, startMouse, containerRect } = startRef.current

    // Convert pixel delta to percentage
    const dx = ((e.clientX - startMouse.x) / containerRect.width) * 100
    const dy = ((e.clientY - startMouse.y) / containerRect.height) * 100

    let newBounds = { ...startBounds }

    if (constraint === 'proportional') {
      // Proportional: use corner handles, maintain aspect ratio
      const aspect = startBounds.width / startBounds.height
      let dw = 0
      let dh = 0

      switch (pos) {
        case 'bottom-right':
          dw = dx; dh = dw / aspect
          newBounds = { x: startBounds.x, y: startBounds.y, width: startBounds.width + dw, height: startBounds.height + dh }
          break
        case 'bottom-left':
          dw = -dx; dh = dw / aspect
          newBounds = { x: startBounds.x - dw, y: startBounds.y, width: startBounds.width + dw, height: startBounds.height + dh }
          break
        case 'top-right':
          dw = dx; dh = dw / aspect
          newBounds = { x: startBounds.x, y: startBounds.y - dh, width: startBounds.width + dw, height: startBounds.height + dh }
          break
        case 'top-left':
          dw = -dx; dh = dw / aspect
          newBounds = { x: startBounds.x - dw, y: startBounds.y - dh, width: startBounds.width + dw, height: startBounds.height + dh }
          break
      }
    } else {
      // Free: 8 handles
      switch (pos) {
        case 'top-left':
          newBounds = { x: startBounds.x + dx, y: startBounds.y + dy, width: startBounds.width - dx, height: startBounds.height - dy }
          break
        case 'top':
          newBounds = { ...startBounds, y: startBounds.y + dy, height: startBounds.height - dy }
          break
        case 'top-right':
          newBounds = { x: startBounds.x, y: startBounds.y + dy, width: startBounds.width + dx, height: startBounds.height - dy }
          break
        case 'right':
          newBounds = { ...startBounds, width: startBounds.width + dx }
          break
        case 'bottom-right':
          newBounds = { ...startBounds, width: startBounds.width + dx, height: startBounds.height + dy }
          break
        case 'bottom':
          newBounds = { ...startBounds, height: startBounds.height + dy }
          break
        case 'bottom-left':
          newBounds = { x: startBounds.x + dx, y: startBounds.y, width: startBounds.width - dx, height: startBounds.height + dy }
          break
        case 'left':
          newBounds = { ...startBounds, x: startBounds.x + dx, width: startBounds.width - dx }
          break
      }
    }

    // Enforce minimum size
    if (newBounds.width < MIN_SIZE) {
      newBounds.width = MIN_SIZE
      if (pos.includes('left')) newBounds.x = startBounds.x + startBounds.width - MIN_SIZE
    }
    if (newBounds.height < MIN_SIZE) {
      newBounds.height = MIN_SIZE
      if (pos.includes('top')) newBounds.y = startBounds.y + startBounds.height - MIN_SIZE
    }

    onResize(newBounds)
  }, [constraint, onResize])

  const handlePointerUp = useCallback((e: PointerEvent) => {
    startRef.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  const handlePointerDown = useCallback((pos: HandlePosition, e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onResizeStart?.()
    const container = (e.currentTarget as HTMLElement).parentElement!
    startRef.current = {
      pos,
      startBounds: { ...bounds },
      startMouse: { x: e.clientX, y: e.clientY },
      containerRect: container.getBoundingClientRect(),
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }, [bounds, onResizeStart, handlePointerMove, handlePointerUp])

  return (
    <>
      {positions.map((pos) => (
        <div
          key={pos}
          style={{
            ...getHandleStyle(pos, bounds),
            background: color,
            border: '1px solid white',
            borderRadius: pos === 'top' || pos === 'right' || pos === 'bottom' || pos === 'left' ? 1 : 2,
          }}
          onPointerDown={(e) => handlePointerDown(pos, e)}
        />
      ))}
    </>
  )
}
