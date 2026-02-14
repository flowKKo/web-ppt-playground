import type { ContentBlock, BlockData } from '../../data/types'

interface AddBlockPanelProps {
  onAdd: (block: ContentBlock) => void
}

let blockCounter = 0
function nextBlockId(): string {
  return `blk-${Date.now()}-${++blockCounter}`
}

interface BlockOption {
  label: string
  category: string
  createData: () => BlockData
}

const BLOCK_OPTIONS: BlockOption[] = [
  // Text
  { label: '标题文本', category: '文本', createData: () => ({ type: 'title-body', title: '新标题', body: '正文内容' }) },
  // Diagrams
  { label: '网格', category: '图解', createData: () => ({ type: 'grid-item', items: [{ title: '项目一', description: '描述' }, { title: '项目二', description: '描述' }, { title: '项目三', description: '描述' }], variant: 'solid' }) },
  { label: '序列', category: '图解', createData: () => ({ type: 'sequence', steps: [{ label: '步骤一' }, { label: '步骤二' }, { label: '步骤三' }], variant: 'timeline' }) },
  { label: '对比', category: '图解', createData: () => ({ type: 'compare', mode: 'versus', sides: [{ name: '方案A', items: [{ label: '特性', value: '值' }] }, { name: '方案B', items: [{ label: '特性', value: '值' }] }] }) },
  { label: '漏斗', category: '图解', createData: () => ({ type: 'funnel', layers: [{ label: '访问', value: 1000 }, { label: '注册', value: 600 }, { label: '付费', value: 200 }], variant: 'funnel' }) },
  { label: '同心圆', category: '图解', createData: () => ({ type: 'concentric', rings: [{ label: '核心' }, { label: '中层' }, { label: '外层' }], variant: 'circles' }) },
  { label: '轮辐', category: '图解', createData: () => ({ type: 'hub-spoke', center: { label: '核心' }, spokes: [{ label: '节点一' }, { label: '节点二' }, { label: '节点三' }], variant: 'orbit' }) },
  { label: '韦恩', category: '图解', createData: () => ({ type: 'venn', sets: [{ label: '集合A' }, { label: '集合B' }], variant: 'classic' }) },
  // Charts
  { label: '柱状图', category: '图表', createData: () => ({ type: 'chart', chartType: 'bar', bars: [{ category: 'Q1', values: [{ name: '值', value: 45 }] }, { category: 'Q2', values: [{ name: '值', value: 62 }] }, { category: 'Q3', values: [{ name: '值', value: 38 }] }] }) },
  { label: '饼图', category: '图表', createData: () => ({ type: 'chart', chartType: 'pie', slices: [{ name: '项目A', value: 40 }, { name: '项目B', value: 35 }, { name: '项目C', value: 25 }] }) },
  { label: '折线图', category: '图表', createData: () => ({ type: 'chart', chartType: 'line', categories: ['一月', '二月', '三月'], lineSeries: [{ name: '数据', data: [30, 45, 60] }] }) },
  { label: '雷达图', category: '图表', createData: () => ({ type: 'chart', chartType: 'radar', indicators: [{ name: '速度', max: 100 }, { name: '质量', max: 100 }, { name: '成本', max: 100 }], radarSeries: [{ name: '数据', values: [80, 60, 70] }] }) },
  // Media
  { label: '图片', category: '媒体', createData: () => ({ type: 'image', placeholder: '点击添加图片' }) },
]

const categories = ['文本', '图解', '图表', '媒体']

export default function AddBlockPanel({ onAdd }: AddBlockPanelProps) {
  const handleAdd = (option: BlockOption) => {
    const block: ContentBlock = {
      id: nextBlockId(),
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      data: option.createData(),
    }
    onAdd(block)
  }

  return (
    <div className="p-3 space-y-3">
      {categories.map((cat) => (
        <div key={cat}>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{cat}</div>
          <div className="flex flex-wrap gap-1.5">
            {BLOCK_OPTIONS.filter((o) => o.category === cat).map((option) => (
              <button
                key={option.label}
                onClick={() => handleAdd(option)}
                className="px-2.5 py-1 text-xs rounded-md cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
