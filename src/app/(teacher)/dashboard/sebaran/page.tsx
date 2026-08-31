"use client";

import { BarChart3, School } from "lucide-react";
import { useClassRoster } from "@/hooks/use-class-roster";
import { traitEmoji, traitLabel } from "@/lib/scoring/engine";
import { TraitBarChart, type TraitBarDatum } from "@/components/teacher/trait-bar-chart";
import { EmptyState } from "@/components/teacher/empty-state";
import { PageLoading } from "@/components/ui/page-loading";

export default function SebaranPage() {
  const { code, label, students, loading } = useClassRoster();

  if (loading) return <PageLoading label="Memuat sebaran karakter…" />;

  if (!code || students.length === 0) {
    return (
      <EmptyState
        icon={School}
        title={label ? "Belum ada data siswa" : "Belum ada kelas aktif"}
        description="Pilih atau buat kelas, lalu bagikan kodenya kepada siswa. Grafik sebaran karakter muncul setelah siswa mulai bermain."
        action={{ label: "Kelola Kelas", href: "/dashboard/pengaturan" }}
      />
    );
  }

  // Jumlah siswa per bakat dominan (8 dimensi).
  const dims = [
    "linguistik", "logika", "visual", "kinestetik",
    "musikal", "sosial", "intrapersonal", "naturalis",
  ];
  const traitCount: Record<string, number> = {};
  for (const s of students) traitCount[s.topTrait] = (traitCount[s.topTrait] || 0) + 1;

  const distribution: TraitBarDatum[] = dims.map((k) => ({
    key: k,
    label: traitLabel(k),
    emoji: traitEmoji(k),
    value: traitCount[k] || 0,
  }));

  // Skor rata-rata tiap dimensi (untuk gambaran kekuatan kelas).
  const avgScores: TraitBarDatum[] = dims.map((k) => ({
    key: k,
    label: traitLabel(k),
    emoji: traitEmoji(k),
    value: Math.round(
      students.reduce((a, s) => a + (s.traits.find((t) => t.key === k)?.score || 0), 0) /
        students.length
    ),
  }));

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="font-outfit text-2xl font-extrabold text-white">
          Sebaran Karakter <span className="text-[#FFB319]">{label}</span>
        </h1>
        <p className="font-manrope text-sm text-[#8DA2A6]">
          Distribusi bakat dominan dan kekuatan rata-rata kelas dari {students.length} siswa.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-[#FFB319]" />
            <h2 className="font-outfit text-lg font-extrabold text-white">Jumlah Siswa per Bakat Dominan</h2>
          </div>
          <TraitBarChart data={distribution} />
        </div>

        <div className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-[#19D29F]" />
            <h2 className="font-outfit text-lg font-extrabold text-white">Rata-rata Skor Dimensi Bakat</h2>
          </div>
          <TraitBarChart data={avgScores} />
        </div>
      </section>

      {/* Ringkasan per dimensi */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {distribution.map((d) => (
          <div key={d.key} className="rounded-2xl bg-[#0F3943] p-4">
            <div className="flex items-center gap-2 font-manrope text-sm font-bold text-white">
              <span className="text-base">{d.emoji}</span> {d.label}
            </div>
            <div className="mt-1 font-outfit text-2xl font-extrabold text-[#FFB319]">{d.value}</div>
            <div className="font-manrope text-xs text-[#8DA2A6]">
              {students.length ? Math.round((d.value / students.length) * 100) : 0}% siswa
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
