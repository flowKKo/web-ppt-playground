import type { SlideData } from '../../data/types'

const STROKE = '#546E7A'
const FILL_LIGHT = '#546E7A'
const FILL_ACCENT = '#4CAF50'

interface ThumbnailProps {
  active?: boolean
}

function TitleThumb({ active }: ThumbnailProps) {
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="20" y="16" width="40" height="4" rx="2" fill={active ? FILL_ACCENT : STROKE} />
      <rect x="26" y="24" width="28" height="2" rx="1" fill={active ? FILL_ACCENT : STROKE} opacity={0.5} />
    </svg>
  )
}

function KeyPointThumb({ active }: ThumbnailProps) {
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="16" y="12" width="48" height="6" rx="3" fill={active ? FILL_ACCENT : STROKE} opacity={0.3} />
      <rect x="12" y="22" width="56" height="4" rx="2" fill={active ? FILL_ACCENT : STROKE} />
      <rect x="20" y="30" width="40" height="2" rx="1" fill={active ? FILL_ACCENT : STROKE} opacity={0.5} />
    </svg>
  )
}

function ChartThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="18" y="22" width="10" height="14" rx="2" fill={c} opacity={0.6} />
      <rect x="35" y="12" width="10" height="24" rx="2" fill={c} />
      <rect x="52" y="18" width="10" height="18" rx="2" fill={c} opacity={0.8} />
      <line x1="14" y1="38" x2="66" y2="38" stroke={c} strokeWidth="1.5" opacity={0.4} />
    </svg>
  )
}

function GridItemThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="12" y="8" width="24" height="14" rx="2" fill={c} opacity={0.3} stroke={c} strokeWidth="1" />
      <rect x="44" y="8" width="24" height="14" rx="2" fill={c} opacity={0.3} stroke={c} strokeWidth="1" />
      <rect x="12" y="26" width="24" height="14" rx="2" fill={c} opacity={0.3} stroke={c} strokeWidth="1" />
      <rect x="44" y="26" width="24" height="14" rx="2" fill={c} opacity={0.3} stroke={c} strokeWidth="1" />
    </svg>
  )
}

function SequenceThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <circle cx="16" cy="22" r="6" fill={c} opacity={0.7} />
      <circle cx="40" cy="22" r="6" fill={c} opacity={0.85} />
      <circle cx="64" cy="22" r="6" fill={c} />
      <line x1="23" y1="22" x2="33" y2="22" stroke={c} strokeWidth="1.5" />
      <polygon points="33,19 33,25 36,22" fill={c} />
      <line x1="47" y1="22" x2="57" y2="22" stroke={c} strokeWidth="1.5" />
      <polygon points="57,19 57,25 60,22" fill={c} />
    </svg>
  )
}

function CompareThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="8" y="8" width="28" height="29" rx="3" fill={c} opacity={0.25} />
      <rect x="44" y="8" width="28" height="29" rx="3" fill={c} opacity={0.25} />
      <line x1="40" y1="6" x2="40" y2="39" stroke={c} strokeWidth="1.5" strokeDasharray="3,2" />
    </svg>
  )
}

function FunnelThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <polygon points="14,10 66,10 60,20 20,20" fill={c} opacity={0.4} />
      <polygon points="20,22 60,22 54,32 26,32" fill={c} opacity={0.6} />
      <polygon points="26,34 54,34 48,42 32,42" fill={c} opacity={0.85} />
    </svg>
  )
}

function ConcentricThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <circle cx="40" cy="22" r="18" fill="none" stroke={c} strokeWidth="1.5" opacity={0.3} />
      <circle cx="40" cy="22" r="12" fill="none" stroke={c} strokeWidth="1.5" opacity={0.6} />
      <circle cx="40" cy="22" r="6" fill={c} opacity={0.8} />
    </svg>
  )
}

function HubSpokeThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  const spokes = [
    [40, 6], [60, 15], [60, 29], [40, 38], [20, 29], [20, 15],
  ]
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      {spokes.map(([sx, sy], i) => (
        <line key={i} x1="40" y1="22" x2={sx} y2={sy} stroke={c} strokeWidth="1" opacity={0.4} />
      ))}
      <circle cx="40" cy="22" r="6" fill={c} />
      {spokes.map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r="3.5" fill={c} opacity={0.6} />
      ))}
    </svg>
  )
}

function VennThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <circle cx="32" cy="22" r="14" fill={c} opacity={0.2} stroke={c} strokeWidth="1.5" />
      <circle cx="48" cy="22" r="14" fill={c} opacity={0.2} stroke={c} strokeWidth="1.5" />
    </svg>
  )
}

function CycleThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  const r = 14
  const cx = 40, cy = 22
  const pts = [0, 1, 2, 3].map(i => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / 4
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={c} opacity={0.3 + i * 0.2} stroke={c} strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth="1" strokeDasharray="3 2" opacity={0.3} />
    </svg>
  )
}

function TableThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect x="12" y="8" width="56" height="6" rx="1" fill={c} opacity={0.7} />
      <rect x="12" y="16" width="56" height="5" rx="1" fill={c} opacity={0.15} />
      <rect x="12" y="23" width="56" height="5" rx="1" fill={c} opacity={0.25} />
      <rect x="12" y="30" width="56" height="5" rx="1" fill={c} opacity={0.15} />
      <line x1="32" y1="8" x2="32" y2="35" stroke={c} strokeWidth="0.8" opacity={0.3} />
      <line x1="52" y1="8" x2="52" y2="35" stroke={c} strokeWidth="0.8" opacity={0.3} />
    </svg>
  )
}

function RoadmapThumb({ active }: ThumbnailProps) {
  const c = active ? FILL_ACCENT : STROKE
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <line x1="12" y1="22" x2="68" y2="22" stroke={c} strokeWidth="1.5" opacity={0.3} />
      <polygon points="20,18 24,22 20,26" fill={c} opacity={0.5} />
      <polygon points="38,18 42,22 38,26" fill={c} opacity={0.7} />
      <polygon points="56,18 60,22 56,26" fill={c} opacity={0.9} />
      <rect x="14" y="28" width="14" height="3" rx="1" fill={c} opacity={0.3} />
      <rect x="33" y="28" width="14" height="3" rx="1" fill={c} opacity={0.3} />
      <rect x="52" y="28" width="14" height="3" rx="1" fill={c} opacity={0.3} />
    </svg>
  )
}

// ─── Registry ───

export type SlideType = SlideData['type']

interface TypeMeta {
  type: SlideType
  label: string
  Thumb: React.FC<ThumbnailProps>
}

export const TYPE_LIST: TypeMeta[] = [
  { type: 'title', label: '标题', Thumb: TitleThumb },
  { type: 'key-point', label: '关键点', Thumb: KeyPointThumb },
  { type: 'chart', label: '图表', Thumb: ChartThumb },
  { type: 'grid-item', label: '网格', Thumb: GridItemThumb },
  { type: 'sequence', label: '序列', Thumb: SequenceThumb },
  { type: 'compare', label: '对比', Thumb: CompareThumb },
  { type: 'funnel', label: '漏斗', Thumb: FunnelThumb },
  { type: 'concentric', label: '同心圆', Thumb: ConcentricThumb },
  { type: 'hub-spoke', label: '轮辐', Thumb: HubSpokeThumb },
  { type: 'venn', label: '韦恩', Thumb: VennThumb },
  { type: 'cycle', label: '循环', Thumb: CycleThumb },
  { type: 'table', label: '表格', Thumb: TableThumb },
  { type: 'roadmap', label: '路线图', Thumb: RoadmapThumb },
]

export function TypeThumbnail({ type, active }: { type: SlideType; active?: boolean }) {
  const meta = TYPE_LIST.find((t) => t.type === type)
  if (!meta) return null
  return <meta.Thumb active={active} />
}
