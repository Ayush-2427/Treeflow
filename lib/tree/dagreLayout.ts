// FILE 1: lib/tree/layout/dagreLayout.ts
import dagre from "dagre";
import type { Edge, Node } from "reactflow";

/**
 * One-time layout for a tree-like graph.
 * Use this after AI generates structure, then persist positions (Option 1).
 */
export function layoutWithDagre(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: "TB",
    nodesep: 120,
    ranksep: 200,
    marginx: 80,
    marginy: 80,
  });

  // Tune these to match your node card size
  const NODE_WIDTH = 300;
  const NODE_HEIGHT = 110;

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const laidOutNodes = nodes.map((node) => {
    const p = g.node(node.id);
    return {
      ...node,
      position: { x: p.x - NODE_WIDTH / 2, y: p.y - NODE_HEIGHT / 2 },
      sourcePosition: "bottom",
      targetPosition: "top",
    } as Node;
  });

  return { nodes: laidOutNodes, edges };
}
