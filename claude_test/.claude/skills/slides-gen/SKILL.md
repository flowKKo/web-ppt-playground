---
name: slides-gen
description: "Generate slides.md from a script/voiceover file and source document. Maps narrative sections to typed slide outlines with real data, chart specs, and animation directives. Usage: /slides-gen --script voiceover.md --source full.md [--density rich]"
argument-hint: "--script <file> --source <file> [--output <file>] [--density compact|rich] [--lang zh]"
---

# Slides Script Generator

Generate a structured `slides.md` file from a narrative script (voiceover/script) and a detailed source document. The output is a slide-by-slide outline — including slide types, real data, chart specifications, layout treatments, and animation directives — that can be fed into the `/web-ppt` skill to produce the final presentation.

## Argument Parsing

Parse `$ARGUMENTS` for these flags:

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--script` | Yes | — | Path to the voiceover/script markdown file (narrative source) |
| `--source` | Yes | — | Path to the full reference document with detailed data |
| `--output` | No | `slides.md` | Output path for the generated slide outline |
| `--density` | No | `rich` | Content density: `compact` (简洁) or `rich` (充实). See Content Density section |
| `--lang` | No | `zh` | Language for slide content |

Positional shorthand: `/slides-gen voiceover.md full.md` → script=voiceover.md, source=full.md

---

## Content Density Modes

The `--density` flag controls how much information goes into each slide, and how many slides are generated per script section.

### `compact` — 简洁模式

Target audience: live presentation with speaker narration. Slides are visual aids, not documents.

| Aspect | compact |
|--------|---------|
| Slides per section | 1 (rarely 2) |
| Total slides | 15-20 |
| Body text | 0-1 sentence, or omitted entirely |
| Data points per slide | Minimum from density table |
| Cards/items | 2-3 per slide |
| Chart bars | 2-4 |
| Comparison columns | 2 |
| 正文 field | Often omitted — title + data speaks for itself |
| 结论 field | Short phrase (≤10 characters), or omitted |
| Player card features | 3 max |
| List items | 3 max |

**compact 原则：** 每张幻灯片只保留"不看幻灯片就无法理解"的信息。口播能说清楚的文字不要出现在幻灯片上。留白 > 堆信息。

### `rich` — 充实模式

Target audience: self-reading deck (no speaker), or data-heavy presentation where audience needs to study details.

| Aspect | rich |
|--------|------|
| Slides per section | 1-3 (split complex topics) |
| Total slides | 20-28 |
| Body text | 1-2 sentences with specific insight |
| Data points per slide | Maximum from density table |
| Cards/items | 3-6 per slide |
| Chart bars | 4-8 |
| Comparison columns | 2-3 |
| 正文 field | Required on every non-title slide |
| 结论 field | Full sentence with data reference |
| Player card features | 4-5 + comparison chart |
| List items | 4-5 with descriptions |

**rich 原则：** 每张幻灯片是一个自包含的信息单元。即使没有口播，读者也能完全理解内容。数据越详细越好，但一张幻灯片仍然只传达一个核心信息。

### Content Density Table (per slide type)

| Slide Type | compact min-max | rich min-max |
|------------|----------------|-------------|
| data-comparison | 2 metrics | 2-4 metrics |
| bar-chart | 2-4 rows | 4-8 rows |
| comparison | 2 cols × 2-3 rows | 2-3 cols × 3-5 rows |
| grid | 4 items (title only) | 4-6 items (title + description) |
| player-card | score + 2-3 features | score + 4-5 features + chart |
| list | 3 items (short) | 3-5 items (with descriptions) |
| diagram | 3 steps | 3-5 steps + side notes |
| card-grid | 2-3 cards | 3-4 cards + conclusion |

---

## Visual Mandate — 每页必须有视觉元素

**核心规则：除非是纯文字金句（key-point）或标题页（title），否则每一张幻灯片都必须包含至少一个视觉元素。**

视觉元素包括：
- **数据图表** — 横向条形图、大数字+微型进度条、堆叠双色条形图、面积对比等
- **结构图示** — 流程图、架构图、层级图、对比矩阵
- **图片占位符** — 截图、产品界面、示意图（当前用虚线框+详细描述代替）

### 视觉元素分配决策

```
这张幻灯片有量化数据吗？
  有 → 必须有数据图表（图表字段）
  没有 ↓

这张幻灯片描述架构/流程/对比关系吗？
  是 → 必须有结构图示（图示字段）
  否 ↓

这张幻灯片提到了可截图的界面/产品吗？
  是 → 必须有图片占位符（占位图字段）
  否 ↓

这张幻灯片是纯概念/金句/标题吗？
  是 → 可以没有视觉元素（仅限 title 和 key-point 类型）
  否 → 必须为内容设计一个辅助视觉元素（概念图、图标网格、关系图等）
```

**例外情况（允许无视觉元素的 slide types）：**
- `title` — 标题页，纯文字即可
- `key-point` — 金句/过渡页，大字居中即可

**其他所有 slide types 必须有 `图表`、`图示`、或 `占位图` 中的至少一个。**

---

## Visual Description Standard — 视觉描述规范

**每一个视觉元素（图表、图示、占位图）都必须包含两个详细描述：**

### (a) 外观描述 — 它长什么样

必须具体到能让前端开发者不看原始数据就能画出来的程度：

| 视觉类型 | 外观描述必须包含 |
|----------|----------------|
| 横向条形图 | 条形数量、每条的标签、数值、颜色、长度比例关系、是否有基准线、标签和数值的位置 |
| 大数字 | 数字的具体值、字号层级、颜色（正/负/中性）、下方微型进度条的宽度比例和颜色 |
| 堆叠双色条形图 | 基线段的颜色和宽度、增益段的颜色和宽度、总宽度、标注位置 |
| 面积对比 | 圆形/方形的相对大小比例、颜色、标签位置、数值标注 |
| 流程图/架构图 | 节点数量、每个节点的文字、节点之间的连接方式（箭头/线条）、布局方向（横向/纵向）、分层关系 |
| 对比矩阵/表格 | 行数、列数、表头内容、单元格内容、高亮规则、分隔线样式 |
| 图片占位符 | 占位框的尺寸比例（如 16:9、4:3、1:1）、框内文字说明、虚线样式、背景色、预期放入的真实内容描述 |

### (b) 动画描述 — 它怎么动

必须具体到前端开发者能直接写出动画代码：

| 动画类型 | 动画描述必须包含 |
|----------|----------------|
| countUp | 起始值（通常0）、目标值、持续时间、缓动函数、是否有千分位逗号 |
| growBar | 起始宽度（0%）、目标宽度（百分比）、持续时间、缓动函数、是否有弹性效果 |
| appear | 起始状态（opacity:0, y:16px）、终态、持续时间、是否有 stagger delay |
| highlight | 其他元素的目标 opacity（0.3）、高亮元素的 opacity（1.0）、过渡时间 |
| revealGroup | 组内元素数量、stagger 间隔时间、每个元素的入场方式 |
| 占位图入场 | 虚线框如何出现（淡入/从边缘滑入）、内部标签文字的出现时机 |

### 描述格式示例

```markdown
- 图表:
  - 类型: 横向条形图
  - 外观描述: >
      4 条水平条形，从上到下排列。每条左侧是标签文字（w-32，右对齐，
      text-base，textSecondary 色），中间是彩色条形（h-8，圆角右端 rounded-r-lg），
      右侧是数值（text-lg，font-semibold）。
      第 1 条: "Simple Codex" → 绿色条（宽度占满 100%）→ "75.1"
      第 2 条: "Droid" → 蓝灰色条（宽度 93%）→ "69.9"
      第 3 条: "Junie CLI" → 蓝灰色条（宽度 86%）→ "64.3"
      第 4 条: "Claude Code" → 红色条（宽度 77%）→ "58.0"
      在 62.9 的位置有一条竖向虚线（border-dashed），标注 "Terminus 2 基线"。
      条形之间间距 gap-3。整体垂直居中在内容区域。
  - 数据: [同上表格]
  - 动画描述: >
      F1 触发时：4 条条形从宽度 0% 同时开始生长到目标宽度，
      持续 0.8s，缓动 [0.16, 1, 0.3, 1]（先快后慢，略带弹性）。
      条形生长过程中，右侧数值同步 countUp 从 0 到目标值。
      基准虚线在条形生长到 62.9 位置时淡入（opacity 0→1，0.3s）。
      4 条条形之间有 0.05s 的 stagger 延迟，从上到下依次启动。
```

```markdown
- 占位图:
  - 外观描述: >
      宽高比 16:9 的虚线矩形框，占据幻灯片内容区域的 60% 宽度。
      边框: 2px dashed，颜色 rgba(0,0,0,0.15)，圆角 12px。
      背景: rgba(0,0,0,0.02)，略带灰度以区别于幻灯片背景。
      框内正中居中显示文字 "Terminal-Bench 2.0 排行榜截图"，
      字号 text-lg，颜色 rgba(0,0,0,0.25)，font-style italic。
      框的右上角有一个小图标提示（16x16 的图片 icon，rgba(0,0,0,0.2)）。
  - 预期内容: Terminal-Bench 2.0 官网排行榜页面截图，需要展示完整的前 10 名排名列表，
    高亮 Claude Opus 4.6 出现的多个条目（58.0 和 69.9）
  - 动画描述: >
      F0 时立即显示：虚线框从 opacity 0 → 1 淡入，同时从 y:12px 上移到 y:0，
      持续 0.5s，缓动 ease-out。框内文字在框出现后 0.2s 延迟淡入。
```

```markdown
- 图示:
  - 类型: 三层堆叠架构图
  - 外观描述: >
      纵向排列的 3 个矩形层，从上到下分别是：
      第 1 层（顶部）: 浅蓝灰色背景（accentNeutral/10），标题 "工具描述"，
        副文字 "定义能力规格"，高度约 60px，全宽，圆角 8px。
      第 2 层（中部）: 稍深蓝灰色背景（accentNeutral/15），标题 "系统提示"，
        副文字 "设定高层目标"，同样高度和样式。
      第 3 层（底部）: 最深蓝灰色背景（accentNeutral/25）+ 左侧 3px 绿色边框高亮，
        标题 "系统通知"，副文字 "末端注入关键指令"，加粗处理表示重要性。
      层与层之间有 gap-2 间距。
      右侧有一个竖向箭头（SVG，从顶部指向底部），旁边标注 "递近偏差 →"，
      字号 text-sm，斜体，textCaption 色。
      整体宽度约 max-w-[70%]，左对齐。
  - 动画描述: >
      F1 触发时：3 层从上到下依次出现（appear），每层间隔 0.15s。
      每层入场动画: opacity 0→1 + y:12→0，持续 0.4s。
      第 3 层入场后，左侧绿色边框从高度 0 向下展开到全高（growBar 式，0.3s）。
      右侧箭头在所有层出现后 0.2s 延迟淡入（opacity 0→1，0.3s），
      箭头淡入时伴随从 scaleY:0.5 → scaleY:1 的伸展效果。
```

---

## Input Files

### Script File (--script)

The script file is a narrative document — either a voiceover script or a production script. It contains:
- The full spoken narration organized by topic/section
- The logical flow of the presentation
- Key arguments and transitions between topics

The script defines **WHAT to say and in what order**. It is the authoritative source for:
- Presentation structure and section boundaries
- Which topics are included or excluded
- The narrative arc (intro → body → conclusion)

### Source Document (--source)

The source document is a detailed reference article or report. It contains:
- Exact numbers, scores, percentages, rankings
- Detailed comparisons and analysis
- Methodology descriptions
- Quotes and findings

The source provides **THE DATA** that populates slide fields. Without it, slides would have empty metrics.

---

## Generation Workflow (6 Phases)

### Phase 1: Script Analysis — 拆解口播稿

Read the `--script` file completely. Produce a **section inventory**:

For each section (separated by `---` or heading breaks), extract:

1. **Section ID** — sequential number (S1, S2, S3...)
2. **Topic** — what this section is about (1 phrase)
3. **Key data points** — every number, score, percentage mentioned in the narration
4. **Entities** — products, models, companies named
5. **Argument** — what claim the narrator is making
6. **Transition type** — how the narrator moves to this section: opening / continuation / pivot / conclusion

Output this as an internal working note (not written to file).

Example section inventory:
```
S1: Opening — Terminal-Bench 2.0 benchmark
  Data: 101 agents, Opus 4.6 lowest 58, highest 69.9, delta ~12
  Entities: Terminal-Bench 2.0, Claude Opus 4.6
  Argument: Same model, vastly different scores → scaffold matters
  Transition: opening

S2: Scaffold definition
  Data: (none, conceptual)
  Entities: (none)
  Argument: Scaffold = engineering layer wrapping the model
  Transition: continuation (explains the "why" from S1)

S3: Terminus 2 baseline + gain data
  Data: GPT-5.3 Terminus2=64.7 → Simple Codex=75.1 (+10.4), Opus4.6 Terminus2=62.9 → Droid=69.9 (+7.0)
  Entities: Terminus 2, GPT-5.3, Simple Codex, Opus 4.6, Droid
  Argument: 5-10pp gains move ranking from mid to top-3
  Transition: pivot (from concept to data proof)
```

### Phase 2: Source Document Indexing — 索引源文档数据

Read the `--source` file completely. Build a **data catalog**:

| Category | What to Extract | Example |
|----------|----------------|---------|
| Scores / Rankings | Tool + model + score | Simple Codex + GPT-5.3 = 75.1 |
| Deltas / Gains | Before → after, delta | Terminus 2 62.9 → Droid 69.9, +7.0 |
| Feature comparisons | Tool × feature matrix | Claude Code: 24 tools, Droid: minimal tools |
| Token / cost data | Token counts, cost ratios | Codex CLI 72K, Claude Code 235K, 3.3x ratio |
| Architecture details | Layers, components, flows | Droid: 3-layer prompt (tool desc / sys prompt / sys notice) |
| Quotes / claims | Notable statements | "花在工具优化上的时间多于prompt优化" |
| Caveats / controversies | Limitations, counterpoints | Droid benchmark strong but code quality disputed |

Flag any data in the script that does NOT appear in the source document — these may need to be omitted or noted.

### Phase 3: Slide Planning — 规划幻灯片结构

This is the most critical phase. Map each script section to one or more slides. Produce a **slide plan table**:

```
| Slide # | Script Section | Type | Core Message | Key Data | Chart? | Animation |
|---------|---------------|------|-------------|----------|--------|-----------|
| 1 | S1 | title | 模型只是一半 | — | — | appear |
| 2 | S1 | placeholder+metric | TB 2.0 benchmark | 101 agents | — | countUp |
| 3 | S1 | data-comparison | 同模型分差 12 分 | 58.0 vs 69.9 | — | countUp |
| 4 | S2 | key-point+list | 脚手架定义 | 4 维度 | — | revealGroup |
| 5 | S3 | placeholder | Terminus 2 基线 | — | — | appear |
| 6 | S3 | bar-chart | 脚手架增益 5-10pp | 4 data rows | 双色堆叠条形图 | growBar |
| ... | ... | ... | ... | ... | ... | ... |
```

**Planning rules:**

1. **Section → Slide mapping depends on density:**
   - `compact`: 1 slide per section by default. Only split if section has 2+ genuinely distinct points.
   - `rich`: Split freely. A section with comparison + data + conclusion can become 2-3 slides.

2. **Visual mandate check (CRITICAL):**
   - For each slide, confirm it has at least one visual element (chart / diagram / placeholder image).
   - Only `title` and `key-point` types are exempt.
   - If a slide has no quantitative data AND no screenshot reference AND no architecture/flow to diagram, ask: "Can I add a conceptual diagram, icon grid, or relationship graph?" If yes, add it. If truly impossible, convert to `key-point`.

3. **Chart/visualization decision happens HERE**, not during writing. For each slide with quantitative data, decide now:
   - Does this need a chart? What type?
   - Or are big numbers + labels sufficient?
   - See "Chart Specification Guide" below.

4. **Image placeholder decision happens HERE**. For slides referencing products, interfaces, or demos:
   - What screenshot/image would best support the content?
   - What exact content should the placeholder describe?
   - See "Image & Placeholder Specification Guide" below.

5. **Animation decision happens HERE**. For each slide, assign:
   - Which elements get fragment animations?
   - What animation types (countUp, growBar, etc.)?
   - See "Animation Specification Guide" below.

6. **Narrative rhythm check:**
   - Alternate slide types. Never 3+ of the same type consecutively.
   - Insert `key-point` dividers between major topic groups.
   - Start with `title`, end with `key-point`.

7. **Slide count check:**
   - `compact`: 15-20 slides for a 10-12 minute talk
   - `rich`: 20-28 slides for a 10-12 minute talk
   - If over budget, merge. If under, consider splitting data-heavy sections.

### Phase 4: Data Population — 填充数据

For each slide in the plan, populate ALL fields:

1. **标题** — States the TAKEAWAY, not the topic.
   - BAD: "脚手架数据" / "Token 对比" / "关键发现"
   - GOOD: "脚手架增益 5-10 分" / "Codex CLI Token 效率领先 3.3 倍" / "同模型分差 12 分"

2. **正文** — 1-2 sentences with specific insight (required in `rich`, optional in `compact`).
   - BAD: "以下是相关对比数据" / "这里展示了排名"
   - GOOD: "5-10 个百分点的增益，足以把排名从中游拉到前三"

3. **Data fields** — Extract EXACT numbers from source. Never round. Never invent.

4. **图表 / 图示 / 占位图** — MUST include for every non-title/key-point slide. Include:
   - `外观描述`: Detailed enough for a developer to implement without seeing the original data (see Visual Description Standard).
   - `动画描述`: Exact animation behavior — timing, easing, stagger, trigger conditions (see Visual Description Standard).

5. **动画** — Fragment animation directives for the full slide (see Animation Specification Guide).

6. **布局** — Layout treatment hint (see Layout Treatment Guide).

7. **结论** — Data-driven takeaway (required in `rich`, optional in `compact`).

### Phase 5: Consistency Review — 一致性检查

Before writing the file, run these checks:

1. **Coverage:** Every script section has ≥1 slide. No orphan topics.
2. **No fabrication:** Every number traces to the source document.
3. **Rhythm:** Slide types alternate. No 3+ consecutive same-type.
4. **Density:** Each slide meets the min data points for its type and density mode.
5. **Visual mandate:** Every non-title/key-point slide has at least one visual element (图表 / 图示 / 占位图).
6. **Visual descriptions:** Every visual element has both `外观描述` and `动画描述`, detailed enough for implementation.
7. **Charts:** Every slide with ≥3 quantitative data points has a chart spec.
8. **Animations:** Every data slide has animation directives. Every big number has `countUp`. Every bar has `growBar`.
9. **Titles:** No generic titles. Every title states a takeaway.

### Phase 6: Write Output — 写入文件

Write the complete `slides.md` to `--output` path. Include:
- A header comment with metadata (density mode, slide count, source files)
- The slide plan table as an HTML comment at the top
- All slides with full field specifications

---

## Chart Specification Guide

Every slide with quantitative data MUST include a `图表` field that specifies exactly what visualization to render. The `/web-ppt` skill needs this to choose between CSS bars, ECharts, big numbers, etc.

### Chart Types

| Chart Type | Keyword | When to Use | slides.md Notation |
|------------|---------|------------|-------------------|
| Big number + micro bar | `大数字` | 2-4 standalone metrics (DataComparison) | `图表: 大数字 + 微型进度条` |
| Horizontal bar chart | `横向条形图` | Ranking 3-8 items by score | `图表: 横向条形图` |
| Stacked dual-color bar | `堆叠双色条形图` | Before/after or baseline+gain | `图表: 堆叠双色条形图（灰色=基线, 绿色=增益）` |
| Area/size comparison | `面积对比` | Disproportionate values (e.g., 72K vs 2M) | `图表: 面积对比（圆形）` |
| Ranked list with bars | `排名列表` | Head-to-head with score + bar per item | `图表: 排名列表 + 横向条` |
| Side-by-side bar groups | `分组条形图` | Multi-dimension comparison (ECharts) | `图表: 分组条形图（ECharts）` |
| None (text only) | `无` | Conceptual slides, definitions | (omit 图表 field) |

### Chart Decision Tree

```
Does the slide have quantitative data?
  No → omit 图表 field
  Yes ↓

How many data points?
  2-4 standalone metrics → 大数字 + 微型进度条
  2-4 items with before/after → 堆叠双色条形图
  3-8 items ranked by one dimension → 横向条形图
  3-8 items ranked with identity (name+score) → 排名列表 + 横向条
  8+ data points or multi-series → 分组条形图（ECharts）
  2 values with huge ratio (>5x) → 面积对比
```

### Chart Specification Format

The `图表` field uses a structured notation. **Every chart MUST include `外观描述` and `动画描述`。**

```markdown
- 图表:
  - 类型: 横向条形图
  - 数据:
    | 标签 | 值 | 颜色提示 |
    |------|-----|---------|
    | Simple Codex | 75.1 | 正向色（最高分） |
    | Droid (Opus 4.6) | 69.9 | 中性色 |
    | Junie CLI (Flash) | 64.3 | 中性色 |
    | Claude Code | 58.0 | 负向色（低于基线） |
  - 基准线: 62.9（Terminus 2 基线，虚线标注）
  - 排序: 降序
  - 外观描述: >
      4 条水平条形从上到下排列，间距 gap-3。
      每条结构: 左侧标签（w-32, text-right, text-base）| 彩色条形（h-8, rounded-r-lg）| 右侧数值（text-lg, font-semibold）。
      条形宽度按比例: Simple Codex=100%, Droid=93%, Junie=86%, Claude Code=77%。
      颜色: 第1条 accentPositive（绿），第2-3条 accentNeutral（蓝灰），第4条 accentNegative（红）。
      62.9 位置处有竖向虚线（1px dashed, rgba(0,0,0,0.2)），旁注 "Terminus 2 基线"（text-xs, textCaption）。
  - 动画描述: >
      F1 触发: 4 条条形从 width:0 同时生长到目标宽度，duration 0.8s，ease [0.16,1,0.3,1]。
      条形间 stagger 0.05s（从上到下）。右侧数值同步 countUp（0→目标值，0.8s）。
      基准虚线在条形生长经过 62.9 位置时淡入（opacity 0→1, 0.3s）。
```

For stacked bars:
```markdown
- 图表:
  - 类型: 堆叠双色条形图
  - 数据:
    | 模型 | 基线 | 增益 | 总分 |
    |------|------|------|------|
    | GPT-5.3 | 64.7 | +10.4 | 75.1 |
    | Opus 4.6 | 62.9 | +7.0 | 69.9 |
  - 外观描述: >
      2 条水平堆叠条形，间距 gap-4。每条由两段拼接:
      左段（基线）: 灰色（barTrack 色），宽度按比例（64.7/75.1=86%, 62.9/75.1=84%）。
      右段（增益）: 绿色（accentPositive），宽度按增益比例（10.4/75.1=14%, 7.0/75.1=9%）。
      左侧标签: 模型名（w-28, text-right）。右侧标注: 总分 + "(+增益)" 文字。
      两段之间无间隙，视觉上连续。条形高度 h-10，圆角仅在最右端（rounded-r-lg）。
  - 动画描述: >
      F1: 灰色基线段从 width:0 生长到目标宽度（0.6s, ease-out）。
      F2: 绿色增益段紧接着从 width:0 继续生长（0.5s, ease-out），
      同时右侧增益数字 countUp（0→+10.4, 0.5s）。两条之间 stagger 0.1s。
```

For big numbers:
```markdown
- 图表:
  - 类型: 大数字 + 微型进度条
  - 数据:
    - 最低分: 58.0（负向色，进度条 58/100）
    - 最高分: 69.9（正向色，进度条 70/100）
  - 进度条最大值: 100
  - 外观描述: >
      水平排列的 2 个指标块，间距 gap-8，居中。每个指标块:
      上方: 大数字 text-7xl font-extrabold（58.0 用 accentNegative 红色，69.9 用 accentPositive 绿色）。
      下方: 微型进度条 h-2 rounded-full（w-48 为满宽），颜色与数字一致。
      进度条下方: 标签文字 text-base textCaption（"最低分" / "最高分"）。
  - 动画描述: >
      F1: 左侧数字 countUp 0→58.0（0.8s, ease-out），同时进度条 growBar 0%→58%（0.8s）。
      F2: 右侧数字 countUp 0→69.9（0.8s），同时进度条 growBar 0%→70%（0.8s）。
```

---

## Image & Placeholder Specification Guide

When a slide references a product interface, website, demo, or any visual that cannot be rendered as a CSS chart, use a **placeholder image** (`占位图`). Placeholders are temporary — they define what the real image should be, so it can be replaced later.

### Placeholder Specification Format

**Every placeholder MUST include `外观描述`, `预期内容`, and `动画描述`。**

```markdown
- 占位图:
  - 标题: "Terminal-Bench 2.0 排行榜截图"
  - 外观描述: >
      虚线矩形框，宽高比 16:9，占幻灯片内容区域 60% 宽度，水平居中。
      边框: 2px dashed rgba(0,0,0,0.15)，圆角 rounded-xl (12px)。
      背景: rgba(0,0,0,0.02)。
      框内垂直水平居中显示标题文字 "Terminal-Bench 2.0 排行榜截图"，
      字号 text-lg，颜色 rgba(0,0,0,0.25)，斜体。
      左下角小字标注 "[截图占位]"，text-sm，rgba(0,0,0,0.15)。
  - 预期内容: >
      Terminal-Bench 2.0 官网 (tbench.ai) 排行榜页面截图。
      需要展示前 10 名 agent 的完整排名表格，
      包含 agent 名称、模型、分数列。
      需要用高亮框标注 Claude Opus 4.6 出现的多个条目:
      第 3 名 Droid (69.9) 和第 22 名 Claude Code (58.0)。
  - 动画描述: >
      F0 立即显示: 虚线框 opacity 0→1 + y:12→0 淡入上移，
      duration 0.5s，ease-out。
      框内标题文字在框出现后延迟 0.2s 淡入。
```

### Placeholder Types

| 场景 | 占位图宽高比 | 位置 |
|------|------------|------|
| 网站/排行榜截图 | 16:9 | 居中，占 60% 宽度 |
| 产品界面截图 | 16:10 或 4:3 | 居中，占 50-60% 宽度 |
| 代码编辑器截图 | 16:9 | 居中或偏左（右侧放指标卡） |
| 移动端截图 | 9:16 | 居中，max-height 70% |
| Logo / 图标 | 1:1 | 小尺寸，配合文字使用 |
| 论文/文档引用 | 4:3 | 居中或偏右 |

### When to Use Placeholders vs Charts

```
这个数据能用 CSS/SVG 直接画出来吗？
  能（条形图、数字、进度条、流程图）→ 用图表/图示，不用占位图
  不能（真实截图、产品界面、照片）→ 用占位图

这是一个已知的外部界面/网站吗？
  是 → 占位图，`预期内容` 详细描述截图内容和标注要求
  否 → 尝试用 CSS 图示替代
```

---

## Animation Specification Guide

Every slide MUST include a `动画` field that tells `/web-ppt` how to reveal content progressively. This maps directly to the fragment animation system (BP-16 in web-ppt).

### Animation Types

| Type | Keyword | Visual Effect | Use For |
|------|---------|-------------|---------|
| Fade in + slide up | `appear` | opacity 0→1, y 16→0 | Default for text, cards, diagrams |
| Number count up | `countUp` | Counts from 0 to target | Big metric numbers (58.0, 75.1, etc.) |
| Bar growth | `growBar` | Width grows from 0% to target | Horizontal bars, progress bars |
| Spotlight highlight | `highlight` | Others dim to 30%, target brightens | Walking through items one by one |
| Group reveal | `revealGroup` | Group appears together with stagger | Card groups, list items |

### Animation Assignment Rules

| Slide Type | Fragment 0 (immediate) | Fragment 1+ (click to reveal) |
|------------|----------------------|------------------------------|
| title | All content | — (no fragments) |
| key-point | All content | — (no fragments) |
| data-comparison | Title + body | Each metric: `countUp` per number, one fragment per metric |
| bar-chart | Title + body | All bars grow together: `growBar` |
| comparison | Title + body | Each column: `revealGroup`, one fragment per column |
| grid | Title | All items: `revealGroup` |
| player-card | Left panel (rank + name + score `countUp`) | Right panel: `revealGroup` for features, `growBar` for chart |
| diagram | Title + body | Each step: `appear`, one fragment per step |
| list | Title | Each item: `appear`, one fragment per item |
| placeholder | Title + placeholder box | Side metrics: `countUp` |
| card-grid | Title | All cards: `revealGroup` |

### Animation Specification Format

The `动画` field in slides.md:

```markdown
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 最低分 58.0（countUp）+ 微型进度条（growBar）
    - F2: 最高分 69.9（countUp）+ 微型进度条（growBar）+ 结论文字（appear）
```

For bar charts:
```markdown
- 动画:
  - fragments: 2
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 所有条形同时生长（growBar）+ 基准线出现 + 值标签（appear）
```

For comparison slides:
```markdown
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 左列「运行时搜索」（revealGroup）
    - F2: 右列「语义索引」（revealGroup）
```

### Key Animation Rules

- **Every big number MUST have `countUp`** — static numbers waste the most powerful attention-grabbing moment.
- **Every bar/progress indicator MUST have `growBar`** — bars growing from zero dramatically demonstrates relative differences.
- **Title + body are ALWAYS in F0** — never show an empty slide.
- **Max 6 fragments per slide** — too many clicks breaks flow.
- **`compact` mode prefers fewer fragments** (1-2 per slide). `rich` mode can use 2-4.

---

## Layout Treatment Guide

Every non-title, non-key-point slide SHOULD include a `布局` field that hints at the visual treatment. This guides `/web-ppt` in choosing between cards, tables, accent borders, etc. (ref BP-12).

### Available Treatments

| Treatment | Keyword | When to Use |
|-----------|---------|------------|
| White cards | `卡片` | Grouped items with title + detail (max 50% of slides) |
| Table rows | `表格` | Side-by-side comparison with multiple dimensions |
| Accent border | `边框高亮` | Feature list without card weight |
| Borderless grid | `无边框网格` | Category overview, light visual weight |
| Timeline | `时间线` | Ordered steps, process flow |
| Inline highlights | `行内高亮` | 2-3 short key-value pairs, no container needed |
| Big number panel | `大数字面板` | 2-4 hero metrics dominating the slide |

### Treatment Decision

```
Is it a ranked list or score comparison?
  → 表格 or 横向条形图 (let chart dominate, minimal layout)

Is it a multi-dimension feature comparison?
  → 表格 (rows = dimensions, columns = subjects)

Is it a category overview (4-6 items)?
  → 无边框网格 (lightweight, no cards)

Is it a process or ordered steps?
  → 时间线

Is it 2-3 key-value metrics?
  → 行内高亮 or 大数字面板

Is it grouped items with substantial detail per item?
  → 卡片 (but track: max 50% of content slides should use cards)
```

---

## Output Format: slides.md

### Document Structure

```markdown
<!-- Density: rich | Slides: 23 | Script: voiceover.md | Source: full.md -->
<!-- Slide Plan:
| # | Section | Type | Core Message | Chart | Animation |
|---|---------|------|-------------|-------|-----------|
| 1 | S1 | title | 模型只是一半 | — | appear |
| 2 | S1 | placeholder+metric | TB 2.0 benchmark | 大数字 | countUp |
| ... | ... | ... | ... | ... | ... |
-->

# [Presentation Title]

---

## Slide 1: 标题页
- type: title
- 标题: ...
- 副标题: ...
- 标注: ...
- 动画: appear（整体淡入）

---

## Slide 2: ...
- type: data-comparison
- 标题: ...
- 正文: ...
- 数据: ...
- 图表: ...
- 动画: ...
- 布局: ...
- 结论: ...

---
...
```

### Available Slide Types

| Type | When to Use | Required Fields |
|------|------------|----------------|
| `title` | Opening slide | 标题, 副标题, 标注 |
| `data-comparison` | 2-4 metrics with exact numbers | 标题, 数据, 图表, 动画, 结论 |
| `key-point` | Section divider, one big takeaway | 标题, 副标题 |
| `comparison` | Side-by-side feature comparison | 标题, 列数据, 布局, 动画 |
| `grid` | 4-6 item overview | 标题, 网格, 布局, 动画 |
| `bar-chart` | Score/performance ranking | 标题, 图表, 动画 |
| `player-card` | Individual item deep-dive | 标题, 分数, 特性, 图表(optional), 动画 |
| `diagram` | Process flow / architecture | 标题, 图示, 动画 |
| `list` | Ordered recommendations / steps | 标题, 列表, 动画 |
| `placeholder` | Screenshot/image placeholder | 标题, 占位图 |
| `card-grid` | 2-4 labeled cards | 标题, 卡片, 布局, 动画, 结论 |

### Field Reference

```markdown
## Slide N: [Section · Topic]
- type: [slide-type]
- 标题: [Takeaway, not topic]
- 副标题: [Secondary heading]
- 正文: [1-2 sentence insight, NOT generic filler]
- 标注: [Date, source, footnote]

## Data fields
- 数据:
  - [label]: [exact value]（[正向色/负向色/中性色]）
- 结论: [Data-driven takeaway sentence]
- 关键数字: [One standout metric]
- 图表数据:
  | Column1 | Column2 | ... |
  |---------|---------|-----|
  | data    | data    | ... |

## Chart specification (MUST include 外观描述 + 动画描述)
- 图表:
  - 类型: [横向条形图/大数字+微型进度条/堆叠双色条形图/面积对比/排名列表/分组条形图]
  - 数据: [table or list]
  - 排序: [升序/降序]
  - 基准线: [value + description, optional]
  - 外观描述: [详细描述每个视觉元素的位置、大小、颜色、比例关系]
  - 动画描述: [详细描述触发时机、持续时间、缓动函数、stagger、起止状态]

## Image placeholder (MUST include 外观描述 + 预期内容 + 动画描述)
- 占位图:
  - 标题: [占位框内显示的标题文字]
  - 外观描述: [虚线框的尺寸比例、边框样式、背景、标签文字、位置]
  - 预期内容: [详细描述将来替换占位符的真实图片内容、标注要求]
  - 动画描述: [占位框的入场动画]

## Diagram (MUST include 外观描述 + 动画描述)
- 图示:
  - 类型: [流程图/架构图/层级图/对比矩阵]
  - 外观描述: [节点数量、文字、连接方式、布局方向、颜色]
  - 动画描述: [逐步reveal顺序、stagger间隔、每元素入场方式]

## Animation specification
- 动画:
  - fragments: [number]
  - 步骤:
    - F0: [what's immediately visible]（[appear/countUp/growBar]）
    - F1: [first click reveal]（[animation type]）
    - F2: ...

## Layout treatment
- 布局: [卡片/表格/边框高亮/无边框网格/时间线/行内高亮/大数字面板]

## Structure fields (type-specific)
- 卡片:
  - [Item 1]
  - [Item 2]
- 左列/右列/中列:
  - 名称: [Column name]
  - 代表: [Representative example]
  - 要点: [Key differentiator]
  - 细节: [Supporting detail]
  - 结果: [Outcome/evidence]
- 网格 (NxM):
  1. [Label] — [Description]
- 图示 ([description]):
  1. [Step] — [Explanation]
- 列表:
  1. [Item with description]
- 特性:
  - [Feature]: [Detail]
- 对比图表:
  | Col1 | Col2 |
  |------|------|
  | data | data |
- 侧注: [Marginal note]
- 解释: [Why this matters]
- 争议: [Counterpoint]
- 差值: [Delta + color]
- 增益: [Gain metric]
- 警告: [Caveat callout]
```

---

## Slide Type Selection Guide

```
Is this an opening or section divider?
  → title (opening) or key-point (divider)

Does the section present 2-4 standalone metrics?
  → data-comparison（图表: 大数字 + 微型进度条）

Does the section compare 2-3 alternatives side by side?
  → comparison（布局: 表格 or 卡片）

Does the section rank or score multiple items?
  → bar-chart（图表: 横向条形图 or 堆叠双色条形图）

Does the section deep-dive one specific item?
  → player-card（图表: 排名列表 + 横向条, optional）

Does the section list 4-6 categories or dimensions?
  → grid（布局: 无边框网格）

Does the section describe a process or architecture?
  → diagram（动画: 逐步 appear）

Does the section give ordered recommendations?
  → list（动画: 逐条 appear）

Does the section reference a screenshot or demo?
  → placeholder

Does the section list 2-4 grouped items with a conclusion?
  → card-grid（布局: 卡片）
```

---

## Slide Mapping Principles

### One Core Message Per Slide

Each slide delivers exactly ONE takeaway. If a script section makes two distinct points, split into two slides.

### Narrative Rhythm

Alternate slide types to maintain visual variety:

```
Title → Data → Data → KeyPoint → Comparison → Chart → KeyPoint → PlayerCard → ...
```

Rules:
- Never have 3+ consecutive slides of the same type
- Insert `key-point` slides between major sections as dividers
- Start with `title`, end with `key-point` (closing message)

### Data Extraction Priority

When populating slide data from the source document:

1. **Exact numbers first** — scores, percentages, counts
2. **Rankings and comparisons** — who is #1, what's the delta
3. **Specific names** — product names, model names, paper names
4. **Supporting evidence** — benchmark methodology, conditions

---

## Complete Example: compact vs rich

Given this script section:

> 看一下数据。GPT-5.3 配合 Terminus 2 得到 64.7 分，加上 Simple Codex 脚手架变成 75.1 分，多了 10.4 分。Opus 4.6 配合 Terminus 2 得到 62.9 分，加上 Droid 脚手架变成 69.9 分，多了 7 分。
> 5 到 10 个百分点的脚手架增益，足以把排名从中游拉到前三。

### compact output:

```markdown
## Slide 6: 脚手架增益 5-10 分
- type: bar-chart
- 标题: 脚手架增益 5-10 分
- 图表:
  - 类型: 堆叠双色条形图
  - 数据:
    | 模型 | 基线 (Terminus 2) | 增益 | 总分 |
    |------|------------------|------|------|
    | GPT-5.3 | 64.7 | +10.4 | 75.1 (Simple Codex) |
    | Opus 4.6 | 62.9 | +7.0 | 69.9 (Droid) |
  - 外观描述: >
      2 条水平堆叠条形，垂直排列，间距 gap-4。
      每条左侧: 模型名（w-24, text-right, text-base）。
      每条由两段拼接: 灰色基线段 + 绿色增益段，总高度 h-10，右端 rounded-r-lg。
      GPT-5.3 条: 灰段占 86%（64.7/75.1），绿段占 14%（10.4/75.1），总宽 100%。
      Opus 4.6 条: 灰段占 90%（62.9/69.9），绿段占 10%（7.0/69.9），总宽 93%（69.9/75.1）。
      右侧标注: 总分 + 绿色小字 "(+增益)"。
  - 动画描述: >
      F1: 灰色段 + 绿色段依次生长（先灰 0.5s，再绿 0.4s），
      ease [0.16,1,0.3,1]。右侧增益数字同步 countUp。两条间 stagger 0.1s。
- 动画:
  - fragments: 2
  - 步骤:
    - F0: 标题（appear）
    - F1: 双色条形图生长（growBar）+ 增益数字（countUp）
```

### rich output:

```markdown
## Slide 6: 脚手架增益数据
- type: bar-chart
- 标题: 5-10 分增益，从中游到前三
- 正文: 同一个模型搭配不同脚手架，分数差距可达 10 个百分点以上
- 图表:
  - 类型: 堆叠双色条形图
  - 数据:
    | 模型 | 基线 (Terminus 2) | 增益 | 总分 | 最佳脚手架 |
    |------|------------------|------|------|-----------|
    | GPT-5.3 | 64.7 | +10.4 | 75.1 | Simple Codex |
    | Opus 4.6 | 62.9 | +7.0 | 69.9 | Droid |
  - 基准线: 62.9（Terminus 2 + Opus 4.6 基线，虚线）
  - 排序: 按总分降序
  - 外观描述: >
      2 条水平堆叠条形，垂直排列，间距 gap-5，整体居中偏左（max-w-[85%]）。
      每条结构: 左侧标签区（w-28）显示 "模型名 + 脚手架名"，text-right，text-base。
      条形区由两段无间隙拼接:
      - 灰色段（barTrack 色 #F0F0EA）: 代表基线分数，宽度按基线/最高分比例。
      - 绿色段（accentPositive #4CAF50）: 代表增益分数，紧接灰段，宽度按增益/最高分比例。
      条形总高度 h-10，仅最右端有圆角 rounded-r-lg。
      右侧标注区: 总分数字（text-xl, font-bold）+ 绿色小字 "(+10.4)"（text-sm, accentPositive）。
      GPT-5.3 行: 灰段 86%宽 + 绿段 14%宽 = 100%（最长条）。
      Opus 4.6 行: 灰段 84%宽 + 绿段 9%宽 = 93%。
      在图表左侧 62.9 分对应的 x 位置，有一条竖向虚线（1px dashed, rgba(0,0,0,0.15)），
      虚线顶端标注 "基线 62.9"（text-xs, textCaption, 斜体）。
  - 动画描述: >
      F1: 2 条灰色基线段从 width:0 生长到目标宽度，duration 0.6s，ease [0.16,1,0.3,1]。
      两条之间 stagger 0.1s。基准虚线在灰段经过 62.9 位置时淡入（opacity 0→1, 0.3s）。
      F2: 绿色增益段从灰段末端继续生长，duration 0.5s，ease [0.16,1,0.3,1]。
      同时右侧增益数字 countUp（0→+10.4 / 0→+7.0，0.5s, ease-out）。
      结论文字在底部 appear（opacity 0→1 + y:8→0，0.4s）。
- 动画:
  - fragments: 3
  - 步骤:
    - F0: 标题 + 正文（appear）
    - F1: 基线部分条形生长（growBar）+ 基准线出现
    - F2: 增益部分条形生长（growBar）+ 增益数字（countUp）+ 结论（appear）
- 结论: 脚手架工程可以带来 5-10 分的增益，足以改变排名位置
```

---

## Anti-Patterns (NEVER DO)

### Content
- **Never generate a slide with only a title.** Every slide must have substantive data.
- **Never use generic titles** like "数据对比" or "关键发现". Titles state the specific takeaway.
- **Never use placeholder values** like "XX%", "N/A", "待填".
- **Never invent numbers.** Every metric must trace back to the source document.
- **Never skip a topic from the script.** If the script mentions it, there must be a slide.
- **Never add topics not in the script.** The script is the authoritative content selector.
- **Never put detailed spoken narration into the slide body.** Slides capture DATA; narration is in the script.

### Visual Mandate
- **Never produce a non-title/key-point slide without a visual element.** Every content slide needs 图表, 图示, or 占位图.
- **Never write a `图表` field without `外观描述`.** "横向条形图" alone is useless — describe every bar, label, color, size.
- **Never write a `图表` or `占位图` field without `动画描述`.** Every visual element must specify how it animates.
- **Never write a vague `外观描述`** like "一个条形图展示分数对比". Must include: element count, specific values, colors, sizes, positions.
- **Never write a vague `动画描述`** like "条形图动画展示". Must include: trigger fragment, duration, easing, stagger timing, specific start→end states.
- **Never write a `占位图` without `预期内容`** describing exactly what real image should replace it.

### Animation
- **Never omit the `动画` field on any non-title, non-key-point slide.**
- **Never use `countUp` on text or `appear` on a big number.** Match animation type to content type.
- **Never assign identical animation (all `appear`) to every slide.** Use the animation type table.

---

## Quality Checklist

Before writing the output file, verify:

### Structure
- [ ] Density mode is stated in the header comment
- [ ] Slide plan table is included as HTML comment
- [ ] Every script section has corresponding slide(s)
- [ ] No script topic missing; no extra topic added
- [ ] Slide types alternate — no 3+ consecutive same type
- [ ] First slide = `title`, last slide = `key-point`
- [ ] `key-point` dividers separate major topic groups
- [ ] Slide count within density range (compact: 15-20, rich: 20-28)

### Content
- [ ] Every slide has a specific, non-generic takeaway title
- [ ] Every data field contains exact values from the source document
- [ ] Color hints (正向色/负向色/中性色) used for all data with sentiment
- [ ] All text in specified `--lang`

### Visual Mandate
- [ ] **Every non-title/key-point slide has at least one visual element** (图表 / 图示 / 占位图)
- [ ] **Every `图表` has `外观描述`**: element count, specific values, colors, sizes, positions, proportions
- [ ] **Every `图表` has `动画描述`**: trigger fragment, duration, easing, stagger, start→end states
- [ ] **Every `占位图` has `外观描述`**: dimensions, border style, background, label text, positioning
- [ ] **Every `占位图` has `预期内容`**: detailed description of the real image that should replace it
- [ ] **Every `占位图` has `动画描述`**: entrance animation timing and style
- [ ] **Every `图示` has `外观描述`**: node count, labels, connections, layout direction, colors
- [ ] **Every `图示` has `动画描述`**: reveal sequence, stagger timing, per-element effects

### Charts & Animation
- [ ] Every slide with quantitative data has a `图表` field with type + data
- [ ] Every non-title/key-point slide has a `动画` field with fragments + steps
- [ ] Every big number specifies `countUp` animation
- [ ] Every bar/progress element specifies `growBar` animation
- [ ] `布局` field present on comparison, grid, and card-grid slides
- [ ] Max 50% of content slides use `卡片` layout (track card count)
