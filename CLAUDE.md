# Web PPT Playground

## Project Overview

Web-based presentation editor and viewer. Single-page navigation (one slide at a time, wheel/keyboard to advance). 16:9 slides with WYSIWYG editing, block-based layouts, and rich diagram support.

## Tech Stack

- **Vite + React + TypeScript** — component-based slide system
- **Tailwind CSS** — styling via utility classes + design tokens
- **Framer Motion** — entrance animations
- **ECharts + echarts-for-react** — data visualization (20 chart sub-types: bar, horizontal-bar, stacked-bar, pie, donut, rose, line, area, radar, proportion, waterfall, combo, scatter, gauge, treemap, sankey, heatmap, sunburst, boxplot, gantt)

## Usage

Use the `/web-ppt` skill to generate or update slides:

```
/web-ppt --lang zh --style swiss --script slides.md --deck terminal-bench
```

## URL Scheme

- `localhost:5173/` — deck selector (create, import, delete decks)
- `localhost:5173/#deck-id` — specific deck (hash-based routing)

## Architecture

### Slide Types (17 types — discriminated union in `src/data/types.ts`)

| Type | Description | Variants |
|------|-------------|----------|
| `title` | Title + subtitle + badge | — |
| `key-point` | Key point with body text | — |
| `chart` | ECharts visualization | 20 sub-types (bar, horizontal-bar, stacked-bar, pie, donut, rose, line, area, radar, proportion, waterfall, combo, scatter, gauge, treemap, sankey, heatmap, sunburst, boxplot, gantt) |
| `grid-item` | Card grid layout | 12 variants (solid, outline, sideline, topline, top-circle, joined, leaf, labeled, alternating, pillar, diamonds, signs) |
| `sequence` | Step-by-step flow | 7 variants (timeline, chain, arrows, pills, ribbon-arrows, numbered, zigzag) |
| `compare` | Comparison views | 3 modes (versus, quadrant, iceberg) |
| `funnel` | Funnel/pyramid charts | 3 variants (funnel, pyramid, slope) |
| `concentric` | Concentric ring diagrams | 3 variants (circles, diamond, target) |
| `hub-spoke` | Hub and spoke layouts | 3 variants (orbit, solar, pinwheel) |
| `venn` | Venn diagrams | 3 variants (classic, linear, linear-filled) |
| `cycle` | Circular process diagrams | 3 variants (circular, gear, loop) |
| `table` | Table/matrix layouts | 3 variants (striped, bordered, highlight) |
| `roadmap` | Multi-track timelines | 3 variants (horizontal, vertical, milestone) |
| `swot` | SWOT analysis matrix | — (fixed 2×2 grid) |
| `mindmap` | Mind map / radial tree | — (SVG tree layout) |
| `stack` | Layered stack diagram | 3 variants (horizontal, vertical, offset) |
| `block-slide` | Free-layout canvas with positioned `ContentBlock[]` | — |

### Engine Architecture (13 engines)

Each engine renders a specific diagram type and exports both a full-slide component (`*Engine`) and a headless diagram function (`*Diagram`) for use in blocks:

- `GridItemEngine` / `GridItemDiagram`
- `SequenceEngine` / `SequenceDiagram`
- `CompareEngine` / `CompareDiagram`
- `FunnelPyramidEngine` / `FunnelDiagram`
- `ConcentricEngine` / `ConcentricDiagram`
- `HubSpokeEngine` / `HubSpokeDiagram`
- `VennEngine` / `VennDiagram`
- `CycleEngine` / `CycleDiagram`
- `TableEngine` / `TableDiagram`
- `RoadmapEngine` / `RoadmapDiagram`
- `SwotEngine` / `SwotDiagram`
- `MindmapEngine` / `MindmapDiagram`
- `StackEngine` / `StackDiagram`

### Block Model

`BlockSlideData` contains `ContentBlock[]`, each block has `id/x/y/width/height` (percentage-based) + `BlockData` (15 types: title-body, grid-item, sequence, compare, funnel, concentric, hub-spoke, venn, cycle, table, roadmap, swot, mindmap, stack, chart).

### Editor System

- **EditorProvider** (`useReducer` + Context) — central state with 20+ actions, undo/redo (50-item history), clipboard, selection, file-based auto-save
- **Selection model** — three targets: `content-box`, `overlay` (text/rect/line), `block`
- **Tools** — select, text, rect, line (toolbar at top-center)
- **Property panel** — right sidebar (320px) with type-specific editors
- **Inline editing** — double-click text fields via `EditableText` + `InlineEditContext`
- **Keyboard shortcuts** — Ctrl+Z undo, Ctrl+Shift+Z redo, Delete/Backspace remove

### Navigation

- Single-page view with wheel (accumulated delta + cooldown) and keyboard (Arrow/PageUp/PageDown)
- Sidebar thumbnail panel (left, resizable 200–400px) with context menu and drag-to-reorder
- Fullscreen overlay with spotlight (block-by-block reveal)

### Deck Management

- File-based persistence via Vite dev server API (`vite-plugin-deck-api.ts`)
- UI create/edit/delete → writes `src/data/user-decks/*.json` via PUT/DELETE endpoints
- AI-generated decks → `src/data/user-decks/*.ts` (same directory, auto-discovered)
- `import.meta.glob` auto-discovers all files in `src/data/decks/` and `src/data/user-decks/` — no manual registration
- Auto-save: editor changes debounced 2s → `commitSave()` → file write
- JSON import/export (`src/data/deck-io.ts`)
- Editable deck title/description in sidebar header

## Key Files

### App Shell
- `src/App.tsx` — root router, runtime deck CRUD, hash-based navigation
- `src/components/SlideDeck.tsx` — deck container, navigation, toolbar buttons, layout
- `src/components/Sidebar.tsx` — left thumbnail panel, context menu, drag reorder, resize
- `src/components/DeckSelector.tsx` — landing page with create/import/delete
- `src/components/FullscreenOverlay.tsx` — fullscreen presenter with spotlight

### Slide Rendering
- `src/components/Slide.tsx` — 16:9 wrapper with animation
- `src/components/SlideContent.tsx` — type router to slide components
- `src/components/slides/` — TitleSlide, KeyPointSlide, ChartSlide

### Engines
- `src/components/engines/*.tsx` — 13 diagram engines
- `src/components/engines/shared/` — EngineTitle, ConnectorArrow

### Block System
- `src/components/blocks/BlockSlideRenderer.tsx` — positions blocks on canvas
- `src/components/blocks/BlockWrapper.tsx` — drag/resize individual blocks
- `src/components/blocks/BlockRenderer.tsx` — routes block data to diagram components

### Editor
- `src/components/editor/EditorProvider.tsx` — state management, actions, context
- `src/components/editor/PropertyPanel.tsx` — right panel with type/block/overlay editors
- `src/components/editor/EditorToolbar.tsx` — top toolbar (tools, undo/redo, color)
- `src/components/editor/ContentBoxWrapper.tsx` — slide content selection/drag/resize
- `src/components/editor/OverlayLayer.tsx` — overlay creation and editing
- `src/components/editor/LayoutPicker.tsx` — slide type converter + variant selector
- `src/components/editor/BlockLayoutPicker.tsx` — block type + variant picker
- `src/components/editor/SlideDataEditor.tsx` — type-specific property fields
- `src/components/editor/EditableText.tsx` — inline text editing
- `src/components/editor/InlineEditContext.tsx` — per-slide edit context
- `src/components/editor/TypeThumbnails.tsx` — slide type selector thumbnails
- `src/components/editor/ArrayEditor.tsx` — array field editing (items, steps, etc.)

### Data
- `src/data/types.ts` — SlideData union, BlockData, ContentBlock, DeckMeta, DeckExportPayload
- `src/data/editor-types.ts` — editor state types, SlideEntry, selection targets
- `src/data/deck-io.ts` — export/import JSON files
- `src/data/type-converter.ts` — convert between slide types, create defaults
- `src/data/block-adapter.ts` — legacy slide → block-slide conversion
- `src/data/deck-api.ts` — client-side saveDeck/deleteDeckFile API
- `src/data/decks/index.ts` — auto-discovery deck registry (import.meta.glob)
- `src/data/user-decks/<deck-id>.ts` — AI-generated deck data
- `src/data/user-decks/<deck-id>.json` — UI-created/edited deck data

### Charts & Theme
- `src/charts/{BarChart,PieChart,LineChart,RadarChart,ProportionChart,WaterfallChart,ComboChart,ScatterChart,GaugeChart,TreemapChart,SankeyChart,HeatmapChart,SunburstChart,BoxplotChart,GanttChart}.tsx` — ECharts wrappers
- `src/theme/swiss.ts` — colors, cardStyle, motionConfig, echartsTheme, generateGradientColors

### Hooks
- `src/hooks/useFullscreen.ts` — fullscreen enter/exit, keyboard nav
- `src/hooks/useSpotlight.ts` — spotlight state context

### Skills
- `.claude/skills/web-ppt/SKILL.md` — generation rules and component architecture
- `.claude/skills/web-ppt/styles/swiss.md` — Swiss Style theme tokens

## Conventions

- All styling via Tailwind — no custom CSS except `index.css` for directives and scrollbar
- Slide components are generic and data-driven via props
- All slide data is typed in TypeScript (discriminated unions)
- ECharts uses registered theme matching the active style
- No images — use CSS, SVG, or placeholder boxes
- Chinese language preferred for UI labels and slide content
- Editor auto-saves to file via Vite dev server API (2s debounce)
