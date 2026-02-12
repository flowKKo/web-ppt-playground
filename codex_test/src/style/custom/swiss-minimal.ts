import type { StylePreset } from "../types";

const preset: StylePreset = {
  id: "swiss-minimal",
  label: "Swiss Minimal Professional",
  description:
    "Minimal Swiss style with warm off-white base, restrained typography, and high whitespace.",
  fonts: {
    title: "Helvetica Now Display",
    body: "Inter",
    fallback: "HarmonyOS Sans, Source Han Sans SC, sans-serif",
  },
  colors: {
    background: "#F5F5F0",
    text: "#333333",
    mutedText: "#5F5F5F",
    card: "#FFFFFF",
    border: "#E6E6DF",
    accent: "#546E7A",
    positive: "#4CAF50",
    negative: "#E57373",
    neutral: "#546E7A",
  },
  surface: {
    radius: "14px",
    shadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
    cardOpacity: 1,
  },
  chart: {
    axis: "#9CA3AF",
    label: "#333333",
    seriesPrimary: "#546E7A",
    seriesPositive: "#4CAF50",
    seriesNegative: "#E57373",
    showGrid: false,
  },
  motion: {
    transition: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    durationMs: 500,
  },
};

export default preset;
