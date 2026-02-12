# Web PPT Playground — Claude Test

## Project Overview

Web-based PPT presentation generator. Each slide is 16:9, rendered vertically with scroll.

## Tech Stack

- **Vite + React + TypeScript** — component-based slide system
- **Tailwind CSS** — styling via utility classes + design tokens
- **Framer Motion** — entrance animations
- **ECharts + echarts-for-react** — data visualization

## Usage

Use the `/web-ppt` skill to generate or update slides:

```
/web-ppt --lang zh --style swiss --script slides.md
```

## Key Files

- `slides.md` — slide content script (one `## Slide N` per page)
- `.claude/skills/web-ppt/SKILL.md` — generation rules and component architecture
- `.claude/skills/web-ppt/styles/swiss.md` — Swiss Style theme tokens
- `src/data/slides.ts` — generated slide data (from script)
- `src/theme/swiss.ts` — generated theme (from style file)
- `src/components/Slide.tsx` — base 16:9 slide wrapper
- `src/components/slides/` — slide type components (TitleSlide, ChartSlide, etc.)

## Conventions

- All styling via Tailwind — no custom CSS except `index.css` for directives
- Slide type components are generic and data-driven via props
- All slide data is typed in TypeScript
- ECharts uses registered theme matching the active style
- No images — use CSS, SVG, or placeholder boxes
