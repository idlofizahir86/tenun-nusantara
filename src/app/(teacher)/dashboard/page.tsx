"use client";

import { Activity, School, Trophy, Users, Zap } from "lucide-react";
import { useClassRoster } from "@/hooks/use-class-roster";
import { traitEmoji, traitLabel } from "@/lib/scoring/engine";
import { StatCard } from "@/components/teacher/stat-card";
import { EmptyState } from "@/components/teacher/empty-state";
import { PageLoading } from "@/components/ui/page-loading";

function fmtTime(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

export default function RingkasanPage() {
  const { code, label, students, loading } = useClassRoster();

  if (loading) return <PageLoading label="Memuat ringkasan kelas…" />;

  if (!code || students.length === 0) {
    return (
      <EmptyState
        icon={School}
        title={label ? "Belum ada siswa di kelas ini" : "Belum ada kelas aktif"}
        description={
          label
            ? `Bagikan kode kelas ${code} kepada siswa. Mereka memasukkannya saat memilih karakter, lalu data mereka muncul di sini.`
            : "Buat kelas di Pengaturan Kelas lalu bagikan kodenya ke siswa agar data mereka terintegrasi."
        }
        action={{ label: "Kelola Kelas", href: "/dashboard/pengaturan" }}
      />
    );
  }

  const totalIslands = students.reduce((a, s) => a + s.islandsCompleted, 0);
  const avgXp = Math.round(students.reduce((a, s) => a + s.xp, 0) / students.length);
  const avgLevel = (students.reduce((a, s) => a + s.level, 0) / students.length).toFixed(1);
  const traitCount: Record<string, number> = {};
  for (const s of students) traitCount[s.topTrait] = (traitCount[s.topTrait] || 0) + 1;
  const topTrait = Object.entries(traitCount).sort((a, b) => b[1] - a[1])[0]?.[0];
  const recent = [...students].sort((a, b) => (b.lastActiveAt || "").localeCompare(a.lastActiveAt || "")).slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      {/* Header kelas */}
      <section className="flex flex-col gap-2">
        <h1 className="font-outfit text-2xl font-extrabold text-white">
          Ringkasan Kelas <span className="text-[#FFB319]">{label}</span>
        </h1>
        <p className="font-manrope text-sm text-[#8DA2A6]">
          Kode kelas: <span className="rounded bg-[#144955] px-2 py-0.5 font-bold text-[#19D29F]">{code}</span> —
          bagikan kode ini agar siswa dapat bergabung.
        </p>
      </section>

      {/* Kartu statistik */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Jumlah Siswa" value={students.length} hint="terdaftar" icon={Users} />
        <StatCard label="Pulau Selesai" value={totalIslands} hint="total lintas siswa" icon={Trophy} accent="#19D29F" />
        <StatCard label="Rata-rata XP" value={avgXp} hint="per siswa" icon={Zap} accent="#8DA2A6" />
        <StatCard label="Rata-rata Level" value={avgLevel} hint="kemajuan" icon={Activity} accent="#19D29F" />
        <StatCard
          label="Bakat Dominan"
          value={topTrait ? `${traitEmoji(topTrait)} ${traitLabel(topTrait)}` : "—"}
          hint="paling banyak muncul"
          icon={Trophy}
          accent="#FFB319"
        />
      </section>

      {/* Aktivitas terbaru */}
      <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-outfit text-lg font-extrabold text-white">Aktivitas Terbaru</h2>
          <span className="font-manrope text-xs text-[#8DA2A6]">{students.length} siswa</span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {recent.map((s) => (
            <div key={s.gameCode} className="flex items-center justify-between gap-3 rounded-xl bg-[#09242B] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#144955] font-outfit text-sm font-extrabold text-[#FFB319]">
                  {s.name.charAt(0).toUpperCase()}
                </span>
                <div className="flex flex-col">
                  <span className="font-manrope text-sm font-bold text-white">{s.name}</span>
                  <span className="font-manrope text-xs text-[#8DA2A6]">
                    {s.islandsCompleted}/5 pulau • Lv. {s.level}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden font-manrope text-[11px] text-[#5A7378] sm:block">
                  {fmtTime(s.lastActiveAt)}
                </span>
                <span className="rounded-full bg-[#144955] px-2.5 py-1 font-manrope text-[11px] font-bold text-[#FFB319]">
                  {s.topTrait ? `${traitEmoji(s.topTrait)} ${traitLabel(s.topTrait)}` : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
