import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { colors } from '../theme/swiss'
import type { SlideData } from '../data/types'
import SlideContent from './SlideContent'

interface FullscreenOverlayProps {
  slides: SlideData[]
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  onExit: () => void
}

export default function FullscreenOverlay({
  slides,
  currentIndex,
  onNext,
  onPrev,
  onExit,
}: FullscreenOverlayProps) {
  const [direction, setDirection] = useState(0)
  const prevIndex = useRef(currentIndex)

  if (currentIndex !== prevIndex.current) {
    setDirection(currentIndex > prevIndex.current ? 1 : -1)
    prevIndex.current = currentIndex
  }

  const isFirst = currentIndex === 0

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ background: colors.slide }}
    >
      {/* Left 20% — prev */}
      {!isFirst && (
        <div
          onClick={onPrev}
          className="absolute left-0 top-0 bottom-0 w-[20%] z-10 cursor-pointer"
        />
      )}

      {/* Right 80% — next */}
      <div
        onClick={onNext}
        className="absolute right-0 top-0 bottom-0 z-10 cursor-pointer"
        style={{ left: isFirst ? '0' : '20%' }}
      />

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onExit() }}
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-black/10"
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

    </div>
  )
}
