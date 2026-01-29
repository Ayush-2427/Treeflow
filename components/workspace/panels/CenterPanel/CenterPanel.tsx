"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  type EdgeProps,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  SelectionMode,
  type Viewport,
} from "reactflow";

import { useTreeStore } from "../../../../lib/tree/store";
import { useAutoSave } from "../../../../lib/tree/hooks/useAutoSave";

import ProcessNode from "./Processnode";
import DecisionNode from "./Decisionnode";
import { StartNode, EndNode } from "./Startendnodes";
import NoteNode from "./Notenode";
import ConnectionTypeModal from "./ConnectionTypeModal";
import NodeInspector from "./Nodeinspector";
import type { ConnectionType, NodeType } from "../../../../lib/tree/types";

import "reactflow/dist/style.css";

// Custom Edge with editable label
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState<string>(
    (data?.label as string) || (label as string) || ""
  );

  const updateEdgeLabel = useTreeStore((s) => s.updateEdgeLabel);

  useEffect(() => {
    setEditLabel((data?.label as string) || (label as string) || "");
  }, [data?.label, label]);

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleLabelSubmit = () => {
    updateEdgeLabel(id, editLabel.trim());
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleLabelSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLabelSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="px-3 py-1.5 text-xs border-2 border-blue-500 rounded-lg bg-white shadow-lg outline-none font-medium"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              onDoubleClick={handleLabelDoubleClick}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 hover:border-slate-400 hover:shadow transition-all"
              title="Double-click to edit"
            >
              {editLabel || "empty"}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

interface CenterPanelProps {
  isFullscreen?: boolean;
}

export default function CenterPanel({ isFullscreen = false }: CenterPanelProps) {
  const treeId = "default";

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track right drag to avoid opening Add Node menu after panning
  const rightMouseDownRef = useRef(false);
  const rightDraggedRef = useRef(false);
  const rightStartRef = useRef<{ x: number; y: number } | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    flowPosition: { x: number; y: number };
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    flowPosition: { x: 0, y: 0 },
  });

  const [edgeMenu, setEdgeMenu] = useState<{
    isOpen: boolean;
    edgeId: string | null;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    edgeId: null,
    position: { x: 0, y: 0 },
  });

  const [compactInspector, setCompactInspector] = useState<{
    isOpen: boolean;
    nodeId: string | null;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    nodeId: null,
    position: { x: 0, y: 0 },
  });

  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);

  const viewport = useTreeStore((s) => s.viewport);
  const setViewport = useTreeStore((s) => s.setViewport);
  const loadTree = useTreeStore((s) => s.loadTree);

  const selectNode = useTreeStore((s) => s.selectNode);
  const addNodeAtPosition = useTreeStore((s) => s.addNodeAtPosition);

  const pendingConnection = useTreeStore((s) => s.pendingConnection);
  const setPendingConnection = useTreeStore((s) => s.setPendingConnection);
  const createConnection = useTreeStore((s) => s.createConnection);

  const onNodesChange = useTreeStore((s) => s.onNodesChange);
  const onEdgesChange = useTreeStore((s) => s.onEdgesChange);

  const updateEdgeLabel = useTreeStore((s) => s.updateEdgeLabel);
  const deleteEdge = useTreeStore((s) => s.deleteEdge);
  const deleteNode = useTreeStore((s) => s.deleteNode);

  const { screenToFlowPosition, getNodes } = useReactFlow();

  // Load persisted tree on mount
  useEffect(() => {
    loadTree(treeId);
  }, [loadTree, treeId]);

  // Auto-save whenever nodes/edges/viewport changes
  useAutoSave(treeId, 600);

  // Persist viewport after user finishes moving/zooming
  const handleMoveEnd = useCallback(
    (_: any, vp: Viewport) => {
      setViewport(vp);
    },
    [setViewport]
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      process: ProcessNode,
      decision: DecisionNode,
      start: StartNode,
      end: EndNode,
      note: NoteNode,
    }),
    []
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      smoothstep: CustomEdge,
    }),
    []
  );

  const closeAllMenus = useCallback(() => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      flowPosition: { x: 0, y: 0 },
    });
    setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
    setCompactInspector({
      isOpen: false,
      nodeId: null,
      position: { x: 0, y: 0 },
    });
  }, []);

  // Keyboard delete (with focus guard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        const selectedNodes = getNodes().filter((n) => n.selected);
        selectedNodes.forEach((n) => {
          if (n.id !== "root") deleteNode(n.id);
        });
      }

      if (e.key === "Escape") {
        closeAllMenus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getNodes, deleteNode, closeAllMenus]);

  const handlePaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // If user panned with right drag, do not open menu on release
      if (rightDraggedRef.current) return;

      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();

      let menuX = event.clientX - rect.left;
      let menuY = event.clientY - rect.top;

      const menuWidth = 200;
      const menuHeight = 280;

      if (menuX + menuWidth > rect.width) menuX = rect.width - menuWidth - 10;
      if (menuY + menuHeight > rect.height) menuY = rect.height - menuHeight - 10;
      if (menuX < 10) menuX = 10;
      if (menuY < 10) menuY = 10;

      const flowPos = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
      setCompactInspector({
        isOpen: false,
        nodeId: null,
        position: { x: 0, y: 0 },
      });
      setContextMenu({
        isOpen: true,
        position: { x: menuX, y: menuY },
        flowPosition: flowPos,
      });
    },
    [screenToFlowPosition]
  );

  const handleAddNode = useCallback(
    (nodeType: NodeType) => {
      if (contextMenu.isOpen) {
        addNodeAtPosition(
          contextMenu.flowPosition.x,
          contextMenu.flowPosition.y,
          nodeType
        );
      }
      setContextMenu({
        isOpen: false,
        position: { x: 0, y: 0 },
        flowPosition: { x: 0, y: 0 },
      });
    },
    [contextMenu, addNodeAtPosition]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        setPendingConnection({ source: connection.source, target: connection.target });
      }
    },
    [setPendingConnection]
  );

  const handleConnectionTypeSelect = useCallback(
    (type: ConnectionType, label?: string) => {
      if (!pendingConnection) return;
      createConnection(pendingConnection.source, pendingConnection.target, type, label);
    },
    [pendingConnection, createConnection]
  );

  const handleModalClose = useCallback(() => {
    setPendingConnection(null);
  }, [setPendingConnection]);

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: any) => {
      event.preventDefault();
      event.stopPropagation();

      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();

      let menuX = event.clientX - rect.left;
      let menuY = event.clientY - rect.top;

      const menuWidth = 220;
      const menuHeight = 120;

      if (menuX + menuWidth > rect.width) menuX = rect.width - menuWidth - 10;
      if (menuY + menuHeight > rect.height) menuY = rect.height - menuHeight - 10;
      if (menuX < 10) menuX = 10;
      if (menuY < 10) menuY = 10;

      setContextMenu({
        isOpen: false,
        position: { x: 0, y: 0 },
        flowPosition: { x: 0, y: 0 },
      });
      setCompactInspector({
        isOpen: false,
        nodeId: null,
        position: { x: 0, y: 0 },
      });
      setEdgeMenu({
        isOpen: true,
        edgeId: edge.id,
        position: { x: menuX, y: menuY },
      });
    },
    []
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      // only react to left click
      if (event.button !== 0) return;

      selectNode(node.id);

      // Clicking a node closes Add Node menu, keeps node inspector
      setContextMenu({
        isOpen: false,
        position: { x: 0, y: 0 },
        flowPosition: { x: 0, y: 0 },
      });
      setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });

      // Show compact inspector (fullscreen or small screens)
      if (isFullscreen || window.innerWidth < 1024) {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();

        let inspectorX = event.clientX - rect.left + 20;
        let inspectorY = event.clientY - rect.top;

        const inspectorWidth = 280;
        const inspectorHeight = 300;

        if (inspectorX + inspectorWidth > rect.width)
          inspectorX = rect.width - inspectorWidth - 10;
        if (inspectorY + inspectorHeight > rect.height)
          inspectorY = rect.height - inspectorHeight - 10;
        if (inspectorX < 10) inspectorX = 10;
        if (inspectorY < 10) inspectorY = 10;

        setCompactInspector({
          isOpen: true,
          nodeId: node.id,
          position: { x: inspectorX, y: inspectorY },
        });
      }
    },
    [selectNode, isFullscreen]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    closeAllMenus();
  }, [selectNode, closeAllMenus]);

  const handleFullscreen = useCallback(() => {
    window.open("/workspace/fullscreen", "_blank", "noopener,noreferrer");
  }, []);

  const sourceNode = nodes.find((n) => n.id === pendingConnection?.source);
  const inspectorNode = nodes.find((n) => n.id === compactInspector.nodeId);

  return (
    <div className="flex h-full flex-col">
      {/* Premium Toolbar */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-slate-900">TreeFlow Canvas</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Design and visualize your workflows
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!isFullscreen && (
            <button
              onClick={handleFullscreen}
              className="group rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow"
              type="button"
            >
              <span className="inline-block group-hover:scale-110 transition-transform">⛶</span> Fullscreen
            </button>
          )}
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow"
            type="button"
          >
            Auto Layout
          </button>
          <button
            className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-2 text-xs font-medium text-white hover:from-slate-800 hover:to-slate-700 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg"
            type="button"
          >
            Export
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={wrapperRef}
        className="relative flex-1 rounded-2xl border-2 border-slate-200 bg-white shadow-lg overflow-hidden"
        onMouseDown={(e) => {
          if (e.button !== 2) return;
          rightMouseDownRef.current = true;
          rightDraggedRef.current = false;
          rightStartRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseMove={(e) => {
          if (!rightMouseDownRef.current || !rightStartRef.current) return;
          const dx = Math.abs(e.clientX - rightStartRef.current.x);
          const dy = Math.abs(e.clientY - rightStartRef.current.y);
          if (dx + dy > 6) rightDraggedRef.current = true;
        }}
        onMouseUp={(e) => {
          if (e.button !== 2) return;
          rightMouseDownRef.current = false;
          rightStartRef.current = null;

          window.setTimeout(() => {
            rightDraggedRef.current = false;
          }, 0);
        }}
        onMouseLeave={() => {
          rightMouseDownRef.current = false;
          rightStartRef.current = null;
          rightDraggedRef.current = false;
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onPaneContextMenu={handlePaneContextMenu}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeContextMenu={handleEdgeContextMenu}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          nodesDraggable
          nodesConnectable
          elementsSelectable
          selectionOnDrag={true}
          selectNodesOnDrag={true}
          selectionMode={SelectionMode.Partial}
          panOnDrag={[2]}
          minZoom={0.02}
          maxZoom={2}
          defaultViewport={viewport}
          onMoveEnd={handleMoveEnd}
        >
          <Background gap={16} size={1} color="#e2e8f0" />
          <Controls className="!border-slate-200 !bg-white/90 !backdrop-blur-sm !shadow-lg !rounded-xl" />
          <MiniMap
            className="!border-slate-200 !bg-white/90 !backdrop-blur-sm !shadow-lg !rounded-xl"
            nodeColor={(node) => {
              const color = node.data?.color as string;
              return color && /^#[0-9A-F]{6}$/i.test(color) ? color : "#64748B";
            }}
          />
        </ReactFlow>

        {/* Add Node Context Menu */}
        {contextMenu.isOpen && (
          <div
            className="absolute z-50 min-w-[200px] rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm py-2 shadow-2xl"
            style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 border-b border-slate-100 px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Add Node
            </div>

            <button
              onClick={() => handleAddNode("process")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="text-lg">▭</span>
              <span>Process</span>
            </button>

            <button
              onClick={() => handleAddNode("decision")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="text-lg">◆</span>
              <span>Decision</span>
            </button>

            <button
              onClick={() => handleAddNode("start")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="text-lg">🚀</span>
              <span>Start</span>
            </button>

            <button
              onClick={() => handleAddNode("end")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="text-lg">🏁</span>
              <span>End</span>
            </button>

            <button
              onClick={() => handleAddNode("note")}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="text-lg">📝</span>
              <span>Note</span>
            </button>
          </div>
        )}

        {/* Edge Context Menu */}
        {edgeMenu.isOpen && edgeMenu.edgeId && (
          <div
            className="absolute z-50 min-w-[220px] rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm py-2 shadow-2xl"
            style={{ top: edgeMenu.position.y, left: edgeMenu.position.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 border-b border-slate-100 px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Connection
            </div>

            <button
              onClick={() => {
                const current = edges.find((e) => e.id === edgeMenu.edgeId);
                const currentLabel =
                  (current?.data as any)?.label ??
                  (current?.label as string) ??
                  "";
                const next = window.prompt("Edit label:", currentLabel);
                if (next !== null) updateEdgeLabel(edgeMenu.edgeId!, next);
                setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              type="button"
            >
              <span className="text-lg">✏️</span>
              <span>Edit label</span>
            </button>

            <button
              onClick={() => {
                const ok = window.confirm("Delete this connection?");
                if (ok) deleteEdge(edgeMenu.edgeId!);
                setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              type="button"
            >
              <span className="text-lg">🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        )}

        {/* Compact Inspector Popup */}
        {compactInspector.isOpen && inspectorNode && (
          <NodeInspector
            node={inspectorNode}
            onClose={() =>
              setCompactInspector({
                isOpen: false,
                nodeId: null,
                position: { x: 0, y: 0 },
              })
            }
            position={compactInspector.position}
          />
        )}
      </div>

      {/* Usage Hints */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs text-slate-600">
          <div className="space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">🖱️</span>
              Canvas Controls
            </p>
            <p className="pl-7">• Left drag empty space to select multiple nodes</p>
            <p className="pl-7">• Right drag to pan around the canvas</p>
            <p className="pl-7">• Right click empty space to add new nodes</p>
            <p className="pl-7">• Delete/Backspace to remove selected nodes</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">🔗</span>
              Connections
            </p>
            <p className="pl-7">• Drag from node handles to create connections</p>
            <p className="pl-7">• Double-click edge labels to edit them</p>
            <p className="pl-7">• Right-click edges for more options</p>
          </div>
        </div>
      </div>

      <ConnectionTypeModal
        isOpen={!!pendingConnection}
        onClose={handleModalClose}
        onSelect={handleConnectionTypeSelect}
        sourceNodeType={sourceNode?.data.nodeType}
      />
    </div>
  );
}