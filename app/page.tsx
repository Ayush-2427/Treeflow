import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
            TreeFlow
            <span className="text-slate-400">|</span>
            Calm planning, visual clarity
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Think better with a visual decision tree
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            A simple workspace where your tree is the source of truth. The AI can suggest edits, but you stay in control.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              Log in
            </Link>
            <Link
              href="/workspace"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium hover:bg-slate-100"
            >
              Open workspace
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold">Tree is truth</p>
              <p className="mt-1 text-sm text-slate-600">
                Progress, steps, and decisions live in the map.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold">AI suggests, you confirm</p>
              <p className="mt-1 text-sm text-slate-600">
                Big changes require preview and highlighted nodes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold">Clarity first</p>
              <p className="mt-1 text-sm text-slate-600">
                If input is vague, AI asks better questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
