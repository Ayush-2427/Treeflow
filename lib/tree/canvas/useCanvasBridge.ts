"use client";

import { useEffect } from "react";
import { useCanvasStore } from "./canvas.store";
import { useTreeStore } from "../store"; // change this import to your actual tree store path

export function useCanvasBridge() {
  const active = useCanvasStore((s) => s.getActive());
  const setNodes = useCanvasStore((s) => s.setNodes);
  const setEdges = useCanvasStore((s) => s.setEdges);
  const setViewport = useCanvasStore((s) => s.setViewport);

  const treeNodes = useTreeStore((s) => s.nodes);
  const treeEdges = useTreeStore((s) => s.edges);
  const setTreeNodes = useTreeStore((s) => s.setNodes);
  const setTreeEdges = useTreeStore((s) => s.setEdges);

  // When active canvas changes, push canvas data into your existing tree store
  useEffect(() => {
    setTreeNodes(active.nodes);
    setTreeEdges(active.edges);
    // If your tree store also tracks viewport, add it here too
  }, [active.id, setTreeNodes, setTreeEdges]);

  // When tree store changes (user edits graph), save back into active canvas
  useEffect(() => {
    setNodes(treeNodes);
  }, [treeNodes, setNodes]);

  useEffect(() => {
    setEdges(treeEdges);
  }, [treeEdges, setEdges]);

  return {
    activeCanvasId: active.id,
    activeCanvasName: active.name,
    setViewport,
  };
}
