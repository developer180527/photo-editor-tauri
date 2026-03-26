// ============================================================
//  components/Canvas/ImageLayerNode.tsx
//  Renders a single ImageLayer on the Konva stage.
//  Handles drag (select tool) and transformer for resize/rotate.
// ============================================================

import React, { useRef, useEffect } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { ImageLayer } from "@/types";
import { ToolId } from "@/types";
import Konva from "konva";

interface Props {
  layer: ImageLayer;
  isSelected: boolean;
  activeTool: ToolId;
  onSelect: () => void;
  onChange: (patch: Partial<ImageLayer>) => void;
}

export function ImageLayerNode({ layer, isSelected, activeTool, onSelect, onChange }: Props) {
  const [image] = useImage(layer.src);
  const nodeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  // Attach transformer to the node when selected
  useEffect(() => {
    if (isSelected && trRef.current && nodeRef.current) {
      trRef.current.nodes([nodeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const canDrag = activeTool === "select" && !layer.locked;

  // Position image centered on its (x, y) coordinate
  const imgW = layer.naturalWidth;
  const imgH = layer.naturalHeight;

  return (
    <>
      <KonvaImage
        ref={nodeRef}
        image={image}
        // Center the image at layer's x/y
        x={layer.x - imgW / 2}
        y={layer.y - imgH / 2}
        width={imgW}
        height={imgH}
        scaleX={layer.scaleX}
        scaleY={layer.scaleY}
        rotation={layer.rotation}
        opacity={layer.opacity}
        draggable={canDrag}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          // Convert back to center-based position
          onChange({
            x: e.target.x() + imgW / 2,
            y: e.target.y() + imgH / 2,
          });
        }}
        onTransformEnd={() => {
          const node = nodeRef.current;
          if (!node) return;
          onChange({
            x: node.x() + imgW / 2,
            y: node.y() + imgH / 2,
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
          // Reset scale on node so it doesn't compound
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && activeTool === "select" && (
        <Transformer
          ref={trRef}
          rotateEnabled
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size guard
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}
