"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Check } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import { usePersistentState } from "@/hooks/use-persistent-state";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "puzzle16" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

const GRID = 4;
const TOTAL = GRID * GRID; // 16

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MinigamePuzzle16({ game, onProgress, onComplete, onWrong: _ }: Props) {
  const [pool] = useState(() => shuffle(game.pieces));
  const [placed, setPlaced] = usePersistentState<(string | null)[]>("placed", () =>
    Array(TOTAL).fill(null)
  );
  const [progressed, setProgressed] = useState(false);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);

  const placedCount = placed.filter((p) => p !== null).length;

  // Background sel kosong = potongan gambar master (tipis), sehingga papan
  // langsung menampilkan gambar utuh sebagai panduan — tanpa thumbnail acuan.
  function masterCellStyle(i: number): React.CSSProperties {
    const row = Math.floor(i / GRID);
    const col = i % GRID;
    return {
      backgroundImage: `url(${game.master})`,
      backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
      backgroundPosition: `${(col * 100) / (GRID - 1)}% ${(row * 100) / (GRID - 1)}%`,
      backgroundRepeat: "no-repeat",
    };
  }

  function handleDragStart(e: React.DragEvent, pieceId: string) {
    e.dataTransfer.setData("text/plain", pieceId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, slot: number) {
    e.preventDefault();
    const pid = e.dataTransfer.getData("text/plain");
    if (!pid || placed[slot] !== null) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    const piece = game.pieces.find((p) => p.id === pid);
    if (piece && piece.slot === slot) {
      const next = [...placed];
      next[slot] = pid;
      setPlaced(next);
      if (next.every((p) => p !== null)) {
        setTimeout(onComplete, 700);
      }
    } else {
      setWrongSlot(slot);
      setTimeout(() => setWrongSlot(null), 600);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Puzzle className="text-[#FFB319]" size={18} />
        <span className="font-outfit text-sm font-extrabold text-white">
          Keping terpasang: {placedCount}/{TOTAL}
        </span>
      </div>

      {/* Layout: keping kiri | papan (besar) | keping kanan */}
      <div className="flex w-full max-w-3xl items-center justify-center gap-3">
        {/* Keping kiri */}
        <div className="grid grid-cols-2 gap-1">
          {pool.slice(0, 8).map((piece) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              isPlaced={placed.includes(piece.id)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>

        {/* Papan puzzle (persegi, master tipis sebagai panduan) */}
        <div className="grid grid-cols-4 gap-px border border-[#FFB319]/70 bg-[#1B4450] p-0.5 shadow-xl">
          {Array.from({ length: TOTAL }, (_, i) => {
            const pid = placed[i];
            const piece = pid ? game.pieces.find((x) => x.id === pid) : null;
            const isWrong = wrongSlot === i;
            return (
              <div
                key={i}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => handleDrop(e, i)}
                className={`relative flex h-20 w-20 items-center justify-center overflow-hidden transition-all ${
                  isWrong ? "animate-pulse ring-4 ring-[#E63946]" : ""
                }`}
              >
                {piece ? (
                  <div className="absolute inset-0">
                    <GameAsset emoji="🧩" image={piece.image} alt={piece.label || ""} size={80} draggable={false} />
                  </div>
                ) : (
                  <div className="absolute inset-0 opacity-55" style={masterCellStyle(i)} />
                )}
              </div>
            );
          })}
        </div>

        {/* Keping kanan */}
        <div className="grid grid-cols-2 gap-1">
          {pool.slice(8).map((piece) => (
            <PieceCard
              key={piece.id}
              piece={piece}
              isPlaced={placed.includes(piece.id)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      <p className="font-nunito text-[11px] text-white/70">
        ✋ Tarik (drag) keping lalu lepas (drop) di posisinya di papan.
      </p>

      <AnimatePresence>
        {placedCount === TOTAL && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]"
          >
            <Check size={16} /> Puzzle tersusun! 🧩
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Kartu keping puzzle — persegi, drag & drop.
function PieceCard({
  piece,
  isPlaced,
  onDragStart,
}: {
  piece: { id: string; image: string; label?: string };
  isPlaced: boolean;
  onDragStart: (e: React.DragEvent, pieceId: string) => void;
}) {
  return (
    <div
      draggable={!isPlaced}
      onDragStart={(e) => onDragStart(e, piece.id)}
      title="Tarik keping ini"
      className={`flex h-[60px] w-[60px] items-center justify-center border shadow-sm transition-all ${
        isPlaced
          ? "cursor-default opacity-25"
          : "cursor-grab border-[#FFB319]/50 bg-[#0A2630] hover:scale-105 hover:border-[#19D29F] active:cursor-grabbing"
      }`}
    >
      <GameAsset emoji="🧩" image={piece.image} alt={piece.label || ""} size={46} draggable={false} />
    </div>
  );
}
