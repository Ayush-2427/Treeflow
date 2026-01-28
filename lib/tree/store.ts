import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges } from "reactflow";
import type { Edge, Node, NodeChange, EdgeChange } from "reactflow";
import type {
  ChatMessage,
  TreeMeta,
  TreeNodeData,
  ConnectionType,
  NodeType,
} from "./types";
import { nanoid } from "nanoid";

type ChatScope = { type: "workspace" } | { type: "node"; nodeId: string };

type TreeState = {
  meta: TreeMeta;

  nodes: Node<TreeNodeData>[];
  edges: Edge[];

  selectedNodeId: string | null;

  chat: ChatMessage[];
  chatScope: ChatScope;

  dailyUses: { used: number; limit: number; dayKey: string };

  // Connection modal state
  pendingConnection: { source: string; target: string } | null;
  setPendingConnection: (
    connection: { source: string; target: string } | null
  ) => void;
  createConnection: (
    source: string,
    target: string,
    type: ConnectionType,
    label?: string
  ) => void;

  // Edge label editing
  updateEdgeLabel: (edgeId: string, label: string) => void;
  deleteEdge: (edgeId: string) => void;

  setNodes: (nodes: Node<TreeNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  // React Flow change handlers (dragging, selection, etc.)
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
};

function getDayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildChildrenMap(edges: Edge[]) {
  const map = new Map<string, string[]>();
  for (const e of edges) {
    if (!map.has(e.source)) map.set(e.source, []);
    map.get(e.source)!.push(e.target);
  }
  return map;
}

function buildParentMap(edges: Edge[]) {
  const map = new Map<string, string>();
  for (const e of edges) map.set(e.target, e.source);
  return map;
}

function collectSubtreeIds(rootId: string, edges: Edge[]) {
  const childrenMap = buildChildrenMap(edges);
  const stack = [rootId];
  const visited = new Set<string>();
  while (stack.length) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const kids = childrenMap.get(id) ?? [];
    for (const k of kids) stack.push(k);
  }
  return visited;
}

function getConnectionColor(type: ConnectionType): string {
  switch (type) {
    case "child":
      return "#64748b"; // slate
    case "branch":
      return "#3b82f6"; // blue
    case "dependency":
      return "#f59e0b"; // amber
    case "prerequisite":
      return "#ef4444"; // red
    case "reference":
      return "#8b5cf6"; // purple
    default:
      return "#64748b";
  }
}

export const useTreeStore = create<TreeState>((set, get) => ({
  meta: {
    treeId: "local-tree",
    name: "My Tree",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },

  nodes: [
    {
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
    },
  ],
  edges: [],

  selectedNodeId: "root",

  chatScope: { type: "workspace" },

  dailyUses: { used: 0, limit: 10, dayKey: getDayKey() },

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
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  setEdges: (edges) =>
    set({
      edges,
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  onNodesChange: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  onEdgesChange: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges),
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  updateEdgeLabel: (edgeId: string, label: string) =>
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId ? { ...edge, label, data: { ...edge.data, label } } : edge
      ),
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  deleteEdge: (edgeId: string) =>
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
      meta: { ...get().meta, updatedAt: Date.now() },
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
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  addNode: (node) =>
    set({
      nodes: [...get().nodes, node],
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  addEdge: (edge) =>
    set({
      edges: [...get().edges, edge],
      meta: { ...get().meta, updatedAt: Date.now() },
    }),

  addChildNode: (parentId: string) =>
    set(() => {
      const parent = get().nodes.find((n) => n.id === parentId);
      if (!parent) return {};

      const newId = nanoid();

      const newNode: Node<TreeNodeData> = {
        id: newId,
        type: "process",
        position: {
          x: parent.position.x + 240,
          y: parent.position.y + 120,
        },
        data: {
          title: "New step",
          description: "",
          notes: "",
          completed: false,
          color: "slate",
          nodeType: "process",
        } as TreeNodeData,
      };

      const newEdge: Edge = {
        id: `${parentId}-${newId}`,
        source: parentId,
        target: newId,
      };

      return {
        nodes: [...get().nodes, newNode],
        edges: [...get().edges, newEdge],
        selectedNodeId: newId,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  addMultipleChildren: (parentId: string, count: number) =>
    set(() => {
      const parent = get().nodes.find((n) => n.id === parentId);
      if (!parent || count < 1 || count > 10) return {};

      const newNodes: Node<TreeNodeData>[] = [];
      const newEdges: Edge[] = [];

      const spacingY = 120;
      const startY = parent.position.y - ((count - 1) * spacingY) / 2;

      for (let i = 0; i < count; i++) {
        const newId = nanoid();

        newNodes.push({
          id: newId,
          type: "process",
          position: {
            x: parent.position.x + 280,
            y: startY + i * spacingY,
          },
          data: {
            title: `Step ${i + 1}`,
            description: "",
            notes: "",
            completed: false,
            color: "slate",
            nodeType: "process",
          } as TreeNodeData,
        });

        newEdges.push({
          id: `${parentId}-${newId}`,
          source: parentId,
          target: newId,
        });
      }

      return {
        nodes: [...get().nodes, ...newNodes],
        edges: [...get().edges, ...newEdges],
        selectedNodeId: newNodes[0].id,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  addNodeAtPosition: (x: number, y: number, nodeType: NodeType = "process") =>
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
        } as TreeNodeData,
      };

      return {
        nodes: [...get().nodes, newNode],
        selectedNodeId: newId,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  addSiblingNode: (nodeId: string) =>
    set(() => {
      const { nodes, edges } = get();
      const parentMap = buildParentMap(edges);
      const parentId = parentMap.get(nodeId);

      if (!parentId) {
        const base = nodes.find((n) => n.id === nodeId);
        if (!base) return {};

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
          } as TreeNodeData,
        };

        return {
          nodes: [...nodes, newNode],
          selectedNodeId: newId,
          meta: { ...get().meta, updatedAt: Date.now() },
        };
      }

      const base = nodes.find((n) => n.id === nodeId);
      const parent = nodes.find((n) => n.id === parentId);
      if (!base || !parent) return {};

      const newId = nanoid();
      const newNode: Node<TreeNodeData> = {
        id: newId,
        type: "process",
        position: { x: base.position.x, y: base.position.y + 120 },
        data: {
          title: "New step",
          description: "",
          notes: "",
          completed: false,
          color: "slate",
          nodeType: "process",
        } as TreeNodeData,
      };

      const newEdge: Edge = {
        id: `${parentId}-${newId}`,
        source: parentId,
        target: newId,
      };

      return {
        nodes: [...nodes, newNode],
        edges: [...edges, newEdge],
        selectedNodeId: newId,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  deleteNode: (nodeId: string) =>
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
        edges: remainingEdges,
        selectedNodeId: nextSelected,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  duplicateSubtree: (nodeId: string) =>
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
            title: oldId === nodeId ? `${oldNode.data.title} (copy)` : oldNode.data.title,
          },
        });
      }

      const newEdges: Edge[] = [];
      for (const e of edges) {
        if (subtreeIds.has(e.source) && subtreeIds.has(e.target)) {
          newEdges.push({
            ...e,
            id: `${oldToNew.get(e.source)}-${oldToNew.get(e.target)}`,
            source: oldToNew.get(e.source)!,
            target: oldToNew.get(e.target)!,
          });
        }
      }

      if (parentId) {
        const newRootId = oldToNew.get(nodeId)!;
        newEdges.push({
          id: `${parentId}-${newRootId}`,
          source: parentId,
          target: newRootId,
        });
      }

      const duplicatedRootId = oldToNew.get(nodeId)!;

      return {
        nodes: [...nodes, ...newNodes],
        edges: [...edges, ...newEdges],
        selectedNodeId: duplicatedRootId,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  setChatScope: (scope) => set({ chatScope: scope }),

  addChat: (msg) =>
    set({
      chat: [...get().chat, msg],
      meta: { ...get().meta, updatedAt: Date.now() },
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

  createConnection: (source: string, target: string, type: ConnectionType, label?: string) =>
    set(() => {
      const { edges } = get();

      const exists = edges.some((e) => e.source === source && e.target === target);
      if (exists) return { pendingConnection: null };

      const newEdge: Edge = {
        id: `${source}-${target}-${nanoid(4)}`,
        source,
        target,
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

      return {
        edges: [...edges, newEdge],
        pendingConnection: null,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),

  layoutChildren: (parentId: string) =>
    set(() => {
      const { nodes, edges } = get();
      const parent = nodes.find((n) => n.id === parentId);
      if (!parent) return {};

      const childIds = edges.filter((e) => e.source === parentId).map((e) => e.target);
      if (!childIds.length) return {};

      const spacingY = 120;
      const startY = parent.position.y - ((childIds.length - 1) * spacingY) / 2;

      const updated = nodes.map((n) => {
        const idx = childIds.indexOf(n.id);
        if (idx === -1) return n;
        return {
          ...n,
          position: { x: parent.position.x + 280, y: startY + idx * spacingY },
        };
      });

      return {
        nodes: updated,
        meta: { ...get().meta, updatedAt: Date.now() },
      };
    }),
}));
