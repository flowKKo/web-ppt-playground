import { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import Slide from './Slide'
import SlideContent from './SlideContent'
import Sidebar from './Sidebar'
import FullscreenOverlay from './FullscreenOverlay'
import { useFullscreen } from '../hooks/useFullscreen'
import { EditorProvider, useEditor } from './editor/EditorProvider'
import { InlineEditProvider } from './editor/InlineEditContext'
import EditorToolbar from './editor/EditorToolbar'
import PropertyPanel from './editor/PropertyPanel'
import { exportDeck } from '../data/deck-io'

interface SlideDeckProps {
  slides: SlideData[]
  onBack?: () => void
  deckId: string
  deckTitle?: string
  deckDescription?: string
  onUpdateDeckMeta?: (title: string, description: string) => void
}

export default function SlideDeck({ slides, onBack, deckId, deckTitle, deckDescription, onUpdateDeckMeta }: SlideDeckProps) {
  return (
    <EditorProvider deckId={deckId} originalSlides={slides}>
      <SlideDeckInner slides={slides} onBack={onBack} deckTitle={deckTitle} deckDescription={deckDescription} onUpdateDeckMeta={onUpdateDeckMeta} />
    </EditorProvider>
  )
}

function SlideDeckInner({ slides, onBack, deckTitle, deckDescription, onUpdateDeckMeta }: Omit<SlideDeckProps, 'deckId'>) {
  const mainRef = useRef<HTMLDivElement>(null)
  const {
    editMode, toggleEditMode, getEffectiveSlideData, setSelection,
    allSlides, insertSlide, deleteSlide, copySlide, pasteSlide, duplicateSlide, moveSlide, clipboard,
    setPendingTemplate, pendingTemplateSlideIndex,
  } = useEditor()

  const [spotlight, setSpotlight] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const goNextRef = useRef(() => {})
  const goPrevRef = useRef(() => {})
  const fullscreen = useFullscreen(allSlides.length)

  const effectiveSlides = useMemo(
    () => allSlides.map((s, i) => getEffectiveSlideData(i, s)),
    [allSlides, getEffectiveSlideData],
  )

  // ─── Navigation helpers ───

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, allSlides.length - 1))
  }, [allSlides.length])

  const goPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0))
  }, [])

  // Sync selection when activeIndex changes in edit mode
  useEffect(() => {
    if (editMode) {
      setSelection({ type: 'content-box', slideIndex: activeIndex })
    }
  }, [activeIndex, editMode, setSelection])

  // Keep refs in sync so wheel handler never has stale closures
  goNextRef.current = goNext
  goPrevRef.current = goPrev

  // ─── Wheel navigation with accumulated delta ───

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    let accDelta = 0
    let cooldown = false
    let resetTimer: ReturnType<typeof setTimeout>
    const THRESHOLD = 4

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (cooldown) return

      accDelta += e.deltaY
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { accDelta = 0 }, 120)

      if (accDelta > THRESHOLD) {
        goNextRef.current()
        accDelta = 0
        cooldown = true
        setTimeout(() => { cooldown = false }, 250)
      } else if (accDelta < -THRESHOLD) {
        goPrevRef.current()
        accDelta = 0
        cooldown = true
        setTimeout(() => { cooldown = false }, 250)
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => { el.removeEventListener('wheel', handleWheel); clearTimeout(resetTimer) }
  }, [])  // stable — reads from refs

  // ─── Keyboard navigation ───

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      const editable = (e.target as HTMLElement)?.isContentEditable
      if (tag === 'input' || tag === 'textarea' || editable) return

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          goNext()
          break
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          goPrev()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  // ─── Bounds protection ───

  useEffect(() => {
    if (activeIndex >= allSlides.length) {
      setActiveIndex(Math.max(0, allSlides.length - 1))
    }
  }, [activeIndex, allSlides.length])

  // ─── Insert blank slide ───

  const handleInsertBlankSlide = useCallback((position: number) => {
    const blank: SlideData = { type: 'key-point', title: '新页面', body: '' }
    insertSlide(position, blank)
    if (!editMode) toggleEditMode()
    setPendingTemplate(position)
  }, [insertSlide, editMode, toggleEditMode, setPendingTemplate])

  // Navigate to newly created slide when pendingTemplateSlideIndex is set
  useEffect(() => {
    if (pendingTemplateSlideIndex === null) return
    requestAnimationFrame(() => {
      setActiveIndex(pendingTemplateSlideIndex)
      setSelection({ type: 'content-box', slideIndex: pendingTemplateSlideIndex })
    })
  }, [pendingTemplateSlideIndex, setSelection])

  // ─── Export ───

  const handleExport = useCallback(() => {
    exportDeck(deckTitle || '未命名', deckDescription, effectiveSlides)
  }, [deckTitle, deckDescription, effectiveSlides])

  // ─── Fullscreen ───

  const handleEnterFullscreen = useCallback(() => {
    if (editMode) toggleEditMode()
    fullscreen.enter(activeIndex)
  }, [fullscreen, activeIndex, editMode, toggleEditMode])

  const handleExitFullscreen = useCallback(() => {
    const idx = fullscreen.currentIndex
    fullscreen.exit()
    requestAnimationFrame(() => {
      if (!editMode) toggleEditMode()
    })
    if (idx !== null) {
      setActiveIndex(idx)
    }
  }, [fullscreen, editMode, toggleEditMode])

  // ─── Delete slide wrapper — adjust activeIndex ───

  const handleDeleteSlide = useCallback((position: number) => {
    deleteSlide(position)
    setActiveIndex((prev) => {
      if (prev > position) return prev - 1
      if (prev === position && prev >= allSlides.length - 1) return Math.max(0, prev - 1)
      return prev
    })
  }, [deleteSlide, allSlides.length])

  // ─── Reorder slide wrapper — track activeIndex ───

  const handleReorderSlide = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    moveSlide(fromIndex, toIndex)
    // Update activeIndex to follow the moved slide if it was active
    setActiveIndex((prev) => {
      if (prev === fromIndex) return toIndex
      if (fromIndex < prev && toIndex >= prev) return prev - 1
      if (fromIndex > prev && toIndex <= prev) return prev + 1
      return prev
    })
  }, [moveSlide])

  const currentSlide = allSlides[activeIndex]
  const currentEffective = effectiveSlides[activeIndex]

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: colors.page }}>
      {/* Sidebar */}
      <Sidebar
        slides={effectiveSlides}
        activeIndex={activeIndex}
        onClickSlide={goToSlide}
        editMode={editMode}
        onInsertBlankSlide={handleInsertBlankSlide}
        onDeleteSlide={handleDeleteSlide}
        onCopySlide={copySlide}
        onPasteSlide={pasteSlide}
        onDuplicateSlide={duplicateSlide}
        onReorderSlide={handleReorderSlide}
        hasClipboard={clipboard !== null}
        onBack={onBack}
        width={sidebarWidth}
        onResize={setSidebarWidth}
        deckTitle={deckTitle}
        deckDescription={deckDescription}
        onUpdateDeckMeta={onUpdateDeckMeta}
      />

      {/* Main content — single page view */}
      <div
        ref={mainRef}
        className="flex-1 flex items-center justify-center relative transition-all overflow-hidden h-screen sidebar-margin"
        style={{ '--sidebar-w': `${sidebarWidth}px` } as React.CSSProperties}
        onClick={(e) => {
          if (!editMode) return
          if (e.target === e.currentTarget) setSelection(null)
        }}
      >
        {currentSlide && currentEffective && (
          <Slide
            number={activeIndex + 1}
            slideIndex={activeIndex}
            slideData={currentEffective}
          >
            <InlineEditProvider slideIndex={activeIndex} originalData={currentSlide}>
              <SlideContent data={currentEffective} slideIndex={activeIndex} />
            </InlineEditProvider>
          </Slide>
        )}

        {/* Page indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium select-none"
          style={{
            color: colors.textCaption,
            background: 'rgba(0,0,0,0.05)',
          }}
        >
          {activeIndex + 1} / {allSlides.length}
        </div>

        {/* Top-right buttons */}
        <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-black/5"
            style={{
              color: colors.textSecondary,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            title="导出文档"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

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
      </div>

      {/* Editor toolbar */}
      {editMode && <EditorToolbar />}

      {/* Property panel — flex child, always gets full 320px */}
      {editMode && (
        <div
          className="w-80 shrink-0 h-screen border-l overflow-hidden flex flex-col"
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
