// ============================================================
//  types/index.ts  –  Single source of truth for all types
//  Add new types here. Never scatter inline types across files.
// ============================================================

// ------------------------------------------------------------------
// Layer
// ------------------------------------------------------------------

export type LayerType = "image" | "text" | "shape";

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0–1
  /** Transform: position relative to canvas center */
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number; // degrees
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  /** Object URL created from the loaded file */
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
}

export interface ShapeLayer extends BaseLayer {
  type: "shape";
  shapeKind: "rect" | "ellipse" | "line";
  fill: string;
  stroke: string;
  strokeWidth: number;
  width: number;
  height: number;
}

// Discriminated union – always narrow with layer.type
export type Layer = ImageLayer | TextLayer | ShapeLayer;

// ------------------------------------------------------------------
// Canvas Viewport
// ------------------------------------------------------------------

export interface CanvasViewport {
  zoom: number;       // 0.05 – 20
  offsetX: number;   // pan offset in pixels
  offsetY: number;
}

// ------------------------------------------------------------------
// Tools
// ------------------------------------------------------------------

export type ToolId =
  | "select"   // V – move / select layers
  | "hand"     // H – pan canvas
  | "zoom"     // Z – click-to-zoom
  | "crop";    // C – crop (stub for v1)

export interface ToolDefinition {
  id: ToolId;
  label: string;
  shortcut: string;
  icon: string; // SVG path data or lucide name key
}

// ------------------------------------------------------------------
// UI State
// ------------------------------------------------------------------

export interface PanelState {
  leftWidth: number;    // px – tool strip is fixed, this is reserved
  rightWidth: number;   // px
  propertiesHeight: number; // px – top-right panel
}

// ------------------------------------------------------------------
// History (undo/redo)
// ------------------------------------------------------------------

export type HistoryAction =
  | { type: "ADD_LAYER"; layer: Layer }
  | { type: "REMOVE_LAYER"; layerId: string }
  | { type: "UPDATE_LAYER"; prev: Layer; next: Layer }
  | { type: "REORDER_LAYERS"; prev: string[]; next: string[] };

export interface HistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  action: HistoryAction;
}

// ------------------------------------------------------------------
// File
// ------------------------------------------------------------------

export interface OpenedFile {
  path: string;
  name: string;
}
