"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gem, Settings, Ship, Anchor, Maximize, BarChart3, Zap, Check } from "lucide-react";
import { getSession } from "@/lib/session/session";
import { AppNavbar } from "@/components/layout/app-navbar";
import { useDemo } from "@/hooks/use-demo";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

const LEVELS = [
  { level: 1, title: "Pelaut Pemula" },
  { level: 2, title: "Kadet Penjelajah" },
  { level: 3, title: "Navigator Muda" },
  { level: 4, title: "Sang Pemimpin Armada" },
  { level: 5, title: "Laksamana Nusantara" },
  { level: 6, title: "Legenda Nusantara" },
];

const ISLANDS = [
  {
    id: "harmoni",
    name: "Pulau Harmoni",
    img: "/assets/images/map/island_harmoni.png",
    left: 10,
    top: 19.3,
    href: "/island/harmoni",
  },
  {
    id: "rimba",
    name: "Pulau Rimba",
    img: "/assets/images/map/island_rimba.png",
    left: 77.7,
    top: 38.7,
    href: "/island/rimba",
  },
  {
    id: "terapung",
    name: "Pulau Terapung",
    img: "/assets/images/map/island_terapung.png",
    left: 41.6,
    top: 38.6,
    href: "/island/terapung",
  },
  {
    id: "aksara",
    name: "Pulau Aksara",
    img: "/assets/images/map/island_aksara.png",
    left: 57,
    top: 55.6,
    href: "/island/aksara",
  },
  {
    id: "candi",
    name: "Pulau Candi",
    img: "/assets/images/map/island_candi.png",
    left: 27,
    top: 65.4,
    href: "/island/candi",
  },
];

const SHIP_START = { left: 36, top: 68.7 };

export default function MapPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<{
    name: string;
    characterId: string;
  }>({ name: "", characterId: "siti" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [session] = useState(getSession());
  // Live Demo Mode — status + gate password
  const { demo, enable, disable } = useDemo();
  const [demoAuthOpen, setDemoAuthOpen] = useState(false);
  const [demoPasswordInput, setDemoPasswordInput] = useState("");
  const [demoError, setDemoError] = useState<string | null>(null);

  function tryEnableDemo() {
    if (enable(demoPasswordInput)) {
      setDemoAuthOpen(false);
      setDemoPasswordInput("");
      setDemoError(null);
    } else {
      setDemoError("Password salah. Coba lagi.");
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-player");
      if (raw) {
        const data = JSON.parse(raw);
        setPlayer({
          name: data.name || "",
          characterId: data.characterId || "siti",
        });
      }
    } catch {
      // abaikan
    }
  }, []);

  // Baca jumlah pulau UNIK yang sudah diselesaikan (maks 5).
  // Memainkan pulau yang sama berulang kali tidak menambah hitungan.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-progress");
      if (raw) {
        const data = JSON.parse(raw);
        const list = Array.isArray(data?.completedIslands)
          ? (data.completedIslands as string[])
          : [];
        const set = new Set(list);
        setCompletedSet(set);
        setCompletedCount(set.size);
      }
    } catch {
      // abaikan
    }
  }, []);

  // Minta fullscreen saat masuk halaman map (best-effort, butuh user gesture)
  useEffect(() => {
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    } catch {
      // abaikan
    }
  }, []);

  // Pantau status fullscreen
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Tutup menu pengaturan saat klik di luar / tekan Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (t && !t.closest("[data-settings-menu]")) setIsSettingsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSettingsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = ISLANDS.find((i) => i.id === selectedId) ?? null;
  // Aturan jelajah: pulau yang sudah dijelajahi tidak bisa dikunjungi lagi,
  // KECUALI semua pulau sudah dijelajahi (baru bisa dijelajahi ulang).
  const allExplored = completedCount >= ISLANDS.length;
  const isIslandLocked = (id: string) => completedSet.has(id) && !allExplored;
  // Kapalmu memosisikan diri di pulau terakhir yang dibuka (dari resume sesi),
  // bukan selalu kembali ke titik awal (Candi).
  const lastOpened = ISLANDS.find((i) => i.id === session.currentIsland) ?? null;
  const shipTarget = selected
    ? { left: selected.left - 4, top: selected.top - 6 }
    : lastOpened
      ? { left: lastOpened.left - 4, top: lastOpened.top - 6 }
      : SHIP_START;
  const displayName = player.name || "Penjelajah";
  const levelInfo = LEVELS[Math.min(completedCount, LEVELS.length - 1)];

  function enterFullscreen() {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // abaikan
    }
  }

  function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // abaikan
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <AppNavbar active="peta" />
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      {/* Map Canvas */}
      <main className="relative min-h-0 w-full flex-1 overflow-hidden">
        <Image
          src="/assets/images/map/map-indonesia.png"
          alt="Peta Nusantara"
          fill
          priority
          className="object-cover"
        />

        {/* Fullscreen Prompt */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[#FFB319] bg-[#0F3943] px-5 py-3 shadow-lg"
          >
            <span className="font-nunito text-sm font-semibold text-white">
              Mode layar penuh untuk pengalaman terbaik!
            </span>
            <button
              type="button"
              onClick={enterFullscreen}
              className="inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-5 py-2 font-outfit text-[13px] font-extrabold uppercase leading-[17px] text-[#0B1D23] transition-transform hover:scale-105"
            >
              <Maximize size={16} />
              Layar Penuh
            </button>
          </motion.div>
        )}

        {/* Island Pins */}
        {ISLANDS.map((island) => {
          const isSelected = selectedId === island.id;
          const isExplored = completedSet.has(island.id);
          return (
            <button
              key={island.id}
              type="button"
              onClick={() => setSelectedId(island.id)}
              className={`absolute flex flex-col items-center gap-2 transition-all duration-200 ${
                isSelected ? "scale-105" : "opacity-90 hover:scale-105"
              }`}
              style={{ left: `${island.left}%`, top: `${island.top}%`, zIndex: 2 }}
            >
              <div
                className={`relative flex items-start rounded-2xl bg-[#0F3943] p-2 ${
                  isExplored
                    ? "border-[3px] border-[#19D29F]"
                    : isSelected
                      ? "border-2 border-[#FFB319]"
                      : "border border-[#8DA2A6]"
                }`}
              >
                <Image
                  src={island.img}
                  alt={island.name}
                  width={isSelected ? 140 : 120}
                  height={isSelected ? 100 : 80}
                  className={`rounded-lg object-cover ${isSelected ? "h-[100px] w-[140px]" : "h-20 w-[120px]"}`}
                />
                {/* Badge/lencana di gambar pulau yang sudah dijelajahi */}
                {isExplored && (
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0B1D23] bg-[#19D29F] text-[#0B1D23] shadow-lg">
                    <Check size={16} strokeWidth={3.5} />
                  </span>
                )}
              </div>
              <span
                className={`inline-block rounded-lg px-2 py-0.5 text-center font-outfit ${
                  isSelected
                    ? "bg-[#FFB319] text-[16px] font-extrabold leading-5 text-[#0B1D23]"
                    : "bg-[#09242B]/85 text-[14px] font-bold leading-[18px] text-white"
                }`}
              >
                {island.name}
              </span>
              {isExplored ? (
                <div className="flex items-start rounded-lg bg-[#19D29F] px-2.5 py-1">
                  <span className="font-manrope text-[11px] font-bold leading-[15px] text-[#0B1D23]">
                    SUDAH DIJELAJAHI
                  </span>
                </div>
              ) : (
                isSelected && (
                  <div className="flex items-start rounded-lg bg-[#19D29F] px-2.5 py-1">
                    <span className="font-manrope text-[11px] font-bold leading-[15px] text-[#0B1D23]">
                      DIPILIH
                    </span>
                  </div>
                )
              )}
            </button>
          );
        })}

        {/* Player Ship */}
        <motion.div
          className="absolute z-[5] flex flex-col items-center gap-1"
          animate={{ left: `${shipTarget.left}%`, top: `${shipTarget.top}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 14 }}
          style={{ zIndex: 5 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFB319] text-[#0B1D23]">
            <Ship size={32} />
          </div>
          <span className="font-manrope text-[15px] font-extrabold uppercase leading-5 text-[#FFAB00] [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]">
            Kapalmu
          </span>
        </motion.div>

        {/* Sail CTA — pulau yang sudah dijelajahi (belum semua selesai) diblokir */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-[#FFB319] bg-[#0F3943] px-5 py-3 shadow-lg"
          >
            {isIslandLocked(selected.id) ? (
              <>
                <span className="font-outfit text-[16px] font-bold text-white">
                  <span className="text-[#19D29F]">{selected.name}</span> sudah dijelajahi. Jelajahi pulau lain dulu ya!
                </span>
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-[32px] bg-[#8DA2A6] px-6 py-2.5 font-outfit text-[15px] font-extrabold uppercase leading-[19px] text-[#0B1D23]"
                >
                  <Check className="h-5 w-5" strokeWidth={3} />
                  Sudah Dijelajahi
                </button>
              </>
            ) : (
              <>
                <span className="font-outfit text-[16px] font-bold text-white">
                  Berlayar ke <span className="text-[#FFB319]">{selected.name}</span>?
                </span>
                <button
                  type="button"
                  onClick={() => router.push(selected.href)}
                  className="inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-6 py-2.5 font-outfit text-[15px] font-extrabold uppercase leading-[19px] text-[#0B1D23] transition-transform hover:scale-105"
                >
                  Berlayar!
                  <Anchor className="h-5 w-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </main>

      {/* Bottom Bar: Player Info + Badges + Settings */}
      <footer className="flex w-full flex-none flex-wrap items-center justify-between gap-4 border-t border-[#FFB319] bg-[#0F3943] px-5 py-4 md:px-10">
        {/* Player Info */}
        <div className="flex items-center gap-3">
          <Image
            src={AVATARS[player.characterId] ?? AVATARS.siti}
            alt={displayName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full bg-[#0F3943] object-cover"
          />
          <div className="flex flex-col items-start gap-1">
            <span className="whitespace-nowrap font-outfit text-[16px] font-bold leading-5 text-white">
              {displayName}
            </span>
            <span className="whitespace-nowrap font-manrope text-[12px] leading-4 text-[#19D29F]">
              Level {session.level} • {levelInfo.title} • {session.xp} XP
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3">
          <span className="font-outfit text-[12px] font-bold uppercase leading-[15px] text-[#FFB319]">
            Lencana Bakat
          </span>
          <div className="flex items-start gap-2">
            {Array.from({ length: 5 }, (_, i) => {
              const unlocked = i < completedCount;
              return (
                <div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    unlocked
                      ? "border-[#FFB319] bg-[#FFB319] text-[#0B1D23]"
                      : "border-[#FFB319] bg-[#09242B] text-[#FFB319]"
                  }`}
                >
                  <Gem size={16} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Report / Settings */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/report")}
            className="inline-flex items-center gap-2 rounded-full border border-[#19D29F] bg-[#09242B] px-4 py-2 font-outfit text-[13px] font-bold text-[#19D29F] transition-colors hover:bg-[#0F3943]"
          >
            <BarChart3 size={16} />
            Peta Bakat
          </button>
          {/* Pengaturan: menu pilihan (Layar Penuh dll. — siap diperluas) */}
          <div className="relative" data-settings-menu>
            <button
              aria-label="Pengaturan"
              aria-expanded={isSettingsOpen}
              onClick={() => setIsSettingsOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-[#09242B] text-[#FFB319] transition-colors hover:bg-[#0F3943]"
            >
              <Settings size={20} />
            </button>
            {isSettingsOpen && (
              <div className="absolute bottom-14 right-0 z-30 w-64 rounded-2xl border border-[#FFB319] bg-[#0F3943] p-2 shadow-2xl">
                <p className="px-3 pb-1 pt-1 font-outfit text-[11px] font-bold uppercase tracking-wide text-[#19D29F]">
                  Pengaturan
                </p>
                <ul className="flex flex-col gap-1">
                  {/* Pilihan pengaturan — tambahkan item baru di sini ke depannya */}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        toggleFullscreen();
                        setIsSettingsOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-manrope text-[14px] font-semibold text-white transition-colors hover:bg-[#09242B]"
                    >
                      <Maximize size={18} className="shrink-0 text-[#FFB319]" />
                      <span className="flex-1 text-left">
                        {isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                      </span>
                      {isFullscreen && (
                        <span className="text-[12px] font-bold text-[#19D29F]">AKTIF</span>
                      )}
                    </button>
                  </li>

                  {/* Live Demo Mode (gate password) */}
                  <li>
                    <div className="rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <Zap size={18} className="shrink-0 text-[#19D29F]" />
                        <div className="flex-1">
                          <div className="font-manrope text-[14px] font-semibold text-white">
                            Live Demo Mode
                          </div>
                          {demo && (
                            <div className="text-[10px] font-bold text-[#19D29F]">AKTIF</div>
                          )}
                        </div>
                        {demo ? (
                          <button
                            type="button"
                            onClick={() => {
                              disable();
                              setDemoAuthOpen(false);
                            }}
                            className="text-[11px] font-bold text-[#E63946] hover:underline"
                          >
                            Matikan
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDemoAuthOpen((v) => !v)}
                            className="text-[11px] font-bold text-[#FFB319] hover:underline"
                          >
                            Aktifkan
                          </button>
                        )}
                      </div>

                      {demoAuthOpen && !demo && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          <input
                            type="password"
                            value={demoPasswordInput}
                            onChange={(e) => {
                              setDemoPasswordInput(e.target.value);
                              setDemoError(null);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && tryEnableDemo()}
                            placeholder="Password demo"
                            className="rounded-lg bg-[#09242B] px-3 py-2 font-manrope text-sm text-white outline-none placeholder:text-white/40"
                          />
                          {demoError && (
                            <span className="text-[10px] font-semibold text-[#E63946]">
                              {demoError}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={tryEnableDemo}
                            className="rounded-lg bg-[#19D29F] px-3 py-1.5 text-[11px] font-extrabold uppercase text-[#0B1D23] transition-colors hover:bg-[#15b888]"
                          >
                            Aktifkan Demo
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
