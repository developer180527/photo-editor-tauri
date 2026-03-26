// ============================================================
//  stores/useToolStore.ts
//  Tracks the active tool. Knows nothing about layers or canvas.
// ============================================================

import { create } from "zustand";
import { ToolId, ToolDefinition } from "@/types";

// Tool registry — single place to add / remove tools
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  { id: "select", label: "Select",  shortcut: "V", icon: "cursor"   },
  { id: "hand",   label: "Hand",    shortcut: "H", icon: "hand"     },
  { id: "zoom",   label: "Zoom",    shortcut: "Z", icon: "zoom"     },
  { id: "crop",   label: "Crop",    shortcut: "C", icon: "crop"     },
];

interface ToolState {
  activeTool: ToolId;
  setActiveTool: (id: ToolId) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: "select",
  setActiveTool: (id) => set({ activeTool: id }),
}));
