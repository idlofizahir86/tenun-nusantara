"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "match" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MinigameMatch({ game, onProgress, onComplete, onWrong }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [rightOrder] = useState(() => shuffle(game.pairs));
  const [progressed, setProgressed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const matchedCount = matched.length;

  function pickLeft(id: string) {
    if (matched.includes(id)) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    setSelectedLeft(selectedLeft === id ? null : id);
  }

  function pickRight(pairId: string, rightId: string) {
    if (!selectedLeft || matched.includes(pairId)) return;
    if (selectedLeft === pairId) {
      const next = [...matched, pairId];
      setMatched(next);
      setSelectedLeft(null);
      if (next.length === game.pairs.length) {
        setTimeout(onComplete, 600);
      }
    } else {
      setWrongId(rightId);
      onWrong?.(`${selectedLeft}->${rightId}`);
      setTimeout(() => setWrongId(null), 600);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Link2 className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Pasangan: {matchedCount}/{game.pairs.length}
        </span>
      </div>

      <p className="font-nunito text-sm text-[#E2ECEF]">
        Sentuh satu kartu di kiri, lalu sentuh pasangannya di kanan.
      </p>

      <div className="grid w-full max-w-3xl grid-cols-2 gap-4">
        {/* Kolom kiri */}
        <div className="grid grid-cols-2 gap-3">
          <span className="col-span-2 text-center font-outfit text-sm font-bold uppercase text-[#FFB319]">
            Tanda
          </span>
          {game.pairs.map((p) => {
            const isMatched = matched.includes(p.id);
            const isSelected = selectedLeft === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => pickLeft(p.id)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                  isMatched
                    ? "border-[#19D29F] bg-[#19D29F]/15 opacity-70"
                    : isSelected
                      ? "border-[#FFB319] bg-[#0F3943] ring-2 ring-[#FFB319]/40"
                      : "border-[#FFB319]/40 bg-[#09242B] hover:border-[#19D29F]"
                }`}
              >
                <GameAsset emoji={p.left.emoji} image={p.left.image} alt={p.left.label} size={84} draggable={false} />
                <span className="font-nunito text-sm font-semibold text-white">
                  {p.left.label}
                </span>
                {isMatched && <Check size={20} className="text-[#19D29F]" />}
              </button>
            );
          })}
        </div>

        {/* Kolom kanan (acak) */}
        <div className="grid grid-cols-2 gap-3">
          <span className="col-span-2 text-center font-outfit text-sm font-bold uppercase text-[#19D29F]">
            Pasangan
          </span>
          {rightOrder.map((p) => {
            const isMatched = matched.includes(p.id);
            const isWrong = wrongId === p.right.label;
            return (
              <button
                key={p.id}
                type="button"
                disabled={isMatched}
                onClick={() => pickRight(p.id, p.right.label)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                  isMatched
                    ? "border-[#19D29F] bg-[#19D29F]/15 opacity-70"
                    : isWrong
                      ? "animate-pulse border-[#E63946] bg-[#E63946]/20"
                      : "border-[#19D29F]/40 bg-[#09242B] hover:border-[#FFB319]"
                }`}
              >
                <GameAsset emoji={p.right.emoji} image={p.right.image} alt={p.right.label} size={84} draggable={false} />
                <span className="font-nunito text-sm font-semibold text-white">
                  {p.right.label}
                </span>
                {isMatched && <Check size={20} className="text-[#19D29F]" />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {matchedCount === game.pairs.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Semua pasangan tersusun!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
