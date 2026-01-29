"use client";

import { useEffect, useMemo, useState } from "react";
import { useTreeStore } from "../../../../lib/tree/store";

const nodeTypeLabels: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  process: { label: "Process", icon: "▭", color: "text-slate-600" },
  decision: { label: "Decision", icon: "◆", color: "text-blue-600" },
  start: { label: "Start", icon: "🚀", color: "text-emerald-600" },
  end: { label: "End", icon: "🏁", color: "text-rose-600" },
  note: { label: "Note", icon: "📝", color: "text-amber-600" },
};

const normalizeHex = (value: string) => {
  let v = value.trim();
  if (!v) return "";
  if (!v.startsWith("#")) v = `#${v}`;
  v = v.toUpperCase();
  if (v.length > 7) v = v.slice(0, 7);
  return v;
};

const isValidHex = (value: string) => /^#[0-9A-F]{6}$/i.test(value);

const fieldBase =
  "text-slate-900 placeholder:text-[rgba(0,0,0,0.8)] placeholder:opacity-100";

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

  const currentHex = useMemo(() => {
    const raw = (selectedNode?.data?.color ?? "") as string;
    return isValidHex(raw) ? raw.toUpperCase() : "#64748B";
  }, [selectedNode?.data?.color]);

  const [hexDraft, setHexDraft] = useState(currentHex);

  // Focus tracking for placeholder behavior (disappear on focus)
  const [focusTitle, setFocusTitle] = useState(false);
  const [focusDesc, setFocusDesc] = useState(false);
  const [focusNotes, setFocusNotes] = useState(false);
  const [focusHex, setFocusHex] = useState(false);

  useEffect(() => {
    setHexDraft(currentHex);
  }, [currentHex]);

  if (!selectedNode) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center px-4">
        <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-8 mb-6 shadow-sm">
          <svg
            className="h-14 w-14 text-slate-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-2">
          No Node Selected
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-8">
          Click on any node in the canvas to view and edit its properties
        </p>

        <div className="w-full max-w-xs space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-lg flex-shrink-0">💡</span>
            <div className="text-left">
              <p className="text-xs font-medium text-slate-700">Quick Tip</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Right-click canvas to add nodes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-lg flex-shrink-0">🔗</span>
            <div className="text-left">
              <p className="text-xs font-medium text-slate-700">Connect Nodes</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag from handles to create links
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-lg flex-shrink-0">✏️</span>
            <div className="text-left">
              <p className="text-xs font-medium text-slate-700">Edit Labels</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Double-click edge labels to edit
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nodeTypeInfo =
    nodeTypeLabels[selectedNode.data.nodeType] || nodeTypeLabels.process;

  return (
    <div className="flex h-full flex-col min-w-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Node Inspector
        </h2>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm min-w-0">
          <span className={`text-xl ${nodeTypeInfo.color} shrink-0`}>
            {nodeTypeInfo.icon}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-900 truncate">
              {nodeTypeInfo.label} Node
            </p>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              {selectedNode.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <p className="text-xs font-medium text-slate-700 mb-3 uppercase tracking-wide">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => deleteNode(selectedNode.id)}
            disabled={selectedNode.id === "root"}
            className="group rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-medium text-rose-700 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
          >
            <span className="inline-block group-hover:scale-110 transition-transform">
              🗑️
            </span>{" "}
            Delete
          </button>
          <button
            onClick={() => duplicateSubtree(selectedNode.id)}
            className="group rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow"
          >
            <span className="inline-block group-hover:scale-110 transition-transform">
              📋
            </span>{" "}
            Duplicate
          </button>
        </div>

        {selectedNode.data.nodeType === "process" && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block text-xs font-medium text-slate-900 mb-2.5">
              Add Multiple Children
            </label>
            <div className="flex gap-2 min-w-0">
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
                className={`flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${fieldBase}`}
              />
              <button
                onClick={() => addMultipleChildren(selectedNode.id, childCount)}
                className="shrink-0 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 active:scale-95 transition-all duration-150 shadow-sm"
              >
                Add
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Creates {childCount} child node{childCount > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Node Details */}
      <div className="flex-1 space-y-5 overflow-auto pr-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Node Details
        </p>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Title
          </label>
          <input
            value={selectedNode.data.title ?? ""}
            onChange={(e) =>
              updateNodeData(selectedNode.id, { title: e.target.value })
            }
            onFocus={() => setFocusTitle(true)}
            onBlur={() => setFocusTitle(false)}
            className={`w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm ${fieldBase}`}
            placeholder={focusTitle ? "" : "Enter node title..."}
          />
        </div>

        {/* Description */}
        {(selectedNode.data.nodeType === "process" ||
          selectedNode.data.nodeType === "note") && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={selectedNode.data.description ?? ""}
              onChange={(e) =>
                updateNodeData(selectedNode.id, { description: e.target.value })
              }
              onFocus={() => setFocusDesc(true)}
              onBlur={() => setFocusDesc(false)}
              className={`min-h-[90px] w-full min-w-0 resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm ${fieldBase}`}
              placeholder={focusDesc ? "" : "What does this step involve..."}
            />
          </div>
        )}

        {/* Notes & Resources */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Notes & Resources
          </label>
          <textarea
            value={selectedNode.data.notes ?? ""}
            onChange={(e) =>
              updateNodeData(selectedNode.id, { notes: e.target.value })
            }
            onFocus={() => setFocusNotes(true)}
            onBlur={() => setFocusNotes(false)}
            className={`min-h-[110px] w-full min-w-0 resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm ${fieldBase}`}
            placeholder={
              focusNotes
                ? ""
                : "Add notes, links, resources...\nExample:\n• https://docs.example.com\n• Contact: john@example.com\n• Key requirement: XYZ"
            }
          />
        </div>

        {/* Color Theme */}
        <div className="min-w-0">
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Color Theme
          </label>

          <div className="flex items-center gap-3 min-w-0">
            {/* Left picker container */}
            <div className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <input
                type="color"
                value={currentHex}
                onChange={(e) => {
                  const hex = e.target.value.toUpperCase();
                  setHexDraft(hex);
                  updateNodeData(selectedNode.id, { color: hex });
                }}
                className="h-10 w-10 cursor-pointer appearance-none rounded-xl border-2 border-slate-200 bg-white p-0 shadow-sm"
                aria-label="Pick a color"
              />
            </div>

            {/* Hex input (flexes, never overflows) */}
            <input
              value={hexDraft}
              onChange={(e) => setHexDraft(normalizeHex(e.target.value))}
              onFocus={() => setFocusHex(true)}
              onBlur={() => {
                setFocusHex(false);
                const v = normalizeHex(hexDraft);
                setHexDraft(v);
                if (isValidHex(v)) updateNodeData(selectedNode.id, { color: v });
              }}
              placeholder={focusHex ? "" : "#RRGGBB"}
              className={`flex-1 min-w-0 rounded-2xl border-2 bg-white px-4 py-3 text-sm font-mono outline-none shadow-sm ${fieldBase} ${
                isValidHex(hexDraft)
                  ? "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  : "border-rose-200 bg-rose-50 focus:ring-2 focus:ring-rose-100"
              }`}
            />

            {/* Right preview container */}
            <div className="shrink-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div
                className="h-12 w-12 rounded-2xl border border-slate-200 shadow-sm"
                style={{ backgroundColor: currentHex }}
                aria-label="Selected color preview"
              />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-end">
            <span className="text-[11px] font-mono text-blue-600">
              {currentHex}
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Choose a color or enter hex code like{" "}
            <span className="font-mono font-medium text-blue-600">#3B82F6</span>
          </p>
        </div>

        {/* Completed Toggle */}
        {selectedNode.data.nodeType === "process" && (
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
            <div className="flex items-center justify-between min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  Mark as Completed
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your progress
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={!!selectedNode.data.completed}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      completed: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-[1.35rem] peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
