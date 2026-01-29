"use client";

import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { useTreeStore } from "../../../../lib/tree/store";

export default function RightPanel() {
  const [text, setText] = useState("");

  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const nodes = useTreeStore((s) => s.nodes);

  const chat = useTreeStore((s) => s.chat);
  const chatScope = useTreeStore((s) => s.chatScope);

  const setChatScope = useTreeStore((s) => s.setChatScope);
  const addChat = useTreeStore((s) => s.addChat);

  const dailyUses = useTreeStore((s) => s.dailyUses);
  const resetDailyIfNeeded = useTreeStore((s) => s.resetDailyIfNeeded);
  const incrementDailyUse = useTreeStore((s) => s.incrementDailyUse);

  const selectedTitle = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId)?.data?.title ?? "Node";
  }, [nodes, selectedNodeId]);

  const visibleMessages = useMemo(() => {
    const scopeKey =
      chatScope.type === "workspace" ? "workspace" : `node:${chatScope.nodeId}`;
    return chat.filter((m: any) => (m.scope ?? "workspace") === scopeKey);
  }, [chat, chatScope]);

  function onSend() {
    resetDailyIfNeeded();
    if (!text.trim()) return;
    if (dailyUses.used >= dailyUses.limit) return;

    const scopeKey =
      chatScope.type === "workspace" ? "workspace" : `node:${chatScope.nodeId}`;

    addChat({
      id: nanoid(),
      role: "user",
      content: text.trim(),
      createdAt: Date.now(),
      scope: scopeKey
    } as any);

    setText("");
    incrementDailyUse();

    // Placeholder assistant response for now
    addChat({
      id: nanoid(),
      role: "assistant",
      content:
        "Got it. Want me to turn that into 3 to 6 concrete child steps under the selected node?",
      createdAt: Date.now(),
      scope: scopeKey
    } as any);
  }

  const usagePercentage = (dailyUses.used / dailyUses.limit) * 100;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">AI Assistant</h2>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Get help planning, organizing, and expanding your workflows
        </p>

        <div className="space-y-2">
          <p className="text-[10px] font-medium text-slate-700 uppercase tracking-wide">Chat Scope</p>
          <div className="flex gap-2">
            <button
              onClick={() => setChatScope({ type: "workspace" })}
              className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 shadow-sm ${
                chatScope.type === "workspace"
                  ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="block text-[10px] opacity-70 mb-0.5">Entire</span>
              Workspace
            </button>

            <button
              onClick={() => selectedNodeId && setChatScope({ type: "node", nodeId: selectedNodeId })}
              disabled={!selectedNodeId}
              className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 shadow-sm ${
                chatScope.type === "node"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              }`}
            >
              <span className="block text-[10px] opacity-70 mb-0.5">Selected</span>
              {selectedNodeId ? (
                <span className="block truncate max-w-full">{selectedTitle}</span>
              ) : (
                "Node"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 space-y-3">
          {visibleMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">Start a conversation</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Ask for help planning steps, organizing workflows, or expanding your ideas
              </p>
            </div>
          ) : (
            visibleMessages.map((m: any) => (
              <div
                key={m.id}
                className={`rounded-xl p-3.5 transition-all ${
                  m.role === "assistant"
                    ? "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200"
                    : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 ml-4"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      m.role === "assistant"
                        ? "bg-slate-700 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {m.role === "assistant" ? "AI" : "You"}
                  </div>
                  <p className="text-[10px] font-medium text-slate-600">
                    {m.role === "assistant" ? "TreeFlow Assistant" : "You"}
                  </p>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{m.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="mt-4 space-y-3">
        {/* Usage Indicator */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">Daily AI Uses</span>
            <span className="text-xs font-bold text-slate-900">
              {dailyUses.used} / {dailyUses.limit}
            </span>
          </div>
          
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                usagePercentage >= 100
                  ? "bg-rose-500"
                  : usagePercentage >= 75
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          
          {dailyUses.used >= dailyUses.limit && (
            <p className="mt-2 text-[10px] text-rose-600 font-medium">
              Daily limit reached. Resets at midnight.
            </p>
          )}
        </div>

        {/* Input */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              placeholder="Ask me anything..."
              disabled={dailyUses.used >= dailyUses.limit}
            />
            <button
              onClick={onSend}
              disabled={dailyUses.used >= dailyUses.limit || !text.trim()}
              className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:from-slate-800 hover:to-slate-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg disabled:hover:shadow-md"
            >
              Send
            </button>
          </div>
          
          <p className="mt-3 text-[10px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
            <span className="font-medium text-slate-600">Coming soon:</span> AI will return structured proposals (add steps, rename nodes, mark complete). You'll click Apply to accept changes.
          </p>
        </div>
      </div>
    </div>
  );
}