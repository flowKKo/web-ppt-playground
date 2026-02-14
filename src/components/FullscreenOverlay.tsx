import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import SlideContent from './SlideContent'
import ContentBoxWrapper from './editor/ContentBoxWrapper'
import OverlayLayer from './editor/OverlayLayer'
import { SpotlightProvider } from '../hooks/useSpotlight'

/** Fixed design resolution — matches Slide.tsx and Sidebar thumbnails */
const SLIDE_W = 1920
const SLIDE_H = 1080

interface FullscreenOverlayProps {
  slides: SlideData[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  onExit: () => void
  spotlight: boolean
}

function getBlockCount(slide: SlideData): number {
  return slide.type === 'block-slide' ? slide.blocks.length : 0
}

export default function FullscreenOverlay({
  slides,
  currentIndex,
  onNext,
  onPrev,
  onExit,
  spotlight,
}: FullscreenOverlayProps) {
  const [direction, setDirection] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const prevIndex = useRef(currentIndex)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Measure 16:9 letterbox container to compute scale
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setScale(w / SLIDE_W)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const currentSlide = slides[currentIndex]
  const blockCount = getBlockCount(currentSlide)

  // Reset revealed count synchronously during render to avoid one-frame flash
  if (currentIndex !== prevIndex.current) {
    const goingForward = currentIndex > prevIndex.current
    setDirection(goingForward ? 1 : -1)
    prevIndex.current = currentIndex
    setRevealedCount(goingForward ? 0 : getBlockCount(slides[currentIndex]))
  }

  const handleNext = useCallback(() => {
    if (spotlight && blockCount > 0 && revealedCount < blockCount) {
      setRevealedCount((c) => c + 1)
    } else {
      onNext()
    }
  }, [spotlight, blockCount, revealedCount, onNext])

  const handlePrev = useCallback(() => {
    if (spotlight && revealedCount > 0) {
      setRevealedCount((c) => c - 1)
    } else {
      onPrev()
    }
  }, [spotlight, revealedCount, onPrev])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          handlePrev()
          break
        case 'Escape':
          e.preventDefault()
          onExit()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleNext, handlePrev, onExit])

  const isFirst = currentIndex === 0

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: colors.slide }}
    >
      {/* Left 20% — prev */}
      {!isFirst && (
        <div
          onClick={handlePrev}
          className="absolute left-0 top-0 bottom-0 w-[20%] z-10 cursor-pointer"
        />
      )}

      {/* Right 80% — next */}
      <div
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 z-10 cursor-pointer"
        style={{ left: isFirst ? '0' : '20%' }}
      />

      {/* 16:9 letterbox container — scale content from fixed design resolution */}
      <div
        ref={containerRef}
        className="overflow-hidden relative"
        style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          aspectRatio: '16/9',
        }}
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -300 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <div
              className="origin-top-left"
              style={{
                width: SLIDE_W,
                height: SLIDE_H,
                transform: `scale(${scale})`,
                background: colors.slide,
              }}
            >
              <div className="w-full h-full px-40 py-32">
                <div className="relative w-full h-full">
                  <SpotlightProvider value={{ active: spotlight, revealedCount }}>
                    <ContentBoxWrapper slideIndex={currentIndex} slideData={slides[currentIndex]}>
                      <SlideContent data={slides[currentIndex]} slideIndex={currentIndex} />
                    </ContentBoxWrapper>
                  </SpotlightProvider>
                  <OverlayLayer slideIndex={currentIndex} readOnly />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
