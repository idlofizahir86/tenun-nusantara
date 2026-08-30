"use client";

// ============================================================
// Telemetry tracker (client-side).
// Mencatat event ke remote via /api/telemetry secara berkelompok
// (batch) dengan antrean di localStorage. Aman: no-op bila telemetri
// dimatikan / Supabase belum dikonfigurasi.
//
// Catatan: sengaja TIDAK mengimpor dari session.ts (runtime) untuk
// menghindari circular dependency. Data sesi dibaca langsung dari
// localStorage.
// ============================================================

import type { SessionEvent } from "@/lib/session/session";

const QUEUE_KEY = "tenun-sync-queue";
const SESSION_KEY = "tenun-session";
const FLUSH_THRESHOLD = 5;

function telemetryEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === "true";
}

function readQueue(): SessionEvent[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as SessionEvent[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(q: SessionEvent[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {
    // abaikan
  }
}

function readSessionPayload(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return {
      id: s.id,
      gameCode: s.gameCode,
      startedAt: s.startedAt,
      lastActiveAt: s.lastActiveAt,
      player: s.player || undefined,
      currentIsland: s.currentIsland,
      currentAct: s.currentAct,
      completedIslands: Array.isArray(s.completedIslands) ? s.completedIslands : [],
      xp: s.xp || 0,
      level: s.level || 1,
      badges: Array.isArray(s.badges) ? s.badges : [],
    };
  } catch {
    return null;
  }
}

// Identitas akun (saat login) + perangkat, untuk pemetaan data di backend.
function readIdentity(): { profileId: string | null; deviceKey: string } {
  let profileId: string | null = null;
  let deviceKey = "";
  try {
    profileId = localStorage.getItem("tenun-user-id");
    deviceKey =
      localStorage.getItem("tenun-device") ||
      (() => {
        const d = "dev-" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem("tenun-device", d);
        return d;
      })();
  } catch {
    deviceKey = deviceKey || "dev-unknown";
  }
  return { profileId, deviceKey };
}

let flushing = false;

export async function flushSync(): Promise<void> {
  if (!telemetryEnabled() || flushing) return;
  const q = readQueue();
  if (q.length === 0) return;
  flushing = true;
  try {
    const session = readSessionPayload();
    const { profileId, deviceKey } = readIdentity();
    const res = await fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session,
        events: q,
        profileId,
        deviceKey,
      }),
    });
    if (res.ok) writeQueue([]);
  } catch {
    // gagal — antrean dipertahankan untuk retry berikutnya
  } finally {
    flushing = false;
  }
}

/** Enqueue sebuah event; flush otomatis saat antrean cukup penuh. */
export async function trackEvent(ev: SessionEvent): Promise<void> {
  if (!telemetryEnabled()) return;
  const q = readQueue();
  q.push(ev);
  writeQueue(q);
  if (q.length >= FLUSH_THRESHOLD) {
    await flushSync();
  }
}

// Flush sisa antrean saat pengguna meninggalkan halaman.
let registered = false;
export function ensurePageHideFlush(): void {
  if (registered || typeof window === "undefined") return;
  registered = true;
  window.addEventListener("pagehide", () => {
    flushSync();
  });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSync();
  });
}
