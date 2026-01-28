import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";

const colorClasses = {
  slate: { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-900" },
  blue: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900" },
  green: { bg: "bg-green-50", border: "border-green-300", text: "text-green-900" },
  purple: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-900" },
  orange: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-900" },
  red: { bg: "bg-red-50", border: "border-red-300", text: "text-red-900" },
  pink: { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-900" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-900" },
};

function DecisionNode({ data, selected }: NodeProps<TreeNodeData>) {
  const color = data.color || "slate";
  const styles = colorClasses[color as keyof typeof colorClasses] || colorClasses.slate;

  return (
    <div className="relative" style={{ width: 160, height: 160 }}>
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ left: 0, top: "50%" }}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ right: 0, top: "50%" }}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ bottom: 0, left: "50%" }}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: 0, left: "50%" }}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />

      {/* Diamond shape */}
      <div
        className={`absolute inset-0 ${styles.bg} ${styles.border} border-2 shadow-sm transition-all ${
          selected ? "ring-2 ring-slate-900 ring-offset-2" : ""
        }`}
        style={{
          transform: "rotate(45deg)",
          transformOrigin: "center",
        }}
      />

      {/* Content (counter-rotated to keep text upright) */}
      <div
        className="absolute inset-0 flex items-center justify-center p-6"
      >
        <div className={`text-center font-medium text-sm leading-tight ${styles.text}`}>
          {data.title}
        </div>
      </div>
    </div>
  );
}

export default memo(DecisionNode);