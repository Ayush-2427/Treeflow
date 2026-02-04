import type { CanvasState } from "./canvas.types";

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export function makeCanvas(id: string, name: string): CanvasState {
  return {
    id,
    name,
    nodes: [],
    edges: [],
    viewport: defaultViewport,
    updatedAt: new Date().toISOString(),
  };
}

// Stable defaults (no random IDs)
export function makeDefaultCanvases(): CanvasState[] {
  return [
    makeCanvas("body", "Body"),
    makeCanvas("education", "Education"),
    makeCanvas("career", "Career"),
  ];
}

// Use random ID only for user-created canvases
export function makeUserCanvas(name: string): CanvasState {
  const id = crypto.randomUUID();
  return makeCanvas(id, name);
}
