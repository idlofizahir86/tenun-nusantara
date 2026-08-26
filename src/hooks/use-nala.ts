"use client";

import { useCallback, useState } from "react";
import type { NalaContext, NalaMessage } from "@/lib/ai/nala-agent";

// Hook untuk berinteraksi dengan NALA via API route.
export function useNala() {
  const [messages, setMessages] = useState<NalaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string, context?: NalaContext) => {
      const userMsg: NalaMessage = { role: "user", content: text };
      const next = [...messages, userMsg];
      setMessages(next);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next, context }),
        });
        const data = await res.json();
        const reply: NalaMessage = {
          role: "assistant",
          content: data.reply || "Hmm, aku belum bisa menjawab sekarang.",
        };
        setMessages((m) => [...m, reply]);
        return data.reply as string;
      } catch {
        setError("Gagal terhubung ke NALA.");
        return "";
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const reset = useCallback(() => setMessages([]), []);

  return { messages, loading, error, send, reset };
}
