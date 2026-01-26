export type NodeGroup = {
  id: string;
  name: string;
};

export type TreeNodeData = {
  title: string;
  description?: string;
  completed?: boolean;
  groupId?: string;
};

export type TreeMeta = {
  treeId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
};
