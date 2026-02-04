// lib/tree/canvas/CanvasFlow.tsx
"use client";

import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Viewport,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  useActiveCanvas,
  useSetCanvasNodes,
  useSetCanvasEdges,
  useSetCanvasViewport,
} from "./canvas.selectors";

export default function CanvasFlow() {
  const active = useActiveCanvas();
  const setNodes = useSetCanvasNodes();
  const setEdges = useSetCanvasEdges();
  const setViewport = useSetCanvasViewport();

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={active.nodes}
        edges={active.edges}
        defaultViewport={active.viewport}
        onNodesChange={(changes: NodeChange[]) =>
          setNodes(applyNodeChanges(changes, active.nodes))
        }
        onEdgesChange={(changes: EdgeChange[]) =>
          setEdges(applyEdgeChanges(changes, active.edges))
        }
        onMoveEnd={(_, vp: Viewport) => setViewport(vp)}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
