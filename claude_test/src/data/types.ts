export type SlideType =
  | 'title'
  | 'data-comparison'
  | 'key-point'
  | 'comparison'
  | 'grid'
  | 'chart'
  | 'player-card'
  | 'diagram'
  | 'list'
  | 'placeholder'

export interface TitleSlideData {
  type: 'title'
  title: string
  subtitle?: string
  badge?: string
}

export interface DataComparisonSlideData {
  type: 'data-comparison'
  title: string
  body?: string
  items: { label: string; value: string; color?: 'positive' | 'negative' | 'neutral' }[]
  conclusion?: string
}

export interface KeyPointSlideData {
  type: 'key-point'
  title: string
  subtitle?: string
  body?: string
}

export interface ComparisonColumn {
  name: string
  items: { label: string; value: string }[]
}

export interface ComparisonSlideData {
  type: 'comparison'
  title: string
  body?: string
  columns: ComparisonColumn[]
}

export interface GridItem {
  number: number
  title: string
  description: string
}

export interface GridSlideData {
  type: 'grid'
  title: string
  items: GridItem[]
}

export interface ChartBar {
  category: string
  values: { name: string; value: number; color?: 'positive' | 'negative' | 'neutral' }[]
}

export interface ChartSlideData {
  type: 'chart'
  title: string
  body?: string
  bars: ChartBar[]
  highlight?: string
}

export interface PlayerCardSlideData {
  type: 'player-card'
  rank: string
  name: string
  score: number
  model: string
  highlight?: string
  features: { label: string; value: string }[]
  comparison?: { name: string; value: number }[]
}

export interface DiagramStep {
  label: string
  description: string
}

export interface DiagramSlideData {
  type: 'diagram'
  title: string
  body?: string
  steps: DiagramStep[]
  sideNote?: string
}

export interface ListSlideData {
  type: 'list'
  title: string
  items: string[]
}

export interface PlaceholderSlideData {
  type: 'placeholder'
  title: string
  body?: string
  placeholderLabel: string
  metric?: { value: string; label: string }
  caption?: string
  cards?: { label: string; value: string }[]
}

export type SlideData =
  | TitleSlideData
  | DataComparisonSlideData
  | KeyPointSlideData
  | ComparisonSlideData
  | GridSlideData
  | ChartSlideData
  | PlayerCardSlideData
  | DiagramSlideData
  | ListSlideData
  | PlaceholderSlideData
