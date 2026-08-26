"use client";

import { useCallback, useEffect, useState } from "react";

// Hook untuk progress pulau (disimpan di localStorage)
// tenun-progress = { completedIslands: string[] }
export function useIslandProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-progress");
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data?.completedIslands)) {
          setCompleted(data.completedIslands);
        }
      }
    } catch {
      // abaikan
    }
    setLoaded(true);
  }, []);

  const isCompleted = useCallback(
    (islandId: string) => completed.includes(islandId),
    [completed]
  );

  const completeIsland = useCallback((islandId: string) => {
    setCompleted((prev) => {
      const next = prev.includes(islandId) ? prev : [...prev, islandId];
      try {
        localStorage.setItem("tenun-progress", JSON.stringify({ completedIslands: next }));
      } catch {
        // abaikan
      }
      return next;
    });
  }, []);

  return { completed, isCompleted, completeIsland, loaded };
}
