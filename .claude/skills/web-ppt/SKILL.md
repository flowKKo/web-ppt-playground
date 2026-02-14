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
| `src/components/engines/*.tsx` | 7 diagram engines (GridItem, Sequence, Compare, Funnel, Concentric, HubSpoke, Venn) |
| `src/components/slides/ChartSlide.tsx` | ECharts renderer (bar, pie, line, radar) |
| `src/components/blocks/` | Block model: BlockRenderer, BlockSlideRenderer, BlockWrapper |

---

## Available Slide Assets — Complete Catalog

> **CRITICAL**: Before designing any slide, review this catalog. Every slide you generate MUST use one of these types with the exact data shape specified. There are NO other options.

### A. Standalone Slide Types (10 types)

These are top-level `SlideData` types. Each renders as a full slide.

---

#### 1. `title` — Title / Section Divider

Centered large text. Use for deck opener, section breaks, and conclusion.

```ts
{ type: 'title', title: string, subtitle?: string, badge?: string }
```

- `badge` — small label (e.g., version, date, category tag)
- Layout: centered vertically and horizontally

---

#### 2. `key-point` — Key Insight / Callout

Large centered statement with optional body text. Use for core takeaways, quotes, section intros.

```ts
{ type: 'key-point', title: string, subtitle?: string, body?: string }
```

- Best for single-message slides: one impactful statement
- Layout: centered

---

#### 3. `chart` — Data Visualization (ECharts)

Full-width chart with title. **4 chart sub-types:**

```ts
{
  type: 'chart',
  chartType: 'bar' | 'pie' | 'line' | 'radar',
  title: string,
  body?: string,
  highlight?: string,    // big number callout (e.g., "¥12.8M")
  chartHeight?: number,  // px, default auto
  // bar-specific:
  bars?: ChartBar[],     // { category, values: { name, value, color? }[] }
  // pie-specific:
  slices?: ChartSlice[], // { name, value }
  innerRadius?: number,  // 0-100 for donut effect
  // line-specific:
  categories?: string[],
  lineSeries?: LineSeries[], // { name, data: number[], area?: boolean }
  // radar-specific:
  indicators?: RadarIndicator[], // { name, max }
  radarSeries?: RadarSeries[],   // { name, values: number[] }
}
```

**When to use which chart:**

| Chart | Best For | Data Shape |
|-------|----------|------------|
| `bar` | Category comparison, rankings, time series | 3-8 categories, 1-3 series per category |
| `pie` | Proportional breakdown, market share | 3-6 slices (use `innerRadius: 40` for donut) |
| `line` | Trends over time, growth curves | 4-12 time points, 1-3 series |
| `radar` | Multi-dimensional comparison, capability profiles | 4-6 dimensions, 2-3 items compared |

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
  data: BlockData,    // one of 9 block types
}
```

**10 block data types** (same engines as standalone slides, but without title/body wrappers):

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
| `chart` | `{ chartType, bars?, slices?, innerRadius?, categories?, lineSeries?, indicators?, radarSeries?, highlight? }` |
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
| `concentric` / `hub-spoke` / `venn` | SVG diagram | width × 0.6 (keep ~1.5:1 ratio) |
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
| Proportion breakdown | `chart` (pie) | Parts of a whole, market share |
| Multi-dimension assessment | `chart` (radar) | Comparing items across 4-6 dimensions |
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

After generating all slides, review every slide against this checklist:

1. **No gratuitous `height: 96`** — only use height ≥90% when the block content genuinely needs ~800px (e.g., 2-row grid, large chart, 5+ layer funnel). Single-row grids and horizontal sequences should be 25-35%.
2. **Single-row grid-item height ≤ 35%** — 1 row of 3 items at height:96 creates ~260px-tall cards with sparse content. Cap at 35%.
3. **≥50% of block-slides include an `image` block** — image placeholders enrich visual density and break monotony.
4. **No 3+ consecutive identical layouts** — vary layout patterns across consecutive block-slides (e.g., don't use Pattern A three times in a row).
5. **Every image block has a descriptive `placeholder`** — e.g., "数据中心服务器机房实景", not "图片" or "image".
6. **No slide has >35% visual empty space** — if a block-slide looks sparse, add an image block or reduce block heights.
7. **SVG diagram blocks maintain ~1.5:1 aspect ratio** — venn, concentric, hub-spoke use viewBox 800×480; avoid square or overly tall containers.
8. **Block positions don't overlap and gaps are ≤5%** — blocks should tile neatly with 2-5% margins.

---

## Content Rules

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

### Density ↔ Size Strategy

Content density determines block sizing. **Never give a block more height than its content needs.**

| Scenario | Content Fill | Strategy |
|----------|-------------|----------|
| grid-item 1 row (3 items) | ~160px actual | height: 25-35%, add image block below |
| grid-item 2 rows (6 items) | ~320px actual | height: 45-55%, may pair with side image |
| sequence horizontal (4 steps) | ~120px actual | height: 20-30%, use remaining space for image or text |
| chart (any type) | flex-fill | height: 50-70%, charts stretch well |
| funnel/pyramid (4 layers) | flex-fill | height: 50-65%, stretches to fit |
| SVG diagrams (venn/concentric/hub-spoke) | viewBox 800×480 | keep ~1.5:1 aspect ratio (e.g., width:60 height:45) |
| image placeholder | varies | height: 30-80% depending on purpose |

**Rules:**
- No slide should have **>35% visually empty area** (white space without content)
- When content fills <60% of the slide, add an `image` block to complement
- When content fills >90%, consider splitting across two slides

### Visual Rhythm

- **Alternate slide types** — avoid 3+ consecutive slides of the same type
- **Section dividers** — use `title` or `key-point` between content groups
- **Start with `title`**, end with `key-point` or `title` (conclusion)
- **Mix variants** — don't use `solid` grid-item for every grid slide; try `outline`, `sideline`, `topline`

### Semantic Color Usage

Colors carry meaning. Use `valueColor` on `GridItemEntry` deliberately:

| Color | Meaning | When to Use |
|-------|---------|-------------|
| `positive` | Growth, win, improvement | Metrics going up, good outcomes |
| `negative` | Decline, loss, warning | Metrics going down, risks |
| `neutral` | Emphasis, category label | Neutral highlights, section headers |

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
interface TitleSlideData {
  type: 'title'; title: string; subtitle?: string; badge?: string
}

interface KeyPointSlideData {
  type: 'key-point'; title: string; subtitle?: string; body?: string
}

interface ChartSlideData {
  type: 'chart'; chartType: 'bar' | 'pie' | 'line' | 'radar'
  title: string; body?: string; highlight?: string; chartHeight?: number
  bars?: ChartBar[]; slices?: ChartSlice[]; innerRadius?: number
  categories?: string[]; lineSeries?: LineSeries[]
  indicators?: RadarIndicator[]; radarSeries?: RadarSeries[]
}

interface GridItemSlideData {
  type: 'grid-item'; title: string; body?: string
  items: GridItemEntry[]; variant: GridItemVariant; columns?: number
}

interface SequenceSlideData {
  type: 'sequence'; title: string; body?: string
  steps: SequenceStep[]; variant: SequenceVariant
  direction?: 'horizontal' | 'vertical'
}

interface CompareSlideData {
  type: 'compare'; title: string; body?: string
  mode: 'versus' | 'quadrant' | 'iceberg'
  sides?: CompareSide[]; quadrantItems?: QuadrantItem[]
  xAxis?: string; yAxis?: string
  visible?: IcebergItem[]; hidden?: IcebergItem[]
}

interface FunnelSlideData {
  type: 'funnel'; title: string; body?: string
  layers: FunnelLayer[]; variant: 'funnel' | 'pyramid' | 'slope'
}

interface ConcentricSlideData {
  type: 'concentric'; title: string; body?: string
  rings: ConcentricRing[]; variant: 'circles' | 'diamond' | 'target'
}

interface HubSpokeSlideData {
  type: 'hub-spoke'; title: string; body?: string
  center: { label: string; description?: string }
  spokes: { label: string; description?: string }[]
  variant: 'orbit' | 'solar' | 'pinwheel'
}

interface VennSlideData {
  type: 'venn'; title: string; body?: string
  sets: { label: string; description?: string }[]
  intersectionLabel?: string
  variant: 'classic' | 'linear' | 'linear-filled'
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
interface ContentBlock { id: string; x: number; y: number; width: number; height: number; data: BlockData }
// BlockData includes: title-body, grid-item, sequence, compare, funnel, concentric, hub-spoke, venn, chart, image
// Image block: { type: 'image'; src?: string; alt?: string; fit?: 'cover' | 'contain' | 'fill'; placeholder?: string }

// ─── Variant Unions ───
type GridItemVariant = 'solid' | 'outline' | 'sideline' | 'topline' | 'top-circle' | 'joined' | 'leaf' | 'labeled' | 'alternating' | 'pillar' | 'diamonds' | 'signs'
type SequenceVariant = 'timeline' | 'chain' | 'arrows' | 'pills' | 'ribbon-arrows' | 'numbered' | 'zigzag'
type FunnelVariant = 'funnel' | 'pyramid' | 'slope'
type ConcentricVariant = 'circles' | 'diamond' | 'target'
type HubSpokeVariant = 'orbit' | 'solar' | 'pinwheel'
type VennVariant = 'classic' | 'linear' | 'linear-filled'
type ChartType = 'bar' | 'pie' | 'line' | 'radar'
```

---

## Constraints

- **Data only** — you generate `SlideData[]` objects. Do NOT create or modify React components
- **Tailwind CSS only** — no custom CSS except `index.css`
- **No inline images, but actively use `image` blocks** — never embed base64 or external URLs; instead, use `image` block placeholders (always omit `src`) to fill visual gaps, accompany diagrams, and enrich sparse slides. Aim for **at least 50% of block-slides** to include an image block.
- **Type safety** — all data must conform to `SlideData` union type
- **Real data** — every value must come from the source document
- **Chinese preferred** — use `--lang zh` default for all Chinese content
