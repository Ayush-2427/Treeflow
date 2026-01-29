"use client";

import { ReactNode } from "react";

interface WorkspaceShellProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export default function WorkspaceShell({ left, center, right }: WorkspaceShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* Left Panel - 15% */}
      <div className="hidden md:flex md:w-[15%] min-w-[200px] flex-col border-r border-slate-200 bg-white p-4 overflow-auto">
        {left}
      </div>

      {/* Center Canvas - 65% */}
      <div className="flex-1 md:w-[65%] flex flex-col p-4">
        {center}
      </div>

      {/* Right Chat - 20% */}
      <div className="hidden lg:flex lg:w-[20%] min-w-[250px] flex-col border-l border-slate-200 bg-white p-4 overflow-auto">
        {right}
      </div>

      {/* Mobile: Show only center, hide panels */}
      {/* Panels can be toggled via buttons in mobile view if needed */}
    </div>
  );
}