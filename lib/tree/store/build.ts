import type { Edge, Node } from "reactflow";
import type { TreeNodeData } from "../types";

export function buildChildrenMap(edges: Edge[]) {
  const map = new Map<string, string[]>();
  for (const e of edges) {
    if (!map.has(e.source)) map.set(e.source, []);
    map.get(e.source)!.push(e.target);
  }
  return map;
}

export function bfsOrder(rootId: string, nodes: Node<TreeNodeData>[], edges: Edge[]) {
  const children = buildChildrenMap(edges);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const order: string[] = [];
  const q: string[] = [rootId];
  const seen = new Set<string>();

  while (q.length) {
    const id = q.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    if (byId.has(id)) order.push(id);

    const kids = children.get(id) ?? [];
    for (const k of kids) q.push(k);
  }

  return order;
}
