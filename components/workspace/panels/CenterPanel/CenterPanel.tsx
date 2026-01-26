"use client";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge
} from "reactflow";
import { useTreeStore } from "../../../../lib/tree/store";

export default function CenterPanel() {
  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const selectNode = useTreeStore((s) => s.selectNode);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Tree Canvas</h2>
          <p className="mt-1 text-xs text-slate-500">
            This is your visual source of truth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium">
            Generate roadmap
          </button>
          <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white">
            Edit roadmap
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-slate-200 bg-white">
        <ReactFlow
          nodes={nodes as Node[]}
          edges={edges as Edge[]}
          onNodeClick={(_, node) => selectNode(node.id)}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs text-slate-600">
          Rule reminder: Generate and Edit are separate actions. Big AI changes require preview and confirmation.
        </p>
      </div>
    </div>
  );
}
