import type { PptScript, Slide, SlideBlock, TableBlock } from "./types";

interface RawSlide {
  title: string;
  lines: string[];
}

function parseTable(lines: string[]): TableBlock {
  const rows = lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0)
    );

  const filteredRows = rows.filter(
    (row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell))
  );

  const [headers, ...bodyRows] = filteredRows;
  return {
    type: "table",
    headers: headers ?? [],
    rows: bodyRows,
  };
}

function parseBlocks(lines: string[]): SlideBlock[] {
  const blocks: SlideBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i += 1;
      }
      blocks.push(parseTable(tableLines));
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("|")
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
  }

  return blocks;
}

function toSlides(rawSlides: RawSlide[]): Slide[] {
  return rawSlides.map((raw, index) => {
    const blocks = parseBlocks(raw.lines);
    const keyMessage = blocks.find((b) => b.type === "paragraph")?.text ?? raw.title;
    const listBlock = blocks.find((b) => b.type === "list");
    const supportingPoints =
      listBlock && listBlock.type === "list" ? listBlock.items.slice(0, 5) : [];

    return {
      id: `slide-${index + 1}`,
      title: raw.title,
      keyMessage,
      supportingPoints,
      blocks,
    };
  });
}

export function parseMarkdownToPpt(markdown: string): PptScript {
  const lines = markdown.split(/\r?\n/);
  let metaTitle = "Untitled Deck";
  const rawSlides: RawSlide[] = [];
  let current: RawSlide | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^#\s+/.test(line)) {
      metaTitle = line.replace(/^#\s+/, "").trim();
      continue;
    }

    if (/^##\s+/.test(line)) {
      if (current) {
        rawSlides.push(current);
      }
      current = {
        title: line.replace(/^##\s+/, "").trim(),
        lines: [],
      };
      continue;
    }

    if (/^---\s*$/.test(line)) {
      if (current) {
        rawSlides.push(current);
        current = null;
      }
      continue;
    }

    if (!current) {
      continue;
    }

    current.lines.push(line);
  }

  if (current) {
    rawSlides.push(current);
  }

  return {
    meta: { title: metaTitle },
    slides: toSlides(rawSlides),
  };
}
