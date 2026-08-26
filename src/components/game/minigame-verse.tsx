"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "verse" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigameVerse({ game, onProgress, onComplete, onWrong }: Props) {
  const [index, setIndex] = useState(0);
  const [progressed, setProgressed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const stanza = game.stanzas[index];
  const [solvedCount, setSolvedCount] = useState(0);

  function pick(opt: { id: string; correct: boolean }) {
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    if (opt.correct) {
      const next = solvedCount + 1;
      setSolvedCount(next);
      setTimeout(() => {
        if (index < game.stanzas.length - 1) {
          setIndex(index + 1);
        } else {
          onComplete();
        }
      }, 700);
    } else {
      setWrongId(opt.id);
      onWrong?.(opt.id);
      setTimeout(() => setWrongId(null), 600);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Feather className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Bait selesai: {solvedCount}/{game.stanzas.length}
        </span>
      </div>

      <p className="font-nunito text-sm text-[#E2ECEF]">
        Pilih kata yang tepat untuk melengkapi bait agar bunyinya serasi.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex w-full max-w-2xl flex-col items-center gap-5"
        >
          {/* Bait */}
          <div className="w-full rounded-2xl border-2 border-[#FFB319]/40 bg-[#09242B] p-6">
            <span className="mb-3 block text-center font-outfit text-sm font-bold uppercase text-[#FFB319]">
              {stanza.title}
            </span>
            {stanza.image && (
              <div className="mb-3 flex justify-center">
                <GameAsset image={stanza.image} alt={stanza.title} size={72} draggable={false} className="rounded-xl" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              {stanza.lines.map((line, i) => (
                <p
                  key={i}
                  className={`rounded-lg px-3 py-1.5 text-center font-nunito text-base text-white ${
                    line.trim() === "__" ? "bg-[#FFB319]/15 italic text-[#FFB319]" : ""
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Pilihan kata */}
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {stanza.options.map((opt) => {
              const isWrong = wrongId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => pick(opt)}
                  className={`rounded-2xl border-2 px-4 py-3 font-nunito text-sm font-bold text-white transition-all ${
                    isWrong
                      ? "animate-pulse border-[#E63946] bg-[#E63946]/20"
                      : "border-[#FFB319]/40 bg-[#0F3943] hover:border-[#19D29F]"
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {solvedCount === game.stanzas.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Bait tersusun indah! 📜
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
