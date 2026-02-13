import type { ReactNode } from 'react'

interface ArrayEditorProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  renderRow: (item: T, index: number, update: (item: T) => void) => ReactNode
  createDefault: () => T
  minItems?: number
  label?: string
}

export default function ArrayEditor<T>({
  items,
  onChange,
  renderRow,
  createDefault,
  minItems = 1,
  label,
}: ArrayEditorProps<T>) {
  const updateItem = (index: number, item: T) => {
    const next = [...items]
    next[index] = item
    onChange(next)
  }

  const removeItem = (index: number) => {
    if (items.length <= minItems) return
    onChange(items.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {label && <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</div>}
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 bg-white border border-gray-100 rounded-lg p-2">
          {/* Numbering badge */}
          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0 space-y-1">
            {renderRow(item, i, (updated) => updateItem(i, updated))}
          </div>
          {/* Controls — always visible */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              onClick={() => moveItem(i, -1)}
              className="w-6 h-6 text-[11px] rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-center disabled:opacity-30"
              disabled={i === 0}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => moveItem(i, 1)}
              className="w-6 h-6 text-[11px] rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-center disabled:opacity-30"
              disabled={i === items.length - 1}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => removeItem(i)}
              className="w-6 h-6 text-[11px] rounded-md bg-red-50 hover:bg-red-100 text-red-500 cursor-pointer flex items-center justify-center disabled:opacity-30"
              disabled={items.length <= minItems}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, createDefault()])}
        className="w-full py-2 text-xs font-medium rounded-lg border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {label ? `添加${label}` : '添加项目'}
      </button>
    </div>
  )
}
