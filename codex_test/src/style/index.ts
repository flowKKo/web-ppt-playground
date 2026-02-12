import type { StylePreset, StyleSource } from "./types";
import swissMinimal from "./custom/swiss-minimal";

interface PresetModule {
  default: StylePreset;
}

const presetModules = import.meta.glob<PresetModule>("./presets/*.ts", {
  eager: true,
}) as Record<string, PresetModule>;

function clonePreset(preset: StylePreset): StylePreset {
  return JSON.parse(JSON.stringify(preset)) as StylePreset;
}

function buildPresetMap(): Record<string, StylePreset> {
  const entries = Object.values(presetModules).map((mod: PresetModule) => mod.default);
  const map: Record<string, StylePreset> = {};
  for (const preset of entries) {
    map[preset.id] = preset;
  }
  return map;
}

const PRESET_MAP = buildPresetMap();

export const CORE_PRESET_STYLE_IDS = [
  "tech-dark",
  "minimal-light",
  "gradient-warm",
  "corporate",
  "retro-terminal",
  "glassmorphism",
] as const;

export type CorePresetStyleId = (typeof CORE_PRESET_STYLE_IDS)[number];

const SWISS_HINTS = [
  "swiss",
  "international typographic",
  "minimal",
  "professional",
  "off-white",
  "charcoal",
  "extreme whitespace",
  "极简",
  "瑞士",
  "米白",
  "专业",
];

function looksLikeSwissStyle(input: string): boolean {
  const normalized = input.trim().toLowerCase();
  return SWISS_HINTS.some((hint) => normalized.includes(hint.toLowerCase()));
}

function buildCustomFallback(input: string): StylePreset {
  const minimalLight = PRESET_MAP["minimal-light"];
  if (!minimalLight) {
    throw new Error('Missing required preset file: "minimal-light".');
  }

  return {
    ...clonePreset(minimalLight),
    id: "custom-generated",
    label: "Custom Style",
    description: input.trim() || "Custom style text provided by user.",
  };
}

export function listCorePresets(): CorePresetStyleId[] {
  return [...CORE_PRESET_STYLE_IDS];
}

export function listInstalledPresetIds(): string[] {
  return Object.keys(PRESET_MAP).sort();
}

export function resolveStyle(styleInput: string): {
  source: StyleSource;
  preset: StylePreset;
} {
  const normalized = styleInput.trim().toLowerCase();
  if (normalized in PRESET_MAP) {
    return {
      source: "preset",
      preset: clonePreset(PRESET_MAP[normalized]),
    };
  }

  if (looksLikeSwissStyle(styleInput)) {
    return {
      source: "custom",
      preset: clonePreset(swissMinimal),
    };
  }

  return {
    source: "custom",
    preset: buildCustomFallback(styleInput),
  };
}

export function toCssVars(preset: StylePreset): Record<string, string> {
  return {
    "--ppt-bg": preset.colors.background,
    "--ppt-text": preset.colors.text,
    "--ppt-muted": preset.colors.mutedText,
    "--ppt-card": preset.colors.card,
    "--ppt-border": preset.colors.border,
    "--ppt-accent": preset.colors.accent,
    "--ppt-positive": preset.colors.positive,
    "--ppt-negative": preset.colors.negative,
    "--ppt-neutral": preset.colors.neutral,
    "--ppt-radius": preset.surface.radius,
    "--ppt-shadow": preset.surface.shadow,
    "--ppt-title-font": `${preset.fonts.title}, ${preset.fonts.fallback}`,
    "--ppt-body-font": `${preset.fonts.body}, ${preset.fonts.fallback}`,
  };
}
