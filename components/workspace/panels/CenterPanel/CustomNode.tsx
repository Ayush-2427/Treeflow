import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";

const colorClasses = {
  slate: {
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-900",
    badge: "bg-slate-500",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-900",
    badge: "bg-blue-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-900",
    badge: "bg-green-500",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-900",
    badge: "bg-purple-500",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-900",
    badge: "bg-orange-500",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-900",
    badge: "bg-red-500",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-300",
    text: "text-pink-900",
    badge: "bg-pink-500",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-900",
    badge: "bg-yellow-500",
  },
};

function CustomNode({ data, selected }: NodeProps<TreeNodeData>) {
  const color = data.color || "slate";
  const styles = colorClasses[color as keyof typeof colorClasses] || colorClasses.slate;

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 shadow-sm transition-all min-w-[180px] ${
        styles.bg
      } ${styles.border} ${selected ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600"
      />

      {/* Color Badge */}
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${styles.badge}`} />
        {data.completed && (
          <span className="text-xs">✓</span>
        )}
      </div>

      {/* Title */}
      <div className={`font-medium text-sm ${styles.text}`}>
        {data.title}
      </div>

      {/* Description Preview */}
      {data.description && (
        <div className="text-xs text-slate-500 mt-1 line-clamp-2">
          {data.description}
        </div>
      )}
    </div>
  );
}

export default memo(CustomNode);