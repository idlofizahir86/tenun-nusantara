"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "filter" }>;
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

export function MinigameFilter({ game, onProgress, onComplete, onWrong }: Props) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [pool] = useState(() => shuffle(game.layers));
  const [progressed, setProgressed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  const nextRequired = game.correctOrder[placed.length];
  const clarity = Math.round((placed.length / game.layers.length) * 100);

  function pick(layerId: string) {
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    if (layerId === nextRequired) {
      const next = [...placed, layerId];
      setPlaced(next);
      if (next.length === game.layers.length) {
        setTimeout(onComplete, 900);
      }
    } else {
      setWrongId(layerId);
      onWrong?.(layerId);
      setTimeout(() => setWrongId(null), 600);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Kejernihan air */}
      <div className="flex items-center gap-3">
        <Droplets className="text-[#19D29F]" size={20} />
        <span className="font-outfit text-lg font-extrabold text-white">
          Kejernihan: {clarity}%
        </span>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-4 md:flex-row md:items-center">
        {/* Wadah air */}
        <div className="flex-1 rounded-2xl border-2 border-[#19D29F]/40 bg-[#0F3943] p-4">
          <div className="flex flex-col gap-2">
            <span className="font-outfit text-xs font-bold uppercase text-[#19D29F]">
              Wadah Penyaring
            </span>
            {/* Lapisan yang sudah terpasang (dari bawah) */}
            <div className="flex flex-col-reverse gap-2">
              {game.correctOrder.map((id, i) => {
                const layer = game.layers.find((l) => l.id === id)!;
                const isFilled = i < placed.length;
                return (
                  <div
                    key={id}
                    className={`flex h-12 items-center gap-2 rounded-xl border-2 px-3 transition-all ${
                      isFilled
                        ? "border-[#19D29F] bg-[#19D29F]/15"
                        : "border-dashed border-[#19D29F]/40 bg-[#09242B]"
                    }`}
                  >
                    {isFilled ? (
                      <GameAsset emoji={layer.emoji} image={layer.image} alt={layer.name} size={28} draggable={false} />
                    ) : (
                      <span className="text-xl">❓</span>
                    )}
                    <span className="font-nunito text-xs font-semibold text-white">
                      {isFilled ? layer.name : "Lapisan kosong"}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Air */}
            <div className="mt-2 flex h-6 items-end overflow-hidden rounded-lg bg-[#09242B]">
              <motion.div
                className="h-full w-full"
                animate={{ backgroundColor: `rgba(30,150,180,${0.3 + clarity / 140})` }}
              />
            </div>
          </div>
        </div>

        {/* Bahan filter */}
        <div className="flex-1">
          <span className="mb-2 block font-outfit text-xs font-bold uppercase text-[#FFB319]">
            Bahan — sentuh sesuai urutan
          </span>
          <div className="grid grid-cols-2 gap-3">
            {pool.map((layer) => {
              const isUsed = placed.includes(layer.id);
              const isWrong = wrongId === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  disabled={isUsed}
                  onClick={() => pick(layer.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center transition-all ${
                    isUsed
                      ? "opacity-40"
                      : isWrong
                        ? "animate-pulse border-[#E63946] bg-[#E63946]/20"
                        : "border-[#FFB319]/40 bg-[#09242B] hover:border-[#19D29F]"
                  }`}
                >
                  <GameAsset emoji={layer.emoji} image={layer.image} alt={layer.name} size={36} draggable={false} />
                  <span className="font-nunito text-xs font-semibold text-white">
                    {layer.name}
                  </span>
                  {layer.description && (
                    <span className="font-nunito text-[10px] text-[#8DA2A6]">
                      {layer.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {clarity === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Air sungai jernih kembali! 💧
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
