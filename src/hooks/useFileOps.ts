// ============================================================
//  hooks/useFileOps.ts
//  Orchestrates: file picker → read → create layer → history.
//  Keeps components free of this coordination logic.
// ============================================================

import { useCallback } from "react";
import { pickAndReadImage } from "@/lib/tauri/fileOps";
import { useLayersStore } from "@/stores/useLayersStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { fitScale } from "@/utils/canvas";

export function useFileOps() {
  const addImageLayer = useLayersStore((s) => s.addImageLayer);
  const record = useHistoryStore((s) => s.record);
  const { stageWidth, stageHeight, setZoom, setOffset } = useCanvasStore();

  const openImage = useCallback(async () => {
    const result = await pickAndReadImage();
    if (!result) return; // user cancelled

    // Create a temporary Image element to read natural dimensions
    const img = new Image();
    img.src = result.dataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // gracefully continue even on error
    });

    const naturalWidth = img.naturalWidth || 800;
    const naturalHeight = img.naturalHeight || 600;

    // Auto-fit the viewport to this image
    const scale = fitScale(naturalWidth, naturalHeight, stageWidth, stageHeight);
    setZoom(scale);
    setOffset(0, 0);

    const id = addImageLayer(result.dataUrl, naturalWidth, naturalHeight, result.name);

    // Record for undo (after we have the id)
    const layers = useLayersStore.getState().layers;
    const layer = layers.find((l) => l.id === id)!;
    record(`Open "${result.name}"`, { type: "ADD_LAYER", layer });
  }, [addImageLayer, record, stageWidth, stageHeight, setZoom, setOffset]);

  return { openImage };
}
