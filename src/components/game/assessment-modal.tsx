"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hourglass } from "lucide-react";
import type { AssessmentQuestion } from "@/types/game";

export interface AssessmentAnswer {
  questionId: string;
  trait: string;
  chosen: string; // teks opsi yang dipilih
  prompt: string; // pertanyaan asesmen
}

interface Props {
  open: boolean;
  questions: AssessmentQuestion[];
  onComplete: (answers: AssessmentAnswer[]) => void;
}

const DIAMONDS = Array.from({ length: 24 }, (_, i) => i);

// Modal Asesmen Tersembunyi (interupsi di tengah permainan)
export function AssessmentModal({ open, questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);

  // reset state setiap modal dibuka
  const key = useMemo(() => `${open}-${questions.length}`, [open, questions]);

  function choose(trait: string, chosen: string) {
    const q = questions[current];
    const next = [...answers, { questionId: q.id, trait, chosen, prompt: q.prompt }];
    setAnswers(next);
    if (current + 1 >= questions.length) {
      onComplete(next);
      setCurrent(0);
      setAnswers([]);
    } else {
      setCurrent(current + 1);
    }
  }

  const q = questions[current];

  return (
    <AnimatePresence>
      {open && q && (
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(6,15,20,0.78), rgba(6,15,20,0.78)), url('/assets/images/map/map-indonesia.png')`,
            }}
          />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 flex w-full max-w-3xl flex-col gap-8 rounded-3xl border-2 border-[#FFB319] bg-[#0F3943] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.8)]"
          >
            {/* Pattern */}
            <div className="flex h-2 w-full items-center justify-between opacity-30">
              {DIAMONDS.map((i) => (
                <div key={i} className="h-2 w-2 rotate-45 bg-[#FFB319]" />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-outfit text-[18px] font-bold uppercase tracking-wide text-[#FFB319]">
                {q.category}
              </span>
              <p className="font-nunito text-[22px] font-semibold leading-relaxed text-white">
                {q.prompt}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {q.options.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => choose(opt.trait, opt.text)}
                  className="group flex items-center gap-4 rounded-2xl border border-[#FFB319]/30 bg-[#09242B] p-4 text-left transition-all hover:translate-x-1 hover:bg-[#0C2E37]"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-outfit font-bold ${
                      i === 0
                        ? "bg-[#19D29F]/20 text-[#19D29F]"
                        : i === 1
                          ? "bg-[#FFB319]/20 text-[#FFB319]"
                          : "bg-[#9E77F3]/20 text-[#9E77F3]"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-outfit text-base font-bold text-white">
                      Pilihan {opt.label}: {opt.trait}
                    </span>
                    <span className="font-nunito text-sm text-[#E2ECEF]">{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer tracker */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FFB319]">
                <Hourglass size={20} />
                <span className="font-nunito text-xs text-[#8DA2A6]">
                  Asesmen Tersembunyi Berjalan... ({current + 1}/{questions.length})
                </span>
              </div>
              <div className="flex h-1.5 w-32 overflow-hidden rounded bg-[#09242B]">
                <div
                  className="h-full rounded bg-[#FFB319] transition-all"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
