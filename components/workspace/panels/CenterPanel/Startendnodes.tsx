import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";
import { getNodeColorStyle } from "../../../../lib/tree/color";

const handleClass =
  "!w-3 !h-3 !bg-white !border-2 !border-slate-400 !shadow-sm " +
  "hover:!bg-slate-700 hover:!border-slate-700 hover:scale-125 transition-all duration-150";

export const StartNode = memo(({ data, selected }: NodeProps<TreeNodeData>) => {
  const { cardStyle, titleStyle, intensifyClassName } =
    getNodeColorStyle(data.color ?? "#22C55E", { selected });

  return (
    <div
      className={`px-6 py-3.5 rounded-full border-2 shadow-md min-w-[160px] backdrop-blur-sm ${intensifyClassName}`}
      style={cardStyle}
    >
      <Handle type="source" position={Position.Right} className={handleClass} />
      <Handle type="source" position={Position.Bottom} className={handleClass} />

      <div className="text-center">
        <div className="font-bold text-sm whitespace-nowrap" style={titleStyle}>
          🚀 {data.title || "Start"}
        </div>
      </div>
    </div>
  );
});

export const EndNode = memo(({ data, selected }: NodeProps<TreeNodeData>) => {
  const { cardStyle, titleStyle, intensifyClassName } =
    getNodeColorStyle(data.color ?? "#EF4444", { selected });

  return (
    <div
      className={`px-6 py-3.5 rounded-full border-2 shadow-md min-w-[160px] backdrop-blur-sm ${intensifyClassName}`}
      style={cardStyle}
    >
      <Handle type="target" position={Position.Left} className={handleClass} />
      <Handle type="target" position={Position.Top} className={handleClass} />

      <div className="text-center">
        <div className="font-bold text-sm whitespace-nowrap" style={titleStyle}>
          🏁 {data.title || "End"}
        </div>
      </div>
    </div>
  );
});

StartNode.displayName = "StartNode";
EndNode.displayName = "EndNode";