# Pix — Architecture Guide

> Read this before touching any code. It exists so the project
> doesn't turn into a tangled mess when features are added fast.

---

## Directory layout

```
src/
├── types/          # ALL TypeScript types live here. No inline types.
├── stores/         # Zustand stores — state & mutations only
├── lib/
│   └── tauri/      # Tauri invoke() wrappers — never call invoke() in components
├── hooks/          # Business logic that coordinates stores & lib
├── utils/          # Pure functions — no side effects, no store imports
├── components/
│   ├── Layout/     # AppShell, StatusBar — layout only, zero logic
│   ├── MenuBar/
│   ├── ToolStrip/
│   ├── Canvas/     # Konva stage + per-layer-type node components
│   ├── PropertiesPanel/
│   └── LayersPanel/
└── styles/
    └── global.css  # All CSS here. Single file. Design tokens at top.

src-tauri/
└── src/
    ├── lib.rs        # Plugin registration + command registration only
    ├── main.rs       # Thin entry point — calls lib::run()
    └── commands/
        ├── mod.rs    # Re-exports command modules
        └── file_ops.rs  # File-system commands
```

---

## The 5 core rules

### 1. Types are the single source of truth
Every TypeScript interface goes in `src/types/index.ts`.
Never define inline types (`{x: number; y: number}`) in component props.
If it feels like it needs a name, it does — add it to types.

### 2. Stores own state, hooks own coordination
- **Stores** (`src/stores/`): pure state + mutations. No async, no side-effects.
- **Hooks** (`src/hooks/`): async logic that reads/writes multiple stores or calls lib functions.
- **Components**: call hooks. Read stores with selectors. Never coordinate across stores directly.

```
component → hook → lib/tauri + stores
component → store (read-only selectors are fine)
```

### 3. Tauri is isolated in lib/
`invoke()` is called ONLY in `src/lib/tauri/`.
Components and hooks import typed wrappers. This means:
- Easy to mock for testing
- Easy to swap the backend without touching UI code
- TypeScript catches backend API changes at the call site

### 4. CSS has one home
All styles live in `src/styles/global.css`.
Design tokens are CSS variables at the top of the file.
Never use inline `style={{}}` for anything that belongs in a theme.
Use `clsx()` for conditional class names.

### 5. New layer types follow the pattern
To add a `TextLayer`:
1. Add `TextLayer` interface to `src/types/index.ts`
2. Update the `Layer` union type
3. Add a `TextLayerNode.tsx` in `src/components/Canvas/`
4. Add a `case "text"` in `Canvas.tsx` render loop
5. That's it — stores, panels, history all work automatically

---

## Data flow

```
User action (click, keyboard, drag)
    │
    ▼
Hook (useFileOps, useKeyboardShortcuts…)
    │        │
    ▼        ▼
lib/tauri  Store mutations (useLayersStore, useCanvasStore…)
               │
               ▼
           Component re-renders via Zustand selectors
               │
               ▼
           Canvas (Konva stage reads layers → renders nodes)
```

---

## Adding a new tool

1. Add the tool id to `ToolId` in `src/types/index.ts`
2. Add a `ToolDefinition` entry in `src/stores/useToolStore.ts`
3. Add an SVG icon to the `ICONS` map in `ToolStrip.tsx`
4. Add a keyboard shortcut to `TOOL_SHORTCUTS` in `useKeyboardShortcuts.ts`
5. Handle the tool in `Canvas.tsx` (cursor, mouse event behaviour)

---

## Adding a new Tauri command

1. Write the function in `src-tauri/src/commands/file_ops.rs` (or a new module)
2. Register it in `tauri::generate_handler![]` in `src-tauri/src/lib.rs`
3. Write a typed wrapper in `src/lib/tauri/fileOps.ts`
4. Import the wrapper in a hook — never directly in a component

---

## What NOT to do

| ❌ Don't                                    | ✅ Do instead                               |
|---------------------------------------------|---------------------------------------------|
| Call `invoke()` in a component              | Write a wrapper in `lib/tauri/`             |
| Define types inline in component props      | Add to `src/types/index.ts`                 |
| Write business logic in a component         | Extract to a `hooks/` file                  |
| Coordinate two stores inside a component    | Create a hook that does it                  |
| Put CSS in a `<style>` tag or `style={{}}`  | Write it in `global.css`                    |
| Import one store from another store         | Use `storeB.getState()` for one-shot reads  |

---

## Checklist when adding a feature

- [ ] New types added to `src/types/index.ts`?
- [ ] New state in the appropriate store?
- [ ] Business logic in a hook, not a component?
- [ ] Tauri calls wrapped in `lib/tauri/`?
- [ ] Keyboard shortcut added to `useKeyboardShortcuts.ts`?
- [ ] Styles in `global.css`, not inline?
- [ ] ARCHITECTURE.md updated if the pattern changed?
