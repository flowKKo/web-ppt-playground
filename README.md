<div align="center"><a name="readme-top"></a>

[![Presenta](docs/images/banner.svg)](https://www.presenta.help/en/)

Create beautiful presentations with diagrams, charts, and AI — right in your browser.

**English** · [简体中文](README.zh-CN.md) · [Official Website](https://www.presenta.help/en/) · [官网](https://www.presenta.help/zh/)

</div>

## Features

- **11 Slide Types** — Title, key-point, charts (bar/pie/line/radar), grid cards, sequence flows, comparison, funnel/pyramid, concentric rings, hub-spoke, Venn diagrams, and free-layout blocks
- **7 Diagram Engines** — Each engine supports multiple visual variants (skins), giving you dozens of distinct diagram styles
- **Free-Layout Blocks** — Place multiple draggable, resizable content blocks on a single slide, each block can be any diagram type
- **WYSIWYG Editor** — Property panel, inline text editing, drag-to-reorder slides, undo/redo, overlay layers (text/rect/line)
- **Fullscreen Presentation** — Spotlight mode with block-by-block reveal animations
- **Deck Management** — Create, import (JSON), export, and delete presentations with file-based persistence
- **AI Generation** — Auto-generate complete slide decks from scripts via Claude Code's `/web-ppt` skill

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` to see the deck selector. Click a card to open a presentation, or create a new one.

## Usage

### Navigation
- **Mouse wheel** / **Arrow keys** / **PageUp/PageDown** — switch slides
- **Sidebar thumbnails** — click to jump, drag to reorder, right-click for context menu

### Editing
- **Click slide content** — select it, property panel appears on the right
- **Double-click text** — inline editing
- **Property panel** — change type, variant, data fields, gap, etc.
- **Toolbar** — add text/rect/line overlays, undo/redo
- **Ctrl+Z / Ctrl+Shift+Z** — undo / redo
- **Delete** — remove selected element

### Fullscreen
- Click the fullscreen button in the toolbar
- Use Spotlight mode to reveal blocks one by one

## AI Generation

Generate a complete presentation from a script using Claude Code:

```
/web-ppt --lang zh --style swiss --script slides.md --deck my-deck
```

## License

Private project.
