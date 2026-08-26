"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "puzzle" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigamePuzzle({ game, onProgress, onComplete, onWrong: _ }: Props) {
  const [index, setIndex] = useState(0);
  const [progressed, setProgressed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const pattern = game.patterns[index];
  const solvedCount = Math.min(index + (solved ? 1 : 0), game.patterns.length);

  function pick(opt: { id: string; emoji: string }) {
    if (solved) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    if (opt.emoji === pattern.emoji) {
      setSolved(true);
      setTimeout(() => {
        if (index < game.patterns.length - 1) {
          setIndex(index + 1);
          setSolved(false);
        } else {
          onComplete();
        }
      }, 600);
    } else {
      setWrongId(opt.id);
      setTimeout(() => setWrongId(null), 600);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Puzzle className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Pola tersusun: {solvedCount}/{game.patterns.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex w-full flex-col items-center gap-4"
        >
          {/* Grid relief 2x2 dengan satu slot kosong */}
          <div className="rounded-2xl bg-[#09242B] p-4">
            <span className="mb-2 block text-center font-outfit text-sm font-bold text-[#FFB319]">
              {pattern.name}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl ${
                    solved && slot === 2
                      ? "border-2 border-[#19D29F] bg-[#19D29F]/30"
                      : slot === 2
                        ? "border-2 border-dashed border-[#FFB319] bg-[#0F3943]"
                        : "border border-[#8DA2A6]/40 bg-[#0F3943]"
                  }`}
                >
                  {slot === 2 ? (
                    solved ? (
                      <GameAsset emoji={pattern.emoji} image={pattern.image} alt={pattern.name} size={48} />
                    ) : (
                      <span className="text-2xl">?</span>
                    )
                  ) : (
                    <GameAsset emoji={pattern.emoji} image={pattern.image} alt={pattern.name} size={48} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="font-nunito text-sm text-[#E2ECEF]">
            Pilih relief yang pas untuk melengkapi pola!
          </p>

          {/* Options */}
          <div className="grid grid-cols-4 gap-3">
            {pattern.options.map((opt) => {
              const isWrong = wrongId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => pick(opt)}
                  disabled={solved}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all ${
                    isWrong
                      ? "animate-pulse border-[#E63946] bg-[#E63946]/20"
                      : "border-[#FFB319]/40 bg-[#09242B] hover:border-[#19D29F]"
                  }`}
                >
                  <GameAsset emoji={opt.emoji} image={opt.image} alt={opt.label} size={48} />
                  <span className="font-nunito text-xs text-white">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {solved && (
            <div className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]">
              <Check size={16} /> Pas!
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
