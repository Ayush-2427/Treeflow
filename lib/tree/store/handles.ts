import type { Edge, Node } from "reactflow";
import type { TreeNodeData } from "../types";

type XY = { x: number; y: number };

export function pickHandlesByDirection(sourcePos: XY, targetPos: XY) {
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;

  // Mostly horizontal
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: "r-s", targetHandle: "l" }
      : { sourceHandle: "l-s", targetHandle: "r" };
  }

  // Mostly vertical
  return dy >= 0
    ? { sourceHandle: "b-s", targetHandle: "t" }
    : { sourceHandle: "t-s", targetHandle: "b" };
}

export function withAutoHandles(
  nodes: Node<TreeNodeData>[],
  edges: Edge[]
): Edge[] {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  return edges.map((e) => {
    const s = nodeById.get(e.source);
    const t = nodeById.get(e.target);
    if (!s || !t) return e;

    // If an edge already has explicit handles, keep them
    if (e.sourceHandle && e.targetHandle) return e;

    const { sourceHandle, targetHandle } = pickHandlesByDirection(
      s.position,
      t.position
    );

    return { ...e, sourceHandle, targetHandle };
  });
}
