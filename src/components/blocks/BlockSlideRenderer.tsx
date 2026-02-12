import { useState, useRef, useEffect } from 'react'
import type { BlockSlideData, ContentBlock, BlockData } from '../../data/types'
import { useEditor } from '../editor/EditorProvider'
import BlockRenderer from './BlockRenderer'
import BlockWrapper from './BlockWrapper'

interface BlockSlideRendererProps {
  data: BlockSlideData
  slideIndex: number
}

let _blockCtr = 0
function nextBlockId(): string {
  return `blk-${Date.now()}-${++_blockCtr}`
}

interface QuickBlockOption {
  label: string
  icon: string
  createData: () => BlockData
}

const QUICK_OPTIONS: QuickBlockOption[] = [
  { label: '标题文本', icon: 'T', createData: () => ({ type: 'title-body', title: '新标题', body: '正文内容' }) },
  { label: '网格', icon: '⊞', createData: () => ({ type: 'grid-item', items: [{ title: '项目一', description: '描述' }, { title: '项目二', description: '描述' }, { title: '项目三', description: '描述' }], variant: 'solid' }) },
  { label: '序列', icon: '→', createData: () => ({ type: 'sequence', steps: [{ label: '步骤一' }, { label: '步骤二' }, { label: '步骤三' }], variant: 'timeline' }) },
  { label: '对比', icon: '⇔', createData: () => ({ type: 'compare', mode: 'versus', sides: [{ name: '方案A', items: [{ label: '特性', value: '值' }] }, { name: '方案B', items: [{ label: '特性', value: '值' }] }] }) },
  { label: '漏斗', icon: '▽', createData: () => ({ type: 'funnel', layers: [{ label: '访问', value: 1000 }, { label: '注册', value: 600 }, { label: '付费', value: 200 }], variant: 'funnel' }) },
  { label: '柱状图', icon: '▊', createData: () => ({ type: 'chart', chartType: 'bar', bars: [{ category: 'Q1', values: [{ name: '值', value: 45 }] }, { category: 'Q2', values: [{ name: '值', value: 62 }] }, { category: 'Q3', values: [{ name: '值', value: 38 }] }] }) },
  { label: '饼图', icon: '◔', createData: () => ({ type: 'chart', chartType: 'pie', slices: [{ name: '项目A', value: 40 }, { name: '项目B', value: 35 }, { name: '项目C', value: 25 }] }) },
]

function FloatingAddButton({ onAdd }: { onAdd: (block: ContentBlock) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSelect = (opt: QuickBlockOption) => {
    const block: ContentBlock = {
      id: nextBlockId(),
      x: 25, y: 25, width: 50, height: 50,
      data: opt.createData(),
    }
    onAdd(block)
    setOpen(false)
  }

  return (
    <div ref={ref} className="absolute bottom-3 right-3 z-20">
      {open && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-36 space-y-0.5">
          {QUICK_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-gray-100 cursor-pointer text-left"
            >
              <span className="w-5 text-center text-sm opacity-60">{opt.icon}</span>
              <span className="text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 hover:scale-110 transition-all cursor-pointer text-lg leading-none"
      >
        {open ? '×' : '+'}
      </button>
    </div>
  )
}

export default function BlockSlideRenderer({ data, slideIndex }: BlockSlideRendererProps) {
  const {
    editMode,
    selection,
    setSelection,
    beginDrag,
    updateBlockQuiet,
    addBlock,
  } = useEditor()

  const handleBlockSelect = (blockId: string) => {
    setSelection({ type: 'block', slideIndex, blockId })
  }

  // Click on empty canvas area → select the slide (shows add-block panel)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!editMode) return
    // Only fire when clicking directly on the canvas, not on a block
    if (e.target === e.currentTarget) {
      setSelection({ type: 'content-box', slideIndex })
    }
  }

  return (
    <div
      className="relative w-full h-full"
      onClick={handleCanvasClick}
    >
      {data.blocks.map((block) => {
        const isSelected =
          selection?.type === 'block' &&
          selection.slideIndex === slideIndex &&
          selection.blockId === block.id

        return (
          <BlockWrapper
            key={block.id}
            block={block}
            isSelected={isSelected}
            editMode={editMode}
            onSelect={() => handleBlockSelect(block.id)}
            onUpdate={(bounds) => updateBlockQuiet(slideIndex, block.id, bounds)}
            onUpdateQuiet={(bounds) => updateBlockQuiet(slideIndex, block.id, bounds)}
            onDragStart={beginDrag}
          >
            <BlockRenderer data={block.data} blockId={block.id} />
          </BlockWrapper>
        )
      })}
      {editMode && (
        <FloatingAddButton onAdd={(block) => addBlock(slideIndex, block)} />
      )}
    </div>
  )
}
