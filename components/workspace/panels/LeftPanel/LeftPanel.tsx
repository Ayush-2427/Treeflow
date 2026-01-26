"use client";

import { useTreeStore } from "../../../../lib/tree/store";

export default function LeftPanel() {
  const nodes = useTreeStore((s) => s.nodes);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const selectNode = useTreeStore((s) => s.selectNode);
  const updateNodeData = useTreeStore((s) => s.updateNodeData);
  const addChildNode = useTreeStore((s) => s.addChildNode);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Node Manager</h2>
        <p className="mt-1 text-xs text-slate-500">
          Click a node to inspect or update progress.
        </p>
      </div>

      {selectedNodeId && (
        <button
          onClick={() => addChildNode(selectedNodeId)}
          className="mb-3 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          Add child step
        </button>
      )}

      <div className="flex-1 space-y-2 overflow-auto">
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => selectNode(node.id)}
            className={`cursor-pointer rounded-xl border p-3 ${
              selectedNodeId === node.id
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{node.data.title}</p>

              <input
                type="checkbox"
                checked={!!node.data.completed}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateNodeData(node.id, { completed: e.target.checked })
                }
              />
            </div>

            {node.data.description && (
              <p className="mt-1 text-xs text-slate-500">
                {node.data.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
