"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "nanoid";
import { useTreeStore } from "../../../../lib/tree/store";
import { useReactFlow } from "reactflow";
import { layoutWithDagre } from "../../../../lib/tree/dagreLayout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Facts {
  goal?: string;
  options?: string[];
  constraints?: Record<string, any>;
  successCriteria?: string[];
  context?: string;
  [key: string]: any;
}

export default function RightPanel() {
  // ReactFlow instance for fitView
  const rf = useReactFlow();

  // Tab state
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");

  // Original chat state
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

  // AI Tree Builder state
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: nanoid(),
      role: "assistant",
      content:
        "Hi! I'll help you create a decision tree. Tell me what you're trying to achieve or decide.",
    },
  ]);

  const [aiInput, setAiInput] = useState("");
  const [facts, setFacts] = useState<Facts>({});
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setNodes = useTreeStore((s) => s.setNodes);
  const setEdges = useTreeStore((s) => s.setEdges);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const selectedTitle = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId)?.data?.title ?? "Node";
  }, [nodes, selectedNodeId]);

  const visibleMessages = useMemo(() => {
    const scopeKey =
      chatScope.type === "workspace" ? "workspace" : `node:${chatScope.nodeId}`;
    return chat.filter((m: any) => (m.scope ?? "workspace") === scopeKey);
  }, [chat, chatScope]);

  // Original chat send
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
      scope: scopeKey,
    } as any);

    setText("");
    incrementDailyUse();

    // Placeholder response - this feature is coming soon
    addChat({
      id: nanoid(),
      role: "assistant",
      content:
        "This feature is coming soon! For now, use the 'AI Tree Builder' tab to generate complete decision trees from scratch.",
      createdAt: Date.now(),
      scope: scopeKey,
    } as any);
  }

  // AI Tree Builder send
  const handleAiSend = async () => {
    if (!aiInput.trim() || isLoading || isGenerating) return;

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: aiInput.trim(),
    };

    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...aiMessages, userMessage],
          facts,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", response.status, errorData);
        throw new Error(`API Error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: data.assistantMessage,
      };

      setAiMessages((prev) => [...prev, assistantMessage]);
      setFacts(data.facts || {});
      setIsReadyToGenerate(data.isReadyToGenerate || false);
    } catch (error) {
      console.error("Interview error:", error);
      const errorMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "Please try again"
        }. Check console for details.`,
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTree = async () => {
    if (!isReadyToGenerate || isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: aiMessages,
          facts,
          constraints: {
            maxDepth: 3,
            maxNodes: 25,
            maxBranches: 4,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Generate tree API Error:", response.status, errorData);
        throw new Error(`API Error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      if (!data.tree || !data.tree.nodes || !data.tree.edges) {
        throw new Error("Invalid tree response");
      }

      // ✅ Apply layout BEFORE setting nodes/edges
      const { nodes: laidOutNodes, edges: laidOutEdges } = layoutWithDagre(
        data.tree.nodes,
        data.tree.edges
      );

      setNodes(laidOutNodes);
      setEdges(laidOutEdges);

      // ✅ Fit view AFTER render
      setTimeout(() => {
        rf.fitView({ padding: 0.25, duration: 300 });
      }, 0);

      // Add success message
      const successMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: "Your decision tree has been generated! Check it out on the canvas.",
      };
      setAiMessages((prev) => [...prev, successMessage]);

      // Reset for new conversation
      setTimeout(() => {
        setAiMessages([
          {
            id: nanoid(),
            role: "assistant",
            content:
              "Great! Your tree is ready. Want to create another one? Just tell me what you'd like to achieve.",
          },
        ]);
        setFacts({});
        setIsReadyToGenerate(false);
      }, 2000);
    } catch (error) {
      console.error("Generate tree error:", error);
      const errorMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "Failed to generate tree"
        }. Check console for details.`,
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSend();
    }
  };

  const usagePercentage = (dailyUses.used / dailyUses.limit) * 100;

  return (
    <div className="flex h-full flex-col">
      {/* Tab Switcher */}
      <div className="mb-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "chat"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Chat Assistant
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "ai"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AI Tree Builder
          </button>
        </div>
      </div>

      {/* Original Chat Tab */}
      {activeTab === "chat" && (
        <>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              AI Assistant
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold mr-2">
                Coming Soon
              </span>
              This chat is a placeholder. Use "AI Tree Builder" tab to generate
              trees.
            </p>

            <div className="space-y-2">
              <p className="text-[10px] font-medium text-slate-700 uppercase tracking-wide">
                Chat Scope
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setChatScope({ type: "workspace" })}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 shadow-sm ${
                    chatScope.type === "workspace"
                      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-[10px] opacity-70 mb-0.5">
                    Entire
                  </span>
                  Workspace
                </button>

                <button
                  onClick={() =>
                    selectedNodeId &&
                    setChatScope({ type: "node", nodeId: selectedNodeId })
                  }
                  disabled={!selectedNodeId}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 shadow-sm ${
                    chatScope.type === "node"
                      ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                  }`}
                >
                  <span className="block text-[10px] opacity-70 mb-0.5">
                    Selected
                  </span>
                  {selectedNodeId ? (
                    <span className="block truncate max-w-full">
                      {selectedTitle}
                    </span>
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
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Start a conversation
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Ask for help planning steps, organizing workflows, or
                    expanding your ideas
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
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {m.content}
                    </p>
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
                <span className="text-xs font-medium text-slate-700">
                  Daily AI Uses
                </span>
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
                <span className="font-medium text-slate-600">Note:</span> This
                basic chat is a placeholder. For full AI tree generation, use
                the "AI Tree Builder" tab which conducts guided interviews and
                creates complete decision trees.
              </p>
            </div>
          </div>
        </>
      )}

      {/* AI Tree Builder Tab */}
      {activeTab === "ai" && (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              AI Tree Builder
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Have a conversation about your goal, then generate a complete
              decision tree
            </p>
          </div>

          {/* Collected Facts Summary */}
          {Object.keys(facts).length > 0 && (
            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Collected So Far:
              </p>
              <div className="space-y-1 text-xs text-blue-800">
                {facts.goal && (
                  <div>
                    <span className="font-medium">Goal:</span> {facts.goal}
                  </div>
                )}
                {facts.options && facts.options.length > 0 && (
                  <div>
                    <span className="font-medium">Options:</span>{" "}
                    {facts.options.join(", ")}
                  </div>
                )}
                {facts.constraints && Object.keys(facts.constraints).length > 0 && (
                  <div>
                    <span className="font-medium">Constraints:</span>{" "}
                    {Object.entries(facts.constraints)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </div>
                )}
                {facts.successCriteria && facts.successCriteria.length > 0 && (
                  <div>
                    <span className="font-medium">Success:</span>{" "}
                    {facts.successCriteria.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 space-y-3">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl p-3.5 transition-all ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200"
                      : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 ml-4"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        msg.role === "assistant"
                          ? "bg-slate-700 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.role === "assistant" ? "AI" : "You"}
                    </div>
                    <p className="text-[10px] font-medium text-slate-600">
                      {msg.role === "assistant" ? "AI Assistant" : "You"}
                    </p>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ))}

              {isLoading && (
                <div className="rounded-xl p-3.5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-600">Thinking...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 space-y-3">
            {/* Generate Button */}
            {isReadyToGenerate && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs text-emerald-800 mb-2">
                  Ready to generate your decision tree!
                </p>
                <button
                  onClick={handleGenerateTree}
                  disabled={isGenerating}
                  className="w-full rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:from-emerald-500 hover:to-emerald-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg disabled:hover:shadow-md"
                >
                  {isGenerating ? "Generating Tree..." : "Generate Decision Tree"}
                </button>
              </div>
            )}

            {/* Input Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex gap-2">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={handleAiKeyDown}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                  placeholder="Type your response..."
                  disabled={isLoading || isGenerating}
                />
                <button
                  onClick={handleAiSend}
                  disabled={isLoading || isGenerating || !aiInput.trim()}
                  className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:from-slate-800 hover:to-slate-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg disabled:hover:shadow-md"
                >
                  Send
                </button>
              </div>

              <p className="mt-3 text-[10px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
                Have a natural conversation about your goal. The AI will ask
                follow-up questions to understand your needs, then generate a
                complete decision tree on the canvas.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
