// ============================================================
//  components/Canvas/Canvas.tsx
//  The main editing canvas. Uses react-konva for rendering.
//  Handles: wheel-zoom, drag-to-pan (hand tool), layer rendering.
// ============================================================

import React, { useRef, useEffect, useCallback } from "react";
import { Stage, Layer } from "react-konva";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useLayersStore } from "@/stores/useLayersStore";
import { useToolStore } from "@/stores/useToolStore";
import { deltaToZoom } from "@/utils/canvas";
import { ImageLayerNode } from "./ImageLayerNode";
import { CanvasEmpty } from "./CanvasEmpty";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const { zoom, offsetX, offsetY, stageWidth, stageHeight, setStageSize, zoomToPoint, pan } =
    useCanvasStore();
  const layers = useLayersStore((s) => s.layers);
  const selectedLayerId = useLayersStore((s) => s.selectedLayerId);
  const selectLayer = useLayersStore((s) => s.selectLayer);
  const updateLayer = useLayersStore((s) => s.updateLayer);
  const activeTool = useToolStore((s) => s.activeTool);

  // Keep stage dimensions in sync with container
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setStageSize(width, height);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [setStageSize]);

  // Wheel → zoom toward cursor
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const rect = containerRef.current!.getBoundingClientRect();
      const pointX = e.clientX - rect.left;
      const pointY = e.clientY - rect.top;
      const newZoom = deltaToZoom(zoom, e.deltaY);
      zoomToPoint(newZoom, pointX, pointY);
    },
    [zoom, zoomToPoint]
  );

  // Pan: middle-mouse or hand tool
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const isMiddle = e.button === 1;
      const isHandTool = activeTool === "hand";
      if (!isMiddle && !isHandTool) return;
      e.preventDefault();
      isPanning.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    },
    [activeTool]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      pan(dx, dy);
    },
    [pan]
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Cursor style based on tool
  const cursorStyle = () => {
    if (isPanning.current) return "grabbing";
    if (activeTool === "hand") return "grab";
    if (activeTool === "zoom") return "zoom-in";
    return "default";
  };

  const isEmpty = layers.length === 0;

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{ cursor: cursorStyle() }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {isEmpty && <CanvasEmpty />}

      <Stage
        width={stageWidth}
        height={stageHeight}
        // Apply viewport transform at stage level
        scaleX={zoom}
        scaleY={zoom}
        x={offsetX}
        y={offsetY}
        onClick={(e) => {
          // Click on empty stage area — deselect
          if (e.target === e.target.getStage()) selectLayer(null);
        }}
      >
        <Layer>
          {layers
            .filter((l) => l.visible)
            .map((layer) => {
              if (layer.type === "image") {
                return (
                  <ImageLayerNode
                    key={layer.id}
                    layer={layer}
                    isSelected={layer.id === selectedLayerId}
                    activeTool={activeTool}
                    onSelect={() => selectLayer(layer.id)}
                    onChange={(patch) => updateLayer(layer.id, patch)}
                  />
                );
              }
              // Future layer types go here
              return null;
            })}
        </Layer>
      </Stage>
    </div>
  );
}
