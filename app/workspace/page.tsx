"use client";

import { ReactFlowProvider } from "reactflow";
import WorkspaceShell from "../../components/layout/WorkspaceShell";
import LeftPanel from "../../components/workspace/panels/LeftPanel/LeftPanel";
import CenterPanel from "../../components/workspace/panels/CenterPanel/CenterPanel";
import RightPanel from "../../components/workspace/panels/RightPanel/RightPanel";
import TreeProvider from "../../lib/tree/TreeProvider";

export default function WorkspacePage() {
  return (
    <TreeProvider>
      <WorkspaceShell 
        left={<LeftPanel />} 
        center={
          <ReactFlowProvider>
            <CenterPanel />
          </ReactFlowProvider>
        } 
        right={<RightPanel />} 
      />
    </TreeProvider>
  );
}