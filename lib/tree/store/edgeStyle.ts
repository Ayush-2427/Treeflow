import type { ConnectionType } from "../types";

export function getConnectionColor(type: ConnectionType): string {
  switch (type) {
    case "child":
      return "#64748b";
    case "branch":
      return "#3b82f6";
    case "dependency":
      return "#f59e0b";
    case "prerequisite":
      return "#ef4444";
    case "reference":
      return "#8b5cf6";
    default:
      return "#64748b";
  }
}
