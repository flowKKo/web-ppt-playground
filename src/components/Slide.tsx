import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors, motionConfig } from '../theme/swiss'
import type { SlideData } from '../data/types'
import ContentBoxWrapper from './editor/ContentBoxWrapper'
import OverlayLayer from './editor/OverlayLayer'
import { useEditor } from './editor/EditorProvider'

/** Fixed design resolution — all slides render at this size and scale to fit */
const SLIDE_W = 1920
const SLIDE_H = 1080

interface SlideProps {
  number: number
  slideIndex: number
  slideData: SlideData
  children: ReactNode
}

const Slide = forwardRef<HTMLDivElement, SlideProps>(
  function Slide({ number, slideIndex, slideData, children }, ref) {
    const { editMode, setSelection } = useEditor()
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    // Merge forwarded ref with local ref
    const setRef = useCallback((el: HTMLDivElement | null) => {
      containerRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el
    }, [ref])

    // Measure container to compute scale factor
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

    // Click on the slide padding area (outside content box / overlay layer) → deselect to content-box level
    const handlePaddingClick = useCallback((e: React.MouseEvent) => {
      if (!editMode) return
      if (e.target === e.currentTarget) setSelection({ type: 'content-box', slideIndex })
    }, [editMode, setSelection, slideIndex])

    return (
      <motion.div
        ref={setRef}
        id={`slide-${number}`}
        className="w-[min(90vw,1600px)] aspect-video overflow-hidden relative rounded-xl"
        style={{ background: colors.slide, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        {...motionConfig.slide}
      >
        {/* Render at fixed design resolution, scale to fit container */}
        <div
          className="origin-top-left"
          style={{
            width: SLIDE_W,
            height: SLIDE_H,
            transform: `scale(${scale})`,
          }}
        >
          <div className="w-full h-full px-40 py-32" onClick={handlePaddingClick}>
            <div className="relative w-full h-full">
              <ContentBoxWrapper slideIndex={slideIndex} slideData={slideData}>
                {children}
              </ContentBoxWrapper>
              <OverlayLayer slideIndex={slideIndex} />
            </div>
          </div>
        </div>
      </motion.div>
    )
  },
)

export default Slide
