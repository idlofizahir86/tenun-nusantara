"use client";

// ============================================================
// Pengaturan Suara Global (mute/unmute).
// Disimpan di localStorage ("tenun-mute") agar berlaku di
// semua halaman & persisten antar sesi.
// ============================================================

const KEY = "tenun-mute";
const listeners = new Set<() => void>();

let muted = false;
try {
  if (typeof localStorage !== "undefined") {
    muted = localStorage.getItem(KEY) === "1";
  }
} catch {
  muted = false;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean): void {
  muted = m;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(KEY, m ? "1" : "0");
    }
  } catch {
    // abaikan
  }
  listeners.forEach((l) => l());
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

export function subscribeSound(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
