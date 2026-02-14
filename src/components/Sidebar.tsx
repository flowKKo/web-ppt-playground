import { useEffect, useRef, useState, useCallback } from 'react'
import { MotionConfig } from 'framer-motion'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import SlideContent from './SlideContent'

interface SidebarProps {
  slides: SlideData[]
  activeIndex: number
  onClickSlide: (index: number) => void
  editMode?: boolean
  onInsertBlankSlide?: (position: number) => void
  onDeleteSlide?: (position: number) => void
  onCopySlide?: (position: number) => void
  onPasteSlide?: (afterPosition: number) => void
  onDuplicateSlide?: (position: number) => void
  onReorderSlide?: (fromIndex: number, toIndex: number) => void
  hasClipboard?: boolean
  width: number
  onResize: (width: number) => void
}

const SLIDE_W = 1920
const SIDEBAR_MIN = 200
const SIDEBAR_MAX = 400

interface ContextMenuState {
  x: number
  y: number
  slideIndex: number
  gapPosition?: number
}

function ContextMenuItem({ label, onClick, danger, disabled }: {
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full text-left px-3 py-1.5 text-xs cursor-pointer transition-colors ${
        disabled
          ? 'text-gray-300 cursor-default'
          : danger
            ? 'text-red-500 hover:bg-red-50'
            : 'text-gray-700 hover:bg-black/5'
      }`}
    >
      {label}
    </button>
  )
}

export default function Sidebar({
  slides, activeIndex, onClickSlide, editMode,
  onInsertBlankSlide, onDeleteSlide, onCopySlide, onPasteSlide, onDuplicateSlide,
  onReorderSlide, hasClipboard, width, onResize,
}: SidebarProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Callback ref: adjust context menu position to stay within viewport
  const menuCallbackRef = useCallback((el: HTMLDivElement | null) => {
    menuRef.current = el
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const vw = window.innerWidth
    if (rect.bottom > vh) {
      el.style.top = `${Math.max(8, vh - rect.height - 8)}px`
    }
    if (rect.right > vw) {
      el.style.left = `${Math.max(8, vw - rect.width - 8)}px`
    }
  }, [])
  // pl-2(8) + pr-5(20) + w-4(16) + gap-3(12) = 56px padding/chrome
  const thumbW = width - 56
  const scale = thumbW / SLIDE_W

  // ─── Resize handle ───
  const resizeRef = useRef<{ startX: number; startW: number } | null>(null)

  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    resizeRef.current = { startX: e.clientX, startW: width }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [width])

  const handleResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return
    const newW = resizeRef.current.startW + (e.clientX - resizeRef.current.startX)
    onResize(Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, newW)))
  }, [onResize])

  const handleResizeEnd = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return
    resizeRef.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  // Insertion cursor — position between slides where a new slide would go
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null)

  // Drag state — refs for reliable reads in handleDragEnd, state for rendering indicators
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const dragIndexRef = useRef<number | null>(null)
  const dropTargetRef = useRef<number | null>(null)

  // Clear insertion cursor when activeIndex changes (e.g. keyboard/wheel nav)
  useEffect(() => {
    setInsertionIndex(null)
  }, [activeIndex])

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const el = thumbRefs.current[activeIndex]
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex])

  // Close context menu on click outside or Escape
  useEffect(() => {
    if (!contextMenu) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [contextMenu])

  // Slide context menu (right-click on a slide)
  const handleSlideContextMenu = useCallback((e: React.MouseEvent, slideIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    setInsertionIndex(null)
    setContextMenu({ x: e.clientX, y: e.clientY, slideIndex })
  }, [])

  // Gap context menu (right-click on blank area)
  const handleGapContextMenu = useCallback((e: React.MouseEvent, position: number) => {
    e.preventDefault()
    e.stopPropagation()
    setInsertionIndex(position)
    setContextMenu({ x: e.clientX, y: e.clientY, slideIndex: -1, gapPosition: position })
  }, [])

  const closeMenu = useCallback(() => setContextMenu(null), [])

  // Click on a slide — clear insertion cursor, select slide
  const handleSlideClick = useCallback((index: number) => {
    setInsertionIndex(null)
    onClickSlide(index)
  }, [onClickSlide])

  // Click on a gap — set insertion cursor, deselect slide
  const handleGapClick = useCallback((position: number) => {
    setInsertionIndex(position)
  }, [])

  // ─── Drag handlers ───
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragIndexRef.current = index
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    const el = e.currentTarget as HTMLElement
    requestAnimationFrame(() => el.style.opacity = '0.5')
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1'
    const from = dragIndexRef.current
    const to = dropTargetRef.current
    if (from !== null && to !== null && from !== to && onReorderSlide) {
      onReorderSlide(from, to)
    }
    dragIndexRef.current = null
    dropTargetRef.current = null
    setDragIndex(null)
    setDropTarget(null)
  }, [onReorderSlide])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    dropTargetRef.current = index
    setDropTarget(index)
  }, [])

  const isGapMenu = contextMenu !== null && contextMenu.gapPosition !== undefined

  return (
    <div
      className="fixed left-0 top-0 h-screen z-40 hidden xl:flex flex-col border-r overflow-y-auto sidebar-scroll"
      style={{ width, background: colors.card, borderColor: colors.border }}
    >
      {/* Resize handle */}
      <div
        className="fixed top-0 h-screen w-1 cursor-col-resize z-50 hover:bg-gray-400/30 active:bg-gray-400/50 transition-colors"
        style={{ left: width - 2 }}
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
      />
      <div className="flex flex-col pt-2 pl-2 pr-5">
        {slides.map((slide, i) => {
          const isHighlighted = i === activeIndex && insertionIndex === null
          const isDragOver = dropTarget === i && dragIndex !== null && dragIndex !== i
          return (
            <div key={i}>
              {/* Gap zone before this slide */}
              <div
                className="h-4 flex items-center pl-7 group/gap cursor-pointer"
                onClick={() => handleGapClick(i)}
                onContextMenu={(e) => handleGapContextMenu(e, i)}
              >
                <div
                  className={`w-full h-0.5 rounded-full transition-colors ${
                    insertionIndex === i
                      ? 'bg-[#78909C]'
                      : 'bg-transparent group-hover/gap:bg-gray-300'
                  }`}
                />
              </div>

              {/* Slide item */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, i)}
                className={`relative ${isDragOver ? 'pt-1' : ''}`}
              >
                {isDragOver && dragIndex !== null && i < dragIndex && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded bg-blue-500" />
                )}

                <button
                  ref={(el) => { thumbRefs.current[i] = el }}
                  onClick={() => handleSlideClick(i)}
                  onContextMenu={(e) => handleSlideContextMenu(e, i)}
                  className="w-full text-left cursor-pointer group relative"
                  style={{ scrollMargin: '48px 0' }}
                >
                  <div className="flex items-start gap-3">
                    {/* Slide number */}
                    <span
                      className="text-xs w-4 text-right shrink-0 select-none pt-0.5"
                      style={{ color: '#90A4AE' }}
                    >
                      {i + 1}
                    </span>

                    {/* Thumbnail */}
                    <div
                      className="flex-1 aspect-video overflow-hidden rounded transition-all relative"
                      style={{
                        border: isHighlighted
                          ? '1.5px solid #90A4AE'
                          : `1px solid ${colors.border}`,
                      }}
                    >
                      <MotionConfig reducedMotion="always">
                        <div
                          className="pointer-events-none origin-top-left"
                          style={{
                            width: SLIDE_W,
                            height: SLIDE_W * 9 / 16,
                            transform: `scale(${scale})`,
                            background: colors.slide,
                          }}
                        >
                          <div className="w-full h-full px-40 py-32 flex flex-col justify-center">
                            <SlideContent data={slide} slideIndex={i} />
                          </div>
                        </div>
                      </MotionConfig>
                    </div>
                  </div>
                </button>

                {isDragOver && dragIndex !== null && i > dragIndex && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded bg-blue-500" />
                )}
              </div>
            </div>
          )
        })}

        {/* Gap zone after last slide — same h-4 as inter-slide gaps */}
        <div
          className="h-4 flex items-center pl-7 group/gap cursor-pointer"
          onClick={() => handleGapClick(slides.length)}
          onContextMenu={(e) => handleGapContextMenu(e, slides.length)}
        >
          <div
            className={`w-full h-0.5 rounded-full transition-colors ${
              insertionIndex === slides.length
                ? 'bg-[#78909C]'
                : 'bg-transparent group-hover/gap:bg-gray-300'
            }`}
          />
        </div>

      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={menuCallbackRef}
          className="fixed z-[100] py-1 rounded-lg border shadow-lg min-w-[140px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: colors.card,
            borderColor: colors.border,
          }}
        >
          {isGapMenu ? (
            /* Gap menu — insert + paste */
            <>
              {onInsertBlankSlide && (
                <ContextMenuItem
                  label="在此插入新页面"
                  onClick={() => { onInsertBlankSlide(contextMenu.gapPosition!); closeMenu() }}
                />
              )}
              {onPasteSlide && (
                <ContextMenuItem
                  label="粘贴"
                  onClick={() => { onPasteSlide(contextMenu.gapPosition! - 1); closeMenu() }}
                  disabled={!hasClipboard}
                />
              )}
            </>
          ) : (
            /* Slide menu — full actions */
            <>
              {onCopySlide && (
                <ContextMenuItem
                  label="复制"
                  onClick={() => { onCopySlide(contextMenu.slideIndex); closeMenu() }}
                />
              )}
              {onDuplicateSlide && (
                <ContextMenuItem
                  label="复制为新页"
                  onClick={() => { onDuplicateSlide(contextMenu.slideIndex); closeMenu() }}
                />
              )}
              <div className="my-1 border-t" style={{ borderColor: colors.border }} />
              {onInsertBlankSlide && (
                <ContextMenuItem
                  label="在此前插入"
                  onClick={() => { onInsertBlankSlide(contextMenu.slideIndex); closeMenu() }}
                />
              )}
              {onInsertBlankSlide && (
                <ContextMenuItem
                  label="在此后插入"
                  onClick={() => { onInsertBlankSlide(contextMenu.slideIndex + 1); closeMenu() }}
                />
              )}
              <div className="my-1 border-t" style={{ borderColor: colors.border }} />
              {onDeleteSlide && (
                <ContextMenuItem
                  label="删除"
                  onClick={() => { onDeleteSlide(contextMenu.slideIndex); closeMenu() }}
                  danger
                  disabled={slides.length <= 1}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
