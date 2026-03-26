// ============================================================
//  components/Canvas/CanvasEmpty.tsx
// ============================================================

import React from "react";
import { useFileOps } from "@/hooks/useFileOps";

export function CanvasEmpty() {
  const { openImage } = useFileOps();

  return (
    <div className="canvas-empty" onClick={openImage}>
      <div className="canvas-empty__inner">
        <svg className="canvas-empty__icon" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 34l10-10 7 7 6-6 13 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="canvas-empty__label">Click or drag an image to open</p>
        <p className="canvas-empty__sub">PNG, JPG, WEBP, GIF, SVG supported</p>
        <kbd className="canvas-empty__kbd">⌘ O</kbd>
      </div>
    </div>
  );
}
