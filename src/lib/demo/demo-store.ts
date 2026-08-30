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
const KEY_INSTANT = "tenun-demo-instant";
const listeners = new Set<() => void>();

let demo = false;
try {
  if (typeof localStorage !== "undefined") demo = localStorage.getItem(KEY) === "1";
} catch {
  demo = false;
}

// "NALA Instan": balasan refleksi dipakai seketika tanpa menunggu AI (untuk demo cepat).
let demoInstant = false;
try {
  if (typeof localStorage !== "undefined")
    demoInstant = localStorage.getItem(KEY_INSTANT) === "1";
} catch {
  demoInstant = false;
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

export function isDemoInstant(): boolean {
  return demoInstant;
}

export function setDemoInstant(on: boolean): void {
  demoInstant = on;
  try {
    localStorage.setItem(KEY_INSTANT, on ? "1" : "0");
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
