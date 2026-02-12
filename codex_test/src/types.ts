import type { StylePreset } from "./style/types";

export interface ControlConfig {
  lang: string;
  style: string;
  script: string;
}

export interface DeckMeta {
  title: string;
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ListBlock {
  type: "list";
  items: string[];
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
}

export type SlideBlock = ParagraphBlock | ListBlock | TableBlock;

export interface Slide {
  id: string;
  title: string;
  keyMessage: string;
  supportingPoints: string[];
  blocks: SlideBlock[];
}

export interface PptScript {
  meta: DeckMeta;
  slides: Slide[];
}

export interface ResolvedStyle {
  source: "preset" | "custom";
  preset: StylePreset;
}
