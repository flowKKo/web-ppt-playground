import { createContext, useContext, useCallback, type ReactNode } from 'react'
import type { SlideData } from '../../data/types'
import { useEditor } from './EditorProvider'

// ─── setByPath: deep-set a value on a cloned object ───

function setByPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const clone = structuredClone(obj) as Record<string, unknown>
  const keys = path.split('.')
  let cur: Record<string, unknown> = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    const idx = Number(k)
    if (!Number.isNaN(idx) && Array.isArray(cur)) {
      cur = cur[idx] as Record<string, unknown>
    } else {
      cur = cur[k] as Record<string, unknown>
    }
  }
  const lastKey = keys[keys.length - 1]
  const lastIdx = Number(lastKey)
  if (!Number.isNaN(lastIdx) && Array.isArray(cur)) {
    (cur as unknown[])[lastIdx] = value
  } else {
    cur[lastKey] = value
  }
  return clone
}

// ─── Context ───

interface InlineEditContextValue {
  updateField: (path: string, value: string) => void
  editMode: boolean
}

const InlineEditContext = createContext<InlineEditContextValue | null>(null)

export function useInlineEdit(): InlineEditContextValue | null {
  return useContext(InlineEditContext)
}

// ─── Provider ───

interface InlineEditProviderProps {
  slideIndex: number
  originalData: SlideData
  children: ReactNode
}

export function InlineEditProvider({ slideIndex, originalData, children }: InlineEditProviderProps) {
  const { editMode, getSlideDataOverride, setSlideDataOverride } = useEditor()

  const updateField = useCallback(
    (path: string, value: string) => {
      const current = getSlideDataOverride(slideIndex) ?? originalData
      const updated = setByPath(current as unknown as Record<string, unknown>, path, value) as unknown as SlideData
      setSlideDataOverride(slideIndex, updated)
    },
    [slideIndex, originalData, getSlideDataOverride, setSlideDataOverride],
  )

  return (
    <InlineEditContext.Provider value={{ updateField, editMode }}>
      {children}
    </InlineEditContext.Provider>
  )
}
