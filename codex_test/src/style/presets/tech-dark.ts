import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "tech-dark",
  label: "Tech Dark",
  description: "Dark technical presentation with cyan accents.",
  fonts: {
    title: "Inter",
    body: "Inter",
    fallback: "Source Han Sans SC, sans-serif",
  },
  colors: {
    background: "#0B1220",
    text: "#E6EDF9",
    mutedText: "#9FB0CF",
    card: "#111B2F",
    border: "#1F2B45",
    accent: "#22D3EE",
    positive: "#22C55E",
    negative: "#F87171",
    neutral: "#7C93B6",
  },
  surface: {
    radius: "16px",
    shadow: "0 16px 30px rgba(0, 0, 0, 0.35)",
    cardOpacity: 1,
  },
  chart: {
    axis: "#7C93B6",
    label: "#E6EDF9",
    seriesPrimary: "#22D3EE",
    seriesPositive: "#22C55E",
    seriesNegative: "#F87171",
    showGrid: true,
  },
  motion: {
    transition: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    durationMs: 520,
  },
};

export default preset;
