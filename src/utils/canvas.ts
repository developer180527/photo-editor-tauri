// ============================================================
//  utils/canvas.ts  –  Pure canvas math helpers.
//  No side-effects, no store imports. Easy to test.
// ============================================================

/**
 * Calculates the initial scale to fit an image inside the viewport
 * with a given padding percentage.
 */
export function fitScale(
  imageW: number,
  imageH: number,
  viewportW: number,
  viewportH: number,
  padding = 0.9
): number {
  const scaleX = (viewportW * padding) / imageW;
  const scaleY = (viewportH * padding) / imageH;
  return Math.min(scaleX, scaleY, 1); // never upscale beyond 100%
}

/**
 * Converts a mouse/wheel delta to a new zoom level,
 * clamped to [min, max].
 */
export function deltaToZoom(
  currentZoom: number,
  delta: number,
  sensitivity = 0.001,
  min = 0.05,
  max = 20
): number {
  const next = currentZoom * Math.exp(-delta * sensitivity);
  return Math.min(max, Math.max(min, next));
}

/**
 * Format a zoom level as a human-readable percentage string.
 */
export function formatZoom(zoom: number): string {
  return `${Math.round(zoom * 100)}%`;
}
