// components/layout/WorkspaceShell.tsx
import type { ReactNode } from "react";

type Props = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

export default function WorkspaceShell({ left, center, right }: Props) {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto h-full max-w-[1600px] px-4 py-4">
        <div className="grid h-full min-h-0 grid-cols-12 gap-4">
          {/* LEFT */}
          <aside className="col-span-12 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <div className="h-full min-h-0 overflow-hidden">{left}</div>
          </aside>

          {/* CENTER */}
          <main className="col-span-12 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-6">
            <div className="h-full min-h-0 overflow-hidden">{center}</div>
          </main>

          {/* RIGHT */}
          <section className="col-span-12 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-3">
            <div className="h-full min-h-0 overflow-hidden">{right}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
