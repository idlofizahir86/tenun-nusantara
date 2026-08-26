"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  src: string; // path rencana (mungkin belum ada)
  fallback: string; // path yang pasti ada
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

// next/image dengan fallback: jika src (path rencana) gagal dimuat,
// otomatis ganti ke fallback agar tidak error/blank.
// Juga menyinkronkan saat `src` berubah (mis. ganti babak) agar gambar
// benar-benar berganti, bukan terkunci di gambar pertama.
export function SafeImage({ src, fallback, ...rest }: Props) {
  const [current, setCurrent] = useState(src);

  // ikuti perubahan prop src (per babak / per halaman)
  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={current}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
