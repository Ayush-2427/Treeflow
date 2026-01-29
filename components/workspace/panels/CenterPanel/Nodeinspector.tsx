"use client";

import { useState, useRef, useEffect } from "react";
import { useTreeStore } from "../../../../lib/tree/store";
import type { Node as RFNode } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";

interface NodeInspectorProps {
  node: RFNode<TreeNodeData>;
  onClose: () => void;
  position: { x: number; y: number };
}

const colorOptions = [
  { name: "slate", color: "bg-slate-500" },
  { name: "blue", color: "bg-blue-500" },
  { name: "green", color: "bg-green-500" },
  { name: "purple", color: "bg-purple-500" },
  { name: "orange", color: "bg-orange-500" },
  { name: "red", color: "bg-red-500" },
  { name: "pink", color: "bg-pink-500" },
  { name: "yellow", color: "bg-yellow-500" },
];

export default function NodeInspector({
  node,
  onClose,
  position,
}: NodeInspectorProps) {
  const [childCount, setChildCount] = useState(3);
  const [showDescription, setShowDescription] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updateNodeData = useTreeStore((s) => s.updateNodeData);
  const deleteNode = useTreeStore((s) => s.deleteNode);
  const duplicateSubtree = useTreeStore((s) => s.duplicateSubtree);
  const addMultipleChildren = useTreeStore((s) => s.addMultipleChildren);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const el = popoverRef.current;
      if (!el) return;

      const target = e.target as globalThis.Node | null;
      if (target && !el.contains(target)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="absolute z-[100] w-[280px] bg-white rounded-lg shadow-2xl border border-slate-200 p-3"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-1.5 mb-3">
        <button
          onClick={() => {
            deleteNode(node.id);
            onClose();
          }}
          disabled={node.id === "root"}
          className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50 transition-all"
        >
          🗑️ Delete
        </button>
        <button
          onClick={() => {
            duplicateSubtree(node.id);
            onClose();
          }}
          className="flex-1 px-2 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        >
          📋 Duplicate
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-[10px] font-medium text-slate-600 mb-1">
          Title
        </label>
        <input
          value={node.data.title ?? ""}
          onChange={(e) => updateNodeData(node.id, { title: e.target.value })}
          className="w-full px-2 py-1.5 text-xs rounded-md border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          placeholder="Node title..."
        />
      </div>

      {(node.data.nodeType === "process" || node.data.nodeType === "note") && (
        <div className="mb-3">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDescription ? "− Hide" : "+ Show"} Description
          </button>
          {showDescription && (
            <textarea
              value={node.data.description ?? ""}
              onChange={(e) =>
                updateNodeData(node.id, { description: e.target.value })
              }
              className="mt-1 w-full px-2 py-1.5 text-xs rounded-md border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none"
              rows={2}
              placeholder="Description..."
            />
          )}
        </div>
      )}

      <div className="mb-3">
        <label className="block text-[10px] font-medium text-slate-600 mb-1.5">
          Color
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.name}
              onClick={() => updateNodeData(node.id, { color: colorOption.name })}
              className={`w-6 h-6 rounded-md ${colorOption.color} transition-all ${
                (node.data.color || "slate") === colorOption.name
                  ? "ring-2 ring-offset-1 ring-slate-900"
                  : "opacity-60 hover:opacity-100"
              }`}
              title={colorOption.name}
              aria-label={colorOption.name}
              type="button"
            />
          ))}
        </div>
      </div>

      {node.data.nodeType === "process" && (
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-[10px] font-medium text-slate-600 mb-1.5">
            Add Children
          </label>
          <div className="flex gap-1.5">
            <input
              type="number"
              min="1"
              max="10"
              value={childCount}
              onChange={(e) =>
                setChildCount(
                  Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className="w-14 px-2 py-1 text-xs rounded-md border border-slate-200 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
            <button
              onClick={() => {
                addMultipleChildren(node.id, childCount);
                onClose();
              }}
              className="flex-1 px-2 py-1 text-xs font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-all"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
