// ============================================================
//  components/Layout/StatusBar.tsx
// ============================================================

import React from "react";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useLayersStore } from "@/stores/useLayersStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { formatZoom } from "@/utils/canvas";

export function StatusBar() {
  const { zoom, zoomIn, zoomOut, resetZoom, resetView } = useCanvasStore();
  const layerCount = useLayersStore((s) => s.layers.length);
  const { canUndo, canRedo } = useHistoryStore();

  return (
    <div className="statusbar">
      {/* Left: layer count */}
      <div className="statusbar__left">
        <span className="statusbar__info">
          {layerCount} layer{layerCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Center: zoom controls */}
      <div className="statusbar__center">
        <button
          className="status-zoom-btn"
          onClick={zoomOut}
          title="Zoom Out (⌘-)"
          aria-label="Zoom out"
        >−</button>

        <button
          className="status-zoom-label"
          onClick={resetZoom}
          title="Reset zoom to 100%"
        >
          {formatZoom(zoom)}
        </button>

        <button
          className="status-zoom-btn"
          onClick={zoomIn}
          title="Zoom In (⌘+)"
          aria-label="Zoom in"
        >+</button>

        <button
          className="status-fit-btn"
          onClick={resetView}
          title="Fit to window (⌘0)"
        >
          Fit
        </button>
      </div>

      {/* Right: history state */}
      <div className="statusbar__right">
        {canUndo() && <span className="statusbar__hint">⌘Z undo</span>}
        {canRedo() && <span className="statusbar__hint">⌘⇧Z redo</span>}
      </div>
    </div>
  );
}
