"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Check, RotateCcw } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "barter" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigameBarter({ game, onProgress, onComplete, onWrong }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [progressed, setProgressed] = useState(false);
  const [over, setOver] = useState(false);
  const [done, setDone] = useState(false);

  const total = selected.reduce((sum, id) => {
    const it = game.items.find((i) => i.id === id);
    return sum + (it?.value ?? 0);
  }, 0);

  function toggle(id: string) {
    if (done) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(next);

    const newTotal = next.reduce((sum, s) => {
      const it = game.items.find((i) => i.id === s);
      return sum + (it?.value ?? 0);
    }, 0);

    if (newTotal === game.target) {
      setDone(true);
      setTimeout(onComplete, 800);
    } else if (newTotal > game.target) {
      setOver(true);
      onWrong?.("over_target");
      setTimeout(() => setOver(false), 700);
    }
  }

  function reset() {
    setSelected([]);
    setOver(false);
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Target */}
      <div className="flex items-center gap-3">
        <Scale className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Target: {game.targetLabel}
        </span>
      </div>

      {/* Total */}
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 px-6 py-3 transition-colors ${
          over
            ? "border-[#E63946] bg-[#E63946]/20"
            : done
              ? "border-[#19D29F] bg-[#19D29F]/20"
              : "border-[#FFB319]/40 bg-[#09242B]"
        }`}
      >
        <span className="font-outfit text-2xl font-extrabold text-white">{total}</span>
        <span className="font-nunito text-sm text-[#E2ECEF]">/ {game.target} terkumpul</span>
      </div>

      <p className="font-nunito text-sm text-[#E2ECEF]">
        Sentuh barang untuk menukar. Jumlah harus pas mencapai target!
      </p>

      {/* Items */}
      <div className="grid w-full max-w-3xl grid-cols-3 gap-3 sm:grid-cols-4">
        {game.items.map((item) => {
          const isSel = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
                isSel
                  ? "border-[#FFB319] bg-[#0F3943] ring-2 ring-[#FFB319]/40"
                  : "border-[#FFB319]/40 bg-[#09242B] hover:border-[#19D29F]"
              }`}
            >
              <GameAsset
                emoji={item.emoji}
                image={item.image}
                alt={item.label}
                size={48}
                draggable={false}
              />
              <span className="font-nunito text-xs font-semibold text-white">{item.label}</span>
              <span className="rounded-full bg-[#FFB319]/20 px-2 py-0.5 font-outfit text-[11px] font-bold text-[#FFB319]">
                {item.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {over && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-nunito text-sm font-bold text-[#E63946]"
          >
            Terlalu banyak! Coba lagi.
          </motion.span>
        )}
        {!done && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-[32px] border border-[#FFB319]/50 bg-[#0F3943] px-5 py-2 font-outfit text-sm font-bold text-white transition-colors hover:bg-[#09242B]"
          >
            <RotateCcw size={16} /> Ulang
          </button>
        )}
        <AnimatePresence>
          {done && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
            >
              <Check size={16} /> Pas!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
