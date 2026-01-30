/**
 * No extra installs needed.
 * All premium effects achieved with Tailwind + CSS-in-JS.
 */

'use client';

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Enhanced background with noise, grid, and animated blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] animate-blob rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] animate-blob animation-delay-2000 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] animate-blob animation-delay-4000 rounded-full bg-violet-200/20 blur-3xl" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(65%_60%_at_50%_40%,black,transparent)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgb(148_163_184)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        
        {/* Noise texture overlay */}
        <div className="noise-overlay absolute inset-0 opacity-[0.015]" />
      </div>

      {/* Content wrapper */}
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-6 sm:pt-8">
        {/* Glass Nav */}
        <header className="group sticky top-4 z-50 mb-12 flex items-center justify-between rounded-[22px] border border-white/60 bg-white/80 px-6 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_0_rgb(255,255,255,0.5)_inset] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06),0_1px_0_rgb(255,255,255,0.6)_inset]">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.04),0_1px_0_rgb(255,255,255)_inset]">
              <span className="bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-base font-bold tracking-tight text-transparent">T</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none text-slate-900">Treeflow</p>
              <p className="mt-1 text-xs text-slate-500">Calm planning, visual clarity</p>
            </div>
          </div>

          <nav className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="group/btn relative overflow-hidden rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgb(0,0,0,0.05)] transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_4px_12px_rgb(0,0,0,0.08)]"
            >
              <span className="relative z-10">Log in</span>
              <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-slate-50 to-transparent opacity-0 transition-all duration-300 group-hover/btn:translate-y-0 group-hover/btn:opacity-100" />
            </Link>
            <Link
              href="/signup"
              className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(14,116,144,0.5),0_1px_0_rgba(255,255,255,0.25)_inset] transition-all duration-300 hover:shadow-[0_8px_24px_-2px_rgba(14,116,144,0.6),0_1px_0_rgba(255,255,255,0.3)_inset] hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <span className="relative z-10">Get started</span>
              <div className="sheen absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="mt-10 grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Hero Copy */}
          <div>
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-200/60 bg-gradient-to-r from-sky-50/80 to-blue-50/80 px-4 py-2 text-xs font-medium text-sky-900 shadow-[0_2px_8px_rgba(56,189,248,0.15),0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
              </span>
              Treeflow
              <span className="text-sky-400/70">|</span>
              <span className="text-sky-700">Structure for complex thinking</span>
            </div>

            {/* Refined Headline */}
            <h1 className="mt-8 text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
              Think better with a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  visual decision tree
                </span>
                {/* Enhanced underline with glow */}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-sky-200/80 via-blue-200/80 to-indigo-200/80 opacity-70 blur-sm"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                />
              </span>
            </h1>

            {/* Improved Copy */}
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-slate-600">
              Treeflow transforms scattered thoughts into clear, structured decisions. 
              Your tree is the source of truth—AI suggests improvements, but you stay in control of every change.
            </p>

            {/* Premium CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                href="/signup"
                className="group/cta relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_24px_-3px_rgba(14,116,144,0.5),0_1px_0_rgba(255,255,255,0.25)_inset] transition-all duration-300 hover:shadow-[0_12px_32px_-3px_rgba(14,116,144,0.6),0_1px_0_rgba(255,255,255,0.3)_inset] hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                <span className="relative z-10 inline-flex items-center gap-2.5">
                  Start your first tree
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="sheen absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
              </Link>

              <Link
                href="/workspace"
                className="group/btn relative overflow-hidden rounded-xl border border-slate-300/80 bg-white px-7 py-4 text-sm font-medium text-slate-700 shadow-[0_2px_8px_rgb(0,0,0,0.04),0_1px_0_rgb(255,255,255)_inset] transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_8px_16px_rgb(0,0,0,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                <span className="relative z-10">Open workspace</span>
                <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-slate-50 to-transparent opacity-0 transition-all duration-300 group-hover/btn:translate-y-0 group-hover/btn:opacity-100" />
              </Link>

              <Link
                href="#how-it-works"
                className="rounded-xl px-7 py-4 text-sm font-medium text-slate-600 transition-all duration-200 hover:text-slate-900"
              >
                See how it works
              </Link>
            </div>

            {/* Enhanced Mini Stats - More Colorful */}
            <div className="mt-12 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="group relative overflow-hidden rounded-[20px] border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-4 shadow-[0_8px_16px_rgba(56,189,248,0.15)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(56,189,248,0.25)]">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sky-300/30 blur-xl" />
                <p className="relative text-xs font-medium text-sky-700">Human in control</p>
                <p className="relative mt-2 text-sm font-semibold text-slate-900">Preview first</p>
                <p className="relative mt-1.5 text-xs text-slate-600">AI suggests, you confirm</p>
              </div>
              
              <div className="group relative overflow-hidden rounded-[20px] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 p-4 shadow-[0_8px_16px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(99,102,241,0.25)]">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-300/30 blur-xl" />
                <p className="relative text-xs font-medium text-indigo-700">Clarity loop</p>
                <p className="relative mt-2 text-sm font-semibold text-slate-900">Ask better</p>
                <p className="relative mt-1.5 text-xs text-slate-600">Turns vague into precise</p>
              </div>
              
              <div className="group relative overflow-hidden rounded-[20px] border border-violet-200 bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 p-4 shadow-[0_8px_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_24px_rgba(139,92,246,0.25)]">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-violet-300/30 blur-xl" />
                <p className="relative text-xs font-medium text-violet-700">Decision memory</p>
                <p className="relative mt-2 text-sm font-semibold text-slate-900">Always visible</p>
                <p className="relative mt-1.5 text-xs text-slate-600">Your map holds context</p>
              </div>
            </div>
          </div>

          {/* Right: Premium Image Panel - More Colorful */}
          <div className="relative">
            {/* Stronger glow behind card */}
            <div className="absolute -inset-6 animate-pulse-slow rounded-[36px] bg-gradient-to-br from-sky-200/60 via-indigo-200/50 to-violet-200/60 blur-2xl" />
            
            <div className="relative overflow-hidden rounded-[28px] border-2 border-sky-200 bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 p-7 shadow-[0_12px_40px_rgba(56,189,248,0.25)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-[3px] hover:shadow-[0_20px_60px_rgba(56,189,248,0.35)]">
              {/* Corner glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-sky-300/40 via-indigo-300/30 to-violet-300/40 opacity-60 blur-2xl" />

              {/* Window chrome / top bar */}
              <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 shadow-inner" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 shadow-inner" />
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300 shadow-inner" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-slate-900">A living decision map</p>
                    <p className="mt-0.5 text-xs text-slate-500">Experience the Treeflow workspace</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                  Interactive
                </span>
              </div>

              {/* Premium Image Container */}
              <div className="group/img relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-[0_8px_24px_rgb(0,0,0,0.06),0_1px_0_rgb(255,255,255,0.8)_inset]">
                {/* Fallback grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full bg-[linear-gradient(to_right,rgb(148_163_184)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184)_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>
                
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-indigo-50/50" />
                
                {/* Image */}
                <Image
                  src="/home.png"
                  alt="Treeflow workspace preview showing visual decision tree interface"
                  fill
                  className="object-cover transition-transform duration-700 group-hover/img:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                
                {/* Inner border glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]" />
                
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)]" />
              </div>

              {/* Feature Pills - More Vibrant */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {/* Sky pill */}
                <div className="group relative overflow-hidden rounded-[18px] border-2 border-sky-200 bg-gradient-to-br from-sky-100 to-blue-100 p-4 shadow-[0_4px_12px_rgba(56,189,248,0.2)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_16px_rgba(56,189,248,0.3)]">
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">Suggest mode</p>
                    <p className="mt-1 text-xs text-slate-700">AI highlights gaps</p>
                  </div>
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                </div>

                {/* Indigo pill */}
                <div className="group relative overflow-hidden rounded-[18px] border-2 border-indigo-200 bg-gradient-to-br from-indigo-100 to-purple-100 p-4 shadow-[0_4px_12px_rgba(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_16px_rgba(99,102,241,0.3)]">
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">Confirm changes</p>
                    <p className="mt-1 text-xs text-slate-700">Nothing auto-applies</p>
                  </div>
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                </div>

                {/* Emerald pill */}
                <div className="group relative overflow-hidden rounded-[18px] border-2 border-emerald-200 bg-gradient-to-br from-emerald-100 to-teal-100 p-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_16px_rgba(16,185,129,0.3)]">
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">Paths, not pages</p>
                    <p className="mt-1 text-xs text-slate-700">See outcomes clearly</p>
                  </div>
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                </div>

                {/* Violet pill */}
                <div className="group relative overflow-hidden rounded-[18px] border-2 border-violet-200 bg-gradient-to-br from-violet-100 to-purple-100 p-4 shadow-[0_4px_12px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_16px_rgba(139,92,246,0.3)]">
                  <div className="relative">
                    <p className="text-sm font-semibold text-slate-900">Progress markers</p>
                    <p className="mt-1 text-xs text-slate-700">Track what matters</p>
                  </div>
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mt-24 sm:mt-28">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                How Treeflow helps you think clearly
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Not notes. Not chat. A living decision map you control. Start messy, 
                shape structure, and let clarity compound over time.
              </p>
            </div>

            <div className="hidden md:block">
              <span className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                Calm, not noisy
              </span>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Step 01 - Sky/Blue */}
            <div className="group relative overflow-hidden rounded-[24px] border-2 border-sky-200 bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50 p-7 shadow-[0_8px_24px_rgba(56,189,248,0.2)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(56,189,248,0.3)]">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-300/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative flex items-start justify-between gap-4">
                <span className="rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
                  Step 01
                </span>
                <span className="text-xs font-medium text-sky-600">Capture first. Organize later.</span>
              </div>
              
              <h4 className="relative mt-5 text-lg font-semibold tracking-tight text-slate-900">
                Start with uncertainty
              </h4>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-700">
                Drop raw thoughts, options, and doubts into the canvas. No structure required—just capture what's in your head.
              </p>
              
              <div className="relative mt-7 h-px w-full bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
              
              <p className="relative mt-4 text-xs text-slate-600">
                Tip: Keep it messy at first, then connect the dots naturally.
              </p>
            </div>

            {/* Step 02 - Indigo/Purple */}
            <div className="group relative overflow-hidden rounded-[24px] border-2 border-indigo-200 bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-50 p-7 shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(99,102,241,0.3)]">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-300/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative flex items-start justify-between gap-4">
                <span className="rounded-full border border-indigo-300 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-800 shadow-sm">
                  Step 02
                </span>
                <span className="text-xs font-medium text-indigo-600">Make tradeoffs visible.</span>
              </div>
              
              <h4 className="relative mt-5 text-lg font-semibold tracking-tight text-slate-900">
                Turn thoughts into paths
              </h4>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-700">
                Connect ideas into decisions, outcomes, and next steps. The tree becomes your source of truth and reveals relationships.
              </p>
              
              <div className="relative mt-7 h-px w-full bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
              
              <p className="relative mt-4 text-xs text-slate-600">
                Tip: Keep it messy at first, then connect the dots naturally.
              </p>
            </div>

            {/* Step 03 - Violet/Purple */}
            <div className="group relative overflow-hidden rounded-[24px] border-2 border-violet-200 bg-gradient-to-br from-violet-100 via-purple-50 to-violet-50 p-7 shadow-[0_8px_24px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(139,92,246,0.3)]">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-300/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative flex items-start justify-between gap-4">
                <span className="rounded-full border border-violet-300 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-800 shadow-sm">
                  Step 03
                </span>
                <span className="text-xs font-medium text-violet-600">You stay in control.</span>
              </div>
              
              <h4 className="relative mt-5 text-lg font-semibold tracking-tight text-slate-900">
                AI suggests, you decide
              </h4>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-700">
                Treeflow highlights gaps, suggests branches, and asks better questions. Nothing changes without your explicit confirmation.
              </p>
              
              <div className="relative mt-7 h-px w-full bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
              
              <p className="relative mt-4 text-xs text-slate-600">
                Tip: Keep it messy at first, then connect the dots naturally.
              </p>
            </div>

            {/* Step 04 - Emerald/Teal */}
            <div className="group relative overflow-hidden rounded-[24px] border-2 border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 p-7 shadow-[0_8px_24px_rgba(16,185,129,0.2)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(16,185,129,0.3)]">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-300/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative flex items-start justify-between gap-4">
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                  Step 04
                </span>
                <span className="text-xs font-medium text-emerald-600">Clarity compounds.</span>
              </div>
              
              <h4 className="relative mt-5 text-lg font-semibold tracking-tight text-slate-900">
                See progress, not chaos
              </h4>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-700">
                Your decisions stay visible over time. You always know where you are, why you're there, and what comes next.
              </p>
              
              <div className="relative mt-7 h-px w-full bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
              
              <p className="relative mt-4 text-xs text-slate-600">
                Tip: Keep it messy at first, then connect the dots naturally.
              </p>
            </div>
          </div>
        </section>

        {/* What It Is Not - More Colorful Wrapper */}
        <section className="mt-20 sm:mt-24">
          <div className="overflow-hidden rounded-[28px] border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 shadow-[0_12px_40px_rgba(100,116,139,0.15)] sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                  What Treeflow is not
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                  Treeflow is built for continuity and control, not disposable outputs 
                  or black-box automation.
                </p>
              </div>
              <span className="w-fit rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                Confidence, no noise
              </span>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {/* Not a chat - Purple theme */}
              <div className="group relative overflow-hidden rounded-[20px] border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6 shadow-[0_8px_16px_rgba(168,85,247,0.15)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(168,85,247,0.25)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-purple-300/40 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-3 text-2xl">💬</div>
                <p className="relative text-sm font-semibold text-slate-900">Not a chat that forgets</p>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-700">
                  Your reasoning stays visible in the tree, not buried in scrolling chat messages.
                </p>
              </div>

              {/* Not a notes dump - Orange theme */}
              <div className="group relative overflow-hidden rounded-[20px] border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6 shadow-[0_8px_16px_rgba(249,115,22,0.15)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(249,115,22,0.25)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-orange-300/40 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-3 text-2xl">📝</div>
                <p className="relative text-sm font-semibold text-slate-900">Not a notes dump</p>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-700">
                  Ideas become structured paths with clear outcomes, steps, and decisions you can revisit.
                </p>
              </div>

              {/* Not an AI - Cyan theme */}
              <div className="group relative overflow-hidden rounded-[20px] border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 p-6 shadow-[0_8px_16px_rgba(6,182,212,0.15)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_24px_rgba(6,182,212,0.25)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-cyan-300/40 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-3 text-2xl">🤖</div>
                <p className="relative text-sm font-semibold text-slate-900">Not an AI that takes over</p>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-700">
                  AI suggests and highlights opportunities. You review and approve every meaningful change.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Human Section - More Colorful */}
        <section className="mt-20 sm:mt-24">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-indigo-200 bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-100 p-12 shadow-[0_12px_40px_rgba(99,102,241,0.2)]">
            {/* Animated accent orbs */}
            <div className="absolute -right-32 -top-32 h-80 w-80 animate-blob rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 animate-blob animation-delay-2000 rounded-full bg-indigo-200/30 blur-3xl" />
            
            <div className="relative">
              <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                Built for people who think deeply
              </h3>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600">
                Treeflow is for moments when your head feels full, decisions feel heavy, 
                and clarity matters more than speed. It helps you slow down, see options honestly, 
                and move forward with confidence and intention.
              </p>
              
              {/* Subtle separator */}
              <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              
              <p className="mt-8 text-sm italic text-slate-500">
                Thinking is a process, not a chat.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA - More Colorful */}
        <section className="mt-20 pb-16 sm:mt-24">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-sky-200 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-12 shadow-[0_12px_40px_rgba(56,189,248,0.25)]">
            {/* Radial gradient accent */}
            <div className="absolute inset-0 bg-[radial-gradient(700px_200px_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]" />
            
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Start your first decision tree
                </h3>
                <p className="mt-3 text-base text-slate-600">
                  No pressure. Just clarity.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="group/cta relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-[0_8px_24px_-3px_rgba(14,116,144,0.5),0_1px_0_rgba(255,255,255,0.25)_inset] transition-all duration-300 hover:shadow-[0_12px_32px_-3px_rgba(14,116,144,0.6),0_1px_0_rgba(255,255,255,0.3)_inset] hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <span className="relative z-10 inline-flex items-center gap-2.5">
                    Get started
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="sheen absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
                </Link>
                <Link
                  href="/workspace"
                  className="group/btn relative overflow-hidden rounded-xl border border-slate-300/80 bg-white px-7 py-4 text-sm font-medium text-slate-700 shadow-[0_2px_8px_rgb(0,0,0,0.04),0_1px_0_rgb(255,255,255)_inset] transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_8px_16px_rgb(0,0,0,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                >
                  <span className="relative z-10">Open workspace</span>
                  <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-slate-50 to-transparent opacity-0 transition-all duration-300 group-hover/btn:translate-y-0 group-hover/btn:opacity-100" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-200/80 pt-10 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Treeflow. Built for clarity.</p>
            <div className="flex items-center gap-5">
              <Link className="transition-colors hover:text-slate-900" href="/privacy">
                Privacy
              </Link>
              <Link className="transition-colors hover:text-slate-900" href="/terms">
                Terms
              </Link>
              <Link className="transition-colors hover:text-slate-900" href="/contact">
                Contact
              </Link>
            </div>
          </footer>
        </section>
      </div>

      {/* Global Styles for Premium Effects */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        .animate-blob {
          animation: blob 25s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Noise texture */
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* Sheen effect */
        .sheen {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
        }

        /* Focus visible styles */
        *:focus-visible {
          outline: 2px solid rgb(14, 116, 144);
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}