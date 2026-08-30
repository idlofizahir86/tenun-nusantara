"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IslandConfig } from "@/types/game";
import { Reflection } from "./reflection";
import { useIslandProgress } from "@/hooks/use-island-progress";
import { getIslandAsset, getReflectionBackground } from "@/config/asset-paths";
import { islands } from "@/config/islands";
import { getActiveGameCode } from "@/lib/session/game-store";

// Wrapper client untuk halaman Refleksi terpisah (gaya Nala Companion Chat).
export function ReflectionClient({ island }: { island: IslandConfig }) {
  const router = useRouter();
  const { completeIsland } = useIslandProgress();
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-player");
      if (raw) {
        const d = JSON.parse(raw);
        setPlayerName(d.name || "");
      }
    } catch {
      // abaikan
    }
  }, []);

  function handleFinish() {
    completeIsland(island.id);
    // Setelah pulau terakhir selesai (semua pulau dijelajahi), arahkan langsung
    // ke Peta Bakat untuk melihat hasil — bukan kembali ke peta.
    let exploredCount = 0;
    try {
      const raw = localStorage.getItem("tenun-progress");
      const data = raw ? JSON.parse(raw) : {};
      const list = Array.isArray(data?.completedIslands)
        ? (data.completedIslands as string[])
        : [];
      exploredCount = new Set(list).size;
    } catch {
      exploredCount = 0;
    }
    const allExplored = exploredCount >= islands.length;
    const gameCode = getActiveGameCode();
    router.push(
      allExplored
        ? gameCode
          ? `/report/${gameCode}`
          : "/report"
        : gameCode
          ? `/map/${gameCode}`
          : "/map"
    );
  }

  const asset = getIslandAsset(island.id);

  return (
    <div className="flex h-full w-full items-center justify-center px-2 py-1">
      <Reflection
        reflection={island.reflection}
        islandId={island.id}
        image={getReflectionBackground(island.id)}
        fallbackImage={asset.fallbackBackground}
        playerName={playerName}
        onFinish={handleFinish}
      />
    </div>
  );
}
