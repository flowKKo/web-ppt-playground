import type { SlideData } from './types'

// ─── Coordinate system: percentage 0-100, origin = slide content area top-left ───

export interface ContentBox {
  x: number
  y: number
  width: number
  height: number
}

export interface TextOverlay {
  type: 'text'
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  fontSize: number
  color: string
  fontWeight: 400 | 600 | 700
  textAlign: 'left' | 'center' | 'right'
}

export interface RectOverlay {
  type: 'rect'
  id: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  borderRadius: number
}

export interface LineOverlay {
  type: 'line'
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  stroke: string
  strokeWidth: number
}

export type OverlayElement = TextOverlay | RectOverlay | LineOverlay

export interface SlideEditorState {
  contentBox?: ContentBox
  slideDataOverride?: SlideData
  overlays: OverlayElement[]
}

export type SlideEntry =
  | { kind: 'original'; index: number }
  | { kind: 'added'; data: SlideData }

export interface DeckEditorState {
  version: 1
  slides: Record<number, SlideEditorState>
  addedSlides?: SlideData[]     // legacy field, migrated to slideList on first mutation
  slideList?: SlideEntry[]
}

export type SelectionTarget =
  | { type: 'content-box'; slideIndex: number }
  | { type: 'overlay'; slideIndex: number; id: string }
  | { type: 'block'; slideIndex: number; blockId: string }
  | null

export type ResizeConstraint = 'free' | 'proportional'

export type HandlePosition =
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  | 'top' | 'right' | 'bottom' | 'left'

/** SVG engines need proportional scaling; flex/chart/text use free scaling */
export function getResizeConstraint(data: SlideData): ResizeConstraint {
  switch (data.type) {
    case 'concentric':
    case 'hub-spoke':
    case 'venn':
      return 'proportional'
    case 'compare':
      return data.mode === 'quadrant' ? 'proportional' : 'free'
    default:
      return 'free'
  }
}

export function getHandlePositions(constraint: ResizeConstraint): HandlePosition[] {
  if (constraint === 'proportional') {
    return ['top-left', 'top-right', 'bottom-left', 'bottom-right']
  }
  return ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left']
}

export function createDefaultDeckEditorState(): DeckEditorState {
  return { version: 1, slides: {} }
}

export function getSlideEditorState(deck: DeckEditorState, index: number): SlideEditorState {
  return deck.slides[index] ?? { overlays: [] }
}

/** Re-key slides Record when inserting or deleting at a position */
export function remapSlideKeys(
  slides: Record<number, SlideEditorState>,
  op: { type: 'insert' | 'delete'; at: number },
): Record<number, SlideEditorState> {
  const result: Record<number, SlideEditorState> = {}
  for (const [key, value] of Object.entries(slides)) {
    const k = Number(key)
    if (op.type === 'insert') {
      result[k >= op.at ? k + 1 : k] = value
    } else {
      if (k === op.at) continue // drop the deleted entry
      result[k > op.at ? k - 1 : k] = value
    }
  }
  return result
}

/** Build slideList from legacy state (handles addedSlides migration) */
export function materializeSlideList(
  deck: DeckEditorState,
  originalCount: number,
): SlideEntry[] {
  if (deck.slideList) return deck.slideList
  const list: SlideEntry[] = []
  for (let i = 0; i < originalCount; i++) {
    list.push({ kind: 'original', index: i })
  }
  if (deck.addedSlides) {
    for (const data of deck.addedSlides) {
      list.push({ kind: 'added', data })
    }
  }
  return list
}
