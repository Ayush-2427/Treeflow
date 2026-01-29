import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../../lib/tree/types";
import { getNodeColorStyle } from "../../../../lib/tree/color";

const handleClass =
  "!w-3 !h-3 !bg-white !border-2 !border-slate-400 !shadow-sm !z-20 " +
  "hover:!bg-slate-700 hover:!border-slate-700 hover:scale-125 transition-all duration-150";

function DecisionNode({ data, selected }: NodeProps<TreeNodeData>) {
  const { cardStyle, titleStyle, intensifyClassName } =
    getNodeColorStyle(data.color, { selected });

  return (
    <div className={`relative ${intensifyClassName}`} style={{ width: 170, height: 170 }}>
      <div
        className="absolute inset-0 border-2 shadow-md backdrop-blur-sm"
        style={{
          transform: "rotate(45deg)",
          transformOrigin: "center",
          zIndex: 0,
          ...(cardStyle ?? {}),
        }}
      />

      <Handle 
        type="target" 
        position={Position.Left} 
        className={handleClass} 
        style={{ left: -6, top: "50%" }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className={handleClass} 
        style={{ right: -6, top: "50%" }} 
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        className={handleClass} 
        style={{ top: -6, left: "50%", transform: "translateX(-50%)" }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={handleClass} 
        style={{ bottom: -6, left: "50%", transform: "translateX(-50%)" }} 
      />

      <div className="absolute inset-0 flex items-center justify-center p-8" style={{ zIndex: 10 }}>
        <div className="text-center font-semibold text-sm leading-snug" style={titleStyle}>
          {data.title || "Decision"}
        </div>
      </div>
    </div>
  );
}

export default memo(DecisionNode);