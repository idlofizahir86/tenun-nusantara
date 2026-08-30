"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Mic, Square, Send, Ship, Zap } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import type { ReflectionConfig } from "@/types/game";
import type { AssessmentAnswer } from "./assessment-modal";
import { useTTS } from "@/hooks/use-tts";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useNala } from "@/hooks/use-nala";
import { useDemo } from "@/hooks/use-demo";

interface Props {
  reflection: ReflectionConfig;
  image: string;
  fallbackImage: string;
  playerName: string;
  onFinish: () => void;
}

interface ChatMsg {
  role: "nala" | "user";
  text: string;
}

const DIAMONDS = Array.from({ length: 24 }, (_, i) => i);

export function Reflection({ reflection, image, fallbackImage, playerName, onFinish }: Props) {
  const { speak, stop, speaking } = useTTS();
  const voice = useVoiceInput();
  const nala = useNala();
  const { demo } = useDemo();

  const [started, setStarted] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [nalaThinking, setNalaThinking] = useState(false);
  const [step, setStep] = useState(0); // jumlah pertanyaan NALA yang sudah diajukan
  const [finished, setFinished] = useState(false);
  const [choices, setChoices] = useState<AssessmentAnswer[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const turns = Math.min(3, Math.max(1, choices.length));

  // muat pilihan asesmen dari localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-assessment");
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d?.answers)) setChoices(d.answers);
      }
    } catch {
      // abaikan
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, nalaThinking]);

  const choiceSummary = choices
    .map((a, i) => `${i + 1}. Saat ditanya "${a.prompt}", anak memilih: "${a.chosen}".`)
    .join("\n");

  async function begin() {
    setStarted(true);
    setNalaThinking(true);
    const reply = await nala.send(
      `Mulai sesi refleksi ${reflection.title}.\n` +
        (choiceSummary ? `Konteks pilihan anak:\n${choiceSummary}\n` : "") +
        "Sapa anak dengan hangat (1-2 kalimat), lalu ajukan SATU pertanyaan refleksi yang merujuk pilihan pertama anak. Contoh gaya: 'Aku lihat tadi kamu memilih ... ya, kenapa kamu memilih itu?'. Hanya ajukan satu pertanyaan.",
      { playerName, islandName: reflection.title }
    );
    setMessages([{ role: "nala", text: reply }]);
    setStep(1);
    setNalaThinking(false);
    speak(reply);
  }

  async function submitAnswer(forcedText?: string) {
    const text = (forcedText ?? draft).trim() || voice.transcript.trim();
    if (!text || nalaThinking) return;
    setDraft("");
    voice.stop();
    setMessages((m) => [...m, { role: "user", text }]);
    setNalaThinking(true);

    const isLast = step >= turns;
    const nextChoice = choices[step];

    const instruction = isLast
      ? `Anak menjawab: "${text}". Anak sudah selesai menjawab semua pertanyaan refleksi. Tanggapi jawaban terakhir dengan hangat (1-2 kalimat) dan tutup sesi dengan kalimat penyemangat.`
      : `Anak menjawab: "${text}". Tanggapi dengan hangat (1-2 kalimat), lalu ajukan SATU pertanyaan refleksi berikutnya yang merujuk pilihan anak: "${nextChoice?.chosen}". Hanya satu pertanyaan.`;

    const reply = await nala.send(instruction, {
      playerName,
      islandName: reflection.title,
    });

    if (isLast) {
      // Bubble penutup: gunakan pesan penyemangat yang jelas, bukan balasan AI
      // (yang saat mode tanpa kunci AI berupa fallback generik yang sama berulang).
      const closing = "Terima kasih sudah berefleksi ya! Kamu hebat! Sampai jumpa di petualangan berikutnya!";
      setMessages((m) => [...m, { role: "nala", text: closing }]);
      setFinished(true);
      speak(closing);
    } else {
      setMessages((m) => [...m, { role: "nala", text: reply }]);
      speak(reply);
    }
    setStep(step + 1);
    setNalaThinking(false);
  }

  // ===================== Live Demo: "Lanjutkan" (presenter-driven) =====================
  // Tekan "Lanjutkan" untuk mengisi jawaban tiap pertanyaan NALA otomatis lalu
  // berhenti di pertanyaan berikutnya — presenter bisa menjelaskan tiap bubble.
  // Jika refleksi belum dimulai, "Lanjutkan" akan memulainya lebih dulu.
  const submitRef = useRef(submitAnswer);
  useEffect(() => {
    submitRef.current = submitAnswer;
  });

  function demoLanjutkan() {
    if (!started) {
      begin();
    } else {
      submitRef.current("Aku suka belajar hal baru! Terima kasih sudah menemani, NALA.");
    }
  }

  return (
    <div className="flex h-[calc(100dvh-108px)] w-full flex-col overflow-hidden">
      {/* Live Demo: floating bar "Lanjutkan" — selalu terlihat, seperti di minigame */}
      {demo && (
        <div className="fixed left-1/2 top-2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#19D29F] bg-[#0F3943]/95 px-3 py-1.5 shadow-lg">
          <Zap size={13} className="text-[#19D29F]" />
          <span className="font-outfit text-[10px] font-bold uppercase tracking-wide text-white">
            Live Demo
          </span>
          <button
            type="button"
            onClick={demoLanjutkan}
            className="rounded-full bg-[#FFB319] px-3 py-1 font-outfit text-[10px] font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
          >
            Lanjutkan
          </button>
        </div>
      )}
      {/* Content */}
      <div className="flex min-h-0 flex-1 items-stretch justify-center overflow-hidden px-4 py-2 md:px-6">
        <div className="flex h-full w-full max-w-[1280px] flex-col items-center gap-5 lg:flex-row">
          {/* Journal Card */}
          <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-3xl border-2 border-[#FFB319] bg-[#FAF4EB] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.4)] md:p-5">
            <div className="flex h-2 w-full items-start justify-between opacity-60">
              {DIAMONDS.map((i) => (
                <div key={i} className="h-2 w-2 rotate-45 bg-[#FFB319]" />
              ))}
            </div>

            {/* Intro / Mulai */}
            {!started && (
              <div className="flex flex-col gap-2">
                <span className="font-outfit text-xs font-extrabold uppercase text-[#8a5a2b]">
                  NALA menulis di jurnalnya:
                </span>
                <div className="rounded-2xl bg-[#EFE8DD] px-5 py-4">
                  <p className="font-nunito text-base font-semibold leading-relaxed text-[#1f2d3a]">
                    {reflection.intro}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={begin}
                  className="mt-1 inline-flex items-center gap-2 self-start rounded-[32px] bg-[#FFB319] px-5 py-2 font-outfit font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
                >
                  <Flame size={16} /> Mulai
                </button>
              </div>
            )}

            {/* Percakapan (muncul 1 per 1) */}
            {started && (
              <>
                {/* Indikator progres: berapa pertanyaan & kapan bisa lanjut */}
                {!finished && (
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-[#EFE8DD] px-3 py-1.5">
                    <span className="font-outfit text-[10px] font-extrabold uppercase tracking-wide text-[#8a5a2b]">
                      Refleksi • Pertanyaan {Math.min(step, turns)} dari {turns}
                    </span>
                    <span className="font-nunito text-[10px] font-bold text-[#8a5a2b]">
                      {step >= turns
                        ? "✨ Pertanyaan terakhir!"
                        : `Sisa ${turns - step} pertanyaan lagi`}
                    </span>
                  </div>
                )}
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col gap-0.5 ${m.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <span
                      className={`font-outfit text-[10px] font-extrabold uppercase ${
                        m.role === "user" ? "text-[#8a5a2b]" : "text-[#19D29F]"
                      }`}
                    >
                      {m.role === "user" ? `${playerName || "Penjelajah"} menjawab:` : "NALA menulis di jurnalnya:"}
                    </span>
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-2 ${
                        m.role === "user"
                          ? "border border-[#FFB319]/50 bg-white"
                          : "bg-[#EFE8DD]"
                      }`}
                    >
                      <p className="font-nunito text-sm leading-snug text-[#1f2d3a]">{m.text}</p>
                    </div>
                  </motion.div>
                ))}

                {nalaThinking && (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-outfit text-[10px] font-extrabold uppercase text-[#19D29F]">
                      NALA menulis di jurnalnya:
                    </span>
                    <div className="rounded-2xl bg-[#EFE8DD] px-4 py-2 font-nunito text-xs italic text-[#8a5a2b]">
                      NALA sedang berpikir...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              </>
            )}

            {/* Input */}
            {started && !finished && (
              <div className="flex items-center gap-2 border-t border-[#FFB319]/30 pt-2">
                <button
                  type="button"
                  onClick={() => (voice.listening ? voice.stop() : voice.start((t) => setDraft(t)))}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    voice.listening ? "bg-[#E63946] text-white" : "bg-[#FFB319] text-[#0B1D23]"
                  }`}
                  title="Jawab dengan suara"
                >
                  {voice.listening ? <Square size={18} /> : <Mic size={18} />}
                </button>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                  placeholder={voice.listening ? "Mendengarkan..." : "Ketik atau bicara jawabanmu..."}
                  className="flex-1 rounded-xl border border-[#FFB319]/40 bg-white px-3 py-2 font-nunito text-sm text-[#1f2d3a] outline-none placeholder:text-[#8a8a8a]"
                />
                <button
                  type="button"
                  onClick={() => submitAnswer()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFB319] text-[#0B1D23] transition-transform hover:scale-105"
                >
                  <Send size={18} />
                </button>
              </div>
            )}

            {speaking && (
              <button type="button" onClick={stop} className="self-start text-[11px] text-[#8a5a2b]">
                ⏹ Hentikan suara
              </button>
            )}
          </div>

          {/* Illustration — ukuran tetap, tidak mengikuti tinggi percakapan */}
          <div className="h-[200px] w-full max-w-sm flex-shrink-0 self-center overflow-hidden rounded-2xl border-2 border-[#FFB319] lg:h-[400px] lg:w-[360px]">
            <SafeImage
              src={image}
              fallback={fallbackImage}
              alt={`Ilustrasi ${reflection.title}`}
              width={360}
              height={400}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <footer className="flex w-full flex-none flex-wrap items-center justify-between gap-2 border-t border-[#FFB319] bg-[#0F3943] px-4 py-2 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB319] text-[#0B1D23]">
            <Flame size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-sm font-extrabold leading-4 text-white">
              {reflection.title}
            </span>
            <span className="font-manrope text-[10px] text-[#19D29F]">Refleksi & Karakterisasi</span>
          </div>
        </div>

        <AnimatePresence>
          {finished ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="button"
              onClick={onFinish}
              className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-[#FFB319] px-7 py-3 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition-all hover:-translate-y-0.5 hover:bg-[#FFA000]"
            >
              Lanjutkan Perjalanan
              <Ship size={20} />
            </motion.button>
          ) : (
            <div className="hidden items-start rounded-[20px] border border-[#FFB319] bg-[#09242B] px-5 py-2.5 sm:flex">
              <span className="font-outfit text-sm font-bold text-[#FFB319]">
                NALA AI Kawan Petualang
              </span>
            </div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
