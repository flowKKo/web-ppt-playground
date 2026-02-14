import { useEffect, useRef } from 'react'
import { useEditor } from './EditorProvider'
import { BLOCK_TYPE_META } from './BlockLayoutPicker'
import { colors } from '../../theme/swiss'
import type { BlockData, BlockSlideData } from '../../data/types'

const COLOR_PRESETS = [
  '#1A1A2E', '#333333', '#666666', '#999999',
  '#E8E8E8', '#ffffff', '#2196F3', '#1565C0',
  '#4CAF50', '#FF9800', '#E91E63', '#9C27B0',
]

export default function BlockContextMenu() {
  const {
    blockContextMenu, closeBlockContextMenu,
    allSlides, getSlideDataOverride,
    updateBlockData, duplicateBlock, removeBlock,
  } = useEditor()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!blockContextMenu) return
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeBlockContextMenu()
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBlockContextMenu()
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [blockContextMenu, closeBlockContextMenu])

  if (!blockContextMenu) return null

  const { x, y, slideIndex, blockId } = blockContextMenu

  const override = getSlideDataOverride(slideIndex)
  const original = allSlides[slideIndex]
  const slideData = override ?? original
  if (!slideData || slideData.type !== 'block-slide') return null
  const block = (slideData as BlockSlideData).blocks.find(b => b.id === blockId)
  if (!block) return null

  const data = block.data
  const meta = BLOCK_TYPE_META[data.type]
  const isTitleBody = data.type === 'title-body'
  const hasTextColor = data.type !== 'image' && data.type !== 'chart'

  const setProp = (prop: string, value: string | number | undefined) => {
    updateBlockData(slideIndex, blockId, { ...data, [prop]: value } as BlockData)
  }

  // Viewport clamping
  const menuW = 240
  const menuH = 360
  const cx = Math.min(x, window.innerWidth - menuW - 8)
  const cy = Math.min(y, window.innerHeight - menuH - 8)

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-white rounded-xl shadow-2xl border border-gray-200 py-2 select-none"
      style={{ left: cx, top: Math.max(8, cy), width: menuW }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="px-3 pb-1 flex items-center gap-2">
        <span className={`w-6 h-6 rounded flex items-center justify-center text-sm ${meta.color}`}>{meta.icon}</span>
        <span className="text-xs font-medium text-gray-500">{meta.label}</span>
      </div>

      {/* Font size — title-body only */}
      {isTitleBody && (
        <>
          <div className="mx-3 my-1.5 border-t border-gray-100" />
          <div className="px-3 space-y-1.5">
            <SizeStepper
              label="标题字号"
              value={(data as { titleSize?: number }).titleSize ?? 36}
              onChange={(v) => setProp('titleSize', v)}
              min={12} max={200} step={2}
            />
            <SizeStepper
              label="正文字号"
              value={(data as { bodySize?: number }).bodySize ?? 18}
              onChange={(v) => setProp('bodySize', v)}
              min={10} max={120} step={2}
            />
          </div>
        </>
      )}

      {/* Colors */}
      {hasTextColor && (
        <>
          <div className="mx-3 my-1.5 border-t border-gray-100" />
          <div className="px-3 space-y-2">
            {isTitleBody && (
              <ColorRow
                label="标题颜色"
                value={(data as { titleColor?: string }).titleColor ?? colors.textPrimary}
                onChange={(v) => setProp('titleColor', v)}
              />
            )}
            <ColorRow
              label={isTitleBody ? '正文颜色' : '文本颜色'}
              value={(data as { textColor?: string }).textColor ?? (isTitleBody ? colors.textSecondary : '#ffffff')}
              onChange={(v) => setProp('textColor', v)}
            />
          </div>
        </>
      )}

      {/* Actions — these dismiss the menu */}
      <div className="mx-3 my-1.5 border-t border-gray-100" />
      <div className="px-1">
        <button
          onClick={() => { duplicateBlock(slideIndex, blockId); closeBlockContextMenu() }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          复制 Block
        </button>
        <button
          onClick={() => { removeBlock(slideIndex, blockId); closeBlockContextMenu() }}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          删除
        </button>
      </div>
    </div>
  )
}

/** Font size stepper — stays open on click */
function SizeStepper({ label, value, onChange, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void
  min: number; max: number; step: number
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-gray-500">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 cursor-pointer text-xs transition-colors"
        >
          -
        </button>
        <span className="text-xs font-mono text-gray-700 w-8 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 cursor-pointer text-xs transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

/** Color row: label + preset swatches + native picker — stays open on click */
function ColorRow({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <span className="text-[11px] text-gray-500">{label}</span>
      <div className="flex items-center gap-1 mt-1">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-[15px] h-[15px] rounded-full border cursor-pointer transition-transform hover:scale-125 shrink-0"
            style={{
              backgroundColor: c,
              borderColor: value === c ? '#2196F3' : 'rgba(0,0,0,0.12)',
              borderWidth: value === c ? 2 : 1,
            }}
          />
        ))}
        <label className="ml-auto cursor-pointer shrink-0" title="自定义颜色">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 rounded border border-gray-200 cursor-pointer p-0"
            style={{ appearance: 'none', WebkitAppearance: 'none' }}
          />
        </label>
      </div>
    </div>
  )
}
