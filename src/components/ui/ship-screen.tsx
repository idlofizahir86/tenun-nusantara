"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoadingShip } from "./loading-ship";

interface ShipScreenProps {
  /** Jika true, overlay tampil dan memblokir interaksi halaman. */
  show: boolean;
  /** Label yang tampil di bawah kapal. */
  label?: string;
  /** Ukuran kapal dalam px. */
  size?: number;
}

// Layar loading fullscreen dengan animasi kapal berlayar.
// Dipakai saat proses panjang berjalan (login, simpan, navigasi) supaya pengguna
// tidak bingung dan tidak menekan tombol berulang-ulang.
export function ShipScreen({ show, label = "Kapal sedang berlayar…", size = 96 }: ShipScreenProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-[#060F14]/85 backdrop-blur-sm"
          aria-busy="true"
        >
          <LoadingShip size={size} />
          <p className="font-outfit text-sm font-bold text-white/80">{label}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
