"use client";

import { create } from "zustand";
import type { Node, Edge, Viewport } from "reactflow";
import type { CanvasStoreState, CanvasId } from "./canvas.types";
import { makeDefaultCanvases, makeUserCanvas } from "./canvas.factory";
import { localStorageAdapter } from "../persistance/localStorageAdapter"; // adjust path if needed

function nowISO() {
  return new Date().toISOString();
}

export const useCanvasStore = create<CanvasStoreState>((set, get) => {
  const initial = makeDefaultCanvases();
  const firstId = initial[0]?.id ?? "body";

  return {
    canvases: initial,
    activeCanvasId: firstId,

    setActiveCanvas: (id: CanvasId) => set({ activeCanvasId: id }),

    addCanvas: (name: string) =>
      set((state) => {
        const c = makeUserCanvas(name);
        return {
          canvases: [...state.canvases, c],
          activeCanvasId: c.id,
        };
      }),

    renameCanvas: (id, name) =>
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === id ? { ...c, name, updatedAt: nowISO() } : c
        ),
      })),

    // ✅ NEW: delete a canvas + clear persisted tree state
    deleteCanvas: async (id: CanvasId) => {
      const state = get();

      // Never delete the last canvas
      if (state.canvases.length <= 1) return;

      const exists = state.canvases.some((c) => c.id === id);
      if (!exists) return;

      // Clear persisted reactflow state for this canvas
      // Tree id format used everywhere else: "space:<canvasId>"
      try {
        await localStorageAdapter.clear(`space:${id}`);
      } catch (e) {
        console.error("Failed to clear tree state for canvas:", id, e);
        // still proceed to remove the canvas to avoid UI dead-ends
      }

      // Remove from list + adjust active canvas if needed
      set((s) => {
        const remaining = s.canvases.filter((c) => c.id !== id);

        const nextActive =
          s.activeCanvasId === id ? remaining[0]!.id : s.activeCanvasId;

        return {
          canvases: remaining,
          activeCanvasId: nextActive,
        };
      });
    },

    setNodes: (nodes: Node[]) =>
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === state.activeCanvasId ? { ...c, nodes, updatedAt: nowISO() } : c
        ),
      })),

    setEdges: (edges: Edge[]) =>
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === state.activeCanvasId ? { ...c, edges, updatedAt: nowISO() } : c
        ),
      })),

    setViewport: (viewport: Viewport) =>
      set((state) => ({
        canvases: state.canvases.map((c) =>
          c.id === state.activeCanvasId
            ? { ...c, viewport, updatedAt: nowISO() }
            : c
        ),
      })),

    getActive: () => {
      const { canvases, activeCanvasId } = get();
      return canvases.find((c) => c.id === activeCanvasId) ?? canvases[0];
    },
  };
});
export const useDeleteCanvasAction = () =>
  useCanvasStore((s) => s.deleteCanvas);

