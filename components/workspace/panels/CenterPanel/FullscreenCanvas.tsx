"use client";

import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import CenterPanel from "../CenterPanel/CenterPanel";
import { useTreeStore } from "../../../../lib/tree/store";

export default function FullscreenCanvas() {
  const [isReady, setIsReady] = useState(false);

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
    <div className="h-screen w-full bg-slate-100 flex flex-col">
      {/* Back button */}
      <div className="p-4 pb-0">
        <button
          onClick={handleBack}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          ← Back to Workspace
        </button>
      </div>
      
      <div className="flex-1 p-4">
        <ReactFlowProvider>
          <CenterPanel isFullscreen />
        </ReactFlowProvider>
      </div>
    </div>
  );
}