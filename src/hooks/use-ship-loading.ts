"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Durasi minimum indikator loading agar tetap terlihat (tidak kedip hilang).
export const MIN_LOADING_MS = 1200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Bungkus aksi async (login, simpan, kirim, navigasi, dll):
// - menahan invokasi berulang selama proses berjalan (cegah klik berulang),
// - isBusy bertahan minimal MIN_LOADING_MS agar animasi kapal terlihat jelas.
// Untuk navigasi, task cukup MENGEMBALIKAN tujuan (string/object), lalu panggil
// router.push setelah run() selesai — sehingga kapal sempat tampil ~1.2 detik.
export function useShipLoading(minMs: number = MIN_LOADING_MS) {
  const [isBusy, setIsBusy] = useState(false);
  const busyRef = useRef(false);

  const run = useCallback(
    async <T,>(task: () => Promise<T> | T): Promise<T | undefined> => {
      if (busyRef.current) return undefined; // sudah berjalan, abaikan klik berikutnya
      busyRef.current = true;
      setIsBusy(true);
      const started = Date.now();
      try {
        const result = await task();
        const elapsed = Date.now() - started;
        const remaining = minMs - elapsed;
        if (remaining > 0) await sleep(remaining);
        return result;
      } finally {
        busyRef.current = false;
        setIsBusy(false);
      }
    },
    [minMs]
  );

  return { isBusy, run };
}

// Tahan sebuah sinyal boolean agar tetap "true" minimal minMs setelah aktif.
// Berguna untuk indikator yang berasal dari loading eksternal (mis. useNala,
// fetch) yang selesai terlalu cepat sehingga animasi tidak sempat terlihat.
export function useMinVisible(active: boolean, minMs: number = MIN_LOADING_MS) {
  const [visible, setVisible] = useState(active);
  const shownAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      shownAt.current = Date.now();
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    const elapsed = Date.now() - shownAt.current;
    const remaining = minMs - elapsed;
    if (remaining <= 0) {
      setVisible(false);
    } else {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), remaining);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, minMs]);

  return visible;
}
