// ============================================================
//  stores/useCanvasStore.ts
//  Manages the viewport: zoom level and pan offset.
//  Nothing here knows about layers or tools.
// ============================================================

import { create } from "zustand";
import { CanvasViewport } from "@/types";

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 20;
const ZOOM_STEP = 0.1;

interface CanvasState extends CanvasViewport {
  // Canvas element dimensions (updated on resize)
  stageWidth: number;
  stageHeight: number;

  // Mutations
  setStageSize: (width: number, height: number) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  /** Zoom toward a specific canvas point (for wheel / click-zoom) */
  zoomToPoint: (newZoom: number, pointX: number, pointY: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  pan: (dx: number, dy: number) => void;
  resetView: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  stageWidth: 800,
  stageHeight: 600,

  setStageSize: (width, height) => set({ stageWidth: width, stageHeight: height }),

  setZoom: (zoom) =>
    set({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) }),

  zoomIn: () => {
    const { zoom } = get();
    const next = Math.min(MAX_ZOOM, parseFloat((zoom + ZOOM_STEP).toFixed(2)));
    set({ zoom: next });
  },

  zoomOut: () => {
    const { zoom } = get();
    const next = Math.max(MIN_ZOOM, parseFloat((zoom - ZOOM_STEP).toFixed(2)));
    set({ zoom: next });
  },

  resetZoom: () => set({ zoom: 1 }),

  zoomToPoint: (newZoom, pointX, pointY) => {
    const { zoom, offsetX, offsetY } = get();
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
    // Adjust offset so the point under the cursor stays fixed
    const scaleRatio = clampedZoom / zoom;
    const newOffsetX = pointX - scaleRatio * (pointX - offsetX);
    const newOffsetY = pointY - scaleRatio * (pointY - offsetY);
    set({ zoom: clampedZoom, offsetX: newOffsetX, offsetY: newOffsetY });
  },

  setOffset: (offsetX, offsetY) => set({ offsetX, offsetY }),

  pan: (dx, dy) =>
    set((state) => ({
      offsetX: state.offsetX + dx,
      offsetY: state.offsetY + dy,
    })),

  resetView: () => set({ zoom: 1, offsetX: 0, offsetY: 0 }),
}));
