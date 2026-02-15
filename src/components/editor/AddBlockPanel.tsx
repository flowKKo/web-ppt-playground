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
  { label: '循环', category: '图解', createData: () => ({ type: 'cycle', steps: [{ label: '计划' }, { label: '执行' }, { label: '检查' }, { label: '改进' }], variant: 'circular' }) },
  { label: '表格', category: '图解', createData: () => ({ type: 'table', headers: ['项目', '状态', '进度'], rows: [{ cells: ['任务A', '进行中', '60%'] }, { cells: ['任务B', '已完成', '100%'], highlight: true }, { cells: ['任务C', '待开始', '0%'] }], variant: 'striped' }) },
  { label: '路线图', category: '图解', createData: () => ({ type: 'roadmap', phases: [{ label: 'Q1', items: [{ label: '需求分析', status: 'done' }, { label: '设计', status: 'done' }] }, { label: 'Q2', items: [{ label: '开发', status: 'active' }, { label: '测试', status: 'pending' }] }, { label: 'Q3', items: [{ label: '上线', status: 'pending' }] }], variant: 'horizontal' }) },
  { label: 'SWOT', category: '图解', createData: () => ({ type: 'swot', strengths: [{ label: '品牌知名度', description: '市场领先' }], weaknesses: [{ label: '研发周期长' }], opportunities: [{ label: '新兴市场' }], threats: [{ label: '竞争加剧' }] }) },
  { label: '思维导图', category: '图解', createData: () => ({ type: 'mindmap', root: { label: '中心主题', children: [{ label: '分支一', children: [{ label: '子项A' }, { label: '子项B' }] }, { label: '分支二', children: [{ label: '子项C' }] }, { label: '分支三' }] } }) },
  { label: '堆叠', category: '图解', createData: () => ({ type: 'stack', layers: [{ label: '表现层', description: 'UI/UX' }, { label: '业务层', description: '核心逻辑' }, { label: '数据层', description: '存储/缓存' }], variant: 'horizontal' }) },
  // Charts
  { label: '柱状图', category: '图表', createData: () => ({ type: 'chart', chartType: 'bar', bars: [{ category: 'Q1', values: [{ name: '值', value: 45 }] }, { category: 'Q2', values: [{ name: '值', value: 62 }] }, { category: 'Q3', values: [{ name: '值', value: 38 }] }] }) },
  { label: '饼图', category: '图表', createData: () => ({ type: 'chart', chartType: 'pie', slices: [{ name: '项目A', value: 40 }, { name: '项目B', value: 35 }, { name: '项目C', value: 25 }] }) },
  { label: '折线图', category: '图表', createData: () => ({ type: 'chart', chartType: 'line', categories: ['一月', '二月', '三月'], lineSeries: [{ name: '数据', data: [30, 45, 60] }] }) },
  { label: '雷达图', category: '图表', createData: () => ({ type: 'chart', chartType: 'radar', indicators: [{ name: '速度', max: 100 }, { name: '质量', max: 100 }, { name: '成本', max: 100 }], radarSeries: [{ name: '数据', values: [80, 60, 70] }] }) },
  { label: '横向柱状', category: '图表', createData: () => ({ type: 'chart', chartType: 'horizontal-bar', bars: [{ category: 'A', values: [{ name: '值', value: 85 }] }, { category: 'B', values: [{ name: '值', value: 62 }] }, { category: 'C', values: [{ name: '值', value: 45 }] }] }) },
  { label: '圆环图', category: '图表', createData: () => ({ type: 'chart', chartType: 'donut', slices: [{ name: '项目A', value: 40 }, { name: '项目B', value: 35 }, { name: '项目C', value: 25 }] }) },
  { label: '比例图', category: '图表', createData: () => ({ type: 'chart', chartType: 'proportion', proportionItems: [{ name: '完成率', value: 78 }, { name: '达标率', value: 92 }, { name: '覆盖率', value: 65 }] }) },
  { label: '堆叠柱状', category: '图表', createData: () => ({ type: 'chart', chartType: 'stacked-bar', bars: [{ category: 'Q1', values: [{ name: '产品A', value: 30 }, { name: '产品B', value: 20 }] }, { category: 'Q2', values: [{ name: '产品A', value: 45 }, { name: '产品B', value: 25 }] }, { category: 'Q3', values: [{ name: '产品A', value: 38 }, { name: '产品B', value: 32 }] }] }) },
  { label: '面积图', category: '图表', createData: () => ({ type: 'chart', chartType: 'area', categories: ['一月', '二月', '三月', '四月'], lineSeries: [{ name: '数据', data: [30, 45, 60, 72] }] }) },
  { label: '玫瑰图', category: '图表', createData: () => ({ type: 'chart', chartType: 'rose', slices: [{ name: '项目A', value: 40 }, { name: '项目B', value: 35 }, { name: '项目C', value: 25 }, { name: '项目D', value: 18 }] }) },
  { label: '瀑布图', category: '图表', createData: () => ({ type: 'chart', chartType: 'waterfall', waterfallItems: [{ name: '收入', value: 100, type: 'total' }, { name: '成本', value: -30, type: 'decrease' }, { name: '运营', value: -20, type: 'decrease' }, { name: '利润', value: 50, type: 'total' }] }) },
  { label: '组合图', category: '图表', createData: () => ({ type: 'chart', chartType: 'combo', categories: ['Q1', 'Q2', 'Q3', 'Q4'], comboSeries: [{ name: '收入', data: [120, 150, 180, 210], seriesType: 'bar' }, { name: '增长率', data: [15, 25, 20, 17], seriesType: 'line', yAxisIndex: 1 }] }) },
  { label: '散点图', category: '图表', createData: () => ({ type: 'chart', chartType: 'scatter', scatterSeries: [{ name: '数据', data: [[10, 20], [30, 50], [50, 40], [70, 80], [90, 60]] }], scatterXAxis: 'X轴', scatterYAxis: 'Y轴' }) },
  { label: '仪表盘', category: '图表', createData: () => ({ type: 'chart', chartType: 'gauge', gaugeData: { value: 72, max: 100, name: '完成率' } }) },
  { label: '矩形树图', category: '图表', createData: () => ({ type: 'chart', chartType: 'treemap', treemapData: [{ name: '类别A', value: 50, children: [{ name: '子项1', value: 30 }, { name: '子项2', value: 20 }] }, { name: '类别B', value: 35 }, { name: '类别C', value: 15 }] }) },
  { label: '桑基图', category: '图表', createData: () => ({ type: 'chart', chartType: 'sankey', sankeyNodes: [{ name: '来源A' }, { name: '来源B' }, { name: '中间' }, { name: '目标X' }, { name: '目标Y' }], sankeyLinks: [{ source: '来源A', target: '中间', value: 40 }, { source: '来源B', target: '中间', value: 30 }, { source: '中间', target: '目标X', value: 45 }, { source: '中间', target: '目标Y', value: 25 }] }) },
  { label: '热力图', category: '图表', createData: () => ({ type: 'chart', chartType: 'heatmap', categories: ['周一', '周二', '周三', '周四', '周五'], heatmapYCategories: ['上午', '下午', '晚上'], heatmapData: [[0,0,5],[1,0,7],[2,0,3],[3,0,8],[4,0,6],[0,1,9],[1,1,4],[2,1,6],[3,1,5],[4,1,8],[0,2,3],[1,2,6],[2,2,8],[3,2,4],[4,2,7]] }) },
  { label: '旭日图', category: '图表', createData: () => ({ type: 'chart', chartType: 'sunburst', sunburstData: [{ name: '部门A', children: [{ name: '团队1', value: 30 }, { name: '团队2', value: 20 }] }, { name: '部门B', children: [{ name: '团队3', value: 25 }, { name: '团队4', value: 15 }] }] }) },
  { label: '箱线图', category: '图表', createData: () => ({ type: 'chart', chartType: 'boxplot', boxplotItems: [{ name: '组A', values: [20, 35, 45, 60, 80] }, { name: '组B', values: [15, 28, 42, 55, 72] }, { name: '组C', values: [30, 40, 50, 65, 85] }] }) },
  { label: '甘特图', category: '图表', createData: () => ({ type: 'chart', chartType: 'gantt', ganttTasks: [{ name: '需求分析', start: 0, end: 3, category: '规划' }, { name: '设计', start: 2, end: 5, category: '规划' }, { name: '开发', start: 4, end: 9, category: '执行' }, { name: '测试', start: 8, end: 11, category: '执行' }, { name: '上线', start: 10, end: 12, category: '交付' }] }) },
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
