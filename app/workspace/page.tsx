"use client";

import { ReactFlowProvider } from "reactflow";
import CenterPanel from "../../components/workspace/panels/CenterPanel/CenterPanel";
import RightPanel from "../../components/workspace/panels/RightPanel/RightPanel";
import WorkspaceShell from "../../components/layout/WorkspaceShell";

function PropertiesPanel() {
  return (
    <div className="text-sm text-slate-600">
      Select a node to edit its properties.
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <ReactFlowProvider>
      <WorkspaceShell
        left={<PropertiesPanel />}
        center={<CenterPanel />}
        right={<RightPanel />}
      />
    </ReactFlowProvider>
  );
}
