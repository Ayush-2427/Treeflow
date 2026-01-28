import { useState } from "react";
import { ConnectionType } from "../../../../lib/tree/types";

interface ConnectionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ConnectionType, label?: string) => void;
  sourceNodeType?: string;
}

const connectionTypes: {
  type: ConnectionType;
  label: string;
  description: string;
  icon: string;
  color: string;
  needsLabel: boolean;
}[] = [
  {
    type: "child",
    label: "Child",
    description: "Direct child step - part of the parent's workflow",
    icon: "📋",
    color: "bg-slate-50 border-slate-300 hover:bg-slate-100",
    needsLabel: false,
  },
  {
    type: "branch",
    label: "Branch",
    description: "Alternative path or parallel workflow (requires label)",
    icon: "🔀",
    color: "bg-blue-50 border-blue-300 hover:bg-blue-100",
    needsLabel: true,
  },
  {
    type: "dependency",
    label: "Dependency",
    description: "This node depends on the other node being completed",
    icon: "🔗",
    color: "bg-orange-50 border-orange-300 hover:bg-orange-100",
    needsLabel: false,
  },
  {
    type: "prerequisite",
    label: "Prerequisite",
    description: "Must be completed before the other node can start",
    icon: "⚠️",
    color: "bg-red-50 border-red-300 hover:bg-red-100",
    needsLabel: false,
  },
  {
    type: "reference",
    label: "Reference",
    description: "Related information or context (not blocking)",
    icon: "🔖",
    color: "bg-purple-50 border-purple-300 hover:bg-purple-100",
    needsLabel: false,
  },
];

export default function ConnectionTypeModal({
  isOpen,
  onClose,
  onSelect,
  sourceNodeType,
}: ConnectionTypeModalProps) {
  const [selectedType, setSelectedType] = useState<ConnectionType | null>(null);
  const [labelText, setLabelText] = useState("");

  if (!isOpen) return null;

  const handleTypeClick = (type: ConnectionType, needsLabel: boolean) => {
    if (needsLabel || sourceNodeType === "decision") {
      setSelectedType(type);
    } else {
      onSelect(type);
    }
  };

  const handleSubmitWithLabel = () => {
    if (selectedType && labelText.trim()) {
      onSelect(selectedType, labelText.trim());
      setSelectedType(null);
      setLabelText("");
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setLabelText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {!selectedType ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Choose Connection Type
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Select the relationship between these nodes
            </p>

            <div className="space-y-2">
              {connectionTypes.map((conn) => (
                <button
                  key={conn.type}
                  onClick={() => handleTypeClick(conn.type, conn.needsLabel)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${conn.color}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{conn.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">
                        {conn.label}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {conn.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Add Edge Label
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter a label for this connection (e.g., "Yes", "No", "Option A")
            </p>

            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && labelText.trim()) {
                  handleSubmitWithLabel();
                }
              }}
              placeholder="Enter label..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmitWithLabel}
                disabled={!labelText.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}