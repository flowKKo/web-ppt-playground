import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "glassmorphism",
  label: "Glassmorphism",
  description: "Soft translucent cards over atmospheric backgrounds.",
  fonts: {
    title: "Inter",
    body: "Inter",
    fallback: "Source Han Sans SC, sans-serif",
  },
  colors: {
    background: "#DCE8F8",
    text: "#10213A",
    mutedText: "#4B5D79",
    card: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.5)",
    accent: "#2563EB",
    positive: "#16A34A",
    negative: "#E11D48",
    neutral: "#64748B",
  },
  surface: {
    radius: "18px",
    shadow: "0 18px 36px rgba(15, 23, 42, 0.15)",
    cardOpacity: 0.68,
  },
  chart: {
    axis: "#60708B",
    label: "#1E293B",
    seriesPrimary: "#2563EB",
    seriesPositive: "#16A34A",
    seriesNegative: "#E11D48",
    showGrid: false,
  },
  motion: {
    transition: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    durationMs: 520,
  },
};

export default preset;
