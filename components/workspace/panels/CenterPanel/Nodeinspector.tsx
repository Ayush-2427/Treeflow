// NodeInspector.tsx (popup)
"use client";

import { useEffect, useRef, useState } from "react";
import { useTreeStore } from "../../../../lib/tree/store";
import type { Node as RFNode } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";

interface NodeInspectorProps {
  node: RFNode<TreeNodeData>;
  onClose: () => void;
  position: { x: number; y: number };
}

const normalizeHex = (value: string) => {
  let v = value.trim();
  if (!v) return "";
  if (!v.startsWith("#")) v = `#${v}`;
  v = v.toUpperCase();
  if (v.length > 7) v = v.slice(0, 7);
  return v;
};

const isValidHex = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

export default function NodeInspector({ node, onClose, position }: NodeInspectorProps) {
  const [childCount, setChildCount] = useState(3);
  const [showDescription, setShowDescription] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updateNodeData = useTreeStore((s) => s.updateNodeData);
  const deleteNode = useTreeStore((s) => s.deleteNode);
  const duplicateSubtree = useTreeStore((s) => s.duplicateSubtree);
  const addMultipleChildren = useTreeStore((s) => s.addMultipleChildren);

  const currentHex = isValidHex(node.data.color ?? "") ? (node.data.color as string) : "#64748B";
  const [hexDraft, setHexDraft] = useState(currentHex);

  useEffect(() => {
    setHexDraft(currentHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const el = popoverRef.current;
      if (!el) return;
      const target = e.target as globalThis.Node | null;
      if (target && !el.contains(target)) onClose();
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
      className="absolute z-[100] w-[300px] bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-200"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            deleteNode(node.id);
            onClose();
          }}
          disabled={node.id === "root"}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          🗑️ Delete
        </button>
        <button
          onClick={() => {
            duplicateSubtree(node.id);
            onClose();
          }}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
        >
          📋 Duplicate
        </button>
      </div>

      {/* Title */}
      <div className="mb-3">
        <label className="block text-[10px] font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
          Title
        </label>
        <input
          value={node.data.title ?? ""}
          onChange={(e) => updateNodeData(node.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          placeholder="Node title..."
        />
      </div>

      {/* Description Toggle */}
      {(node.data.nodeType === "process" || node.data.nodeType === "note") && (
        <div className="mb-3">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            type="button"
          >
            {showDescription ? "− Hide Description" : "+ Show Description"}
          </button>
          {showDescription && (
            <textarea
              value={node.data.description ?? ""}
              onChange={(e) => updateNodeData(node.id, { description: e.target.value })}
              className="mt-2 w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-sm"
              rows={3}
              placeholder="Description..."
            />
          )}
        </div>
      )}

      {/* Color */}
      <div className="mb-4">
        <label className="block text-[10px] font-medium text-slate-700 mb-1.5 uppercase tracking-wide">
          Color
        </label>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentHex}
            onChange={(e) => {
              const hex = e.target.value.toUpperCase();
              setHexDraft(hex);
              updateNodeData(node.id, { color: hex });
            }}
            className="h-9 w-11 cursor-pointer rounded-lg border-2 border-slate-300 bg-white p-1 hover:border-slate-400 transition-colors shadow-sm"
            aria-label="Pick a color"
          />
          <input
            value={hexDraft}
            onChange={(e) => setHexDraft(normalizeHex(e.target.value))}
            onBlur={() => {
              const v = normalizeHex(hexDraft);
              setHexDraft(v);
              if (isValidHex(v)) updateNodeData(node.id, { color: v });
            }}
            placeholder="#RRGGBB"
            className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border-2 outline-none transition-all shadow-sm ${
              isValidHex(hexDraft)
                ? "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                : "border-rose-300 focus:ring-2 focus:ring-rose-100 bg-rose-50"
            }`}
          />
        </div>
      </div>

      {/* Add Children */}
      {node.data.nodeType === "process" && (
        <div className="pt-3 border-t border-slate-200">
          <label className="block text-[10px] font-medium text-slate-700 mb-2 uppercase tracking-wide">
            Add Children
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={childCount}
              onChange={(e) =>
                setChildCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
              }
              className="w-16 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
            <button
              onClick={() => {
                addMultipleChildren(node.id, childCount);
                onClose();
              }}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 active:scale-95 transition-all duration-150 shadow-md"
              type="button"
            >
              Add {childCount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}