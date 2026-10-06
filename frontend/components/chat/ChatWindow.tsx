"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api";
import { tokens } from "@/lib/auth";
import { cn } from "@/lib/utils";
import ThreeBackground from "@/components/ui/ThreeBackground";
import type { Conversation, Message } from "@/types/chat";

export default function ChatWindow({ conversationId }: { conversationId?: number }) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await api.conversations());
    } catch {
      tokens.clear();
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!tokens.access) router.push("/login");
    else loadConversations();
  }, [loadConversations, router]);

  useEffect(() => {
    if (conversationId) {
      api.messages(conversationId).then(setMessages).catch(() => setMessages([]));
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  async function send(e?: React.FormEvent, customPrompt?: string) {
    if (e) e.preventDefault();
    const text = (customPrompt ?? input).trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    setError("");

    setMessages((m) => [
      ...m,
      { id: -Date.now(), role: "user", content: text, created_at: new Date().toISOString() },
    ]);

    try {
      const res = await api.chat(text, conversationId);
      setMessages((m) => [...m, res.assistant_message]);
      if (!conversationId) router.push(`/chat/${res.conversation_id}`);
      loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function remove(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.remove(id);
      if (id === conversationId) router.push("/chat");
      loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete conversation");
    }
  }

  const currentTitle = conversations.find((c) => c.id === conversationId)?.title ?? "New Conversation";

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#070514] text-neutral-100 font-sans">
      {/* 3D WebGL Canvas Layer */}
      <ThreeBackground variant="chat" />

      {/* Sidebar */}
      <aside className="relative z-10 hidden w-72 flex-col border-r border-white/10 bg-[#0d0a21]/80 backdrop-blur-2xl md:flex">
        {/* Logo / Brand Header */}
        <Link href="/" className="flex items-center gap-3 border-b border-white/10 p-5 transition hover:bg-white/5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-600 shadow-md shadow-violet-500/30">
            <span className="text-sm font-extrabold text-white tracking-tighter">ST</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold tracking-tight text-white text-base">ST</span>
              <span className="font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent text-base">Ai</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini &amp; Groq
            </div>
          </div>
        </Link>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => router.push("/chat")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/35"
          >
            <svg width="16" height="16" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
          <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-white/30">
            Recent Conversations
          </p>
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-white/30">No conversations yet</p>
          ) : (
            conversations.map((c) => {
              const isActive = c.id === conversationId;
              return (
                <div
                  key={c.id}
                  onClick={() => router.push(`/chat/${c.id}`)}
                  className={cn(
                    "group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive
                      ? "bg-violet-600/20 text-white font-medium shadow-sm border border-violet-500/30"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <svg
                      width="16"
                      height="16"
                      className={cn("h-4 w-4 shrink-0", isActive ? "text-violet-400" : "text-white/40")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button
                    onClick={(e) => remove(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 transition"
                    title="Delete conversation"
                  >
                    <svg width="16" height="16" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User Footer / Log Out */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => {
              tokens.clear();
              router.push("/login");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <svg width="16" height="16" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <section className="relative z-10 flex flex-1 flex-col overflow-hidden backdrop-blur-[2px]">
        {/* Chat Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0d0a21]/50 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/chat")}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/70"
            >
              <svg width="20" height="20" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="max-w-md truncate text-base font-semibold text-white">
              {currentTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Dual-AI Engine
            </span>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-8">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center pt-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 shadow-xl shadow-violet-500/10">
                <svg
                  width="32"
                  height="32"
                  className="h-8 w-8 text-violet-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">How can I assist you today?</h3>
              <p className="mt-1.5 text-sm text-white/50">
                Powered by Google Gemini and Groq ultra-fast intelligence
              </p>

              {/* Starter Suggestions */}
              <div className="mt-8 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[
                  "Explain quantum computing in simple terms",
                  "Write a clean FastAPI endpoint with auth",
                  "Compare Gemini Flash vs Groq speed",
                  "Draft a professional cold email",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => send(undefined, prompt)}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 text-left text-xs text-white/70 backdrop-blur-md transition hover:border-violet-500/40 hover:bg-white/10 hover:text-white"
                  >
                    <span>{prompt}</span>
                    <svg
                      width="16"
                      height="16"
                      className="h-4 w-4 shrink-0 text-violet-400 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300">
                      <svg width="16" height="16" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg md:max-w-[75%]",
                      isUser
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-violet-500/15"
                        : "border border-white/10 bg-white/[0.06] backdrop-blur-xl text-neutral-100 rounded-tl-sm max-w-none"
                    )}
                  >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              );
            })
          )}

          {sending && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300">
                <svg width="16" height="16" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl px-4 py-3 text-xs text-white/60">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2">Synthesizing response…</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <svg width="16" height="16" className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-6">
          <form
            onSubmit={(e) => send(e)}
            className="mx-auto flex max-w-4xl items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] p-2 shadow-2xl backdrop-blur-2xl transition focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/25"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything… (Powered by Gemini & Groq)"
              maxLength={10000}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/35 outline-none"
            />
            <button
              disabled={sending || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              title="Send message"
            >
              <svg
                width="16"
                height="16"
                className="h-4 w-4 rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-white/25">
            AI Chat can provide creative and informative answers. Verify critical details.
          </p>
        </div>
      </section>
    </div>
  );
}
