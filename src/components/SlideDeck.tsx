import { useRef, useCallback } from 'react'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import Slide from './Slide'
import SlideContent from './SlideContent'
import Sidebar from './Sidebar'
import FullscreenOverlay from './FullscreenOverlay'
import { useActiveSlideIndex } from '../hooks/useActiveSlideIndex'
import { useFullscreen } from '../hooks/useFullscreen'

interface SlideDeckProps {
  slides: SlideData[]
  onBack?: () => void
}

export default function SlideDeck({ slides, onBack }: SlideDeckProps) {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndex = useActiveSlideIndex(slideRefs, slides.length)
  const fullscreen = useFullscreen(slides.length)

  const scrollToSlide = useCallback((index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const handleExpand = useCallback((index: number) => {
    fullscreen.enter(index)
  }, [fullscreen])

  const handleExitFullscreen = useCallback(() => {
    const idx = fullscreen.currentIndex
    fullscreen.exit()
    // Scroll back to the slide after exiting
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
        slides={slides}
        activeIndex={activeIndex}
        onClickSlide={scrollToSlide}
      />

      {/* Main content */}
      <div className="flex-1 xl:ml-56 flex flex-col items-center gap-10 py-10 relative">
        {onBack && (
          <button
            onClick={onBack}
            className="fixed top-5 left-5 xl:left-[calc(14rem+1.25rem)] z-50 px-4 py-2 rounded-lg text-base font-medium cursor-pointer transition-colors"
            style={{
              color: colors.textSecondary,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            &larr; 返回
          </button>
        )}

        {slides.map((slide, i) => (
          <Slide
            key={i}
            ref={(el) => { slideRefs.current[i] = el }}
            number={i + 1}
            onExpand={() => handleExpand(i)}
          >
            <SlideContent data={slide} />
          </Slide>
        ))}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen.isActive && fullscreen.currentIndex !== null && (
        <FullscreenOverlay
          slides={slides}
          currentIndex={fullscreen.currentIndex}
          onNext={fullscreen.next}
          onExit={handleExitFullscreen}
        />
      )}
    </div>
  )
}
