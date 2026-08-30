"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeImage } from "@/components/ui/safe-image";
import { getActBackground, getIslandAsset } from "@/config/asset-paths";
import {
  Clock,
  Landmark,
  Scroll,
  Volume2,
  CheckCircle,
  ArrowLeft,
  Hourglass,
  Zap,
} from "lucide-react";
import type { IslandConfig } from "@/types/game";
import { Minigame } from "./minigame";
import { AssessmentModal, type AssessmentAnswer } from "./assessment-modal";
import { useTTS } from "@/hooks/use-tts";
import {
  ensureSession,
  setPlayer as sessionSetPlayer,
  setResume,
  recordEvent,
  addXp,
  completeIsland,
  xpConstants,
} from "@/lib/session/session";
import { clearPersistentState } from "@/hooks/use-persistent-state";
import { useDemo } from "@/hooks/use-demo";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

const ACT_DURATION = 180; // 3 menit per babak

const LEVELS = [
  { level: 1, title: "Pelaut Pemula" },
  { level: 2, title: "Kadet Penjelajah" },
  { level: 3, title: "Navigator Muda" },
  { level: 4, title: "Sang Pemimpin Armada" },
  { level: 5, title: "Laksamana Nusantara" },
  { level: 6, title: "Legenda Nusantara" },
];

interface Props {
  island: IslandConfig;
}

export function IslandGame({ island }: Props) {
  const router = useRouter();
  const { speak, stop } = useTTS();
  const { demo, triggerSkip } = useDemo();

  const [actIndex, setActIndex] = useState(0);
  const [interruptOpen, setInterruptOpen] = useState(false);
  const [actComplete, setActComplete] = useState(false);
  const [seconds, setSeconds] = useState(ACT_DURATION);
  const [timeUp, setTimeUp] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [player, setPlayer] = useState<{ name: string; characterId: string }>({
    name: "",
    characterId: "siti",
  });
  const interruptedRef = useRef(false);
  const pendingCompleteRef = useRef(false);
  const interruptOpenRef = useRef(false);
  const assessmentAnswersRef = useRef<AssessmentAnswer[]>([]);

  const act = island.acts[actIndex];
  const minigame = act.minigame;
  const displayName = player.name || "Penjelajah";
  const completedCount = useRef(0);

  // load player + init session + resume
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-player");
      let name = "";
      let characterId = "siti";
      if (raw) {
        const d = JSON.parse(raw);
        name = d.name || "";
        characterId = d.characterId || "siti";
        setPlayer({ name, characterId });
      }
      const prog = localStorage.getItem("tenun-progress");
      if (prog) {
        const d = JSON.parse(prog);
        completedCount.current = Array.isArray(d?.completedIslands)
          ? d.completedIslands.length
          : 0;
      }
      const s = ensureSession();
      if (!s.player) sessionSetPlayer({ name, characterId });
      // resume jika pulau sama & belum selesai
      let resumed = false;
      if (
        s.currentIsland === island.id &&
        typeof s.currentAct === "number" &&
        s.currentAct > 0 &&
        s.currentAct < island.acts.length &&
        !s.completedIslands.includes(island.id)
      ) {
        setActIndex(s.currentAct);
        resumed = true;
      }
      recordEvent("island_start", { islandId: island.id, name: island.name, resumed });
    } catch {
      // abaikan
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // catat awal babak + simpan posisi resume
  useEffect(() => {
    recordEvent("act_start", { islandId: island.id, act: actIndex + 1, title: minigame.title });
    setResume(island.id, actIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actIndex]);

  // timer mundur 3 menit per babak
  useEffect(() => {
    setSeconds(ACT_DURATION);
    setTimeUp(false);
  }, [actIndex]);

  // jika waktu habis sebelum babak selesai → minta lanjutkan
  useEffect(() => {
    if (seconds <= 0 && !actComplete && !interruptOpen) {
      setTimeUp(true);
    }
  }, [seconds, actComplete, interruptOpen]);
  // Jeda timer saat modal asesmen/overlay "Babak Selesai" terbuka, agar
  // waktu berpikir anak tidak terpotong.
  const timerPaused = interruptOpen || actComplete;
  useEffect(() => {
    if (timerPaused) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [timerPaused]);

  // speak NALA dialog on act start
  useEffect(() => {
    speak(minigame.nalaDialog);
  }, [actIndex, minigame.nalaDialog, speak]);

  // Hentikan narasi saat overlay muncul (apresiasi babak, asesmen, timeout)
  // agar tidak ada suara instruksi yang masih berbicara di bawah popup.
  useEffect(() => {
    if (actComplete || timeUp || interruptOpen) stop();
  }, [actComplete, timeUp, interruptOpen, stop]);

  const onWrong = useCallback(
    (detail?: string) => {
      recordEvent("minigame_wrong", {
        islandId: island.id,
        act: actIndex + 1,
        minigame: minigame.id,
        detail: detail || "",
      });
    },
    [island.id, actIndex, minigame.id]
  );

  const onProgress = useCallback(() => {
    if (!interruptedRef.current) {
      interruptedRef.current = true;
      interruptOpenRef.current = true;
      setInterruptOpen(true);
    }
  }, []);

  const onComplete = useCallback(() => {
    if (interruptOpenRef.current) {
      // mini-game selesai saat modal masih terbuka — tunggu modal ditutup
      pendingCompleteRef.current = true;
    } else {
      // modal sudah tertutup — langsung selesaikan babak
      setActComplete(true);
    }
  }, []);

  function onAssessmentDone(answers: AssessmentAnswer[]) {
    assessmentAnswersRef.current = [...assessmentAnswersRef.current, ...answers];
    answers.forEach((a) => {
      recordEvent("assessment_answer", {
        islandId: island.id,
        act: actIndex + 1,
        questionId: a.questionId,
        trait: a.trait,
        chosen: a.chosen,
        prompt: a.prompt,
      });
      addXp(xpConstants().XP_ASSESSMENT, "assessment");
    });
    interruptOpenRef.current = false;
    setInterruptOpen(false);
    if (pendingCompleteRef.current) {
      pendingCompleteRef.current = false;
      setActComplete(true);
    }
  }

  // Safety net: jika mini-game sudah selesai & modal sudah tertutup,
  // pastikan overlay "Babak Selesai!" selalu muncul.
  useEffect(() => {
    if (pendingCompleteRef.current && !interruptOpenRef.current) {
      pendingCompleteRef.current = false;
      setActComplete(true);
    }
  }, [interruptOpen]);

  function nextAct() {
    // bersihkan state persisten minigame babak ini (tidak menumpuk)
    clearPersistentState(`${island.id}-${actIndex}`);
    setActComplete(false);
    interruptedRef.current = false;
    pendingCompleteRef.current = false;
    // catat penyelesaian babak + beri XP
    recordEvent("act_complete", {
      islandId: island.id,
      act: actIndex + 1,
      title: minigame.title,
    });
    addXp(xpConstants().XP_ACT, `act_${island.id}_${actIndex + 1}`);
    if (actIndex < island.acts.length - 1) {
      setActIndex(actIndex + 1);
    } else {
      // semua babak selesai → tandai pulau selesai, simpan asesmen, lanjut Refleksi
      completeIsland(island.id, island.name);
      recordEvent("island_complete", { islandId: island.id, name: island.name });
      try {
        localStorage.setItem(
          "tenun-assessment",
          JSON.stringify({
            islandId: island.id,
            answers: assessmentAnswersRef.current,
          })
        );
      } catch {
        // abaikan
      }
      router.push(`/island/${island.id}/refleksi`);
    }
  }

  // ===================== Live Demo Mode =====================
  // Referensi callback terbaru agar effect/tombol demo selalu memakai fungsi terkini.
  const onAssessmentDoneRef = useRef(onAssessmentDone);
  const nextActRef = useRef(nextAct);
  useEffect(() => {
    onAssessmentDoneRef.current = onAssessmentDone;
    nextActRef.current = nextAct;
  });
  const assessmentAnsweredRef = useRef(false);

  // Auto-jawab modal asesmen (pilih opsi pertama tiap pertanyaan).
  const answerAssessmentNow = useCallback(() => {
    if (!interruptOpenRef.current || assessmentAnsweredRef.current) return;
    assessmentAnsweredRef.current = true;
    const answers = minigame.assessment.map((q) => ({
      questionId: q.id,
      trait: q.options[0].trait,
      chosen: q.options[0].text,
      prompt: q.prompt,
    }));
    onAssessmentDoneRef.current(answers);
  }, [minigame]);

  // Reset penanda asesmen setiap modal dibuka.
  useEffect(() => {
    if (interruptOpen) assessmentAnsweredRef.current = false;
  }, [interruptOpen]);

  // Demo: asesmen diisi otomatis sesaat setelah terbuka — bagian dari langkah
  // "Lanjutkan", jadi presenter cukup menjelaskan minigame & popup, bukan menunggu asesmen.
  useEffect(() => {
    if (demo && interruptOpen) {
      const t = setTimeout(answerAssessmentNow, 500);
      return () => clearTimeout(t);
    }
  }, [demo, interruptOpen, answerAssessmentNow]);

  function formatTime(t: number) {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  const levelInfo = LEVELS[Math.min(completedCount.current, LEVELS.length - 1)];
  const progressPct = Math.round(((actIndex + (actComplete ? 1 : 0)) / island.acts.length) * 100);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Live Demo: tombol "Lanjutkan" — mengeksekusi langkah berikutnya secara
          otomatis lalu berhenti di checkpoint, sehingga presenter bisa menjelaskan.
          Di minigame: menyelesaikan babak (asesmen terisi otomatis) → popup selesai.
          Di popup: maju ke babak berikutnya. */}
      {demo && (
        <div className="fixed left-1/2 top-2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#19D29F] bg-[#0F3943]/95 px-3 py-1.5 shadow-lg">
          <Zap size={13} className="text-[#19D29F]" />
          <span className="font-outfit text-[10px] font-bold uppercase tracking-wide text-white">
            Live Demo
          </span>
          <button
            type="button"
            onClick={() => {
              if (interruptOpen) answerAssessmentNow();
              else if (actComplete) nextActRef.current();
              else triggerSkip();
            }}
            className="rounded-full bg-[#FFB319] px-3 py-1 font-outfit text-[10px] font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
          >
            Lanjutkan
          </button>
        </div>
      )}
      {/* Main 3-column body */}
      <div className="flex min-h-0 flex-1 flex-row">
        {/* LEFT: Instruksi & NALA Guide */}
        <aside className="flex w-64 flex-none flex-col gap-3 overflow-hidden border-r-2 border-[#0F3943] bg-[#09242B] p-4">
          <div className="overflow-hidden rounded-xl border border-[#FFB319]">
            <Image
              src={AVATARS[player.characterId] ?? AVATARS.siti}
              alt="NALA"
              width={256}
              height={200}
              className="h-24 w-full object-cover"
            />
          </div>
          <h2 className="font-outfit text-base font-extrabold text-[#FFB319]">NALA</h2>
          <div className="flex flex-col gap-1 rounded-xl bg-[#0F3943] p-3">
            <p className="font-nunito text-xs leading-relaxed text-white">“{minigame.nalaDialog}”</p>
            <button
              type="button"
              onClick={() => speak(minigame.nalaDialog)}
              className="inline-flex items-center gap-1 self-start text-xs text-[#19D29F]"
            >
              <Volume2 size={14} /> dengar
            </button>
          </div>

          {/* Instruksi */}
          <div className="flex flex-col gap-1">
            <span className="font-outfit text-xs font-bold uppercase tracking-wide text-[#8DA2A6]">
              Instruksi
            </span>
            <div className="rounded-xl border border-[#FFB319]/30 bg-[#0F3943] p-3">
              <p className="font-nunito text-xs leading-relaxed text-white">{minigame.instructions}</p>
            </div>
          </div>
        </aside>

        {/* CENTER: Canvas + Minigame / Reflection */}
        <main className="relative min-w-0 flex-1 overflow-hidden">
          <SafeImage
            src={getActBackground(island.id, actIndex + 1)}
            fallback={getIslandAsset(island.id).fallbackBackground}
            alt={island.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060F14]/60 via-transparent to-[#060F14]/80" />

          <div className="relative z-10 flex h-full min-h-0 flex-col items-center gap-2 overflow-hidden p-3 sm:p-4">
            <div className="text-center">
              <h2 className="font-outfit text-xl font-extrabold text-[#FFB319] md:text-2xl">{minigame.title}</h2>
            </div>

            <div className="flex min-h-0 w-full max-w-3xl flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#FFB319] bg-[#0F3943]/55 p-3 shadow-xl backdrop-blur-sm">
              <Minigame
                game={minigame.game}
                onProgress={onProgress}
                onComplete={onComplete}
                onWrong={onWrong}
                resumeKey={`${island.id}-${actIndex}`}
              />
            </div>
          </div>
        </main>

        {/* RIGHT: Hint & Progress */}
        <aside className="flex w-56 flex-none flex-col gap-3 overflow-hidden border-l-2 border-[#0F3943] bg-[#09242B] p-4">
          <div className="flex flex-col gap-1">
            <span className="font-outfit text-xs font-bold uppercase tracking-wide text-[#8DA2A6]">
              Bantuan
            </span>
            <button
              type="button"
              onClick={() => {
                speak(minigame.hint);
                setShowHint((v) => !v);
                recordEvent("hint_opened", { islandId: island.id, act: actIndex + 1 });
              }}
              className="flex items-center gap-2 rounded-xl border border-[#FFB319] bg-[#0F3943] px-3 py-2 font-outfit text-xs font-bold text-[#FFB319] transition-colors hover:bg-[#144955]"
            >
              <Scroll size={16} />
              Petunjuk {island.id}
            </button>
            {showHint && (
              <div className="rounded-xl border border-[#19D29F]/40 bg-[#0F3943] p-3">
                <p className="font-nunito text-xs leading-relaxed text-[#E2ECEF]">{minigame.hint}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-outfit text-xs font-bold uppercase tracking-wide text-[#8DA2A6]">
              Kemajuan Pulau
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-full overflow-hidden rounded bg-[#0F3943]">
                <div
                  className="h-full rounded bg-[#19D29F] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="font-nunito text-xs text-[#19D29F]">{progressPct}%</span>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM BAR: Player + Act + Timer + Settings */}
      <footer className="flex w-full flex-none flex-wrap items-center justify-between gap-2 border-t border-[#FFB319] bg-[#0F3943] px-4 py-2 md:px-6">
        <div className="flex items-center gap-3">
          <Image
            src={AVATARS[player.characterId] ?? AVATARS.siti}
            alt={displayName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-outfit text-sm font-bold text-white">{displayName}</span>
            <span className="font-nunito text-[11px] text-[#19D29F]">
              Level {levelInfo.level} • {levelInfo.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#09242B] px-3 py-2">
            <Landmark size={16} className="text-[#FFB319]" />
            <span className="font-outfit text-sm font-bold text-white">
              Babak {actIndex + 1}/{island.acts.length}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${seconds <= 30 ? "text-[#E63946]" : "text-[#FFB319]"}`}>
            <Clock size={16} />
            <span className="font-outfit text-sm font-bold">{formatTime(seconds)}</span>
          </div>
        </div>

        <button
          aria-label="Kembali"
          onClick={() => router.push("/map")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#09242B] text-[#FFB319] transition-colors hover:bg-[#0F3943]"
        >
          <ArrowLeft size={20} />
        </button>
      </footer>

      {/* Time-up modal */}
      <AnimatePresence>
        {timeUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] flex items-center justify-center bg-black/70"
          >
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-[#FFB319] bg-[#0F3943] p-10 text-center">
              <Hourglass size={48} className="text-[#FFB319]" />
              <h3 className="font-outfit text-2xl font-extrabold text-white">Waktu Babak Habis!</h3>
              <p className="max-w-sm font-nunito text-white/80">
                Kamu belum menyelesaikan babak ini. Tenang, petualanganmu tersimpan — mau lanjutkan dari sini?
              </p>
              <div className="mt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSeconds(ACT_DURATION);
                    setTimeUp(false);
                    recordEvent("timeout_continue", { islandId: island.id, act: actIndex + 1 });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-[#FFB319] px-8 py-3 font-outfit font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
                >
                  Lanjutkan
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/map")}
                  className="inline-flex items-center justify-center gap-2 rounded-[32px] border border-[#FFB319]/40 px-8 py-3 font-outfit font-bold uppercase text-white transition-colors hover:bg-[#144955]"
                >
                  Kembali ke Peta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Act complete overlay */}
      <AnimatePresence>
        {actComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-[#19D29F] bg-[#0F3943] p-10 text-center">
              <CheckCircle size={48} className="text-[#19D29F]" />
              <h3 className="font-outfit text-2xl font-extrabold text-white">
                Babak {actIndex + 1} Selesai!
              </h3>
              <p className="font-nunito text-white/80">
                {actIndex < island.acts.length - 1
                  ? "Petualangan terus berlanjut ke babak berikutnya."
                  : "Semua babak selesai! Saatnya sesi Refleksi."}
              </p>
              <button
                type="button"
                onClick={nextAct}
                className="mt-2 inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-8 py-3 font-outfit font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
              >
                {actIndex < island.acts.length - 1 ? "Lanjut" : "Refleksi"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Assessment Modal */}
      <AssessmentModal
        open={interruptOpen}
        questions={minigame.assessment}
        onComplete={onAssessmentDone}
      />
    </div>
  );
}
