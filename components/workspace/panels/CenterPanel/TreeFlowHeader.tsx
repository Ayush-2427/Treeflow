"use client";

import { Info, Download, Maximize2 } from "lucide-react";

type TreeFlowHeaderProps = {
  isFullscreen?: boolean;

  // Info popup control
  showControls: boolean;
  setShowControls: (v: boolean) => void;
  openInfo: () => void;

  // Actions
  onFullscreen: () => void;
};

export default function TreeFlowHeader({
  isFullscreen = false,
  showControls,
  setShowControls,
  openInfo,
  onFullscreen,
}: TreeFlowHeaderProps) {
  return (
    <div className={isFullscreen ? "mb-2" : "mb-4"}>
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-[#0B1730] via-[#0A1A3A] to-[#071226] shadow-[0_18px_45px_rgba(2,6,23,0.35)]">
        {/* subtle pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:18px_18px]" />
        </div>

        {/* animated soft blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/18 blur-3xl tf-orb-1" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-indigo-500/18 blur-3xl tf-orb-2" />
        <div className="pointer-events-none absolute -top-28 right-10 h-72 w-72 rounded-full bg-sky-400/12 blur-3xl tf-orb-3" />

        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* content */}
        <div className="relative grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4">
          {/* center title */}
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-tight text-white/95">
              TreeFlow Canvas
            </h2>
            <p className="mt-0.5 text-xs text-white/60">
              Design and visualize your workflows
            </p>
          </div>

          {/* right actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => (showControls ? setShowControls(false) : openInfo())}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 shadow-sm hover:bg-white/10 hover:text-white transition-all"
              type="button"
              aria-label="Show canvas controls info"
            >
              <Info className="h-4 w-4" />
            </button>

            {!isFullscreen && (
              <button
                onClick={onFullscreen}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/85 shadow-sm hover:bg-white/10 hover:text-white transition-all"
                type="button"
              >
                <Maximize2 className="h-4 w-4 text-white/70" />
                Fullscreen
              </button>
            )}

            <button
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/85 shadow-sm hover:bg-white/10 hover:text-white transition-all"
              type="button"
            >
              Auto Layout
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-[0_12px_24px_rgba(2,6,23,0.35)] hover:bg-slate-100 active:scale-[0.98] transition-all"
              type="button"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* bottom inner divider */}
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* component scoped animation */}
        <style jsx>{`
          @keyframes tfFloat1 {
            0% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(30px, 18px, 0) scale(1.05); }
            100% { transform: translate3d(0, 0, 0) scale(1); }
          }
          @keyframes tfFloat2 {
            0% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(-26px, 22px, 0) scale(1.08); }
            100% { transform: translate3d(0, 0, 0) scale(1); }
          }
          @keyframes tfFloat3 {
            0% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(18px, -18px, 0) scale(1.04); }
            100% { transform: translate3d(0, 0, 0) scale(1); }
          }

          .tf-orb-1 { animation: tfFloat1 9s ease-in-out infinite; }
          .tf-orb-2 { animation: tfFloat2 11s ease-in-out infinite; }
          .tf-orb-3 { animation: tfFloat3 10s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
}
