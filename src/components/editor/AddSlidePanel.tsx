import { colors } from '../../theme/swiss'
import type { SlideData } from '../../data/types'
import { createDefaultSlide } from '../../data/type-converter'
import { TYPE_LIST } from './TypeThumbnails'

interface AddSlidePanelProps {
  onAdd: (data: SlideData) => void
}

export default function AddSlidePanel({ onAdd }: AddSlidePanelProps) {
  return (
    <div className="grid grid-cols-5 gap-2 p-3">
      {TYPE_LIST.map(({ type, label, Thumb }) => (
        <button
          key={type}
          onClick={() => onAdd(createDefaultSlide(type))}
          className="flex flex-col items-center gap-1 p-1.5 rounded-md cursor-pointer transition-colors hover:bg-black/5"
        >
          <div
            className="w-full aspect-video rounded border overflow-hidden"
            style={{ borderColor: colors.border, background: colors.slide }}
          >
            <Thumb />
          </div>
          <span className="text-[10px] leading-tight" style={{ color: colors.textSecondary }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
