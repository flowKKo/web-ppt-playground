import { useState, useCallback, useEffect } from 'react'

export function useFullscreen(totalSlides: number) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const isActive = currentIndex !== null

  const enter = useCallback((index: number) => {
    setCurrentIndex(index)
    document.documentElement.requestFullscreen?.().catch(() => {
      // fullscreen may be blocked by browser — still show overlay
    })
  }, [])

  const exit = useCallback(() => {
    setCurrentIndex(null)
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === null) return null
      return prev < totalSlides - 1 ? prev + 1 : prev
    })
  }, [totalSlides])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === null) return null
      return prev > 0 ? prev - 1 : prev
    })
  }, [])

  // Sync with browser native fullscreen exit (Escape via browser)
  useEffect(() => {
    const handleChange = () => {
      if (!document.fullscreenElement && currentIndex !== null) {
        setCurrentIndex(null)
      }
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [currentIndex])

  // Keyboard navigation — only when active
  useEffect(() => {
    if (!isActive) return

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          prev()
          break
        case 'Escape':
          e.preventDefault()
          exit()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isActive, next, prev, exit])

  return { currentIndex, isActive, enter, exit, next, prev }
}
