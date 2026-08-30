"use client";

// ============================================================
// Helper sinkronisasi data (client-side).
// - push: event/sesi lokal -> Supabase (lewat /api/telemetry)
// - pull: ambil data sesi/event dari Supabase (untuk restore lintas
//   perangkat). MVP memakai sessionId sebagai identitas.
// Semua fungsi aman: no-op bila telemetri dimatikan / belum ada backend.
// ============================================================

import type { SessionEvent } from "@/lib/session/session";

function telemetryEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === "true";
}

/** Ambil data sesi + event dari Supabase berdasarkan sessionId. */
export async function pullRemoteSession(sessionId: string): Promise<{
  session: Record<string, unknown> | null;
  events: SessionEvent[];
}> {
  if (!telemetryEnabled() || !sessionId) {
    return { session: null, events: [] };
  }
  try {
    const res = await fetch(`/api/telemetry?sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return { session: null, events: [] };
    const data = await res.json();
    return {
      session: data.session || null,
      events: Array.isArray(data.events) ? (data.events as SessionEvent[]) : [],
    };
  } catch {
    return { session: null, events: [] };
  }
}

/** Simpan data yang ditarik dari remote ke localStorage (merge bila perlu). */
function applyRemoteToLocal(session: Record<string, unknown> | null, events: SessionEvent[]) {
  try {
    if (session?.id) {
      const current = JSON.parse(localStorage.getItem("tenun-session") || "{}");
      // Pilih yang lebih baru / lebih maju (XP lebih besar, atau remote lebih baru).
      const curXp = Number(current?.xp || 0);
      const newXp = Number(session.xp || 0);
      if (newXp >= curXp) {
        // Gabungkan pulau lokal + remote, lalu dedupe agar tak ada yang
        // hilang ("skip") atau terulang (duplikat lencana).
        const mergedIslands = [
          ...new Set([
            ...(Array.isArray(current.completedIslands) ? current.completedIslands : []),
            ...(Array.isArray(session.completed_islands) ? session.completed_islands : []),
          ]),
        ];
        localStorage.setItem(
          "tenun-session",
          JSON.stringify({
            ...current,
            id: session.id,
            startedAt: session.started_at || current.startedAt,
            lastActiveAt: session.last_active_at || current.lastActiveAt,
            currentIsland: session.current_island || current.currentIsland,
            currentAct: typeof session.current_act === "number" ? session.current_act : current.currentAct,
            completedIslands: mergedIslands,
            xp: newXp,
            level: Number(session.level || 1),
            badges: Array.isArray(session.badges) ? session.badges : current.badges || [],
          })
        );
        localStorage.setItem(
          "tenun-progress",
          JSON.stringify({ completedIslands: mergedIslands })
        );
      }
    }
    if (events.length > 0) {
      // Gabung event lokal + remote (dedupe by id), urutkan berdasarkan t.
      const local = JSON.parse(localStorage.getItem("tenun-events") || "[]");
      const map = new Map<string, SessionEvent>();
      for (const e of [...local, ...events]) map.set(e.id, e);
      const merged = [...map.values()].sort((a, b) =>
        (a.t || "").localeCompare(b.t || "")
      );
      localStorage.setItem("tenun-events", JSON.stringify(merged));
    }
  } catch {
    // abaikan
  }
}

/** Tarik seluruh data milik user yang sedang login (lintas perangkat). */
export async function pullMyRemoteData(): Promise<{
  session: Record<string, unknown> | null;
  events: SessionEvent[];
}> {
  if (!telemetryEnabled()) return { session: null, events: [] };
  try {
    const res = await fetch("/api/telemetry?mine=1");
    if (!res.ok) return { session: null, events: [] };
    const data = await res.json();
    const session = data.session || null;
    const events = Array.isArray(data.events) ? (data.events as SessionEvent[]) : [];
    applyRemoteToLocal(session, events);
    return { session, events };
  } catch {
    return { session: null, events: [] };
  }
}

/** Simpan userId akun yang login ke localStorage (dipakai push telemetri). */
export function storeAccount(userId: string | null): void {
  try {
    if (userId) localStorage.setItem("tenun-user-id", userId);
    else localStorage.removeItem("tenun-user-id");
  } catch {
    // abaikan
  }
}
