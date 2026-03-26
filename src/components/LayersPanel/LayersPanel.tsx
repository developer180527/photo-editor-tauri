// ============================================================
//  components/LayersPanel/LayersPanel.tsx
//  Displays all layers. Click to select, eye to toggle visibility,
//  lock icon to lock. Drag-to-reorder is stubbed for v2.
// ============================================================

import React from "react";
import { useLayersStore } from "@/stores/useLayersStore";
import { Layer } from "@/types";

export function LayersPanel() {
  const layers = useLayersStore((s) => s.layers);
  const selectedLayerId = useLayersStore((s) => s.selectedLayerId);
  const selectLayer = useLayersStore((s) => s.selectLayer);
  const toggleVisibility = useLayersStore((s) => s.toggleVisibility);
  const toggleLock = useLayersStore((s) => s.toggleLock);
  const removeLayer = useLayersStore((s) => s.removeLayer);

  // Layers displayed top-to-bottom = last added on top (like Photoshop)
  const displayLayers = [...layers].reverse();

  return (
    <div className="panel layers-panel">
      <div className="panel__header">
        <span className="panel__title">Layers</span>
        <span className="panel__count">{layers.length}</span>
      </div>

      <div className="panel__body layers-list">
        {layers.length === 0 && (
          <div className="panel__empty">No layers yet</div>
        )}

        {displayLayers.map((layer) => (
          <LayerRow
            key={layer.id}
            layer={layer}
            isSelected={layer.id === selectedLayerId}
            onSelect={() => selectLayer(layer.id)}
            onToggleVisibility={() => toggleVisibility(layer.id)}
            onToggleLock={() => toggleLock(layer.id)}
            onDelete={() => removeLayer(layer.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface LayerRowProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
}

function LayerRow({ layer, isSelected, onSelect, onToggleVisibility, onToggleLock, onDelete }: LayerRowProps) {
  return (
    <div
      className={`layer-row ${isSelected ? "layer-row--selected" : ""} ${!layer.visible ? "layer-row--hidden" : ""}`}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <LayerThumbnail layer={layer} />

      {/* Name */}
      <span className="layer-name" title={layer.name}>
        {layer.name}
      </span>

      {/* Actions */}
      <div className="layer-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className={`layer-action-btn ${!layer.visible ? "inactive" : ""}`}
          onClick={onToggleVisibility}
          title={layer.visible ? "Hide layer" : "Show layer"}
          aria-label={layer.visible ? "Hide" : "Show"}
        >
          {layer.visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>

        <button
          className={`layer-action-btn ${layer.locked ? "active" : ""}`}
          onClick={onToggleLock}
          title={layer.locked ? "Unlock layer" : "Lock layer"}
          aria-label={layer.locked ? "Unlock" : "Lock"}
        >
          {layer.locked ? <LockIcon /> : <UnlockIcon />}
        </button>

        <button
          className="layer-action-btn layer-action-btn--danger"
          onClick={onDelete}
          title="Delete layer"
          aria-label="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function LayerThumbnail({ layer }: { layer: Layer }) {
  if (layer.type === "image") {
    return (
      <div className="layer-thumb">
        <img src={(layer as import("@/types").ImageLayer).src} alt="" draggable={false} />
      </div>
    );
  }
  return (
    <div className="layer-thumb layer-thumb--generic">
      <span>{layer.type[0].toUpperCase()}</span>
    </div>
  );
}

// ── Inline SVG icons (keep components self-contained) ──────────

const EyeIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
    <ellipse cx="8" cy="8" rx="6" ry="4" />
    <circle cx="8" cy="8" r="1.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
    <path d="M2 2l12 12M6.5 6.5A2 2 0 0110 10" strokeLinecap="round" />
    <path d="M4 4.5C2.8 5.5 2 7 2 8c1 2.5 3.5 4 6 4 1 0 1.9-.2 2.7-.6" strokeLinecap="round" />
    <path d="M12.5 11C13.5 10 14 9 14 8c-1-2.5-3.5-4-6-4-.7 0-1.3.1-1.9.3" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
    <rect x="3" y="8" width="10" height="7" rx="1.5" />
    <path d="M5 8V6a3 3 0 016 0v2" strokeLinecap="round" />
  </svg>
);

const UnlockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
    <rect x="3" y="8" width="10" height="7" rx="1.5" />
    <path d="M5 8V6a3 3 0 016 0" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
    <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
