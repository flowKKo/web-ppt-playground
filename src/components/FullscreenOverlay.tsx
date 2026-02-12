import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import SlideContent from './SlideContent'

interface FullscreenOverlayProps {
  slides: SlideData[]
  currentIndex: number
  onNext: () => void
  onExit: () => void
}

export default function FullscreenOverlay({
  slides,
  currentIndex,
  onNext,
  onExit,
}: FullscreenOverlayProps) {
  const [direction, setDirection] = useState(0)
  const prevIndex = useRef(currentIndex)

  if (currentIndex !== prevIndex.current) {
    setDirection(currentIndex > prevIndex.current ? 1 : -1)
    prevIndex.current = currentIndex
  }

  return (
    <div
      className="fixed inset-0 z-[9999] cursor-pointer"
      style={{ background: colors.slide }}
      onClick={onNext}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onExit() }}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-black/10"
        style={{ color: colors.textSecondary }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4l12 12M16 4L4 16" />
        </svg>
      </button>

      {/* Full-bleed slide */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction * 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -300 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full px-20 py-16 flex flex-col justify-center"
          style={{ background: colors.slide }}
        >
          <SlideContent data={slides[currentIndex]} />
        </motion.div>
      </AnimatePresence>

      {/* Page indicator */}
      <div
        className="absolute bottom-3 left-0 right-0 text-center text-sm pointer-events-none"
        style={{ color: colors.textCaption }}
      >
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  )
}
