"use client";

import { useMemo, useState } from "react";
import { useTreeStore } from "../../../../lib/tree/store";

const nodeTypeLabels = {
  process: { label: "Process", icon: "▭", color: "text-slate-600" },
  decision: { label: "Decision", icon: "◆", color: "text-blue-600" },
  start: { label: "Start", icon: "🚀", color: "text-green-600" },
  end: { label: "End", icon: "🏁", color: "text-red-600" },
  note: { label: "Note", icon: "📝", color: "text-yellow-600" },
};

export default function LeftPanel() {
  const [childCount, setChildCount] = useState(3);

  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const nodes = useTreeStore((s) => s.nodes);

  const updateNodeData = useTreeStore((s) => s.updateNodeData);
  const deleteNode = useTreeStore((s) => s.deleteNode);
  const addMultipleChildren = useTreeStore((s) => s.addMultipleChildren);
  const duplicateSubtree = useTreeStore((s) => s.duplicateSubtree);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [nodes, selectedNodeId]);

  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-slate-100 p-6 mb-4">
          <svg
            className="h-12 w-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No Node Selected</h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Click on any node in the canvas to view and edit its properties
        </p>
        <div className="mt-6 space-y-2 text-xs text-slate-500">
          <p>💡 Right-click canvas to add nodes</p>
          <p>🔗 Drag handles to connect nodes</p>
          <p>✏️ Double-click edge labels to edit</p>
        </div>
      </div>
    );
  }

  const nodeTypeInfo = nodeTypeLabels[selectedNode.data.nodeType] || nodeTypeLabels.process;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Node Inspector</h2>
        <div className="mt-1 flex items-center gap-2">
          <span className={`text-lg ${nodeTypeInfo.color}`}>{nodeTypeInfo.icon}</span>
          <span className="text-xs text-slate-500">{nodeTypeInfo.label} Node</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => deleteNode(selectedNode.id)}
            disabled={selectedNode.id === "root"}
            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            🗑️ Delete
          </button>
          <button
            onClick={() => duplicateSubtree(selectedNode.id)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            📋 Duplicate
          </button>
        </div>

        {selectedNode.data.nodeType === "process" && (
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Add Children (1-10)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={childCount}
                onChange={(e) => setChildCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
              <button
                onClick={() => addMultipleChildren(selectedNode.id, childCount)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Node Details */}
      <div className="flex-1 space-y-4 overflow-auto">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Title
          </label>
          <input
            value={selectedNode.data.title ?? ""}
            onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
            placeholder="Enter node title..."
          />
        </div>

        {/* Description */}
        {(selectedNode.data.nodeType === "process" || selectedNode.data.nodeType === "note") && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={selectedNode.data.description ?? ""}
              onChange={(e) =>
                updateNodeData(selectedNode.id, { description: e.target.value })
              }
              className="min-h-[80px] w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
              placeholder="What does this step involve..."
            />
          </div>
        )}

        {/* Notes & Resources */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Notes & Resources
          </label>
          <textarea
            value={selectedNode.data.notes ?? ""}
            onChange={(e) =>
              updateNodeData(selectedNode.id, { notes: e.target.value })
            }
            className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
            placeholder="Add notes, links, resources...&#10;Example:&#10;- https://docs.example.com&#10;- Contact: john@example.com&#10;- Key requirement: XYZ"
          />
        </div>

        {/* Node Color - Compact Radio Chips */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Color Theme
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { name: "slate", color: "bg-slate-500" },
              { name: "blue", color: "bg-blue-500" },
              { name: "green", color: "bg-green-500" },
              { name: "purple", color: "bg-purple-500" },
              { name: "orange", color: "bg-orange-500" },
              { name: "red", color: "bg-red-500" },
              { name: "pink", color: "bg-pink-500" },
              { name: "yellow", color: "bg-yellow-500" },
            ].map((colorOption) => (
              <button
                key={colorOption.name}
                onClick={() => updateNodeData(selectedNode.id, { color: colorOption.name })}
                className={`w-7 h-7 rounded-md ${colorOption.color} transition-all ${
                  (selectedNode.data.color || "slate") === colorOption.name
                    ? "ring-2 ring-offset-2 ring-slate-900"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
                title={colorOption.name}
                aria-label={`Select ${colorOption.name} color`}
                role="radio"
                aria-checked={(selectedNode.data.color || "slate") === colorOption.name}
              />
            ))}
          </div>
        </div>

        {/* Completed Toggle (for process nodes) */}
        {selectedNode.data.nodeType === "process" && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Mark as completed</p>
                <p className="text-xs text-slate-500">Track progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selectedNode.data.completed}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, { completed: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        )}

        {/* Node ID */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-medium text-slate-600 mb-1">Node ID</p>
          <p className="text-[11px] font-mono text-slate-400 break-all">{selectedNode.id}</p>
        </div>
      </div>
    </div>
  );
}