"use client";

import { useEffect, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";

import { useTreeStore } from "../../../../lib/tree/store";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState<string>(
    (data?.label as string) || (label as string) || ""
  );

  const updateEdgeLabel = useTreeStore((s) => s.updateEdgeLabel);

  useEffect(() => {
    setEditLabel((data?.label as string) || (label as string) || "");
  }, [data?.label, label]);

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleLabelSubmit = () => {
    updateEdgeLabel(id, editLabel.trim());
    setIsEditing(false);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={handleLabelSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLabelSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="px-3 py-1.5 text-xs border-2 border-blue-500 rounded-lg bg-white shadow-lg outline-none font-medium"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              onDoubleClick={handleLabelDoubleClick}
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 hover:border-slate-400 hover:shadow transition-all"
              title="Double-click to edit"
            >
              {editLabel || "empty"}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
