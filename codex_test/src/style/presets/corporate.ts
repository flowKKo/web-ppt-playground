import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "corporate",
  label: "Corporate",
  description: "Structured enterprise style with restrained accents.",
  fonts: {
    title: "Inter",
    body: "Inter",
    fallback: "Source Han Sans SC, sans-serif",
  },
  colors: {
    background: "#F3F5F8",
    text: "#1F2937",
    mutedText: "#6B7280",
    card: "#FFFFFF",
    border: "#D7DEE8",
    accent: "#1D4ED8",
    positive: "#059669",
    negative: "#DC2626",
    neutral: "#475569",
  },
  surface: {
    radius: "10px",
    shadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
    cardOpacity: 1,
  },
  chart: {
    axis: "#64748B",
    label: "#334155",
    seriesPrimary: "#1D4ED8",
    seriesPositive: "#059669",
    seriesNegative: "#DC2626",
    showGrid: true,
  },
  motion: {
    transition: "ease-out",
    durationMs: 420,
  },
};

export default preset;
