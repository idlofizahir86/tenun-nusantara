import { LoadingShip } from "./loading-ship";

// UI loading default untuk App Router (file loading.tsx) — kapal berlayar
// tampil penuh layar saat sebuah route sedang dimuat/navigasi.
export function PageLoading({ label = "Kapal sedang berlayar…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-[#060F14] px-6 py-16">
      <LoadingShip size={88} />
      <p className="font-outfit text-sm font-bold text-white/80">{label}</p>
    </div>
  );
}
