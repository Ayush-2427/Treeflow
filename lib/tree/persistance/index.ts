export {
  SCHEMA_VERSION,
  STORAGE_KEY_PREFIX,
  validatePersistedState,
  migratePersistedState,
} from "./types";

export type {
  TreeflowPersistedState,
  TreePersistenceAdapter,
} from "./types";

export { LocalStorageAdapter, localStorageAdapter } from "./localStorageAdapter";

/**
 * Helper to download JSON file
 */
export function downloadJSON(filename: string, data: any): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to read uploaded JSON file
 */
export function readJSONFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}