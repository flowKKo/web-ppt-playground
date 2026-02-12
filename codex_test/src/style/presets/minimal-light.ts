import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "minimal-light",
  label: "Minimal Light",
  description: "Bright, high-whitespace, typography-first style.",
  fonts: {
    title: "Inter",
    body: "Inter",
    fallback: "Source Han Sans SC, sans-serif",
  },
  colors: {
    background: "#F8F8F6",
    text: "#2E2E2E",
    mutedText: "#666666",
    card: "#FFFFFF",
    border: "#E8E8E2",
    accent: "#3B82F6",
    positive: "#16A34A",
    negative: "#DC2626",
    neutral: "#64748B",
  },
  surface: {
    radius: "12px",
    shadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
    cardOpacity: 1,
  },
  chart: {
    axis: "#94A3B8",
    label: "#334155",
    seriesPrimary: "#3B82F6",
    seriesPositive: "#16A34A",
    seriesNegative: "#DC2626",
    showGrid: false,
  },
  motion: {
    transition: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    durationMs: 480,
  },
};

export default preset;
