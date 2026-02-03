// components/workspace/panels/LeftPanel/LeftPanel.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useReactFlow } from "reactflow";
import { ChevronDown, Plus, Save, Share2, X, Minus, Info, ArrowLeft } from "lucide-react";
import { useTreeStore } from "../../../../lib/tree/store";
import type { NodeType } from "../../../../lib/tree/types";

const nodeTypeConfig: Record<NodeType, { label: string; icon: string; bgColor: string; textColor: string }> = {
  start: {
    label: "Start",
    icon: "🚀",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
  },
  process: {
    label: "Process",
    icon: "⚙️",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
  decision: {
    label: "Decision",
    icon: "🔀",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600",
  },
  end: {
    label: "End",
    icon: "🏁",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600",
  },
  note: {
    label: "Note",
    icon: "📝",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
  },
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

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [showNodeTypes, setShowNodeTypes] = useState(false);
  const [childCount, setChildCount] = useState(3);

  const nodes = useTreeStore((s) => s.nodes);
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const selectNode = useTreeStore((s) => s.selectNode);
  const addNodeAtPosition = useTreeStore((s) => s.addNodeAtPosition);
  const saveTree = useTreeStore((s) => s.saveTree);
  const exportTree = useTreeStore((s) => s.exportTree);
  const updateNodeData = useTreeStore((s) => s.updateNodeData);
  const deleteNode = useTreeStore((s) => s.deleteNode);
  const addMultipleChildren = useTreeStore((s) => s.addMultipleChildren);
  const duplicateSubtree = useTreeStore((s) => s.duplicateSubtree);

  const { setCenter, getNode } = useReactFlow();

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [nodes, selectedNodeId]);

  const currentHex = useMemo(() => {
    const raw = (selectedNode?.data?.color ?? "") as string;
    return isValidHex(raw) ? raw.toUpperCase() : "#64748B";
  }, [selectedNode?.data?.color]);

  const [hexDraft, setHexDraft] = useState(currentHex);

  const [focusTitle, setFocusTitle] = useState(false);
  const [focusDesc, setFocusDesc] = useState(false);
  const [focusNotes, setFocusNotes] = useState(false);
  const [focusHex, setFocusHex] = useState(false);

  useEffect(() => {
    setHexDraft(currentHex);
  }, [currentHex]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Handle node click - select in store and center in canvas
  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId);

    // Center the node in the canvas view
    const node = getNode(nodeId);
    if (node) {
      setCenter(node.position.x + 100, node.position.y + 50, {
        duration: 400,
        zoom: 1,
      });
    }
  };

  const handleAddNode = () => {
    // Add node at center of current viewport
    addNodeAtPosition(0, 0, "process");
  };

  const handleSaveTree = async () => {
    await saveTree("default");
  };

  const handleShare = () => {
    exportTree("default");
  };

  const handleBackToOverview = () => {
    selectNode(null);
  };

  const nodeTypeInfo = selectedNode
    ? nodeTypeConfig[selectedNode.data.nodeType as NodeType] || nodeTypeConfig.process
    : null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900
          border-r border-slate-700/50 shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              T
            </div>
            <span className="font-semibold text-white text-sm truncate">
              TreeFlow
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors hidden lg:block"
            aria-label="Collapse sidebar"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Dropdown */}
        <div className="px-4 py-3 border-b border-slate-700/50">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-slate-400 text-xs">👤</span>
              <span className="text-slate-200 text-sm font-medium truncate">
                Project Workspace
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                workspaceDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {workspaceDropdownOpen && (
            <div className="mt-2 p-2 rounded-lg bg-slate-700/20 border border-slate-700/30">
              <div className="px-3 py-2 text-xs text-slate-400">
                Default workspace
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!selectedNode ? (
            /* TREE OVERVIEW MODE */
            <div className="space-y-6">
              {/* Tree Overview Header with Info Button */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tree Overview
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowNodeTypes(!showNodeTypes)}
                      className="p-1 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label="Show node types"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Node Types Popup */}
                    {showNodeTypes && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowNodeTypes(false)}
                        />
                        <div className="absolute right-0 top-8 z-50 w-56 rounded-lg border border-slate-700/50 bg-slate-800 shadow-xl p-3">
                          <h4 className="text-xs font-semibold text-slate-300 mb-2">
                            Available Node Types
                          </h4>
                          <div className="space-y-1.5">
                            {(["start", "process", "decision", "end", "note"] as NodeType[]).map(
                              (type) => {
                                const config = nodeTypeConfig[type];
                                return (
                                  <div
                                    key={type}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-700/30"
                                  >
                                    <div
                                      className={`w-6 h-6 rounded ${config.bgColor} flex items-center justify-center text-xs`}
                                    >
                                      {config.icon}
                                    </div>
                                    <span className="text-xs text-slate-300">
                                      {config.label}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-0.5">
                  {nodes.map((node) => {
                    const config =
                      nodeTypeConfig[node.data.nodeType as NodeType] ||
                      nodeTypeConfig.process;

                    return (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node.id)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-700/30 border border-transparent transition-all duration-150"
                      >
                        <div
                          className={`w-6 h-6 rounded bg-slate-700/50 flex items-center justify-center text-xs flex-shrink-0`}
                        >
                          {config.icon}
                        </div>
                        <span className="text-sm font-medium truncate text-left text-slate-300">
                          {node.data.title || "Untitled"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* NODE INSPECTOR MODE */
            <div className="space-y-4">
              {/* Back Button */}
              <button
                onClick={handleBackToOverview}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/30 text-slate-300 hover:text-slate-100 transition-colors w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Overview</span>
              </button>

              {/* Node Type Badge */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-700/30 border border-slate-700/50">
                <span className={`text-lg ${nodeTypeInfo?.textColor}`}>
                  {nodeTypeInfo?.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-300 truncate">
                    {nodeTypeInfo?.label} Node
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    {selectedNode.id.slice(0, 12)}...
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    disabled={selectedNode.id === "root"}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                  <button
                    onClick={() => duplicateSubtree(selectedNode.id)}
                    className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 transition-colors text-xs font-medium"
                  >
                    <span>📋</span>
                    Copy
                  </button>
                </div>

                {selectedNode.data.nodeType === "process" && (
                  <div className="mt-2 rounded-lg bg-slate-700/20 border border-slate-700/30 p-3">
                    <label className="block text-[10px] font-medium text-slate-400 mb-2">
                      Add Multiple Children
                    </label>
                    <div className="flex gap-2">
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
                        className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addMultipleChildren(selectedNode.id, childCount)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Node Details */}
              <div className="space-y-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Node Details
                </p>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 px-1">
                    Title
                  </label>
                  <input
                    value={selectedNode.data.title ?? ""}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { title: e.target.value })
                    }
                    onFocus={() => setFocusTitle(true)}
                    onBlur={() => setFocusTitle(false)}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
                    placeholder={focusTitle ? "" : "Enter node title..."}
                  />
                </div>

                {/* Description */}
                {(selectedNode.data.nodeType === "process" ||
                  selectedNode.data.nodeType === "note") && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 px-1">
                      Description
                    </label>
                    <textarea
                      value={selectedNode.data.description ?? ""}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, { description: e.target.value })
                      }
                      onFocus={() => setFocusDesc(true)}
                      onBlur={() => setFocusDesc(false)}
                      className="min-h-[70px] w-full resize-none rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
                      placeholder={focusDesc ? "" : "What does this step involve..."}
                    />
                  </div>
                )}

                {/* Notes & Resources */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 px-1">
                    Notes & Resources
                  </label>
                  <textarea
                    value={selectedNode.data.notes ?? ""}
                    onChange={(e) =>
                      updateNodeData(selectedNode.id, { notes: e.target.value })
                    }
                    onFocus={() => setFocusNotes(true)}
                    onBlur={() => setFocusNotes(false)}
                    className="min-h-[80px] w-full resize-none rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
                    placeholder={focusNotes ? "" : "Add notes, links..."}
                  />
                </div>

                {/* Color Theme */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 px-1">
                    Color Theme
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentHex}
                      onChange={(e) => {
                        const hex = e.target.value.toUpperCase();
                        setHexDraft(hex);
                        updateNodeData(selectedNode.id, { color: hex });
                      }}
                      className="h-9 w-9 cursor-pointer rounded-lg border border-slate-600"
                    />
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
                      className={`flex-1 rounded-lg border bg-slate-800 px-3 py-2 text-xs font-mono text-slate-200 outline-none ${
                        isValidHex(hexDraft)
                          ? "border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          : "border-rose-500 bg-rose-500/10"
                      }`}
                    />
                  </div>
                </div>

                {/* Completed Toggle */}
                {selectedNode.data.nodeType === "process" && (
                  <div className="rounded-lg bg-slate-700/20 border border-slate-700/30 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Completed
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Mark as done
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
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
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-slate-700/50 px-4 py-3 space-y-1.5">
          <button
            onClick={handleAddNode}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
          >
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
            <span className="text-sm font-medium text-slate-200">Add Node</span>
          </button>

          <button
            onClick={handleSaveTree}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-700/30 transition-colors group"
          >
            <Save className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200">
              Save Tree
            </span>
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-700/30 transition-colors group"
          >
            <Share2 className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-slate-200">
              Share
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}