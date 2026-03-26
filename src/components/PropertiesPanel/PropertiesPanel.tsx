// ============================================================
//  components/PropertiesPanel/PropertiesPanel.tsx
//  V1: Read-only display of selected layer properties.
//  V2: Will have editable inputs wired to updateLayer.
// ============================================================

import React from "react";
import { useLayersStore } from "@/stores/useLayersStore";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { formatZoom } from "@/utils/canvas";

export function PropertiesPanel() {
  const getSelectedLayer = useLayersStore((s) => s.getSelectedLayer);
  const zoom = useCanvasStore((s) => s.zoom);
  const selected = getSelectedLayer();

  return (
    <div className="panel properties-panel">
      <div className="panel__header">
        <span className="panel__title">Properties</span>
      </div>

      <div className="panel__body">
        {!selected ? (
          <div className="panel__empty">No layer selected</div>
        ) : (
          <div className="properties-grid">
            <PropRow label="Name"     value={selected.name} />
            <PropRow label="Type"     value={selected.type} />
            <PropRow label="X"        value={`${Math.round(selected.x)} px`} />
            <PropRow label="Y"        value={`${Math.round(selected.y)} px`} />
            <PropRow label="Opacity"  value={`${Math.round(selected.opacity * 100)}%`} />
            <PropRow label="Rotation" value={`${Math.round(selected.rotation)}°`} />

            {selected.type === "image" && (
              <>
                <div className="properties-divider" />
                <PropRow label="Width"    value={`${selected.naturalWidth} px`} />
                <PropRow label="Height"   value={`${selected.naturalHeight} px`} />
              </>
            )}

            <div className="properties-divider" />
            <PropRow label="Canvas Zoom" value={formatZoom(zoom)} />
          </div>
        )}
      </div>
    </div>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="prop-label">{label}</span>
      <span className="prop-value">{value}</span>
    </>
  );
}
