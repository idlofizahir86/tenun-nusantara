"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "observe" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigameObserve({ game, onProgress, onComplete, onWrong }: Props) {
  const [found, setFound] = useState<string[]>([]);
  const [progressed, setProgressed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answered, setAnswered] = useState(false);

  const foundCount = found.length;

  function clickItem(item: { id: string; kind: "target" | "distractor" }) {
    if (showQuestion || answered || found.includes(item.id)) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    if (item.kind === "target") {
      const next = [...found, item.id];
      setFound(next);
      if (next.length >= game.total) {
        setShowQuestion(true);
      }
    } else {
      setWrongId(item.id);
      onWrong?.(item.id);
      setTimeout(() => setWrongId(null), 600);
    }
  }

  function answer() {
    if (answered) return;
    setAnswered(true);
    onComplete();
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Counter */}
      <div className="flex items-center justify-center gap-3">
        <Eye className="text-[#FFB319]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          {game.target} terhitung: {Math.min(foundCount, game.total)}/{game.total}
        </span>
      </div>

      {!showQuestion ? (
        <>
          <p className="text-center font-nunito text-sm text-[#E2ECEF]">
            Ketuk {game.total} kartu yang merupakan {game.target.toLowerCase()} untuk mengumpulkannya. Kartu lainnya bukan {game.target.toLowerCase()} — jangan diklik.
          </p>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {game.items.map((item) => {
              const isFound = found.includes(item.id);
              const isWrong = wrongId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => clickItem(item)}
                  disabled={isFound}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                    isFound
                      ? "border-[#19D29F] bg-[#19D29F]/20"
                      : isWrong
                        ? "animate-pulse border-[#E63946] bg-[#E63946]/20"
                        : "border-[#FFB319]/40 bg-[#09242B] hover:border-[#FFB319]"
                  }`}
                >
                  <GameAsset
                    emoji={item.emoji}
                    image={item.image}
                    alt={item.label}
                    size={64}
                  />
                  <span className="flex items-center gap-1 font-nunito text-xs text-white">
                    {isFound && <Check size={14} className="text-[#19D29F]" />}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 rounded-2xl bg-[#0F3943] p-4"
        >
          <p className="font-nunito text-lg font-semibold text-white">{game.question}</p>
          <div className="flex flex-col gap-2">
            {game.options.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={answer}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  i === 0
                    ? "border-[#19D29F]/50 hover:bg-[#19D29F]/20"
                    : i === 1
                      ? "border-[#FFB319]/50 hover:bg-[#FFB319]/20"
                      : "border-[#9E77F3]/50 hover:bg-[#9E77F3]/20"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-outfit font-bold ${
                    i === 0
                      ? "bg-[#19D29F]/20 text-[#19D29F]"
                      : i === 1
                        ? "bg-[#FFB319]/20 text-[#FFB319]"
                        : "bg-[#9E77F3]/20 text-[#9E77F3]"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="font-nunito text-sm text-white">{opt.text}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
