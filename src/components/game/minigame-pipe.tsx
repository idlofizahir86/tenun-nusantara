"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Wrench, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import { usePersistentState } from "@/hooks/use-persistent-state";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "pipe" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

// Slot pipa: menampilkan panduan (gambar tipis) jika kosong, atau pipa terpasang.
function PipeSlot({
  slot,
  isFilled,
  placedImage,
  isWrong,
  onPlace,
}: {
  slot: { id: string; label: string; image: string };
  isFilled: boolean;
  placedImage?: string;
  isWrong: boolean;
  onPlace: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPlace}
      className={`relative flex h-24 w-24 items-center justify-center overflow-hidden border-2 transition-all ${
        isFilled
          ? "border-[#19D29F] bg-[#0A2630] shadow-lg"
          : isWrong
            ? "animate-pulse border-[#E63946] bg-[#0A2630]"
            : "border-dashed border-[#FFB319]/50 bg-[#0A2630] hover:border-[#19D29F]"
      }`}
    >
      {isFilled ? (
        <GameAsset emoji="🔧" image={placedImage} alt={slot.label} size={92} draggable={false} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <GameAsset emoji="🔧" image={slot.image} alt={slot.label} size={92} draggable={false} />
        </div>
      )}
    </button>
  );
}

export function MinigamePipe({ game, onProgress, onComplete, onWrong }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = usePersistentState<(string | null)[]>("placed", () =>
    Array(game.slots.length).fill(null)
  );
  const [progressed, setProgressed] = useState(false);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [flowing, setFlowing] = useState(false);

  const placedCount = placed.filter((p) => p !== null).length;

  function pick(pieceId: string) {
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    setSelected(selected === pieceId ? null : pieceId);
  }

  function place(slotIdx: number) {
    if (!selected || placed[slotIdx] !== null || flowing) return;
    const slot = game.slots[slotIdx];
    if (selected === slot.required) {
      const next = [...placed];
      next[slotIdx] = selected;
      setPlaced(next);
      setSelected(null);
      if (next.every((p) => p !== null)) {
        setFlowing(true);
        setTimeout(onComplete, 1600);
      }
    } else {
      setWrongSlot(slotIdx);
      setTimeout(() => setWrongSlot(null), 600);
    }
  }

  function pieceById(id: string) {
    return game.pieces.find((p) => p.id === id);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Judul / target */}
      <div className="flex items-center gap-2">
        <Droplets className="text-[#19D29F]" size={20} />
        <span className="font-outfit text-sm font-extrabold text-white">
          Pipa terpasang: {placedCount}/{game.slots.length}
        </span>
      </div>

      {/* Alur pipa (jalur S): Sumber → s1(I) → s2(L turun) ↓ s3(L kanan) → s4(I) → Timbangan */}
      <div className="grid grid-cols-5 items-center gap-2 rounded-2xl border-2 border-[#FFB319]/70 bg-[#0A2630] p-3 shadow-xl">
        {/* Baris 1 */}
        <div className="flex h-24 w-20 flex-col items-center justify-center rounded border-2 border-[#19D29F] bg-[#19D29F]/10 text-[#19D29F]">
          <Droplets size={22} />
          <span className="text-[9px] font-bold">Sumber</span>
        </div>
        <PipeSlot
          slot={game.slots[0]}
          isFilled={placed[0] !== null}
          placedImage={placed[0] ? pieceById(placed[0])?.image : undefined}
          isWrong={wrongSlot === 0}
          onPlace={() => place(0)}
        />
        <PipeSlot
          slot={game.slots[1]}
          isFilled={placed[1] !== null}
          placedImage={placed[1] ? pieceById(placed[1])?.image : undefined}
          isWrong={wrongSlot === 1}
          onPlace={() => place(1)}
        />
        <div />
        <div />

        {/* Baris 2 */}
        <div />
        <div />
        <PipeSlot
          slot={game.slots[2]}
          isFilled={placed[2] !== null}
          placedImage={placed[2] ? pieceById(placed[2])?.image : undefined}
          isWrong={wrongSlot === 2}
          onPlace={() => place(2)}
        />
        <PipeSlot
          slot={game.slots[3]}
          isFilled={placed[3] !== null}
          placedImage={placed[3] ? pieceById(placed[3])?.image : undefined}
          isWrong={wrongSlot === 3}
          onPlace={() => place(3)}
        />
        <div className="flex h-24 w-20 flex-col items-center justify-center rounded border-2 border-[#FFB319] bg-[#FFB319]/10 text-[#FFB319]">
          <span className="text-lg">⚖️</span>
          <span className="text-[9px] font-bold">Timbangan</span>
        </div>
      </div>

      {/* Aliran air */}
      <AnimatePresence>
        {flowing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full max-w-lg items-center gap-2"
          >
            <div className="relative h-4 flex-1 overflow-hidden rounded bg-[#09242B]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#19D29F] to-[#2E86AB]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
            </div>
            <span className="font-nunito text-sm text-[#19D29F]">Air mengalir! 💧</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palet pipa */}
      {!flowing && (
        <div className="w-full max-w-lg rounded-2xl border border-[#FFB319]/40 bg-[#0F3943] p-2">
          <p className="mb-1.5 text-center font-nunito text-[11px] text-white/70">
            Pilih pipa yang pas, lalu klik slot di jalurnya.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {game.pieces.map((piece) => {
              const isSel = selected === piece.id;
              return (
                <button
                  key={piece.id}
                  type="button"
                  onClick={() => pick(piece.id)}
                  className={`flex flex-col items-center gap-1 rounded border p-1.5 transition-all ${
                    isSel
                      ? "border-[#FFB319] bg-[#FFB319]/15 ring-2 ring-[#FFB319]/40"
                      : "border-[#FFB319]/40 bg-[#0A2630] hover:border-[#19D29F]"
                  }`}
                >
                  <GameAsset emoji="🔧" image={piece.image} alt={piece.label} size={52} draggable={false} />
                  <span className="flex items-center gap-1 text-[10px] font-bold text-white">
                    <Wrench size={10} /> {piece.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {placedCount === game.slots.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Jalur air tersambung!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
