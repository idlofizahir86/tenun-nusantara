"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, School, Users } from "lucide-react";
import { useClassRoster } from "@/hooks/use-class-roster";
import { traitEmoji, traitLabel } from "@/lib/scoring/engine";
import { EmptyState } from "@/components/teacher/empty-state";
import { PageLoading } from "@/components/ui/page-loading";

export default function DaftarSiswaPage() {
  const { code, label, students, loading } = useClassRoster();
  const [q, setQ] = useState("");

  if (loading) return <PageLoading label="Memuat daftar siswa…" />;

  if (!code || students.length === 0) {
    return (
      <EmptyState
        icon={School}
        title={label ? "Belum ada siswa terdaftar" : "Belum ada kelas aktif"}
        description="Siswa yang memasukkan kode kelas saat memilih karakter akan muncul di sini beserta karakter, kemajuan, dan bakatnya."
        action={{ label: "Kelola Kelas", href: "/dashboard/pengaturan" }}
      />
    );
  }

  const filtered = students.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => (b.lastActiveAt || "").localeCompare(a.lastActiveAt || ""));

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-outfit text-2xl font-extrabold text-white">
            Daftar Siswa <span className="text-[#FFB319]">{label}</span>
          </h1>
          <p className="font-manrope text-sm text-[#8DA2A6]">
            {students.length} siswa terdaftar di kelas ini. Klik siswa untuk melihat laporan lengkap.
          </p>
        </div>
        <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-[#FFB319]/40 bg-[#0F3943] px-3 sm:w-72">
          <Search size={16} className="text-[#8DA2A6]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama siswa…"
            className="w-full bg-transparent font-manrope text-sm text-white outline-none placeholder:text-[#5A7378]"
          />
        </div>
      </section>

      {/* Tabel */}
      <section className="overflow-hidden rounded-3xl border border-[#FFB319]/30 bg-[#0F3943]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-[#1B4450] font-manrope text-xs font-bold uppercase tracking-wider text-[#8DA2A6]">
                <th className="px-5 py-3">Siswa</th>
                <th className="px-5 py-3">Karakter</th>
                <th className="px-5 py-3">Kemajuan</th>
                <th className="px-5 py-3">Level</th>
                <th className="px-5 py-3">XP</th>
                <th className="px-5 py-3">Bakat</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr
                  key={s.gameCode}
                  className="border-b border-[#0F3943] transition hover:bg-[#144955]/50"
                >
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/siswa/${s.gameCode}`} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#144955] font-outfit text-sm font-extrabold text-[#FFB319]">
                        {s.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-manrope text-sm font-bold text-white hover:text-[#FFB319]">
                        {s.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-manrope text-sm capitalize text-[#E2ECEF]">
                    {s.characterId}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#09242B]">
                        <div
                          className="h-full rounded-full bg-[#FFB319]"
                          style={{ width: `${(s.islandsCompleted / 5) * 100}%` }}
                        />
                      </div>
                      <span className="font-manrope text-xs text-[#8DA2A6]">{s.islandsCompleted}/5</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-outfit text-sm font-extrabold text-[#19D29F]">
                    {s.level}
                  </td>
                  <td className="px-5 py-3 font-manrope text-sm text-[#E2ECEF]">{s.xp}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-[#144955] px-2.5 py-1 font-manrope text-[11px] font-bold text-[#FFB319]">
                      {s.topTrait ? `${traitEmoji(s.topTrait)} ${traitLabel(s.topTrait)}` : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Users size={28} className="text-[#8DA2A6]" />
            <p className="font-manrope text-sm text-[#8DA2A6]">Tidak ada siswa cocok dengan pencarian.</p>
          </div>
        )}
      </section>
    </div>
  );
}
