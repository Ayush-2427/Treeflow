import { useCanvasStore } from "./canvas.store";

export const useCanvases = () => useCanvasStore((s) => s.canvases);
export const useActiveCanvasId = () => useCanvasStore((s) => s.activeCanvasId);
export const useActiveCanvas = () => useCanvasStore((s) => s.getActive());

export const useSetActiveCanvas = () => useCanvasStore((s) => s.setActiveCanvas);
export const useAddCanvas = () => useCanvasStore((s) => s.addCanvas);
export const useRenameCanvas = () => useCanvasStore((s) => s.renameCanvas);
export const useDeleteCanvas = () => useCanvasStore((s) => s.deleteCanvas);

export const useSetCanvasNodes = () => useCanvasStore((s) => s.setNodes);
export const useSetCanvasEdges = () => useCanvasStore((s) => s.setEdges);
export const useSetCanvasViewport = () => useCanvasStore((s) => s.setViewport);
