"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Compass } from "lucide-react";

// "Lanjutkan Penjelajahan": masukkan kode game (mis. TN-7K3M9X) untuk
// memuat ulang progres permainan tsb lalu melanjutkannya.
export function ContinueGame() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = (code || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!clean) {
      setError("Masukkan kode permainanmu dulu ya.");
      return;
    }
    // Navigasi ke /map/{gameId} — halaman tersebut akan memuat data game
    // (lokal lalu Supabase) dan menampilkan pesan bila kode tak ditemukan.
    const normalized = clean.startsWith("TN-") ? clean : `TN-${clean}`;
    setError(null);
    router.push(`/map/${normalized}`);
  }

  return (
    <div className="w-full max-w-[400px]">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 rounded-2xl border border-[#19D29F]/40 bg-[#0F3943] p-4"
      >
        <span className="font-outfit text-xs font-extrabold uppercase tracking-wide text-[#19D29F]">
          Lanjutkan Penjelajahan
        </span>
        <div className="flex items-center gap-2">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            placeholder="Masukkan kode game (mis. TN-7K3M9X)"
            className="w-full flex-1 rounded-lg border border-[#FFB319]/40 bg-[#09242B] px-3 py-2.5 font-outfit text-sm text-white outline-none placeholder:text-white/40"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-[32px] bg-[#19D29F] px-5 py-2.5 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
          >
            <Compass size={15} />
            Lanjut
          </button>
        </div>
        {error && <span className="text-[11px] font-semibold text-[#E63946]">{error}</span>}
      </form>
    </div>
  );
}
