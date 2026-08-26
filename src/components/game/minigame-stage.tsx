"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clapperboard, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "stage" }>;
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

export function MinigameStage({ game, onProgress, onComplete, onWrong }: Props) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [pool] = useState(() => shuffle(game.steps));
  const [progressed, setProgressed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const nextRequired = game.correctOrder[placed.length];

  function pick(stepId: string) {
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    if (stepId === nextRequired) {
      const next = [...placed, stepId];
      setPlaced(next);
      if (next.length === game.steps.length) {
        setTimeout(onComplete, 600);
      }
    } else {
      setWrongId(stepId);
      onWrong?.(stepId);
      setTimeout(() => setWrongId(null), 600);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Clapperboard className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Adegan: {placed.length}/{game.steps.length}
        </span>
      </div>

      <p className="font-nunito text-sm text-[#E2ECEF]">
        Sentuh kartu adegan secara berurutan dari awal hingga akhir.
      </p>

      {/* Slots adegan yang sudah disusun */}
      <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-2">
        {game.correctOrder.map((id, i) => {
          const step = game.steps.find((s) => s.id === id)!;
          const isFilled = i < placed.length;
          return (
            <div
              key={id}
              className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border-2 transition-all ${
                isFilled
                  ? "border-[#19D29F] bg-[#19D29F]/20"
                  : "border-dashed border-[#FFB319]/40 bg-[#0F3943]"
              }`}
            >
              {isFilled ? (
                <GameAsset emoji={step.emoji} image={step.image} alt={step.label} size={44} draggable={false} />
              ) : (
                i + 1
              )}
            </div>
          );
        })}
      </div>

      {/* Kartu adegan (acak) */}
      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {pool.map((step) => {
          const isUsed = placed.includes(step.id);
          const isWrong = wrongId === step.id;
          return (
            <button
              key={step.id}
              type="button"
              disabled={isUsed}
              onClick={() => pick(step.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center transition-all ${
                isUsed
                  ? "opacity-40"
                  : isWrong
                    ? "animate-pulse border-[#E63946] bg-[#E63946]/20"
                    : "border-[#FFB319]/40 bg-[#09242B] hover:border-[#19D29F]"
              }`}
            >
              <GameAsset emoji={step.emoji} image={step.image} alt={step.label} size={44} draggable={false} />
              <span className="font-nunito text-xs font-semibold text-white">{step.label}</span>
              {step.description && (
                <span className="font-nunito text-[10px] text-[#8DA2A6]">{step.description}</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {placed.length === game.steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Alur tersusun sempurna!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
