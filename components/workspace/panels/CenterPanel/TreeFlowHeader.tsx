"use client";

import { Info, Download, Maximize2 } from "lucide-react";

type TreeFlowHeaderProps = {
  isFullscreen?: boolean;

  showControls: boolean;
  setShowControls: (v: boolean) => void;
  openInfo: () => void;

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
      <div className="relative overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-sky-100 shadow-[0_14px_40px_rgba(2,132,199,0.12)]">
        {/* soft pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.45]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(2,132,199,0.10)_1px,transparent_0)] [background-size:18px_18px]" />
        </div>

        {/* gentle animated blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl tf-orb-1" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl tf-orb-2" />
        <div className="pointer-events-none absolute -top-28 right-10 h-80 w-80 rounded-full bg-indigo-200/35 blur-3xl tf-orb-3" />

        {/* top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

        {/* content */}
        <div className="relative grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4">
          {/* center title */}
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              TreeFlow Canvas
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Design and visualize your workflows
            </p>
          </div>

          {/* right actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => (showControls ? setShowControls(false) : openInfo())}
              className="inline-flex items-center justify-center rounded-xl border border-sky-200/70 bg-white/70 p-2 text-slate-700 shadow-sm hover:bg-white hover:shadow-md transition-all"
              type="button"
              aria-label="Show canvas controls info"
            >
              <Info className="h-4 w-4" />
            </button>

            {!isFullscreen && (
              <button
                onClick={onFullscreen}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-sky-200/70 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-white hover:shadow-md transition-all"
                type="button"
              >
                <Maximize2 className="h-4 w-4 text-slate-500" />
                Fullscreen
              </button>
            )}

            <button
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-sky-200/70 bg-white/70 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-white hover:shadow-md transition-all"
              type="button"
            >
              Auto Layout
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_26px_rgba(37,99,235,0.28)] hover:from-sky-500 hover:to-indigo-500 active:scale-[0.98] transition-all"
              type="button"
            >
              <Download className="h-4 w-4 opacity-90" />
              Export
            </button>
          </div>
        </div>

        {/* bottom inner divider */}
        <div className="relative h-px w-full bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />

        <style jsx>{`
          @keyframes tfFloat1 {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(26px, 14px, 0) scale(1.05);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }
          @keyframes tfFloat2 {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(-22px, 18px, 0) scale(1.07);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }
          @keyframes tfFloat3 {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(16px, -14px, 0) scale(1.04);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          .tf-orb-1 {
            animation: tfFloat1 10s ease-in-out infinite;
          }
          .tf-orb-2 {
            animation: tfFloat2 12s ease-in-out infinite;
          }
          .tf-orb-3 {
            animation: tfFloat3 11s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
