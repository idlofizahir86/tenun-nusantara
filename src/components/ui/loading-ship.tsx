"use client";

interface LoadingShipProps {
  /** Tinggi dalam px. Lebar mengikuti rasio kapal (lebar ≈ 1.67 × tinggi). */
  size?: number;
  /** Label opsional yang tampil di bawah kapal. */
  label?: string;
  /** Kelas tambahan untuk container. */
  className?: string;
  /** Jika true, container diatur agar mengambil ruang kecil (untuk inline di bubble). */
  inline?: boolean;
}

// Animasi loading custom: kapal berlayar di atas ombak.
// Dipakai di semua tempat yang menunjukkan proses loading/berpikir.
export function LoadingShip({ size = 64, label, className = "", inline = false }: LoadingShipProps) {
  const width = Math.round(size * 1.67);

  return (
    <div
      className={`flex flex-col items-center gap-2 ${inline ? "w-fit" : "w-full"} ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg
        width={width}
        height={size}
        viewBox="0 0 160 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Matahari redup di belakang */}
        <circle cx="128" cy="20" r="11" fill="#FFB319" className="sail-spark" />

        {/* Ombak belakang (lebih transparan, gerak sebaliknya) */}
        <path
          className="sail-wave-b"
          d="M-40 74 q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L280 96 L-40 96 Z"
          fill="#1B5B68"
          opacity="0.7"
        />

        {/* Kapal: lambung + tiang + layar + bendera (mengapung di ombak) */}
        <g className="sail-bob">
          {/* Layar kiri (besar) */}
          <path
            className="sail-sway"
            d="M80 20 L30 58 L80 58 Z"
            fill="#F5EBDD"
          />
          {/* Layar kanan (lebih gelap) */}
          <path
            className="sail-sway"
            d="M80 20 L130 58 L80 58 Z"
            fill="#E3D3B5"
            style={{ animationDelay: "0.3s" }}
          />
          {/* Tiang */}
          <rect x="77" y="18" width="6" height="52" rx="2" fill="#5B3A1E" />
          {/* Bendera di puncak tiang */}
          <path d="M80 12 L96 16 L80 20 Z" fill="#FFB319" />
          {/* Lambung kapal */}
          <path
            d="M28 62 L132 62 L120 78 C107 86 53 86 40 78 Z"
            fill="#A9744F"
          />
          <path
            d="M28 62 L132 62 L126 68 C112 74 48 74 34 68 Z"
            fill="#C08B5E"
          />
        </g>

        {/* Ombak depan (menutup dasar lambung) */}
        <path
          className="sail-wave-a"
          d="M-40 80 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 L280 96 L-40 96 Z"
          fill="#17515D"
          opacity="0.9"
        />
      </svg>

      {label && (
        <span className="font-nunito text-xs font-medium text-[#8DA2A6]">{label}</span>
      )}
    </div>
  );
}
