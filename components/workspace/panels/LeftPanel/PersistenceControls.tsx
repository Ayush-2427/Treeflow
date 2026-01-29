"use client";

import { useRef, useState } from "react";
import { useTreeStore } from "../../../../lib/tree/store";

interface PersistenceControlsProps {
  treeId: string;
}

export default function PersistenceControls({ treeId }: PersistenceControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  
  const saveTree = useTreeStore((s) => s.saveTree);
  const resetTree = useTreeStore((s) => s.resetTree);
  const exportTree = useTreeStore((s) => s.exportTree);
  const importTree = useTreeStore((s) => s.importTree);

  const handleSave = async () => {
    try {
      setStatus("Saving...");
      await saveTree(treeId);
      setStatus("✓ Saved");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      setStatus("✗ Save failed");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset canvas to defaults? This will clear all nodes and edges.")) {
      return;
    }
    
    try {
      setStatus("Resetting...");
      await resetTree(treeId);
      setStatus("✓ Reset");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      setStatus("✗ Reset failed");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  const handleExport = () => {
    try {
      exportTree(treeId);
      setStatus("✓ Exported");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      setStatus("✗ Export failed");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatus("Importing...");
      await importTree(treeId, file);
      setStatus("✓ Imported");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      setStatus("✗ Import failed");
      setTimeout(() => setStatus(""), 2000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-slate-700">Storage</label>
        {status && (
          <span className="text-xs text-slate-500">{status}</span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSave}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          💾 Save
        </button>
        
        <button
          onClick={handleReset}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-all"
        >
          🔄 Reset
        </button>
        
        <button
          onClick={handleExport}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          ⬇️ Export
        </button>
        
        <button
          onClick={handleImportClick}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
        >
          ⬆️ Import
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className="mt-2 text-[10px] text-slate-500 leading-relaxed">
        Auto-saves every few seconds. Export for backup.
      </p>
    </div>
  );
}