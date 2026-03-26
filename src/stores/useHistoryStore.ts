// ============================================================
//  stores/useHistoryStore.ts
//  Undo / redo stack. Works alongside layer store mutations.
//  Rule: record BEFORE the mutation so undo can revert to prev.
// ============================================================

import { create } from "zustand";
import { HistoryEntry, HistoryAction } from "@/types";
import { generateId } from "@/utils/id";
import { useLayersStore } from "./useLayersStore";

const MAX_HISTORY = 50;

interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];

  record: (description: string, action: HistoryAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],

  record: (description, action) =>
    set((state) => ({
      past: [
        ...state.past.slice(-(MAX_HISTORY - 1)),
        { id: generateId(), timestamp: Date.now(), description, action },
      ],
      future: [], // new action clears redo stack
    })),

  undo: () => {
    const { past } = get();
    if (past.length === 0) return;

    const entry = past[past.length - 1];
    const layerStore = useLayersStore.getState();

    // Reverse the action
    switch (entry.action.type) {
      case "ADD_LAYER":
        layerStore.removeLayer(entry.action.layer.id);
        break;
      case "REMOVE_LAYER":
        // We'd need to restore the layer — for full undo you store full layer snapshots
        // Simplified: no-op for now, proper impl stores full snapshots
        break;
      case "UPDATE_LAYER":
        layerStore.updateLayer(entry.action.prev.id, entry.action.prev);
        break;
      case "REORDER_LAYERS":
        layerStore.reorderLayers(entry.action.prev);
        break;
    }

    set((state) => ({
      past: state.past.slice(0, -1),
      future: [entry, ...state.future],
    }));
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return;

    const entry = future[0];
    const layerStore = useLayersStore.getState();

    // Re-apply the action
    switch (entry.action.type) {
      case "ADD_LAYER":
        // Re-add — simplified; a full impl would re-insert at same position
        break;
      case "REMOVE_LAYER":
        layerStore.removeLayer(entry.action.layerId);
        break;
      case "UPDATE_LAYER":
        layerStore.updateLayer(entry.action.next.id, entry.action.next);
        break;
      case "REORDER_LAYERS":
        layerStore.reorderLayers(entry.action.next);
        break;
    }

    set((state) => ({
      past: [...state.past, entry],
      future: state.future.slice(1),
    }));
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
