import { useRef, useCallback, useMemo, useState } from 'react'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import Slide from './Slide'
import SlideContent from './SlideContent'
import Sidebar from './Sidebar'
import FullscreenOverlay from './FullscreenOverlay'
import { useActiveSlideIndex } from '../hooks/useActiveSlideIndex'
import { useFullscreen } from '../hooks/useFullscreen'
import { EditorProvider, useEditor } from './editor/EditorProvider'
import { InlineEditProvider } from './editor/InlineEditContext'
import EditorToolbar from './editor/EditorToolbar'
import PropertyPanel from './editor/PropertyPanel'

interface SlideDeckProps {
  slides: SlideData[]
  onBack?: () => void
  deckId: string
}

export default function SlideDeck({ slides, onBack, deckId }: SlideDeckProps) {
  return (
    <EditorProvider deckId={deckId}>
      <SlideDeckInner slides={slides} onBack={onBack} />
    </EditorProvider>
  )
}

function SlideDeckInner({ slides, onBack }: { slides: SlideData[]; onBack?: () => void }) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const { editMode, toggleEditMode, getEffectiveSlideData, addedSlides, addSlide, removeAddedSlide, setSelection } = useEditor()

  const allSlides = useMemo(
    () => [...slides, ...addedSlides],
    [slides, addedSlides],
  )

  const [spotlight, setSpotlight] = useState(false)
  const activeIndex = useActiveSlideIndex(slideRefs, allSlides.length)
  const fullscreen = useFullscreen(allSlides.length)

  const effectiveSlides = useMemo(
    () => allSlides.map((s, i) => getEffectiveSlideData(i, s)),
    [allSlides, getEffectiveSlideData],
  )

  const scrollToSlide = useCallback((index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (editMode) {
      setSelection({ type: 'content-box', slideIndex: index })
    }
  }, [editMode, setSelection])

  const handleEnterFullscreen = useCallback(() => {
    // Exit edit mode when entering fullscreen
    if (editMode) toggleEditMode()
    fullscreen.enter(activeIndex)
  }, [fullscreen, activeIndex, editMode, toggleEditMode])

  const handleExitFullscreen = useCallback(() => {
    const idx = fullscreen.currentIndex
    fullscreen.exit()
    if (idx !== null) {
      requestAnimationFrame(() => {
        slideRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  }, [fullscreen])

  return (
    <div className="flex min-h-screen" style={{ background: colors.page }}>
      {/* Sidebar */}
      <Sidebar
        slides={effectiveSlides}
        activeIndex={activeIndex}
        onClickSlide={scrollToSlide}
        editMode={editMode}
        onAddSlide={addSlide}
        onDeleteSlide={removeAddedSlide}
        originalCount={slides.length}
        onBack={onBack}
      />

      {/* Main content */}
      <div
        className="flex-1 xl:ml-56 flex flex-col items-center gap-10 py-10 relative transition-all"
        style={{ marginRight: editMode ? 320 : 0 }}
        onClick={(e) => {
          if (!editMode) return
          // Only deselect when clicking directly on the scroll container (gaps between slides)
          if (e.target === e.currentTarget) setSelection(null)
        }}
      >
        {allSlides.map((slide, i) => (
          <Slide
            key={i}
            ref={(el) => { slideRefs.current[i] = el }}
            number={i + 1}
            slideIndex={i}
            slideData={effectiveSlides[i]}
          >
            <InlineEditProvider slideIndex={i} originalData={slide}>
              <SlideContent data={effectiveSlides[i]} slideIndex={i} />
            </InlineEditProvider>
          </Slide>
        ))}
      </div>

      {/* Editor toolbar */}
      {editMode && <EditorToolbar />}

      {/* Top-right buttons */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2" style={{ right: editMode ? 332 : 20 }}>
        {/* Edit mode toggle */}
        <button
          onClick={toggleEditMode}
          className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-black/5"
          style={{
            color: editMode ? '#1565C0' : colors.textSecondary,
            background: editMode ? '#E3F2FD' : colors.card,
            border: `1px solid ${editMode ? '#42A5F5' : colors.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
          title={editMode ? '退出编辑' : '编辑模式'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
          </svg>
        </button>

        {/* Spotlight toggle */}
        <button
          onClick={() => setSpotlight((s) => !s)}
          className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-black/5"
          style={{
            color: spotlight ? '#1565C0' : colors.textSecondary,
            background: spotlight ? '#E3F2FD' : colors.card,
            border: `1px solid ${spotlight ? '#42A5F5' : colors.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
          title={spotlight ? '关闭聚光灯' : '开启聚光灯'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>

        {/* Fullscreen button */}
        <button
          onClick={handleEnterFullscreen}
          className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-black/5"
          style={{
            color: colors.textSecondary,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
          title="全屏预览"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
          </svg>
        </button>
      </div>

      {/* Property panel */}
      {editMode && (
        <div
          className="fixed top-0 right-0 h-screen w-80 z-40 border-l overflow-hidden flex flex-col"
          style={{ background: colors.card, borderColor: colors.border }}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
            <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>属性面板</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PropertyPanel originalSlides={allSlides} />
          </div>
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen.isActive && fullscreen.currentIndex !== null && (
        <FullscreenOverlay
          slides={effectiveSlides}
          currentIndex={fullscreen.currentIndex}
          onNext={fullscreen.next}
          onPrev={fullscreen.prev}
          onExit={handleExitFullscreen}
          spotlight={spotlight}
        />
      )}
    </div>
  )
}
