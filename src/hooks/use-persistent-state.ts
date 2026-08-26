"use client";

import { useEffect, useRef, useState } from "react";
import { useResumeKey } from "./use-resume";

// ============================================================
// State persisten per-minigame (resume di tengah babak).
//
// Mirip `useState`, namun menyimpan nilai ke localStorage di bawah
// key `tenun-minigame-state`, dengan namespace `{resumeKey}:{componentKey}`.
// Jika anak refresh di tengah puzzle, state dipulihkan dari penyimpanan.
//
// Catatan: saat babak benar-benar selesai (pindah ke babak berikutnya),
// panggil `clearPersistentState(resumeKey)` agar tidak menumpuk.
// ============================================================

const BASE_KEY = "tenun-minigame-state";

function readAll(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(BASE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, unknown>) {
  try {
    localStorage.setItem(BASE_KEY, JSON.stringify(all));
  } catch {
    // abaikan
  }
}

/** Hapus semua state persisten untuk sebuah resumeKey (saat babak selesai). */
export function clearPersistentState(resumeKey: string): void {
  const all = readAll();
  const prefix = `${resumeKey}:`;
  let changed = false;
  for (const k of Object.keys(all)) {
    if (k.startsWith(prefix)) {
      delete all[k];
      changed = true;
    }
  }
  if (changed) writeAll(all);
}

export function usePersistentState<T>(
  componentKey: string,
  initial: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const resumeKey = useResumeKey();
  const storageKey = `${resumeKey}:${componentKey}`;

  const [state, setState] = useState<T>(() => {
    const all = readAll();
    if (storageKey in all) return all[storageKey] as T;
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const all = readAll();
    all[storageKey] = state;
    writeAll(all);
  }, [storageKey, state]);

  return [state, setState];
}
