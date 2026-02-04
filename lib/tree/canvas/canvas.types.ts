import type { Node, Edge, Viewport } from "reactflow";

export type CanvasId = string;

export type CanvasMeta = {
  id: CanvasId;
  name: string;
};

export type CanvasState = CanvasMeta & {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  updatedAt: string;
};

export type CanvasStoreState = {
  canvases: CanvasState[];
  activeCanvasId: CanvasId;

  setActiveCanvas: (id: CanvasId) => void;
  addCanvas: (name: string) => void;
  renameCanvas: (id: CanvasId, name: string) => void;

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;

  getActive: () => CanvasState;
  deleteCanvas: (id: CanvasId) => Promise<void>;

};
