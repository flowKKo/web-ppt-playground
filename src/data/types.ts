// ─── Shared ───
export type SemanticColor = 'positive' | 'negative' | 'neutral'

// ─── 1. Title ───
export interface TitleSlideData {
  type: 'title'
  title: string
  subtitle?: string
  badge?: string
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
}

// ─── 2. KeyPoint ───
export interface KeyPointSlideData {
  type: 'key-point'
  title: string
  subtitle?: string
  body?: string
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
}

// ─── 3. Chart (expanded) ───
export type ChartType = 'bar' | 'horizontal-bar' | 'stacked-bar' | 'pie' | 'donut' | 'rose' | 'line' | 'area' | 'radar' | 'proportion' | 'waterfall' | 'combo' | 'scatter' | 'gauge' | 'treemap' | 'sankey' | 'heatmap' | 'sunburst' | 'boxplot' | 'gantt'

export interface ChartBar {
  category: string
  values: { name: string; value: number; color?: SemanticColor }[]
}
export interface ChartSlice { name: string; value: number }
export interface LineSeries { name: string; data: number[]; area?: boolean }
export interface RadarIndicator { name: string; max: number }
export interface RadarSeries { name: string; values: number[] }
export interface ProportionItem { name: string; value: number; max?: number }
export interface WaterfallItem { name: string; value: number; type?: 'increase' | 'decrease' | 'total' }
export interface ComboSeries { name: string; data: number[]; seriesType: 'bar' | 'line'; yAxisIndex?: 0 | 1 }
export interface ScatterSeries { name: string; data: [number, number, number?][] }
export interface GaugeData { value: number; max?: number; name?: string }
export interface TreemapNode { name: string; value: number; children?: TreemapNode[] }
export interface SankeyNode { name: string }
export interface SankeyLink { source: string; target: string; value: number }
export interface SunburstNode { name: string; value?: number; children?: SunburstNode[] }
export interface BoxplotItem { name: string; values: [number, number, number, number, number] }
export interface GanttTask { name: string; start: number; end: number; category?: string }

export interface ChartSlideData {
  type: 'chart'
  chartType: ChartType
  title: string
  body?: string
  highlight?: string
  chartHeight?: number           // px, default auto-fills available space
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
  // bar
  bars?: ChartBar[]
  // pie
  slices?: ChartSlice[]
  innerRadius?: number
  // line
  categories?: string[]
  lineSeries?: LineSeries[]
  // radar
  indicators?: RadarIndicator[]
  radarSeries?: RadarSeries[]
  // proportion
  proportionItems?: ProportionItem[]
  // waterfall
  waterfallItems?: WaterfallItem[]
  // combo
  comboSeries?: ComboSeries[]
  // scatter
  scatterSeries?: ScatterSeries[]
  scatterXAxis?: string
  scatterYAxis?: string
  // gauge
  gaugeData?: GaugeData
  // treemap
  treemapData?: TreemapNode[]
  // sankey
  sankeyNodes?: SankeyNode[]
  sankeyLinks?: SankeyLink[]
  // heatmap
  heatmapYCategories?: string[]
  heatmapData?: [number, number, number][]
  // sunburst
  sunburstData?: SunburstNode[]
  // boxplot
  boxplotItems?: BoxplotItem[]
  // gantt
  ganttTasks?: GanttTask[]
}

// ─── 4. GridItem Engine ───
export type GridItemVariant =
  | 'solid' | 'outline' | 'sideline' | 'topline'
  | 'top-circle' | 'joined' | 'leaf' | 'labeled'
  | 'alternating' | 'pillar' | 'diamonds' | 'signs'

export interface GridItemEntry {
  title: string
  description?: string
  value?: string
  valueColor?: SemanticColor
}

export interface GridItemSlideData {
  type: 'grid-item'
  title: string
  body?: string
  items: GridItemEntry[]
  variant: GridItemVariant
  columns?: number
  gap?: number               // px, default 16
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 5. Sequence Engine ───
export type SequenceVariant =
  | 'timeline' | 'chain' | 'arrows' | 'pills'
  | 'ribbon-arrows' | 'numbered' | 'zigzag'

export interface SequenceStep {
  label: string
  description?: string
}

export interface SequenceSlideData {
  type: 'sequence'
  title: string
  body?: string
  steps: SequenceStep[]
  variant: SequenceVariant
  direction?: 'horizontal' | 'vertical'
  gap?: number               // px, default 8
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 6. Compare Engine ───
export interface CompareSide {
  name: string
  items: { label: string; value: string }[]
}
export interface QuadrantItem {
  label: string
  x: number
  y: number
}
export interface IcebergItem {
  label: string
  description?: string
}

export interface CompareSlideData {
  type: 'compare'
  title: string
  body?: string
  mode: 'versus' | 'quadrant' | 'iceberg'
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
  // versus
  sides?: CompareSide[]
  // quadrant
  quadrantItems?: QuadrantItem[]
  xAxis?: string
  yAxis?: string
  // iceberg
  visible?: IcebergItem[]
  hidden?: IcebergItem[]
}

// ─── 7. Funnel Engine ───
export type FunnelVariant = 'funnel' | 'pyramid' | 'slope'

export interface FunnelLayer {
  label: string
  description?: string
  value?: number
}

export interface FunnelSlideData {
  type: 'funnel'
  title: string
  body?: string
  layers: FunnelLayer[]
  variant: FunnelVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 8. Concentric Engine ───
export type ConcentricVariant = 'circles' | 'diamond' | 'target'

export interface ConcentricRing {
  label: string
  description?: string
}

export interface ConcentricSlideData {
  type: 'concentric'
  title: string
  body?: string
  rings: ConcentricRing[]
  variant: ConcentricVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 9. HubSpoke Engine ───
export type HubSpokeVariant = 'orbit' | 'solar' | 'pinwheel'

export interface HubSpokeSlideData {
  type: 'hub-spoke'
  title: string
  body?: string
  center: { label: string; description?: string }
  spokes: { label: string; description?: string }[]
  variant: HubSpokeVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 10. Venn Engine ───
export type VennVariant = 'classic' | 'linear' | 'linear-filled'

export interface VennSlideData {
  type: 'venn'
  title: string
  body?: string
  sets: { label: string; description?: string }[]
  intersectionLabel?: string
  variant: VennVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 12. Cycle Engine ───
export type CycleVariant = 'circular' | 'gear' | 'loop'

export interface CycleStep {
  label: string
  description?: string
}

export interface CycleSlideData {
  type: 'cycle'
  title: string
  body?: string
  steps: CycleStep[]
  variant: CycleVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 13. Table Engine ───
export type TableVariant = 'striped' | 'bordered' | 'highlight'

export interface TableRow {
  cells: string[]
  highlight?: boolean
}

export interface TableSlideData {
  type: 'table'
  title: string
  body?: string
  headers: string[]
  rows: TableRow[]
  variant: TableVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 14. Roadmap Engine ───
export type RoadmapVariant = 'horizontal' | 'vertical' | 'milestone'

export interface RoadmapItem {
  label: string
  status?: 'done' | 'active' | 'pending'
}

export interface RoadmapPhase {
  label: string
  items: RoadmapItem[]
}

export interface RoadmapSlideData {
  type: 'roadmap'
  title: string
  body?: string
  phases: RoadmapPhase[]
  variant: RoadmapVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 15. SWOT Engine ───
export interface SwotItem {
  label: string
  description?: string
}

export interface SwotSlideData {
  type: 'swot'
  title: string
  body?: string
  strengths: SwotItem[]
  weaknesses: SwotItem[]
  opportunities: SwotItem[]
  threats: SwotItem[]
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 16. Mindmap Engine ───
export interface MindmapNode {
  label: string
  children?: MindmapNode[]
}

export interface MindmapSlideData {
  type: 'mindmap'
  title: string
  body?: string
  root: MindmapNode
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── 17. Stack Engine ───
export type StackVariant = 'horizontal' | 'vertical' | 'offset'

export interface StackLayer {
  label: string
  description?: string
}

export interface StackSlideData {
  type: 'stack'
  title: string
  body?: string
  layers: StackLayer[]
  variant: StackVariant
  titleSize?: number
  bodySize?: number
  titleColor?: string
  textColor?: string
  colorPalette?: string
}

// ─── Union ───
export type SlideData =
  | TitleSlideData
  | KeyPointSlideData
  | ChartSlideData
  | GridItemSlideData
  | SequenceSlideData
  | CompareSlideData
  | FunnelSlideData
  | ConcentricSlideData
  | HubSpokeSlideData
  | VennSlideData
  | CycleSlideData
  | TableSlideData
  | RoadmapSlideData
  | SwotSlideData
  | MindmapSlideData
  | StackSlideData
  | BlockSlideData

// ─── Block Model ───

export type BlockData =
  | { type: 'title-body'; title: string; body?: string; titleSize?: number; bodySize?: number; titleColor?: string; textColor?: string }
  | { type: 'grid-item'; items: GridItemEntry[]; variant: GridItemVariant; columns?: number; gap?: number; textColor?: string; colorPalette?: string }
  | { type: 'sequence'; steps: SequenceStep[]; variant: SequenceVariant; direction?: 'horizontal' | 'vertical'; gap?: number; textColor?: string; colorPalette?: string }
  | { type: 'compare'; mode: 'versus' | 'quadrant' | 'iceberg'; sides?: CompareSide[]; quadrantItems?: QuadrantItem[]; xAxis?: string; yAxis?: string; visible?: IcebergItem[]; hidden?: IcebergItem[]; textColor?: string; colorPalette?: string }
  | { type: 'funnel'; layers: FunnelLayer[]; variant: FunnelVariant; textColor?: string; colorPalette?: string }
  | { type: 'concentric'; rings: ConcentricRing[]; variant: ConcentricVariant; textColor?: string; colorPalette?: string }
  | { type: 'hub-spoke'; center: { label: string; description?: string }; spokes: { label: string; description?: string }[]; variant: HubSpokeVariant; textColor?: string; colorPalette?: string }
  | { type: 'venn'; sets: { label: string; description?: string }[]; intersectionLabel?: string; variant: VennVariant; textColor?: string; colorPalette?: string }
  | { type: 'chart'; chartType: ChartType; bars?: ChartBar[]; slices?: ChartSlice[]; innerRadius?: number; categories?: string[]; lineSeries?: LineSeries[]; indicators?: RadarIndicator[]; radarSeries?: RadarSeries[]; proportionItems?: ProportionItem[]; waterfallItems?: WaterfallItem[]; comboSeries?: ComboSeries[]; scatterSeries?: ScatterSeries[]; scatterXAxis?: string; scatterYAxis?: string; gaugeData?: GaugeData; treemapData?: TreemapNode[]; sankeyNodes?: SankeyNode[]; sankeyLinks?: SankeyLink[]; heatmapYCategories?: string[]; heatmapData?: [number, number, number][]; sunburstData?: SunburstNode[]; boxplotItems?: BoxplotItem[]; ganttTasks?: GanttTask[]; highlight?: string; colorPalette?: string }
  | { type: 'cycle'; steps: CycleStep[]; variant: CycleVariant; textColor?: string; colorPalette?: string }
  | { type: 'table'; headers: string[]; rows: TableRow[]; variant: TableVariant; textColor?: string; colorPalette?: string }
  | { type: 'roadmap'; phases: RoadmapPhase[]; variant: RoadmapVariant; textColor?: string; colorPalette?: string }
  | { type: 'swot'; strengths: SwotItem[]; weaknesses: SwotItem[]; opportunities: SwotItem[]; threats: SwotItem[]; textColor?: string; colorPalette?: string }
  | { type: 'mindmap'; root: MindmapNode; textColor?: string; colorPalette?: string }
  | { type: 'stack'; layers: StackLayer[]; variant: StackVariant; textColor?: string; colorPalette?: string }
  | { type: 'image'; src?: string; alt?: string; fit?: 'cover' | 'contain' | 'fill'; placeholder?: string }

export interface ContentBlock {
  id: string
  x: number       // percentage 0-100
  y: number
  width: number
  height: number
  data: BlockData
}

export interface BlockSlideData {
  type: 'block-slide'
  title: string
  blocks: ContentBlock[]
}

export interface DeckMeta {
  id: string
  title: string
  description?: string
  date?: string
  slides: SlideData[]
}

// ─── Import / Export ───
export interface DeckExportPayload {
  version: 1
  title: string
  description?: string
  slides: SlideData[]
}
