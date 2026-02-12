---
name: web-ppt
description: "Generate web-based PPT presentations using React + Tailwind + ECharts + Framer Motion. Extracts real data from source docs. Usage: /web-ppt --lang zh --style swiss --script slides.md [--source full.md]"
argument-hint: "--lang <language> --style <style> --script <file> [--source <file>] [--slides <n,n,...>]"
---

# Web PPT Generator

Generate web-based slide presentations using a React + Vite project. Slides are 16:9 aspect ratio, rendered vertically with gaps. Each slide is a React component.

## Tech Stack

| Layer | Choice | Purpose |
|-------|--------|---------|
| Build | Vite | Dev server + production build |
| Framework | React + TypeScript | Component-based slide system |
| Styling | Tailwind CSS | Utility-first, design token via theme config |
| Animation | Framer Motion | Declarative entrance/transition animations |
| Charts | ECharts + echarts-for-react | Data visualization with theme support |
| Fonts | Google Fonts (Inter) | Typography, CJK fallback to system fonts |

## Argument Parsing

Parse `$ARGUMENTS` for these flags:

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--lang` | Yes | — | Output language: `zh`, `en`, `ja`, etc. |
| `--style` | Yes | — | Style name matching a file in `.claude/skills/web-ppt/styles/` or a built-in ID |
| `--script` | Yes | — | Path to the slide script Markdown file |
| `--slides` | No | all | Comma-separated slide numbers to regenerate (e.g., `5,8,12`) |
| `--source` | No | — | Path to the full reference document (e.g., `full.md`) for detailed data research |

Positional shorthand: `/web-ppt zh swiss slides.md` → lang=zh, style=swiss, script=slides.md

If a `full.md` (or similarly named source document) exists in the project root, **always read it** even if `--source` is not explicitly provided. The script file (`--script`) is the slide outline; the source document is the data reservoir.

---

## Project Structure

```
src/
├── App.tsx                  # Main app: renders <SlideDeck> with slide data
├── main.tsx                 # Entry point
├── index.css                # Tailwind directives + Google Fonts import
├── theme/
│   └── swiss.ts             # Style theme: colors, echarts theme, tailwind overrides
├── components/
│   ├── SlideDeck.tsx         # Vertical slide container with gap
│   ├── Slide.tsx             # Base 16:9 slide wrapper (aspect-ratio, padding, bg)
│   └── slides/               # One component per slide type
│       ├── TitleSlide.tsx
│       ├── DataComparisonSlide.tsx
│       ├── KeyPointSlide.tsx
│       ├── ComparisonSlide.tsx
│       ├── GridSlide.tsx
│       ├── ChartSlide.tsx
│       ├── PlayerCardSlide.tsx
│       ├── DiagramSlide.tsx
│       ├── ListSlide.tsx
│       └── PlaceholderSlide.tsx
├── charts/
│   └── BarChart.tsx          # ECharts bar chart wrapper with theme
└── data/
    └── slides.ts             # All slide content as typed data (generated from script)
```

## Style System

### Style Resolution

When resolving `--style`:
1. **Custom style file** — look for `.claude/skills/web-ppt/styles/{value}.md` relative to project root. Read the file and generate/update `src/theme/{value}.ts` accordingly.
2. **Free-text description** — infer colors, typography, and generate a theme file.

The style `.md` file defines design tokens. The generated `src/theme/{style}.ts` exports:
- `colors` — object with page, slide, card, text, accent color values
- `typography` — font families, size scale
- `echartsTheme` — ECharts theme object for `echarts.registerTheme()`
- `tailwindExtend` — values to merge into `tailwind.config.ts` → `theme.extend`

### Available Styles

| File | Name | Description |
|------|------|-------------|
| `swiss.md` | Swiss Style | 极简米白底、深炭灰文字、扁平化图表、慷慨留白、无衬线字体 |

---

## Slide Component Architecture

### Base `<Slide>` Wrapper

Every slide is wrapped in the base `<Slide>` component:

```tsx
// components/Slide.tsx
<motion.div
  id={`slide-${number}`}
  className="w-[min(90vw,1600px)] aspect-video overflow-hidden relative
             rounded-xl shadow-lg px-20 py-16 flex flex-col justify-center"
  style={{ background: theme.colors.slide }}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.15 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

Key rules:
- `aspect-video` enforces 16:9
- All slides wrapped in Framer Motion for entrance animation
- Inner elements use `motion.div` with `staggerChildren` for sequenced entrance

### `<SlideDeck>` Container

```tsx
// components/SlideDeck.tsx
<div className="flex flex-col items-center gap-10 py-10 min-h-screen"
     style={{ background: theme.colors.page }}>
  {slides.map((slide, i) => <SlideRenderer key={i} slide={slide} number={i + 1} />)}
</div>
```

### Slide Type Components

Each slide type is a separate component receiving typed props:

**TitleSlide** — centered title (text-5xl to text-7xl font-bold) + subtitle + optional date badge

**DataComparisonSlide** — 2-3 metric cards side by side, each with a big number (text-7xl to text-9xl font-extrabold) + label. Numbers use accent colors for positive/negative.

**KeyPointSlide** — large centered text (text-4xl to text-5xl) with minimal decoration

**ComparisonSlide** — 2-3 columns, each a card with title + bullet points. Cards use `bg-white rounded-xl shadow-sm border` pattern.

**GridSlide** — 2x3 or 3x2 grid of cards, each with number badge + title + short description

**ChartSlide** — ECharts bar/comparison chart taking full slide width. Use `echarts-for-react` with registered theme.

**PlayerCardSlide** — left side: rank badge + name + big score number. Right side: feature list or comparison chart.

**DiagramSlide** — flexbox flow diagram with arrow connectors (SVG or CSS pseudo-elements)

**ListSlide** — ordered/unordered list with stagger animation per item

**PlaceholderSlide** — dashed border box for screenshots:
```tsx
<div className="border-2 border-dashed border-black/10 rounded-xl
                flex items-center justify-center text-black/30 text-lg min-h-[200px]">
  {label}
</div>
```

---

## Slide Design Rules

> **Detailed rules and anti-rules: see "PPT Design Best Practices" section below.**
> This is the quick-reference summary.

### Typography (Tailwind Classes)

| Element | Classes | Min Size |
|---------|---------|----------|
| Title slide heading (H1) | `text-6xl font-bold` | 60px |
| Slide title (H2) | `text-5xl font-bold` | 48px |
| Key numbers | `text-7xl font-extrabold` | 80px |
| Card title (H3) | `text-xl font-semibold` | 20px |
| Body | `text-lg` or `text-xl` | 18px |
| Caption | `text-base` | 18px (minimum) |

**Never go below `text-base` (18px).** See BP-3.

### Spacing Tokens

| Token | Tailwind | Usage |
|-------|----------|-------|
| SECTION_GAP | `gap-8` (32px) | Between title and content blocks |
| CARD_GAP | `gap-6` (24px) | Between cards/columns |
| ITEM_GAP | `gap-4` (16px) | Between items inside a card |

See BP-2.

### Card Style

All cards: `rounded-[14px] px-8 py-6` + `cardStyle` object from theme. See BP-4.

### ECharts Configuration

- Registered theme matching `--style`
- Flat: no gradients, no 3D
- No grid lines (`show: false`)
- `borderRadius: [6, 6, 0, 0]` on bars
- `label.show: true` to display values on bars
- Auto-resize via echarts `autoResize`

See BP-7.

### Framer Motion Patterns

All defined in `motionConfig` from theme file:
- Slide entrance: `motionConfig.slide` — applied by `<Slide>` wrapper
- Stagger parent: `motionConfig.stagger` — wraps inner content
- Stagger child: `motionConfig.child` — each direct child element

See BP-8.

---

## Content Research & Data Enrichment

### The Core Problem

A script file (`slides.md`) only provides a slide outline — titles, rough structure, and slide types. **This is NOT enough to produce a good presentation.** Empty slides with titles and no data are useless.

### The Source Document

The source document (e.g., `full.md`) is the **primary data reservoir**. It contains:
- Exact numbers, percentages, scores, benchmarks
- Detailed comparisons and rankings
- Quotes, findings, and analysis
- Context, methodology, and caveats

### Research Workflow (MANDATORY)

Before generating ANY slide data, you MUST:

1. **Read the source document thoroughly.** Not skim — read every section. Understand what data exists.
2. **For each slide in the script**, search the source document for:
   - **Exact numbers** — don't round or guess. Use the real values from the document.
   - **Comparison data** — if the slide is a comparison, find ALL items being compared and their actual metrics.
   - **Rankings / Top-N** — if the slide shows rankings, extract the full ranking with scores.
   - **Trend data** — if the slide shows change over time, find the before/after values.
   - **Supporting details** — bullet points, features, explanations that add substance.
3. **Fill every data field** in the slide data with real content from the source:
   - `items[].value` → exact number from source (e.g., `"87.3"`, `"1,234"`, `"+42%"`)
   - `items[].label` → meaningful label, not generic (e.g., `"Claude 3.5 Sonnet 总分"` not `"得分"`)
   - `bars[].values` → actual chart data points from source
   - `features[].value` → specific detail, not placeholder
   - `body` → 1-2 sentence summary with key insight from source, not generic filler
   - `conclusion` → data-driven takeaway (e.g., `"Claude 以 87.3 分领先第二名 15.2 分"`)

### Content Density Standards

Each slide type has minimum content requirements:

| Slide Type | Minimum Content | What to Extract from Source |
|------------|----------------|---------------------------|
| DataComparison | 2-4 metrics with exact values + labels | Benchmark scores, percentages, rankings |
| Chart | 3-8 data bars with real values | Performance numbers, comparison metrics |
| Comparison | 2-3 columns, each with 3+ detail rows | Feature-by-feature comparison data |
| Grid | 4-6 cards, each with title + description | Key findings, capabilities, categories |
| PlayerCard | Score + 3+ feature rows with specifics | Individual item deep-dive data |
| List | 3-5 items, each a full sentence | Key takeaways, methodology steps, findings |
| Placeholder | Side panel with metric + 2+ info cards | Supporting statistics alongside the placeholder |
| Diagram | 3-5 steps with labels + descriptions | Process flow, methodology stages |
| KeyPoint | Title + subtitle + body paragraph | Core insight with supporting sentence |

### Anti-Patterns (NEVER DO)

- **Never generate a slide with only a title and no data.** Every slide must have substance.
- **Never use placeholder values** like `"XX%"`, `"N/A"`, or `"数据待填"`. If the source doesn't have the data, redesign the slide.
- **Never invent data.** Every number must come from the source document. If you can't find it, note this to the user.
- **Never use vague body text** like `"以下是相关数据"` or `"这里展示了对比"`. Body text must contain an actual insight.
- **Never leave chart bars with fewer than 3 data points.** A chart with 1-2 bars is not a chart — use DataComparison instead.
- **Never create a ComparisonSlide where each column has only 1 item.** Minimum 3 items per column to justify the comparison layout.

---

## Generation Workflow

### Full Generation (no `--slides` flag)

1. **Read the source document** (`--source` path, or auto-detect `full.md` in project root). Study it thoroughly.
2. **Read the script file** at `--script` path. This is the slide outline.
3. **Read the style file** at `.claude/skills/web-ppt/styles/{style}.md`.
4. **Research phase** — for each slide in the script, identify what specific data from the source document will populate it. Map source sections → slide data fields.
5. **Check if project is initialized** — if `package.json` doesn't exist, scaffold the Vite + React + Tailwind project first (see Project Setup below).
6. **Generate/update `src/theme/{style}.ts`** from the style definition.
7. **Generate/update `src/data/slides.ts`** — populate with REAL data extracted from the source document. Every value, label, bar, and description must come from the source.
8. **Generate/update slide components** — create any missing slide type components in `src/components/slides/`.
9. **Generate/update `src/App.tsx`** — import theme and slide data, render `<SlideDeck>`.
10. **Run dev server** if not already running: `npm run dev`.
11. **Report** the number of slides generated and the dev server URL.

### Partial Regeneration (`--slides` flag provided)

1. **Read the script file** for content reference.
2. **Update only the specified entries in `src/data/slides.ts`**.
3. **Update corresponding slide components** if the slide type changed.
4. **Report** which slides were updated. Vite HMR will auto-refresh.

### Project Setup (First Run Only)

If the project is not yet initialized, run:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install framer-motion echarts echarts-for-react
```

Then configure:
- `vite.config.ts` — add `@tailwindcss/vite` plugin
- `src/index.css` — add `@import "tailwindcss"` and Google Fonts
- `tailwind.config.ts` — extend theme with style colors/fonts

---

## PPT Design Best Practices (Rules & Anti-Rules)

Professional presentations follow strict visual discipline. Each rule below is a PPT design principle mapped to its concrete frontend implementation.

---

### BP-1: Safe Area & Content Utilization

**Principle:** Every slide has a fixed inner safe area. Content MUST NOT touch or exceed it. Effective utilization of the safe area should be 65-80% — enough to feel intentional, not cramped.

**DO (Rules):**
- Use fixed padding on `<Slide>` wrapper: `px-20 py-16` (80px horizontal, 64px vertical). This is the safe area.
- Content should fill 65-80% of the safe area. Use `max-w-[90%]` or constrain flex children.
- Title zone: reserve top ~15% height. Content zone: middle ~70%. Caption zone: bottom ~15%.
- Use `h-full` on the inner layout container so content distributes within the full safe area.

**DON'T (Anti-Rules):**
- Never use different padding values per slide type. The safe area is global, defined once in `<Slide>`.
- Never let text or cards touch the slide edge (0px from border). Minimum gap to slide edge = safe area padding.
- Never fill more than 85% of the slide — whitespace IS the design.
- Never use `overflow-visible` or allow content to bleed outside `<Slide>`.

**Frontend Token:**
```ts
// Defined once in <Slide> — NEVER override in slide type components
className="px-20 py-16" // safe area = 80px x 64px
```

---

### BP-2: Consistent Spacing Tokens

**Principle:** All spacing in PPT follows a fixed scale. Varying gaps between similar elements destroys visual rhythm.

**DO (Rules):**
- Define 3 spacing tiers, used consistently across ALL slide types:
  - `SECTION_GAP = gap-8` (32px) — between title block and content block
  - `CARD_GAP = gap-6` (24px) — between sibling cards or columns
  - `ITEM_GAP = gap-4` (16px) — between items inside a card
- Top-level slide layout container always uses `gap-8` (SECTION_GAP).
- Card grids and flex rows always use `gap-6` (CARD_GAP).
- Stacked items within a card always use `gap-4` (ITEM_GAP) or `gap-3` (12px) for compact lists.

**DON'T (Anti-Rules):**
- Never mix `gap-6`, `gap-8`, `gap-10`, `gap-12` at the same structural level across different slide types.
- Never use arbitrary `mt-2`, `mt-3`, `mb-4` for title-to-body spacing — use the parent's `gap` instead.
- Never hardcode pixel values in `style={{}}` for spacing — use Tailwind gap utilities.

**Frontend Token:**
```tsx
// Top-level layout in every slide type component:
<motion.div className="flex flex-col gap-8 h-full justify-center" ...>
  {/* title block */}
  {/* content block with gap-6 between cards */}
  {/* optional caption */}
</motion.div>
```

---

### BP-3: Typography Scale Consistency

**Principle:** PPT uses a strict type scale. Every text element maps to exactly one level — no ad-hoc sizes.

**DO (Rules):**
- Use exactly these 5 levels across all slides:

| Level | Role | Tailwind | Usage |
|-------|------|----------|-------|
| H1 | Title slide heading | `text-6xl font-bold` | Only in TitleSlide |
| H2 | Slide title (all others) | `text-5xl font-bold` | One per slide, always first |
| H3 | Card title / subtitle | `text-xl font-semibold` | Card headers, section labels |
| Body | Description text | `text-lg` or `text-xl` | Paragraphs, explanations |
| Caption | Source / footnote | `text-base` | Bottom notes, labels |

- Big numbers (metrics): `text-7xl font-extrabold` — always the same size across all data slides.
- Title `leading-tight`, body `leading-relaxed`.
- Color binding: H2 → `textPrimary`, Body → `textSecondary`, Caption → `textCaption`.

**DON'T (Anti-Rules):**
- Never use `text-4xl` for some titles and `text-5xl` for others at the same hierarchy level.
- Never use `text-2xl` for body in one slide and `text-lg` in another — pick ONE.
- Never use font-weight outside the scale (e.g., `font-medium` for titles that should be `font-bold`).
- Never omit `leading-tight` on titles (default line-height creates uneven title blocks).
- Never use `text-sm` or `text-xs` anywhere — minimum is `text-base` (18px).

---

### BP-4: Card Component Unification

**Principle:** Cards are the most repeated visual element. Even slight differences (padding, radius, shadow) break the gestalt.

**DO (Rules):**
- Every card uses the EXACT same base style:
  ```
  rounded-[14px] px-8 py-6
  background: colors.card
  border: 1px solid colors.border
  boxShadow: '0 10px 20px rgba(0,0,0,0.04)'
  ```
- Extract this to a shared CSS class or a `cardStyle` object in the theme file.
- Small cards (inside sidebars, secondary info) use the same radius/border but `px-5 py-4`.
- Number badges: `w-12 h-12 rounded-xl text-2xl font-extrabold` + accent bg `rgba(84,110,122,0.08)`.

**DON'T (Anti-Rules):**
- Never use `rounded-xl` (12px) for some cards and `rounded-[14px]` for others.
- Never use `p-7` for some cards and `p-8` for others — fractional differences are visible.
- Never omit `boxShadow` on some cards while applying it to others at the same level.
- Never use different border colors (`border-black/6` vs `border-black/10`) on cards at the same level.

**Frontend Token:**
```ts
// In theme file, export shared card style:
export const cardStyle = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 10px 20px rgba(0,0,0,0.04)',
}
// Usage: style={cardStyle} className="rounded-[14px] px-8 py-6"
```

---

### BP-5: Color Semantics & Accent Discipline

**Principle:** Colors carry meaning. Positive data = green, negative = red, neutral emphasis = blue-grey. Never use accent colors decoratively.

**DO (Rules):**
- Strictly bind colors to meaning:
  - `accentPositive` (#4CAF50) → growth, wins, improvements, high scores
  - `accentNegative` (#E57373) → declines, losses, warnings, low scores
  - `accentNeutral` (#546E7A) → neutral emphasis, category headers, section labels, badges
- Text hierarchy bound to specific colors:
  - `textPrimary` → titles, card values, key content
  - `textSecondary` → body text, descriptions, subtitles
  - `textCaption` → footnotes, labels, sources, placeholder text
- Badge backgrounds always use the accent color at 8-10% opacity: `rgba(color, 0.08-0.10)`.

**DON'T (Anti-Rules):**
- Never use `accentPositive` for decoration (e.g., a border) when it doesn't represent positive data.
- Never use raw hex values inline — always reference `colors.xxx` from the theme.
- Never mix `style={{ color: '#333' }}` with `style={{ color: colors.textPrimary }}` — all colors from theme.
- Never use more than 3 accent colors in one slide.

---

### BP-6: Layout Patterns & Visual Hierarchy

**Principle:** Each slide type has a fixed layout skeleton. The skeleton determines where title, content, and caption go — never freestyle.

**DO (Rules):**
- Every non-title slide follows this vertical skeleton:
  ```
  ┌─────────────────────────────────┐
  │ [H2 Title]                      │ ← top, left-aligned
  │ [Body text, optional]           │
  │                                 │
  │ ┌─────┐ ┌─────┐ ┌─────┐       │ ← content zone (cards/chart/list)
  │ │     │ │     │ │     │       │
  │ └─────┘ └─────┘ └─────┘       │
  │                                 │
  │ [Caption / source, optional]    │ ← bottom
  └─────────────────────────────────┘
  ```
- Title always first. Content zone uses `flex-1` to fill available space.
- Horizontal layouts (multi-column): use `flex` with `gap-6`. Equal column widths by default.
- Vertical layouts (lists, stacks): use `flex flex-col` with `gap-4`.
- Two-panel layouts (e.g., PlayerCard): left panel `w-[320px] shrink-0`, right panel `flex-1`.

**DON'T (Anti-Rules):**
- Never put the title in the middle of a data slide — title is always first/top.
- Never use absolute positioning for layout. Use flexbox/grid exclusively.
- Never let content zone be empty — if there's no data, show a placeholder box.
- Never create asymmetric card sizes (e.g., one card wider than its siblings) without intentional reason.

---

### BP-7: Data Display Standards

**Principle:** Numbers are the stars of data slides. They must be immediately readable and consistently formatted.

**DO (Rules):**
- Big metric numbers: `text-7xl font-extrabold` — all metrics at the same level use the same size.
- Always pair a number with a label directly below or beside it.
- Bar charts: use ECharts with registered theme, `label.show: true` to display values on bars.
- Comparison metrics: arrange horizontally with equal gaps. Use `items-end` to baseline-align numbers of different digit counts.
- Percentages always include the `%` symbol. Scores can be bare numbers.
- Format large numbers: `1,234` or `1.2K` — never raw `1234`.

**DON'T (Anti-Rules):**
- Never use `text-6xl` for one metric and `text-8xl` for another at the same hierarchy.
- Never show a number without a label — context is mandatory.
- Never use pie charts in a presentation (hard to compare; use bars instead).
- Never show more than 6-8 bars in one chart — split into multiple slides.
- Never use 3D effects on charts.

---

### BP-8: Animation Consistency

**Principle:** Animation should be subtle, uniform, and purposeful. It guides the eye, not entertains.

**DO (Rules):**
- Slide entrance: `opacity: 0→1, y: 20→0`, duration `0.6s`, ease `[0.16, 1, 0.3, 1]`. Applied by `<Slide>`.
- Inner content stagger: `staggerChildren: 0.1`, each child `opacity: 0→1, y: 16→0`, duration `0.5s`.
- EVERY slide type component wraps its content in `<motion.div variants={motionConfig.stagger}>`.
- EVERY direct child uses `<motion.xxx variants={motionConfig.child}>`.
- Apply `viewport={{ once: true }}` so animations fire once, not on every scroll pass.

**DON'T (Anti-Rules):**
- Never use different stagger timings per slide type.
- Never use scale, rotate, or color transitions on slide content.
- Never use `auto-playing` loops, pulsing, or bouncing animations.
- Never animate individual letters or words (too distracting).
- Never use `whileHover` effects in a presentation — it's not an interactive app.
- Never skip the stagger wrapper — all content must animate as a choreographed sequence.

---

### BP-9: Content Density & One-Message Rule

**Principle:** Each slide delivers exactly ONE takeaway. The audience should grasp the point in 3 seconds.

**DO (Rules):**
- Max 3 information blocks per slide (e.g., title + chart + caption, or title + 3 cards).
- Use the script's `## Slide N` title as the literal H2 — it should state the takeaway, not just the topic.
- Body text under the title: max 2 sentences.
- Card count per slide: 2-6 cards max. If more, split into multiple slides.
- List items: max 5 per slide.

**DON'T (Anti-Rules):**
- Never put 2 charts on one slide.
- Never show a data table with more than 4 rows × 4 columns.
- Never use "wall of text" — any text block > 3 lines should be broken into bullet points or cards.
- Never show a title without supporting content (title-only slides should use KeyPointSlide type).

---

### BP-10: Visual Rhythm & Section Breaks

**Principle:** A presentation has narrative structure. Slide types should alternate to create visual variety, and section transitions should be visually distinct.

**DO (Rules):**
- Use KeyPointSlide or TitleSlide as section dividers between content groups.
- Alternate between slide types — avoid 3+ consecutive slides of the same type.
- Use the script to plan a rhythm: Title → Data → Data → Key Point → Data → Chart → Key Point → ...
- Section dividers (KeyPointSlide) use centered text, larger font, more whitespace.

**DON'T (Anti-Rules):**
- Never have 5 DataComparisonSlides in a row — break them up with a KeyPoint or Chart.
- Never start the presentation with a data slide — always start with TitleSlide.
- Never end the presentation without a conclusion slide (KeyPoint or Title type).

---

### BP-11: Slide Number & Navigation Hints

**Principle:** Audience needs orientation in longer decks.

**DO (Rules):**
- Each `<Slide>` receives a `number` prop and renders `id="slide-{number}"`.
- Optionally show a subtle slide number in the bottom-right corner: `text-base text-caption`, `absolute bottom-4 right-6`.
- Keep it subtle — never larger than caption text, never bold.

**DON'T (Anti-Rules):**
- Never show slide numbers larger than `text-base`.
- Never put slide numbers in the content flow — they go in an `absolute` positioned corner.
- Never show "Slide X of Y" — just the number.

---

## Quality Checklist

Before delivering, verify:
- [ ] Every slide maintains 16:9 via `aspect-video`
- [ ] Page background fills gaps between slides
- [ ] Slides centered with consistent gap
- [ ] Font sizes follow hierarchy, nothing below 18px / `text-base`
- [ ] Key numbers are prominent (text-7xl+)
- [ ] ECharts renders correctly with theme applied
- [ ] No horizontal overflow on any slide
- [ ] All text is in the specified `--lang`
- [ ] Style theme is consistently applied
- [ ] `npm run dev` works without errors
- [ ] `npm run build` produces working static output
- [ ] Framer Motion animations trigger on scroll into view

---

## Constraints

- **React + Vite project** — not a single HTML file
- **Tailwind CSS only** — no custom CSS files except `index.css` for directives
- **No images** — CSS gradients, inline SVG, placeholder boxes
- **Semantic HTML** — proper heading hierarchy within slides
- **Type safety** — all slide data and props must be typed in TypeScript
- **Component reuse** — slide type components are generic, data-driven via props
