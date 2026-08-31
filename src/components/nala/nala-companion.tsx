"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Send, X, Volume2 } from "lucide-react";
import { useNala } from "@/hooks/use-nala";
import { useTTS } from "@/hooks/use-tts";
import { useMinVisible } from "@/hooks/use-ship-loading";
import { LoadingShip } from "@/components/ui/loading-ship";

const NALA_AVATAR = "/assets/images/characters/npcs/char_siti.png";

// NALA kecil yang menemani di semua halaman, kecuali halaman game (/island/) yang
// sudah punya NALA di panel hint, dan refleksi yang berkomunikasi langsung.
export function NalaCompanion() {
  const pathname = usePathname();
  const { messages, loading, send } = useNala();
  const thinking = useMinVisible(loading); // tahan indikator minimal ~1.2 detik
  const { speak } = useTTS();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const hidden = pathname.startsWith("/island/");

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) speak("Halo! Ada yang bisa kita bicarakan?");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (hidden) return null;

  function handleSend() {
    const text = draft.trim();
    if (!text || loading) return;
    setDraft("");
    send(text).then((reply) => {
      if (reply) speak(reply);
    });
  }

  return (
    <div className="fixed bottom-24 right-5 z-[70] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex h-[420px] w-[320px] flex-col overflow-hidden rounded-3xl border-2 border-[#FFB319] bg-[#0F3943] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#FFB319]/30 bg-[#09242B] px-4 py-3">
              <div className="flex items-center gap-2">
                <Image src={NALA_AVATAR} alt="NALA" width={32} height={32} className="h-8 w-8 rounded-full border border-[#FFB319]" />
                <span className="font-outfit text-sm font-bold text-white">NALA</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-[#FFB319]">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#09242B] to-[#060F14] p-3">
              {messages.length === 0 && (
                <p className="rounded-2xl bg-[#0F3943] p-3 font-nunito text-sm text-white/90">
                  Hai! Aku NALA 🎈 Aku siap jadi kawan bicara dan membantu petualanganmu!
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 font-nunito text-sm ${
                      m.role === "user"
                        ? "bg-[#FFB319] text-[#0B1D23]"
                        : "bg-[#0F3943] text-white"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="mb-2 flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-[#0F3943] px-3 py-2">
                    <LoadingShip size={24} inline />
                    <span className="font-nunito text-xs text-white/70">NALA sedang berpikir…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-[#FFB319]/30 bg-[#09242B] p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tanya NALA..."
                className="flex-1 rounded-xl bg-[#0F3943] px-3 py-2 font-nunito text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={handleSend}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB319] text-[#0B1D23]"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FFB319] bg-[#0F3943] text-[#FFB319] shadow-xl transition-transform hover:scale-110"
        aria-label="Bicara dengan NALA"
      >
        {open ? <Volume2 size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
