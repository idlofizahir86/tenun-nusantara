"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: string; // hex untuk ikon/aksen, default emas
}

// Kartu statistik ringkas untuk Ringkasan Kelas.
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "#FFB319",
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-5">
      <div className="flex items-center justify-between">
        <span className="font-manrope text-xs font-bold uppercase tracking-wider text-[#8DA2A6]">
          {label}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <Icon size={18} />
        </span>
      </div>
      <div className="font-outfit text-3xl font-extrabold text-white">{value}</div>
      {hint && <p className="font-manrope text-xs text-[#8DA2A6]">{hint}</p>}
    </div>
  );
}
