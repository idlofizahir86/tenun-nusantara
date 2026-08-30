"use client";

// ============================================================
// Live Demo Mode — mempercepat alur aplikasi agar demo <5 menit.
//
// - Disimpan di localStorage ("tenun-demo") agar persisten.
// - Hanya aktif jika password benar (DEMO_PASSWORD).
// - Menyediakan sinyal "skip" untuk memajukan langkah seketika
//   (dipakai tombol demo pada minigame, dll).
// ============================================================

export const DEMO_PASSWORD = "ATEAM@2026";

const KEY = "tenun-demo";
const listeners = new Set<() => void>();

let demo = false;
try {
  if (typeof localStorage !== "undefined") demo = localStorage.getItem(KEY) === "1";
} catch {
  demo = false;
}

// Sinyal "lewati langkah sekarang". Setiap trigger menaikkan counter.
let skip = 0;

export function isDemo(): boolean {
  return demo;
}

export function getDemoSkip(): number {
  return skip;
}

export function setDemo(on: boolean): void {
  demo = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    // abaikan
  }
  listeners.forEach((l) => l());
}

export function checkDemoPassword(pw: string): boolean {
  return pw === DEMO_PASSWORD;
}

export function triggerDemoSkip(): void {
  skip++;
  listeners.forEach((l) => l());
}

export function subscribeDemo(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
