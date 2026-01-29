// components/layout/WorkspaceShell.tsx
"use client";

import { ReactNode } from "react";

interface WorkspaceShellProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export default function WorkspaceShell({ left, center, right }: WorkspaceShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h60v60H0z" fill="none"/%3E%3Cpath d="M30 30m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0" fill="%23000"/%3E%3C/svg%3E")' }}
      />
      
      <div className="relative flex h-screen">
        {/* Left Panel - Node Inspector */}
        <aside className="hidden lg:flex w-72 xl:w-80 flex-col border-r border-slate-200/80 bg-white/60 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-5">
            {left}
          </div>
        </aside>

        {/* Center Panel - Canvas (Main Workspace) */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 lg:p-6">
            {center}
          </div>
        </main>

        {/* Right Panel - AI Chat */}
        <aside className="hidden xl:flex w-80 2xl:w-96 flex-col border-l border-slate-200/80 bg-white/60 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-5">
            {right}
          </div>
        </aside>
      </div>
    </div>
  );
}