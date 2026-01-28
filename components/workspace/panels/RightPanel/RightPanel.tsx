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

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">AI Chat</h2>
        <p className="mt-1 text-xs text-slate-500">
          Chat can be for the whole tree or focused on one node.
        </p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setChatScope({ type: "workspace" })}
            className={`rounded-xl px-3 py-1 text-xs font-medium ${
              chatScope.type === "workspace"
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-900"
            }`}
          >
            Workspace
          </button>

          <button
            onClick={() => selectedNodeId && setChatScope({ type: "node", nodeId: selectedNodeId })}
            disabled={!selectedNodeId}
            className={`rounded-xl px-3 py-1 text-xs font-medium ${
              chatScope.type === "node"
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-900"
            } disabled:opacity-50`}
          >
            {selectedNodeId ? `Node: ${selectedTitle}` : "Node chat"}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto rounded-xl border border-slate-200 bg-white p-3">
        {visibleMessages.map((m: any) => (
          <div
            key={m.id}
            className={`rounded-xl p-3 ${
              m.role === "assistant" ? "bg-slate-50" : "border border-slate-200"
            }`}
          >
            <p className="text-xs font-medium text-slate-700">
              {m.role === "assistant" ? "TreeFlow" : "You"}
            </p>
            <p className="mt-1 text-sm text-slate-800">{m.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Daily AI uses</span>
          <span className="text-xs font-semibold text-slate-900">
            {dailyUses.used} / {dailyUses.limit}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Type your message..."
          />
          <button
            onClick={onSend}
            disabled={dailyUses.used >= dailyUses.limit}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Send
          </button>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Next step: AI returns structured proposals (add steps, rename nodes, mark complete). You click Apply.
        </p>
      </div>
    </div>
  );
}
