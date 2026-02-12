import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "retro-terminal",
  label: "Retro Terminal",
  description: "Terminal inspired look with monospaced structure.",
  fonts: {
    title: "JetBrains Mono",
    body: "JetBrains Mono",
    fallback: "Source Han Sans SC, monospace",
  },
  colors: {
    background: "#08110C",
    text: "#9DFAB3",
    mutedText: "#62C57D",
    card: "#0D1B14",
    border: "#1F4D33",
    accent: "#7CF29A",
    positive: "#4ADE80",
    negative: "#F87171",
    neutral: "#6EE7B7",
  },
  surface: {
    radius: "8px",
    shadow: "0 8px 20px rgba(0, 0, 0, 0.45)",
    cardOpacity: 1,
  },
  chart: {
    axis: "#62C57D",
    label: "#9DFAB3",
    seriesPrimary: "#7CF29A",
    seriesPositive: "#4ADE80",
    seriesNegative: "#F87171",
    showGrid: true,
  },
  motion: {
    transition: "linear",
    durationMs: 360,
  },
};

export default preset;
