import { useState } from 'react'
import { useEditor } from './EditorProvider'
import SlideDataEditor from './SlideDataEditor'
import LayoutPicker from './LayoutPicker'
import BlockLayoutPicker, { BLOCK_TYPE_META } from './BlockLayoutPicker'
import BlockDataEditor from './BlockDataEditor'
import AddBlockPanel from './AddBlockPanel'
import { TYPE_LIST } from './TypeThumbnails'
import { createDefaultSlide } from '../../data/type-converter'
import { colors } from '../../theme/swiss'
import type { SlideData, ContentBlock, BlockData } from '../../data/types'
import type { TextOverlay, RectOverlay, LineOverlay, OverlayElement } from '../../data/editor-types'

interface PropertyPanelProps {
  originalSlides: SlideData[]
}

function NumberField({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
      <input
        type="number"
        value={Math.round(value * 100) / 100}
        min={min}
        max={max}
        step={step ?? 1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      />
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-[11px] text-gray-500 font-medium flex-1">{label}</span>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-6 p-0 border border-gray-200 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 px-2.5 py-1 text-xs border border-gray-200 rounded-md focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      />
    </label>
  )
}

export default function PropertyPanel({ originalSlides }: PropertyPanelProps) {
  const {
    selection,
    getContentBox,
    setContentBox,
    getEffectiveSlideData,
    setSlideDataOverride,
    getOverlays,
    updateOverlay,
    removeOverlay,
    updateBlock,
    removeBlock,
    updateBlockData,
    addBlock,
    pendingTemplateSlideIndex,
    setPendingTemplate,
  } = useEditor()

  // Show template picker for newly created blank slides
  if (
    pendingTemplateSlideIndex !== null &&
    selection?.type === 'content-box' &&
    selection.slideIndex === pendingTemplateSlideIndex
  ) {
    return (
      <TemplatePicker
        slideIndex={pendingTemplateSlideIndex}
        onPick={(data) => {
          setSlideDataOverride(pendingTemplateSlideIndex, data)
          setPendingTemplate(null)
        }}
        onSkip={() => setPendingTemplate(null)}
      />
    )
  }

  // No selection — show block list overview for block-slide pages, or generic hint
  if (!selection) {
    return <NoSelectionPanel originalSlides={originalSlides} />
  }

  if (selection.type === 'content-box') {
    const { slideIndex } = selection
    const box = getContentBox(slideIndex) ?? { x: 0, y: 0, width: 100, height: 100 }
    const effectiveData = getEffectiveSlideData(slideIndex, originalSlides[slideIndex])

    // Block-slide: show block list overview
    if (effectiveData.type === 'block-slide') {
      return <BlockListPanel slideIndex={slideIndex} blocks={effectiveData.blocks} />
    }

    return (
      <div className="p-4 space-y-6 overflow-y-auto h-full">
        {/* Position/Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">位置 / 尺寸</span>
            <button
              onClick={() => setContentBox(slideIndex, undefined)}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              重置
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="X (%)" value={box.x} onChange={(v) => setContentBox(slideIndex, { ...box, x: v })} step={0.5} />
            <NumberField label="Y (%)" value={box.y} onChange={(v) => setContentBox(slideIndex, { ...box, y: v })} step={0.5} />
            <NumberField label="宽 (%)" value={box.width} onChange={(v) => setContentBox(slideIndex, { ...box, width: v })} min={10} step={0.5} />
            <NumberField label="高 (%)" value={box.height} onChange={(v) => setContentBox(slideIndex, { ...box, height: v })} min={10} step={0.5} />
          </div>
        </div>

        {/* Layout Picker */}
        <LayoutPicker
          data={effectiveData}
          onChange={(data) => setSlideDataOverride(slideIndex, data)}
        />

        {/* Slide Data Editor */}
        <SlideDataEditor
          data={effectiveData}
          onChange={(data) => setSlideDataOverride(slideIndex, data)}
        />
      </div>
    )
  }

  // Block selected
  if (selection.type === 'block') {
    return (
      <BlockPropertyPanel
        slideIndex={selection.slideIndex}
        blockId={selection.blockId}
        originalSlides={originalSlides}
      />
    )
  }

  // Overlay selected
  const { slideIndex, id } = selection
  const overlays = getOverlays(slideIndex)
  const overlay = overlays.find((o) => o.id === id)
  if (!overlay) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-gray-400 text-sm text-center">
        Overlay 未找到
      </div>
    )
  }

  const update = (changes: Partial<OverlayElement>) => updateOverlay(slideIndex, id, changes)

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">
          {overlay.type === 'text' ? '文本叠加' : overlay.type === 'rect' ? '矩形叠加' : '线条叠加'}
        </span>
        <button
          onClick={() => removeOverlay(slideIndex, id)}
          className="text-xs text-red-500 hover:underline cursor-pointer"
        >
          删除
        </button>
      </div>

      {overlay.type === 'text' && <TextOverlayPanel overlay={overlay} update={update} />}
      {overlay.type === 'rect' && <RectOverlayPanel overlay={overlay} update={update} />}
      {overlay.type === 'line' && <LineOverlayPanel overlay={overlay} update={update} />}
    </div>
  )
}

function TextOverlayPanel({ overlay, update }: { overlay: TextOverlay; update: (c: Partial<TextOverlay>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="X (%)" value={overlay.x} onChange={(v) => update({ x: v })} step={0.5} />
        <NumberField label="Y (%)" value={overlay.y} onChange={(v) => update({ y: v })} step={0.5} />
        <NumberField label="宽 (%)" value={overlay.width} onChange={(v) => update({ width: v })} min={5} step={0.5} />
        <NumberField label="高 (%)" value={overlay.height} onChange={(v) => update({ height: v })} min={3} step={0.5} />
      </div>
      <label className="block">
        <span className="text-[11px] text-gray-500 font-medium">文本</span>
        <textarea
          value={overlay.text}
          onChange={(e) => update({ text: e.target.value })}
          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
          rows={2}
        />
      </label>
      <NumberField label="字号" value={overlay.fontSize} onChange={(v) => update({ fontSize: v })} min={8} max={200} />
      <ColorField label="颜色" value={overlay.color} onChange={(v) => update({ color: v })} />
      <label className="block">
        <span className="text-[11px] text-gray-500 font-medium">字重</span>
        <select
          value={overlay.fontWeight}
          onChange={(e) => update({ fontWeight: Number(e.target.value) as 400 | 600 | 700 })}
          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
        >
          <option value={400}>Normal (400)</option>
          <option value={600}>Semi-bold (600)</option>
          <option value={700}>Bold (700)</option>
        </select>
      </label>
      <label className="block">
        <span className="text-[11px] text-gray-500 font-medium">对齐</span>
        <select
          value={overlay.textAlign}
          onChange={(e) => update({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
        >
          <option value="left">左对齐</option>
          <option value="center">居中</option>
          <option value="right">右对齐</option>
        </select>
      </label>
    </div>
  )
}

function RectOverlayPanel({ overlay, update }: { overlay: RectOverlay; update: (c: Partial<RectOverlay>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="X (%)" value={overlay.x} onChange={(v) => update({ x: v })} step={0.5} />
        <NumberField label="Y (%)" value={overlay.y} onChange={(v) => update({ y: v })} step={0.5} />
        <NumberField label="宽 (%)" value={overlay.width} onChange={(v) => update({ width: v })} min={2} step={0.5} />
        <NumberField label="高 (%)" value={overlay.height} onChange={(v) => update({ height: v })} min={2} step={0.5} />
      </div>
      <ColorField label="填充" value={overlay.fill} onChange={(v) => update({ fill: v })} />
      <ColorField label="描边" value={overlay.stroke} onChange={(v) => update({ stroke: v })} />
      <NumberField label="描边宽度" value={overlay.strokeWidth} onChange={(v) => update({ strokeWidth: v })} min={0} max={20} />
      <NumberField label="圆角" value={overlay.borderRadius} onChange={(v) => update({ borderRadius: v })} min={0} max={50} />
    </div>
  )
}

function LineOverlayPanel({ overlay, update }: { overlay: LineOverlay; update: (c: Partial<LineOverlay>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="X1 (%)" value={overlay.x1} onChange={(v) => update({ x1: v })} step={0.5} />
        <NumberField label="Y1 (%)" value={overlay.y1} onChange={(v) => update({ y1: v })} step={0.5} />
        <NumberField label="X2 (%)" value={overlay.x2} onChange={(v) => update({ x2: v })} step={0.5} />
        <NumberField label="Y2 (%)" value={overlay.y2} onChange={(v) => update({ y2: v })} step={0.5} />
      </div>
      <ColorField label="描边" value={overlay.stroke} onChange={(v) => update({ stroke: v })} />
      <NumberField label="描边宽度" value={overlay.strokeWidth} onChange={(v) => update({ strokeWidth: v })} min={1} max={20} />
    </div>
  )
}

function getBlockPreview(data: BlockData): string {
  switch (data.type) {
    case 'title-body': return data.title || ''
    case 'grid-item': return data.items.map((i) => i.title).join(', ')
    case 'sequence': return data.steps.map((s) => s.label).join(' → ')
    case 'compare': return data.mode
    case 'funnel': return data.layers.map((l) => l.label).join(' → ')
    case 'concentric': return data.rings.map((r) => r.label).join(', ')
    case 'hub-spoke': return data.center.label
    case 'venn': return data.sets.map((s) => s.label).join(' ∩ ')
    case 'chart': return data.chartType
    case 'image': return data.src ? (data.alt || '已上传图片') : (data.placeholder || '图片占位')
    default: return ''
  }
}

function BlockListPanel({ slideIndex, blocks }: { slideIndex: number; blocks: ContentBlock[] }) {
  const { setSelection, addBlock } = useEditor()

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">
        页面元素 ({blocks.length})
      </div>
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
          <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-xs">从下方添加第一个元素</span>
        </div>
      ) : (
        <div className="space-y-1">
          {blocks.map((block) => {
            const meta = BLOCK_TYPE_META[block.data.type] || { icon: '?', label: block.data.type, color: 'bg-gray-100 text-gray-500' }
            const preview = getBlockPreview(block.data)
            return (
              <button
                key={block.id}
                onClick={() => setSelection({ type: 'block', slideIndex, blockId: block.id })}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50 cursor-pointer text-left transition-colors"
              >
                <span className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 ${meta.color}`}>{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-700 truncate">{meta.label}</div>
                  {preview && <div className="text-[10px] text-gray-400 truncate">{preview}</div>}
                </div>
                {/* Right arrow indicator */}
                <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          })}
        </div>
      )}
      <div className="border-t border-gray-100 pt-3">
        <AddBlockPanel onAdd={(block) => addBlock(slideIndex, block)} />
      </div>
    </div>
  )
}

function NoSelectionPanel({ originalSlides }: { originalSlides: SlideData[] }) {
  const { getEffectiveSlideData, setSelection } = useEditor()

  // Find the first visible block-slide to show its block list
  for (let i = 0; i < originalSlides.length; i++) {
    const data = getEffectiveSlideData(i, originalSlides[i])
    if (data.type === 'block-slide') {
      return <BlockListPanel slideIndex={i} blocks={data.blocks} />
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6 text-gray-400 text-sm text-center">
      点击元素进行编辑
    </div>
  )
}

function CollapsibleSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-gray-100 pt-3 mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left cursor-pointer mb-2.5 group"
      >
        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 3.3a1 1 0 011.4 0l6 6a1 1 0 010 1.4l-6 6a1 1 0 01-1.4-1.4L11.58 10 6.3 4.7a1 1 0 010-1.4z" />
        </svg>
        <span className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase group-hover:text-gray-700 transition-colors">{title}</span>
      </button>
      {open && <div className="pl-1">{children}</div>}
    </div>
  )
}

function BlockPropertyPanel({ slideIndex, blockId, originalSlides }: { slideIndex: number; blockId: string; originalSlides: SlideData[] }) {
  const {
    getEffectiveSlideData,
    updateBlock,
    removeBlock,
    updateBlockData,
  } = useEditor()

  const effectiveData = getEffectiveSlideData(slideIndex, originalSlides[slideIndex])
  if (effectiveData.type !== 'block-slide') return null

  const block = effectiveData.blocks.find((b) => b.id === blockId)
  if (!block) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-gray-400 text-sm text-center">
        Block 未找到
      </div>
    )
  }

  const meta = BLOCK_TYPE_META[block.data.type] || { icon: '?', label: block.data.type, color: 'bg-gray-100 text-gray-500' }
  const preview = getBlockPreview(block.data)

  return (
    <div className="p-4 space-y-0 overflow-y-auto h-full">
      {/* Header card */}
      <div className="flex items-center gap-3 p-3 mb-1 bg-gray-50 rounded-lg border border-gray-100">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${meta.color}`}>{meta.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-700">{meta.label}</div>
          {preview && <div className="text-[10px] text-gray-400 truncate">{preview}</div>}
        </div>
        <button
          onClick={() => removeBlock(slideIndex, blockId)}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 cursor-pointer transition-colors"
          title="删除"
        >
          <svg className="w-4 h-4 text-red-400 hover:text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Style: layout picker */}
      <CollapsibleSection title="样式" defaultOpen>
        <BlockLayoutPicker
          data={block.data}
          onChange={(data) => updateBlockData(slideIndex, blockId, data)}
        />
      </CollapsibleSection>

      {/* Data editor */}
      <CollapsibleSection title="数据" defaultOpen>
        <BlockDataEditor
          data={block.data}
          onChange={(data) => updateBlockData(slideIndex, blockId, data)}
        />
      </CollapsibleSection>

      {/* Position/Size — collapsed by default */}
      <CollapsibleSection title="位置 / 尺寸" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X (%)" value={block.x} onChange={(v) => updateBlock(slideIndex, blockId, { x: v })} step={0.5} />
          <NumberField label="Y (%)" value={block.y} onChange={(v) => updateBlock(slideIndex, blockId, { y: v })} step={0.5} />
          <NumberField label="宽 (%)" value={block.width} onChange={(v) => updateBlock(slideIndex, blockId, { width: v })} min={10} step={0.5} />
          <NumberField label="高 (%)" value={block.height} onChange={(v) => updateBlock(slideIndex, blockId, { height: v })} min={10} step={0.5} />
        </div>
      </CollapsibleSection>
    </div>
  )
}

// ─── Template Picker (shown for newly created blank slides) ───

function BlockSlideThumb() {
  const c = '#4CAF50'
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="8" y="4" width="30" height="12" rx="2" fill={c} opacity={0.3} stroke={c} strokeWidth="1" />
      <rect x="42" y="4" width="30" height="12" rx="2" fill={c} opacity={0.3} stroke={c} strokeWidth="1" />
      <rect x="8" y="20" width="64" height="20" rx="2" fill={c} opacity={0.2} stroke={c} strokeWidth="1" strokeDasharray="3 2" />
      <text x="40" y="33" textAnchor="middle" fontSize="8" fill={c} fontWeight="600">+</text>
    </svg>
  )
}

function TemplatePicker({ slideIndex, onPick, onSkip }: {
  slideIndex: number
  onPick: (data: SlideData) => void
  onSkip: () => void
}) {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          选择页面模板
        </h3>
        <p className="text-xs mt-1" style={{ color: colors.textCaption }}>
          为第 {slideIndex + 1} 页选择一种布局
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Block slide (free layout) */}
        <button
          onClick={() => onPick(createDefaultSlide('block-slide'))}
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 cursor-pointer transition-all hover:border-green-400 hover:bg-green-50/40 hover:shadow-sm"
          style={{ borderColor: '#4CAF50' + '66' }}
        >
          <div
            className="w-full aspect-video rounded overflow-hidden"
            style={{ background: colors.slide }}
          >
            <BlockSlideThumb />
          </div>
          <span className="text-[11px] font-semibold" style={{ color: '#4CAF50' }}>
            自由布局
          </span>
        </button>

        {/* Standard slide types */}
        {TYPE_LIST.map(({ type, label, Thumb }) => (
          <button
            key={type}
            onClick={() => onPick(createDefaultSlide(type))}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
            style={{ borderColor: colors.border }}
          >
            <div
              className="w-full aspect-video rounded overflow-hidden"
              style={{ background: colors.slide }}
            >
              <Thumb />
            </div>
            <span className="text-[11px] font-medium" style={{ color: colors.textSecondary }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onSkip}
        className="w-full text-center text-xs py-2 cursor-pointer rounded-md transition-colors hover:bg-black/5"
        style={{ color: colors.textCaption }}
      >
        保持空白
      </button>
    </div>
  )
}
