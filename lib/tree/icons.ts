// lib/tree/icons.ts
import type { ComponentType } from "react";
import {
  Layers,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Flag,
  Play,
  Square,
  StickyNote,
  Target,
  Lightbulb,
  Calendar,
  Gauge,
  Shield,
  Code2,
} from "lucide-react";

export type NodeIconKey =
  | "default"
  | "process"
  | "decision"
  | "start"
  | "end"
  | "note"
  | "goal"
  | "idea"
  | "calendar"
  | "metrics"
  | "risk"
  | "secure"
  | "code"
  | "done"
  | "help";

export const NODE_ICONS: Record<NodeIconKey, ComponentType<any>> = {
  default: Layers,
  process: Layers,
  decision: GitBranch,
  start: Play,
  end: Square,
  note: StickyNote,

  goal: Target,
  idea: Lightbulb,
  calendar: Calendar,
  metrics: Gauge,
  risk: AlertTriangle,
  secure: Shield,
  code: Code2,
  done: CheckCircle2,
  help: HelpCircle,
};

export const ICON_PICKER: Array<{ key: NodeIconKey; label: string }> = [
  { key: "default", label: "Default" },
  { key: "process", label: "Process" },
  { key: "decision", label: "Decision" },
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
  { key: "note", label: "Note" },

  { key: "goal", label: "Goal" },
  { key: "idea", label: "Idea" },
  { key: "calendar", label: "Calendar" },
  { key: "metrics", label: "Metrics" },
  { key: "risk", label: "Risk" },
  { key: "secure", label: "Security" },
  { key: "code", label: "Code" },
  { key: "done", label: "Done" },
  { key: "help", label: "Help" },
];

// Always safe fallback helper
export function getNodeIcon(iconKey?: string) {
  const key = (iconKey || "default") as NodeIconKey;
  return NODE_ICONS[key] ?? NODE_ICONS.default;
}
