import type { SlideData } from '../../data/types'
import { convertToType } from '../../data/type-converter'
import { TYPE_LIST, TypeThumbnail, type SlideType } from './TypeThumbnails'

interface LayoutPickerProps {
  data: SlideData
  onChange: (data: SlideData) => void
}

// ─── Variant configs ───

const VARIANT_OPTIONS: Partial<Record<SlideType, { field: string; options: { value: string; label: string }[] }>> = {
  'grid-item': {
    field: 'variant',
    options: [
      { value: 'solid', label: '填充' },
      { value: 'outline', label: '描边' },
      { value: 'sideline', label: '侧线' },
      { value: 'topline', label: '顶线' },
      { value: 'top-circle', label: '圆形' },
      { value: 'joined', label: '连接' },
      { value: 'leaf', label: '叶片' },
      { value: 'labeled', label: '标签' },
      { value: 'alternating', label: '交替' },
      { value: 'pillar', label: '柱体' },
      { value: 'diamonds', label: '菱形' },
      { value: 'signs', label: '标牌' },
    ],
  },
  'sequence': {
    field: 'variant',
    options: [
      { value: 'timeline', label: '时间线' },
      { value: 'chain', label: '链式' },
      { value: 'arrows', label: '箭头' },
      { value: 'pills', label: '胶囊' },
      { value: 'ribbon-arrows', label: '丝带' },
      { value: 'numbered', label: '编号' },
      { value: 'zigzag', label: '折线' },
    ],
  },
  'compare': {
    field: 'mode',
    options: [
      { value: 'versus', label: '对比' },
      { value: 'quadrant', label: '象限' },
      { value: 'iceberg', label: '冰山' },
    ],
  },
  'funnel': {
    field: 'variant',
    options: [
      { value: 'funnel', label: '漏斗' },
      { value: 'pyramid', label: '金字塔' },
      { value: 'slope', label: '斜坡' },
    ],
  },
  'concentric': {
    field: 'variant',
    options: [
      { value: 'circles', label: '圆环' },
      { value: 'diamond', label: '菱形' },
      { value: 'target', label: '靶心' },
    ],
  },
  'hub-spoke': {
    field: 'variant',
    options: [
      { value: 'orbit', label: '轨道' },
      { value: 'solar', label: '太阳' },
      { value: 'pinwheel', label: '风车' },
    ],
  },
  'venn': {
    field: 'variant',
    options: [
      { value: 'classic', label: '经典' },
      { value: 'linear', label: '线性' },
      { value: 'linear-filled', label: '填充线性' },
    ],
  },
  'chart': {
    field: 'chartType',
    options: [
      { value: 'bar', label: '柱状' },
      { value: 'horizontal-bar', label: '横向柱状' },
      { value: 'stacked-bar', label: '堆叠柱状' },
      { value: 'pie', label: '饼图' },
      { value: 'donut', label: '圆环' },
      { value: 'rose', label: '玫瑰' },
      { value: 'line', label: '折线' },
      { value: 'area', label: '面积' },
      { value: 'radar', label: '雷达' },
      { value: 'proportion', label: '比例' },
      { value: 'waterfall', label: '瀑布' },
      { value: 'combo', label: '组合' },
      { value: 'scatter', label: '散点' },
      { value: 'gauge', label: '仪表盘' },
    ],
  },
}

function getCurrentVariant(data: SlideData): string | undefined {
  switch (data.type) {
    case 'grid-item': return data.variant
    case 'sequence': return data.variant
    case 'compare': return data.mode
    case 'funnel': return data.variant
    case 'concentric': return data.variant
    case 'hub-spoke': return data.variant
    case 'venn': return data.variant
    case 'chart': return data.chartType
    default: return undefined
  }
}

export default function LayoutPicker({ data, onChange }: LayoutPickerProps) {
  const handleTypeClick = (targetType: SlideType) => {
    if (targetType === data.type) return
    onChange(convertToType(data, targetType))
  }

  const handleVariantClick = (value: string) => {
    onChange(convertToType(data, data.type, value))
  }

  const variantConfig = VARIANT_OPTIONS[data.type]
  const currentVariant = getCurrentVariant(data)

  return (
    <div className="space-y-3">
      {/* A. Layout Types */}
      <div>
        <span className="text-xs font-semibold text-gray-600 uppercase">布局类型</span>
        <div className="grid grid-cols-5 gap-1.5 mt-1.5">
          {TYPE_LIST.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`flex flex-col items-center p-1 rounded cursor-pointer transition-all ${
                data.type === type
                  ? 'ring-2 ring-blue-400 bg-blue-50'
                  : 'hover:bg-gray-100 bg-gray-50'
              }`}
            >
              <div className="w-full aspect-[16/9]">
                <TypeThumbnail type={type} active={data.type === type} />
              </div>
              <span className="text-[10px] text-gray-600 mt-0.5 leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* B. Style Variants */}
      {variantConfig && (
        <div>
          <span className="text-xs font-semibold text-gray-600 uppercase">样式变体</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {variantConfig.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleVariantClick(opt.value)}
                className={`px-2 py-0.5 text-xs rounded-full cursor-pointer transition-all ${
                  currentVariant === opt.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
