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
  onBack?: () => void
}

const THUMB_W = 192
const SLIDE_W = 960

interface ContextMenuState {
  x: number
  y: number
  slideIndex: number
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
  onReorderSlide, hasClipboard, onBack,
}: SidebarProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const scale = THUMB_W / SLIDE_W

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const el = thumbRefs.current[activeIndex]
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'instant' })
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

  const handleContextMenu = useCallback((e: React.MouseEvent, slideIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, slideIndex })
  }, [])

  const closeMenu = useCallback(() => setContextMenu(null), [])

  // ─── Drag handlers ───
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    // Make the drag image slightly transparent
    const el = e.currentTarget as HTMLElement
    requestAnimationFrame(() => el.style.opacity = '0.5')
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1'
    if (dragIndex !== null && dropTarget !== null && dragIndex !== dropTarget && onReorderSlide) {
      onReorderSlide(dragIndex, dropTarget)
    }
    setDragIndex(null)
    setDropTarget(null)
  }, [dragIndex, dropTarget, onReorderSlide])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDropTarget(null)
  }, [])

  return (
    <div
      className="fixed left-0 top-0 h-screen w-56 z-40 hidden xl:flex flex-col border-r overflow-y-auto"
      style={{ background: colors.card, borderColor: colors.border }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-black/5 border-b shrink-0"
          style={{ color: colors.textSecondary, borderColor: colors.border }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2L4 8l6 6" />
          </svg>
          返回
        </button>
      )}
      <div className="flex flex-col gap-3 p-4">
        {slides.map((slide, i) => {
          const isActive = i === activeIndex
          const isDragOver = dropTarget === i && dragIndex !== null && dragIndex !== i
          return (
            <div
              key={i}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              className={`relative ${isDragOver ? 'pt-1' : ''}`}
            >
              {/* Drop indicator line */}
              {isDragOver && dragIndex !== null && i < dragIndex && (
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded bg-blue-500" />
              )}

              <button
                ref={(el) => { thumbRefs.current[i] = el }}
                onClick={() => onClickSlide(i)}
                onContextMenu={(e) => handleContextMenu(e, i)}
                className="w-full text-left cursor-pointer group relative"
              >
                {/* Slide number */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-xs font-medium"
                    style={{ color: isActive ? colors.accentNeutral : colors.textCaption }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Thumbnail */}
                <div
                  className="w-full aspect-video overflow-hidden rounded-md transition-all relative"
                  style={{
                    border: isActive
                      ? `2px solid ${colors.accentNeutral}`
                      : `1px solid ${colors.border}`,
                    boxShadow: isActive ? `0 0 0 2px ${colors.accentNeutral}33` : 'none',
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
                      <div className="w-full h-full px-20 py-16 flex flex-col justify-center">
                        <SlideContent data={slide} slideIndex={i} />
                      </div>
                    </div>
                  </MotionConfig>
                </div>
              </button>

              {/* Drop indicator line (below) */}
              {isDragOver && dragIndex !== null && i > dragIndex && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded bg-blue-500" />
              )}
            </div>
          )
        })}

        {/* Add slide button */}
        {onInsertBlankSlide && (
          <button
            onClick={() => onInsertBlankSlide(slides.length)}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50/60"
            style={{ borderColor: colors.border }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={colors.textCaption} strokeWidth="2" strokeLinecap="round">
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
            <span
              className="text-xs font-medium"
              style={{ color: colors.textCaption }}
            >
              添加页面
            </span>
          </button>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-[100] py-1 rounded-lg border shadow-lg min-w-[140px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            background: colors.card,
            borderColor: colors.border,
          }}
        >
          {onCopySlide && (
            <ContextMenuItem
              label="复制"
              onClick={() => { onCopySlide(contextMenu.slideIndex); closeMenu() }}
            />
          )}
          {onPasteSlide && (
            <ContextMenuItem
              label="粘贴到此后"
              onClick={() => { onPasteSlide(contextMenu.slideIndex); closeMenu() }}
              disabled={!hasClipboard}
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
        </div>
      )}
    </div>
  )
}
