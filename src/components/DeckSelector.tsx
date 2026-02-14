import { useRef } from 'react'
import { motion } from 'framer-motion'
import { colors, cardStyle, motionConfig } from '../theme/swiss'
import type { DeckMeta } from '../data/types'

interface DeckSelectorProps {
  decks: DeckMeta[]
  onCreateDeck?: () => void
  onDeleteDeck?: (id: string) => void
  onImportDeck?: (file: File) => void
}

export default function DeckSelector({ decks, onCreateDeck, onDeleteDeck, onImportDeck }: DeckSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-20"
      style={{ background: colors.page }}
    >
      <motion.div
        className="w-full max-w-[1200px] flex flex-col gap-12"
        initial="hidden"
        animate="visible"
        variants={motionConfig.stagger}
      >
        {/* Header: title + action buttons */}
        <motion.div variants={motionConfig.child} className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1
              className="text-5xl font-bold leading-tight"
              style={{ color: colors.textPrimary }}
            >
              Web PPT
            </h1>
            <p
              className="text-xl"
              style={{ color: colors.textSecondary }}
            >
              {decks.length} 个演示文稿
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onImportDeck && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-4 flex items-center gap-2 rounded-lg cursor-pointer transition-colors hover:bg-black/5"
                style={{
                  color: colors.textSecondary,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-medium">导入</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onImportDeck(file)
                    e.target.value = ''
                  }}
                />
              </button>
            )}
            {onCreateDeck && (
              <button
                onClick={onCreateDeck}
                className="h-9 px-4 flex items-center gap-2 rounded-lg cursor-pointer transition-colors hover:opacity-90"
                style={{
                  color: '#fff',
                  background: colors.textPrimary,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-sm font-medium">新建</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Deck grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={motionConfig.stagger}
        >
          {decks.map((deck) => (
            <motion.a
              key={deck.id}
              href={`#${deck.id}`}
              className="group/card relative rounded-[14px] px-8 py-6 flex flex-col gap-4 no-underline transition-shadow hover:shadow-lg"
              style={cardStyle}
              variants={motionConfig.child}
            >
              {onDeleteDeck && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (confirm('确定删除此文档？')) onDeleteDeck(deck.id)
                  }}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md cursor-pointer opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-50"
                  style={{ color: colors.textCaption }}
                  title="删除文档"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4M12.67 4v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4" />
                  </svg>
                </button>
              )}
              <div className="flex flex-col gap-2">
                <h2
                  className="text-xl font-semibold leading-tight"
                  style={{ color: colors.textPrimary }}
                >
                  {deck.title}
                </h2>
                {deck.description && (
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: colors.textSecondary }}
                  >
                    {deck.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 mt-auto pt-2">
                {deck.date && (
                  <span
                    className="text-base"
                    style={{ color: colors.textCaption }}
                  >
                    {deck.date}
                  </span>
                )}
                <span
                  className="text-base px-2 py-0.5 rounded"
                  style={{
                    color: colors.accentNeutral,
                    background: `rgba(84,110,122,0.08)`,
                  }}
                >
                  {deck.slides.length} slides
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
