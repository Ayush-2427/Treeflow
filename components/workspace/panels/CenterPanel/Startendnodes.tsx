import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";

const colorClasses = {
  slate: { bg: "bg-slate-100", border: "border-slate-400", text: "text-slate-900" },
  blue: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-900" },
  green: { bg: "bg-green-100", border: "border-green-400", text: "text-green-900" },
  purple: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-900" },
  orange: { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-900" },
  red: { bg: "bg-red-100", border: "border-red-400", text: "text-red-900" },
  pink: { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-900" },
  yellow: { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-900" },
};

export const StartNode = memo(({ data, selected }: NodeProps<TreeNodeData>) => {
  const color = data.color || "green";
  const styles = colorClasses[color as keyof typeof colorClasses] || colorClasses.green;

  return (
    <div
      className={`px-6 py-3 rounded-full border-2 shadow-sm transition-all min-w-[140px] ${
        styles.bg
      } ${styles.border} ${selected ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />

      <div className="text-center">
        <div className={`font-bold text-sm ${styles.text} whitespace-nowrap`}>
          🚀 {data.title}
        </div>
      </div>
    </div>
  );
});

export const EndNode = memo(({ data, selected }: NodeProps<TreeNodeData>) => {
  const color = data.color || "red";
  const styles = colorClasses[color as keyof typeof colorClasses] || colorClasses.red;

  return (
    <div
      className={`px-6 py-3 rounded-full border-2 shadow-sm transition-all min-w-[140px] ${
        styles.bg
      } ${styles.border} ${selected ? "ring-2 ring-slate-900 ring-offset-2" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />

      <div className="text-center">
        <div className={`font-bold text-sm ${styles.text} whitespace-nowrap`}>
          🏁 {data.title}
        </div>
      </div>
    </div>
  );
});

StartNode.displayName = "StartNode";
EndNode.displayName = "EndNode";