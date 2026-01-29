"use client";

import { ReactFlowProvider } from "reactflow";
import FullscreenCanvas from "../../../components/workspace/panels/CenterPanel/FullscreenCanvas";
import TreeProvider from "../../../lib/tree/TreeProvider";

export default function FullscreenPage() {
  return (
    <TreeProvider>
      <ReactFlowProvider>
        <FullscreenCanvas />
      </ReactFlowProvider>
    </TreeProvider>
  );
}