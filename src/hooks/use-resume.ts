"use client";

import { createContext, useContext } from "react";

// Konteks untuk membedakan lokasi penyimpanan state minigame.
// `resumeKey` berbentuk `{islandId}-{actIndex}` agar state tiap babak
// tidak saling menimpa, dan dapat dipulihkan saat resume.

const ResumeKeyContext = createContext<string>("");

export const ResumeKeyProvider = ResumeKeyContext.Provider;

export function useResumeKey(): string {
  return useContext(ResumeKeyContext);
}
