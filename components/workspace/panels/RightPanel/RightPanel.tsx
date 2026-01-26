// components/workspace/panels/RightPanel/RightPanel.tsx
export default function RightPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">AI Chat</h2>
        <p className="mt-1 text-xs text-slate-500">
          Calm, reflective, subtle motivation. AI asks clarifying questions.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto rounded-xl border border-slate-200 bg-white p-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-700">TreeFlow</p>
          <p className="mt-1 text-sm text-slate-800">
            What are you trying to achieve, and by when?
          </p>
          <p className="mt-2 text-xs text-slate-500">
            This is a placeholder message. Later we will store chat per tree workspace.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs font-medium text-slate-700">You</p>
          <p className="mt-1 text-sm text-slate-800">
            I want to build a guided roadmap that I can visually track.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Daily AI uses</span>
          <span className="text-xs font-semibold text-slate-900">0 / 10</span>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Type your message..."
          />
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Send
          </button>
        </div>

        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Later: messages can target specific nodes. AI proposes edits, you confirm before applying.
        </p>
      </div>
    </div>
  );
}
