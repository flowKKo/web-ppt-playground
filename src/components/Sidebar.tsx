import { useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import SlideContent from './SlideContent'
import AddSlidePanel from './editor/AddSlidePanel'

interface SidebarProps {
  slides: SlideData[]
  activeIndex: number
  onClickSlide: (index: number) => void
  editMode?: boolean
  onAddSlide?: (data: SlideData) => void
  originalCount?: number
}

const THUMB_W = 192 // thumbnail container width in px
const SLIDE_W = 960  // render width for slide content

export default function Sidebar({ slides, activeIndex, onClickSlide, editMode, onAddSlide, originalCount }: SidebarProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [showAddPanel, setShowAddPanel] = useState(false)
  const scale = THUMB_W / SLIDE_W

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const el = thumbRefs.current[activeIndex]
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex])

  return (
    <div
      className="fixed left-0 top-0 h-screen w-56 z-40 hidden xl:flex flex-col border-r overflow-y-auto"
      style={{ background: colors.card, borderColor: colors.border }}
    >
      <div className="flex flex-col gap-3 p-4">
        {slides.map((slide, i) => {
          const isActive = i === activeIndex
          const isAdded = originalCount != null && i >= originalCount
          return (
            <button
              key={i}
              ref={(el) => { thumbRefs.current[i] = el }}
              onClick={() => onClickSlide(i)}
              className="w-full text-left cursor-pointer group"
            >
              {/* Slide number + badge */}
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="text-xs font-medium"
                  style={{ color: isActive ? colors.accentNeutral : colors.textCaption }}
                >
                  {i + 1}
                </span>
                {isAdded && (
                  <span className="text-[9px] leading-none px-1 py-0.5 rounded bg-blue-500 text-white font-medium">
                    新增
                  </span>
                )}
              </div>

              {/* Thumbnail */}
              <div
                className="w-full aspect-video overflow-hidden rounded-md transition-all"
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
                      <SlideContent data={slide} />
                    </div>
                  </div>
                </MotionConfig>
              </div>
            </button>
          )
        })}

        {/* Add slide button */}
        {editMode && onAddSlide && (
          <div>
            <button
              onClick={() => setShowAddPanel((v) => !v)}
              className="w-full h-10 flex items-center justify-center rounded-md border-2 border-dashed cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50"
              style={{ borderColor: showAddPanel ? '#42A5F5' : colors.border }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={showAddPanel ? '#1565C0' : colors.textCaption} strokeWidth="2" strokeLinecap="round">
                <line x1="10" y1="4" x2="10" y2="16" />
                <line x1="4" y1="10" x2="16" y2="10" />
              </svg>
            </button>

            {showAddPanel && (
              <div
                className="mt-2 rounded-lg border"
                style={{ background: colors.card, borderColor: colors.border }}
              >
                <AddSlidePanel
                  onAdd={(data) => {
                    onAddSlide(data)
                    setShowAddPanel(false)
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
