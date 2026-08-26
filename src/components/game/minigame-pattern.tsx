"use client";

import { useState } from "react";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "pattern" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

export function MinigamePattern({ game, onProgress, onComplete, onWrong }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [placed, setPlaced] = useState<(number | null)[]>(
    Array(game.slots).fill(null)
  );
  const [progressed, setProgressed] = useState(false);

  function placePiece(slot: number) {
    if (selected === null || placed[slot] !== null) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    const next = [...placed];
    next[slot] = selected;
    setPlaced(next);
    if (next.every((v, i) => v === game.solution[i])) {
      onComplete();
    }
  }

  const allFilled = placed.every((v) => v !== null);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: game.slots }, (_, slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => placePiece(slot)}
            className={`flex h-28 w-28 items-center justify-center rounded-xl border-2 text-2xl font-extrabold transition-all ${
              placed[slot] !== null
                ? "border-[#19D29F] bg-[#19D29F] text-[#0B1D23]"
                : "border-dashed border-[#FFB319] bg-[#09242B]/70 text-[#FFB319] hover:bg-[#0F3943]"
            }`}
          >
            {placed[slot] !== null ? game.pieces[placed[slot]!] : "?"}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="font-outfit text-sm font-bold text-white">
          Pilih potongan, lalu klik slot kosong:
        </span>
        <div className="flex gap-3">
          {game.pieces.map((piece, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(selected === i ? null : i)}
              className={`rounded-xl border-2 px-6 py-4 font-outfit font-bold transition-all ${
                selected === i
                  ? "border-[#FFB319] bg-[#0F3943] text-[#FFB319]"
                  : "border-[#FFB319]/40 bg-[#09242B] text-white hover:border-[#19D29F]"
              }`}
            >
              {piece}
            </button>
          ))}
        </div>
      </div>

      {allFilled && (
        <p className="font-nunito text-sm text-[#19D29F]">Pola tersusun! ✅</p>
      )}
    </div>
  );
}
