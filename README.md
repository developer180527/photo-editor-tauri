# Pix — Photo Editor

A Tauri-based cross-platform photo editor with a clean dark UI.

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [Rust](https://rustup.rs/) (stable)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/) for your OS

## Setup

```bash
# Install JS dependencies
npm install

# Run in development mode (starts Vite + Tauri together)
npm run tauri dev

# Build for production
npm run tauri build
```

## Keyboard shortcuts

| Key       | Action          |
|-----------|-----------------|
| `V`       | Select tool     |
| `H`       | Hand (pan) tool |
| `Z`       | Zoom tool       |
| `C`       | Crop tool       |
| `⌘O`      | Open image      |
| `⌘Z`      | Undo            |
| `⌘⇧Z`     | Redo            |
| `⌘+`      | Zoom in         |
| `⌘-`      | Zoom out        |
| `⌘0`      | Reset view      |
| Scroll    | Zoom to cursor  |
| Mid-click | Pan canvas      |

## V1 Features

- Open images (PNG, JPG, WEBP, GIF, BMP, TIFF, SVG)
- Pan canvas (hand tool or middle-mouse)
- Zoom with scroll wheel (zooms to cursor position)
- Drag images with select tool
- Layers panel with visibility / lock / delete
- Properties panel shows selected layer info
- Undo / redo

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) — read it before adding features.
