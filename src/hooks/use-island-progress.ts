"use client";

import { useCallback, useEffect, useState } from "react";

// Hook untuk progress pulau (disimpan di localStorage)
// tenun-progress = { completedIslands: string[] }
//
// Penting: completedIslands HANYA menyimpan id pulau UNIK. Memainkan pulau
// yang sama lebih dari sekali TIDAK menambah entri lagi, sehingga lencana
// bakat (maks 5) mencerminkan jumlah pulau yang benar-benar dijelajahi.

function readCompleted(): string[] {
  try {
    const raw = localStorage.getItem("tenun-progress");
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data?.completedIslands)) {
        return [...new Set(data.completedIslands as string[])];
      }
    }
  } catch {
    // abaikan
  }
  return [];
}

function writeCompleted(list: string[]): void {
  try {
    // Selalu dedupe sebelum menulis agar tak ada pulau terulang.
    localStorage.setItem(
      "tenun-progress",
      JSON.stringify({ completedIslands: [...new Set(list)] })
    );
  } catch {
    // abaikan
  }
}

export function useIslandProgress() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCompleted(readCompleted());
    setLoaded(true);
  }, []);

  const isCompleted = useCallback(
    (islandId: string) => completed.includes(islandId),
    [completed]
  );

  const completeIsland = useCallback((islandId: string) => {
    setCompleted((prev) => {
      // Baca langsung dari storage sebagai sumber kebenaran, bukan hanya state
      // React yang mungkin basi, lalu tambahkan bila belum ada.
      const current = Array.isArray(prev) && prev.length > 0 ? prev : readCompleted();
      const next = current.includes(islandId) ? current : [...current, islandId];
      writeCompleted(next);
      return [...new Set(next)];
    });
  }, []);

  return { completed, isCompleted, completeIsland, loaded };
}
