// components/workspace/nodes/TreeNode.tsx
"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { TreeNodeData } from "../../../lib/tree/types";
import { getNodeIcon, ICON_PICKER, type NodeIconKey } from "../../../lib/tree/icons";
import { useTreeStore } from "../../../lib/tree/store";

const baseHandle =
  "!w-3 !h-3 !border-2 !border-white/90 !bg-white shadow-sm transition-all duration-150";
const hiddenHandle = "opacity-0 pointer-events-none";
const visibleHandle = "opacity-100 pointer-events-auto";

function hexToRgba(hex: string, a: number) {
  const v = hex.replace("#", "").trim();
  if (v.length !== 6) return `rgba(59,130,246,${a})`;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function labelForType(t: TreeNodeData["nodeType"]) {
  if (t === "process") return "Process";
  if (t === "decision") return "Decision";
  if (t === "start") return "Start";
  if (t === "end") return "End";
  return "Note";
}

function badgeForType(t: TreeNodeData["nodeType"]) {
  if (t === "process") return { bg: "bg-sky-50", border: "border-sky-200/70", text: "text-sky-700" };
  if (t === "decision") return { bg: "bg-violet-50", border: "border-violet-200/70", text: "text-violet-700" };
  if (t === "start") return { bg: "bg-emerald-50", border: "border-emerald-200/70", text: "text-emerald-700" };
  if (t === "end") return { bg: "bg-rose-50", border: "border-rose-200/70", text: "text-rose-700" };
  return { bg: "bg-amber-50", border: "border-amber-200/70", text: "text-amber-700" };
}

function stopAll(e: React.SyntheticEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function TreeNode({ id, data, selected }: NodeProps<TreeNodeData>) {
  const updateNodeData = useTreeStore((s) => s.updateNodeData);

  // Prevent theme-name colors from producing weird rgba
  const rawAccent = (data.color as string) || "#60A5FA";
  const accent = rawAccent.startsWith("#") ? rawAccent : "#60A5FA";

  const glow = hexToRgba(accent, selected ? 0.28 : 0.18);
  const handleState = selected ? visibleHandle : hiddenHandle;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!pickerOpen) return;
      const el = pickerRef.current;
      if (!el) return;

      const target = e.target;
      if (target instanceof HTMLElement && el.contains(target)) return;

      setPickerOpen(false);
      setQuery("");
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  useEffect(() => {
    if (!pickerOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [pickerOpen]);

  const Icon = useMemo(() => getNodeIcon(data.iconKey), [data.iconKey]);

  const typeChip = badgeForType(data.nodeType);

  const filteredIcons = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_PICKER;
    return ICON_PICKER.filter((it) => it.label.toLowerCase().includes(q) || it.key.toLowerCase().includes(q));
  }, [query]);

  return (
    <div
      className={[
        "group relative min-w-[230px] max-w-[320px] rounded-[18px]",
        "border border-white/55 bg-white/75 backdrop-blur-xl",
        "shadow-[0_18px_40px_rgba(2,6,23,0.10)] transition-transform duration-200",
        selected ? "ring-2 ring-sky-300/70" : "",
      ].join(" ")}
      style={{
        boxShadow: `0 18px 40px rgba(2,6,23,0.10), 0 10px 28px ${glow}`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-br from-white/70 via-white/35 to-white/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[18px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div
        className="pointer-events-none absolute -top-10 -right-12 h-28 w-28 rounded-full blur-3xl"
        style={{ background: hexToRgba(accent, 0.22) }}
      />

      {/* TARGET handles (incoming) */}
<Handle type="target" position={Position.Top} id="t" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />
<Handle type="target" position={Position.Right} id="r" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />
<Handle type="target" position={Position.Bottom} id="b" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />
<Handle type="target" position={Position.Left} id="l" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />

{/* SOURCE handles (outgoing) */}
<Handle type="source" position={Position.Top} id="t-s" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />
<Handle type="source" position={Position.Right} id="r-s" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />
<Handle type="source" position={Position.Bottom} id="b-s" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />
<Handle type="source" position={Position.Left} id="l-s" className={`${baseHandle} ${handleState} group-hover:${visibleHandle}`} />


      <div className="relative px-4 py-3">
        <div className="flex items-start gap-3">
          <div
            className="relative"
            ref={pickerRef}
            // This prevents node click + selection menus firing when interacting with picker area.
            onMouseDown={(e) => stopAll(e)}
            onClick={(e) => stopAll(e)}
          >
            <button
              type="button"
              onMouseDown={(e) => stopAll(e)}
              onClick={(e) => {
                stopAll(e);
                setPickerOpen((v) => !v);
                if (pickerOpen) setQuery("");
              }}
              className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-white/65 shadow-sm transition-transform hover:scale-[1.04]"
              style={{ boxShadow: `0 10px 22px ${hexToRgba(accent, 0.18)}` }}
              title="Change icon"
            >
              <Icon className="h-4 w-4 text-slate-700" />
            </button>

            {pickerOpen && (
              <div
                className="absolute left-0 top-11 z-[60] w-80 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl"
                onMouseDown={(e) => stopAll(e)}
                onClick={(e) => stopAll(e)}
              >
                <div className="p-2">
                  <div className="text-[11px] font-semibold text-slate-700 px-2 py-1">Pick an icon</div>

                  <div className="px-2 pb-2">
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search icons..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>

                  <div className="max-h-80 overflow-auto px-1 pb-2">
                    <div className="grid grid-cols-3 gap-1 p-1">
                      {filteredIcons.length === 0 ? (
                        <div className="col-span-2 px-3 py-6 text-center text-[12px] text-slate-500">
                          No icons found.
                        </div>
                      ) : (
                        filteredIcons.map((it) => {
                          const PickIcon = getNodeIcon(it.key);
                          const active = it.key === data.iconKey;
                          return (
                            <button
                              key={it.key}
                              type="button"
                              onMouseDown={(e) => stopAll(e)}
                              onClick={(e) => {
                                stopAll(e);
                                updateNodeData(id, { iconKey: it.key as NodeIconKey });
                                setPickerOpen(false);
                                setQuery("");
                              }}
                              className={[
                                "flex items-center gap-2 rounded-lg border px-2 py-2 transition",
                                active ? "border-sky-200 bg-sky-50" : "border-transparent hover:border-slate-200 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white">
                                <PickIcon className="h-4 w-4 text-slate-700" />
                              </span>
                              <span className="text-[12px] font-medium text-slate-700">{it.label}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 px-2 py-2 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      {filteredIcons.length} icons
                    </div>
                    <button
                      type="button"
                      onMouseDown={(e) => stopAll(e)}
                      onClick={(e) => {
                        stopAll(e);
                        setPickerOpen(false);
                        setQuery("");
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeChip.bg} ${typeChip.border} ${typeChip.text}`}
              >
                {labelForType(data.nodeType)}
              </span>

              {data.completed && (
                <span className="inline-flex items-center rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Done
                </span>
              )}
            </div>

            <div className="mt-1 text-[13px] font-semibold tracking-tight text-slate-900">
              {data.title || "Untitled"}
            </div>

            {data.description && (
              <div className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                {data.description}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-transparent transition-all duration-200 group-hover:-translate-y-[1px] group-hover:ring-slate-200/60" />
    </div>
  );
}

export default memo(TreeNode);
