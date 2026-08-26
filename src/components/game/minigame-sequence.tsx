"use client";

import { useState } from "react";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "sequence" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigameSequence({ game, onProgress, onComplete, onWrong: _ }: Props) {
  const [built, setBuilt] = useState<string[]>([]);
  const [progressed, setProgressed] = useState(false);

  function pick(itemId: string) {
    if (built.includes(itemId)) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    const next = [...built, itemId];
    setBuilt(next);
    if (next.length === game.correctOrder.length) {
      if (next.every((id, i) => id === game.correctOrder[i])) {
        onComplete();
      } else {
        // salah urutan — reset
        setBuilt([]);
      }
    }
  }

  const available = game.items.filter((it) => !built.includes(it.id));

  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="rounded-xl bg-[#09242B] p-4">
        <span className="font-outfit text-sm font-bold text-white">
          Urutan yang kamu susun:
        </span>
        <div className="mt-2 flex min-h-[44px] flex-wrap gap-2">
          {built.map((id) => {
            const item = game.items.find((i) => i.id === id)!;
            return (
              <span
                key={id}
                className="rounded-lg bg-[#19D29F] px-3 py-1.5 font-nunito text-sm font-bold text-[#0B1D23]"
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-outfit text-sm font-bold text-white">
          Pilih urutan yang benar:
        </span>
        {available.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => pick(item.id)}
            className="rounded-xl border-2 border-[#FFB319]/40 bg-[#09242B] p-3 text-left font-nunito text-white transition-all hover:border-[#FFB319]"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
