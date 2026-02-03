"use client";

import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import LeftSidebar from "../workspace/panels/LeftPanel/LeftPanel";

interface WorkspaceShellProps {
  left: ReactNode;   // Properties panel (overlay)
  center: ReactNode; // Canvas
  right: ReactNode;  // AI chat (docked)
}

export default function WorkspaceShell({
  left,
  center,
  right,
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Left Sidebar Overlay */}
      <LeftSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Properties Panel Overlay */}
      {propertiesOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
            onClick={() => setPropertiesOpen(false)}
          />
          <aside className="fixed top-0 right-0 z-40 h-full w-80 bg-white shadow-xl border-l">
            <div className="h-full overflow-y-auto p-5">
              {left}
            </div>
          </aside>
        </>
      )}

      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 rounded-lg bg-slate-900 p-2 text-white shadow"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}



      {/* Main layout: Center + AI */}
      <div className="h-full w-full grid grid-cols-[1fr_360px]">
        <main className="min-w-0 overflow-hidden">
          {center}
        </main>

        <aside className="hidden xl:flex flex-col border-l bg-white/60 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-5">
            {right}
          </div>
        </aside>
      </div>
    </div>
  );
}
