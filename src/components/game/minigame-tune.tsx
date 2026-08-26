"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "tune" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

const TOLERANCE = 4;
const STEP = 4;

export function MinigameTune({ game, onProgress, onComplete, onWrong: _ }: Props) {
  const [positions, setPositions] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    game.notes.forEach((n) => {
      // mulai acak di posisi yang salah agar tidak langsung selesai
      init[n.id] = (n.target + 35) % 100;
    });
    return init;
  });
  const [progressed, setProgressed] = useState(false);

  const locked = game.notes.filter((n) => Math.abs((positions[n.id] ?? 0) - n.target) <= TOLERANCE);

  useEffect(() => {
    if (locked.length === game.notes.length && locked.length > 0) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
  }, [locked.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function adjust(id: string, delta: number) {
    if (locked.some((n) => n.id === id)) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    setPositions((p) => {
      const cur = (p[id] ?? 0) + delta;
      return { ...p, [id]: Math.max(0, Math.min(100, cur)) };
    });
  }

  const allDone = locked.length === game.notes.length;

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Music className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Nada selaras: {locked.length}/{game.notes.length}
        </span>
      </div>

      <p className="font-nunito text-sm text-[#E2ECEF]">
        Atur tiap nada agar berada di dalam zona emas agar gamelan selaras!
      </p>

      <div className="flex w-full max-w-3xl flex-col gap-5">
        {game.notes.map((note) => {
          const pos = positions[note.id] ?? 0;
          const isLocked = Math.abs(pos - note.target) <= TOLERANCE;
          return (
            <div
              key={note.id}
              className={`flex items-center gap-4 rounded-2xl border-2 p-3 transition-colors ${
                isLocked ? "border-[#19D29F] bg-[#19D29F]/10" : "border-[#FFB319]/40 bg-[#09242B]"
              }`}
            >
              <GameAsset
                emoji={note.emoji}
                image={note.image}
                alt={note.name}
                size={44}
                className="rounded-lg"
              />
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-outfit text-sm font-bold text-white">{note.name}</span>
                {/* Track */}
                <div className="relative h-5 w-full rounded-full bg-[#0F3943]">
                  {/* Zona target */}
                  <div
                    className="absolute top-0 h-full rounded-full bg-[#FFB319]/30"
                    style={{
                      left: `${Math.max(0, note.target - TOLERANCE)}%`,
                      width: `${Math.min(100, note.target + TOLERANCE) - Math.max(0, note.target - TOLERANCE)}%`,
                    }}
                  />
                  {/* Marker */}
                  <div
                    className={`absolute top-1/2 h-7 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${
                      isLocked ? "bg-[#19D29F]" : "bg-white"
                    }`}
                    style={{ left: `${pos}%` }}
                  />
                </div>
              </div>
              {/* Controls */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjust(note.id, -STEP)}
                  disabled={isLocked}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F3943] text-white disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-outfit text-[11px] font-bold text-[#E2ECEF]">{pos}</span>
                <button
                  type="button"
                  onClick={() => adjust(note.id, STEP)}
                  disabled={isLocked}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F3943] text-white disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              {isLocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#19D29F] text-[#0B1D23]"
                >
                  <Check size={18} />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Gamelan selaras!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
