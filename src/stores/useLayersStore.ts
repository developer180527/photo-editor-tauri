// ============================================================
//  stores/useLayersStore.ts
//  Manages the layer stack. All mutations go through this store.
// ============================================================

import { create } from "zustand";
import { Layer, ImageLayer } from "@/types";
import { generateId } from "@/utils/id";

interface LayersState {
  layers: Layer[];
  selectedLayerId: string | null;

  // Mutations
  addImageLayer: (src: string, naturalWidth: number, naturalHeight: number, name: string) => string;
  removeLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  updateLayer: (id: string, patch: Partial<Omit<Layer, "id" | "type">>) => void;
  reorderLayers: (orderedIds: string[]) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;

  // Derived helpers (not stored — compute from layers)
  getSelectedLayer: () => Layer | null;
}

export const useLayersStore = create<LayersState>((set, get) => ({
  layers: [],
  selectedLayerId: null,

  addImageLayer: (src, naturalWidth, naturalHeight, name) => {
    const id = generateId();
    const newLayer: ImageLayer = {
      id,
      name,
      type: "image",
      visible: true,
      locked: false,
      opacity: 1,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      src,
      naturalWidth,
      naturalHeight,
    };
    set((state) => ({
      layers: [...state.layers, newLayer],
      selectedLayerId: id,
    }));
    return id;
  },

  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),

  selectLayer: (id) => set({ selectedLayerId: id }),

  updateLayer: (id, patch) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? ({ ...l, ...patch } as Layer) : l
      ),
    })),

  reorderLayers: (orderedIds) =>
    set((state) => {
      const map = new Map(state.layers.map((l) => [l.id, l]));
      return { layers: orderedIds.map((id) => map.get(id)!).filter(Boolean) };
    }),

  toggleVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l
      ),
    })),

  toggleLock: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, locked: !l.locked } : l
      ),
    })),

  getSelectedLayer: () => {
    const { layers, selectedLayerId } = get();
    return layers.find((l) => l.id === selectedLayerId) ?? null;
  },
}));
