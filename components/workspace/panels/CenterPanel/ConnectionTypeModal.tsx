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
  colorClass: string;
  needsLabel: boolean;
}[] = [
  {
    type: "child",
    label: "Child",
    description: "Direct child step - part of the parent's workflow",
    icon: "📋",
    colorClass: "bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400",
    needsLabel: false,
  },
  {
    type: "branch",
    label: "Branch",
    description: "Alternative path or parallel workflow (requires label)",
    icon: "🔀",
    colorClass: "bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-400",
    needsLabel: true,
  },
  {
    type: "dependency",
    label: "Dependency",
    description: "This node depends on the other node being completed",
    icon: "🔗",
    colorClass: "bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400",
    needsLabel: false,
  },
  {
    type: "prerequisite",
    label: "Prerequisite",
    description: "Must be completed before the other node can start",
    icon: "⚠️",
    colorClass: "bg-rose-50 border-rose-300 hover:bg-rose-100 hover:border-rose-400",
    needsLabel: false,
  },
  {
    type: "reference",
    label: "Reference",
    description: "Related information or context (not blocking)",
    icon: "🔖",
    colorClass: "bg-purple-50 border-purple-300 hover:bg-purple-100 hover:border-purple-400",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {!selectedType ? (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Choose Connection Type
              </h2>
              <p className="text-sm text-slate-500">
                Select the relationship between these nodes
              </p>
            </div>

            <div className="space-y-2.5 mb-6">
              {connectionTypes.map((conn) => (
                <button
                  key={conn.type}
                  onClick={() => handleTypeClick(conn.type, conn.needsLabel)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow ${conn.colorClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{conn.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 mb-0.5">
                        {conn.label}
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed">
                        {conn.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Add Edge Label
              </h2>
              <p className="text-sm text-slate-500">
                Enter a label for this connection (e.g., "Yes", "No", "Option A")
              </p>
            </div>

            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && labelText.trim()) {
                  handleSubmitWithLabel();
                }
                if (e.key === "Escape") {
                  handleBack();
                }
              }}
              placeholder="Enter label..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm mb-4"
              autoFocus
            />

            <div className="flex gap-2.5">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                Back
              </button>
              <button
                onClick={handleSubmitWithLabel}
                disabled={!labelText.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-medium text-white hover:from-blue-500 hover:to-blue-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg disabled:hover:shadow-md"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}