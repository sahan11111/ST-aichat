"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { User } from "@/types/user";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      {user ? <p>Signed in as {user.email}</p> : <p>Not signed in.</p>}
      <Link href="/chat" className="underline">
        Back to chat
      </Link>
    </main>
  );
}
