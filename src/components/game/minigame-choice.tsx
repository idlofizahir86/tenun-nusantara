"use client";

import { useState } from "react";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "choice" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigameChoice({ game, onProgress, onComplete, onWrong }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [progressed, setProgressed] = useState(false);

  function choose(id: string, correct: boolean) {
    if (picked !== null) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    setPicked(id);
    if (correct) onComplete();
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <p className="rounded-xl bg-[#09242B] p-4 font-nunito text-lg text-white">
        {game.question}
      </p>
      <div className="flex flex-col gap-3">
        {game.options.map((opt) => {
          const isPicked = picked === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt.id, opt.correct)}
              disabled={picked !== null}
              className={`rounded-xl border-2 p-4 text-left font-nunito transition-all ${
                isPicked && opt.correct
                  ? "border-[#19D29F] bg-[#19D29F] text-[#0B1D23]"
                  : isPicked
                    ? "border-[#E63946] bg-[#E63946]/20 text-white"
                    : "border-[#FFB319]/40 bg-[#09242B] text-white hover:border-[#FFB319]"
              }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
