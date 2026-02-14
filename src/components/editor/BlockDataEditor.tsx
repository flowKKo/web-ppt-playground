import { useRef } from 'react'
import type { BlockData } from '../../data/types'
import type { SlideData } from '../../data/types'
import SlideDataEditor from './SlideDataEditor'

interface BlockDataEditorProps {
  data: BlockData
  onChange: (data: BlockData) => void
}

/**
 * Converts BlockData to a SlideData for reuse of SlideDataEditor,
 * and converts back on change.
 */
function blockToSlideData(data: BlockData): SlideData | null {
  switch (data.type) {
    case 'title-body':
    case 'image':
      return null // handled inline below
    case 'grid-item':
      return { ...data, title: '' }
    case 'sequence':
      return { ...data, title: '' }
    case 'compare':
      return { ...data, title: '' }
    case 'funnel':
      return { ...data, title: '' }
    case 'concentric':
      return { ...data, title: '' }
    case 'hub-spoke':
      return { ...data, title: '' }
    case 'venn':
      return { ...data, title: '' }
    case 'chart':
      return { ...data, title: '' }
  }
}

function slideDataToBlock(slideData: SlideData, originalType: BlockData['type']): BlockData {
  // Strip title/body from SlideData when converting back to BlockData
  switch (slideData.type) {
    case 'grid-item':
      return { type: 'grid-item', items: slideData.items, variant: slideData.variant, columns: slideData.columns, gap: slideData.gap }
    case 'sequence':
      return { type: 'sequence', steps: slideData.steps, variant: slideData.variant, direction: slideData.direction, gap: slideData.gap }
    case 'compare':
      return { type: 'compare', mode: slideData.mode, sides: slideData.sides, quadrantItems: slideData.quadrantItems, xAxis: slideData.xAxis, yAxis: slideData.yAxis, visible: slideData.visible, hidden: slideData.hidden }
    case 'funnel':
      return { type: 'funnel', layers: slideData.layers, variant: slideData.variant }
    case 'concentric':
      return { type: 'concentric', rings: slideData.rings, variant: slideData.variant }
    case 'hub-spoke':
      return { type: 'hub-spoke', center: slideData.center, spokes: slideData.spokes, variant: slideData.variant }
    case 'venn':
      return { type: 'venn', sets: slideData.sets, variant: slideData.variant, intersectionLabel: slideData.intersectionLabel }
    case 'chart':
      return { type: 'chart', chartType: slideData.chartType, bars: slideData.bars, slices: slideData.slices, innerRadius: slideData.innerRadius, categories: slideData.categories, lineSeries: slideData.lineSeries, indicators: slideData.indicators, radarSeries: slideData.radarSeries, highlight: slideData.highlight }
    default:
      // Should not happen, but return original
      return { type: 'title-body', title: '', body: '' }
  }
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      />
    </label>
  )
}

function ImageBlockEditor({ data, onChange }: { data: Extract<BlockData, { type: 'image' }>; onChange: (d: BlockData) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      onChange({ ...data, src: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase flex items-center gap-2">
        <span>图片</span>
        <span className="flex-1 h-px bg-gray-100" />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {data.src ? (
        <div className="space-y-2">
          <div className="h-24 rounded-lg overflow-hidden border border-gray-200">
            <img src={data.src} alt={data.alt || ''} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 px-2.5 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
            >
              替换图片
            </button>
            <button
              onClick={() => onChange({ ...data, src: undefined })}
              className="px-2.5 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer transition-colors"
            >
              移除
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full px-2.5 py-2 text-xs rounded-md border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-colors"
        >
          选择图片
        </button>
      )}

      <TextInput label="占位提示" value={data.placeholder ?? ''} onChange={(v) => onChange({ ...data, placeholder: v })} />
      <TextInput label="替代文本" value={data.alt ?? ''} onChange={(v) => onChange({ ...data, alt: v })} />

      <label className="block">
        <span className="text-[11px] text-gray-500 font-medium">适配方式</span>
        <select
          value={data.fit || 'cover'}
          onChange={(e) => onChange({ ...data, fit: e.target.value as 'cover' | 'contain' | 'fill' })}
          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
        >
          <option value="cover">Cover（裁剪填满）</option>
          <option value="contain">Contain（完整显示）</option>
          <option value="fill">Fill（拉伸填满）</option>
        </select>
      </label>
    </div>
  )
}

export default function BlockDataEditor({ data, onChange }: BlockDataEditorProps) {
  // Title-body block: simple inline editor
  if (data.type === 'title-body') {
    return (
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase flex items-center gap-2">
          <span>文本内容</span>
          <span className="flex-1 h-px bg-gray-100" />
        </div>
        <TextInput label="标题" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
        <TextInput label="正文" value={data.body ?? ''} onChange={(v) => onChange({ ...data, body: v })} />
      </div>
    )
  }

  // Image block: dedicated editor
  if (data.type === 'image') {
    return <ImageBlockEditor data={data} onChange={onChange} />
  }

  // For all other types, convert to SlideData and use SlideDataEditor
  const slideData = blockToSlideData(data)
  if (!slideData) return null

  return (
    <SlideDataEditor
      data={slideData}
      onChange={(newSlideData) => {
        const newBlock = slideDataToBlock(newSlideData, data.type)
        onChange(newBlock)
      }}
      isBlock
    />
  )
}
