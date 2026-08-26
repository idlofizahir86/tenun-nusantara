"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  emoji?: string;
  image?: string; // path aset gambar (jika ada)
  alt: string;
  size?: number; // px, default 64
  className?: string;
  draggable?: boolean; // false agar gambar tidak menangkap event drag
}

// Menampilkan gambar aset mini-game; jika tidak ada / gagal dimuat,
// otomatis fallback ke emoji agar UI tetap tampil.
export function GameAsset({ emoji, image, alt, size = 64, className, draggable = true }: Props) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div
        className={`flex items-center justify-center ${className || ""}`}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: Math.round(size * 0.62) }}>{emoji || "🪨"}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className || ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={image}
        alt={alt}
        width={size}
        height={size}
        draggable={draggable}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
