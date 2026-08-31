"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { islands } from "@/config/islands";
import { LoadingShip } from "@/components/ui/loading-ship";

// Aturan jelajah: pulau yang sudah dijelajahi tidak bisa dijelajahi kembali,
// KECUALI semua pulau sudah dijelajahi (baru bisa dijelajahi ulang).
// Guard ini memblokir akses langsung ke URL pulau yang sudah dikerjakan.
export function IslandLockGuard({
  islandId,
  children,
}: {
  islandId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "open" | "locked">("checking");

  useEffect(() => {
    let unlocked = false;
    try {
      const raw = localStorage.getItem("tenun-progress");
      const data = raw ? JSON.parse(raw) : {};
      const list = Array.isArray(data?.completedIslands)
        ? (data.completedIslands as string[])
        : [];
      const completed = new Set(list);
      const allExplored = completed.size >= islands.length;
      unlocked = !(completed.has(islandId) && !allExplored);
    } catch {
      unlocked = true;
    }
    setState(unlocked ? "open" : "locked");
  }, [islandId]);

  if (state === "checking") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09242B]">
        <LoadingShip size={96} label="Kapal sedang berlayar…" />
      </div>
    );
  }

  if (state === "locked") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#09242B] px-6 text-center">
        <span className="font-outfit text-3xl">🔒</span>
        <h1 className="font-outfit text-xl font-extrabold text-[#FFB319]">
          Pulau Sudah Dijelajahi
        </h1>
        <p className="max-w-md font-nunito text-sm text-white/80">
          Kamu sudah menyelesaikan pulau ini. Jelajahi pulau lain dulu ya — atau kembali ke peta
          untuk melihat kemajuanmu!
        </p>
        <button
          type="button"
          onClick={() => router.push("/map")}
          className="rounded-[32px] bg-[#FFB319] px-6 py-2.5 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
        >
          Kembali ke Peta
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
