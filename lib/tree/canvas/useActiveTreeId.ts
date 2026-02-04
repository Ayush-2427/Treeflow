"use client";

import { useActiveCanvasId } from "./canvas.selectors";

export function useActiveTreeId() {
  const canvasId = useActiveCanvasId();
  return `space:${canvasId}`;
}
