"use client";

import Image from "next/image";
import { traitEmoji, traitLabel } from "@/lib/scoring/engine";
import { CAREERS, ISLAND_BLURB, NEXT_STEPS } from "@/lib/report/guidance";
import type { TeacherStudent } from "@/lib/teacher/class-data";
import { TalentRadar } from "./talent-radar";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

// Tampilan detail satu siswa: profil, statistik, radar bakat, karir, & narasi.
export function StudentDetail({ student }: { student: TeacherStudent }) {
  const top3 = [...student.traits].sort((a, b) => b.score - a.score).slice(0, 3);
  const careers = top3.map((t) => CAREERS[t.key]).filter(Boolean);
  const steps = NEXT_STEPS[student.topTrait] || NEXT_STEPS.logika;
  const doneIslands = student.completedIslands.filter((id) => ISLAND_BLURB[id]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header profil */}
      <section className="flex flex-col items-start gap-5 rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6 sm:flex-row sm:items-center">
        <Image
          src={AVATARS[student.characterId] ?? AVATARS.siti}
          alt={student.name}
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-full border-2 border-[#FFB319] object-cover"
        />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-outfit text-2xl font-extrabold text-white">{student.name}</h1>
            <span className="rounded-full bg-[#09242B] px-3 py-1 font-manrope text-[11px] font-bold text-[#19D29F]">
              Lv. {student.level}
            </span>
          </div>
          <p className="font-manrope text-sm text-[#8DA2A6]">
            {student.motif || "Sash Tenun"} • Gabung {fmtDate(student.startedAt)} • Terakhir aktif{" "}
            {fmtDate(student.lastActiveAt)}
          </p>
          <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#144955] px-3 py-1 font-outfit text-xs font-bold text-[#FFB319]">
            {traitEmoji(student.topTrait)} Bakat dominan: {traitLabel(student.topTrait)}
          </span>
        </div>
        <span className="font-manrope text-[11px] text-[#5A7378]">{student.gameCode}</span>
      </section>

      {/* Statistik ringkas */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "XP", value: student.xp },
          { label: "Pulau Selesai", value: `${student.islandsCompleted}/5` },
          { label: "Aktivitas Selesai", value: student.totalActsCompleted },
          { label: "Asesmen Bakat", value: student.assessmentCount },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-[#0F3943] p-4">
            <div className="font-outfit text-2xl font-extrabold text-[#FFB319]">{s.value}</div>
            <div className="font-manrope text-xs font-bold uppercase tracking-wider text-[#8DA2A6]">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Radar */}
        <section className="flex flex-col items-center gap-4 rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
          <h2 className="self-start font-outfit text-lg font-extrabold text-white">Peta Bakat</h2>
          <TalentRadar traits={student.traits} />
          <div className="grid w-full grid-cols-2 gap-2">
            {top3.map((t, i) => (
              <div key={t.key} className="flex items-center justify-between rounded-xl bg-[#09242B] px-3 py-2">
                <span className="font-manrope text-xs text-[#E2ECEF]">
                  {i + 1}. {t.emoji} {t.label}
                </span>
                <span className="font-outfit text-sm font-extrabold text-[#FFB319]">{t.score}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Rekomendasi karir */}
        <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
          <h2 className="font-outfit text-lg font-extrabold text-white">Rekomendasi Karir (Tren 2030)</h2>
          <div className="mt-4 flex flex-col gap-3">
            {careers.map((c, i) => (
              <div key={i} className="rounded-2xl border border-[#FFB319]/40 bg-[#09242B] p-4">
                <h3 className="font-outfit text-sm font-extrabold text-white">{c.title}</h3>
                <span className="mt-1 inline-block rounded bg-[#144955] px-2 py-0.5 font-manrope text-[10px] text-[#FFB319]">
                  Koneksi: {c.tag}
                </span>
                <p className="mt-2 font-manrope text-xs leading-relaxed text-[#E2ECEF]">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Narasi pulau */}
      <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
        <h2 className="font-outfit text-lg font-extrabold text-white">Catatan Pengamatan Pulau</h2>
        {doneIslands.length === 0 ? (
          <p className="mt-3 font-manrope text-sm text-[#8DA2A6]">
            Belum ada pulau yang diselesaikan. Ajak siswa menjelajahi pulau untuk mengungkap bakatnya.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {doneIslands.map((id) => (
              <div key={id} className="rounded-2xl bg-[#09242B] p-4">
                <h3 className="font-outfit text-sm font-bold text-[#FFB319]">{ISLAND_BLURB[id].name}</h3>
                <p className="mt-1.5 font-manrope text-xs leading-relaxed text-[#E2ECEF]">
                  {ISLAND_BLURB[id].desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Langkah stimulasi */}
      <section className="rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6">
        <h2 className="font-outfit text-lg font-extrabold text-[#FFB319]">Langkah Stimulasi untuk Siswa</h2>
        <div className="mt-4 flex flex-col gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#FFB319] font-outfit text-xs font-extrabold text-[#0B1D23]">
                {i + 1}
              </div>
              <p className="font-manrope text-sm leading-relaxed text-[#E2ECEF]">{s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
