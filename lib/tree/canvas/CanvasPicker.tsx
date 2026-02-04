"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  useCanvases,
  useActiveCanvasId,
  useSetActiveCanvas,
  useAddCanvas,
  useRenameCanvas,
  useDeleteCanvas,
} from "./canvas.selectors";

export default function CanvasPicker() {
  const canvases = useCanvases();
  const activeId = useActiveCanvasId();

  const setActiveCanvas = useSetActiveCanvas();
  const addCanvas = useAddCanvas();
  const renameCanvas = useRenameCanvas();
  const deleteCanvas = useDeleteCanvas();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeCanvas = useMemo(
    () => canvases.find((c) => c.id === activeId) ?? null,
    [canvases, activeId]
  );

  useEffect(() => {
    if (!editingId) return;
    queueMicrotask(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [editingId]);

  const startRename = (id: string) => {
    const c = canvases.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setDraftName(c.name);
  };

  const commitRename = () => {
    if (!editingId) return;

    const next = draftName.trim();
    if (!next) {
      const original = canvases.find((c) => c.id === editingId)?.name ?? "";
      setDraftName(original);
      setEditingId(null);
      return;
    }

    renameCanvas(editingId, next);
    setEditingId(null);
  };

  const cancelRename = () => {
    setEditingId(null);
    setDraftName("");
  };

  const handleAdd = () => {
    const base = `Space ${canvases.length + 1}`;
    addCanvas(base);
  };

  const handleDelete = async (id: string, name: string) => {
    if (canvases.length <= 1) return;

    const ok = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await deleteCanvas(id);
    } catch (e) {
      console.error("Delete canvas failed:", e);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs font-medium text-slate-600">
        Space
      </span>

      <div className="flex items-center gap-1 rounded-xl border border-sky-200/70 bg-white/70 p-1 shadow-sm">
        {canvases.slice(0, 7).map((c) => {
          const active = c.id === activeId;
          const isEditing = editingId === c.id;

          return (
            <div key={c.id} className="group relative flex items-center">
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") cancelRename();
                  }}
                  className="w-28 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-900 shadow outline-none ring-2 ring-sky-200"
                />
              ) : (
                <button
                  onClick={() => setActiveCanvas(c.id)}
                  onDoubleClick={() => startRename(c.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    active
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-600 hover:bg-white/70"
                  }`}
                  type="button"
                  title={c.name}
                >
                  {c.name}
                </button>
              )}

              {/* ✅ Delete (hover only) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.id, c.name);
                }}
                className={`ml-1 inline-flex h-6 w-6 items-center justify-center rounded-md
                  text-slate-500 hover:bg-white/80 hover:text-slate-900
                  opacity-0 group-hover:opacity-100 transition
                  ${canvases.length <= 1 ? "pointer-events-none opacity-0" : ""}`}
                aria-label={`Delete ${c.name}`}
                title="Delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {/* add button */}
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-white/70"
          type="button"
          aria-label="Add new space"
          title="Add new space"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <span className="hidden lg:inline text-[11px] text-slate-500">
        Double click a tab to rename
      </span>
    </div>
  );
}
