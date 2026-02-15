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
export type ChartType = 'bar' | 'horizontal-bar' | 'stacked-bar' | 'pie' | 'donut' | 'rose' | 'line' | 'area' | 'radar' | 'proportion' | 'waterfall' | 'combo' | 'scatter' | 'gauge'

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
  | { type: 'chart'; chartType: ChartType; bars?: ChartBar[]; slices?: ChartSlice[]; innerRadius?: number; categories?: string[]; lineSeries?: LineSeries[]; indicators?: RadarIndicator[]; radarSeries?: RadarSeries[]; proportionItems?: ProportionItem[]; waterfallItems?: WaterfallItem[]; comboSeries?: ComboSeries[]; scatterSeries?: ScatterSeries[]; scatterXAxis?: string; scatterYAxis?: string; gaugeData?: GaugeData; highlight?: string; colorPalette?: string }
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
