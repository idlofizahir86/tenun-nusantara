import type { IslandConfig } from "@/types/game";
import islandsData from "./islands.json";

// ============================================================
// Konten Pulau — data-driven dari islands.json
// Semua konten (mini game, asesmen dadakan, refleksi) bisa
// diedit langsung di file islands.json tanpa menyentuh kode.
// ============================================================

export const islands = islandsData as IslandConfig[];

export function getIsland(id: string): IslandConfig | undefined {
  return islands.find((i) => i.id === id);
}
