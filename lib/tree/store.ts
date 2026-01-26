import { create } from "zustand";
import type { Edge, Node } from "reactflow";
import type { ChatMessage, TreeMeta, TreeNodeData } from "./types";
import { nanoid } from "nanoid";

type TreeState = {
  meta: TreeMeta;

  nodes: Node<TreeNodeData>[];
  edges: Edge[];
  

  selectedNodeId: string | null;

  chat: ChatMessage[];
  addChildNode: (parentId: string) => void;


  setNodes: (nodes: Node<TreeNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  selectNode: (id: string | null) => void;

  updateNodeData: (id: string, patch: Partial<TreeNodeData>) => void;
  addNode: (node: Node<TreeNodeData>) => void;
  addEdge: (edge: Edge) => void;

  addChat: (msg: ChatMessage) => void;
};

export const useTreeStore = create<TreeState>((set, get) => ({
  meta: {
    treeId: "local-tree",
    name: "My Tree",
    createdAt: Date.now(),
    updatedAt: Date.now()
  },

  nodes: [
    {
      id: "root",
      type: "default",
      position: { x: 0, y: 0 },
      data: { title: "Start here", description: "Your main goal goes here", completed: false }
    }
  ],
  edges: [],

  selectedNodeId: "root",

  chat: [
    {
      id: "welcome",
      role: "assistant",
      content: "Tell me what you want to achieve. I will ask a few questions, then you can generate your roadmap.",
      createdAt: Date.now()
    }
  ],

  setNodes: (nodes) =>
    set({
      nodes,
      meta: { ...get().meta, updatedAt: Date.now() }
    }),

  setEdges: (edges) =>
    set({
      edges,
      meta: { ...get().meta, updatedAt: Date.now() }
    }),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, patch) =>
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
      meta: { ...get().meta, updatedAt: Date.now() }
    }),

  addNode: (node) =>
    set({
      nodes: [...get().nodes, node],
      meta: { ...get().meta, updatedAt: Date.now() }
    }),

    addChildNode: (parentId: string) =>
  set(() => {
    const parent = get().nodes.find((n) => n.id === parentId);
    if (!parent) return {};

    const newId = nanoid();

    const newNode = {
      id: newId,
      type: "default",
      position: {
        x: parent.position.x,
        y: parent.position.y + 120
      },
      data: {
        title: "New step",
        completed: false
      }
    };

    const newEdge = {
      id: `${parentId}-${newId}`,
      source: parentId,
      target: newId
    };

    return {
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
      selectedNodeId: newId,
      meta: { ...get().meta, updatedAt: Date.now() }
    };
  }),


  addEdge: (edge) =>
    set({
      edges: [...get().edges, edge],
      meta: { ...get().meta, updatedAt: Date.now() }
    }),

  addChat: (msg) => set({ chat: [...get().chat, msg] })
}));
