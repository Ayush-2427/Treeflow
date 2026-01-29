import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";
import { getNodeColorStyle } from "../../../../lib/tree/color";

const handleClass =
  "!w-3 !h-3 !bg-slate-300 !border-2 !border-white/90 " +
  "hover:!bg-slate-700 hover:scale-125 transition-transform duration-150";

function CustomNode({ data, selected }: NodeProps<TreeNodeData>) {
  const { cardStyle, titleStyle, badgeStyle, intensifyClassName } =
    getNodeColorStyle(data.color, { selected });

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 shadow-sm min-w-[180px] ${intensifyClassName}`}
      style={cardStyle}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />
      <Handle type="source" position={Position.Right} className={handleClass} />
      <Handle type="source" position={Position.Bottom} className={handleClass} />
      <Handle type="target" position={Position.Top} className={handleClass} />

      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={badgeStyle} />
        {data.completed && <span className="text-xs">✓</span>}
      </div>

      <div className="font-medium text-sm" style={titleStyle}>
        {data.title}
      </div>

      {data.description && (
        <div className="text-xs text-slate-500 mt-1 line-clamp-2">
          {data.description}
        </div>
      )}
    </div>
  );
}

export default memo(CustomNode);
