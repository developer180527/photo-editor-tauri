// ============================================================
//  hooks/useKeyboardShortcuts.ts
//  All keyboard shortcuts live in ONE place.
//  Add new shortcuts here, not scattered in components.
// ============================================================

import { useEffect } from "react";
import { useToolStore } from "@/stores/useToolStore";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useFileOps } from "./useFileOps";
import { ToolId } from "@/types";

const TOOL_SHORTCUTS: Record<string, ToolId> = {
  v: "select",
  h: "hand",
  z: "zoom",
  c: "crop",
};

export function useKeyboardShortcuts() {
  const setActiveTool = useToolStore((s) => s.setActiveTool);
  const { zoomIn, zoomOut, resetView } = useCanvasStore();
  const { undo, redo } = useHistoryStore();
  const { openImage } = useFileOps();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      // Don't fire shortcuts when typing in inputs
      if (tag === "input" || tag === "textarea") return;

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl/Cmd shortcuts
      if (ctrl) {
        switch (key) {
          case "o": e.preventDefault(); openImage(); break;
          case "z": e.preventDefault(); e.shiftKey ? redo() : undo(); break;
          case "y": e.preventDefault(); redo(); break;
          case "=":
          case "+": e.preventDefault(); zoomIn(); break;
          case "-": e.preventDefault(); zoomOut(); break;
          case "0": e.preventDefault(); resetView(); break;
        }
        return;
      }

      // Single-key tool shortcuts
      if (TOOL_SHORTCUTS[key]) {
        setActiveTool(TOOL_SHORTCUTS[key]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setActiveTool, zoomIn, zoomOut, resetView, undo, redo, openImage]);
}
