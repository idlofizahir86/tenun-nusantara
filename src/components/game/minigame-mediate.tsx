"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake, Check, RotateCcw } from "lucide-react";
import { GameAsset } from "@/components/ui/game-asset";
import type { MinigamePayload } from "@/types/game";

interface Props {
  game: Extract<MinigamePayload, { type: "mediate" }>;
  onProgress: () => void;
  onComplete: () => void;
  onWrong?: (detail?: string) => void;
}

const TONE_LABEL: Record<string, { label: string; cls: string }> = {
  baik: { label: "Menenangkan", cls: "border-[#19D29F] bg-[#19D29F]/15" },
  netral: { label: "Netral", cls: "border-[#FFB319]/60 bg-[#FFB319]/10" },
  buruk: { label: "Memancing amarah", cls: "border-[#E63946] bg-[#E63946]/15" },
};

export function MinigameMediate({ game, onProgress, onComplete, onWrong }: Props) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [agreement, setAgreement] = useState(0);
  const [progressed, setProgressed] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: string; text: string } | null>(null);
  const [done, setDone] = useState(false);

  const round = game.rounds[roundIdx];
  const isLastRound = roundIdx === game.rounds.length - 1;

  function pick(opt: { id: string; text: string; effect: number; tone: "baik" | "netral" | "buruk" }) {
    if (feedback || done) return;
    if (!progressed) {
      setProgressed(true);
      onProgress();
    }
    const next = Math.max(0, Math.min(100, agreement + opt.effect));
    setAgreement(next);
    setFeedback({ tone: opt.tone, text: opt.text });
    if (opt.tone === "buruk") onWrong?.(opt.text);

    setTimeout(() => {
      if (isLastRound) {
        if (next >= game.goal) {
          setDone(true);
          setTimeout(onComplete, 800);
        } else {
          // gagal capai kesepakatan -> reset
          setAgreement(0);
          setRoundIdx(0);
          setFeedback(null);
        }
      } else {
        setRoundIdx(roundIdx + 1);
        setFeedback(null);
      }
    }, 900);
  }

  function reset() {
    setAgreement(0);
    setRoundIdx(0);
    setFeedback(null);
    setDone(false);
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Progress kesepakatan */}
      <div className="flex w-full max-w-xl flex-col gap-1">
        <div className="flex items-center gap-3">
          <Handshake className="text-[#FFB319]" size={20} />
          <span className="font-outfit text-lg font-extrabold text-white">
            Kesepakatan: {agreement}%
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-[#09242B]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#E63946] via-[#FFB319] to-[#19D29F]"
            animate={{ width: `${agreement}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {!done && (
        <>
          <div className="w-full max-w-2xl rounded-2xl border-2 border-[#FFB319]/40 bg-[#09242B] p-5 text-center">
            <span className="font-outfit text-xs font-bold uppercase text-[#FFB319]">
              Perselisihan {roundIdx + 1}/{game.rounds.length}
            </span>
            {(round.imageA || round.imageB) && (
              <div className="my-3 flex items-center justify-center gap-6">
                {round.imageA && (
                  <div className="flex flex-col items-center gap-1">
                    <GameAsset image={round.imageA} alt="Pihak A" size={56} draggable={false} />
                  </div>
                )}
                <span className="text-xl text-[#E63946]">⚔️</span>
                {round.imageB && (
                  <div className="flex flex-col items-center gap-1">
                    <GameAsset image={round.imageB} alt="Pihak B" size={56} draggable={false} />
                  </div>
                )}
              </div>
            )}
            <p className="mt-2 font-nunito text-base leading-relaxed text-white">
              {round.situation}
            </p>
          </div>

          <div className="flex w-full max-w-2xl flex-col gap-3">
            {round.options.map((opt) => {
              const tone = TONE_LABEL[opt.tone];
              const isPicked = feedback?.text === opt.text;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => pick(opt)}
                  disabled={!!feedback}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                    isPicked ? tone.cls : "border-[#FFB319]/30 bg-[#0F3943] hover:border-[#19D29F]"
                  }`}
                >
                  <span
                    className={`font-outfit text-[10px] font-extrabold uppercase ${
                      opt.tone === "baik"
                        ? "text-[#19D29F]"
                        : opt.tone === "netral"
                          ? "text-[#FFB319]"
                          : "text-[#E63946]"
                    }`}
                  >
                    {TONE_LABEL[opt.tone].label}
                  </span>
                  <span className="flex-1 font-nunito text-sm font-semibold text-white">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`font-nunito text-sm font-bold ${
                  feedback.tone === "baik"
                    ? "text-[#19D29F]"
                    : feedback.tone === "netral"
                      ? "text-[#FFB319]"
                      : "text-[#E63946]"
                }`}
              >
                {feedback.tone === "baik"
                  ? "Wah, kedua pihak mulai tenang! 👏"
                  : feedback.tone === "netral"
                    ? "Hmm, belum cukup menenangkan..."
                    : "Ups, itu malah memancing amarah. 😅"}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-[32px] border border-[#FFB319]/50 bg-[#0F3943] px-5 py-2 font-outfit text-sm font-bold text-white transition-colors hover:bg-[#09242B]"
          >
            <RotateCcw size={16} /> Ulang Mediasi
          </button>
        </>
      )}

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl bg-[#19D29F]/15 px-6 py-4"
          >
            <span className="flex items-center gap-2 rounded-full bg-[#19D29F] px-4 py-1.5 text-[#0B1D23]">
              <Check size={16} /> Kesepakatan tercapai!
            </span>
            <span className="font-nunito text-sm text-white">
              Kedua kepala perahu berjabat tangan. 🎉
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
