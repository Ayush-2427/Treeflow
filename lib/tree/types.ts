export type NodeType = "process" | "decision" | "start" | "end" | "note";

export interface TreeNodeData {
  title: string;
  description?: string;
  notes?: string;
  completed: boolean;
  color?: string;
  nodeType: NodeType; // Type of flowchart node
}

export type ConnectionType = "child" | "branch" | "dependency" | "prerequisite" | "reference";

export interface ConnectionData {
  type: ConnectionType;
  label?: string; // Edge label for conditions
}

export interface TreeMeta {
  treeId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  scope: string; // "workspace" or "node:nodeId"
}