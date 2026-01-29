import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";
import { getNodeColorStyle } from "../../../../lib/tree/color";

const handleClass =
  "!w-3 !h-3 !bg-white !border-2 !border-slate-400 !shadow-sm " +
  "hover:!bg-slate-700 hover:!border-slate-700 hover:scale-125 transition-all duration-150";

function NoteNode({ data, selected }: NodeProps<TreeNodeData>) {
  const { cardStyle, titleStyle, badgeStyle, intensifyClassName } =
    getNodeColorStyle(data.color ?? "#F59E0B", { selected });

  return (
    <div
      className={`px-4 py-3.5 rounded-2xl border-2 shadow-md min-w-[200px] max-w-[280px] backdrop-blur-sm ${intensifyClassName}`}
      style={cardStyle}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />
      <Handle type="source" position={Position.Right} className={handleClass} />
      <Handle type="source" position={Position.Bottom} className={handleClass} />
      <Handle type="target" position={Position.Top} className={handleClass} />

      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={badgeStyle} />
        <span className="text-xs font-medium opacity-60" style={titleStyle}>NOTE</span>
      </div>

      <div className="font-semibold text-sm leading-snug mb-1" style={titleStyle}>
        {data.title || "Note"}
      </div>

      {data.description && (
        <div className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed opacity-90">
          {data.description}
        </div>
      )}
    </div>
  );
}

export default memo(NoteNode);