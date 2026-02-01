"use client";

import type { Node } from "reactflow";
import type { NodeType } from "../../../../lib/tree/types";

type ContextMenuState = {
  isOpen: boolean;
  position: { x: number; y: number };
  flowPosition: { x: number; y: number };
};

type EdgeMenuState = {
  isOpen: boolean;
  edgeId: string | null;
  position: { x: number; y: number };
};

type CanvasMenusProps = {
  contextMenu: ContextMenuState;
  edgeMenu: EdgeMenuState;

  onAddNode: (nodeType: NodeType) => void;

  edges: any[];
  onEditEdgeLabel: (edgeId: string, nextLabel: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onCloseEdgeMenu: () => void;
};

export default function CanvasMenus({
  contextMenu,
  edgeMenu,
  onAddNode,
  edges,
  onEditEdgeLabel,
  onDeleteEdge,
  onCloseEdgeMenu,
}: CanvasMenusProps) {
  return (
    <>
      {contextMenu.isOpen && (
        <div
          className="absolute z-50 min-w-[200px] rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm py-2 shadow-2xl"
          style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1 border-b border-slate-100 px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Add Node
          </div>

          <button
            onClick={() => onAddNode("process")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <span className="text-lg">▭</span>
            <span>Process</span>
          </button>

          <button
            onClick={() => onAddNode("decision")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <span className="text-lg">◆</span>
            <span>Decision</span>
          </button>

          <button
            onClick={() => onAddNode("start")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <span className="text-lg">🚀</span>
            <span>Start</span>
          </button>

          <button
            onClick={() => onAddNode("end")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <span className="text-lg">🏁</span>
            <span>End</span>
          </button>

          <button
            onClick={() => onAddNode("note")}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <span className="text-lg">📝</span>
            <span>Note</span>
          </button>
        </div>
      )}

      {edgeMenu.isOpen && edgeMenu.edgeId && (
        <div
          className="absolute z-50 min-w-[220px] rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm py-2 shadow-2xl"
          style={{ top: edgeMenu.position.y, left: edgeMenu.position.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1 border-b border-slate-100 px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Connection
          </div>

          <button
            onClick={() => {
              const current = edges.find((e) => e.id === edgeMenu.edgeId);
              const currentLabel =
                (current?.data as any)?.label ?? (current?.label as string) ?? "";
              const next = window.prompt("Edit label:", currentLabel);
              if (next !== null) onEditEdgeLabel(edgeMenu.edgeId!, next);
              onCloseEdgeMenu();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            <span className="text-lg">✏️</span>
            <span>Edit label</span>
          </button>

          <button
            onClick={() => {
              const ok = window.confirm("Delete this connection?");
              if (ok) onDeleteEdge(edgeMenu.edgeId!);
              onCloseEdgeMenu();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            type="button"
          >
            <span className="text-lg">🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
}
