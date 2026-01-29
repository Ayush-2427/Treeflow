"use client";

import { useEffect, useRef } from "react";
import { useTreeStore } from "../store";

/**
 * Auto-save hook with debouncing
 * Saves tree state to localStorage when nodes, edges, or viewport changes
 */
export function useAutoSave(treeId: string, debounceMs: number = 500) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveTree = useTreeStore((s) => s.saveTree);
  
  // Subscribe to changes
  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const viewport = useTreeStore((s) => s.viewport);
  
  useEffect(() => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Schedule save
    saveTimeoutRef.current = setTimeout(() => {
      saveTree(treeId).catch((error) => {
        console.error("Auto-save failed:", error);
      });
    }, debounceMs);
    
    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, viewport, treeId, debounceMs, saveTree]);
}