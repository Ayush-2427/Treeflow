import {
  STORAGE_KEY_PREFIX,
  type TreeflowPersistedState,
  type TreePersistenceAdapter,
  validatePersistedState,
  migratePersistedState,
} from "./types";

/**
 * LocalStorage adapter for TreeFlow persistence
 * Guards all localStorage access to prevent SSR issues
 */
export class LocalStorageAdapter implements TreePersistenceAdapter {
  private getStorageKey(treeId: string): string {
    return `${STORAGE_KEY_PREFIX}${treeId}`;
  }

  private isClient(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  async load(treeId: string): Promise<TreeflowPersistedState | null> {
    if (!this.isClient()) {
      console.warn("localStorage not available (SSR context)");
      return null;
    }

    try {
      const key = this.getStorageKey(treeId);
      const raw = localStorage.getItem(key);
      
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      
      // Validate structure
      if (!validatePersistedState(parsed)) {
        console.warn("Invalid persisted state structure, ignoring");
        return null;
      }

      // Migrate if needed
      const migrated = migratePersistedState(parsed);
      if (!migrated) {
        console.warn("Failed to migrate persisted state");
        return null;
      }

      return migrated;
    } catch (error) {
      console.error("Failed to load persisted state:", error);
      return null;
    }
  }

  async save(treeId: string, state: TreeflowPersistedState): Promise<void> {
    if (!this.isClient()) {
      console.warn("localStorage not available (SSR context)");
      return;
    }

    try {
      const key = this.getStorageKey(treeId);
      const serialized = JSON.stringify(state);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error("Failed to save persisted state:", error);
      // Could be quota exceeded or other storage errors
      throw error;
    }
  }

  async clear(treeId: string): Promise<void> {
    if (!this.isClient()) {
      console.warn("localStorage not available (SSR context)");
      return;
    }

    try {
      const key = this.getStorageKey(treeId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to clear persisted state:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const localStorageAdapter = new LocalStorageAdapter();