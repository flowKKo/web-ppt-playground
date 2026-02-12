import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { SlideData, BlockSlideData, ContentBlock, BlockData } from '../../data/types'
import type {
  DeckEditorState,
  SlideEditorState,
  ContentBox,
  OverlayElement,
  SelectionTarget,
} from '../../data/editor-types'
import { createDefaultDeckEditorState } from '../../data/editor-types'

export type ActiveTool = 'select' | 'text' | 'rect' | 'line'

const MAX_HISTORY = 50

interface EditorState {
  editMode: boolean
  activeTool: ActiveTool
  selection: SelectionTarget
  activeColor: string
  deckState: DeckEditorState
  history: DeckEditorState[]
  historyIndex: number
}

type EditorAction =
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'SET_TOOL'; tool: ActiveTool }
  | { type: 'SET_SELECTION'; target: SelectionTarget }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'BEGIN_DRAG' }
  | { type: 'SET_CONTENT_BOX'; slideIndex: number; box: ContentBox | undefined }
  | { type: 'SET_CONTENT_BOX_QUIET'; slideIndex: number; box: ContentBox | undefined }
  | { type: 'SET_SLIDE_DATA_OVERRIDE'; slideIndex: number; data: SlideData | undefined }
  | { type: 'SET_SLIDE_DATA_OVERRIDE_QUIET'; slideIndex: number; data: SlideData }
  | { type: 'ADD_OVERLAY'; slideIndex: number; overlay: OverlayElement }
  | { type: 'UPDATE_OVERLAY'; slideIndex: number; id: string; overlay: Partial<OverlayElement> }
  | { type: 'UPDATE_OVERLAY_QUIET'; slideIndex: number; id: string; overlay: Partial<OverlayElement> }
  | { type: 'REMOVE_OVERLAY'; slideIndex: number; id: string }
  | { type: 'ADD_SLIDE'; data: SlideData }
  | { type: 'REMOVE_ADDED_SLIDE'; index: number }
  | { type: 'ADD_BLOCK'; slideIndex: number; block: ContentBlock }
  | { type: 'UPDATE_BLOCK'; slideIndex: number; blockId: string; changes: Partial<ContentBlock> }
  | { type: 'UPDATE_BLOCK_QUIET'; slideIndex: number; blockId: string; changes: Partial<ContentBlock> }
  | { type: 'REMOVE_BLOCK'; slideIndex: number; blockId: string }
  | { type: 'UPDATE_BLOCK_DATA'; slideIndex: number; blockId: string; data: BlockData }
  | { type: 'LOAD_STATE'; state: DeckEditorState }
  | { type: 'UNDO' }
  | { type: 'REDO' }

function getSlideState(deck: DeckEditorState, index: number): SlideEditorState {
  return deck.slides[index] ?? { overlays: [] }
}

function setSlideState(deck: DeckEditorState, index: number, state: SlideEditorState): DeckEditorState {
  return { ...deck, slides: { ...deck.slides, [index]: state } }
}

/** Push current deckState to history, truncating future and capping size */
function pushHistory(state: EditorState): Pick<EditorState, 'history' | 'historyIndex'> {
  const truncated = state.history.slice(0, state.historyIndex + 1)
  truncated.push(state.deckState)
  if (truncated.length > MAX_HISTORY) truncated.shift()
  return { history: truncated, historyIndex: truncated.length - 1 }
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'TOGGLE_EDIT_MODE':
      return {
        ...state,
        editMode: !state.editMode,
        selection: null,
        activeTool: 'select',
      }
    case 'SET_TOOL':
      return { ...state, activeTool: action.tool, selection: null }
    case 'SET_SELECTION':
      return { ...state, selection: action.target }
    case 'SET_COLOR':
      return { ...state, activeColor: action.color }

    // ─── Begin drag: snapshot history once before a drag/resize sequence ───
    case 'BEGIN_DRAG':
      return { ...state, ...pushHistory(state) }

    // ─── Actions that mutate deckState → push to history ───
    case 'SET_CONTENT_BOX': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          contentBox: action.box,
        }),
      }
    }
    // Quiet variant: updates state without pushing history (used during drag/resize)
    case 'SET_CONTENT_BOX_QUIET': {
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          contentBox: action.box,
        }),
      }
    }
    case 'SET_SLIDE_DATA_OVERRIDE': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: action.data,
        }),
      }
    }
    case 'ADD_OVERLAY': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          overlays: [...slide.overlays, action.overlay],
        }),
      }
    }
    case 'UPDATE_OVERLAY': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          overlays: slide.overlays.map((o) =>
            o.id === action.id ? { ...o, ...action.overlay } as OverlayElement : o,
          ),
        }),
      }
    }
    // Quiet variant: updates state without pushing history (used during drag/resize)
    case 'UPDATE_OVERLAY_QUIET': {
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          overlays: slide.overlays.map((o) =>
            o.id === action.id ? { ...o, ...action.overlay } as OverlayElement : o,
          ),
        }),
      }
    }
    case 'REMOVE_OVERLAY': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      const newSelection =
        state.selection?.type === 'overlay' && state.selection.id === action.id
          ? null
          : state.selection
      return {
        ...state,
        ...hist,
        selection: newSelection,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          overlays: slide.overlays.filter((o) => o.id !== action.id),
        }),
      }
    }
    case 'ADD_SLIDE': {
      const hist = pushHistory(state)
      const existing = state.deckState.addedSlides ?? []
      return {
        ...state,
        ...hist,
        deckState: { ...state.deckState, addedSlides: [...existing, action.data] },
      }
    }
    case 'REMOVE_ADDED_SLIDE': {
      const hist = pushHistory(state)
      const existing = state.deckState.addedSlides ?? []
      return {
        ...state,
        ...hist,
        deckState: {
          ...state.deckState,
          addedSlides: existing.filter((_, i) => i !== action.index),
        },
      }
    }
    // ─── Quiet slide data override (no history push, used during block drag) ───
    case 'SET_SLIDE_DATA_OVERRIDE_QUIET': {
      const slide = getSlideState(state.deckState, action.slideIndex)
      return {
        ...state,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: action.data,
        }),
      }
    }

    // ─── Block operations ───
    case 'ADD_BLOCK': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      const blockData = slide.slideDataOverride as BlockSlideData | undefined
      if (!blockData || blockData.type !== 'block-slide') return state
      const updated: BlockSlideData = { ...blockData, blocks: [...blockData.blocks, action.block] }
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: updated,
        }),
      }
    }
    case 'UPDATE_BLOCK': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      const blockData = slide.slideDataOverride as BlockSlideData | undefined
      if (!blockData || blockData.type !== 'block-slide') return state
      const updated: BlockSlideData = {
        ...blockData,
        blocks: blockData.blocks.map((b) =>
          b.id === action.blockId ? { ...b, ...action.changes } : b,
        ),
      }
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: updated,
        }),
      }
    }
    case 'UPDATE_BLOCK_QUIET': {
      const slide = getSlideState(state.deckState, action.slideIndex)
      const blockData = slide.slideDataOverride as BlockSlideData | undefined
      if (!blockData || blockData.type !== 'block-slide') return state
      const updated: BlockSlideData = {
        ...blockData,
        blocks: blockData.blocks.map((b) =>
          b.id === action.blockId ? { ...b, ...action.changes } : b,
        ),
      }
      return {
        ...state,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: updated,
        }),
      }
    }
    case 'REMOVE_BLOCK': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      const blockData = slide.slideDataOverride as BlockSlideData | undefined
      if (!blockData || blockData.type !== 'block-slide') return state
      const newSelection =
        state.selection?.type === 'block' && state.selection.blockId === action.blockId
          ? null
          : state.selection
      const updated: BlockSlideData = {
        ...blockData,
        blocks: blockData.blocks.filter((b) => b.id !== action.blockId),
      }
      return {
        ...state,
        ...hist,
        selection: newSelection,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: updated,
        }),
      }
    }
    case 'UPDATE_BLOCK_DATA': {
      const hist = pushHistory(state)
      const slide = getSlideState(state.deckState, action.slideIndex)
      const blockData = slide.slideDataOverride as BlockSlideData | undefined
      if (!blockData || blockData.type !== 'block-slide') return state
      const updated: BlockSlideData = {
        ...blockData,
        blocks: blockData.blocks.map((b) =>
          b.id === action.blockId ? { ...b, data: action.data } : b,
        ),
      }
      return {
        ...state,
        ...hist,
        deckState: setSlideState(state.deckState, action.slideIndex, {
          ...slide,
          slideDataOverride: updated,
        }),
      }
    }

    case 'LOAD_STATE':
      return { ...state, deckState: action.state }

    // ─── Undo / Redo ───
    case 'UNDO': {
      if (state.historyIndex < 0) return state
      // Save current state as redo target
      const history = [...state.history]
      // If we're at the tip and haven't pushed current yet, push it
      if (state.historyIndex === history.length - 1) {
        history.push(state.deckState)
        return {
          ...state,
          history,
          historyIndex: state.historyIndex, // points to the entry we restore
          deckState: history[state.historyIndex],
        }
      }
      const newIdx = state.historyIndex - 1
      if (newIdx < 0) return state
      return {
        ...state,
        historyIndex: newIdx,
        deckState: history[newIdx],
      }
    }
    case 'REDO': {
      const nextIdx = state.historyIndex + 1
      if (nextIdx >= state.history.length) return state
      return {
        ...state,
        historyIndex: nextIdx,
        deckState: state.history[nextIdx],
      }
    }
    default:
      return state
  }
}

// ─── Context ───

interface EditorContextValue {
  editMode: boolean
  activeTool: ActiveTool
  selection: SelectionTarget
  activeColor: string
  toggleEditMode: () => void
  setTool: (tool: ActiveTool) => void
  setSelection: (target: SelectionTarget) => void
  setActiveColor: (color: string) => void
  beginDrag: () => void
  getContentBox: (slideIndex: number) => ContentBox | undefined
  setContentBox: (slideIndex: number, box: ContentBox | undefined) => void
  setContentBoxQuiet: (slideIndex: number, box: ContentBox | undefined) => void
  getEffectiveSlideData: (slideIndex: number, original: SlideData) => SlideData
  getSlideDataOverride: (slideIndex: number) => SlideData | undefined
  setSlideDataOverride: (slideIndex: number, data: SlideData | undefined) => void
  getOverlays: (slideIndex: number) => OverlayElement[]
  addOverlay: (slideIndex: number, overlay: OverlayElement) => void
  updateOverlay: (slideIndex: number, id: string, changes: Partial<OverlayElement>) => void
  updateOverlayQuiet: (slideIndex: number, id: string, changes: Partial<OverlayElement>) => void
  removeOverlay: (slideIndex: number, id: string) => void
  addedSlides: SlideData[]
  addSlide: (data: SlideData) => void
  removeAddedSlide: (index: number) => void
  setSlideDataOverrideQuiet: (slideIndex: number, data: SlideData) => void
  addBlock: (slideIndex: number, block: ContentBlock) => void
  updateBlock: (slideIndex: number, blockId: string, changes: Partial<ContentBlock>) => void
  updateBlockQuiet: (slideIndex: number, blockId: string, changes: Partial<ContentBlock>) => void
  removeBlock: (slideIndex: number, blockId: string) => void
  updateBlockData: (slideIndex: number, blockId: string, data: BlockData) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditor must be used within EditorProvider')
  return ctx
}

// ─── Provider ───

function loadFromStorage(deckId: string): DeckEditorState {
  try {
    const raw = localStorage.getItem(`editor-${deckId}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.version === 1) return parsed
    }
  } catch { /* ignore */ }
  return createDefaultDeckEditorState()
}

interface EditorProviderProps {
  deckId: string
  children: ReactNode
}

export function EditorProvider({ deckId, children }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, deckId, (id) => ({
    editMode: false,
    activeTool: 'select' as ActiveTool,
    selection: null,
    activeColor: '#EF4444',
    deckState: loadFromStorage(id),
    history: [] as DeckEditorState[],
    historyIndex: -1,
  }))

  // Persist to localStorage with debounce
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(`editor-${deckId}`, JSON.stringify(state.deckState))
    }, 300)
    return () => clearTimeout(saveTimer.current)
  }, [state.deckState, deckId])

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z, Delete/Backspace
  useEffect(() => {
    if (!state.editMode) return
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return

      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          dispatch({ type: 'REDO' })
        } else {
          dispatch({ type: 'UNDO' })
        }
        return
      }

      // Delete/Backspace: remove selected element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const sel = state.selection
        if (!sel) return
        e.preventDefault()
        if (sel.type === 'block') {
          dispatch({ type: 'REMOVE_BLOCK', slideIndex: sel.slideIndex, blockId: sel.blockId })
        } else if (sel.type === 'overlay') {
          dispatch({ type: 'REMOVE_OVERLAY', slideIndex: sel.slideIndex, id: sel.id })
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.editMode, state.selection])

  const toggleEditMode = useCallback(() => dispatch({ type: 'TOGGLE_EDIT_MODE' }), [])
  const setTool = useCallback((tool: ActiveTool) => dispatch({ type: 'SET_TOOL', tool }), [])
  const setSelection = useCallback((target: SelectionTarget) => dispatch({ type: 'SET_SELECTION', target }), [])
  const setActiveColor = useCallback((color: string) => dispatch({ type: 'SET_COLOR', color }), [])

  const beginDrag = useCallback(() => dispatch({ type: 'BEGIN_DRAG' }), [])

  const getContentBox = useCallback(
    (slideIndex: number) => getSlideState(state.deckState, slideIndex).contentBox,
    [state.deckState],
  )

  const setContentBox = useCallback(
    (slideIndex: number, box: ContentBox | undefined) =>
      dispatch({ type: 'SET_CONTENT_BOX', slideIndex, box }),
    [],
  )

  const setContentBoxQuiet = useCallback(
    (slideIndex: number, box: ContentBox | undefined) =>
      dispatch({ type: 'SET_CONTENT_BOX_QUIET', slideIndex, box }),
    [],
  )

  const getEffectiveSlideData = useCallback(
    (slideIndex: number, original: SlideData): SlideData =>
      getSlideState(state.deckState, slideIndex).slideDataOverride ?? original,
    [state.deckState],
  )

  const getSlideDataOverride = useCallback(
    (slideIndex: number) => getSlideState(state.deckState, slideIndex).slideDataOverride,
    [state.deckState],
  )

  const setSlideDataOverride = useCallback(
    (slideIndex: number, data: SlideData | undefined) =>
      dispatch({ type: 'SET_SLIDE_DATA_OVERRIDE', slideIndex, data }),
    [],
  )

  const getOverlays = useCallback(
    (slideIndex: number) => getSlideState(state.deckState, slideIndex).overlays,
    [state.deckState],
  )

  const addOverlay = useCallback(
    (slideIndex: number, overlay: OverlayElement) =>
      dispatch({ type: 'ADD_OVERLAY', slideIndex, overlay }),
    [],
  )

  const updateOverlay = useCallback(
    (slideIndex: number, id: string, changes: Partial<OverlayElement>) =>
      dispatch({ type: 'UPDATE_OVERLAY', slideIndex, id, overlay: changes }),
    [],
  )

  const updateOverlayQuiet = useCallback(
    (slideIndex: number, id: string, changes: Partial<OverlayElement>) =>
      dispatch({ type: 'UPDATE_OVERLAY_QUIET', slideIndex, id, overlay: changes }),
    [],
  )

  const removeOverlay = useCallback(
    (slideIndex: number, id: string) =>
      dispatch({ type: 'REMOVE_OVERLAY', slideIndex, id }),
    [],
  )

  const addedSlides = state.deckState.addedSlides ?? []

  const addSlide = useCallback(
    (data: SlideData) => dispatch({ type: 'ADD_SLIDE', data }),
    [],
  )

  const removeAddedSlide = useCallback(
    (index: number) => dispatch({ type: 'REMOVE_ADDED_SLIDE', index }),
    [],
  )

  const setSlideDataOverrideQuiet = useCallback(
    (slideIndex: number, data: SlideData) =>
      dispatch({ type: 'SET_SLIDE_DATA_OVERRIDE_QUIET', slideIndex, data }),
    [],
  )

  const addBlock = useCallback(
    (slideIndex: number, block: ContentBlock) =>
      dispatch({ type: 'ADD_BLOCK', slideIndex, block }),
    [],
  )

  const updateBlock = useCallback(
    (slideIndex: number, blockId: string, changes: Partial<ContentBlock>) =>
      dispatch({ type: 'UPDATE_BLOCK', slideIndex, blockId, changes }),
    [],
  )

  const updateBlockQuiet = useCallback(
    (slideIndex: number, blockId: string, changes: Partial<ContentBlock>) =>
      dispatch({ type: 'UPDATE_BLOCK_QUIET', slideIndex, blockId, changes }),
    [],
  )

  const removeBlock = useCallback(
    (slideIndex: number, blockId: string) =>
      dispatch({ type: 'REMOVE_BLOCK', slideIndex, blockId }),
    [],
  )

  const updateBlockData = useCallback(
    (slideIndex: number, blockId: string, data: BlockData) =>
      dispatch({ type: 'UPDATE_BLOCK_DATA', slideIndex, blockId, data }),
    [],
  )

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])

  const canUndo = state.historyIndex >= 0
  const canRedo = state.historyIndex < state.history.length - 1

  const value: EditorContextValue = {
    editMode: state.editMode,
    activeTool: state.activeTool,
    selection: state.selection,
    activeColor: state.activeColor,
    toggleEditMode,
    setTool,
    setSelection,
    setActiveColor,
    beginDrag,
    getContentBox,
    setContentBox,
    setContentBoxQuiet,
    getEffectiveSlideData,
    getSlideDataOverride,
    setSlideDataOverride,
    getOverlays,
    addOverlay,
    updateOverlay,
    updateOverlayQuiet,
    removeOverlay,
    addedSlides,
    addSlide,
    removeAddedSlide,
    setSlideDataOverrideQuiet,
    addBlock,
    updateBlock,
    updateBlockQuiet,
    removeBlock,
    updateBlockData,
    undo,
    redo,
    canUndo,
    canRedo,
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
