"use client";

import { useState } from "react";
import { ChevronDown, GraduationCap, School } from "lucide-react";
import { useClassRoster } from "@/hooks/use-class-roster";
import { StudentDetail } from "@/components/teacher/student-detail";
import { EmptyState } from "@/components/teacher/empty-state";
import { PageLoading } from "@/components/ui/page-loading";

export default function LaporanPage() {
  const { code, label, students, loading } = useClassRoster();
  const [selected, setSelected] = useState<string>("");

  if (loading) return <PageLoading label="Memuat laporan akademik…" />;

  if (!code || students.length === 0) {
    return (
      <EmptyState
        icon={School}
        title={label ? "Belum ada laporan" : "Belum ada kelas aktif"}
        description="Pilih siswa dari kelas untuk melihat peta bakat, rekomendasi karir, dan langkah stimulasi akademik."
        action={{ label: "Kelola Kelas", href: "/dashboard/pengaturan" }}
      />
    );
  }

  const active = students.find((s) => s.gameCode === selected) || null;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-outfit text-2xl font-extrabold text-white">
            Laporan Akademik <span className="text-[#FFB319]">{label}</span>
          </h1>
          <p className="font-manrope text-sm text-[#8DA2A6]">
            Analisis bakat majemuk, rekomendasi karir masa depan, dan langkah stimulasi per siswa.
          </p>
        </div>

        {/* Pemilih siswa */}
        <div className="relative w-full sm:w-72">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#FFB319]/40 bg-[#0F3943] px-4 pr-10 font-manrope text-sm font-bold text-white outline-none focus:border-[#FFB319]"
          >
            <option value="">Pilih siswa…</option>
            {students.map((s) => (
              <option key={s.gameCode} value={s.gameCode}>
                {s.name} ({s.characterId})
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8DA2A6]"
          />
        </div>
      </section>

      {active ? (
        <StudentDetail student={active} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[#FFB319]/40 bg-[#0F3943]/50 px-6 py-16 text-center">
          <GraduationCap size={30} className="text-[#FFB319]" />
          <p className="max-w-md font-manrope text-sm text-[#8DA2A6]">
            Pilih salah satu siswa untuk melihat laporan akademik lengkap: peta bakat 8 dimensi, rekomendasi
            karir tren 2030, serta langkah stimulasi yang sesuai.
          </p>
        </div>
      )}
    </div>
  );
}
