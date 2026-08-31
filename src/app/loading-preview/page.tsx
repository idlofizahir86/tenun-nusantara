"use client";

import { useEffect, useState } from "react";
import { LoadingShip } from "@/components/ui/loading-ship";
import { ShipScreen } from "@/components/ui/ship-screen";

// Halaman preview sementara untuk melihat animasi loading kapal berlayar.
export default function LoadingPreviewPage() {
  const [showScreen, setShowScreen] = useState(false);

  // ShipScreen bersifat pemblokir (tanpa klik keluar); tutup otomatis agar bisa kembali.
  useEffect(() => {
    if (!showScreen) return;
    const t = setTimeout(() => setShowScreen(false), 4000);
    return () => clearTimeout(t);
  }, [showScreen]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-gradient-to-b from-[#09242B] to-[#060F14] px-6 py-16">
      <div className="text-center">
        <h1 className="font-outfit text-3xl font-extrabold text-white">
          Preview <span className="text-[#FFB319]">Loading Kapal</span> 🚢
        </h1>
        <p className="mt-2 font-nunito text-sm text-[#8DA2A6]">
          LoadingShip (inline) dalam beberapa ukuran
        </p>
      </div>

      {/* Ukuran kecil (inline di bubble/button) */}
      <div className="flex items-end gap-10 rounded-3xl border border-[#FFB319]/30 bg-[#0F3943]/70 p-6">
        <LoadingShip size={32} inline />
        <LoadingShip size={48} inline />
        <LoadingShip size={72} inline />
        <LoadingShip size={96} inline />
      </div>

      {/* Dengan label */}
      <div className="w-full max-w-sm rounded-3xl border border-[#FFB319]/30 bg-[#0F3943]/70 p-6">
        <LoadingShip size={120} label="Kapal sedang berlayar…" />
      </div>

      {/* Tombol menampilkan ShipScreen (overlay fullscreen) */}
      <button
        type="button"
        onClick={() => setShowScreen(true)}
        className="rounded-[32px] bg-[#FFB319] px-8 py-3 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-[1.02]"
      >
        Tampilkan ShipScreen (fullscreen)
      </button>
      <p className="-mt-6 font-nunito text-xs text-[#5A7378]">
        Layar penuh ini memblokir interaksi dan akan menutup otomatis setelah 4 detik.
      </p>

      <ShipScreen show={showScreen} label="Berlayar ke halaman berikutnya…" />
    </main>
  );
}
