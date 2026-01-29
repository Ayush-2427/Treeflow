"use client";

import { ReactFlowProvider } from "reactflow";
import LeftPanel from "../../components/workspace/panels/LeftPanel/LeftPanel";
import CenterPanel from "../../components/workspace/panels/CenterPanel/CenterPanel";
import RightPanel from "../../components/workspace/panels/RightPanel/RightPanel";
import WorkspaceShell from "../../components/layout/WorkspaceShell";

export default function WorkspacePage() {
  return (
    <ReactFlowProvider>
      <WorkspaceShell 
        left={<LeftPanel />} 
        center={<CenterPanel />} 
        right={<RightPanel />} 
      />
    </ReactFlowProvider>
  );
}