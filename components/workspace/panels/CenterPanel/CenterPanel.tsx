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
import CustomEdge from "./CustomEdge";
import CanvasMenus from "./CanvasMenus";
import TreeFlowHeader from "./TreeFlowHeader";

import type { ConnectionType, NodeType } from "../../../../lib/tree/types";

import "reactflow/dist/style.css";

interface CenterPanelProps {
  isFullscreen?: boolean;
}

export default function CenterPanel({ isFullscreen = false }: CenterPanelProps) {
  const treeId = "default";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const infoBtnRef = useRef<HTMLButtonElement>(null);

  const [showControls, setShowControls] = useState(false);
  const [infoPos, setInfoPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

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

  useEffect(() => {
    loadTree(treeId);
  }, [loadTree, treeId]);

  useAutoSave(treeId, 600);

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
    setShowControls(false);
  }, []);

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

      const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
      setCompactInspector({ isOpen: false, nodeId: null, position: { x: 0, y: 0 } });
      setShowControls(false);

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

  const handleEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
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
    setCompactInspector({ isOpen: false, nodeId: null, position: { x: 0, y: 0 } });
    setShowControls(false);

    setEdgeMenu({ isOpen: true, edgeId: edge.id, position: { x: menuX, y: menuY } });
  }, []);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      if (event.button !== 0) return;

      selectNode(node.id);

      setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, flowPosition: { x: 0, y: 0 } });
      setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } });
      setShowControls(false);

      if (isFullscreen || window.innerWidth < 1024) {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();

        let inspectorX = event.clientX - rect.left + 20;
        let inspectorY = event.clientY - rect.top;

        const inspectorWidth = 280;
        const inspectorHeight = 300;

        if (inspectorX + inspectorWidth > rect.width) inspectorX = rect.width - inspectorWidth - 10;
        if (inspectorY + inspectorHeight > rect.height) inspectorY = rect.height - inspectorHeight - 10;
        if (inspectorX < 10) inspectorX = 10;
        if (inspectorY < 10) inspectorY = 10;

        setCompactInspector({ isOpen: true, nodeId: node.id, position: { x: inspectorX, y: inspectorY } });
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

  const openInfo = useCallback(() => {
    const btn = infoBtnRef.current;
    if (!btn) {
      setShowControls((v) => !v);
      return;
    }

    const rect = btn.getBoundingClientRect();
    const width = 320;
    const gap = 10;

    let left = rect.right - width;
    let top = rect.bottom + gap;

    const maxLeft = window.innerWidth - width - 12;
    if (left > maxLeft) left = maxLeft;
    if (left < 12) left = 12;

    const maxTop = window.innerHeight - 12;
    if (top > maxTop) top = maxTop;

    setInfoPos({ top, left });
    setShowControls(true);
  }, []);

  const sourceNode = nodes.find((n) => n.id === pendingConnection?.source);
  const inspectorNode = nodes.find((n) => n.id === compactInspector.nodeId);

  return (
    <div className="flex h-full flex-col">
      <TreeFlowHeader
        isFullscreen={isFullscreen}
        showControls={showControls}
        setShowControls={setShowControls}
        openInfo={openInfo}
        onFullscreen={handleFullscreen}
      />

      {/* Info popup, always on top */}
      {showControls && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setShowControls(false)} />
          <div
            className="fixed z-[100] w-80 rounded-xl border border-slate-200 bg-white shadow-2xl p-4"
            style={{ top: infoPos.top, left: infoPos.left }}
          >
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <p className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">
                    🖱️
                  </span>
                  Canvas Controls
                </p>
                <ul className="space-y-1.5 pl-7">
                  <li>• Left drag empty space to select multiple nodes</li>
                  <li>• Right drag to pan around the canvas</li>
                  <li>• Right click empty space to add new nodes</li>
                  <li>• Delete/Backspace to remove selected nodes</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    🔗
                  </span>
                  Connections
                </p>
                <ul className="space-y-1.5 pl-7">
                  <li>• Drag from node handles to create connections</li>
                  <li>• Double-click edge labels to edit them</li>
                  <li>• Right-click edges for more options</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

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
          minZoom={0.12}
          maxZoom={2}
          defaultViewport={viewport}
          onMoveEnd={handleMoveEnd}
        >
          <Background gap={16} size={1} color="#e2e8f0" />

          <Controls
            position="top-right"
            className="!border-slate-200 !bg-white/90 !backdrop-blur-sm !shadow-lg !rounded-xl"
          />

          <MiniMap
            position="bottom-right"
            className="!border-slate-200 !bg-white/90 !backdrop-blur-sm !shadow-lg !rounded-xl !w-40 !h-28"
            nodeColor={(node) => {
              const color = node.data?.color as string;
              return color && /^#[0-9A-F]{6}$/i.test(color) ? color : "#64748B";
            }}
          />
        </ReactFlow>

        <CanvasMenus
          contextMenu={contextMenu}
          edgeMenu={edgeMenu}
          onAddNode={handleAddNode}
          edges={edges}
          onEditEdgeLabel={(edgeId, nextLabel) => updateEdgeLabel(edgeId, nextLabel)}
          onDeleteEdge={(edgeId) => deleteEdge(edgeId)}
          onCloseEdgeMenu={() =>
            setEdgeMenu({ isOpen: false, edgeId: null, position: { x: 0, y: 0 } })
          }
        />

        {compactInspector.isOpen && inspectorNode && (
          <NodeInspector
            node={inspectorNode}
            onClose={() =>
              setCompactInspector({ isOpen: false, nodeId: null, position: { x: 0, y: 0 } })
            }
            position={compactInspector.position}
          />
        )}
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
