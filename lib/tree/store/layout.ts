import type { Edge, Node } from "reactflow";
import type { TreeNodeData } from "../types";

export function layoutChildrenSimple(
  parentId: string,
  nodes: Node<TreeNodeData>[],
  edges: Edge[]
) {
  const parent = nodes.find((n) => n.id === parentId);
  if (!parent) return nodes;

  const childIds = edges.filter((e) => e.source === parentId).map((e) => e.target);
  if (!childIds.length) return nodes;

  const spacingY = 120;
  const startY = parent.position.y - ((childIds.length - 1) * spacingY) / 2;

  return nodes.map((n) => {
    const idx = childIds.indexOf(n.id);
    if (idx === -1) return n;

    return {
      ...n,
      position: { x: parent.position.x + 280, y: startY + idx * spacingY },
    };
  });
}
