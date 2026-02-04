"use client";

import { useCanvases, useActiveCanvasId, useCanvasActions } from "./canvas.selectors";

export default function CanvasTabs() {
  const canvases = useCanvases();
  const activeId = useActiveCanvasId();
  const { setActiveCanvas, addCanvas } = useCanvasActions();

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2 overflow-x-auto">
        {canvases.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCanvas(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                active ? "bg-white" : "bg-transparent"
              }`}
              title={c.id}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => addCanvas(`Canvas ${canvases.length + 1}`)}
        className="px-3 py-1.5 rounded-lg text-sm border"
      >
        + New
      </button>
    </div>
  );
}
