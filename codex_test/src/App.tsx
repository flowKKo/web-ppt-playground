import { CSSProperties, useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { motion, useReducedMotion } from "framer-motion";
import { parseMarkdownToPpt } from "./markdown";
import { resolveStyle, toCssVars } from "./style";
import type { ControlConfig, PptScript, Slide, TableBlock } from "./types";

export const CONTROL: ControlConfig = {
  lang: "zh-CN",
  // Assumption: this natural-language style description maps to Swiss minimal tokens via keyword inference.
  style:
    "极简、米白色底、专业设计风格，建议采用 Swiss Style。背景 #F5F5F0，主文字 #333333，正向 #4CAF50，负向 #E57373，中性 #546E7A。",
  script: "/Users/sf/Documents/codes/web-ppt-playground/codex_test/slides.md",
};

export const PPT_SCRIPT: PptScript = {
  meta: { title: "" },
  slides: [],
};

declare global {
  interface Window {
    CONTROL: ControlConfig;
    PPT_SCRIPT: PptScript;
  }
}

window.CONTROL = CONTROL;
window.PPT_SCRIPT = PPT_SCRIPT;

function toScriptUrl(scriptPath: string): string {
  if (!/(\.md|\.markdown)$/i.test(scriptPath)) {
    throw new Error(`无效脚本扩展名: ${scriptPath}，仅支持 .md / .markdown`);
  }

  if (/^https?:\/\//i.test(scriptPath)) {
    return scriptPath;
  }

  if (scriptPath.startsWith("/")) {
    return `/@fs${scriptPath}`;
  }

  return scriptPath;
}

function tableToChartOption(table: TableBlock, colors: Record<string, string>) {
  const headers = table.headers;
  if (headers.length < 2 || table.rows.length === 0) {
    return null;
  }

  const categories = table.rows.map((row) => row[0] ?? "");
  const series = headers.slice(1).map((header, idx) => {
    const values = table.rows.map((row) => {
      const raw = (row[idx + 1] ?? "").replace(/[+,KkMm<>]/g, "").trim();
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    });

    return {
      name: header,
      type: "bar",
      data: values,
      itemStyle: {
        color:
          idx === 0
            ? colors["--ppt-neutral"]
            : idx === 1
            ? colors["--ppt-positive"]
            : colors["--ppt-accent"],
      },
    };
  });

  return {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: {
      textStyle: { color: colors["--ppt-text"] },
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLine: { lineStyle: { color: colors["--ppt-border"] } },
      axisLabel: { color: colors["--ppt-text"] },
    },
    yAxis: {
      type: "value",
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { color: colors["--ppt-text"] },
    },
    grid: { left: 30, right: 16, top: 36, bottom: 24 },
    series,
  };
}

function SlideCard({
  slide,
  motionEnabled,
  cssVars,
}: {
  slide: Slide;
  motionEnabled: boolean;
  cssVars: Record<string, string>;
}) {
  const animations = motionEnabled
    ? {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.45 },
      }
    : {};

  return (
    <motion.section className="slide-shell" {...animations}>
      <article className="slide-canvas">
        <header>
          <h2>{slide.title}</h2>
        </header>

        <div className="slide-content">
          {slide.blocks.map((block, idx) => {
            if (block.type === "paragraph") {
              return (
                <p key={`${slide.id}-p-${idx}`} className="paragraph">
                  {block.text}
                </p>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={`${slide.id}-l-${idx}`} className="list">
                  {block.items.map((item, itemIdx) => (
                    <li key={`${slide.id}-li-${itemIdx}`}>{item}</li>
                  ))}
                </ul>
              );
            }

            const chartOption = tableToChartOption(block, cssVars);
            return (
              <div key={`${slide.id}-t-${idx}`} className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIdx) => (
                      <tr key={`${slide.id}-row-${rowIdx}`}>
                        {row.map((cell, cellIdx) => (
                          <td key={`${slide.id}-cell-${rowIdx}-${cellIdx}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {chartOption ? (
                  <div className="chart-wrap">
                    <ReactECharts option={chartOption} style={{ height: "220px" }} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </article>
    </motion.section>
  );
}

export default function App() {
  const [deck, setDeck] = useState<PptScript | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const styleResult = useMemo(() => resolveStyle(CONTROL.style), []);
  const cssVars = useMemo(() => toCssVars(styleResult.preset), [styleResult]);

  useEffect(() => {
    document.documentElement.lang = CONTROL.lang;

    const apply = async () => {
      try {
        const url = toScriptUrl(CONTROL.script);
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`脚本读取失败: ${CONTROL.script} (HTTP ${res.status})`);
        }

        const raw = await res.text();
        const parsed = parseMarkdownToPpt(raw);
        PPT_SCRIPT.meta = parsed.meta;
        PPT_SCRIPT.slides = parsed.slides;
        window.PPT_SCRIPT = PPT_SCRIPT;
        setDeck(parsed);
      } catch (e) {
        const message = e instanceof Error ? e.message : "未知脚本读取错误";
        setError(message);
      }
    };

    apply();
  }, []);

  const rootStyle = cssVars as CSSProperties;

  if (error) {
    return (
      <main className="app-root" style={rootStyle}>
        <section className="error-card">
          <h1>无法加载脚本</h1>
          <p>{error}</p>
          <p>请检查 `CONTROL.script` 路径是否正确且可读。</p>
        </section>
      </main>
    );
  }

  if (!deck) {
    return (
      <main className="app-root" style={rootStyle}>
        <section className="loading-card">正在读取 Markdown 脚本...</section>
      </main>
    );
  }

  return (
    <main className="app-root" style={rootStyle}>
      <header className="deck-header">
        <h1>{deck.meta.title}</h1>
        <p>
          lang: {CONTROL.lang} | style source: {styleResult.source} | slides: {deck.slides.length}
        </p>
      </header>

      <div className="slides-stack">
        {deck.slides.map((slide) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            motionEnabled={!prefersReducedMotion}
            cssVars={cssVars}
          />
        ))}
      </div>

      <footer className="deck-footer">
        修改入口: `src/App.tsx` 中的 `CONTROL.lang` / `CONTROL.style` / `CONTROL.script`
      </footer>
    </main>
  );
}
