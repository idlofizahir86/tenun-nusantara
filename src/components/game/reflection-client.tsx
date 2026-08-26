"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IslandConfig } from "@/types/game";
import { Reflection } from "./reflection";
import { useIslandProgress } from "@/hooks/use-island-progress";
import { getIslandAsset, getReflectionBackground } from "@/config/asset-paths";

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
    router.push("/map");
  }

  const asset = getIslandAsset(island.id);

  return (
    <div className="flex h-full w-full items-center justify-center px-2 py-1">
      <Reflection
        reflection={island.reflection}
        image={getReflectionBackground(island.id)}
        fallbackImage={asset.fallbackBackground}
        playerName={playerName}
        onFinish={handleFinish}
      />
    </div>
  );
}
