export type StyleSource = "preset" | "custom";

export interface FontTokens {
  title: string;
  body: string;
  fallback: string;
}

export interface ColorTokens {
  background: string;
  text: string;
  mutedText: string;
  card: string;
  border: string;
  accent: string;
  positive: string;
  negative: string;
  neutral: string;
}

export interface ChartTokens {
  axis: string;
  label: string;
  seriesPrimary: string;
  seriesPositive: string;
  seriesNegative: string;
  showGrid: boolean;
}

export interface SurfaceTokens {
  radius: string;
  shadow: string;
  cardOpacity: number;
}

export interface MotionTokens {
  transition: string;
  durationMs: number;
}

export interface StylePreset {
  id: string;
  label: string;
  description: string;
  fonts: FontTokens;
  colors: ColorTokens;
  surface: SurfaceTokens;
  chart: ChartTokens;
  motion: MotionTokens;
}
