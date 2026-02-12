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

export interface DeckEditorState {
  version: 1
  slides: Record<number, SlideEditorState>
  addedSlides?: SlideData[]
}

export type SelectionTarget =
  | { type: 'content-box'; slideIndex: number }
  | { type: 'overlay'; slideIndex: number; id: string }
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
