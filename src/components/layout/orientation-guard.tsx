"use client";

import { useOrientation } from "@/hooks/use-orientation";
import { RotateCw, Monitor, Tablet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OrientationGuard({ children }: { children: React.ReactNode }) {
  const { status, isReady } = useOrientation();

  // Jika landscape OK, tampilkan konten
  if (isReady) {
    return <>{children}</>;
  }

  // Overlay untuk portrait / landscape kecil
  return (
    <>
      {/* Render children di background (tetap ada tapi tidak terlihat) */}
      <div className="invisible">{children}</div>

      {/* Overlay pesan */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-deep-indigo via-deep-indigo to-candi-stone"
        >
          <div className="max-w-2xl px-8 text-center">
            {/* Icon animasi */}
            <motion.div
              animate={{ 
                rotate: status === "portrait" ? [0, 90, 90] : [0, 0, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-batik-gold/20 backdrop-blur-sm"
            >
              {status === "portrait" ? (
                <RotateCw className="h-16 w-16 text-batik-gold" />
              ) : (
                <Monitor className="h-16 w-16 text-batik-gold" />
              )}
            </motion.div>

            {/* Judul */}
            <h1 className="font-fredoka text-4xl font-bold text-warm-cream md:text-5xl">
              {status === "portrait" 
                ? "Putar Perangkat Anda" 
                : "Perangkat Tidak Mendukung"}
            </h1>

            {/* Deskripsi */}
            <p className="mt-6 font-nunito text-lg text-warm-cream/80 md:text-xl">
              {status === "portrait" ? (
                <>
                  Petualangan Tenun Nusantara dirancang untuk pengalaman{" "}
                  <span className="font-semibold text-batik-gold">landscape</span>.
                  <br />
                  Silakan putar perangkat Anda ke posisi horizontal.
                </>
              ) : (
                <>
                  Untuk pengalaman terbaik, gunakan perangkat dengan layar lebih besar.
                  <br />
                  <span className="mt-2 inline-block font-semibold text-batik-gold">
                    Rekomendasi: Desktop, Laptop, atau Tablet dalam mode landscape.
                  </span>
                </>
              )}
            </p>

            {/* Info tambahan */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-2 rounded-full bg-warm-cream/10 px-4 py-2 backdrop-blur-sm">
                <Monitor className="h-5 w-5 text-batik-gold" />
                <span className="font-nunito text-sm text-warm-cream">
                  Desktop / Laptop
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-warm-cream/10 px-4 py-2 backdrop-blur-sm">
                <Tablet className="h-5 w-5 text-batik-gold" />
                <span className="font-nunito text-sm text-warm-cream">
                  Tablet (Landscape)
                </span>
              </div>
            </div>

            {/* Footer branding */}
            <div className="mt-12 font-caveat text-xl text-batik-gold/60">
              Tenun Nusantara × NALA
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}