# Swiss Style (瑞士国际主义设计风格)

极简、米白色底、专业设计风格。

## Color Tokens

```ts
export const colors = {
  page: '#EEEEE8',       // 页面背景（slide 间的底色）
  slide: '#F5F5F0',      // Slide 背景（米白色）
  card: '#FFFFFF',       // 卡片背景
  textPrimary: '#333333',   // 主文字（深炭灰）
  textSecondary: '#757575', // 副文字
  textCaption: '#9E9E9E',   // 标注/来源
  accentPositive: '#4CAF50', // 正向/增益（Matte Green）
  accentNegative: '#E57373', // 负向/警告（Muted Red）
  accentNeutral: '#546E7A',  // 中性强调（Blue Grey）
  border: 'rgba(0,0,0,0.06)',
  barTrack: '#F0F0EA',      // 图表条形背景轨道
}
```

## Tailwind Extend

```ts
export const tailwindExtend = {
  colors: {
    swiss: {
      page: '#EEEEE8',
      slide: '#F5F5F0',
      card: '#FFFFFF',
      text: '#333333',
      'text-secondary': '#757575',
      'text-caption': '#9E9E9E',
      positive: '#4CAF50',
      negative: '#E57373',
      neutral: '#546E7A',
    }
  },
  fontFamily: {
    sans: ['Inter', 'HarmonyOS Sans', 'Source Han Sans', '-apple-system', 'Helvetica Neue', 'sans-serif'],
  },
  borderRadius: {
    card: '14px',
  },
  boxShadow: {
    card: '0 10px 20px rgba(0,0,0,0.04)',
    slide: '0 4px 24px rgba(0,0,0,0.06)',
  }
}
```

## Typography

| Element | Tailwind Classes | Weight |
|---------|-----------------|--------|
| Slide title | `text-5xl md:text-6xl font-bold text-swiss-text` | 700 |
| Key numbers | `text-7xl md:text-8xl font-extrabold` | 800 |
| Subtitle | `text-2xl md:text-3xl font-semibold text-swiss-text` | 600 |
| Body | `text-xl md:text-2xl text-swiss-text` | 400 |
| Caption | `text-base text-swiss-text-caption` | 400 |

Rules:
- Never use serif fonts
- Title: Medium/Bold weight only
- Body: Regular weight
- Line height: `leading-relaxed` for body, `leading-tight` for titles

## Card Style

```
className="bg-swiss-card border border-black/[0.06] rounded-card shadow-card p-8"
```

## Slide Style

```
className="bg-swiss-slide rounded-xl shadow-slide"
```

Shadows should be barely visible — just enough to lift the slide off the page.

## ECharts Theme

```ts
export const echartsTheme = {
  color: ['#546E7A', '#4CAF50', '#E57373', '#78909C', '#81C784', '#EF9A9A'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#333333',
    fontFamily: 'Inter, HarmonyOS Sans, Source Han Sans, sans-serif',
  },
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { color: '#757575', fontSize: 14 },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
  },
  bar: {
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
    },
    barMaxWidth: 60,
  },
}
```

Chart rules:
- Flat design: no gradients, no 3D
- No grid lines
- Label values directly on or above bars
- Background track: `#F0F0EA`

## Layout Principles

- **Generous whitespace** — the essence of Swiss style. Do NOT fill every slide.
- **Grid alignment** — use Tailwind `grid` and `gap-` utilities
- **Asymmetric balance** — title left-aligned (`text-left`), content can offset right
- **Minimal decoration** — no unnecessary borders, icons, or ornaments
- **Dividers** — thin `border-b border-black/[0.08]` sparingly

## Placeholder Box

```
className="border-[1.5px] border-dashed border-black/[0.15] rounded-xl bg-black/[0.02] flex items-center justify-center text-swiss-text-caption text-lg"
```

## Framer Motion Animation

Entrance: `opacity: 0 → 1` + `translateY: 20px → 0`
Duration: `0.6s`
Easing: `[0.16, 1, 0.3, 1]` (custom ease-out)
Stagger: `0.1s` between children

```ts
export const motionConfig = {
  slide: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.1 } },
  },
  child: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
}
```

No bouncing, no scaling, no color transitions.
