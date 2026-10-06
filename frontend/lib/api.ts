import { tokens } from "./auth";
import type { Conversation, Message } from "@/types/chat";
import type { TokenResponse } from "@/types/auth";
import type { User } from "@/types/user";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (tokens.access) headers.set("Authorization", `Bearer ${tokens.access}`);

  const res = await fetch(`${BASE}/api${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? err.message ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  register: (email: string, password: string, full_name = "") =>
    request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),
  login: (email: string, password: string) =>
    request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<User>("/auth/me"),
  conversations: (q?: string) =>
    request<Conversation[]>(`/conversations${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  messages: (id: number) => request<Message[]>(`/conversations/${id}/messages`),
  rename: (id: number, title: string) =>
    request<Conversation>(`/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  remove: (id: number) => request<void>(`/conversations/${id}`, { method: "DELETE" }),
  chat: (message: string, conversation_id?: number) =>
    request<{ conversation_id: number; assistant_message: Message; user_message: Message }>(
      "/chat",
      { method: "POST", body: JSON.stringify({ message, conversation_id }) }
    ),
};
