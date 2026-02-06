// lib/tree/store/index.ts
"use client";

import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import type { Edge, Node, NodeChange, EdgeChange, Viewport } from "reactflow";
import { nanoid } from "nanoid";

import type {
  ChatMessage,
  TreeMeta,
  TreeNodeData,
  ConnectionType,
  NodeType,
} from "../types";

import {
  localStorageAdapter,
  type TreeflowPersistedState,
  SCHEMA_VERSION,
  validatePersistedState,
  downloadJSON,
  readJSONFile,
} from "../persistance";

import { getDayKey } from "./dayKey";
import { buildParentMap, collectSubtreeIds } from "./graph";
import { getConnectionColor } from "./edgeStyle";
import { pickHandlesByDirection, withAutoHandles } from "./handles";
import { layoutChildrenSimple } from "./layout";
import { bfsOrder } from "./build";

type ChatScope = { type: "workspace" } | { type: "node"; nodeId: string };

export type TreeState = {
  meta: TreeMeta;

  nodes: Node<TreeNodeData>[];
  edges: Edge[];
  viewport: Viewport;

  selectedNodeId: string | null;

  chat: ChatMessage[];
  chatScope: ChatScope;

  dailyUses: { used: number; limit: number; dayKey: string };

  // Progressive build (AI "building live")
  isBuilding: boolean;
  buildToken: number;
  buildFromTree: (
    finalNodes: Node<TreeNodeData>[],
    finalEdges: Edge[],
    opts?: { rootId?: string; nodeDelayMs?: number; edgeDelayMs?: number }
  ) => Promise<void>;
  cancelBuild: () => void;

  pendingConnection: { source: string; target: string } | null;
  setPendingConnection: (c: { source: string; target: string } | null) => void;

  createConnection: (
    source: string,
    target: string,
    type: ConnectionType,
    label?: string
  ) => void;

  updateEdgeLabel: (edgeId: string, label: string) => void;
  deleteEdge: (edgeId: string) => void;

  setNodes: (nodes: Node<TreeNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  selectNode: (id: string | null) => void;
  getSelectedNode: () => Node<TreeNodeData> | null;

  updateNodeData: (id: string, patch: Partial<TreeNodeData>) => void;

  addNode: (node: Node<TreeNodeData>) => void;
  addEdge: (edge: Edge) => void;

  addChildNode: (parentId: string) => void;
  addMultipleChildren: (parentId: string, count: number) => void;
  addSiblingNode: (nodeId: string) => void;
  addNodeAtPosition: (x: number, y: number, nodeType?: NodeType) => void;

  deleteNode: (nodeId: string) => void;
  duplicateSubtree: (nodeId: string) => void;

  setChatScope: (scope: ChatScope) => void;
  addChat: (msg: ChatMessage) => void;

  incrementDailyUse: () => void;
  resetDailyIfNeeded: () => void;

  layoutChildren: (parentId: string) => void;

  setViewport: (viewport: Viewport) => void;
  getPersistableState: () => TreeflowPersistedState;
  hydrateFromPersisted: (state: TreeflowPersistedState) => void;
  loadTree: (treeId: string) => Promise<boolean>;
  saveTree: (treeId: string) => Promise<void>;
  resetTree: (treeId: string) => Promise<void>;
  exportTree: (treeId: string) => void;
  importTree: (treeId: string, file: File) => Promise<void>;
};

function nowMeta(meta: TreeMeta) {
  return { ...meta, updatedAt: Date.now() };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function defaultRootNode(): Node<TreeNodeData> {
  return {
    id: "root",
    type: "process",
    position: { x: 0, y: 0 },
    data: {
      title: "Start here",
      description: "Your main goal goes here",
      notes: "",
      completed: false,
      color: "slate",
      nodeType: "process",
    },
  };
}

export const useTreeStore = create<TreeState>((set, get) => ({
  meta: {
    treeId: "default",
    name: "My Tree",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  nodes: [defaultRootNode()],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },

  selectedNodeId: "root",

  chatScope: { type: "workspace" },

  dailyUses: { used: 0, limit: 10, dayKey: getDayKey() },

  // Progressive build
  isBuilding: false,
  buildToken: 0,

  pendingConnection: null,

  chat: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Tell me what you want to achieve. I will ask a few questions, then you can generate your roadmap.",
      createdAt: Date.now(),
      scope: "workspace",
    } as any,
  ],

  setNodes: (nodes) =>
    set({
      nodes,
      edges: withAutoHandles(nodes, get().edges),
      meta: nowMeta(get().meta),
    }),

  setEdges: (edges) =>
    set({
      edges: withAutoHandles(get().nodes, edges),
      meta: nowMeta(get().meta),
    }),

  onNodesChange: (changes) =>
    set(() => {
      const nextNodes = applyNodeChanges(changes, get().nodes);
      const nextEdges = withAutoHandles(nextNodes, get().edges);

      return {
        nodes: nextNodes,
        edges: nextEdges,
        meta: nowMeta(get().meta),
      };
    }),

  onEdgesChange: (changes) =>
    set(() => {
      const nextEdges = applyEdgeChanges(changes, get().edges);
      return {
        edges: withAutoHandles(get().nodes, nextEdges),
        meta: nowMeta(get().meta),
      };
    }),

  updateEdgeLabel: (edgeId, label) =>
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, label, data: { ...edge.data, label } }
          : edge
      ),
      meta: nowMeta(get().meta),
    }),

  deleteEdge: (edgeId) =>
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
      meta: nowMeta(get().meta),
    }),

  selectNode: (id) => set({ selectedNodeId: id }),

  getSelectedNode: () => {
    const id = get().selectedNodeId;
    if (!id) return null;
    return get().nodes.find((n) => n.id === id) ?? null;
  },

  updateNodeData: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
      ),
      meta: nowMeta(get().meta),
    }),

  addNode: (node) =>
    set({
      nodes: [...get().nodes, node],
      edges: withAutoHandles([...get().nodes, node], get().edges),
      meta: nowMeta(get().meta),
    }),

  addEdge: (edge) =>
    set({
      edges: withAutoHandles(get().nodes, [...get().edges, edge]),
      meta: nowMeta(get().meta),
    }),

  addChildNode: (parentId) =>
    set(() => {
      const parent = get().nodes.find((n) => n.id === parentId);
      if (!parent) return {};

      const newId = nanoid();
      const newNode: Node<TreeNodeData> = {
        id: newId,
        type: "process",
        position: { x: parent.position.x + 240, y: parent.position.y + 120 },
        data: {
          title: "New step",
          description: "",
          notes: "",
          completed: false,
          color: "slate",
          nodeType: "process",
        },
      };

      const handles = pickHandlesByDirection(parent.position, newNode.position);

      const newEdge: Edge = {
        id: `${parentId}-${newId}-${nanoid(4)}`,
        source: parentId,
        target: newId,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: "smoothstep",
        data: { type: "child", label: "" },
        style: { stroke: getConnectionColor("child"), strokeWidth: 2 },
      };

      const nextNodes = [...get().nodes, newNode];
      const nextEdges = withAutoHandles(nextNodes, [...get().edges, newEdge]);

      return {
        nodes: nextNodes,
        edges: nextEdges,
        selectedNodeId: newId,
        meta: nowMeta(get().meta),
      };
    }),

  addMultipleChildren: (parentId, count) =>
    set(() => {
      const parent = get().nodes.find((n) => n.id === parentId);
      if (!parent || count < 1 || count > 10) return {};

      const newNodes: Node<TreeNodeData>[] = [];
      const newEdges: Edge[] = [];

      const spacingY = 120;
      const startY = parent.position.y - ((count - 1) * spacingY) / 2;

      for (let i = 0; i < count; i++) {
        const newId = nanoid();
        const childPos = {
          x: parent.position.x + 280,
          y: startY + i * spacingY,
        };

        newNodes.push({
          id: newId,
          type: "process",
          position: childPos,
          data: {
            title: `Step ${i + 1}`,
            description: "",
            notes: "",
            completed: false,
            color: "slate",
            nodeType: "process",
          },
        });

        const handles = pickHandlesByDirection(parent.position, childPos);

        newEdges.push({
          id: `${parentId}-${newId}-${nanoid(4)}`,
          source: parentId,
          target: newId,
          sourceHandle: handles.sourceHandle,
          targetHandle: handles.targetHandle,
          type: "smoothstep",
          data: { type: "child", label: "" },
          style: { stroke: getConnectionColor("child"), strokeWidth: 2 },
        });
      }

      const nextNodes = [...get().nodes, ...newNodes];
      const nextEdges = withAutoHandles(
        nextNodes,
        [...get().edges, ...newEdges]
      );

      return {
        nodes: nextNodes,
        edges: nextEdges,
        selectedNodeId: newNodes[0]?.id ?? get().selectedNodeId,
        meta: nowMeta(get().meta),
      };
    }),

  addNodeAtPosition: (x, y, nodeType = "process") =>
    set(() => {
      const newId = nanoid();

      const newNode: Node<TreeNodeData> = {
        id: newId,
        type: nodeType,
        position: { x, y },
        data: {
          title:
            nodeType === "decision"
              ? "Decision point"
              : nodeType === "start"
              ? "Start"
              : nodeType === "end"
              ? "End"
              : nodeType === "note"
              ? "Note"
              : "New node",
          description: "",
          notes: "",
          completed: false,
          color: "slate",
          nodeType,
        },
      };

      return {
        nodes: [...get().nodes, newNode],
        selectedNodeId: newId,
        meta: nowMeta(get().meta),
      };
    }),

  addSiblingNode: (nodeId) =>
    set(() => {
      const { nodes, edges } = get();
      const parentMap = buildParentMap(edges);
      const parentId = parentMap.get(nodeId);

      const base = nodes.find((n) => n.id === nodeId);
      if (!base) return {};

      if (!parentId) {
        const newId = nanoid();
        const newNode: Node<TreeNodeData> = {
          id: newId,
          type: "process",
          position: { x: base.position.x + 260, y: base.position.y },
          data: {
            title: "New step",
            description: "",
            notes: "",
            completed: false,
            color: "slate",
            nodeType: "process",
          },
        };

        return {
          nodes: [...nodes, newNode],
          selectedNodeId: newId,
          meta: nowMeta(get().meta),
        };
      }

      const parent = nodes.find((n) => n.id === parentId);
      if (!parent) return {};

      const newId = nanoid();
      const newPos = { x: base.position.x, y: base.position.y + 120 };

      const newNode: Node<TreeNodeData> = {
        id: newId,
        type: "process",
        position: newPos,
        data: {
          title: "New step",
          description: "",
          notes: "",
          completed: false,
          color: "slate",
          nodeType: "process",
        },
      };

      const handles = pickHandlesByDirection(parent.position, newPos);

      const newEdge: Edge = {
        id: `${parentId}-${newId}-${nanoid(4)}`,
        source: parentId,
        target: newId,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: "smoothstep",
        data: { type: "child", label: "" },
        style: { stroke: getConnectionColor("child"), strokeWidth: 2 },
      };

      const nextNodes = [...nodes, newNode];
      const nextEdges = withAutoHandles(nextNodes, [...edges, newEdge]);

      return {
        nodes: nextNodes,
        edges: nextEdges,
        selectedNodeId: newId,
        meta: nowMeta(get().meta),
      };
    }),

  deleteNode: (nodeId) =>
    set(() => {
      const { nodes, edges, selectedNodeId } = get();
      if (nodeId === "root") return {};

      const toDelete = collectSubtreeIds(nodeId, edges);

      const remainingNodes = nodes.filter((n) => !toDelete.has(n.id));
      const remainingEdges = edges.filter(
        (e) => !toDelete.has(e.source) && !toDelete.has(e.target)
      );

      const nextSelected =
        selectedNodeId && toDelete.has(selectedNodeId) ? "root" : selectedNodeId;

      return {
        nodes: remainingNodes,
        edges: withAutoHandles(remainingNodes, remainingEdges),
        selectedNodeId: nextSelected,
        meta: nowMeta(get().meta),
      };
    }),

  duplicateSubtree: (nodeId) =>
    set(() => {
      const { nodes, edges } = get();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return {};

      const parentMap = buildParentMap(edges);
      const parentId = parentMap.get(nodeId) ?? null;

      const subtreeIds = collectSubtreeIds(nodeId, edges);
      const oldToNew = new Map<string, string>();
      for (const id of subtreeIds) oldToNew.set(id, nanoid());

      const offsetX = 320;
      const offsetY = 40;

      const newNodes: Node<TreeNodeData>[] = [];
      for (const oldId of subtreeIds) {
        const oldNode = nodes.find((n) => n.id === oldId);
        if (!oldNode) continue;

        const newId = oldToNew.get(oldId)!;

        newNodes.push({
          ...oldNode,
          id: newId,
          position: {
            x: oldNode.position.x + offsetX,
            y: oldNode.position.y + offsetY,
          },
          data: {
            ...oldNode.data,
            title:
              oldId === nodeId
                ? `${oldNode.data.title} (copy)`
                : oldNode.data.title,
          },
        });
      }

      const newEdges: Edge[] = [];
      for (const e of edges) {
        if (subtreeIds.has(e.source) && subtreeIds.has(e.target)) {
          const ns = oldToNew.get(e.source)!;
          const nt = oldToNew.get(e.target)!;

          const sNode = newNodes.find((n) => n.id === ns);
          const tNode = newNodes.find((n) => n.id === nt);

          const handles =
            sNode && tNode
              ? pickHandlesByDirection(sNode.position, tNode.position)
              : undefined;

          newEdges.push({
            ...e,
            id: `${ns}-${nt}-${nanoid(4)}`,
            source: ns,
            target: nt,
            sourceHandle: handles?.sourceHandle ?? e.sourceHandle,
            targetHandle: handles?.targetHandle ?? e.targetHandle,
          });
        }
      }

      if (parentId) {
        const newRootId = oldToNew.get(nodeId)!;
        const parentNode = nodes.find((n) => n.id === parentId);
        const newRootNode = newNodes.find((n) => n.id === newRootId);

        const handles =
          parentNode && newRootNode
            ? pickHandlesByDirection(parentNode.position, newRootNode.position)
            : undefined;

        newEdges.push({
          id: `${parentId}-${newRootId}-${nanoid(4)}`,
          source: parentId,
          target: newRootId,
          sourceHandle: handles?.sourceHandle,
          targetHandle: handles?.targetHandle,
          type: "smoothstep",
          data: { type: "child", label: "" },
          style: { stroke: getConnectionColor("child"), strokeWidth: 2 },
        });
      }

      const duplicatedRootId = oldToNew.get(nodeId)!;

      const nextNodes = [...nodes, ...newNodes];
      const nextEdges = withAutoHandles(nextNodes, [...edges, ...newEdges]);

      return {
        nodes: nextNodes,
        edges: nextEdges,
        selectedNodeId: duplicatedRootId,
        meta: nowMeta(get().meta),
      };
    }),

  setChatScope: (scope) => set({ chatScope: scope }),

  addChat: (msg) =>
    set({
      chat: [...get().chat, msg],
      meta: nowMeta(get().meta),
    }),

  incrementDailyUse: () =>
    set(() => {
      const d = get().dailyUses;
      return {
        dailyUses: { ...d, used: Math.min(d.used + 1, d.limit) },
      };
    }),

  resetDailyIfNeeded: () =>
    set(() => {
      const dayKey = getDayKey();
      const cur = get().dailyUses;
      if (cur.dayKey === dayKey) return {};
      return { dailyUses: { ...cur, used: 0, dayKey } };
    }),

  setPendingConnection: (connection) => set({ pendingConnection: connection }),

  cancelBuild: () =>
    set({
      buildToken: get().buildToken + 1,
      isBuilding: false,
    }),

  buildFromTree: async (finalNodes, finalEdges, opts = {}) => {
    const rootId = opts.rootId ?? "root";
    const nodeDelayMs = opts.nodeDelayMs ?? 140;
    const edgeDelayMs = opts.edgeDelayMs ?? 80;

    const token = get().buildToken + 1;
    set({ buildToken: token, isBuilding: true });

    const root = finalNodes.find((n) => n.id === rootId) ?? finalNodes[0];
    if (!root) {
      set({ isBuilding: false });
      return;
    }

    set({
      nodes: [root],
      edges: [],
      selectedNodeId: root.id,
      meta: nowMeta(get().meta),
    });

    const order = bfsOrder(root.id, finalNodes, finalEdges);
    const nodeById = new Map(finalNodes.map((n) => [n.id, n]));
    const edgeByTarget = new Map<string, Edge>();
    for (const e of finalEdges) edgeByTarget.set(e.target, e);

    for (let i = 1; i < order.length; i++) {
      if (get().buildToken !== token) {
        set({ isBuilding: false });
        return;
      }

      const id = order[i];
      const rawNode = nodeById.get(id);
      if (!rawNode) continue;

      const nextNode: Node<TreeNodeData> = {
        ...rawNode,
        data: { ...rawNode.data, appear: true } as any,
      };

      set((state) => ({
        nodes: [...state.nodes, nextNode],
        meta: nowMeta(state.meta),
      }));

      await sleep(nodeDelayMs);

      if (get().buildToken !== token) {
        set({ isBuilding: false });
        return;
      }

      const incoming = edgeByTarget.get(id);
      if (incoming) {
        set((state) => {
          const nextEdges = withAutoHandles(state.nodes, [...state.edges, incoming]);
          return { edges: nextEdges, meta: nowMeta(state.meta) };
        });

        await sleep(edgeDelayMs);

        set((state) => ({
          nodes: layoutChildrenSimple(incoming.source, state.nodes, state.edges),
        }));
      }
    }

    set((state) => ({
      edges: withAutoHandles(state.nodes, finalEdges),
      isBuilding: false,
      meta: nowMeta(state.meta),
    }));
  },

  createConnection: (source, target, type, label) =>
    set(() => {
      const { edges, nodes } = get();
      const exists = edges.some((e) => e.source === source && e.target === target);
      if (exists) return { pendingConnection: null };

      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);

      const handles =
        sourceNode && targetNode
          ? pickHandlesByDirection(sourceNode.position, targetNode.position)
          : undefined;

      const newEdge: Edge = {
        id: `${source}-${target}-${nanoid(4)}`,
        source,
        target,
        sourceHandle: handles?.sourceHandle,
        targetHandle: handles?.targetHandle,
        type: "smoothstep",
        data: { type, label: label || "" },
        label: label || (type !== "child" ? type : undefined),
        animated: type === "dependency" || type === "prerequisite",
        style: {
          stroke: getConnectionColor(type),
          strokeWidth: 2,
        },
        labelStyle: {
          fill: "#64748b",
          fontSize: 12,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: "#ffffff",
          fillOpacity: 0.9,
        },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 4,
      };

      const nextEdges = withAutoHandles(nodes, [...edges, newEdge]);

      return {
        edges: nextEdges,
        pendingConnection: null,
        meta: nowMeta(get().meta),
      };
    }),

  layoutChildren: (parentId) =>
    set(() => {
      const nextNodes = layoutChildrenSimple(parentId, get().nodes, get().edges);
      return { nodes: nextNodes, meta: nowMeta(get().meta) };
    }),

  // Persistence

  setViewport: (viewport) => set({ viewport }),

  getPersistableState: () => {
    const state = get();
    return {
      schemaVersion: SCHEMA_VERSION,
      treeId: state.meta.treeId,
      updatedAt: new Date().toISOString(),
      nodes: state.nodes,
      edges: state.edges,
      viewport: state.viewport,
      ui: { selectedNodeId: state.selectedNodeId },
    };
  },

  hydrateFromPersisted: (persisted) => {
    set({
      nodes: persisted.nodes,
      edges: withAutoHandles(persisted.nodes, persisted.edges),
      viewport: persisted.viewport,
      selectedNodeId: persisted.ui?.selectedNodeId || null,
      meta: {
        ...get().meta,
        treeId: persisted.treeId,
        updatedAt: new Date(persisted.updatedAt).getTime(),
      },
    });
  },

  loadTree: async (treeId) => {
    try {
      const persisted = await localStorageAdapter.load(treeId);
      if (persisted) {
        get().hydrateFromPersisted(persisted);
        console.log(`✓ Loaded tree "${treeId}" from localStorage`);
        return true;
      }
      console.log(`No saved state for tree "${treeId}", using defaults`);
      return false;
    } catch (error) {
      console.error("Failed to load tree:", error);
      return false;
    }
  },

  saveTree: async (treeId) => {
    try {
      const state = get().getPersistableState();
      await localStorageAdapter.save(treeId, state);
    } catch (error) {
      console.error("Failed to save tree:", error);
      throw error;
    }
  },

  resetTree: async (treeId) => {
    try {
      await localStorageAdapter.clear(treeId);

      set({
        nodes: [defaultRootNode()],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        selectedNodeId: "root",
        meta: { ...get().meta, treeId, updatedAt: Date.now() },
        isBuilding: false,
      });

      console.log(`✓ Reset tree "${treeId}" to defaults`);
    } catch (error) {
      console.error("Failed to reset tree:", error);
      throw error;
    }
  },

  exportTree: (treeId) => {
    const state = get().getPersistableState();
    const filename = `treeflow-${treeId}-${Date.now()}.json`;
    downloadJSON(filename, state);
    console.log(`✓ Exported tree "${treeId}" as ${filename}`);
  },

  importTree: async (treeId, file) => {
    try {
      const data = await readJSONFile(file);
      if (!validatePersistedState(data)) {
        throw new Error("Invalid TreeFlow data format");
      }

      get().hydrateFromPersisted(data);
      await localStorageAdapter.save(treeId, data);

      console.log(`✓ Imported tree from ${file.name}`);
    } catch (error) {
      console.error("Failed to import tree:", error);
      throw error;
    }
  },
}));
