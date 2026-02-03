export type NodeType = "process" | "decision" | "start" | "end" | "note";

export interface TreeNodeData {
  title: string;
  description?: string;
  notes?: string;
  completed: boolean;
  color?: string; // accepts hex like "#3B82F6" OR theme name like "slate"
  nodeType: NodeType;
  iconKey?: string; // key into NODE_ICONS
}

export type ConnectionType =
  | "child"
  | "branch"
  | "dependency"
  | "prerequisite"
  | "reference";

export interface ConnectionData {
  type: ConnectionType;
  label?: string;
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
  scope: string;
}
