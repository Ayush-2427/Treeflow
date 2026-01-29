import type { Node, Edge, Viewport } from "reactflow";
import type { TreeNodeData } from "../types";

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY_PREFIX = "treeflow:v1:tree:";

export interface TreeflowPersistedState {
  schemaVersion: number;
  treeId: string;
  updatedAt: string;
  nodes: Node<TreeNodeData>[];
  edges: Edge[];
  viewport: Viewport;
  ui?: {
    selectedNodeId: string | null;
  };
}

export interface TreePersistenceAdapter {
  load(treeId: string): Promise<TreeflowPersistedState | null>;
  save(treeId: string, state: TreeflowPersistedState): Promise<void>;
  clear(treeId: string): Promise<void>;
}

/**
 * Validate that loaded data matches expected structure
 */
export function validatePersistedState(
  data: any
): data is TreeflowPersistedState {
  if (!data || typeof data !== "object") return false;
  
  if (typeof data.schemaVersion !== "number") return false;
  if (typeof data.treeId !== "string") return false;
  if (typeof data.updatedAt !== "string") return false;
  
  if (!Array.isArray(data.nodes)) return false;
  if (!Array.isArray(data.edges)) return false;
  
  if (!data.viewport || typeof data.viewport !== "object") return false;
  if (typeof data.viewport.x !== "number") return false;
  if (typeof data.viewport.y !== "number") return false;
  if (typeof data.viewport.zoom !== "number") return false;
  
  return true;
}

/**
 * Migrate old schema versions to current
 * Returns migrated state or null if migration fails
 */
export function migratePersistedState(
  data: TreeflowPersistedState
): TreeflowPersistedState | null {
  // Currently only version 1 exists
  if (data.schemaVersion === SCHEMA_VERSION) {
    return data;
  }
  
  // Future: handle migrations from older versions
  // if (data.schemaVersion === 0) {
  //   return migrateV0ToV1(data);
  // }
  
  console.warn(`Unknown schema version: ${data.schemaVersion}`);
  return null;
}