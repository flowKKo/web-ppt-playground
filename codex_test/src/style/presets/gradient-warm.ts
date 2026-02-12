import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "gradient-warm",
  label: "Gradient Warm",
  description: "Warm gradients with editorial contrast.",
  fonts: {
    title: "Inter",
    body: "Inter",
    fallback: "Source Han Sans SC, sans-serif",
  },
  colors: {
    background: "#FFF5EB",
    text: "#3D2F26",
    mutedText: "#8C6F5C",
    card: "#FFFDFB",
    border: "#F3DCCB",
    accent: "#F97316",
    positive: "#22C55E",
    negative: "#E11D48",
    neutral: "#7C6A5A",
  },
  surface: {
    radius: "16px",
    shadow: "0 12px 24px rgba(112, 66, 20, 0.12)",
    cardOpacity: 0.95,
  },
  chart: {
    axis: "#A78B75",
    label: "#3D2F26",
    seriesPrimary: "#F97316",
    seriesPositive: "#22C55E",
    seriesNegative: "#E11D48",
    showGrid: false,
  },
  motion: {
    transition: "cubic-bezier(0.18, 0.84, 0.26, 1)",
    durationMs: 500,
  },
};

export default preset;
