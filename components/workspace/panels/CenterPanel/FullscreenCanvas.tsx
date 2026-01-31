"use client";

import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import CenterPanel from "../CenterPanel/CenterPanel";

export default function FullscreenCanvas() {
  const [isReady, setIsReady] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleBack = () => {
    window.location.href = "/workspace";
  };

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading canvas...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">
        <button
          onClick={handleBack}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          type="button"
        >
          ← Back
        </button>

        <div className="text-sm font-semibold text-slate-800">
          TreeFlow Canvas
        </div>

        <button
          onClick={() => setShowInfo(true)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          type="button"
          title="Canvas help"
          aria-label="Canvas help"
        >
          i
        </button>
      </div>

      {/* Canvas takes full remaining height */}
      <div className="flex-1 min-h-0 p-3">
        <div className="h-full w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ReactFlowProvider>
            <CenterPanel isFullscreen />
          </ReactFlowProvider>
        </div>
      </div>

      {/* Info modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowInfo(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
              <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Canvas help
                  </p>
                  <p className="text-xs text-slate-500">
                    Controls and shortcuts
                  </p>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Canvas controls
                  </p>
                  <ul className="text-slate-600 space-y-1 list-disc pl-5 text-xs">
                    <li>Left drag empty space to select multiple nodes</li>
                    <li>Right drag to pan around the canvas</li>
                    <li>Right click empty space to add new nodes</li>
                    <li>Delete/Backspace to remove selected nodes</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Connections
                  </p>
                  <ul className="text-slate-600 space-y-1 list-disc pl-5 text-xs">
                    <li>Drag from node handles to create connections</li>
                    <li>Double-click edge labels to edit them</li>
                    <li>Right-click edges for more options</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
