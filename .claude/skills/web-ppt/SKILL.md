---
name: web-ppt
description: "Generate web-based PPT presentations using React + Tailwind + ECharts + Framer Motion. Extracts real data from source docs. Usage: /web-ppt --lang zh --style swiss --script slides.md [--source full.md]"
argument-hint: "--lang <language> --style <style> --script <file> [--source <file>] [--slides <n,n,...>]"
---

# Web PPT Generator

Generate web-based slide presentations using a React + Vite project. Slides are 16:9 aspect ratio. Each slide is a typed data object rendered by engine components.

## Argument Parsing

Parse `$ARGUMENTS` for these flags:

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--lang` | Yes | — | Output language: `zh`, `en`, `ja`, etc. |
| `--style` | Yes | — | Style name matching `.claude/skills/web-ppt/styles/{value}.md` |
| `--script` | Yes | — | Path to the slide script Markdown file |
| `--slides` | No | all | Comma-separated slide numbers to regenerate (e.g., `5,8,12`) |
| `--source` | No | — | Path to the full reference document for data extraction |
| `--deck` | No | from script filename | Deck ID (e.g., `terminal-bench`) → `src/data/user-decks/<deck-id>.ts` |

Positional shorthand: `/web-ppt zh swiss slides.md` → lang=zh, style=swiss, script=slides.md

If a `full.md` (or similarly named source document) exists in the project root, **always read it** even if `--source` is not explicitly provided.

---

## Architecture Overview

### Data-Driven Rendering

All slides are pure **data objects** (`SlideData` union type) — no custom components per deck. Each slide type maps to a built-in renderer.

```
Script (slides.md)
  → Analyze available layouts & charts (Phase 1)
  → Design slide-by-slide plan (Phase 2)
  → Generate typed SlideData[] (Phase 3)
  → Engines auto-render each slide
```

### Key Files

| File | Purpose |
|------|---------|
| `src/data/types.ts` | `SlideData` union, `BlockData`, `ContentBlock`, `DeckMeta` type definitions |
| `src/data/user-decks/<deck-id>.ts` | Deck data: export `DeckMeta` with `slides: SlideData[]` |
| `src/data/decks/index.ts` | Auto-discovery registry via `import.meta.glob` (no manual registration) |
| `src/theme/swiss.ts` | Theme: colors, echarts theme, motion config, card style |
| `src/components/engines/*.tsx` | 13 diagram engines (GridItem, Sequence, Compare, Funnel, Concentric, HubSpoke, Venn, Cycle, Table, Roadmap, Swot, Mindmap, Stack) |
| `src/components/slides/ChartSlide.tsx` | ECharts renderer (20 chart sub-types) |
| `src/components/blocks/` | Block model: BlockRenderer, BlockSlideRenderer, BlockWrapper |

---

## Available Slide Assets — Complete Catalog

> **CRITICAL**: Before designing any slide, review this catalog. Every slide you generate MUST use one of these types with the exact data shape specified. There are NO other options.

### A. Standalone Slide Types (16 types)

These are top-level `SlideData` types. Each renders as a full slide.

---

#### 1. `title` — Title / Section Divider

Centered large text. Use for deck opener, section breaks, and conclusion.

```ts
{ type: 'title', title: string, subtitle?: string, badge?: string, titleSize?: number, bodySize?: number }
```

- `badge` — small label (e.g., version, date, category tag)
- Layout: centered vertically and horizontally
- **Standard**: `titleSize: 72, bodySize: 28` (deck opener: `titleSize: 80`)

---

#### 2. `key-point` — Key Insight / Callout

Large centered statement with optional body text. Use for core takeaways, quotes, section intros.

```ts
{ type: 'key-point', title: string, subtitle?: string, body?: string, titleSize?: number, bodySize?: number }
```

- Best for single-message slides: one impactful statement
- Layout: centered
- **Standard**: `titleSize: 56, bodySize: 24`

---

#### 3. `chart` — Data Visualization (ECharts)

Full-width chart with title. **20 chart sub-types:**

```ts
{
  type: 'chart',
  chartType: ChartType,  // 20 sub-types (see ChartType below)
  title: string,
  body?: string,
  highlight?: string,    // big number callout (e.g., "¥12.8M")
  chartHeight?: number,  // px, default auto
  // bar / horizontal-bar / stacked-bar:
  bars?: ChartBar[],     // { category, values: { name, value, color? }[] }
  // pie / donut / rose:
  slices?: ChartSlice[], // { name, value }
  innerRadius?: number,  // 0-100 for donut effect (donut defaults to 45)
  // line / area / combo / heatmap (x-axis):
  categories?: string[],
  lineSeries?: LineSeries[], // { name, data: number[], area?: boolean }
  // radar:
  indicators?: RadarIndicator[], // { name, max }
  radarSeries?: RadarSeries[],   // { name, values: number[] }
  // proportion:
  proportionItems?: ProportionItem[],  // { name, value, max? }
  // waterfall:
  waterfallItems?: WaterfallItem[],    // { name, value, type?: 'increase'|'decrease'|'total' }
  // combo (dual-axis bar+line):
  comboSeries?: ComboSeries[],        // { name, data, seriesType: 'bar'|'line', yAxisIndex?: 0|1 }
  // scatter / bubble:
  scatterSeries?: ScatterSeries[],    // { name, data: [x,y,size?][] }
  scatterXAxis?: string,
  scatterYAxis?: string,
  // gauge:
  gaugeData?: GaugeData,              // { value, max?, name? }
  // treemap:
  treemapData?: TreemapNode[],        // { name, value, children? }
  // sankey:
  sankeyNodes?: SankeyNode[],         // { name }
  sankeyLinks?: SankeyLink[],         // { source, target, value }
  // heatmap:
  heatmapYCategories?: string[],      // y-axis categories
  heatmapData?: [number, number, number][],  // [xIndex, yIndex, value]
  // sunburst:
  sunburstData?: SunburstNode[],      // { name, value?, children? }
  // boxplot:
  boxplotItems?: BoxplotItem[],       // { name, values: [min, Q1, median, Q3, max] }
  // gantt:
  ganttTasks?: GanttTask[],           // { name, start, end, category? }
}
```

**When to use which chart:**

| Chart | Best For | Data Shape |
|-------|----------|------------|
| `bar` | Category comparison, vertical value ranking | 3-8 categories, 1-3 series per category |
| `horizontal-bar` | Leaderboards, long-label comparisons, rankings | 3-10 categories (labels on y-axis) |
| `stacked-bar` | Composition breakdown, revenue by segment | 3-8 categories, 2-4 series stacked |
| `pie` | Proportional breakdown, market share | 3-6 slices |
| `donut` | Proportional breakdown + total display | 3-6 slices (center shows total) |
| `rose` | Proportional comparison with magnitude emphasis | 3-8 slices (radius encodes value) |
| `line` | Trends over time, growth curves | 4-12 time points, 1-3 series |
| `area` | Trends with volume emphasis, growth visualization | 4-12 time points, 1-3 series (filled) |
| `radar` | Multi-dimensional comparison, capability profiles | 4-6 dimensions, 2-3 items compared |
| `proportion` | Completion rates, coverage, percentage comparison | 3-8 items with value/max |
| `waterfall` | Profit decomposition, budget bridge, incremental analysis | 4-8 items (increase/decrease/total) |
| `combo` | Dual-axis: absolute values (bar) + rates/trends (line) | 3-8 categories, 2-3 series (mixed bar+line) |
| `scatter` | Correlation, market positioning, BCG matrix | 1-3 series, 5-20 data points each |
| `gauge` | Single KPI completion, health score, NPS | 1 value with max |
| `treemap` | Hierarchical proportions, budget/market breakdown | Nested categories with values |
| `sankey` | Flow analysis, budget allocation, user journey | Nodes + weighted links |
| `heatmap` | Correlation matrix, activity patterns, density | X×Y grid with intensity values |
| `sunburst` | Hierarchical drill-down, org structure | Nested categories (ring layers) |
| `boxplot` | Statistical distribution, variance comparison | 5-number summary per group |
| `gantt` | Project timeline, task scheduling | Tasks with start/end positions |

---

#### 4. `grid-item` — Card Grid / Metrics Dashboard

Grid of cards showing structured items. The most versatile layout engine.

```ts
{
  type: 'grid-item',
  title: string,
  body?: string,
  items: GridItemEntry[],  // { title, description?, value?, valueColor? }
  variant: GridItemVariant,
  columns?: number,        // override auto (default: based on item count)
}
```

**12 visual variants:**

| Variant | Visual Style | Best For |
|---------|-------------|----------|
| `solid` | White cards with shadow | KPI dashboards, metric cards |
| `outline` | Border-only cards, no fill | Feature lists, capability grids |
| `sideline` | Left accent border | Attribute lists, key points |
| `topline` | Top accent border | Category overviews |
| `top-circle` | Circle icon above title | Team members, feature highlights |
| `joined` | Connected seamless strip | Sequential categories |
| `leaf` | Organic rounded shape | Soft/creative content |
| `labeled` | Tag/label style | Taxonomy, classification |
| `alternating` | Alternating background | Before/after, odd/even |
| `pillar` | Tall column style | Pricing tiers, comparison columns |
| `diamonds` | Diamond/rotated shapes | Creative highlights |
| `signs` | Signpost/banner style | Directional items, milestones |

**`valueColor`** options: `'positive'` (green), `'negative'` (red), `'neutral'` (blue-grey)

**Column recommendations**: 2 items → 2 cols, 3 items → 3 cols, 4 items → 2 or 4 cols, 5-6 items → 3 cols

---

#### 5. `sequence` — Process Flow / Timeline

Sequential steps with connectors. Use for workflows, timelines, process descriptions.

```ts
{
  type: 'sequence',
  title: string,
  body?: string,
  steps: SequenceStep[],   // { label, description? }
  variant: SequenceVariant,
  direction?: 'horizontal' | 'vertical', // default: horizontal
}
```

**7 visual variants:**

| Variant | Visual Style | Best For |
|---------|-------------|----------|
| `timeline` | Dot + line timeline | Chronological events, project phases |
| `chain` | Linked chain nodes | Dependencies, linked processes |
| `arrows` | Arrow-connected boxes | Input→output flows, pipelines |
| `pills` | Pill-shaped badges in row | Simple step lists, status progression |
| `ribbon-arrows` | Chevron/ribbon arrows | Funnel-like processes, stage gates |
| `numbered` | Numbered circle steps | Ordered instructions, methodology |
| `zigzag` | Alternating up/down path | Journey mapping, multi-phase processes |

---

#### 6. `compare` — Comparison / Analysis

Three comparison modes for different analytical needs.

```ts
{
  type: 'compare',
  title: string,
  body?: string,
  mode: 'versus' | 'quadrant' | 'iceberg',
  // versus mode:
  sides?: CompareSide[],  // { name, items: { label, value }[] }
  // quadrant mode:
  quadrantItems?: QuadrantItem[], // { label, x: 0-100, y: 0-100 }
  xAxis?: string,
  yAxis?: string,
  // iceberg mode:
  visible?: IcebergItem[],  // { label, description? }
  hidden?: IcebergItem[],
}
```

| Mode | Visual | Best For |
|------|--------|----------|
| `versus` | Side-by-side columns | A vs B feature comparison, pros/cons |
| `quadrant` | 2×2 scatter plot | Strategic positioning, priority matrix |
| `iceberg` | Above/below waterline | Visible vs hidden aspects, surface vs depth |

---

#### 7. `funnel` — Funnel / Pyramid / Conversion Flow

Layered narrowing visualization for conversion paths and hierarchies.

```ts
{
  type: 'funnel',
  title: string,
  body?: string,
  layers: FunnelLayer[],  // { label, description?, value?: number }
  variant: 'funnel' | 'pyramid' | 'slope',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `funnel` | Top-wide, bottom-narrow trapezoids | Sales funnel, conversion rates |
| `pyramid` | Bottom-wide, top-narrow triangle | Hierarchy, Maslow's pyramid |
| `slope` | Angled descending bars | Decline trends, drop-off rates |

---

#### 8. `concentric` — Concentric Rings / Layers

Nested circles showing layered relationships (inside-out or core-to-edge).

```ts
{
  type: 'concentric',
  title: string,
  body?: string,
  rings: ConcentricRing[],  // { label, description? } — first = innermost
  variant: 'circles' | 'diamond' | 'target',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `circles` | Concentric round rings | Ecosystem layers, onion model |
| `diamond` | Rotated square layers | Alternative concentric style |
| `target` | Bullseye target rings | Goal focus, priority rings |

---

#### 9. `hub-spoke` — Radial / Hub-and-Spoke

Central node with radiating connections. Use for showing relationships to a core concept.

```ts
{
  type: 'hub-spoke',
  title: string,
  body?: string,
  center: { label: string, description?: string },
  spokes: { label: string, description?: string }[],  // 3-8 spokes recommended
  variant: 'orbit' | 'solar' | 'pinwheel',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `orbit` | Orbital ring layout | Ecosystem, platform capabilities |
| `solar` | Sun + planets radial | Core + satellite concepts |
| `pinwheel` | Rotating blade layout | Balanced multi-aspect relationships |

---

#### 10. `venn` — Venn Diagram / Set Intersection

Overlapping sets showing shared and unique attributes.

```ts
{
  type: 'venn',
  title: string,
  body?: string,
  sets: { label: string, description?: string }[],  // 2-4 sets
  intersectionLabel?: string,
  variant: 'classic' | 'linear' | 'linear-filled',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `classic` | Traditional overlapping circles | Concept overlap, shared traits |
| `linear` | Horizontal overlapping bars | Simpler 2-set comparisons |
| `linear-filled` | Filled horizontal overlap | Stronger visual emphasis |

---

#### 11. `cycle` — Circular Process Diagram

Cyclic processes (PDCA, lifecycle, feedback loops). Steps arranged in a closed loop.

```ts
{
  type: 'cycle',
  title: string,
  body?: string,
  steps: { label: string, description?: string }[],  // 3-8 steps
  variant: 'circular' | 'gear' | 'loop',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `circular` | Steps on a circle with arc arrows | PDCA, lifecycle, iterative processes |
| `gear` | Gear-tooth shaped nodes | Interlocking mechanisms, systems |
| `loop` | Oval/racetrack layout | Continuous loops, feedback cycles |

---

#### 12. `table` — Table / Matrix Layout

Structured data in rows and columns with header styling.

```ts
{
  type: 'table',
  title: string,
  body?: string,
  headers: string[],             // column headers
  rows: { cells: string[], highlight?: boolean }[],  // 2-10 rows
  variant: 'striped' | 'bordered' | 'highlight',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `striped` | Alternating row backgrounds | General data display |
| `bordered` | All cell borders visible | Dense data, comparisons |
| `highlight` | Accent color on highlighted rows | Emphasizing key rows |

---

#### 13. `roadmap` — Multi-Track Timeline / Roadmap

Phased planning with status tracking per item.

```ts
{
  type: 'roadmap',
  title: string,
  body?: string,
  phases: {
    label: string,
    items: { label: string, status?: 'done' | 'active' | 'pending' }[]
  }[],  // 2-6 phases
  variant: 'horizontal' | 'vertical' | 'milestone',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `horizontal` | Column-based phase cards | Product roadmaps, quarterly plans |
| `vertical` | Vertical timeline with numbered nodes | Project phases, historical timelines |
| `milestone` | Diamond markers on horizontal track | Release milestones, key deliverables |

---

#### 14. `swot` — SWOT Analysis Matrix

Four-quadrant SWOT analysis with colored sections.

```ts
{
  type: 'swot',
  title: string,
  body?: string,
  strengths: SwotItem[],      // { label, description? }
  weaknesses: SwotItem[],
  opportunities: SwotItem[],
  threats: SwotItem[],
}
```

- Fixed 2×2 grid: S(↑), W(↓), O(★), T(⚠)
- Each quadrant auto-colors with palette
- Best for: strategic analysis, competitive assessment, project evaluation

---

#### 15. `mindmap` — Mind Map / Radial Tree

SVG-based mind map with center root, left/right branches, and optional sub-branches.

```ts
{
  type: 'mindmap',
  title: string,
  body?: string,
  root: MindmapNode,  // { label, children?: MindmapNode[] }
}
```

- Root renders as colored pill in center
- Branches split left/right automatically
- Supports 2 levels of depth (root → branches → sub-branches)
- Best for: brainstorming, topic decomposition, knowledge mapping
- Recommended: 3-6 main branches, 0-3 sub-branches each

---

#### 16. `stack` — Layered Stack Diagram

Stacked layers showing hierarchical architecture or layered concepts.

```ts
{
  type: 'stack',
  title: string,
  body?: string,
  layers: StackLayer[],  // { label, description? }
  variant: 'horizontal' | 'vertical' | 'offset',
}
```

| Variant | Visual | Best For |
|---------|--------|----------|
| `horizontal` | Stacked horizontal bars with left accent | Technology stacks, architecture layers |
| `vertical` | Ascending columns side by side | Comparative heights, building blocks |
| `offset` | Overlapping cascading cards | Priority layers, progressive depth |

---

### B. Block-Slide (Free Layout Composition)

The `block-slide` type enables **multiple diagrams on a single slide** via positioned blocks on a canvas.

```ts
{
  type: 'block-slide',
  title: string,
  blocks: ContentBlock[],  // positioned diagram blocks
}

// Each ContentBlock:
{
  id: string,         // unique ID (e.g., 'b1', 'b2')
  x: number,          // percentage 0-100 (left edge)
  y: number,          // percentage 0-100 (top edge)
  width: number,      // percentage 0-100
  height: number,     // percentage 0-100
  data: BlockData,    // one of 15 block types
}
```

**16 block data types** (same engines as standalone slides, but without title/body wrappers):

| Block `type` | Fields (same as standalone minus `title`/`body`) |
|-------------|------------------------------------------------|
| `title-body` | `{ title, body? }` |
| `grid-item` | `{ items, variant, columns? }` |
| `sequence` | `{ steps, variant, direction? }` |
| `compare` | `{ mode, sides?, quadrantItems?, xAxis?, yAxis?, visible?, hidden? }` |
| `funnel` | `{ layers, variant }` |
| `concentric` | `{ rings, variant }` |
| `hub-spoke` | `{ center, spokes, variant }` |
| `venn` | `{ sets, intersectionLabel?, variant }` |
| `cycle` | `{ steps, variant }` |
| `table` | `{ headers, rows, variant }` |
| `roadmap` | `{ phases, variant }` |
| `swot` | `{ strengths, weaknesses, opportunities, threats }` |
| `mindmap` | `{ root }` |
| `stack` | `{ layers, variant }` |
| `chart` | `{ chartType, bars?, slices?, innerRadius?, categories?, lineSeries?, indicators?, radarSeries?, proportionItems?, waterfallItems?, comboSeries?, scatterSeries?, scatterXAxis?, scatterYAxis?, gaugeData?, treemapData?, sankeyNodes?, sankeyLinks?, heatmapYCategories?, heatmapData?, sunburstData?, boxplotItems?, ganttTasks?, highlight? }` |
| `image` | `{ src?, alt?, fit?, placeholder? }` — placeholder for images; always generate with `src` omitted |

**Content-aware block height guide:**

The design canvas is 1920×1080 (content area ~1600×824px after padding). Block heights are percentages of this content area. **Size blocks to fit their content — never default to `height: 96`.**

| Block Type | Content Scenario | Recommended Height |
|-----------|-----------------|-------------------|
| `grid-item` | 1 row (2-3 items) | 25-35% |
| `grid-item` | 2 rows (4-6 items) | 45-55% |
| `grid-item` | 3 rows (7-9 items) | 70-85% |
| `sequence` (horizontal) | 3-5 steps | 20-30% |
| `sequence` (vertical) | 3-5 steps | 50-70% |
| `chart` | any type | 50-70% |
| `funnel` / `compare` | 3-5 layers/sides | 50-65% |
| `concentric` / `hub-spoke` / `venn` / `cycle` | SVG diagram | width × 0.6 (keep ~1.5:1 ratio) |
| `table` | 3-5 rows | 35-50% |
| `table` | 6-10 rows | 55-75% |
| `roadmap` | 2-4 phases | 45-65% |
| `swot` | 4 quadrants | 55-75% |
| `mindmap` | SVG tree | width × 0.6 (keep ~1.5:1 ratio) |
| `stack` | 3-5 layers | 40-60% |
| `title-body` | heading + 1-2 lines | 20-30% |
| `title-body` | heading + paragraph | 30-45% |
| `image` | accent / fill | 25-40% |
| `image` | hero / showcase | 50-80% |

**8 layout patterns** (use pattern letter in Phase 2 design notes):

```
Pattern A — Vertical stack: diagram + image bottom
  diagram: { x: 2, y: 2,  width: 96, height: 55 }
  image:   { x: 2, y: 60, width: 96, height: 36 }

Pattern B — Side by side: diagram + image (6:4)
  diagram: { x: 2, y: 2,  width: 58, height: 96 }
  image:   { x: 62, y: 2, width: 36, height: 96 }

Pattern C — Top chart + bottom image
  chart:   { x: 2, y: 2,  width: 96, height: 60 }
  image:   { x: 2, y: 65, width: 96, height: 32 }

Pattern D — Header + two columns
  title:   { x: 2, y: 2,  width: 96, height: 18 }
  diagram: { x: 2, y: 23, width: 55, height: 74 }
  image:   { x: 60, y: 23, width: 38, height: 74 }

Pattern E — Three columns: text + diagram + image
  text:    { x: 2, y: 2,  width: 30, height: 96 }
  diagram: { x: 34, y: 2, width: 32, height: 96 }
  image:   { x: 68, y: 2, width: 30, height: 96 }

Pattern F — Dashboard: 2 charts + image + text
  chart1:  { x: 2, y: 2,  width: 47, height: 48 }
  chart2:  { x: 51, y: 2, width: 47, height: 48 }
  image:   { x: 2, y: 53, width: 47, height: 44 }
  text:    { x: 51, y: 53, width: 47, height: 44 }

Pattern G — Golden ratio: wide diagram + side panel
  diagram: { x: 2, y: 2,  width: 62, height: 96 }
  text:    { x: 66, y: 2, width: 32, height: 45 }
  image:   { x: 66, y: 50, width: 32, height: 47 }

Pattern H — Compact grid + hero image
  grid:    { x: 2, y: 2,  width: 50, height: 55 }
  image:   { x: 2, y: 60, width: 50, height: 37 }
  image2:  { x: 54, y: 2, width: 44, height: 96 }
```

**Anti-patterns (NEVER do these):**
- `height: 96` on a 1-row grid-item (creates ~260px-tall cards with 60% empty space)
- `height: 96` on a horizontal sequence (natural height is ~120px, rest is wasted)
- 3+ consecutive block-slides with the same layout pattern
- Single block filling 96×96 (use standalone slide type instead)
- SVG diagram in a square container (use width:height ratio ~1.5:1)

**Image block** — placeholder for screenshots, photos, or illustrations:

```ts
{ type: 'image', placeholder: '数据中心现代化服务器机房全景', alt: '数据中心', fit: 'cover' }
```

- **Always omit `src`** — generate in placeholder mode only. Users upload actual images later.
- **Minimum size**: `width: 25, height: 25` (smaller blocks look like broken thumbnails)

**When to add an image block:**

| Scenario | Action |
|----------|--------|
| Diagram content fills <60% of slide | Add image block to fill remaining space |
| Text-heavy slide needs visual break | Add image block alongside text |
| Product / UI discussion | Add screenshot placeholder |
| Architecture / system topic | Add diagram placeholder |
| Dashboard with extra space | Add contextual photo |
| Any block-slide with only 1 block | Add image as second block |

**Placeholder naming — be specific and descriptive:**

| Good placeholder | Bad placeholder |
|-----------------|----------------|
| `'高性能计算集群服务器机房实景'` | `'图片'` |
| `'移动端用户注册流程界面截图'` | `'截图'` |
| `'团队成员在办公室协作讨论场景'` | `'团队'` |
| `'云原生微服务架构拓扑示意图'` | `'架构图'` |
| `'季度销售数据可视化仪表盘'` | `'数据'` |

**`fit` selection guide:**
- `cover` (default) — photos, scenes, backgrounds → crops to fill, no letterboxing
- `contain` — screenshots, diagrams, logos → shows full image with possible letterboxing

**When to use block-slide:**
- Combining a text explanation with a diagram side by side
- Dashboard-style slides with multiple small charts/diagrams
- Complex layouts that don't fit a single slide type
- When you need a title + body PLUS a diagram on the same slide
- When content is sparse — combine diagram + image placeholder to fill the slide
- When a diagram needs a **specific height** less than full-screen (e.g., 1-row grid at 30%)
- When you want to **pair two diagram types** on one slide (e.g., chart + sequence)
- When you want to add an **image accent** alongside any diagram
- When a standalone slide type would leave >35% empty space

**When NOT to use block-slide:**
- Single full-screen chart with no companions → use standalone `chart` type
- Pure title or section break → use `title` type
- Single key insight with no data → use `key-point` type
- Content naturally fills a standalone type (e.g., 6-item grid, 5-step sequence at full width)

---

### Visual Composition Strategy (5 Core Principles)

These principles govern every block-slide layout decision:

**1. Size blocks by content, not by default** — Estimate actual content height before assigning block dimensions. A 1-row grid of 3 items is ~160px tall (≈20% of 824px content area). Giving it `height: 96` wastes 600px. Use the height guide table above.

**2. Use 2-4 blocks per block-slide** — A single block filling the entire canvas is just a standalone slide type with extra overhead. Two blocks create visual pairing. Three blocks create hierarchy. Four blocks create a dashboard. More than four gets cluttered.

**3. Vary layouts across the deck** — No more than 2 consecutive block-slides should use the same layout pattern (A-H). Track which patterns you've used and rotate. A deck of 10 block-slides should use at least 4 different patterns.

**4. Fill sparse areas with image blocks** — When a diagram's content occupies <60% of the slide area, add an `image` block to fill the gap. This is the primary mechanism for preventing large empty areas. Every block-slide should be evaluated: "would an image block improve this?"

**5. Balance visual weight** — Heavy content blocks (data-dense charts, multi-row grids) should be paired with lighter elements (images, short text). Don't stack two heavy diagrams unless creating a dashboard layout (Pattern F).

---

## Design Workflow (MANDATORY 3-Phase Process)

### Phase 1: Analyze — Inventory & Research

Before writing ANY slide data:

1. **Read the source document** (`--source` or auto-detect `full.md`) thoroughly. Extract all numbers, comparisons, rankings, and key insights.
2. **Read the script file** (`--script`). Understand each slide's intent.
3. **Review the asset catalog above.** For each slide in the script, identify which slide type and variant best communicates the message.

### Phase 2: Design — Slide-by-Slide Plan

For EACH slide, produce a brief design rationale:

```
Slide 3: "季度增长趋势"
  → Data: Q1-Q4 revenue from source doc (280, 340, 410, 520)
  → Type: block-slide (chart + image)
  → Sizing: chart needs flex space → height:65%; image fills bottom → height:28%
  → Composition: Pattern C — chart top (96×65%), image bottom (96×28%)
  → Image: '季度营收增长趋势分析图表背景'
  → Why block? Chart alone leaves title area sparse; image adds context

Slide 5: "技术栈全景"
  → Data: 6 technology domains from source doc
  → Type: block-slide (grid-item + image)
  → Sizing: 6 items = 3 cols × 2 rows → ~320px → height ≈ 55%
  → Composition: Pattern B — grid left (58×55%), image right (36×55%), both at y:2
  → Image: '技术架构分层示意图'
  → Grid: variant: outline, columns: 3
  → Why not height:96? 2-row grid at full height = 260px-tall cards with 50% wasted space

Slide 7: "用户转化路径"
  → Data: Visit→Register→Pay with exact numbers
  → Type: block-slide (funnel + title-body)
  → Sizing: 4-layer funnel stretches well → height:90%
  → Composition: Pattern G — funnel left (60×90%), title-body right (34×40% at y:25)
  → Why block? Title-body block adds conversion insight text alongside funnel visual
```

**Slide type selection guide:**

| Content Intent | Recommended Type | Key Signal |
|---------------|-----------------|------------|
| Opening / section break | `title` | Needs visual breathing room |
| One big takeaway | `key-point` | Single statement, no data |
| Trend over time | `chart` (line) | Time-series, growth curves |
| Category comparison | `chart` (bar) | Comparing values across categories |
| Ranking / leaderboard | `chart` (horizontal-bar) | Long-label rankings, sorted comparisons |
| Composition / segment breakdown | `chart` (stacked-bar) | Revenue by product line, cost structure |
| Proportion breakdown | `chart` (pie) | Parts of a whole, market share |
| Proportion + total | `chart` (donut) | Parts of a whole with center total |
| Proportion with magnitude | `chart` (rose) | Comparing slices where size difference matters |
| Trend with volume | `chart` (area) | Growth curves with filled area emphasis |
| Multi-dimension assessment | `chart` (radar) | Comparing items across 4-6 dimensions |
| Completion / coverage rates | `chart` (proportion) | Progress bars, percentage comparisons |
| KPI dashboard / metrics | `grid-item` (solid) | Multiple numeric values with labels |
| Feature/capability list | `grid-item` (outline/sideline) | Text-heavy items without values |
| Process / workflow | `sequence` (arrows/timeline) | Ordered steps with progression |
| A vs B comparison | `compare` (versus) | Side-by-side feature comparison |
| Strategic positioning | `compare` (quadrant) | 2-axis classification |
| Surface vs depth | `compare` (iceberg) | Visible vs hidden aspects |
| Conversion / drop-off | `funnel` (funnel) | Narrowing quantities |
| Hierarchy / priority | `funnel` (pyramid) | Layered importance |
| Core + ecosystem | `hub-spoke` (orbit) | Central concept with satellites |
| Layered architecture | `concentric` (circles) | Nested layers, inside-out |
| Concept overlap | `venn` (classic) | Shared and unique traits |
| Profit decomposition, bridge | `chart` (waterfall) | Incremental gains/losses to a total |
| Dual-axis comparison | `chart` (combo) | Bars for absolute values + line for rates |
| Correlation / positioning | `chart` (scatter) | Two/three-variable relationship mapping |
| Single KPI health | `chart` (gauge) | One value against a max target |
| Hierarchical proportions | `chart` (treemap) | Nested categories with area-encoded values |
| Flow / allocation | `chart` (sankey) | Source→target weighted connections |
| Intensity / correlation | `chart` (heatmap) | X×Y grid color-coded by value |
| Hierarchical drill-down | `chart` (sunburst) | Concentric ring breakdown |
| Statistical variance | `chart` (boxplot) | Distribution comparison across groups |
| Project timeline | `chart` (gantt) | Task scheduling with start/end |
| Cyclic process / PDCA | `cycle` (circular) | Iterative loops, continuous improvement |
| Interlocking systems | `cycle` (gear) | Mechanism, interconnected processes |
| Structured data display | `table` (striped) | Tabular comparisons, status matrices |
| Product roadmap | `roadmap` (horizontal) | Quarterly plans, phased rollouts |
| Project milestones | `roadmap` (milestone) | Key deliverables on timeline |
| Historical timeline | `roadmap` (vertical) | Chronological events, project phases |
| Strategic analysis | `swot` | SWOT analysis, competitive assessment |
| Topic decomposition | `mindmap` | Brainstorming, knowledge mapping |
| Architecture layers | `stack` (horizontal) | Technology stacks, layered systems |
| Priority layers | `stack` (offset) | Progressive depth, cascading priorities |
| Mixed content | `block-slide` | Text + diagram on same slide |
| Sparse content + visual fill | `block-slide` + `image` block | Diagram occupies <60% → add image to balance |
| Product / UI showcase | `block-slide` + `image` block | Screenshot placeholder + caption or metrics |
| Architecture / system diagram | `block-slide` + `image` block | Image placeholder for complex diagrams + text explanation |
| Data + context | `block-slide` (chart + image) | Chart with accompanying photo/illustration |

### Phase 3: Implement — Generate Typed Data

Generate `src/data/user-decks/<deck-id>.ts`:

```ts
import type { DeckMeta } from '../data/types'

export const myDeck: DeckMeta = {
  id: 'my-deck',
  title: 'Deck Title',
  description: 'Brief description',
  date: '2026-02',
  slides: [
    // SlideData objects here
  ],
}
```

No manual registration needed — `import.meta.glob` auto-discovers files in `src/data/user-decks/`.

### Post-Generation Visual Audit (MANDATORY)

After generating all slides, review EVERY slide against this checklist. **Fix violations before delivering.**

**Typography & Sizing:**
1. **Every slide has explicit `titleSize` and `bodySize`** — section dividers: 72/28, key-points: 56/24, content slides: 40/20. No slide relies on CSS defaults.
2. **Hero slide font scaling matches content density** — `title` with no subtitle: `titleSize ≥ 80`; `key-point` with no body: `titleSize ≥ 64`. Sparse hero + small title = broken.
3. **Title sizes are consistent within category** — all content slides share `titleSize: 40`, all dividers share `titleSize: 72`.
4. **Block title-body blocks have explicit `titleSize` and `bodySize`** — match to block height per the Block-level Typography table.

**Block Sizing:**
5. **No gratuitous `height: 96`** — only use height ≥90% when content genuinely needs ~800px (3-row grid, large chart, 5+ funnel layers).
6. **Single-row grid-item height ≤ 35%** — 1 row of 3 items at height:96 = ~260px-tall cards with 60% wasted space. Cap at 35%.
7. **Horizontal sequence height ≤ 30%** — a 4-step horizontal sequence is ~120px actual height. height:80 wastes 540px.
8. **SVG diagram blocks maintain ~1.5:1 aspect ratio** — venn, concentric, hub-spoke, cycle use viewBox 800×480; avoid square containers.
9. **Block positions don't overlap and gaps are ≤5%** — blocks tile neatly with 2-5% margins.

**Content Quality:**
10. **Every content slide title is an assertion** — states a conclusion with at least one number (not just a topic label). Check every `grid-item`, `chart`, `sequence`, `compare`, `funnel` slide title.
11. **Text fits its container** — review text lengths against the Text Content Length Guide. `GridItemEntry.title` ≤ 8 chars, `SequenceStep.label` ≤ 10 chars, etc.
12. **No slide has >35% visual empty space** — if sparse, add image block or reduce block heights.

**Visual Variety:**
13. **≥50% of block-slides include an `image` block** — image placeholders enrich density and break monotony.
14. **No 3+ consecutive identical layouts** — vary patterns across consecutive block-slides.
15. **Every image block has a descriptive `placeholder`** — e.g., "数据中心服务器机房实景", not "图片".
16. **Block-slides ≤ 50% of total deck** — prefer standalone slide types when content fills a full slide naturally.
17. **Deck has section dividers every 4-6 content slides** — `title` or `key-point` slides provide breathing room.
18. **Chart type diversity** — no more than 3 charts of the same `chartType` in a single deck. If data fits, prefer `line` (trends), `donut` (proportions), `proportion` (percentages), `horizontal-bar` (rankings) over the default `bar`. Only use `bar` when vertical category comparison is clearly needed.

---

## Content Rules

### Assertion-Based Titles (MANDATORY)

Every slide title must **state the conclusion**, not merely name the topic. The audience should know the takeaway from the title alone.

| Bad (topic label) | Good (assertion) | Why |
|---|---|---|
| `"Q3 营收"` | `"Q3 营收同比增长 23%，创历史新高"` | States the conclusion, audience doesn't need to read the chart |
| `"技术架构"` | `"三层解耦架构支撑百万级并发"` | Tells what the architecture achieves |
| `"用户增长"` | `"付费用户突破 50 万，转化率提升至 8.2%"` | Quantifies the growth with real data |
| `"竞品对比"` | `"综合评分领先竞品 15-30%"` | States the comparison result |
| `"核心能力"` | `"6 大核心能力构建技术壁垒"` | Quantifies and qualifies the capability |
| `"性能优化"` | `"端到端延迟从 320ms 降至 45ms"` | Before/after with real numbers |

**Rules:**
1. **Include at least one number** in every content slide title (from source document)
2. **Use action verbs or result statements** — "增长", "突破", "降至", "领先", "覆盖"
3. **Maximum title length**: 25 characters for standalone slides, 20 characters for block-slide titles
4. **Section dividers (`title` type) are the exception** — these can be topic labels (e.g., "技术架构") since they serve as visual breaks

### Text Content Length Guide

Text that's too short wastes space; text that's too long overflows. Match text length to the component size.

**Standalone slide text limits:**

| Element | Min | Max | Example |
|---------|-----|-----|---------|
| `title` (title/key-point slide) | 4 chars | 20 chars | `"AI 重新定义生产力"` |
| `title` (content slide) | 6 chars | 25 chars | `"综合评分领先竞品 15-30%"` |
| `subtitle` / `body` | 10 chars | 60 chars | 1-2 sentences with real data |
| `highlight` (chart) | 2 chars | 12 chars | `"¥12.8M"`, `"+42%"` |

**Block title-body text limits (inside block-slide):**

| Block Height | Title Max | Body Max | Notes |
|-------------|-----------|----------|-------|
| ≤25% | 15 chars | 30 chars | Compact header — 1 line title, 1 line body |
| 25-40% | 20 chars | 80 chars | Standard header — title + 1-2 line body |
| 40-60% | 25 chars | 150 chars | Extended text block — title + paragraph |
| ≥60% | 30 chars | 250 chars | Text-dominant block — title + multi-paragraph |

**Diagram element text limits:**

| Element | Max Chars | Example |
|---------|-----------|---------|
| `GridItemEntry.title` | 8 chars | `"响应延迟"` |
| `GridItemEntry.description` | 30 chars | `"P99 延迟从 320ms 降至 45ms"` |
| `GridItemEntry.value` | 8 chars | `"+42.3%"` |
| `SequenceStep.label` | 10 chars | `"数据采集"` |
| `SequenceStep.description` | 25 chars | `"多源异构数据实时接入"` |
| `FunnelLayer.label` | 10 chars | `"注册转化"` |
| `CompareSide.name` | 6 chars | `"方案 A"` |
| `HubSpoke.center.label` | 6 chars | `"核心引擎"` |
| `HubSpoke.spokes[].label` | 8 chars | `"数据层"` |
| `ConcentricRing.label` | 6 chars | `"核心层"` |
| `VennSet.label` | 8 chars | `"用户体验"` |

**Why this matters:** The rendering engines have FIXED container sizes. A `GridItemEntry.title` renders at 16px in a ~200px-wide card. Text beyond 8 characters wraps awkwardly or overflows. A `HubSpoke` spoke label renders at 15px inside an 80px circle — more than 8 characters won't fit.

### Data Enrichment (MANDATORY)

Every slide must contain **real data from the source document**:

- `items[].value` → exact number (e.g., `"87.3"`, `"¥1,234"`, `"+42%"`)
- `items[].description` → meaningful detail, not placeholder text
- `bars[].values` → actual data points from source
- `body` → 1-2 sentence insight with real data, not generic filler
- `highlight` → actual key metric from source

**NEVER generate:**
- Empty slides with only a title
- Placeholder values like `"XX%"`, `"N/A"`, `"待填"`
- Invented data — every number must come from the source
- Vague body text like `"以下是数据"` or `"如图所示"`

### Content Density

| Slide Type | Minimum Content |
|------------|----------------|
| `chart` | 3+ data points, real values |
| `grid-item` | 3-6 items, each with title + description or value |
| `sequence` | 3-7 steps, each with label + description |
| `compare` (versus) | 2-3 sides, each with 3+ items |
| `funnel` | 3-5 layers with labels + values |
| `hub-spoke` | 1 center + 3-8 spokes |
| `concentric` | 3-5 rings |
| `venn` | 2-4 sets |
| `cycle` | 3-8 steps |
| `table` | 2-6 columns, 2-10 rows |
| `roadmap` | 2-6 phases, 1-5 items per phase |
| `swot` | 1-3 items per quadrant (strengths, weaknesses, opportunities, threats) |
| `mindmap` | 1 root + 3-6 main branches, 0-3 sub-branches each |
| `stack` | 3-5 layers with labels |

### Density ↔ Size Strategy

Content density determines block sizing. **Never give a block more height than its content needs.**

| Scenario | Content Fill | Strategy |
|----------|-------------|----------|
| grid-item 1 row (3 items) | ~160px actual | height: 25-35%, add image block below |
| grid-item 2 rows (6 items) | ~320px actual | height: 45-55%, may pair with side image |
| sequence horizontal (4 steps) | ~120px actual | height: 20-30%, use remaining space for image or text |
| chart (any type) | flex-fill | height: 50-70%, charts stretch well |
| funnel/pyramid (4 layers) | flex-fill | height: 50-65%, stretches to fit |
| SVG diagrams (venn/concentric/hub-spoke/cycle) | viewBox 800×480 | keep ~1.5:1 aspect ratio (e.g., width:60 height:45) |
| image placeholder | varies | height: 30-80% depending on purpose |

**Rules:**
- No slide should have **>35% visually empty area** (white space without content)
- When content fills <60% of the slide, add an `image` block to complement
- When content fills >90%, consider splitting across two slides

### Prefer Standalone Slides (IMPORTANT)

Block-slides are powerful but overused. **Default to standalone slide types first.** Only use block-slide when:
- You need 2+ diagrams on one slide
- Content genuinely needs specific height < 100% (e.g., 1-row grid at 30% + image)
- You're composing text + diagram side by side

**Decision flowchart:**

```
Is the content a single diagram (grid/sequence/chart/funnel/etc.)?
  YES → Does the content naturally fill most of the slide?
    YES → Use standalone slide type (grid-item, sequence, chart, etc.)
    NO  → Use block-slide: diagram block at content-appropriate height + image block
  NO → Are there 2+ diagrams or text + diagram?
    YES → Use block-slide with 2-3 blocks
    NO  → Is it a title, key-point, or single chart?
      YES → Use standalone type
```

**Target deck composition:**

| Slide Category | Target % | Purpose |
|---|---|---|
| `title` + `key-point` | 15-25% | Breathing room, section breaks, hero statements |
| Standalone diagrams (`grid-item`, `sequence`, `compare`, `funnel`, `concentric`, `hub-spoke`, `venn`, `cycle`, `table`, `roadmap`) | 20-35% | Full-screen diagrams that fill the slide naturally |
| Standalone `chart` | 10-20% | Full-screen data visualizations |
| `block-slide` | 25-40% | Multi-element compositions, text+diagram pairs |

A 20-slide deck should have roughly: 4 title/key-point + 5-6 standalone diagrams + 3 charts + 7-8 block-slides. **Never exceed 50% block-slides.**

### Visual Rhythm

- **Alternate slide types** — avoid 3+ consecutive slides of the same type
- **Section dividers** — use `title` or `key-point` between content groups (every 4-6 content slides)
- **Start with `title`**, end with `key-point` or `title` (conclusion)
- **Mix variants** — don't use `solid` grid-item for every grid slide; try `outline`, `sideline`, `topline`
- **Vary layout patterns** — no 2 consecutive block-slides should use the same pattern (A-H)
- **Alternate density** — follow a dense data slide with a lighter visual (title, key-point, or image-heavy block-slide)
- **Chart type diversity** — no more than 3 charts of the same `chartType` in a single deck. If data fits, prefer `area` (trends), `stacked-bar` (composition), `donut` (proportions), `rose` (magnitude comparison), `proportion` (percentages), `horizontal-bar` (rankings) over the default `bar`. Only use `bar` when vertical category comparison is clearly needed.

### Semantic Color Usage

Colors carry meaning. Use `valueColor` on `GridItemEntry` deliberately:

| Color | Meaning | When to Use |
|-------|---------|-------------|
| `positive` | Growth, win, improvement | Metrics going up, good outcomes |
| `negative` | Decline, loss, warning | Metrics going down, risks |
| `neutral` | Emphasis, category label | Neutral highlights, section headers |

### Rendering Pixel Budget (READ THIS FIRST)

Understanding the actual pixel space prevents oversized components. All values below are at the 1920×1080 design resolution.

**Slide padding eats 20% of the canvas:**
- Horizontal: `px-40` = 160px per side → **1600px usable width**
- Vertical: `py-32` = 128px per side → **824px usable height**

**What this means for block sizing (percentage → actual pixels):**

| Block height (%) | Actual pixels | Can fit... |
|---|---|---|
| 20% | 165px | 1 line of items (grid/sequence/pills) |
| 30% | 247px | Title + 1 row of cards, or short sequence |
| 45% | 371px | 2 rows of cards, or medium chart |
| 60% | 494px | Chart with title, or SVG diagram |
| 80% | 659px | 3-row grid, or large detailed chart |
| 96% | 791px | Full-height content (rare — only for dense 3-row grids or tall funnels) |

**Engine-internal font sizes (hardcoded, NOT configurable via data):**

| Engine | Element | Size | Notes |
|--------|---------|------|-------|
| GridItem | card title | 16px | Fixed — text wraps at ~10 chars in 2-col |
| GridItem | card description | 14px | Fixed — wraps at ~18 chars per line |
| GridItem | card value | 30px | Fixed — bold callout number |
| Sequence | step label | 14px | Fixed — fits ~8-10 chars |
| Sequence | step description | 12px | Fixed — ~16 chars per line |
| Compare (versus) | side name | 18px | Fixed |
| Compare (versus) | item label/value | 14px | Fixed |
| Funnel | layer label | 14px | Fixed |
| HubSpoke | center label (SVG) | 15px | Fixed — inside 112px circle |
| HubSpoke | spoke label (SVG) | 15px | Fixed — inside 80px circle |
| Concentric | ring label (SVG) | 16px | Fixed |
| Venn | set label (SVG) | 18px | Fixed |

These sizes are NOT affected by `titleSize`/`bodySize` — those only control the **slide-level** title and body text above the diagram. Understanding this prevents confusion: making `titleSize: 60` won't make grid-item card titles bigger.

**Block-slide title-body text sizing:**

The `title-body` block type inside block-slides supports `titleSize`, `bodySize`, `titleColor`, `textColor`. Unlike engine titles, these ARE configurable.

| Block Purpose | `titleSize` | `bodySize` | Block Height |
|---|---|---|---|
| Compact heading (section label) | 28-32 | 16 | 15-20% |
| Standard header (title + 1 line body) | 32-40 | 18 | 20-30% |
| Explanatory text (title + paragraph) | 36-44 | 20 | 30-45% |
| Hero statement (large centered text) | 48-64 | 24 | 40-60% |

**Example: title-body block at 20% height (165px actual):**
```ts
{ type: 'title-body', title: '核心发现', body: 'AI 编程工具使开发效率提升 3.2 倍', titleSize: 36, bodySize: 18 }
```
This renders: title at 36px (~40px with line-height) + body at 18px (~24px with line-height) + gap ≈ 72px content in 165px container. Good fit.

**Example: title-body block at 20% height WITHOUT sizing:**
```ts
{ type: 'title-body', title: '核心发现', body: 'AI 编程工具使开发效率提升 3.2 倍' }
```
This renders: title at DEFAULT 36px + body at DEFAULT 18px. Same result, but only because the defaults happen to match. For larger or smaller blocks, you MUST set explicit sizes.

### Typography Standards (MANDATORY)

All slides support `titleSize?: number` (px) and `bodySize?: number` (px) to override default CSS font sizes. **Use these to ensure visual consistency across the entire deck.**

**Default CSS sizes (when `titleSize`/`bodySize` are omitted):**

| Component | Title default | Body default |
|-----------|--------------|-------------|
| `title` slide | `text-6xl` (60px) | subtitle: `text-2xl` (24px) |
| `key-point` slide | `text-5xl` (48px) | body: `text-xl` (20px) |
| All 7 diagram engines | `text-4xl` (36px) | body: `text-lg` (18px) |
| `chart` slide | `text-4xl` (36px) | body: `text-lg` (18px) |

**Standard `titleSize` / `bodySize` to set on EVERY slide:**

| Slide Category | `titleSize` | `bodySize` | Notes |
|---------------|------------|-----------|-------|
| Section divider (`title` type) | `72` | `28` | Larger for visual impact; deck opener can go up to `80` |
| Key takeaway (`key-point` type) | `56` | `24` | Slightly smaller than section divider |
| Content slides (all diagram/chart types) | `40` | `20` | Unified across grid-item, sequence, compare, funnel, concentric, hub-spoke, venn, cycle, table, roadmap, chart |
| Block-slide title | — | — | block-slide `title` is rendered by the shell; individual blocks use their own engine defaults |

**Font Size Scaling by Content Density (CRITICAL):**

`title` and `key-point` are "hero" slides — their purpose is to make a single statement dominate the visual field. When these slides have minimal content, the title **MUST** be scaled up to fill the space. A small title on an otherwise empty slide looks broken and amateurish.

| Slide Scenario | `titleSize` | `bodySize` | Why |
|----------------|------------|-----------|-----|
| Deck opener — title only or title + short badge | `88-96` | — | Maximum impact, first impression; the title IS the slide |
| Deck opener — title + subtitle + badge | `80` | `28` | Full content, standard opener |
| Section divider — title only (no subtitle) | `80-88` | — | No subtitle means more empty space → bigger title to compensate |
| Section divider — title + subtitle | `72` | `28` | Standard section divider |
| Key-point — title only (no subtitle, no body) | `64-72` | — | Single statement must dominate the centered space |
| Key-point — title + subtitle, no body | `56-64` | `24-28` | Subtitle adds visual balance, title can be slightly smaller |
| Key-point — title + body paragraph | `56` | `24` | Standard key-point with supporting text |
| Content slides (charts, diagrams, grids) | `40` | `20` | Diagram/chart content occupies most of the slide |

**Scaling principle**: The fewer content elements on a slide, the larger the title font must be. A `title` slide with nothing but a 6-word heading at `titleSize: 56` wastes 70%+ of the visual area — push it to `80` or higher. Conversely, a content-dense chart slide should keep `titleSize: 40` so the title doesn't compete with the data.

**Short title boost**: Titles under ~8 characters (e.g., `"模型只是一半"`, `"Thank You"`) should use the **upper end** of their range. Short text at moderate sizes creates an awkward "floating label" effect.

**Anti-patterns:**
- `title` slide with `titleSize: 56` or below → looks like a normal paragraph, not a section divider
- `key-point` slide with only a title at `titleSize: 48` → too small for a hero statement, wastes the centered layout
- Deck opener at `titleSize: 72` → underwhelming first impression; opener should always be ≥ `80`

**Rules:**

1. **Set `titleSize` and `bodySize` on every slide** — do not rely on CSS defaults, which vary across slide types and produce inconsistent title sizes.
2. **All content slides use the same `titleSize: 40`** — grid-item, sequence, compare, funnel, concentric, hub-spoke, venn, cycle, table, roadmap, and chart must all share the same title size for visual coherence.
3. **Section dividers (`title` type) get `titleSize: 72`** — these are meant to be high-impact, big-text transition pages. The deck opening slide can use `titleSize: 80`.
4. **Scale hero slides by content density** — `title` and `key-point` slides with fewer elements (no subtitle, no body) must increase `titleSize` to fill the visual space. See the scaling table above.
5. **Subtitle and body sizes must also be consistent** — use `bodySize: 20` for all content slides, `bodySize: 28` for section dividers.
6. **Title position is fixed by each component** — titles always appear at the top-left for content slides and centered for title/key-point slides. Do not attempt to reposition via data.

---

## Style System

Read the style definition file at `.claude/skills/web-ppt/styles/{style}.md`. The theme is already implemented at `src/theme/{style}.ts`. Do NOT regenerate the theme file — it exists.

The style file defines: color tokens, typography scale, card style, slide style, ECharts theme, layout principles, and Framer Motion animation config.

---

## Generation Workflow

### Full Generation (no `--slides` flag)

1. **Read source document** — study it thoroughly, note all data points
2. **Read script file** — understand each slide's intent
3. **Phase 1: Analyze** — list available layouts/charts, match to content
4. **Phase 2: Design** — write slide-by-slide plan with type + variant + rationale
5. **Phase 3: Implement** — generate `src/data/user-decks/<deck-id>.ts` with typed `SlideData[]`
6. **Verify** — `npx tsc --noEmit` passes, dev server running (Vite auto-discovers via glob)
7. **Report** — slide count, deck ID, URL `localhost:5173/#<deck-id>`

### Partial Regeneration (`--slides` flag)

1. Read script for context
2. Update only specified slide entries in the deck data file
3. Verify TypeScript compiles
4. Report which slides were updated (HMR auto-refreshes)

---

## TypeScript Reference — All Data Types

```ts
// ─── Shared ───
type SemanticColor = 'positive' | 'negative' | 'neutral'

// ─── Slide Types ───
// All slide types support: titleSize?: number; bodySize?: number (px overrides)

interface TitleSlideData {
  type: 'title'; title: string; subtitle?: string; badge?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:72, bodySize:28
}

interface KeyPointSlideData {
  type: 'key-point'; title: string; subtitle?: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:56, bodySize:24
}

interface ChartSlideData {
  type: 'chart'; chartType: ChartType
  title: string; body?: string; highlight?: string; chartHeight?: number
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  bars?: ChartBar[]; slices?: ChartSlice[]; innerRadius?: number
  categories?: string[]; lineSeries?: LineSeries[]
  indicators?: RadarIndicator[]; radarSeries?: RadarSeries[]
  proportionItems?: ProportionItem[]; waterfallItems?: WaterfallItem[]
  comboSeries?: ComboSeries[]; scatterSeries?: ScatterSeries[]
  scatterXAxis?: string; scatterYAxis?: string; gaugeData?: GaugeData
  treemapData?: TreemapNode[]; sankeyNodes?: SankeyNode[]; sankeyLinks?: SankeyLink[]
  heatmapYCategories?: string[]; heatmapData?: [number, number, number][]
  sunburstData?: SunburstNode[]; boxplotItems?: BoxplotItem[]; ganttTasks?: GanttTask[]
}

interface GridItemSlideData {
  type: 'grid-item'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  items: GridItemEntry[]; variant: GridItemVariant; columns?: number
}

interface SequenceSlideData {
  type: 'sequence'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  steps: SequenceStep[]; variant: SequenceVariant
  direction?: 'horizontal' | 'vertical'
}

interface CompareSlideData {
  type: 'compare'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  mode: 'versus' | 'quadrant' | 'iceberg'
  sides?: CompareSide[]; quadrantItems?: QuadrantItem[]
  xAxis?: string; yAxis?: string
  visible?: IcebergItem[]; hidden?: IcebergItem[]
}

interface FunnelSlideData {
  type: 'funnel'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  layers: FunnelLayer[]; variant: 'funnel' | 'pyramid' | 'slope'
}

interface ConcentricSlideData {
  type: 'concentric'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  rings: ConcentricRing[]; variant: 'circles' | 'diamond' | 'target'
}

interface HubSpokeSlideData {
  type: 'hub-spoke'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  center: { label: string; description?: string }
  spokes: { label: string; description?: string }[]
  variant: 'orbit' | 'solar' | 'pinwheel'
}

interface VennSlideData {
  type: 'venn'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  sets: { label: string; description?: string }[]
  intersectionLabel?: string
  variant: 'classic' | 'linear' | 'linear-filled'
}

interface CycleSlideData {
  type: 'cycle'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  steps: { label: string; description?: string }[]
  variant: 'circular' | 'gear' | 'loop'
}

interface TableSlideData {
  type: 'table'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  headers: string[]
  rows: { cells: string[]; highlight?: boolean }[]
  variant: 'striped' | 'bordered' | 'highlight'
}

interface RoadmapSlideData {
  type: 'roadmap'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  phases: { label: string; items: { label: string; status?: 'done' | 'active' | 'pending' }[] }[]
  variant: 'horizontal' | 'vertical' | 'milestone'
}

interface SwotSlideData {
  type: 'swot'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  strengths: SwotItem[]; weaknesses: SwotItem[]
  opportunities: SwotItem[]; threats: SwotItem[]
}

interface MindmapSlideData {
  type: 'mindmap'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  root: MindmapNode  // { label, children?: MindmapNode[] }
}

interface StackSlideData {
  type: 'stack'; title: string; body?: string
  titleSize?: number; bodySize?: number  // Standard: titleSize:40, bodySize:20
  layers: StackLayer[]; variant: 'horizontal' | 'vertical' | 'offset'
}

interface BlockSlideData {
  type: 'block-slide'; title: string; blocks: ContentBlock[]
}

// ─── Sub-types ───
interface GridItemEntry { title: string; description?: string; value?: string; valueColor?: SemanticColor }
interface SequenceStep { label: string; description?: string }
interface CompareSide { name: string; items: { label: string; value: string }[] }
interface QuadrantItem { label: string; x: number; y: number }
interface IcebergItem { label: string; description?: string }
interface FunnelLayer { label: string; description?: string; value?: number }
interface ConcentricRing { label: string; description?: string }
interface ChartBar { category: string; values: { name: string; value: number; color?: SemanticColor }[] }
interface ChartSlice { name: string; value: number }
interface LineSeries { name: string; data: number[]; area?: boolean }
interface RadarIndicator { name: string; max: number }
interface RadarSeries { name: string; values: number[] }
interface ProportionItem { name: string; value: number; max?: number }
interface WaterfallItem { name: string; value: number; type?: 'increase' | 'decrease' | 'total' }
interface ComboSeries { name: string; data: number[]; seriesType: 'bar' | 'line'; yAxisIndex?: 0 | 1 }
interface ScatterSeries { name: string; data: [number, number, number?][] }
interface GaugeData { value: number; max?: number; name?: string }
interface TreemapNode { name: string; value: number; children?: TreemapNode[] }
interface SankeyNode { name: string }
interface SankeyLink { source: string; target: string; value: number }
interface SunburstNode { name: string; value?: number; children?: SunburstNode[] }
interface BoxplotItem { name: string; values: [number, number, number, number, number] }
interface GanttTask { name: string; start: number; end: number; category?: string }
interface SwotItem { label: string; description?: string }
interface MindmapNode { label: string; children?: MindmapNode[] }
interface StackLayer { label: string; description?: string }
interface ContentBlock { id: string; x: number; y: number; width: number; height: number; data: BlockData }
// BlockData includes: title-body, grid-item, sequence, compare, funnel, concentric, hub-spoke, venn, cycle, table, roadmap, swot, mindmap, stack, chart, image
// Image block: { type: 'image'; src?: string; alt?: string; fit?: 'cover' | 'contain' | 'fill'; placeholder?: string }

// ─── Variant Unions ───
type GridItemVariant = 'solid' | 'outline' | 'sideline' | 'topline' | 'top-circle' | 'joined' | 'leaf' | 'labeled' | 'alternating' | 'pillar' | 'diamonds' | 'signs'
type SequenceVariant = 'timeline' | 'chain' | 'arrows' | 'pills' | 'ribbon-arrows' | 'numbered' | 'zigzag'
type FunnelVariant = 'funnel' | 'pyramid' | 'slope'
type ConcentricVariant = 'circles' | 'diamond' | 'target'
type HubSpokeVariant = 'orbit' | 'solar' | 'pinwheel'
type VennVariant = 'classic' | 'linear' | 'linear-filled'
type CycleVariant = 'circular' | 'gear' | 'loop'
type TableVariant = 'striped' | 'bordered' | 'highlight'
type RoadmapVariant = 'horizontal' | 'vertical' | 'milestone'
type StackVariant = 'horizontal' | 'vertical' | 'offset'
type ChartType = 'bar' | 'horizontal-bar' | 'stacked-bar' | 'pie' | 'donut' | 'rose' | 'line' | 'area' | 'radar' | 'proportion' | 'waterfall' | 'combo' | 'scatter' | 'gauge' | 'treemap' | 'sankey' | 'heatmap' | 'sunburst' | 'boxplot' | 'gantt'
```

---

## Constraints

- **Data only** — you generate `SlideData[]` objects. Do NOT create or modify React components
- **Tailwind CSS only** — no custom CSS except `index.css`
- **No inline images, but actively use `image` blocks** — never embed base64 or external URLs; instead, use `image` block placeholders (always omit `src`) to fill visual gaps, accompany diagrams, and enrich sparse slides. Aim for **at least 50% of block-slides** to include an image block.
- **Type safety** — all data must conform to `SlideData` union type
- **Real data** — every value must come from the source document
- **Chinese preferred** — use `--lang zh` default for all Chinese content
