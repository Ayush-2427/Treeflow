"use client";

import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import TreeProvider from "@/lib/tree/TreeProvider";
import CanvasProvider from "../../lib/tree/canvas/CanvasProvider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <TreeProvider>
      <CanvasProvider>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </CanvasProvider>
    </TreeProvider>
  );
}
