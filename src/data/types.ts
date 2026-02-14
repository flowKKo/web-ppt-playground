// ─── Shared ───
export type SemanticColor = 'positive' | 'negative' | 'neutral'

// ─── 1. Title ───
export interface TitleSlideData {
  type: 'title'
  title: string
  subtitle?: string
  badge?: string
}

// ─── 2. KeyPoint ───
export interface KeyPointSlideData {
  type: 'key-point'
  title: string
  subtitle?: string
  body?: string
}

// ─── 3. Chart (expanded) ───
export type ChartType = 'bar' | 'pie' | 'line' | 'radar'

export interface ChartBar {
  category: string
  values: { name: string; value: number; color?: SemanticColor }[]
}
export interface ChartSlice { name: string; value: number }
export interface LineSeries { name: string; data: number[]; area?: boolean }
export interface RadarIndicator { name: string; max: number }
export interface RadarSeries { name: string; values: number[] }

export interface ChartSlideData {
  type: 'chart'
  chartType: ChartType
  title: string
  body?: string
  highlight?: string
  chartHeight?: number           // px, default auto-fills available space
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
  | { type: 'title-body'; title: string; body?: string }
  | { type: 'grid-item'; items: GridItemEntry[]; variant: GridItemVariant; columns?: number; gap?: number }
  | { type: 'sequence'; steps: SequenceStep[]; variant: SequenceVariant; direction?: 'horizontal' | 'vertical'; gap?: number }
  | { type: 'compare'; mode: 'versus' | 'quadrant' | 'iceberg'; sides?: CompareSide[]; quadrantItems?: QuadrantItem[]; xAxis?: string; yAxis?: string; visible?: IcebergItem[]; hidden?: IcebergItem[] }
  | { type: 'funnel'; layers: FunnelLayer[]; variant: FunnelVariant }
  | { type: 'concentric'; rings: ConcentricRing[]; variant: ConcentricVariant }
  | { type: 'hub-spoke'; center: { label: string; description?: string }; spokes: { label: string; description?: string }[]; variant: HubSpokeVariant }
  | { type: 'venn'; sets: { label: string; description?: string }[]; intersectionLabel?: string; variant: VennVariant }
  | { type: 'chart'; chartType: ChartType; bars?: ChartBar[]; slices?: ChartSlice[]; innerRadius?: number; categories?: string[]; lineSeries?: LineSeries[]; indicators?: RadarIndicator[]; radarSeries?: RadarSeries[]; highlight?: string }
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
