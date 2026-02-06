import type { Edge } from "reactflow";

export function buildChildrenMap(edges: Edge[]) {
  const map = new Map<string, string[]>();
  for (const e of edges) {
    if (!map.has(e.source)) map.set(e.source, []);
    map.get(e.source)!.push(e.target);
  }
  return map;
}

export function buildParentMap(edges: Edge[]) {
  const map = new Map<string, string>();
  for (const e of edges) map.set(e.target, e.source);
  return map;
}

export function collectSubtreeIds(rootId: string, edges: Edge[]) {
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
