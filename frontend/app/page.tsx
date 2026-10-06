"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThreeBackground from "@/components/ui/ThreeBackground";
import { tokens } from "@/lib/auth";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(tokens.access));
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070514] text-neutral-100 font-sans selection:bg-violet-500/30 selection:text-white">
      {/* 3D WebGL Canvas Layer */}
      <ThreeBackground variant="auth" />

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a071b]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-600 shadow-md shadow-violet-500/30 transition-transform group-hover:scale-105">
              <span className="text-base font-extrabold text-white tracking-tighter">ST</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-white">ST</span>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Ai</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#engines" className="transition hover:text-white">Dual Engine</a>
            <a href="#architecture" className="transition hover:text-white">Architecture</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40"
              >
                Go to Chat
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span>Dual AI Engine · Powered by Gemini &amp; Groq LPUs</span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Intelligence at the{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Speed of Thought
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base text-white/60 sm:text-lg">
            Meet <strong className="text-white font-semibold">ST Ai</strong> — the next-generation conversational platform.
            Combines Google Gemini&apos;s deep multimodal reasoning with Groq&apos;s blazing instant-token inference.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={isLoggedIn ? "/chat" : "/register"}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] hover:shadow-violet-500/40"
            >
              Start Chatting with ST Ai
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="#engines"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-medium text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              Explore Architecture
            </a>
          </div>

          {/* Key Metrics Pill */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl w-full">
            {[
              { label: "Generation Speed", val: "100+ t/s" },
              { label: "Dual Engines", val: "Gemini + Groq" },
              { label: "Time to First Token", val: "< 250ms" },
              { label: "Data Security", val: "JWT & Async DB" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
              >
                <div className="text-xl font-extrabold text-white">{stat.val}</div>
                <div className="mt-1 text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Interactive Chat Window Preview Mockup */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0e0b24]/80 shadow-2xl backdrop-blur-2xl">
              {/* Window Controls Bar */}
              <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-white/40">ST Ai · Live Session</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-medium text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Groq &amp; Gemini Online
                </div>
              </div>

              {/* Chat Simulation Content */}
              <div className="space-y-4 p-6 text-left">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-md rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm text-white shadow-md shadow-violet-500/10">
                    What makes ST Ai different from standard chatbots?
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 font-bold text-xs">
                    ST
                  </div>
                  <div className="max-w-xl rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] p-4 text-sm text-neutral-200 backdrop-blur-md leading-relaxed">
                    <p className="font-semibold text-white mb-1">
                      ST Ai fuses two industry-leading AI paradigms:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-white/70">
                      <li>
                        <strong className="text-violet-300">Google Gemini</strong> handles complex multi-step reasoning, analytical synthesis, and wide-context understanding.
                      </li>
                      <li>
                        <strong className="text-indigo-300">Groq LPUs</strong> provide instant-token streaming with sub-second time-to-first-token.
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-white/40">
                      <span className="rounded bg-white/10 px-2 py-0.5 text-white/70 font-mono">latency: 180ms</span>
                      <span>·</span>
                      <span>124 tokens generated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="relative z-10 border-t border-white/10 bg-[#09071c]/60 py-24 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              Core Capabilities
            </h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Engineered for Modern Productivity
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Dual-Core Intelligence",
                desc: "Switch dynamically between Gemini for analytical tasks and Groq for instantaneous answers.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
              },
              {
                title: "Real-Time Streaming",
                desc: "Experience fluid word-by-word generation with zero waiting or frozen screens.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
              },
              {
                title: "Full Thread Memory",
                desc: "Structured conversations preserved securely in PostgreSQL with instant search and retrieval.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                ),
              },
              {
                title: "Enterprise Grade Auth",
                desc: "Stateless JWT authentication, password hashing with bcrypt, and protected REST APIs.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                ),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-violet-500/40 hover:bg-white/[0.08]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    {f.icon}
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Engines Section */}
      <section id="engines" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-400">
              The Technology
            </h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Meet the Two Engines Inside ST Ai
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Gemini Engine Card */}
            <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/30 via-[#100d28]/70 to-[#070514] p-8 shadow-2xl backdrop-blur-2xl">
              <div className="inline-flex rounded-xl bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
                Google DeepMind
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Google Gemini</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                Renowned for long-context understanding, complex code generation, logical problem-solving, and thoughtful multi-turn conversation.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span> High-precision reasoning &amp; code generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span> Deep factual synthesis &amp; research
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-400">✓</span> Asynchronous non-blocking streaming
                </li>
              </ul>
            </div>

            {/* Groq Engine Card */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/30 via-[#100d28]/70 to-[#070514] p-8 shadow-2xl backdrop-blur-2xl">
              <div className="inline-flex rounded-xl bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                Groq LPU Architecture
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white">Groq Ultra-Fast LPU</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                Purpose-built Language Processing Units deliver unprecedented token generation speeds, eliminating latency for real-time applications.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span> Instantaneous token generation (100+ t/s)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span> Sub-second time-to-first-token
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span> Seamless OpenAI-compatible completions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative z-10 border-t border-white/10 bg-gradient-to-b from-transparent to-violet-950/20 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Start Your Journey with <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">ST Ai</span>
          </h2>
          <p className="mt-4 text-base text-white/60">
            Sign up in seconds and experience fast, intelligent conversational AI.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={isLoggedIn ? "/chat" : "/register"}
              className="rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/30 transition hover:scale-105 hover:shadow-violet-500/50"
            >
              Get Started with ST Ai Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#070514] py-8 text-center text-xs text-white/40">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-[10px] font-bold text-white">
              ST
            </div>
            <span className="font-semibold text-white">ST Ai</span>
            <span>· All systems operational</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} ST Ai. Powered by Sahan .
          </div>
        </div>
      </footer>
    </div>
  );
}
