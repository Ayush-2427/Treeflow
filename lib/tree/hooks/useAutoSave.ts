"use client";

import { useEffect, useRef } from "react";
import { useTreeStore } from "../store";

/**
 * Best-stability autosave:
 * - Debounced
 * - Never saves to a stale treeId
 * - Safe during rapid canvas switching
 */
export function useAutoSave(treeId: string, debounceMs: number = 500) {
  const timeoutRef = useRef<number | null>(null);
  const treeIdRef = useRef(treeId);

  const saveTree = useTreeStore((s) => s.saveTree);

  // Subscribe to changes
  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const viewport = useTreeStore((s) => s.viewport);

  // Always keep latest treeId
  useEffect(() => {
    treeIdRef.current = treeId;

    // Important: cancel any pending save when switching trees
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [treeId]);

  useEffect(() => {
    if (!treeIdRef.current) return;

    // Clear previous timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Schedule save (to latest treeId only)
    timeoutRef.current = window.setTimeout(() => {
      const activeId = treeIdRef.current;
      saveTree(activeId).catch((error) => {
        console.error("Auto-save failed:", error);
      });
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [nodes, edges, viewport, debounceMs, saveTree]);
}
