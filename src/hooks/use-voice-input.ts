"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Hook Voice Input memakai Web Speech API (SpeechRecognition)
// Fallback: jika tidak didukung, user tetap bisa mengetik manual.
export function useVoiceInput() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const supported =
    typeof window !== "undefined" &&
    (("webkitSpeechRecognition" in window) || ("SpeechRecognition" in window));

  const createRecognition = useCallback(() => {
    if (!supported) return null;
    const SR: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "id-ID";
    rec.interimResults = true;
    rec.continuous = false;
    return rec;
  }, [supported]);

  const start = useCallback(
    (onResult?: (text: string) => void) => {
      if (!supported) {
        setError("Voice input tidak didukung browser ini. Silakan ketik manual.");
        return;
      }
      const rec = recognitionRef.current || createRecognition();
      recognitionRef.current = rec;
      setError(null);
      setTranscript("");
      rec.onresult = (event: any) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
        onResult?.(text);
      };
      rec.onerror = (e: any) => setError(e?.error || "Error");
      rec.onend = () => setListening(false);
      try {
        rec.start();
        setListening(true);
      } catch {
        // sudah berjalan
      }
    },
    [supported, createRecognition]
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return { supported, listening, transcript, error, start, stop };
}
