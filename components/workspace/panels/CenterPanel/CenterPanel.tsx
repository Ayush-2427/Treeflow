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
} from "reactflow";

import { useTreeStore } from "../../../../lib/tree/store";
import ProcessNode from "../CenterPanel/Processnode";
import DecisionNode from "../CenterPanel/Decisionnode";
import { StartNode, EndNode } from "../CenterPanel/Startendnodes";
import NoteNode from "../CenterPanel/Notenode";
import ConnectionTypeModal from "./ConnectionTypeModal";
import type { ConnectionType, NodeType } from "../../../../lib/tree/types";

import "reactflow/dist/style.css";

// Custom Edge with editable label (NO onContextMenu on BaseEdge, React Flow does not support it)
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
    // keep local state in sync if store updates label externally
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
              className="px-2 py-1 text-xs border-2 border-blue-400 rounded bg-white shadow-lg outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              onDoubleClick={handleLabelDoubleClick}
              className="px-2 py-1 text-xs font-medium bg-white/90 border border-slate-200 rounded shadow-sm cursor-pointer hover:bg-white hover:border-slate-300 transition-all"
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

export default function CenterPanel() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    flowPosition: { x: number; y: number };
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    flowPosition: { x: 0, y: 0 },
  });

  // Edge context menu (right click edge) - handled via ReactFlow onEdgeContextMenu
  const [edgeMenu, setEdgeMenu] = useState<{
    isOpen: boolean;
    edgeId: string | null;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    edgeId: null,
    position: { x: 0, y: 0 },
  });

  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const selectNode = useTreeStore((s) => s.selectNode);
  const addNodeAtPosition = useTreeStore((s) => s.addNodeAtPosition);

  const pendingConnection = useTreeStore((s) => s.pendingConnection);
  const setPendingConnection = useTreeStore((s) => s.setPendingConnection);
  const createConnection = useTreeStore((s) => s.createConnection);

  const onNodesChange = useTreeStore((s) => s.onNodesChange);
  const onEdgesChange = useTreeStore((s) => s.onEdgesChange);

  const updateEdgeLabel = useTreeStore((s) => s.updateEdgeLabel);
  const deleteEdge = useTreeStore((s) => s.deleteEdge);

  const { screenToFlowPosition } = useReactFlow();

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
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, flowPosition: { x: 0, y: 0 } });
    setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
  }, []);

  const handlePaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();

      // Menu position relative to wrapper (DOM coords)
      let menuX = event.clientX - rect.left;
      let menuY = event.clientY - rect.top;

      // Clamp menu within canvas boundaries
      const menuWidth = 200;
      const menuHeight = 260;

      if (menuX + menuWidth > rect.width) menuX = rect.width - menuWidth - 10;
      if (menuY + menuHeight > rect.height) menuY = rect.height - menuHeight - 10;
      if (menuX < 10) menuX = 10;
      if (menuY < 10) menuY = 10;

      // Flow position for node placement (flow coords)
      const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
      setContextMenu({ isOpen: true, position: { x: menuX, y: menuY }, flowPosition: flowPos });
    },
    [screenToFlowPosition]
  );

  const handleAddNode = useCallback(
    (nodeType: NodeType) => {
      if (contextMenu.isOpen) {
        addNodeAtPosition(contextMenu.flowPosition.x, contextMenu.flowPosition.y, nodeType);
      }
      setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, flowPosition: { x: 0, y: 0 } });
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

  // Edge right click - MUST be on ReactFlow (not BaseEdge)
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

      setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, flowPosition: { x: 0, y: 0 } });
      setEdgeMenu({ isOpen: true, edgeId: edge.id, position: { x: menuX, y: menuY } });
    },
    []
  );

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAllMenus();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeAllMenus]);

  // Get source node type for modal
  const sourceNode = nodes.find((n) => n.id === pendingConnection?.source);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">TreeFlow Canvas</h2>
          <p className="mt-1 text-xs text-slate-500">
            Drag nodes - Connect with handles - Right-click canvas to add - Double-click labels to edit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50">
            Auto Layout
          </button>
          <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
            Export
          </button>
        </div>
      </div>

      <div ref={wrapperRef} className="relative flex-1 rounded-xl border border-slate-200 bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(_, node) => {
            selectNode(node.id);
            setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
          }}
          onPaneClick={() => {
            selectNode(null);
            closeAllMenus();
          }}
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
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Canvas Context Menu */}
        {contextMenu.isOpen && (
          <div
            className="absolute z-50 min-w-[180px] rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
            style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 border-b border-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Add Node
            </div>

            <button
              onClick={() => handleAddNode("process")}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="text-lg">▭</span>
              <span>Process</span>
            </button>

            <button
              onClick={() => handleAddNode("decision")}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="text-lg">◆</span>
              <span>Decision</span>
            </button>

            <button
              onClick={() => handleAddNode("start")}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="text-lg">🚀</span>
              <span>Start</span>
            </button>

            <button
              onClick={() => handleAddNode("end")}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="text-lg">🏁</span>
              <span>End</span>
            </button>

            <button
              onClick={() => handleAddNode("note")}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="text-lg">📝</span>
              <span>Note</span>
            </button>
          </div>
        )}

        {/* Edge Context Menu */}
        {edgeMenu.isOpen && edgeMenu.edgeId && (
          <div
            className="absolute z-50 min-w-[200px] rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
            style={{ top: edgeMenu.position.y, left: edgeMenu.position.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 border-b border-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Connection
            </div>

            <button
              onClick={() => {
                const current = edges.find((e) => e.id === edgeMenu.edgeId);
                const currentLabel =
                  (current?.data as any)?.label ?? (current?.label as string) ?? "";
                const next = window.prompt("Edit label:", currentLabel);
                if (next !== null) updateEdgeLabel(edgeMenu.edgeId!, next);
                setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
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
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <span className="text-lg">🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Canvas Controls:</p>
            <p>• Drag nodes to reposition</p>
            <p>• Drag from handles to connect</p>
            <p>• Right-click canvas to add nodes</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Edge Controls:</p>
            <p>• Double-click label to edit</p>
            <p>• Right-click edge for options</p>
            <p>• Labels show conditions/flow</p>
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
