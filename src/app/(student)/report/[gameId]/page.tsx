"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReportView } from "@/components/report/report-view";
import { loadGame } from "@/lib/session/game-store";
import { AppNavbar } from "@/components/layout/app-navbar";

type Status = "loading" | "ok" | "notfound";

// Muat permainan dari kode pendek (gameId), lalu tampilkan laporan game tsb.
// Berguna untuk membagikan / melanjutkan hasil lewat URL.
export default function ReportGamePage() {
  const params = useParams();
  const gameId = Array.isArray(params?.gameId)
    ? (params.gameId[0] as string)
    : String(params?.gameId ?? "");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      const ok = await loadGame(gameId);
      if (active) setStatus(ok ? "ok" : "notfound");
    })();
    return () => {
      active = false;
    };
  }, [gameId]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <AppNavbar active="peta-bakat" />
        <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-[#09242B]">
          <span className="font-outfit text-lg font-bold text-white">
            Memuat laporan {gameId}…
          </span>
        </div>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <AppNavbar active="peta-bakat" />
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-4 bg-[#09242B] px-6 text-center">
          <span className="font-outfit text-lg font-bold text-white">
            Laporan tidak ditemukan.
          </span>
          <span className="font-manrope text-sm text-[#8DA2A6]">
            Periksa kembali kode <span className="text-[#FFB319]">{gameId}</span>.
          </span>
        </div>
      </div>
    );
  }

  return <ReportView />;
}
