import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";

function NoteNode({ data, selected }: NodeProps<TreeNodeData>) {
  const color = data.color || "yellow";
  
  const bgColors: Record<string, string> = {
    slate: "bg-slate-100",
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
    red: "bg-red-100",
    pink: "bg-pink-100",
    yellow: "bg-yellow-100",
  };

  const bg = bgColors[color] || bgColors.yellow;

  return (
    <div
      className={`${bg} border-t-4 border-yellow-400 shadow-md transition-all min-w-[200px] max-w-[240px] ${
        selected ? "ring-2 ring-slate-900 ring-offset-2" : ""
      }`}
      style={{
        borderRadius: "2px 2px 4px 4px",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white hover:!bg-slate-600 hover:scale-125 transition-transform"
      />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📝</span>
          <div className="font-semibold text-sm text-slate-700">
            {data.title}
          </div>
        </div>

        {data.description && (
          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {data.description}
          </div>
        )}

        {data.notes && (
          <div className="mt-2 pt-2 border-t border-yellow-300 text-xs text-slate-500">
            {data.notes}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(NoteNode);