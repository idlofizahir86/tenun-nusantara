"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isMuted, subscribeSound } from "@/lib/sound/sound-store";

// ============================================================
// Hook Text-to-Speech untuk suara NALA (anak perempuan ~10 th).
//
// Prioritas:
//  1) Edge TTS (gratis, natural) via API route /api/tts
//     -> suara id-ID-GadisNeural
//  2) Fallback ke Web Speech API (speechSynthesis) bila Edge gagal.
// ============================================================

function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const parts = clean.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) || [clean];
  return parts.map((p) => p.trim()).filter(Boolean);
}

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const wsSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!wsSupported) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [wsSupported]);

  // Pilih suara Web Speech (fallback): perempuan/anak kecil berbahasa Indonesia
  const pickIndonesianFemaleVoice = useCallback(() => {
    const all = voicesRef.current;
    if (all.length === 0) return null;

    const idVoices = all.filter((v) => v.lang.toLowerCase().startsWith("id"));
    const pool = idVoices.length > 0 ? idVoices : all;

    const childKeywords = ["kecil", "anak", "child", "kids", "girl", "damayanti", "gadis"];
    const femaleKeywords = [
      "female",
      "wanita",
      "perempuan",
      "girl",
      "woman",
      "damayanti",
      "sari",
      "putri",
      "puteri",
      "indah",
      "gadis",
      "kecil",
    ];

    const scored = pool.map((v) => {
      const name = v.name.toLowerCase();
      let score = idVoices.length > 0 ? 30 : 0;
      if (childKeywords.some((k) => name.includes(k))) score += 50;
      if (femaleKeywords.some((k) => name.includes(k))) score += 40;
      if (name.includes("google")) score += 5;
      if (name.includes("microsoft")) score += 3;
      if (name.includes("natural")) score += 10;
      return { v, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].v;
  }, []);

  // --- Mode Edge TTS (prioritas) ---
  const playEdge = useCallback(
    async (text: string) => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`tts http ${res.status}`);
      const blob = await res.blob();
      if (cancelRef.current) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      setSpeaking(true);
      await new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => resolve());
      });
      URL.revokeObjectURL(url);
      audioRef.current = null;
      setSpeaking(false);
    },
    []
  );

  // --- Mode Web Speech (fallback), dengan pembagian per kalimat ---
  const speakWebSpeech = useCallback(
    (text: string) => {
      const sentences = splitSentences(text);
      if (sentences.length === 0 || !wsSupported) return;

      const voice = pickIndonesianFemaleVoice();
      const queue = [...sentences];

      const speakNext = () => {
        if (cancelRef.current) return;
        const t = queue.shift();
        if (t === undefined) {
          setSpeaking(false);
          return;
        }
        const u = new SpeechSynthesisUtterance(t);
        u.lang = "id-ID";
        u.rate = 0.95;
        u.pitch = 1.9;
        if (voice) u.voice = voice;
        u.onstart = () => setSpeaking(true);
        u.onend = () => speakNext();
        u.onerror = () => speakNext();
        window.speechSynthesis.speak(u);
      };

      window.speechSynthesis.cancel();
      speakNext();
    },
    [wsSupported, pickIndonesianFemaleVoice]
  );

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (wsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [wsSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!text) return;
      if (isMuted()) return; // mode hening global: jangan keluarkan suara
      cancelRef.current = false;
      // hentikan yang sedang berjalan
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (wsSupported) window.speechSynthesis.cancel();

      // Coba Edge TTS dulu; kalau gagal, fallback Web Speech.
      playEdge(text).catch(() => speakWebSpeech(text));
    },
    [playEdge, speakWebSpeech, wsSupported]
  );

  // Jika suara di-mute di tengah bicara, hentikan segera.
  useEffect(() => {
    return subscribeSound(() => {
      if (isMuted()) {
        cancelRef.current = true;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if (wsSupported) window.speechSynthesis.cancel();
        setSpeaking(false);
      }
    });
  }, [wsSupported]);

  useEffect(() => {
    return () => {
      if (wsSupported) window.speechSynthesis.cancel();
    };
  }, [wsSupported]);

  return { speak, stop, speaking, supported: wsSupported };
}
