import type {
  SlideData, ChartSlideData, GridItemSlideData, SequenceSlideData,
  CompareSlideData, FunnelSlideData, ConcentricSlideData, HubSpokeSlideData,
  VennSlideData, ChartType, GridItemVariant, SequenceVariant, FunnelVariant,
  ConcentricVariant, HubSpokeVariant, VennVariant,
} from './types'

// ─── Common intermediate representation ───

export interface CommonItem {
  name: string
  description?: string
  value?: number
}

export interface CommonSlideData {
  title: string
  body?: string
  items: CommonItem[]
}

// ─── Extract ───

export function extractCommonItems(data: SlideData): CommonSlideData {
  const base = { title: data.title, body: 'body' in data ? (data as { body?: string }).body : undefined }

  switch (data.type) {
    case 'title':
      return { ...base, body: data.subtitle, items: [] }

    case 'key-point':
      return { ...base, items: [] }

    case 'chart':
      return { ...base, items: extractChartItems(data) }

    case 'grid-item':
      return {
        ...base,
        items: data.items.map((it) => ({
          name: it.title,
          description: it.description,
          value: it.value ? parseFloat(it.value) || undefined : undefined,
        })),
      }

    case 'sequence':
      return {
        ...base,
        items: data.steps.map((s) => ({ name: s.label, description: s.description })),
      }

    case 'compare':
      return { ...base, items: extractCompareItems(data) }

    case 'funnel':
      return {
        ...base,
        items: data.layers.map((l) => ({ name: l.label, description: l.description, value: l.value })),
      }

    case 'concentric':
      return {
        ...base,
        items: data.rings.map((r) => ({ name: r.label, description: r.description })),
      }

    case 'hub-spoke':
      return {
        ...base,
        items: [
          { name: data.center.label, description: data.center.description },
          ...data.spokes.map((s) => ({ name: s.label, description: s.description })),
        ],
      }

    case 'venn':
      return {
        ...base,
        items: data.sets.map((s) => ({ name: s.label, description: s.description })),
      }

    case 'block-slide':
      return { ...base, items: [] }
  }
}

function extractChartItems(data: ChartSlideData): CommonItem[] {
  switch (data.chartType) {
    case 'bar':
    case 'horizontal-bar':
    case 'stacked-bar':
      return (data.bars ?? []).map((b) => ({
        name: b.category,
        value: b.values[0]?.value,
      }))
    case 'pie':
    case 'donut':
    case 'rose':
      return (data.slices ?? []).map((s) => ({
        name: s.name,
        value: s.value,
      }))
    case 'line':
    case 'area':
      return (data.categories ?? []).map((cat, i) => ({
        name: cat,
        value: data.lineSeries?.[0]?.data[i],
      }))
    case 'radar':
      return (data.indicators ?? []).map((ind, i) => ({
        name: ind.name,
        value: data.radarSeries?.[0]?.values[i],
      }))
    case 'proportion':
      return (data.proportionItems ?? []).map((p) => ({
        name: p.name,
        value: p.value,
      }))
    case 'waterfall':
      return (data.waterfallItems ?? []).map((w) => ({
        name: w.name,
        value: w.value,
      }))
    case 'combo':
      return (data.categories ?? []).map((cat, i) => ({
        name: cat,
        value: data.comboSeries?.[0]?.data[i],
      }))
    case 'scatter':
      return (data.scatterSeries ?? []).flatMap((s) =>
        s.data.map((d, i) => ({
          name: `${s.name} ${i + 1}`,
          value: d[1],
        })),
      )
    case 'gauge':
      return data.gaugeData ? [{ name: data.gaugeData.name || '值', value: data.gaugeData.value }] : []
  }
}

function extractCompareItems(data: CompareSlideData): CommonItem[] {
  switch (data.mode) {
    case 'versus':
      return (data.sides ?? []).map((side) => ({
        name: side.name,
        description: side.items.map((it) => `${it.label}: ${it.value}`).join('; '),
      }))
    case 'iceberg':
      return [
        ...(data.visible ?? []).map((it) => ({ name: it.label, description: it.description })),
        ...(data.hidden ?? []).map((it) => ({ name: it.label, description: it.description })),
      ]
    case 'quadrant':
      return (data.quadrantItems ?? []).map((it) => ({
        name: it.label,
        value: (it.x + it.y) / 2,
      }))
  }
}

// ─── Convert ───

type TargetType = SlideData['type']

export function convertToType(source: SlideData, targetType: TargetType, targetVariant?: string): SlideData {
  // Same type → just change variant
  if (source.type === targetType) {
    return applyVariant(source, targetVariant)
  }

  // Chart internal switch
  if (source.type === 'chart' && targetType === 'chart') {
    return { ...source, chartType: (targetVariant as ChartType) ?? 'bar' }
  }

  const common = extractCommonItems(source)
  const items = common.items.length > 0 ? common.items : generatePlaceholder()

  return buildTarget(targetType, common.title, common.body, items, targetVariant)
}

function generatePlaceholder(): CommonItem[] {
  return [
    { name: '项目 1', description: '描述内容', value: 40 },
    { name: '项目 2', description: '描述内容', value: 30 },
    { name: '项目 3', description: '描述内容', value: 20 },
  ]
}

function applyVariant(data: SlideData, variant?: string): SlideData {
  if (!variant) return data
  switch (data.type) {
    case 'grid-item': return { ...data, variant: variant as GridItemVariant }
    case 'sequence': return { ...data, variant: variant as SequenceVariant }
    case 'compare': return { ...data, mode: variant as 'versus' | 'quadrant' | 'iceberg' }
    case 'funnel': return { ...data, variant: variant as FunnelVariant }
    case 'concentric': return { ...data, variant: variant as ConcentricVariant }
    case 'hub-spoke': return { ...data, variant: variant as HubSpokeVariant }
    case 'venn': return { ...data, variant: variant as VennVariant }
    case 'chart': return { ...data, chartType: variant as ChartType }
    default: return data
  }
}

function buildTarget(
  type: TargetType, title: string, body: string | undefined,
  items: CommonItem[], variant?: string,
): SlideData {
  switch (type) {
    case 'title':
      return { type: 'title', title, subtitle: body ?? items.map((i) => i.name).join('、') }

    case 'key-point':
      return { type: 'key-point', title, body: body ?? items.map((i) => i.name).join('、') }

    case 'chart':
      return buildChart(title, body, items, (variant as ChartType) ?? 'bar')

    case 'grid-item':
      return {
        type: 'grid-item', title, body,
        items: items.map((i) => ({ title: i.name, description: i.description, value: i.value != null ? String(i.value) : undefined })),
        variant: (variant as GridItemVariant) ?? 'solid',
      }

    case 'sequence':
      return {
        type: 'sequence', title, body,
        steps: items.map((i) => ({ label: i.name, description: i.description })),
        variant: (variant as SequenceVariant) ?? 'timeline',
      }

    case 'compare':
      return buildCompare(title, body, items, (variant as 'versus' | 'quadrant' | 'iceberg') ?? 'versus')

    case 'funnel':
      return {
        type: 'funnel', title, body,
        layers: items.map((i) => ({ label: i.name, description: i.description, value: i.value })),
        variant: (variant as FunnelVariant) ?? 'funnel',
      }

    case 'concentric':
      return {
        type: 'concentric', title, body,
        rings: items.slice(0, 5).map((i) => ({ label: i.name, description: i.description })),
        variant: (variant as ConcentricVariant) ?? 'circles',
      }

    case 'hub-spoke':
      return {
        type: 'hub-spoke', title, body,
        center: { label: items[0]?.name ?? title, description: items[0]?.description },
        spokes: (items.length > 1 ? items.slice(1) : items).map((i) => ({ label: i.name, description: i.description })),
        variant: (variant as HubSpokeVariant) ?? 'orbit',
      }

    case 'venn':
      return {
        type: 'venn', title, body,
        sets: items.slice(0, 4).map((i) => ({ label: i.name, description: i.description })),
        variant: (variant as VennVariant) ?? 'classic',
      }

    case 'block-slide':
      return { type: 'block-slide', title, blocks: [] }
  }
}

function buildChart(title: string, body: string | undefined, items: CommonItem[], chartType: ChartType): ChartSlideData {
  const withValues = items.map((i) => ({ ...i, value: i.value ?? Math.floor(Math.random() * 80) + 20 }))

  switch (chartType) {
    case 'bar':
      return {
        type: 'chart', chartType: 'bar', title, body,
        bars: withValues.map((i) => ({ category: i.name, values: [{ name: '值', value: i.value }] })),
      }
    case 'horizontal-bar':
      return {
        type: 'chart', chartType: 'horizontal-bar', title, body,
        bars: withValues.map((i) => ({ category: i.name, values: [{ name: '值', value: i.value }] })),
      }
    case 'stacked-bar':
      return {
        type: 'chart', chartType: 'stacked-bar', title, body,
        bars: withValues.map((i) => ({ category: i.name, values: [{ name: '系列A', value: Math.round(i.value * 0.6) }, { name: '系列B', value: Math.round(i.value * 0.4) }] })),
      }
    case 'pie':
      return {
        type: 'chart', chartType: 'pie', title, body,
        slices: withValues.map((i) => ({ name: i.name, value: i.value })),
      }
    case 'donut':
      return {
        type: 'chart', chartType: 'donut', title, body,
        slices: withValues.map((i) => ({ name: i.name, value: i.value })),
      }
    case 'rose':
      return {
        type: 'chart', chartType: 'rose', title, body,
        slices: withValues.map((i) => ({ name: i.name, value: i.value })),
      }
    case 'line':
      return {
        type: 'chart', chartType: 'line', title, body,
        categories: items.map((i) => i.name),
        lineSeries: [{ name: '数据', data: withValues.map((i) => i.value) }],
      }
    case 'area':
      return {
        type: 'chart', chartType: 'area', title, body,
        categories: items.map((i) => i.name),
        lineSeries: [{ name: '数据', data: withValues.map((i) => i.value) }],
      }
    case 'radar':
      return {
        type: 'chart', chartType: 'radar', title, body,
        indicators: withValues.map((i) => ({ name: i.name, max: Math.max(i.value * 1.5, 100) })),
        radarSeries: [{ name: '数据', values: withValues.map((i) => i.value) }],
      }
    case 'proportion':
      return {
        type: 'chart', chartType: 'proportion', title, body,
        proportionItems: withValues.map((i) => ({ name: i.name, value: i.value, max: 100 })),
      }
    case 'waterfall': {
      const wItems = withValues.map((i, idx) => ({
        name: i.name,
        value: i.value,
        type: (idx === 0 ? 'total' : idx === withValues.length - 1 ? 'total' : 'increase') as 'total' | 'increase' | 'decrease',
      }))
      return { type: 'chart', chartType: 'waterfall', title, body, waterfallItems: wItems }
    }
    case 'combo':
      return {
        type: 'chart', chartType: 'combo', title, body,
        categories: items.map((i) => i.name),
        comboSeries: [
          { name: '数值', data: withValues.map((i) => i.value), seriesType: 'bar' },
          { name: '趋势', data: withValues.map((i) => Math.round(i.value * 0.3)), seriesType: 'line', yAxisIndex: 1 },
        ],
      }
    case 'scatter':
      return {
        type: 'chart', chartType: 'scatter', title, body,
        scatterSeries: [{ name: '数据', data: withValues.map((i, idx) => [idx * 20 + 10, i.value] as [number, number]) }],
      }
    case 'gauge':
      return {
        type: 'chart', chartType: 'gauge', title, body,
        gaugeData: { value: withValues[0]?.value ?? 50, max: 100, name: items[0]?.name ?? '完成率' },
      }
  }
}

function buildCompare(
  title: string, body: string | undefined,
  items: CommonItem[], mode: 'versus' | 'quadrant' | 'iceberg',
): CompareSlideData {
  switch (mode) {
    case 'versus': {
      const mid = Math.ceil(items.length / 2)
      const left = items.slice(0, mid)
      const right = items.slice(mid)
      return {
        type: 'compare', title, body, mode: 'versus',
        sides: [
          { name: left[0]?.name ?? '方案 A', items: left.map((i) => ({ label: i.name, value: i.description ?? String(i.value ?? '') })) },
          { name: right[0]?.name ?? '方案 B', items: right.map((i) => ({ label: i.name, value: i.description ?? String(i.value ?? '') })) },
        ],
      }
    }
    case 'iceberg': {
      const mid = Math.ceil(items.length / 2)
      return {
        type: 'compare', title, body, mode: 'iceberg',
        visible: items.slice(0, mid).map((i) => ({ label: i.name, description: i.description })),
        hidden: items.slice(mid).map((i) => ({ label: i.name, description: i.description })),
      }
    }
    case 'quadrant':
      return {
        type: 'compare', title, body, mode: 'quadrant',
        quadrantItems: items.map((i, idx) => ({
          label: i.name,
          x: ((idx % 3) + 1) * 25,
          y: (Math.floor(idx / 3) + 1) * 25,
        })),
        xAxis: '维度 X',
        yAxis: '维度 Y',
      }
  }
}

// ─── Create Default Slide ───

export function createDefaultSlide(type: SlideData['type']): SlideData {
  switch (type) {
    case 'title':
      return { type: 'title', title: '新页面', subtitle: '在此添加副标题' }

    case 'key-point':
      return { type: 'key-point', title: '核心观点', body: '在此添加详细说明内容' }

    case 'chart':
      return {
        type: 'chart', chartType: 'bar', title: '数据概览',
        bars: [
          { category: '第一季度', values: [{ name: '销售额', value: 45 }] },
          { category: '第二季度', values: [{ name: '销售额', value: 62 }] },
          { category: '第三季度', values: [{ name: '销售额', value: 38 }] },
          { category: '第四季度', values: [{ name: '销售额', value: 71 }] },
        ],
      }

    case 'grid-item':
      return {
        type: 'grid-item', title: '项目概览', variant: 'solid',
        items: [
          { title: '项目一', description: '描述内容' },
          { title: '项目二', description: '描述内容' },
          { title: '项目三', description: '描述内容' },
          { title: '项目四', description: '描述内容' },
        ],
      }

    case 'sequence':
      return {
        type: 'sequence', title: '流程步骤', variant: 'timeline',
        steps: [
          { label: '第一步', description: '开始阶段' },
          { label: '第二步', description: '执行阶段' },
          { label: '第三步', description: '完成阶段' },
        ],
      }

    case 'compare':
      return {
        type: 'compare', title: '方案对比', mode: 'versus',
        sides: [
          { name: '方案 A', items: [{ label: '优势', value: '成本低' }, { label: '特点', value: '快速部署' }] },
          { name: '方案 B', items: [{ label: '优势', value: '性能强' }, { label: '特点', value: '高扩展性' }] },
        ],
      }

    case 'funnel':
      return {
        type: 'funnel', title: '转化漏斗', variant: 'funnel',
        layers: [
          { label: '访问', value: 1000 },
          { label: '注册', value: 600 },
          { label: '付费', value: 200 },
        ],
      }

    case 'concentric':
      return {
        type: 'concentric', title: '层级结构', variant: 'circles',
        rings: [
          { label: '核心', description: '基础能力' },
          { label: '中层', description: '扩展能力' },
          { label: '外层', description: '生态系统' },
        ],
      }

    case 'hub-spoke':
      return {
        type: 'hub-spoke', title: '中心辐射', variant: 'orbit',
        center: { label: '核心', description: '中心节点' },
        spokes: [
          { label: '节点一', description: '描述' },
          { label: '节点二', description: '描述' },
          { label: '节点三', description: '描述' },
          { label: '节点四', description: '描述' },
        ],
      }

    case 'venn':
      return {
        type: 'venn', title: '交集分析', variant: 'classic',
        sets: [
          { label: '集合 A', description: '第一个维度' },
          { label: '集合 B', description: '第二个维度' },
        ],
        intersectionLabel: '交集',
      }

    case 'block-slide':
      return {
        type: 'block-slide', title: '新页面',
        blocks: [{ id: 'b1', x: 10, y: 5, width: 80, height: 25, data: { type: 'title-body', title: '新页面', body: '在此添加内容' } }],
      }
  }
}

// ─── Smart Recommendations ───

export interface LayoutRecommendation {
  type: SlideData['type']
  variant?: string
  reason: string
  score: number
}

export function recommendLayout(data: SlideData): LayoutRecommendation[] {
  const common = extractCommonItems(data)
  const { items } = common
  const n = items.length
  const hasValues = items.some((i) => i.value != null)
  const hasDescriptions = items.some((i) => i.description)
  const values = items.filter((i) => i.value != null).map((i) => i.value!)
  const valuesSum = values.reduce((a, b) => a + b, 0)
  const isDecreasing = values.length >= 3 && values.every((v, i) => i === 0 || v <= values[i - 1])

  const recs: LayoutRecommendation[] = []

  if (n === 0) {
    recs.push({ type: 'key-point', reason: '无数据项，适合关键点展示', score: 90 })
    recs.push({ type: 'title', reason: '纯标题展示', score: 85 })
  }

  if (n === 2) {
    recs.push({ type: 'compare', variant: 'versus', reason: '两项数据适合对比', score: 90 })
  }

  if (hasValues && n >= 3) {
    recs.push({ type: 'chart', variant: 'bar', reason: '数值数据适合柱状图', score: 85 })
  }

  if (hasValues && valuesSum >= 80 && valuesSum <= 120 && values.length >= 2) {
    recs.push({ type: 'chart', variant: 'pie', reason: '占比数据适合饼图', score: 88 })
  }

  if (isDecreasing && n >= 3) {
    recs.push({ type: 'funnel', variant: 'funnel', reason: '递减数据适合漏斗图', score: 82 })
  }

  if (n >= 3 && n <= 7 && !hasValues) {
    recs.push({ type: 'sequence', variant: 'timeline', reason: '适合流程/时间线展示', score: 78 })
  }

  if (n >= 2 && n <= 6 && hasDescriptions) {
    recs.push({ type: 'grid-item', variant: 'solid', reason: '有描述信息，适合卡片网格', score: 75 })
  }

  if (n > 6) {
    recs.push({ type: 'grid-item', variant: 'outline', reason: '大量项目适合网格展示', score: 72 })
  }

  // Filter out current type, sort by score, return top 3
  return recs
    .filter((r) => r.type !== data.type || r.variant !== getVariant(data))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

function getVariant(data: SlideData): string | undefined {
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
