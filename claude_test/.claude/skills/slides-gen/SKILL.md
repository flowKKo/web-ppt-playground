---
name: slides-gen
description: "Generate slides.md from a script/voiceover file and source document. Maps narrative sections to typed slide outlines with real data. Usage: /slides-gen --script voiceover.md --source full.md [--output slides.md]"
argument-hint: "--script <file> --source <file> [--output <file>] [--lang zh]"
---

# Slides Script Generator

Generate a structured `slides.md` file from a narrative script (voiceover/script) and a detailed source document. The output is a slide-by-slide outline that can be fed into the `/web-ppt` skill to produce the final presentation.

## Argument Parsing

Parse `$ARGUMENTS` for these flags:

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--script` | Yes | — | Path to the voiceover/script markdown file (narrative source) |
| `--source` | Yes | — | Path to the full reference document with detailed data |
| `--output` | No | `slides.md` | Output path for the generated slide outline |
| `--lang` | No | `zh` | Language for slide content |

Positional shorthand: `/slides-gen voiceover.md full.md` → script=voiceover.md, source=full.md

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

## Output Format: slides.md

The output is a Markdown file where each slide is a `## Slide N: Title` section separated by `---`. Each slide section contains YAML-like fields describing the slide content.

### Document Structure

```markdown
# [Presentation Title]

---

## Slide 1: [Title]
- type: [slide-type]
- 标题: [slide title]
- [type-specific fields...]

---

## Slide 2: [Title]
...
```

### Available Slide Types

| Type | When to Use | Required Fields |
|------|------------|----------------|
| `title` | Opening slide | 标题, 副标题, 标注 |
| `data-comparison` | 2-4 metrics with exact numbers | 标题, 数据 (list of label+value), 结论 |
| `key-point` | Section divider, one big takeaway | 标题, 副标题 (optional 正文) |
| `comparison` | Side-by-side feature comparison | 标题, 左列/右列/中列 (名称, 代表, items) |
| `grid` | 4-6 item overview | 标题, 网格 (numbered list) |
| `bar-chart` | Score/performance ranking | 标题, 正文, 图表数据 (table) |
| `player-card` | Individual item deep-dive | 标题, 分数, 模型, 特性 (list), optional 对比图表 |
| `diagram` | Process flow / architecture | 标题, 图示 (numbered steps), 侧注 |
| `list` | Ordered recommendations / steps | 标题, 列表 (numbered items) |
| `placeholder` | Screenshot/image placeholder | 标题, 占位图, optional 关键数字 |
| `card-grid` | 2-4 labeled cards | 标题, 卡片 (list), 结论 |

### Field Reference

```markdown
## Slide N: [Section · Topic]
- type: [slide-type]
- 标题: [Main heading — states the takeaway, not just the topic]
- 副标题: [Secondary heading, used in title/key-point types]
- 正文: [1-2 sentence summary with key insight. NOT generic filler]
- 标注: [Date, source, footnote]
- 数据:
  - [label]: [exact value]（[color hint: 正向色/负向色]）
- 结论: [Data-driven takeaway sentence]
- 图表数据:
  | Column1 | Column2 | ... |
  |---------|---------|-----|
  | data    | data    | ... |
- 关键数字: [One standout metric]
- 占位图: [Description of what goes here]
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
  2. ...
- 图示 ([description]):
  1. [Step] — [Explanation]
  2. ...
- 列表:
  1. [Item with full sentence description]
  2. ...
- 特性:
  - [Feature]: [Detail]
- 对比图表:
  | [Column1] | [Column2] |
  |-----------|-----------|
  | data      | data      |
- 侧注: [Marginal note or annotation]
- 解释: [Why this matters — used for surprising data]
- 争议: [Counterpoint or nuance]
- 差值: [Delta with color annotation]
- 增益: [Gain/improvement metric]
- 警告: [Caveat or warning callout]
```

---

## Generation Workflow

### Step 1: Read & Understand the Script

Read the `--script` file completely. Identify:

1. **Sections** — Each `---` or heading break in the script maps to a group of slides
2. **Key transitions** — "来看看...", "接下来...", "最后..." signal section boundaries
3. **Data mentions** — Every number, ranking, comparison in the narration must appear in a slide
4. **Narrative arc** — Intro (hook + definition) → Body (analysis + examples) → Conclusion (synthesis + call-to-action)

### Step 2: Read & Index the Source Document

Read the `--source` file completely. Build a mental index of:

1. **All quantitative data** — scores, percentages, token counts, rankings
2. **All comparisons** — side-by-side evaluations, feature matrices
3. **All entities** — products, models, companies, papers mentioned
4. **Key findings** — conclusions, insights, surprising results

### Step 3: Map Script Sections to Slides

For each section of the script, decide:

1. **How many slides?** — One section may need 1-4 slides depending on content density
2. **What slide type?** — Match the content to the best visual format (see Slide Type Selection below)
3. **What data?** — Cross-reference script mentions with source document data

### Step 4: Populate Slide Data

For each slide:

1. **Title** — Should state the TAKEAWAY, not just the topic. "脚手架增益 5-10 分" > "脚手架数据"
2. **Body/正文** — 1-2 sentences with the key insight. Must contain a specific fact.
3. **Data fields** — Extract EXACT numbers from the source document. Never round. Never invent.
4. **Conclusion** — A data-driven sentence the audience should remember.

### Step 5: Write the Output

Write the complete `slides.md` to `--output` path.

---

## Slide Type Selection Guide

Use this decision tree to pick the right slide type for each script section:

```
Is this an opening or section divider?
  → Yes: title or key-point

Does the section present 2-4 standalone metrics?
  → Yes: data-comparison

Does the section compare 2-3 alternatives side by side?
  → Yes: comparison

Does the section rank or score multiple items?
  → Yes: bar-chart

Does the section deep-dive one specific item (product/tool)?
  → Yes: player-card

Does the section list 4-6 categories or dimensions?
  → Yes: grid

Does the section describe a process or architecture?
  → Yes: diagram

Does the section give ordered recommendations?
  → Yes: list

Does the section reference a screenshot or demo?
  → Yes: placeholder

Does the section list 2-4 grouped items with a conclusion?
  → Yes: card-grid
```

---

## Slide Mapping Principles

### One Core Message Per Slide

Each slide delivers exactly ONE takeaway. If a script section makes two distinct points, split into two slides.

### Narrative Rhythm

Follow a rhythm of slide types to maintain visual variety:

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
3. **Specific names** — product names, model names, paper names (not generic labels)
4. **Supporting evidence** — benchmark methodology, evaluation conditions

### Content Density Rules

| Slide Type | Minimum Data Points | Maximum Data Points |
|------------|--------------------|--------------------|
| data-comparison | 2 metrics | 4 metrics |
| bar-chart | 3 rows | 8 rows |
| comparison | 2 columns × 3 rows | 3 columns × 5 rows |
| grid | 4 items | 6 items |
| player-card | 1 score + 3 features | 1 score + 5 features + chart |
| list | 3 items | 5 items |

---

## Anti-Patterns (NEVER DO)

- **Never generate a slide with only a title.** Every slide must have substantive data.
- **Never use generic titles** like "数据对比" or "关键发现". Titles state the specific takeaway.
- **Never use placeholder values** like "XX%", "N/A", "待填". If data doesn't exist in the source, redesign the slide or skip it.
- **Never invent numbers.** Every metric must trace back to the source document.
- **Never skip a topic that appears in the script narration.** If the script mentions it, there must be a slide for it.
- **Never add topics not in the script.** The script is the authoritative content selector.
- **Never create more than 25 slides** for a 10-12 minute presentation. Target 20-23.
- **Never put detailed spoken narration into the slide body.** The slide captures the DATA; the narration is in the script file.

---

## Quality Checklist

Before writing the output file, verify:

- [ ] Every section of the script has corresponding slide(s)
- [ ] No script topic is missing from the slides
- [ ] No slide topic is absent from the script (slides reflect script, not source directly)
- [ ] Every slide has a specific, non-generic title that states the takeaway
- [ ] Every data field contains exact values from the source document
- [ ] Slide types vary — no 3+ consecutive slides of the same type
- [ ] First slide is `title` type, last slide is `key-point` type
- [ ] Section dividers (`key-point`) separate major topic groups
- [ ] Total slide count is 18-25 for a 10-12 minute presentation
- [ ] All text is in the specified `--lang`
- [ ] Color hints (正向色/负向色) are used for data with positive/negative sentiment

---

## Example Mapping

Given a script section like:

> 看一下数据。GPT-5.3 配合 Terminus 2 得到 64.7 分，加上 Simple Codex 脚手架变成 75.1 分，多了 10.4 分。Opus 4.6 配合 Terminus 2 得到 62.9 分，加上 Droid 脚手架变成 69.9 分，多了 7 分。
> 5 到 10 个百分点的脚手架增益，足以把排名从中游拉到前三。

This maps to:

```markdown
## Slide 6: 脚手架增益数据
- type: bar-chart
- 标题: 脚手架增益
- 正文: 5-10 个百分点的增益，足以把排名从中游拉到前三
- 图表数据:
  | 模型 | 基线 (Terminus 2) | 最佳脚手架 | 增益 |
  |------|------------------|-----------|------|
  | GPT-5.3 | 64.7 | 75.1 (Simple Codex) | +10.4 |
  | Opus 4.6 | 62.9 | 69.9 (Droid) | +7.0 |
```

The numbers come directly from the source document, the structure decision (bar-chart) comes from the data type (ranking comparison), and the title states the takeaway.
